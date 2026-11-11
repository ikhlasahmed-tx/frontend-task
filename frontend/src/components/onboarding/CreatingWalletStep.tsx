"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

// The backend answers at once; keep the screen up long enough to be read instead of flashing.
const MIN_WAIT_MS = 2000;

// Runs the "Creating wallet" step: creates the wallet, then moves on. Renders nothing unless it fails.
// Missing earlier steps are handled by OnboardingProvider.
export function CreatingWalletStep() {
  const router = useRouter();
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0); // changing this runs the request again

  useEffect(() => {
    let cancelled = false;
    const minWait = new Promise((resolve) => setTimeout(resolve, MIN_WAIT_MS));

    // Safe to send twice (React runs effects twice in development): the backend returns the existing wallet.
    Promise.all([fetch("/api/me/wallet", { method: "POST" }), minWait])
      .then(([res]) => {
        if (cancelled) return;
        if (res.ok) router.replace("/passcode");
        else if (res.status === 401) router.replace("/login");
        else if (res.status === 409) router.replace("/citizenship"); // citizenship not saved yet
        else setFailed(true);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [router, attempt]);

  if (!failed) return null;

  return (
    <div role="alert" className="flex flex-col items-center gap-3">
      <p className="text-caption text-danger">Couldn’t create your wallet.</p>
      <Button
        onClick={() => {
          setFailed(false);
          setAttempt((n) => n + 1);
        }}
      >
        Try again
      </Button>
    </div>
  );
}
