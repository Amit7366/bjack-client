"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useLocale } from "@/components/LocaleProvider";
import { formatDisplayBalance } from "@/lib/format-balance";
import { getProfileMessages } from "@/lib/i18n/profile-messages";
import { memberDepositHref, memberSectionHref, memberWithdrawHref } from "@/lib/member-routes";
import { ChevronRight } from "./ProfileMenuIcons";

function TakaIcon() {
  return (
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#178358] text-[14px] font-bold text-white"
      aria-hidden
    >
      ৳
    </span>
  );
}

function VipIcon() {
  return (
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#f5d76e] to-[#b8860b] text-[9px] font-extrabold text-[#3d2800]"
      aria-hidden
    >
      VP
    </span>
  );
}

function EyeIcon({ hidden }: { hidden: boolean }) {
  if (hidden) {
    return (
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M2 2l12 12M6.7 6.8A2 2 0 018.9 9.1M4.1 4.3C2.8 5.2 1.7 6.4 1 8c1.5 3 4.6 5 7 5 1.1 0 2.1-.3 3-.8M11.4 11.1c-.9.5-1.9.9-3.4.9-2.4 0-5.5-2-7-5 .6-1.1 1.4-2.1 2.4-2.9"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function RefreshIcon({ spinning }: { spinning: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={spinning ? "animate-spin" : undefined}
    >
      <path
        d="M13 3v3H10M3 13V10H6M13 3a5.5 5.5 0 00-9.2-1.2M3 13a5.5 5.5 0 009.2 1.2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function maskValue(value: string, hidden: boolean): string {
  if (!hidden) return value;
  return "***********";
}


type Props = {
  onNavigate?: () => void;
};

export default function ProfileWalletSection({ onNavigate }: Props) {
  const { session, refreshBalance, balanceSyncing } = useAuth();
  const { preferences, t } = useLocale();
  const locale = preferences.locale;
  const p = getProfileMessages(locale);
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const depositHref = memberDepositHref(locale);
  const withdrawHref = memberWithdrawHref(locale);
  const vipHref = memberSectionHref(locale, "my-vip");

  useEffect(() => {
    setMounted(true);
  }, []);

  const balanceDisplay = mounted
    ? formatDisplayBalance(session?.balance, locale)
    : "0.00";
  const vipPoints = session?.vipPoints ?? "0";

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshBalance();
    } finally {
      setRefreshing(false);
    }
  }, [refreshBalance]);

  return (
    <div className="space-y-3 border-b border-[#2a2a2a] px-4 pb-4 pt-1">
      <div className="grid grid-cols-2 gap-2">
        <Link
          href={withdrawHref}
          onClick={onNavigate}
          className="focus-ring flex min-h-11 items-center justify-center rounded-md border border-[#555] bg-transparent text-[15px] font-semibold text-white transition-colors hover:border-[#777] hover:bg-white/5"
        >
          {p.withdraw}
        </Link>
        <Link
          href={depositHref}
          onClick={onNavigate}
          className="focus-ring flex min-h-11 items-center justify-center rounded-md bg-[#178358] text-[15px] font-semibold text-white transition-colors hover:bg-[#1a9664]"
        >
          {p.deposit}
        </Link>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-[#2d4a3a] bg-gradient-to-b from-[#1a4d35]/90 via-[#141414] to-[#121212] p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[14px] font-medium text-[#d4d4d4]">{p.mainWallet}</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setHidden((v) => !v)}
              className="focus-ring flex h-8 w-8 items-center justify-center rounded text-[#9ca3af] hover:text-white"
              aria-label={hidden ? t.navbar.showBalance : t.navbar.hideBalance}
            >
              <EyeIcon hidden={hidden} />
            </button>
            <button
              type="button"
              onClick={() => void onRefresh()}
              disabled={refreshing || balanceSyncing}
              className="focus-ring flex h-8 w-8 items-center justify-center rounded text-[#9ca3af] hover:text-white disabled:opacity-50"
              aria-label={t.navbar.refreshBalance}
            >
              <RefreshIcon spinning={refreshing || balanceSyncing} />
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2.5">
          <TakaIcon />
          <span className="text-[22px] font-bold tabular-nums tracking-wide text-white">
            {maskValue(balanceDisplay, hidden)}
          </span>
        </div>

        <p className="mt-4 text-[13px] text-[#9ca3af]">{p.vipPoints}</p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <VipIcon />
            <span className="text-[18px] font-bold tabular-nums text-white">
              {maskValue(vipPoints, hidden)}
            </span>
          </div>
          <Link
            href={vipHref}
            onClick={onNavigate}
            className="focus-ring inline-flex items-center gap-1 rounded-full bg-[#e8e8e8] px-3 py-1 text-[12px] font-semibold text-[#1a1a1a] transition-colors hover:bg-white"
          >
            {p.vipStatusNormal}
            <ChevronRight />
          </Link>
        </div>
      </div>
    </div>
  );
}
