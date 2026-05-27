import type { AuthSession } from "@/lib/auth/session";

/** bm24api-20251210 — public launch settings (secrets stay server-side / PHP). */
export const GAME_LAUNCH_PLAYER_PREFIX =
  process.env.NEXT_PUBLIC_GAME_PLAYER_PREFIX ?? "h037ad";

export const GAME_LAUNCH_MEMBER_SUFFIX = "sbm24";

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

export function buildGameMemberAccount(memberId: string): string {
  const id = memberId.trim();
  if (!id) throw new Error("Member id is required to launch a game");
  return `${GAME_LAUNCH_PLAYER_PREFIX}_${id}_${GAME_LAUNCH_MEMBER_SUFFIX}`;
}

export function resolveGameCreditAmount(session: AuthSession | null): number {
  if (session?.balance) {
    const parsed = parseFloat(session.balance);
    if (!Number.isNaN(parsed) && parsed >= 0) {
      return parseFloat(parsed.toFixed(1));
    }
  }
  return parseFloat((100).toFixed(1));
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
    member_account: buildGameMemberAccount(memberId),
    timestamp: Date.now().toString(),
    credit_amount: "100".toString(),
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
  const body = buildGameLaunchPayload(gameCode, session);

  const response = await fetch("/api/game-launch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = (await response.json().catch(() => null)) as GameLaunchApiResponse | null;

  if (!response.ok) {
    throw new Error(data?.error ?? data?.msg ?? `Launch failed (${response.status})`);
  }

  if (data?.code !== 0) {
    throw new Error(data?.msg ?? "Game launch API error");
  }

  const launchUrl = data.payload?.game_launch_url;
  if (!launchUrl || typeof launchUrl !== "string") {
    throw new Error("Game launch URL missing from response");
  }

  return launchUrl;
}

export async function launchGameInBrowser(
  gameCode: string,
  session: AuthSession | null,
): Promise<void> {
  const launchUrl = await requestGameLaunch(gameCode, session);
  if (typeof window !== "undefined") {
    localStorage.setItem("needsBalanceRefresh", "1");
    window.location.href = launchUrl;
  }
}
