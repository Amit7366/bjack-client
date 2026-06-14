import { authFetchData } from "@/lib/auth/auth-fetch";

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
  return authFetchData<TurnoverSummary>("/transaction/turnover/me", {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
}
