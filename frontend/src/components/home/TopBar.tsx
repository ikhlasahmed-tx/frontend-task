import Image from "next/image";
import type { ReactNode } from "react";
import { getT } from "@/i18n/server";

// Phones: a plain 24px icon (Figma 1:55); before: widens the tap area to 40px. lg and up: a 44px circle.
const iconButton =
  "relative flex size-6 shrink-0 items-center justify-center rounded-full transition-colors before:absolute before:-inset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:size-11 lg:border-[0.5px] lg:border-neutral-400 lg:bg-neutral-500 lg:before:hidden lg:hover:bg-neutral-400";

// `identity` (Home only) replaces the title on phones: avatar, wallet name and address, as in Figma 1:55.
export async function TopBar({ title, identity }: { title: string; identity?: ReactNode }) {
  const t = await getT();

  return (
    <header className="flex items-center gap-3 border-b-[0.2px] border-neutral-400 p-4 lg:py-5 lg:pr-8 lg:pl-7">
      {identity && <div className="mr-auto min-w-0 lg:hidden">{identity}</div>}
      <h1 className={`mr-auto font-display text-h4 font-bold text-white ${identity ? "max-lg:sr-only" : ""}`}>{title}</h1>

      <form role="search" className="hidden lg:block">
        <label className="flex h-[46px] w-[358px] max-w-full cursor-text items-center gap-3 rounded-full border-[0.5px] border-neutral-400 bg-neutral-500 px-4 focus-within:border-primary">
          <Image src="/assets/icon-search.svg" alt="" width={18} height={18} className="size-[18px] shrink-0" />
          <span className="sr-only">{t("home.search")}</span>
          <input
            type="text"
            name="q"
            placeholder={t("home.search")}
            className="min-w-0 flex-1 bg-transparent text-p2 text-white caret-primary outline-none placeholder:text-neutral-200"
          />
        </label>
      </form>

      <div className="flex shrink-0 items-center gap-3">
        {/* Does nothing yet, like QR and notifications: there is no search page */}
        <button type="button" aria-label={t("home.search")} className={`${iconButton} lg:hidden`}>
          <Image src="/assets/topbar/search.svg" alt="" width={24} height={24} className="size-6" />
        </button>

        <button type="button" aria-label={t("home.scanQr")} className={iconButton}>
          <Image src="/assets/topbar/qr.svg" alt="" width={24} height={24} className="size-6 lg:hidden" />
          <span className="relative hidden size-6 lg:block">
            <Image
              src="/assets/icon-qr.svg"
              alt=""
              width={17.5}
              height={17.5}
              className="absolute top-[3.25px] left-[3.25px] size-[17.5px] max-w-none"
            />
          </span>
        </button>

        <button type="button" aria-label={t("home.notifications")} className={iconButton}>
          <Image src="/assets/topbar/bell.svg" alt="" width={24} height={24} className="size-6 lg:hidden" />
          <Image src="/assets/icon-bell.svg" alt="" width={22} height={22} className="hidden size-[22px] lg:block" />
        </button>
      </div>
    </header>
  );
}
