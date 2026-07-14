"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useLocale } from "@/components/LocaleProvider";
import { getRescueFundMessages, type RescueFundItemId } from "@/lib/i18n/rescue-fund-messages";
import {
  memberRescueFundLossCompensationHref,
  memberRescueFundSportsHref,
  memberRewardCenterHref,
} from "@/lib/member-routes";
import { formatDisplayBalance } from "@/lib/format-balance";
import {
  fetchMyNormalUserProfile,
  type NormalUserProfile,
} from "@/lib/member/profile-api";
import { DefaultAvatarIcon, HeaderBackIcon } from "./MemberCenterIcons";

function TrophyIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 4h10v3a5 5 0 01-10 0V4z"
        fill="#3b82f6"
        stroke="#2563eb"
        strokeWidth="1.2"
      />
      <path d="M9 4H6.5a3 3 0 003 3M15 4h2.5a3 3 0 01-3 3" stroke="#2563eb" strokeWidth="1.2" />
      <path d="M12 12v3" stroke="#2563eb" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M9 18h6M10 15h4" stroke="#2563eb" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function LossCompensationIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3c3.5 2.5 7 4.2 7 8.5a7 7 0 11-14 0C5 7.2 8.5 5.5 12 3z"
        fill="#3b82f6"
        stroke="#2563eb"
        strokeWidth="1.2"
      />
      <path
        d="M9.5 11.5c.8 1.2 2 2 3.5 2.2 1.8.2 3.2-.4 4-1.2"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M10 8.5l1.2 1.8M14 8.5l-1.2 1.8" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function RowChevron() {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#dbeafe] text-[#3b82f6]">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <path
          d="M5 3.5L8.5 7 5 10.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

const RESCUE_FUND_ITEMS: RescueFundItemId[] = ["sports-cashback", "loss-compensation"];

function itemIcon(id: RescueFundItemId) {
  return id === "sports-cashback" ? <TrophyIcon /> : <LossCompensationIcon />;
}

export default function RescueFundPage() {
  const { session } = useAuth();
  const { preferences } = useLocale();
  const locale = preferences.locale;
  const labels = getRescueFundMessages(locale);

  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<NormalUserProfile | null>(null);

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

  const displayId = mounted ? (session?.userName ?? session?.memberId ?? "—") : "—";
  const balanceDisplay = mounted ? formatDisplayBalance(session?.balance, locale) : "0.00";
  const avatarSrc = profile?.profileImg;

  const itemLabels: Record<RescueFundItemId, string> = {
    "sports-cashback": labels.sportsCashback,
    "loss-compensation": labels.lossCompensation,
  };

  const itemHref = (id: RescueFundItemId): string => {
    if (id === "sports-cashback") return memberRescueFundSportsHref(locale);
    return memberRescueFundLossCompensationHref(locale);
  };

  return (
    <div className="min-h-full bg-gradient-to-b from-[#eef3f8] to-[#f7f9fc]">
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
          </div>
        </header>

        <div className="relative overflow-hidden bg-gradient-to-b from-[#4f8fe8] via-[#5ca0ef] to-[#8ec5f7] pb-20 pt-6">
          <span aria-hidden className="absolute -left-6 top-8 h-20 w-20 rounded-full bg-white/20" />
          <span aria-hidden className="absolute right-8 top-4 h-10 w-10 rounded-full bg-white/25" />
          <span aria-hidden className="absolute right-20 top-16 h-16 w-16 rounded-full bg-white/15" />
          <span aria-hidden className="absolute -right-4 bottom-6 h-24 w-24 rounded-full bg-white/20" />
          <span aria-hidden className="absolute left-16 bottom-2 h-8 w-8 rounded-full bg-white/25" />

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

        <div className="relative z-10 -mt-12 px-4 pb-mobile-nav lg:pb-10">
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
            {RESCUE_FUND_ITEMS.map((id, index) => (
              <Link
                key={id}
                href={itemHref(id)}
                className={`focus-ring flex items-center gap-3 px-4 py-4 transition-colors hover:bg-[#f8fafc] active:bg-[#f1f5f9] ${
                  index > 0 ? "border-t border-[#e8edf2]" : ""
                }`}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e8f2ff]">
                  {itemIcon(id)}
                </span>
                <span className="min-w-0 flex-1 text-[15px] font-medium text-[#1f2937]">
                  {itemLabels[id]}
                </span>
                <RowChevron />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
