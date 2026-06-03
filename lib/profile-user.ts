import { readAuthSession } from "@/lib/auth/session";
import { readMemberProfileCache } from "@/lib/member/profile-cache";

/** Demo logged-in user when no session exists. */
export const MOCK_PROFILE_USER = {
  username: "mukles12345",
  memberId: "sbm00000",
  signUpDate: "2026-05-19",
  phone: "+880 1896453033",
  phoneNeedsAttention: true,
} as const;

export type ProfileUser = {
  username: string;
  memberId: string;
  legalName?: string;
  dateOfBirth?: string;
  email?: string;
  signUpDate: string;
  phone: string;
  phoneNeedsAttention: boolean;
};

/** Prefer stored auth session; fall back to demo user on server or when logged out. */
export function getProfileUser(): ProfileUser {
  const session = readAuthSession();
  const cache = readMemberProfileCache();
  if (!session?.userName) {
    return {
      ...MOCK_PROFILE_USER,
      memberId: session?.memberId ?? MOCK_PROFILE_USER.memberId,
      legalName: cache.legalName,
      dateOfBirth: cache.dateOfBirth,
      email: cache.email,
    };
  }
  return {
    username: session.userName,
    memberId: session.memberId ?? "",
    legalName: cache.legalName,
    dateOfBirth: cache.dateOfBirth,
    email: cache.email,
    signUpDate: MOCK_PROFILE_USER.signUpDate,
    phone: session.contactNo ?? MOCK_PROFILE_USER.phone,
    phoneNeedsAttention: !session.contactNo,
  };
}
