"use client";

import Link from "next/link";
import {
  promotionThemeGradient,
  type PromotionDisplayItem,
} from "@/lib/deposit-promotion-display";
import { getPromotionMessages } from "@/lib/i18n/promotion-messages";
import { useLocale } from "@/components/LocaleProvider";

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className="shrink-0">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7 4v3.5l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M3 7h8M8 4.5 10.5 7 8 9.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const TAG_STYLE = "bg-white/10 text-[#e5e5e5] ring-1 ring-white/10";

function formatPromoDate(raw: string, locale: string): string {
  const normalized = raw.replace(/(\d{4})-(\d{2})-(\d{2})/, "$1-$2-$3").replace(/(\d{4})\/(\d{2})\/(\d{2})/, "$1-$2-$3");
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return raw.split(" ")[0] ?? raw;
  return date.toLocaleDateString(locale === "bn" ? "bn-BD" : locale === "hi" ? "hi-IN" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function PromoBanner({ promo, large }: { promo: PromotionDisplayItem; large?: boolean }) {
  return (
    <div
      className={`relative w-full overflow-hidden bg-gradient-to-br ${promotionThemeGradient(promo.theme)} ${
        large ? "min-h-[200px] lg:min-h-[280px]" : "aspect-[16/10]"
      }`}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-24 w-24 rounded-full bg-black/20 blur-xl"
        aria-hidden
      />
      {promo.badge ? (
        <span className="absolute left-3 top-3 rounded-md bg-[#c41e3a]/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white sm:left-4 sm:top-4 sm:px-3 sm:py-1 sm:text-[11px]">
          {promo.badge}
        </span>
      ) : null}
      <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5">
        {promo.highlight ? (
          <p
            className={`font-black uppercase leading-none text-[#fde047] drop-shadow-lg ${
              large ? "text-[24px] sm:text-[32px] lg:text-[36px]" : "text-[18px] sm:text-[22px]"
            }`}
          >
            {promo.highlight}
          </p>
        ) : null}
        {!large ? (
          <p className="mt-2 line-clamp-2 text-[13px] font-bold leading-snug text-white">{promo.title}</p>
        ) : null}
      </div>
    </div>
  );
}

type PromotionCardProps = {
  promo: PromotionDisplayItem;
  variant?: "grid" | "slider" | "featured";
  href?: string;
};

export default function PromotionCard({ promo, variant = "grid", href }: PromotionCardProps) {
  const { preferences } = useLocale();
  const p = getPromotionMessages(preferences.locale);
  const linkHref = href ?? `/${preferences.locale}/member/deposit/quick?promo=${encodeURIComponent(promo.code)}`;
  const endDate = formatPromoDate(promo.validityEnd, preferences.locale);
  const badgeLabel = promo.badge ? p.badges[promo.badge] ?? promo.badge : undefined;

  const promoWithBadgeLabel = badgeLabel ? { ...promo, badge: badgeLabel } : promo;

  if (variant === "slider") {
    return (
      <Link
        href={linkHref}
        className="focus-ring group relative block w-[min(72vw,220px)] shrink-0 snap-start overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#141414] shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#178358]/40 sm:w-[200px]"
      >
        <PromoBanner promo={promoWithBadgeLabel} />
        <div className="px-3 py-2.5">
          <p className="line-clamp-2 text-[11px] font-semibold leading-snug text-[#d4d4d4]">{promo.title}</p>
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <article className="group relative overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#141414] shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr]">
          <PromoBanner promo={promoWithBadgeLabel} large />

          <div className="flex flex-col justify-center gap-4 p-5 sm:p-6 lg:p-8">
            <div className="flex flex-wrap gap-1.5">
              {promo.tags.slice(0, 4).map((tag) => (
                <span key={tag} className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${TAG_STYLE}`}>
                  {tag}
                </span>
              ))}
            </div>

            <div>
              <h2 className="text-[20px] font-bold leading-snug text-white sm:text-[22px]">{promo.title}</h2>
              <p className="mt-2 text-[13px] leading-relaxed text-[#b3b3b3] sm:text-[14px]">{promo.description}</p>
            </div>

            <div className="grid grid-cols-1 gap-2 text-[12px] text-[#9ca3af] sm:grid-cols-2 sm:text-[13px]">
              <div className="flex items-center gap-2">
                <ClockIcon />
                <span>
                  {p.validUntil} {endDate}
                </span>
              </div>
              {promo.minDeposit > 0 ? (
                <p>
                  {p.minDeposit}: ৳{promo.minDeposit.toLocaleString("en-US")}
                </p>
              ) : null}
              {promo.turnoverX > 0 ? (
                <p>
                  {p.turnover}: {promo.turnoverX}x
                </p>
              ) : null}
            </div>

            <Link
              href={linkHref}
              className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#178358] to-[#22c55e] px-5 py-3 text-[14px] font-bold text-white shadow-[0_4px_20px_rgba(23,131,88,0.35)] transition-all hover:from-[#1a9664] hover:to-[#34d399] sm:w-fit"
            >
              {p.depositCta}
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#262626] bg-[#141414] shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1 hover:border-[#178358]/35 hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)]">
      <PromoBanner promo={promoWithBadgeLabel} />

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap gap-1.5">
          {promo.tags.slice(0, 3).map((tag) => (
            <span key={tag} className={`rounded-full px-2 py-0.5 text-[10px] font-semibold sm:text-[11px] ${TAG_STYLE}`}>
              {tag}
            </span>
          ))}
        </div>

        <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-white sm:text-[16px]">{promo.title}</h3>
        <p className="line-clamp-2 text-[12px] leading-relaxed text-[#9ca3af] sm:text-[13px]">{promo.description}</p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#9ca3af] sm:text-[12px]">
          <div className="flex items-center gap-1.5">
            <ClockIcon />
            <span>{endDate}</span>
          </div>
          {promo.turnoverX > 0 ? (
            <span>
              {p.turnover} {promo.turnoverX}x
            </span>
          ) : null}
        </div>

        <Link
          href={linkHref}
          className="focus-ring mt-auto inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#4ade80] transition-colors group-hover:text-[#86efac]"
        >
          {p.depositCta}
          <ArrowIcon />
        </Link>
      </div>
    </article>
  );
}
