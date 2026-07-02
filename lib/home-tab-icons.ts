import type { HomeTabId } from "./home-games-data";

const ICON_QUERY = "v=1782898472376";
const ICON_BASE = "https://img.b112j.com/bj/h5/assets/v3/images/icon-set/menu-type";

export const HOME_TAB_SPRITE_FRAMES = 15;
export const HOME_TAB_ICON_SIZE = 28;
export const HOME_TAB_ICON_ACTIVE_SIZE = 32;
export const HOME_TAB_ICON_ACTIVE_SCALE = HOME_TAB_ICON_ACTIVE_SIZE / HOME_TAB_ICON_SIZE;
export const HOME_TAB_SPRITE_WIDTH = 1500;
export const HOME_TAB_SPRITE_HEIGHT = 100;

const homeTabAnimatedIconFiles: Record<HomeTabId, string> = {
  popular: "icon-exclusive-ani.png",
  sports: "icon-sport-ani.png",
  casino: "icon-casino-ani.png",
  slots: "icon-slot-ani.png",
  crash: "icon-crash-ani.png",
  table: "icon-table-ani.png",
  fishing: "icon-fish-ani.png",
  arcade: "icon-arcade-ani.png",
  lottery: "icon-lottery-ani.png",
};

export function homeTabAnimatedIconUrl(tabId: HomeTabId): string {
  return `${ICON_BASE}/${homeTabAnimatedIconFiles[tabId]}?${ICON_QUERY}`;
}

export function getHomeTabSpriteMetrics(
  iconSize = HOME_TAB_ICON_SIZE,
  frames = HOME_TAB_SPRITE_FRAMES,
) {
  const bgWidth = (iconSize * HOME_TAB_SPRITE_WIDTH) / HOME_TAB_SPRITE_HEIGHT;
  const frameWidth = bgWidth / frames;
  const endX = -frameWidth * (frames - 1);
  return { bgWidth, endX, frames };
}
