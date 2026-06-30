"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import {
  REFERRAL_BANNER_IMAGE,
  referralRangeStats,
  referralRecentWinners,
  referralRewardLevels,
  referralTopRanks,
} from "@/lib/referral-data";
import { formatReferralNumber, getReferralMessages } from "@/lib/i18n/referral-messages";
import { useLocale } from "@/components/LocaleProvider";
import ReferralRulesModal from "./ReferralRulesModal";
import ReferralStepIcon from "./ReferralStepIcon";

const STEP_IDS = ["invite", "register", "earn"] as const;

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M12.5 4.5L7 10l5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ScrollArrow({ direction, label }: { direction: "left" | "right"; label: string }) {
  return (
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
  );
}

function CrownBadge({ rank, label }: { rank: number; label: string }) {
  return (
    <div className="mb-2 flex flex-col items-center gap-0.5">
      <svg width="22" height="18" viewBox="0 0 22 18" fill="none" aria-hidden>
        <path
          d="M2 14h18l-2-9-4.5 5L11 5 8.5 10 4 5 2 14z"
          fill="#f5c518"
          stroke="#c48a0a"
          strokeWidth="0.6"
        />
      </svg>
      <span className="text-[11px] font-bold text-[#f5c518]">
        {label} {rank}
      </span>
    </div>
  );
}

function AvatarCircle({ seed, large }: { seed: string; large?: boolean }) {
  const hues = seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  const size = large ? "h-14 w-14 sm:h-16 sm:w-16" : "h-12 w-12";
  return (
    <div
      className={`${size} shrink-0 overflow-hidden rounded-full border-2 border-[#f5c518]/40 bg-[#333]`}
      style={{ background: `hsl(${hues} 40% 35%)` }}
    >
      <div className="flex h-full w-full items-center justify-center text-lg font-bold text-white/90">
        {seed.slice(0, 1).toUpperCase()}
      </div>
    </div>
  );
}

export default function ReferralPageContent() {
  const { preferences } = useLocale();
  const r = getReferralMessages(preferences.locale);
  const locale = preferences.locale;
  const base = `/${locale}`;
  const levelsRef = useRef<HTMLDivElement>(null);
  const [rulesOpen, setRulesOpen] = useState(false);

  const rangeLabel = (id: (typeof referralRangeStats)[number]["id"]) => {
    switch (id) {
      case "turnover":
        return r.turnoverRange;
      case "deposit":
        return r.depositRange;
      case "winloss":
        return r.winlossRange;
    }
  };

  const scrollLevels = useCallback((dir: "left" | "right") => {
    const el = levelsRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  }, []);

  const orderedRanks = [
    referralTopRanks.find((x) => x.rank === 2)!,
    referralTopRanks.find((x) => x.rank === 1)!,
    referralTopRanks.find((x) => x.rank === 3)!,
  ];

  return (
    <div className="min-h-full bg-[#0a0a0a]">
      <header className="sticky top-0 z-30 border-b border-[#1f1f1f] bg-[#0a0a0a]/95 backdrop-blur-sm">
        <div className="flex h-[48px] items-center gap-2 px-3 sm:px-4 lg:px-6">
          <Link
            href={base}
            className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10"
            aria-label={r.pageTitle}
          >
            <BackIcon />
          </Link>
          <h1 className="text-[16px] font-semibold text-white sm:text-[17px]">{r.pageTitle}</h1>
        </div>
      </header>

      <div className="relative h-[418px] w-full overflow-hidden">
        <Image
          src={REFERRAL_BANNER_IMAGE}
          alt=""
          fill
          priority
          className="object-contain object-center"
          sizes="100vw"
        />
      </div>

      <div className="mx-auto max-w-5xl space-y-4 px-3 py-4 sm:space-y-5 sm:px-4 sm:py-5 lg:px-6">
        <section className="rounded-xl bg-[#1a1a1a] p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <h2 className="text-[16px] font-bold text-white sm:text-[17px]">{r.whatIsTitle}</h2>
            <button
              type="button"
              onClick={() => setRulesOpen(true)}
              className="focus-ring shrink-0 self-start rounded-md border border-[#555] bg-[#262626] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:border-[#777] hover:bg-[#303030]"
            >
              {r.rules}
            </button>
          </div>
          <p className="mt-4 text-[13px] leading-relaxed text-[#b3b3b3] sm:text-[14px]">{r.whatIsP1}</p>
          <p className="mt-3 text-[13px] leading-relaxed text-[#b3b3b3] sm:text-[14px]">{r.whatIsP2}</p>
        </section>

        <section className="rounded-xl bg-[#1a1a1a] p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[16px] font-bold text-white sm:text-[17px]">{r.cashRewardTitle}</h2>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label={r.prevLevels}
                onClick={() => scrollLevels("left")}
                className="focus-ring flex h-8 w-8 items-center justify-center rounded-full border border-[#444] bg-[#262626] text-[#a3a3a3] hover:text-white"
              >
                <ScrollArrow direction="left" label={r.prevLevels} />
              </button>
              <button
                type="button"
                aria-label={r.nextLevels}
                onClick={() => scrollLevels("right")}
                className="focus-ring flex h-8 w-8 items-center justify-center rounded-full border border-[#444] bg-[#262626] text-[#a3a3a3] hover:text-white"
              >
                <ScrollArrow direction="right" label={r.nextLevels} />
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {referralRangeStats.map((stat) => (
              <p key={stat.id} className="text-[13px] text-white">
                {rangeLabel(stat.id)}:{" "}
                <span className="text-[#f5c518]">
                  {r.moreThan} {formatReferralNumber(locale, stat.value)}
                </span>
              </p>
            ))}
          </div>

          <div
            ref={levelsRef}
            className="mt-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {referralRewardLevels.map((level) => (
              <div
                key={level.id}
                className="flex min-w-[min(100%,200px)] flex-1 items-center justify-between gap-3 rounded-lg bg-[#333333] px-4 py-3.5 sm:min-w-[160px]"
              >
                <span className="text-[14px] font-semibold text-white">
                  {r.levelLabel} {formatReferralNumber(locale, String(level.level))}
                </span>
                <span className="text-[15px] font-bold text-[#f5c518]">
                  {formatReferralNumber(locale, level.rate)}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl bg-[#1a1a1a] p-4 sm:p-5">
          <h2 className="mb-5 text-[16px] font-bold text-white sm:text-[17px]">{r.howToTitle}</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-4">
            {STEP_IDS.map((id, index) => {
              const step = r.steps[id];
              return (
                <div key={id} className="flex flex-col items-center text-center">
                  <span className="text-4xl font-black leading-none text-[#f5c518] sm:text-[42px]">
                    {formatReferralNumber(locale, String(index + 1))}
                  </span>
                  <h3 className="mt-2 text-[14px] font-bold leading-snug text-[#f5c518] sm:text-[15px]">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-[12px] text-white/90 sm:text-[13px]">{step.subtitle}</p>
                  <div className="mt-4">
                    <ReferralStepIcon id={id} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
          <section className="rounded-xl bg-[#1a1a1a] p-4 sm:p-5">
            <h2 className="mb-6 text-center text-[16px] font-bold text-white sm:text-[17px]">
              {r.bonusRanking}
            </h2>
            <div className="flex items-end justify-center gap-2 sm:gap-3">
              {orderedRanks.map((rank) => {
                const isFirst = rank.rank === 1;
                return (
                  <div
                    key={rank.id}
                    className={`flex flex-1 max-w-[120px] flex-col items-center ${isFirst ? "-mt-2" : ""}`}
                  >
                    <CrownBadge rank={rank.rank} label={r.topRank} />
                    <div
                      className={`flex w-full flex-col items-center rounded-t-xl bg-gradient-to-b from-[#178358] to-[#0d4a2e] px-2 pb-4 pt-3 ${
                        isFirst ? "min-h-[160px] sm:min-h-[180px]" : "min-h-[130px] sm:min-h-[150px]"
                      }`}
                    >
                      <AvatarCircle seed={rank.avatarSeed} large={isFirst} />
                      <p className="mt-2 w-full truncate text-center text-[11px] font-medium text-white sm:text-[12px]">
                        {rank.username}
                      </p>
                      <p className="mt-1 text-center text-[13px] font-bold text-[#f5c518] sm:text-[14px]">
                        {formatReferralNumber(locale, rank.amount)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-xl bg-[#1a1a1a] p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="text-[16px] font-bold text-white sm:text-[17px]">{r.whoGotPrize}</h2>
              <span className="flex items-center gap-1.5 text-[12px] font-medium text-[#4ade80]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#4ade80]" />
                {r.live}
              </span>
            </div>
            <div className="max-h-[320px] overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]">
              <ul className="divide-y divide-[#2a2a2a]">
                {referralRecentWinners.map((row) => (
                  <li
                    key={row.id}
                    className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-3 text-[13px] first:pt-0"
                  >
                    <span className="font-medium text-white">{row.username}</span>
                    <span className="font-semibold text-[#f5c518]">
                      {row.amount} {r.currency}
                    </span>
                    <span className="w-full text-[12px] text-[#9ca3af] sm:w-auto sm:text-right">
                      {row.timestamp}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>

      <ReferralRulesModal open={rulesOpen} locale={locale} onClose={() => setRulesOpen(false)} />
    </div>
  );
}
