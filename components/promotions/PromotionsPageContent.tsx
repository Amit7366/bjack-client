"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PROMOTION_FILTER_IDS, type PromotionFilterId } from "@/lib/promotions-data";
import {
  filterDepositPromotions,
  mapDepositPromotionsToDisplay,
  pickFeaturedPromotion,
  type PromotionDisplayItem,
} from "@/lib/deposit-promotion-display";
import { fetchPublicDepositPromotions } from "@/lib/deposit-promotions";
import { getPromotionMessages } from "@/lib/i18n/promotion-messages";
import { useLocale } from "@/components/LocaleProvider";
import PromotionCard from "./PromotionCard";

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M12.5 4.5L7 10l5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GiftIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <rect x="3" y="9" width="16" height="10" rx="1.5" fill="#178358" />
      <path d="M11 9V19M3 12h16" stroke="#0d4a2e" strokeWidth="1.2" />
      <path
        d="M11 9c-2.5 0-4-1.2-4-3s1.2-3 4-3 4 1.2 4 3-1.5 3-4 3z"
        fill="#f5c518"
        stroke="#c48a0a"
        strokeWidth="0.8"
      />
      <path d="M7 6c-1.5-1-2-2.5-1-3.5s2-1 3.5 0L11 4" stroke="#fde047" strokeWidth="1" strokeLinecap="round" />
      <path d="M15 6c1.5-1 2-2.5 1-3.5s-2-1-3.5 0L11 4" stroke="#fde047" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export default function PromotionsPageContent() {
  const { preferences } = useLocale();
  const p = getPromotionMessages(preferences.locale);
  const base = `/${preferences.locale}`;
  const [activeFilter, setActiveFilter] = useState<PromotionFilterId>("all");
  const [promotions, setPromotions] = useState<PromotionDisplayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadPromotions = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const list = await fetchPublicDepositPromotions();
      setPromotions(mapDepositPromotionsToDisplay(list, preferences.locale));
    } catch {
      setPromotions([]);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [preferences.locale]);

  useEffect(() => {
    void loadPromotions();
  }, [loadPromotions]);

  const filtered = useMemo(
    () => filterDepositPromotions(promotions, activeFilter),
    [promotions, activeFilter],
  );

  const showFeatured = activeFilter === "all" && filtered.length > 0;
  const featured = showFeatured ? pickFeaturedPromotion(filtered) : undefined;
  const gridItems = featured ? filtered.filter((item) => item.id !== featured.id) : filtered;

  return (
    <div className="min-h-full bg-[#0a0a0a]">
      <header className="sticky top-0 z-30 border-b border-[#1f1f1f] bg-[#0a0a0a]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-[48px] w-full max-w-[1400px] items-center gap-2 px-3 sm:px-4 lg:px-10 xl:px-16">
          <Link
            href={base}
            className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10"
            aria-label={p.back}
          >
            <BackIcon />
          </Link>
          <h1 className="text-[16px] font-semibold text-white sm:text-[17px]">{p.pageTitle}</h1>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-[#1f1f1f]">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#0d2818] via-[#111111] to-[#0a0a0a]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-16 top-0 h-56 w-56 rounded-full bg-[#178358]/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 left-1/4 h-32 w-32 rounded-full bg-[#f5c518]/10 blur-2xl"
          aria-hidden
        />

        <div className="relative mx-auto w-full max-w-[1400px] px-3 py-6 sm:px-4 sm:py-8 lg:px-10 xl:px-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#178358]/30 bg-[#178358]/10 px-3 py-1">
                <GiftIcon />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#4ade80]">
                  {p.pageTitle}
                </span>
              </div>
              <h2 className="text-[22px] font-bold leading-tight text-white sm:text-[28px]">
                {p.pageTitle}
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-[#b3b3b3] sm:text-[15px]">
                {p.pageSubtitle}
              </p>
            </div>
            <div className="shrink-0 rounded-xl border border-[#2a2a2a] bg-[#141414]/80 px-4 py-3 backdrop-blur-sm">
              <p className="text-[28px] font-black leading-none text-[#f5c518]">
                {loading ? "…" : filtered.length}
              </p>
              <p className="mt-1 text-[12px] font-medium text-[#9ca3af]">{p.promotionsCount}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="sticky top-[48px] z-20 border-b border-[#1f1f1f] bg-[#0a0a0a]/95 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-[1400px] px-3 py-3 sm:px-4 lg:px-10 xl:px-16">
          <div className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {PROMOTION_FILTER_IDS.map((id) => {
              const active = activeFilter === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveFilter(id)}
                  className={`focus-ring shrink-0 rounded-full px-4 py-2 text-[12px] font-semibold transition-all sm:text-[13px] ${
                    active
                      ? "bg-gradient-to-r from-[#178358] to-[#22c55e] text-white shadow-[0_4px_16px_rgba(23,131,88,0.35)]"
                      : "border border-[#2a2a2a] bg-[#141414] text-[#9ca3af] hover:border-[#404040] hover:text-white"
                  }`}
                >
                  {p.filters[id]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-3 py-5 sm:px-4 sm:py-6 lg:px-10 xl:px-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#2a2a2a] bg-[#141414] px-6 py-16 text-center">
            <div className="mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[#178358] border-t-transparent" />
            <p className="text-[14px] text-[#9ca3af]">{p.loading}</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#2a2a2a] bg-[#141414] px-6 py-16 text-center">
            <p className="max-w-md text-[14px] leading-relaxed text-[#9ca3af]">{p.loadError}</p>
            <button
              type="button"
              onClick={() => void loadPromotions()}
              className="focus-ring mt-5 rounded-full border border-[#404040] bg-[#1f1f1f] px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:border-[#178358] hover:bg-[#178358]/10"
            >
              {p.filters.all}
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#2a2a2a] bg-[#141414] px-6 py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#1f1f1f]">
              <GiftIcon />
            </div>
            <p className="max-w-md text-[14px] leading-relaxed text-[#9ca3af]">{p.noResults}</p>
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className="focus-ring mt-5 rounded-full border border-[#404040] bg-[#1f1f1f] px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:border-[#178358] hover:bg-[#178358]/10"
            >
              {p.filters.all}
            </button>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {featured ? (
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#f5c518]" aria-hidden />
                  <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#f5c518]">
                    {p.featuredLabel}
                  </h3>
                </div>
                <PromotionCard promo={featured} variant="featured" />
              </section>
            ) : null}

            {gridItems.length > 0 ? (
              <section>
                {featured ? (
                  <h3 className="mb-4 text-[15px] font-bold text-white sm:text-[16px]">
                    {p.filters[activeFilter]}
                  </h3>
                ) : null}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {gridItems.map((promo) => (
                    <PromotionCard key={promo.id} promo={promo} variant="grid" />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
