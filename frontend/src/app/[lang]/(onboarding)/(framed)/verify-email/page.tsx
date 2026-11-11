import type { Metadata } from "next";
import Image from "next/image";
import { OnboardingEmail } from "@/components/onboarding/OnboardingProvider";
import { OtpForm } from "@/components/onboarding/OtpForm";
import { StepHeader } from "@/components/onboarding/StepHeader";
import { getT } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("meta.verifyEmail") };
}

export default async function VerifyEmailPage() {
  const t = await getT();

  return (
    <div className="flex flex-col items-center gap-7">
      <StepHeader
        icon={
          <Image
            src="/assets/onboarding/illustration-email-otp.svg"
            alt=""
            width={55}
            height={55}
            className="size-[55px]"
            priority
          />
        }
        title={t("verifyEmail.title")}
        subtitle={
          <>
            {t("verifyEmail.subtitle")}{" "}
            <span className="text-white">
              <OnboardingEmail />
            </span>
          </>
        }
      />
      <OtpForm />
    </div>
  );
}
