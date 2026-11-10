"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";
import { CodeInput } from "@/components/ui/CodeInput";

// The passcode lives only in this component's state: never in sessionStorage, where any script could read it.
export function PasscodeForm() {
  const router = useRouter();
  const { setPasscode: handOver } = useOnboarding();
  const [passcode, setPasscode] = useState("");
  // Next.js keeps a left page alive; clear the hidden digits when it's hidden so the screen reopens empty.
  useEffect(() => () => setPasscode(""), []);

  return (
    <CodeInput
      label="Passcode"
      value={passcode}
      onChange={setPasscode}
      onComplete={(code) => {
        handOver(code); // Confirm compares against this (kept in memory only)
        router.push("/confirm-passcode");
      }}
      mask
      autoFocus
    />
  );
}
