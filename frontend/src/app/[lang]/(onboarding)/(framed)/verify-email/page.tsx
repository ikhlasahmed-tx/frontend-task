import type { Metadata } from "next";
import Image from "next/image";
import { OnboardingEmail } from "@/components/onboarding/OnboardingProvider";
import { OtpForm } from "@/components/onboarding/OtpForm";
import { StepHeader } from "@/components/onboarding/StepHeader";

export const metadata: Metadata = {
  title: "Verify your email · SwarpPay",
};

export default function VerifyEmailPage() {
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
        title="Verification code"
        subtitle={
          <>
            Enter the 6-digit code that was sent to your email{" "}
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
