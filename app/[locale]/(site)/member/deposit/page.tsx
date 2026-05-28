"use client";

import { MemberSectionPlaceholder } from "@/components/member/shared/member-ui";
import { useLocale } from "@/components/LocaleProvider";
import { getProfileMessages } from "@/lib/i18n/profile-messages";

export default function MemberDepositPage() {
  const { preferences, t } = useLocale();
  const p = getProfileMessages(preferences.locale);

  return (
    <MemberSectionPlaceholder
      title={t.navbar.deposit}
      message={p.sectionPlaceholder}
      backHref={`/${preferences.locale}`}
      backLabel={p.navLabel}
    />
  );
}
