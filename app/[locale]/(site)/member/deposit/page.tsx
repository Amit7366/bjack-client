"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useLocale } from "@/components/LocaleProvider";
import {
  MEMBER_PAGE_BG,
  memberContainerNarrow,
  memberPagePaddingNarrow,
  MemberPageHeader,
} from "@/components/member/shared/member-ui";

function RowIcon({ kind }: { kind: "quick" | "ewallet" | "crypto" | "bank" }) {
  if (kind === "quick") {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path d="M10 3v3M10 14v3M3 10h3M14 10h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path
          d="M6.3 6.3l2.1 2.1M11.6 11.6l2.1 2.1M13.7 6.3l-2.1 2.1M8.4 11.6l-2.1 2.1"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    );
  }

  if (kind === "ewallet") {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <rect x="3.5" y="2.8" width="13" height="14.4" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M7 6h6M7 9h4M7 12h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M9.2 15.1h1.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "crypto") {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path
          d="M10 2.8l6 3.3v7L10 16.4l-6-3.3v-7L10 2.8z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path d="M10 6.8v6.4M7.6 8.3h4.8M7.6 11.7h4.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="2.8" y="7.8" width="14.4" height="9.2" rx="1.7" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6 7.8V5.9a4 4 0 018 0v1.9" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6.2 11h7.6" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="text-[#bfbfbf]">
      <path d="M6 3.5L10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LogoBadge({ text, tone }: { text: string; tone: "pink" | "gold" | "purple" | "green" | "orange" | "gray" }) {
  const bg =
    tone === "pink"
      ? "bg-[#ef2e8a]"
      : tone === "gold"
        ? "bg-[#f59e0b]"
        : tone === "purple"
          ? "bg-[#a855f7]"
          : tone === "green"
            ? "bg-[#3cb28e]"
            : tone === "orange"
              ? "bg-[#f59e0b]"
              : "bg-[#d6d3d1]";
  return (
    <span className={`inline-flex h-6 min-w-6 items-center justify-center rounded px-1.5 text-[10px] font-bold text-white ${bg}`}>
      {text}
    </span>
  );
}

type DepositRow = {
  id: string;
  icon: "quick" | "ewallet" | "crypto" | "bank";
  title: string;
  logos: { text: string; tone: "pink" | "gold" | "purple" | "green" | "orange" | "gray" }[];
  percent?: string;
  href?: string;
};

export default function MemberDepositPage() {
  const { preferences, t } = useLocale();
  const locale = preferences.locale;
  const isBn = locale === "bn";

  const rows = useMemo<DepositRow[]>(
    () => [
      {
        id: "quick",
        icon: "quick",
        title: isBn ? "Quick deposit" : "Quick deposit",
        logos: [
          { text: "✈", tone: "pink" },
          { text: "🎯", tone: "gold" },
          { text: "নগদ", tone: "purple" },
        ],
        href: `/${locale}/member/deposit/quick`,
      },
      // {
      //   id: "ewallet",
      //   icon: "ewallet",
      //   title: isBn ? "ই-ওয়ালেট" : "E-wallet",
      //   logos: [
      //     { text: "✈", tone: "pink" },
      //     { text: "🎯", tone: "gold" },
      //     { text: "নগদ", tone: "purple" },
      //   ],
      //   percent: isBn ? "100% শতাংশ" : "100%",
      // },
      // {
      //   id: "crypto",
      //   icon: "crypto",
      //   title: isBn ? "ক্রিপ্টো" : "Crypto",
      //   logos: [
      //     { text: "₮", tone: "green" },
      //     { text: "₿", tone: "orange" },
      //     { text: "⬡", tone: "gray" },
      //   ],
      //   percent: isBn ? "100% শতাংশ" : "100%",
      // },
      // {
      //   id: "local-bank",
      //   icon: "bank",
      //   title: isBn ? "লোকাল ব্যাংক" : "Local bank",
      //   logos: [
      //     { text: "◎", tone: "gray" },
      //     { text: "◍", tone: "gray" },
      //     { text: "◭", tone: "gray" },
      //   ],
      //   percent: isBn ? "100% শতাংশ" : "100%",
      // },
    ],
    [isBn],
  );

  return (
    <div className={MEMBER_PAGE_BG}>
      <MemberPageHeader
        title={t.navbar.deposit}
        backHref={`/${locale}/member/personal-info`}
        backLabel={isBn ? "প্রোফাইল" : "Profile"}
      />

      <section className={`${memberContainerNarrow} ${memberPagePaddingNarrow}`}>
        <div className="space-y-2.5">
          {rows.map((row) => (
            <Link
              key={row.id}
              href={row.href ?? "#"}
              className="focus-ring flex min-h-[58px] w-full items-center rounded-md border border-[#2c2c2c] bg-[#1d1f22] px-3.5 py-3 text-left transition-colors hover:border-[#3a3a3a] hover:bg-[#25282c]"
              aria-disabled={!row.href}
              onClick={(e) => {
                if (!row.href) e.preventDefault();
              }}
            >
              <span className="mr-2.5 text-[#d5d5d5]">
                <RowIcon kind={row.icon} />
              </span>

              <span className="min-w-0 flex-1 text-[15px] font-semibold text-[#f2f2f2]">{row.title}</span>

              <span className="mr-2 flex items-center gap-1.5">
                {row.logos.map((logo, index) => (
                  <LogoBadge key={`${row.id}-${index}`} text={logo.text} tone={logo.tone} />
                ))}
              </span>

              {row.percent ? <span className="mr-2 text-[14px] font-semibold text-[#1ed088]">{row.percent}</span> : null}
              <ChevronRight />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
