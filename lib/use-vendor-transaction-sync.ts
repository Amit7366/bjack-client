"use client";

import { useCallback, useEffect, useRef } from "react";
import { useAuth } from "@/components/AuthProvider";
import { syncGameTransactionsAndBalance } from "@/lib/game-balance-sync";

/**
 * Mirrors legacy useNewVendorTransactions: on mount + window focus, pull vendor
 * rows via authenticated sync-user → server ingest (turnover + bulk insert).
 */
export function useVendorTransactionSync(enabled = true) {
  const { isUser, authReady, refreshSession } = useAuth();
  const runningRef = useRef(false);

  const sync = useCallback(async () => {
    if (!enabled || !authReady || !isUser) return;
    if (runningRef.current) return;

    runningRef.current = true;
    try {
      await syncGameTransactionsAndBalance();
      refreshSession();
    } catch {
      /* non-blocking — GameReturnHandler / manual refresh can retry */
    } finally {
      runningRef.current = false;
    }
  }, [authReady, enabled, isUser, refreshSession]);

  useEffect(() => {
    if (!enabled || !authReady || !isUser) return;

    void sync();

    const onFocus = () => {
      void sync();
    };

    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [authReady, enabled, isUser, sync]);

  return { sync };
}

/** One-shot sync before launching a game (await in click handler). */
export async function syncVendorTransactionsBeforeLaunch(): Promise<void> {
  try {
    await syncGameTransactionsAndBalance();
  } catch {
    /* launch still proceeds; return handler will retry */
  }
}
