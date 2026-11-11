import Image from "next/image";
import Link from "next/link";
import { Trans } from "react-i18next";
import { getLocalePath, getT, i18n } from "@/i18n/server";

const linkClass =
  "rounded text-neutral-100 underline hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export async function TermsNotice() {
  const t = await getT();
  const path = await getLocalePath();

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <Image src="/assets/onboarding/divider.svg" alt="" width={412} height={1} className="h-px w-full" />
      <p className="w-[293px] max-w-full text-center text-caption text-neutral-200">
        <Trans
          i18n={i18n}
          t={t}
          i18nKey="terms.notice"
          components={{
            terms: <Link href={path("/terms")} className={linkClass} />,
            privacy: <Link href={path("/privacy")} className={linkClass} />,
          }}
        />
      </p>
    </div>
  );
}
