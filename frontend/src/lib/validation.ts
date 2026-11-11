// Sign-up form rules. The backend should check the same rules again.
import type en from "@/i18n/dictionaries/en.json";

export type SignUpValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

// The rules return message keys, not text; the form shows t(`validation.${key}`) in the page's language.
export type ValidationMessage = keyof typeof en.validation;

export type SignUpErrors = Partial<Record<keyof SignUpValues, ValidationMessage>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_PASSWORD_LENGTH = 8;

export function validateSignUp(values: SignUpValues): SignUpErrors {
  const errors: SignUpErrors = {};

  if (values.fullName.trim().length < 2) {
    errors.fullName = "fullName";
  }
  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "email";
  }
  if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = "passwordShort";
  }
  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "passwordMismatch";
  }

  return errors;
}

export type LoginValues = Pick<SignUpValues, "email" | "password">;
export type LoginErrors = Partial<Record<keyof LoginValues, ValidationMessage>>;

// No length rule here: existing accounts are checked by the backend, not re-validated.
export function validateLogin(values: LoginValues): LoginErrors {
  const errors: LoginErrors = {};

  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "email";
  }
  if (!values.password) {
    errors.password = "passwordRequired";
  }

  return errors;
}
