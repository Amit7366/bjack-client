"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useLocale } from "@/components/LocaleProvider";
import { useToast } from "@/components/ToastProvider";
import { copyTextToClipboard } from "@/lib/copy-text";
import { getMemberCenterMessages } from "@/lib/i18n/member-center-messages";
import { getRewardCenterMessages } from "@/lib/i18n/reward-center-messages";
import {
  memberBonusRewardHref,
  memberSectionHref,
  memberSignInRewardHref,
} from "@/lib/member-routes";
import {
  fetchMyNormalUserProfile,
  type NormalUserProfile,
} from "@/lib/member/profile-api";
import {
  CopyIdIcon,
  DefaultAvatarIcon,
  EditPencilIcon,
  HeaderBackIcon,
  RefreshBalanceIcon,
  SignInEnvelopeIcon,
} from "./MemberCenterIcons";

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

function CrownIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M3 7l3.5 3L10 5l3.5 5L17 7l-1.5 8h-11L3 7z"
        fill="#6b7280"
      />
      <rect x="4.5" y="15.5" width="11" height="1.6" rx="0.8" fill="#6b7280" />
    </svg>
  );
}

function BenefitsChevron() {
  return (
    <span
      aria-hidden
      className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#374151] text-[10px] font-bold leading-none text-white"
    >
      ›
    </span>
  );
}

function GiftTileIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden>
      <rect x="6" y="13" width="20" height="14" rx="2" fill="#22b95f" />
      <rect x="4.5" y="9" width="23" height="5.5" rx="1.5" fill="#1ca554" />
      <path d="M16 9v18" stroke="#fff" strokeWidth="2" />
      <path
        d="M16 9c-2.8 0-5-1.3-5-3.1S13.2 3 16 5c2.8-2 5-1 5 .9S18.8 9 16 9z"
        stroke="#1ca554"
        strokeWidth="1.8"
        fill="#fff"
      />
    </svg>
  );
}

function SignInTileIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden>
      <rect x="5" y="6" width="22" height="21" rx="3" fill="#3f7af0" />
      <path d="M5 11h22" stroke="#fff" strokeWidth="1.6" opacity="0.7" />
      <path d="M10.5 4v4M21.5 4v4" stroke="#3f7af0" strokeWidth="2.2" strokeLinecap="round" />
      <path
        d="M11.5 18.5l3.2 3.2 6-6"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RescueFundTileIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden>
      <ellipse cx="14" cy="24" rx="9" ry="3.4" fill="#f59f1b" />
      <ellipse cx="14" cy="19.5" rx="9" ry="3.4" fill="#fbb03b" />
      <ellipse cx="14" cy="15" rx="9" ry="3.4" fill="#f59f1b" />
      <ellipse cx="14" cy="10.5" rx="9" ry="3.4" fill="#fbb03b" />
      <ellipse cx="14" cy="9.5" rx="9" ry="3.2" fill="#ffd87a" />
      <circle cx="23.5" cy="22" r="6" fill="#f08c0c" stroke="#fff" strokeWidth="1.4" />
      <path
        d="M25 19.8h-2.2a1.1 1.1 0 000 2.2h1.4a1.1 1.1 0 010 2.2H22M23.5 18.8v6.4"
        stroke="#fff"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function InviteTileIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden>
      <circle cx="13" cy="11" r="5" fill="#e2476f" />
      <path
        d="M4.5 25.5c1.5-4.5 4.7-6.8 8.5-6.8s7 2.3 8.5 6.8"
        fill="#e2476f"
      />
      <circle cx="23.5" cy="20" r="5.5" fill="#d63461" stroke="#fff" strokeWidth="1.4" />
      <path d="M23.5 17.5v5M21 20h5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function PromoCodeTileIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden>
      <path
        d="M16 3.5l2.7 2 3.3-.6 1.2 3.1 3.1 1.2-.6 3.3 2 2.7-2 2.7.6 3.3-3.1 1.2-1.2 3.1-3.3-.6-2.7 2-2.7-2-3.3.6-1.2-3.1-3.1-1.2.6-3.3-2-2.7 2-2.7-.6-3.3 3.1-1.2 1.2-3.1 3.3.6 2.7-2z"
        fill="#13b5c4"
      />
      <path d="M12.5 19.5l7-7" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12.8" cy="12.8" r="1.7" fill="#fff" />
      <circle cx="19.2" cy="19.2" r="1.7" fill="#fff" />
    </svg>
  );
}

function TileDots({ className }: { className: string }) {
  return (
    <svg width="40" height="28" viewBox="0 0 40 28" fill="none" aria-hidden className={className}>
      {Array.from({ length: 3 }).flatMap((_, r) =>
        Array.from({ length: 5 }).map((_, c) => (
          <circle key={`${r}-${c}`} cx={4 + c * 8} cy={4 + r * 9} r="1.5" fill="currentColor" />
        )),
      )}
    </svg>
  );
}

type TileId = "bonus" | "sign-in" | "rescue-fund" | "invite-friends" | "promo-code";

const TILE_STYLE: Record<TileId, string> = {
  bonus: "bg-gradient-to-br from-[#4fd97f] to-[#1cab57]",
  "sign-in": "bg-gradient-to-br from-[#5f97ff] to-[#2f63ea]",
  "rescue-fund": "bg-gradient-to-br from-[#ffc94f] to-[#ff9326]",
  "invite-friends": "bg-gradient-to-br from-[#ef6a90] to-[#c92e5d]",
  "promo-code": "bg-gradient-to-br from-[#35d3cd] to-[#0aa9c4]",
};

function tileIcon(id: TileId) {
  switch (id) {
    case "bonus":
      return <GiftTileIcon />;
    case "sign-in":
      return <SignInTileIcon />;
    case "rescue-fund":
      return <RescueFundTileIcon />;
    case "invite-friends":
      return <InviteTileIcon />;
    case "promo-code":
      return <PromoCodeTileIcon />;
  }
}

export default function RewardCenterPage() {
  const { session, refreshBalance, balanceSyncing } = useAuth();
  const { preferences } = useLocale();
  const { showToast } = useToast();
  const locale = preferences.locale;
  const base = `/${locale}`;
  const r = getRewardCenterMessages(locale);
  const mc = getMemberCenterMessages(locale);

  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<NormalUserProfile | null>(null);
  const [refreshing, setRefreshing] = useState(false);

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
  const nickname = mounted ? (profile?.name || session?.userName || "—") : "—";
  const balanceDisplay = mounted ? formatBalance(session?.balance, locale) : "0.00";
  const avatarSrc = profile?.profileImg;

  const onCopyId = useCallback(async () => {
    const value = session?.userName ?? session?.memberId;
    if (!value) return;
    const ok = await copyTextToClipboard(value);
    showToast(ok ? mc.memberIdCopiedToast : mc.copyFailedToast, {
      variant: ok ? "success" : "error",
    });
  }, [session?.userName, session?.memberId, mc.memberIdCopiedToast, mc.copyFailedToast, showToast]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshBalance();
    } finally {
      setRefreshing(false);
    }
  }, [refreshBalance]);

  const onComingSoon = useCallback(() => {
    showToast(mc.comingSoonToast, { variant: "default" });
  }, [showToast, mc.comingSoonToast]);

  const tileLabels: Record<TileId, string> = {
    bonus: r.bonus,
    "sign-in": r.signIn,
    "rescue-fund": r.rescueFund,
    "invite-friends": r.inviteFriends,
    "promo-code": r.promoCode,
  };

  const tiles: TileId[] = ["bonus", "sign-in", "rescue-fund", "invite-friends", "promo-code"];

  return (
    <div className="min-h-full bg-[#eef0f2]">
      <div className="mx-auto w-full max-w-lg">
        {/* Orange hero */}
        <div className="relative h-52 overflow-hidden bg-gradient-to-br from-[#ff8a3d] via-[#fa5f2c] to-[#ef3d1d]">
          <span
            aria-hidden
            className="absolute left-4 top-8 select-none text-[64px] font-black uppercase leading-none tracking-wide text-white/15"
          >
            Reward
          </span>
          <span
            aria-hidden
            className="absolute -right-10 -top-12 h-44 w-44 rounded-full bg-[#ff9c55]/70"
          />
          <span
            aria-hidden
            className="absolute -left-14 top-20 h-40 w-40 rounded-full bg-[#ff7a3a]/60"
          />
          <span
            aria-hidden
            className="absolute right-12 top-24 h-16 w-16 rounded-full bg-[#ffb077]/70"
          />
          <Link
            href={`${base}/member`}
            aria-label={r.pageTitle}
            className="focus-ring absolute left-2 top-2 z-10 rounded-md p-1.5 text-white transition-colors hover:bg-white/15"
          >
            <HeaderBackIcon />
          </Link>
        </div>

        {/* Account card */}
        <div className="relative z-10 -mt-24 px-3">
          <div className="relative overflow-hidden rounded-2xl border border-white/70 bg-gradient-to-b from-white via-[#f2f4f7] to-[#e9ecf1] shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
            <Link
              href={memberSignInRewardHref(locale)}
              className="focus-ring absolute right-0 top-0 z-20 flex items-center gap-1.5 rounded-tr-2xl rounded-bl-xl bg-gradient-to-r from-[#e02b1d] to-[#c01a0e] py-1.5 pl-5 pr-2.5 text-[13px] font-semibold text-white [clip-path:polygon(14px_0,100%_0,100%_100%,0_100%)]"
            >
              <SignInEnvelopeIcon />
              {r.signIn}
              <span aria-hidden className="text-white/90">
                ›
              </span>
            </Link>

            <div className="relative z-10 px-4 pb-4 pt-9">
              <div className="flex gap-3">
                <div className="h-16 w-16 shrink-0 self-center overflow-hidden rounded-full ring-2 ring-[#d9b15c] shadow-md">
                  {avatarSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarSrc} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <DefaultAvatarIcon />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-[17px] font-extrabold text-[#1c1c1c]">
                      {displayId}
                    </span>
                    <button
                      type="button"
                      onClick={() => void onCopyId()}
                      aria-label={mc.copyMemberId}
                      className="focus-ring shrink-0 rounded p-1 transition-colors hover:bg-black/5"
                    >
                      <CopyIdIcon />
                    </button>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[13px] text-[#4b5563]">
                    <span className="truncate">
                      {r.nicknameLabel}: {nickname}
                    </span>
                    <Link
                      href={memberSectionHref(locale, "personal-info")}
                      aria-label={mc.editNickname}
                      className="focus-ring shrink-0 rounded p-0.5 text-[#6b7280] transition-colors hover:bg-black/5 hover:text-[#374151]"
                    >
                      <EditPencilIcon />
                    </Link>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1">
                    <span className="text-[19px] font-extrabold tabular-nums text-[#1c1c1c]">
                      ৳ {balanceDisplay}
                    </span>
                    <button
                      type="button"
                      onClick={() => void onRefresh()}
                      disabled={refreshing || balanceSyncing}
                      aria-label={mc.refreshBalance}
                      className="focus-ring rounded-full p-1 text-[#374151] transition-colors hover:bg-black/5 disabled:opacity-50"
                    >
                      <RefreshBalanceIcon spinning={refreshing || balanceSyncing} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-[14px] font-semibold text-[#6b7280]">
                  <CrownIcon />
                  VIP0
                </span>
                <span className="flex items-center gap-1.5 text-[14px] font-semibold text-[#1f2937]">
                  {r.benefits}
                  <BenefitsChevron />
                </span>
              </div>

              <p className="mt-1.5 text-right text-[12px] font-medium text-[#6b7280]">0 / 1</p>
              <div className="mt-1 h-2 w-full rounded-full bg-[#d7dade]" aria-hidden />
            </div>
          </div>
        </div>

        {/* Reward tiles */}
        <div className="grid grid-cols-2 gap-4 px-4 pb-mobile-nav pt-6 lg:pb-10">
          {tiles.map((id) => {
            const inner = (
              <>
                <TileDots className="absolute left-3 top-3 text-white/30" />
                <span
                  aria-hidden
                  className="absolute right-3 top-3 text-[16px] font-bold text-white/40"
                >
                  +
                </span>
                <span
                  aria-hidden
                  className="absolute bottom-3 right-4 text-[13px] font-black tracking-tighter text-white/35"
                >
                  »»
                </span>
                <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                  {tileIcon(id)}
                </span>
                <span className="relative text-[15px] font-semibold text-white">
                  {tileLabels[id]}
                </span>
              </>
            );
            const className = `focus-ring relative flex h-[150px] flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl shadow-md transition-transform active:scale-[0.98] ${TILE_STYLE[id]}`;

            if (id === "invite-friends") {
              return (
                <Link key={id} href={memberSectionHref(locale, "my-referral")} className={className}>
                  {inner}
                </Link>
              );
            }
            if (id === "sign-in") {
              return (
                <Link key={id} href={memberSignInRewardHref(locale)} className={className}>
                  {inner}
                </Link>
              );
            }
            if (id === "bonus") {
              return (
                <Link key={id} href={memberBonusRewardHref(locale)} className={className}>
                  {inner}
                </Link>
              );
            }
            return (
              <button key={id} type="button" onClick={onComingSoon} className={className}>
                {inner}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
