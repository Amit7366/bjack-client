import type { Metadata } from "next";
import type { Locale } from "@/lib/locale";
import {
  SITE_CONTACT_EMAIL,
  SITE_DEFAULT_LOCALE,
  SITE_ICONS,
  SITE_NAME,
  SITE_SOCIAL,
  SITE_URL,
  absoluteUrl,
  localePath,
} from "./site-config";

type HomeSeoCopy = {
  title: string;
  description: string;
  keywords: string[];
  ogLocale: string;
};

const HOME_SEO: Record<Locale, HomeSeoCopy> = {
  en: {
    title: "city777 — Online Casino, Slots, Crash & Sports Betting in Bangladesh",
    description:
      "Play casino, live dealer, slots, crash, fishing, arcade & sports betting at city777. Fast BDT deposits & withdrawals, JILI, PG Soft & Evolution games, VIP rewards, referral bonuses & 24/7 support on Bangladesh's trusted gaming platform.",
    keywords: [
      "city777",
      "city777.shop",
      "online casino Bangladesh",
      "sports betting Bangladesh",
      "online slots Bangladesh",
      "live casino Bangladesh",
      "crash games",
      "aviator game",
      "JILI slots",
      "PG Soft",
      "Evolution gaming",
      "BDT betting",
      "fast deposit withdrawal",
      "VIP club",
      "referral bonus",
      "mobile casino app",
      "fishing games",
      "lottery online",
      "trusted betting site",
      "Bangladesh casino",
    ],
    ogLocale: "en_BD",
  },
  bn: {
    title: "city777 — বাংলাদেশের শীর্ষ অনলাইন ক্যাসিনো, স্লট ও স্পোর্টস বেটিং",
    description:
      "city777-তে ক্যাসিনো, লাইভ ডিলার, স্লট, ক্র্যাশ, ফিশিং, আর্কেড ও স্পোর্টস বেটিং খেলুন। দ্রুত BDT ডিপোজিট ও উইথড্র, JILI, PG Soft ও Evolution গেম, ভিআইপি রিওয়ার্ড, রেফারেল বোনাস ও ২৪/৭ সাপোর্ট — বাংলাদেশের বিশ্বস্ত গেমিং প্ল্যাটফর্ম।",
    keywords: [
      "city777",
      "city777.shop",
      "অনলাইন ক্যাসিনো বাংলাদেশ",
      "স্পোর্টস বেটিং",
      "অনলাইন স্লট",
      "লাইভ ক্যাসিনো",
      "ক্র্যাশ গেম",
      "এভিয়েটর গেম",
      "JILI স্লট",
      "PG Soft",
      "Evolution",
      "BDT বেটিং",
      "দ্রুত ডিপোজিট উইথড্র",
      "ভিআইপি ক্লাব",
      "রেফারেল বোনাস",
      "মোবাইল ক্যাসিনো",
      "ফিশিং গেম",
      "লটারি",
      "বাংলাদেশ বেটিং সাইট",
      "বিশ্বস্ত ক্যাসিনো",
    ],
    ogLocale: "bn_BD",
  },
  hi: {
    title: "city777 — बांग्लादेश में ऑनलाइन कैसीनो, स्लॉट और स्पोर्ट्स बेटिंग",
    description:
      "city777 पर कैसीनो, लाइव डीलर, स्लॉट, क्रैश, फिशिंग, आर्केड और स्पोर्ट्स बेटिंग खेलें। तेज़ BDT जमा और निकासी, JILI, PG Soft और Evolution गेम, VIP रिवॉर्ड्स, रेफरल बोनस और 24/7 सपोर्ट — भरोसेमंद गेमिंग प्लेटफॉर्म।",
    keywords: [
      "city777",
      "city777.shop",
      "ऑनलाइन कैसीनो बांग्लादेश",
      "स्पोर्ट्स बेटिंग",
      "ऑनलाइन स्लॉट",
      "लाइव कैसीनो",
      "क्रैश गेम",
      "aviator game",
      "JILI slots",
      "PG Soft",
      "Evolution gaming",
      "BDT betting",
      "VIP club",
      "referral bonus",
      "मोबाइल कैसीनो",
      "फिशिंग गेम",
      "लॉटरी",
      "बांग्लादेश बेटिंग",
      "trusted casino",
    ],
    ogLocale: "hi_BD",
  },
};

export function getHomeSeoCopy(locale: Locale): HomeSeoCopy {
  return HOME_SEO[locale] ?? HOME_SEO[SITE_DEFAULT_LOCALE];
}

export function buildHomeMetadata(locale: Locale): Metadata {
  const seo = getHomeSeoCopy(locale);
  const pageUrl = absoluteUrl(localePath(locale));
  const ogImage = {
    url: SITE_ICONS.ogImage,
    width: 1200,
    height: 630,
    alt: `${SITE_NAME} — Online Casino & Sports Betting`,
    type: "image/jpeg" as const,
  };

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    applicationName: SITE_NAME,
    category: "games",
    referrer: "origin-when-cross-origin",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: pageUrl,
      languages: {
        en: absoluteUrl(localePath("en")),
        bn: absoluteUrl(localePath("bn")),
        hi: absoluteUrl(localePath("hi")),
        "x-default": absoluteUrl(localePath(SITE_DEFAULT_LOCALE)),
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: seo.ogLocale,
      alternateLocale: ["en_BD", "bn_BD", "hi_BD"].filter((l) => l !== seo.ogLocale),
      url: pageUrl,
      siteName: SITE_NAME,
      title: seo.title,
      description: seo.description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      site: SITE_SOCIAL.twitter,
      creator: SITE_SOCIAL.twitter,
      title: seo.title,
      description: seo.description,
      images: [SITE_ICONS.ogImage],
    },
    other: {
      "content-language": locale,
      "geo.region": "BD",
      "geo.placename": "Bangladesh",
      ...(SITE_CONTACT_EMAIL ? { contact: SITE_CONTACT_EMAIL } : {}),
    },
  };
}
