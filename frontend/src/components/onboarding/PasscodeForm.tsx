"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CodeInput } from "@/components/ui/CodeInput";

// The passcode lives only in this component's state: never in sessionStorage, where any script could read it.
export function PasscodeForm() {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  // Next.js keeps a left page alive; clear the hidden digits when it's hidden so the screen reopens empty.
  useEffect(() => () => setPasscode(""), []);

  // TODO: Confirm needs this passcode to compare against; decide how it gets there when building /confirm-passcode.
  return (
    <CodeInput
      label="Passcode"
      value={passcode}
      onChange={setPasscode}
      onComplete={() => router.push("/confirm-passcode")}
      mask
      autoFocus
    />
  );
}
