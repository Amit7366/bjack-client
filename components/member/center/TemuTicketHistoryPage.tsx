"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { useToast } from "@/components/ToastProvider";
import { getTemuTicketHistoryMessages, getTemuTicketMessages } from "@/lib/i18n/temu-ticket-messages";
import { memberTemuTicketHref } from "@/lib/member-routes";
import { TEMU_TICKET_HISTORY_BOX_GIF_URL } from "@/lib/temu-ticket-assets";
import {
  fetchTemuTicketHistory,
  type TemuTicketHistory,
  type TemuTicketHistoryItem,
} from "@/lib/temu-ticket-api";
import { AUTH_CHANGE_EVENT } from "@/lib/auth/session";
import { HeaderBackIcon } from "./MemberCenterIcons";

function formatMoney(value: number, locale: string): string {
  try {
    return new Intl.NumberFormat(locale === "bn" ? "bn-BD" : locale === "hi" ? "hi-IN" : "en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return value.toFixed(2);
  }
}

function HistoryRow({ label, value, valueClassName }: { label: string; value: string; valueClassName?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="shrink-0 text-[14px] text-[#6b7280]">{label}</span>
      <span className={`text-right text-[14px] font-medium text-[#1f2937] ${valueClassName ?? ""}`}>{value}</span>
    </div>
  );
}

function HistoryCard({ item, labels }: { item: TemuTicketHistoryItem; labels: ReturnType<typeof getTemuTicketHistoryMessages> }) {
  const addedDisplay = item.addedAmount >= 0 ? `+${item.addedAmount}` : String(item.addedAmount);

  return (
    <div className="border-b border-dashed border-[#e5e7eb] px-4 py-3 last:border-b-0">
      <HistoryRow label={labels.date} value={item.date} />
      <HistoryRow label={labels.ticketName} value={item.ticketName} />
      <HistoryRow label={labels.condition} value={item.condition} />
      <HistoryRow
        label={labels.addedAmount}
        value={addedDisplay}
        valueClassName="font-semibold text-[#f97316]"
      />
    </div>
  );
}

export default function TemuTicketHistoryPage() {
  const { preferences } = useLocale();
  const { showToast } = useToast();
  const locale = preferences.locale;
  const labels = getTemuTicketHistoryMessages(locale);
  const gameLabels = getTemuTicketMessages(locale);

  const [history, setHistory] = useState<TemuTicketHistory | null>(null);
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(() => {
    setLoading(true);
    void fetchTemuTicketHistory()
      .then(setHistory)
      .catch(() => {
        showToast(labels.loadError, { variant: "error" });
        setHistory({ totalClaimed: 0, items: [] });
      })
      .finally(() => setLoading(false));
  }, [labels.loadError, showToast]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    const onAuthChange = () => loadHistory();
    window.addEventListener(AUTH_CHANGE_EVENT, onAuthChange);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, onAuthChange);
  }, [loadHistory]);

  const totalClaimedDisplay = `৳ ${loading ? "0.00" : formatMoney(history?.totalClaimed ?? 0, locale)}`;

  return (
    <div className="min-h-full bg-[#fff8ef]">
      <div className="mx-auto w-full max-w-lg">
        <header className="sticky top-0 z-30 bg-[#1c1c1c]">
          <div className="relative flex min-h-[52px] items-center justify-center px-3">
            <Link
              href={memberTemuTicketHref(locale)}
              aria-label={gameLabels.pageTitle}
              className="focus-ring absolute left-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-white transition-colors hover:bg-white/10"
            >
              <HeaderBackIcon />
            </Link>
            <h1 className="text-[18px] font-bold text-white">{labels.pageTitle}</h1>
          </div>
        </header>

        <div className="relative overflow-hidden bg-gradient-to-b from-[#ff9a2e] via-[#ffb347] to-[#ffd08a] px-4 pb-10 pt-2">
          <div className="relative mx-auto flex w-full max-w-[320px] justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={TEMU_TICKET_HISTORY_BOX_GIF_URL}
              alt=""
              className="h-auto w-full max-w-[280px] object-contain"
            />
          </div>

          <div className="absolute inset-x-4 bottom-3 mx-auto max-w-lg">
            <div className="rounded-xl border border-white/30 bg-gradient-to-r from-[#ff8c2a]/90 to-[#ff6b1a]/90 px-4 py-3 text-center shadow-[0_4px_16px_rgba(255,120,30,0.35)] backdrop-blur-sm">
              <p className="text-[13px] font-medium text-white/90">{labels.totalClaimedAmount}</p>
              <p className="mt-1 text-[22px] font-extrabold tabular-nums text-white">{totalClaimedDisplay}</p>
            </div>
          </div>
        </div>

        <div className="px-4 pb-8 pt-4">
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            {loading ? (
              <div className="px-4 py-8 text-center text-[14px] text-[#9ca3af]">…</div>
            ) : history?.items.length ? (
              history.items.map((item) => <HistoryCard key={item.id} item={item} labels={labels} />)
            ) : (
              <p className="px-4 py-8 text-center text-[14px] text-[#9ca3af]">{labels.emptyHistory}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
