/**
 * Shared shape for game tiles across home popular strip, exclusive carousel,
 * vendor lobby, and any future surfaces (`game_code`-aligned where backend IDs matter).
 */
export type GameTile = {
  /** Stable row/key inside list URLs / virtualization dedupe (`exclusive-carousel-slot-n`, `"12"`…) */
  id: string;
  /** Visible English title (home carousel/popular may still use i18n keyed by matching `id` where applicable). */
  title: string;
  /** Cross-app provider slug (often maps to `t.home.providers`). */
  providerKey: string;
  /** Badge text on lobby cards when not translating */
  providerLabel: string;
  /** Aggregator `/ server game_code` when wired to gameData.ts */
  gameCode?: string;
  gradient: string;
  glow: string;
  emoji?: string;
  image: string;
  /** Lobby filter facets */
  types?: string[];
};
