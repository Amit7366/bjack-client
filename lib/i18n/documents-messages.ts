import type { Locale } from "@/lib/locale";
import type { DocumentTypeId, DocumentUploadSlot } from "@/lib/documents-data";

export type DocumentsMessages = {
  pageTitle: string;
  back: string;
  documentTypeLabel: string;
  documentTypePlaceholder: string;
  documentNoLabel: string;
  documentNoPlaceholder: string;
  expiryDateLabel: string;
  expiryDatePlaceholder: string;
  uploadLabels: Record<DocumentUploadSlot, string>;
  uploadButton: string;
  uploadHint: string;
  uploadReplace: string;
  reminderTitle: string;
  reminderItems: [string, string, string];
  privacyText: string;
  contactCs: string;
  submit: string;
  submitted: string;
  submitting: string;
  documentTypes: Record<DocumentTypeId, string>;
  errors: {
    required: string;
    fileType: string;
    fileSize: string;
    expiryFormat: string;
    submitFailed: string;
    pendingReview: string;
    alreadyApproved: string;
  };
};

const en: DocumentsMessages = {
  pageTitle: "Documents",
  back: "Back",
  documentTypeLabel: "Document (Any one)",
  documentTypePlaceholder: "Choose document type",
  documentNoLabel: "Document No.",
  documentNoPlaceholder: "No.",
  expiryDateLabel: "Expiry date",
  expiryDatePlaceholder: "YYYY-MM-DD",
  uploadLabels: {
    front: "Upload document photo (Front side)",
    back: "Upload document photo (Back side)",
    selfie: "Upload document photo (Selfie holding document near your face)",
  },
  uploadButton: "Upload",
  uploadHint: "Max 3 MB in JPG or JPEG or PNG",
  uploadReplace: "Replace",
  reminderTitle: "Reminder",
  reminderItems: [
    "Upload JPG or PNG file.",
    "Maximum upload file size 3 MB.",
    "Please ensure that all the information entered is consistent with your documents.",
  ],
  privacyText:
    "For privacy and security, information can't be modified after confirmation. Please ",
  contactCs: "Contact CS",
  submit: "Submit",
  submitted: "Documents submitted successfully.",
  submitting: "Submitting…",
  documentTypes: {
    nid: "National ID (NID)",
    passport: "Passport",
    "driving-license": "Driving license",
  },
  errors: {
    required: "Please complete all required fields and uploads.",
    fileType: "Only JPG, JPEG, or PNG files are allowed.",
    fileSize: "File must be 3 MB or smaller.",
    expiryFormat: "Use date format YYYY-MM-DD.",
    submitFailed: "Could not submit documents. Please try again.",
    pendingReview: "Your documents are already pending review.",
    alreadyApproved: "Your KYC is already approved.",
  },
};

const bn: DocumentsMessages = {
  pageTitle: "ডকুমেন্টস",
  back: "পিছনে",
  documentTypeLabel: "ডকুমেন্ট (যেকোনো একটি)",
  documentTypePlaceholder: "ডকুমেন্টের ধরন বেছে নিন",
  documentNoLabel: "ডকুমেন্ট নং",
  documentNoPlaceholder: "নং",
  expiryDateLabel: "মেয়াদ শেষের তারিখ",
  expiryDatePlaceholder: "YYYY-MM-DD",
  uploadLabels: {
    front: "ডকুমেন্টের ছবি আপলোড করুন (সামনের দিক)",
    back: "ডকুমেন্টের ছবি আপলোড করুন (পিছনের দিক)",
    selfie: "ডকুমেন্টের ছবি আপলোড করুন (মুখের কাছে ডকুমেন্ট ধরে সেলফি)",
  },
  uploadButton: "আপলোড",
  uploadHint: "সর্বোচ্চ ৩ এমবি JPG বা JPEG বা PNG",
  uploadReplace: "প্রতিস্থাপন",
  reminderTitle: "অনুস্মারক",
  reminderItems: [
    "JPG বা PNG ফাইল আপলোড করুন।",
    "সর্বোচ্চ আপলোড ফাইল সাইজ ৩ এমবি।",
    "অনুগ্রহ করে নিশ্চিত করুন যে প্রবেশ করা সমস্ত তথ্য আপনার ডকুমেন্টের সাথে সামঞ্জস্যপূর্ণ।",
  ],
  privacyText:
    "গোপনীয়তা এবং নিরাপত্তার জন্য, নিশ্চিতকরণের পরে তথ্য পরিবর্তন করা যাবে না। অনুগ্রহ করে ",
  contactCs: "CS এর সাথে যোগাযোগ",
  submit: "জমা দিন",
  submitted: "ডকুমেন্ট সফলভাবে জমা দেওয়া হয়েছে।",
  submitting: "জমা দেওয়া হচ্ছে…",
  documentTypes: {
    nid: "জাতীয় পরিচয়পত্র (NID)",
    passport: "পাসপোর্ট",
    "driving-license": "ড্রাইভিং লাইসেন্স",
  },
  errors: {
    required: "সমস্ত প্রয়োজনীয় ক্ষেত্র এবং আপলোড সম্পূর্ণ করুন।",
    fileType: "শুধুমাত্র JPG, JPEG, বা PNG ফাইল অনুমোদিত।",
    fileSize: "ফাইল ৩ এমবি বা তার চেয়ে ছোট হতে হবে।",
    expiryFormat: "YYYY-MM-DD তারিখ ফরম্যাট ব্যবহার করুন।",
    submitFailed: "ডকুমেন্ট জমা দেওয়া যায়নি। আবার চেষ্টা করুন।",
    pendingReview: "আপনার ডকুমেন্ট ইতিমধ্যে পর্যালোচনার অপেক্ষায় আছে।",
    alreadyApproved: "আপনার KYC ইতিমধ্যে অনুমোদিত।",
  },
};

const hi: DocumentsMessages = {
  pageTitle: "दस्तावेज़",
  back: "वापस",
  documentTypeLabel: "दस्तावेज़ (कोई एक)",
  documentTypePlaceholder: "दस्तावेज़ प्रकार चुनें",
  documentNoLabel: "दस्तावेज़ नंबर",
  documentNoPlaceholder: "नं.",
  expiryDateLabel: "समाप्ति तिथि",
  expiryDatePlaceholder: "YYYY-MM-DD",
  uploadLabels: {
    front: "दस्तावेज़ फोटो अपलोड करें (सामने की ओर)",
    back: "दस्तावेज़ फोटो अपलोड करें (पीछे की ओर)",
    selfie: "दस्तावेज़ फोटो अपलोड करें (चेहरे के पास दस्तावेज़ पकड़े सेल्फी)",
  },
  uploadButton: "अपलोड",
  uploadHint: "अधिकतम 3 MB JPG या JPEG या PNG",
  uploadReplace: "बदलें",
  reminderTitle: "अनुस्मारक",
  reminderItems: [
    "JPG या PNG फ़ाइल अपलोड करें।",
    "अधिकतम अपलोड फ़ाइल आकार 3 MB।",
    "कृपया सुनिश्चित करें कि दर्ज की गई सभी जानकारी आपके दस्तावेज़ों के अनुरूप है।",
  ],
  privacyText:
    "गोपनीयता और सुरक्षा के लिए, पुष्टि के बाद जानकारी संशोधित नहीं की जा सकती। कृपया ",
  contactCs: "CS से संपर्क करें",
  submit: "जमा करें",
  submitted: "दस्तावेज़ सफलतापूर्वक जमा किए गए।",
  submitting: "जमा हो रहा है…",
  documentTypes: {
    nid: "राष्ट्रीय पहचान पत्र (NID)",
    passport: "पासपोर्ट",
    "driving-license": "ड्राइविंग लाइसेंस",
  },
  errors: {
    required: "कृपया सभी आवश्यक फ़ील्ड और अपलोड पूरे करें।",
    fileType: "केवल JPG, JPEG, या PNG फ़ाइलें अनुमत हैं।",
    fileSize: "फ़ाइल 3 MB या उससे छोटी होनी चाहिए।",
    expiryFormat: "YYYY-MM-DD तिथि प्रारूप का उपयोग करें।",
    submitFailed: "दस्तावेज़ जमा नहीं हो सके। फिर से कोशिश करें।",
    pendingReview: "आपके दस्तावेज़ पहले से समीक्षा के लिए लंबित हैं।",
    alreadyApproved: "आपका KYC पहले से स्वीकृत है।",
  },
};

const byLocale: Record<Locale, DocumentsMessages> = { en, bn, hi };

export function getDocumentsMessages(locale: Locale): DocumentsMessages {
  return byLocale[locale] ?? en;
}
