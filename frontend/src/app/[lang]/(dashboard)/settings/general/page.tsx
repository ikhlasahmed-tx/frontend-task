import Image from "next/image";
import Link from "next/link";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { getLocalePath, getT } from "@/i18n/server";

export default async function GeneralSettingsPage() {
  const t = await getT();
  const path = await getLocalePath();

  return (
    <div className="flex flex-1 flex-col">
      {/* Phone back bar (Figma 6:833); desktop keeps the sub-menu beside this instead */}
      <header className="flex h-14 items-center border-b-[0.2px] border-neutral-400 px-4 lg:hidden">
        <Link
          href={path("/settings")}
          aria-label={t("settings.back")}
          // before: widens the tap area to 44px around the 24px arrow
          className="relative rounded before:absolute before:-inset-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Image src="/assets/settings/back.svg" alt="" width={24} height={24} className="size-6" />
        </Link>
        {/* pr-6 balances the arrow so the title sits in the middle of the screen */}
        <h1 className="flex-1 pr-6 text-center font-display text-h5 font-bold text-white">{t("settings.general.title")}</h1>
      </header>

      <GeneralSettings />
    </div>
  );
}
