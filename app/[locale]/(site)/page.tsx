import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import EventSection from "@/components/EventSection";
import ExclusiveGamesSection from "@/components/ExclusiveGamesSection";
import HeroSlider from "@/components/HeroSlider";
import HomeGameTabs from "@/components/HomeGameTabs";
import HomeAppDownloadGate from "@/components/app-download/HomeAppDownloadGate";
import HomePromoGate from "@/components/home-promo/HomePromoGate";
import HomeSpinWheelGate from "@/components/spin-wheel/HomeSpinWheelGate";
import ProviderSection from "@/components/ProviderSection";
import HomeJsonLd from "@/components/seo/HomeJsonLd";
import { fetchExclusiveSlides, fetchPopularGames } from "@/lib/games-api";
import { popularGames as fallbackPopularGames } from "@/lib/home-games-data";
import { exclusiveCarouselSlides as fallbackExclusiveSlides } from "@/lib/home-carousel-data";
import { isValidLocale, type Locale } from "@/lib/locale";
import { buildHomeMetadata } from "@/lib/seo/home-metadata";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale: Locale = isValidLocale(localeParam) ? localeParam : "bn";
  return buildHomeMetadata(locale);
}

export default async function Home({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale: Locale = isValidLocale(localeParam) ? localeParam : "bn";

  let popularGames = fallbackPopularGames;
  let exclusiveSlides = fallbackExclusiveSlides;

  try {
    [popularGames, exclusiveSlides] = await Promise.all([
      fetchPopularGames(),
      fetchExclusiveSlides(),
    ]);
  } catch (error) {
    console.error("Failed to load home game data from API, using fallback:", error);
  }

  return (
    <>
      <HomeJsonLd locale={locale} />
      <HomeAppDownloadGate />
      <HomePromoGate />
      <HomeSpinWheelGate />
      <HeroSlider />
      <AnnouncementBar />
      <HomeGameTabs popularGames={popularGames} />
      <ProviderSection />
      <EventSection />
      <ExclusiveGamesSection slides={exclusiveSlides} />
    </>
  );
}
