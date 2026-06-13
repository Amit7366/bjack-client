import type { ApiResponse } from "@/lib/api/types";
import type { DepositPaymentMethod } from "@/lib/deposit-api";
import { readAuthSession } from "@/lib/auth/session";

const API_PREFIX = "/api/v1";

export type DepositPaymentAccount = {
  _id: string;
  paymentMethod: DepositPaymentMethod;
  channelId: string;
  channelName: string;
  accountNumber: string;
  accountHolderName?: string;
  recommended?: boolean;
  isEnabled: boolean;
  isActive: boolean;
  sortOrder?: number;
};

async function fetchAccounts(path: string, auth = false): Promise<DepositPaymentAccount[]> {
  const session = auth ? readAuthSession() : null;
  const res = await fetch(`${API_PREFIX}${path}`, {
    credentials: "include",
    headers: session?.accessToken
      ? { Authorization: `Bearer ${session.accessToken}` }
      : undefined,
  });
  const body = (await res.json()) as ApiResponse<DepositPaymentAccount[]>;
  if (!res.ok || !body.success) {
    throw new Error(body.message || "Failed to load payment accounts");
  }
  return body.data ?? [];
}

/** Public — active cash-out number per payment method. */
export async function fetchActiveDepositAccounts(): Promise<DepositPaymentAccount[]> {
  return fetchAccounts("/deposit-payment-accounts/active");
}

/** Enabled channels for quick deposit picker (requires member login). */
export async function fetchEnabledDepositAccounts(): Promise<DepositPaymentAccount[]> {
  return fetchAccounts("/deposit-payment-accounts/enabled", true);
}

const METHOD_BADGES: Record<DepositPaymentMethod, string> = {
  bkash: "✈",
  nagad: "🎯",
  rocket: "🚀",
};

export function methodBadge(method: DepositPaymentMethod): string {
  return METHOD_BADGES[method];
}

export function methodDisplayLabel(method: DepositPaymentMethod, isBn: boolean): string {
  if (method === "bkash") return isBn ? "বিকাশ" : "bKash";
  if (method === "nagad") return isBn ? "নগদ" : "Nagad";
  return isBn ? "রকেট" : "Rocket";
}

export function methodQuickId(method: DepositPaymentMethod): string {
  if (method === "nagad") return "NAGAD";
  if (method === "rocket") return "Rocket";
  return "bKash";
}

export function uniqueActiveMethods(accounts: DepositPaymentAccount[]): DepositPaymentMethod[] {
  const seen = new Set<DepositPaymentMethod>();
  const order: DepositPaymentMethod[] = ["bkash", "nagad", "rocket"];
  for (const row of accounts) {
    if (row.isActive && row.isEnabled) seen.add(row.paymentMethod);
  }
  return order.filter((m) => seen.has(m));
}

export function channelsForMethod(
  enabled: DepositPaymentAccount[],
  method: DepositPaymentMethod,
): DepositPaymentAccount[] {
  return enabled.filter((row) => row.paymentMethod === method);
}

export function findActiveAccountForMethod(
  active: DepositPaymentAccount[],
  method: DepositPaymentMethod,
): DepositPaymentAccount | undefined {
  return active.find((row) => row.paymentMethod === method && row.isActive && row.isEnabled);
}
