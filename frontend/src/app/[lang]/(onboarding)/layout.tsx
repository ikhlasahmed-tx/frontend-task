import type { ReactNode } from "react";
import { OnboardingProvider } from "@/components/onboarding/OnboardingProvider";
import { StoreProvider } from "@/store/StoreProvider";

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <OnboardingProvider>{children}</OnboardingProvider>
    </StoreProvider>
  );
}
