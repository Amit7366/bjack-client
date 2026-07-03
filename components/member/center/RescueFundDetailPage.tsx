"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useLocale } from "@/components/LocaleProvider";
import { useToast } from "@/components/ToastProvider";
import { getRescueFundMessages, type RescueFundDetailVariant } from "@/lib/i18n/rescue-fund-messages";
import { memberRescueFundHref } from "@/lib/member-routes";
import {
  claimRescueFund,
  fetchRescueFundStatus,
  type RescueFundStatus,
  type RescueFundTierRow,
} from "@/lib/rescue-fund-api";
import { RESCUE_FUND_BOX_OFF_URL, RESCUE_FUND_HEADER_BANNER_URL } from "@/lib/rescue-fund-assets";
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

function HelpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M7.8 7.4a2.2 2.2 0 014.1 1c0 1.5-2.2 1.6-2.2 3.1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="10" cy="14.2" r="0.9" fill="currentColor" />
    </svg>
  );
}

function SparkleLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-center text-[13px] font-semibold text-[#1e4f8a]">
      <span aria-hidden className="text-[#5b9fd4]">
        ✨{" "}
      </span>
      {children}
      <span aria-hidden className="text-[#5b9fd4]">
        {" "}
        ✨
      </span>
    </p>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-white px-3 py-4 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
      <SparkleLabel>{label}</SparkleLabel>
      <p className="mt-2 text-[22px] font-extrabold tabular-nums text-[#2f8fd6]">{value}</p>
    </div>
  );
}

function RulesModal({
  open,
  title,
  body,
  closeLabel,
  onClose,
}: {
  open: boolean;
  title: string;
  body: string;
  closeLabel: string;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-4 sm:items-center">
      <button type="button" className="absolute inset-0" aria-label={closeLabel} onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
        <h2 className="text-[16px] font-bold text-[#1f2937]">{title}</h2>
        <p className="mt-3 text-[14px] leading-relaxed text-[#4b5563]">{body}</p>
        <button
          type="button"
          onClick={onClose}
          className="focus-ring mt-5 w-full rounded-full bg-[#2f8fd6] py-2.5 text-[14px] font-semibold text-white"
        >
          {closeLabel}
        </button>
      </div>
    </div>
  );
}

type RescueFundDetailPageProps = {
  variant: RescueFundDetailVariant;
};

export default function RescueFundDetailPage({ variant }: RescueFundDetailPageProps) {
  const { refreshBalance } = useAuth();
  const { preferences } = useLocale();
  const { showToast } = useToast();
  const locale = preferences.locale;
  const labels = getRescueFundMessages(locale);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [status, setStatus] = useState<RescueFundStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  const isSports = variant === "sports";
  const gameTypeLabel = isSports ? labels.gameTypeSports : labels.gameTypeSlotFish;

  const loadStatus = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchRescueFundStatus(variant);
      setStatus(data);
    } catch (err) {
      showToast(err instanceof Error ? err.message : labels.claimError, { variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [variant, showToast, labels.claimError]);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  useEffect(() => {
    const onRefresh = () => void loadStatus();
    window.addEventListener("focus", onRefresh);
    window.addEventListener(AUTH_CHANGE_EVENT, onRefresh);
    return () => {
      window.removeEventListener("focus", onRefresh);
      window.removeEventListener(AUTH_CHANGE_EVENT, onRefresh);
    };
  }, [loadStatus]);

  const onClaim = useCallback(async () => {
    if (!status?.canClaim || claiming) {
      if (!status?.canClaim) {
        showToast(labels.noRewardToClaim, { variant: "default" });
      }
      return;
    }

    setClaiming(true);
    try {
      const result = await claimRescueFund(variant);
      setStatus(result.status);
      await refreshBalance();
      showToast(
        `${labels.claimSuccess} (+৳${formatMoney(result.claim.claimedAmount, locale)})`,
        { variant: "success" },
      );
    } catch (err) {
      showToast(err instanceof Error ? err.message : labels.claimError, { variant: "error" });
    } finally {
      setClaiming(false);
    }
  }, [status, claiming, variant, refreshBalance, showToast, labels, locale]);

  const totalLossDisplay = `৳ ${loading ? "0" : formatMoney(status?.totalLoss ?? 0, locale)}`;
  const receivableDisplay = `৳ ${loading ? "0" : formatMoney(status?.claimable ?? 0, locale)}`;
  const canClaim = Boolean(status?.canClaim) && !claiming;

  return (
    <div className="min-h-full bg-gradient-to-b from-[#eef4fa] to-[#f7f9fc]">
      <div className="mx-auto w-full max-w-lg">
        <header className="sticky top-0 z-30 bg-[#1c1c1c]">
          <div className="relative flex min-h-[52px] items-center justify-center px-3">
            <Link
              href={memberRescueFundHref(locale)}
              aria-label={labels.pageTitle}
              className="focus-ring absolute left-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-white transition-colors hover:bg-white/10"
            >
              <HeaderBackIcon />
            </Link>
            <h1 className="text-[18px] font-bold text-white">{labels.pageTitle}</h1>
            <button
              type="button"
              onClick={() => setRulesOpen(true)}
              aria-label={labels.rulesTitle}
              className="focus-ring absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-white transition-colors hover:bg-white/10"
            >
              <HelpIcon />
            </button>
          </div>
        </header>

        <div className="relative bg-gradient-to-b from-[#d8ecff] to-[#eef4fa]">
          <div className="relative mx-auto aspect-[390/180] w-full max-w-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={RESCUE_FUND_HEADER_BANNER_URL}
              alt=""
              className="h-full w-full object-cover object-center"
            />
          </div>
          <p className="pb-3 text-center text-[15px] font-semibold text-[#374151]">{labels.today}</p>
        </div>

        <div className="px-4">
          <div className="flex gap-3">
            <StatCard label={labels.totalLoss} value={totalLossDisplay} />
            <StatCard label={labels.receivableAmount} value={receivableDisplay} />
          </div>

          <div className="relative mt-2 flex flex-col items-center pb-2 pt-4">
            <div className="relative w-full max-w-[280px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={RESCUE_FUND_BOX_OFF_URL}
                alt=""
                className="mx-auto h-auto w-full max-w-[240px] object-contain"
              />
            </div>
            <button
              type="button"
              onClick={() => void onClaim()}
              disabled={!canClaim}
              className={`focus-ring -mt-2 w-full max-w-[280px] rounded-full py-3 text-[16px] font-semibold shadow-sm transition-transform ${
                canClaim
                  ? "bg-gradient-to-b from-[#52d61f] to-[#2fae0a] text-white active:scale-[0.98]"
                  : "cursor-not-allowed bg-gradient-to-b from-[#e5e7eb] to-[#d1d5db] text-[#6b7280]"
              }`}
            >
              {claiming ? "…" : labels.claim}
            </button>
          </div>

          <div className="mt-4 pb-mobile-nav lg:pb-10">
            <p className="text-center text-[14px] font-semibold text-[#374151]">{gameTypeLabel}</p>
            <button
              type="button"
              onClick={() => setRulesOpen(true)}
              className="focus-ring mt-2 text-[13px] font-medium text-[#2f8fd6] underline-offset-2 hover:underline"
            >
              {labels.rewardCycle}
            </button>

            {isSports ? (
              <SportsTable labels={labels} rules={status?.sportsRules ?? null} loading={loading} />
            ) : (
              <LossCompensationTable
                labels={labels}
                tiers={status?.lossCompensationTiers ?? []}
                qualifiedTierMinNetLoss={status?.qualifiedTierMinNetLoss ?? null}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>

      <RulesModal
        open={rulesOpen}
        title={labels.rulesTitle}
        body={labels.rulesBody}
        closeLabel={labels.close}
        onClose={() => setRulesOpen(false)}
      />
    </div>
  );
}

function SportsTable({
  labels,
  rules,
  loading,
}: {
  labels: ReturnType<typeof getRescueFundMessages>;
  rules: RescueFundStatus["sportsRules"];
  loading: boolean;
}) {
  const rows = [
    { label: labels.depositAmount, value: loading ? "0.00" : rules?.depositAmount.toFixed(2) ?? "0.00" },
    { label: labels.netLoss, value: rules?.netLossThreshold ?? ">1.00" },
    { label: labels.bonusRate, value: rules?.bonusRate ?? "10" },
    { label: labels.pointRate, value: rules?.pointRate || "—" },
    { label: labels.ticket, value: rules?.ticket || "—" },
  ];

  return (
    <div className="mt-3 overflow-hidden rounded-lg border border-[#d8e3ef] bg-white shadow-sm">
      {rows.map((row, index) => (
        <div
          key={row.label}
          className={`grid grid-cols-2 ${index > 0 ? "border-t border-[#e5edf5]" : ""}`}
        >
          <div className="bg-gradient-to-r from-[#5ca8e8] to-[#7ec0f0] px-3 py-2.5 text-[13px] font-medium text-white">
            {row.label}
          </div>
          <div className="flex items-center justify-center px-3 py-2.5 text-[13px] font-semibold text-[#1f2937]">
            {row.value}
          </div>
        </div>
      ))}
    </div>
  );
}

function LossCompensationTable({
  labels,
  tiers,
  qualifiedTierMinNetLoss,
  loading,
}: {
  labels: ReturnType<typeof getRescueFundMessages>;
  tiers: RescueFundTierRow[];
  qualifiedTierMinNetLoss: number | null;
  loading: boolean;
}) {
  const rowDefs = [
    { key: "deposit" as const, label: labels.depositAmount },
    { key: "netLoss" as const, label: labels.netLoss },
    { key: "bonus" as const, label: labels.bonus },
    { key: "points" as const, label: labels.points },
    { key: "ticket" as const, label: labels.ticket },
  ];

  return (
    <div className="mt-3 overflow-x-auto rounded-lg border border-[#d8e3ef] bg-white shadow-sm">
      <table className="w-full min-w-[320px] border-collapse text-center text-[12px]">
        <tbody>
          {rowDefs.map((row, rowIndex) => (
            <tr key={row.key} className={rowIndex > 0 ? "border-t border-[#e5edf5]" : ""}>
              <th className="w-[34%] bg-gradient-to-r from-[#5ca8e8] to-[#7ec0f0] px-2 py-2.5 text-left text-[12px] font-medium text-white">
                {row.label}
              </th>
              {tiers.map((tier, colIndex) => {
                const qualified = !loading && qualifiedTierMinNetLoss === tier.minNetLoss;
                return (
                  <td
                    key={`${row.key}-${colIndex}`}
                    className={`px-2 py-2.5 font-semibold ${
                      qualified ? "bg-[#e8f4ff] text-[#1d4ed8]" : "text-[#1f2937]"
                    } ${colIndex % 2 === 1 && !qualified ? "bg-[#f8fafc]" : "bg-white"}`}
                  >
                    {tier[row.key] || "—"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
