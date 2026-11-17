import { QuickActions } from "@/components/home/QuickActions";
import { RemainingSteps } from "@/components/home/RemainingSteps";
import { TopBar } from "@/components/home/TopBar";
import { TransactionsEmpty } from "@/components/home/TransactionsEmpty";
import { UserWalletIdentity, UserWalletSummary } from "@/components/home/UserWallet";
import { VerificationProgress } from "@/components/home/VerificationProgress";
import { WalletPerformance } from "@/components/home/WalletPerformance";
import { getT } from "@/i18n/server";
import { setupSteps, solPerformance } from "@/lib/data";

export default async function Home() {
  const t = await getT();

  // The Sidebar and the <main> wrapper come from (dashboard)/layout.tsx.
  return (
    <>
      <TopBar
        title={t("home.title")}
        // Shown empty while the user's wallet loads, like the wallet section
        identity={<UserWalletIdentity />}
      />

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
          <UserWalletSummary />
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
