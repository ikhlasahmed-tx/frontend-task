// Mock data for the Home screen, matching the Figma design.
// Replace with real API data later.

export type Wallet = {
  name: string;
  address: string;
  avatarInitial: string;
  balanceUsd: number;
};

// Steps still to do have a title, description and action under home.steps.<id> in the dictionaries;
// "account" is always done and only has a title.
export type PendingStepId = "identity" | "top-up" | "swap";

export type SetupStep = {
  id: "account" | PendingStepId;
  done: boolean;
};

export const setupSteps: SetupStep[] = [
  { id: "account", done: true },
  { id: "identity", done: false },
  { id: "top-up", done: false },
  { id: "swap", done: false },
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
