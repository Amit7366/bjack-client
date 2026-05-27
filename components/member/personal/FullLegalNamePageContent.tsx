"use client";

import { useCallback, useEffect, useState } from "react";
import { authInputClass } from "@/components/auth/AuthField";
import { useToast } from "@/components/ToastProvider";
import { getPersonalInfoMessages } from "@/lib/i18n/personal-info-messages";
import { memberSectionHref } from "@/lib/member-routes";
import {
  fetchMyNormalUserProfile,
  updateMyLegalName,
} from "@/lib/member/profile-api";
import { readMemberProfileCache } from "@/lib/member/profile-cache";
import { useLocale } from "@/components/LocaleProvider";
import {
  memberBtnPrimary,
  memberContainerNarrow,
  MEMBER_PAGE_BG,
  memberPagePaddingNarrow,
} from "@/components/member/shared/member-ui";
import MemberPersonalHeader from "./MemberPersonalHeader";
import PrivacyNotice from "./PrivacyNotice";

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="text-[#9ca3af]">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 7v4M8 5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export default function FullLegalNamePageContent() {
  const { preferences } = useLocale();
  const locale = preferences.locale;
  const p = getPersonalInfoMessages(locale);
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const backHref = memberSectionHref(locale, "personal-info");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const cached = readMemberProfileCache().legalName;
      if (cached) {
        setName(cached);
      }

      try {
        const profile = await fetchMyNormalUserProfile();
        if (!cancelled && profile.name) {
          setName(profile.name);
        }
      } catch {
        if (!cancelled && !cached) {
          setError(p.fullLegalName.loadError);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [p.fullLegalName.loadError]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      const trimmed = name.trim();
      if (!trimmed) return;
      if (trimmed.length < 3) {
        setError(p.fullLegalName.nameTooShort);
        return;
      }

      setSaving(true);
      setSaved(false);
      try {
        const updated = await updateMyLegalName(trimmed);
        const savedName = updated.name ?? trimmed;
        setName(savedName);
        setSaved(true);
        showToast(p.fullLegalName.submitted);
      } catch (err) {
        const message = err instanceof Error ? err.message : p.fullLegalName.saveError;
        setError(message);
        showToast(p.fullLegalName.saveError);
      } finally {
        setSaving(false);
      }
    },
    [name, p.fullLegalName, showToast],
  );

  return (
    <div className={MEMBER_PAGE_BG}>
      <MemberPersonalHeader title={p.fullLegalName.pageTitle} backHref={backHref} backLabel={p.back} />

      <form onSubmit={handleSubmit} className={`${memberContainerNarrow} ${memberPagePaddingNarrow}`}>
        <label className="block">
          <span className="mb-2 flex items-center gap-1.5 text-[13px] text-[#9ca3af] sm:text-[14px]">
            {p.fullLegalName.fieldLabel}
            <span title={p.fullLegalName.fieldHint}>
              <InfoIcon />
            </span>
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setSaved(false);
              setError(null);
            }}
            placeholder={p.fullLegalName.placeholder}
            className={authInputClass()}
            disabled={loading || saving}
            maxLength={40}
            autoComplete="name"
          />
        </label>

        {error ? (
          <p className="mt-3 text-[13px] text-[#fca5a5]" role="alert">
            {error}
          </p>
        ) : null}

        {saved && !error ? (
          <p className="mt-3 text-[13px] text-[#86efac]" role="status">
            {p.fullLegalName.submitted}
          </p>
        ) : null}

        <div className="mt-4">
          <PrivacyNotice locale={locale} />
        </div>

        <button
          type="submit"
          disabled={loading || saving || !name.trim() || name.trim().length < 3}
          className={`${memberBtnPrimary} mt-8`}
        >
          {saving ? p.fullLegalName.saving : saved ? p.fullLegalName.submitted : p.fullLegalName.submit}
        </button>
      </form>
    </div>
  );
}
