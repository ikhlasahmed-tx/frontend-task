"use client";

import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";
import { Button } from "@/components/ui/Button";
import { PasswordField } from "@/components/ui/PasswordField";
import { TextField } from "@/components/ui/TextField";
import { validateSignUp, type SignUpErrors, type SignUpValues } from "@/lib/validation";

const emptyValues: SignUpValues = { fullName: "", email: "", password: "", confirmPassword: "" };

export function SignUpForm() {
  const router = useRouter();
  const { update: updateOnboarding } = useOnboarding();
  const [values, setValues] = useState<SignUpValues>(emptyValues);
  const [errors, setErrors] = useState<SignUpErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const next = { ...values, [event.target.name]: event.target.value };
    setValues(next);
    if (submitted) setErrors(validateSignUp(next));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);

    const nextErrors = validateSignUp(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // TODO (backend): POST /api/auth/register with `values`
    updateOnboarding({ email: values.email.trim() }); // the OTP screen shows this email
    router.push("/verify-email");
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
      <TextField
        name="fullName"
        label="Full name"
        icon="/assets/onboarding/icon-person.svg"
        autoComplete="name"
        value={values.fullName}
        onChange={handleChange}
        error={errors.fullName}
      />
      <TextField
        name="email"
        type="email"
        label="Email address"
        icon="/assets/onboarding/icon-email.svg"
        autoComplete="email"
        value={values.email}
        onChange={handleChange}
        error={errors.email}
      />
      <PasswordField
        name="password"
        label="Password"
        autoComplete="new-password"
        value={values.password}
        onChange={handleChange}
        error={errors.password}
      />
      <PasswordField
        name="confirmPassword"
        label="Confirm password"
        autoComplete="new-password"
        value={values.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
      />
      <Button type="submit" variant="primary" className="h-12 w-full">
        Continue
      </Button>
    </form>
  );
}
