// The access token lives only in memory, never in localStorage where any script could read it.
// A full page load loses it; the refresh_token cookie gets a new one.
let accessToken = "";
let refreshing: Promise<boolean> | null = null;

export const getAccessToken = () => accessToken;
export const setAccessToken = (token: string) => {
  accessToken = token;
};

async function refresh() {
  const res = await fetch("/api/auth/refresh", { method: "POST" });
  if (!res.ok) return false;
  setAccessToken((await res.json()).accessToken);
  return true;
}

// Two refreshes with the same cookie look like a stolen token to the backend and end the session,
// so refreshes run one at a time: shared within a tab, and behind a Web Lock across tabs.
// navigator.locks is missing outside secure contexts (e.g. http://192.168.x.x on a phone); then only the tab-level guard applies.
export function refreshAccessToken() {
  refreshing ??= (async () => (navigator.locks ? await navigator.locks.request("swarppay-refresh", refresh) : refresh()))().finally(() => {
    refreshing = null;
  });
  return refreshing;
}

// fetch for routes that need the user: adds the access token, and on a 401 refreshes it once and retries.
// Browser only: on the server this module is shared between requests.
export async function apiFetch(input: string, init: RequestInit = {}) {
  const send = () => {
    const headers = new Headers(init.headers);
    headers.set("Authorization", `Bearer ${accessToken}`);
    return fetch(input, { ...init, headers });
  };
  const res = await send();
  if (res.status !== 401 || !(await refreshAccessToken())) return res;
  return send();
}
