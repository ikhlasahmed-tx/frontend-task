"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { defaultLocale, hasLocale, LOCALE_COOKIE, localeNames, localePath, locales, stripLocale } from "@/i18n/config";

function rememberLocale(locale: string) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}

// Where the list opens relative to the button: under it (onboarding header), right-aligned (Home top bar),
// under the right end of a full-width Settings row (inset by the row's 16px padding on phones).
const placements = {
  below: "top-full left-1/2 mt-3 -translate-x-1/2",
  "below-end": "top-full right-0 mt-3",
  row: "top-full right-4 -mt-2 lg:right-0",
};

type LanguageSelectorProps = {
  placement?: keyof typeof placements;
  // Settings passes its own row as the button; without these it is the small globe + name button.
  className?: string;
  children?: ReactNode;
};

// Custom listbox in the same pattern as CountrySelect (Figma dropdown: dark panel, 0.5px border, teal selected item).
export function LanguageSelector({ placement = "below", className, children }: LanguageSelectorProps) {
  const id = useId();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const current = hasLocale(i18n.language) ? i18n.language : defaultLocale;
  const label = t("language.label");

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  function openList() {
    setActiveIndex(locales.indexOf(current));
    setOpen(true);
  }

  function close() {
    setOpen(false);
    buttonRef.current?.focus();
  }

  function choose(locale: string) {
    close();
    if (locale === current) return;
    rememberLocale(locale);
    // The same page in the other language: /en/signup → /ru/signup.
    router.push(localePath(locale, stripLocale(pathname)) + window.location.search);
  }

  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  const last = locales.length - 1;
  function handleListKeyDown(event: KeyboardEvent) {
    if (event.key === "ArrowDown") setActiveIndex((i) => Math.min(i + 1, last));
    else if (event.key === "ArrowUp") setActiveIndex((i) => Math.max(i - 1, 0));
    else if (event.key === "Home") setActiveIndex(0);
    else if (event.key === "End") setActiveIndex(last);
    else if (event.key === "Enter" || event.key === " ") choose(locales[activeIndex]);
    else if (event.key === "Escape") close();
    else if (event.key === "Tab") setOpen(false);
    else return;
    if (event.key !== "Tab") event.preventDefault();
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-label={`${label}: ${localeNames[current]}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            openList();
          }
        }}
        // before: widens the tap area to ~44px tall without changing the 18px row
        className={
          className ??
          "relative flex items-center gap-2 rounded text-caption text-white transition-opacity before:absolute before:-inset-x-2 before:-inset-y-3 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        }
      >
        {children ?? (
          <>
            <span className="flex items-center gap-1.5">
              <Image src="/assets/onboarding/icon-globe.svg" alt="" width={18} height={18} className="size-[18px]" />
              {localeNames[current]}
            </span>
            <Image src="/assets/onboarding/icon-chevron-down.svg" alt="" width={10} height={10} className="size-2.5" />
          </>
        )}
      </button>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          aria-label={label}
          tabIndex={-1}
          aria-activedescendant={`${id}-${activeIndex}`}
          onKeyDown={handleListKeyDown}
          className={`absolute z-20 w-max min-w-full rounded-xl ${placements[placement]} border-[0.5px] border-neutral-400 bg-neutral-500 py-1 outline-none`}
        >
          {locales.map((locale, index) => (
            <li
              key={locale}
              id={`${id}-${index}`}
              role="option"
              lang={locale}
              aria-selected={locale === current}
              onClick={() => choose(locale)}
              onMouseEnter={() => setActiveIndex(index)}
              className={`flex h-10 cursor-pointer items-center px-4 text-p2 ${index === activeIndex ? "bg-neutral-400" : ""} ${
                locale === current ? "font-medium text-primary" : "text-white"
              }`}
            >
              {localeNames[locale]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
