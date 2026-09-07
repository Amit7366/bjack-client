import type { Locale } from "@/lib/locale";
import { getHomeSeoCopy } from "@/lib/seo/home-metadata";
import {
  SITE_CONTACT_EMAIL,
  SITE_ICONS,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  localePath,
  banglajackpot_ANDROID_APP_PATH,
} from "@/lib/seo/site-config";

export default function HomeJsonLd({ locale }: { locale: Locale }) {
  const seo = getHomeSeoCopy(locale);
  const pageUrl = absoluteUrl(localePath(locale));

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: seo.description,
        inLanguage: ["en", "bn", "hi"],
        publisher: { "@id": `${SITE_URL}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/${locale}?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: SITE_ICONS.pwa192,
          width: 192,
          height: 192,
        },
        image: SITE_ICONS.ogImage,
        ...(SITE_CONTACT_EMAIL ? { email: SITE_CONTACT_EMAIL } : {}),
        areaServed: {
          "@type": "Country",
          name: "Bangladesh",
        },
        knowsAbout: [
          "Online casino",
          "Sports betting",
          "Slots",
          "Live dealer games",
          "Mobile gaming",
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: seo.title,
        description: seo.description,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#organization` },
        inLanguage: locale,
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: SITE_ICONS.ogImage,
        },
      },
      {
        "@type": "SoftwareApplication",
        name: `${SITE_NAME} App`,
        applicationCategory: "GameApplication",
        operatingSystem: "Android, iOS, Web",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "BDT",
        },
        url: absoluteUrl(banglajackpot_ANDROID_APP_PATH),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
