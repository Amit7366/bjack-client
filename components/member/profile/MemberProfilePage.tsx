"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getMemberProfileMessages } from "@/lib/i18n/member-profile-messages";
import { memberSectionHref } from "@/lib/member-routes";
import {
  dateOfBirthHref,
  emailHref,
  fullLegalNameHref,
  phoneHref,
} from "@/lib/member-personal-routes";
import {
  changePasswordHref,
  documentsHref,
  PROFILE_TABS,
  type ProfileTabId,
} from "@/lib/member-profile-tabs";
import { fetchMyNormalUserProfile } from "@/lib/member/profile-api";
import { PROFILE_CACHE_CHANGE_EVENT } from "@/lib/member/profile-cache";
import { getProfileUser, type ProfileUser } from "@/lib/profile-user";
import {
  memberContainerProfile,
  MEMBER_PAGE_BG,
  memberPagePadding,
  memberPanelBorder,
  MemberPageHeader,
} from "@/components/member/shared/member-ui";
import { getProfileMessages } from "@/lib/i18n/profile-messages";
import { useToast } from "@/components/ToastProvider";
import { useLocale } from "@/components/LocaleProvider";

function ChevronRight() {
  return (
    <svg width="8" height="12" viewBox="0 0 8 12" fill="none" aria-hidden className="shrink-0 opacity-70">
      <path
        d="M1.5 1l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <rect x="4.5" y="4.5" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M3 9.5V3.5A1.5 1.5 0 014.5 2H9.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden className="shrink-0">
      <circle cx="9" cy="9" r="8" fill="#e85d4a" />
      <path d="M9 5v5M9 12.5v.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="40" height="44" viewBox="0 0 40 44" fill="none" aria-hidden className="shrink-0">
      <path
        d="M20 3l14 5v11c0 9-6 16-14 18-8-2-14-9-14-18V8l14-5z"
        fill="url(#shieldGrad)"
        stroke="#22c55e"
        strokeWidth="1"
      />
      <path
        d="M13 22l4 4 10-10"
        stroke="#86efac"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="shieldGrad" x1="20" y1="3" x2="20" y2="37" gradientUnits="userSpaceOnUse">
          <stop stopColor="#166534" />
          <stop offset="1" stopColor="#0d2818" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function InfoRow({
  label,
  children,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const inner = (
    <>
      <span className="text-[13px] text-[#d4d4d4] sm:text-[14px]">{label}</span>
      <div className="flex flex-wrap items-center justify-end gap-2 text-[13px] text-white sm:text-[14px]">
        {children}
      </div>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="focus-ring flex min-h-[52px] w-full flex-col gap-2 border-b border-[#2a2a2a] px-4 py-4 text-left transition-colors last:border-b-0 hover:bg-white/[0.02] active:bg-white/[0.04] sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5"
      >
        {inner}
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2 border-b border-[#2a2a2a] px-4 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5">
      {inner}
    </div>
  );
}

function ManageAction({ label }: { label: string }) {
  return (
  <>
      <span className="text-[#d4d4d4]">{label}</span>
      <ChevronRight />
    </>
  );
}

type MemberProfilePageProps = {
  activeTab: ProfileTabId;
};

export default function MemberProfilePage({ activeTab }: MemberProfilePageProps) {
  const { preferences } = useLocale();
  const locale = preferences.locale;
  const m = getMemberProfileMessages(locale);
  const profileNav = getProfileMessages(locale);
  const router = useRouter();
  const { showToast } = useToast();
  const [profileUser, setProfileUser] = useState<ProfileUser>(() => getProfileUser());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    function refresh() {
      setProfileUser(getProfileUser());
    }
    refresh();
    window.addEventListener(PROFILE_CACHE_CHANGE_EVENT, refresh);
    return () => window.removeEventListener(PROFILE_CACHE_CHANGE_EVENT, refresh);
  }, []);

  useEffect(() => {
    if (activeTab !== "personal-info") return;
    let cancelled = false;
    fetchMyNormalUserProfile()
      .then(() => {
        if (!cancelled) setProfileUser(getProfileUser());
      })
      .catch(() => {
        /* keep cached values */
      });
    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  const copyUsername = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      const text = profileUser.username;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          const textarea = document.createElement("textarea");
          textarea.value = text;
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
        }
        setCopied(true);
        showToast(m.usernameCopiedToast);
        window.setTimeout(() => setCopied(false), 2000);
      } catch {
        showToast(m.copyUsername);
      }
    },
    [profileUser.username, showToast, m.usernameCopiedToast, m.copyUsername],
  );

  return (
    <div className={MEMBER_PAGE_BG}>
      <MemberPageHeader
        title={m.pageTitle}
        backHref={`/${locale}`}
        backLabel={profileNav.navLabel}
        width="profile"
      />

      <div className={`${memberContainerProfile} ${memberPagePadding}`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-5">
          <nav
            className={`shrink-0 overflow-hidden ${memberPanelBorder} lg:w-[220px] xl:w-[240px]`}
            aria-label={m.pageTitle}
          >
            <ul className="flex overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-col lg:overflow-visible">
              {PROFILE_TABS.map((tabId) => {
                const isActive = tabId === activeTab;
                return (
                  <li key={tabId} className="min-w-0 shrink-0 flex-1 lg:flex-none">
                    <Link
                      href={memberSectionHref(locale, tabId)}
                      className={`focus-ring relative block whitespace-nowrap px-4 py-3.5 text-center text-[12px] transition-colors sm:text-[13px] lg:px-4 lg:text-left lg:text-[14px] ${
                        isActive
                          ? "bg-[#2a2a2a] font-medium text-white"
                          : "text-[#d4d4d4] hover:bg-[#1a1a1a] hover:text-white"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {m.tabs[tabId]}
                      {isActive ? (
                        <span
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#178358] lg:hidden"
                          aria-hidden
                        />
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <section className={`min-w-0 flex-1 overflow-hidden ${memberPanelBorder}`}>
            {activeTab === "personal-info" ? (
              <>
                <h2 className="border-b border-[#2a2a2a] px-4 py-4 text-[15px] font-bold text-white sm:px-5 sm:text-[16px]">
                  {m.tabs["personal-info"]}
                </h2>
                <div>
                  <InfoRow label={m.personalInfo.username}>
                    <span className="font-medium">{profileUser.username}</span>
                    <button
                      type="button"
                      onClick={copyUsername}
                      aria-label={copied ? m.copied : m.copyUsername}
                      className="focus-ring touch-target rounded-md p-1 text-[#d4d4d4] transition-colors hover:bg-white/10 hover:text-white"
                    >
                      <CopyIcon />
                    </button>
                  </InfoRow>
                  <InfoRow
                    label={m.personalInfo.fullLegalName}
                    onClick={() => router.push(fullLegalNameHref(locale))}
                  >
                    {profileUser.legalName ? (
                      <span className="font-medium">{profileUser.legalName}</span>
                    ) : (
                      <ManageAction label={m.manage} />
                    )}
                    <ChevronRight />
                  </InfoRow>
                  <InfoRow
                    label={m.personalInfo.dateOfBirth}
                    onClick={() => router.push(dateOfBirthHref(locale))}
                  >
                    {profileUser.dateOfBirth ? (
                      <span className="font-medium">{profileUser.dateOfBirth}</span>
                    ) : (
                      <ManageAction label={m.manage} />
                    )}
                    <ChevronRight />
                  </InfoRow>
                  <InfoRow
                    label={m.personalInfo.phone}
                    onClick={() => router.push(phoneHref(locale))}
                  >
                    <span>{profileUser.phone}</span>
                    {profileUser.phoneNeedsAttention ? <WarningIcon /> : null}
                    <ChevronRight />
                  </InfoRow>
                  <InfoRow
                    label={m.personalInfo.email}
                    onClick={() => router.push(emailHref(locale))}
                  >
                    {profileUser.email ? (
                      <span className="max-w-[200px] truncate font-medium sm:max-w-none">
                        {profileUser.email}
                      </span>
                    ) : (
                      <ManageAction label={m.manage} />
                    )}
                    <ChevronRight />
                  </InfoRow>
                </div>
              </>
            ) : null}

            {activeTab === "login-security" ? (
              <>
                <h2 className="border-b border-[#2a2a2a] px-4 py-4 text-[15px] font-bold text-white sm:px-5 sm:text-[16px]">
                  {m.tabs["login-security"]}
                </h2>
                <div>
                  <InfoRow
                    label={m.loginSecurity.password}
                    onClick={() => router.push(changePasswordHref(locale))}
                  >
                    <ManageAction label={m.manage} />
                  </InfoRow>
                </div>
              </>
            ) : null}

            {activeTab === "verification" ? (
              <>
                <h2 className="border-b border-[#2a2a2a] px-4 py-4 text-[15px] font-bold text-white sm:px-5 sm:text-[16px]">
                  {m.tabs.verification}
                </h2>
                <div className="border-b border-[#2a2a2a] px-4 py-4 sm:px-5">
                  <div className="flex gap-3 rounded-lg bg-[#0d2818]/90 px-3 py-3 sm:gap-4 sm:px-4 sm:py-3.5">
                    <ShieldIcon />
                    <p className="text-[12px] leading-relaxed text-[#d4d4d4] sm:text-[13px]">
                      {m.verification.banner}
                    </p>
                  </div>
                </div>
                <div>
                  <InfoRow
                    label={m.verification.documents}
                    onClick={() => router.push(documentsHref(locale))}
                  >
                    <ManageAction label={m.manage} />
                  </InfoRow>
                </div>
              </>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}
