import Image from "next/image";
import { lang } from "next/root-params";
import type { ReactNode } from "react";
import { LogoutButton } from "@/components/home/Sidebar";
import { LanguageSelector } from "@/components/onboarding/LanguageSelector";
import { defaultLocale, hasLocale, localeNames } from "@/i18n/config";
import { getT } from "@/i18n/server";

// Figma 6:550 (desktop) and 6:833 (phone). Currency and Network rows are left out until the app supports them;
// Log out is not in the design and follows the same row style.
const row =
  "flex w-full items-center gap-3 px-4 pt-3 pb-4 text-left lg:border-b-[0.2px] lg:border-neutral-400 lg:px-0 lg:py-6";
// Figma's box is 120px wide; it grows for longer names like "Русский (RU)" instead of wrapping.
const box =
  "flex h-[38px] shrink-0 items-center justify-between gap-4 rounded-lg border-[0.5px] border-neutral-400 bg-neutral-500 px-4 text-caption whitespace-nowrap text-white lg:min-w-[120px]";

export async function GeneralSettings() {
  const t = await getT();
  const locale = await lang();
  const current = localeNames[hasLocale(locale) ? locale : defaultLocale];

  return (
    <section className="flex-1 lg:px-8 lg:py-10">
      <div className="lg:mx-auto lg:max-w-[742px]">
        {/* Phones have the title in the screen's back bar instead */}
        <h2 className="hidden border-b-[0.2px] border-neutral-400 pb-7 font-display text-h4 font-bold text-white lg:block">
          {t("settings.general.title")}
        </h2>

        <div className="pt-3 lg:mt-8 lg:pt-0">
          <LanguageSelector
            placement="row"
            className={`${row} rounded-none transition-colors hover:bg-neutral-500 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary lg:hover:bg-transparent`}
          >
            <RowIcon src="/assets/settings/language.svg" />
            <RowText
              title={t("language.label")}
              description={
                <>
                  <span className="lg:hidden">{current}</span>
                  <span className="hidden lg:inline">{t("settings.language.description")}</span>
                </>
              }
            />
            <Image src="/assets/settings/chevron-right.svg" alt="" width={16} height={16} className="size-4 lg:hidden" />
            <span className={`${box} hidden pr-3 lg:flex`}>
              {current}
              <Image src="/assets/settings/dropdown-chevron.svg" alt="" width={12} height={12} className="size-3" />
            </span>
          </LanguageSelector>

          <div className={row}>
            <RowIcon src="/assets/settings/logout.svg" />
            <RowText title={t("nav.logout")} description={t("settings.logout.description")} />
            <LogoutButton
              className={`${box} justify-center transition-colors hover:bg-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function RowIcon({ src }: { src: string }) {
  return (
    <span className="flex size-11 shrink-0 items-center justify-center rounded-full border-[0.5px] border-neutral-400 bg-neutral-500">
      <Image src={src} alt="" width={22} height={22} className="size-[22px]" />
    </span>
  );
}

// <span>s, not <p>s: the Language row sits inside a <button>, which only allows inline content.
function RowText({ title, description }: { title: string; description: ReactNode }) {
  return (
    <span className="flex min-w-0 flex-1 flex-col gap-1.5">
      <span className="text-p1 font-semibold text-white">{title}</span>
      <span className="text-p2 text-neutral-200">{description}</span>
    </span>
  );
}
