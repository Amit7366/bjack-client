import type { Locale } from "@/lib/locale";
import type { MemberSection } from "@/lib/member-routes";

export type ProfileMenuItemId = MemberSection;

export type ProfileMessages = {
  navLabel: string;
  usernameLabel: string;
  memberIdLabel: string;
  signUpDateLabel: string;
  copyUsername: string;
  copyMemberId: string;
  memberIdCopiedToast: string;
  copyFailedToast: string;
  copied: string;
  mainWallet: string;
  vipPoints: string;
  vipStatusNormal: string;
  deposit: string;
  withdraw: string;
  logout: string;
  menu: Record<ProfileMenuItemId, string>;
  sectionTitles: Record<ProfileMenuItemId, string>;
  sectionPlaceholder: string;
};

const menuEn: ProfileMessages["menu"] = {
  notification: "Notifications",
  "personal-info": "Personal Information",
  "login-security": "Login & Security",
  verification: "Verification",
  "transaction-records": "Transaction Records",
  "betting-records": "Betting Records",
  turnover: "Turnover",
  "my-vip": "My VIP",
  "my-referral": "My Referral",
  "add-wallet": "Add Wallet",
};

const en: ProfileMessages = {
  navLabel: "Profile",
  usernameLabel: "Username",
  memberIdLabel: "Member ID",
  signUpDateLabel: "Sign up date",
  copyUsername: "Copy username",
  copyMemberId: "Copy member ID",
  memberIdCopiedToast: "Member ID copied to clipboard",
  copyFailedToast: "Could not copy. Please try again.",
  copied: "Copied",
  mainWallet: "Main wallet",
  vipPoints: "VIP points",
  vipStatusNormal: "Normal",
  deposit: "Deposit",
  withdraw: "Withdraw",
  logout: "Log out",
  menu: menuEn,
  sectionTitles: menuEn,
  sectionPlaceholder: "Member area content will be available here soon.",
};

const bn: ProfileMessages = {
  navLabel: "প্রোফাইল",
  usernameLabel: "ব্যবহারকারীর নাম",
  memberIdLabel: "আইডি",
  signUpDateLabel: "সাইন আপ এর তারিখ",
  copyUsername: "ব্যবহারকারীর নাম কপি করুন",
  copyMemberId: "আইডি কপি করুন",
  memberIdCopiedToast: "আইডি ক্লিপবোর্ডে কপি হয়েছে",
  copyFailedToast: "কপি করা যায়নি। আবার চেষ্টা করুন।",
  copied: "কপি হয়েছে",
  mainWallet: "মেইন ওয়ালেট",
  vipPoints: "ভিআইপি পয়েন্ট",
  vipStatusNormal: "নরমাল",
  deposit: "ডিপোজিট",
  withdraw: "উইথড্র",
  logout: "লগ আউট",
  menu: {
    notification: "নোটিফিকেশন",
    "personal-info": "ব্যক্তিগত তথ্য",
    "login-security": "লগইন & সিকিউরিটি",
    verification: "ভেরিফিকেশন",
    "transaction-records": "ট্রানজ্যাকশন রেকর্ডস",
    "betting-records": "বেটিং রেকর্ডস",
    turnover: "টার্নওভার",
    "my-vip": "মাই ভিআইপি",
    "my-referral": "মাই রেফারেল",
    "add-wallet": "ওয়ালেট যুক্ত করুন",
  },
  sectionTitles: {
    notification: "নোটিফিকেশন",
    "personal-info": "ব্যক্তিগত তথ্য",
    "login-security": "লগইন & সিকিউরিটি",
    verification: "ভেরিফিকেশন",
    "transaction-records": "ট্রানজ্যাকশন রেকর্ডস",
    "betting-records": "বেটিং রেকর্ডস",
    turnover: "টার্নওভার",
    "my-vip": "মাই ভিআইপি",
    "my-referral": "মাই রেফারেল",
    "add-wallet": "ওয়ালেট যুক্ত করুন",
  },
  sectionPlaceholder: "সদস্য এলাকার বিষয়বস্তু শীঘ্রই এখানে উপলব্ধ হবে।",
};

const hi: ProfileMessages = {
  navLabel: "प्रोफ़ाइल",
  usernameLabel: "उपयोगकर्ता नाम",
  memberIdLabel: "सदस्य ID",
  signUpDateLabel: "साइन अप की तारीख",
  copyUsername: "उपयोगकर्ता नाम कॉपी करें",
  copyMemberId: "सदस्य ID कॉपी करें",
  memberIdCopiedToast: "सदस्य ID क्लिपबोर्ड पर कॉपी हो गया",
  copyFailedToast: "कॉपी नहीं हो सका। पुनः प्रयास करें।",
  copied: "कॉपी हो गया",
  mainWallet: "मुख्य वॉलेट",
  vipPoints: "VIP अंक",
  vipStatusNormal: "सामान्य",
  deposit: "जमा",
  withdraw: "निकासी",
  logout: "लॉग आउट",
  menu: {
    notification: "सूचनाएँ",
    "personal-info": "व्यक्तिगत जानकारी",
    "login-security": "लॉगिन और सुरक्षा",
    verification: "सत्यापन",
    "transaction-records": "लेनदेन रिकॉर्ड",
    "betting-records": "बेटिंग रिकॉर्ड",
    turnover: "टर्नओवर",
    "my-vip": "मेरा VIP",
    "my-referral": "मेरा रेफरल",
    "add-wallet": "वॉलेट जोड़ें",
  },
  sectionTitles: {
    notification: "सूचनाएँ",
    "personal-info": "व्यक्तिगत जानकारी",
    "login-security": "लॉगिन और सुरक्षा",
    verification: "सत्यापन",
    "transaction-records": "लेनदेन रिकॉर्ड",
    "betting-records": "बेटिंग रिकॉर्ड",
    turnover: "टर्नओवर",
    "my-vip": "मेरा VIP",
    "my-referral": "मेरा रेफरल",
    "add-wallet": "वॉलेट जोड़ें",
  },
  sectionPlaceholder: "सदस्य क्षेत्र की सामग्री जल्द यहाँ उपलब्ध होगी।",
};

const byLocale: Record<Locale, ProfileMessages> = { en, bn, hi };

export function getProfileMessages(locale: Locale): ProfileMessages {
  return byLocale[locale] ?? en;
}

export const PROFILE_MENU_ITEMS: { id: ProfileMenuItemId; icon: string }[] = [
  { id: "notification", icon: "bell" },
  { id: "personal-info", icon: "user" },
  { id: "login-security", icon: "lock" },
  { id: "verification", icon: "shield" },
  { id: "add-wallet", icon: "wallet" },
  { id: "transaction-records", icon: "transaction" },
  { id: "betting-records", icon: "betting" },
  { id: "turnover", icon: "chart" },
  { id: "my-vip", icon: "crown" },
  { id: "my-referral", icon: "referral" },
];
