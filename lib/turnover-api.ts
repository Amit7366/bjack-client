import type { ApiResponse } from "@/lib/api/types";
import { readAuthSession } from "@/lib/auth/session";

const API_PREFIX = "/api/v1";

export type TurnoverProgressItem = {
  id: string;
  kind: "deposit" | "signup" | "referral" | "login";
  label: string;
  turnoverRequired: number;
  turnoverCompleted: number;
  remaining: number;
  isCompleted: boolean;
  promoCode?: string;
  eligibleGameTypes?: string[];
  isActive?: boolean;
};

export type TurnoverActiveDeposit = {
  promoCode?: string;
  turnoverRequired: number;
  turnoverCompleted: number;
  remaining: number;
  isCompleted: boolean;
  eligibleGameTypes?: string[];
};

export type TurnoverSummary = {
  totalTurnoverRequired: number;
  totalTurnoverCompleted: number;
  completionPercentage: number;
  actualBetTurnover?: number;
  progress?: {
    items: TurnoverProgressItem[];
    totalRequired: number;
    totalCompleted: number;
    totalRemaining: number;
    completionPercentage: number;
    activeDeposit: TurnoverActiveDeposit | null;
  };
};

export async function fetchTurnoverSummary(): Promise<TurnoverSummary> {
  const session = readAuthSession();
  if (!session?.accessToken) {
    throw new Error("Please log in to continue");
  }

  const res = await fetch(`${API_PREFIX}/transaction/turnover/me`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
    credentials: "include",
    cache: "no-store",
  });

  const body = (await res.json()) as ApiResponse<TurnoverSummary>;
  if (!res.ok || !body.success || !body.data) {
    throw new Error(body.message || "Failed to load turnover");
  }

  return body.data;
}
