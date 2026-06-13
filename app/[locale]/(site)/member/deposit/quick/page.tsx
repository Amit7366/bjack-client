"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/components/LocaleProvider";
import {
  MEMBER_PAGE_BG,
  memberContainerNarrow,
  memberPagePaddingNarrow,
  MemberPageHeader,
} from "@/components/member/shared/member-ui";
import { depositMethodToUrlParam, mapQuickDepositMethod } from "@/lib/deposit-api";
import DepositPromotionPicker, {
  DEFAULT_PROMO_CODE,
} from "@/components/member/deposit/DepositPromotionPicker";
import { getMinimumDepositAmount, hasSelectedPromotion } from "@/lib/deposit-promotions";
import {
  channelsForMethod,
  fetchActiveDepositAccounts,
  fetchEnabledDepositAccounts,
  methodBadge,
  methodDisplayLabel,
  methodQuickId,
  uniqueActiveMethods,
  type DepositPaymentAccount,
} from "@/lib/deposit-payment-accounts";
import type { DepositPaymentMethod } from "@/lib/deposit-api";

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

function InfoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M9 7.1v4.2M9 4.9h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
      className={`transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path d="M4.8 11.2L9 7l4.2 4.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function QuickDepositPage() {
  const { preferences } = useLocale();
  const router = useRouter();
  const locale = preferences.locale;
  const isBn = locale === "bn";

  const [enabledAccounts, setEnabledAccounts] = useState<DepositPaymentAccount[]>([]);
  const [activeAccounts, setActiveAccounts] = useState<DepositPaymentAccount[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [accountsError, setAccountsError] = useState<string | null>(null);

  const availableMethods = useMemo(
    () => uniqueActiveMethods(activeAccounts),
    [activeAccounts],
  );

  const methods = useMemo(
    () =>
      availableMethods.map((method) => ({
        id: methodQuickId(method),
        method,
        label: methodDisplayLabel(method, isBn),
        badge: methodBadge(method),
      })),
    [availableMethods, isBn],
  );

  const [selectedMethod, setSelectedMethod] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("");
  const [amount, setAmount] = useState("");
  const [amountFocused, setAmountFocused] = useState(false);
  const [infoOpen, setInfoOpen] = useState(true);
  const [promoCode, setPromoCode] = useState(DEFAULT_PROMO_CODE);
  const [promoMinDeposit, setPromoMinDeposit] = useState(0);

  const selectedPaymentMethod = useMemo<DepositPaymentMethod | null>(() => {
    if (!selectedMethod) return null;
    return mapQuickDepositMethod(selectedMethod);
  }, [selectedMethod]);

  const channels = useMemo(() => {
    if (!selectedPaymentMethod) return [];
    return channelsForMethod(enabledAccounts, selectedPaymentMethod);
  }, [enabledAccounts, selectedPaymentMethod]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setAccountsLoading(true);
      setAccountsError(null);
      try {
        const [enabled, active] = await Promise.all([
          fetchEnabledDepositAccounts(),
          fetchActiveDepositAccounts(),
        ]);
        if (cancelled) return;
        setEnabledAccounts(enabled);
        setActiveAccounts(active);

        const methodsList = uniqueActiveMethods(active);
        if (methodsList.length === 0) return;

        const firstMethod = methodsList[0];
        setSelectedMethod(methodQuickId(firstMethod));

        const activeForMethod = active.find(
          (row) => row.paymentMethod === firstMethod && row.isActive,
        );
        const methodChannels = channelsForMethod(enabled, firstMethod);
        const defaultChannel =
          activeForMethod?.channelId ?? methodChannels[0]?.channelId ?? "";
        setSelectedChannel(defaultChannel);
      } catch (err) {
        if (!cancelled) {
          setAccountsError(err instanceof Error ? err.message : "Failed to load payment options");
        }
      } finally {
        if (!cancelled) setAccountsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedPaymentMethod) return;
    const methodChannels = channelsForMethod(enabledAccounts, selectedPaymentMethod);
    if (methodChannels.length === 0) {
      setSelectedChannel("");
      return;
    }
    const stillValid = methodChannels.some((row) => row.channelId === selectedChannel);
    if (stillValid) return;

    const activeForMethod = activeAccounts.find(
      (row) => row.paymentMethod === selectedPaymentMethod && row.isActive,
    );
    setSelectedChannel(activeForMethod?.channelId ?? methodChannels[0].channelId);
  }, [selectedPaymentMethod, enabledAccounts, activeAccounts, selectedChannel]);

  const amountNum = Number.parseFloat(amount || "0");
  const minDepositRequired = getMinimumDepositAmount(promoCode, promoMinDeposit);
  const promoSelected = hasSelectedPromotion(promoCode);
  const validAmount =
    !Number.isNaN(amountNum) &&
    amountNum >= minDepositRequired &&
    amountNum <= 30000;
  const amountTooLowForPromo =
    promoSelected && amount.length > 0 && amountNum > 0 && amountNum < minDepositRequired;
  const canSubmit =
    validAmount &&
    Boolean(selectedChannel) &&
    Boolean(selectedMethod) &&
    methods.length > 0 &&
    !accountsLoading;

  const handlePromoChange = (code: string, minDeposit: number) => {
    setPromoCode(code);
    setPromoMinDeposit(minDeposit);
  };
  const keypadDigits = isBn ? ["১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯", "০", "০০"] : ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "00"];

  const normalizeDigits = (value: string): string => {
    const bn = "০১২৩৪৫৬৭৮৯";
    const en = "0123456789";
    let out = value;
    for (let i = 0; i < bn.length; i += 1) out = out.replaceAll(bn[i], en[i]);
    return out;
  };

  const appendAmount = (digit: string) => {
    setAmount((prev) => {
      const next = normalizeDigits(prev + digit).replace(/[^\d]/g, "");
      return next.length > 1 ? next.replace(/^0+/, "") || "0" : next;
    });
  };

  const addPreset = (extra: number) => {
    const current = Number.parseInt(normalizeDigits(amount || "0"), 10) || 0;
    setAmount(String(current + extra));
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    const paymentMethod = mapQuickDepositMethod(selectedMethod);
    const q = new URLSearchParams({
      amount: String(amountNum),
      method: depositMethodToUrlParam(paymentMethod),
      channel: selectedChannel,
      promo: promoCode,
    });
    router.push(`/${locale}/member/deposit/quick/verify?${q.toString()}`);
  };

  return (
    <div className={MEMBER_PAGE_BG}>
      <MemberPageHeader
        title={isBn ? "Quick deposit" : "Quick deposit"}
        backHref={`/${locale}/member/deposit`}
        backLabel={isBn ? "ডিপোজিট" : "Deposit"}
      />

      <section className={`${memberContainerNarrow} ${memberPagePaddingNarrow} space-y-4`}>
        {accountsLoading ? (
          <p className="text-center text-[13px] text-[#9ca3af]">
            {isBn ? "পেমেন্ট অপশন লোড হচ্ছে…" : "Loading payment options…"}
          </p>
        ) : null}

        {accountsError ? (
          <p className="rounded-sm border border-[#7f1d1d] bg-[#2a1515] px-3 py-2 text-[13px] text-[#fca5a5]">
            {accountsError}
          </p>
        ) : null}

        {!accountsLoading && methods.length === 0 ? (
          <p className="rounded-sm border border-[#854d0e] bg-[#2a2415] px-3 py-3 text-[13px] text-[#fcd34d]">
            {isBn
              ? "এখন কোনো সক্রিয় ডিপোজিট পেমেন্ট পদ্ধতি নেই। অনুগ্রহ করে পরে আবার চেষ্টা করুন।"
              : "No active deposit payment methods are available right now. Please try again later."}
          </p>
        ) : null}

        <DepositPromotionPicker
          isBn={isBn}
          selectedCode={promoCode}
          onChange={handlePromoChange}
        />

        <div>
          <p className="mb-2 text-[13px] text-[#9ca3af]">{isBn ? "পেমেন্ট নির্বাচন করুন" : "Select payment"}</p>
          <div className="grid grid-cols-3 gap-2">
            {methods.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMethod(m.id)}
                disabled={accountsLoading}
                className={`focus-ring rounded-sm border px-2 py-2 text-center transition-colors ${
                  selectedMethod === m.id
                    ? "border-[#23c97f] bg-[#1f2428]"
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
          <p className="mb-2 text-[13px] text-[#9ca3af]">{isBn ? "ডিপোজিট চ্যানেল" : "Deposit channel"}</p>
          <div className="space-y-2">
            {channels.map((c) => (
              <button
                key={c.channelId}
                type="button"
                onClick={() => setSelectedChannel(c.channelId)}
                className={`focus-ring flex w-full items-center rounded-sm border px-3 py-3 text-left transition-colors ${
                  selectedChannel === c.channelId
                    ? "border-[#23c97f] bg-[#1f2428]"
                    : "border-[#2d2d2d] bg-[#1f2326] hover:border-[#3b3b3b]"
                }`}
              >
                <span className="flex-1 text-[22px] font-semibold tracking-tight text-white">{c.channelName}</span>
                {c.recommended ? (
                  <span className="mr-2 rounded bg-[#1a6d52] px-2 py-0.5 text-[11px] font-medium text-[#57d1a4]">
                    {isBn ? "সুপারিশ করুন" : "Recommended"}
                  </span>
                ) : null}
                <CircleToggle active={selectedChannel === c.channelId} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-[13px] text-[#9ca3af]">
            {promoSelected && promoMinDeposit > 0
              ? isBn
                ? `ন্যূনতম ডিপোজিট ৳ ${promoMinDeposit.toLocaleString("en-US")} (প্রমোশন)`
                : `Minimum deposit ৳ ${promoMinDeposit.toLocaleString("en-US")} (promotion)`
              : isBn
                ? "এভেইলেবল ব্যালেন্স ৳ ১০০.০০-৳ ৩০,০০০.০০"
                : "Available balance ৳ 100.00-৳ 30,000.00"}
          </p>
          <div
            className={`flex min-h-[58px] items-center rounded-sm border bg-[#1f2326] px-3 transition-colors ${
              amountFocused ? "border-[#23c97f]" : "border-[#2d2d2d]"
            }`}
          >
            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1a6d52] text-[12px] font-bold text-[#7ee7bf]">
              ৳
            </span>
            <span className="text-[18px] font-semibold text-white">BDT</span>
            <input
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(normalizeDigits(e.target.value).replace(/[^\d]/g, ""))}
              onFocus={() => setAmountFocused(true)}
              placeholder="0"
              min={100}
              max={30000}
              className="ml-auto w-28 bg-transparent text-right text-[40px] leading-none text-white outline-none placeholder:text-[#8b8b8b]"
            />
          </div>
          {amountTooLowForPromo ? (
            <p className="mt-1 text-[12px] text-[#f87171]">
              {isBn
                ? `এই প্রমোশনের জন্য ন্যূনতম ৳ ${minDepositRequired.toLocaleString("en-US")} ডিপোজিট প্রয়োজন`
                : `This promotion requires a minimum deposit of ৳ ${minDepositRequired.toLocaleString("en-US")}`}
            </p>
          ) : null}
          {amountFocused ? (
            <div className="mt-1 rounded-b-sm border border-t-0 border-[#2d2d2d] bg-[#1f2326] p-2 shadow-[0_6px_18px_rgba(0,0,0,0.45)]">
              <div className="mb-2 grid grid-cols-5 gap-2">
                {[500, 900, 3000, 9000, 30000].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => addPreset(n)}
                    className="focus-ring rounded-sm bg-[#2f3337] px-2 py-2 text-[12px] font-semibold text-[#dfdfdf] hover:bg-[#3b4045]"
                  >
                    +{n.toLocaleString("en-US")}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {keypadDigits.slice(0, 9).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => appendAmount(d)}
                    className="focus-ring rounded-sm bg-[#23272b] py-3 text-[34px] leading-none text-[#d7dbe0] hover:bg-[#2e3338]"
                  >
                    {d}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setAmount((prev) => prev.slice(0, -1))}
                  className="focus-ring rounded-sm bg-[#2f3337] py-3 text-[22px] text-[#c8d0d8] hover:bg-[#3b4045]"
                >
                  ⌫
                </button>
                <button
                  type="button"
                  onClick={() => appendAmount(keypadDigits[9])}
                  className="focus-ring rounded-sm bg-[#23272b] py-3 text-[34px] leading-none text-[#d7dbe0] hover:bg-[#2e3338]"
                >
                  {keypadDigits[9]}
                </button>
                <button
                  type="button"
                  onClick={() => appendAmount(keypadDigits[10])}
                  className="focus-ring rounded-sm bg-[#23272b] py-3 text-[34px] leading-none text-[#d7dbe0] hover:bg-[#2e3338]"
                >
                  {keypadDigits[10]}
                </button>
                <button
                  type="button"
                  onClick={() => setAmountFocused(false)}
                  className="focus-ring rounded-sm bg-[#1f7f5e] py-3 text-[15px] font-semibold text-white hover:bg-[#22936d]"
                >
                  {isBn ? "সম্পন্ন" : "Done"}
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="rounded-sm border border-[#2d2d2d] bg-[#1f2326]">
          <button
            type="button"
            onClick={() => setInfoOpen((v) => !v)}
            className="focus-ring flex w-full items-center gap-2 px-3 py-3 text-left"
          >
            <span className="text-[#bdbdbd]">
              <InfoIcon />
            </span>
            <span className="flex-1 text-[16px] font-semibold text-white">{isBn ? "রিমাইন্ডার" : "Reminder"}</span>
            <span className="text-[#bdbdbd]">
              <Chevron open={infoOpen} />
            </span>
          </button>
          {infoOpen ? (
            <div className="border-t border-dashed border-[#3a3a3a] px-3 pb-3 pt-2 text-[13px] leading-6 text-[#a8adb3]">
              <p className="mb-2">
                {isBn
                  ? "প্রিয় সকল সদস্য, আপনার ডিপোজিট দ্রুত সফল করার জন্য অনুগ্রহ করে এই পদক্ষেপগুলি অনুসরণ করুন:"
                  : "Please follow these steps to make your deposit successful quickly:"}
              </p>
              <ol className="list-decimal space-y-1 pl-5">
                <li>{isBn ? "ডিপোজিটের সময় যে নাম্বার দেখানো হবে সেই নাম্বারেই ক্যাশ আউট করুন।" : "Use the exact shown number while depositing."}</li>
                <li>{isBn ? "আপনার নিজের আইডি ব্যবহার করুন।" : "Use your own account details only."}</li>
                <li>{isBn ? "আমাদের সাইটে সর্বনিম্ন ডিপোজিট ১০০ টাকা।" : "Minimum deposit amount is 100 BDT."}</li>
              </ol>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          disabled={!canSubmit}
          onClick={handleSubmit}
          className="focus-ring mt-2 min-h-11 w-full rounded-sm bg-[#178358] px-4 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#1a9664] disabled:cursor-not-allowed disabled:opacity-45"
        >
          {isBn ? "সাবমিট" : "Submit"}
        </button>
      </section>
    </div>
  );
}

