import type { Metadata } from "next";
import Image from "next/image";
import { ConfirmPasscodeForm } from "@/components/onboarding/ConfirmPasscodeForm";
import { StepHeader } from "@/components/onboarding/StepHeader";

export const metadata: Metadata = {
  title: "Confirm passcode · SwarpPay",
};

export default function ConfirmPasscodePage() {
  return (
    <div className="flex flex-col items-center gap-7">
      <StepHeader
        icon={
          <span className="relative size-[55px]">
            <Image
              src="/assets/onboarding/illustration-passcode.svg"
              alt=""
              width={54.5003}
              height={52.3956}
              className="absolute top-[0.754px] left-[0.254px] h-[52.3956px] w-[54.5003px] max-w-none"
              priority
            />
          </span>
        }
        title="Confirm passcode"
        subtitle="This 6-digit passcode keeps your wallet and payments secure."
      />
      <ConfirmPasscodeForm />
    </div>
  );
}
