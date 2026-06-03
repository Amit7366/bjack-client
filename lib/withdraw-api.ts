import type { ApiResponse } from "@/lib/api/types";
import { readAuthSession } from "@/lib/auth/session";

const API_PREFIX = "/api/v1";

export type WithdrawPaymentMethod = "bkash" | "nagad" | "rocket";

export type ManualWithdrawRecord = {
  _id: string;
  amount: number;
  status: string;
  paymentMethod: string;
  walletNumber?: string;
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
    throw new Error(body.message || "Withdraw request failed");
  }
  return body.data as T;
}

/** Map saved wallet name (bKash, NAGAD, …) → API paymentMethod enum. */
export function mapWalletNameToPaymentMethod(name: string): WithdrawPaymentMethod {
  const n = name.trim().toLowerCase();
  if (n.includes("nagad")) return "nagad";
  if (n.includes("rocket")) return "rocket";
  return "bkash";
}

export async function createManualWithdraw(input: {
  amount: number;
  paymentMethod: WithdrawPaymentMethod;
  walletNumber: string;
  accountHolderName?: string;
}): Promise<ManualWithdrawRecord> {
  const session = readAuthSession();
  if (!session?.objectId || !session.memberId) {
    throw new Error("Please log in to continue");
  }

  const payload = {
    userId: session.objectId,
    id: session.memberId,
    amount: input.amount,
    paymentMethod: input.paymentMethod,
    transactionId: "sbm",
    walletNumber: input.walletNumber.trim(),
    accountHolderName: input.accountHolderName?.trim() || session.userName || "Member",
    bonusAmount: 0,
  };

  return authFetch<ManualWithdrawRecord>("/transaction/withdraw/manual", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
