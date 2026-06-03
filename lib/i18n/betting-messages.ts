import type { Locale } from "@/lib/locale";
import type { BettingResult, BettingTab } from "@/lib/betting-records-data";
import type { TransactionDateFilter } from "@/lib/transactions-data";

export type BettingMessages = {
  pageTitle: string;
  tabs: Record<BettingTab, string>;
  filterTitle: string;
  filterClose: string;
  filterClearAll: string;
  filterApply: string;
  filterDate: string;
  noData: string;
  loading: string;
  loadError: string;
  recordsCount: (from: number, to: number, total: number) => string;
  dateGroupToday: (date: string) => string;
  dateGroupYesterday: (date: string) => string;
  dateGroupOn: (date: string) => string;
  dateFilterLabels: Record<TransactionDateFilter, string>;
  resultLabels: Record<BettingResult, string>;
  stake: string;
  payout: string;
  betId: string;
  category: string;
};

const en: BettingMessages = {
  pageTitle: "Betting records",
  tabs: { settled: "Settled", unsettled: "Unsettled" },
  filterTitle: "Filter",
  filterClose: "Close filter",
  filterClearAll: "Clear all",
  filterApply: "Apply filters",
  filterDate: "Date",
  noData: "No data",
  loading: "Loading…",
  loadError: "Could not load betting records. Please try again.",
  recordsCount: (from, to, total) => `${from} - ${to} of ${total} records`,
  dateGroupToday: (date) => `Today ${date}`,
  dateGroupYesterday: (date) => `Yesterday ${date}`,
  dateGroupOn: (date) => date,
  dateFilterLabels: {
    today: "Today",
    yesterday: "Yesterday",
    last7days: "Last 7 days",
  },
  resultLabels: { won: "Won", lost: "Lost", void: "Void" },
  stake: "Stake",
  payout: "Payout",
  betId: "Bet ID",
  category: "Category",
};

const bn: BettingMessages = {
  pageTitle: "বেটিং রেকর্ডস",
  tabs: { settled: "সেটলড", unsettled: "আনসেটলড" },
  filterTitle: "ফিল্টার",
  filterClose: "ফিল্টার বন্ধ করুন",
  filterClearAll: "সব মুছুন",
  filterApply: "ফিল্টার প্রয়োগ করুন",
  filterDate: "তারিখ",
  noData: "কোনো ডেটা নেই",
  loading: "লোড হচ্ছে…",
  loadError: "বেটিং রেকর্ড লোড করা যায়নি। আবার চেষ্টা করুন।",
  recordsCount: (from, to, total) => `${total} রেকর্ডের মধ্যে ${from} - ${to}`,
  dateGroupToday: (date) => `আজ ${date}`,
  dateGroupYesterday: (date) => `গতকাল ${date}`,
  dateGroupOn: (date) => date,
  dateFilterLabels: {
    today: "আজ",
    yesterday: "গতকাল",
    last7days: "গত ৭ দিন",
  },
  resultLabels: { won: "জিতেছে", lost: "হারিয়েছে", void: "বাতিল" },
  stake: "স্টেক",
  payout: "পেআউট",
  betId: "বেট আইডি",
  category: "ক্যাটাগরি",
};

const hi: BettingMessages = {
  pageTitle: "बेटिंग रिकॉर्ड",
  tabs: { settled: "सेटल्ड", unsettled: "अनसेटल्ड" },
  filterTitle: "फ़िल्टर",
  filterClose: "फ़िल्टर बंद करें",
  filterClearAll: "सभी साफ़ करें",
  filterApply: "फ़िल्टर लागू करें",
  filterDate: "तारीख",
  noData: "कोई डेटा नहीं",
  loading: "लोड हो रहा है…",
  loadError: "बेटिंग रिकॉर्ड लोड नहीं हो सके। पुनः प्रयास करें।",
  recordsCount: (from, to, total) => `${total} रिकॉर्ड में से ${from} - ${to}`,
  dateGroupToday: (date) => `आज ${date}`,
  dateGroupYesterday: (date) => `कल ${date}`,
  dateGroupOn: (date) => date,
  dateFilterLabels: {
    today: "आज",
    yesterday: "कल",
    last7days: "पिछले 7 दिन",
  },
  resultLabels: { won: "जीता", lost: "हारा", void: "रद्द" },
  stake: "दांव",
  payout: "भुगतान",
  betId: "बेट ID",
  category: "श्रेणी",
};

const MAP: Record<Locale, BettingMessages> = { en, bn, hi };

export function getBettingMessages(locale: Locale): BettingMessages {
  return MAP[locale] ?? en;
}
