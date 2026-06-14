"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { logoutUser as logoutApi, fetchWalletMeta } from "@/lib/auth/api";
import { expireSessionIfNeeded } from "@/lib/auth/session-expired";
import {
  refreshBalanceAfterGameReturn,
  shouldRefreshBalanceAfterGame,
  manualReanchorBalance,
} from "@/lib/game-balance-sync";
import { USER_ROLE } from "@/lib/auth/constants";
import {
  AUTH_CHANGE_EVENT,
  readAuthSession,
  saveAuthSession,
  type AuthSession,
} from "@/lib/auth/session";
import {
  ensureWalletReady,
  mergeFromStorageEvent,
  readLocalWallet,
  reanchorIfServerAhead,
  subscribeWalletLocalChange,
} from "@/lib/wallet-local-state";

type AuthContextValue = {
  session: AuthSession | null;
  authReady: boolean;
  balanceSyncing: boolean;
  isAuthenticated: boolean;
  isUser: boolean;
  refreshSession: () => void;
  refreshBalance: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const WALLET_FOCUS_DEBOUNCE_MS = 1500;
const ANCHOR_CHECK_INTERVAL_MS = 2 * 60 * 60 * 1000;
const SESSION_CHECK_INTERVAL_MS = 30_000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [balanceSyncing, setBalanceSyncing] = useState(false);
  const walletSyncRef = useRef(false);
  const lastWalletSyncRef = useRef(0);

  const refreshSession = useCallback(() => {
    setSession(readAuthSession());
  }, []);

  const syncWalletFromServer = useCallback(
    async (opts?: { gameReturn?: boolean; forceDb?: boolean }) => {
      const current = readAuthSession();
      if (!current?.accessToken || !current.memberId) return;
      if (walletSyncRef.current) return;

      walletSyncRef.current = true;
      setBalanceSyncing(true);
      try {
        if (opts?.gameReturn && shouldRefreshBalanceAfterGame()) {
          await refreshBalanceAfterGameReturn();
        } else if (opts?.forceDb) {
          await manualReanchorBalance();
        } else {
          const local = readLocalWallet(current.memberId);
          if (local?.pendingPersist) {
            refreshSession();
            return;
          }
          const meta = await fetchWalletMeta();
          if (meta?.walletRevision != null) {
            await reanchorIfServerAhead(current.memberId, meta.walletRevision);
          } else {
            await ensureWalletReady(current.memberId);
          }
        }
        refreshSession();
      } finally {
        setBalanceSyncing(false);
        walletSyncRef.current = false;
        lastWalletSyncRef.current = Date.now();
      }
    },
    [refreshSession],
  );

  useEffect(() => {
    if (expireSessionIfNeeded()) {
      setSession(null);
      return;
    }

    const current = readAuthSession();
    if (current) {
      saveAuthSession(current);
    }
    setSession(current);
    setAuthReady(true);

    function onAuthChange() {
      refreshSession();
    }
    window.addEventListener(AUTH_CHANGE_EVENT, onAuthChange);
    window.addEventListener("storage", onAuthChange);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, onAuthChange);
      window.removeEventListener("storage", onAuthChange);
    };
  }, [refreshSession]);

  /** Log out and redirect when JWT expires while the app is open. */
  useEffect(() => {
    if (!authReady) return;

    const checkExpiry = () => {
      if (expireSessionIfNeeded()) {
        setSession(null);
      }
    };

    checkExpiry();
    const intervalId = window.setInterval(checkExpiry, SESSION_CHECK_INTERVAL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") checkExpiry();
    };

    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [authReady]);

  useEffect(() => {
    return subscribeWalletLocalChange(refreshSession);
  }, [refreshSession]);

  /** On load: init local wallet from DB if missing or expired. */
  useEffect(() => {
    if (!authReady || !session?.accessToken || !session.memberId) return;
    void (async () => {
      await ensureWalletReady(session.memberId!);
      refreshSession();
    })();
  }, [authReady, session?.accessToken, session?.memberId, refreshSession]);

  /** Multi-tab: merge wallet state when another tab writes localStorage. */
  useEffect(() => {
    if (!session?.memberId) return;

    const onStorage = (e: StorageEvent) => {
      if (!e.key?.startsWith("walletLocal:")) return;
      if (mergeFromStorageEvent(session.memberId!)) {
        refreshSession();
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [session?.memberId, refreshSession]);

  /** Tab focus: cross-device revision check (debounced). */
  useEffect(() => {
    if (!authReady || !session?.accessToken || !session.memberId) return;

    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      const elapsed = Date.now() - lastWalletSyncRef.current;
      if (elapsed < WALLET_FOCUS_DEBOUNCE_MS) return;

      if (shouldRefreshBalanceAfterGame()) {
        void syncWalletFromServer({ gameReturn: true });
        return;
      }

      void syncWalletFromServer();
    };

    window.addEventListener("focus", onVisible);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("focus", onVisible);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [authReady, session?.accessToken, session?.memberId, syncWalletFromServer]);

  /** Every 2 hours: re-anchor from DB while logged in. */
  useEffect(() => {
    if (!authReady || !session?.memberId) return;

    const id = window.setInterval(() => {
      void syncWalletFromServer({ forceDb: true });
    }, ANCHOR_CHECK_INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [authReady, session?.memberId, syncWalletFromServer]);

  const refreshBalance = useCallback(async () => {
    await syncWalletFromServer({
      gameReturn: shouldRefreshBalanceAfterGame(),
      forceDb: true,
    });
  }, [syncWalletFromServer]);

  const logout = useCallback(async () => {
    await logoutApi();
    setSession(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      authReady,
      balanceSyncing,
      isAuthenticated: Boolean(session?.accessToken),
      isUser: session?.role === USER_ROLE,
      refreshSession,
      refreshBalance,
      logout,
    }),
    [session, authReady, balanceSyncing, refreshSession, refreshBalance, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
