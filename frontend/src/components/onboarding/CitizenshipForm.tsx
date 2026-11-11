"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type SubmitEvent } from "react";
import { CountrySelect } from "@/components/onboarding/CountrySelect";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";
import { useTranslation } from "react-i18next";
import { useLocalePath } from "@/i18n/useLocalePath";

export function CitizenshipForm() {
  const router = useRouter();
  const path = useLocalePath();
  const { t } = useTranslation();
  const { me } = useOnboarding();
  const [picked, setPicked] = useState<string>();
  // Until the user picks, show the country already saved on the backend (if any).
  const citizenship = picked ?? me?.user.citizenship ?? "";
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ citizenship }),
      });
      if (res.ok) {
        // Stays pending while the next page loads, so the button can't be pressed twice.
        router.push(path("/creating-wallet"));
        return;
      }
      if (res.status === 401) {
        router.replace(path("/login"));
        return;
      }
      setError(t("citizenship.saveFailed"));
    } catch {
      setError(t("common.offline"));
    }
    setPending(false);
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <form onSubmit={handleSubmit} className="flex w-full gap-2.5">
        <div className="min-w-0 flex-1">
          <CountrySelect
            label={t("citizenship.fieldLabel")}
            value={citizenship}
            onChange={setPicked}
          />
        </div>
        <button
          type="submit"
          aria-label={t("common.continue")}
          disabled={!citizenship || pending}
          className="flex h-12 w-11 shrink-0 items-center justify-center rounded-xl border-[0.5px] border-primary-shade-2 bg-primary transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50"
        >
          <Image src="/assets/onboarding/icon-arrow-right.svg" alt="" width={22} height={22} className="size-[22px]" />
        </button>
      </form>
      {error && (
        <p role="alert" className="text-caption text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
