import type { Locale } from "@/lib/locale";

export type BonusRewardMessages = {
  pageTitle: string;
  voucherTitle: string;
  voucherSubtitle: string;
  rewardLabel: string;
  description: string;
  dueDate: string;
  dayUnit: string;
  claim: string;
  noBonus: string;
};

const en: BonusRewardMessages = {
  pageTitle: "Bonus",
  voucherTitle: "REWARD VOUCHER",
  voucherSubtitle: "Smash & Win",
  rewardLabel: "Reward :",
  description: "Description",
  dueDate: "Due Date",
  dayUnit: "Day",
  claim: "Claim",
  noBonus: "No bonus available right now.",
};

const bn: BonusRewardMessages = {
  pageTitle: "বোনাস",
  voucherTitle: "REWARD VOUCHER",
  voucherSubtitle: "Smash & Win",
  rewardLabel: "Reward :",
  description: "Description",
  dueDate: "Due Date",
  dayUnit: "Day",
  claim: "Claim",
  noBonus: "এই মুহূর্তে কোনো বোনাস উপলব্ধ নেই।",
};

const hi: BonusRewardMessages = {
  pageTitle: "बोनस",
  voucherTitle: "REWARD VOUCHER",
  voucherSubtitle: "Smash & Win",
  rewardLabel: "Reward :",
  description: "Description",
  dueDate: "Due Date",
  dayUnit: "Day",
  claim: "Claim",
  noBonus: "अभी कोई बोनस उपलब्ध नहीं है।",
};

const byLocale: Record<Locale, BonusRewardMessages> = { en, bn, hi };

export function getBonusRewardMessages(locale: Locale): BonusRewardMessages {
  return byLocale[locale] ?? en;
}
