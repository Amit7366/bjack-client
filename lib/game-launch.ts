import type { AuthSession } from "@/lib/auth/session";
import { refreshWalletBalance } from "@/lib/auth/api";
import { checkGameLaunchEligibility } from "@/lib/game-eligibility-api";
import {
  markGameSessionPending,
  prepareGameLaunchZero,
} from "@/lib/game-balance-sync";
import { dispatchGameDeparting } from "@/lib/game-return-events";

export type GameLaunchClientPayload = {
  gameCode: string;
  playerId: string;
  timestamp: string;
  balance: number;
  currencyCode: string;
  language: string;
  platform: number;
  homeUrl: string;
  transfer_id: string;
};

export type GameLaunchApiResponse = {
  success?: boolean;
  message?: string;
  error?: string;
  data?: {
    game_launch_url?: string;
    [key: string]: unknown;
  };
};

export function getGameLaunchPlatform(): number {
  if (typeof navigator === "undefined") return 1;
  const ua = navigator.userAgent || "";
  if (/android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua.toLowerCase())) {
    return 2;
  }
  return 1;
}

export function generateGameTransferId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1e6);
  return `tx_${timestamp}_${random}`;
}

export function buildGamePlayerId(memberId: string): string {
  const id = memberId.trim();
  if (!id) throw new Error("Member id is required to launch a game");
  return id;
}

/** Mongo / session balance only — no localStorage wallet. */
export function resolveGameCreditAmount(session: AuthSession | null): number {
  if (session?.balance) {
    const parsed = parseFloat(session.balance);
    if (!Number.isNaN(parsed) && parsed >= 0) {
      return parseFloat(parsed.toFixed(1));
    }
  }
  return 0;
}

export function buildGameLaunchPayload(
  gameCode: string,
  session: AuthSession | null,
): GameLaunchClientPayload {
  const memberId = session?.memberId ?? "";
  const homeUrl =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : "";

  return {
    gameCode: gameCode.toString(),
    playerId: buildGamePlayerId(memberId),
    timestamp: Date.now().toString(),
    balance: resolveGameCreditAmount(session),
    currencyCode: "BDT",
    language: "en",
    platform: getGameLaunchPlatform(),
    homeUrl,
    transfer_id: generateGameTransferId(),
  };
}

export async function requestGameLaunch(
  gameCode: string,
  session: AuthSession | null,
): Promise<string> {
  const eligibility = await checkGameLaunchEligibility(gameCode);
  if (!eligibility.allowed) {
    throw new Error(
      eligibility.reason ?? "This game is not allowed under your deposit promotion"
    );
  }

  const body = buildGameLaunchPayload(gameCode, session);

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (session?.accessToken) {
    headers.Authorization = `Bearer ${session.accessToken}`;
  }

  const response = await fetch("/api/game-launch", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const data = (await response.json().catch(() => null)) as GameLaunchApiResponse | null;
  if (!response.ok) {
    throw new Error(data?.error ?? data?.message ?? `Launch failed (${response.status})`);
  }

  if (data?.success !== true) {
    throw new Error(data?.error ?? data?.message ?? "Launch failed");
  }

  const launchUrl = data.data?.game_launch_url;
  if (!launchUrl || typeof launchUrl !== "string") {
    throw new Error("Game launch URL missing from response");
  }

  return launchUrl;
}

/**
 * Fetch Mongo balance → launch with that credit → zero Mongo → redirect.
 */
export async function launchGameInBrowser(
  gameCode: string,
  session: AuthSession | null,
): Promise<void> {
  const freshBalance = await refreshWalletBalance();
  const launchSession: AuthSession | null = session
    ? { ...session, balance: freshBalance ?? session.balance }
    : session;

  const credit = resolveGameCreditAmount(launchSession);
  if (!(credit > 0)) {
    throw new Error("Your balance is 0. Please deposit.");
  }

  const launchUrl = await requestGameLaunch(gameCode, launchSession);

  await prepareGameLaunchZero();
  markGameSessionPending();

  if (typeof window !== "undefined") {
    dispatchGameDeparting();
    window.location.assign(launchUrl);
  }
}
