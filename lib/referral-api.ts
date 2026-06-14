import { authFetchData } from "@/lib/auth/auth-fetch";

export type ReferredUserRow = {
  userId: string;
  username: string;
  totalDeposit: number;
  referredAt: string;
  turnoverCompleted: number;
  turnoverRequired: number;
  rewardPaid: boolean;
};

export type MyReferralSummary = {
  referralId: string;
  activeDownline: number;
  inviteCount: number;
  totalRewards: number;
  downlineTurnover: number;
  rewards: number;
  earnedReward: number;
  referredUsers: ReferredUserRow[];
};

export function buildReferralRegisterLink(locale: string, referralId: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/${locale}/register?refId=${encodeURIComponent(referralId)}`;
}

export function buildReferralQrUrl(link: string, size = 200): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(link)}`;
}

export async function fetchMyReferralSummary(): Promise<MyReferralSummary> {
  return authFetchData<MyReferralSummary>("/referral/me");
}
