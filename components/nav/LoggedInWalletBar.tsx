"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useLocale } from "@/components/LocaleProvider";

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

function DepositBadgeIcon() {
  return (
    <span
      className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#22c55e] to-[#0d4a2e] shadow-md"
      aria-hidden
    >
      <span className="text-[18px] font-bold leading-none text-[#f5c518]">+</span>
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

function maskValue(value: string, hidden: boolean): string {
  if (!hidden) return value;
  return "***********";
}

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

export default function LoggedInWalletBar() {
  const { session, refreshBalance } = useAuth();
  const { preferences, t } = useLocale();
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const vipPoints = session?.vipPoints ?? "0";
  const balanceDisplay = mounted
    ? formatBalance(session?.balance, preferences.locale)
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
    <div className="flex max-w-[min(72vw,520px)] items-center gap-1 overflow-x-auto [-webkit-overflow-scrolling:touch] [scrollbar-width:none] sm:max-w-none sm:gap-2 sm:overflow-visible [&::-webkit-scrollbar]:hidden">
      <div className="flex items-center gap-1 rounded-md bg-[#2a2a2a] px-1.5 py-1 sm:gap-1.5 sm:px-2 sm:py-1.5">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <VipCoinIcon />
          <span className="min-w-[1ch] text-[12px] font-semibold text-white tabular-nums sm:text-[13px]">
            {maskValue(vipPoints, hidden)}
          </span>
        </div>

        <span className="mx-0.5 h-5 w-px bg-[#444]" aria-hidden />

        <div className="flex items-center gap-1 sm:gap-1.5">
          <TakaIcon />
          <span className="min-w-[2ch] text-[12px] font-semibold text-white tabular-nums sm:text-[13px]">
            {maskValue(balanceDisplay, hidden)}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setHidden((v) => !v)}
          className="focus-ring flex h-7 w-7 items-center justify-center rounded text-[#9ca3af] transition-colors hover:text-white"
          aria-label={hidden ? t.navbar.showBalance : t.navbar.hideBalance}
        >
          <EyeIcon hidden={hidden} />
        </button>

        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="focus-ring flex h-7 w-7 items-center justify-center rounded text-[#9ca3af] transition-colors hover:text-white disabled:opacity-50"
          aria-label={t.navbar.refreshBalance}
        >
          <RefreshIcon spinning={refreshing} />
        </button>
      </div>

      <button
        type="button"
        className="focus-ring hidden h-9 shrink-0 items-center justify-center rounded-md bg-[#2a2a2a] px-3 text-[12px] font-semibold text-white transition-colors hover:bg-[#333] sm:flex sm:text-[13px]"
      >
        {t.navbar.withdraw}
      </button>

      <div className="flex items-center gap-1">
        <button
          type="button"
          className="focus-ring flex h-9 shrink-0 items-center justify-center rounded-md bg-[#178358] px-3 text-[12px] font-semibold text-white transition-colors hover:bg-[#1a9664] sm:text-[13px]"
        >
          {t.navbar.deposit}
        </button>
        <DepositBadgeIcon />
      </div>
    </div>
  );
}
