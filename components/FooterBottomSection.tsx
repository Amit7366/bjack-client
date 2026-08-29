"use client";

import { useState } from "react";
import { socialLinks } from "@/lib/footer-social-data";
import { useLocale } from "./LocaleProvider";

function GreenSectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-4 text-[12px] font-semibold text-[#4ade80]">{children}</h3>;
}

function CazvipLogo() {
  return (
    <div className="text-[22px] font-black tracking-wide text-[#d4a843]">
      CAZ<span className="text-[#f5c518]">VIP</span>
    </div>
  );
}

function CuracaoLogo() {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#22c55e] via-[#3b82f6] to-[#a855f7] text-[10px] font-black text-white">
        GC
      </div>
      <span className="text-[10px] font-semibold leading-tight text-[#9ca3af]">
        GAMING
        <br />
        CURACAO
      </span>
    </div>
  );
}

function AnjouanLogo() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-[#4b5563] bg-[#1f2937] text-[8px] font-bold leading-tight text-[#d1d5db]">
      Anjouan
      <br />
      eGaming
    </div>
  );
}

function SealLogo() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#dc2626] bg-[#7f1d1d] text-[9px] font-bold text-[#fbbf24]">
      ✓
    </div>
  );
}

function StopHandIcon() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#6b7280] text-lg text-[#d1d5db]">
      🛑
    </div>
  );
}

function GamcareLogo() {
  return (
    <div className="text-[11px] font-bold tracking-wider text-[#d1d5db]">GAMCARE</div>
  );
}

function Age18Icon() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#6b7280] text-[11px] font-bold text-[#d1d5db]">
      18+
    </div>
  );
}

function SocialIcon({ color, label }: { color: string; label: string }) {
  return (
    <a
      href="#"
      className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white transition-opacity hover:opacity-85"
      style={{ backgroundColor: color }}
    >
      {label}
    </a>
  );
}

export default function FooterBottomSection() {
  const { t } = useLocale();
  const b = t.footer.bottom;
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div className="my-8 border-t border-[#1f1f1f]" />

      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <GreenSectionTitle>{b.officialBrandPartner}</GreenSectionTitle>
          <CazvipLogo />
        </div>

        <div>
          <GreenSectionTitle>{b.gamingLicense}</GreenSectionTitle>
          <div className="flex flex-wrap items-center gap-4">
            <CuracaoLogo />
            <AnjouanLogo />
            <SealLogo />
          </div>
        </div>

        <div>
          <GreenSectionTitle>{b.responsibleGaming}</GreenSectionTitle>
          <div className="flex flex-wrap items-center gap-4">
            <StopHandIcon />
            <GamcareLogo />
            <Age18Icon />
          </div>
        </div>
      </div>

      <div className="my-8 border-t border-[#1f1f1f]" />

      <div className="flex flex-wrap justify-center gap-2.5">
        {socialLinks.map((social) => (
          <SocialIcon key={social.id} color={social.color} label={social.label} />
        ))}
      </div>

      <div className="my-8 border-t border-[#1f1f1f]" />

      <div className="relative">
        <h3 className="mb-3 text-[13px] font-semibold text-[#d1d5db]">{b.aboutHeading}</h3>
        <p className={`whitespace-pre-line text-[11px] leading-[1.7] text-[#6b7280] ${expanded ? "" : "line-clamp-4"}`}>
          {b.aboutText}
          {expanded ? `\n\n${b.aboutTextMore}` : null}
        </p>
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((open) => !open)}
            className="rounded-md border border-[#333333] bg-[#1a1a1a] px-6 py-1.5 text-[12px] text-white transition-colors hover:bg-[#262626]"
          >
            {expanded ? b.showLess : b.showMore}
          </button>
        </div>
      </div>

      <div className="my-8 border-t border-[#1f1f1f]" />

      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
        <a href="#" className="text-[26px] font-bold tracking-tight">
          <span className="text-white">Raja</span>
          <span className="text-[#ed1c24]">baji</span>
        </a>
        <div>
          <p className="text-[13px] font-semibold text-[#4ade80]">{b.winLikeAKing}</p>
          <p className="text-[11px] text-[#6b7280]">{b.copyright}</p>
        </div>
      </div>

      <div className="my-8 border-t border-[#1f1f1f]" />

      <div className="space-y-3 text-[11px] leading-[1.7] text-[#6b7280]">
        <p>
          <span className="text-[#4ade80]">rajabaji.com</span> {b.legalOwnership}
        </p>
        <p>
          {b.legalContactPrefix}{" "}
          <a href="mailto:legal@northernlightsltd.com" className="text-[#4ade80] hover:underline">
            legal@northernlightsltd.com
          </a>
          .
        </p>
        <p>
          <span className="text-[#4ade80]">rajabaji.com</span> {b.legalLicense}
        </p>
        <p>
          <span className="text-[#4ade80]">rajabaji.com</span> {b.legalCompliance}
        </p>
      </div>
    </>
  );
}
