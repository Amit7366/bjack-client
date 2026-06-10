import type { Locale } from "@/lib/locale";

export type MemberCenterItemId =
  | "reward-center"
  | "betting-record"
  | "profit-and-loss"
  | "deposit-record"
  | "withdrawal-record"
  | "account-record"
  | "my-account"
  | "security-center"
  | "invite-friends"
  | "mission"
  | "rebate"
  | "internal-message"
  | "suggestion"
  | "download-app"
  | "customer-service"
  | "logout";

export type MemberCenterMessages = {
  navLabel: string;
  pageTitle: string;
  signIn: string;
  nicknameLabel: string;
  joinedLabel: string;
  deposit: string;
  withdrawal: string;
  myCards: string;
  memberCenter: string;
  refreshBalance: string;
  copyMemberId: string;
  memberIdCopiedToast: string;
  copyFailedToast: string;
  editNickname: string;
  comingSoonToast: string;
  items: Record<MemberCenterItemId, string>;
};

const en: MemberCenterMessages = {
  navLabel: "Member",
  pageTitle: "My Account",
  signIn: "Sign In",
  nicknameLabel: "Nickname",
  joinedLabel: "Joined",
  deposit: "Deposit",
  withdrawal: "Withdrawal",
  myCards: "My Cards",
  memberCenter: "Member Center",
  refreshBalance: "Refresh balance",
  copyMemberId: "Copy member ID",
  memberIdCopiedToast: "Member ID copied to clipboard",
  copyFailedToast: "Could not copy. Please try again.",
  editNickname: "Edit nickname",
  comingSoonToast: "Coming soon",
  items: {
    "reward-center": "Reward Center",
    "betting-record": "Betting Record",
    "profit-and-loss": "Profit And Loss",
    "deposit-record": "Deposit Record",
    "withdrawal-record": "Withdrawal Record",
    "account-record": "Account Record",
    "my-account": "My Account",
    "security-center": "Security Center",
    "invite-friends": "Invite Friends",
    mission: "Mission",
    rebate: "Rebate",
    "internal-message": "Internal Message",
    suggestion: "Suggestion",
    "download-app": "Download APP",
    "customer-service": "Customer Service",
    logout: "Logout",
  },
};

const bn: MemberCenterMessages = {
  navLabel: "মেম্বার",
  pageTitle: "মাই অ্যাকাউন্ট",
  signIn: "সাইন ইন",
  nicknameLabel: "ডাকনাম",
  joinedLabel: "যোগদান",
  deposit: "ডিপোজিট",
  withdrawal: "উইথড্রয়াল",
  myCards: "মাই কার্ডস",
  memberCenter: "মেম্বার সেন্টার",
  refreshBalance: "ব্যালেন্স রিফ্রেশ করুন",
  copyMemberId: "আইডি কপি করুন",
  memberIdCopiedToast: "আইডি ক্লিপবোর্ডে কপি হয়েছে",
  copyFailedToast: "কপি করা যায়নি। আবার চেষ্টা করুন।",
  editNickname: "ডাকনাম পরিবর্তন করুন",
  comingSoonToast: "শীঘ্রই আসছে",
  items: {
    "reward-center": "রিওয়ার্ড সেন্টার",
    "betting-record": "বেটিং রেকর্ড",
    "profit-and-loss": "লাভ এবং ক্ষতি",
    "deposit-record": "ডিপোজিট রেকর্ড",
    "withdrawal-record": "উইথড্রয়াল রেকর্ড",
    "account-record": "অ্যাকাউন্ট রেকর্ড",
    "my-account": "মাই অ্যাকাউন্ট",
    "security-center": "সিকিউরিটি সেন্টার",
    "invite-friends": "বন্ধুদের আমন্ত্রণ",
    mission: "মিশন",
    rebate: "রিবেট",
    "internal-message": "ইন্টারনাল মেসেজ",
    suggestion: "পরামর্শ",
    "download-app": "অ্যাপ ডাউনলোড",
    "customer-service": "কাস্টমার সার্ভিস",
    logout: "লগ আউট",
  },
};

const hi: MemberCenterMessages = {
  navLabel: "सदस्य",
  pageTitle: "मेरा खाता",
  signIn: "साइन इन",
  nicknameLabel: "उपनाम",
  joinedLabel: "शामिल हुए",
  deposit: "जमा",
  withdrawal: "निकासी",
  myCards: "मेरे कार्ड",
  memberCenter: "सदस्य केंद्र",
  refreshBalance: "बैलेंस रिफ्रेश करें",
  copyMemberId: "सदस्य ID कॉपी करें",
  memberIdCopiedToast: "सदस्य ID क्लिपबोर्ड पर कॉपी हो गया",
  copyFailedToast: "कॉपी नहीं हो सका। पुनः प्रयास करें।",
  editNickname: "उपनाम बदलें",
  comingSoonToast: "जल्द आ रहा है",
  items: {
    "reward-center": "रिवॉर्ड सेंटर",
    "betting-record": "बेटिंग रिकॉर्ड",
    "profit-and-loss": "लाभ और हानि",
    "deposit-record": "जमा रिकॉर्ड",
    "withdrawal-record": "निकासी रिकॉर्ड",
    "account-record": "खाता रिकॉर्ड",
    "my-account": "मेरा खाता",
    "security-center": "सुरक्षा केंद्र",
    "invite-friends": "मित्रों को आमंत्रित करें",
    mission: "मिशन",
    rebate: "रिबेट",
    "internal-message": "आंतरिक संदेश",
    suggestion: "सुझाव",
    "download-app": "ऐप डाउनलोड",
    "customer-service": "ग्राहक सेवा",
    logout: "लॉग आउट",
  },
};

const byLocale: Record<Locale, MemberCenterMessages> = { en, bn, hi };

export function getMemberCenterMessages(locale: Locale): MemberCenterMessages {
  return byLocale[locale] ?? en;
}
