"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { WalletIdentity } from "@/components/home/WalletIdentity";
import { WalletSummary } from "@/components/home/WalletSummary";
import { useLocalePath } from "@/i18n/useLocalePath";
import { apiFetch } from "@/lib/api";
import type { Wallet } from "@/lib/data";

type MeBody = {
  user: { fullName: string; citizenship: string | null; hasPasscode: boolean };
  wallet: { name: string; address: string; balanceUsd: number } | null;
};

const emptyWallet: Wallet = { name: "", address: "", avatarInitial: "", balanceUsd: 0 };

// Loaded in the browser, because the access token lives only in browser memory.
// The top bar and the wallet section mount together and share this one request.
let loading: Promise<{ status: number; body: MeBody | null }> | null = null;

function loadMe() {
  loading ??= apiFetch("/api/me")
    .then(async (res) => ({ status: res.status, body: res.ok ? ((await res.json()) as MeBody) : null }))
    .finally(() => {
      loading = null;
    });
  return loading;
}

// The logged-in user's wallet. Sends the user away if there is no session or no wallet yet; empty while loading.
function useUserWallet() {
  const router = useRouter();
  const path = useLocalePath();
  const [wallet, setWallet] = useState(emptyWallet);
  const [error, setError] = useState<unknown>();
  // Rethrown so the error page shows, rather than a $0 balance that looks real.
  if (error) throw error;

  useEffect(() => {
    let active = true;
    loadMe().then(({ status, body }) => {
      if (!active) return;
      if (status === 401) return router.replace(path("/login"));
      if (!body) return setError(new Error(`GET /api/me failed with ${status}`));

      const { user, wallet } = body;
      if (!wallet) return router.replace(path(user.citizenship ? "/creating-wallet" : "/citizenship"));
      if (!user.hasPasscode) return router.replace(path("/passcode"));
      setWallet({
        name: wallet.name,
        address: `${wallet.address.slice(0, 5)}...${wallet.address.slice(-5)}`,
        avatarInitial: user.fullName[0]!.toUpperCase(),
        balanceUsd: wallet.balanceUsd,
      });
    }, setError);
    return () => {
      active = false;
    };
  }, [router, path]);

  return wallet;
}

export function UserWalletSummary() {
  return <WalletSummary wallet={useUserWallet()} />;
}

export function UserWalletIdentity() {
  return <WalletIdentity wallet={useUserWallet()} />;
}
