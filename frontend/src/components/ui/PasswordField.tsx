"use client";

import Image from "next/image";
import { useState } from "react";
import { TextField, type TextFieldProps } from "@/components/ui/TextField";

type PasswordFieldProps = Omit<TextFieldProps, "icon" | "trailing" | "type">;

// TextField with a lock icon and an eye button that shows/hides the password.
export function PasswordField(props: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      {...props}
      type={visible ? "text" : "password"}
      icon="/assets/onboarding/icon-lock.svg"
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="flex size-5 shrink-0 items-center justify-center rounded opacity-100 transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Image src="/assets/onboarding/icon-eye.svg" alt="" width={20} height={20} className="size-5" />
        </button>
      }
    />
  );
}
