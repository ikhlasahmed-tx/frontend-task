import type { Metadata } from "next";
import Image from "next/image";
import { CitizenshipForm } from "@/components/onboarding/CitizenshipForm";
import { Trans } from "react-i18next";
import { StepHeader } from "@/components/onboarding/StepHeader";
import { getT, i18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("meta.citizenship") };
}

export default async function CitizenshipPage() {
  const t = await getT();

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
        title={t("citizenship.title")}
        subtitle={<Trans i18n={i18n} t={t} i18nKey="citizenship.subtitle" />}
      />
      <CitizenshipForm />
    </div>
  );
}
