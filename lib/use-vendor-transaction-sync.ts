"use client";

import { useCallback, useEffect, useRef } from "react";
import { useAuth } from "@/components/AuthProvider";
import { fetchWalletMeta } from "@/lib/auth/api";
import { ensureWalletReady, reanchorIfServerAhead } from "@/lib/wallet-local-state";

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
export async function syncVendorTransactionsBeforeLaunch(): Promise<void> {
  const { prepareBalanceForGameLaunch } = await import("@/lib/game-balance-sync");
  await prepareBalanceForGameLaunch();
}
