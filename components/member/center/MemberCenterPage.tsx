"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useLocale } from "@/components/LocaleProvider";
import { useToast } from "@/components/ToastProvider";
import { copyTextToClipboard } from "@/lib/copy-text";
import {
  getMemberCenterMessages,
  type MemberCenterItemId,
} from "@/lib/i18n/member-center-messages";
import {
  memberDepositHref,
  memberProfitLossHref,
  memberRebateHref,
  memberRewardCenterHref,
  memberSectionHref,
  memberSignInRewardHref,
  memberSuggestionHref,
  memberWithdrawHref,
} from "@/lib/member-routes";
import { BKBAJI_ANDROID_APP_PATH } from "@/lib/seo/site-config";
import {
  fetchMyNormalUserProfile,
  type NormalUserProfile,
} from "@/lib/member/profile-api";
import {
  CopyIdIcon,
  DefaultAvatarIcon,
  EditPencilIcon,
  HeaderBackIcon,
  MemberCenterItemIcon,
  RefreshBalanceIcon,
  SignInEnvelopeIcon,
  SilverBadgeWatermark,
  VipMedalIcon,
} from "./MemberCenterIcons";

const GRID_ITEMS: MemberCenterItemId[] = [
  "reward-center",
  "betting-record",
  "profit-and-loss",
  "deposit-record",
  "withdrawal-record",
  "account-record",
  "my-account",
  "security-center",
  "invite-friends",
  "mission",
  "rebate",
  "internal-message",
  "suggestion",
  "download-app",
  "customer-service",
  "logout",
];

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

function formatJoinedDate(value?: string): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toISOString().slice(0, 10);
}

export default function MemberCenterPage() {
  const { session, refreshBalance, balanceSyncing, logout } = useAuth();
  const { preferences } = useLocale();
  const { showToast } = useToast();
  const router = useRouter();
  const locale = preferences.locale;
  const base = `/${locale}`;
  const m = getMemberCenterMessages(locale);

  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<NormalUserProfile | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

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
  const joined = mounted ? formatJoinedDate(profile?.createdAt) : "—";
  const balanceDisplay = mounted ? formatBalance(session?.balance, locale) : "0.00";
  const avatarSrc = profile?.profileImg;

  const onCopyId = useCallback(async () => {
    const value = session?.userName ?? session?.memberId;
    if (!value) return;
    const ok = await copyTextToClipboard(value);
    showToast(ok ? m.memberIdCopiedToast : m.copyFailedToast, {
      variant: ok ? "success" : "error",
    });
  }, [session?.userName, session?.memberId, m.memberIdCopiedToast, m.copyFailedToast, showToast]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshBalance();
    } finally {
      setRefreshing(false);
    }
  }, [refreshBalance]);

  const onComingSoon = useCallback(() => {
    showToast(m.comingSoonToast, { variant: "default" });
  }, [showToast, m.comingSoonToast]);

  const onLogout = useCallback(async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logout();
      router.replace(`${base}/login`);
      router.refresh();
    } catch {
      showToast(m.logoutFailedToast, { variant: "error" });
    } finally {
      setLoggingOut(false);
    }
  }, [loggingOut, logout, router, base, showToast, m.logoutFailedToast]);

  const itemHref = useCallback(
    (id: MemberCenterItemId): string | null => {
      switch (id) {
        case "reward-center":
          return memberRewardCenterHref(locale);
        case "betting-record":
          return memberSectionHref(locale, "betting-records");
        case "profit-and-loss":
          return memberProfitLossHref(locale);
        case "deposit-record":
        case "withdrawal-record":
        case "account-record":
          return memberSectionHref(locale, "transaction-records");
        case "my-account":
          return memberSectionHref(locale, "personal-info");
        case "security-center":
          return memberSectionHref(locale, "login-security");
        case "invite-friends":
          return memberSectionHref(locale, "my-referral");
        case "internal-message":
          return memberSectionHref(locale, "notification");
        case "rebate":
          return memberRebateHref(locale);
        case "suggestion":
          return memberSuggestionHref(locale);
        default:
          return null;
      }
    },
    [locale],
  );

  return (
    <div className="min-h-full bg-[#f2f3f5]">
      <div className="mx-auto w-full max-w-lg">
        {/* Dark page header */}
        <div className="bg-gradient-to-b from-[#241d15] to-[#3b3127] pb-16">
          <div className="relative flex min-h-[52px] items-center justify-center px-3">
            <Link
              href={base}
              aria-label={m.pageTitle}
              className="focus-ring absolute left-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-white transition-colors hover:bg-white/10"
            >
              <HeaderBackIcon />
            </Link>
            <h1 className="text-[18px] font-bold text-white">{m.pageTitle}</h1>
          </div>
        </div>

        {/* Account card */}
        <div className="relative z-10 -mt-14 px-3">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-white to-[#eef1f5] shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
            {/* Sign-in ribbon */}
            <Link
              href={memberSignInRewardHref(locale)}
              className="focus-ring absolute right-0 top-0 z-20 flex items-center gap-1.5 rounded-tr-2xl rounded-bl-xl bg-gradient-to-r from-[#e02b1d] to-[#c01a0e] py-1.5 pl-5 pr-2.5 text-[13px] font-semibold text-white [clip-path:polygon(14px_0,100%_0,100%_100%,0_100%)]"
            >
              <SignInEnvelopeIcon />
              {m.signIn}
              <span aria-hidden className="text-white/90">
                ›
              </span>
            </Link>

            {/* Silver badge watermark */}
            <div className="pointer-events-none absolute -right-2 top-8 z-0" aria-hidden>
              <SilverBadgeWatermark />
            </div>

            <div className="relative z-10 px-4 pb-4 pt-9">
              <div className="flex gap-3.5">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-md">
                  {avatarSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarSrc} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <DefaultAvatarIcon />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-b from-[#5a6470] to-[#39414c] px-2.5 py-0.5 text-[11px] font-bold text-white">
                    <VipMedalIcon />
                    VIP0
                  </span>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="truncate text-[18px] font-extrabold text-[#1c1c1c]">
                      {displayId}
                    </span>
                    <button
                      type="button"
                      onClick={() => void onCopyId()}
                      aria-label={m.copyMemberId}
                      className="focus-ring shrink-0 rounded p-1 transition-colors hover:bg-black/5"
                    >
                      <CopyIdIcon />
                    </button>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[13px] text-[#4b5563]">
                    <span className="truncate">
                      {m.nicknameLabel}: {nickname}
                    </span>
                    <Link
                      href={memberSectionHref(locale, "personal-info")}
                      aria-label={m.editNickname}
                      className="focus-ring shrink-0 rounded p-0.5 text-[#6b7280] transition-colors hover:bg-black/5 hover:text-[#374151]"
                    >
                      <EditPencilIcon />
                    </Link>
                  </div>
                  <p className="mt-0.5 text-[13px] text-[#4b5563]">
                    {m.joinedLabel}: {joined}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-[24px] font-extrabold tabular-nums text-[#1c1c1c]">
                  ৳ {balanceDisplay}
                </span>
                <button
                  type="button"
                  onClick={() => void onRefresh()}
                  disabled={refreshing || balanceSyncing}
                  aria-label={m.refreshBalance}
                  className="focus-ring rounded-full p-2 text-[#4b5563] transition-colors hover:bg-black/5 hover:text-[#1c1c1c] disabled:opacity-50"
                >
                  <RefreshBalanceIcon spinning={refreshing || balanceSyncing} />
                </button>
              </div>

              <div className="mt-3 flex gap-2.5">
                <Link
                  href={memberDepositHref(locale)}
                  className="focus-ring flex min-h-10 flex-1 items-center justify-center rounded-full border border-[#dfe3e8] bg-gradient-to-b from-white to-[#e8ebef] text-[14px] font-semibold text-[#1f2937] shadow-sm transition-colors hover:to-[#dde1e6]"
                >
                  {m.deposit}
                </Link>
                <Link
                  href={memberWithdrawHref(locale)}
                  className="focus-ring flex min-h-10 flex-1 items-center justify-center rounded-full border border-[#dfe3e8] bg-gradient-to-b from-white to-[#e8ebef] text-[14px] font-semibold text-[#1f2937] shadow-sm transition-colors hover:to-[#dde1e6]"
                >
                  {m.withdrawal}
                </Link>
                <Link
                  href={memberSectionHref(locale, "add-wallet")}
                  className="focus-ring flex min-h-10 flex-1 items-center justify-center rounded-full border border-[#dfe3e8] bg-gradient-to-b from-white to-[#e8ebef] text-[14px] font-semibold text-[#1f2937] shadow-sm transition-colors hover:to-[#dde1e6]"
                >
                  {m.myCards}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Member Center label */}
        <div className="relative mt-5 flex items-center px-3">
          <span className="z-10 rounded-full bg-white px-3.5 py-1 text-[12px] font-semibold text-[#374151] shadow-sm">
            {m.memberCenter}
          </span>
          <span className="absolute inset-x-3 top-1/2 h-px bg-[#e2e5e9]" aria-hidden />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-4 gap-x-1 gap-y-6 px-2 pb-mobile-nav pt-5 lg:pb-10">
          {GRID_ITEMS.map((id) => {
            const href = itemHref(id);
            const inner = (
              <>
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#fcf2dd]">
                  <MemberCenterItemIcon name={id} />
                </span>
                <span className="text-center text-[13px] font-medium leading-tight text-[#333]">
                  {m.items[id]}
                </span>
              </>
            );
            const className =
              "focus-ring flex flex-col items-center gap-2 rounded-lg px-0.5 py-1 transition-opacity active:opacity-70";

            if (href) {
              return (
                <Link key={id} href={href} className={className}>
                  {inner}
                </Link>
              );
            }
            if (id === "download-app") {
              return (
                <a
                  key={id}
                  href={BKBAJI_ANDROID_APP_PATH}
                  download
                  className={className}
                >
                  {inner}
                </a>
              );
            }
            if (id === "logout") {
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => void onLogout()}
                  disabled={loggingOut}
                  className={`${className} disabled:opacity-50`}
                >
                  {inner}
                </button>
              );
            }
            return (
              <button
                key={id}
                type="button"
                onClick={onComingSoon}
                className={className}
              >
                {inner}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
