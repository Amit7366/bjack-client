"use client";

import { useCallback, useEffect, useState } from "react";
import { authInputClass } from "@/components/auth/AuthField";
import { useToast } from "@/components/ToastProvider";
import { getPersonalInfoMessages } from "@/lib/i18n/personal-info-messages";
import { memberSectionHref } from "@/lib/member-routes";
import { fetchMyNormalUserProfile, updateMyEmail } from "@/lib/member/profile-api";
import { readMemberProfileCache } from "@/lib/member/profile-cache";
import { useLocale } from "@/components/LocaleProvider";
import {
  memberBtnPrimary,
  memberContainerNarrow,
  MEMBER_PAGE_BG,
  memberPagePaddingNarrow,
} from "@/components/member/shared/member-ui";
import EmailHeroIcon from "./EmailHeroIcon";
import MemberPersonalHeader from "./MemberPersonalHeader";
import PrivacyNotice from "./PrivacyNotice";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailPageContent() {
  const { preferences } = useLocale();
  const locale = preferences.locale;
  const p = getPersonalInfoMessages(locale);
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const backHref = memberSectionHref(locale, "personal-info");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const cached = readMemberProfileCache().email;
      if (cached) {
        setEmail(cached);
      }

      try {
        const profile = await fetchMyNormalUserProfile();
        if (!cancelled && profile.email) {
          setEmail(profile.email);
        }
      } catch {
        if (!cancelled && !cached) {
          setError(p.email.loadError);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [p.email.loadError]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      const trimmed = email.trim();
      if (!EMAIL_PATTERN.test(trimmed)) {
        setError(p.email.invalidEmail);
        return;
      }

      setSaving(true);
      setSaved(false);
      try {
        const updated = await updateMyEmail(trimmed);
        const savedEmail = updated.email ?? trimmed;
        setEmail(savedEmail);
        setSaved(true);
        showToast(p.email.submitted);
      } catch (err) {
        const message = err instanceof Error ? err.message : p.email.saveError;
        setError(message);
        showToast(p.email.saveError);
      } finally {
        setSaving(false);
      }
    },
    [email, p.email, showToast],
  );

  return (
    <div className={MEMBER_PAGE_BG}>
      <MemberPersonalHeader title={p.email.pageTitle} backHref={backHref} backLabel={p.back} />

      <div className={`${memberContainerNarrow} ${memberPagePaddingNarrow}`}>
        <EmailHeroIcon />

        <h2 className="mt-6 text-center text-[20px] font-bold text-white sm:text-[22px]">
          {p.email.heading}
        </h2>
        <p className="mt-2 text-center text-[13px] leading-relaxed text-[#9ca3af] sm:text-[14px]">
          {p.email.subtitle}
        </p>

        <form className="mt-8" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-[13px] text-[#9ca3af]">{p.email.fieldLabel}</span>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setSaved(false);
                setError(null);
              }}
              placeholder={p.email.placeholder}
              autoComplete="email"
              className={authInputClass()}
              disabled={loading || saving}
            />
          </label>

          {error ? (
            <p className="mt-2 text-[12px] text-[#e85d4a]" role="alert">
              {error}
            </p>
          ) : null}

          {saved && !error ? (
            <p className="mt-2 text-[12px] text-[#86efac]" role="status">
              {p.email.submitted}
            </p>
          ) : null}

          <div className="mt-4">
            <PrivacyNotice locale={locale} />
          </div>

          <button
            type="submit"
            disabled={loading || saving || !email.trim() || !EMAIL_PATTERN.test(email.trim())}
            className={`${memberBtnPrimary} mt-8`}
          >
            {saving ? p.email.saving : saved ? p.email.submitted : p.email.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
