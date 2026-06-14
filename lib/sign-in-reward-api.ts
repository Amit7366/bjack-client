import { authFetchData } from "@/lib/auth/auth-fetch";

export type SignInDayStatus = "claimed" | "current" | "locked";

export type SignInDayView = {
  day: number;
  bonus: number;
  status: SignInDayStatus;
};

export type SignInRewardStatus = {
  lastSignIn: string | null;
  lastClaimedDay: number;
  totalBonusClaimed: number;
  minimumDepositRequired: number;
  totalDeposit: number;
  minimumDepositMet: boolean;
  canClaimToday: boolean;
  claimedToday: boolean;
  currentDay: number;
  days: SignInDayView[];
};

export type SignInClaimResult = {
  dayClaimed: number;
  bonusAmount: number;
  turnoverRequired: number;
  balance: string;
  totalBonusClaimed: number;
  lastSignIn: string;
  nextDay: number;
};

export async function fetchSignInRewardStatus(): Promise<SignInRewardStatus> {
  return authFetchData<SignInRewardStatus>("/sign-in-reward/status");
}

export async function claimSignInReward(): Promise<SignInClaimResult> {
  return authFetchData<SignInClaimResult>("/sign-in-reward/claim", { method: "POST" });
}
