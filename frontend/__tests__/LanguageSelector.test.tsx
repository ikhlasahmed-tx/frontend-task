import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { LanguageSelector } from "@/components/onboarding/LanguageSelector";
import en from "@/i18n/dictionaries/en.json";
import ru from "@/i18n/dictionaries/ru.json";
import { I18nProvider } from "@/i18n/I18nProvider";

const nav = vi.hoisted(() => ({ pathname: "/en/signup", push: vi.fn() }));
vi.mock("next/navigation", () => ({
  usePathname: () => nav.pathname,
  useRouter: () => ({ push: nav.push }),
}));

afterEach(() => {
  cleanup();
  nav.push.mockReset();
  document.cookie = "lang=; max-age=0; path=/";
});

test("shows the current language", () => {
  render(
    <I18nProvider locale="ru" dictionary={ru}>
      <LanguageSelector />
    </I18nProvider>,
  );
  expect(screen.getByRole("button", { name: "Язык: Русский (RU)" })).toBeTruthy();
});

test("picking another language opens the same page in it and remembers the choice", () => {
  nav.pathname = "/en/signup";
  render(
    <I18nProvider locale="en" dictionary={en}>
      <LanguageSelector />
    </I18nProvider>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Language: English (EN)" }));
  fireEvent.click(screen.getByRole("option", { name: "Русский (RU)" }));

  expect(nav.push).toHaveBeenCalledWith("/ru/signup");
  expect(document.cookie).toContain("lang=ru");
});

test("on Home the URL is just the language", () => {
  nav.pathname = "/ru";
  render(
    <I18nProvider locale="ru" dictionary={ru}>
      <LanguageSelector />
    </I18nProvider>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Язык: Русский (RU)" }));
  fireEvent.click(screen.getByRole("option", { name: "English (EN)" }));

  expect(nav.push).toHaveBeenCalledWith("/en");
});

test("keyboard: arrow opens the list, Enter picks, Escape closes back to the button", () => {
  nav.pathname = "/en/login";
  render(
    <I18nProvider locale="en" dictionary={en}>
      <LanguageSelector />
    </I18nProvider>,
  );
  const button = screen.getByRole("button", { name: "Language: English (EN)" });
  fireEvent.keyDown(button, { key: "ArrowDown" });
  fireEvent.keyDown(screen.getByRole("listbox"), { key: "Escape" });
  expect(screen.queryByRole("listbox")).toBeNull();
  expect(document.activeElement).toBe(button);

  fireEvent.keyDown(button, { key: "ArrowDown" });
  const list = screen.getByRole("listbox");
  fireEvent.keyDown(list, { key: "ArrowDown" });
  fireEvent.keyDown(list, { key: "Enter" });
  expect(nav.push).toHaveBeenCalledWith("/ru/login");
});
