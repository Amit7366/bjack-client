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
import { useAuth } from "@/components/AuthProvider";
import GameLoginPromptModal from "@/components/GameLoginPromptModal";
import { useLocale } from "@/components/LocaleProvider";
import { useToast } from "@/components/ToastProvider";
import { useVendorTransactionSync } from "@/lib/use-vendor-transaction-sync";
import {
  handleGameReturnBalance,
  isBalanceUpdatePending,
  shouldRefreshBalanceAfterGame,
} from "@/lib/game-balance-sync";
import { GAME_RETURN_EVENT } from "@/lib/game-return-events";
import { launchGameInBrowser } from "@/lib/game-launch";
import GameLaunchOverlay from "./GameLaunchOverlay";

export type GameClickOptions = {
  title?: string;
  gameId?: string;
  gameCode?: string;
  onAuthorized?: () => void;
};

function isLobbyNumericId(id: string): boolean {
  return /^\d+(-\d+)?$/.test(id);
}

export function formatGameClickToast({
  title,
  gameId,
  gameCode,
}: Pick<GameClickOptions, "title" | "gameId" | "gameCode">): string | undefined {
  if (!title && !gameId && !gameCode) return undefined;

  if (title) {
    const meta: string[] = [];
    if (gameId && !(gameCode && isLobbyNumericId(gameId))) meta.push(gameId);
    if (gameCode) meta.push(gameCode);
    if (meta.length > 0) return `${title} (${meta.join(" · ")})`;
    return title;
  }

  if (gameId && gameCode) return `${gameId} · ${gameCode}`;
  return gameId ?? gameCode;
}

type GamePlayGateContextValue = {
  handleGameClick: (options: GameClickOptions) => void;
};

const GamePlayGateContext = createContext<GamePlayGateContextValue | null>(null);

function balanceUpdatingMessage(locale: string): string {
  if (locale === "bn") return "ব্যালেন্স আপডেট হচ্ছে…";
  if (locale === "hi") return "बैलेंस अपडेट हो रहा है…";
  return "Balance updating…";
}

export function GamePlayGateProvider({ children }: { children: ReactNode }) {
  const { isUser, authReady, session, refreshSession } = useAuth();
  const { preferences } = useLocale();
  const { showToast } = useToast();

  useVendorTransactionSync(isUser && authReady);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [launchingTitle, setLaunchingTitle] = useState<string | undefined>();

  const clearLaunchState = useCallback(() => {
    setLaunching(false);
    setLaunchingTitle(undefined);
  }, []);

  useEffect(() => {
    const onReturn = () => clearLaunchState();

    window.addEventListener(GAME_RETURN_EVENT, onReturn);
    window.addEventListener("pageshow", onReturn);

    return () => {
      window.removeEventListener(GAME_RETURN_EVENT, onReturn);
      window.removeEventListener("pageshow", onReturn);
    };
  }, [clearLaunchState]);

  const handleGameClick = useCallback(
    async ({ title, gameId, gameCode, onAuthorized }: GameClickOptions) => {
      if (!authReady || launching) return;

      if (!isUser) {
        setLoginPromptOpen(true);
        return;
      }

      if (gameCode) {
        const balanceStillUpdating = isBalanceUpdatePending();

        if (balanceStillUpdating) {
          showToast(balanceUpdatingMessage(preferences.locale));
        }

        // Background preview if return sync still pending — never block play.
        if (shouldRefreshBalanceAfterGame()) {
          void handleGameReturnBalance().then(() => refreshSession());
        }

        setLaunching(true);
        setLaunchingTitle(title);

        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        });

        try {
          refreshSession();
          await launchGameInBrowser(gameCode, session);
          return;
        } catch (error: unknown) {
          const msg =
            error instanceof Error ? error.message : "Failed to launch game";
          showToast(`API Error: ${msg}`);
          clearLaunchState();
          return;
        }
      }

      const message = formatGameClickToast({ title, gameId, gameCode });
      if (message) showToast(message);
      onAuthorized?.();
    },
    [
      authReady,
      isUser,
      launching,
      session,
      preferences.locale,
      showToast,
      refreshSession,
      clearLaunchState,
    ],
  );

  const value = useMemo(() => ({ handleGameClick }), [handleGameClick]);

  return (
    <GamePlayGateContext.Provider value={value}>
      {children}
      <GameLoginPromptModal
        open={loginPromptOpen}
        onClose={() => setLoginPromptOpen(false)}
      />
      <GameLaunchOverlay open={launching} gameTitle={launchingTitle} />
    </GamePlayGateContext.Provider>
  );
}

export function useGamePlayGate(): GamePlayGateContextValue {
  const ctx = useContext(GamePlayGateContext);
  if (!ctx) {
    throw new Error("useGamePlayGate must be used within GamePlayGateProvider");
  }
  return ctx;
}
