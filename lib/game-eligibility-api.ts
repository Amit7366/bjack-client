import { authFetchData } from "@/lib/auth/auth-fetch";

export type GameEligibilityResult = {
  allowed: boolean;
  gameCode: string;
  gameType: string | null;
  eligibleGameTypes: string[];
  promoCode: string | null;
  restricted: boolean;
  reason?: string;
};

export type ActiveGameRestrictions = {
  eligibleGameTypes: string[];
  promoCode: string | null;
  restricted: boolean;
};

export async function checkGameLaunchEligibility(
  gameCode: string
): Promise<GameEligibilityResult> {
  return authFetchData<GameEligibilityResult>(
    `/games/eligibility/check?gameCode=${encodeURIComponent(gameCode)}`,
    { cache: "no-store" },
  );
}

export async function fetchActiveGameRestrictions(): Promise<ActiveGameRestrictions> {
  return authFetchData<ActiveGameRestrictions>("/games/eligibility/active", {
    cache: "no-store",
  });
}

export function promotionRestrictionMessage(
  locale: string,
  eligibleGameTypes: string[]
): string {
  const types = eligibleGameTypes
    .filter((t) => t && t !== "all")
    .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
    .join(", ");

  if (locale === "bn") {
    return types
      ? `আপনার ডিপোজিট প্রমো শুধু এই গেম টাইপে খেলার অনুমতি দেয়: ${types}`
      : "এই গেমটি আপনার বর্তমান ডিপোজিট প্রমোতে অন্তর্ভুক্ত নয়।";
  }
  if (locale === "hi") {
    return types
      ? `आपका डिपॉज़िट प्रोमो केवल इन गेम प्रकारों की अनुमति देता है: ${types}`
      : "यह गेम आपके वर्तमान डिपॉज़िट प्रोमो में शामिल नहीं है।";
  }
  return types
    ? `Your deposit promotion only allows these game types: ${types}`
    : "This game is not included in your current deposit promotion.";
}
