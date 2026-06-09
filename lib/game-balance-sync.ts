import type { ApiResponse } from "@/lib/api/types";
import { formatWalletBalance, refreshWalletBalance } from "@/lib/auth/api";
import { readAuthSession, saveAuthSession } from "@/lib/auth/session";
import { notifyTurnoverRefresh } from "@/lib/game-return-events";
import {
  applyPreviewBalance,
  clearGameSession,
  ensureWalletReady,
  markPersistComplete,
  needsReanchor,
  readLocalWallet,
  reanchorWalletFromDb,
} from "@/lib/wallet-local-state";

const API_PREFIX = "/api/v1";
const SYNC_TIMEOUT_MS = 20_000;
let inflightPreview: Promise<GamePreviewResult | null> | null = null;

export const NEEDS_BALANCE_REFRESH_KEY = "needsBalanceRefresh";

export type GamePreviewResult = {
  estimatedBalance: number;
  netDelta: number;
  newRecords: number;
  providerTotal: number;
  currentBalance: number;
  syncToken: string;
  walletRevision: number;
  syncedAt: string;
  skippedReason?: "no_provider_records" | "no_new_records";
};

export type GameSyncResult = {
  providerTotal: number;
  newRecords?: number;
  skippedReason?: "no_provider_records" | "no_new_records";
  stats: {
    accepted: number;
    duplicates: number;
    errors: number;
    balancesUpdated: number;
    skippedNoBalance: number;
  };
  currentBalance: number;
  syncedAt: string;
};

export function markNeedsBalanceRefresh() {
  if (typeof window !== "undefined") {
    localStorage.setItem(NEEDS_BALANCE_REFRESH_KEY, "1");
    sessionStorage.setItem(NEEDS_BALANCE_REFRESH_KEY, "1");
  }
}

export function clearNeedsBalanceRefresh() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(NEEDS_BALANCE_REFRESH_KEY);
    sessionStorage.removeItem(NEEDS_BALANCE_REFRESH_KEY);
  }
}

export function shouldRefreshBalanceAfterGame(): boolean {
  if (typeof window === "undefined") return false;
  return (
    localStorage.getItem(NEEDS_BALANCE_REFRESH_KEY) === "1" ||
    sessionStorage.getItem(NEEDS_BALANCE_REFRESH_KEY) === "1"
  );
}

/** True while preview API is in flight (navbar may still show pre-game balance). */
export function isBalancePreviewInflight(): boolean {
  return inflightPreview != null;
}

/** True when UI balance may not reflect the latest game result yet. */
export function isBalanceUpdatePending(): boolean {
  return shouldRefreshBalanceAfterGame() || isBalancePreviewInflight();
}

/**
 * Waits for PHP preview + UI balance apply before launching a game.
 * Returns false if preview failed (caller should not launch with stale balance).
 */
export async function awaitBalancePreviewForLaunch(): Promise<boolean> {
  if (!isBalanceUpdatePending()) return true;
  try {
    const result = await handleGameReturnBalance();
    return result != null;
  } catch {
    return false;
  }
}

async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit,
  timeoutMs = SYNC_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    window.clearTimeout(timer);
  }
}

async function previewGameBalance(): Promise<GamePreviewResult | null> {
  const session = readAuthSession();
  if (!session?.accessToken || !session.memberId) return null;

  const res = await fetchWithTimeout(
    `${API_PREFIX}/gameRecords-txns/api/transactions/sync-user/preview`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      credentials: "include",
    },
  );

  const body = (await res.json()) as ApiResponse<GamePreviewResult>;
  if (!res.ok || !body.success || !body.data) {
    throw new Error(body.message || "Failed to preview game balance");
  }

  return body.data;
}

function firePersistSilent(syncToken: string): void {
  const session = readAuthSession();
  if (!session?.accessToken) return;

  void fetchWithTimeout(
    `${API_PREFIX}/gameRecords-txns/api/transactions/sync-user/persist`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      credentials: "include",
      body: JSON.stringify({ syncToken }),
    },
  ).catch(() => undefined);

  for (const delayMs of [15_000, 45_000, 90_000]) {
    window.setTimeout(() => {
      void checkPersistDrift(syncToken);
    }, delayMs);
  }
}

async function checkPersistDrift(syncToken: string): Promise<void> {
  const session = readAuthSession();
  if (!session?.accessToken || !session.memberId) return;

  try {
    const res = await fetchWithTimeout(
      `${API_PREFIX}/gameRecords-txns/api/transactions/sync-user/persist-status?syncToken=${encodeURIComponent(syncToken)}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${session.accessToken}` },
        credentials: "include",
      },
      8_000,
    );
    const body = (await res.json()) as ApiResponse<{
      status: string;
      dbBalance?: number;
      drift?: number;
    }>;
    if (!res.ok || !body.success || !body.data) return;
    if (body.data.status === "completed") {
      markPersistComplete(session.memberId!, body.data.dbBalance);
    }
  } catch {
    /* silent */
  }
}

/** Preview + local apply + silent background persist. */
export async function handleGameReturnBalance(): Promise<GamePreviewResult | null> {
  if (inflightPreview) return inflightPreview;

  inflightPreview = (async () => {
    const session = readAuthSession();
    if (!session?.accessToken || !session.memberId) return null;

    await ensureWalletReady(session.memberId);

    const preview = await previewGameBalance();
    if (!preview) return null;

    applyPreviewBalance(session.memberId, preview.estimatedBalance, preview.syncToken);

    if (session.memberId) {
      clearGameSession(session.memberId);
    }

    clearNeedsBalanceRefresh();
    notifyTurnoverRefresh();

    if (preview.newRecords > 0) {
      firePersistSilent(preview.syncToken);
    }

    return preview;
  })().finally(() => {
    inflightPreview = null;
  });

  return inflightPreview;
}

/** @deprecated Use handleGameReturnBalance — kept for compatibility. */
export async function syncGameTransactionsAndBalance(): Promise<GameSyncResult | null> {
  const preview = await handleGameReturnBalance();
  if (!preview) return null;
  return {
    providerTotal: preview.providerTotal,
    newRecords: preview.newRecords,
    skippedReason: preview.skippedReason,
    stats: {
      accepted: 0,
      duplicates: 0,
      errors: 0,
      balancesUpdated: 0,
      skippedNoBalance: 0,
    },
    currentBalance: preview.estimatedBalance,
    syncedAt: preview.syncedAt,
  };
}

/** Uses local preview balance immediately — no blocking DB/persist wait. */
export function prepareBalanceForGameLaunch(): void {
  const session = readAuthSession();
  if (!session?.memberId) return;
  const local = readLocalWallet(session.memberId);
  if (local && !needsReanchor(local)) return;
  void ensureWalletReady(session.memberId);
}

export async function refreshBalanceAfterGameReturn(): Promise<string | undefined> {
  const session = readAuthSession();
  if (!session?.accessToken || !session.memberId) return undefined;

  if (shouldRefreshBalanceAfterGame()) {
    try {
      const result = await handleGameReturnBalance();
      if (result && Number.isFinite(result.estimatedBalance)) {
        return result.estimatedBalance.toFixed(2);
      }
    } catch {
      /* fall through to DB re-anchor */
    }
  }

  try {
    const balance = await reanchorWalletFromDb(session.memberId);
    clearNeedsBalanceRefresh();
    return balance.toFixed(2);
  } catch {
    return readAuthSession()?.balance;
  }
}

export async function manualReanchorBalance(): Promise<string | undefined> {
  const session = readAuthSession();
  if (!session?.memberId) return session?.balance;
  const balance = await reanchorWalletFromDb(session.memberId);
  return balance.toFixed(2);
}
