import { QuickActions } from "@/components/home/QuickActions";
import { RemainingSteps } from "@/components/home/RemainingSteps";
import { TopBar } from "@/components/home/TopBar";
import { TransactionsEmpty } from "@/components/home/TransactionsEmpty";
import { VerificationProgress } from "@/components/home/VerificationProgress";
import { WalletPerformance } from "@/components/home/WalletPerformance";
import { WalletSummary } from "@/components/home/WalletSummary";
import { setupSteps, solPerformance, wallet } from "@/lib/data";

export default function Home() {
  // The Sidebar and the <main> wrapper come from (dashboard)/layout.tsx.
  return (
    <>
      <TopBar title="Home" />

      <div className="flex">
        {/* Left column: verification progress, then remaining steps */}
        <div className="flex min-w-0 flex-1 flex-col border-r-[0.2px] border-neutral-400">
          <VerificationProgress steps={setupSteps} />
          <RemainingSteps steps={setupSteps} />
        </div>

        {/* Right column: wallet summary, then quick actions */}
        <div className="flex w-[404px] shrink-0 flex-col">
          <WalletSummary wallet={wallet} />
          <QuickActions />
        </div>
      </div>

      <div className="flex">
        <div className="min-w-0 flex-1 border-r-[0.2px] border-neutral-400">
          <WalletPerformance token={solPerformance} />
        </div>
        <div className="flex min-w-0 flex-1">
          <TransactionsEmpty />
        </div>
      </div>
    </>
  );
}
