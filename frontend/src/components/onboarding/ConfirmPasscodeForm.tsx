"use client";

import { useEffect, useState } from "react";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";
import { CodeInput } from "@/components/ui/CodeInput";
import { useTranslation } from "react-i18next";
import { useLocalePath } from "@/i18n/useLocalePath";

export function ConfirmPasscodeForm() {
  const { passcode } = useOnboarding();
  const path = useLocalePath();
  const { t } = useTranslation();
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0); // changing this resets the boxes after a mismatch
  const [serverError, setServerError] = useState("");
  const [pending, setPending] = useState(false);
  // Next.js keeps a left page alive; clear the digits and any error when it's hidden so the screen reopens fresh.
  useEffect(
    () => () => {
      setValue("");
      setError(false);
    },
    [],
  );

  async function confirm(code: string) {
    if (code !== passcode) {
      setError(true);
      setValue("");
      setAttempt((n) => n + 1);
      return;
    }

    setServerError("");
    setPending(true);
    try {
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: code }),
      });
      // 409 = a passcode is already saved (e.g. this screen was submitted twice), so onboarding is done too.
      if (res.ok || res.status === 409) {
        // Full page load, not router.replace: it drops the passcode and all onboarding state from memory.
        window.location.replace(path("/"));
        return;
      }
      if (res.status === 401) {
        window.location.replace(path("/login"));
        return;
      }
      setServerError(t("confirmPasscode.saveFailed"));
    } catch {
      setServerError(t("common.offline"));
    }
    setPending(false);
    setValue("");
    setAttempt((n) => n + 1);
  }

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <CodeInput
        key={attempt}
        label={t("confirmPasscode.label")}
        value={value}
        onChange={(next) => {
          setValue(next);
          if (error) setError(false);
          if (serverError) setServerError("");
        }}
        onComplete={confirm}
        error={error}
        disabled={pending}
        mask
        autoFocus
      />
      {error && (
        <p role="alert" className="text-caption text-danger">
          {t("confirmPasscode.mismatch")}
        </p>
      )}
      {serverError && (
        <p role="alert" className="text-caption text-danger">
          {serverError}
        </p>
      )}
    </div>
  );
}
