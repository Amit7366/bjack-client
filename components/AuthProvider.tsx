"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [balanceSyncing, setBalanceSyncing] = useState(false);

  const refreshSession = useCallback(() => {
    setSession(readAuthSession());
  }, []);

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

  const refreshBalance = useCallback(async () => {
    setBalanceSyncing(true);
    try {
      if (shouldRefreshBalanceAfterGame()) {
        await refreshBalanceAfterGameReturn();
      } else {
        await refreshWalletBalance();
      }
      refreshSession();
    } finally {
      setBalanceSyncing(false);
    }
  }, [refreshSession]);

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
