import type { Locale } from "@/lib/locale";
import { formatReferralNumber } from "./referral-messages";

export type ReferralRulesTableRow = {
  turnover: string;
  tier1: string;
  tier2: string;
  tier3: string;
};

export type ReferralRulesMessages = {
  modalTitle: string;
  close: string;
  intro: [string, string];
  whatToDoTitle: string;
  whatToDoItems: [string, string];
  referralCode: string;
  referralLink: string;
  whatYouGetTitle: string;
  whatYouGetBody: string;
  tableHeaders: ReferralRulesTableRow;
  tableRows: ReferralRulesTableRow[];
  notes: [string, string, string];
  effectiveTurnover: string;
  noteEffectiveSuffix: string;
  oddsExcludedHere: string;
  noteOddsSuffix: string;
  exampleTitle: string;
  exampleItems: [string, string, string];
  exampleRewards: [string, string];
  wageringTitle: string;
  wageringItems: [string, string];
  limitationsTitle: string;
  limitationsItems: [string, string, string, string];
  otherTermsTitle: string;
  otherTermsItems: [string, string, string];
};

const tableRowsBn: ReferralRulesTableRow[] = [
  { turnover: "≥ ৮,১০০", tier1: "০.১০%", tier2: "০.০৫%", tier3: "০.০১%" },
  { turnover: "≥ ৮,১০,০০০", tier1: "০.১৫%", tier2: "০.০৬%", tier3: "০.০২%" },
  { turnover: "≥ ৮,২০,০০০", tier1: "০.২০%", tier2: "০.০৭%", tier3: "০.০৩%" },
];

const tableRowsEn: ReferralRulesTableRow[] = [
  { turnover: "≥ 8,100", tier1: "0.10%", tier2: "0.05%", tier3: "0.01%" },
  { turnover: "≥ 810,000", tier1: "0.15%", tier2: "0.06%", tier3: "0.02%" },
  { turnover: "≥ 820,000", tier1: "0.20%", tier2: "0.07%", tier3: "0.03%" },
];

const bn: ReferralRulesMessages = {
  modalTitle: "Rules",
  close: "Close",
  intro: [
    "রেফারেলের সমপরিমাণ রিওয়ার্ড! আনলিমিটেড ডেইলি ক্যাশ রিওয়ার্ড আমাদের 'রেফার এ ফ্রেন্ড' প্রোগ্রামের মাধ্যমে ক্লেইম করার জন্য প্রস্তুত।",
    "এই প্রমোশনটি সকল সদস্যদের জন্য এভেইল্যাবল। প্রমোশন শুরু 30th সেপ্টেম্বর ২০২৪ তারিখ ২২:০০ (GMT+6) থেকে।",
  ],
  whatToDoTitle: "আপনার কি করা উচিত?",
  whatToDoItems: [
    "আপনার বন্ধুদের সাথে আপনার 'রেফারেল কোড' বা 'রেফারেল লিঙ্ক' শেয়ার করুন।",
    "রেফারিকে 'রেফারেল কোড' বা 'রেফারেল লিঙ্ক' এর মাধ্যমে রেজিস্টার করতে হবে।",
  ],
  referralCode: "রেফারেল কোড",
  referralLink: "রেফারেল লিঙ্ক",
  whatYouGetTitle: "আপনি কি পাবেন?",
  whatYouGetBody:
    "আপনার রেফারি এবং তাদের রেফারেলদের দ্বারা সংগৃহীত মোট টার্নওভারের উপর ভিত্তি করে আপনি আনলিমিটেড ডেইলি ক্যাশ রিওয়ার্ড পাবেন, যেমনটি নীচের টেবিলে বলা হয়েছে।",
  tableHeaders: {
    turnover: "ডেইলি টার্নওভার",
    tier1: "টিয়ার ১",
    tier2: "টিয়ার ২",
    tier3: "টিয়ার ৩",
  },
  tableRows: tableRowsBn,
  notes: [
    "দিনের ২২:০০ (GMT+6) থেকে পরের দিনের ২১:৫৯ (GMT+6) পর্যন্ত সেটেল করা বেটগুলি টার্নওভার ক্যালকুলেশনের ক্ষেত্রে ধরা হবে।",
    "কার্যকর টার্নওভার-এর ভিত্তিতেই টার্নওভার ক্যালকুলেশন করা হবে।",
    "এখানে তালিকাভুক্ত অডসগুলো দিয়ে গেম এবং স্পোর্টস মার্কেটে রাখা বেটগুলি টার্নওভার ক্যালকুলেশনের সময় বাদ দেওয়া হয়।",
  ],
  effectiveTurnover: "কার্যকর টার্নওভার",
  noteEffectiveSuffix: "-এর ভিত্তিতেই টার্নওভার ক্যালকুলেশন করা হবে।",
  oddsExcludedHere: "এখানে",
  noteOddsSuffix: " তালিকাভুক্ত অডসগুলো দিয়ে গেম এবং স্পোর্টস মার্কেটে রাখা বেটগুলি টার্নওভার ক্যালকুলেশনের সময় বাদ দেওয়া হয়।",
  exampleTitle: "উদাহরণ:",
  exampleItems: [
    "টিয়ার ১: যখন bjraf000 রেফার করে bjraf001-কে, তখন bjraf001 হয় bjraf000 এর 'টিয়ার ১' রেফারি।",
    "টিয়ার ২: bjraf001 যদি bjraf002 কে রেফার করে, bjraf002 তখন bjraf000 এর 'টিয়ার ২' রেফারি হয়ে যায়।",
    "টিয়ার ৩: একইভাবে যদি bjraf002 রেফার করে bjraf003-কে, bjraf003 তখন bjraf000 এর 'টিয়ার ৩' রেফারি হয়ে যাবে।",
  ],
  exampleRewards: [
    "যদি bjraf000-এর সকল 'টিয়ার ১' রেফারিদের মোট টার্নওভার ১০,০০০ টাকা হয়, bjraf000 ০.১৫% ক্যাশ রিওয়ার্ড পাবে।",
    "একইভাবে, যখন সকল 'টিয়ার ২' রেফারিদের মোট টার্নওভার ২০,০০০ টাকায় হিট করে, bjraf000 তখন ০.০৭% ক্যাশ রিওয়ার্ড পাবেন।",
  ],
  wageringTitle: "ক্যাশ রিওয়ার্ড ওয়েজারিং রিকোয়ারমেন্ট:",
  wageringItems: [
    "ক্যাশ রিওয়ার্ড প্রতিদিন ১৩:০০ (GMT+6) এর মধ্যে 'রেফারেল প্রোগ্রাম' পেইজে আপনার 'ক্যাশ রিওয়ার্ড' সেকশনে জমা হবে।",
    "ক্যাশ রিওয়ার্ড রিয়েল ক্যাশে দেওয়া হবে, কোনও ওয়েজারিং রিকোয়ারমেন্ট (টার্নওভার) নেই।",
  ],
  limitationsTitle: "সীমাবদ্ধতা:",
  limitationsItems: [
    "ন্যূনতম ক্যাশ রিওয়ার্ড পেআউট হল ০.০১ টাকা এবং সর্বোচ্চ পেআউট এর ক্ষেত্রে কোন লিমিট নেই।",
    "বোনাস বেট এই প্রমোশনে অন্তর্ভুক্ত হয় না।",
    "রেফারিরা যদি 'রেফারেল কোড' বা 'রেফারেল লিঙ্ক' ব্যবহার করে রেজিস্ট্রেশন না করে, তাহলে রেজিস্ট্রেশন সম্পূর্ণ হওয়ার পরে তারা 'রেফারেল কোড' প্রবেশ করাতে পারবে না।",
    "ফার্স্ট উইথড্র করার আগে অ্যাকাউন্টে কমপক্ষে একটি ডিপোজিট রেকর্ড থাকা আবশ্যক।",
  ],
  otherTermsTitle: "অন্যান্য শর্ত:",
  otherTermsItems: [
    "যদি অ্যাকাউন্টের ব্যাপারে কোন প্রকার অপব্যবহারের সন্দেহ হয় এবং / অথবা প্রাপ্ত সুবিধাটি মেনে না নেয় তবে BKBaji বোনাস বাতিলের অধিকার সংরক্ষণ করে।",
    "যে কোনও সময় এই প্রমোশন থেকে যে কোনও প্লেয়ারকে বাদ দিতে এবং কোনও ব্যাখ্যা না দিয়ে পরিবর্তন, সংশোধন, এবং / অথবা কোনও বোনাস অফার বা প্রমোশন বাতিল করার অধিকার BKBaji সংরক্ষণ করে।",
    "BKBaji-র সাধারণ নীতিমালা এবং শর্তাদি প্রযোজ্য।",
  ],
};

const en: ReferralRulesMessages = {
  modalTitle: "Rules",
  close: "Close",
  intro: [
    "Referral-matched rewards! Unlimited daily cash rewards are ready to claim through our 'Refer a Friend' program.",
    "This promotion is available to all members. The promotion starts on 30th September 2024 at 22:00 (GMT+6).",
  ],
  whatToDoTitle: "What should you do?",
  whatToDoItems: [
    "Share your 'referral code' or 'referral link' with your friends.",
    "Referees must register using your 'referral code' or 'referral link'.",
  ],
  referralCode: "referral code",
  referralLink: "referral link",
  whatYouGetTitle: "What will you get?",
  whatYouGetBody:
    "You will receive unlimited daily cash rewards based on the total turnover generated by your referees and their referrals, as shown in the table below.",
  tableHeaders: {
    turnover: "Daily Turnover",
    tier1: "Tier 1",
    tier2: "Tier 2",
    tier3: "Tier 3",
  },
  tableRows: tableRowsEn,
  notes: [
    "Bets settled from 22:00 (GMT+6) to 21:59 (GMT+6) the following day will count toward turnover calculation.",
    "Turnover calculation is based on effective turnover.",
    "Bets placed on games and sports markets at the listed odds here are excluded from turnover calculation.",
  ],
  effectiveTurnover: "effective turnover",
  noteEffectiveSuffix: " is used for turnover calculation.",
  oddsExcludedHere: "here",
  noteOddsSuffix: " listed odds on games and sports markets are excluded from turnover calculation.",
  exampleTitle: "Example:",
  exampleItems: [
    "Tier 1: When bjraf000 refers bjraf001, bjraf001 becomes bjraf000's 'Tier 1' referee.",
    "Tier 2: If bjraf001 refers bjraf002, bjraf002 becomes bjraf000's 'Tier 2' referee.",
    "Tier 3: Similarly, if bjraf002 refers bjraf003, bjraf003 becomes bjraf000's 'Tier 3' referee.",
  ],
  exampleRewards: [
    "If the total turnover of all 'Tier 1' referees of bjraf000 is 10,000 Taka, bjraf000 receives a 0.15% cash reward.",
    "Similarly, when all 'Tier 2' referees' total turnover hits 20,000 Taka, bjraf000 receives a 0.07% cash reward.",
  ],
  wageringTitle: "Cash reward wagering requirement:",
  wageringItems: [
    "Cash rewards are credited to your 'Cash Reward' section on the 'Referral Program' page by 13:00 (GMT+6) daily.",
    "Cash rewards are paid as real cash with no wagering requirement (turnover).",
  ],
  limitationsTitle: "Limitations:",
  limitationsItems: [
    "The minimum cash reward payout is 0.01 Taka and there is no maximum payout limit.",
    "Bonus bets are not included in this promotion.",
    "If referees do not register using a 'referral code' or 'referral link', they cannot enter a referral code after registration is complete.",
    "At least one deposit must be recorded in the account before the first withdrawal.",
  ],
  otherTermsTitle: "Other terms:",
  otherTermsItems: [
    "BKBaji reserves the right to cancel the bonus if there is any suspicion of account abuse and/or if the benefit received is not accepted.",
    "BKBaji reserves the right to exclude any player from this promotion at any time and to change, amend, and/or cancel any bonus offer or promotion without explanation.",
    "BKBaji's general terms and conditions apply.",
  ],
};

const hi: ReferralRulesMessages = {
  ...en,
  modalTitle: "नियम",
  close: "बंद करें",
  noteEffectiveSuffix: " के आधार पर टर्नओवर की गणना की जाती है।",
  noteOddsSuffix: " सूचीबद्ध ऑड्स वाले गेम और स्पोर्ट्स मार्केट के बेट टर्नओवर गणना से बाहर हैं।",
  whatToDoTitle: "आपको क्या करना चाहिए?",
  whatYouGetTitle: "आपको क्या मिलेगा?",
  exampleTitle: "उदाहरण:",
  wageringTitle: "कैश रिवॉर्ड वेजरिंग आवश्यकता:",
  limitationsTitle: "सीमाएँ:",
  otherTermsTitle: "अन्य शर्तें:",
  tableHeaders: {
    turnover: "दैनिक टर्नओवर",
    tier1: "टियर 1",
    tier2: "टियर 2",
    tier3: "टियर 3",
  },
};

const catalogs: Record<Locale, ReferralRulesMessages> = { en, bn, hi };

export function getReferralRulesMessages(locale: Locale): ReferralRulesMessages {
  return catalogs[locale] ?? catalogs.bn;
}

export function formatRulesText(locale: Locale, text: string): string {
  return formatReferralNumber(locale, text);
}
