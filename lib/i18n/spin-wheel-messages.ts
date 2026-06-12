import type { Locale } from "@/lib/locale";

export type SpinWheelMessages = {
  back: string;
  rules: string;
  headline: string;
  headlineSuffix: string;
  winnerTicker: string;
  skipAnimation: string;
  bonusLegend: string;
  freeSpinLegend: string;
  timerLabel: string;
  chooseWheel: string;
  tierFree: string;
  yourPoints: string;
  depositNote: string;
  readMore: string;
  spinToWin: string;
  spinning: string;
  close: string;
  rulesTitle: string;
  rulesBody: string;
  winTitle: string;
  winMessage: string;
  turnoverNote: string;
  alreadySpun: string;
  loadError: string;
};

const bn: SpinWheelMessages = {
  back: "পেছনে",
  rules: "নিয়মাবলী",
  headline: "ফ্রিতে",
  headlineSuffix: "৭৭,৭৭৭ পর্যন্ত জিতে নিন!",
  winnerTicker: "অভিনন্দন {name}! আপনি জিতেছেন ৳{amount} বোনাস!",
  skipAnimation: "অ্যানিমেশন স্কিপ করুন",
  bonusLegend: "বোনাস",
  freeSpinLegend: "ফ্রি স্পিন",
  timerLabel: "পুনরায় শুরু হবে:",
  chooseWheel: "স্পিন করতে একটি লাকি হুইল বেছে নিন!",
  tierFree: "ফ্রি",
  yourPoints: "আপনার পয়েন্ট:",
  depositNote: "শুধুমাত্র নরমাল ডিপোজিটগুলোই গণনা করা হবে",
  readMore: "আরও পড়ুন",
  spinToWin: "জেতার জন্য স্পিন করুন!",
  spinning: "স্পিন হচ্ছে...",
  close: "বন্ধ করুন",
  rulesTitle: "লাকি হুইল নিয়মাবলী",
  rulesBody:
    "• প্রতিদিন একবার ফ্রি স্পিন করতে পারবেন।\n• জেতা অর্থ আপনার মেইন ব্যালেন্সে যোগ হবে।\n• ১× টার্নওভার সম্পন্ন করতে হবে উত্তোলনের আগে।\n• প্রতিদিন মধ্যরাতে (বাংলাদেশ সময়) রিসেট হবে।",
  winTitle: "অভিনন্দন!",
  winMessage: "আপনি ৳{amount} জিতেছেন!",
  turnoverNote: "১× টার্নওভার প্রয়োজন",
  alreadySpun: "আজকের স্পিন সম্পন্ন হয়েছে",
  loadError: "স্পিন লোড করতে ব্যর্থ",
};

const en: SpinWheelMessages = {
  back: "Back",
  rules: "Rules",
  headline: "Win up to",
  headlineSuffix: "77,777 for free!",
  winnerTicker: "Congrats {name}! You won ৳{amount} bonus!",
  skipAnimation: "Skip animation",
  bonusLegend: "Bonus",
  freeSpinLegend: "Free Spin",
  timerLabel: "Resets in:",
  chooseWheel: "Choose a lucky wheel to spin!",
  tierFree: "Free",
  yourPoints: "Your points:",
  depositNote: "Only normal deposits are counted",
  readMore: "Read more",
  spinToWin: "Spin to win!",
  spinning: "Spinning...",
  close: "Close",
  rulesTitle: "Lucky Wheel Rules",
  rulesBody:
    "• One free spin per day.\n• Winnings are added to your main balance.\n• 1× turnover required before withdrawal.\n• Resets daily at midnight (Bangladesh time).",
  winTitle: "Congratulations!",
  winMessage: "You won ৳{amount}!",
  turnoverNote: "1× turnover required",
  alreadySpun: "Today's spin is complete",
  loadError: "Failed to load spin wheel",
};

const hi: SpinWheelMessages = {
  back: "वापस",
  rules: "नियम",
  headline: "मुफ्त में",
  headlineSuffix: "77,777 तक जीतें!",
  winnerTicker: "बधाई {name}! आपने ৳{amount} बोनस जीता!",
  skipAnimation: "एनिमेशन छोड़ें",
  bonusLegend: "बोनस",
  freeSpinLegend: "फ्री स्पिन",
  timerLabel: "रीसेट:",
  chooseWheel: "स्पिन के लिए एक लकी व्हील चुनें!",
  tierFree: "मुफ्त",
  yourPoints: "आपके अंक:",
  depositNote: "केवल सामान्य जमा गिने जाते हैं",
  readMore: "और पढ़ें",
  spinToWin: "जीतने के लिए स्पिन करें!",
  spinning: "स्पिन हो रहा है...",
  close: "बंद करें",
  rulesTitle: "लकी व्हील नियम",
  rulesBody:
    "• प्रतिदिन एक मुफ्त स्पिन।\n• जीत आपके मुख्य बैलेंस में जोड़ी जाती है।\n• निकासी से पहले 1× टर्नओवर आवश्यक।\n• प्रतिदिन मध्यरात्रि (बांग्लादेश समय) पर रीसेट।",
  winTitle: "बधाई हो!",
  winMessage: "आपने ৳{amount} जीता!",
  turnoverNote: "1× टर्नओवर आवश्यक",
  alreadySpun: "आज का स्पिन पूरा हो गया",
  loadError: "स्पिन व्हील लोड करने में विफल",
};

export function getSpinWheelMessages(locale: Locale): SpinWheelMessages {
  if (locale === "bn") return bn;
  if (locale === "hi") return hi;
  return en;
}

export function formatSpinAmount(value: number, locale: Locale): string {
  try {
    return new Intl.NumberFormat(locale === "bn" ? "bn-BD" : locale === "hi" ? "hi-IN" : "en-US", {
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return String(value);
  }
}
