"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useLocale } from "@/components/LocaleProvider";
import { useToast } from "@/components/ToastProvider";
import { getSignInRewardMessages } from "@/lib/i18n/sign-in-reward-messages";
import { memberRewardCenterHref } from "@/lib/member-routes";
import {
  fetchMyNormalUserProfile,
  type NormalUserProfile,
} from "@/lib/member/profile-api";
import {
  claimSignInReward,
  fetchSignInRewardStatus,
  type SignInDayView,
  type SignInRewardStatus,
} from "@/lib/sign-in-reward-api";
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

function formatBonusAmount(value: number, locale: string): string {
  try {
    return new Intl.NumberFormat(locale === "bn" ? "bn-BD" : locale === "hi" ? "hi-IN" : "en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return value.toFixed(2);
  }
}

function MoneyStackIcon() {
  return (
    <svg width="74" height="58" viewBox="0 0 74 58" fill="none" aria-hidden>
      <circle cx="37" cy="29" r="27" fill="#fdeebc" opacity="0.7" />
      <path
        d="M37 29L10 8M37 29L37 0M37 29L64 8M37 29L72 22M37 29L2 22"
        stroke="#fbe09a"
        strokeWidth="3"
        opacity="0.5"
      />
      <rect x="14" y="36" width="46" height="14" rx="2" fill="#3fae62" />
      <rect x="14" y="34" width="46" height="12" rx="2" fill="#56c87a" />
      <rect x="31" y="33" width="12" height="14" fill="#e8e3d2" />
      <rect x="18" y="24" width="40" height="12" rx="2" fill="#3fae62" transform="rotate(-4 18 24)" />
      <rect x="18" y="22" width="40" height="10" rx="2" fill="#63d186" transform="rotate(-4 18 22)" />
      <rect x="33" y="20.5" width="10" height="12" fill="#efe9d8" transform="rotate(-4 33 20.5)" />
      <rect x="22" y="12" width="34" height="10" rx="2" fill="#48b96c" transform="rotate(3 22 12)" />
      <rect x="22" y="10" width="34" height="9" rx="2" fill="#74da95" transform="rotate(3 22 10)" />
      <rect x="35" y="9" width="9" height="11" fill="#f4eedd" transform="rotate(3 35 9)" />
      <ellipse cx="39.5" cy="14.5" rx="3.4" ry="2.6" fill="#48b96c" />
    </svg>
  );
}

function RedEnvelopeIcon() {
  return (
    <svg width="26" height="34" viewBox="0 0 26 34" fill="none" aria-hidden>
      <rect x="1" y="1" width="24" height="32" rx="3" fill="#e8362a" />
      <path d="M1 4a3 3 0 013-3h18a3 3 0 013 3l-12 9L1 4z" fill="#c6231a" />
      <circle cx="13" cy="17" r="5" fill="#f7c948" />
      <path d="M13 14.5v5M10.5 17h5" stroke="#c6231a" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function GoldenEggIcon() {
  return (
    <svg width="34" height="36" viewBox="0 0 34 36" fill="none" aria-hidden>
      <path
        d="M17 3c7 0 13 9.5 13 18a13 13 0 11-26 0C4 12.5 10 3 17 3z"
        fill="#ffc63d"
      />
      <path
        d="M17 3c7 0 13 9.5 13 18a13 13 0 01-4 9.4C28 21 24 9 17 3z"
        fill="#f0a91e"
      />
      <rect x="7" y="14" width="20" height="6" rx="3" fill="#6b4a14" />
      <rect x="8.5" y="15" width="7" height="4" rx="2" fill="#2b2b2b" />
      <rect x="18.5" y="15" width="7" height="4" rx="2" fill="#2b2b2b" />
      <path d="M9 8.5l3-2" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

function QuestionBadge() {
  return (
    <span
      aria-hidden
      className="flex h-4 w-4 items-center justify-center rounded-full bg-[#7a1f1f] text-[10px] font-bold leading-none text-white"
    >
      ?
    </span>
  );
}

function GiftCoinsIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden>
      <ellipse cx="12" cy="38" rx="9" ry="3" fill="#f7c948" />
      <ellipse cx="12" cy="35.5" rx="9" ry="3" fill="#ffdd6e" />
      <ellipse cx="12" cy="33" rx="9" ry="3" fill="#f7c948" />
      <rect x="14" y="10" width="26" height="20" rx="2.5" fill="#e8362a" />
      <rect x="12.5" y="6" width="29" height="7" rx="2" fill="#c6231a" />
      <path d="M27 6v24" stroke="#f7c948" strokeWidth="2.5" />
      <path
        d="M27 6c-3 0-5.5-1.5-5.5-3.3 0-1.8 3-2.5 5.5.8 2.5-3.3 5.5-2.6 5.5-.8C32.5 4.5 30 6 27 6z"
        fill="#f7c948"
      />
    </svg>
  );
}

function dayExtra(day: number): "red-envelope" | "golden-egg" | undefined {
  if (day === 3) return "red-envelope";
  if (day === 7) return "golden-egg";
  return undefined;
}

function DayCard({
  day,
  locale,
  labels,
  claiming,
  onClaim,
}: {
  day: SignInDayView;
  locale: string;
  labels: ReturnType<typeof getSignInRewardMessages>;
  claiming: boolean;
  onClaim: () => void;
}) {
  const extra = dayExtra(day.day);
  const isCurrent = day.status === "current";
  const isClaimed = day.status === "claimed";
  const isLocked = day.status === "locked";

  let buttonLabel = labels.signInButton;
  let buttonClass =
    "focus-ring mt-2 rounded-full py-1.5 text-[13px] font-semibold text-white transition-transform ";
  let disabled = true;
  let onClick: (() => void) | undefined;

  if (isClaimed) {
    buttonLabel = labels.claimedButton;
    buttonClass += "cursor-default bg-[#23c97f]";
  } else if (isCurrent) {
    buttonClass += claiming
      ? "cursor-wait bg-[#c9ccd1]"
      : "bg-gradient-to-b from-[#ff7a4d] to-[#f0431f] active:scale-[0.97]";
    disabled = claiming;
    onClick = onClaim;
  } else {
    buttonClass += "cursor-not-allowed bg-[#c9ccd1]";
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      <div
        className={`py-1 text-center text-[13px] font-bold text-white ${
          isClaimed
            ? "bg-gradient-to-b from-[#23c97f] to-[#178358]"
            : isCurrent
              ? "bg-gradient-to-b from-[#4f8bff] to-[#2f63ea]"
              : "bg-gradient-to-b from-[#9ca3af] to-[#6b7280]"
        }`}
      >
        {labels.dayPrefix} {day.day}
      </div>
      <div className={`flex flex-1 flex-col px-2 pb-2.5 pt-2 ${isLocked ? "opacity-60" : ""}`}>
        <div className="flex items-center justify-center gap-0.5">
          <MoneyStackIcon />
          {extra === "red-envelope" ? <RedEnvelopeIcon /> : null}
          {extra === "golden-egg" ? <GoldenEggIcon /> : null}
        </div>
        <div className="mt-1 flex items-baseline justify-between gap-1">
          <span className="text-[12px] text-[#6b7280]">{labels.bonusLabel}</span>
          <span className="text-[13px] font-bold tabular-nums text-[#1c1c1c]">
            ৳ {formatBonusAmount(day.bonus, locale)}
          </span>
        </div>
        {extra === "red-envelope" ? (
          <p className="mt-0.5 text-[11px] leading-tight text-[#6b7280]">{labels.redEnvelopeNote}</p>
        ) : null}
        {extra === "golden-egg" ? (
          <p className="mt-0.5 text-[11px] leading-tight text-[#6b7280]">{labels.goldenEggNote}</p>
        ) : null}
        <button
          type="button"
          onClick={onClick}
          disabled={disabled || isLocked}
          className={buttonClass}
        >
          {claiming && isCurrent ? "…" : buttonLabel}
        </button>
      </div>
    </div>
  );
}

export default function SignInRewardPage() {
  const { session, refreshSession, refreshBalance } = useAuth();
  const { preferences } = useLocale();
  const { showToast } = useToast();
  const locale = preferences.locale;
  const s = getSignInRewardMessages(locale);

  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<NormalUserProfile | null>(null);
  const [status, setStatus] = useState<SignInRewardStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  const loadStatus = useCallback(async () => {
    setLoading(true);
    try {
      setStatus(await fetchSignInRewardStatus());
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Failed to load sign-in status", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  const displayId = mounted ? (session?.userName ?? session?.memberId ?? "—") : "—";
  const balanceDisplay = mounted ? formatBalance(session?.balance, locale) : "0.00";
  const avatarSrc = profile?.profileImg;

  const onClaim = useCallback(async () => {
    if (claiming || !status?.canClaimToday) return;
    if (!status.minimumDepositMet) {
      showToast(s.depositRequired, { variant: "error" });
      return;
    }

    setClaiming(true);
    try {
      const result = await claimSignInReward();
      showToast(`${s.claimSuccess} (+৳${formatBonusAmount(result.bonusAmount, locale)})`, {
        variant: "success",
      });
      await Promise.all([refreshBalance(), refreshSession()]);
      await loadStatus();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Sign-in failed", { variant: "error" });
    } finally {
      setClaiming(false);
    }
  }, [
    claiming,
    status,
    showToast,
    s.depositRequired,
    s.claimSuccess,
    locale,
    refreshBalance,
    refreshSession,
    loadStatus,
  ]);

  const checkInLabel = status?.claimedToday ? s.checkedInToday : s.notCheckedInToday;
  const minDepositDisplay = status?.minimumDepositRequired ?? 100;

  return (
    <div className="min-h-full bg-[#eef0f2]">
      <div className="mx-auto w-full max-w-lg">
        <header className="sticky top-0 z-30 bg-[#0e4c4c]">
          <div className="relative flex min-h-[52px] items-center justify-center px-3">
            <Link
              href={memberRewardCenterHref(locale)}
              aria-label={s.pageTitle}
              className="focus-ring absolute left-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-[#f5c542] transition-colors hover:bg-white/10"
            >
              <HeaderBackIcon />
            </Link>
            <h1 className="text-[18px] font-bold text-[#f5c542]">{s.pageTitle}</h1>
          </div>
        </header>

        <div className="relative overflow-hidden bg-gradient-to-br from-[#ffc14d] via-[#ff9a46] to-[#ff7a55] pb-16 pt-5">
          <span aria-hidden className="absolute -right-8 top-2 h-24 w-24 rounded-full bg-[#ffd87e]/60" />
          <span aria-hidden className="absolute right-16 top-14 h-10 w-10 rounded-full bg-[#ffd87e]/70" />
          <span aria-hidden className="absolute -left-10 bottom-0 h-28 w-28 rounded-full bg-[#ff8e5e]/60" />
          <div className="relative flex items-center gap-4 px-5">
            <div className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-full ring-[3px] ring-[#bfe3ff]">
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

        <div className="relative z-10 -mt-10 px-3">
          <div className="flex rounded-xl bg-white py-4 shadow-[0_4px_14px_rgba(0,0,0,0.08)]">
            <div className="flex flex-1 flex-col items-center gap-1 border-r border-[#e5e7eb]">
              <span className="text-[22px] font-extrabold tabular-nums text-[#2f63ea]">
                {loading ? "…" : (status?.lastClaimedDay ?? 0)}
              </span>
              <span className="text-[13px] text-[#6b7280]">{s.lastSignIn}</span>
            </div>
            <div className="flex flex-1 flex-col items-center gap-1">
              <span className="text-[22px] font-extrabold tabular-nums text-[#e02b1d]">
                {loading ? "…" : formatBonusAmount(status?.totalBonusClaimed ?? 0, locale)}
              </span>
              <span className="text-[13px] text-[#6b7280]">{s.signInTotalBonus}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-white px-4 py-4">
          <p className="text-center text-[14px] font-semibold text-[#2f63ea]">{s.planTitle}</p>

          <div className="mt-4 flex items-center gap-3">
            <GiftCoinsIcon />
            <div className="min-w-0">
              <p className="text-[15px] font-bold text-[#e02b1d]">{s.planTitle}</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-[#374151]">
                {checkInLabel}
                <QuestionBadge />
              </p>
            </div>
          </div>

          <div className="mt-3 rounded-lg bg-[#fdf3e7] px-4 py-3">
            <p className="text-[14px] text-[#6b7280]">{s.minimumDepositAmount}</p>
            <p className="mt-0.5 text-[15px] font-bold text-[#e02b1d]">
              ৳ {formatBonusAmount(minDepositDisplay, locale)}
            </p>
            {status && !status.minimumDepositMet ? (
              <p className="mt-1 text-[12px] text-[#e02b1d]">
                {s.depositRequired} ({formatBonusAmount(status.totalDeposit, locale)} /{" "}
                {formatBonusAmount(minDepositDisplay, locale)})
              </p>
            ) : null}
          </div>

          <p className="mt-2 text-[12px] text-[#6b7280]">{s.streakResetNote}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 px-3 pt-4">
          {(status?.days ?? Array.from({ length: 7 }, (_, i) => ({
            day: i + 1,
            bonus: [5, 10, 20, 20, 25, 30, 50][i] ?? 0,
            status: "locked" as const,
          }))).map((day) => (
            <DayCard
              key={day.day}
              day={day}
              locale={locale}
              labels={s}
              claiming={claiming}
              onClaim={() => void onClaim()}
            />
          ))}
        </div>

        <div className="px-4 pb-mobile-nav pt-6 lg:pb-10">
          <h2 className="text-[15px] font-semibold text-[#e02b1d]">{s.rulesTitle}</h2>
          <p className="mt-3 text-[17px] font-medium leading-relaxed text-[#1ca554]">
            {s.rulesBody}
          </p>
        </div>
      </div>
    </div>
  );
}
