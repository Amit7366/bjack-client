/** Fired when user is about to leave for the external game URL. */
export const GAME_DEPARTING_EVENT = "bkbaji:game-departing";

/** Fired when user returns to the site after playing (pageshow / focus). */
export const GAME_RETURN_EVENT = "bkbaji:game-return";

export function dispatchGameDeparting() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(GAME_DEPARTING_EVENT));
}

export function dispatchGameReturn() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(GAME_RETURN_EVENT));
}
