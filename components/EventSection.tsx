"use client";

import ImageCarouselSection from "./ImageCarouselSection";
import { eventSlideImages } from "@/lib/home-carousel-data";
import { useLocale } from "./LocaleProvider";

export default function EventSection() {
  const { t } = useLocale();

  return (
    <ImageCarouselSection
      title={t.home.eventTitle}
      slides={eventSlideImages.map((image, index) => ({
        image,
        title: `${t.home.eventTitle} ${index + 1}`,
      }))}
      variant="banner"
      autoSlideMs={4500}
    />
  );
}
