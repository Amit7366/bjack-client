import { footerAboutExpanded, footerAboutPreview } from "./footer-about-text";

export type FooterMessages = {
  gaming: string;
  aboutBaji: string;
  features: string;
  help: string;
  sponsorships: string;
  brandAmbassadors: string;
  links: Record<string, string>;
  sponsorshipsData: Record<string, { name: string; role: string }>;
  ambassadorsData: Record<string, { name: string; years: string }>;
  bottom: {
    officialBrandPartner: string;
    gamingLicense: string;
    responsibleGaming: string;
    aboutHeading: string;
    aboutText: string;
    aboutTextMore: string;
    showMore: string;
    showLess: string;
    winLikeAKing: string;
    copyright: string;
    legalOwnership: string;
    legalContactPrefix: string;
    legalLicense: string;
    legalCompliance: string;
  };
};

export const footerEn: FooterMessages = {
  gaming: "Gaming",
  aboutBaji: "About rajabaji",
  features: "Features",
  help: "Help",
  sponsorships: "Sponsorships",
  brandAmbassadors: "Brand Ambassadors",
  links: {
    casino: "Casino",
    slots: "Slots",
    crash: "Crash",
    table: "Table",
    fishing: "Fishing",
    arcade: "Arcade",
    lottery: "Lottery",
    aboutUs: "About Us",
    privacyPolicy: "Privacy Policy",
    terms: "Terms & Conditions",
    responsibleGaming: "Responsible Gaming",
    kyc: "KYC",
    promotions: "Promotions",
    vipClub: "VIP Club",
    referral: "Referral",
    brandAmbassadors: "Brand Ambassadors",
    appDownload: "APP Download",
    bjForum: "rajabaji Forum",
  },
  sponsorshipsData: {
    quettaGladiators: { name: "Quetta Gladiators", role: "Titanium Sponsor, 2023" },
    sunrisersEasternCape: { name: "Sunrisers Eastern Cape", role: "Title Sponsor, 2023 - 2024" },
    deccanGladiators: { name: "Deccan Gladiators", role: "Title Sponsor, 2023 - 2024" },
    stKittsPatriots: { name: "St Kitts & Nevis Patriots", role: "Principle Sponsor, 2024 - 2025" },
    biratnagarKings: { name: "Biratnagar Kings", role: "Back of Jersey Sponsor, 2024 - 2025" },
  },
  ambassadorsData: {
    miaKhalifa: { name: "Mia Khalifa", years: "2024" },
    kevinPietersen: { name: "Kevin Pietersen", years: "2024 - 2026" },
    amyJackson: { name: "Amy Jackson", years: "2023 - 2024" },
    hansikaMotwani: { name: "Hansika Motwani", years: "2023 - 2024" },
    wasimAkram: { name: "Wasim Akram", years: "2024 - 2028" },
    keyaAkterPayel: { name: "Keya Akter Payel", years: "2025" },
    yeshaSagar: { name: "Yesha Sagar", years: "2025 - 2026" },
  },
  bottom: {
    officialBrandPartner: "Official Brand Partner",
    gamingLicense: "Gaming License",
    responsibleGaming: "Responsible Gaming",
    aboutHeading: "rajabaji Bangladesh - Leading Online Gaming and Betting Platform in Bangladesh",
    aboutText: footerAboutPreview,
    aboutTextMore: footerAboutExpanded,
    showMore: "Show more",
    showLess: "Show less",
    winLikeAKing: "Win Like A King",
    copyright: "© 2026 rajabaji Copyrights. All Rights Reserved",
    legalOwnership:
      "is owned and operated by Northern Lights Limited Holdings Limited. registration number: 15839, registered address: Hamchhako, Mutsamudu, Autonomous Island of Anjouan, Union of Comoros.",
    legalContactPrefix: "Contact us",
    legalLicense:
      "is licensed and regulated by the Government of the Autonomous Island of Anjouan, Union of Comoros and operates under License No. ALSI-202410030-FI1.",
    legalCompliance:
      "has passed all regulatory compliance and is legally authorized to conduct gaming operations for any and all games of chance and wagering.",
  },
};

export const footerBn: FooterMessages = {
  gaming: "গেমিং",
  aboutBaji: "rajabaji সম্পর্কে",
  features: "ফিচার",
  help: "সাহায্য",
  sponsorships: "স্পন্সরশিপ",
  brandAmbassadors: "ব্র্যান্ড অ্যাম্বাসেডর",
  links: {
    casino: "ক্যাসিনো",
    slots: "স্লটস",
    crash: "ক্র্যাশ",
    table: "টেবিল",
    fishing: "ফিশিং",
    arcade: "আর্কেড",
    lottery: "লটারি",
    aboutUs: "আমাদের সম্পর্কে",
    privacyPolicy: "প্রাইভেসি পলিসি",
    terms: "শর্তাবলী",
    responsibleGaming: "দায়িত্বশীল গেমিং",
    kyc: "KYC",
    promotions: "প্রমোশন",
    vipClub: "ভিআইপি ক্লাব",
    referral: "রেফারেল",
    brandAmbassadors: "ব্র্যান্ড অ্যাম্বাসেডর",
    appDownload: "অ্যাপ ডাউনলোড",
    bjForum: "rajabaji ফোরাম",
  },
  sponsorshipsData: {
    quettaGladiators: { name: "Quetta Gladiators", role: "Titanium Sponsor, 2023" },
    sunrisersEasternCape: { name: "Sunrisers Eastern Cape", role: "Title Sponsor, 2023 - 2024" },
    deccanGladiators: { name: "Deccan Gladiators", role: "Title Sponsor, 2023 - 2024" },
    stKittsPatriots: { name: "St Kitts & Nevis Patriots", role: "Principle Sponsor, 2024 - 2025" },
    biratnagarKings: { name: "Biratnagar Kings", role: "Back of Jersey Sponsor, 2024 - 2025" },
  },
  ambassadorsData: {
    miaKhalifa: { name: "Mia Khalifa", years: "2024" },
    kevinPietersen: { name: "Kevin Pietersen", years: "2024 - 2026" },
    amyJackson: { name: "Amy Jackson", years: "2023 - 2024" },
    hansikaMotwani: { name: "Hansika Motwani", years: "2023 - 2024" },
    wasimAkram: { name: "Wasim Akram", years: "2024 - 2028" },
    keyaAkterPayel: { name: "Keya Akter Payel", years: "2025" },
    yeshaSagar: { name: "Yesha Sagar", years: "2025 - 2026" },
  },
  bottom: {
    officialBrandPartner: "অফিসিয়াল ব্র্যান্ড পার্টনার",
    gamingLicense: "গেমিং লাইসেন্স",
    responsibleGaming: "দায়িত্বশীল গেমিং",
    aboutHeading: "rajabaji বাংলাদেশ - বাংলাদেশের শীর্ষ অনলাইন গেমিং ও বেটিং প্ল্যাটফর্ম",
    aboutText: footerAboutPreview,
    aboutTextMore: footerAboutExpanded,
    showMore: "আরও দেখুন",
    showLess: "কম দেখুন",
    winLikeAKing: "Win Like A King",
    copyright: "© 2026 rajabaji Copyrights. All Rights Reserved",
    legalOwnership:
      "Northern Lights Limited Holdings Limited-এর মালিকানাধীন ও পরিচালিত। নিবন্ধন নম্বর: 15839, নিবন্ধিত ঠিকানা: Hamchhako, Mutsamudu, Autonomous Island of Anjouan, Union of Comoros।",
    legalContactPrefix: "যোগাযোগ করুন",
    legalLicense:
      "Anjouan, Union of Comoros সরকার দ্বারা লাইসেন্সপ্রাপ্ত ও নিয়ন্ত্রিত এবং License No. ALSI-202410030-FI1-এর অধীনে পরিচালিত।",
    legalCompliance:
      "সমস্ত নিয়ন্ত্রক সম্মতি পূরণ করেছে এবং যেকোনো ভাগ্য ও বাজি গেম পরিচালনার জন্য আইনত অনুমোদিত।",
  },
};

export const footerHi: FooterMessages = {
  gaming: "गेमिंग",
  aboutBaji: "rajabaji के बारे में",
  features: "फीचर्स",
  help: "सहायता",
  sponsorships: "प्रायोजन",
  brandAmbassadors: "ब्रांड एंबेसडर",
  links: {
    casino: "कैसीनो",
    slots: "स्लॉट",
    crash: "क्रैश",
    table: "टेबल",
    fishing: "फिशिंग",
    arcade: "आर्केड",
    lottery: "लॉटरी",
    aboutUs: "हमारे बारे में",
    privacyPolicy: "गोपनीयता नीति",
    terms: "नियम और शर्तें",
    responsibleGaming: "जिम्मेदार गेमिंग",
    kyc: "KYC",
    promotions: "प्रमोशन",
    vipClub: "वीआईपी क्लब",
    referral: "रेफरल",
    brandAmbassadors: "ब्रांड एंबेसडर",
    appDownload: "ऐप डाउनलोड",
    bjForum: "rajabaji फोरम",
  },
  sponsorshipsData: {
    quettaGladiators: { name: "Quetta Gladiators", role: "Titanium Sponsor, 2023" },
    sunrisersEasternCape: { name: "Sunrisers Eastern Cape", role: "Title Sponsor, 2023 - 2024" },
    deccanGladiators: { name: "Deccan Gladiators", role: "Title Sponsor, 2023 - 2024" },
    stKittsPatriots: { name: "St Kitts & Nevis Patriots", role: "Principle Sponsor, 2024 - 2025" },
    biratnagarKings: { name: "Biratnagar Kings", role: "Back of Jersey Sponsor, 2024 - 2025" },
  },
  ambassadorsData: {
    miaKhalifa: { name: "Mia Khalifa", years: "2024" },
    kevinPietersen: { name: "Kevin Pietersen", years: "2024 - 2026" },
    amyJackson: { name: "Amy Jackson", years: "2023 - 2024" },
    hansikaMotwani: { name: "Hansika Motwani", years: "2023 - 2024" },
    wasimAkram: { name: "Wasim Akram", years: "2024 - 2028" },
    keyaAkterPayel: { name: "Keya Akter Payel", years: "2025" },
    yeshaSagar: { name: "Yesha Sagar", years: "2025 - 2026" },
  },
  bottom: {
    officialBrandPartner: "आधिकारिक ब्रांड पार्टनर",
    gamingLicense: "गेमिंग लाइसेंस",
    responsibleGaming: "जिम्मेदार गेमिंग",
    aboutHeading: "rajabaji Bangladesh - बांग्लादेश में अग्रणी ऑनलाइन गेमिंग और बेटिंग प्लेटफॉर्म",
    aboutText: footerAboutPreview,
    aboutTextMore: footerAboutExpanded,
    showMore: "और देखें",
    showLess: "कम देखें",
    winLikeAKing: "Win Like A King",
    copyright: "© 2026 rajabaji Copyrights. All Rights Reserved",
    legalOwnership:
      "Northern Lights Limited Holdings Limited के स्वामित्व और संचालन में है। पंजीकरण संख्या: 15839, पंजीकृत पता: Hamchhako, Mutsamudu, Autonomous Island of Anjouan, Union of Comoros।",
    legalContactPrefix: "संपर्क करें",
    legalLicense:
      "Anjouan, Union of Comoros सरकार द्वारा लाइसेंस प्राप्त और विनियमित है तथा License No. ALSI-202410030-FI1 के तहत संचालित है।",
    legalCompliance:
      "ने सभी नियामक अनुपालन पूरा किया है और किसी भी प्रकार के भाग्य और दांव खेल संचालित करने के लिए कानूनी रूप से अधिकृत है।",
  },
};
