import {
  DEFAULT_PROMO_CODE,
  getPromotionDescription,
  getPromotionLabel,
  type DepositPromotion,
} from "@/lib/deposit-promotions";
import type { PromotionFilterId } from "@/lib/promotions-data";
import type { Locale } from "@/lib/locale";

export type PromotionDisplayItem = {
  id: string;
  code: string;
  title: string;
  description: string;
  categories: PromotionFilterId[];
  tags: string[];
  highlight?: string;
  badge?: string;
  validityStart: string;
  validityEnd: string;
  minDeposit: number;
  turnoverX: number;
  eligibleGames: string[];
  usageType: string;
  maxBonusCap?: number;
  theme: "slot" | "live" | "fishing" | "all" | "reload";
};

const THEME_GRADIENTS: Record<PromotionDisplayItem["theme"], string> = {
  slot: "from-[#7c3aed] via-[#5b21b6] to-[#2e1065]",
  live: "from-[#dc2626] via-[#b91c1c] to-[#7f1d1d]",
  fishing: "from-[#06b6d4] via-[#0891b2] to-[#164e63]",
  all: "from-[#178358] via-[#0d4a2e] to-[#052e16]",
  reload: "from-[#ca8a04] via-[#a16207] to-[#713f12]",
};

export function promotionThemeGradient(theme: PromotionDisplayItem["theme"]): string {
  return THEME_GRADIENTS[theme];
}

function depositPromoCategories(promo: DepositPromotion): PromotionFilterId[] {
  const cats: PromotionFilterId[] = [];
  const games = promo.eligibleGames;

  if (games.includes("slot")) cats.push("slots");
  if (games.includes("fishing")) cats.push("fishing");
  if (games.includes("live")) cats.push("liveCasino");
  if (games.includes("all")) {
    cats.push("welcome");
    cats.push("other");
  }
  if (promo.usageType === "daily" || promo.usageType === "always") {
    cats.push("other");
  }

  return [...new Set(cats)];
}

function pickTheme(promo: DepositPromotion): PromotionDisplayItem["theme"] {
  if (promo.usageType === "daily" || promo.usageType === "always") return "reload";
  if (promo.eligibleGames.includes("live")) return "live";
  if (promo.eligibleGames.includes("fishing") && !promo.eligibleGames.includes("slot")) {
    return "fishing";
  }
  if (promo.eligibleGames.includes("slot")) return "slot";
  return "all";
}

function formatBonusHighlight(promo: DepositPromotion): string | undefined {
  if (promo.fixedBonus && promo.fixedBonus > 0) {
    return `৳${promo.fixedBonus.toLocaleString("en-US")} BONUS`;
  }
  if (promo.bonusRate > 0) {
    const pct = Math.round(promo.bonusRate * 100);
    return promo.bonusRate >= 1 ? `${pct}% BONUS` : `${pct}% RELOAD`;
  }
  return undefined;
}

function formatBadge(promo: DepositPromotion): string | undefined {
  if (promo.usageType === "once" && promo.eligibleGames.includes("all")) {
    return "welcomeOffer";
  }
  if (promo.usageType === "daily") return "dailyBonus";
  if (promo.usageType === "always") return "reloadBonus";
  if (promo.usageType === "once") return "welcomeOffer";
  return undefined;
}

function eligibleGameTags(promo: DepositPromotion): string[] {
  const tags: string[] = [];
  if (promo.eligibleGames.includes("all")) tags.push("All games");
  if (promo.eligibleGames.includes("slot")) tags.push("Slots");
  if (promo.eligibleGames.includes("fishing")) tags.push("Fishing");
  if (promo.eligibleGames.includes("live")) tags.push("Live Casino");
  return tags;
}

function usageTag(promo: DepositPromotion): string | undefined {
  if (promo.usageType === "once") return "One-time";
  if (promo.usageType === "daily") return "Daily";
  if (promo.usageType === "always") return "Reload";
  return undefined;
}

export function mapDepositPromotionToDisplay(
  promo: DepositPromotion,
  locale: Locale,
): PromotionDisplayItem {
  const isBn = locale === "bn";
  const tags = [...eligibleGameTags(promo)];
  const usage = usageTag(promo);
  if (usage) tags.push(usage);
  if (promo.minDeposit > 0) {
    tags.push(`Min ৳${promo.minDeposit.toLocaleString("en-US")}`);
  }

  return {
    id: promo.code,
    code: promo.code,
    title: getPromotionLabel(promo, isBn),
    description: getPromotionDescription(promo, isBn),
    categories: depositPromoCategories(promo),
    tags,
    highlight: formatBonusHighlight(promo),
    badge: formatBadge(promo),
    validityStart: promo.validFrom,
    validityEnd: promo.validTo,
    minDeposit: promo.minDeposit,
    turnoverX: promo.turnoverX,
    eligibleGames: promo.eligibleGames,
    usageType: promo.usageType,
    maxBonusCap: promo.maxBonusCap,
    theme: pickTheme(promo),
  };
}

export function mapDepositPromotionsToDisplay(
  promos: DepositPromotion[],
  locale: Locale,
): PromotionDisplayItem[] {
  return promos
    .filter((promo) => promo.code !== DEFAULT_PROMO_CODE)
    .map((promo) => mapDepositPromotionToDisplay(promo, locale));
}

export function filterDepositPromotions(
  items: PromotionDisplayItem[],
  filter: PromotionFilterId,
): PromotionDisplayItem[] {
  if (filter === "all") return items;
  return items.filter((item) => item.categories.includes(filter));
}

export function pickFeaturedPromotion(
  items: PromotionDisplayItem[],
): PromotionDisplayItem | undefined {
  return (
    items.find((item) => item.badge === "welcomeOffer" && item.theme === "all") ??
    items.find((item) => item.badge === "welcomeOffer") ??
    items[0]
  );
}
