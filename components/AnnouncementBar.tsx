"use client";

import { useLocale } from "./LocaleProvider";

function MegaphoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M3 7.5 10 4.5v9L3 10.5V7.5zm10.5-1.5 2.25 1.35v4.3L13.5 12v-6z"
        fill="#2cb86e"
      />
      <path d="M13.5 6v6c.9-.3 1.5-1.1 1.5-2.1v-1.8c0-1-.6-1.8-1.5-2.1z" fill="#8ef0b4" />
    </svg>
  );
}

export default function AnnouncementBar() {
  const { t } = useLocale();
  const text = t.home.announcement;
  const items = Array.from({ length: 4 }, () => text);

  return (
    <section className="border-y border-[#252525] bg-[#111111]">
      <div className="mx-auto flex h-10 w-full max-w-[1400px] items-center gap-3 px-3 sm:px-4 lg:px-10 xl:px-16">
        <div className="flex shrink-0 items-center justify-center rounded-md bg-[#178358]/15 p-1.5">
          <MegaphoneIcon />
        </div>

        <div className="announcement-marquee relative min-w-0 flex-1 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#111111] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#111111] to-transparent" />

          <div className="announcement-track flex w-max will-change-transform">
            <div className="flex shrink-0 items-center gap-12 pr-12">
              {items.map((item, index) => (
                <span key={`a-${index}`} className="whitespace-nowrap text-[13px] text-[#e8e8e8]">
                  {item}
                </span>
              ))}
            </div>
            <div className="flex shrink-0 items-center gap-12 pr-12" aria-hidden>
              {items.map((item, index) => (
                <span key={`b-${index}`} className="whitespace-nowrap text-[13px] text-[#e8e8e8]">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
