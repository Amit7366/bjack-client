import type { LobbyKind } from "./vendor-routes";

/** Home game tabs that show a provider grid (excludes "popular"). */
export type HomeCategoryTabId =
  | "sports"
  | "casino"
  | "slots"
  | "crash"
  | "table"
  | "fishing"
  | "arcade"
  | "lottery";

/** Active MongoDB gamecatalogs providers — single source of truth for client UI. */
export type CatalogProvider = {
  providerKey: string;
  vendorCode: string;
  labelKey: string;
  initials: string;
  color: string;
  defaultLobbyKind: LobbyKind;
};

/**
 * Lobby categories each provider may appear in (must match game `types` in MongoDB).
 * When adding a provider: set keys here + uncomment/add in ACTIVE_CATALOG_PROVIDERS.
 */
const PROVIDER_LOBBY_KINDS: Record<string, LobbyKind[]> = {
  pg: ["slot", "crash"],
  jili: ["slot", "fishing", "table", "casino"],
  spribe: ["crash", "slot"],
  evolution: ["casino"],
  pragmatic: ["slot"],
  playngo: ["slot", "table"],
  fachai: ["slot", "fishing", "arcade"],
  eazygaming: ["slot"],
  km: ["table"],
  relaxgaming: ["slot"],
  evoplay: ["slot"],
  ezugi: ["casino"],
  ideal: ["slot"],
  playtech: ["slot"],
  bti: ["sports"],
  jdb: ["slot", "fishing", "arcade", "lottery"],
  cq9: ["slot", "arcade", "lottery"],
  yellowBat: ["slot", "lottery"],
  sabasport: ["sports"],
  "9wicket": ["sports"],
  betby: ["sports"],
  cmd: ["sports"],
  tfgaming: ["sports"],
  sabasportsphp: ["sports"],
  unitedgaming: ["sports"],
  "568winsportsbook": ["sports"],
  sbosportsbook: ["sports"],
  sbovirtualsports: ["sports"],
  lucksport: ["sports"],
  inout: ["slot"],
  rich88: ["slot", "arcade", "table", "lottery"],
  fastspin: ["slot", "fishing"],
  nextspin: ["slot", "arcade", "fishing"],
  microgaming: ["slot", "arcade", "fishing"],
  hacksaw: ["arcade", "slot", "casino"],
  dreamgaming: ["casino"],
  eeai: ["lottery", "casino", "table", "slot", "arcade"],
  penguinking: ["arcade", "slot"],
  topbet: ["crash", "slot"],
};

/** Home tab → provider keys shown in HomeGameTabs grid. */
const HOME_TAB_PROVIDER_KEYS: Record<HomeCategoryTabId, string[]> = {
  slots: ["pg", "jili", "pragmatic", "playngo", "fachai", "eazygaming", "relaxgaming", "evoplay", "ideal", "jdb", "cq9", "yellowBat", "playtech", "spribe", "rich88", "inout", "fastspin", "nextspin", "microgaming", "hacksaw", "eeai", "penguinking", "topbet"],
  casino: ["evolution", "ezugi", "jili", "dreamgaming", "hacksaw", "eeai"],
  crash: ["spribe", "pg", "topbet"],
  fishing: ["jili", "fachai", "jdb", "fastspin", "nextspin", "microgaming"],
  table: ["km", "jili", "playngo", "rich88", "eeai"],
  arcade: ["fachai", "jdb", "cq9", "rich88", "nextspin", "microgaming", "hacksaw", "eeai", "penguinking"],
  lottery: ["cq9", "jdb", "rich88", "yellowBat", "eeai"],
  sports: ["bti", "sabasport", "9wicket", "betby", "cmd", "tfgaming", "sabasportsphp", "unitedgaming", "568winsportsbook", "sbosportsbook", "sbovirtualsports", "lucksport"],
};

export const ACTIVE_CATALOG_PROVIDERS: CatalogProvider[] = [
  { providerKey: "pg", vendorCode: "awcv2_pgsoft", labelKey: "pg", initials: "PG", color: "#22c55e", defaultLobbyKind: "slot" },
  { providerKey: "jili", vendorCode: "awcv2_jili", labelKey: "jili", initials: "JL", color: "#f59e0b", defaultLobbyKind: "slot" },
  { providerKey: "spribe", vendorCode: "awcv2_spribe", labelKey: "spribe", initials: "SP", color: "#ef4444", defaultLobbyKind: "crash" },
  { providerKey: "evolution", vendorCode: "awcv2_evolution", labelKey: "evolution", initials: "EV", color: "#1d4ed8", defaultLobbyKind: "casino" },
  { providerKey: "pragmatic", vendorCode: "awcv2_pragmaticplay", labelKey: "pragmatic", initials: "PP", color: "#f97316", defaultLobbyKind: "slot" },
  { providerKey: "playngo", vendorCode: "awcv2_playngo", labelKey: "playngo", initials: "PN", color: "#65a30d", defaultLobbyKind: "slot" },
  { providerKey: "fachai", vendorCode: "awcv2_fachai", labelKey: "fachai", initials: "FC", color: "#3b82f6", defaultLobbyKind: "slot" },
  { providerKey: "eazygaming", vendorCode: "awcv2_eazygaming", labelKey: "eazygaming", initials: "EG", color: "#0d9488", defaultLobbyKind: "slot" },
  { providerKey: "km", vendorCode: "awcv2_km", labelKey: "km", initials: "KM", color: "#ca8a04", defaultLobbyKind: "table" },
  { providerKey: "relaxgaming", vendorCode: "awcv2_relaxgaming", labelKey: "relaxgaming", initials: "RG", color: "#4338ca", defaultLobbyKind: "slot" },
  { providerKey: "evoplay", vendorCode: "awcv2_evoplay", labelKey: "evoplay", initials: "EP", color: "#7e22ce", defaultLobbyKind: "slot" },
  { providerKey: "ezugi", vendorCode: "awcv2_ezugi", labelKey: "ezugi", initials: "EZ", color: "#22c55e", defaultLobbyKind: "casino" },
  { providerKey: "ideal", vendorCode: "awcv2_ideal", labelKey: "ideal", initials: "ID", color: "#64748b", defaultLobbyKind: "slot" },
  { providerKey: "playtech", vendorCode: "awcv2_playtech", labelKey: "playtech", initials: "PT", color: "#0ea5e9", defaultLobbyKind: "slot" },
  { providerKey: "bti", vendorCode: "awcv2_bti", labelKey: "bti", initials: "BT", color: "#ef4444", defaultLobbyKind: "sports" },
  { providerKey: "jdb", vendorCode: "awcv2_jdb", labelKey: "jdb", initials: "JD", color: "#eab308", defaultLobbyKind: "slot" },
  { providerKey: "cq9", vendorCode: "awcv2_cq9", labelKey: "cq9", initials: "CQ", color: "#06b6d4", defaultLobbyKind: "slot" },
  { providerKey: "yellowBat", vendorCode: "awcv2_yellowbat", labelKey: "yellowBat", initials: "YB", color: "#eab308", defaultLobbyKind: "slot" },
  { providerKey: "sabasport", vendorCode: "awcv2_sabasport", labelKey: "sabasport", initials: "SB", color: "#16a34a", defaultLobbyKind: "sports" },
  { providerKey: "9wicket", vendorCode: "awcv2_9wicket", labelKey: "9wicket", initials: "9W", color: "#0ea5e9", defaultLobbyKind: "sports" },
  { providerKey: "betby", vendorCode: "awcv2_betby", labelKey: "betby", initials: "BY", color: "#6366f1", defaultLobbyKind: "sports" },
  { providerKey: "cmd", vendorCode: "awcv2_cmd", labelKey: "cmd", initials: "CM", color: "#dc2626", defaultLobbyKind: "sports" },
  { providerKey: "tfgaming", vendorCode: "awcv2_tfgaming", labelKey: "tfgaming", initials: "TF", color: "#7c3aed", defaultLobbyKind: "sports" },
  { providerKey: "sabasportsphp", vendorCode: "awcv2_sabasportsphp", labelKey: "sabasportsphp", initials: "SP", color: "#15803d", defaultLobbyKind: "sports" },
  { providerKey: "unitedgaming", vendorCode: "awcv2_unitedgaming", labelKey: "unitedgaming", initials: "UG", color: "#2563eb", defaultLobbyKind: "sports" },
  { providerKey: "568winsportsbook", vendorCode: "awcv2_568winsportsbook", labelKey: "568winsportsbook", initials: "56", color: "#ea580c", defaultLobbyKind: "sports" },
  { providerKey: "sbosportsbook", vendorCode: "awcv2_sbosportsbook", labelKey: "sbosportsbook", initials: "SO", color: "#0891b2", defaultLobbyKind: "sports" },
  { providerKey: "sbovirtualsports", vendorCode: "awcv2_sbovirtualsports", labelKey: "sbovirtualsports", initials: "SV", color: "#0284c7", defaultLobbyKind: "sports" },
  { providerKey: "lucksport", vendorCode: "awcv2_lucksport", labelKey: "lucksport", initials: "LS", color: "#ca8a04", defaultLobbyKind: "sports" },
  { providerKey: "inout", vendorCode: "awcv2_inout", labelKey: "inout", initials: "IO", color: "#8b5cf6", defaultLobbyKind: "slot" },
  { providerKey: "rich88", vendorCode: "awcv2_rich88", labelKey: "rich88", initials: "R8", color: "#a855f7", defaultLobbyKind: "slot" },
  { providerKey: "fastspin", vendorCode: "awcv2_fastspin", labelKey: "fastspin", initials: "FS", color: "#f43f5e", defaultLobbyKind: "slot" },
  { providerKey: "nextspin", vendorCode: "awcv2_nextspin", labelKey: "nextspin", initials: "NS", color: "#14b8a6", defaultLobbyKind: "slot" },
  { providerKey: "microgaming", vendorCode: "awcv2_microgaming", labelKey: "microgaming", initials: "MG", color: "#84cc16", defaultLobbyKind: "slot" },
  { providerKey: "hacksaw", vendorCode: "awcv2_hacksaw", labelKey: "hacksaw", initials: "HS", color: "#e5e7eb", defaultLobbyKind: "arcade" },
  { providerKey: "dreamgaming", vendorCode: "awcv2_dreamgaming", labelKey: "dreamGaming", initials: "DG", color: "#a855f7", defaultLobbyKind: "casino" },
  { providerKey: "eeai", vendorCode: "awcv2_eeai", labelKey: "eeai", initials: "EA", color: "#0d9488", defaultLobbyKind: "casino" },
  { providerKey: "penguinking", vendorCode: "awcv2_penguinking", labelKey: "penguinking", initials: "PK", color: "#38bdf8", defaultLobbyKind: "slot" },
  { providerKey: "topbet", vendorCode: "awcv2_topbet", labelKey: "topbet", initials: "TB", color: "#f97316", defaultLobbyKind: "crash" },
];

/*
 * Inactive — not in MongoDB gamecatalogs yet. Uncomment + add to PROVIDER_LOBBY_KINDS when ready.
 *
 * { providerKey: "bigGaming", vendorCode: "awcv2_biggaming", labelKey: "bigGaming", initials: "BG", color: "#f97316", defaultLobbyKind: "slot" },
 * { providerKey: "sexy", vendorCode: "awcv2_sexybcrt", labelKey: "sexy", initials: "SX", color: "#ec4899", defaultLobbyKind: "casino" },
 * { providerKey: "cricket", vendorCode: "awcv2_cricket", labelKey: "cricket", initials: "CR", color: "#e879a8", defaultLobbyKind: "sports" },
 */

const providerByKey = new Map(ACTIVE_CATALOG_PROVIDERS.map((p) => [p.providerKey, p]));

export function activeProviderByKey(key: string): CatalogProvider | undefined {
  return providerByKey.get(key);
}

export function activeVendorCodeForProviderKey(key: string): string | undefined {
  return providerByKey.get(key)?.vendorCode;
}

export function activeProvidersForLobbyKind(kind: LobbyKind): CatalogProvider[] {
  if (kind === "exclusive") {
    return ACTIVE_CATALOG_PROVIDERS;
  }
  return ACTIVE_CATALOG_PROVIDERS.filter((p) => PROVIDER_LOBBY_KINDS[p.providerKey]?.includes(kind));
}

export function activeLobbyFilterRows(kind: LobbyKind): Array<{ vendorCode: string; labelKey: string }> {
  return activeProvidersForLobbyKind(kind).map((p) => ({
    vendorCode: p.vendorCode,
    labelKey: p.labelKey,
  }));
}

export function activeProvidersForHomeTab(tab: HomeCategoryTabId): CatalogProvider[] {
  const keys = HOME_TAB_PROVIDER_KEYS[tab];
  return keys
    .map((key) => providerByKey.get(key))
    .filter((p): p is CatalogProvider => Boolean(p));
}

export function vendorCodeMapFromActiveProviders(): Record<string, string> {
  return Object.fromEntries(ACTIVE_CATALOG_PROVIDERS.map((p) => [p.providerKey, p.vendorCode]));
}

export function featuredRoutesFromActiveProviders(): Record<string, { kind: LobbyKind; providerId: string }> {
  return Object.fromEntries(
    ACTIVE_CATALOG_PROVIDERS.map((p) => [
      p.providerKey,
      { kind: p.defaultLobbyKind, providerId: p.providerKey },
    ]),
  );
}
