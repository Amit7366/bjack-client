"use client";

import {
  ambassadorItems,
  footerAboutLinks,
  footerFeatureLinks,
  footerGamingLinks,
  footerHelpLinks,
  sponsorshipItems,
} from "@/lib/footer-data";
import { ExternalLinkIcon } from "./SidebarIcons";
import FooterBottomSection from "./FooterBottomSection";
import { useLocale } from "./LocaleProvider";

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-3 text-[13px] font-semibold text-white">{title}</h3>
      <ul className="space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({
  label,
  external,
}: {
  label: string;
  external?: boolean;
}) {
  return (
    <li>
      <a
        href="#"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="inline-flex items-center gap-1.5 text-[12px] text-[#9ca3af] transition-colors hover:text-white"
      >
        <span>{label}</span>
        {external ? <ExternalLinkIcon /> : null}
      </a>
    </li>
  );
}

function SponsorshipLogo({ color, initials }: { color: string; initials: string }) {
  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}

function AmbassadorMark({ mark }: { mark: string }) {
  return (
    <div className="flex h-9 w-12 shrink-0 items-center justify-center">
      <span className="font-[cursive] text-lg italic text-white/90">{mark}</span>
    </div>
  );
}

export default function SiteFooter() {
  const { t } = useLocale();
  const f = t.footer;

  return (
    <footer className="safe-bottom border-t border-[#1f1f1f] bg-black">
      <div className="mx-auto w-full max-w-[1400px] px-3 py-8 sm:px-4 lg:px-10 xl:px-16">
      <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-2 md:grid-cols-4">
        <FooterColumn title={f.gaming}>
          {footerGamingLinks.map((id) => (
            <FooterLink key={id} label={f.links[id]} />
          ))}
        </FooterColumn>

        <FooterColumn title={f.aboutBaji}>
          {footerAboutLinks.map((link) => (
            <FooterLink key={link.id} label={f.links[link.id]} external={link.external} />
          ))}
        </FooterColumn>

        <FooterColumn title={f.features}>
          {footerFeatureLinks.map((link) => (
            <FooterLink key={link.id} label={f.links[link.id]} external={link.external} />
          ))}
        </FooterColumn>

        <FooterColumn title={f.help}>
          {footerHelpLinks.map((link) => (
            <FooterLink key={link.id} label={f.links[link.id]} external={link.external} />
          ))}
        </FooterColumn>
      </div>

      <div className="my-8 border-t border-[#1f1f1f]" />

      <div>
        <h3 className="mb-4 text-[13px] font-semibold text-[#4ade80]">{f.sponsorships}</h3>
        <div className="flex flex-wrap gap-x-8 gap-y-5">
          {sponsorshipItems.map((item) => {
            const data = f.sponsorshipsData[item.id];
            return (
              <a key={item.id} href="#" className="flex min-w-0 max-w-full items-center gap-3 sm:min-w-[140px]">
                <SponsorshipLogo color={item.color} initials={item.initials} />
                <div>
                  <p className="text-[12px] font-medium text-white">{data.name}</p>
                  <p className="text-[11px] text-[#6b7280]">{data.role}</p>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      <div className="my-8 border-t border-[#1f1f1f]" />

      <div>
        <h3 className="mb-4 text-[13px] font-semibold text-[#4ade80]">{f.brandAmbassadors}</h3>
        <div className="flex flex-wrap gap-x-8 gap-y-5">
          {ambassadorItems.map((item) => {
            const data = f.ambassadorsData[item.id];
            return (
              <a key={item.id} href="#" className="flex min-w-0 max-w-full items-center gap-3 sm:min-w-[120px]">
                <AmbassadorMark mark={item.mark} />
                <div>
                  <p className="text-[12px] font-medium text-white">{data.name}</p>
                  <p className="text-[11px] text-[#6b7280]">{data.years}</p>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      <FooterBottomSection />
      </div>
    </footer>
  );
}
