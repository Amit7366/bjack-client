"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authInputClass } from "@/components/auth/AuthField";
import { getPersonalInfoMessages } from "@/lib/i18n/personal-info-messages";
import {
  PENDING_PHONE_KEY,
  phoneVerifyHref,
} from "@/lib/member-personal-routes";
import { memberSectionHref } from "@/lib/member-routes";
import { getProfileUser } from "@/lib/profile-user";
import { useLocale } from "@/components/LocaleProvider";
import {
  memberBtnPrimary,
  memberContainerNarrow,
  MEMBER_PAGE_BG,
  memberPagePaddingNarrow,
} from "@/components/member/shared/member-ui";
import MemberPersonalHeader from "./MemberPersonalHeader";
import PhoneHeroIcon from "./PhoneHeroIcon";

function BangladeshFlag() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className="shrink-0">
      <circle cx="10" cy="10" r="10" fill="#006a4e" />
      <circle cx="11.2" cy="10" r="6" fill="#f42a41" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden className="text-[#9ca3af]">
      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export default function PhonePageContent() {
  const { preferences } = useLocale();
  const locale = preferences.locale;
  const p = getPersonalInfoMessages(locale);
  const router = useRouter();
  const defaultDigits = getProfileUser().phone.replace(/\D/g, "").slice(-10);
  const [phone, setPhone] = useState(defaultDigits || "1896453033");
  const [error, setError] = useState<string | null>(null);

  const backHref = memberSectionHref(locale, "personal-info");

  return (
    <div className={MEMBER_PAGE_BG}>
      <MemberPersonalHeader title={p.phone.pageTitle} backHref={backHref} backLabel={p.back} />

      <div className={`${memberContainerNarrow} ${memberPagePaddingNarrow}`}>
        <PhoneHeroIcon />

        <h2 className="mt-6 text-center text-[20px] font-bold text-white sm:text-[22px]">
          {p.phone.heading}
        </h2>
        <p className="mt-2 text-center text-[13px] leading-relaxed text-[#9ca3af] sm:text-[14px]">
          {p.phone.subtitle}
        </p>

        <form
          className="mt-8"
          onSubmit={(e) => {
            e.preventDefault();
            const digits = phone.replace(/\D/g, "");
            if (digits.length < 10) {
              setError(p.phone.invalidPhone);
              return;
            }
            setError(null);
            sessionStorage.setItem(PENDING_PHONE_KEY, `+880 ${digits}`);
            router.push(phoneVerifyHref(locale));
          }}
        >
          <span className="mb-2 block text-[13px] text-[#9ca3af]">{p.phone.fieldLabel}</span>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div
              className={`${authInputClass()} flex w-full shrink-0 items-center justify-center gap-2 px-3 sm:w-[120px]`}
              aria-hidden
            >
              <BangladeshFlag />
              <span className="text-[14px] text-white">+880</span>
              <ChevronDown />
            </div>
            <input
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 11));
                setError(null);
              }}
              placeholder="1896453033"
              className={`${authInputClass()} min-w-0 flex-1`}
            />
          </div>
          {error ? (
            <p className="mt-2 text-[12px] text-[#e85d4a]" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className={`${memberBtnPrimary} mt-8`}
          >
            {p.phone.continue}
          </button>
        </form>
      </div>
    </div>
  );
}
