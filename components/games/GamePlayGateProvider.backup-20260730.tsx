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
  awaitBalancePreviewForLaunch,
  isBalanceUpdatePending,
} from "@/lib/game-balance-sync";
import { GAME_RETURN_EVENT } from "@/lib/game-return-events";
import { launchGameInBrowser } from "@/lib/game-launch";
import { readAuthSession } from "@/lib/auth/session";
import { canPlayGames } from "@/lib/account-status";
import { getAccountRestrictionMessage } from "@/lib/i18n/account-status-messages";
import { getLocalBalance } from "@/lib/wallet-local-state";
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

function balanceUpdateFailedMessage(locale: string): string {
  if (locale === "bn") return "ব্যালেন্স আপডেট ব্যর্থ। আবার চেষ্টা করুন।";
  if (locale === "hi") return "बैलेंस अपडेट विफल। पुनः प्रयास करें।";
  return "Balance update failed. Please try again.";
}

function serverUpdatingMessage(locale: string): string {
  if (locale === "bn") return "সার্ভার আপডেট হচ্ছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।";
  if (locale === "hi") return "सर्वर अपडेट हो रहा है। कृपया बाद में पुनः प्रयास करें।";
  return "Server is Updating. Please try again later.";
}

function zeroBalanceMessage(locale: string): string {
  if (locale === "bn") return "আপনার ব্যালেন্স ০। অনুগ্রহ করে ডিপোজিট করুন।";
  if (locale === "hi") return "आपका बैलेंस 0 है। कृपया डिपॉज़िट करें।";
  return "Your balance is 0. Please deposit.";
}

function resolvePlayableBalance(memberId?: string, sessionBalance?: string): number {
  if (memberId) {
    const local = getLocalBalance(memberId);
    if (local != null && Number.isFinite(local)) return local;
  }
  const parsed = Number.parseFloat(sessionBalance ?? "0");
  return Number.isFinite(parsed) ? parsed : 0;
}

export function GamePlayGateProvider({ children }: { children: ReactNode }) {
  const { isUser, authReady, session, refreshSession } = useAuth();
  const { preferences } = useLocale();
  const { showToast } = useToast();

  useVendorTransactionSync(isUser && authReady);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [launchingTitle, setLaunchingTitle] = useState<string | undefined>();
  const [launchPhase, setLaunchPhase] = useState<"balance" | "launch">("launch");

  const clearLaunchState = useCallback(() => {
    setLaunching(false);
    setLaunchingTitle(undefined);
    setLaunchPhase("launch");
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

      const accountStatus = session?.accountStatus ?? readAuthSession()?.accountStatus;
      if (!canPlayGames(accountStatus)) {
        showToast(getAccountRestrictionMessage(preferences.locale, accountStatus), {
          variant: "error",
        });
        return;
      }

      if (gameCode) {
        const balanceStillUpdating = isBalanceUpdatePending();

        setLaunching(true);
        setLaunchingTitle(title);
        setLaunchPhase(balanceStillUpdating ? "balance" : "launch");

        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        });

        if (balanceStillUpdating) {
          showToast(balanceUpdatingMessage(preferences.locale));
          const previewOk = await awaitBalancePreviewForLaunch();
          if (!previewOk) {
            showToast(balanceUpdateFailedMessage(preferences.locale));
            clearLaunchState();
            return;
          }
          refreshSession();
        }

        const currentSession = readAuthSession() ?? session;
        const playableBalance = resolvePlayableBalance(
          currentSession?.memberId,
          currentSession?.balance,
        );
        if (playableBalance <= 0) {
          showToast(zeroBalanceMessage(preferences.locale), { variant: "error" });
          clearLaunchState();
          return;
        }

        setLaunchPhase("launch");

        try {
          await launchGameInBrowser(gameCode, currentSession);
          return;
        } catch (error: unknown) {
          const msg =
            error instanceof Error ? error.message : "Failed to launch game";
          const isServerUpdating = /server is updating/i.test(msg);
          if (isServerUpdating) {
            showToast(serverUpdatingMessage(preferences.locale));
            clearLaunchState();
            return;
          }
          const isPromoBlock =
            /deposit promotion|promo|প্রমো|प्रोमो/i.test(msg);
          showToast(isPromoBlock ? msg : `API Error: ${msg}`);
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
      <GameLaunchOverlay
        open={launching}
        gameTitle={launchingTitle}
        phase={launchPhase}
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
