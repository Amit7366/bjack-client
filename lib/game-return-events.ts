/** Fired when user is about to leave for the external game URL. */
export const GAME_DEPARTING_EVENT = "bkbaji:game-departing";

/** Fired when user returns to the site after playing (pageshow / focus). */
export const GAME_RETURN_EVENT = "bkbaji:game-return";

/** Fired after game txn sync so turnover UI can refresh immediately. */
export const TURNOVER_REFRESH_EVENT = "bkbaji:turnover-refresh";

/** Fired when preview API applies an updated balance (e.g. after slow PHP response). */
export const BALANCE_PREVIEW_APPLIED_EVENT = "bkbaji:balance-preview-applied";

export type BalancePreviewAppliedDetail = {
  balance: number;
  previousBalance: number;
  netDelta: number;
  delayedMs: number;
  /** True when preview was slow and balance changed — UI may show a toast. */
  showNotification: boolean;
};

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

export function dispatchBalancePreviewApplied(detail: BalancePreviewAppliedDetail) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<BalancePreviewAppliedDetail>(BALANCE_PREVIEW_APPLIED_EVENT, {
      detail,
    }),
  );
}
