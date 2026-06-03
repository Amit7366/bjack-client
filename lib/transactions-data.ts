import type { Locale } from "@/lib/locale";

export type TransactionStatus = "processing" | "approved" | "rejected" | "reverted";
export type TransactionPaymentType = "deposit" | "withdrawal" | "adjustment";
export type TransactionDateFilter = "today" | "yesterday" | "last7days";

export type TransactionTimelineStep = {
  id: string;
  label: string;
  at: string;
  active: boolean;
};

export type TransactionRecord = {
  id: string;
  referenceId: string;
  status: TransactionStatus;
  paymentType: TransactionPaymentType;
  method: string;
  paymentMethod?: "bkash" | "nagad" | "rocket";
  amount: number;
  createdAt: string;
  updatedAt?: string;
  providerTrxId?: string;
  walletNumber?: string;
  timeline?: TransactionTimelineStep[];
};

export const TRANSACTION_STATUS_IDS: TransactionStatus[] = [
  "processing",
  "approved",
  "rejected",
  "reverted",
];

export const TRANSACTION_PAYMENT_TYPE_IDS: TransactionPaymentType[] = [
  "deposit",
  "withdrawal",
];

export const TRANSACTION_DATE_FILTER_IDS: TransactionDateFilter[] = [
  "today",
  "yesterday",
  "last7days",
];

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function isTransactionInDateFilter(
  createdAt: string,
  filter: TransactionDateFilter,
  now = new Date(),
): boolean {
  const at = new Date(createdAt);
  const today = startOfDay(now);
  const recordDay = startOfDay(at);

  if (filter === "today") {
    return recordDay.getTime() === today.getTime();
  }
  if (filter === "yesterday") {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return recordDay.getTime() === yesterday.getTime();
  }
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 6);
  return recordDay.getTime() >= weekAgo.getTime() && recordDay.getTime() <= today.getTime();
}

export function formatTransactionDateTime(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function formatTransactionDateOnly(iso: string): string {
  return formatLocalDateOnly(new Date(iso));
}

export function formatLocalDateOnly(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function formatAmount(amount: number, locale: Locale = "en"): string {
  const sign = amount >= 0 ? "+" : "-";
  const abs = Math.abs(amount).toLocaleString(
    locale === "bn" ? "bn-BD" : locale === "hi" ? "hi-IN" : "en-US",
    { minimumFractionDigits: 2, maximumFractionDigits: 2 },
  );
  return `${sign}${abs}`;
}

export function getGatewayTypeLabel(
  paymentType: TransactionPaymentType,
  locale: Locale,
): string {
  if (paymentType === "deposit") {
    if (locale === "bn") return "ডিপোজিট পেমেন্ট গেটওয়ে";
    if (locale === "hi") return "जमा पेमेंट गेटवे";
    return "Deposit payment gateway";
  }
  if (locale === "bn") return "উইথড্রয়াল পেমেন্ট গেটওয়ে";
  if (locale === "hi") return "निकासी पेमेंट गेटवे";
  return "Withdrawal payment gateway";
}

export function getPaymentTypeDetailLabel(
  method: "bkash" | "nagad" | "rocket" | undefined,
  locale: Locale,
): string {
  if (locale === "bn") {
    if (method === "bkash") return "বিকাশ পেমেন্ট";
    if (method === "nagad") return "নগদ পেমেন্ট";
    if (method === "rocket") return "রকেট পেমেন্ট";
    return "পেমেন্ট";
  }
  if (method === "bkash") return "bKash payment";
  if (method === "nagad") return "Nagad payment";
  if (method === "rocket") return "Rocket payment";
  return "Payment";
}
