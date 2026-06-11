import type { Locale } from "@/lib/locale";
import { formatReferralNumber } from "./referral-messages";

export type MyReferralTab = "info" | "details" | "rewards";

export type MyReferralMessages = {
  pageTitle: string;
  tabs: Record<MyReferralTab, string>;
  yourReferralCode: string;
  copyCode: string;
  copyLink: string;
  share: string;
  codeCopied: string;
  linkCopied: string;
  copyFailed: string;
  shareTitle: string;
  shareText: string;
  programStatusTitle: string;
  activeDownline: string;
  totalRewards: string;
  downlineTurnover: string;
  rewards: string;
  earnedStatusTitle: string;
  earnedBonusRules: string;
  rewardCurrency: string;
  monthly: string;
  invite: string;
  infoTitle: string;
  infoP1: string;
  infoP2: string;
  rewardsTitle: string;
  rewardsSubtitle: string;
  levelLabel: string;
  loading: string;
  loadError: string;
  retry: string;
};

const en: MyReferralMessages = {
  pageTitle: "My Referral",
  tabs: { info: "Info", details: "Details", rewards: "Rewards" },
  yourReferralCode: "Your referral code",
  copyCode: "Copy code",
  copyLink: "Copy link",
  share: "Share",
  codeCopied: "Referral code copied",
  linkCopied: "Referral link copied",
  copyFailed: "Could not copy. Please try again.",
  shareTitle: "Join me on BKBaji",
  shareText: "Register with my referral link:",
  programStatusTitle: "Referral program status",
  activeDownline: "Active downline",
  totalRewards: "Total rewards",
  downlineTurnover: "Downline turnover",
  rewards: "Rewards",
  earnedStatusTitle: "Earned referral status",
  earnedBonusRules: "Earned bonus rules",
  rewardCurrency: "Reward (৳)",
  monthly: "Monthly",
  invite: "Invite",
  infoTitle: "What is the referral program?",
  infoP1:
    "Invite friends to join and earn unlimited daily cash rewards when they play or bet on the platform.",
  infoP2:
    "Share your referral code or link. Friends must register using your link so you receive credit.",
  rewardsTitle: "Cash reward ratio",
  rewardsSubtitle: "Daily rewards based on your downline turnover",
  levelLabel: "Level",
  loading: "Loading referral data…",
  loadError: "Could not load referral data.",
  retry: "Try again",
};

const bn: MyReferralMessages = {
  pageTitle: "মাই রেফারেল",
  tabs: { info: "তথ্য", details: "বিস্তারিত", rewards: "পুরস্কার" },
  yourReferralCode: "আপনার রেফারেল কোড",
  copyCode: "কোড কপি করুন",
  copyLink: "কপি লিঙ্ক",
  share: "শেয়ার করুন",
  codeCopied: "রেফারেল কোড কপি হয়েছে",
  linkCopied: "রেফারেল লিঙ্ক কপি হয়েছে",
  copyFailed: "কপি করা যায়নি। আবার চেষ্টা করুন।",
  shareTitle: "BKBaji-তে আমার সাথে যোগ দিন",
  shareText: "আমার রেফারেল লিঙ্ক দিয়ে রেজিস্টার করুন:",
  programStatusTitle: "রেফারেল প্রোগ্রামের স্ট্যাটাস",
  activeDownline: "এক্টিভ ডাউনলাইন",
  totalRewards: "মোট পুরস্কার",
  downlineTurnover: "ডাউনলাইন টার্নওভার",
  rewards: "পুরস্কার",
  earnedStatusTitle: "অর্জিত রেফারেল স্ট্যাটাস",
  earnedBonusRules: "অর্জিত বোনাসের নিয়মাবলী",
  rewardCurrency: "রিওয়ার্ড (৳)",
  monthly: "মান্থলি",
  invite: "ইনভাইট",
  infoTitle: "রেফারেল প্রোগ্রাম কি?",
  infoP1:
    "বন্ধুদের আমন্ত্রণ জানান এবং তারা প্ল্যাটফর্মে খেললে বা বেট ধরলে আনলিমিটেড ডেইলি ক্যাশ রিওয়ার্ড উপার্জন করুন।",
  infoP2:
    "আপনার রেফারেল কোড বা লিঙ্ক শেয়ার করুন। আপনার লিঙ্ক দিয়ে রেজিস্টার করলেই ক্রেডিট পাবেন।",
  rewardsTitle: "ক্যাশ রিওয়ার্ড রেশিও",
  rewardsSubtitle: "ডাউনলাইন টার্নওভারের ভিত্তিতে ডেইলি রিওয়ার্ড",
  levelLabel: "লেভেল",
  loading: "রেফারেল ডেটা লোড হচ্ছে…",
  loadError: "রেফারেল ডেটা লোড করা যায়নি।",
  retry: "আবার চেষ্টা করুন",
};

const hi: MyReferralMessages = {
  pageTitle: "मेरा रेफरल",
  tabs: { info: "जानकारी", details: "विवरण", rewards: "पुरस्कार" },
  yourReferralCode: "आपका रेफरल कोड",
  copyCode: "कोड कॉपी करें",
  copyLink: "लिंक कॉपी करें",
  share: "शेयर करें",
  codeCopied: "रेफरल कोड कॉपी हो गया",
  linkCopied: "रेफरल लिंक कॉपी हो गया",
  copyFailed: "कॉपी नहीं हो सका। फिर से कोशिश करें।",
  shareTitle: "BKBaji पर मेरे साथ जुड़ें",
  shareText: "मेरे रेफरल लिंक से रजिस्टर करें:",
  programStatusTitle: "रेफरल प्रोग्राम स्थिति",
  activeDownline: "सक्रिय डाउनलाइन",
  totalRewards: "कुल पुरस्कार",
  downlineTurnover: "डाउनलाइन टर्नओवर",
  rewards: "पुरस्कार",
  earnedStatusTitle: "अर्जित रेफरल स्थिति",
  earnedBonusRules: "अर्जित बोनस के नियम",
  rewardCurrency: "रिवॉर्ड (৳)",
  monthly: "मासिक",
  invite: "इनवाइट",
  infoTitle: "रेफरल प्रोग्राम क्या है?",
  infoP1:
    "दोस्तों को आमंत्रित करें और जब वे खेलें या बेट लगाएं तो असीमित दैनिक कैश रिवॉर्ड कमाएं।",
  infoP2:
    "अपना रेफरल कोड या लिंक शेयर करें। क्रेडिट पाने के लिए दोस्तों को आपके लिंक से रजिस्टर करना होगा।",
  rewardsTitle: "कैश रिवॉर्ड अनुपात",
  rewardsSubtitle: "डाउनलाइन टर्नओवर के आधार पर दैनिक रिवॉर्ड",
  levelLabel: "लेवल",
  loading: "रेफरल डेटा लोड हो रहा है…",
  loadError: "रेफरल डेटा लोड नहीं हो सका।",
  retry: "फिर से कोशिश करें",
};

const catalogs: Record<Locale, MyReferralMessages> = { en, bn, hi };

export function getMyReferralMessages(locale: Locale): MyReferralMessages {
  return catalogs[locale] ?? catalogs.bn;
}

export function formatMyReferralAmount(locale: Locale, value: number): string {
  const formatted = value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return formatReferralNumber(locale, formatted);
}
