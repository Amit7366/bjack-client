import { NextResponse } from "next/server";
import { parseJwtPayload } from "@/lib/auth/jwt";

const API_BASE = (process.env.API_URL ?? "http://localhost:8000").replace(/\/$/, "");

type GameLaunchBody = {
  gameCode?: string;
  playerId?: string;
  timestamp?: string;
  balance?: number | string;
  currencyCode?: string;
  language?: string;
  platform?: number | string;
  homeUrl?: string;
  transfer_id?: string;
};

type RemoteLaunchResponse = {
  success?: boolean;
  message?: string;
  error?: string;
  data?: {
    game_launch_url?: string;
    [key: string]: unknown;
  };
  details?: {
    code?: number;
    msg?: string;
    payload?: unknown;
  };
  [key: string]: unknown;
};

function generateTransferId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1e6);
  return `tx_${timestamp}_${random}`;
}

function isTransferOrderExists(data: RemoteLaunchResponse | null): boolean {
  if (!data) return false;
  if (data.details?.code === 10027) return true;
  const msg = `${data.message ?? ""} ${data.details?.msg ?? ""}`;
  return /transfer order already exists/i.test(msg);
}

function remoteErrorMessage(data: RemoteLaunchResponse | null, fallback: string): string {
  return data?.message ?? data?.error ?? data?.details?.msg ?? fallback;
}

async function postGameLaunch(
  url: string,
  payload: Record<string, unknown>,
): Promise<{ ok: boolean; status: number; statusText: string; data: RemoteLaunchResponse | null }> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await response.json().catch(() => null)) as RemoteLaunchResponse | null;
  return { ok: response.ok, status: response.status, statusText: response.statusText, data };
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const claims = parseJwtPayload(token);
    const objectId = claims?.objectId;
    if (!objectId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const statusRes = await fetch(`${API_BASE}/api/v1/normalUsers/${encodeURIComponent(objectId)}`, {
      headers: { Authorization: authHeader },
      cache: "no-store",
    });
    if (!statusRes.ok) {
      return NextResponse.json({ error: "Unable to verify account status" }, { status: 403 });
    }
    const statusBody = (await statusRes.json()) as { data?: { status?: string } };
    if (statusBody.data?.status && statusBody.data.status !== "active") {
      return NextResponse.json(
        { error: "Your account cannot launch games right now." },
        { status: 403 },
      );
    }

    const launchUrl = process.env.GAME_LAUNCH_URL;
    const apiSecret = process.env.GAME_API_SECRET;
    const prefix = process.env.GAME_API_PREFIX;

    if (!launchUrl) {
      return NextResponse.json(
        { error: "GAME_LAUNCH_URL is not configured" },
        { status: 500 },
      );
    }

    if (!apiSecret) {
      return NextResponse.json(
        { error: "GAME_API_SECRET is not configured" },
        { status: 500 },
      );
    }

    if (!prefix) {
      return NextResponse.json(
        { error: "GAME_API_PREFIX is not configured" },
        { status: 500 },
      );
    }

    const body = (await request.json()) as GameLaunchBody;

    if (!body.gameCode?.toString().trim()) {
      return NextResponse.json({ error: "gameCode is required" }, { status: 400 });
    }

    if (!body.playerId?.trim()) {
      return NextResponse.json({ error: "playerId is required" }, { status: 400 });
    }

    const payload: Record<string, unknown> = {
      apiSecret,
      prefix,
      gameCode: body.gameCode.toString(),
      playerId: body.playerId.trim(),
      timestamp: body.timestamp ?? Date.now().toString(),
      balance: Number(body.balance ?? 0),
      currencyCode: body.currencyCode ?? "BDT",
      language: body.language ?? "en",
      platform: String(body.platform ?? 1),
      homeUrl: body.homeUrl ?? "",
      transfer_id: body.transfer_id ?? generateTransferId(),
    };

    let result = await postGameLaunch(launchUrl, payload);

    if (isTransferOrderExists(result.data)) {
      payload.transfer_id = generateTransferId();
      result = await postGameLaunch(launchUrl, payload);
    }

    if (!result.ok || result.data?.success === false) {
      return NextResponse.json(
        {
          error: remoteErrorMessage(
            result.data,
            `Remote server error: ${result.statusText}`,
          ),
          status: result.status,
        },
        { status: result.status || 502 },
      );
    }

    return NextResponse.json(result.data, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong while launching the game";
    console.error("Game launch proxy error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
