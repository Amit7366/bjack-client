import type { ApiResponse } from "@/lib/api/types";
import { readAuthSession } from "@/lib/auth/session";

const API_PREFIX = "/api/v1";

export type SpinWheelSegment = {
  index: number;
  amount: number;
};

export type SpinStatus = {
  id: string;
  canSpin: boolean;
  lastSpinAt: string | null;
  nextSpinAt: string | null;
  lastSpinAmount: number;
  remainingMs: number;
  segments: SpinWheelSegment[];
  segmentCount: number;
  maxWin: number;
};

export type SpinPlayResult = {
  id: string;
  winAmount: number;
  segmentIndex: number;
  turnoverRequired: number;
  currentBalance: number;
  lastSpinAt: string;
  nextSpinAt: string;
  lastSpinAmount: number;
  totalSpinWon: number;
};

async function authFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const session = readAuthSession();
  if (!session?.accessToken) {
    throw new Error("Please log in to continue");
  }

  const res = await fetch(`${API_PREFIX}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
      ...(init?.headers ?? {}),
    },
  });

  const body = (await res.json()) as ApiResponse<T>;
  if (!res.ok || !body.success) {
    throw new Error(body.message || "Request failed");
  }
  return body.data as T;
}

export async function fetchSpinStatus(): Promise<SpinStatus> {
  return authFetch<SpinStatus>("/spin/me/status");
}

export async function playSpin(): Promise<SpinPlayResult> {
  return authFetch<SpinPlayResult>("/spin/play", { method: "POST" });
}
