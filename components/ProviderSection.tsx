"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { featuredProviders } from "@/lib/home-providers-data";
import { featuredProviderHref } from "@/lib/vendor-routes";
import { useMounted } from "@/lib/use-mounted";
import { useLocale } from "./LocaleProvider";

type FeaturedProvider = (typeof featuredProviders)[number];

function ProviderLogo({ initials, color }: { initials: string; color: string }) {
  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-[#111]"
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}

function ProviderCard({ id, initials, color }: FeaturedProvider) {
  const { t, preferences } = useLocale();
  const label = t.home.providers[id] ?? id;
  const href = featuredProviderHref(preferences.locale, id);

  return (
    <Link
      href={href}
      className="flex min-w-[148px] shrink-0 items-center gap-3 rounded-md bg-[#1f1f1f] px-3 py-3 transition-colors hover:bg-[#2a2a2a] sm:min-w-[160px]"
    >
      <ProviderLogo initials={initials} color={color} />
      <span className="truncate text-[13px] font-medium text-[#d4d4d4]">{label}</span>
    </Link>
  );
}

function NavButton({
  direction,
  onClick,
  disabled,
  label,
}: {
  direction: "left" | "right";
  onClick: () => void;
  disabled: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-[#333333] bg-[#1a1a1a] text-[#a3a3a3] transition-colors hover:border-[#444444] hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
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

export default function ProviderSection() {
  const { t } = useLocale();
  const mounted = useMounted();
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setCanScrollLeft(track.scrollLeft > 4);
    setCanScrollRight(track.scrollLeft + track.clientWidth < track.scrollWidth - 4);
  }, []);

  const scroll = useCallback(
    (direction: "left" | "right") => {
      const track = trackRef.current;
      if (!track) return;
      const amount = direction === "left" ? -320 : 320;
      track.scrollBy({ left: amount, behavior: "smooth" });
      window.setTimeout(updateScrollState, 320);
    },
    [updateScrollState],
  );

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [updateScrollState]);

  return (
    <section className="bg-[#0a0a0a]">
      <div className="mx-auto w-full max-w-[1400px] px-3 py-5 sm:px-4 lg:px-10 xl:px-16">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-5 w-[3px] rounded-full bg-[#178358]" aria-hidden />
          <h2 className="text-[15px] font-semibold text-[#e5e5e5]">{t.home.providerTitle}</h2>
        </div>

        <div className="flex items-center gap-2">
          <NavButton direction="left" onClick={() => scroll("left")} disabled={mounted ? !canScrollLeft : false} label={t.ui.previousProviders} />
          <NavButton direction="right" onClick={() => scroll("right")} disabled={mounted ? !canScrollRight : false} label={t.ui.nextProviders} />
        </div>
      </div>

      <div
        ref={trackRef}
        onScroll={updateScrollState}
        className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {featuredProviders.map((provider) => (
          <ProviderCard key={provider.id} {...provider} />
        ))}
      </div>
      </div>
    </section>
  );
}
