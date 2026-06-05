import type { Locale } from "@/lib/locale";

export type TurnoverMessages = {
  required: string;
  completed: string;
  remaining: string;
  progress: string;
  noPending: string;
  noPendingHint: string;
  loadError: string;
  retry: string;
  refresh: string;
  activePromotion: string;
  allGames: string;
  eligibleGames: string;
  completedBadge: string;
  kinds: {
    deposit: string;
    signup: string;
    referral: string;
    login: string;
  };
};

const en: TurnoverMessages = {
  required: "Required",
  completed: "Completed",
  remaining: "Remaining",
  progress: "Turnover progress",
  noPending: "No pending turnover",
  noPendingHint: "You can withdraw once all bonus turnover requirements are met.",
  loadError: "Could not load turnover. Please try again.",
  retry: "Retry",
  refresh: "Refresh",
  activePromotion: "Active promotion",
  allGames: "All games",
  eligibleGames: "Eligible games",
  completedBadge: "Completed",
  kinds: {
    deposit: "Deposit turnover",
    signup: "Signup bonus",
    referral: "Referral bonus",
    login: "Login bonus",
  },
};

const bn: TurnoverMessages = {
  required: "প্রয়োজন",
  completed: "সম্পন্ন",
  remaining: "বাকি",
  progress: "টার্নওভার অগ্রগতি",
  noPending: "কোনো পেন্ডিং টার্নওভার নেই",
  noPendingHint: "সব বোনাস টার্নওভার পূরণ হলে উইথড্র করতে পারবেন।",
  loadError: "টার্নওভার লোড করা যায়নি। আবার চেষ্টা করুন।",
  retry: "আবার চেষ্টা",
  refresh: "রিফ্রেশ",
  activePromotion: "সক্রিয় প্রমোশন",
  allGames: "সকল গেম",
  eligibleGames: "যোগ্য গেম",
  completedBadge: "সম্পন্ন",
  kinds: {
    deposit: "ডিপোজিট টার্নওভার",
    signup: "সাইনআপ বোনাস",
    referral: "রেফারেল বোনাস",
    login: "লগইন বোনাস",
  },
};

const hi: TurnoverMessages = {
  required: "आवश्यक",
  completed: "पूर्ण",
  remaining: "शेष",
  progress: "टर्नओवर प्रगति",
  noPending: "कोई लंबित टर्नओवर नहीं",
  noPendingHint: "सभी बोनस टर्नओवर पूरे होने पर निकासी कर सकते हैं।",
  loadError: "टर्नओवर लोड नहीं हो सका। पुनः प्रयास करें।",
  retry: "पुनः प्रयास",
  refresh: "रीफ़्रेश",
  activePromotion: "सक्रिय प्रमोशन",
  allGames: "सभी गेम",
  eligibleGames: "योग्य गेम",
  completedBadge: "पूर्ण",
  kinds: {
    deposit: "जमा टर्नओवर",
    signup: "साइनअप बोनस",
    referral: "रेफरल बोनस",
    login: "लॉगिन बोनस",
  },
};

const byLocale: Record<Locale, TurnoverMessages> = { en, bn, hi };

export function getTurnoverMessages(locale: Locale): TurnoverMessages {
  return byLocale[locale] ?? en;
}

export function formatTurnoverAmount(value: number): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return "0.00";
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
