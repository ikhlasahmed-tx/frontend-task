import type { ReactNode } from "react";
import { TopBar } from "@/components/home/TopBar";
import { SettingsNav } from "@/components/settings/SettingsNav";
import { getT } from "@/i18n/server";

// Desktop: top bar, then the sub-menu beside the open section (Figma 6:550).
// Phones have no top bar here: the list has its own big title, a section its own back bar (Figma 6:710, 6:833).
export default async function SettingsLayout({ children }: { children: ReactNode }) {
  const t = await getT();

  return (
    <>
      <div className="hidden lg:block">
        <TopBar title={t("settings.title")} />
      </div>
      <div className="flex flex-1 flex-col lg:flex-row">
        <SettingsNav />
        {children}
      </div>
    </>
  );
}
