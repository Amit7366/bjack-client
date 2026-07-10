"use client";

import ImageCarouselSection from "./ImageCarouselSection";
import { eventCarouselSlides } from "@/lib/home-carousel-data";
import { useLocale } from "./LocaleProvider";

export default function EventSection() {
  const { t } = useLocale();

  return (
    <ImageCarouselSection
      title={t.home.eventTitle}
      slides={eventCarouselSlides}
      variant="banner"
      autoSlideMs={4500}
    />
  );
}
