"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useLocale } from "@/components/LocaleProvider";
import { useToast } from "@/components/ToastProvider";
import { copyTextToClipboard } from "@/lib/copy-text";
import { getTemuTicketMessages } from "@/lib/i18n/temu-ticket-messages";
import { memberRewardCenterHref, memberTemuTicketHistoryHref } from "@/lib/member-routes";
import {
  buildReferralRegisterLink,
  fetchMyReferralSummary,
} from "@/lib/referral-api";
import { TEMU_TICKET_HISTORY_BOX_GIF_URL } from "@/lib/temu-ticket-assets";
import {
  claimTemuReward,
  fetchTemuTicketStatus,
  type TemuTicketStatus,
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

function formatExpiry(value: string, locale: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  try {
    return new Intl.DateTimeFormat(locale === "bn" ? "bn-BD" : locale === "hi" ? "hi-IN" : "en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  } catch {
    return date.toLocaleString();
  }
}

export default function TemuTicketPage() {
  const { refreshBalance } = useAuth();
  const { preferences } = useLocale();
  const { showToast } = useToast();
  const locale = preferences.locale;
  const labels = getTemuTicketMessages(locale);

  const [status, setStatus] = useState<TemuTicketStatus | null>(null);
  const [referralId, setReferralId] = useState("");
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  const referralLink = useMemo(
    () => (referralId ? buildReferralRegisterLink(locale, referralId) : ""),
    [locale, referralId],
  );

  const loadStatus = useCallback(() => {
    setLoading(true);
    void Promise.all([fetchTemuTicketStatus(locale), fetchMyReferralSummary().catch(() => null)])
      .then(([ticketStatus, referralSummary]) => {
        setStatus(ticketStatus);
        setReferralId(referralSummary?.referralId ?? "");
      })
      .catch(() => {
        showToast(labels.loadError, { variant: "error" });
      })
      .finally(() => setLoading(false));
  }, [locale, labels.loadError, showToast]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  useEffect(() => {
    const onAuthChange = () => loadStatus();
    window.addEventListener(AUTH_CHANGE_EVENT, onAuthChange);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, onAuthChange);
  }, [loadStatus]);

  const onCopyLink = useCallback(async () => {
    if (!referralLink) return;
    try {
      await copyTextToClipboard(referralLink);
      showToast(labels.linkCopied, { variant: "success" });
    } catch {
      showToast(labels.claimError, { variant: "error" });
    }
  }, [referralLink, labels.linkCopied, labels.claimError, showToast]);

  const onClaimReward = useCallback(async () => {
    if (claiming || !status?.canClaimReward) return;
    setClaiming(true);
    try {
      const result = await claimTemuReward(locale);
      setStatus(result.status);
      await refreshBalance();
      showToast(
        `${labels.claimSuccess} (+${formatMoney(result.claim.addedAmount, locale)})`,
        { variant: "success" },
      );
    } catch (err) {
      showToast(err instanceof Error ? err.message : labels.claimError, { variant: "error" });
    } finally {
      setClaiming(false);
    }
  }, [claiming, status?.canClaimReward, locale, refreshBalance, labels, showToast]);

  const progressDisplay = loading ? "0%" : `${status?.percent ?? 0}%`;
  const targetDisplay = loading ? "৳ 0.00" : `৳ ${formatMoney(status?.targetAmount ?? 0, locale)}`;
  const progressAmountDisplay = loading
    ? "৳ 0.00"
    : `৳ ${formatMoney(status?.progressAmount ?? 0, locale)}`;

  return (
    <div className="min-h-full bg-[#fff8ef]">
      <div className="mx-auto w-full max-w-lg">
        <header className="sticky top-0 z-30 bg-[#1c1c1c]">
          <div className="relative flex min-h-[52px] items-center justify-center px-3">
            <Link
              href={memberRewardCenterHref(locale)}
              aria-label={labels.pageTitle}
              className="focus-ring absolute left-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-white transition-colors hover:bg-white/10"
            >
              <HeaderBackIcon />
            </Link>
            <h1 className="text-[18px] font-bold text-white">{labels.pageTitle}</h1>
            <Link
              href={memberTemuTicketHistoryHref(locale)}
              className="focus-ring absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-[13px] font-semibold text-white/90 transition-colors hover:bg-white/10"
            >
              {labels.historyLink}
            </Link>
          </div>
        </header>

        <div className="relative overflow-hidden bg-gradient-to-b from-[#ff9a2e] via-[#ffb347] to-[#ffd08a] px-4 pb-8 pt-4">
          <div className="relative mx-auto flex w-full max-w-[300px] justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={TEMU_TICKET_HISTORY_BOX_GIF_URL}
              alt=""
              className="h-auto w-full max-w-[260px] object-contain"
            />
          </div>

          <div className="mt-4 rounded-2xl border border-white/30 bg-white/90 px-4 py-4 shadow-lg backdrop-blur-sm">
            <p className="text-center text-[14px] font-semibold text-[#374151]">
              {loading ? "…" : status?.ticketName}
            </p>

            <div className="mt-4 flex items-center justify-between text-[13px] text-[#6b7280]">
              <span>{labels.targetReward}</span>
              <span className="font-bold text-[#1f2937]">{targetDisplay}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[13px] text-[#6b7280]">
              <span>{labels.progress}</span>
              <span className="font-bold tabular-nums text-[#f97316]">
                {progressAmountDisplay} ({progressDisplay})
              </span>
            </div>

            <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#fdebd3]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#ff8c2a] to-[#ff4d00] transition-all duration-500"
                style={{ width: `${loading ? 0 : status?.percent ?? 0}%` }}
              />
            </div>

            {!loading && status ? (
              <p className="mt-3 text-center text-[12px] text-[#6b7280]">
                {labels.expiresIn}: {formatExpiry(status.expiresAt, locale)}
              </p>
            ) : null}
          </div>
        </div>

        <div className="space-y-4 px-4 pb-8 pt-4">
          {status?.canClaimReward ? (
            <button
              type="button"
              onClick={() => void onClaimReward()}
              disabled={claiming}
              className="focus-ring w-full rounded-full bg-gradient-to-r from-[#22c55e] to-[#16a34a] py-3.5 text-[15px] font-bold text-white shadow-md disabled:opacity-60"
            >
              {labels.claimReward} (৳ {formatMoney(status.claimableAmount, locale)})
            </button>
          ) : status?.rewardClaimed ? (
            <p className="text-center text-[13px] font-medium text-[#16a34a]">{labels.rewardClaimed}</p>
          ) : (
            <p className="text-center text-[13px] leading-relaxed text-[#6b7280]">{labels.fillTargetHint}</p>
          )}

          <div className="rounded-2xl bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <h2 className="text-[15px] font-bold text-[#1f2937]">{labels.inviteFriends}</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-[#6b7280]">{labels.inviteHint}</p>
            <p className="mt-3 text-[13px] text-[#6b7280]">
              {labels.inviteCount}:{" "}
              <span className="font-semibold text-[#1f2937]">{status?.inviteCount ?? 0}</span>
            </p>
            {referralLink ? (
              <>
                <p className="mt-3 break-all rounded-lg bg-[#f3f4f6] px-3 py-2 text-[12px] text-[#374151]">
                  {referralLink}
                </p>
                <button
                  type="button"
                  onClick={() => void onCopyLink()}
                  className="focus-ring mt-3 w-full rounded-full border border-[#ff8c2a] py-2.5 text-[14px] font-semibold text-[#ea580c]"
                >
                  {labels.copyLink}
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
