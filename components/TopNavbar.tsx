"use client";

import Link from "next/link";
import { lobbyCategoryHref, type LobbyKind } from "@/lib/vendor-routes";
import LocaleMenuButton from "./LocaleMenuButton";
import LoggedInWalletBar from "./nav/LoggedInWalletBar";
import ProfileDropdown from "./profile/ProfileDropdown";
import { useAuth } from "./AuthProvider";
import { useLocale } from "./LocaleProvider";

function MenuIcon() {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden>
      <rect y="0" width="18" height="2" rx="1" fill="#e5b800" />
      <rect y="6" width="18" height="2" rx="1" fill="#e5b800" />
      <rect y="12" width="18" height="2" rx="1" fill="#e5b800" />
    </svg>
  );
}

function SportsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="10" fill="#2a1f4e" stroke="#7b5ea7" strokeWidth="1" />
      <path
        d="M11 4l1.8 3.6 4 .6-2.9 2.8.7 4L11 13.4 7.4 15l.7-4L5.2 8.2l4-.6L11 4z"
        fill="#d4a843"
      />
      <path d="M7 11h8M11 7v8" stroke="#9b7fd4" strokeWidth="0.8" />
    </svg>
  );
}

function SlotIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <rect x="2" y="4" width="18" height="14" rx="3" fill="#1a5c38" />
      <rect x="4" y="6" width="4.5" height="10" rx="1" fill="#f5c518" />
      <rect x="8.75" y="6" width="4.5" height="10" rx="1" fill="#f5c518" />
      <rect x="13.5" y="6" width="4.5" height="10" rx="1" fill="#f5c518" />
      <text x="5.2" y="13.5" fill="#1a5c38" fontSize="6" fontWeight="bold">
        7
      </text>
      <text x="9.95" y="13.5" fill="#1a5c38" fontSize="6" fontWeight="bold">
        7
      </text>
      <text x="14.7" y="13.5" fill="#1a5c38" fontSize="6" fontWeight="bold">
        7
      </text>
    </svg>
  );
}

function CasinoIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <path
        d="M11 3l8.5 4.5v7L11 19 2.5 14.5v-7L11 3z"
        fill="#1a8a54"
        stroke="#2cb86e"
        strokeWidth="0.8"
      />
      <path
        d="M11 7.5c-2.2 0-3.8 1.4-3.8 3.1 0 1.2 1.8 2.8 3.8 4.6 2-1.8 3.8-3.4 3.8-4.6 0-1.7-1.6-3.1-3.8-3.1z"
        fill="#0d4a2e"
      />
      <path d="M9.2 15.8h3.6v1.4H9.2z" fill="#0d4a2e" />
    </svg>
  );
}

function NavLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="focus-ring flex items-center gap-1.5 rounded-md px-2.5 py-2 text-[13px] text-[#d4d4d4] transition-colors hover:bg-white/5 hover:text-white"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function NavbarAuthActions() {
  const { preferences, t } = useLocale();
  const { isUser, authReady } = useAuth();
  const locale = preferences.locale;

  if (!authReady) {
    return (
      <div
        className="h-9 w-[9.5rem] shrink-0 rounded-md bg-[#2a2a2a]/60 sm:w-[11rem]"
        aria-hidden
      />
    );
  }

  if (isUser) {
    return <LoggedInWalletBar />;
  }

  return (
    <>
      <Link
        href={`/${locale}/login`}
        className="focus-ring flex h-9 min-w-[4.5rem] items-center justify-center rounded-md border border-[#555555] px-3 text-[12px] font-medium text-white transition-colors hover:border-[#777777] hover:bg-white/5 sm:min-w-[5rem] sm:text-[13px]"
      >
        {t.login}
      </Link>
      <Link
        href={`/${locale}/register`}
        className="focus-ring flex h-9 min-w-[4.5rem] items-center justify-center rounded-md bg-[#178358] px-3 text-[12px] font-medium text-white transition-colors hover:bg-[#1a9664] sm:min-w-[5rem] sm:text-[13px]"
      >
        {t.signUp}
      </Link>
    </>
  );
}

export default function TopNavbar({
  onMenuClick,
  menuOpen,
}: {
  onMenuClick: () => void;
  menuOpen?: boolean;
}) {
  const { preferences, t } = useLocale();
  const { isUser, authReady } = useAuth();
  const locale = preferences.locale;
  const navHrefs: { kind: LobbyKind; icon: React.ReactNode; label: string }[] = [
    { kind: "sports", icon: <SportsIcon />, label: t.sidebar.sports },
    { kind: "slot", icon: <SlotIcon />, label: t.slots },
    { kind: "casino", icon: <CasinoIcon />, label: t.casino },
  ];

  return (
    <header className="sticky top-0 z-50 w-full shrink-0 border-b border-[#2a2a2a] bg-[#121212] pt-[env(safe-area-inset-top)]">
      <nav className="flex h-[52px] w-full items-center justify-between gap-2 px-3 sm:px-4 lg:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3 lg:gap-4">
          <button
            type="button"
            aria-label={t.ui.openMenu}
            aria-expanded={menuOpen}
            onClick={onMenuClick}
            className={`focus-ring hidden h-10 w-10 shrink-0 items-center justify-center rounded-md transition-colors lg:flex ${
              menuOpen ? "bg-[#333333]" : "bg-[#2a2a2a] hover:bg-[#333333]"
            }`}
          >
            <MenuIcon />
          </button>

          <Link
            href={`/${locale}`}
            className="focus-ring flex shrink-0 items-center rounded-md text-[20px] font-bold tracking-tight sm:text-[22px]"
          >
            <span className="text-white">BK</span>
            <span className="text-[#ed1c24]">Baji</span>
          </Link>

          <div className="hidden min-w-0 items-center gap-0.5 md:flex">
            {navHrefs.map(({ kind, icon, label }) => (
              <NavLink key={kind} href={lobbyCategoryHref(locale, kind)} icon={icon} label={label} />
            ))}
            {authReady && isUser ? <ProfileDropdown menuAlign="start" /> : null}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 lg:gap-3">
          <NavbarAuthActions />
          <LocaleMenuButton />
        </div>
      </nav>
    </header>
  );
}
