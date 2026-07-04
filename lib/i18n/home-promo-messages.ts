import type { Locale } from "@/lib/locale";

export type HomePromoMessages = {
  slide1Title: string;
  slide2Title: string;
  close: string;
  previousSlide: string;
  nextSlide: string;
  newMemberBanner: string;
  firstDepositBonus: string;
  secondDepositBonus: string;
  thirdDepositBonus: string;
  referralBanner: string;
  referralEarnText: string;
  perInvitation: string;
  perDeposit: string;
  appDownloadBanner: string;
  appDownloadLine1: string;
  appDownloadGift: string;
  downloadApp: string;
  exclusiveEventBanner: string;
  cashbackEvent: string;
  saturdayLogin: string;
  memberDay: string;
};

const en: HomePromoMessages = {
  slide1Title: "New Member Benefits",
  slide2Title: "Download the App",
  close: "Close",
  previousSlide: "Previous slide",
  nextSlide: "Next slide",
  newMemberBanner: "3 Big Benefits for New Members",
  firstDepositBonus: "First deposit bonus 120%",
  secondDepositBonus: "Second deposit bonus 48%",
  thirdDepositBonus: "Third deposit bonus 38%",
  referralBanner: "4 Referral Commissions",
  referralEarnText: "Earn approximately ৳88,500 for each successful invitation",
  perInvitation: "Each invitation 300TK",
  perDeposit: "Each deposit 0.88%",
  appDownloadBanner: "Download the App",
  appDownloadLine1: "Download the BKBaji app",
  appDownloadGift: "Get a download gift of 83,888",
  downloadApp: "Download now",
  exclusiveEventBanner: "Exclusive Event",
  cashbackEvent: "Bet 89+ get 3% cashback",
  saturdayLogin: "Log in every Saturday",
  memberDay: "Member day every 25th",
};

const bn: HomePromoMessages = {
  slide1Title: "নতুন সদস্যের সুবিধা",
  slide2Title: "অ্যাপ ডাউনলোড করুন",
  close: "বন্ধ",
  previousSlide: "আগের স্লাইড",
  nextSlide: "পরের স্লাইড",
  newMemberBanner: "নতুন সদস্য ৩ টি বড় সুবিধা",
  firstDepositBonus: "প্রথম ডিপোজিট বোনাস ১২০%",
  secondDepositBonus: "দ্বিতীয় ডিপোজিট বোনাস ৪৮%",
  thirdDepositBonus: "তৃতীয় ডিপোজিট বোনাস ৩৮%",
  referralBanner: "৪ টি রেফার কমিশন",
  referralEarnText: "প্রায় টাকা ৮৮,৫০০ উপার্জন করুন প্রতিটি সফল আমন্ত্রণের জন্য",
  perInvitation: "প্রতিটি আমন্ত্রণ ৩০০ টাকা",
  perDeposit: "প্রতিটি ডিপোজিট ০.৮৮%",
  appDownloadBanner: "অ্যাপ ডাউনলোড করুন",
  appDownloadLine1: "BKBaji অ্যাপটি ডাউনলোড করুন",
  appDownloadGift: "ডাউনলোড উপহার পান ৮৩,৮৮৮",
  downloadApp: "এখনই ডাউনলোড",
  exclusiveEventBanner: "এক্সক্লুসিভ ইভেন্ট",
  cashbackEvent: "বাজি ৮৯+ ক্যাশব্যাক ৩% পান",
  saturdayLogin: "প্রতি শনিবার লগ ইন করুন",
  memberDay: "সদস্য দিবস প্রতি ২৫ তারিখ",
};

const hi: HomePromoMessages = {
  slide1Title: "नए सदस्य लाभ",
  slide2Title: "ऐप डाउनलोड करें",
  close: "बंद करें",
  previousSlide: "पिछली स्लाइड",
  nextSlide: "अगली स्लाइड",
  newMemberBanner: "नए सदस्यों के 3 बड़े लाभ",
  firstDepositBonus: "पहली जमा बोनस 120%",
  secondDepositBonus: "दूसरी जमा बोनस 48%",
  thirdDepositBonus: "तीसरी जमा बोनस 38%",
  referralBanner: "4 रेफरल कमीशन",
  referralEarnText: "प्रत्येक सफल आमंत्रण पर लगभग ৳88,500 कमाएं",
  perInvitation: "प्रत्येक आमंत्रण 8228",
  perDeposit: "प्रत्येक जमा 0.88%",
  appDownloadBanner: "ऐप डाउनलोड करें",
  appDownloadLine1: "BKBaji ऐप डाउनलोड करें",
  appDownloadGift: "डाउनलोड उपहार पाएं 83,888",
  downloadApp: "अभी डाउनलोड करें",
  exclusiveEventBanner: "विशेष इवेंट",
  cashbackEvent: "89+ बेट पर 3% कैशबैक",
  saturdayLogin: "हर शनिवार लॉग इन करें",
  memberDay: "सदस्य दिवस हर 25 तारीख",
};

const byLocale: Record<Locale, HomePromoMessages> = { en, bn, hi };

export function getHomePromoMessages(locale: Locale): HomePromoMessages {
  return byLocale[locale] ?? bn;
}
