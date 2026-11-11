"use client";

import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { PasswordField } from "@/components/ui/PasswordField";
import { TextField } from "@/components/ui/TextField";
import { validateSignUp, type SignUpErrors, type SignUpValues } from "@/lib/validation";

const emptyValues: SignUpValues = { fullName: "", email: "", password: "", confirmPassword: "" };

export function SignUpForm() {
  const router = useRouter();
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
        router.push("/verify-email");
        return;
      }
      if (res.status === 400) {
        // The backend's field names match this form's (fullName, email, password).
        setErrors((await res.json()).fields ?? {});
      } else if (res.status === 409) {
        setErrors({ email: "An account with this email already exists" });
      } else {
        setFormError("Something went wrong. Try again.");
      }
    } catch {
      setFormError("Can't reach the server. Check your connection and try again.");
    }
    setPending(false);
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
      {formError && (
        <p role="alert" className="text-caption text-danger">
          {formError}
        </p>
      )}
      <Button type="submit" variant="primary" className="h-12 w-full" disabled={pending}>
        Continue
      </Button>
    </form>
  );
}
