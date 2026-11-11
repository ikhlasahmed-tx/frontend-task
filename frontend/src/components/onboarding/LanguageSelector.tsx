"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { defaultLocale, hasLocale, LOCALE_COOKIE, localeNames, localePath, locales, stripLocale } from "@/i18n/config";

// Shows the current language; a native <select> lies invisibly on top, so keyboard, screen readers
// and the phone's own picker work without extra code.
export function LanguageSelector() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const current = hasLocale(i18n.language) ? i18n.language : defaultLocale;

  function change(locale: string) {
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    // The same page in the other language: /en/signup → /ru/signup.
    router.push(localePath(locale, stripLocale(pathname)) + window.location.search);
  }

  return (
    <div className="relative flex items-center gap-2 rounded text-caption text-white transition-opacity hover:opacity-80 has-[select:focus-visible]:outline-2 has-[select:focus-visible]:outline-offset-2 has-[select:focus-visible]:outline-primary">
      <span className="flex items-center gap-1.5">
        <Image src="/assets/onboarding/icon-globe.svg" alt="" width={18} height={18} className="size-[18px]" />
        {localeNames[current]}
      </span>
      <Image src="/assets/onboarding/icon-chevron-down.svg" alt="" width={10} height={10} className="size-2.5" />
      <select
        aria-label={t("language.label")}
        value={current}
        onChange={(event) => change(event.target.value)}
        className="absolute inset-0 cursor-pointer opacity-0"
      >
        {locales.map((locale) => (
          <option key={locale} value={locale} lang={locale}>
            {localeNames[locale]}
          </option>
        ))}
      </select>
    </div>
  );
}
