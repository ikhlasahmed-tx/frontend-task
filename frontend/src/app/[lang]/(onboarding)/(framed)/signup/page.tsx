import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SignUpForm } from "@/components/onboarding/SignUpForm";
import { StepHeader } from "@/components/onboarding/StepHeader";

export const metadata: Metadata = {
  title: "Sign up · SwarpPay",
};

export default function SignUpPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col justify-center gap-7">
        <StepHeader
          icon={
            <Image
              src="/assets/onboarding/logo.svg"
              alt="SwarpPay"
              width={47}
              height={55}
              className="h-[55px] w-[47px]"
              priority
            />
          }
          title="Welcome to Swarp Pay"
          subtitle={
            <>
              Send and receive money in fiat or crypto.
              <br />
              Fast. Secure. Borderless.
            </>
          }
        />
        <SignUpForm />
      </div>

      <p className="mt-8 self-center text-p2 text-neutral-100">
        Already have an account?{" "}
        <Link
          href="/login"
          className="rounded font-medium text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Log in
        </Link>
      </p>

      {/* Will open ReferralCodeModal once that component is built */}
      <button
        type="button"
        className="mt-3 self-center rounded text-p2 font-medium text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Have a referral code?
      </button>
    </div>
  );
}
