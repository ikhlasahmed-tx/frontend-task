import { afterEach, expect, test, vi } from "vitest";
import { apiFetch, getAccessToken, setAccessToken } from "@/lib/api";

const json = (status: number, body: unknown = {}) => new Response(JSON.stringify(body), { status });

// A fake backend: /api/me accepts only "fresh", /api/auth/refresh hands out "fresh" (or fails).
function mockBackend(refreshOk = true) {
  const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
    if (url === "/api/auth/refresh") return refreshOk ? json(200, { accessToken: "fresh" }) : json(401);
    const auth = new Headers(init?.headers).get("Authorization");
    return auth === "Bearer fresh" ? json(200, { ok: true }) : json(401);
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}
const refreshCalls = (m: ReturnType<typeof mockBackend>) => m.mock.calls.filter(([url]) => url === "/api/auth/refresh").length;

afterEach(() => {
  vi.unstubAllGlobals();
  setAccessToken("");
});

test("sends the token and does not refresh when it works", async () => {
  const backend = mockBackend();
  setAccessToken("fresh");
  expect((await apiFetch("/api/me", { headers: { "Content-Type": "application/json" } })).status).toBe(200);
  expect(new Headers(backend.mock.calls[0]![1]!.headers).get("Content-Type")).toBe("application/json");
  expect(refreshCalls(backend)).toBe(0);
});

test("a 401 refreshes once and retries with the new token", async () => {
  const backend = mockBackend();
  setAccessToken("expired");
  expect((await apiFetch("/api/me")).status).toBe(200);
  expect(getAccessToken()).toBe("fresh");
  expect(refreshCalls(backend)).toBe(1);
});

test("parallel 401s share one refresh", async () => {
  const backend = mockBackend();
  const results = await Promise.all([apiFetch("/api/me"), apiFetch("/api/me"), apiFetch("/api/me/wallet")]);
  expect(results.map((r) => r.status)).toEqual([200, 200, 200]);
  expect(refreshCalls(backend)).toBe(1);
});

test("if the refresh fails, the caller gets the original 401 and nothing is retried", async () => {
  const backend = mockBackend(false);
  expect((await apiFetch("/api/me")).status).toBe(401);
  expect(backend).toHaveBeenCalledTimes(2);
  // The next call may try again: a failed refresh is not cached.
  await apiFetch("/api/me");
  expect(refreshCalls(backend)).toBe(2);
});
