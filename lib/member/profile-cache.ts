const PROFILE_CACHE_KEY = "bkbaji.memberProfile";
export const PROFILE_CACHE_CHANGE_EVENT = "bkbaji-profile-change";

export type MemberProfileCache = {
  legalName?: string;
  dateOfBirth?: string;
  email?: string;
};

export function readMemberProfileCache(): MemberProfileCache {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PROFILE_CACHE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as MemberProfileCache;
  } catch {
    return {};
  }
}

export function writeMemberProfileCache(patch: MemberProfileCache) {
  const next = { ...readMemberProfileCache(), ...patch };
  localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(PROFILE_CACHE_CHANGE_EVENT));
}

export function clearMemberProfileCache() {
  localStorage.removeItem(PROFILE_CACHE_KEY);
  window.dispatchEvent(new Event(PROFILE_CACHE_CHANGE_EVENT));
}
