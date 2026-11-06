// Sign-up form rules. The backend should check the same rules again.

export type SignUpValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type SignUpErrors = Partial<Record<keyof SignUpValues, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_PASSWORD_LENGTH = 8;

export function validateSignUp(values: SignUpValues): SignUpErrors {
  const errors: SignUpErrors = {};

  if (values.fullName.trim().length < 2) {
    errors.fullName = "Enter your full name";
  }
  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Enter a valid email address";
  }
  if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords don’t match";
  }

  return errors;
}
