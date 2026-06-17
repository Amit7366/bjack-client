"use client";

import { useCallback, useEffect, useState } from "react";
import type { RebateClaimRecord, RebateMessages } from "@/lib/i18n/rebate-messages";
import { categoryLabel } from "@/lib/i18n/rebate-messages";
import { fetchRebateHistory } from "@/lib/rebate-api";
import RebateDateRangeSheet from "./RebateDateRangeSheet";
import RebateHistoryDetailSheet from "./RebateHistoryDetailSheet";
import {
  formatHistoryCardDate,
  formatRangeLabel,
  formatRebateAmount,
  todayKey,
} from "./rebate-ui";

type RebateHistoryTabProps = {
  labels: RebateMessages;
  locale: string;
};

function CategoryIcon({ category }: { category: RebateClaimRecord["primaryCategory"] }) {
  const color =
    category === "slot"
      ? "#26a69a"
      : category === "live"
        ? "#9b7bd4"
        : category === "sports"
          ? "#4db6ac"
          : category === "poker"
            ? "#f06292"
            : "#e57373";

  return (
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
      style={{ backgroundColor: color }}
    >
      {category.slice(0, 1).toUpperCase()}
    </span>
  );
}

export default function RebateHistoryTab({ labels, locale }: RebateHistoryTabProps) {
  const today = todayKey();
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [isToday, setIsToday] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<RebateClaimRecord | null>(null);
  const [items, setItems] = useState<RebateClaimRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRebateHistory({ from, to, page: 1 });
      setItems(data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : labels.loadError);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [from, to, labels.loadError]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const applyToday = () => {
    const key = todayKey();
    setIsToday(true);
    setFrom(key);
    setTo(key);
  };

  return (
    <>
      <div className="px-3 py-3 sm:px-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={applyToday}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium ${
              isToday
                ? "bg-[#2196F3] text-white"
                : "border border-[#d1d5db] bg-white text-[#374151]"
            }`}
          >
            {isToday ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path
                  d="M3 7.5l2.5 2.5L11 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : null}
            {labels.today}
          </button>

          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-[#2196F3] bg-white px-3 py-1.5 text-[13px] font-medium text-[#2196F3]"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <rect x="2" y="3" width="10" height="9" rx="1" stroke="currentColor" strokeWidth="1.2" />
              <path d="M2 6h10M5 1v2M9 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            {formatRangeLabel(from, to)}
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-3 px-3 pb-mobile-nav sm:px-4 lg:pb-6">
        {loading ? (
          <p className="py-8 text-center text-[14px] text-[#6b7280]">{labels.loading}</p>
        ) : error ? (
          <p className="py-8 text-center text-[14px] text-[#dc2626]">{error}</p>
        ) : items.length === 0 ? (
          <p className="py-8 text-center text-[14px] text-[#6b7280]">{labels.noHistory}</p>
        ) : (
          items.map((item) => (
            <article
              key={item.id}
              className="rounded-lg border border-[#e5e7eb] bg-white px-4 py-3 shadow-sm"
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CategoryIcon category={item.primaryCategory} />
                  <span className="text-[14px] font-medium text-[#111]">
                    {categoryLabel(labels, item.primaryCategory)}
                  </span>
                </div>
                <span className="text-[12px] text-[#9ca3af]">
                  {formatHistoryCardDate(item.createdAt)}
                </span>
              </div>

              <p className="mb-3 text-[12px] text-[#6b7280]">{labels.orderNo(item.orderNo)}</p>

              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-[11px] text-[#9ca3af]">{labels.transactionAmount}</p>
                  <p className="text-[22px] font-bold leading-tight text-[#16a34a]">
                    {formatRebateAmount(item.amount, locale)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(item);
                    setDetailOpen(true);
                  }}
                  className="rounded-full bg-[#2196F3] px-4 py-1.5 text-[13px] font-semibold text-white"
                >
                  {labels.view}
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      <RebateDateRangeSheet
        open={sheetOpen}
        from={from}
        to={to}
        labels={labels}
        locale={locale}
        onClose={() => setSheetOpen(false)}
        onConfirm={(nextFrom, nextTo) => {
          setFrom(nextFrom);
          setTo(nextTo);
          setIsToday(nextFrom === todayKey() && nextTo === todayKey());
        }}
      />

      <RebateHistoryDetailSheet
        open={detailOpen}
        record={selected}
        labels={labels}
        locale={locale}
        onClose={() => setDetailOpen(false)}
      />
    </>
  );
}
