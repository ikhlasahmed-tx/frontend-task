import { expect, test } from "vitest";
import en from "@/i18n/dictionaries/en.json";
import ru from "@/i18n/dictionaries/ru.json";

// "login.title", "login.submit", … for every text in a dictionary.
function keys(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null) return [prefix];
  return Object.entries(value).flatMap(([key, child]) => keys(child, prefix ? `${prefix}.${key}` : key));
}

test("English and Russian have exactly the same keys", () => {
  expect(keys(ru).sort()).toEqual(keys(en).sort());
});

test("tags around words in a text aren't HTML void element names, whose content <Trans> would drop", () => {
  const voidTags = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];
  // Opening tags like <login>; a self-closing <br/> doesn't match.
  const opening = [...(JSON.stringify(en) + JSON.stringify(ru)).matchAll(/<([a-zA-Z]+)>/g)].map((match) => match[1]);
  expect(opening.filter((tag) => voidTags.includes(tag.toLowerCase()))).toEqual([]);
});

test("every Russian text keeps the English text's {{values}} and tags", () => {
  const text = (dict: unknown, key: string) => String(key.split(".").reduce<unknown>((v, k) => (v as Record<string, unknown>)[k], dict));
  const parts = (s: string) => [...s.matchAll(/\{\{\s*\w+\s*\}\}|<\/?\w+\/?>/g)].map((m) => m[0].replace(/\s/g, "")).sort();
  const different = keys(en).filter((key) => parts(text(en, key)).join() !== parts(text(ru, key)).join());
  expect(different).toEqual([]);
});

test("no text is left empty", () => {
  const empty = (dict: unknown) => keys(dict).filter((key) => !key.split(".").reduce<unknown>((v, k) => (v as Record<string, unknown>)[k], dict));
  expect([...empty(en), ...empty(ru)]).toEqual([]);
});
