/** Fired when user is about to leave for the external game URL. */
export const GAME_DEPARTING_EVENT = "banglajackpot:game-departing";

/** Fired when user returns to the site after playing (pageshow / focus). */
export const GAME_RETURN_EVENT = "banglajackpot:game-return";

/** Fired after game txn sync so turnover UI can refresh immediately. */
export const TURNOVER_REFRESH_EVENT = "banglajackpot:turnover-refresh";

export function notifyTurnoverRefresh() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(TURNOVER_REFRESH_EVENT));
}

export function dispatchGameDeparting() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(GAME_DEPARTING_EVENT));
}

export function dispatchGameReturn() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(GAME_RETURN_EVENT));
}
