"use client";

import { useEffect, useState } from "react";
import { clearOnboardingData, useOnboarding } from "@/components/onboarding/OnboardingProvider";
import { CodeInput } from "@/components/ui/CodeInput";

export function ConfirmPasscodeForm() {
  const { passcode } = useOnboarding();
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0); // changing this resets the boxes after a mismatch
  // Next.js keeps a left page alive; clear the digits and any error when it's hidden so the screen reopens fresh.
  useEffect(
    () => () => {
      setValue("");
      setError(false);
    },
    [],
  );

  function confirm(code: string) {
    if (code !== passcode) {
      setError(true);
      setValue("");
      setAttempt((n) => n + 1);
      return;
    }
    // TODO (backend): POST /api/me/passcode { passcode: code }
    clearOnboardingData();
    // Full page load, not router.replace: it drops the passcode and all onboarding state from memory,
    // and the provider's redirect check can't bounce the user back before Home loads.
    window.location.replace("/");
  }

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <CodeInput
        key={attempt}
        label="Confirm passcode"
        value={value}
        onChange={(next) => {
          setValue(next);
          if (error) setError(false);
        }}
        onComplete={confirm}
        error={error}
        mask
        autoFocus
      />
      {error && (
        <p role="alert" className="text-caption text-danger">
          Passcodes don’t match. Try again.
        </p>
      )}
    </div>
  );
}
