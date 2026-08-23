"use client";

import { useCallback, useEffect, useRef } from "react";
import { useAuth } from "@/components/AuthProvider";
import { fetchWalletMeta } from "@/lib/auth/api";
import {
  handleGameReturnBalance,
  isBalanceUpdatePending,
  prepareBalanceForGameLaunch,
} from "@/lib/game-balance-sync";
import { isGameSessionPending } from "@/lib/game-session-pending";
import {
  ensureWalletReady,
  readLocalWallet,
  reanchorIfServerAhead,
} from "@/lib/wallet-local-state";

/**
 * Lightweight wallet alignment on mount/focus — no blocking full ingest.
 */
export function useVendorTransactionSync(enabled = true) {
  const { isUser, authReady, refreshSession, session } = useAuth();
  const runningRef = useRef(false);

  const sync = useCallback(async () => {
    if (!enabled || !authReady || !isUser || !session?.memberId) return;
    if (runningRef.current) return;

    runningRef.current = true;
    try {
      try {
        await handleGameReturnBalance();
      } catch {
        /* retry on next focus */
      }

      if (isBalanceUpdatePending() || isGameSessionPending()) {
        refreshSession();
        return;
      }

      const local = readLocalWallet(session.memberId);
      // While silent persist runs, keep showing preview balance — do not pull stale DB.
      if (local?.pendingPersist) {
        refreshSession();
        return;
      }
      await ensureWalletReady(session.memberId);
      const meta = await fetchWalletMeta();
      if (meta?.walletRevision != null) {
        await reanchorIfServerAhead(session.memberId, meta.walletRevision);
      }
      refreshSession();
    } catch {
      /* non-blocking */
    } finally {
      runningRef.current = false;
    }
  }, [authReady, enabled, isUser, refreshSession, session?.memberId]);

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

/** Ensure local wallet is ready before launching — no blocking vendor ingest. */
export function syncVendorTransactionsBeforeLaunch(): void {
  prepareBalanceForGameLaunch();
}
