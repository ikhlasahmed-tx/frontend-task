"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
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

// Used by Settings → General.
export function LogoutButton({ className }: { className: string }) {
  const path = useLocalePath();
  const { t } = useTranslation();

  return (
    <button type="button" onClick={() => logOut(path("/login"))} className={className}>
      {t("nav.logout")}
    </button>
  );
}

export function Sidebar() {
  const pathname = stripLocale(usePathname()); // "/ru" → "/", so the active item still matches
  const path = useLocalePath();
  const { t } = useTranslation();

  return (
    // Below lg (1024px) this is a bottom tab bar; from lg up it is the full sidebar.
    // The phone Settings → General screen has a back arrow instead of the tab bar (Figma 6:833).
    <aside className={`${pathname === "/settings/general" ? "hidden lg:flex" : "flex"} fixed inset-x-0 bottom-0 z-10 border-t-[0.2px] border-neutral-400 bg-neutral-600 lg:sticky lg:inset-x-auto lg:top-0 lg:bottom-auto lg:h-dvh lg:w-56 lg:shrink-0 lg:flex-col lg:gap-8 lg:border-t-0 lg:border-r-[0.2px] lg:py-7`}>
      <div className="hidden items-center px-9 lg:flex">
        <Image
          src="/assets/logo.svg"
          alt="SwarpPay"
          width={42}
          height={49.149}
          className="h-[49.149px] w-[42px]"
          priority
        />
      </div>

      {/* Phone bar (Figma 1:55): five 44px icon circles, 20px above and 10px below, 74px tall */}
      <nav aria-label={t("nav.label")} className="flex w-full justify-between px-4 pt-5 pb-2.5 lg:flex-col lg:justify-start lg:gap-2 lg:p-0">
        {navItems.map(({ id, href, icon }) => {
          // Sub-pages keep their tab lit: /settings/general → Settings.
          const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={path(href)}
              aria-current={active ? "page" : undefined}
              className={`flex size-11 shrink-0 items-center justify-center rounded-full transition-colors lg:h-11 lg:w-auto lg:justify-start lg:gap-2 lg:rounded-none lg:pr-3.5 lg:pl-8 lg:text-p2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary ${
                active
                  ? "bg-primary-shade-3 font-bold text-primary"
                  : "font-normal text-neutral-200 hover:bg-neutral-500 hover:text-neutral-100 lg:hover:bg-transparent"
              }`}
            >
              <Image
                src={`/assets/nav/${id}${active ? "-active" : ""}.svg`}
                alt=""
                width={24}
                height={24}
                className="size-6 lg:hidden"
              />
              <span className="relative hidden size-[22px] shrink-0 lg:block">
                <Image
                  src={icon.src}
                  alt=""
                  width={icon.width}
                  height={icon.height}
                  className="absolute max-w-none"
                  style={{ left: icon.left, top: icon.top, width: icon.width, height: icon.height }}
                />
              </span>
              {/* Icons only on phones; the name stays for screen readers */}
              <span className="max-lg:sr-only">{t(`nav.${id}`)}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
