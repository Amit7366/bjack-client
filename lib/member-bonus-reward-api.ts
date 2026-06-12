import type { ApiResponse } from "@/lib/api/types";
import { readAuthSession } from "@/lib/auth/session";

const API_PREFIX = "/api/v1";

export type MemberBonusRewardStatus = {
  bonusAmount: number;
  cooldownDays: number;
  canClaim: boolean;
  lastClaimedAt: string | null;
  nextClaimAt: string | null;
  remainingMs: number;
  totalBonusClaimed: number;
  claimCount: number;
};

export type MemberBonusClaimResult = {
  bonusAmount: number;
  turnoverRequired: number;
  balance: string;
  lastClaimedAt: string;
  nextClaimAt: string | null;
  totalBonusClaimed: number;
  claimCount: number;
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

export async function fetchMemberBonusRewardStatus(): Promise<MemberBonusRewardStatus> {
  return authFetch<MemberBonusRewardStatus>("/member-bonus-reward/status");
}

export async function claimMemberBonusReward(): Promise<MemberBonusClaimResult> {
  return authFetch<MemberBonusClaimResult>("/member-bonus-reward/claim", { method: "POST" });
}

export function remainingFromMs(ms: number): { days: number; clock: string } {
  const diff = Math.max(0, ms);
  const days = Math.floor(diff / 86_400_000);
  const rest = diff - days * 86_400_000;
  const h = Math.floor(rest / 3_600_000);
  const mn = Math.floor((rest % 3_600_000) / 60_000);
  const s = Math.floor((rest % 60_000) / 1000);
  const pad = (v: number) => String(v).padStart(2, "0");
  return { days, clock: `${pad(h)}:${pad(mn)}:${pad(s)}` };
}
