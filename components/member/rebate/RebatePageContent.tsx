"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useLocale } from "@/components/LocaleProvider";
import { useToast } from "@/components/ToastProvider";
import { MemberPageHeader } from "@/components/member/shared/member-ui";
import { getRebateMessages, type RebateTab } from "@/lib/i18n/rebate-messages";
import { memberCenterHref } from "@/lib/member-routes";
import { claimDailyRebate, fetchManualRebate } from "@/lib/rebate-api";
import type { ManualRebateData } from "@/lib/i18n/rebate-messages";
import ManualRebateTab from "./ManualRebateTab";
import RebateHistoryTab from "./RebateHistoryTab";
import { REBATE_LIGHT_BG, REBATE_TAB_ACTIVE } from "./rebate-ui";

export default function RebatePageContent() {
  const { preferences } = useLocale();
  const { locale } = preferences;
  const labels = getRebateMessages(locale);
  const { showToast } = useToast();
  const { refreshBalance } = useAuth();

  const [activeTab, setActiveTab] = useState<RebateTab>("manual");
  const [manualData, setManualData] = useState<ManualRebateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadManual = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchManualRebate();
      setManualData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : labels.loadError);
    } finally {
      setLoading(false);
    }
  }, [labels.loadError]);

  useEffect(() => {
    if (activeTab === "manual") {
      void loadManual();
    }
  }, [activeTab, loadManual]);

  const onClaim = async () => {
    setClaiming(true);
    try {
      const result = await claimDailyRebate();
      setManualData(result.summary);
      await refreshBalance();
      showToast(labels.claimSuccess, { variant: "success" });
    } catch (err) {
      showToast(err instanceof Error ? err.message : labels.claimError, { variant: "error" });
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className={`${REBATE_LIGHT_BG} flex min-h-full flex-col`}>
      <MemberPageHeader title={labels.pageTitle} backHref={memberCenterHref(locale)} width="narrow" />

      <div className="border-b border-[#e5e7eb] bg-white">
        <div className="mx-auto flex w-full max-w-lg">
          {(["manual", "history"] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab)}
                className={`focus-ring relative min-h-11 flex-1 px-4 py-3 text-[14px] font-medium transition-colors ${
                  isActive ? "text-[#2196F3]" : "text-[#6b7280]"
                }`}
              >
                {labels.tabs[tab]}
                {isActive ? (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: REBATE_TAB_ACTIVE }}
                    aria-hidden
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {error && activeTab === "manual" ? (
        <p className="px-4 py-3 text-center text-[13px] text-[#dc2626]">{error}</p>
      ) : null}

      {activeTab === "manual" ? (
        <ManualRebateTab
          data={manualData}
          loading={loading}
          claiming={claiming}
          labels={labels}
          locale={locale}
          onClaim={() => void onClaim()}
        />
      ) : (
        <RebateHistoryTab labels={labels} locale={locale} />
      )}
    </div>
  );
}
