/** Canonical public site URL (no trailing slash). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://bkbaji.com").replace(
  /\/$/,
  "",
);

export const SITE_NAME = "BKBaji";
export const SITE_SHORT_NAME = "BKBaji";

export const SITE_LEGAL_NAME = "Northern Lights Limited Holdings Limited";
export const SITE_CONTACT_EMAIL = "legal@northernlightsltd.com";
export const SITE_LICENSE = "ALSI-202410030-FI1";

export const SITE_DEFAULT_LOCALE = "bn" as const;

/** Official Android APK served from `public/download/`. */
export const BKBAJI_ANDROID_APP_PATH = "/download/bkbaji/bkbaji.apk";

/** Brand & PWA icons — replace with self-hosted assets on bkbaji.com when available. */
export const SITE_ICONS = {
  favicon: "https://img.b112j.com/images/bj/bj-favicon.ico",
  appleTouchIcon:
    "https://img.b112j.com/bj/h5/assets/images/icons/PWAicon-192px.png?v=1778659269258",
  pwa192:
    "https://img.b112j.com/bj/h5/assets/images/icons/PWAicon-192px.png?v=1778659269258",
  ogImage: "https://img.b112j.com/upload/announcement/image_304033.jpg",
} as const;

export const SITE_SOCIAL = {
  twitter: "@bkbaji",
} as const;

export function absoluteUrl(path = ""): string {
  if (!path) return SITE_URL;
  return path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function localePath(locale: string, path = ""): string {
  const suffix = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  return `/${locale}${suffix}`;
}
