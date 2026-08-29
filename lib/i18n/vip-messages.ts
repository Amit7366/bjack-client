import type { Locale } from "@/lib/locale";

export type VipBenefitId =
  | "personalManager"
  | "exclusiveRewards"
  | "pointsToCash"
  | "paymentChannel";

export type VipMessages = {
  pageTitle: string;
  back: string;
  heroTitle: string;
  heroSubtitle: string;
  joinNow: string;
  benefits: Record<VipBenefitId, { title: string; description: string }>;
};

const en: VipMessages = {
  pageTitle: "VIP Details",
  back: "Back",
  heroTitle: "rajabaji VIP Club",
  heroSubtitle: "The most exclusive VIP program yet",
  joinNow: "Join Now!",
  benefits: {
    personalManager: {
      title: "24/7 Personal VIP Manager",
      description:
        "Our personal VIP manager's number one goal is to enhance your experience by providing fast and unparalleled personalized service. You will be able to contact your 24/7 personal VIP manager via VIP live chat, Telegram, or email.",
    },
    exclusiveRewards: {
      title: "VIP Exclusive Rewards",
      description:
        "Who doesn't love getting something extra? Stay on your way to increasing the fun in the casino with exclusive rewards! Getting the chance to benefit from exclusive offers is one of the biggest advantages of joining our rajabaji VIP Club. We provide plenty of bonuses, cash prizes, level-up rewards, and surprise gifts throughout the year.",
    },
    pointsToCash: {
      title: "'VIP Points to Cash' Redemption",
      description:
        "You can exchange your VIP points for cash without any limitations. When you play or bet on rajabaji, you will earn VIP points—an exchangeable currency that can be used to earn extra cash across all rajabaji products!",
    },
    paymentChannel: {
      title: "VIP Payment Channel",
      description:
        "When you win, you want to withdraw money quickly. As a VIP, you will enjoy priority withdrawals and deposits. This means you can withdraw and deposit as much money as you want according to the priority lane!",
    },
  },
};

const bn: VipMessages = {
  pageTitle: "ভিআইপি বিবরণ",
  back: "পিছনে",
  heroTitle: "rajabaji ভিআইপি ক্লাব",
  heroSubtitle: "এখনও পর্যন্ত সবচেয়ে এক্সক্লুসিভ ভিআইপি প্রোগ্রাম",
  joinNow: "এখনই যোগ দিন!",
  benefits: {
    personalManager: {
      title: "24/7 পার্সোনাল ভিআইপি ম্যানেজার",
      description:
        "আমাদের পার্সোনাল ভিআইপি ম্যানেজারের এক নম্বর লক্ষ্য হল দ্রুত এবং অতুলনীয় ব্যক্তিগত সার্ভিস প্রদানের মাধ্যমে আপনার অভিজ্ঞতাকে উন্নত করে তোলা। আপনি ভিআইপি লাইভচ্যাট, টেলিগ্রাম, বা ইমেলের মাধ্যমে আপনার 24/7 পার্সোনাল ভিআইপি ম্যানেজারের সাথে যোগাযোগ করতে সক্ষম হবেন।",
    },
    exclusiveRewards: {
      title: "ভিআইপি এক্সক্লুসিভ রিওয়ার্ড",
      description:
        "এক্সট্রা কিছু পেতে কে না পছন্দ করে? এক্সক্লুসিভ রিওয়ার্ড সহ ক্যাসিনোতে আনন্দ বৃদ্ধি করতে আপনার পথেই থাকুন! এক্সক্লুসিভ অফার থেকে উপকৃত হওয়ার সুযোগ পাওয়া মানে হল আমাদের rajabaji ভিআইপি ক্লাবে যোগদানের সবচেয়ে বড় সুবিধাগুলির মধ্যে একটি। আমরা সারা বছর ধরে প্রচুর পরিমাণে বোনাস, ক্যাশ প্রাইজ, লেভেল আপ রিওয়ার্ড এবং চমক গিফট দিয়ে থাকি।",
    },
    pointsToCash: {
      title: "'ভিআইপি পয়েন্টস টু ক্যাশ' রিডেম্পশন",
      description:
        "আপনি কোন সীমাবদ্ধতা ছাড়াই ক্যাশের সাথে আপনার ভিআইপি পয়েন্ট এক্সচেঞ্জ করতে পারবেন। আপনি যখন rajabaji-তে খেলবেন বা বেট ধরবেন, তখন আপনি ভিআইপি পয়েন্ট অর্জন করবেন, এটি একটি বিনিময়যোগ্য কারেন্সি যা rajabaji-র সকল প্রোডাক্ট জুড়ে অতিরিক্ত ক্যাশ উপার্জন করতে ব্যবহার করা যাবে!",
    },
    paymentChannel: {
      title: "ভিআইপি পেমেন্ট চ্যানেল",
      description:
        "আপনি যখন জিতবেন, আপনি দ্রুত টাকা উইথড্র করতে চান। একজন ভিআইপি হিসাবে, আপনি অগ্রাধিকারমূলক উইথড্র এবং ডিপোজিট উপভোগ করবেন। এর মানে আপনি প্রায়োরিটি লেন অনুযায়ী যত খুশি টাকা উইথড্র এবং ডিপোজিট করতে পারবেন!",
    },
  },
};

const hi: VipMessages = {
  pageTitle: "VIP विवरण",
  back: "वापस",
  heroTitle: "rajabaji VIP क्लब",
  heroSubtitle: "अब तक का सबसे विशेष VIP प्रोग्राम",
  joinNow: "अभी जुड़ें!",
  benefits: {
    personalManager: {
      title: "24/7 पर्सनल VIP मैनेजर",
      description:
        "हमारे पर्सनल VIP मैनेजर का मुख्य लक्ष्य तेज़ और बेजोड़ व्यक्तिगत सेवा के ज़रिए आपके अनुभव को बेहतर बनाना है। आप VIP लाइव चैट, Telegram या ईमेल के माध्यम से अपने 24/7 पर्सनल VIP मैनेजर से संपर्क कर सकते हैं।",
    },
    exclusiveRewards: {
      title: "VIP एक्सक्लूसिव रिवॉर्ड्स",
      description:
        "कौन अतिरिक्त लाभ पाना पसंद नहीं करता? एक्सक्लूसिव रिवॉर्ड्स के साथ कैसीनो में मज़ा बढ़ाएँ! विशेष ऑफ़र का लाभ पाने का मौका rajabaji VIP क्लब में शामिल होने के सबसे बड़े फायदों में से एक है। हम पूरे साल बोनस, कैश प्राइज़, लेवल-अप रिवॉर्ड्स और सरप्राइज़ गिफ्ट देते हैं।",
    },
    pointsToCash: {
      title: "'VIP पॉइंट्स टू कैश' रिडेम्प्शन",
      description:
        "आप बिना किसी सीमा के अपने VIP पॉइंट्स को कैश में बदल सकते हैं। rajabaji पर खेलते या बेट लगाते समय आप VIP पॉइंट्स कमाएँगे—यह एक विनिमेय मुद्रा है जिसे सभी rajabaji प्रोडक्ट्स में अतिरिक्त कैश कमाने के लिए इस्तेमाल किया जा सकता है!",
    },
    paymentChannel: {
      title: "VIP पेमेंट चैनल",
      description:
        "जीतने पर आप जल्दी पैसा निकालना चाहते हैं। VIP के रूप में आपको प्राथमिकता वाले विड्रॉ और डिपॉज़िट मिलेंगे। इसका मतलब है कि आप प्राथमिकता लेन के अनुसार जितना चाहें उतना निकाल और जमा कर सकते हैं!",
    },
  },
};

const catalogs: Record<Locale, VipMessages> = { en, bn, hi };

export function getVipMessages(locale: Locale): VipMessages {
  return catalogs[locale] ?? catalogs.bn;
}

export const VIP_BENEFIT_IDS: VipBenefitId[] = [
  "personalManager",
  "exclusiveRewards",
  "pointsToCash",
  "paymentChannel",
];
