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
  pg: ["slot", "arcade"],
  jili: ["slot", "fishing", "crash", "arcade"],
  spribe: ["crash", "arcade"],
  evolution: ["casino", "table"],
  pragmatic: ["slot", "fishing", "crash", "table", "arcade"],
  playngo: ["slot", "arcade"],
  fachai: ["slot", "fishing", "arcade"],
  eazygaming: ["slot"],
  bigGaming: ["casino", "fishing"],
  km: ["casino", "lottery"],
  relaxgaming: ["slot", "arcade"],
  evoplay: ["slot", "arcade"],
  ezugi: ["casino", "table"],
  ideal: ["slot"],
  playtech: ["casino", "table"],
  bti: ["sports"],
};

/** Home tab → provider keys shown in HomeGameTabs grid. */
const HOME_TAB_PROVIDER_KEYS: Record<HomeCategoryTabId, string[]> = {
  slots: ["pg", "jili", "pragmatic", "playngo", "fachai", "eazygaming", "relaxgaming", "evoplay", "ideal"],
  casino: ["evolution", "ezugi", "playtech", "bigGaming", "km"],
  crash: ["spribe", "jili", "pragmatic"],
  fishing: ["jili", "fachai", "bigGaming"],
  table: ["evolution", "pragmatic", "ezugi", "playtech"],
  arcade: ["jili", "fachai", "pragmatic", "playngo", "evoplay", "relaxgaming"],
  lottery: ["km"],
  sports: ["bti"],
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
  { providerKey: "bigGaming", vendorCode: "awcv2_biggaming", labelKey: "bigGaming", initials: "BG", color: "#f97316", defaultLobbyKind: "casino" },
  { providerKey: "km", vendorCode: "awcv2_km", labelKey: "km", initials: "KM", color: "#ca8a04", defaultLobbyKind: "casino" },
  { providerKey: "relaxgaming", vendorCode: "awcv2_relaxgaming", labelKey: "relaxgaming", initials: "RG", color: "#4338ca", defaultLobbyKind: "slot" },
  { providerKey: "evoplay", vendorCode: "awcv2_evoplay", labelKey: "evoplay", initials: "EP", color: "#7e22ce", defaultLobbyKind: "slot" },
  { providerKey: "ezugi", vendorCode: "awcv2_ezugi", labelKey: "ezugi", initials: "EZ", color: "#22c55e", defaultLobbyKind: "casino" },
  { providerKey: "ideal", vendorCode: "awcv2_ideal", labelKey: "ideal", initials: "ID", color: "#64748b", defaultLobbyKind: "slot" },
  { providerKey: "playtech", vendorCode: "awcv2_playtech", labelKey: "playtech", initials: "PT", color: "#0ea5e9", defaultLobbyKind: "casino" },
  { providerKey: "bti", vendorCode: "awcv2_bti", labelKey: "bti", initials: "BT", color: "#ef4444", defaultLobbyKind: "sports" },
];

/*
 * Inactive — not in MongoDB gamecatalogs yet. Uncomment + add to PROVIDER_LOBBY_KINDS when ready.
 *
 * { providerKey: "jdb", vendorCode: "awcv2_jdb", labelKey: "jdb", initials: "JD", color: "#eab308", defaultLobbyKind: "slot" },
 * { providerKey: "yellowBat", vendorCode: "awcv2_yellowbat", labelKey: "yellowBat", initials: "YB", color: "#eab308", defaultLobbyKind: "slot" },
 * { providerKey: "sexy", vendorCode: "awcv2_sexybcrt", labelKey: "sexy", initials: "SX", color: "#ec4899", defaultLobbyKind: "casino" },
 * { providerKey: "cq9", vendorCode: "awcv2_cq9", labelKey: "cq9", initials: "CQ", color: "#06b6d4", defaultLobbyKind: "slot" },
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
