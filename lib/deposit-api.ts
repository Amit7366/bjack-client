import type { ApiResponse } from "@/lib/api/types";
import { readAuthSession, saveAuthSession } from "@/lib/auth/session";
import { reanchorWalletFromDb } from "@/lib/wallet-local-state";

const API_PREFIX = "/api/v1";

type ManualDepositPayload = {
  userId: string;
  id: string;
  amount: number;
  paymentMethod: "bkash" | "nagad" | "rocket";
  transactionType: "deposit";
  status: "pending";
  transactionId: string;
  agentNumber: string;
  walletNumber: string;
  proofImage?: string;
  promoCode?: string;
  bonusAmount?: number;
};

export type ManualDepositRecord = {
  _id: string;
  amount: number;
  status: string;
  transactionId: string;
};

export type VerifyAutoPayResult = {
  matched: boolean;
  status: "pending" | "success" | "failed";
  currentBalance?: number;
  transaction?: ManualDepositRecord;
};

async function authFetch<T>(path: string, init?: RequestInit) {
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

export type DepositPaymentMethod = "bkash" | "nagad" | "rocket";

/** URL `method` param (bKash | NAGAD | Rocket) → API enum. */
export function mapQuickDepositMethod(method: string): DepositPaymentMethod {
  const id = method.trim().toLowerCase();
  if (id === "nagad") return "nagad";
  if (id === "rocket") return "rocket";
  return "bkash";
}

/** API enum → URL param spelling (matches autopay_sms sender). */
export function depositMethodToUrlParam(method: DepositPaymentMethod): string {
  if (method === "nagad") return "NAGAD";
  if (method === "rocket") return "Rocket";
  return "bKash";
}

export function isSupportedQuickDepositMethod(method: string): boolean {
  const key = method.trim().toLowerCase();
  return key === "bkash" || key === "nagad" || key === "rocket";
}

/** POST /transaction/deposit/manual — pending deposit before SMS match. */
export async function createManualDeposit(input: {
  amount: number;
  transactionId: string;
  paymentMethod: "bkash" | "nagad" | "rocket";
  promoCode?: string;
}): Promise<ManualDepositRecord> {
  const session = readAuthSession();
  if (!session?.objectId || !session.memberId) {
    throw new Error("Please log in to continue");
  }

  const payload: ManualDepositPayload = {
    userId: session.objectId,
    id: session.memberId,
    amount: input.amount,
    paymentMethod: input.paymentMethod,
    transactionType: "deposit",
    status: "pending",
    transactionId: input.transactionId.trim().toUpperCase(),
    agentNumber: "01635063453",
    walletNumber: "00000000000",
    proofImage: "quick-deposit",
    promoCode: input.promoCode?.trim() || "NO_PROMO",
    bonusAmount: 0,
  };

  return authFetch<ManualDepositRecord>("/transaction/deposit/manual", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** POST /transaction/deposit/verify-autopay — poll until SMS match credits balance. */
export async function verifyAutoPayDeposit(input: {
  depositTransactionId: string;
  amount: number;
  transactionId: string;
  paymentMethod: DepositPaymentMethod;
}): Promise<VerifyAutoPayResult> {
  return authFetch<VerifyAutoPayResult>("/transaction/deposit/verify-autopay", {
    method: "POST",
    body: JSON.stringify({
      depositTransactionId: input.depositTransactionId,
      amount: input.amount,
      transactionId: input.transactionId.trim().toUpperCase(),
      paymentMethod: input.paymentMethod,
    }),
  });
}

/** POST /transaction/deposit/fail-autopay — when verify window expires. */
export async function failAutoPayDeposit(depositTransactionId: string): Promise<void> {
  await authFetch<unknown>("/transaction/deposit/fail-autopay", {
    method: "POST",
    body: JSON.stringify({ depositTransactionId }),
  });
}

export function syncSessionBalance(currentBalance?: number) {
  const session = readAuthSession();
  if (!session?.memberId) return;
  void reanchorWalletFromDb(session.memberId).catch(() => {
    if (currentBalance == null) return;
    saveAuthSession({
      ...session,
      balance: Number(currentBalance).toFixed(2),
    });
  });
}
