"use client";

import Image from "next/image";
import { useState } from "react";
import type { Wallet } from "@/lib/data";

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function WalletSummary({ wallet }: { wallet: Wallet }) {
  const [showUsernameBanner, setShowUsernameBanner] = useState(true);

  return (
    <section
      aria-label="Wallet summary"
      className="flex flex-col justify-center gap-6 border-b-[0.2px] border-neutral-400 py-7 pr-8 pl-7"
    >
      {/* Wallet name and address */}
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden
          className="flex size-[38px] shrink-0 items-center justify-center rounded-full border border-neutral-400 bg-primary font-display text-h5 font-semibold text-neutral-600"
        >
          {wallet.avatarInitial}
        </span>
        <div className="flex flex-col">
          <p className="text-p1 font-medium text-white">{wallet.name}</p>
          <p className="text-p2 text-neutral-200">{wallet.address}</p>
        </div>
      </div>

      {/* Username prompt */}
      {showUsernameBanner && (
        <div className="flex h-[76px] items-start gap-2 rounded-xl border-[0.5px] border-neutral-400 bg-neutral-500 py-4 pr-3.5 pl-4">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <UsernameBadge />
            <p className="min-w-0 flex-1 text-p2 text-neutral-100">
              Create your @username: A unique identity for your wallet.
            </p>
          </div>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => setShowUsernameBanner(false)}
            className="flex size-5 shrink-0 items-center justify-center rounded-full bg-neutral-400 transition-colors hover:bg-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Image src="/assets/icon-close.svg" alt="" width={11} height={11} className="size-[11px]" />
          </button>
        </div>
      )}

      {/* Balance */}
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1">
          <p className="text-p2 text-neutral-200">Estimated balance</p>
          <Image src="/assets/icon-info.svg" alt="" width={14} height={14} className="size-3.5" />
        </div>
        <p className="font-display text-[48px] leading-[1.3] font-semibold text-white">
          {usd.format(wallet.balanceUsd)}
        </p>
      </div>
    </section>
  );
}

// The "@you" illustration: a background blob, a teal tile with a face, and a "@you" tag on top.
function UsernameBadge() {
  return (
    <div aria-hidden className="relative size-[44.565px] shrink-0">
      <Image
        src="/assets/username-badge-bg.svg"
        alt=""
        width={44.5649}
        height={44.4826}
        className="absolute top-0 left-0 h-[44.4826px] w-[44.5649px] max-w-none"
      />
      <div className="absolute top-[9px] left-[9px] size-[27px] overflow-hidden rounded-[4px] bg-primary-shade-1">
        <Image
          src="/assets/username-badge-face.svg"
          alt=""
          width={24}
          height={18}
          className="absolute top-[9px] left-0 h-[18px] w-6 max-w-none"
        />
      </div>
      <span className="absolute top-1 left-[13px] rounded-[4px] bg-primary px-[3px] pt-0.5 pb-1 text-[8px] leading-[1.5] font-bold tracking-[-0.3px] text-neutral-600 [text-box:trim-both_cap_alphabetic]">
        @you
      </span>
    </div>
  );
}
