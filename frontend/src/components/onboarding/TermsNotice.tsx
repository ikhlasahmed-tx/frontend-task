import Image from "next/image";
import Link from "next/link";

const linkClass =
  "rounded text-neutral-100 underline hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export function TermsNotice() {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <Image src="/assets/onboarding/divider.svg" alt="" width={412} height={1} className="h-px w-full" />
      <p className="w-[293px] max-w-full text-center text-caption text-neutral-200">
        You acknowledge that you read, and agree to{" "}
        <Link href="/terms" className={linkClass}>
          SwarpPay’s Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className={linkClass}>
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
