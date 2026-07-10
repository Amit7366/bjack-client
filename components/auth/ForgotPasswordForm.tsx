"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/components/LocaleProvider";
import { useToast } from "@/components/ToastProvider";
import { submitPasswordResetRequest } from "@/lib/auth/api";
import {
  allPasswordRulesMet,
  checkPasswordRules,
  PASSWORD_RULE_IDS,
} from "@/lib/change-password-validation";
import { getAuthMessages } from "@/lib/i18n/auth-messages";
import { getChangePasswordMessages } from "@/lib/i18n/change-password-messages";
import { AuthField, authInputClass } from "./AuthField";
import AuthSubmitLoader from "./AuthSubmitLoader";
import PasswordInput from "./PasswordInput";

function authErrorMessage(err: unknown, fallback: string, networkFallback: string): string {
  if (err instanceof TypeError) return networkFallback;
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

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

export default function ForgotPasswordForm() {
  const router = useRouter();
  const { preferences } = useLocale();
  const { showToast } = useToast();
  const a = getAuthMessages(preferences.locale);
  const c = getChangePasswordMessages(preferences.locale);
  const base = `/${preferences.locale}`;

  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const rules = useMemo(() => checkPasswordRules(newPassword), [newPassword]);
  const rulesMet = allPasswordRulesMet(rules);
  const canSubmit =
    username.trim().length > 0 && phone.trim().length > 0 && rulesMet && !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError(a.usernameRequired);
      return;
    }
    if (!phone.trim()) {
      setError(a.phoneRequired);
      return;
    }
    if (!rulesMet) {
      setError(a.passwordStrengthInvalid);
      return;
    }

    setLoading(true);
    try {
      const { message } = await submitPasswordResetRequest({
        userName: username.trim(),
        contactNo: phone.trim(),
        newPassword,
      });
      showToast(message || a.forgotPasswordSuccess);
      router.replace(`${base}/login`);
      router.refresh();
    } catch (err) {
      setError(authErrorMessage(err, a.forgotPasswordError, a.networkError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex min-h-[420px] flex-1 flex-col">
      <div className="mb-6 flex items-center gap-2">
        <Link
          href={`${base}/login`}
          className="focus-ring flex h-9 w-9 items-center justify-center rounded-md text-[#e5e5e5] hover:bg-[#1f1f1f]"
          aria-label={a.backToLogin}
        >
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none" aria-hidden>
            <path
              d="M8.5 1.5L2 8l6.5 6.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
        <h1 className="text-[17px] font-semibold text-white">{a.forgotPasswordTitle}</h1>
      </div>

      <div className="space-y-5">
        {error ? (
          <p
            className="rounded-md border border-[#7f1d1d] bg-[#2a1212] px-3 py-2 text-[13px] text-[#fca5a5]"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <AuthField label={a.username}>
          <input
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={a.enterUsername}
            className={authInputClass()}
            disabled={loading}
          />
        </AuthField>

        <AuthField label={a.phoneNumber}>
          <input
            type="tel"
            autoComplete="tel"
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={a.enterPhone}
            className={authInputClass()}
            disabled={loading}
          />
        </AuthField>

        <div>
          <AuthField label={a.newPassword}>
            <PasswordInput
              value={newPassword}
              onChange={setNewPassword}
              placeholder={a.enterNewPassword}
              autoComplete="new-password"
            />
          </AuthField>

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
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        aria-busy={loading}
        className="focus-ring mt-8 flex w-full min-h-12 items-center justify-center rounded-md bg-[#0d4a2e] py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-[#178358] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <AuthSubmitLoader />
            <span className="sr-only">{a.next}</span>
          </>
        ) : (
          a.next
        )}
      </button>
    </form>
  );
}
