"use client";

import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { PasswordField } from "@/components/ui/PasswordField";
import { TextField } from "@/components/ui/TextField";
import { useTranslation } from "react-i18next";
import { useLocalePath } from "@/i18n/useLocalePath";
import {
  MIN_PASSWORD_LENGTH,
  validateSignUp,
  type SignUpErrors,
  type ValidationMessage,
  type SignUpValues,
} from "@/lib/validation";

const emptyValues: SignUpValues = { fullName: "", email: "", password: "", confirmPassword: "" };

export function SignUpForm() {
  const router = useRouter();
  const path = useLocalePath();
  const { t } = useTranslation();
  const message = (key?: ValidationMessage) => key && t(`validation.${key}`, { min: MIN_PASSWORD_LENGTH });
  const [values, setValues] = useState<SignUpValues>(emptyValues);
  const [errors, setErrors] = useState<SignUpErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const next = { ...values, [event.target.name]: event.target.value };
    setValues(next);
    if (submitted) setErrors(validateSignUp(next));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);

    const nextErrors = validateSignUp(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setFormError("");
    setPending(true);
    try {
      const { fullName, email, password } = values;
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });
      if (res.ok) {
        // Stays pending while the next page loads, so the button can't be pressed twice.
        router.push(path("/verify-email"));
        return;
      }
      if (res.status === 400) {
        // Show this form's own (translated) messages for the fields the backend rejected, not its English text.
        // The form already blocks short passwords, so the backend only rejects one for being over 72 bytes.
        const fields: Record<string, string> = (await res.json()).fields ?? {};
        setErrors({
          ...(fields.fullName && { fullName: "fullName" }),
          ...(fields.email && { email: "email" }),
          ...(fields.password && { password: "passwordTooLong" }),
        });
      } else if (res.status === 409) {
        setErrors({ email: "emailTaken" });
      } else {
        setFormError(t("common.somethingWrong"));
      }
    } catch {
      setFormError(t("common.offline"));
    }
    setPending(false);
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
      <TextField
        name="fullName"
        label={t("fields.fullName")}
        icon="/assets/onboarding/icon-person.svg"
        autoComplete="name"
        value={values.fullName}
        onChange={handleChange}
        error={message(errors.fullName)}
      />
      <TextField
        name="email"
        type="email"
        label={t("fields.email")}
        icon="/assets/onboarding/icon-email.svg"
        autoComplete="email"
        value={values.email}
        onChange={handleChange}
        error={message(errors.email)}
      />
      <PasswordField
        name="password"
        label={t("fields.password")}
        autoComplete="new-password"
        value={values.password}
        onChange={handleChange}
        error={message(errors.password)}
      />
      <PasswordField
        name="confirmPassword"
        label={t("fields.confirmPassword")}
        autoComplete="new-password"
        value={values.confirmPassword}
        onChange={handleChange}
        error={message(errors.confirmPassword)}
      />
      {formError && (
        <p role="alert" className="text-caption text-danger">
          {formError}
        </p>
      )}
      <Button type="submit" variant="primary" className="h-12 w-full" disabled={pending}>
        {t("common.continue")}
      </Button>
    </form>
  );
}
