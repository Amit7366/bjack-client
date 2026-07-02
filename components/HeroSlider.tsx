"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useLocale } from "./LocaleProvider";

const HERO_SLIDES = [
  "https://i.ibb.co.com/ynDfHL33/slider1.png",
  "https://i.ibb.co.com/WWKrzy5j/slider2.png",
  "https://i.ibb.co.com/ZzLFj2YT/slider3.png",
  "https://i.ibb.co.com/Fq4KgTqj/slider4.png",
  "https://i.ibb.co.com/C5KJmpyx/slide5.png",
  "https://i.ibb.co.com/DDhDV8kM/slide6.png",
];

export default function HeroSlider() {
  const { t } = useLocale();
  const [active, setActive] = useState(0);

  const next = useCallback(() => {
    setActive((current) => (current + 1) % HERO_SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setActive((current) => (current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(next, 6000);
    return () => window.clearInterval(timer);
  }, [next]);

  return (
    <section className="relative w-full overflow-hidden bg-black">
      <div className="relative h-[160px] w-full sm:h-[220px] lg:h-[320px]">
        {HERO_SLIDES.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt={`${t.ui.goToSlide} ${index + 1}`}
            fill
            priority={index === 0}
            sizes="100vw"
            unoptimized
            aria-hidden={index !== active}
            className={`select-none object-cover object-center transition-opacity duration-500 lg:object-contain ${
              index === active ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          />
        ))}
      </div>

      <button
        type="button"
        aria-label={t.ui.previousSlide}
        onClick={prev}
        className="focus-ring absolute left-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md bg-black/45 text-lg text-white backdrop-blur-sm transition hover:bg-black/65 sm:left-4 sm:h-11 sm:w-11"
      >
        ‹
      </button>
      <button
        type="button"
        aria-label={t.ui.nextSlide}
        onClick={next}
        className="focus-ring absolute right-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md bg-black/45 text-lg text-white backdrop-blur-sm transition hover:bg-black/65 sm:right-4 sm:h-11 sm:w-11"
      >
        ›
      </button>

      <div className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 sm:bottom-3 sm:gap-2">
        {HERO_SLIDES.map((src, index) => (
          <button
            key={src}
            type="button"
            aria-label={`${t.ui.goToSlide} ${index + 1}`}
            aria-current={index === active ? "true" : undefined}
            onClick={() => setActive(index)}
            className="focus-ring flex h-8 w-8 items-center justify-center sm:h-11 sm:w-11"
          >
            <span
              className={`block rounded-full transition-all ${
                index === active ? "h-1.5 w-5 bg-[#178358] sm:h-2.5 sm:w-6" : "h-1.5 w-3 bg-white/35 sm:h-2 sm:w-3"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
