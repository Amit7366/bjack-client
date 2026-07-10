"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "./LocaleProvider";
import GameCard from "./games/GameCard";
import type { CarouselSlide } from "@/lib/home-carousel-data";

type ImageCarouselSectionProps = {
  title: string;
  slides: CarouselSlide[];
  variant: "banner" | "card";
  autoSlideMs?: number;
};

function NavButton({
  direction,
  onClick,
  label,
}: {
  direction: "left" | "right";
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="focus-ring flex h-9 w-9 items-center justify-center rounded-md border border-[#333333] bg-[#1a1a1a] text-[#a3a3a3] transition-colors hover:border-[#444444] hover:text-white"
    >
      <svg width="8" height="12" viewBox="0 0 8 12" fill="none" aria-hidden>
        {direction === "left" ? (
          <path
            d="M6.5 1L1.5 6l5 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M1.5 1l5 5-5 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}

export default function ImageCarouselSection({
  title,
  slides,
  variant,
  autoSlideMs = 4500,
}: ImageCarouselSectionProps) {
  const { t } = useLocale();
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  const getScrollStep = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.children.length === 0) return 0;
    const first = track.children[0] as HTMLElement;
    const gap = variant === "banner" ? 10 : 8;
    return first.offsetWidth + gap;
  }, [variant]);

  const scroll = useCallback(
    (direction: "left" | "right") => {
      const track = trackRef.current;
      if (!track) return;
      const step = getScrollStep();
      if (!step) return;

      if (direction === "right") {
        const maxScroll = track.scrollWidth - track.clientWidth;
        if (track.scrollLeft >= maxScroll - 4) {
          track.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          track.scrollBy({ left: step, behavior: "smooth" });
        }
      } else if (track.scrollLeft <= 4) {
        track.scrollTo({ left: track.scrollWidth, behavior: "smooth" });
      } else {
        track.scrollBy({ left: -step, behavior: "smooth" });
      }
    },
    [getScrollStep],
  );

  useEffect(() => {
    if (paused || slides.length <= 1) return;

    const id = window.setInterval(() => {
      scroll("right");
    }, autoSlideMs);

    return () => window.clearInterval(id);
  }, [autoSlideMs, slides.length, paused, scroll]);

  function slideTitle(slide: CarouselSlide, index: number): string {
    if (slide.gameId) {
      const games = t.home.games as Record<string, string>;
      return games[slide.gameId] ?? slide.gameId;
    }
    if (slide.title) return slide.title;
    return `${title} ${index + 1}`;
  }

  const itemClass =
    variant === "banner"
      ? "relative h-[150px] w-[min(88vw,360px)] shrink-0 snap-start overflow-hidden rounded-lg sm:h-[128px] sm:w-[min(88vw,380px)] lg:h-[200px] lg:w-[min(32vw,420px)]"
      : "relative h-[140px] w-[92px] shrink-0 snap-start overflow-hidden rounded-md sm:h-[168px] sm:w-[108px] lg:h-[188px] lg:w-[124px]";

  return (
    <section
      className="bg-[#0a0a0a]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto w-full max-w-[1400px] px-3 py-5 sm:px-4 lg:px-10 xl:px-16">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-5 w-[3px] rounded-full bg-[#178358]" aria-hidden />
          <h2 className="text-[15px] font-semibold text-[#e5e5e5]">{title}</h2>
        </div>

        <div className="flex items-center gap-2">
          <NavButton direction="left" onClick={() => scroll("left")} label={t.ui.previousSlideShort} />
          <NavButton direction="right" onClick={() => scroll("right")} label={t.ui.nextSlideShort} />
        </div>
      </div>

      <div
        ref={trackRef}
        className={`flex overflow-x-auto pb-1 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          variant === "banner" ? "gap-2.5" : "gap-2"
        }`}
      >
        {slides.map((slide, index) => (
          <GameCard
            key={`${slide.image}-${index}`}
            image={slide.image}
            gameId={slide.gameId}
            gameCode={slide.gameCode}
            title={slideTitle(slide, index)}
            className={itemClass}
            contentClassName="!aspect-auto h-full"
            sizes={variant === "banner" ? "420px" : "124px"}
            imageClassName="object-cover"
            unoptimized
          />
        ))}
      </div>
      </div>
    </section>
  );
}
