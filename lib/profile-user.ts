import { readAuthSession } from "@/lib/auth/session";

/** Demo logged-in user when no session exists. */
export const MOCK_PROFILE_USER = {
  username: "mukles12345",
  signUpDate: "2026-05-19",
  phone: "+880 1896453033",
  phoneNeedsAttention: true,
} as const;

export type ProfileUser = {
  username: string;
  signUpDate: string;
  phone: string;
  phoneNeedsAttention: boolean;
};

/** Prefer stored auth session; fall back to demo user on server or when logged out. */
export function getProfileUser(): ProfileUser {
  const session = readAuthSession();
  if (!session?.userName) {
    return { ...MOCK_PROFILE_USER };
  }
  return {
    username: session.userName,
    signUpDate: MOCK_PROFILE_USER.signUpDate,
    phone: session.contactNo ?? MOCK_PROFILE_USER.phone,
    phoneNeedsAttention: !session.contactNo,
  };
}
