export const MEMBER_SECTIONS = [
  "notification",
  "personal-info",
  "login-security",
  "verification",
  "transaction-records",
  "betting-records",
  "turnover",
  "my-vip",
  "my-referral",
  "add-wallet",
] as const;

export type MemberSection = (typeof MEMBER_SECTIONS)[number];

export function memberSectionHref(locale: string, section: MemberSection): string {
  return `/${locale}/member/${section}`;
}

export function memberDepositHref(locale: string): string {
  return `/${locale}/member/deposit`;
}

export function memberWithdrawHref(locale: string): string {
  return `/${locale}/member/withdraw`;
}

export function memberRewardCenterHref(locale: string): string {
  return `/${locale}/member/reward-center`;
}

export function memberSignInRewardHref(locale: string): string {
  return `/${locale}/member/reward-center/sign-in`;
}

export function memberBonusRewardHref(locale: string): string {
  return `/${locale}/member/reward-center/bonus`;
}

export function isMemberSection(value: string): value is MemberSection {
  return (MEMBER_SECTIONS as readonly string[]).includes(value);
}
