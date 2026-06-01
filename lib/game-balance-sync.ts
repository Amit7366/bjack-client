import type { ApiResponse } from "@/lib/api/types";
import { refreshWalletBalance } from "@/lib/auth/api";
import { readAuthSession, saveAuthSession } from "@/lib/auth/session";

const API_PREFIX = "/api/v1";
const SYNC_TIMEOUT_MS = 20_000;

export const NEEDS_BALANCE_REFRESH_KEY = "needsBalanceRefresh";

export type GameSyncResult = {
  providerTotal: number;
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

/**
 * Pulls pending bet rows from txserver for this user, ingests only new txnIds,
 * updates wallet balance on server, returns fresh balance (fast — no history load).
 */
export async function syncGameTransactionsAndBalance(): Promise<GameSyncResult | null> {
  const session = readAuthSession();
  if (!session?.accessToken) return null;

  const res = await fetchWithTimeout(
    `${API_PREFIX}/gameRecords-txns/api/transactions/sync-user`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      credentials: "include",
    },
  );

  const body = (await res.json()) as ApiResponse<GameSyncResult>;
  if (!res.ok || !body.success || !body.data) {
    throw new Error(body.message || "Failed to sync game balance");
  }

  const balance = Number(body.data.currentBalance);
  if (Number.isFinite(balance)) {
    saveAuthSession({
      ...session,
      balance: balance.toFixed(2),
    });
  }

  clearNeedsBalanceRefresh();
  return body.data;
}

/**
 * After returning from an external game: sync bets then always confirm balance from API.
 */
export async function refreshBalanceAfterGameReturn(): Promise<string | undefined> {
  const session = readAuthSession();
  if (!session?.accessToken) return undefined;

  if (shouldRefreshBalanceAfterGame()) {
    try {
      const result = await syncGameTransactionsAndBalance();
      if (result && Number.isFinite(result.currentBalance)) {
        return result.currentBalance.toFixed(2);
      }
    } catch {
      /* game sync failed — still fetch wallet below */
    }
  }

  try {
    const balance = await refreshWalletBalance();
    clearNeedsBalanceRefresh();
    return balance;
  } catch {
    return readAuthSession()?.balance;
  }
}
