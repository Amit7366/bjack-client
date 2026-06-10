import type { Locale } from "@/lib/locale";

export type RewardCenterMessages = {
  pageTitle: string;
  signIn: string;
  nicknameLabel: string;
  benefits: string;
  bonus: string;
  rescueFund: string;
  inviteFriends: string;
  promoCode: string;
};

const en: RewardCenterMessages = {
  pageTitle: "Reward Center",
  signIn: "Sign In",
  nicknameLabel: "Nickname",
  benefits: "Benefits",
  bonus: "Bonus",
  rescueFund: "Rescue fund",
  inviteFriends: "Invite Friends",
  promoCode: "Promo Code",
};

const bn: RewardCenterMessages = {
  pageTitle: "রিওয়ার্ড সেন্টার",
  signIn: "সাইন ইন",
  nicknameLabel: "ডাকনাম",
  benefits: "বেনিফিটস",
  bonus: "বোনাস",
  rescueFund: "রেসকিউ ফান্ড",
  inviteFriends: "বন্ধুদের আমন্ত্রণ",
  promoCode: "প্রোমো কোড",
};

const hi: RewardCenterMessages = {
  pageTitle: "रिवॉर्ड सेंटर",
  signIn: "साइन इन",
  nicknameLabel: "उपनाम",
  benefits: "लाभ",
  bonus: "बोनस",
  rescueFund: "रेस्क्यू फंड",
  inviteFriends: "मित्रों को आमंत्रित करें",
  promoCode: "प्रोमो कोड",
};

const byLocale: Record<Locale, RewardCenterMessages> = { en, bn, hi };

export function getRewardCenterMessages(locale: Locale): RewardCenterMessages {
  return byLocale[locale] ?? en;
}
