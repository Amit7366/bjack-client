"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useLocale } from "@/components/LocaleProvider";
import { useToast } from "@/components/ToastProvider";
import { getBonusRewardMessages } from "@/lib/i18n/bonus-reward-messages";
import { memberRewardCenterHref } from "@/lib/member-routes";
import {
  claimMemberBonusReward,
  fetchMemberBonusRewardStatus,
  remainingFromMs,
  type MemberBonusRewardStatus,
} from "@/lib/member-bonus-reward-api";
import {
  fetchMyNormalUserProfile,
  type NormalUserProfile,
} from "@/lib/member/profile-api";
import { DefaultAvatarIcon, HeaderBackIcon } from "./MemberCenterIcons";

function formatBalance(amount: string | undefined, locale: string): string {
  const num = Number.parseFloat(amount ?? "0");
  if (Number.isNaN(num)) return "0.00";
  try {
    return new Intl.NumberFormat(locale === "bn" ? "bn-BD" : locale === "hi" ? "hi-IN" : "en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  } catch {
    return num.toFixed(2);
  }
}

function formatBonus(value: number, locale: string): string {
  try {
    return new Intl.NumberFormat(locale === "bn" ? "bn-BD" : locale === "hi" ? "hi-IN" : "en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return value.toFixed(2);
  }
}

function formatDueDate(iso: string | null, locale: string): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}.${m}.${day}`;
  } catch {
    return "—";
  }
}

function VoucherTicketIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden>
      <path
        d="M3 8a2 2 0 012-2h16a2 2 0 012 2v2.5a2.5 2.5 0 000 5V18a2 2 0 01-2 2H5a2 2 0 01-2-2v-2.5a2.5 2.5 0 000-5V8z"
        fill="#f5c542"
      />
      <path d="M10 6v14" stroke="#0e4c4c" strokeWidth="1.4" strokeDasharray="2.5 2.5" />
      <circle cx="16.5" cy="11" r="1.4" fill="#0e4c4c" />
      <path d="M14 15.5h5" stroke="#0e4c4c" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function InfoBadge() {
  return (
    <span
      aria-hidden
      className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#6b7280] text-[9px] font-bold italic leading-none text-white"
    >
      i
    </span>
  );
}

function DonutDecor({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute rounded-full border-[7px] border-[#f7d0b5]/60 ${className}`}
    />
  );
}

export default function BonusRewardPage() {
  const { session, refreshBalance, refreshSession } = useAuth();
  const { preferences } = useLocale();
  const { showToast } = useToast();
  const locale = preferences.locale;
  const b = getBonusRewardMessages(locale);

  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<NormalUserProfile | null>(null);
  const [status, setStatus] = useState<MemberBonusRewardStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [tick, setTick] = useState(() => Date.now());

  const loadStatus = useCallback(async () => {
    setLoading(true);
    try {
      setStatus(await fetchMemberBonusRewardStatus());
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Failed to load bonus", { variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setTick(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  useEffect(() => {
    let cancelled = false;
    fetchMyNormalUserProfile()
      .then((data) => {
        if (!cancelled) setProfile(data);
      })
      .catch(() => {
        /* keep session-based fallbacks */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const displayId = mounted ? (session?.userName ?? session?.memberId ?? "—") : "—";
  const balanceDisplay = mounted ? formatBalance(session?.balance, locale) : "0.00";
  const avatarSrc = profile?.profileImg;

  const countdown = useMemo(() => {
    if (!status || status.canClaim) {
      return { days: 0, clock: "00:00:00" };
    }
    if (status.nextClaimAt) {
      const remaining = Math.max(0, new Date(status.nextClaimAt).getTime() - tick);
      return remainingFromMs(remaining);
    }
    return remainingFromMs(status.remainingMs);
  }, [status, tick]);

  const dueDateLabel = useMemo(() => {
    if (!status) return "—";
    if (status.canClaim) return formatDueDate(new Date().toISOString(), locale);
    return formatDueDate(status.nextClaimAt, locale);
  }, [status, locale]);

  const onClaim = useCallback(async () => {
    if (claiming || !status?.canClaim) return;
    setClaiming(true);
    try {
      const result = await claimMemberBonusReward();
      showToast(
        `${b.claimSuccess} (+৳${formatBonus(result.bonusAmount, locale)})`,
        { variant: "success" },
      );
      await Promise.all([refreshBalance(), refreshSession()]);
      await loadStatus();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Claim failed", { variant: "error" });
    } finally {
      setClaiming(false);
    }
  }, [
    claiming,
    status?.canClaim,
    showToast,
    b.claimSuccess,
    locale,
    refreshBalance,
    refreshSession,
    loadStatus,
  ]);

  const canClaim = status?.canClaim ?? false;
  const bonusAmount = status?.bonusAmount ?? 10;

  return (
    <div className="min-h-full bg-[#eef0f2]">
      <div className="mx-auto w-full max-w-lg">
        <header className="sticky top-0 z-30 bg-[#0e4c4c]">
          <div className="relative flex min-h-[52px] items-center justify-center px-3">
            <Link
              href={memberRewardCenterHref(locale)}
              aria-label={b.pageTitle}
              className="focus-ring absolute left-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-[#f5c542] transition-colors hover:bg-white/10"
            >
              <HeaderBackIcon />
            </Link>
            <h1 className="text-[18px] font-bold text-[#f5c542]">{b.pageTitle}</h1>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 opacity-80">
              <VoucherTicketIcon />
            </span>
          </div>
        </header>

        <div className="relative overflow-hidden bg-gradient-to-br from-[#1f8fef] to-[#36a8f5] pb-10 pt-5">
          <span
            aria-hidden
            className="absolute -right-16 -bottom-20 h-64 w-64 rounded-full bg-[#5cbcf9]/70"
          />
          <span
            aria-hidden
            className="absolute right-24 top-2 h-5 w-5 rounded-full bg-[#7fcdfb]/80"
          />
          <span
            aria-hidden
            className="absolute right-10 top-12 h-3 w-3 rounded-full bg-[#7fcdfb]/80"
          />
          <span
            aria-hidden
            className="absolute -left-12 bottom-0 h-40 w-40 rounded-full bg-[#1779d8]/50"
          />
          <div className="relative flex items-center gap-4 px-5">
            <div className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-full ring-[3px] ring-white/80">
              {avatarSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarSrc} alt="" className="h-full w-full object-cover" />
              ) : (
                <DefaultAvatarIcon />
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[15px] font-bold text-white">{displayId}</p>
              <p className="mt-1 text-[20px] font-extrabold tabular-nums text-white">
                ৳ {balanceDisplay}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 px-0 pb-mobile-nav pt-2 lg:pb-10">
          {loading && !status ? (
            <p className="px-4 py-8 text-center text-[14px] text-[#6b7280]">…</p>
          ) : status ? (
            <div className="relative flex overflow-hidden bg-gradient-to-r from-[#fdf1e7] via-[#fbeadd] to-white shadow-sm">
              <DonutDecor className="left-[42%] -top-5 h-12 w-12" />
              <DonutDecor className="left-[55%] bottom-1 h-7 w-7 border-[5px]" />
              <DonutDecor className="left-2 -bottom-4 h-9 w-9 border-[6px]" />

              <div className="relative z-10 my-4 ml-3 flex w-[124px] shrink-0 flex-col items-center justify-center gap-0.5 rounded-lg bg-gradient-to-b from-[#ff5f3d] to-[#ef2722] px-2 py-3.5 text-center text-white shadow-md">
                <span className="text-[12px] font-bold leading-tight">{b.voucherTitle}</span>
                <span className="text-[12px] font-semibold leading-tight">
                  ৳ {formatBonus(bonusAmount, locale)}
                </span>
                <span className="text-[12px] font-semibold leading-tight">{dueDateLabel}</span>
              </div>

              <div className="relative z-10 flex min-w-0 flex-1 flex-col justify-center gap-1 px-3 py-4">
                <p className="text-[13px] text-[#6b7280]">{b.rewardLabel}</p>
                <p className="truncate text-[14px] font-semibold text-[#1c1c1c]">{b.rewardTitle}</p>
                <p className="mt-0.5 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#eceef1] px-2.5 py-1 text-[12px] text-[#4b5563]">
                  {b.rewardDescription}
                  <InfoBadge />
                </p>
                {status.totalBonusClaimed > 0 ? (
                  <p className="mt-1 text-[12px] text-[#6b7280]">
                    Total claimed: ৳ {formatBonus(status.totalBonusClaimed, locale)}
                  </p>
                ) : null}
              </div>

              <div className="relative z-10 flex w-[104px] shrink-0 flex-col items-center justify-center gap-0.5 bg-white px-2 py-3">
                <span className="text-[12px] text-[#9ca3af]">
                  {canClaim ? b.dueDate : b.cooldownNote}
                </span>
                <span className="text-[#1c1c1c]">
                  <span className="text-[26px] font-extrabold leading-none tabular-nums">
                    {canClaim ? 0 : countdown.days}
                  </span>
                  <span className="ml-0.5 text-[11px] font-semibold">{b.dayUnit}</span>
                </span>
                <span className="text-[12px] font-medium tabular-nums text-[#374151]">
                  {canClaim ? "00:00:00" : countdown.clock}
                </span>
                <button
                  type="button"
                  onClick={() => void onClaim()}
                  disabled={!canClaim || claiming}
                  className={`focus-ring mt-1.5 w-full rounded-full py-1.5 text-[13px] font-semibold text-white shadow-sm transition-transform ${
                    canClaim && !claiming
                      ? "bg-gradient-to-b from-[#52d61f] to-[#2fae0a] active:scale-[0.97]"
                      : "cursor-not-allowed bg-[#c9ccd1]"
                  }`}
                >
                  {claiming ? "…" : canClaim ? b.claim : b.claimed}
                </button>
              </div>
            </div>
          ) : (
            <p className="px-4 py-8 text-center text-[14px] text-[#6b7280]">{b.noBonus}</p>
          )}
        </div>
      </div>
    </div>
  );
}
