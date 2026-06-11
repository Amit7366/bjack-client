"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { useLocale } from "@/components/LocaleProvider";
import {
  MEMBER_PAGE_BG,
  memberBtnPrimary,
  memberContainerNarrow,
  memberPagePaddingNarrow,
  MemberPageHeader,
} from "@/components/member/shared/member-ui";
import { memberSectionHref } from "@/lib/member-routes";
import {
  createManualWithdraw,
  mapWalletNameToPaymentMethod,
} from "@/lib/withdraw-api";
import {
  fetchUserWallets,
  MAX_USER_WALLETS,
  type UserWalletRecord,
} from "@/lib/user-wallets-api";

function CircleToggle({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex h-5 w-5 items-center justify-center rounded-full border ${
        active ? "border-[#23c97f] bg-[#23c97f]" : "border-[#666] bg-transparent"
      }`}
      aria-hidden
    >
      {active ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
    </span>
  );
}

function walletBadge(walletName: string): string {
  const n = walletName.trim().toLowerCase();
  if (n.includes("nagad")) return "🎯";
  if (n.includes("rocket")) return "🚀";
  return "✈";
}

export default function WithdrawPage() {
  const { preferences } = useLocale();
  const { session, refreshBalance } = useAuth();
  const router = useRouter();
  const locale = preferences.locale;
  const isBn = locale === "bn";

  const [wallets, setWallets] = useState<UserWalletRecord[]>([]);
  const [walletsLoading, setWalletsLoading] = useState(true);
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const balanceNum = Number.parseFloat(session?.balance ?? "0") || 0;
  const amountNum = Number.parseFloat(amount || "0");
  const minWithdraw = 100;
  const validAmount =
    !Number.isNaN(amountNum) && amountNum >= minWithdraw && amountNum <= balanceNum;
  const selectedWallet = wallets.find((w) => w._id === selectedWalletId) ?? null;
  const canSubmit = validAmount && selectedWallet != null && !submitting;

  const addWalletHref = memberSectionHref(locale, "add-wallet");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setWalletsLoading(true);
      try {
        const list = await fetchUserWallets();
        if (cancelled) return;
        setWallets(list);
        const def = list.find((w) => w.isDefault) ?? list[0];
        if (def) setSelectedWalletId(def._id);
      } catch {
        if (!cancelled) setWallets([]);
      } finally {
        if (!cancelled) setWalletsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectWallet = useCallback((wallet: UserWalletRecord) => {
    setSelectedWalletId(wallet._id);
  }, []);

  const handleSubmit = async () => {
    if (!canSubmit || !selectedWallet) return;
    setSubmitting(true);
    setError(null);
    try {
      await createManualWithdraw({
        amount: amountNum,
        paymentMethod: mapWalletNameToPaymentMethod(selectedWallet.walletName),
        walletNumber: selectedWallet.walletNumber,
        accountHolderName: selectedWallet.accountHolderName,
      });
      setSuccess(true);
      await refreshBalance();
    } catch (e) {
      setError(e instanceof Error ? e.message : isBn ? "উইথড্রয়াল ব্যর্থ" : "Withdrawal failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className={MEMBER_PAGE_BG}>
        <MemberPageHeader
          title={isBn ? "উইথড্রয়াল" : "Withdraw"}
          backHref={`/${locale}/member/deposit`}
          backLabel={isBn ? "ডিপোজিট" : "Deposit"}
        />
        <div className={`${memberContainerNarrow} ${memberPagePaddingNarrow} text-center`}>
          <p className="mb-2 text-[17px] font-semibold text-[#4ade80]">
            {isBn ? "অনুরোধ জমা হয়েছে" : "Request submitted"}
          </p>
          <p className="mb-6 text-[14px] text-[#9ca3af]">
            {isBn
              ? "আপনার উইথড্রয়াল প্রসেসিংয়ে আছে। অনুমোদনের পর টাকা পাঠানো হবে।"
              : "Your withdrawal is pending. Funds will be sent after approval."}
          </p>
          <div className="flex flex-col gap-2">
            <Link href={memberSectionHref(locale, "transaction-records")} className={memberBtnPrimary}>
              {isBn ? "ট্রানজেকশন রেকর্ডস" : "Transaction records"}
            </Link>
            <button
              type="button"
              className="focus-ring min-h-11 rounded-md border border-[#555] py-3 text-[14px] font-medium text-white hover:bg-white/5"
              onClick={() => router.push(`/${locale}`)}
            >
              {isBn ? "হোম" : "Home"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={MEMBER_PAGE_BG}>
      <MemberPageHeader
        title={isBn ? "উইথড্রয়াল" : "Withdraw"}
        backHref={`/${locale}`}
        backLabel={isBn ? "হোম" : "Home"}
      />

      <section className={`${memberContainerNarrow} ${memberPagePaddingNarrow} space-y-4`}>
        <div className="rounded-sm border border-[#2d2d2d] bg-[#1f2326] px-3 py-3">
          <p className="text-[13px] text-[#9ca3af]">
            {isBn ? "উপলব্ধ ব্যালেন্স" : "Available balance"}
          </p>
          <p className="mt-1 text-[22px] font-bold tabular-nums text-white">
            ৳ {balanceNum.toLocaleString(isBn ? "bn-BD" : "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[13px] text-[#9ca3af]">
              {isBn ? "ওয়ালেট নির্বাচন করুন" : "Select wallet"}
            </p>
            {!walletsLoading && wallets.length > 0 && wallets.length < MAX_USER_WALLETS ? (
              <Link
                href={addWalletHref}
                className="focus-ring rounded text-[13px] font-medium text-[#23c97f] hover:text-[#4ade80]"
              >
                {isBn ? "+ ওয়ালেট যুক্ত করুন" : "+ Add wallet"}
              </Link>
            ) : null}
          </div>

          {walletsLoading ? (
            <div className="space-y-2">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="h-[72px] animate-pulse rounded-sm border border-[#2d2d2d] bg-[#1f2326]"
                  aria-hidden
                />
              ))}
            </div>
          ) : wallets.length === 0 ? (
            <div className="rounded-sm border border-[#2d2d2d] bg-[#1f2326] px-3 py-5 text-center">
              <p className="text-[14px] text-[#9ca3af]">
                {isBn
                  ? "উইথড্র করতে আগে একটি ওয়ালেট যুক্ত করুন"
                  : "Add a wallet first to withdraw"}
              </p>
              <Link
                href={addWalletHref}
                className="focus-ring mt-3 inline-flex min-h-10 items-center justify-center rounded-sm bg-[#178358] px-4 text-[14px] font-semibold text-white transition-colors hover:bg-[#1a9664]"
              >
                {isBn ? "ওয়ালেট যুক্ত করুন" : "Add wallet"}
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {wallets.map((w) => (
                <button
                  key={w._id}
                  type="button"
                  onClick={() => selectWallet(w)}
                  className={`focus-ring flex w-full items-center rounded-sm border px-3 py-3 text-left transition-colors ${
                    selectedWalletId === w._id
                      ? "border-[#23c97f] bg-[#1f2428]"
                      : "border-[#2d2d2d] bg-[#1f2326] hover:border-[#3b3b3b]"
                  }`}
                >
                  <span className="mr-3 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded bg-[#2b2f33] text-[14px]">
                    {walletBadge(w.walletName)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold text-white">{w.walletName}</p>
                    <p className="mt-0.5 text-[13px] text-[#9ca3af]">{w.walletNumber}</p>
                    <p className="text-[12px] text-[#6b7280]">{w.accountHolderName}</p>
                  </div>
                  <CircleToggle active={selectedWalletId === w._id} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="mb-2 text-[13px] text-[#9ca3af]">
            {isBn ? `উইথড্রয়াল পরিমাণ (৳${minWithdraw} - ব্যালেন্স)` : `Amount (৳${minWithdraw} - balance)`}
          </p>
          <div className="flex min-h-[52px] items-center rounded-sm border border-[#2d2d2d] bg-[#1f2326] px-3">
            <span className="mr-2 text-[18px] font-semibold text-[#7ee7bf]">৳</span>
            <input
              type="number"
              inputMode="decimal"
              min={minWithdraw}
              max={balanceNum}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full bg-transparent text-right text-[28px] font-semibold text-white outline-none placeholder:text-[#8b8b8b]"
            />
          </div>
          {amount.length > 0 && !validAmount ? (
            <p className="mt-1 text-[12px] text-[#f87171]">
              {amountNum > balanceNum
                ? isBn
                  ? "ব্যালেন্সের চেয়ে বেশি পরিমাণ"
                  : "Amount exceeds balance"
                : isBn
                  ? `ন্যূনতম ৳${minWithdraw}`
                  : `Minimum ৳${minWithdraw}`}
            </p>
          ) : null}
        </div>

        {error ? (
          <p className="text-[13px] text-[#f87171]" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => void handleSubmit()}
          className="focus-ring mt-2 min-h-11 w-full rounded-sm bg-[#178358] px-4 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#1a9664] disabled:cursor-not-allowed disabled:opacity-45"
        >
          {submitting
            ? isBn
              ? "জমা হচ্ছে…"
              : "Submitting…"
            : isBn
              ? "উইথড্রয়াল সাবমিট"
              : "Submit withdrawal"}
        </button>

        <p className="text-center text-[12px] leading-5 text-[#6b7280]">
          {isBn
            ? "উইথড্রয়াল অনুমোদনের পর আপনার নির্বাচিত ওয়ালেটে পাঠানো হবে।"
            : "Funds are sent to your selected wallet after approval."}
        </p>
      </section>
    </div>
  );
}
