import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/onboarding/LoginForm";
import { StepHeader } from "@/components/onboarding/StepHeader";

export const metadata: Metadata = {
  title: "Log in · SwarpPay",
};

export default function LoginPage() {
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
          title="Welcome back"
          subtitle="Log in to your Swarp Pay account."
        />
        <LoginForm />
      </div>

      <p className="mt-8 self-center text-p2 text-neutral-100">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="rounded font-medium text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
