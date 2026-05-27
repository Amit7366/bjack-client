import type { Locale } from "@/lib/locale";
import type { ProfileTabId } from "@/lib/member-profile-tabs";

export type MemberProfileMessages = {
  pageTitle: string;
  tabs: Record<ProfileTabId, string>;
  manage: string;
  copyUsername: string;
  copied: string;
  usernameCopiedToast: string;
  personalInfo: {
    username: string;
    fullLegalName: string;
    dateOfBirth: string;
    phone: string;
    email: string;
  };
  loginSecurity: {
    password: string;
  };
  verification: {
    banner: string;
    documents: string;
  };
};

const en: MemberProfileMessages = {
  pageTitle: "Profile",
  tabs: {
    "personal-info": "Personal info",
    "login-security": "Login & Security",
    verification: "Verification",
  },
  manage: "Manage",
  copyUsername: "Copy username",
  copied: "Copied",
  usernameCopiedToast: "Username copied",
  personalInfo: {
    username: "Username",
    fullLegalName: "Full legal name",
    dateOfBirth: "Date of birth",
    phone: "Phone",
    email: "Email",
  },
  loginSecurity: {
    password: "Password",
  },
  verification: {
    banner:
      "The following info will be reviewed when Withdrawal. Complete it in advance and get quick Withdrawal!",
    documents: "Documents",
  },
};

const bn: MemberProfileMessages = {
  pageTitle: "প্রোফাইল",
  tabs: {
    "personal-info": "ব্যক্তিগত তথ্য",
    "login-security": "লগইন & সিকিউরিটি",
    verification: "ভেরিফিকেশন",
  },
  manage: "ম্যানেজ",
  copyUsername: "ব্যবহারকারীর নাম কপি করুন",
  copied: "কপি হয়েছে",
  usernameCopiedToast: "ব্যবহারকারীর নাম কপি হয়েছে",
  personalInfo: {
    username: "ব্যবহারকারীর নাম",
    fullLegalName: "পূর্ণ আইনি নাম",
    dateOfBirth: "জন্ম তারিখ",
    phone: "ফোন",
    email: "ইমেইল",
  },
  loginSecurity: {
    password: "পাসওয়ার্ড",
  },
  verification: {
    banner:
      "উইথড্র করার সময় নিম্নলিখিত তথ্য পর্যালোচনা করা হবে। আগে থেকে সম্পূর্ণ করুন এবং দ্রুত উইথড্র পান!",
    documents: "ডকুমেন্টস",
  },
};

const hi: MemberProfileMessages = {
  pageTitle: "प्रोफ़ाइल",
  tabs: {
    "personal-info": "व्यक्तिगत जानकारी",
    "login-security": "लॉगिन और सुरक्षा",
    verification: "सत्यापन",
  },
  manage: "प्रबंधित करें",
  copyUsername: "उपयोगकर्ता नाम कॉपी करें",
  copied: "कॉपी हो गया",
  usernameCopiedToast: "उपयोगकर्ता नाम कॉपी हो गया",
  personalInfo: {
    username: "उपयोगकर्ता नाम",
    fullLegalName: "पूरा कानूनी नाम",
    dateOfBirth: "जन्म तिथि",
    phone: "फ़ोन",
    email: "ईमेल",
  },
  loginSecurity: {
    password: "पासवर्ड",
  },
  verification: {
    banner:
      "निकासी के समय निम्नलिखित जानकारी की समीक्षा की जाएगी। पहले से पूरा करें और तेज़ निकासी पाएं!",
    documents: "दस्तावेज़",
  },
};

const byLocale: Record<Locale, MemberProfileMessages> = { en, bn, hi };

export function getMemberProfileMessages(locale: Locale): MemberProfileMessages {
  return byLocale[locale] ?? en;
}
