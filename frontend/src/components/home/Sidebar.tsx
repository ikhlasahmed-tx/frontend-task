"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
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
    label: "Home",
    href: "/",
    icon: { src: "/assets/icon-home.svg", width: 22, height: 22, left: 0, top: 0 },
  },
  {
    label: "Wallet",
    href: "/wallet",
    icon: { src: "/assets/icon-wallet.svg", width: 18.3333, height: 18.9751, left: 1.833, top: 0.977 },
  },
  {
    label: "Transactions",
    href: "/transactions",
    icon: { src: "/assets/icon-transactions.svg", width: 18.5, height: 18.5, left: 1.25, top: 2.25 },
  },
  {
    label: "Rewards",
    href: "/rewards",
    icon: { src: "/assets/icon-rewards.svg", width: 22, height: 22, left: 0, top: 0 },
  },
  {
    label: "Settings",
    href: "/settings",
    icon: { src: "/assets/icon-settings.svg", width: 18.0001, height: 18.7801, left: 2, top: 2 },
  },
];

export function Sidebar() {
  const pathname = usePathname();

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

      <nav aria-label="Main" className="flex flex-col gap-2">
        {navItems.map(({ label, href, icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
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
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
