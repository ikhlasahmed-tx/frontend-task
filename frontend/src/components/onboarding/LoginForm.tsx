"use client";

import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { Button } from "@/components/ui/Button";
import { PasswordField } from "@/components/ui/PasswordField";
import { TextField } from "@/components/ui/TextField";
import { validateLogin, type LoginErrors, type LoginValues } from "@/lib/validation";

export function LoginForm() {
  const router = useRouter();
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
        router.push("/");
        return;
      }
      setFormError(res.status === 401 ? "Email or password is incorrect" : "Something went wrong. Try again.");
    } catch {
      setFormError("Can't reach the server. Check your connection and try again.");
    }
    setPending(false);
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
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
        autoComplete="current-password"
        value={values.password}
        onChange={handleChange}
        error={errors.password}
      />
      {formError && (
        <p role="alert" className="text-caption text-danger">
          {formError}
        </p>
      )}
      <Button type="submit" variant="primary" className="h-12 w-full" disabled={pending}>
        Log in
      </Button>
    </form>
  );
}
