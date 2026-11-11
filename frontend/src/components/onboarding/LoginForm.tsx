"use client";

import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { PasswordField } from "@/components/ui/PasswordField";
import { TextField } from "@/components/ui/TextField";
import { useLocalePath } from "@/i18n/useLocalePath";
import {
  MIN_PASSWORD_LENGTH,
  validateLogin,
  type LoginErrors,
  type ValidationMessage,
  type LoginValues,
} from "@/lib/validation";

export function LoginForm() {
  const router = useRouter();
  const path = useLocalePath();
  const { t } = useTranslation();
  const message = (key?: ValidationMessage) => key && t(`validation.${key}`, { min: MIN_PASSWORD_LENGTH });
  const [values, setValues] = useState<LoginValues>({ email: "", password: "" });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const next = { ...values, [event.target.name]: event.target.value };
    setValues(next);
    if (submitted) setErrors(validateLogin(next));
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);

    const nextErrors = validateLogin(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setFormError("");
    setPending(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        // Stays pending while the next page loads, so the button can't be pressed twice.
        router.push(path("/"));
        return;
      }
      setFormError(res.status === 401 ? t("login.wrongCredentials") : t("common.somethingWrong"));
    } catch {
      setFormError(t("common.offline"));
    }
    setPending(false);
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
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
        autoComplete="current-password"
        value={values.password}
        onChange={handleChange}
        error={message(errors.password)}
      />
      {formError && (
        <p role="alert" className="text-caption text-danger">
          {formError}
        </p>
      )}
      <Button type="submit" variant="primary" className="h-12 w-full" disabled={pending}>
        {t("login.submit")}
      </Button>
    </form>
  );
}
