import { expect, test } from "vitest";
import { countries, getCountries } from "@/lib/countries";

test("English keeps the existing list unchanged", () => {
  expect(getCountries("en")).toBe(countries);
});

test("Russian has the same countries, with Russian names, in Russian alphabetical order", () => {
  const ru = getCountries("ru");
  expect(ru.map((c) => c.code).sort()).toEqual(countries.map((c) => c.code).sort());
  expect(ru.find((c) => c.code === "PK")?.name).toBe("Пакистан");
  expect(ru.find((c) => c.code === "GB")?.name).toBe("Великобритания");

  const names = ru.map((c) => c.name);
  expect(names).toEqual([...names].sort(new Intl.Collator("ru").compare));
  expect(names[0].startsWith("А")).toBe(true); // Cyrillic order, not the English one
});
