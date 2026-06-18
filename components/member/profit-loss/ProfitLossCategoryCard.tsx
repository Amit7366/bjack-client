"use client";

import type {
  AllSummaryMetrics,
  CategoryGameMetrics,
  ProfitLossCategory,
  ProfitLossMessages,
} from "@/lib/i18n/profit-loss-messages";
import {
  CATEGORY_ICON_STYLES,
  formatPnlAmount,
  formatReportAmount,
  pnlColor,
} from "./profit-loss-ui";

type ProfitLossCategoryCardProps = {
  category: ProfitLossCategory;
  labels: ProfitLossMessages;
  locale: string;
  all?: AllSummaryMetrics;
  game?: CategoryGameMetrics;
};

function MetricCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 flex-1 text-center">
      <p className="truncate text-[11px] text-[#9ca3af]">{label}</p>
      <p className="truncate text-[14px] font-semibold text-[#111827]">{value}</p>
    </div>
  );
}

function CategoryIcon({ category }: { category: ProfitLossCategory }) {
  const style = CATEGORY_ICON_STYLES[category];
  if (category === "all") {
    return (
      <span className="grid h-9 w-9 shrink-0 grid-cols-2 gap-0.5 overflow-hidden rounded-md">
        <span className="bg-[#fbbf24]" />
        <span className="bg-[#ef4444]" />
        <span className="bg-[#3b82f6]" />
        <span className="bg-[#22c55e]" />
      </span>
    );
  }
  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
      style={{ backgroundColor: style.bg }}
    >
      {style.label}
    </span>
  );
}

export default function ProfitLossCategoryCard({
  category,
  labels,
  locale,
  all,
  game,
}: ProfitLossCategoryCardProps) {
  const pnl = category === "all" ? (all?.pnl ?? 0) : (game?.pnl ?? 0);
  const fmt = (v: number) => formatReportAmount(v, locale);
  const fmtPnl = formatPnlAmount(pnl, locale);

  return (
    <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-[#f0f0f0] px-4 py-3">
        <CategoryIcon category={category} />
        <p className="flex-1 text-[15px] font-semibold text-[#111827]">
          {labels.categories[category]}
        </p>
        <p className="text-[13px] text-[#6b7280]">
          {labels.metrics.totalPnl}:{" "}
          <span className="font-semibold" style={{ color: pnlColor(pnl) }}>
            {fmtPnl}
          </span>
        </p>
      </div>

      {category === "all" && all ? (
        <div className="space-y-4 px-3 py-4">
          <div className="flex gap-2">
            <MetricCell label={labels.metrics.deposit} value={fmt(all.deposit)} />
            <MetricCell label={labels.metrics.bonus} value={fmt(all.bonus)} />
            <MetricCell label={labels.metrics.income} value={fmt(all.income)} />
          </div>
          <div className="flex gap-2">
            <MetricCell label={labels.metrics.withdrawal} value={fmt(all.withdrawal)} />
            <MetricCell label={labels.metrics.rebate} value={fmt(all.rebate)} />
            <MetricCell label={labels.metrics.expense} value={fmt(all.expense)} />
          </div>
        </div>
      ) : null}

      {category !== "all" && game ? (
        <div className="space-y-4 px-3 py-4">
          <div className="flex gap-2">
            <MetricCell label={labels.metrics.betting} value={fmt(game.betting)} />
            <MetricCell label={labels.metrics.validBet} value={fmt(game.validBet)} />
            <MetricCell label={labels.metrics.winAmount} value={fmt(game.winAmount)} />
          </div>
          <div className="flex gap-2">
            <MetricCell label={labels.metrics.rebate} value={fmt(game.rebate)} />
            <div className="min-w-0 flex-1" aria-hidden />
            <MetricCell label={labels.metrics.bonus} value={fmt(game.bonus)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
