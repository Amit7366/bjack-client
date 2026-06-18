"use client";

import type { ProfitLossMessages, ProfitLossPreset } from "@/lib/i18n/profit-loss-messages";
import { formatRangeLabel } from "./profit-loss-ui";

type ProfitLossFilterBarProps = {
  preset: ProfitLossPreset;
  from: string;
  to: string;
  labels: ProfitLossMessages;
  onPreset: (preset: Exclude<ProfitLossPreset, "custom">) => void;
  onOpenRange: () => void;
};

function chipClass(active: boolean): string {
  return `min-h-9 shrink-0 rounded-md border px-3 py-1.5 text-[13px] font-medium transition-colors ${
    active
      ? "border-[#2196F3] bg-white text-[#2196F3]"
      : "border-[#d1d5db] bg-white text-[#2196F3]"
  }`;
}

export default function ProfitLossFilterBar({
  preset,
  from,
  to,
  labels,
  onPreset,
  onOpenRange,
}: ProfitLossFilterBarProps) {
  return (
    <div className="border-b border-[#e5e7eb] bg-[#f3f4f6] px-3 py-3">
      <div className="mx-auto flex w-full max-w-lg gap-2 overflow-x-auto">
        <button type="button" className={chipClass(preset === "today")} onClick={() => onPreset("today")}>
          {labels.filters.today}
        </button>
        <button
          type="button"
          className={chipClass(preset === "yesterday")}
          onClick={() => onPreset("yesterday")}
        >
          {labels.filters.yesterday}
        </button>
        <button
          type="button"
          className={chipClass(preset === "last7days")}
          onClick={() => onPreset("last7days")}
        >
          {labels.filters.last7days}
        </button>
        <button
          type="button"
          className={`${chipClass(preset === "custom")} flex min-w-[120px] items-center justify-center gap-1.5`}
          onClick={onOpenRange}
        >
          <span aria-hidden>📅</span>
          <span>{formatRangeLabel(from, to)}</span>
        </button>
      </div>
    </div>
  );
}
