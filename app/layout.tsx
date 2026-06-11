import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans_Bengali, Noto_Sans_Devanagari } from "next/font/google";
import { headers } from "next/headers";
import { isValidLocale, type Locale } from "@/lib/locale";
import DisablePinchZoom from "@/components/DisablePinchZoom";
import { localeFontClass } from "@/lib/locale-font";
import { defaultSiteMetadata } from "@/lib/seo/default-metadata";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-bengali",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  variable: "--font-hindi",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = defaultSiteMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#111111" },
    { media: "(prefers-color-scheme: dark)", color: "#111111" },
  ],
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const localeHeader = headerList.get("x-locale");
  const locale: Locale =
    localeHeader && isValidLocale(localeHeader) ? localeHeader : "bn";

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansBengali.variable} ${notoSansDevanagari.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className={`flex h-dvh flex-col overflow-hidden bg-[#0a0a0a] ${localeFontClass(locale)}`}
      >
        <DisablePinchZoom />
        {children}
      </body>
    </html>
  );
}
