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
import { logoutUser as logoutApi, refreshWalletBalance } from "@/lib/auth/api";
import {
  refreshBalanceAfterGameReturn,
  shouldRefreshBalanceAfterGame,
} from "@/lib/game-balance-sync";
import { USER_ROLE } from "@/lib/auth/constants";
import {
  AUTH_CHANGE_EVENT,
  readAuthSession,
  saveAuthSession,
  type AuthSession,
} from "@/lib/auth/session";

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
    async (opts?: { gameReturn?: boolean }) => {
      const current = readAuthSession();
      if (!current?.accessToken || !current.memberId) return;
      if (walletSyncRef.current) return;

      walletSyncRef.current = true;
      setBalanceSyncing(true);
      try {
        if (opts?.gameReturn && shouldRefreshBalanceAfterGame()) {
          await refreshBalanceAfterGameReturn();
        } else {
          await refreshWalletBalance();
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

  /** On load: always pull currentBalance from MongoDB (fixes stale localStorage). */
  useEffect(() => {
    if (!authReady || !session?.accessToken || !session.memberId) return;
    void syncWalletFromServer();
  }, [authReady, session?.accessToken, session?.memberId, syncWalletFromServer]);

  /** When user returns to tab: refresh wallet so all devices stay aligned. */
  useEffect(() => {
    if (!authReady || !session?.accessToken) return;

    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      const elapsed = Date.now() - lastWalletSyncRef.current;
      if (elapsed < WALLET_FOCUS_DEBOUNCE_MS) return;
      void syncWalletFromServer();
    };

    window.addEventListener("focus", onVisible);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("focus", onVisible);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [authReady, session?.accessToken, syncWalletFromServer]);

  const refreshBalance = useCallback(async () => {
    await syncWalletFromServer({
      gameReturn: shouldRefreshBalanceAfterGame(),
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
