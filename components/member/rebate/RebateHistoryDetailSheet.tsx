"use client";

import type { RebateClaimRecord, RebateMessages } from "@/lib/i18n/rebate-messages";
import { categoryLabel } from "@/lib/i18n/rebate-messages";
import { formatRebateAmount, REBATE_ROW_STYLES } from "./rebate-ui";

type RebateHistoryDetailSheetProps = {
  open: boolean;
  record: RebateClaimRecord | null;
  labels: RebateMessages;
  locale: string;
  onClose: () => void;
};

export default function RebateHistoryDetailSheet({
  open,
  record,
  labels,
  locale,
  onClose,
}: RebateHistoryDetailSheetProps) {
  if (!open || !record) return null;

  const categories = ["slot", "live", "sports", "poker", "fishing"] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 sm:items-center">
      <button type="button" className="absolute inset-0" aria-label={labels.close} onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl">
        <h2 className="mb-1 text-[17px] font-semibold text-[#111]">{labels.detailTitle}</h2>
        <p className="mb-4 text-[13px] text-[#6b7280]">{labels.orderNo(record.orderNo)}</p>

        <div className="mb-4 rounded-lg bg-[#f9fafb] p-3 text-[14px] text-[#374151]">
          <div className="flex justify-between py-1">
            <span>{labels.transactionAmount}</span>
            <span className="font-semibold text-[#16a34a]">
              {formatRebateAmount(record.amount, locale)}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span>{labels.turnover}</span>
            <span>{formatRebateAmount(record.totalTurnover, locale)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span>{labels.earnedRebate}</span>
            <span>{formatRebateAmount(record.totalEarnedRebate, locale)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span>{labels.claimedBefore}</span>
            <span>{formatRebateAmount(record.claimedBefore, locale)}</span>
          </div>
        </div>

        <div className="space-y-2">
          {categories.map((cat) => {
            const snap = record.categoryBreakdown[cat];
            const styleKey = cat === "fishing" ? "fish" : cat;
            const style = REBATE_ROW_STYLES[styleKey];
            return (
              <div
                key={cat}
                className="flex items-center justify-between rounded-md border border-[#e5e7eb] px-3 py-2"
              >
                <span
                  className="rounded px-2 py-0.5 text-[12px] font-semibold text-white"
                  style={{ backgroundColor: style.labelBg }}
                >
                  {categoryLabel(labels, cat)}
                </span>
                <span className="text-[13px] text-[#f0a070]">
                  {formatRebateAmount(snap.rebate, locale)}
                </span>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className="mt-5 w-full rounded-md border border-[#d1d5db] py-2.5 text-[14px] font-medium text-[#374151]"
          onClick={onClose}
        >
          {labels.close}
        </button>
      </div>
    </div>
  );
}
