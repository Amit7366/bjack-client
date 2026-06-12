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
  rewardTitle: string;
  rewardDescription: string;
  claimSuccess: string;
  cooldownNote: string;
  claimed: string;
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
  rewardTitle: "Member bonus ৳10",
  rewardDescription: "Claim ৳10 every 15 days (1× turnover)",
  claimSuccess: "Bonus added to your balance",
  cooldownNote: "Next claim available in",
  claimed: "Claimed",
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
  rewardTitle: "মেম্বার বোনাস ৳১০",
  rewardDescription: "প্রতি ১৫ দিনে ৳১০ ক্লেইম (১× টার্নওভার)",
  claimSuccess: "বোনাস ব্যালেন্সে যোগ হয়েছে",
  cooldownNote: "পরবর্তী ক্লেইম",
  claimed: "Claimed",
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
  rewardTitle: "सदस्य बोनस ৳10",
  rewardDescription: "हर 15 दिन में ৳10 क्लेम (1× टर्नओवर)",
  claimSuccess: "बोनस बैलेंस में जोड़ा गया",
  cooldownNote: "अगला क्लेम",
  claimed: "Claimed",
};

const byLocale: Record<Locale, BonusRewardMessages> = { en, bn, hi };

export function getBonusRewardMessages(locale: Locale): BonusRewardMessages {
  return byLocale[locale] ?? en;
}
