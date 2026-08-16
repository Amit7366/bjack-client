import type { HomeTabId } from "./home-games-data";
import { memberLiveChatHref } from "./member-routes";
import {
  BKBAJI_ANDROID_APP_PATH,
  SITE_SUPPORT_EMAIL,
  SITE_TELEGRAM_URL,
} from "./seo/site-config";
import {
  categoryProviderHref,
  lobbyCategoryHref,
  lobbyProviderHref,
  type LobbyKind,
} from "./vendor-routes";

/** Sidebar menu id → lobby URL segment */
const SIDEBAR_TO_LOBBY: Record<string, LobbyKind> = {
  exclusive: "exclusive",
  sports: "sports",
  casino: "casino",
  slots: "slot",
  crash: "crash",
  table: "table",
  fishing: "fishing",
  arcade: "arcade",
  lottery: "lottery",
};

/** Sidebar id → home tab id (for `categoryProviderHref`) */
const SIDEBAR_TO_TAB: Record<string, Exclude<HomeTabId, "popular">> = {
  sports: "sports",
  casino: "casino",
  slots: "slots",
  crash: "crash",
  table: "table",
  fishing: "fishing",
  arcade: "arcade",
  lottery: "lottery",
};

/**
 * Sidebar sub-item ids that differ from `home.providers` / vendor map keys.
 * e.g. "football" label → FB Sports vendor code.
 */
const SIDEBAR_SUB_PROVIDER: Partial<Record<string, Partial<Record<string, string>>>> = {
  sports: {
    football: "fbSports",
    tennis: "bti",
  },
};

export function sidebarLobbyKind(itemId: string): LobbyKind | undefined {
  return SIDEBAR_TO_LOBBY[itemId];
}

/** Internal sidebar link targets; `null` = placeholder (#). */
export function sidebarItemHref(locale: string, itemId: string): string | null {
  if (itemId === "appDownload") return BKBAJI_ANDROID_APP_PATH;
  if (itemId === "vipClub") return `/${locale}/vip`;
  if (itemId === "referral") return `/${locale}/referral`;
  const kind = SIDEBAR_TO_LOBBY[itemId];
  if (kind) return lobbyCategoryHref(locale, kind);
  return null;
}

/** Dropdown sub-item → `/{locale}/{kind}?vendor=…` */
export function sidebarSubItemHref(
  locale: string,
  parentId: string,
  subId: string,
): string | null {
  if (parentId === "contactUs") {
    if (subId === "liveChat") return memberLiveChatHref(locale);
    if (subId === "email") return `mailto:${SITE_SUPPORT_EMAIL}`;
    if (subId === "telegram") return SITE_TELEGRAM_URL;
  }

  const kind = SIDEBAR_TO_LOBBY[parentId];
  if (!kind) return null;

  if (subId === "all") {
    return lobbyCategoryHref(locale, kind);
  }

  const providerId = SIDEBAR_SUB_PROVIDER[parentId]?.[subId] ?? subId;
  const tab = SIDEBAR_TO_TAB[parentId];
  if (tab) {
    return categoryProviderHref(locale, tab, providerId);
  }

  return lobbyProviderHref(locale, kind, providerId);
}
