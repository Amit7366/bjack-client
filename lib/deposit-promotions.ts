import type { ApiResponse } from "@/lib/api/types";
import { readAuthSession } from "@/lib/auth/session";

const API_PREFIX = "/api/v1";

export type DepositPromotion = {
  code: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  minDeposit: number;
  bonusRate: number;
  fixedBonus?: number;
  turnoverX: number;
  eligibleGames: string[];
  usageType: string;
  maxBonusCap?: number;
  maxWithdrawLimit: number | null;
  validFrom: string;
  validTo: string;
  isValid: boolean;
};

export const DEFAULT_PROMO_CODE = "NO_PROMO";

export function hasSelectedPromotion(code: string): boolean {
  return code !== DEFAULT_PROMO_CODE;
}

export function getMinimumDepositAmount(
  promoCode: string,
  promoMinDeposit: number,
): number {
  const siteMin = 100;
  if (!hasSelectedPromotion(promoCode)) {
    return siteMin;
  }
  return Math.max(siteMin, promoMinDeposit);
}

export function getPromotionLabel(promo: DepositPromotion, isBn: boolean): string {
  return isBn ? promo.titleBn : promo.title;
}

export function getPromotionDescription(promo: DepositPromotion, isBn: boolean): string {
  return isBn ? promo.descriptionBn : promo.description;
}

export async function fetchDepositPromotions(
  amount?: number,
): Promise<DepositPromotion[]> {
  const session = readAuthSession();
  if (!session?.accessToken) {
    throw new Error("Please log in to continue");
  }

  const q =
    amount != null && Number.isFinite(amount) ? `?amount=${encodeURIComponent(amount)}` : "";

  const res = await fetch(`${API_PREFIX}/promotions/deposit${q}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    credentials: "include",
  });

  const body = (await res.json()) as ApiResponse<DepositPromotion[]>;
  if (!res.ok || !body.success || !body.data) {
    throw new Error(body.message || "Failed to load promotions");
  }
  return body.data;
}

export function isValidPromoCode(code: string, promotions: DepositPromotion[]): boolean {
  return promotions.some((p) => p.code === code);
}
