import type { Locale } from "@/lib/locale";

export type RescueFundItemId = "sports-cashback" | "loss-compensation";
export type RescueFundDetailVariant = "sports" | "loss-compensation";

export type RescueFundMessages = {
  pageTitle: string;
  sportsCashback: string;
  lossCompensation: string;
  today: string;
  totalLoss: string;
  receivableAmount: string;
  claim: string;
  claimSuccess: string;
  claimError: string;
  noRewardToClaim: string;
  close: string;
  gameTypeSports: string;
  gameTypeSlotFish: string;
  rewardCycle: string;
  depositAmount: string;
  netLoss: string;
  bonusRate: string;
  pointRate: string;
  points: string;
  bonus: string;
  ticket: string;
  rulesTitle: string;
  rulesBody: string;
};

const en: RescueFundMessages = {
  pageTitle: "Rescue Fund",
  sportsCashback: "10% Sports Cashback",
  lossCompensation: "Loss Compensation Bonus",
  today: "Today",
  totalLoss: "Total Loss",
  receivableAmount: "Receivable Amount",
  claim: "Claim",
  claimSuccess: "Rescue fund reward added to your balance",
  claimError: "Could not claim rescue fund reward",
  noRewardToClaim: "No rescue fund reward available to claim",
  close: "Close",
  gameTypeSports: "Game Type: Sports",
  gameTypeSlotFish: "Game Type: Slot or Fish",
  rewardCycle: "Reward Cycle",
  depositAmount: "Deposit Amount",
  netLoss: "Net Loss ≥",
  bonusRate: "Bonus Rate %",
  pointRate: "Point Rate %",
  points: "Points",
  bonus: "Bonus",
  ticket: "Ticket",
  rulesTitle: "Rescue fund rules",
  rulesBody:
    "Rescue fund rewards are calculated from your net loss during the reward cycle. Claim becomes available when you meet the minimum net loss threshold for your game type.",
};

const bn: RescueFundMessages = {
  pageTitle: "উদ্ধার তহবিল",
  sportsCashback: "১০% স্পোর্টস ক্যাশব্যাক",
  lossCompensation: "লোকসান ক্ষতিপূরণ বোনাস",
  today: "আজ",
  totalLoss: "মোট ক্ষতি",
  receivableAmount: "গ্রহণযোগ্য পরিমাণ",
  claim: "দাবি",
  claimSuccess: "উদ্ধার তহবিল পুরস্কার আপনার ব্যালেন্সে যোগ হয়েছে",
  claimError: "উদ্ধার তহবিল পুরস্কার দাবি করা যায়নি",
  noRewardToClaim: "দাবি করার মতো কোনো উদ্ধার তহবিল পুরস্কার নেই",
  close: "বন্ধ করুন",
  gameTypeSports: "খেলার ধরণ: খেলাধুলা",
  gameTypeSlotFish: "খেলার ধরণ: স্লট বা মাছ",
  rewardCycle: "পুরস্কার চক্র",
  depositAmount: "জমা পরিমাণ",
  netLoss: "নেট লস ≥",
  bonusRate: "বোনাস হার%",
  pointRate: "পয়েন্ট হার%",
  points: "পয়েন্টস",
  bonus: "বোনাস",
  ticket: "টিকিট",
  rulesTitle: "উদ্ধার তহবিল নিয়ম",
  rulesBody:
    "উদ্ধার তহবিল পুরস্কার আপনার পুরস্কার চক্রের নেট লসের ভিত্তিতে হিসাব করা হয়। ন্যূনতম নেট লস পূরণ হলে দাবি করা যাবে।",
};

const hi: RescueFundMessages = {
  pageTitle: "बचाव कोष",
  sportsCashback: "10% स्पोर्ट्स कैशबैक",
  lossCompensation: "हानि क्षतिपूर्ति बोनस",
  today: "आज",
  totalLoss: "कुल हानि",
  receivableAmount: "प्राप्य राशि",
  claim: "दावा करें",
  claimSuccess: "बचाव कोष पुरस्कार आपके बैलेंस में जोड़ा गया",
  claimError: "बचाव कोष पुरस्कार दावा नहीं हो सका",
  noRewardToClaim: "दावा करने योग्य कोई बचाव कोष पुरस्कार नहीं",
  close: "बंद करें",
  gameTypeSports: "गेम प्रकार: स्पोर्ट्स",
  gameTypeSlotFish: "गेम प्रकार: स्लॉट या फिश",
  rewardCycle: "रिवॉर्ड चक्र",
  depositAmount: "जमा राशि",
  netLoss: "नेट लॉस ≥",
  bonusRate: "बोनस दर %",
  pointRate: "पॉइंट दर %",
  points: "पॉइंट्स",
  bonus: "बोनस",
  ticket: "टिकट",
  rulesTitle: "बचाव कोष नियम",
  rulesBody:
    "बचाव कोष पुरस्कार आपके रिवॉर्ड चक्र के नेट लॉस के आधार पर गणना किए जाते हैं। न्यूनतम नेट लॉस पूरा होने पर दावा उपलब्ध होता है।",
};

const byLocale: Record<Locale, RescueFundMessages> = { en, bn, hi };

export function getRescueFundMessages(locale: Locale): RescueFundMessages {
  return byLocale[locale] ?? en;
}

/** Static tier table for slot/fish loss compensation (reference UI). */
export const LOSS_COMPENSATION_TIERS = [
  { deposit: "0.00", netLoss: "≥100.00", bonus: "5", points: "", ticket: "" },
  { deposit: "0.00", netLoss: "≥500.00", bonus: "25", points: "", ticket: "" },
  { deposit: "0.00", netLoss: "≥1,000.00", bonus: "50", points: "", ticket: "" },
  { deposit: "0.00", netLoss: "≥3,000.00", bonus: "150", points: "", ticket: "" },
] as const;

/** Static single-column table for sports cashback (reference UI). */
export const SPORTS_CASHBACK_ROW = {
  deposit: "0.00",
  netLoss: ">1.00",
  bonusRate: "10",
  pointRate: "",
  ticket: "",
} as const;
