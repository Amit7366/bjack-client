import type { ApiTransaction } from "@/lib/transaction-records-api";
import type { Locale } from "@/lib/locale";
import type {
  TransactionPaymentType,
  TransactionRecord,
  TransactionStatus,
  TransactionTimelineStep,
} from "@/lib/transactions-data";

const METHOD_LABELS: Record<
  ApiTransaction["paymentMethod"],
  { en: string; bn: string; hi: string }
> = {
  bkash: {
    en: "bKash (E-wallet)",
    bn: "বিকাশ (ই-ওয়ালেট)",
    hi: "bKash (E-wallet)",
  },
  nagad: {
    en: "Nagad (E-wallet)",
    bn: "নগদ (ই-ওয়ালেট)",
    hi: "Nagad (E-wallet)",
  },
  rocket: {
    en: "Rocket (E-wallet)",
    bn: "রকেট (ই-ওয়ালেট)",
    hi: "Rocket (E-wallet)",
  },
};

export function mapApiStatus(status: ApiTransaction["status"]): TransactionStatus {
  switch (status) {
    case "pending":
      return "processing";
    case "success":
      return "approved";
    case "failed":
    default:
      return "rejected";
  }
}

export function mapApiPaymentType(type: ApiTransaction["transactionType"]): TransactionPaymentType {
  return type === "withdraw" ? "withdrawal" : "deposit";
}

function formatReferenceId(tx: ApiTransaction): string {
  if (tx.invoiceId) {
    const compact = tx.invoiceId.replace(/-/g, "").slice(0, 11).toUpperCase();
    const prefix = tx.transactionType === "deposit" ? "D" : "W";
    return `${prefix}${compact}`;
  }
  const prefix = tx.transactionType === "deposit" ? "D" : "W";
  return `${prefix}${String(tx._id).slice(-11).toUpperCase()}`;
}

function displayAmount(tx: ApiTransaction): number {
  const n = Number(tx.amount) || 0;
  return tx.transactionType === "withdraw" ? -Math.abs(n) : Math.abs(n);
}

function buildTimeline(tx: ApiTransaction, locale: Locale): TransactionTimelineStep[] {
  const created = tx.createdAt;
  const updated = tx.updatedAt ?? tx.createdAt;
  const isDeposit = tx.transactionType === "deposit";
  const isBn = locale === "bn";
  const isHi = locale === "hi";

  const startLabel = isDeposit
    ? isBn
      ? "ডিপোজিট গ্রহণ শুরু হয়েছে"
      : isHi
        ? "जमा स्वीकार शुरू"
        : "Deposit acceptance started"
    : isBn
      ? "উইথড্রয়াল গ্রহণ শুরু হয়েছে"
      : isHi
        ? "निकासी स्वीकार शुरू"
        : "Withdrawal acceptance started";

  const receivedLabel = isDeposit
    ? isBn
      ? "ডিপোজিট তথ্য গ্রহণ করা হয়েছে"
      : isHi
        ? "जमा जानकारी प्राप्त"
        : "Deposit information received"
    : isBn
      ? "উইথড্রয়াল তথ্য গ্রহণ করা হয়েছে"
      : isHi
        ? "निकासी जानकारी प्राप्त"
        : "Withdrawal information received";

  let finalLabel: string;
  if (tx.status === "success") {
    finalLabel = isDeposit
      ? isBn
        ? "আপনার ডিপোজিট সফল হয়েছে"
        : isHi
          ? "आपकी जमा सफल"
          : "Your deposit was successful"
      : isBn
        ? "আপনার উইথড্রয়াল সফল হয়েছে"
        : isHi
          ? "आपकी निकासी सफल"
          : "Your withdrawal was successful";
  } else if (tx.status === "failed") {
    finalLabel = isDeposit
      ? isBn
        ? "আপনার ডিপোজিটটি ফেইল হয়েছে"
        : isHi
          ? "आपकी जमा विफल"
          : "Your deposit has failed"
      : isBn
        ? "আপনার উইথড্রয়ালটি ফেইল হয়েছে"
        : isHi
          ? "आपकी निकासी विफल"
          : "Your withdrawal has failed";
  } else {
    finalLabel = isBn
      ? "প্রসেসিং চলছে"
      : isHi
        ? "प्रसंस्करण जारी"
        : "Processing in progress";
  }

  return [
    { id: "final", label: finalLabel, at: updated, active: true },
    { id: "received", label: receivedLabel, at: created, active: false },
    { id: "start", label: startLabel, at: created, active: false },
  ];
}

export function mapApiTransactionToRecord(tx: ApiTransaction, locale: Locale): TransactionRecord {
  const methodLabels = METHOD_LABELS[tx.paymentMethod];
  const method =
    locale === "bn" ? methodLabels.bn : locale === "hi" ? methodLabels.hi : methodLabels.en;

  return {
    id: tx._id,
    referenceId: formatReferenceId(tx),
    status: mapApiStatus(tx.status),
    paymentType: mapApiPaymentType(tx.transactionType),
    method,
    paymentMethod: tx.paymentMethod,
    amount: displayAmount(tx),
    createdAt: tx.createdAt,
    updatedAt: tx.updatedAt,
    providerTrxId: tx.transactionId,
    walletNumber: tx.walletNumber ?? "",
    timeline: buildTimeline(tx, locale),
  };
}

export function getPaymentMethodShortLabel(
  method: ApiTransaction["paymentMethod"],
  locale: Locale,
): string {
  if (locale === "bn") {
    if (method === "bkash") return "বিকাশ";
    if (method === "nagad") return "নগদ";
    return "রকেট";
  }
  if (method === "bkash") return "bKash";
  if (method === "nagad") return "Nagad";
  return "Rocket";
}
