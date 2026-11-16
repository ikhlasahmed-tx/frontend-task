import type { Wallet } from "@/lib/data";

// Avatar, wallet name and address. Shown in the wallet section, and in the phone top bar (Figma 1:55).
export function WalletIdentity({ wallet }: { wallet: Pick<Wallet, "name" | "address" | "avatarInitial"> }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span
        aria-hidden
        className="flex size-[38px] shrink-0 items-center justify-center rounded-full border border-neutral-400 bg-primary font-display text-h5 font-semibold text-neutral-600"
      >
        {wallet.avatarInitial}
      </span>
      <div className="flex min-w-0 flex-col">
        <p className="truncate text-p1 font-medium text-white">{wallet.name}</p>
        <p className="text-p2 text-neutral-200">{wallet.address}</p>
      </div>
    </div>
  );
}
