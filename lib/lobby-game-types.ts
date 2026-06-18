/** Query / filter keys for lobby "Game type" section */
export const LOBBY_GAME_TYPE_IDS = ["top", "baccarat", "gameShow", "roulette", "sicbo", "poker"] as const;
export type LobbyGameTypeId = (typeof LOBBY_GAME_TYPE_IDS)[number];

export function inferLobbyGameTypes(title: string): LobbyGameTypeId[] {
  const u = title.toUpperCase();
  const out = new Set<LobbyGameTypeId>(["top"]);

  if (
    u.includes("BACCARAT") ||
    u.includes("DRAGON TIGER") ||
    u.includes("ANDAR") ||
    u.includes("BLACKJACK")
  ) {
    out.add("baccarat");
  }
  if (
    u.includes("CRAZY TIME") ||
    u.includes("MONOPOLY") ||
    u.includes("GAME SHOW") ||
    u.includes("MONEY WHEEL") ||
    u.includes("DEAL OR NO") ||
    u.includes("MEGA BALL")
  ) {
    out.add("gameShow");
  }
  if (u.includes("ROULETTE") || u.includes("LIGHTNING")) {
    out.add("roulette");
  }
  if (u.includes("SIC BO") || u.includes("SICBO")) {
    out.add("sicbo");
  }
  if (u.includes("POKER") || u.includes("HOLD'") || u.includes("HOLDEM") || u.includes("TEEN PATTI")) {
    out.add("poker");
  }

  return [...out];
}

export function gameMatchesLobbyTypes(game: { title: string; types?: string[] }, selected: string[]): boolean {
  if (!selected.length) return true;
  const tags = game.types?.length ? game.types : inferLobbyGameTypes(game.title);
  return selected.some((t) => tags.includes(t));
}

export function filterGamesByLobbyTypes<T extends { title: string; types?: string[] }>(
  games: T[],
  selectedTypeIds: string[],
): T[] {
  if (!selectedTypeIds.length) return games;
  return games.filter((g) => gameMatchesLobbyTypes(g, selectedTypeIds));
}

/** Keep games whose catalog `types` includes the lobby URL segment (e.g. fishing, slot). */
export function filterGamesByLobbyKind<T extends { types?: string[] }>(
  games: T[],
  kind: string,
): T[] {
  const category = kind.trim().toLowerCase();
  if (!category) return games;
  return games.filter((g) => g.types?.some((t) => t.toLowerCase() === category));
}
