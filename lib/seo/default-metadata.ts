import type { Metadata } from "next";
import {
  SITE_CONTACT_EMAIL,
  SITE_ICONS,
  SITE_NAME,
  SITE_SHORT_NAME,
  SITE_URL,
} from "./site-config";

export const defaultSiteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Online Casino, Slots & Sports Betting`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "city777 is Bangladesh's trusted online gaming platform for casino, slots, crash, fishing, arcade, lottery and sports betting with fast BDT payments, VIP rewards and 24/7 support.",
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "games",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [{ url: SITE_ICONS.favicon, type: "image/png" }],
    shortcut: SITE_ICONS.favicon,
    apple: [{ url: SITE_ICONS.appleTouchIcon, sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: SITE_SHORT_NAME,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "bn_BD",
    alternateLocale: ["en_BD", "hi_BD"],
    images: [
      {
        url: SITE_ICONS.ogImage,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Online Casino & Sports Betting`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@city777",
    creator: "@city777",
  },
  other: {
    contact: SITE_CONTACT_EMAIL,
    "apple-mobile-web-app-capable": "yes",
    "mobile-web-app-capable": "yes",
  },
};
