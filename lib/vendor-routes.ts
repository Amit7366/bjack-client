import type { HomeTabId } from "./home-games-data";
import {
  featuredRoutesFromActiveProviders,
  vendorCodeMapFromActiveProviders,
} from "./catalog-providers";

/** URL segment (singular slot per product reference) */
export type LobbyKind =
  | "exclusive"
  | "slot"
  | "casino"
  | "sports"
  | "crash"
  | "table"
  | "fishing"
  | "arcade"
  | "lottery";

export const LOBBY_KINDS: LobbyKind[] = [
  "exclusive",
  "slot",
  "casino",
  "sports",
  "crash",
  "table",
  "fishing",
  "arcade",
  "lottery",
];

/** Header dropdown order on vendor lobby pages. */
export const LOBBY_HEADER_MENU_KINDS: LobbyKind[] = [
  "exclusive",
  "sports",
  "casino",
  "slot",
  "crash",
  "table",
  "fishing",
  "arcade",
  "lottery",
];

export function isLobbyKind(value: string): value is LobbyKind {
  return LOBBY_KINDS.includes(value as LobbyKind);
}

/** Maps home tab id to URL path segment */
export function tabToLobbyKind(tab: Exclude<HomeTabId, "popular">): LobbyKind {
  if (tab === "slots") return "slot";
  return tab as LobbyKind;
}

/** Vendor query param value (e.g. awcv2_jili, awcv2_sexybcrt) */
const VENDOR_CODE: Record<string, string> = {
  ...vendorCodeMapFromActiveProviders(),
  pp: "awcv2_pragmaticplay",
  btiSports: "awcv2_bti",
  /*
   * Inactive — not in MongoDB gamecatalogs yet:
   * jdb: "awcv2_jdb",
   * yellowBat: "awcv2_yellowbat",
   * sexy: "awcv2_sexybcrt",
   * cricket: "awcv2_cricket",
   * btiSports: "awcv2_bti",
   * inSports: "awcv2_insports",
   * fbSports: "awcv2_fbsports",
   * ugSports: "awcv2_ugsports",
   * iSports: "awcv2_isports",
   * cmdSports: "awcv2_cmd",
   * sboSports: "awcv2_sbo",
   * eSports: "awcv2_esports",
   * horsebook: "awcv2_horsebook",
   * pinnacle: "awcv2_pinnacle",
   * saGaming: "awcv2_sa",
   * dreamGaming: "awcv2_dreamgaming",
   * allbet: "awcv2_allbet",
   * wmCasino: "awcv2_wm",
   * vivoGaming: "awcv2_vivo",
   * hacksaw: "awcv2_hacksaw",
   * rich88: "awcv2_rich88",
   * spadegaming: "awcv2_spadegaming",
   * cq9: "awcv2_cq9",
   * netent: "awcv2_netent",
   * aviator: "awcv2_aviator",
   * smartsoft: "awcv2_smartsoft",
   * turboGames: "awcv2_turbo",
   * bgaming: "awcv2_bgaming",
   * onlyplay: "awcv2_onlyplay",
   * inout: "awcv2_inout",
   * galaxsys: "awcv2_galaxsys",
   * mascot: "awcv2_mascot",
   * baccarat: "awcv2_baccarat",
   * roulette: "awcv2_roulette",
   * blackjack: "awcv2_blackjack",
   * sicbo: "awcv2_sicbo",
   * dragonTiger: "awcv2_dragontiger",
   * teenPatti: "awcv2_teenpatti",
   * andarBahar: "awcv2_andarbahar",
   * poker: "awcv2_poker",
   * holdem: "awcv2_holdem",
   * threeCard: "awcv2_threecard",
   * kaGaming: "awcv2_kagaming",
   * simplePlay: "awcv2_simpleplay",
   * youlian: "awcv2_youlian",
   * tc: "awcv2_tc",
   * king: "awcv2_kingmidas",
   * vrLottery: "awcv2_vrlottery",
   * bbin: "awcv2_bbin",
   * gwLottery: "awcv2_gw",
   * tpLottery: "awcv2_tp",
   * igLottery: "awcv2_ig",
   * sgWin: "awcv2_sgwin",
   * aeLottery: "awcv2_ae",
   * happyLottery: "awcv2_happy",
   */
};

function vendorCodeFor(providerId: string): string {
  return VENDOR_CODE[providerId] ?? `awcv2_${providerId.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}`;
}

/** Featured strip on home: which lobby + vendor each provider id uses */
const FEATURED_ROUTE: Record<string, { kind: LobbyKind; providerId: string }> = {
  ...featuredRoutesFromActiveProviders(),
  pp: { kind: "slot", providerId: "pragmatic" },
};

export function featuredProviderHref(locale: string, featuredId: string): string {
  const r = FEATURED_ROUTE[featuredId] ?? { kind: "slot" as const, providerId: featuredId };
  const v = vendorCodeFor(r.providerId);
  return `/${locale}/${r.kind}?vendor=${encodeURIComponent(v)}`;
}

export function categoryProviderHref(
  locale: string,
  tab: Exclude<HomeTabId, "popular">,
  providerId: string,
): string {
  const kind = tabToLobbyKind(tab);
  const v = vendorCodeFor(providerId);
  return `/${locale}/${kind}?vendor=${encodeURIComponent(v)}`;
}

/** Unfiltered lobby query value: `/{locale}/casino?vendor=all` */
export const LOBBY_VENDOR_ALL = "all";

export function defaultLobbyVendorParam(): string {
  return LOBBY_VENDOR_ALL;
}

export function isAllLobbyVendors(vendors: string[]): boolean {
  return vendors.length === 0 || (vendors.length === 1 && vendors[0] === LOBBY_VENDOR_ALL);
}

export function lobbyCategoryHref(locale: string, kind: LobbyKind): string {
  return `/${locale}/${kind}?vendor=${LOBBY_VENDOR_ALL}`;
}

export function lobbyProviderHref(locale: string, kind: LobbyKind, providerId: string): string {
  const v = vendorCodeFor(providerId);
  return `/${locale}/${kind}?vendor=${encodeURIComponent(v)}`;
}
