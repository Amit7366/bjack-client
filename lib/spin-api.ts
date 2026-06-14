import { authFetchData } from "@/lib/auth/auth-fetch";

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

export async function fetchSpinStatus(): Promise<SpinStatus> {
  return authFetchData<SpinStatus>("/spin/me/status");
}

export async function playSpin(): Promise<SpinPlayResult> {
  return authFetchData<SpinPlayResult>("/spin/play", { method: "POST" });
}
