import type { Metadata } from "next";
import Image from "next/image";
import { CreatingWalletStep } from "@/components/onboarding/CreatingWalletStep";

export const metadata: Metadata = {
  title: "Creating wallet · SwarpPay",
};

export default function CreatingWalletPage() {
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
        <h1 className="font-display text-h4 font-semibold text-white">Creating wallet...</h1>
      </div>
      <p className="text-p2 text-neutral-200">Setting up your swarp pay wallet. This will not take long.</p>
      <CreatingWalletStep />
    </div>
  );
}
