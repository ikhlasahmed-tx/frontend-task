import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { OnboardingProvider } from "@/components/onboarding/OnboardingProvider";
import { localePath } from "@/i18n/config";

// The tests run as a Russian user: every screen is opened under /ru and every redirect must stay under /ru.
const nav = vi.hoisted(() => {
  const replace = vi.fn();
  return { pathname: "/", replace, router: { replace } };
});
vi.mock("next/navigation", () => ({
  usePathname: () => nav.pathname,
  useParams: () => ({ lang: "ru" }),
  useRouter: () => nav.router,
}));

afterEach(() => {
  cleanup();
  nav.replace.mockReset();
  vi.unstubAllGlobals();
});

const me = (citizenship: string | null, wallet: boolean, hasPasscode = false) => ({
  status: 200,
  body: { user: { email: "a@b.co", citizenship, hasPasscode }, wallet: wallet ? {} : null },
});
const loggedOut = { status: 401, body: { error: "Not logged in" } };

// [what GET /api/me answers, the screen opened, where the user is sent (null = stays)]
const cases: [string, { status: number; body: unknown }, string, string | null][] = [
  ["logged out", loggedOut, "/citizenship", "/login"],
  ["new user may see the email code screen", me(null, false), "/verify-email", null],
  ["new user may pick a country", me(null, false), "/citizenship", null],
  ["no country: wallet screen sends back", me(null, false), "/creating-wallet", "/citizenship"],
  ["no country: passcode screen sends back", me(null, false), "/passcode", "/citizenship"],
  ["country saved: wallet screen is open", me("PK", false), "/creating-wallet", null],
  ["no wallet: passcode screen sends back", me("PK", false), "/passcode", "/creating-wallet"],
  ["wallet made: passcode screen is open", me("PK", true), "/passcode", null],
  ["wallet made: earlier screens stay open", me("PK", true), "/citizenship", null],
  ["confirm without a typed passcode (refresh)", me("PK", true), "/confirm-passcode", "/passcode"],
  ["onboarding finished", me("PK", true, true), "/citizenship", "/"],
];

test.each(cases)("%s", async (_name, answer, pathname, expected) => {
  const fetchMock = vi.fn().mockResolvedValue({
    status: answer.status,
    ok: answer.status === 200,
    json: async () => answer.body,
  });
  vi.stubGlobal("fetch", fetchMock);
  nav.pathname = localePath("ru", pathname); // e.g. "/ru/citizenship"

  render(<OnboardingProvider>{null}</OnboardingProvider>);

  await waitFor(() => expect(fetchMock).toHaveBeenCalledWith("/api/me"));
  if (expected) await waitFor(() => expect(nav.replace).toHaveBeenCalledWith(localePath("ru", expected)));
  else {
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(nav.replace).not.toHaveBeenCalled();
  }
});

test("sign-up and login don't ask the backend", () => {
  const fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
  nav.pathname = "/ru/signup";
  render(<OnboardingProvider>{null}</OnboardingProvider>);
  expect(fetchMock).not.toHaveBeenCalled();
});
