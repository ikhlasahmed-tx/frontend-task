"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CodeInput } from "@/components/ui/CodeInput";

const RESEND_COOLDOWN_SECONDS = 30;

type Status = "idle" | "verifying" | "error";

export function OtpForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [attempt, setAttempt] = useState(0); 
  const [cooldown, setCooldown] = useState(0); 
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  function handleChange(next: string) {
    setCode(next);
    if (status === "error") setStatus("idle");
  }

  async function verify(fullCode: string) {
    setStatus("verifying");
    // TODO (backend): POST /api/auth/otp/verify { email, code } → { token, user }
    const valid = await mockVerifyCode(fullCode);
    if (valid) {
      router.push("/citizenship");
    } else {
      setStatus("error");
      setCode("");
      setAttempt((n) => n + 1);
    }
  }

  function resend() {
    // TODO (backend): POST /api/auth/otp/resend { email }
    setCooldown(RESEND_COOLDOWN_SECONDS);
    setResent(true);
    setStatus("idle");
    setCode("");
    setAttempt((n) => n + 1);
  }

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <CodeInput
        key={attempt}
        label="Verification code"
        value={code}
        onChange={handleChange}
        onComplete={verify}
        error={status === "error"}
        disabled={status === "verifying"}
        autoComplete="one-time-code"
        autoFocus
      />

      <div aria-live="polite" className="flex flex-col items-center gap-2 text-center">
        {status === "error" && <p className="text-caption text-danger">That code isn’t right. Try again.</p>}
        {status === "verifying" && <p className="text-caption text-neutral-200">Verifying…</p>}
        {resent && status === "idle" && cooldown > 0 && (
          <p className="text-caption text-neutral-200">We sent a new code to your email.</p>
        )}

        <p className="text-p2 text-neutral-200">
          Didn’t receive a code?{" "}
          <button
            type="button"
            onClick={resend}
            disabled={cooldown > 0 || status === "verifying"}
            className="rounded text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:text-neutral-200 disabled:no-underline"
          >
            {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
          </button>
        </p>
      </div>
    </div>
  );
}


async function mockVerifyCode(code: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return code !== "000000";
}
