import type { Locale } from "@/lib/locale";
import {
  formatLocalDateOnly,
  formatTransactionDateTime,
} from "./transactions-data";

export type BettingTab = "settled" | "unsettled";

export type BettingResult = "won" | "lost" | "void";

export type BettingRecord = {
  id: string;
  betId: string;
  gameName: string;
  category: string;
  stake: number;
  payout: number;
  result: BettingResult;
  settledAt: string;
  status?: "pending" | "completed" | "failed";
  type?: "win" | "lose" | "refund";
};

export function formatBettingDateTime(iso: string): string {
  return formatTransactionDateTime(iso);
}

export function formatBettingDateOnly(iso: string): string {
  return formatLocalDateOnly(new Date(iso));
}

export function formatBetAmount(amount: number, locale: Locale = "en"): string {
  const sign = amount >= 0 ? "+" : "-";
  const abs = Math.abs(amount).toLocaleString(
    locale === "bn" ? "bn-BD" : locale === "hi" ? "hi-IN" : "en-US",
    { minimumFractionDigits: 2, maximumFractionDigits: 2 },
  );
  return `${sign}${abs}`;
}
