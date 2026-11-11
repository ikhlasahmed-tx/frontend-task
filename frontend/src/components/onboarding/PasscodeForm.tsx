"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";
import { CodeInput } from "@/components/ui/CodeInput";
import { useTranslation } from "react-i18next";
import { useLocalePath } from "@/i18n/useLocalePath";

// The passcode lives only in this component's state: never in sessionStorage, where any script could read it.
export function PasscodeForm() {
  const router = useRouter();
  const path = useLocalePath();
  const { t } = useTranslation();
  const { setPasscode: handOver } = useOnboarding();
  const [passcode, setPasscode] = useState("");
  // Next.js keeps a left page alive; clear the hidden digits when it's hidden so the screen reopens empty.
  useEffect(() => () => setPasscode(""), []);

  return (
    <CodeInput
      label={t("passcode.label")}
      value={passcode}
      onChange={setPasscode}
      onComplete={(code) => {
        handOver(code); // Confirm compares against this (kept in memory only)
        router.push(path("/confirm-passcode"));
      }}
      mask
      autoFocus
    />
  );
}
