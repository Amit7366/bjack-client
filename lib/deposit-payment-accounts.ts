import type { ApiResponse } from "@/lib/api/types";
import type { DepositPaymentMethod } from "@/lib/deposit-api";
import { API_PREFIX, authFetch } from "@/lib/auth/auth-fetch";

export type DepositPaymentType = "cashout" | "sendMoney";

export type DepositPaymentAccount = {
  _id: string;
  paymentMethod: DepositPaymentMethod;
  paymentType?: DepositPaymentType;
  channelId: string;
  channelName: string;
  accountNumber: string;
  accountHolderName?: string;
  recommended?: boolean;
  isEnabled: boolean;
  isActive: boolean;
  sortOrder?: number;
};

export function resolvePaymentType(value?: string | null): DepositPaymentType {
  return value === "sendMoney" ? "sendMoney" : "cashout";
}

function pickLocale(locale: string, copy: { en: string; bn: string; hi: string }): string {
  if (locale === "bn") return copy.bn;
  if (locale === "hi") return copy.hi;
  return copy.en;
}

export function paymentTypeVerifyLabel(
  type: DepositPaymentType,
  locale: string,
): string {
  if (type === "sendMoney") {
    return pickLocale(locale, {
      en: "Send money to:",
      bn: "সেন্ড মানি করুন:",
      hi: "सेंड मनी करें:",
    });
  }
  return pickLocale(locale, {
    en: "Cash out to:",
    bn: "ক্যাশআউট করুন:",
    hi: "कैश आउट करें:",
  });
}

export function paymentTypeIntroText(type: DepositPaymentType, locale: string): string {
  if (type === "sendMoney") {
    return pickLocale(locale, {
      en: "Please send money to the number below, enter the transaction ID, and submit to complete your deposit request. Thank you.",
      bn: "নিচের নম্বরটিতে দয়াকরে সেন্ড মানি করুন, ট্রাঞ্জেকশন আইডি বসান এবং ডিপোজিট রিকোয়েস্টটি কমপ্লিট করতে সাবমিট করুন। ধন্যবাদ।",
      hi: "कृपया नीचे दिए गए नंबर पर सेंड मनी करें, ट्रांजेक्शन ID डालें और डिपॉज़िट पूरा करने के लिए सबमिट करें। धन्यवाद।",
    });
  }
  return pickLocale(locale, {
    en: "Please cash out to the number below, enter the transaction ID, and submit to complete your deposit request. Thank you.",
    bn: "নিচের নম্বরটিতে দয়াকরে ক্যাশআউট করুন, ট্রাঞ্জেকশন আইডি বসান এবং ডিপোজিট রিকোয়েস্টটি কমপ্লিট করতে সাবমিট করুন। ধন্যবাদ।",
    hi: "कृपया नीचे दिए गए नंबर पर कैश आउट करें, ट्रांजेक्शन ID डालें और डिपॉज़िट पूरा करने के लिए सबमिट करें। धन्यवाद।",
  });
}

export function paymentTypeWarningText(type: DepositPaymentType, locale: string): string {
  if (type === "sendMoney") {
    return pickLocale(locale, {
      en: "Please make sure to send money only from the wallet shown. Using another wallet may fail your deposit and the amount may not be refundable.",
      bn: "অবশ্যই নিশ্চিত করুন, ডিপোজিট করার সময় আপনাকে যদি অন্যকোনও ওয়ালেট থেকে সেন্ড মানি করতে বলা হয়, আপনার ডিপোজিট ফেইল হতে পারে এবং আমরা প্রদত্ত আপনাদের এই টাকা ফেরত দিতে পারব না।",
      hi: "कृपया सुनिश्चित करें कि आप केवल दिखाए गए वॉलेट से सेंड मनी करें। दूसरे वॉलेट का उपयोग करने पर डिपॉज़िट फेल हो सकता है और राशि वापस नहीं मिल सकती।",
    });
  }
  return pickLocale(locale, {
    en: "Please make sure to cash out only from the wallet shown. Using another wallet may fail your deposit and the amount may not be refundable.",
    bn: "অবশ্যই নিশ্চিত করুন, বিকাশ ডিপোজিট করার সময় আপনাকে যদি অন্যকোনও ওয়ালেট থেকে ক্যাশআউট করতে বলা হয়, আপনার ডিপোজিট ফেইল হতে পারে এবং আমরা প্রদত্ত আপনাদের এই টাকা ফেরত দিতে পারব না।",
    hi: "कृपया सुनिश्चित करें कि आप केवल दिखाए गए वॉलेट से कैश आउट करें। दूसरे वॉलेट का उपयोग करने पर डिपॉज़िट फेल हो सकता है और राशि वापस नहीं मिल सकती।",
  });
}

export function paymentTypeAmountHintText(type: DepositPaymentType, locale: string): string {
  if (type === "sendMoney") {
    return pickLocale(locale, {
      en: "Send money for the exact amount you entered in the deposit form. Entering a different amount or an incorrect transaction ID may cause the deposit to fail.",
      bn: "ডিপোজিট ফর্মে আপনি যে পরিমাণ টাকা বসিয়েছেন সেই পরিমাণ টাকা সেন্ড মানি করতে হবে। যদি আপনি ২,১০০.০০ টাকা বসিয়ে থাকেন এবং ভিন্ন এমাউন্টের টাকা সেন্ড মানি করেন, তাহলে আপনার ডিপোজিট এরর হবে না। দয়াকরে সঠিক ভাবে ট্রাঞ্জেকশন আইডি পূরণ করুন, অন্যথায় ডিপোজিটটি সফল হবে না।",
      hi: "डिपॉज़िट फॉर्म में डाली गई सही राशि ही सेंड मनी करें। अलग राशि या गलत ट्रांजेक्शन ID डालने पर डिपॉज़िट फेल हो सकता है।",
    });
  }
  return pickLocale(locale, {
    en: "Cash out the exact amount you entered in the deposit form. Entering a different amount or an incorrect transaction ID may cause the deposit to fail.",
    bn: "ডিপोজিট ফর্মে আপনি যে পরিমাণ টাকা বসিয়েছেন সেই পরিমাণ টাকা ক্যাশআউট করতে হবে। যদি আপনি ২,১০০.০০ টাকা বসিয়ে থাকেন এবং ভিন্ন এমাউন্টের টাকা ক্যাশআউট করেন, তাহলে আপনার ডিপোজিট এরর হবে না। দয়াকরে সঠিক ভাবে ট্রাঞ্জেকশন আইডি পূরণ করুন, অন্যথায় ডিপোজিটটি সফল হবে না।",
    hi: "डिपॉज़िट फॉर्म में डाली गई सही राशि ही कैश आउट करें। अलग राशि या गलत ट्रांजेक्शन ID डालने पर डिपॉज़िट फेल हो सकता है।",
  });
}

async function fetchAccounts(path: string, auth = false): Promise<DepositPaymentAccount[]> {
  if (auth) {
    const res = await authFetch(path);
    const body = (await res.json()) as ApiResponse<DepositPaymentAccount[]>;
    if (!res.ok || !body.success) {
      throw new Error(body.message || "Failed to load payment accounts");
    }
    return body.data ?? [];
  }

  const res = await fetch(`${API_PREFIX}${path}`, { credentials: "include" });
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

/** Live channels for a method (enabled + active). */
export function channelsForMethod(
  accounts: DepositPaymentAccount[],
  method: DepositPaymentMethod,
): DepositPaymentAccount[] {
  return accounts.filter(
    (row) => row.paymentMethod === method && row.isEnabled && row.isActive,
  );
}

export function findActiveAccountForMethod(
  active: DepositPaymentAccount[],
  method: DepositPaymentMethod,
): DepositPaymentAccount | undefined {
  return active.find((row) => row.paymentMethod === method && row.isActive && row.isEnabled);
}

/** Resolve cash-out account for a specific method + channel. */
export function findAccountForMethodChannel(
  accounts: DepositPaymentAccount[],
  method: DepositPaymentMethod,
  channelId: string,
): DepositPaymentAccount | undefined {
  const normalized = channelId.trim().toLowerCase();
  if (!normalized) return undefined;
  return accounts.find(
    (row) =>
      row.paymentMethod === method &&
      row.isEnabled &&
      row.isActive &&
      row.channelId === normalized,
  );
}

/** Prefer recommended live channel, else first live channel. */
export function defaultChannelIdForMethod(
  accounts: DepositPaymentAccount[],
  method: DepositPaymentMethod,
): string {
  const live = channelsForMethod(accounts, method);
  if (live.length === 0) return "";
  const recommended = live.find((row) => row.recommended);
  return (recommended ?? live[0]).channelId;
}
