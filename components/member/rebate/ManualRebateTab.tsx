"use client";

import type { ManualRebateData } from "@/lib/i18n/rebate-messages";
import type { RebateMessages } from "@/lib/i18n/rebate-messages";
import {
  formatRebateAmount,
  formatRebateDateLabel,
  REBATE_ROW_STYLES,
  type RebateRowId,
} from "./rebate-ui";

type ManualRebateTabProps = {
  data: ManualRebateData | null;
  loading: boolean;
  claiming: boolean;
  labels: RebateMessages;
  locale: string;
  onClaim: () => void;
};

function RebateRow({
  rowId,
  label,
  value,
  locale,
}: {
  rowId: RebateRowId;
  label: string;
  value: string;
  locale: string;
}) {
  const style = REBATE_ROW_STYLES[rowId];
  return (
    <div className="relative flex items-stretch overflow-hidden rounded-md border border-[#e5e7eb] bg-white shadow-sm">
      <div
        className="flex min-w-[108px] items-center justify-center px-3 py-3 text-center text-[13px] font-semibold text-white sm:min-w-[120px] sm:text-[14px]"
        style={{ backgroundColor: style.labelBg }}
      >
        {label}
      </div>
      <div className="flex flex-1 items-center justify-end px-4 py-3 text-[15px] font-semibold text-[#f0a070] sm:text-[16px]">
        {value}
      </div>
      <div className="w-1.5 shrink-0" style={{ backgroundColor: style.accent }} aria-hidden />
    </div>
  );
}

export default function ManualRebateTab({
  data,
  loading,
  claiming,
  labels,
  locale,
  onClaim,
}: ManualRebateTabProps) {
  const canClaim = Boolean(data?.canClaim) && !claiming;

  const rows: { id: RebateRowId; label: string; value: string }[] = data
    ? [
        { id: "date", label: labels.categories.date, value: formatRebateDateLabel(data.date) },
        // categories[cat].rebate is remaining claimable for today (not total earned).
        {
          id: "slot",
          label: labels.categories.slot,
          value: formatRebateAmount(data.categories.slot.rebate, locale),
        },
        {
          id: "live",
          label: labels.categories.live,
          value: formatRebateAmount(data.categories.live.rebate, locale),
        },
        {
          id: "sports",
          label: labels.categories.sports,
          value: formatRebateAmount(data.categories.sports.rebate, locale),
        },
        {
          id: "poker",
          label: labels.categories.poker,
          value: formatRebateAmount(data.categories.poker.rebate, locale),
        },
        {
          id: "fish",
          label: labels.categories.fish,
          value: formatRebateAmount(data.categories.fishing.rebate, locale),
        },
        {
          id: "total",
          label: labels.categories.total,
          value: formatRebateAmount(data.claimable, locale),
        },
      ]
    : [];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-2.5 px-3 py-4 sm:px-4">
        {loading && !data ? (
          <p className="py-8 text-center text-[14px] text-[#6b7280]">{labels.loading}</p>
        ) : (
          rows.map((row) => (
            <RebateRow
              key={row.id}
              rowId={row.id}
              label={row.label}
              value={row.value}
              locale={locale}
            />
          ))
        )}
      </div>

      <div className="sticky bottom-0 border-t border-[#e5e7eb] bg-[#f3f4f6] px-3 py-4 pb-mobile-nav sm:px-4 lg:pb-4">
        <button
          type="button"
          disabled={!canClaim}
          onClick={onClaim}
          className={`w-full rounded-md py-3.5 text-[16px] font-semibold text-white transition-colors ${
            canClaim
              ? "bg-[#2196F3] hover:bg-[#1e88e5] active:scale-[0.99]"
              : "cursor-not-allowed bg-[#bdbdbd]"
          }`}
        >
          {claiming ? labels.claiming : labels.claim}
        </button>
      </div>
    </div>
  );
}
