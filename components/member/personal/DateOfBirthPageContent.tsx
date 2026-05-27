"use client";

import { useCallback, useEffect, useState } from "react";
import { authInputClass } from "@/components/auth/AuthField";
import { useToast } from "@/components/ToastProvider";
import { getPersonalInfoMessages } from "@/lib/i18n/personal-info-messages";
import { memberSectionHref } from "@/lib/member-routes";
import {
  fetchMyNormalUserProfile,
  formatDateOfBirthForInput,
  updateMyDateOfBirth,
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

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden className="text-[#9ca3af]">
      <rect x="2.5" y="4" width="13" height="11.5" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2.5 7h13M6 2.5v3M12 2.5v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export default function DateOfBirthPageContent() {
  const { preferences } = useLocale();
  const locale = preferences.locale;
  const p = getPersonalInfoMessages(locale);
  const { showToast } = useToast();

  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const backHref = memberSectionHref(locale, "personal-info");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const cached = readMemberProfileCache().dateOfBirth;
      if (cached) {
        setDob(cached);
      }

      try {
        const profile = await fetchMyNormalUserProfile();
        if (!cancelled && profile.dateOfBirth) {
          setDob(profile.dateOfBirth);
        }
      } catch {
        if (!cancelled && !cached) {
          setError(p.dateOfBirth.loadError);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [p.dateOfBirth.loadError]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      const trimmed = dob.trim();
      if (!DATE_PATTERN.test(trimmed)) {
        setError(p.dateOfBirth.invalidDate);
        return;
      }

      setSaving(true);
      setSaved(false);
      try {
        const updated = await updateMyDateOfBirth(trimmed);
        const savedDob = formatDateOfBirthForInput(updated.dateOfBirth ?? trimmed);
        setDob(savedDob);
        setSaved(true);
        showToast(p.dateOfBirth.submitted);
      } catch (err) {
        const message = err instanceof Error ? err.message : p.dateOfBirth.saveError;
        setError(message);
        showToast(p.dateOfBirth.saveError);
      } finally {
        setSaving(false);
      }
    },
    [dob, p.dateOfBirth, showToast],
  );

  return (
    <div className={MEMBER_PAGE_BG}>
      <MemberPersonalHeader title={p.dateOfBirth.pageTitle} backHref={backHref} backLabel={p.back} />

      <form onSubmit={handleSubmit} className={`${memberContainerNarrow} ${memberPagePaddingNarrow}`}>
        <label className="block">
          <span className="mb-2 block text-[13px] text-[#9ca3af] sm:text-[14px]">
            {p.dateOfBirth.fieldLabel}
          </span>
          <div className="relative">
            <input
              type="text"
              value={dob}
              onChange={(e) => {
                setDob(e.target.value);
                setSaved(false);
                setError(null);
              }}
              placeholder={p.dateOfBirth.placeholder}
              className={`${authInputClass()} pr-11`}
              disabled={loading || saving}
              inputMode="numeric"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center"
              disabled={loading || saving}
              onClick={() => {
                const el = document.getElementById("dob-picker") as HTMLInputElement | null;
                el?.showPicker?.();
                el?.click();
              }}
              aria-label={p.dateOfBirth.fieldLabel}
            >
              <CalendarIcon />
            </button>
            <input
              id="dob-picker"
              type="date"
              className="pointer-events-none absolute h-0 w-0 opacity-0"
              tabIndex={-1}
              value={DATE_PATTERN.test(dob) ? dob : ""}
              onChange={(e) => {
                if (e.target.value) {
                  setDob(e.target.value);
                  setSaved(false);
                  setError(null);
                }
              }}
            />
          </div>
          {error ? (
            <p className="mt-2 text-[12px] text-[#e85d4a]" role="alert">
              {error}
            </p>
          ) : null}
          {saved && !error ? (
            <p className="mt-2 text-[12px] text-[#86efac]" role="status">
              {p.dateOfBirth.submitted}
            </p>
          ) : null}
        </label>

        <div className="mt-4">
          <PrivacyNotice locale={locale} />
        </div>

        <button
          type="submit"
          disabled={loading || saving || !dob.trim() || !DATE_PATTERN.test(dob.trim())}
          className={`${memberBtnPrimary} mt-8`}
        >
          {saving ? p.dateOfBirth.saving : saved ? p.dateOfBirth.submitted : p.dateOfBirth.submit}
        </button>
      </form>
    </div>
  );
}
