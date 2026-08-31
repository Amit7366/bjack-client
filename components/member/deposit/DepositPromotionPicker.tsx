"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_PROMO_CODE,
  fetchDepositPromotions,
  getPromotionDescription,
  getPromotionLabel,
  hasSelectedPromotion,
  type DepositPromotion,
} from "@/lib/deposit-promotions";

function GiftIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20 12v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8M4 7h16M12 22V7M12 7H8.5a2.5 2.5 0 110-5C11 2 12 4 12 7zm0 0h3.5a2.5 2.5 0 100-5C13 2 12 4 12 7z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M6.5 4.5L11.5 9l-5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type Props = {
  isBn: boolean;
  selectedCode: string;
  onChange: (code: string, minDeposit: number) => void;
};

export default function DepositPromotionPicker({
  isBn,
  selectedCode,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [promotions, setPromotions] = useState<DepositPromotion[]>([]);
  const [draftCode, setDraftCode] = useState(selectedCode);
  const [tab, setTab] = useState<"valid" | "invalid">("valid");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchDepositPromotions();
      setPromotions(list);
    } catch {
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setDraftCode(selectedCode);
  }, [selectedCode]);

  const selected = useMemo(
    () => promotions.find((p) => p.code === selectedCode),
    [promotions, selectedCode],
  );

  const selectedLabel = useMemo(() => {
    if (selected) {
      if (selected.code === DEFAULT_PROMO_CODE && selected.bonusRate > 0) {
        const pct = Math.round(selected.bonusRate * 100);
        return isBn ? `নরমাল · ${pct}% বোনাস` : `Normal · ${pct}% Bonus`;
      }
      return getPromotionLabel(selected, isBn);
    }
    if (!hasSelectedPromotion(selectedCode)) {
      return isBn ? "নরমাল · ২% বোনাস" : "Normal · 2% Bonus";
    }
    return isBn ? "নরমাল" : "Normal";
  }, [selected, selectedCode, isBn]);

  const validList = promotions;
  const invalidList: DepositPromotion[] = [];

  const list = tab === "valid" ? validList : invalidList;

  const handleConfirm = () => {
    const picked = promotions.find((p) => p.code === draftCode);
    onChange(draftCode, picked?.minDeposit ?? 0);
    setOpen(false);
  };

  return (
    <>
      <div>
        <p className="mb-2 text-[13px] text-[#9ca3af]">
          {isBn ? "প্রমোশন সিলেক্ট করুন" : "Select promotion"}
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="focus-ring flex w-full items-center gap-3 rounded-sm border border-[#2d2d2d] bg-[#1f2326] px-3 py-3 text-left transition-colors hover:border-[#3b3b3b]"
        >
          <span className="text-white">
            <GiftIcon />
          </span>
          <span className="flex-1 text-[15px] font-medium text-white">
            {isBn ? "প্রমোশন" : "Promotion"}
          </span>
          <span className="max-w-[45%] truncate text-[13px] text-[#9ca3af]">
            {selectedLabel}
          </span>
          <span className="text-[#9ca3af]">
            <ChevronRight />
          </span>
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/70 sm:items-center">
          <div className="flex max-h-[92vh] w-full max-w-lg flex-col rounded-t-2xl bg-[#1a1a1a] shadow-2xl sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-[#2d2d2d] px-4 py-4">
              <h2 className="text-[17px] font-semibold text-white">
                {isBn ? "প্রমোশন সিলেক্ট করুন" : "Select promotion"}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="focus-ring rounded p-1 text-[#9ca3af] hover:text-white"
                aria-label={isBn ? "বন্ধ করুন" : "Close"}
              >
                <CloseIcon />
              </button>
            </div>

            <div className="flex border-b border-[#2d2d2d]">
              <button
                type="button"
                onClick={() => setTab("valid")}
                className={`flex-1 py-3 text-[14px] font-medium ${
                  tab === "valid"
                    ? "border-b-2 border-[#23c97f] text-[#23c97f]"
                    : "text-[#9ca3af]"
                }`}
              >
                {isBn ? "ভ্যালিড" : "Valid"} ({validList.length})
              </button>
              <button
                type="button"
                onClick={() => setTab("invalid")}
                className={`flex-1 py-3 text-[14px] font-medium ${
                  tab === "invalid"
                    ? "border-b-2 border-[#23c97f] text-[#23c97f]"
                    : "text-[#9ca3af]"
                }`}
              >
                {isBn ? "ইনভ্যালিড" : "Invalid"} ({invalidList.length})
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-3">
              {loading ? (
                <p className="py-8 text-center text-[13px] text-[#9ca3af]">
                  {isBn ? "লোড হচ্ছে…" : "Loading…"}
                </p>
              ) : list.length === 0 ? (
                <p className="py-8 text-center text-[13px] text-[#9ca3af]">
                  {tab === "invalid"
                    ? isBn
                      ? "কোনো ইনভ্যালিড প্রমোশন নেই"
                      : "No invalid promotions"
                    : isBn
                      ? "কোনো প্রমোশন নেই"
                      : "No promotions"}
                </p>
              ) : (
                <div className="space-y-2">
                  {list.map((promo) => {
                    const active = draftCode === promo.code;
                    return (
                      <button
                        key={promo.code}
                        type="button"
                        onClick={() => setDraftCode(promo.code)}
                        className={`focus-ring w-full rounded-lg border p-3 text-left transition-colors ${
                          active
                            ? "border-[#23c97f] bg-[#1f2a24]"
                            : "border-[#2d2d2d] bg-[#222] hover:border-[#3b3b3b]"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="text-[14px] font-semibold text-white">
                              {getPromotionLabel(promo, isBn)}
                            </p>
                            <p className="mt-0.5 text-[12px] text-[#9ca3af]">
                              {getPromotionDescription(promo, isBn)}
                            </p>
                            <p className="mt-2 text-[11px] leading-5 text-[#6b7280]">
                              {promo.validFrom} ~ {promo.validTo}
                            </p>
                            {promo.minDeposit > 0 ? (
                              <p className="mt-1 text-[11px] text-[#6b7280]">
                                {isBn ? "ন্যূনতম ডিপোজিট" : "Min deposit"}: ৳
                                {promo.minDeposit.toLocaleString("en-US")}
                              </p>
                            ) : null}
                          </div>
                          <span
                            className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                              active
                                ? "border-[#23c97f] bg-[#23c97f]"
                                : "border-[#555] bg-transparent"
                            }`}
                          >
                            {active ? (
                              <span className="h-2 w-2 rounded-full bg-white" />
                            ) : null}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="border-t border-[#2d2d2d] p-4">
              <button
                type="button"
                onClick={handleConfirm}
                className="focus-ring min-h-11 w-full rounded-sm bg-[#178358] text-[15px] font-semibold text-white hover:bg-[#1a9664]"
              >
                {isBn ? "নিশ্চিত করুন" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export { DEFAULT_PROMO_CODE };
