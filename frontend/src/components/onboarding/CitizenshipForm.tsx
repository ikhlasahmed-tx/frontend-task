"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, type SubmitEvent } from "react";
import { CountrySelect } from "@/components/onboarding/CountrySelect";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";

export function CitizenshipForm() {
  const router = useRouter();
  const { data, ready, update } = useOnboarding();

  useEffect(() => {
    if (ready && !data.email) router.replace("/signup");
  }, [ready, data.email, router]);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO (backend): PUT /api/me/citizenship { countryCode: data.citizenship }
    router.push("/creating-wallet");
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2.5">
      <div className="min-w-0 flex-1">
        <CountrySelect
          label="Country of citizenship"
          value={data.citizenship}
          onChange={(code) => update({ citizenship: code })}
        />
      </div>
      <button
        type="submit"
        aria-label="Continue"
        disabled={!data.citizenship}
        className="flex h-12 w-11 shrink-0 items-center justify-center rounded-xl border-[0.5px] border-primary-shade-2 bg-primary transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50"
      >
        <Image src="/assets/onboarding/icon-arrow-right.svg" alt="" width={22} height={22} className="size-[22px]" />
      </button>
    </form>
  );
}
