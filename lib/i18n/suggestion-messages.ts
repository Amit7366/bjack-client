import type { Locale } from "@/lib/locale";

export type SuggestionCategory = "deposit" | "withdrawal" | "game" | "customer_service";

export type SuggestionMessages = {
  pageTitle: string;
  categoryPlaceholder: string;
  categorySheetTitle: string;
  categories: Record<SuggestionCategory, string>;
  messageLabel: string;
  messagePlaceholder: string;
  charCount: (current: number, max: number) => string;
  uploadLabel: string;
  captchaPlaceholder: string;
  submit: string;
  submitSuccess: string;
  submitError: string;
  captchaError: string;
  requiredFields: string;
  invalidImage: string;
  back: string;
};

const BN: SuggestionMessages = {
  pageTitle: "অভিযোগ / পরামর্শ",
  categoryPlaceholder: "* দয়া করে সমস্যার ধরণটি নির্বাচন করুন",
  categorySheetTitle: "দয়া করে সমস্যার ধরণটি নির্বাচন করুন",
  categories: {
    deposit: "আমানত",
    withdrawal: "উত্তোলন",
    game: "খেলা",
    customer_service: "গ্রাহক সেবা",
  },
  messageLabel: "* কিছু উন্নত করা যাবে কিনা?",
  messagePlaceholder: "দয়া করে বিষয়বস্তু লিখুন",
  charCount: (current, max) => `( ${current} / ${max} )`,
  uploadLabel: "আপলোড করুন",
  captchaPlaceholder: "* যাচাইকরণ কোড",
  submit: "জমা দিন",
  submitSuccess: "আপনার পরামর্শ সফলভাবে জমা হয়েছে",
  submitError: "জমা দেওয়া যায়নি, আবার চেষ্টা করুন",
  captchaError: "যাচাইকরণ কোড সঠিক নয়",
  requiredFields: "সব প্রয়োজনীয় ঘর পূরণ করুন",
  invalidImage: "শুধুমাত্র ছবি আপলোড করা যাবে",
  back: "পিছনে",
};

const EN: SuggestionMessages = {
  pageTitle: "Complaints / Suggestions",
  categoryPlaceholder: "* Please select the type of problem",
  categorySheetTitle: "Please select the type of problem",
  categories: {
    deposit: "Deposit",
    withdrawal: "Withdrawal",
    game: "Game",
    customer_service: "Customer Service",
  },
  messageLabel: "* Can anything be improved?",
  messagePlaceholder: "Please write the content",
  charCount: (current, max) => `( ${current} / ${max} )`,
  uploadLabel: "Upload",
  captchaPlaceholder: "* Verification code",
  submit: "Submit",
  submitSuccess: "Your suggestion was submitted successfully",
  submitError: "Could not submit, please try again",
  captchaError: "Invalid verification code",
  requiredFields: "Please fill all required fields",
  invalidImage: "Only image files are allowed",
  back: "Back",
};

const HI: SuggestionMessages = {
  pageTitle: "शिकायत / सुझाव",
  categoryPlaceholder: "* कृपया समस्या का प्रकार चुनें",
  categorySheetTitle: "कृपया समस्या का प्रकार चुनें",
  categories: {
    deposit: "जमा",
    withdrawal: "निकासी",
    game: "खेल",
    customer_service: "ग्राहक सेवा",
  },
  messageLabel: "* क्या कुछ सुधार किया जा सकता है?",
  messagePlaceholder: "कृपया विषय लिखें",
  charCount: (current, max) => `( ${current} / ${max} )`,
  uploadLabel: "अपलोड करें",
  captchaPlaceholder: "* सत्यापन कोड",
  submit: "जमा करें",
  submitSuccess: "आपका सुझाव सफलतापूर्वक जमा हो गया",
  submitError: "जमा नहीं हो सका, पुनः प्रयास करें",
  captchaError: "सत्यापन कोड गलत है",
  requiredFields: "कृपया सभी आवश्यक फ़ील्ड भरें",
  invalidImage: "केवल छवि फ़ाइलें अपलोड की जा सकती हैं",
  back: "वापस",
};

export function getSuggestionMessages(locale: Locale): SuggestionMessages {
  if (locale === "bn") return BN;
  if (locale === "hi") return HI;
  return EN;
}

export const SUGGESTION_CATEGORY_ORDER: SuggestionCategory[] = [
  "deposit",
  "withdrawal",
  "game",
  "customer_service",
];

export const MAX_SUGGESTION_MESSAGE_LENGTH = 500;
