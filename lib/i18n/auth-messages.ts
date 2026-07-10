import type { Locale } from "@/lib/locale";

export type AuthMessages = {
  logInTab: string;
  signUpTab: string;
  username: string;
  password: string;
  enterUsername: string;
  enterPassword: string;
  forgotPassword: string;
  forgotPasswordTitle: string;
  enterPhone: string;
  newPassword: string;
  enterNewPassword: string;
  next: string;
  backToLogin: string;
  forgotPasswordSuccess: string;
  forgotPasswordError: string;
  passwordStrengthInvalid: string;
  logInButton: string;
  chooseCurrency: string;
  phoneNumber: string;
  continue: string;
  stepContact: string;
  stepUsername: string;
  stepPassword: string;
  signUpButton: string;
  showPassword: string;
  hidePassword: string;
  home: string;
  loginError: string;
  registerError: string;
  selfReferralDeviceError: string;
  deviceAccountLimitError: string;
  networkError: string;
  passwordTooShort: string;
  phoneRequired: string;
  usernameRequired: string;
  passwordRequired: string;
};

const en: AuthMessages = {
  logInTab: "Log in",
  signUpTab: "Sign up",
  username: "Username",
  password: "Password",
  enterUsername: "Enter your username",
  enterPassword: "Enter your password",
  forgotPassword: "Forgot password?",
  forgotPasswordTitle: "Forgot password",
  enterPhone: "Enter your phone number",
  newPassword: "New password",
  enterNewPassword: "Enter your new password",
  next: "Next",
  backToLogin: "Back to login",
  forgotPasswordSuccess:
    "Request submitted. Please wait for admin approval, then log in with your new password.",
  forgotPasswordError: "Could not submit password reset request.",
  passwordStrengthInvalid: "Password does not meet the required rules.",
  logInButton: "Log in",
  chooseCurrency: "Choose currency",
  phoneNumber: "Phone number",
  continue: "Continue",
  stepContact: "Contact",
  stepUsername: "Username",
  stepPassword: "Password",
  signUpButton: "Sign up",
  showPassword: "Show password",
  hidePassword: "Hide password",
  home: "Home",
  loginError: "Login failed. Check your username and password.",
  registerError: "Sign up failed. That username or phone may already be in use.",
  selfReferralDeviceError:
    "You cannot register with your own referral code on this device. Remove the referral link and try again.",
  deviceAccountLimitError: "This device already has the maximum number of accounts (3).",
  networkError: "Could not reach the server. Try again.",
  passwordTooShort: "Password must be at least 6 characters.",
  phoneRequired: "Enter your phone number.",
  usernameRequired: "Enter a username.",
  passwordRequired: "Enter a password.",
};

const bn: AuthMessages = {
  logInTab: "লগ ইন",
  signUpTab: "সাইন আপ",
  username: "ব্যবহারকারীর নাম",
  password: "পাসওয়ার্ড",
  enterUsername: "আপনার ইউজার নেম লিখুন",
  enterPassword: "আপনার পাসওয়ার্ড লিখুন",
  forgotPassword: "পাসওয়ার্ড ভুলে গেছেন?",
  forgotPasswordTitle: "ফরগেট পাসওয়ার্ড",
  enterPhone: "আপনার ফোন নম্বর লিখুন",
  newPassword: "নতুন পাসওয়ার্ড",
  enterNewPassword: "আপনার নতুন পাসওয়ার্ড লিখুন",
  next: "পরবর্তী",
  backToLogin: "লগইনে ফিরে যান",
  forgotPasswordSuccess:
    "অনুরোধ জমা হয়েছে। অ্যাডমিন অনুমোদনের পর নতুন পাসওয়ার্ড দিয়ে লগইন করুন।",
  forgotPasswordError: "পাসওয়ার্ড রিসেট অনুরোধ জমা দেওয়া যায়নি।",
  passwordStrengthInvalid: "পাসওয়ার্ড প্রয়োজনীয় নিয়ম পূরণ করে না।",
  logInButton: "লগ ইন",
  chooseCurrency: "মুদ্রা বেছে নিন",
  phoneNumber: "ফোন নম্বর",
  continue: "চালিয়ে যান",
  stepContact: "যোগাযোগ",
  stepUsername: "ইউজারনেম",
  stepPassword: "পাসওয়ার্ড",
  signUpButton: "সাইন আপ",
  showPassword: "পাসওয়ার্ড দেখুন",
  hidePassword: "পাসওয়ার্ড লুকান",
  home: "হোম",
  loginError: "লগইন ব্যর্থ। ইউজারনেম ও পাসওয়ার্ড পরীক্ষা করুন।",
  registerError: "সাইন আপ ব্যর্থ। ইউজারনেম বা ফোন ইতিমধ্যে ব্যবহৃত হতে পারে।",
  selfReferralDeviceError:
    "এই ডিভাইসে নিজের রেফারেল কোড দিয়ে রেজিস্ট্রেশন করা যাবে না। রেফারেল লিঙ্ক সরিয়ে আবার চেষ্টা করুন।",
  deviceAccountLimitError: "এই ডিভাইসে সর্বোচ্চ ৩টি অ্যাকাউন্টের সীমা পূর্ণ হয়েছে।",
  networkError: "সার্ভারে সংযোগ করা যায়নি। আবার চেষ্টা করুন।",
  passwordTooShort: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।",
  phoneRequired: "আপনার ফোন নম্বর লিখুন।",
  usernameRequired: "একটি ইউজারনেম লিখুন।",
  passwordRequired: "একটি পাসওয়ার্ড লিখুন।",
};

const hi: AuthMessages = {
  logInTab: "लॉग इन",
  signUpTab: "साइन अप",
  username: "उपयोगकर्ता नाम",
  password: "पासवर्ड",
  enterUsername: "अपना उपयोगकर्ता नाम दर्ज करें",
  enterPassword: "अपना पासवर्ड दर्ज करें",
  forgotPassword: "पासवर्ड भूल गए?",
  forgotPasswordTitle: "पासवर्ड भूल गए",
  enterPhone: "अपना फ़ोन नंबर दर्ज करें",
  newPassword: "नया पासवर्ड",
  enterNewPassword: "अपना नया पासवर्ड दर्ज करें",
  next: "अगला",
  backToLogin: "लॉगिन पर वापस जाएँ",
  forgotPasswordSuccess:
    "अनुरोध जमा हो गया। एडमिन स्वीकृति के बाद नए पासवर्ड से लॉगिन करें।",
  forgotPasswordError: "पासवर्ड रीसेट अनुरोध जमा नहीं हो सका।",
  passwordStrengthInvalid: "पासवर्ड आवश्यक नियमों को पूरा नहीं करता।",
  logInButton: "लॉग इन",
  chooseCurrency: "मुद्रा चुनें",
  phoneNumber: "फ़ोन नंबर",
  continue: "जारी रखें",
  stepContact: "संपर्क",
  stepUsername: "उपयोगकर्ता नाम",
  stepPassword: "पासवर्ड",
  signUpButton: "साइन अप",
  showPassword: "पासवर्ड दिखाएँ",
  hidePassword: "पासवर्ड छिपाएँ",
  home: "होम",
  loginError: "लॉगिन विफल। उपयोगकर्ता नाम और पासवर्ड जाँचें।",
  registerError: "साइन अप विफल। यह उपयोगकर्ता नाम या फ़ोन पहले से उपयोग में हो सकता है।",
  selfReferralDeviceError:
    "इस डिवाइस पर अपने रेफरल कोड से पंजीकरण नहीं कर सकते। रेफरल लिंक हटाकर पुनः प्रयास करें।",
  deviceAccountLimitError: "इस डिवाइस पर अधिकतम 3 खातों की सीमा पूरी हो चुकी है।",
  networkError: "सर्वर तक पहुँच नहीं हो सकी। पुनः प्रयास करें।",
  passwordTooShort: "पासवर्ड कम से कम 6 अक्षर का होना चाहिए।",
  phoneRequired: "अपना फ़ोन नंबर दर्ज करें।",
  usernameRequired: "उपयोगकर्ता नाम दर्ज करें।",
  passwordRequired: "पासवर्ड दर्ज करें।",
};

const catalogs: Record<Locale, AuthMessages> = { en, bn, hi };

export function getAuthMessages(locale: Locale): AuthMessages {
  return catalogs[locale] ?? catalogs.bn;
}
