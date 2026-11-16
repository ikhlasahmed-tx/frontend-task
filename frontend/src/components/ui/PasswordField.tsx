"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TextField, type TextFieldProps } from "@/components/ui/TextField";

type PasswordFieldProps = Omit<TextFieldProps, "icon" | "trailing" | "type">;

export function PasswordField(props: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  return (
    <TextField
      {...props}
      type={visible ? "text" : "password"}
      icon="/assets/onboarding/icon-lock.svg"
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? t("fields.hidePassword") : t("fields.showPassword")}
          aria-pressed={visible}
          // before: widens the tap area to 44×44 without changing the 20px icon
          className="relative flex size-5 shrink-0 items-center justify-center rounded transition-opacity before:absolute before:-inset-3 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <EyeIcon slashed={!visible} />
        </button>
      }
    />
  );
}

// The Figma eye icon, inline so a slash can draw across it while the password is hidden.
function EyeIcon({ slashed }: { slashed: boolean }) {
  const slash = {
    strokeDasharray: 1,
    strokeDashoffset: slashed ? 0 : 1,
  };
  const slashClass = "transition-[stroke-dashoffset] duration-200 ease-out motion-reduce:transition-none";

  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-5">
      <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      <path d="M21 12c-1.889 2.991-5.282 6-9 6s-7.111-3.009-9-6c2.299-2.842 4.992-6 9-6s6.701 3.158 9 6Z" />
      {/* Dark underlay cuts a gap where the slash crosses the eye, in the field's own fill */}
      <path d="M4 4l16 16" pathLength={1} stroke="var(--color-neutral-500)" strokeWidth={4} style={slash} className={slashClass} />
      <path d="M4 4l16 16" pathLength={1} style={slash} className={slashClass} />
    </svg>
  );
}
