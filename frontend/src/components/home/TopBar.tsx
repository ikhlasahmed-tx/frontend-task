import Image from "next/image";
import { getT } from "@/i18n/server";

const iconButton =
  "flex size-11 shrink-0 items-center justify-center rounded-full border-[0.5px] border-neutral-400 bg-neutral-500 transition-colors hover:bg-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export async function TopBar({ title }: { title: string }) {
  const t = await getT();

  return (
    <header className="flex items-center justify-between gap-4 border-b-[0.2px] border-neutral-400 py-5 pr-8 pl-7">
      <h1 className="font-display text-h4 font-bold text-white">{title}</h1>

      <div className="flex min-w-0 items-center gap-3">
        <form role="search" className="min-w-0">
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

        <button type="button" aria-label={t("home.scanQr")} className={iconButton}>
          <span className="relative size-6">
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
          <Image src="/assets/icon-bell.svg" alt="" width={22} height={22} className="size-[22px]" />
        </button>
      </div>
    </header>
  );
}
