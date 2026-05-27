import type { GameTile } from "./game-tile";

/** Games shown per "Load more" step (matches product reference). */
export const LOBBY_GAMES_PAGE_SIZE = 120;

/** Demo catalog size when merging all providers (replace with API total in production). */
export const LOBBY_DEMO_CATALOG_SIZE = 4487;

/** Duplicate base tiles with unique ids until `targetSize` (for mock / large-list UX). */
export function expandLobbyCatalog(games: GameTile[], targetSize: number): GameTile[] {
  if (games.length === 0 || games.length >= targetSize) {
    return games.length > targetSize ? games.slice(0, targetSize) : games;
  }
  const out: GameTile[] = [...games];
  let n = 0;
  while (out.length < targetSize) {
    const base = games[n % games.length];
    out.push({
      ...base,
      id: `${base.id}-${out.length}`,
      title: out.length % 3 === 0 ? base.title : `${base.title} ${Math.floor(out.length / games.length) + 1}`,
    });
    n += 1;
  }
  return out;
}
