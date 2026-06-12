import type { ApiResponse } from "@/lib/api/types";
import { readAuthSession } from "@/lib/auth/session";

const API_PREFIX = "/api/v1";

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

async function authFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const session = readAuthSession();
  if (!session?.accessToken) {
    throw new Error("Please log in to continue");
  }

  const res = await fetch(`${API_PREFIX}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
      ...(init?.headers ?? {}),
    },
  });

  const body = (await res.json()) as ApiResponse<T>;
  if (!res.ok || !body.success) {
    throw new Error(body.message || "Request failed");
  }
  return body.data as T;
}

export async function fetchSignInRewardStatus(): Promise<SignInRewardStatus> {
  return authFetch<SignInRewardStatus>("/sign-in-reward/status");
}

export async function claimSignInReward(): Promise<SignInClaimResult> {
  return authFetch<SignInClaimResult>("/sign-in-reward/claim", { method: "POST" });
}
