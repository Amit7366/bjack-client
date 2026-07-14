"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useLocale } from "@/components/LocaleProvider";
import { useToast } from "@/components/ToastProvider";
import { getBonusRewardMessages } from "@/lib/i18n/bonus-reward-messages";
import { formatDisplayBalance } from "@/lib/format-balance";
import { memberRewardCenterHref } from "@/lib/member-routes";
import {
  fetchMyNormalUserProfile,
  type NormalUserProfile,
} from "@/lib/member/profile-api";
import {
  claimRewardOffer,
  fetchRewardOffers,
  pickLocalizedText,
  remainingFromMs,
  type RewardOfferCriteriaType,
  type RewardOfferView,
} from "@/lib/reward-offers-api";
import { DefaultAvatarIcon, HeaderBackIcon } from "./MemberCenterIcons";

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

function criteriaProgressLabel(
  type: RewardOfferCriteriaType,
  progress: { current: number; required: number },
  labels: ReturnType<typeof getBonusRewardMessages>,
  locale: string,
): string {
  const current = formatBonus(progress.current, locale);
  const required = formatBonus(progress.required, locale);
  switch (type) {
    case "daily_deposit":
      return `${labels.depositToday}: ৳${current} / ৳${required}`;
    case "total_deposit":
      return `${labels.totalDeposit}: ৳${current} / ৳${required}`;
    case "referral":
      return `${labels.referFriends}: ${progress.current} / ${progress.required}`;
    default:
      return "";
  }
}

type OfferCardProps = {
  offer: RewardOfferView;
  locale: string;
  labels: ReturnType<typeof getBonusRewardMessages>;
  tick: number;
  claiming: boolean;
  onClaim: (offerId: string) => void;
};

function OfferCard({ offer, locale, labels, tick, claiming, onClaim }: OfferCardProps) {
  const title = pickLocalizedText(offer.title, locale as "en" | "bn" | "hi");
  const description = pickLocalizedText(offer.description, locale as "en" | "bn" | "hi");

  const countdown = useMemo(() => {
    if (offer.canClaim) {
      return { days: 0, clock: "00:00:00" };
    }
    if (offer.nextClaimAt) {
      const remaining = Math.max(0, new Date(offer.nextClaimAt).getTime() - tick);
      return remainingFromMs(remaining);
    }
    return remainingFromMs(offer.remainingMs);
  }, [offer, tick]);

  const dueDateLabel = useMemo(() => {
    if (offer.canClaim) return formatDueDate(new Date().toISOString(), locale);
    return formatDueDate(offer.nextClaimAt, locale);
  }, [offer, locale]);

  const onCooldown = !offer.canClaim && (offer.remainingMs > 0 || offer.nextClaimAt !== null);
  const buttonEnabled = offer.canClaim && !claiming;

  return (
    <div className="relative flex overflow-hidden bg-gradient-to-r from-[#fdf1e7] via-[#fbeadd] to-white shadow-sm">
      <DonutDecor className="left-[42%] -top-5 h-12 w-12" />
      <DonutDecor className="left-[55%] bottom-1 h-7 w-7 border-[5px]" />
      <DonutDecor className="left-2 -bottom-4 h-9 w-9 border-[6px]" />

      <div className="relative z-10 my-4 ml-3 flex w-[124px] shrink-0 flex-col items-center justify-center gap-0.5 rounded-lg bg-gradient-to-b from-[#ff5f3d] to-[#ef2722] px-2 py-3.5 text-center text-white shadow-md">
        <span className="text-[12px] font-bold leading-tight">{labels.voucherTitle}</span>
        <span className="text-[12px] font-semibold leading-tight">
          ৳ {formatBonus(offer.bonusAmount, locale)}
        </span>
        <span className="text-[12px] font-semibold leading-tight">{dueDateLabel}</span>
      </div>

      <div className="relative z-10 flex min-w-0 flex-1 flex-col justify-center gap-1 px-3 py-4">
        <p className="text-[13px] text-[#6b7280]">{labels.rewardLabel}</p>
        <p className="truncate text-[14px] font-semibold text-[#1c1c1c]">{title}</p>
        <p className="mt-0.5 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#eceef1] px-2.5 py-1 text-[12px] text-[#4b5563]">
          {description}
          <InfoBadge />
        </p>
        {offer.criteriaProgress && offer.criteriaType !== "none" ? (
          <p
            className={`mt-1 text-[12px] ${offer.criteriaMet ? "text-[#16a34a]" : "text-[#dc2626]"}`}
          >
            {criteriaProgressLabel(offer.criteriaType, offer.criteriaProgress, labels, locale)}
          </p>
        ) : null}
        {!offer.criteriaMet ? (
          <p className="text-[12px] text-[#dc2626]">{labels.criteriaNotMet}</p>
        ) : null}
        {offer.totalClaimed > 0 ? (
          <p className="mt-1 text-[12px] text-[#6b7280]">
            Total claimed: ৳ {formatBonus(offer.totalClaimed, locale)}
          </p>
        ) : null}
      </div>

      <div className="relative z-10 flex w-[104px] shrink-0 flex-col items-center justify-center gap-0.5 bg-white px-2 py-3">
        <span className="text-[12px] text-[#9ca3af]">
          {offer.canClaim ? labels.dueDate : labels.cooldownNote}
        </span>
        <span className="text-[#1c1c1c]">
          <span className="text-[26px] font-extrabold leading-none tabular-nums">
            {offer.canClaim ? 0 : countdown.days}
          </span>
          <span className="ml-0.5 text-[11px] font-semibold">{labels.dayUnit}</span>
        </span>
        <span className="text-[12px] font-medium tabular-nums text-[#374151]">
          {offer.canClaim ? "00:00:00" : countdown.clock}
        </span>
        <button
          type="button"
          onClick={() => onClaim(offer.id)}
          disabled={!buttonEnabled}
          className={`focus-ring mt-1.5 w-full rounded-full py-1.5 text-[13px] font-semibold text-white shadow-sm transition-transform ${
            buttonEnabled
              ? "bg-gradient-to-b from-[#52d61f] to-[#2fae0a] active:scale-[0.97]"
              : "cursor-not-allowed bg-[#c9ccd1]"
          }`}
        >
          {claiming ? "…" : offer.canClaim ? labels.claim : onCooldown ? labels.claimed : labels.criteriaNotMet}
        </button>
      </div>
    </div>
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
  const [offers, setOffers] = useState<RewardOfferView[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [tick, setTick] = useState(() => Date.now());

  const loadOffers = useCallback(async () => {
    setLoading(true);
    try {
      setOffers(await fetchRewardOffers());
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Failed to load bonus offers", { variant: "error" });
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
    void loadOffers();
  }, [loadOffers]);

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
  const balanceDisplay = mounted ? formatDisplayBalance(session?.balance, locale) : "0.00";
  const avatarSrc = profile?.profileImg;

  const onClaim = useCallback(
    async (offerId: string) => {
      const offer = offers.find((o) => o.id === offerId);
      if (!offer?.canClaim || claimingId) return;

      setClaimingId(offerId);
      try {
        const result = await claimRewardOffer(offerId);
        showToast(
          `${b.claimSuccess} (+৳${formatBonus(result.bonusAmount, locale)})`,
          { variant: "success" },
        );
        await Promise.all([refreshBalance(), refreshSession()]);
        await loadOffers();
      } catch (e) {
        showToast(e instanceof Error ? e.message : "Claim failed", { variant: "error" });
      } finally {
        setClaimingId(null);
      }
    },
    [offers, claimingId, showToast, b.claimSuccess, locale, refreshBalance, refreshSession, loadOffers],
  );

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
          {loading && offers.length === 0 ? (
            <p className="px-4 py-8 text-center text-[14px] text-[#6b7280]">…</p>
          ) : offers.length > 0 ? (
            offers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                locale={locale}
                labels={b}
                tick={tick}
                claiming={claimingId === offer.id}
                onClaim={(id) => void onClaim(id)}
              />
            ))
          ) : (
            <p className="px-4 py-8 text-center text-[14px] text-[#6b7280]">{b.noBonus}</p>
          )}
        </div>
      </div>
    </div>
  );
}
