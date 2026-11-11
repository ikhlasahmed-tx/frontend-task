import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Trans } from "react-i18next";
import { LoginForm } from "@/components/onboarding/LoginForm";
import { StepHeader } from "@/components/onboarding/StepHeader";
import { getLocalePath, getT, i18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("meta.login") };
}

export default async function LoginPage() {
  const t = await getT();
  const path = await getLocalePath();

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
          title={t("login.title")}
          subtitle={t("login.subtitle")}
        />
        <LoginForm />
      </div>

      <p className="mt-8 self-center text-p2 text-neutral-100">
        <Trans
          i18n={i18n}
          t={t}
          i18nKey="login.noAccount"
          components={{
            signup: (
              <Link
                href={path("/signup")}
                className="rounded font-medium text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              />
            ),
          }}
        />
      </p>
    </div>
  );
}
