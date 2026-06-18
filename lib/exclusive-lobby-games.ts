import type { CarouselSlide } from "@/lib/home-carousel-data";
import { exclusiveCarouselSlides } from "@/lib/home-carousel-data";
import { popularGames } from "@/lib/home-games-data";
import type { GameTile } from "@/lib/game-tile";
import { ACTIVE_CATALOG_PROVIDERS } from "@/lib/catalog-providers";
import { fetchExclusiveSlides, fetchPopularGames } from "@/lib/games-api";
import { resolveGameImage } from "@/lib/vendor-games-data";

const EXCLUSIVE_TYPE = "exclusive";

function withExclusiveType(game: GameTile): GameTile {
  return {
    ...game,
    image: resolveGameImage(game.image),
    types: [EXCLUSIVE_TYPE],
  };
}

function slideToTile(slide: CarouselSlide, index: number, popularById: Map<string, GameTile>): GameTile {
  const base = slide.gameId ? popularById.get(slide.gameId) : undefined;
  return withExclusiveType({
    id: slide.gameId ?? `exclusive-slide-${index}`,
    title: base?.title ?? slide.title ?? slide.gameId ?? "Exclusive",
    providerKey: base?.providerKey ?? "jili",
    providerLabel: base?.providerLabel ?? "EXCLUSIVE",
    gameCode: slide.gameCode ?? base?.gameCode,
    gradient: base?.gradient ?? "from-[#374151] via-[#1f2937] to-[#111827]",
    glow: base?.glow ?? "#6b7280",
    emoji: base?.emoji,
    image: slide.image,
  });
}

function mergeExclusiveSources(popular: GameTile[], slides: CarouselSlide[]): GameTile[] {
  const popularById = new Map(popular.map((g) => [g.id, g]));
  const seen = new Set<string>();
  const out: GameTile[] = [];

  for (const game of popular) {
    const tile = withExclusiveType(game);
    const key = tile.gameCode?.trim() || tile.id;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(tile);
  }

  slides.forEach((slide, index) => {
    const tile = slideToTile(slide, index, popularById);
    const key = tile.gameCode?.trim() || tile.id;
    if (seen.has(key)) return;
    seen.add(key);
    out.push(tile);
  });

  return out;
}

export function filterExclusiveGamesByVendor(games: GameTile[], vendorCodes: string[]): GameTile[] {
  if (!vendorCodes.length) return games;

  const allowedKeys = new Set(
    vendorCodes
      .map((code) => ACTIVE_CATALOG_PROVIDERS.find((p) => p.vendorCode === code)?.providerKey)
      .filter((key): key is string => Boolean(key)),
  );

  if (!allowedKeys.size) return games;
  return games.filter((g) => allowedKeys.has(g.providerKey));
}

/** Popular home tab + exclusive carousel — same sources as the home page. */
export async function loadExclusiveLobbyGames(vendorCodes: string[]): Promise<GameTile[]> {
  try {
    const [popular, slides] = await Promise.all([fetchPopularGames(), fetchExclusiveSlides()]);
    const merged = mergeExclusiveSources(popular, slides);
    return filterExclusiveGamesByVendor(merged, vendorCodes);
  } catch (error) {
    console.error("Failed to load exclusive lobby games from API, using fallback:", error);
    const merged = mergeExclusiveSources(popularGames, exclusiveCarouselSlides);
    return filterExclusiveGamesByVendor(merged, vendorCodes);
  }
}
