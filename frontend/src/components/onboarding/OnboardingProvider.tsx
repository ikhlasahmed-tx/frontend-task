"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, type ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { stripLocale } from "@/i18n/config";
import { useLocalePath } from "@/i18n/useLocalePath";
import { setMe, setPasscode, type Me } from "@/store/onboardingSlice";
import type { AppDispatch, RootState } from "@/store/store";
import { apiFetch } from "@/lib/api";

// The screens that need a logged-in user, in the order they are done.
const STEPS = ["/verify-email", "/citizenship", "/creating-wallet", "/passcode", "/confirm-passcode"];

// The first step the backend says is still missing.
function currentStep(me: Me) {
  if (!me.user.citizenship) return "/citizenship";
  if (!me.wallet) return "/creating-wallet";
  return "/passcode";
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  // Redux memory only, never saved: browser storage can be read by any script, and a refresh should drop it.
  const passcode = useSelector((state: RootState) => state.passcode);

  // On every onboarding screen, ask the backend how far the user is and move them if they can't be here yet.
  const pathname = stripLocale(usePathname()); // "/ru/passcode" → "/passcode"
  const router = useRouter();
  const path = useLocalePath();
  useEffect(() => {
    const index = STEPS.indexOf(pathname);
    if (index === -1) return; // /signup and /login are open to everyone

    let cancelled = false;
    apiFetch("/api/me")
      .then(async (res) => {
        if (cancelled) return;
        if (res.status === 401) return router.replace(path("/login"));
        if (!res.ok) return;

        const loaded: Me = await res.json();
        if (cancelled) return;
        dispatch(setMe(loaded));

        if (loaded.user.hasPasscode) return router.replace(path("/")); // onboarding already finished
        const step = currentStep(loaded);
        // Earlier screens stay open; Confirm passcode belongs to the passcode step.
        const lastAllowed = STEPS.indexOf(step) + (step === "/passcode" ? 1 : 0);
        if (index > lastAllowed) router.replace(path(step));
        else if (pathname === "/confirm-passcode" && !passcode) router.replace(path("/passcode")); // e.g. after a refresh
      })
      .catch(() => {
        // Backend unreachable: stay on the page; the screen's own request will show the error.
      });

    return () => {
      cancelled = true;
    };
  }, [pathname, passcode, router, path, dispatch]);

  return <>{children}</>;
}

// Same shape the Context version returned, so the screens using it don't change.
export function useOnboarding() {
  const me = useSelector((state: RootState) => state.me);
  const passcode = useSelector((state: RootState) => state.passcode);
  const dispatch = useDispatch<AppDispatch>();
  // Stable like the old useState setter, so it is safe in effect dependencies.
  const handOver = useCallback((value: string) => dispatch(setPasscode(value)), [dispatch]);
  return { me, passcode, setPasscode: handOver };
}

export function OnboardingEmail() {
  const { me } = useOnboarding();
  return <>{me?.user.email}</>;
}
