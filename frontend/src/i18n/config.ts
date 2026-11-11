// The languages the app supports. The language is the first part of every URL: /en/login, /ru/login.
export const locales = ["en", "ru"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

// Remembers the last language used, so a URL without one (e.g. /login) keeps it.
export const LOCALE_COOKIE = "lang";

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

// "/ru/login" → "/login", "/ru" → "/". Paths without a language are returned unchanged.
export function stripLocale(pathname: string) {
  const [, first = "", ...rest] = pathname.split("/");
  return hasLocale(first) ? `/${rest.join("/")}` : pathname;
}
