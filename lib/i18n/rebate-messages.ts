import type { Locale } from "@/lib/locale";

export type RebateTab = "manual" | "history";

export type RebateCategory = "slot" | "live" | "sports" | "poker" | "fishing";

export type RebateCategorySnapshot = Record<
  RebateCategory,
  { turnover: number; rebate: number }
>;

export type ManualRebateData = {
  dayKey: string;
  date: string;
  categories: RebateCategorySnapshot;
  totalTurnover: number;
  totalEarnedRebate: number;
  claimedToday: number;
  claimable: number;
  canClaim: boolean;
};

export type RebateClaimRecord = {
  id: string;
  orderNo: string;
  dayKey: string;
  amount: number;
  primaryCategory: RebateCategory;
  categoryBreakdown: RebateCategorySnapshot;
  totalTurnover: number;
  totalEarnedRebate: number;
  claimedBefore: number;
  createdAt: string;
};

export type RebateHistoryData = {
  from: string;
  to: string;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  items: RebateClaimRecord[];
};

export type RebateMessages = {
  pageTitle: string;
  tabs: Record<RebateTab, string>;
  categories: {
    date: string;
    slot: string;
    live: string;
    sports: string;
    poker: string;
    fish: string;
    total: string;
  };
  claim: string;
  claiming: string;
  claimSuccess: string;
  claimError: string;
  loadError: string;
  loading: string;
  noHistory: string;
  today: string;
  orderNo: (orderNo: string) => string;
  transactionAmount: string;
  view: string;
  dateRangeOk: string;
  dateRangeTitle: string;
  detailTitle: string;
  turnover: string;
  earnedRebate: string;
  claimedBefore: string;
  close: string;
};

const en: RebateMessages = {
  pageTitle: "Rebate",
  tabs: { manual: "Manual Rebate", history: "Rebate History" },
  categories: {
    date: "Date",
    slot: "Slot",
    live: "Live",
    sports: "Sports",
    poker: "Poker",
    fish: "Fish",
    total: "Total",
  },
  claim: "Claim",
  claiming: "Claiming…",
  claimSuccess: "Rebate claimed successfully",
  claimError: "Could not claim rebate. Please try again.",
  loadError: "Could not load rebate data. Please try again.",
  loading: "Loading…",
  noHistory: "No rebate history",
  today: "Today",
  orderNo: (orderNo) => `Order No: ${orderNo}`,
  transactionAmount: "Transaction amount",
  view: "View",
  dateRangeOk: "OK",
  dateRangeTitle: "Select date range",
  detailTitle: "Rebate details",
  turnover: "Turnover",
  earnedRebate: "Earned rebate",
  claimedBefore: "Claimed before",
  close: "Close",
};

const bn: RebateMessages = {
  pageTitle: "রিবেট",
  tabs: { manual: "ম্যানুয়াল রিবেট", history: "রিবেট ইতিহাস" },
  categories: {
    date: "তারিখ",
    slot: "স্লট",
    live: "লাইভ",
    sports: "খেলাধুলা",
    poker: "পোকার",
    fish: "মাছ",
    total: "মোট",
  },
  claim: "দাবি",
  claiming: "দাবি করা হচ্ছে…",
  claimSuccess: "রিবেট সফলভাবে দাবি করা হয়েছে",
  claimError: "রিবেট দাবি করা যায়নি। আবার চেষ্টা করুন।",
  loadError: "রিবেট ডেটা লোড করা যায়নি। আবার চেষ্টা করুন।",
  loading: "লোড হচ্ছে…",
  noHistory: "কোনো রিবেট ইতিহাস নেই",
  today: "আজ",
  orderNo: (orderNo) => `অর্ডার নম্বর: ${orderNo}`,
  transactionAmount: "লেনদেন পরিমাণ",
  view: "দেখুন",
  dateRangeOk: "ঠিক আছে",
  dateRangeTitle: "তারিখের পরিসর নির্বাচন করুন",
  detailTitle: "রিবেট বিবরণ",
  turnover: "টার্নওভার",
  earnedRebate: "অর্জিত রিবেট",
  claimedBefore: "আগে দাবি করা",
  close: "বন্ধ করুন",
};

const hi: RebateMessages = {
  pageTitle: "रिबेट",
  tabs: { manual: "मैनुअल रिबेट", history: "रिबेट इतिहास" },
  categories: {
    date: "तारीख",
    slot: "स्लॉट",
    live: "लाइव",
    sports: "खेल",
    poker: "पोकर",
    fish: "फिश",
    total: "कुल",
  },
  claim: "दावा करें",
  claiming: "दावा हो रहा है…",
  claimSuccess: "रिबेट सफलतापूर्वक दावा किया गया",
  claimError: "रिबेट दावा नहीं हो सका। पुनः प्रयास करें।",
  loadError: "रिबेट डेटा लोड नहीं हो सका। पुनः प्रयास करें।",
  loading: "लोड हो रहा है…",
  noHistory: "कोई रिबेट इतिहास नहीं",
  today: "आज",
  orderNo: (orderNo) => `ऑर्डर नंबर: ${orderNo}`,
  transactionAmount: "लेनदेन राशि",
  view: "देखें",
  dateRangeOk: "ठीक है",
  dateRangeTitle: "तारीख सीमा चुनें",
  detailTitle: "रिबेट विवरण",
  turnover: "टर्नओवर",
  earnedRebate: "अर्जित रिबेट",
  claimedBefore: "पहले दावा किया",
  close: "बंद करें",
};

const MAP: Record<Locale, RebateMessages> = { en, bn, hi };

export function getRebateMessages(locale: Locale): RebateMessages {
  return MAP[locale] ?? en;
}

export function categoryLabel(
  messages: RebateMessages,
  category: RebateCategory | "date" | "total"
): string {
  if (category === "fishing") return messages.categories.fish;
  return messages.categories[category];
}
