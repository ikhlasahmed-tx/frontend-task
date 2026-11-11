import type { Metadata } from "next";
import Image from "next/image";
import { ConfirmPasscodeForm } from "@/components/onboarding/ConfirmPasscodeForm";
import { StepHeader } from "@/components/onboarding/StepHeader";
import { getT } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("meta.confirmPasscode") };
}

export default async function ConfirmPasscodePage() {
  const t = await getT();

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
        title={t("confirmPasscode.title")}
        subtitle={t("passcode.subtitle")}
      />
      <ConfirmPasscodeForm />
    </div>
  );
}
