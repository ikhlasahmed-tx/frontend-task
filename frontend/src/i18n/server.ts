import { createInstance } from "i18next";
import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { defaultLocale, hasLocale, localePath, locales } from "./config";
import en from "./dictionaries/en.json";
import ru from "./dictionaries/ru.json";

export const dictionaries = { en, ru };

// One i18next instance for the server, holding both languages. React already escapes text, so i18next must not.
// Exported only for <Trans> (sentences with links or line breaks inside), which needs it as the `i18n` prop
// next to `t={await getT()}`; the `t` decides the language, not this instance.
export const i18n = createInstance();
const ready = i18n.init({
  resources: { en: { translation: en }, ru: { translation: ru } },
  lng: defaultLocale,
  fallbackLng: defaultLocale,
  supportedLngs: locales,
  interpolation: { escapeValue: false },
});

// For Server Components: `const t = await getT()`, then `t("login.title")`.
// The language comes from the URL (/en/..., /ru/...). Client Components use useTranslation() instead.
export async function getT() {
  const locale = await lang();
  if (!hasLocale(locale)) notFound();
  await ready;
  return i18n.getFixedT(locale);
}

// For Server Components: `const path = await getLocalePath()`, then `path("/login")` → "/ru/login".
export async function getLocalePath() {
  const locale = await lang();
  return (path: string) => localePath(locale, path);
}
