"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/components/AuthProvider";
import GameLoginPromptModal from "@/components/GameLoginPromptModal";
import { useToast } from "@/components/ToastProvider";
import { launchGameInBrowser } from "@/lib/game-launch";

export type GameClickOptions = {
  title?: string;
  /** Client-side game id (e.g. `aviator`) */
  gameId?: string;
  /** Provider game_code from server game data */
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
  const { isUser, authReady, session } = useAuth();
  const { showToast } = useToast();
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  const [launching, setLaunching] = useState(false);

  const handleGameClick = useCallback(
    async ({ title, gameId, gameCode, onAuthorized }: GameClickOptions) => {
      if (!authReady || launching) return;

      if (!isUser) {
        setLoginPromptOpen(true);
        return;
      }

      if (gameCode) {
        try {
          setLaunching(true);
          await launchGameInBrowser(gameCode, session);
          return;
        } catch (error: unknown) {
          const msg =
            error instanceof Error ? error.message : "Failed to launch game";
          showToast(`API Error: ${msg}`);
          return;
        } finally {
          setLaunching(false);
        }
      }

      const message = formatGameClickToast({ title, gameId, gameCode });
      if (message) showToast(message);
      onAuthorized?.();
    },
    [authReady, isUser, launching, session, showToast],
  );

  const value = useMemo(() => ({ handleGameClick }), [handleGameClick]);

  return (
    <GamePlayGateContext.Provider value={value}>
      {children}
      <GameLoginPromptModal
        open={loginPromptOpen}
        onClose={() => setLoginPromptOpen(false)}
      />
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
