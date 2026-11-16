"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { stripLocale } from "@/i18n/config";
import { useLocalePath } from "@/i18n/useLocalePath";

// Phones: the Settings list (Figma 6:710), replaced by the section once one is open.
// lg and up: the 250px sub-menu beside the open section (Figma 6:550). Only General exists so far.
export function SettingsNav() {
  const pathname = stripLocale(usePathname());
  const path = useLocalePath();
  const { t } = useTranslation();
  const sectionOpen = pathname !== "/settings";

  return (
    <nav
      aria-label={t("settings.title")}
      className={`${sectionOpen ? "hidden" : "flex"} flex-col lg:flex lg:w-[250px] lg:shrink-0 lg:border-r-[0.2px] lg:border-neutral-400 lg:pt-4 lg:pb-7`}
    >
      {/* The desktop title is in the TopBar */}
      <h1 className="p-4 font-display text-h3 font-bold text-white lg:hidden">{t("settings.title")}</h1>

      <Link
        href={path("/settings/general")}
        // Desktop always shows General beside the menu, so it is the current section there.
        aria-current="page"
        className="flex items-center gap-3 px-4 pb-4 transition-colors hover:bg-neutral-500 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary lg:h-11 lg:bg-primary-shade-3 lg:px-7 lg:pb-0 lg:hover:bg-primary-shade-3"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full border-[0.5px] border-neutral-400 bg-neutral-500 lg:hidden">
          <Image src="/assets/settings/general.svg" alt="" width={20} height={20} className="size-5" />
        </span>
        <Image src="/assets/settings/general-active.svg" alt="" width={20} height={20} className="hidden size-5 lg:block" />

        <span className="flex min-w-0 flex-1 flex-col gap-1.5 lg:gap-0">
          <span className="text-p1 font-semibold text-white lg:text-p2 lg:font-bold lg:text-primary">
            {t("settings.general.title")}
          </span>
          <span className="text-p2 text-neutral-200 lg:hidden">{t("settings.general.description")}</span>
        </span>

        <Image src="/assets/settings/chevron-right.svg" alt="" width={16} height={16} className="size-4 lg:hidden" />
      </Link>
    </nav>
  );
}
