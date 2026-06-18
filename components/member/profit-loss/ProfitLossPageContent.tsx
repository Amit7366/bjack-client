"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { MemberPageHeader } from "@/components/member/shared/member-ui";
import {
  getProfitLossMessages,
  PROFIT_LOSS_CATEGORY_ORDER,
  type PersonalReportData,
  type ProfitLossPreset,
} from "@/lib/i18n/profit-loss-messages";
import { memberCenterHref } from "@/lib/member-routes";
import { fetchPersonalReport } from "@/lib/profit-loss-api";
import ProfitLossCategoryCard from "./ProfitLossCategoryCard";
import ProfitLossDateRangeSheet from "./ProfitLossDateRangeSheet";
import ProfitLossFilterBar from "./ProfitLossFilterBar";
import { addDaysToKey, dhakaTodayKey, PROFIT_LOSS_LIGHT_BG } from "./profit-loss-ui";

function rangeForPreset(preset: Exclude<ProfitLossPreset, "custom">): { from: string; to: string } {
  const today = dhakaTodayKey();
  if (preset === "today") return { from: today, to: today };
  if (preset === "yesterday") {
    const y = addDaysToKey(today, -1);
    return { from: y, to: y };
  }
  return { from: addDaysToKey(today, -6), to: today };
}

export default function ProfitLossPageContent() {
  const { preferences } = useLocale();
  const { locale } = preferences;
  const labels = getProfitLossMessages(locale);

  const [preset, setPreset] = useState<ProfitLossPreset>("today");
  const [from, setFrom] = useState(() => dhakaTodayKey());
  const [to, setTo] = useState(() => dhakaTodayKey());
  const [sheetOpen, setSheetOpen] = useState(false);
  const [data, setData] = useState<PersonalReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReport = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchPersonalReport({ from, to });
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : labels.loadError);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [from, to, labels.loadError]);

  useEffect(() => {
    void loadReport();
  }, [loadReport]);

  const onPreset = (next: Exclude<ProfitLossPreset, "custom">) => {
    const range = rangeForPreset(next);
    setPreset(next);
    setFrom(range.from);
    setTo(range.to);
  };

  const onCustomRange = (nextFrom: string, nextTo: string) => {
    setPreset("custom");
    setFrom(nextFrom);
    setTo(nextTo);
  };

  return (
    <div className={`${PROFIT_LOSS_LIGHT_BG} flex min-h-full flex-col`}>
      <MemberPageHeader title={labels.pageTitle} backHref={memberCenterHref(locale)} width="narrow" />

      <ProfitLossFilterBar
        preset={preset}
        from={from}
        to={to}
        labels={labels}
        onPreset={onPreset}
        onOpenRange={() => setSheetOpen(true)}
      />

      <div className="flex-1 space-y-3 px-3 py-4 pb-mobile-nav lg:pb-4">
        {error ? <p className="py-4 text-center text-[13px] text-[#dc2626]">{error}</p> : null}
        {loading && !data ? (
          <p className="py-8 text-center text-[14px] text-[#6b7280]">{labels.loading}</p>
        ) : data ? (
          <>
            <ProfitLossCategoryCard category="all" labels={labels} locale={locale} all={data.all} />
            {PROFIT_LOSS_CATEGORY_ORDER.map((cat) => (
              <ProfitLossCategoryCard
                key={cat}
                category={cat}
                labels={labels}
                locale={locale}
                game={data.categories[cat]}
              />
            ))}
          </>
        ) : null}
      </div>

      <ProfitLossDateRangeSheet
        open={sheetOpen}
        from={from}
        to={to}
        labels={labels}
        locale={locale}
        onClose={() => setSheetOpen(false)}
        onConfirm={onCustomRange}
      />
    </div>
  );
}
