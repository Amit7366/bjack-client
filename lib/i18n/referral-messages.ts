import type { Locale } from "@/lib/locale";

export type ReferralMessages = {
  pageTitle: string;
  whatIsTitle: string;
  whatIsP1: string;
  whatIsP2: string;
  rules: string;
  cashRewardTitle: string;
  turnoverRange: string;
  depositRange: string;
  winlossRange: string;
  moreThan: string;
  levelLabel: string;
  howToTitle: string;
  steps: {
    invite: { title: string; subtitle: string };
    register: { title: string; subtitle: string };
    earn: { title: string; subtitle: string };
  };
  bonusRanking: string;
  topRank: string;
  whoGotPrize: string;
  live: string;
  currency: string;
  prevLevels: string;
  nextLevels: string;
};

const en: ReferralMessages = {
  pageTitle: "Referral Program",
  whatIsTitle: "What is the Referral Program?",
  whatIsP1:
    "The BKBaji Referral Program is one of the most rewarding ways to earn extra cash. Invite your friends to join BKBaji and earn unlimited commission when they play or bet on our platform.",
  whatIsP2:
    "There is no limit to how much you can earn. The more friends you refer, the more rewards you receive. Start sharing your referral link today and watch your earnings grow!",
  rules: "Rules",
  cashRewardTitle: "Cash Reward Ratio",
  turnoverRange: "Turnover Range",
  depositRange: "Deposit Range",
  winlossRange: "Winloss Range",
  moreThan: "More Than",
  levelLabel: "Level",
  howToTitle: "How to get more prizes?",
  steps: {
    invite: { title: "Send Invitation", subtitle: "To start your referral journey" },
    register: { title: "Friend Registration", subtitle: "With placing a bet" },
    earn: { title: "Start earning unlimited cash every day", subtitle: "Without doing anything!" },
  },
  bonusRanking: "Bonus Ranking",
  topRank: "Top",
  whoGotPrize: "Who got the prize?",
  live: "Live",
  currency: "BDT",
  prevLevels: "Previous levels",
  nextLevels: "Next levels",
};

const bn: ReferralMessages = {
  pageTitle: "রেফারেল প্রোগ্রাম",
  whatIsTitle: "রেফারেল প্রোগ্রাম কি?",
  whatIsP1:
    "BKBaji রেফারেল প্রোগ্রাম অতিরিক্ত ক্যাশ উপার্জনের সবচেয়ে লাভজনক উপায়গুলির মধ্যে একটি। আপনার বন্ধুদের BKBaji-তে যোগ দিতে আমন্ত্রণ জানান এবং তারা যখন আমাদের প্ল্যাটফর্মে খেলবে বা বেট ধরবে তখন আনলিমিটেড কমিশন উপার্জন করুন।",
  whatIsP2:
    "আপনি কতটা উপার্জন করতে পারবেন তার কোনো সীমা নেই। যত বেশি বন্ধুকে রেফার করবেন, তত বেশি রিওয়ার্ড পাবেন। আজই আপনার রেফারেল লিংক শেয়ার করা শুরু করুন এবং আপনার আয় বাড়তে দেখুন!",
  rules: "নিয়মাবলী",
  cashRewardTitle: "ক্যাশ রিওয়ার্ড রেশিও",
  turnoverRange: "Turnover Range",
  depositRange: "Deposit Range",
  winlossRange: "Winloss Range",
  moreThan: "More Than",
  levelLabel: "লেভেল",
  howToTitle: "কিভাবে আরো প্রাইজ পাবেন?",
  steps: {
    invite: { title: "ইনভিটেশন পাঠান", subtitle: "আপনার রেফারেল জার্নি শুরু করতে" },
    register: { title: "ফ্রেন্ড রেজিস্ট্রেশন", subtitle: "বেট ধরার সাথে" },
    earn: { title: "প্রতিদিন আনলিমিটেড ক্যাশ উপার্জন শুরু করুন", subtitle: "কিছু না করেই!" },
  },
  bonusRanking: "বোনাস র‍্যাঙ্কিং",
  topRank: "টপ",
  whoGotPrize: "কে প্রাইজ পেয়েছে?",
  live: "Live",
  currency: "BDT",
  prevLevels: "আগের লেভেল",
  nextLevels: "পরের লেভেল",
};

const hi: ReferralMessages = {
  pageTitle: "रेफरल प्रोग्राम",
  whatIsTitle: "रेफरल प्रोग्राम क्या है?",
  whatIsP1:
    "BKBaji रेफरल प्रोग्राम अतिरिक्त कैश कमाने के सबसे लाभकारी तरीकों में से एक है। अपने दोस्तों को BKBaji में शामिल होने के लिए आमंत्रित करें और जब वे खेलें या बेट लगाएं तो असीमित कमीशन कमाएं।",
  whatIsP2:
    "आप कितना कमा सकते हैं इसकी कोई सीमा नहीं है। जितने अधिक दोस्तों को रेफर करेंगे, उतने अधिक रिवॉर्ड पाएंगे। आज ही अपना रेफरल लिंक शेयर करना शुरू करें!",
  rules: "नियम",
  cashRewardTitle: "कैश रिवॉर्ड अनुपात",
  turnoverRange: "Turnover Range",
  depositRange: "Deposit Range",
  winlossRange: "Winloss Range",
  moreThan: "More Than",
  levelLabel: "लेवल",
  howToTitle: "और प्राइज़ कैसे पाएं?",
  steps: {
    invite: { title: "निमंत्रण भेजें", subtitle: "अपनी रेफरल यात्रा शुरू करने के लिए" },
    register: { title: "मित्र पंजीकरण", subtitle: "बेट लगाने के साथ" },
    earn: { title: "हर दिन असीमित कैश कमाना शुरू करें", subtitle: "बिना कुछ किए!" },
  },
  bonusRanking: "बोनस रैंकिंग",
  topRank: "टॉप",
  whoGotPrize: "किसने प्राइज़ पाया?",
  live: "Live",
  currency: "BDT",
  prevLevels: "पिछले लेवल",
  nextLevels: "अगले लेवल",
};

const catalogs: Record<Locale, ReferralMessages> = { en, bn, hi };

export function getReferralMessages(locale: Locale): ReferralMessages {
  return catalogs[locale] ?? catalogs.bn;
}

/** Display numerals for BN locale where mockup uses Bengali digits */
export function formatReferralNumber(locale: Locale, value: string): string {
  if (locale !== "bn") return value;
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return value.replace(/\d/g, (d) => bnDigits[Number(d)] ?? d);
}
