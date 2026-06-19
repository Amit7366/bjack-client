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
  claimSuccess: string;
  cooldownNote: string;
  claimed: string;
  criteriaNotMet: string;
  depositToday: string;
  totalDeposit: string;
  referFriends: string;
  progress: string;
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
  noBonus: "No bonus offers available right now.",
  claimSuccess: "Bonus added to your balance",
  cooldownNote: "Next claim available in",
  claimed: "Claimed",
  criteriaNotMet: "Requirements not met",
  depositToday: "Deposit today",
  totalDeposit: "Total deposit",
  referFriends: "Referrals",
  progress: "Progress",
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
  noBonus: "এই মুহূর্তে কোনো বোনাস অফার উপলব্ধ নেই।",
  claimSuccess: "বোনাস ব্যালেন্সে যোগ হয়েছে",
  cooldownNote: "পরবর্তী ক্লেইম",
  claimed: "Claimed",
  criteriaNotMet: "শর্ত পূরণ হয়নি",
  depositToday: "আজকের ডিপোজিট",
  totalDeposit: "মোট ডিপোজিট",
  referFriends: "রেফারেল",
  progress: "অগ্রগতি",
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
  noBonus: "अभी कोई बोनस ऑफर उपलब्ध नहीं है।",
  claimSuccess: "बोनस बैलेंस में जोड़ा गया",
  cooldownNote: "अगला क्लेम",
  claimed: "Claimed",
  criteriaNotMet: "शर्तें पूरी नहीं हुईं",
  depositToday: "आज की जमा",
  totalDeposit: "कुल जमा",
  referFriends: "रेफरल",
  progress: "प्रगति",
};

const byLocale: Record<Locale, BonusRewardMessages> = { en, bn, hi };

export function getBonusRewardMessages(locale: Locale): BonusRewardMessages {
  return byLocale[locale] ?? en;
}
