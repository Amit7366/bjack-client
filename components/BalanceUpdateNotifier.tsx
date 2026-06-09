"use client";

import { useEffect } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { useToast } from "@/components/ToastProvider";
import {
  BALANCE_PREVIEW_APPLIED_EVENT,
  type BalancePreviewAppliedDetail,
} from "@/lib/game-return-events";

function formatAmount(value: number, locale: string): string {
  try {
    return new Intl.NumberFormat(
      locale === "bn" ? "bn-BD" : locale === "hi" ? "hi-IN" : "en-US",
      { minimumFractionDigits: 2, maximumFractionDigits: 2 },
    ).format(value);
  } catch {
    return value.toFixed(2);
  }
}

/**
 * Shows a toast when game balance preview completes after a noticeable delay
 * (e.g. user tapped Play before PHP preview finished).
 */
export default function BalanceUpdateNotifier() {
  const { showToast } = useToast();
  const { preferences } = useLocale();
  const locale = preferences.locale;

  useEffect(() => {
    const onApplied = (event: Event) => {
      const detail = (event as CustomEvent<BalancePreviewAppliedDetail>).detail;
      if (!detail?.showNotification) return;

      const formatted = formatAmount(detail.balance, locale);
      const message =
        locale === "bn"
          ? `ব্যালেন্স আপডেট হয়েছে: ৳${formatted}`
          : locale === "hi"
            ? `बैलेंस अपडेट: ₹${formatted}`
            : `Balance updated: ৳${formatted}`;

      showToast(message, { variant: "success" });
    };

    window.addEventListener(BALANCE_PREVIEW_APPLIED_EVENT, onApplied);
    return () => {
      window.removeEventListener(BALANCE_PREVIEW_APPLIED_EVENT, onApplied);
    };
  }, [locale, showToast]);

  return null;
}
