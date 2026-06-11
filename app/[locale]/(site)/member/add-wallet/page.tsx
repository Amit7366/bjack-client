"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useLocale } from "@/components/LocaleProvider";
import { useToast } from "@/components/ToastProvider";
import {
  MEMBER_PAGE_BG,
  memberContainerNarrow,
  memberPagePaddingNarrow,
  MemberPageHeader,
} from "@/components/member/shared/member-ui";
import {
  createUserWallet,
  deleteUserWallet,
  fetchUserWallets,
  MAX_USER_WALLETS,
  type UserWalletRecord,
} from "@/lib/user-wallets-api";

type MethodOption = {
  id: string;
  label: string;
  badge: string;
};

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 4.5h10M6.5 4.5V3a1 1 0 011-1h1a1 1 0 011 1v1.5M5 4.5l.5 8a1 1 0 001 .9h3a1 1 0 001-.9l.5-8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M7 7v4M9 7v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export default function AddWalletPage() {
  const { preferences } = useLocale();
  const { session } = useAuth();
  const { showToast } = useToast();
  const locale = preferences.locale;
  const isBn = locale === "bn";

  const methods = useMemo<MethodOption[]>(
    () => [
      { id: "bKash", label: isBn ? "বিকাশ" : "bKash", badge: "✈" },
      { id: "Nagad", label: isBn ? "নগদ" : "Nagad", badge: "🎯" },
      { id: "Rocket", label: isBn ? "রকেট" : "Rocket", badge: "🚀" },
    ],
    [isBn],
  );

  const [wallets, setWallets] = useState<UserWalletRecord[]>([]);
  const [walletsLoading, setWalletsLoading] = useState(true);
  const [walletName, setWalletName] = useState("bKash");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [walletNumber, setWalletNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const atLimit = wallets.length >= MAX_USER_WALLETS;
  const validName = accountHolderName.trim().length >= 2;
  const validNumber = walletNumber.trim().length >= 10;
  const canSubmit = !atLimit && validName && validNumber && !submitting;

  useEffect(() => {
    setAccountHolderName(session?.userName?.trim() || "");
  }, [session?.userName]);

  const loadWallets = useCallback(async () => {
    setWalletsLoading(true);
    try {
      setWallets(await fetchUserWallets());
    } catch {
      setWallets([]);
    } finally {
      setWalletsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadWallets();
  }, [loadWallets]);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const created = await createUserWallet({
        walletType: "ewallet",
        walletName,
        accountHolderName,
        walletNumber,
        isDefault: wallets.length === 0,
      });
      setWallets((prev) => [created, ...prev]);
      setWalletNumber("");
      showToast(isBn ? "ওয়ালেট যুক্ত হয়েছে" : "Wallet added", { variant: "success" });
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : isBn
            ? "ওয়ালেট যুক্ত করা যায়নি"
            : "Failed to add wallet",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (wallet: UserWalletRecord) => {
    setDeletingId(wallet._id);
    setError(null);
    try {
      await deleteUserWallet(wallet._id);
      setWallets((prev) => prev.filter((w) => w._id !== wallet._id));
      showToast(isBn ? "ওয়ালেট মুছে ফেলা হয়েছে" : "Wallet removed", { variant: "success" });
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : isBn
            ? "ওয়ালেট মুছে ফেলা যায়নি"
            : "Failed to remove wallet",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={MEMBER_PAGE_BG}>
      <MemberPageHeader
        title={isBn ? "ওয়ালেট যুক্ত করুন" : "Add Wallet"}
        backHref={`/${locale}/member`}
        backLabel={isBn ? "প্রোফাইল" : "Profile"}
      />

      <section className={`${memberContainerNarrow} ${memberPagePaddingNarrow} space-y-4`}>
        <div>
          <p className="mb-2 text-[13px] text-[#9ca3af]">
            {isBn ? "পেমেন্ট মেথড" : "Payment method"}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {methods.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setWalletName(m.id)}
                disabled={atLimit}
                className={`focus-ring rounded-sm border px-2 py-2 text-center transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                  walletName === m.id
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
          <p className="mb-2 text-[13px] text-[#9ca3af]">
            {isBn ? "অ্যাকাউন্ট হোল্ডারের নাম" : "Account holder name"}
          </p>
          <input
            type="text"
            value={accountHolderName}
            onChange={(e) => setAccountHolderName(e.target.value)}
            disabled={atLimit}
            className="focus-ring w-full rounded-sm border border-[#2d2d2d] bg-[#1f2326] px-3 py-3 text-[16px] text-white outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div>
          <p className="mb-2 text-[13px] text-[#9ca3af]">
            {isBn ? "ওয়ালেট নাম্বার" : "Wallet number"}
          </p>
          <input
            type="tel"
            inputMode="numeric"
            value={walletNumber}
            onChange={(e) => setWalletNumber(e.target.value)}
            placeholder="01XXXXXXXXX"
            disabled={atLimit}
            className="focus-ring w-full rounded-sm border border-[#2d2d2d] bg-[#1f2326] px-3 py-3 text-[16px] text-white outline-none placeholder:text-[#6b7280] disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {error ? (
          <p className="text-[13px] text-[#f87171]" role="alert">
            {error}
          </p>
        ) : null}

        {atLimit ? (
          <p className="rounded-sm border border-[#4b3a14] bg-[#2a230f] px-3 py-2.5 text-[13px] text-[#fbbf24]">
            {isBn
              ? `সর্বোচ্চ ${MAX_USER_WALLETS}টি ওয়ালেট যুক্ত করা যায়। নতুন যুক্ত করতে একটি মুছে ফেলুন।`
              : `You can save a maximum of ${MAX_USER_WALLETS} wallets. Remove one to add a new wallet.`}
          </p>
        ) : (
          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => void handleSubmit()}
            className="focus-ring min-h-11 w-full rounded-sm bg-[#178358] px-4 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#1a9664] disabled:cursor-not-allowed disabled:opacity-45"
          >
            {submitting
              ? isBn
                ? "যুক্ত হচ্ছে…"
                : "Adding…"
              : isBn
                ? "ওয়ালেট যুক্ত করুন"
                : "Add wallet"}
          </button>
        )}

        <div>
          <p className="mb-2 mt-2 text-[13px] text-[#9ca3af]">
            {isBn
              ? `সেভ করা ওয়ালেট (${wallets.length}/${MAX_USER_WALLETS})`
              : `Saved wallets (${wallets.length}/${MAX_USER_WALLETS})`}
          </p>

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
            <p className="rounded-sm border border-[#2d2d2d] bg-[#1f2326] px-3 py-4 text-center text-[13px] text-[#6b7280]">
              {isBn ? "এখনও কোনো ওয়ালেট যুক্ত করা হয়নি" : "No wallets added yet"}
            </p>
          ) : (
            <ul className="space-y-2">
              {wallets.map((w) => (
                <li
                  key={w._id}
                  className="flex items-center rounded-sm border border-[#2d2d2d] bg-[#1f2326] px-3 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold text-white">{w.walletName}</p>
                    <p className="mt-0.5 text-[13px] text-[#9ca3af]">{w.walletNumber}</p>
                    <p className="text-[12px] text-[#6b7280]">{w.accountHolderName}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleDelete(w)}
                    disabled={deletingId === w._id}
                    aria-label={isBn ? "ওয়ালেট মুছুন" : "Remove wallet"}
                    className="focus-ring touch-target shrink-0 rounded p-2 text-[#9ca3af] transition-colors hover:bg-white/10 hover:text-[#f87171] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <TrashIcon />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
