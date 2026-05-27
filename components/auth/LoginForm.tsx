"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "@/components/LocaleProvider";
import { loginWithUsername } from "@/lib/auth/api";
import { getAuthMessages } from "@/lib/i18n/auth-messages";
import { AuthField, authInputClass } from "./AuthField";
import AuthSubmitLoader from "./AuthSubmitLoader";
import PasswordInput from "./PasswordInput";
import { changePasswordHref } from "@/lib/member-profile-tabs";

function authErrorMessage(err: unknown, fallback: string, networkFallback: string): string {
  if (err instanceof TypeError) return networkFallback;
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { preferences } = useLocale();
  const a = getAuthMessages(preferences.locale);
  const base = `/${preferences.locale}`;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError(a.usernameRequired);
      return;
    }
    if (!password) {
      setError(a.passwordRequired);
      return;
    }

    setLoading(true);
    try {
      const { session } = await loginWithUsername(username, password);
      const next = searchParams.get("next");
      const isChangePasswordNext = !!next && next.startsWith(changePasswordHref(preferences.locale));

      // If password is already updated (`needsPasswordChange === false`),
      // don't redirect back to the change-password page again.
      const shouldGoHome =
        isChangePasswordNext && session?.needsPasswordChange === false;

      const target =
        shouldGoHome
          ? base
          : next && next.startsWith(`/${preferences.locale}/`) && !next.includes("//")
            ? next
            : base;
      router.push(target);
      router.refresh();
    } catch (err) {
      setError(authErrorMessage(err, a.loginError, a.networkError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex min-h-[420px] flex-1 flex-col">
      <div className="space-y-5">
        {error ? (
          <p className="rounded-md border border-[#7f1d1d] bg-[#2a1212] px-3 py-2 text-[13px] text-[#fca5a5]" role="alert">
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

        <AuthField label={a.password}>
          <PasswordInput
            value={password}
            onChange={setPassword}
            placeholder={a.enterPassword}
            autoComplete="current-password"
          />
        </AuthField>

        <div className="flex justify-end">
          <button type="button" className="text-[13px] font-medium text-[#178358] hover:text-[#1a9664]">
            {a.forgotPassword}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        className="focus-ring mt-auto flex w-full min-h-12 items-center justify-center rounded-md bg-[#0d4a2e] py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-[#178358] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <AuthSubmitLoader />
            <span className="sr-only">{a.logInButton}</span>
          </>
        ) : (
          a.logInButton
        )}
      </button>
    </form>
  );
}
