import { authFetchData } from "@/lib/auth/auth-fetch";
import type { Locale } from "@/lib/locale";

export type LocalizedText = {
  en: string;
  bn: string;
  hi: string;
};

export type RewardOfferCriteriaType = "none" | "daily_deposit" | "total_deposit" | "referral";

export type RewardOfferCriteriaProgress = {
  current: number;
  required: number;
};

export type RewardOfferView = {
  id: string;
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  bonusAmount: number;
  turnoverMultiplier: number;
  cooldownHours: number;
  criteriaType: RewardOfferCriteriaType;
  criteriaValue: number;
  sortOrder: number;
  canClaim: boolean;
  criteriaMet: boolean;
  criteriaProgress: RewardOfferCriteriaProgress | null;
  lastClaimedAt: string | null;
  nextClaimAt: string | null;
  remainingMs: number;
  claimCount: number;
  totalClaimed: number;
};

export type RewardOfferClaimResult = {
  offer: RewardOfferView;
  bonusAmount: number;
  turnoverRequired: number;
  balance: string;
};

export function pickLocalizedText(text: LocalizedText, locale: Locale): string {
  return text[locale] ?? text.en;
}

export async function fetchRewardOffers(): Promise<RewardOfferView[]> {
  return authFetchData<RewardOfferView[]>("/reward-offers");
}

export async function claimRewardOffer(offerId: string): Promise<RewardOfferClaimResult> {
  return authFetchData<RewardOfferClaimResult>(`/reward-offers/${offerId}/claim`, {
    method: "POST",
  });
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
