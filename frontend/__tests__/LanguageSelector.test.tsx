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
  expect(screen.getByText("Русский (RU)", { selector: "span" })).toBeTruthy(); // the visible label, not the <option>
  expect((screen.getByLabelText("Язык") as HTMLSelectElement).value).toBe("ru");
});

test("picking another language opens the same page in it and remembers the choice", () => {
  nav.pathname = "/en/signup";
  render(
    <I18nProvider locale="en" dictionary={en}>
      <LanguageSelector />
    </I18nProvider>,
  );
  fireEvent.change(screen.getByLabelText("Language"), { target: { value: "ru" } });

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
  fireEvent.change(screen.getByLabelText("Язык"), { target: { value: "en" } });

  expect(nav.push).toHaveBeenCalledWith("/en");
});
