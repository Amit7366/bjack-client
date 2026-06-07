"use client";

import ImageCarouselSection from "./ImageCarouselSection";
import type { CarouselSlide } from "@/lib/home-carousel-data";
import { useLocale } from "./LocaleProvider";

export default function ExclusiveGamesSection({ slides }: { slides: CarouselSlide[] }) {
  const { t } = useLocale();

  return (
    <ImageCarouselSection
      title={t.home.exclusiveGamesTitle}
      slides={slides}
      variant="card"
      autoSlideMs={4000}
    />
  );
}
