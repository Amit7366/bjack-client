"use client";

import { useMemo, useState } from "react";
import {
  PROMOTION_FILTER_IDS,
  filterPromotions,
  promotions,
  type PromotionFilterId,
} from "@/lib/promotions-data";
import { getPromotionMessages } from "@/lib/i18n/promotion-messages";
import { useLocale } from "@/components/LocaleProvider";
import PromotionCard from "./PromotionCard";

export default function PromotionsPageContent() {
  const { preferences } = useLocale();
  const p = getPromotionMessages(preferences.locale);
  const [activeFilter, setActiveFilter] = useState<PromotionFilterId>("all");

  const filtered = useMemo(
    () => filterPromotions(promotions, activeFilter),
    [activeFilter],
  );

  return (
    <div className="min-h-full bg-[#0a0a0a]">
      <div className="mx-auto w-full max-w-[1400px] px-3 py-5 sm:px-4 lg:px-10 xl:px-16">
      <h1 className="mb-4 text-xl font-bold text-white sm:text-2xl">{p.pageTitle}</h1>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {PROMOTION_FILTER_IDS.map((id) => {
          const active = activeFilter === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveFilter(id)}
              className={`focus-ring shrink-0 snap-start rounded-md px-3.5 py-2.5 text-[12px] font-semibold uppercase tracking-wide transition-colors sm:text-[13px] ${
                active
                  ? "bg-[#2a2a2a] text-white ring-1 ring-[#404040]"
                  : "bg-[#1f1f1f] text-[#9ca3af] hover:bg-[#262626] hover:text-white"
              }`}
            >
              {p.filters[id]}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((promo) => (
          <PromotionCard key={promo.id} promo={promo} variant="grid" />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-12 rounded-lg border border-dashed border-[#2a2a2a] bg-[#141414] px-4 py-10 text-center text-sm text-[#9ca3af]">
          {p.noResults}
        </p>
      ) : null}
      </div>
    </div>
  );
}
