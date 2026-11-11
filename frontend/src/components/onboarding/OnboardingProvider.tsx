"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { stripLocale } from "@/i18n/config";

// The parts of GET /api/me that onboarding uses.
type Me = {
  user: { email: string; citizenship: string | null; hasPasscode: boolean };
  wallet: object | null;
};

type OnboardingContextValue = {
  me: Me | undefined; // undefined until loaded
  passcode: string; // from Set a passcode, for Confirm to compare; "" until set
  setPasscode: (passcode: string) => void;
};

// The screens that need a logged-in user, in the order they are done.
const STEPS = ["/verify-email", "/citizenship", "/creating-wallet", "/passcode", "/confirm-passcode"];

// The first step the backend says is still missing.
function currentStep(me: Me) {
  if (!me.user.citizenship) return "/citizenship";
  if (!me.wallet) return "/creating-wallet";
  return "/passcode";
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<Me>();
  // React state only, never saved: browser storage can be read by any script, and a refresh should drop it.
  const [passcode, setPasscode] = useState("");

  // On every onboarding screen, ask the backend how far the user is and move them if they can't be here yet.
  const pathname = stripLocale(usePathname()); // "/ru/passcode" → "/passcode"
  const router = useRouter();
  useEffect(() => {
    const index = STEPS.indexOf(pathname);
    if (index === -1) return; // /signup and /login are open to everyone

    let cancelled = false;
    fetch("/api/me")
      .then(async (res) => {
        if (cancelled) return;
        if (res.status === 401) return router.replace("/login");
        if (!res.ok) return;

        const loaded: Me = await res.json();
        if (cancelled) return;
        setMe(loaded);

        if (loaded.user.hasPasscode) return router.replace("/"); // onboarding already finished
        const step = currentStep(loaded);
        // Earlier screens stay open; Confirm passcode belongs to the passcode step.
        const lastAllowed = STEPS.indexOf(step) + (step === "/passcode" ? 1 : 0);
        if (index > lastAllowed) router.replace(step);
        else if (pathname === "/confirm-passcode" && !passcode) router.replace("/passcode"); // e.g. after a refresh
      })
      .catch(() => {
        // Backend unreachable: stay on the page; the screen's own request will show the error.
      });

    return () => {
      cancelled = true;
    };
  }, [pathname, passcode, router]);

  const value = useMemo(() => ({ me, passcode, setPasscode }), [me, passcode]);

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) throw new Error("useOnboarding must be used inside <OnboardingProvider>");
  return context;
}

export function OnboardingEmail() {
  const { me } = useOnboarding();
  return <>{me?.user.email}</>;
}
