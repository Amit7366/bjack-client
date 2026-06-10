"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { lobbyCategoryHref } from "@/lib/vendor-routes";
import { getProfileMessages } from "@/lib/i18n/profile-messages";
import { getMemberCenterMessages } from "@/lib/i18n/member-center-messages";
import { BottomProfileNavIcon } from "./profile/ProfileMenuIcons";
import ProfileMobileSheet from "./profile/ProfileMobileSheet";
import { CasinoSpadeIcon, Slots777Icon } from "./SidebarIcons";
import { useAuth } from "./AuthProvider";
import { useLocale } from "./LocaleProvider";

function BottomMenuIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
      <defs>
        <linearGradient id="bnMenuG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8ef0b4" />
          <stop offset="100%" stopColor="#157a47" />
        </linearGradient>
      </defs>
      <rect x="5" y="7" width="18" height="2.5" rx="1.25" fill="url(#bnMenuG)" />
      <rect x="5" y="12.75" width="18" height="2.5" rx="1.25" fill="url(#bnMenuG)" />
      <rect x="5" y="18.5" width="18" height="2.5" rx="1.25" fill="url(#bnMenuG)" />
    </svg>
  );
}

function BottomGiftIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
      <defs>
        <linearGradient id="bnGiftG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8ef0b4" />
          <stop offset="100%" stopColor="#157a47" />
        </linearGradient>
        <linearGradient id="bnGiftGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe566" />
          <stop offset="100%" stopColor="#c48a0a" />
        </linearGradient>
      </defs>
      <rect x="5" y="12" width="18" height="11" rx="2" fill="url(#bnGiftG)" />
      <path d="M14 12v11" stroke="url(#bnGiftGold)" strokeWidth="2" />
      <path d="M5 15.5h18" stroke="url(#bnGiftGold)" strokeWidth="2" />
      <path
        d="M14 12c-2.5 0-4.5-1.2-4.5-3s2-3.2 4.5-1.5c2.3-1.7 4.5-.8 4.5 1.5s-2 3-4.5 3z"
        fill="url(#bnGiftGold)"
      />
      <ellipse cx="10" cy="14" rx="3" ry="2" fill="#fff" opacity="0.2" />
    </svg>
  );
}

function BottomMemberIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
      <defs>
        <linearGradient id="bnMemberG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8ef0b4" />
          <stop offset="100%" stopColor="#157a47" />
        </linearGradient>
      </defs>
      <path
        d="M8 5h12l5 7-11 11L3 12l5-7z"
        fill="url(#bnMemberG)"
        stroke="url(#bnMemberG)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M3.6 12h20.8M8 5l3 7 3 10.5M20 5l-3 7-3 10.5M11 12l3-7 3 7"
        stroke="#0a0a0a"
        strokeWidth="1.1"
        strokeLinejoin="round"
        opacity="0.55"
      />
      <path d="M9 7.5l2.5-1.5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

type MobileBottomNavProps = {
  onMenuClick: () => void;
  menuOpen?: boolean;
  profileOpen?: boolean;
  onProfileClick: () => void;
  onProfileClose: () => void;
};

type NavItemProps = {
  active: boolean;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  href?: string;
  ariaExpanded?: boolean;
};

function NavItem({ active, label, icon, onClick, href, ariaExpanded }: NavItemProps) {
  const className = `focus-ring relative flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5 px-0.5 py-1.5 transition-colors ${
    active ? "text-white" : "text-[#a3a3a3] hover:text-[#d4d4d4]"
  }`;

  const content = (
    <>
      {active ? (
        <span
          className="absolute inset-x-1 top-0 h-0.5 rounded-full bg-[#178358] lg:hidden"
          aria-hidden
        />
      ) : null}
      <span className="flex h-7 w-7 items-center justify-center">{icon}</span>
      <span className="max-w-full truncate text-[10px] font-medium leading-tight sm:text-[11px]">
        {label}
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className} aria-current={active ? "page" : undefined}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
      aria-expanded={ariaExpanded}
      aria-label={label}
    >
      {content}
    </button>
  );
}

export default function MobileBottomNav({
  onMenuClick,
  menuOpen,
  profileOpen,
  onProfileClick,
  onProfileClose,
}: MobileBottomNavProps) {
  const { preferences, t } = useLocale();
  const { isUser, authReady } = useAuth();
  const pathname = usePathname();
  const locale = preferences.locale;
  const base = `/${locale}`;
  const p = getProfileMessages(locale);
  const mc = getMemberCenterMessages(locale);

  const isCasino = pathname === `${base}/casino` || pathname.startsWith(`${base}/casino?`);
  const isSlot = pathname === `${base}/slot` || pathname.startsWith(`${base}/slot?`);
  const isPromotion =
    pathname === `${base}/promotion` || pathname.startsWith(`${base}/promotion?`);
  const isMember = pathname === `${base}/member` || pathname.startsWith(`${base}/member/`);
  const isProfileActive = !!profileOpen;

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#2a2a2a] bg-[#1a1a1a] pb-[env(safe-area-inset-bottom)] lg:hidden"
        aria-label={t.ui.bottomNavigation}
      >
        <div className="mx-auto flex w-full max-w-lg items-stretch">
          <NavItem
            active={!!menuOpen}
            label={t.ui.menu}
            icon={<BottomMenuIcon />}
            onClick={onMenuClick}
            ariaExpanded={menuOpen}
          />
          {/* <NavItem
            active={isCasino}
            label={t.casino}
            icon={<CasinoSpadeIcon />}
            href={lobbyCategoryHref(locale, "casino")}
          /> */}
          <NavItem
            active={isSlot}
            label={t.slots}
            icon={<Slots777Icon />}
            href={lobbyCategoryHref(locale, "slot")}
          />
          <NavItem
            active={isPromotion}
            label={t.promotions}
            icon={<BottomGiftIcon />}
            href={`${base}/promotion`}
          />
          {authReady && isUser ? (
            <NavItem
              active={isMember}
              label={mc.navLabel}
              icon={<BottomMemberIcon />}
              href={`${base}/member`}
            />
          ) : null}
          {authReady && isUser ? (
            <NavItem
              active={isProfileActive}
              label={p.navLabel}
              icon={<BottomProfileNavIcon />}
              onClick={onProfileClick}
              ariaExpanded={profileOpen}
            />
          ) : null}
        </div>
      </nav>

      {authReady && isUser ? <ProfileMobileSheet open={!!profileOpen} onClose={onProfileClose} /> : null}
    </>
  );
}
