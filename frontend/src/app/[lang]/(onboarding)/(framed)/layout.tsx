import type { ReactNode } from "react";
import { LanguageSelector } from "@/components/onboarding/LanguageSelector";
import { OnboardingBackground } from "@/components/onboarding/OnboardingBackground";
import { TermsNotice } from "@/components/onboarding/TermsNotice";

export default function FramedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate flex min-h-dvh flex-1 flex-col items-center overflow-hidden bg-neutral-600 px-4 py-11">
      <OnboardingBackground />

      <header className="flex min-h-[18px] items-center justify-center">
        <LanguageSelector />
      </header>

      <main className="flex w-full max-w-[358px] flex-1 flex-col justify-center pt-10 pb-8">{children}</main>

      <footer className="w-full max-w-[412px]">
        <TermsNotice />
      </footer>
    </div>
  );
}
