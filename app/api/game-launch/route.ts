import { NextResponse } from "next/server";

type GameLaunchBody = {
  game_uid?: string;
  member_account?: string;
  timestamp?: string;
  credit_amount?: string;
  currency_code?: string;
  language?: string;
  platform?: number | string;
  home_url?: string;
  transfer_id?: string;
};

type RemoteLaunchResponse = {
  code?: number;
  msg?: string;
  payload?: {
    game_launch_url?: string;
    [key: string]: unknown;
  };
  error?: string;
  [key: string]: unknown;
};

export async function POST(request: Request) {
  try {
    const proxyUrl = process.env.GAME_LAUNCH_PROXY_URL;
    const agencyUid = process.env.GAME_AGENCY_UID;

    if (!proxyUrl) {
      return NextResponse.json(
        { error: "GAME_LAUNCH_PROXY_URL is not configured" },
        { status: 500 },
      );
    }

    if (!agencyUid) {
      return NextResponse.json(
        { error: "GAME_AGENCY_UID is not configured" },
        { status: 500 },
      );
    }

    const body = (await request.json()) as GameLaunchBody;

    if (!body.game_uid?.trim()) {
      return NextResponse.json({ error: "game_uid is required" }, { status: 400 });
    }

    if (!body.member_account?.trim()) {
      return NextResponse.json({ error: "member_account is required" }, { status: 400 });
    }

    const payload = {
      agency_uid: agencyUid,
      game_uid: body.game_uid.toString(),
      member_account: body.member_account,
      timestamp: body.timestamp ?? Date.now().toString(),
      credit_amount: body.credit_amount ?? "100.0",
      currency_code: body.currency_code ?? "BDT",
      language: body.language ?? "en",
      platform: body.platform ?? 1,
      home_url: body.home_url ?? "",
      transfer_id: body.transfer_id ?? `tx_${Date.now()}`,
    };

    const response = await fetch(proxyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await response.json().catch(() => null)) as RemoteLaunchResponse | null;

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            data?.error ??
            data?.msg ??
            `Remote server error: ${response.statusText}`,
          status: response.status,
        },
        { status: response.status },
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong while launching the game";
    console.error("Game launch proxy error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
