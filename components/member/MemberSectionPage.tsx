"use client";

import NotificationsPageContent from "@/components/member/notifications/NotificationsPageContent";
import BettingRecordsPageContent from "@/components/member/betting/BettingRecordsPageContent";
import TurnoverPageContent from "@/components/member/turnover/TurnoverPageContent";
import TransactionRecordsPageContent from "@/components/member/transactions/TransactionRecordsPageContent";
import MyReferralPageContent from "@/components/member/referral/MyReferralPageContent";
import MemberProfilePage from "@/components/member/profile/MemberProfilePage";
import { MemberSectionPlaceholder } from "@/components/member/shared/member-ui";
import { getProfileMessages } from "@/lib/i18n/profile-messages";
import type { MemberSection } from "@/lib/member-routes";
import { isProfileTab } from "@/lib/member-profile-tabs";
import { useLocale } from "@/components/LocaleProvider";

export default function MemberSectionPage({ section }: { section: MemberSection }) {
  const { preferences } = useLocale();
  const p = getProfileMessages(preferences.locale);
  const base = `/${preferences.locale}`;

  if (section === "notification") {
    return <NotificationsPageContent />;
  }

  if (section === "transaction-records") {
    return <TransactionRecordsPageContent />;
  }

  if (section === "betting-records") {
    return <BettingRecordsPageContent />;
  }

  if (section === "turnover") {
    return <TurnoverPageContent />;
  }

  if (section === "my-referral") {
    return <MyReferralPageContent />;
  }

  if (isProfileTab(section)) {
    return <MemberProfilePage activeTab={section} />;
  }

  return (
    <MemberSectionPlaceholder
      title={p.sectionTitles[section]}
      message={p.sectionPlaceholder}
      backHref={base}
      backLabel={p.navLabel}
    />
  );
}
