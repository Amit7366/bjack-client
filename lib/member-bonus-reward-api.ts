import { authFetchData } from "@/lib/auth/auth-fetch";

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

export async function fetchMemberBonusRewardStatus(): Promise<MemberBonusRewardStatus> {
  return authFetchData<MemberBonusRewardStatus>("/member-bonus-reward/status");
}

export async function claimMemberBonusReward(): Promise<MemberBonusClaimResult> {
  return authFetchData<MemberBonusClaimResult>("/member-bonus-reward/claim", { method: "POST" });
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
