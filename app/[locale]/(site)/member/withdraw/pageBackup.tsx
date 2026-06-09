"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  type WithdrawPaymentMethod,
} from "@/lib/withdraw-api";
import { fetchUserWallets, type UserWalletRecord } from "@/lib/user-wallets-api";

type MethodOption = {
  id: WithdrawPaymentMethod;
  label: string;
  badge: string;
};

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

export default function WithdrawPage() {
  const { preferences } = useLocale();
  const { session, refreshBalance } = useAuth();
  const router = useRouter();
  const locale = preferences.locale;
  const isBn = locale === "bn";

  const methods = useMemo<MethodOption[]>(
    () => [
      { id: "bkash", label: isBn ? "বিকাশ" : "bKash", badge: "✈" },
      { id: "nagad", label: isBn ? "নগদ" : "Nagad", badge: "🎯" },
      { id: "rocket", label: isBn ? "রকেট" : "Rocket", badge: "🚀" },
    ],
    [isBn],
  );

  const [wallets, setWallets] = useState<UserWalletRecord[]>([]);
  const [walletsLoading, setWalletsLoading] = useState(true);
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<WithdrawPaymentMethod>("bkash");
  const [amount, setAmount] = useState("");
  const [walletNumber, setWalletNumber] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const balanceNum = Number.parseFloat(session?.balance ?? "0") || 0;
  const amountNum = Number.parseFloat(amount || "0");
  const minWithdraw = 100;
  const validAmount =
    !Number.isNaN(amountNum) && amountNum >= minWithdraw && amountNum <= balanceNum;
  const validWallet = walletNumber.trim().length >= 10;
  const validName = accountHolderName.trim().length >= 2;
  const canSubmit = validAmount && validWallet && validName && !submitting;

  useEffect(() => {
    setAccountHolderName(session?.userName?.trim() || "");
  }, [session?.userName]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setWalletsLoading(true);
      try {
        const list = await fetchUserWallets();
        if (cancelled) return;
        setWallets(list);
        const def = list.find((w) => w.isDefault) ?? list[0];
        if (def) {
          setSelectedWalletId(def._id);
          setSelectedMethod(mapWalletNameToPaymentMethod(def.walletName));
          setWalletNumber(def.walletNumber);
          setAccountHolderName(def.accountHolderName);
        }
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
    setSelectedMethod(mapWalletNameToPaymentMethod(wallet.walletName));
    setWalletNumber(wallet.walletNumber);
    setAccountHolderName(wallet.accountHolderName);
  }, []);

  const selectMethod = useCallback((method: WithdrawPaymentMethod) => {
    setSelectedMethod(method);
    setSelectedWalletId(null);
  }, []);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await createManualWithdraw({
        amount: amountNum,
        paymentMethod: selectedMethod,
        walletNumber,
        accountHolderName,
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

        {!walletsLoading && wallets.length > 0 ? (
          <div>
            <p className="mb-2 text-[13px] text-[#9ca3af]">
              {isBn ? "সেভ করা ওয়ালেট" : "Saved wallets"}
            </p>
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
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold text-white">{w.walletName}</p>
                    <p className="mt-0.5 text-[13px] text-[#9ca3af]">{w.walletNumber}</p>
                    <p className="text-[12px] text-[#6b7280]">{w.accountHolderName}</p>
                  </div>
                  <CircleToggle active={selectedWalletId === w._id} />
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div>
          <p className="mb-2 text-[13px] text-[#9ca3af]">
            {isBn ? "পেমেন্ট মেথড" : "Payment method"}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {methods.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => selectMethod(m.id)}
                className={`focus-ring rounded-sm border px-2 py-2 text-center transition-colors ${
                  selectedMethod === m.id && !selectedWalletId
                    ? "border-[#23c97f] bg-[#1f2428]"
                    : selectedMethod === m.id && selectedWalletId
                      ? "border-[#23c97f]/60 bg-[#1f2428]"
                      : "border-[#2d2d2d] bg-[#1f2326] hover:border-[#3b3b3b]"
                }`}
              >
                <span className="mx-auto mb-1 inline-flex h-7 min-w-7 items-center justify-center rounded bg-[#2b2f33] px-1.5 text-[10px] font-bold text-white">
                  {m.badge}
                </span>
                <p className="truncate text-[12px] font-medium text-white">{m.label}</p>
              </button>
            ))}
          </div>
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

        <div>
          <p className="mb-2 text-[13px] text-[#9ca3af]">
            {isBn ? "ওয়ালেট নাম্বার" : "Wallet number"}
          </p>
          <input
            type="tel"
            inputMode="numeric"
            value={walletNumber}
            onChange={(e) => {
              setWalletNumber(e.target.value);
              setSelectedWalletId(null);
            }}
            placeholder={isBn ? "01XXXXXXXXX" : "01XXXXXXXXX"}
            className="focus-ring w-full rounded-sm border border-[#2d2d2d] bg-[#1f2326] px-3 py-3 text-[16px] text-white outline-none placeholder:text-[#6b7280]"
          />
        </div>

        <div>
          <p className="mb-2 text-[13px] text-[#9ca3af]">
            {isBn ? "অ্যাকাউন্ট হোল্ডারের নাম" : "Account holder name"}
          </p>
          <input
            type="text"
            value={accountHolderName}
            onChange={(e) => setAccountHolderName(e.target.value)}
            className="focus-ring w-full rounded-sm border border-[#2d2d2d] bg-[#1f2326] px-3 py-3 text-[16px] text-white outline-none"
          />
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
