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

export function memberCenterHref(locale: string): string {
  return `/${locale}/member`;
}

export function memberRebateHref(locale: string): string {
  return `/${locale}/member/rebate`;
}

export function memberProfitLossHref(locale: string): string {
  return `/${locale}/member/profit-and-loss`;
}

export function memberSignInRewardHref(locale: string): string {
  return `/${locale}/member/reward-center/sign-in`;
}

export function memberBonusRewardHref(locale: string): string {
  return `/${locale}/member/reward-center/bonus`;
}

export function memberRescueFundHref(locale: string): string {
  return `/${locale}/member/reward-center/rescue-fund`;
}

export function memberRescueFundSportsHref(locale: string): string {
  return `/${locale}/member/reward-center/rescue-fund/sports`;
}

export function memberRescueFundLossCompensationHref(locale: string): string {
  return `/${locale}/member/reward-center/rescue-fund/loss-compensation`;
}

export function memberTemuTicketHref(locale: string): string {
  return `/${locale}/member/reward-center/temu-ticket`;
}

export function memberTemuTicketHistoryHref(locale: string): string {
  return `/${locale}/member/reward-center/temu-ticket/history`;
}

export function memberMissionHref(locale: string): string {
  return `/${locale}/member/mission`;
}

export function memberSuggestionHref(locale: string): string {
  return `/${locale}/member/suggestion`;
}

export function isMemberSection(value: string): value is MemberSection {
  return (MEMBER_SECTIONS as readonly string[]).includes(value);
}

export function memberLiveChatHref(locale: string): string {
  return `/${locale}/member/live-chat`;
}
