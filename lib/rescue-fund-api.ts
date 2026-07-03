import { authFetchData, authFetchJson } from "@/lib/auth/auth-fetch";

export type RescueFundVariant = "sports" | "loss-compensation";

export type RescueFundTierRow = {
  deposit: string;
  netLoss: string;
  bonus: string;
  points: string;
  ticket: string;
  minNetLoss: number;
};

export type RescueFundStatus = {
  variant: RescueFundVariant;
  dayKey: string;
  totalLoss: number;
  receivableAmount: number;
  claimedAmount: number;
  claimable: number;
  canClaim: boolean;
  depositAmount: number;
  totalBet: number;
  totalWin: number;
  sportsRules: {
    minNetLoss: number;
    bonusRatePercent: number;
    depositAmount: number;
    netLossThreshold: string;
    bonusRate: string;
    pointRate: string;
    ticket: string;
  } | null;
  lossCompensationTiers: RescueFundTierRow[];
  qualifiedTierMinNetLoss: number | null;
};

export type RescueFundClaimResult = {
  claim: {
    id: string;
    variant: RescueFundVariant;
    dayKey: string;
    claimedAmount: number;
    totalLoss: number;
    receivableAmount: number;
    turnoverRequired: number;
    createdAt: string;
  };
  balance: string;
  status: RescueFundStatus;
};

export async function fetchRescueFundStatus(
  variant: RescueFundVariant,
  day?: string,
): Promise<RescueFundStatus> {
  const query = day ? `?day=${encodeURIComponent(day)}` : "";
  return authFetchData<RescueFundStatus>(`/rescue-fund/${variant}${query}`);
}

export async function claimRescueFund(variant: RescueFundVariant): Promise<RescueFundClaimResult> {
  const { ok, body } = await authFetchJson<RescueFundClaimResult>(
    `/rescue-fund/${variant}/claim`,
    { method: "POST" },
  );
  if (!ok || !body.data) {
    throw new Error(body.message || "Failed to claim rescue fund reward");
  }
  return body.data;
}

export async function fetchRescueFundClaimableCount(): Promise<number> {
  const data = await authFetchData<{ claimableCount: number }>("/rescue-fund/summary");
  return Number(data.claimableCount ?? 0);
}
