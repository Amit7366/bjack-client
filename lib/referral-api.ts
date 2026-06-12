import type { ApiResponse } from "@/lib/api/types";
import { readAuthSession } from "@/lib/auth/session";

const API_PREFIX = "/api/v1";

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
  const session = readAuthSession();
  if (!session?.accessToken) {
    throw new Error("Please log in to continue");
  }

  const res = await fetch(`${API_PREFIX}/referral/me`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    credentials: "include",
  });

  const body = (await res.json()) as ApiResponse<MyReferralSummary>;
  if (!res.ok || !body.success || !body.data) {
    throw new Error(body.message || "Failed to load referral summary");
  }

  return body.data;
}
