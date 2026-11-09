"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";

export type OnboardingData = {
  email: string;
  citizenship: string; // ISO country code, e.g. "PK"; "" until chosen
};

type OnboardingContextValue = {
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
};

const EMPTY: OnboardingData = { email: "", citizenship: "" };

// What each page needs from earlier steps, and where to send the user when it's missing (checked in order).
const REQUIRED: Record<string, (keyof OnboardingData)[]> = {
  "/verify-email": ["email"],
  "/citizenship": ["email"],
  "/creating-wallet": ["email", "citizenship"],
  "/passcode": ["email", "citizenship"],
};
const STEP_FOR: Record<keyof OnboardingData, string> = { email: "/signup", citizenship: "/citizenship" };
const STORAGE_KEY = "swarppay.onboarding";

const listeners = new Set<() => void>();
let memory: string | null = null; // fallback when the browser blocks sessionStorage

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function readSaved(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return memory;
  }
}

const readOnServer = () => undefined;

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const saved = useSyncExternalStore(subscribe, readSaved, readOnServer);

  const data = useMemo<OnboardingData>(() => {
    if (!saved) return EMPTY;
    try {
      return { ...EMPTY, ...JSON.parse(saved) };
    } catch {
      return EMPTY;
    }
  }, [saved]);

  const update = useCallback(
    (patch: Partial<OnboardingData>) => {
      const next = JSON.stringify({ ...data, ...patch });
      try {
        sessionStorage.setItem(STORAGE_KEY, next);
      } catch {
        memory = next;
      }
      listeners.forEach((listener) => listener());
    },
    [data],
  );

  // Send users back to the first earlier step they haven't done (only once saved data has been read).
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (saved === undefined) return;
    const missing = REQUIRED[pathname]?.find((field) => !data[field]);
    if (missing) router.replace(STEP_FOR[missing]);
  }, [saved, data, pathname, router]);

  const value = useMemo(() => ({ data, update }), [data, update]);

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) throw new Error("useOnboarding must be used inside <OnboardingProvider>");
  return context;
}

export function OnboardingEmail() {
  const { data } = useOnboarding();
  return <>{data.email}</>;
}
