"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { getHomePromoMessages } from "@/lib/i18n/home-promo-messages";
import { BKBAJI_ANDROID_APP_PATH, SITE_ICONS, SITE_NAME } from "@/lib/seo/site-config";

type HomePromoSliderModalProps = {
  open: boolean;
  onClose: () => void;
};

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d={direction === "left" ? "M10 3L5 8l5 5" : "M6 3l5 5-5 5"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RibbonBanner({ children, variant = "red" }: { children: React.ReactNode; variant?: "red" | "green" }) {
  const bg =
    variant === "green"
      ? "bg-gradient-to-r from-[#1f9d55] via-[#27ae60] to-[#1f9d55]"
      : "bg-gradient-to-r from-[#c62828] via-[#e53935] to-[#c62828]";

  return (
    <div className="relative mx-auto w-full max-w-[92%] py-1">
      <div
        className={`relative ${bg} px-4 py-2 text-center shadow-[0_3px_8px_rgba(0,0,0,0.25)]`}
        style={{ clipPath: "polygon(8px 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 8px 100%, 0 50%)" }}
      >
        <p className="text-[13px] font-extrabold leading-snug text-[#ffe082] drop-shadow-sm sm:text-[14px]">
          {children}
        </p>
      </div>
    </div>
  );
}

function BonusRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[92%] rounded-full border border-[#f3c4c4] bg-white px-4 py-2.5 text-center shadow-sm">
      <p className="text-[12px] font-semibold text-[#1f2937] sm:text-[13px]">{children}</p>
    </div>
  );
}

function CoinDecor() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-24 overflow-hidden" aria-hidden>
      {Array.from({ length: 8 }).map((_, i) => (
        <span
          key={i}
          className="absolute h-5 w-5 rounded-full bg-gradient-to-br from-[#ffd54f] to-[#ffb300] shadow-sm"
          style={{
            left: `${8 + i * 11}%`,
            top: `${6 + (i % 3) * 10}px`,
            opacity: 0.85 - (i % 3) * 0.15,
            transform: `rotate(${i * 18}deg)`,
          }}
        />
      ))}
    </div>
  );
}

function NewMemberSlide() {
  const { preferences } = useLocale();
  const m = getHomePromoMessages(preferences.locale);

  return (
    <div className="relative min-h-[420px] bg-gradient-to-b from-[#ffe8e8] via-[#fff3ee] to-[#fff8f5] px-3 pb-6 pt-4">
      <CoinDecor />
      <div className="relative space-y-3 pt-6">
        <RibbonBanner>{m.newMemberBanner}</RibbonBanner>
        <BonusRow>{m.firstDepositBonus}</BonusRow>
        <BonusRow>{m.secondDepositBonus}</BonusRow>
        <BonusRow>{m.thirdDepositBonus}</BonusRow>

        <div className="pt-2">
          <RibbonBanner>{m.referralBanner}</RibbonBanner>
          <p className="mx-auto mt-3 max-w-[92%] text-center text-[12px] font-medium leading-relaxed text-[#374151] sm:text-[13px]">
            {m.referralEarnText}
          </p>
          <div className="mx-auto mt-3 grid max-w-[92%] grid-cols-2 gap-2.5">
            <div className="rounded-xl border-2 border-[#b39ddb] bg-white/90 px-2 py-3 text-center">
              <p className="text-[11px] font-bold leading-snug text-[#5e35b1] sm:text-[12px]">{m.perInvitation}</p>
            </div>
            <div className="rounded-xl border-2 border-[#b39ddb] bg-white/90 px-2 py-3 text-center">
              <p className="text-[11px] font-bold leading-snug text-[#5e35b1] sm:text-[12px]">{m.perDeposit}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppDownloadSlide() {
  const { preferences } = useLocale();
  const m = getHomePromoMessages(preferences.locale);

  return (
    <div className="min-h-[420px] bg-gradient-to-b from-[#e8f8ef] to-[#f4fff8] px-3 pb-6 pt-4">
      <div className="rounded-2xl border-2 border-[#27ae60]/40 bg-[#f0fff5] p-3">
        <RibbonBanner variant="green">{m.appDownloadBanner}</RibbonBanner>
        <p className="mt-3 text-center text-[13px] font-semibold text-[#1f2937]">{m.appDownloadLine1}</p>
        <p className="mt-1 text-center text-[12px] font-bold text-[#c62828]">{m.appDownloadGift}</p>

        <div className="relative mx-auto mt-4 flex h-28 w-full max-w-[220px] items-center justify-center">
          <span className="absolute left-4 top-2 text-2xl" aria-hidden>
            🎁
          </span>
          <span className="absolute right-6 top-6 text-xl" aria-hidden>
            💰
          </span>
          <div className="relative z-10 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#4a148c] to-[#7b1fa2] shadow-lg ring-2 ring-[#ffd54f]">
            <Image src={SITE_ICONS.pwa192} alt="" width={56} height={56} className="h-14 w-14 rounded-xl object-cover" />
          </div>
          <span className="absolute bottom-2 left-8 text-lg" aria-hidden>
            💵
          </span>
        </div>

        <a
          href={BKBAJI_ANDROID_APP_PATH}
          download
          className="focus-ring mx-auto mt-3 block w-full max-w-[92%] rounded-full bg-gradient-to-r from-[#27ae60] to-[#1e8449] py-2.5 text-center text-[13px] font-bold text-white shadow-md"
        >
          {m.downloadApp}
        </a>

        <div className="mt-5">
          <RibbonBanner variant="green">{m.exclusiveEventBanner}</RibbonBanner>
          <div className="mt-3 space-y-2">
            {[m.cashbackEvent, m.saturdayLogin, m.memberDay].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-full border border-[#81c784] bg-white px-3 py-2 shadow-sm"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#27ae60] text-[11px] font-bold text-white">
                  ‹
                </span>
                <p className="text-[11px] font-semibold text-[#1f2937] sm:text-[12px]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const SLIDES = [NewMemberSlide, AppDownloadSlide] as const;

export default function HomePromoSliderModal({ open, onClose }: HomePromoSliderModalProps) {
  const { preferences } = useLocale();
  const m = getHomePromoMessages(preferences.locale);
  const [active, setActive] = useState(0);

  const prev = useCallback(() => {
    setActive((current) => (current - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  const next = useCallback(() => {
    setActive((current) => (current + 1) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") prev();
      if (event.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, prev, next]);

  if (!open) return null;

  const ActiveSlide = SLIDES[active];
  const slideTitle = active === 0 ? m.slide1Title : m.slide2Title;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/65 p-4">
      <button type="button" className="absolute inset-0" aria-label={m.close} onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={slideTitle}
        className="relative z-10 w-full max-w-[360px] overflow-hidden rounded-2xl shadow-2xl"
      >
        <div className="relative bg-[#2d1347] px-4 py-3 text-center">
          <p className="text-[15px] font-bold text-white">{slideTitle}</p>
          <button
            type="button"
            onClick={onClose}
            aria-label={m.close}
            className="focus-ring absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-md bg-[#1a0a2e] text-[#ffd54f]"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="relative">
          <ActiveSlide />

          <button
            type="button"
            onClick={prev}
            aria-label={m.previousSlide}
            className="focus-ring absolute left-1 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm"
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label={m.nextSlide}
            className="focus-ring absolute right-1 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm"
          >
            <ChevronIcon direction="right" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 bg-[#2d1347] py-3">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`${m.nextSlide} ${index + 1}`}
              aria-current={index === active ? "true" : undefined}
              onClick={() => setActive(index)}
              className="focus-ring p-1"
            >
              <span
                className={`block rounded-full transition-all ${
                  index === active ? "h-2 w-5 bg-white" : "h-2 w-2 bg-white/35"
                }`}
              />
            </button>
          ))}
        </div>

        <p className="sr-only">{SITE_NAME}</p>
        <Link href={`/${preferences.locale}/register`} className="sr-only">
          {m.slide1Title}
        </Link>
      </div>
    </div>
  );
}
