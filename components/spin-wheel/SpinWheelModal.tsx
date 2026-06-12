"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useLocale } from "@/components/LocaleProvider";
import { useToast } from "@/components/ToastProvider";
import {
  formatSpinAmount,
  getSpinWheelMessages,
} from "@/lib/i18n/spin-wheel-messages";
import {
  fetchSpinStatus,
  playSpin,
  type SpinPlayResult,
  type SpinStatus,
} from "@/lib/spin-api";
import SpinWheelDisc, { computeSpinRotation } from "./SpinWheelDisc";

const FAKE_WINNERS = [
  { name: "sobu****dol", amount: 25 },
  { name: "rakib***12", amount: 17 },
  { name: "mina***88", amount: 10 },
  { name: "karim***45", amount: 22 },
  { name: "nusrat***7", amount: 15 },
];

function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M4.5 4.5l9 9M13.5 4.5l-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 4.5V8l2.5 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

type SpinWheelModalProps = {
  open: boolean;
  onClose: () => void;
  initialStatus?: SpinStatus | null;
};

export default function SpinWheelModal({ open, onClose, initialStatus }: SpinWheelModalProps) {
  const { refreshBalance } = useAuth();
  const { preferences } = useLocale();
  const { showToast } = useToast();
  const locale = preferences.locale;
  const m = getSpinWheelMessages(locale);

  const [status, setStatus] = useState<SpinStatus | null>(initialStatus ?? null);
  const [loading, setLoading] = useState(!initialStatus);
  const [spinning, setSpinning] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showWin, setShowWin] = useState(false);
  const [winResult, setWinResult] = useState<SpinPlayResult | null>(null);
  const [rotation, setRotation] = useState(0);
  const [countdownMs, setCountdownMs] = useState(0);
  const [tickerIndex, setTickerIndex] = useState(0);

  const rotationRef = useRef(0);
  const spinResolveRef = useRef<(() => void) | null>(null);

  const loadStatus = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchSpinStatus();
      setStatus(data);
      setCountdownMs(data.remainingMs);
    } catch {
      showToast(m.loadError, { variant: "error" });
      onClose();
    } finally {
      setLoading(false);
    }
  }, [m.loadError, onClose, showToast]);

  useEffect(() => {
    if (!open) return;
    if (!initialStatus) {
      void loadStatus();
    } else {
      setStatus(initialStatus);
      setCountdownMs(initialStatus.remainingMs);
      setLoading(false);
    }
  }, [open, initialStatus, loadStatus]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !spinning) onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, spinning]);

  useEffect(() => {
    if (!open) return;
    const id = window.setInterval(() => {
      setTickerIndex((i) => (i + 1) % FAKE_WINNERS.length);
    }, 4000);
    return () => clearInterval(id);
  }, [open]);

  useEffect(() => {
    if (!open || status?.canSpin) return;
    const id = window.setInterval(() => {
      setCountdownMs((ms) => Math.max(0, ms - 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [open, status?.canSpin]);

  const ticker = useMemo(() => {
    const w = FAKE_WINNERS[tickerIndex];
    return m.winnerTicker
      .replace("{name}", w.name)
      .replace("{amount}", formatSpinAmount(w.amount, locale));
  }, [m.winnerTicker, tickerIndex, locale]);

  const waitForSpinEnd = useCallback(
    (targetRotation: number) =>
      new Promise<void>((resolve) => {
        spinResolveRef.current = resolve;
        if (skipAnimation) {
          rotationRef.current = targetRotation;
          setRotation(targetRotation);
          window.setTimeout(resolve, 200);
          return;
        }
        rotationRef.current = targetRotation;
        setRotation(targetRotation);
        window.setTimeout(resolve, 5000);
      }),
    [skipAnimation]
  );

  const handleSpin = useCallback(async () => {
    if (!status?.canSpin || spinning) return;

    setSpinning(true);
    setShowWin(false);
    setWinResult(null);

    try {
      const result = await playSpin();
      const segmentCount = status.segmentCount || status.segments.length;
      const targetRotation = computeSpinRotation(
        result.segmentIndex,
        rotationRef.current,
        segmentCount
      );

      await waitForSpinEnd(targetRotation);
      setWinResult(result);
      setShowWin(true);
      const nextMs = result.nextSpinAt
        ? Math.max(0, new Date(result.nextSpinAt).getTime() - Date.now())
        : 0;
      setCountdownMs(nextMs);
      setStatus((prev) =>
        prev
          ? {
              ...prev,
              canSpin: false,
              lastSpinAmount: result.winAmount,
              nextSpinAt: result.nextSpinAt,
              remainingMs: nextMs,
            }
          : prev
      );
      await refreshBalance();
      showToast(
        m.winMessage.replace("{amount}", formatSpinAmount(result.winAmount, locale)),
        { variant: "success" }
      );
    } catch (err) {
      showToast(err instanceof Error ? err.message : m.loadError, { variant: "error" });
    } finally {
      setSpinning(false);
      spinResolveRef.current = null;
    }
  }, [
    status,
    spinning,
    waitForSpinEnd,
    refreshBalance,
    showToast,
    m.winMessage,
    m.loadError,
    locale,
  ]);

  const handleCloseAfterWin = useCallback(() => {
    setShowWin(false);
    onClose();
  }, [onClose]);

  if (!open) return null;

  const segments = status?.segments ?? [];

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center" role="presentation">
      <div
        className="absolute inset-0 bg-[#021a0f]/92 backdrop-blur-sm"
        aria-hidden
        onClick={spinning ? undefined : onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="spin-wheel-title"
        className="relative z-[121] flex max-h-[100dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-[#1faa59]/30 bg-[linear-gradient(180deg,#0a2e1c_0%,#051a10_45%,#031208_100%)] shadow-[0_-8px_60px_rgba(34,197,94,0.2)] sm:max-h-[92dvh] sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-[#22c55e]/20 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 right-0 h-32 w-32 rounded-full bg-[#f7c948]/10 blur-2xl" />

        {/* Header */}
        <div className="relative flex items-center justify-between px-4 pt-4 pb-2">
          <button
            type="button"
            onClick={onClose}
            disabled={spinning}
            className="flex items-center gap-1 text-sm text-[#a8d4b8] transition hover:text-white disabled:opacity-50"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            {m.back}
          </button>
          <button
            type="button"
            onClick={() => setShowRules(true)}
            className="rounded-full border border-[#f7c948]/40 bg-[#f7c948]/10 px-3 py-1 text-xs font-semibold text-[#ffe566] transition hover:bg-[#f7c948]/20"
          >
            {m.rules}
          </button>
        </div>

        {/* Headline */}
        <div className="relative px-4 text-center">
          <h2
            id="spin-wheel-title"
            className="font-bengali text-[22px] font-black leading-tight sm:text-[26px]"
          >
            <span className="bg-gradient-to-b from-[#fff8d0] via-[#f7c948] to-[#c9a020] bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(247,201,72,0.5)]">
              {m.headline}{" "}
            </span>
            <span className="bg-gradient-to-b from-[#fff8d0] via-[#f7c948] to-[#c9a020] bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(247,201,72,0.5)]">
              {m.headlineSuffix}
            </span>
          </h2>
        </div>

        {/* Winner ticker */}
        <div className="relative mx-4 mt-3 overflow-hidden rounded-lg bg-[#0a1f14]/80 px-3 py-1.5">
          <p className="animate-spin-ticker whitespace-nowrap text-xs text-[#8fd4a8]">
            <span className="mr-2 inline-flex h-4 w-4 items-center justify-center rounded bg-[#1faa59] text-[8px] font-bold text-white">
              ৳
            </span>
            {ticker}
          </p>
        </div>

        {/* Wheel area */}
        <div className="relative flex-1 overflow-y-auto px-4 py-4">
          {loading ? (
            <div className="flex min-h-[280px] items-center justify-center">
              <span className="h-10 w-10 animate-spin rounded-full border-2 border-[#1faa59]/30 border-t-[#1faa59]" />
            </div>
          ) : (
            <>
              <SpinWheelDisc
                segments={segments}
                rotation={rotation}
                locale={locale}
                spinning={spinning}
                skipAnimation={skipAnimation}
              />

              <div className="mt-3 flex items-center justify-between px-1 text-xs text-[#8fb89c]">
                <label className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-3 w-3 rounded-full bg-[#f7c948]" />
                    {m.bonusLegend}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="flex h-3 w-3 items-center justify-center rounded bg-[#1faa59] text-[6px] font-bold text-white">
                      ৳
                    </span>
                    {m.freeSpinLegend}
                  </span>
                </label>
                <label className="flex cursor-pointer items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={skipAnimation}
                    onChange={(e) => setSkipAnimation(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-[#2d6b4a] bg-[#0a1f14] accent-[#1faa59]"
                  />
                  {m.skipAnimation}
                </label>
              </div>
            </>
          )}

          {/* Timer */}
          {!loading && !status?.canSpin ? (
            <div className="mx-auto mt-4 flex max-w-sm items-center justify-center gap-2 rounded-xl bg-[#1a2a22]/90 px-4 py-2.5 text-sm text-[#c8e6d4]">
              <ClockIcon />
              <span>{m.timerLabel}</span>
              <span className="font-mono font-bold text-[#f7c948]">{formatCountdown(countdownMs)}</span>
            </div>
          ) : null}

          <p className="mt-4 text-center text-sm text-[#a8d4b8]">{m.chooseWheel}</p>

          {/* Free tier card */}
          <div className="mt-3 flex justify-center gap-2">
            <div className="flex min-w-[72px] flex-col items-center rounded-xl border-2 border-[#f7c948] bg-[#0f2d1e] px-3 py-2 shadow-[0_0_16px_rgba(247,201,72,0.35)]">
              <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#1a4d32]">
                <span className="text-lg">🎡</span>
              </div>
              <span className="text-xs font-bold text-[#ffe566]">{m.tierFree}</span>
            </div>
          </div>

          <p className="mt-3 text-center text-[11px] text-[#6a9a7a]">
            {m.depositNote}{" "}
            <button type="button" onClick={() => setShowRules(true)} className="text-[#5eb3ff] underline">
              {m.readMore}
            </button>
          </p>
        </div>

        {/* Spin button */}
        <div className="relative border-t border-[#1faa59]/20 bg-[#051a10]/95 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={showWin ? handleCloseAfterWin : handleSpin}
            disabled={loading || spinning || (!showWin && !status?.canSpin)}
            className="w-full rounded-2xl bg-gradient-to-b from-[#2dd46a] to-[#15803d] py-3.5 text-base font-bold text-white shadow-[0_4px_24px_rgba(34,197,94,0.45),inset_0_1px_0_rgba(255,255,255,0.2)] transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {spinning ? m.spinning : showWin ? m.close : status?.canSpin ? m.spinToWin : m.alreadySpun}
          </button>
        </div>

        {/* Win overlay */}
        {showWin && winResult ? (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 p-6 backdrop-blur-[2px]">
            <div className="w-full max-w-xs rounded-2xl border border-[#f7c948]/50 bg-[linear-gradient(180deg,#1a3d2a,#0f2418)] p-6 text-center shadow-[0_0_40px_rgba(247,201,72,0.3)]">
              <p className="text-3xl">🎉</p>
              <h3 className="mt-2 text-xl font-bold text-[#ffe566]">{m.winTitle}</h3>
              <p className="mt-2 text-lg font-semibold text-white">
                {m.winMessage.replace("{amount}", formatSpinAmount(winResult.winAmount, locale))}
              </p>
              <p className="mt-2 text-xs text-[#8fd4a8]">{m.turnoverNote}</p>
              <button
                type="button"
                onClick={handleCloseAfterWin}
                className="mt-5 w-full rounded-xl bg-[#1faa59] py-2.5 text-sm font-bold text-white"
              >
                {m.close}
              </button>
            </div>
          </div>
        ) : null}

        {/* Rules overlay */}
        {showRules ? (
          <div className="absolute inset-0 z-30 flex items-end sm:items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-[#142820] p-5 shadow-xl">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">{m.rulesTitle}</h3>
                <button
                  type="button"
                  onClick={() => setShowRules(false)}
                  className="rounded-full p-1 text-[#8fb89c] hover:bg-white/10 hover:text-white"
                  aria-label={m.close}
                >
                  <CloseIcon />
                </button>
              </div>
              <div className="whitespace-pre-line text-sm leading-relaxed text-[#b8d4c4]">
                {m.rulesBody}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
