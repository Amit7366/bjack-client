/** Canonical public site URL (no trailing slash). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://city777.shop").replace(
  /\/$/,
  "",
);

export const SITE_NAME = "city777";
export const SITE_SHORT_NAME = "city777";

export const SITE_LEGAL_NAME = "Northern Lights Limited Holdings Limited";
export const SITE_CONTACT_EMAIL = "legal@northernlightsltd.com";
export const SITE_SUPPORT_EMAIL = "fnjunocron@gmail.com";
export const SITE_TELEGRAM_USERNAME = "Ragnar778";
export const SITE_TELEGRAM_URL = `https://t.me/${SITE_TELEGRAM_USERNAME}`;
export const SITE_LICENSE = "ALSI-202410030-FI1";

export const SITE_DEFAULT_LOCALE = "bn" as const;

/** Official Android APK served from `public/download/`. */
export const city777_ANDROID_APK_FILENAME = "city777.apk";
export const city777_ANDROID_APP_PATH = `/download/city777/${city777_ANDROID_APK_FILENAME}`;

/** Brand & PWA icons — self-hosted from `public/icons/`. */
export const SITE_ICONS = {
  favicon: "/favicon.png",
  appleTouchIcon: "/icons/apple-touch-icon.png",
  pwa192: "/icons/pwa-192.png",
  pwa512: "/icons/pwa-512.png",
  ogImage: "https://img.b112j.com/upload/announcement/image_304033.jpg",
} as const;

export const SITE_SOCIAL = {
  twitter: "@city777",
} as const;

export function absoluteUrl(path = ""): string {
  if (!path) return SITE_URL;
  return path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function localePath(locale: string, path = ""): string {
  const suffix = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  return `/${locale}${suffix}`;
}
