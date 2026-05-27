import type { Locale } from "@/lib/locale";

export type PersonalInfoMessages = {
  fullLegalName: {
    pageTitle: string;
    fieldLabel: string;
    fieldHint: string;
    placeholder: string;
    submit: string;
    submitted: string;
    saving: string;
    loadError: string;
    saveError: string;
    nameTooShort: string;
  };
  dateOfBirth: {
    pageTitle: string;
    fieldLabel: string;
    placeholder: string;
    submit: string;
    submitted: string;
    saving: string;
    loadError: string;
    saveError: string;
    invalidDate: string;
  };
  phone: {
    pageTitle: string;
    heading: string;
    subtitle: string;
    fieldLabel: string;
    continue: string;
    invalidPhone: string;
  };
  email: {
    pageTitle: string;
    heading: string;
    subtitle: string;
    fieldLabel: string;
    placeholder: string;
    submit: string;
    submitted: string;
    saving: string;
    loadError: string;
    saveError: string;
    invalidEmail: string;
  };
  verify: {
    phoneTitle: string;
    emailTitle: string;
    phoneSubtitle: string;
    emailSubtitle: string;
    resend: string;
    resendIn: string;
    submit: string;
    invalidCode: string;
    successPhone: string;
    successEmail: string;
  };
  privacyText: string;
  contactCs: string;
  back: string;
};

const en: PersonalInfoMessages = {
  fullLegalName: {
    pageTitle: "Full legal name",
    fieldLabel: "Full legal name",
    fieldHint: "Must match your government-issued ID.",
    placeholder: "Enter your full legal name",
    submit: "Submit",
    submitted: "Full legal name saved.",
    saving: "Saving…",
    loadError: "Could not load your legal name.",
    saveError: "Could not save your legal name. Try again.",
    nameTooShort: "Name must be at least 3 characters.",
  },
  dateOfBirth: {
    pageTitle: "Date of birth",
    fieldLabel: "Date of birth",
    placeholder: "YYYY-MM-DD",
    submit: "Submit",
    submitted: "Date of birth saved.",
    saving: "Saving…",
    loadError: "Could not load your date of birth.",
    saveError: "Could not save your date of birth. Try again.",
    invalidDate: "Use date format YYYY-MM-DD.",
  },
  phone: {
    pageTitle: "Phone",
    heading: "Phone number",
    subtitle: "Your phone number will receive a verification code via SMS.",
    fieldLabel: "Phone number",
    continue: "Continue",
    invalidPhone: "Enter a valid phone number.",
  },
  email: {
    pageTitle: "Email",
    heading: "Email address",
    subtitle: "Enter the email address linked to your account.",
    fieldLabel: "Email",
    placeholder: "Enter your email",
    submit: "Submit",
    submitted: "Email saved.",
    saving: "Saving…",
    loadError: "Could not load your email.",
    saveError: "Could not save your email. Try again.",
    invalidEmail: "Enter a valid email address.",
  },
  verify: {
    phoneTitle: "Verify phone",
    emailTitle: "Verify email",
    phoneSubtitle: "Enter the 6-digit code sent to your phone.",
    emailSubtitle: "Enter the 6-digit code sent to your email.",
    resend: "Resend code",
    resendIn: "Resend in {seconds}s",
    submit: "Submit",
    invalidCode: "Incorrect code. Please try again.",
    successPhone: "Phone number verified.",
    successEmail: "Email verified.",
  },
  privacyText:
    "For privacy and security, information can't be modified after confirmation. Please ",
  contactCs: "Contact CS",
  back: "Back",
};

const bn: PersonalInfoMessages = {
  fullLegalName: {
    pageTitle: "পূর্ণ আইনি নাম",
    fieldLabel: "পূর্ণ আইনি নাম",
    fieldHint: "সরকারি আইডির সাথে মিলতে হবে।",
    placeholder: "আপনার পূর্ণ আইনি নাম লিখুন",
    submit: "জমা দিন",
    submitted: "পূর্ণ আইনি নাম সংরক্ষিত হয়েছে।",
    saving: "সংরক্ষণ হচ্ছে…",
    loadError: "আইনি নাম লোড করা যায়নি।",
    saveError: "আইনি নাম সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।",
    nameTooShort: "নাম কমপক্ষে ৩ অক্ষরের হতে হবে।",
  },
  dateOfBirth: {
    pageTitle: "জন্ম তারিখ",
    fieldLabel: "জন্ম তারিখ",
    placeholder: "YYYY-MM-DD",
    submit: "জমা দিন",
    submitted: "জন্ম তারিখ সংরক্ষিত হয়েছে।",
    saving: "সংরক্ষণ হচ্ছে…",
    loadError: "জন্ম তারিখ লোড করা যায়নি।",
    saveError: "জন্ম তারিখ সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।",
    invalidDate: "YYYY-MM-DD তারিখ ফরম্যাট ব্যবহার করুন।",
  },
  phone: {
    pageTitle: "ফোন",
    heading: "ফোন নম্বর",
    subtitle: "আপনার ফোন নম্বরে SMS এর মাধ্যমে একটি ভেরিফিকেশন কোড পাঠানো হবে।",
    fieldLabel: "ফোন নম্বর",
    continue: "চালিয়ে যান",
    invalidPhone: "একটি বৈধ ফোন নম্বর লিখুন।",
  },
  email: {
    pageTitle: "ইমেইল",
    heading: "ইমেইল ঠিকানা",
    subtitle: "আপনার অ্যাকাউন্টের সাথে যুক্ত ইমেইল ঠিকানা লিখুন।",
    fieldLabel: "ইমেইল",
    placeholder: "আপনার ইমেইল লিখুন",
    submit: "জমা দিন",
    submitted: "ইমেইল সংরক্ষিত হয়েছে।",
    saving: "সংরক্ষণ হচ্ছে…",
    loadError: "ইমেইল লোড করা যায়নি।",
    saveError: "ইমেইল সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।",
    invalidEmail: "একটি বৈধ ইমেইল লিখুন।",
  },
  verify: {
    phoneTitle: "ফোন যাচাই",
    emailTitle: "ইমেইল যাচাই",
    phoneSubtitle: "আপনার ফোনে পাঠানো ৬-অঙ্কের কোড লিখুন।",
    emailSubtitle: "আপনার ইমেইলে পাঠানো ৬-অঙ্কের কোড লিখুন।",
    resend: "কোড পুনরায় পাঠান",
    resendIn: "{seconds} সেকেন্ডে পুনরায় পাঠান",
    submit: "জমা দিন",
    invalidCode: "ভুল কোড। আবার চেষ্টা করুন।",
    successPhone: "ফোন নম্বর যাচাই হয়েছে।",
    successEmail: "ইমেইল যাচাই হয়েছে।",
  },
  privacyText:
    "গোপনীয়তা এবং নিরাপত্তার জন্য, নিশ্চিতকরণের পরে তথ্য পরিবর্তন করা যাবে না। অনুগ্রহ করে ",
  contactCs: "CS এর সাথে যোগাযোগ",
  back: "পিছনে",
};

const hi: PersonalInfoMessages = {
  fullLegalName: {
    pageTitle: "पूरा कानूनी नाम",
    fieldLabel: "पूरा कानूनी नाम",
    fieldHint: "सरकारी आईडी से मेल खाना चाहिए।",
    placeholder: "अपना पूरा कानूनी नाम दर्ज करें",
    submit: "जमा करें",
    submitted: "पूरा कानूनी नाम सहेजा गया।",
    saving: "सहेजा जा रहा है…",
    loadError: "कानूनी नाम लोड नहीं हो सका।",
    saveError: "कानूनी नाम सहेजा नहीं जा सका। पुनः प्रयास करें।",
    nameTooShort: "नाम कम से कम 3 अक्षर का होना चाहिए।",
  },
  dateOfBirth: {
    pageTitle: "जन्म तिथि",
    fieldLabel: "जन्म तिथि",
    placeholder: "YYYY-MM-DD",
    submit: "जमा करें",
    submitted: "जन्म तिथि सहेजी गई।",
    saving: "सहेजा जा रहा है…",
    loadError: "जन्म तिथि लोड नहीं हो सकी।",
    saveError: "जन्म तिथि सहेजी नहीं जा सकी। पुनः प्रयास करें।",
    invalidDate: "YYYY-MM-DD तिथि प्रारूप का उपयोग करें।",
  },
  phone: {
    pageTitle: "फ़ोन",
    heading: "फ़ोन नंबर",
    subtitle: "आपके फ़ोन नंबर पर SMS के माध्यम से सत्यापन कोड भेजा जाएगा।",
    fieldLabel: "फ़ोन नंबर",
    continue: "जारी रखें",
    invalidPhone: "एक वैध फ़ोन नंबर दर्ज करें।",
  },
  email: {
    pageTitle: "ईमेल",
    heading: "ईमेल पता",
    subtitle: "अपने खाते से जुड़ा ईमेल पता दर्ज करें।",
    fieldLabel: "ईमेल",
    placeholder: "अपना ईमेल दर्ज करें",
    submit: "जमा करें",
    submitted: "ईमेल सहेजा गया।",
    saving: "सहेजा जा रहा है…",
    loadError: "ईमेल लोड नहीं हो सका।",
    saveError: "ईमेल सहेजा नहीं जा सका। पुनः प्रयास करें।",
    invalidEmail: "एक वैध ईमेल दर्ज करें।",
  },
  verify: {
    phoneTitle: "फ़ोन सत्यापित करें",
    emailTitle: "ईमेल सत्यापित करें",
    phoneSubtitle: "अपने फ़ोन पर भेजा गया 6-अंकीय कोड दर्ज करें।",
    emailSubtitle: "अपने ईमेल पर भेजा गया 6-अंकीय कोड दर्ज करें।",
    resend: "कोड पुनः भेजें",
    resendIn: "{seconds} सेकंड में पुनः भेजें",
    submit: "जमा करें",
    invalidCode: "गलत कोड। कृपया पुनः प्रयास करें।",
    successPhone: "फ़ोन नंबर सत्यापित।",
    successEmail: "ईमेल सत्यापित।",
  },
  privacyText:
    "गोपनीयता और सुरक्षा के लिए, पुष्टि के बाद जानकारी संशोधित नहीं की जा सकती। कृपया ",
  contactCs: "CS से संपर्क करें",
  back: "वापस",
};

const byLocale: Record<Locale, PersonalInfoMessages> = { en, bn, hi };

export function getPersonalInfoMessages(locale: Locale): PersonalInfoMessages {
  return byLocale[locale] ?? en;
}
