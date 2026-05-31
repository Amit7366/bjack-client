"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "@/components/LocaleProvider";
import { MEMBER_PAGE_BG } from "@/components/member/shared/member-ui";

const PAYMENT_WINDOW_SEC = 10 * 60;
const VERIFY_WINDOW_SEC = 3 * 60;
const CASHOUT_NUMBER = "01635063453";

function formatClock(totalSec: number): string {
  const safe = Math.max(0, totalSec);
  const m = Math.floor(safe / 60).toString().padStart(2, "0");
  const s = Math.floor(safe % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function formatAmount(value: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function CopyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <rect x="6" y="6" width="8.5" height="8.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M11.5 6V4.5A1.5 1.5 0 0010 3H4.5A1.5 1.5 0 003 4.5V10a1.5 1.5 0 001.5 1.5H6" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function BrandLogo() {
  return (
    <span
      className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md"
      aria-hidden
    >
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <path d="M4 4l9 9-9 9V4z" fill="#e23744" />
        <path d="M22 4l-9 9 9 9V4z" fill="#9333ea" />
        <circle cx="13" cy="13" r="3" fill="#f59e0b" />
      </svg>
    </span>
  );
}

function VerifyContent() {
  const { preferences } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = preferences.locale;
  const isBn = locale === "bn";

  const amount = useMemo(() => {
    const raw = Number.parseFloat(searchParams.get("amount") ?? "0");
    return Number.isNaN(raw) ? 0 : raw;
  }, [searchParams]);

  const [stage, setStage] = useState<"pay" | "verifying">("pay");
  const [paySecLeft, setPaySecLeft] = useState(PAYMENT_WINDOW_SEC);
  const [verifySecLeft, setVerifySecLeft] = useState(VERIFY_WINDOW_SEC);
  const [txnId, setTxnId] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (stage !== "pay") return;
    if (paySecLeft <= 0) return;
    const id = window.setInterval(() => setPaySecLeft((s) => s - 1), 1000);
    return () => window.clearInterval(id);
  }, [stage, paySecLeft]);

  useEffect(() => {
    if (stage !== "verifying") return;
    if (verifySecLeft <= 0) {
      router.push(`/${locale}/member/deposit`);
      return;
    }
    const id = window.setInterval(() => setVerifySecLeft((s) => s - 1), 1000);
    return () => window.clearInterval(id);
  }, [stage, verifySecLeft, router, locale]);

  const copyValue = useCallback(async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1500);
    } catch {
      /* ignore */
    }
  }, []);

  const canSubmit = txnId.trim().length >= 4 && paySecLeft > 0;

  return (
    <div className={`${MEMBER_PAGE_BG} flex justify-center`}>
      <div className="w-full max-w-md px-3 py-4">
        <div className="overflow-hidden rounded-xl bg-white shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
          {stage === "pay" ? (
            <>
              <div className="flex items-center justify-between gap-3 bg-[#1aa05a] px-5 py-4">
                <BrandLogo />
                <div className="text-right text-white">
                  <p className="text-[30px] font-bold leading-none tabular-nums">{formatClock(paySecLeft)}</p>
                  <p className="mt-1 text-[12px] opacity-90">{isBn ? "সময় রয়েছে" : "Time remaining"}</p>
                </div>
              </div>

              <div className="px-5 py-5">
                <p className="text-center text-[13px] leading-6 text-[#374151]">
                  {isBn
                    ? "নিচের নম্বরটিতে দয়াকরে ক্যাশআউট করুন, ট্রাঞ্জেকশন আইডি বসান এবং ডিপোজিট রিকোয়েস্টটি কমপ্লিট করতে সাবমিট করুন। ধন্যবাদ।"
                    : "Please cash out to the number below, enter the transaction ID, and submit to complete your deposit request. Thank you."}
                </p>

                <div className="mt-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#1aa05a]" aria-hidden />
                    <span className="w-[120px] shrink-0 text-[14px] text-[#374151]">
                      {isBn ? "পরিমান:" : "Amount:"}
                    </span>
                    <span className="flex-1 text-[15px] font-bold text-[#1aa05a]">{formatAmount(amount)}</span>
                    <button
                      type="button"
                      onClick={() => copyValue("amount", String(amount))}
                      className="shrink-0 text-[#f59e0b] transition-opacity hover:opacity-70"
                      aria-label={isBn ? "কপি করুন" : "Copy"}
                    >
                      <CopyIcon />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#1aa05a]" aria-hidden />
                    <span className="w-[120px] shrink-0 text-[14px] text-[#374151]">
                      {isBn ? "ক্যাশআউট করুন:" : "Cash out to:"}
                    </span>
                    <span className="flex-1 text-[15px] font-bold text-[#1aa05a]">{CASHOUT_NUMBER}</span>
                    <button
                      type="button"
                      onClick={() => copyValue("number", CASHOUT_NUMBER)}
                      className="shrink-0 text-[#f59e0b] transition-opacity hover:opacity-70"
                      aria-label={isBn ? "কপি করুন" : "Copy"}
                    >
                      <CopyIcon />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#1aa05a]" aria-hidden />
                    <span className="w-[120px] shrink-0 text-[14px] text-[#374151]">
                      {isBn ? "ট্রাঞ্জেকশন আইডি:" : "Transaction ID:"}
                    </span>
                    <input
                      type="text"
                      value={txnId}
                      onChange={(e) => setTxnId(e.target.value)}
                      placeholder={isBn ? "ট্রাঞ্জেকশন আইডি বসান" : "Enter transaction ID"}
                      className="flex-1 rounded border border-[#d1d5db] px-3 py-2 text-[13px] text-[#111827] outline-none focus:border-[#1aa05a] placeholder:text-[#9ca3af]"
                    />
                  </div>
                </div>

                {copied ? (
                  <p className="mt-3 text-center text-[12px] font-medium text-[#1aa05a]">
                    {isBn ? "কপি হয়েছে" : "Copied"}
                  </p>
                ) : null}

                <button
                  type="button"
                  disabled={!canSubmit}
                  onClick={() => setStage("verifying")}
                  className="mt-5 min-h-12 w-full rounded-md bg-[#1aa05a] text-[15px] font-semibold text-white transition-colors hover:bg-[#178a4f] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isBn ? "সাবমিট" : "Submit"}
                </button>

                <div className="mt-6 border-t border-[#e5e7eb] pt-4">
                  <h3 className="text-[15px] font-bold text-[#111827]">{isBn ? "সতর্কতা:" : "Warning:"}</h3>
                  <p className="mt-2 text-[12px] font-medium leading-6 text-[#e11d48]">
                    {isBn
                      ? "অবশ্যই নিশ্চিত করুন, বিকাশ ডিপোজিট করার সময় আপনাকে যদি অন্যকোনও ওয়ালেট থেকে ক্যাশআউট করতে বলা হয়, আপনার ডিপোজিট ফেইল হতে পারে এবং আমরা প্রদত্ত আপনাদের এই টাকা ফেরত দিতে পারব না।"
                      : "Please make sure to cash out only from the wallet shown. Using another wallet may fail your deposit and the amount may not be refundable."}
                  </p>
                  <p className="mt-3 text-[12px] leading-6 text-[#6b7280]">
                    {isBn
                      ? "ডিপোজিট ফর্মে আপনি যে পরিমাণ টাকা বসিয়েছেন সেই পরিমাণ টাকা ক্যাশআউট করতে হবে। যদি আপনি ২,১০০.০০ টাকা বসিয়ে থাকেন এবং ভিন্ন এমাউন্টের টাকা ক্যাশআউট করেন, তাহলে আপনার ডিপোজিট এরর হবে না। দয়াকরে সঠিক ভাবে ট্রাঞ্জেকশন আইডি পূরণ করুন, অন্যথায় ডিপোজিটটি সফল হবে না।"
                      : "Cash out the exact amount you entered in the deposit form. Entering a different amount or an incorrect transaction ID may cause the deposit to fail."}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center bg-[#1aa05a] px-5 py-6">
                <BrandLogo />
              </div>

              <div className="flex flex-col items-center px-5 py-10">
                <h2 className="text-[18px] font-bold text-[#111827]">
                  {isBn ? "সফল ভাবে সাবমিট হয়েছে" : "Submitted successfully"}
                </h2>

                <div className="relative my-8 h-24 w-24">
                  <span className="absolute inset-0 rounded-full bg-[#1aa05a]/30 blur-md" aria-hidden />
                  <span className="absolute inset-0 animate-spin rounded-full border-4 border-[#1aa05a]/25 border-t-[#1aa05a]" />
                  <span className="absolute inset-3 rounded-full bg-white shadow-[0_0_24px_rgba(26,160,90,0.7)]" />
                </div>

                <p className="text-[13px] text-[#374151]">
                  {isBn ? "আপনার পেমেন্টটি ভেরিফাই করা হচ্ছে " : "Verifying your payment "}
                  <span className="font-semibold text-[#e11d48] tabular-nums">{formatClock(verifySecLeft)}</span>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function QuickDepositVerifyPage() {
  return (
    <Suspense fallback={<div className={MEMBER_PAGE_BG} />}>
      <VerifyContent />
    </Suspense>
  );
}
