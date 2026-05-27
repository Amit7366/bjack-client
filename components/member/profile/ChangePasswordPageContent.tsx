"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import PasswordInput from "@/components/auth/PasswordInput";
import { useAuth } from "@/components/AuthProvider";
import {
  memberBtnPrimary,
  memberContainerNarrow,
  MEMBER_PAGE_BG,
  memberPagePaddingNarrow,
  MemberFieldLabel,
  MemberPageHeader,
} from "@/components/member/shared/member-ui";
import {
  allPasswordRulesMet,
  checkPasswordRules,
  PASSWORD_RULE_IDS,
} from "@/lib/change-password-validation";
import { getChangePasswordMessages } from "@/lib/i18n/change-password-messages";
import { memberSectionHref } from "@/lib/member-routes";
import { useLocale } from "@/components/LocaleProvider";
import { changePasswordUser } from "@/lib/auth/api";
import { useToast } from "@/components/ToastProvider";
import AuthSubmitLoader from "@/components/auth/AuthSubmitLoader";

function RuleIcon({ met }: { met: boolean }) {
  if (met) {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0">
        <circle cx="8" cy="8" r="7" fill="#178358" />
        <path
          d="M5 8l2 2 4-4"
          stroke="white"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0">
      <circle cx="8" cy="8" r="7" stroke="#6b7280" strokeWidth="1.2" />
      <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export default function ChangePasswordPageContent() {
  const { preferences } = useLocale();
  const locale = preferences.locale;
  const c = getChangePasswordMessages(locale);
  const router = useRouter();
  const { logout } = useAuth();
  const { showToast } = useToast();

  const [current, setCurrent] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rules = useMemo(() => checkPasswordRules(newPassword), [newPassword]);
  const rulesMet = allPasswordRulesMet(rules);
  const confirmMismatch = confirm.length > 0 && newPassword !== confirm;
  const canSubmit =
    current.trim().length > 0 &&
    rulesMet &&
    newPassword === confirm &&
    confirm.length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setLoading(true);
    try {
      await changePasswordUser(current.trim(), newPassword);
      await logout();
      showToast(c.success);
      // Use replace to clear any `next=...` query so the user won't bounce back.
      router.replace(`/${locale}/login`);
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : c.success;
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={MEMBER_PAGE_BG}>
      <MemberPageHeader
        title={c.pageTitle}
        backHref={memberSectionHref(locale, "login-security")}
        backLabel={c.back}
      />

      <form onSubmit={handleSubmit} className={`${memberContainerNarrow} ${memberPagePaddingNarrow}`}>
        {error ? (
          <p className="mb-4 text-[12px] text-[#e85d4a] sm:text-[13px]" role="alert">
            {error}
          </p>
        ) : null}
        <div className="space-y-5">
          <label className="block">
            <MemberFieldLabel>{c.currentPassword}</MemberFieldLabel>
            <PasswordInput
              value={current}
              onChange={setCurrent}
              placeholder={c.placeholder}
              autoComplete="current-password"
            />
          </label>

          <div>
            <label className="block">
              <MemberFieldLabel>{c.newPassword}</MemberFieldLabel>
              <PasswordInput
                value={newPassword}
                onChange={setNewPassword}
                placeholder={c.placeholder}
                autoComplete="new-password"
              />
            </label>

            <ul className="mt-3 space-y-2" aria-live="polite">
              {PASSWORD_RULE_IDS.map((id) => (
                <li key={id} className="flex items-start gap-2">
                  <RuleIcon met={rules[id]} />
                  <span
                    className={`text-[12px] leading-snug sm:text-[13px] ${
                      rules[id] ? "text-[#9ca3af]" : "text-[#d4d4d4]"
                    }`}
                  >
                    {c.rules[id]}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <label className="block">
            <MemberFieldLabel>{c.confirmPassword}</MemberFieldLabel>
            <PasswordInput
              value={confirm}
              onChange={setConfirm}
              placeholder={c.placeholder}
              autoComplete="new-password"
            />
            {confirmMismatch ? (
              <p className="mt-2 text-[12px] text-[#e85d4a] sm:text-[13px]" role="alert">
                {c.mismatch}
              </p>
            ) : null}
          </label>
        </div>

        <button
          type="submit"
          disabled={!canSubmit || loading}
          className={`${memberBtnPrimary} mt-8 disabled:cursor-not-allowed disabled:opacity-60`}
        >
          {loading ? (
            <>
              <AuthSubmitLoader />
              <span className="sr-only">{c.submit}</span>
            </>
          ) : (
            c.submit
          )}
        </button>
      </form>
    </div>
  );
}
