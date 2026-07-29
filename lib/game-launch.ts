import type { AuthSession } from "@/lib/auth/session";
import { refreshWalletBalance } from "@/lib/auth/api";
import { checkGameLaunchEligibility } from "@/lib/game-eligibility-api";
import {
  markGameSessionPending,
  prepareGameLaunchZero,
} from "@/lib/game-balance-sync";
import { dispatchGameDeparting } from "@/lib/game-return-events";

/** bm24api-20251210 — public launch settings (secrets stay server-side / PHP). */
export const GAME_LAUNCH_PLAYER_PREFIX =
  process.env.NEXT_PUBLIC_GAME_PLAYER_PREFIX ?? "h94044";

export const GAME_LAUNCH_MEMBER_SUFFIX = "b";

export type GameLaunchClientPayload = {
  game_uid: string;
  member_account: string;
  timestamp: string;
  credit_amount: string;
  currency_code: string;
  language: string;
  platform: number;
  home_url: string;
  transfer_id: string;
};

export type GameLaunchApiResponse = {
  code: number;
  msg?: string;
  payload?: {
    game_launch_url?: string;
    [key: string]: unknown;
  };
  error?: string;
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

export function buildGameMemberAccount(memberId: string, gameCode?: string): string {
  const id = memberId.trim();
  if (!id) throw new Error("Member id is required to launch a game");
  const plainMemberAccountGameCodes = new Set([
    "c4b2813f6bbc5abf502ddfb857e604eb",
    "341827d4370bb198b18364e2d75e6916",
    "07baf9e1388d32cd4cee0c0c91b23020",
    "171ffc7c5df076a4a4aedf892cd43212",
  ]);
  if (gameCode && plainMemberAccountGameCodes.has(gameCode)) {
    return `${GAME_LAUNCH_PLAYER_PREFIX}${id}`;
  }
  return `${GAME_LAUNCH_PLAYER_PREFIX}_${id}_${GAME_LAUNCH_MEMBER_SUFFIX}`;
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
    game_uid: gameCode.toString(),
    member_account: buildGameMemberAccount(memberId, gameCode),
    timestamp: Date.now().toString(),
    credit_amount: resolveGameCreditAmount(session).toString(),
    currency_code: "BDT",
    language: "en",
    platform: getGameLaunchPlatform(),
    home_url: homeUrl,
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
    throw new Error(data?.error ?? data?.msg ?? `Launch failed (${response.status})`);
  }

  if (data?.code !== 0) {
    throw new Error("Server is Updating. Please try again later.");
  }

  const launchUrl = data.payload?.game_launch_url;
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
    // window.location.assign(launchUrl);
  }
}
