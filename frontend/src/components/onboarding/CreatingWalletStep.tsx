"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const FAKE_WAIT_MS = 2000;

// Runs the "Creating wallet" step: waits, then moves on. Renders nothing.
// Missing earlier steps are handled by OnboardingProvider.
export function CreatingWalletStep() {
  const router = useRouter();

  useEffect(() => {
    // shortcut: fixed wait instead of a real wallet, until the backend exists (POST /api/wallets, then poll GET /api/wallets/me)
    const timer = setTimeout(() => router.replace("/passcode"), FAKE_WAIT_MS);
    return () => clearTimeout(timer);
  }, [router]);

  return null;
}
