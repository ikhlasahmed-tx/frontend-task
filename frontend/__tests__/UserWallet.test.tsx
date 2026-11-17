import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { UserWalletIdentity } from "@/components/home/UserWallet";

const nav = vi.hoisted(() => {
  const replace = vi.fn();
  return { replace, router: { replace } };
});
vi.mock("next/navigation", () => ({
  useParams: () => ({ lang: "ru" }),
  useRouter: () => nav.router,
}));

afterEach(() => {
  cleanup();
  nav.replace.mockReset();
  vi.unstubAllGlobals();
});

// Every request (including /api/auth/refresh) gets this answer.
function backendAnswers(status: number, body: unknown = {}) {
  vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify(body), { status })));
}
const me = (citizenship: string | null, wallet: boolean, hasPasscode: boolean) => ({
  user: { fullName: "ali khan", citizenship, hasPasscode },
  wallet: wallet ? { name: "My Wallet", address: "4M5YxQk8p3nT2vRbW9cJhL6sDfG1aZeU7yNmK2qPiVtX", balanceUsd: 12 } : null,
});

test.each([
  ["logged out", 401, {}, "/ru/login"],
  ["no country yet", 200, me(null, false, false), "/ru/citizenship"],
  ["country but no wallet", 200, me("PK", false, false), "/ru/creating-wallet"],
  ["wallet but no passcode", 200, me("PK", true, false), "/ru/passcode"],
])("%s: sends the user to %s", async (_name, status, body, expected) => {
  backendAnswers(status, body);
  render(<UserWalletIdentity />);
  await waitFor(() => expect(nav.replace).toHaveBeenCalledWith(expected));
});

test("onboarded user: shows the wallet with a shortened address", async () => {
  backendAnswers(200, me("PK", true, true));
  render(<UserWalletIdentity />);
  expect(await screen.findByText("My Wallet")).toBeTruthy();
  expect(screen.getByText("4M5Yx...PiVtX")).toBeTruthy();
  expect(screen.getByText("A")).toBeTruthy();
  expect(nav.replace).not.toHaveBeenCalled();
});
