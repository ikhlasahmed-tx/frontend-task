import type { Metadata } from "next";
import Image from "next/image";
import { CitizenshipForm } from "@/components/onboarding/CitizenshipForm";
import { StepHeader } from "@/components/onboarding/StepHeader";

export const metadata: Metadata = {
  title: "Citizenship · SwarpPay",
};

export default function CitizenshipPage() {
  return (
    <div className="flex flex-col items-center gap-7">
      <StepHeader
        icon={
          <span className="relative size-[55px]">
            <Image
              src="/assets/onboarding/illustration-citizenship.svg"
              alt=""
              width={53.2498}
              height={53.25}
              className="absolute top-[0.752px] left-[0.252px] h-[53.25px] w-[53.2498px] max-w-none"
              priority
            />
          </span>
        }
        title="Select your citizenship"
        subtitle={
          <>
            Swarp Pay is required to collect this info. If you&apos;re
            <br />a dual citizen, please select one country.
          </>
        }
      />
      <CitizenshipForm />
    </div>
  );
}
