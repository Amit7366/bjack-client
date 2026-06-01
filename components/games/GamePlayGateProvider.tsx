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
import { useToast } from "@/components/ToastProvider";
import {
  refreshBalanceAfterGameReturn,
  shouldRefreshBalanceAfterGame,
} from "@/lib/game-balance-sync";
import {
  GAME_DEPARTING_EVENT,
  GAME_RETURN_EVENT,
} from "@/lib/game-return-events";
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

export function GamePlayGateProvider({ children }: { children: ReactNode }) {
  const { isUser, authReady, session, refreshSession } = useAuth();
  const { showToast } = useToast();
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [launchingTitle, setLaunchingTitle] = useState<string | undefined>();

  const clearLaunchState = useCallback(() => {
    setLaunching(false);
    setLaunchingTitle(undefined);
  }, []);

  useEffect(() => {
    const onDepart = () => clearLaunchState();
    const onReturn = () => clearLaunchState();

    window.addEventListener(GAME_DEPARTING_EVENT, onDepart);
    window.addEventListener(GAME_RETURN_EVENT, onReturn);
    window.addEventListener("pageshow", onReturn);

    return () => {
      window.removeEventListener(GAME_DEPARTING_EVENT, onDepart);
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
        setLaunching(true);
        setLaunchingTitle(title);
        try {
          if (shouldRefreshBalanceAfterGame()) {
            try {
              await refreshBalanceAfterGameReturn();
              refreshSession();
            } catch {
              /* GameReturnHandler will retry */
            }
          }
          clearLaunchState();
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
    [authReady, isUser, launching, session, showToast, refreshSession, clearLaunchState],
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
