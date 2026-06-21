import type { Locale } from "@/lib/locale";
import type { PromotionFilterId } from "@/lib/promotions-data";

export type PromotionMessages = {
  pageTitle: string;
  pageSubtitle: string;
  back: string;
  featuredLabel: string;
  promotionsCount: string;
  readMore: string;
  viewDetails: string;
  claimNow: string;
  noResults: string;
  validity: string;
  validUntil: string;
  minDeposit: string;
  turnover: string;
  loading: string;
  loadError: string;
  depositCta: string;
  filters: Record<PromotionFilterId, string>;
  badges: Record<string, string>;
  subtitles: Record<string, string>;
  highlights: Record<string, string>;
  titles: Record<string, string>;
};

const en: PromotionMessages = {
  pageTitle: "Promotions",
  pageSubtitle: "Deposit bonuses and reload offers — the same promotions you can select when making a deposit.",
  back: "Back",
  featuredLabel: "Featured offer",
  promotionsCount: "offers available",
  readMore: "Read more",
  viewDetails: "View details",
  claimNow: "Claim now",
  noResults: "No promotions in this category yet. Check back soon or browse all offers.",
  validity: "Validity period",
  validUntil: "Valid until",
  minDeposit: "Min. deposit",
  turnover: "Turnover",
  loading: "Loading promotions…",
  loadError: "Could not load promotions. Please try again.",
  depositCta: "Deposit with this offer",
  filters: {
    all: "ALL",
    welcome: "Welcome Offer",
    slots: "Slots",
    liveCasino: "Live Casino",
    sports: "Sports",
    fishing: "Fishing",
    lottery: "Lottery",
    table: "Table",
    arcade: "Arcade",
    crash: "Crash",
    other: "Other",
  },
  badges: {
    welcomeOffer: "WELCOME OFFER",
    cricketQuest: "CRICKET QUEST MISSION",
    dailyBonus: "DAILY BONUS",
    reloadBonus: "RELOAD BONUS",
  },
  subtitles: {
    spinAndWin: "SPIN & WIN!",
  },
  highlights: {
    freeSpins100: "100 FREE SPINS",
    crore66: "UP TO ৳6.6 CRORE",
    bonus100: "100% BONUS",
  },
  titles: {
    superTigerSpins: "Unlock Up To 100 Free Spins",
    cricketQuest: "Up to ৳6.6 Crore",
    playFree1000: "Play & Get Free ৳1,000 Bonus",
    liveCasinoCashback: "Live Casino Weekly Cashback",
    fishingBonus: "Fishing Reel Bonus Boost",
    lotteryJackpot: "Daily Lottery Jackpot Draw",
    tableHighroller: "Table Games High Roller Pack",
    arcadeRewards: "Arcade Play Rewards",
    crashAviator: "Crash & Aviator Multiplier Boost",
    slotsDeposit: "First Deposit Slots Bonus",
  },
};

const bn: PromotionMessages = {
  pageTitle: "প্রমোশন",
  pageSubtitle: "ডিপোজিট বোনাস ও রিলোড অফার — ডিপোজিটের সময় যে প্রমোশনগুলো পাবেন।",
  back: "পিছনে",
  featuredLabel: "ফিচার্ড অফার",
  promotionsCount: "টি অফার উপলব্ধ",
  readMore: "আরও পড়ুন",
  viewDetails: "বিস্তারিত দেখুন",
  claimNow: "এখনই ক্লেইম করুন",
  noResults: "এই বিভাগে এখনও কোনো প্রমোশন নেই। পরে আবার দেখুন বা সব অফার ব্রাউজ করুন।",
  validity: "মেয়াদ",
  validUntil: "বৈধতার শেষ",
  minDeposit: "ন্যূনতম ডিপোজিট",
  turnover: "টার্নওভার",
  loading: "প্রমোশন লোড হচ্ছে…",
  loadError: "প্রমোশন লোড করা যায়নি। আবার চেষ্টা করুন।",
  depositCta: "এই অফারে ডিপোজিট করুন",
  filters: {
    all: "সব",
    welcome: "ওয়েলকাম অফার",
    slots: "স্লট",
    liveCasino: "লাইভ ক্যাসিনো",
    sports: "স্পোর্টস",
    fishing: "ফিশিং",
    lottery: "লটারি",
    table: "টেবিল",
    arcade: "আর্কেড",
    crash: "ক্র্যাশ",
    other: "অন্যান্য",
  },
  badges: {
    welcomeOffer: "ওয়েলকাম অফার",
    cricketQuest: "ক্রিকেট কোয়েস্ট মিশন",
    dailyBonus: "দৈনিক বোনাস",
    reloadBonus: "রিলোড বোনাস",
  },
  subtitles: {
    spinAndWin: "স্পিন ও জিতুন!",
  },
  highlights: {
    freeSpins100: "১০০ ফ্রি স্পিন",
    crore66: "৳৬.৬ কোটি পর্যন্ত",
    bonus100: "১০০% বোনাস",
  },
  titles: {
    superTigerSpins: "১০০ ফ্রি স্পিন পর্যন্ত আনলক করুন",
    cricketQuest: "৳৬.৬ কোটি পর্যন্ত",
    playFree1000: "খেলুন ও ৳১,০০০ বোনাস পান",
    liveCasinoCashback: "লাইভ ক্যাসিনো সাপ্তাহিক ক্যাশব্যাক",
    fishingBonus: "ফিশিং রিল বোনাস বুস্ট",
    lotteryJackpot: "দৈনিক লটারি জ্যাকপট",
    tableHighroller: "টেবিল গেম হাই রোলার প্যাক",
    arcadeRewards: "আর্কেড প্লে রিওয়ার্ড",
    crashAviator: "ক্র্যাশ ও এভিয়েটর মাল্টিপ্লায়ার",
    slotsDeposit: "প্রথম ডিপোজিট স্লট বোনাস",
  },
};

const hi: PromotionMessages = {
  pageTitle: "प्रमोशन",
  pageSubtitle: "जमा बोनस और रीलोड ऑफर — वही प्रमोशन जो जमा करते समय चुन सकते हैं।",
  back: "वापस",
  featuredLabel: "फीचर्ड ऑफर",
  promotionsCount: "ऑफर उपलब्ध",
  readMore: "और पढ़ें",
  viewDetails: "विवरण देखें",
  claimNow: "अभी क्लेम करें",
  noResults: "इस श्रेणी में अभी कोई प्रमोशन नहीं है। बाद में देखें या सभी ऑफर ब्राउज़ करें।",
  validity: "वैधता अवधि",
  validUntil: "वैधता समाप्त",
  minDeposit: "न्यूनतम जमा",
  turnover: "टर्नओवर",
  loading: "प्रमोशन लोड हो रहे हैं…",
  loadError: "प्रमोशन लोड नहीं हो सके। कृपया पुनः प्रयास करें।",
  depositCta: "इस ऑफर के साथ जमा करें",
  filters: {
    all: "सभी",
    welcome: "वेलकम ऑफर",
    slots: "स्लॉट",
    liveCasino: "लाइव कैसीनो",
    sports: "स्पोर्ट्स",
    fishing: "फिशिंग",
    lottery: "लॉटरी",
    table: "टेबल",
    arcade: "आर्केड",
    crash: "क्रैश",
    other: "अन्य",
  },
  badges: {
    welcomeOffer: "वेलकम ऑफर",
    cricketQuest: "क्रिकेट क्वेस्ट मिशन",
    dailyBonus: "दैनिक बोनस",
    reloadBonus: "रीलोड बोनस",
  },
  subtitles: {
    spinAndWin: "स्पिन और जीतें!",
  },
  highlights: {
    freeSpins100: "100 फ्री स्पिन",
    crore66: "₹6.6 करोड़ तक",
    bonus100: "100% बोनस",
  },
  titles: {
    superTigerSpins: "100 फ्री स्पिन तक अनलॉक करें",
    cricketQuest: "₹6.6 करोड़ तक",
    playFree1000: "खेलें और ₹1,000 बोनस पाएं",
    liveCasinoCashback: "लाइव कैसीनो साप्ताहिक कैशबैक",
    fishingBonus: "फिशिंग रील बोनस बूस्ट",
    lotteryJackpot: "दैनिक लॉटरी जैकपॉट",
    tableHighroller: "टेबल गेम हाई रोलर पैक",
    arcadeRewards: "आर्केड प्ले रिवॉर्ड्स",
    crashAviator: "क्रैश और एविएटर बूस्ट",
    slotsDeposit: "पहली जमा स्लॉट बोनस",
  },
};

const catalogs: Record<Locale, PromotionMessages> = { en, bn, hi };

export function getPromotionMessages(locale: Locale): PromotionMessages {
  return catalogs[locale] ?? catalogs.bn;
}
