import type { GameTile } from "./game-tile";
import { inferLobbyGameTypes } from "./lobby-game-types";

/** @deprecated Use GameTile — kept for gradual refactors */


/** True when `src` is safe for next/image (http/https only). */
export function isValidGameImageUrl(src: string): boolean {
  if (!src?.trim()) return false;
  try {
    const url = new URL(src.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/** Returns a usable image URL, or empty string when missing/invalid (use text placeholder in UI). */
export function normalizeGameImage(src: string): string {
  const trimmed = src?.trim() ?? "";
  return isValidGameImageUrl(trimmed) ? trimmed : "";
}

/** Pick the first valid URL from catalog fields (`game_image` before `image`). */
export function resolveGameImage(...sources: (string | undefined | null)[]): string {
  for (const src of sources) {
    const normalized = normalizeGameImage(src ?? "");
    if (normalized) return normalized;
  }
  return "";
}

/** Vendor lobby rows share `GameTile` fields with home / carousel data. */
const JILI_SLOT_GAMES: GameTile[] = [
  {
    id: "1",
    title: "SUPER ACE",
    providerKey: "jili",
    providerLabel: "JILI",
    gameCode: "bdfb23c974a2517198c5443adeea77a8",
    gradient: "from-[#7c2d12] via-[#ea580c] to-[#431407]",
    glow: "#fb923c",
    image: "https://img.b112j.com/upload/game/AWCV2_JILI/BDT/JILI-SLOT-027.png?v=1778346484115",
  },
  {
    id: "2",
    title: "WILD BOUNTY SHOWDOWN",
    providerKey: "pg",
    providerLabel: "PG SOFT",
    gameCode: "c98bb64436826fe9a2c62955ff70cba9",
    gradient: "from-[#14532d] via-[#166534] to-[#052e16]",
    glow: "#4ade80",
    image: "https://img.b112j.com/upload/game/AWCV2_JILI/BDT/JILI-SLOT-138.png?v=1772695650667",
  },
  {
    id: "3",
    title: "FORTUNE GEMS 500",
    providerKey: "jili",
    providerLabel: "JILI",
    gameCode: "a990de177577a2e6a889aaac5f57b429",
    gradient: "from-[#a16207] via-[#eab308] to-[#713f12]",
    glow: "#fde047",
    image: "https://img.b112j.com/upload/game/AWCV2_JILI/BDT/JILI-SLOT-193.png?v=1778230919660",
  },
  {
    id: "4",
    title: "SUPER ELEMENTS",
    providerKey: "fachai",
    providerLabel: "FA CHAI",
    gradient: "from-[#1e3a8a] via-[#2563eb] to-[#172554]",
    glow: "#60a5fa",
    image: "https://img.b112j.com/upload/game/AWCV2_JILI/BDT/JILI-SLOT-031.png?v=1778346484761",
  },
  {
    id: "5",
    title: "DIVA'S ACE",
    providerKey: "yellowbat",
    providerLabel: "YELLOW BAT",
    gradient: "from-[#86198f] via-[#c026d3] to-[#4a044e]",
    glow: "#e879f9",
    image: "https://img.b112j.com/upload/game/AWCV2_JILI/BDT/JILI-SLOT-029.png?v=1778346484445",
  },
  {
    id: "6",
    title: "GOLDEN GENIE",
    providerKey: "jili",
    providerLabel: "JILI",
    gradient: "from-[#854d0e] via-[#ca8a04] to-[#422006]",
    glow: "#fcd34d",
    image: "https://img.b112j.com/upload/game/AWCV2_JILI/BDT/JILI-SLOT-119.png?v=1770106828547",
  },
  {
    id: "7",
    title: "MONEY COMING",
    providerKey: "jili",
    providerLabel: "JDB",
    gameCode: "db249defce63610fccabfa829a405232",
    gradient: "from-[#713f12] via-[#ca8a04] to-[#422006]",
    glow: "#fbbf24",
    image: "https://img.b112j.com/upload/game/AWCV2_JILI/BDT/JILI-SLOT-136.png?v=1772695063881",
  },
  {
    id: "8",
    title: "BOXING KING",
    providerKey: "jili",
    providerLabel: "JILI",
    gameCode: "981f5f9675002fbeaaf24c4128b938d7",
    gradient: "from-[#7f1d1d] via-[#dc2626] to-[#450a0a]",
    glow: "#f87171",
    image: "https://img.b112j.com/upload/game/AWCV2_JILI/BDT/JILI-SLOT-027.png?v=1778346484115",
  },
  {
    id: "9",
    title: "FORTUNE RABBIT",
    providerKey: "pg",
    providerLabel: "PG SOFT",
    gameCode: "e175cdd3215a02f5539cc8354a149b75",
    gradient: "from-[#5b21b6] via-[#7c3aed] to-[#2e1065]",
    glow: "#c084fc",
    image: "https://img.b112j.com/upload/game/AWCV2_JILI/BDT/JILI-SLOT-014.png?v=1778346481994",
  },
  {
    id: "10",
    title: "TREASURES OF AZTEC",
    providerKey: "pg",
    providerLabel: "PG SOFT",
    gameCode: "2fa9a84d096d6ff0bab53f81b79876c8",
    gradient: "from-[#14532d] via-[#15803d] to-[#052e16]",
    glow: "#4ade80",
    image: "https://img.b112j.com/upload/game/AWCV2_JILI/BDT/JILI-SLOT-129.png?v=1774269694257",
  },
  {
    id: "11",
    title: "LUCKY NEKO",
    providerKey: "pg",
    providerLabel: "PG SOFT",
    gameCode: "e1b4c6b95746d519228744771f15fe4b",
    gradient: "from-[#9d174d] via-[#db2777] to-[#500724]",
    glow: "#fb7185",
    image: "https://img.b112j.com/upload/game/AWCV2_JILI/BDT/JILI-SLOT-112.png?v=1778346495876",
  },
  {
    id: "12",
    title: "CANDY BONANZA",
    providerKey: "pg",
    providerLabel: "PG SOFT",
    gameCode: "bbe2320adc5c506e7e56a2d24d96a252",
    gradient: "from-[#be185d] via-[#ec4899] to-[#831843]",
    glow: "#f9a8d4",
    image: "https://img.b112j.com/upload/game/AWCV2_JILI/BDT/JILI-SLOT-115.png?v=1778346496388",
  },
  {
    id: "13",
    title: "MAHJONG WAYS 2",
    providerKey: "pg",
    providerLabel: "PG SOFT",
    gameCode: "ba2adf72179e1ead9e3dae8f0a7d4c07",
    gradient: "from-[#365314] via-[#65a30d] to-[#1a2e05]",
    glow: "#bef264",
    image: "https://img.b112j.com/upload/game/AWCV2_JILI/BDT/JILI-SLOT-105.png?v=1778346494557",
  },
  {
    id: "14",
    title: "GATES OF OLYMPUS",
    providerKey: "pragmatic",
    providerLabel: "PRAGMATIC PLAY",
    gradient: "from-[#4c1d95] via-[#7c3aed] to-[#2e1065]",
    glow: "#a78bfa",
    image: "https://img.b112j.com/upload/game/AWCV2_JILI/BDT/JILI-SLOT-028.png?v=1778346484292",
  },
  {
    id: "15",
    title: "SWEET BONANZA",
    providerKey: "pragmatic",
    providerLabel: "PRAGMATIC PLAY",
    gradient: "from-[#be123c] via-[#f43f5e] to-[#881337]",
    glow: "#fda4af",
    image: "https://img.b112j.com/upload/game/AWCV2_JILI/BDT/JILI-SLOT-026.png?v=1778346483894",
  },
  {
    id: "16",
    title: "BIG BASS BONANZA",
    providerKey: "pragmatic",
    providerLabel: "PRAGMATIC PLAY",
    gradient: "from-[#0c4a6e] via-[#0369a1] to-[#082f49]",
    glow: "#38bdf8",
    image: "https://img.b112j.com/upload/game/AWCV2_JILI/BDT/JILI-SLOT-041.png?v=1778346485693",
  },
];

function providerKeyFromVendorDisplayLabel(label: string): string {
  const k = label.trim().toUpperCase();
  const map: Record<string, string> = {
    EXCLUSIVE: "exclusive",
    "PG SOFT": "pgsoft",
    "PRAGMATIC PLAY": "pragmaticplay",
    JDB: "jdb",
    "FA CHAI": "fachai",
    "YELLOW BAT": "yellowbat",
  };
  return map[k] ?? k.replace(/\s+/g, "").toLowerCase();
}

function withProviderLabel(games: GameTile[], label: string): GameTile[] {
  const providerKey = providerKeyFromVendorDisplayLabel(label);
  return games.map((g, i) => ({
    ...g,
    id: `${label}-${i}`,
    providerLabel: label,
    providerKey,
  }));
}

const SEXY_CASINO_GAMES: GameTile[] = [
  {
    id: "s1",
    title: "SEXY BACCARAT",
    providerKey: "sexybcrt",
    providerLabel: "SEXY",
    gradient: "from-[#831843] via-[#db2777] to-[#500724]",
    glow: "#f472b6",
    image: "https://img.b112j.com/upload/game/AWCV2_EVOLUTION/BDT/EVOLUTION-LIVE-172.png?v=1778347211427",
  },
  {
    id: "s2",
    title: "SEXY DRAGON TIGER",
    providerKey: "sexybcrt",
    providerLabel: "SEXY",
    gradient: "from-[#7f1d1d] via-[#dc2626] to-[#450a0a]",
    glow: "#f87171",
    image: "https://img.b112j.com/upload/game/AWCV2_SEXYBCRT/BDT/MX-LIVE-001_SEXY_1.png?v=1776572481238",
  },
  {
    id: "s3",
    title: "SEXY ROULETTE",
    providerKey: "sexybcrt",
    providerLabel: "SEXY",
    gradient: "from-[#14532d] via-[#16a34a] to-[#052e16]",
    glow: "#4ade80",
    image: "https://img.b112j.com/upload/game/AWCV2_PP/BDT/PP-LIVE-197.png?v=1775816233629",
  },
  {
    id: "s4",
    title: "SEXY SIC BO",
    providerKey: "sexybcrt",
    providerLabel: "SEXY",
    gradient: "from-[#713f12] via-[#ca8a04] to-[#422006]",
    glow: "#fcd34d",
    image: "https://img.b112j.com/upload/game/AWCV2_EVOLUTION/BDT/EVOLUTION-LIVE-183.png?v=1778347212769",
  },
  ...JILI_SLOT_GAMES.slice(0, 12).map((g, i) => ({
    ...g,
    id: `sx${i}`,
    providerKey: "sexybcrt",
    providerLabel: "SEXY",
  })),
];

const EVOLUTION_GAMES: GameTile[] = [
  {
    id: "e1",
    title: "LIGHTNING ROULETTE",
    providerKey: "evolution",
    providerLabel: "EVOLUTION",
    gradient: "from-[#1e3a8a] via-[#2563eb] to-[#172554]",
    glow: "#93c5fd",
    image: "https://img.b112j.com/upload/game/AWCV2_EVOLUTION/BDT/EVOLUTION-LIVE-180.png?v=1778347212264",
  },
  {
    id: "e2",
    title: "CRAZY TIME",
    providerKey: "evolution",
    providerLabel: "EVOLUTION",
    gradient: "from-[#7c2d12] via-[#ea580c] to-[#431407]",
    glow: "#fdba74",
    image: "https://img.b112j.com/upload/game/AWCV2_EVOLUTION/BDT/EVOLUTION-LIVE-212.png?v=1778347214583",
  },
  {
    id: "e3",
    title: "MONOPOLY LIVE",
    providerKey: "evolution",
    providerLabel: "EVOLUTION",
    gradient: "from-[#14532d] via-[#22c55e] to-[#052e16]",
    glow: "#86efac",
    image: "https://img.b112j.com/upload/game/AWCV2_EVOLUTION/BDT/EVOLUTION-LIVE-037.png?v=1778347198916",
  },
  ...JILI_SLOT_GAMES.slice(0, 13).map((g, i) => ({
    ...g,
    id: `ev${i}`,
    providerKey: "evolution",
    providerLabel: "EVOLUTION",
  })),
];

const SPRIBE_CRASH: GameTile[] = [
  {
    id: "av",
    title: "AVIATOR",
    providerKey: "spribe",
    providerLabel: "SPRIBE",
    gameCode: "a04d1f3eb8ccec8a4823bdf18e3f0e84",
    gradient: "from-[#7f1d1d] via-[#dc2626] to-[#450a0a]",
    glow: "#fca5a5",
    image: "https://img.b112j.com/upload/game/AWCV2_SPRIBE/BDT/SPRIBE-EGAME-001.png?v=1775037934474",
  },
  ...JILI_SLOT_GAMES.slice(0, 15).map((g, i) => ({
    ...g,
    id: `sp${i}`,
    providerKey: "spribe",
    providerLabel: "SPRIBE",
  })),
];

const SPORTS_PLACEHOLDER: GameTile[] = JILI_SLOT_GAMES.map((g, i) => ({
  ...g,
  id: `spo${i}`,
  title: `${g.title} LIVE`,
  providerKey: "cricket",
  providerLabel: "SPORTS",
}));

const EXCLUSIVE_LOBBY_GAMES: GameTile[] = withProviderLabel(
  JILI_SLOT_GAMES.slice(0, 14),
  "EXCLUSIVE",
);

const GAMES_BY_VENDOR: Record<string, GameTile[]> = {
  awcv2_exclusive: EXCLUSIVE_LOBBY_GAMES,
  awcv2_jili: JILI_SLOT_GAMES,
  awcv2_pgsoft: withProviderLabel(JILI_SLOT_GAMES, "PG SOFT"),
  awcv2_pragmaticplay: withProviderLabel(JILI_SLOT_GAMES, "PRAGMATIC PLAY"),
  awcv2_jdb: withProviderLabel(JILI_SLOT_GAMES, "JDB"),
  awcv2_fachai: withProviderLabel(JILI_SLOT_GAMES, "FA CHAI"),
  awcv2_yellowbat: withProviderLabel(JILI_SLOT_GAMES, "YELLOW BAT"),
  awcv2_sexybcrt: SEXY_CASINO_GAMES,
  awcv2_evolution: EVOLUTION_GAMES,
  awcv2_spribe: SPRIBE_CRASH,
  awcv2_cricket: SPORTS_PLACEHOLDER,
};

export function getGamesForVendor(vendor: string): GameTile[] {
  return (
    GAMES_BY_VENDOR[vendor] ??
    withProviderLabel(
      JILI_SLOT_GAMES,
      vendor.replace(/^awcv2_/i, "").toUpperCase(),
    )
  );
}

export function mergeGamesFromVendors(vendorCodes: string[]): GameTile[] {
  const seen = new Set<string>();
  const out: GameTile[] = [];
  for (const code of vendorCodes) {
    for (const g of getGamesForVendor(code)) {
      if (seen.has(g.id)) continue;
      seen.add(g.id);
      const types = g.types?.length ? g.types : inferLobbyGameTypes(g.title);
      out.push({ ...g, image: normalizeGameImage(g.image), types });
    }
  }
  return out;
}
