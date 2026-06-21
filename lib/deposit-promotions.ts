import { API_PREFIX, authFetchData } from "@/lib/auth/auth-fetch";

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
  const q =
    amount != null && Number.isFinite(amount) ? `?amount=${encodeURIComponent(amount)}` : "";

  return authFetchData<DepositPromotion[]>(`/promotions/deposit${q}`);
}

export async function fetchPublicDepositPromotions(): Promise<DepositPromotion[]> {
  const res = await fetch(`${API_PREFIX}/promotions/deposit/public`, {
    credentials: "include",
  });
  const body = (await res.json()) as {
    success?: boolean;
    message?: string;
    data?: DepositPromotion[];
  };
  if (!res.ok || !body.success || !body.data) {
    throw new Error(body.message || "Failed to load promotions");
  }
  return body.data.filter((promo) => promo.code !== DEFAULT_PROMO_CODE);
}

export function isValidPromoCode(code: string, promotions: DepositPromotion[]): boolean {
  return promotions.some((p) => p.code === code);
}
