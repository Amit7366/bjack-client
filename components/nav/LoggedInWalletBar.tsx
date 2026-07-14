"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useLocale } from "@/components/LocaleProvider";
import { formatDisplayBalance } from "@/lib/format-balance";
import { memberDepositHref, memberWithdrawHref } from "@/lib/member-routes";

function VipCoinIcon() {
  return (
    <span
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#f5d76e] to-[#b8860b] text-[8px] font-extrabold text-[#3d2800] shadow-sm"
      aria-hidden
    >
      VIP
    </span>
  );
}

function TakaIcon() {
  return (
    <span
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#178358] text-[13px] font-bold text-white"
      aria-hidden
    >
      ৳
    </span>
  );
}

function EyeIcon({ hidden }: { hidden: boolean }) {
  if (hidden) {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
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
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function RefreshIcon({ spinning }: { spinning: boolean }) {
  return (
    <svg
      width="16"
      height="16"
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

function DepositPlusIcon() {
  return (
    <span
      className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#22c55e] to-[#0d4a2e] shadow-md"
      aria-hidden
    >
      <span className="text-[20px] font-bold leading-none text-[#f5c518]">+</span>
      <svg
        className="absolute -bottom-0.5 left-1/2 h-3 w-5 -translate-x-1/2"
        viewBox="0 0 20 8"
        fill="none"
      >
        <path
          d="M2 6c4-4 12-4 16 0"
          stroke="#f5c518"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

function WithdrawMinusIcon() {
  return (
    <span
      className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#3a3a3a] to-[#1a1a1a] shadow-md ring-1 ring-[#555]"
      aria-hidden
    >
      <span className="text-[22px] font-bold leading-none text-[#f5c518]">−</span>
      <svg
        className="absolute -top-0.5 left-1/2 h-3 w-5 -translate-x-1/2 rotate-180"
        viewBox="0 0 20 8"
        fill="none"
      >
        <path
          d="M2 6c4-4 12-4 16 0"
          stroke="#f5c518"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

function maskValue(value: string, hidden: boolean): string {
  if (!hidden) return value;
  return "***********";
}

export default function LoggedInWalletBar() {
  const { session, refreshBalance, balanceSyncing } = useAuth();
  const { preferences, t } = useLocale();
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const depositHref = memberDepositHref(preferences.locale);
  const withdrawHref = memberWithdrawHref(preferences.locale);

  useEffect(() => {
    setMounted(true);
  }, []);

  const vipPoints = session?.vipPoints ?? "0";
  const balanceDisplay = mounted
    ? formatDisplayBalance(session?.balance, preferences.locale)
    : "0.00";

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshBalance();
    } finally {
      setRefreshing(false);
    }
  }, [refreshBalance]);

  return (
    <div className="flex items-center gap-1 sm:max-w-none sm:gap-2 [&::-webkit-scrollbar]:hidden">
      <div className="flex items-center gap-1 rounded-md bg-[#2a2a2a] px-1.5 py-1 sm:gap-1.5 sm:px-2 sm:py-1.5">
        <div className="hidden items-center gap-1 sm:flex sm:gap-1.5">
          <VipCoinIcon />
          <span className="min-w-[1ch] text-[12px] font-semibold text-white tabular-nums sm:text-[13px]">
            {maskValue(vipPoints, hidden)}
          </span>
        </div>

        <span className="mx-0.5 hidden h-5 w-px bg-[#444] sm:block" aria-hidden />

        <div className="flex items-center gap-1 sm:gap-1.5">
          <TakaIcon />
          <span className="max-w-[5.5rem] truncate text-[12px] font-semibold text-white tabular-nums sm:max-w-none sm:text-[13px]">
            {maskValue(balanceDisplay, hidden)}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setHidden((v) => !v)}
          className="focus-ring hidden h-7 w-7 items-center justify-center rounded text-[#9ca3af] transition-colors hover:text-white sm:flex"
          aria-label={hidden ? t.navbar.showBalance : t.navbar.hideBalance}
        >
          <EyeIcon hidden={hidden} />
        </button>

        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing || balanceSyncing}
          className="focus-ring flex h-7 w-7 shrink-0 items-center justify-center rounded text-[#9ca3af] transition-colors hover:text-white disabled:opacity-50"
          aria-label={t.navbar.refreshBalance}
        >
          <RefreshIcon spinning={refreshing || balanceSyncing} />
        </button>
      </div>

      <Link
        href={depositHref}
        className="focus-ring flex shrink-0 sm:hidden"
        aria-label={t.navbar.deposit}
      >
        <DepositPlusIcon />
      </Link>

      <Link
        href={withdrawHref}
        className="focus-ring flex shrink-0 sm:hidden"
        aria-label={t.navbar.withdraw}
      >
        <WithdrawMinusIcon />
      </Link>

      <Link
        href={depositHref}
        className="focus-ring hidden h-8 shrink-0 items-center justify-center rounded-md bg-[#178358] px-2.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#1a9664] sm:flex sm:h-9 sm:px-3 sm:text-[13px]"
      >
        {t.navbar.deposit}
      </Link>

      <Link
        href={withdrawHref}
        className="focus-ring hidden h-8 shrink-0 items-center justify-center rounded-md bg-[#2a2a2a] px-2.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#333] sm:flex sm:h-9 sm:px-3 sm:text-[13px]"
      >
        {t.navbar.withdraw}
      </Link>

      <Link
        href={depositHref}
        className="focus-ring hidden shrink-0 sm:flex"
        aria-label={t.navbar.deposit}
      >
        <DepositPlusIcon />
      </Link>
    </div>
  );
}
