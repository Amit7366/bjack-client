import type { ApiResponse } from "@/lib/api/types";
import { formatWalletBalance, refreshWalletBalance } from "@/lib/auth/api";
import { authFetchJson } from "@/lib/auth/auth-fetch";
import { isJwtExpired } from "@/lib/auth/jwt";
import { handleSessionExpired } from "@/lib/auth/session-expired";
import { AUTH_CHANGE_EVENT, readAuthSession, saveAuthSession } from "@/lib/auth/session";
import {
  clearGameSessionPending,
  isGameSessionPending,
  markGameSessionPending,
} from "@/lib/game-session-pending";
import { notifyTurnoverRefresh } from "@/lib/game-return-events";

export {
  clearGameSessionPending,
  isGameSessionPending,
  markGameSessionPending,
};

const SYNC_TIMEOUT_MS = 45_000;

export type GameReturnWithdrawResult = {
  currentBalance: number;
  withdrawnAmount: number;
  creditsWhileAway: number;
  gameSessionActive: boolean;
  skipped?: boolean;
  walletRevision: number;
};

/** In-memory only for the current page lifetime; pending flag also lives in sessionStorage. */
let inflightReturn: Promise<GameReturnWithdrawResult | null> | null = null;

/** True while return-withdraw is in flight. */
export function isBalancePreviewInflight(): boolean {
  return inflightReturn != null;
}

/**
 * True when UI must wait before launching another game or GET-ing Mongo balance.
 * sessionStorage survives redirect to the game provider in the same tab.
 */
export function isBalanceUpdatePending(): boolean {
  return inflightReturn != null || isGameSessionPending();
}

/** @deprecated localStorage tracker removed — always false. */
export function shouldRefreshBalanceAfterGame(): boolean {
  return isBalanceUpdatePending();
}

/** @deprecated no-op — localStorage tracker removed. */
export function markNeedsBalanceRefresh() {
  markGameSessionPending();
}

/** @deprecated no-op — localStorage tracker removed. */
export function clearNeedsBalanceRefresh() {
  clearGameSessionPending();
}

/** No-op kept for use-vendor-transaction-sync compatibility. */
export function prepareBalanceForGameLaunch(): void {
  /* balance comes from API at launch time */
}

async function fetchWithTimeout(
  run: () => Promise<{ ok: boolean; status: number; body: ApiResponse<GameReturnWithdrawResult> }>,
  timeoutMs = SYNC_TIMEOUT_MS,
): Promise<{ ok: boolean; status: number; body: ApiResponse<GameReturnWithdrawResult> }> {
  return await Promise.race([
    run(),
    new Promise<never>((_, reject) => {
      window.setTimeout(() => reject(new Error("Balance update timed out")), timeoutMs);
    }),
  ]);
}

/** Zero Mongo balance and mark gameSessionActive after launch URL is ready. */
export async function prepareGameLaunchZero(): Promise<{
  creditAmount: number;
  walletRevision: number;
}> {
  const session = readAuthSession();
  if (!session?.accessToken || !session.memberId) {
    throw new Error("Please log in to continue");
  }
  if (isJwtExpired(session.accessToken)) {
    handleSessionExpired();
    throw new Error("Session expired");
  }

  const { ok, body } = await authFetchJson<{
    creditAmount: number;
    currentBalance: number;
    walletRevision: number;
    gameSessionActive: boolean;
  }>("/transaction/game/prepare-launch", { method: "POST" });

  if (!ok || !body.success || !body.data) {
    throw new Error(body.message || "Failed to prepare game launch");
  }

  markGameSessionPending();

  const zeroed = formatWalletBalance(0) ?? "0.00";
  saveAuthSession({ ...session, balance: zeroed });
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  }

  return {
    creditAmount: Number(body.data.creditAmount),
    walletRevision: Number(body.data.walletRevision),
  };
}

/**
 * Call Node return-withdraw (proxies getWithdraw.php) and update auth session balance.
 * Idempotent when no gameSessionActive on server.
 */
export async function handleGameReturnBalance(): Promise<GameReturnWithdrawResult | null> {
  if (inflightReturn) return inflightReturn;

  inflightReturn = (async () => {
    const session = readAuthSession();
    if (!session?.accessToken || !session.memberId) return null;
    if (isJwtExpired(session.accessToken)) {
      handleSessionExpired();
      return null;
    }

    const { ok, body } = await fetchWithTimeout(() =>
      authFetchJson<GameReturnWithdrawResult>("/transaction/game/return-withdraw", {
        method: "POST",
      }),
    );

    if (!ok || !body.success || !body.data) {
      throw new Error(body.message || "Failed to update balance after game");
    }

    const result = body.data;
    const formatted =
      formatWalletBalance(result.currentBalance) ??
      Number(result.currentBalance).toFixed(2);

    saveAuthSession({ ...readAuthSession()!, balance: formatted });
    if (!result.gameSessionActive) {
      clearGameSessionPending();
    }
    notifyTurnoverRefresh();

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
    }

    return result;
  })().finally(() => {
    inflightReturn = null;
  });

  return inflightReturn;
}

/** Wait for return-withdraw (idempotent) before launching again. */
export async function awaitBalancePreviewForLaunch(): Promise<boolean> {
  try {
    const result = await handleGameReturnBalance();
    return result != null;
  } catch {
    return false;
  }
}

export async function refreshBalanceAfterGameReturn(): Promise<string | undefined> {
  try {
    const result = await handleGameReturnBalance();
    if (result && Number.isFinite(result.currentBalance)) {
      return formatWalletBalance(result.currentBalance);
    }
  } catch {
    /* fall through */
  }
  return refreshWalletBalance();
}

export async function manualReanchorBalance(): Promise<string | undefined> {
  return refreshWalletBalance();
}

/** @deprecated Use handleGameReturnBalance — kept for backup/legacy imports. */
export async function syncGameTransactionsAndBalance(): Promise<{
  currentBalance: number;
  syncedAt: string;
  providerTotal: number;
  stats: {
    accepted: number;
    duplicates: number;
    errors: number;
    balancesUpdated: number;
    skippedNoBalance: number;
  };
} | null> {
  const result = await handleGameReturnBalance();
  if (!result) return null;
  return {
    currentBalance: result.currentBalance,
    syncedAt: new Date().toISOString(),
    providerTotal: 0,
    stats: {
      accepted: 0,
      duplicates: 0,
      errors: 0,
      balancesUpdated: 0,
      skippedNoBalance: 0,
    },
  };
}
