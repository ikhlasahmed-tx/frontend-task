"use client";

import { createInstance } from "i18next";
import { useState, type ReactNode } from "react";
import { I18nextProvider, initReactI18next } from "react-i18next";
import type { Locale } from "./config";
import type en from "./dictionaries/en.json";

// Gives Client Components useTranslation(). The layout passes only the current language's dictionary,
// so the browser never downloads the other one.
export function I18nProvider({
  locale,
  dictionary,
  children,
}: {
  locale: Locale;
  dictionary: typeof en;
  children: ReactNode;
}) {
  // Created once per mount; the layout remounts this (key={locale}) when the language changes.
  const [i18n] = useState(() => {
    const instance = createInstance();
    instance.use(initReactI18next).init({
      resources: { [locale]: { translation: dictionary } },
      lng: locale,
      interpolation: { escapeValue: false }, // React already escapes text
      initAsync: false, // ready at once, so the first render (on the server too) has the text
      react: { useSuspense: false },
    });
    return instance;
  });

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
