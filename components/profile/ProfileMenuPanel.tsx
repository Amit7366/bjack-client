"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { memberSectionHref } from "@/lib/member-routes";
import { getProfileMessages, PROFILE_MENU_ITEMS } from "@/lib/i18n/profile-messages";
import { useAuth } from "@/components/AuthProvider";
import { getProfileUser } from "@/lib/profile-user";
import { useLocale } from "@/components/LocaleProvider";
import { ChevronRight, CopyIcon, ProfileMenuIcon, ProfileNavIcon } from "./ProfileMenuIcons";

type ProfileMenuPanelProps = {
  onClose: () => void;
};

export default function ProfileMenuPanel({ onClose }: ProfileMenuPanelProps) {
  const { preferences } = useLocale();
  const locale = preferences.locale;
  const p = getProfileMessages(locale);
  const router = useRouter();
  const { logout } = useAuth();
  const base = `/${locale}`;

  const profileUser = getProfileUser();
  const [copied, setCopied] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const copyUsername = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(profileUser.username);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [profileUser.username]);

  return (
    <>
      <div className="border-b border-[#2a2a2a] bg-[#252525] px-4 py-3.5">
        <div className="flex gap-3">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#22c55e] to-[#0d3d24]"
            aria-hidden
          >
            <ProfileNavIcon />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-[#9ca3af]">{p.usernameLabel}</p>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="truncate text-[15px] font-bold text-white">
                {profileUser.username}
              </span>
              <button
                type="button"
                onClick={copyUsername}
                aria-label={copied ? p.copied : p.copyUsername}
                className="focus-ring touch-target shrink-0 rounded p-1 text-[#d4d4d4] transition-colors hover:bg-white/10 hover:text-white"
              >
                <CopyIcon />
              </button>
            </div>
            <p className="mt-1 text-[11px] text-[#9ca3af]">
              {p.signUpDateLabel} : {profileUser.signUpDate}
            </p>
          </div>
        </div>
      </div>

      <ul className="py-1">
        {PROFILE_MENU_ITEMS.map(({ id, icon }) => (
          <li key={id}>
            <Link
              href={memberSectionHref(locale, id)}
              className="focus-ring flex min-h-[44px] items-center gap-3 px-4 py-2.5 text-[13px] text-white transition-colors hover:bg-[#2a2a2a] active:bg-[#333]"
              onClick={onClose}
            >
              <ProfileMenuIcon name={icon} />
              <span className="min-w-0 flex-1">{p.menu[id]}</span>
              <ChevronRight />
            </Link>
          </li>
        ))}
      </ul>

      <div className="border-t border-[#2a2a2a] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          disabled={loggingOut}
          onClick={async () => {
            setLoggingOut(true);
            try {
              await logout();
            } finally {
              onClose();
              router.push(`${base}/login`);
              router.refresh();
            }
          }}
          className="focus-ring min-h-11 w-full rounded-md border border-[#444] py-2.5 text-[13px] font-medium text-white transition-colors hover:border-[#666] hover:bg-[#2a2a2a] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loggingOut ? "…" : p.logout}
        </button>
      </div>
    </>
  );
}
