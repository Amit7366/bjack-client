import {
  AUTH_COOKIE_MAX_AGE_SEC,
  AUTH_ROLE_COOKIE,
  AUTH_TOKEN_COOKIE,
  USER_ROLE,
} from "./constants";
import { isJwtExpired, parseJwtPayload } from "./jwt";
import type { AccountStatus } from "@/lib/account-status";
import { isAccountStatus } from "@/lib/account-status";

export const AUTH_STORAGE_KEY = "rajabaji.auth";
export const AUTH_CHANGE_EVENT = "rajabaji-auth-change";

export type AuthSession = {
  accessToken: string;
  role: string;
  memberId?: string;
  objectId?: string;
  balance?: string;
  vipPoints?: string;
  userName?: string;
  contactNo?: string;
  needsPasswordChange?: boolean;
  accountStatus?: AccountStatus;
};

function syncAuthCookies(session: AuthSession | null) {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  const base = `; path=/; max-age=${AUTH_COOKIE_MAX_AGE_SEC}; SameSite=Lax${secure}`;
  if (!session) {
    document.cookie = `${AUTH_TOKEN_COOKIE}=; max-age=0; path=/`;
    document.cookie = `${AUTH_ROLE_COOKIE}=; max-age=0; path=/`;
    return;
  }
  document.cookie = `${AUTH_TOKEN_COOKIE}=${encodeURIComponent(session.accessToken)}${base}`;
  document.cookie = `${AUTH_ROLE_COOKIE}=${encodeURIComponent(session.role)}${base}`;
}

export function notifyAuthChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function enrichSession(
  partial: Omit<AuthSession, "role"> & { role?: string },
): AuthSession {
  const claims = parseJwtPayload(partial.accessToken);
  return {
    ...partial,
    role: partial.role ?? claims?.role ?? USER_ROLE,
    memberId: partial.memberId ?? claims?.id,
    objectId: partial.objectId ?? claims?.objectId,
    userName: partial.userName ?? claims?.userName,
    contactNo: partial.contactNo ?? claims?.contactNo,
    vipPoints: partial.vipPoints ?? "0",
  };
}

export function readAuthSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed?.accessToken) return null;
    if (isJwtExpired(parsed.accessToken)) {
      clearAuthSession();
      return null;
    }
    return enrichSession(parsed);
  } catch {
    return null;
  }
}

export function saveAuthSession(session: AuthSession) {
  const full = enrichSession(session);
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(full));
  syncAuthCookies(full);
  notifyAuthChange();
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  syncAuthCookies(null);
  notifyAuthChange();
}

export function updateSessionAccountStatus(status?: string | null): void {
  const current = readAuthSession();
  if (!current) return;
  const accountStatus = isAccountStatus(status) ? status : "active";
  saveAuthSession({ ...current, accountStatus });
}

export function isLoggedIn(): boolean {
  return Boolean(readAuthSession()?.accessToken);
}

export function isUserRole(session: AuthSession | null): boolean {
  return session?.role === USER_ROLE;
}
