import type { MetadataRoute } from "next";
import { LOCALES } from "@/lib/locale";
import { SITE_URL, localePath } from "@/lib/seo/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const homeEntries = LOCALES.map((locale) => ({
    url: `${SITE_URL}${localePath(locale)}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 1,
    alternates: {
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, `${SITE_URL}${localePath(l)}`]),
      ),
    },
  }));

  const publicPages = ["vip", "referral", "promotion"] as const;
  const pageEntries = LOCALES.flatMap((locale) =>
    publicPages.map((page) => ({
      url: `${SITE_URL}${localePath(locale, page)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  );

  return [...homeEntries, ...pageEntries];
}
