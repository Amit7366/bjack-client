"use client";

import Image from "next/image";
import Link from "next/link";
import TopNavbar from "@/components/TopNavbar";
import { useLocale } from "@/components/LocaleProvider";
import { AUTH_HERO_ALT, AUTH_HERO_IMAGE } from "@/lib/auth-hero-image";
import { getAuthMessages } from "@/lib/i18n/auth-messages";

function BjFooterMark() {
  return (
    <span className="text-[15px] font-bold tracking-tight">
      <span className="text-white">b</span>
      <span className="text-[#ed1c24]">j</span>
    </span>
  );
}

type AuthShellProps = {
  mode: "login" | "register";
  children: React.ReactNode;
};

export default function AuthShell({ mode, children }: AuthShellProps) {
  const { preferences } = useLocale();
  const a = getAuthMessages(preferences.locale);
  const base = `/${preferences.locale}`;

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-[#0a0a0a]">
      <TopNavbar variant="auth" />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="relative hidden min-h-[220px] flex-1 overflow-hidden bg-[#0a0a0a] lg:block lg:min-h-0">
          <Image
            src={AUTH_HERO_IMAGE}
            alt={AUTH_HERO_ALT}
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 1024px) 0vw, 55vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/25 to-black/85" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(23,131,88,0.15),transparent_55%)]" />
        </div>

        <div className="flex w-full shrink-0 flex-col bg-[#0a0a0a] lg:w-[min(100%,480px)] xl:w-[520px]">
          <div className="flex flex-1 flex-col px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
            <nav className="mb-8 flex border-b border-[#2a2a2a]" aria-label="Authentication">
              <Link
                href={`${base}/login`}
                className={`focus-ring relative flex min-h-11 flex-1 items-center justify-center pb-3 text-center text-[15px] font-semibold transition-colors ${
                  mode === "login" ? "text-white" : "text-[#6b7280] hover:text-[#9ca3af]"
                }`}
              >
                {a.logInTab}
                {mode === "login" ? (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#178358]" />
                ) : null}
              </Link>
              <Link
                href={`${base}/register`}
                className={`focus-ring relative flex min-h-11 flex-1 items-center justify-center pb-3 text-center text-[15px] font-semibold transition-colors ${
                  mode === "register" ? "text-white" : "text-[#6b7280] hover:text-[#9ca3af]"
                }`}
              >
                {a.signUpTab}
                {mode === "register" ? (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#178358]" />
                ) : null}
              </Link>
            </nav>

            {children}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-4 right-4 hidden lg:block">
        <BjFooterMark />
      </div>
    </div>
  );
}
