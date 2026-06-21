"use client";

import { useEffect, useState } from "react";
import { fetchPublicDepositPromotions } from "@/lib/deposit-promotions";
import {
  mapDepositPromotionsToDisplay,
  type PromotionDisplayItem,
} from "@/lib/deposit-promotion-display";
import { useLocale } from "@/components/LocaleProvider";
import PromotionCard from "./PromotionCard";

export default function PromotionSidebarSlider() {
  const { preferences } = useLocale();
  const [items, setItems] = useState<PromotionDisplayItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await fetchPublicDepositPromotions();
        if (cancelled) return;
        setItems(mapDepositPromotionsToDisplay(list, preferences.locale).slice(0, 4));
      } catch {
        if (!cancelled) setItems([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [preferences.locale]);

  if (items.length === 0) return null;

  return (
    <div className="px-2 pb-3 pt-1">
      <div className="flex gap-2 overflow-x-auto overscroll-x-contain pb-2 [-ms-overflow-style:none] [scrollbar-width:thin] [scrollbar-color:#404040_transparent] snap-x snap-mandatory [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#404040] [&::-webkit-scrollbar-track]:bg-transparent">
        {items.map((promo) => (
          <PromotionCard key={promo.id} promo={promo} variant="slider" />
        ))}
      </div>
    </div>
  );
}
