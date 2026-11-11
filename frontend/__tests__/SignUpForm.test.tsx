import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { SignUpForm } from "@/components/onboarding/SignUpForm";
import en from "@/i18n/dictionaries/en.json";
import { I18nProvider } from "@/i18n/I18nProvider";

vi.mock("next/navigation", () => ({
  useParams: () => ({ lang: "en" }),
  useRouter: () => ({ push: vi.fn() }),
}));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function submitValidForm(status: number, body: unknown) {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status, json: async () => body }));
  render(
    <I18nProvider locale="en" dictionary={en}>
      <SignUpForm />
    </I18nProvider>,
  );
  const type = (placeholder: string, value: string) =>
    fireEvent.change(screen.getByPlaceholderText(placeholder), { target: { value } });
  type("Full name", "Test User");
  type("Email address", "test@example.com");
  type("Password", "password123");
  type("Confirm password", "password123");
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
}

test("a 400 shows the form's own messages, not the backend's text", async () => {
  submitValidForm(400, {
    error: "Validation failed",
    fields: { fullName: "backend text", password: "backend text" },
  });

  expect(await screen.findByText("Enter your full name")).toBeTruthy();
  expect(screen.getByText("Password is too long")).toBeTruthy();
  expect(screen.queryByText("backend text")).toBeNull();
  expect(screen.queryByText("Enter a valid email address")).toBeNull(); // only the fields the backend named
});

test("a 409 shows the taken-email message under the email field", async () => {
  submitValidForm(409, { error: "An account with this email already exists" });

  expect(await screen.findByText("An account with this email already exists")).toBeTruthy();
});
