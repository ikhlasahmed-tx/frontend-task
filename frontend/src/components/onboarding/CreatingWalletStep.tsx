"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "react-i18next";
import { useLocalePath } from "@/i18n/useLocalePath";

// The backend answers at once; keep the screen up long enough to be read instead of flashing.
const MIN_WAIT_MS = 2000;

// Runs the "Creating wallet" step: creates the wallet, then moves on. Renders nothing unless it fails.
// Missing earlier steps are handled by OnboardingProvider.
export function CreatingWalletStep() {
  const router = useRouter();
  const path = useLocalePath();
  const { t } = useTranslation();
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0); // changing this runs the request again

  useEffect(() => {
    let cancelled = false;
    const minWait = new Promise((resolve) => setTimeout(resolve, MIN_WAIT_MS));

    // Safe to send twice (React runs effects twice in development): the backend returns the existing wallet.
    Promise.all([fetch("/api/me/wallet", { method: "POST" }), minWait])
      .then(([res]) => {
        if (cancelled) return;
        if (res.ok) router.replace(path("/passcode"));
        else if (res.status === 401) router.replace(path("/login"));
        else if (res.status === 409) router.replace(path("/citizenship")); // citizenship not saved yet
        else setFailed(true);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [router, path, attempt]);

  if (!failed) return null;

  return (
    <div role="alert" className="flex flex-col items-center gap-3">
      <p className="text-caption text-danger">{t("creatingWallet.failed")}</p>
      <Button
        onClick={() => {
          setFailed(false);
          setAttempt((n) => n + 1);
        }}
      >
        {t("common.tryAgain")}
      </Button>
    </div>
  );
}
