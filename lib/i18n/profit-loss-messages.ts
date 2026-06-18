import type { Locale } from "@/lib/locale";

export type ProfitLossCategory = "all" | "slot" | "live" | "sports" | "poker" | "fishing";

export type CategoryGameMetrics = {
  betting: number;
  validBet: number;
  winAmount: number;
  rebate: number;
  bonus: number;
  pnl: number;
};

export type AllSummaryMetrics = {
  deposit: number;
  withdrawal: number;
  bonus: number;
  rebate: number;
  income: number;
  expense: number;
  pnl: number;
};

export type PersonalReportData = {
  from: string;
  to: string;
  all: AllSummaryMetrics;
  categories: Record<Exclude<ProfitLossCategory, "all">, CategoryGameMetrics>;
};

export type ProfitLossPreset = "today" | "yesterday" | "last7days" | "custom";

export type ProfitLossMessages = {
  pageTitle: string;
  filters: {
    today: string;
    yesterday: string;
    last7days: string;
  };
  categories: Record<ProfitLossCategory, string>;
  metrics: {
    totalPnl: string;
    deposit: string;
    bonus: string;
    income: string;
    withdrawal: string;
    rebate: string;
    expense: string;
    betting: string;
    validBet: string;
    winAmount: string;
  };
  loadError: string;
  loading: string;
  dateRangeOk: string;
  close: string;
};

const en: ProfitLossMessages = {
  pageTitle: "Personal Report",
  filters: { today: "Today", yesterday: "Yesterday", last7days: "7 Days" },
  categories: {
    all: "All",
    slot: "Slots",
    live: "Live",
    sports: "Sports",
    poker: "Poker",
    fishing: "Fishing",
  },
  metrics: {
    totalPnl: "Total P&L",
    deposit: "Deposit",
    bonus: "Bonus",
    income: "Income",
    withdrawal: "Withdrawal",
    rebate: "Rebate",
    expense: "Expense",
    betting: "Betting",
    validBet: "Valid Bet",
    winAmount: "Win Amount",
  },
  loadError: "Failed to load report",
  loading: "Loading…",
  dateRangeOk: "OK",
  close: "Close",
};

const bn: ProfitLossMessages = {
  pageTitle: "ব্যক্তিগত প্রতিবেদন",
  filters: { today: "আজ", yesterday: "গতকাল", last7days: "7 দিন" },
  categories: {
    all: "সব",
    slot: "স্লট",
    live: "লাইভ",
    sports: "খেলাধুলা",
    poker: "পোকার",
    fishing: "মাছ ধরা",
  },
  metrics: {
    totalPnl: "মোট P&L",
    deposit: "জমা দিন",
    bonus: "বোনাস",
    income: "আয়",
    withdrawal: "উত্তোলন",
    rebate: "রিবেট",
    expense: "ব্যয়",
    betting: "বেটিং",
    validBet: "বৈধ বেট",
    winAmount: "বিজয় পরিমাণ",
  },
  loadError: "প্রতিবেদন লোড করতে ব্যর্থ",
  loading: "লোড হচ্ছে…",
  dateRangeOk: "ঠিক আছে",
  close: "বন্ধ",
};

const hi: ProfitLossMessages = {
  pageTitle: "व्यक्तिगत रिपोर्ट",
  filters: { today: "आज", yesterday: "कल", last7days: "7 दिन" },
  categories: {
    all: "सभी",
    slot: "स्लॉट",
    live: "लाइव",
    sports: "खेल",
    poker: "पोकर",
    fishing: "मछली",
  },
  metrics: {
    totalPnl: "कुल P&L",
    deposit: "जमा",
    bonus: "बोनस",
    income: "आय",
    withdrawal: "निकासी",
    rebate: "रिबेट",
    expense: "खर्च",
    betting: "बेटिंग",
    validBet: "वैध बेट",
    winAmount: "जीत राशि",
  },
  loadError: "रिपोर्ट लोड करने में विफल",
  loading: "लोड हो रहा है…",
  dateRangeOk: "ठीक है",
  close: "बंद करें",
};

const MAP: Record<Locale, ProfitLossMessages> = { en, bn, hi };

export function getProfitLossMessages(locale: string): ProfitLossMessages {
  return MAP[locale as Locale] ?? en;
}

export const PROFIT_LOSS_CATEGORY_ORDER: Exclude<ProfitLossCategory, "all">[] = [
  "slot",
  "live",
  "sports",
  "poker",
  "fishing",
];
