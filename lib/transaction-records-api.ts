import { authFetchData } from "@/lib/auth/auth-fetch";
import type { TransactionDateFilter, TransactionPaymentType, TransactionStatus } from "@/lib/transactions-data";

export type ApiTransaction = {
  _id: string;
  userId: string;
  id: string;
  paymentMethod: "bkash" | "nagad" | "rocket";
  transactionType: "deposit" | "withdraw";
  amount: number;
  status: "pending" | "success" | "failed";
  transactionId: string;
  invoiceId?: string;
  walletNumber?: string;
  agentNumber?: string;
  promoCode?: string;
  bonusAmount?: number;
  createdAt: string;
  updatedAt?: string;
};

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function getDateRangeForFilter(
  filter: TransactionDateFilter,
  now = new Date(),
): { from: string; to: string } {
  const today = startOfDay(now);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  if (filter === "today") {
    return { from: today.toISOString(), to: end.toISOString() };
  }
  if (filter === "yesterday") {
    const y = new Date(today);
    y.setDate(y.getDate() - 1);
    const yEnd = new Date(y);
    yEnd.setHours(23, 59, 59, 999);
    return { from: y.toISOString(), to: yEnd.toISOString() };
  }
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - 6);
  return { from: weekStart.toISOString(), to: end.toISOString() };
}

export function uiStatusesToApiParam(statuses: Set<TransactionStatus>): string | undefined {
  if (statuses.size === 0) return undefined;
  const map: Record<TransactionStatus, string> = {
    processing: "pending",
    approved: "success",
    rejected: "failed",
    reverted: "failed",
  };
  return [...statuses].map((s) => map[s]).join(",");
}

export function uiTypesToApiParam(types: Set<TransactionPaymentType>): string | undefined {
  if (types.size === 0) return undefined;
  const parts = [...types].map((t) => {
    if (t === "withdrawal") return "withdraw";
    if (t === "deposit") return "deposit";
    return "";
  });
  const filtered = parts.filter(Boolean);
  return filtered.length ? filtered.join(",") : undefined;
}

export type FetchUserTransactionsParams = {
  from: string;
  to: string;
  status?: string;
  transactionType?: string;
};

export async function fetchUserTransactions(
  params: FetchUserTransactionsParams,
): Promise<ApiTransaction[]> {
  const q = new URLSearchParams({
    from: params.from,
    to: params.to,
  });
  if (params.status) q.set("status", params.status);
  if (params.transactionType) q.set("transactionType", params.transactionType);

  return authFetchData<ApiTransaction[]>(`/transaction/me?${q.toString()}`);
}
