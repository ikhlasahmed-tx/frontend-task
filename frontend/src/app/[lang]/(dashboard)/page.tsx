import { QuickActions } from "@/components/home/QuickActions";
import { RemainingSteps } from "@/components/home/RemainingSteps";
import { TopBar } from "@/components/home/TopBar";
import { TransactionsEmpty } from "@/components/home/TransactionsEmpty";
import { VerificationProgress } from "@/components/home/VerificationProgress";
import { WalletPerformance } from "@/components/home/WalletPerformance";
import { WalletSummary } from "@/components/home/WalletSummary";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getLocalePath, getT } from "@/i18n/server";
import { BACKEND_URL } from "@/lib/backend-url";
import { setupSteps, solPerformance } from "@/lib/data";

// The logged-in user's wallet from the backend. Sends the user away if there is no session or no wallet yet.
async function UserWalletSummary() {
  const path = await getLocalePath();
  const res = await fetch(`${BACKEND_URL}/api/me`, { headers: { Cookie: (await cookies()).toString() } });
  if (res.status === 401) redirect(path("/login"));
  if (!res.ok) throw new Error(`GET /api/me failed with ${res.status}`);

  const { user, wallet } = await res.json();
  if (!wallet) redirect(path(user.citizenship ? "/creating-wallet" : "/citizenship"));
  if (!user.hasPasscode) redirect(path("/passcode"));

  return (
    <WalletSummary
      wallet={{
        name: wallet.name,
        address: `${wallet.address.slice(0, 5)}...${wallet.address.slice(-5)}`,
        avatarInitial: user.fullName[0].toUpperCase(),
        balanceUsd: wallet.balanceUsd,
      }}
    />
  );
}

export default async function Home() {
  const t = await getT();

  // The Sidebar and the <main> wrapper come from (dashboard)/layout.tsx.
  return (
    <>
      <TopBar title={t("home.title")} />

      {/* Columns stack below lg (1024px) and sit side by side above it */}
      <div className="flex flex-col lg:flex-row">
        {/* Left column: verification progress, then remaining steps */}
        <div className="flex min-w-0 flex-1 flex-col border-neutral-400 lg:border-r-[0.2px]">
          <VerificationProgress steps={setupSteps} />
          <RemainingSteps steps={setupSteps} />
        </div>

        {/* Right column: wallet summary, then quick actions */}
        <div className="flex shrink-0 flex-col lg:w-[404px]">
          {/* Shown empty while the user's wallet loads */}
          <Suspense fallback={<WalletSummary wallet={{ name: "", address: "", avatarInitial: "", balanceUsd: 0 }} />}>
            <UserWalletSummary />
          </Suspense>
          <QuickActions />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Divider sits below the chart when stacked, beside it when side by side */}
        <div className="min-w-0 flex-1 border-b-[0.2px] border-neutral-400 lg:border-r-[0.2px] lg:border-b-0">
          <WalletPerformance token={solPerformance} />
        </div>
        <div className="flex min-w-0 flex-1">
          <TransactionsEmpty />
        </div>
      </div>
    </>
  );
}
