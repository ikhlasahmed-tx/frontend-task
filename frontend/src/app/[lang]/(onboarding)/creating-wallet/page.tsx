import type { Metadata } from "next";
import Image from "next/image";
import { CreatingWalletStep } from "@/components/onboarding/CreatingWalletStep";
import { getT } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("meta.creatingWallet") };
}

export default async function CreatingWalletPage() {
  const t = await getT();

  return (
    <div role="status" className="flex flex-1 flex-col items-center justify-center gap-4 bg-neutral-600 px-4 text-center">
      <div className="flex items-center gap-4">
        {/* Pulse is not in Figma (static dots); added on request, confirm with the designer */}
        <Image
          src="/assets/onboarding/loading-dots.svg"
          alt=""
          width={45}
          height={17}
          className="h-[17px] w-[45px] motion-safe:animate-pulse"
          priority
        />
        <h1 className="font-display text-h4 font-semibold text-white">{t("creatingWallet.title")}</h1>
      </div>
      <p className="text-p2 text-neutral-200">{t("creatingWallet.subtitle")}</p>
      <CreatingWalletStep />
    </div>
  );
}
