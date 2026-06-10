import type { Locale } from "@/lib/locale";

export type SignInRewardMessages = {
  pageTitle: string;
  lastSignIn: string;
  signInTotalBonus: string;
  planTitle: string;
  notCheckedInToday: string;
  minimumDepositAmount: string;
  dayPrefix: string;
  bonusLabel: string;
  signInButton: string;
  redEnvelopeNote: string;
  goldenEggNote: string;
  rulesTitle: string;
  rulesBody: string;
};

const en: SignInRewardMessages = {
  pageTitle: "Sign In",
  lastSignIn: "Last sign in",
  signInTotalBonus: "Sign in total bonus",
  planTitle: "New Member Growth Plan",
  notCheckedInToday: "Not checked in today",
  minimumDepositAmount: "Minimum deposit amount：",
  dayPrefix: "Day",
  bonusLabel: "Bonus",
  signInButton: "Sign In",
  redEnvelopeNote: "(5*/-)Red envelope",
  goldenEggNote: "20 GoldenEgg",
  rulesTitle: "Sign-in rules",
  rulesBody:
    "This event runs in a 7-day cycle, with different task requirements each day. The goal is to help new members understand how the event works, and to provide more reward benefits for valuable members who play and collect every day.",
};

const bn: SignInRewardMessages = {
  pageTitle: "সাইন ইন",
  lastSignIn: "সর্বশেষ সাইন ইন",
  signInTotalBonus: "সাইন ইন মোট বোনাস",
  planTitle: "নতুন সদস্য বৃদ্ধির পরিকল্পনা",
  notCheckedInToday: "আজ চেক ইন করা হয়নি",
  minimumDepositAmount: "সর্বনিম্ন ডিপোজিটের পরিমাণ：",
  dayPrefix: "Day",
  bonusLabel: "Bonus",
  signInButton: "Sign In",
  redEnvelopeNote: "(5*/-)Red envelope",
  goldenEggNote: "20 GoldenEgg",
  rulesTitle: "Sign-in rules",
  rulesBody:
    "এই ইভেন্টটির চক্র ৭ দিন, প্রতিদিন বিভিন্ন কাজের প্রয়োজনীয়তা সহ। লক্ষ্য হল নতুন সদস্যদের ইভেন্টটি কীভাবে কাজ করে তা বুঝতে সাহায্য করা এবং প্রতিদিন খেলে এবং সংগ্রহ করে এমন মূল্যবান সদস্যদের জন্য আরও পুরষ্কার সুবিধার দিকে কাজ করা।",
};

const hi: SignInRewardMessages = {
  pageTitle: "साइन इन",
  lastSignIn: "अंतिम साइन इन",
  signInTotalBonus: "साइन इन कुल बोनस",
  planTitle: "नए सदस्य विकास योजना",
  notCheckedInToday: "आज चेक इन नहीं किया",
  minimumDepositAmount: "न्यूनतम जमा राशि：",
  dayPrefix: "Day",
  bonusLabel: "Bonus",
  signInButton: "Sign In",
  redEnvelopeNote: "(5*/-)Red envelope",
  goldenEggNote: "20 GoldenEgg",
  rulesTitle: "Sign-in rules",
  rulesBody:
    "यह इवेंट 7 दिनों के चक्र में चलता है, हर दिन अलग-अलग कार्य आवश्यकताओं के साथ। लक्ष्य है नए सदस्यों को यह समझने में मदद करना कि इवेंट कैसे काम करता है, और हर दिन खेलने व संग्रह करने वाले मूल्यवान सदस्यों के लिए और अधिक रिवॉर्ड लाभ प्रदान करना।",
};

const byLocale: Record<Locale, SignInRewardMessages> = { en, bn, hi };

export function getSignInRewardMessages(locale: Locale): SignInRewardMessages {
  return byLocale[locale] ?? en;
}
