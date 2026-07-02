"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "@/components/LocaleProvider";
import { registerAndLogin } from "@/lib/auth/api";
import { getAuthMessages } from "@/lib/i18n/auth-messages";
import { AuthField, authInputClass } from "./AuthField";
import AuthSubmitLoader from "./AuthSubmitLoader";
import PasswordInput from "./PasswordInput";

const STEPS = ["contact", "username", "password"] as const;
type RegisterStep = (typeof STEPS)[number];

function BangladeshFlag() {
  return (
    <span
      className="inline-block h-3.5 w-5 shrink-0 rounded-[1px] bg-[#006a4e]"
      style={{
        backgroundImage: "radial-gradient(circle at 35% 50%, #f42a41 42%, transparent 43%)",
      }}
      aria-hidden
    />
  );
}

function StepIndicator({ step, labels }: { step: number; labels: [string, string, string] }) {
  const items = [
    { n: 1, label: labels[0] },
    { n: 2, label: labels[1] },
    { n: 3, label: labels[2] },
  ] as const;

  return (
    <div className="mb-8">
      <div className="relative flex items-center">
        <div className="absolute left-[14px] right-[14px] top-[13px] h-[2px] bg-[#3f3f3f]" />
        <div
          className="absolute left-[14px] top-[13px] h-[2px] bg-[#178358] transition-all duration-300"
          style={{ width: step === 0 ? "0%" : step === 1 ? "calc(50% - 14px)" : "calc(100% - 28px)" }}
        />
        {items.map((item, i) => {
          const active = step === i;
          const done = step > i;
          return (
            <div key={item.n} className="relative z-[1] flex flex-1 flex-col items-center">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-bold ${
                  active || done ? "bg-[#178358] text-white" : "bg-[#2a2a2a] text-[#9ca3af]"
                }`}
              >
                {item.n}
              </span>
              <span
                className={`mt-2 text-center text-[11px] font-medium sm:text-[12px] ${
                  active ? "text-[#178358]" : "text-[#9ca3af]"
                }`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function authErrorMessage(
  err: unknown,
  fallback: string,
  networkFallback: string,
  selfReferralFallback?: string,
): string {
  if (err instanceof TypeError) return networkFallback;
  if (err instanceof Error && err.message) {
    if (
      selfReferralFallback &&
      err.message.toLowerCase().includes("own referral code on this device")
    ) {
      return selfReferralFallback;
    }
    return err.message;
  }
  return fallback;
}

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refIdFromURL =
    searchParams.get("refId") || searchParams.get("ref") || "";
  const { preferences } = useLocale();
  const a = getAuthMessages(preferences.locale);
  const base = `/${preferences.locale}`;

  const [step, setStep] = useState<RegisterStep>("contact");
  const [currency, setCurrency] = useState<"BDT" | "INR">(preferences.currency);
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const stepIndex = STEPS.indexOf(step);
  const stepTitle =
    step === "contact" ? a.stepContact : step === "username" ? a.stepUsername : a.stepPassword;

  const phonePrefix = currency === "INR" ? "+91" : "+880";
  const phoneMaxLen = currency === "INR" ? 10 : 10;

  async function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (step === "contact") {
      if (!phone.trim()) {
        setError(a.phoneRequired);
        return;
      }
      setStep("username");
      return;
    }
    if (step === "username") {
      if (!username.trim()) {
        setError(a.usernameRequired);
        return;
      }
      setStep("password");
      return;
    }

    if (!password.trim()) {
      setError(a.passwordRequired);
      return;
    }
    if (password.length < 6) {
      setError(a.passwordTooShort);
      return;
    }

    setLoading(true);
    try {
      await registerAndLogin({
        userName: username,
        password,
        contactNo: phone,
        currency,
        ...(refIdFromURL ? { referredBy: refIdFromURL } : {}),
      });
      router.push(base);
      router.refresh();
    } catch (err) {
      setError(authErrorMessage(err, a.registerError, a.networkError, a.selfReferralDeviceError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleContinue} className="flex min-h-[420px] flex-1 flex-col">
      <h2 className="mb-4 text-[15px] font-bold text-white">{stepTitle}</h2>

      <StepIndicator step={stepIndex} labels={[a.stepContact, a.stepUsername, a.stepPassword]} />

      {error ? (
        <p
          className="mb-4 rounded-md border border-[#7f1d1d] bg-[#2a1212] px-3 py-2 text-[13px] text-[#fca5a5]"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <div className="flex-1 space-y-5">
        {step === "contact" ? (
          <>
            <AuthField label={a.chooseCurrency}>
              <div className="relative">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as "BDT" | "INR")}
                  className={`${authInputClass()} cursor-pointer appearance-none pl-[4.5rem] pr-10 text-transparent`}
                  disabled={loading}
                >
                  <option value="BDT">BDT</option>
                  <option value="INR">INR</option>
                </select>
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center gap-2">
                  <BangladeshFlag />
                  <span className="text-[14px] text-white">{currency}</span>
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#9ca3af]">
                  ▾
                </span>
              </div>
            </AuthField>

            <AuthField label={a.phoneNumber}>
              <div className="flex gap-2">
                <div className="flex shrink-0 items-center gap-1.5 rounded-md border border-[#178358] bg-[#1f1f1f] px-2.5 py-3">
                  <BangladeshFlag />
                  <span className="text-[14px] text-white">{phonePrefix}</span>
                  <span className="text-[10px] text-[#6b7280]">▾</span>
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, phoneMaxLen))}
                  placeholder="----------"
                  className={`${authInputClass(true)} min-w-0 flex-1 tracking-[0.2em]`}
                  disabled={loading}
                />
              </div>
            </AuthField>
          </>
        ) : null}

        {step === "username" ? (
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
        ) : null}

        {step === "password" ? (
          <AuthField label={a.password}>
            <PasswordInput
              value={password}
              onChange={setPassword}
              placeholder={a.enterPassword}
              autoComplete="new-password"
            />
          </AuthField>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        className="focus-ring mt-8 flex w-full min-h-12 items-center justify-center rounded-md bg-[#0d4a2e] py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-[#178358] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <AuthSubmitLoader />
            <span className="sr-only">{step === "password" ? a.signUpButton : a.continue}</span>
          </>
        ) : step === "password" ? (
          a.signUpButton
        ) : (
          a.continue
        )}
      </button>
    </form>
  );
}
