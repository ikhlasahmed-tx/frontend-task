"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "@/components/onboarding/LanguageSelector";
import { stripLocale } from "@/i18n/config";
import { useLocalePath } from "@/i18n/useLocalePath";

type NavItem = {
  id: "home" | "wallet" | "transactions" | "rewards" | "settings"; // also the text key under nav
  href: string;
  icon: {
    src: string;
    // Natural SVG size and its offset inside the 22×22 icon slot, taken from Figma.
    width: number;
    height: number;
    left: number;
    top: number;
  };
};

const navItems: NavItem[] = [
  {
    id: "home",
    href: "/",
    icon: { src: "/assets/icon-home.svg", width: 22, height: 22, left: 0, top: 0 },
  },
  {
    id: "wallet",
    href: "/wallet",
    icon: { src: "/assets/icon-wallet.svg", width: 18.3333, height: 18.9751, left: 1.833, top: 0.977 },
  },
  {
    id: "transactions",
    href: "/transactions",
    icon: { src: "/assets/icon-transactions.svg", width: 18.5, height: 18.5, left: 1.25, top: 2.25 },
  },
  {
    id: "rewards",
    href: "/rewards",
    icon: { src: "/assets/icon-rewards.svg", width: 22, height: 22, left: 0, top: 0 },
  },
  {
    id: "settings",
    href: "/settings",
    icon: { src: "/assets/icon-settings.svg", width: 18.0001, height: 18.7801, left: 2, top: 2 },
  },
];

async function logOut(loginPath: string) {
  const res = await fetch("/api/auth/logout", { method: "POST" });
  // Full page load, so nothing of the logged-in session stays in memory, and Back can't return to Home.
  if (res.ok) window.location.replace(loginPath);
}

export function Sidebar() {
  const pathname = stripLocale(usePathname()); // "/ru" → "/", so the active item still matches
  const path = useLocalePath();
  const { t } = useTranslation();

  return (
    <aside className="sticky top-0 flex h-dvh w-56 shrink-0 flex-col gap-8 border-r-[0.2px] border-neutral-400 bg-neutral-600 py-7">
      <div className="flex items-center px-9">
        <Image
          src="/assets/logo.svg"
          alt="SwarpPay"
          width={42}
          height={49.149}
          className="h-[49.149px] w-[42px]"
          priority
        />
      </div>

      <nav aria-label={t("nav.label")} className="flex flex-col gap-2">
        {navItems.map(({ id, href, icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={path(href)}
              aria-current={active ? "page" : undefined}
              className={`flex h-11 items-center gap-2 pr-3.5 pl-8 text-p2 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary ${
                active
                  ? "bg-primary-shade-3 font-bold text-primary"
                  : "font-normal text-neutral-200 hover:text-neutral-100"
              }`}
            >
              <span className="relative size-[22px] shrink-0">
                <Image
                  src={icon.src}
                  alt=""
                  width={icon.width}
                  height={icon.height}
                  className="absolute max-w-none"
                  style={{ left: icon.left, top: icon.top, width: icon.width, height: icon.height }}
                />
              </span>
              {t(`nav.${id}`)}
            </Link>
          );
        })}
      </nav>

      {/* Not in the Figma design: Home had no language picker. */}
      <div className="mt-auto flex flex-col gap-2">
        <div className="flex h-11 items-center pl-8">
          <LanguageSelector />
        </div>
        <button
          type="button"
          onClick={() => logOut(path("/login"))}
          className="flex h-11 items-center pr-3.5 pl-8 text-left text-p2 text-neutral-200 transition-colors hover:text-neutral-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
        >
          {t("nav.logout")}
        </button>
      </div>
    </aside>
  );
}
