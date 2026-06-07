import AnnouncementBar from "@/components/AnnouncementBar";
import EventSection from "@/components/EventSection";
import ExclusiveGamesSection from "@/components/ExclusiveGamesSection";
import HeroSlider from "@/components/HeroSlider";
import HomeGameTabs from "@/components/HomeGameTabs";
import ProviderSection from "@/components/ProviderSection";
import { fetchExclusiveSlides, fetchPopularGames } from "@/lib/games-api";
import { popularGames as fallbackPopularGames } from "@/lib/home-games-data";
import { exclusiveCarouselSlides as fallbackExclusiveSlides } from "@/lib/home-carousel-data";

export default async function Home() {
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
      <HeroSlider />
      <AnnouncementBar />
      <HomeGameTabs popularGames={popularGames} />
      <ProviderSection />
      <EventSection />
      <ExclusiveGamesSection slides={exclusiveSlides} />
    </>
  );
}
