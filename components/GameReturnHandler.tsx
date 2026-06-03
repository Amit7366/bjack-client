"use client";

import { useEffect, useRef } from "react";
import {
  GAME_RETURN_EVENT,
  dispatchGameReturn,
} from "@/lib/game-return-events";
import {
  refreshBalanceAfterGameReturn,
  shouldRefreshBalanceAfterGame,
} from "@/lib/game-balance-sync";
import { AUTH_CHANGE_EVENT, readAuthSession } from "@/lib/auth/session";

/**
 * Runs only after a game session: syncs bets + balance when the user lands back on the site.
 * Kept separate so pageshow / bfcache recovery always runs even if other state is stale.
 */
export default function GameReturnHandler() {
  const runningRef = useRef(false);

  useEffect(() => {
    const runIfNeeded = async () => {
      if (!shouldRefreshBalanceAfterGame()) return;
      if (!readAuthSession()?.accessToken) return;
      if (runningRef.current) return;

      runningRef.current = true;
      dispatchGameReturn();

      try {
        await refreshBalanceAfterGameReturn();
        window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
      } catch {
        /* flag stays set; user can tap refresh */
      } finally {
        runningRef.current = false;
      }
    };

    const onPageShow = () => {
      void runIfNeeded();
    };

    void runIfNeeded();

    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("focus", onPageShow);

    return () => {
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("focus", onPageShow);
    };
  }, []);

  return null;
}
