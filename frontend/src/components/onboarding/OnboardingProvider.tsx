"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";

export type OnboardingData = {
  email: string;
  citizenship: string; // ISO country code, e.g. "PK"; "" until chosen
};

type OnboardingContextValue = {
  data: OnboardingData;
  ready: boolean; 
  update: (patch: Partial<OnboardingData>) => void;
};

const EMPTY: OnboardingData = { email: "", citizenship: "" };
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

  const value = useMemo(() => ({ data, ready: saved !== undefined, update }), [data, saved, update]);

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
