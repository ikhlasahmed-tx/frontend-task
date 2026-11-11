// Mock data for the Home screen, matching the Figma design.
// Replace with real API data later.

export type Wallet = {
  name: string;
  address: string;
  avatarInitial: string;
  balanceUsd: number;
};

export type SetupStep = {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
  done: boolean;
};

export const setupSteps: SetupStep[] = [
  {
    id: "account",
    title: "Account created",
    description: "",
    actionLabel: "",
    done: true,
  },
  {
    id: "identity",
    title: "Verify your identity",
    description: "To unlock fiat deposits, higher limits & rewards, verify your identity in 2 minutes.",
    actionLabel: "Verify identity",
    done: false,
  },
  {
    id: "top-up",
    title: "Top up your wallet",
    description: "Top your wallet with Fiat or by depositing Crypto.",
    actionLabel: "Top up wallet",
    done: false,
  },
  {
    id: "swap",
    title: "Swap your first fiat / crypto",
    description: "Jump start your fiat / crypto portfolio.",
    actionLabel: "Swap now",
    done: false,
  },
];

export type TokenPerformance = {
  name: string;
  symbol: string;
  valueUsd: number;
  changeUsd: number;
  changePercent: number;
};

export const solPerformance: TokenPerformance = {
  name: "Solana",
  symbol: "SOL",
  valueUsd: 240.75,
  changeUsd: 12.35,
  changePercent: 5.4,
};
