import { clearMemberProfileCache } from "@/lib/member/profile-cache";
import { DEFAULT_PREFERENCES, isValidLocale, type Locale } from "@/lib/locale";
import { clearLocalWallet } from "@/lib/wallet-local-state";
import { isJwtExpired } from "./jwt";
import { AUTH_STORAGE_KEY, clearAuthSession, enrichSession, type AuthSession } from "./session";

const AUTH_ROUTE = /^\/(bn|en|hi)\/(login|register)(\/|$)/;

let handlingExpiry = false;

export function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTE.test(pathname);
}

export function buildLoginRedirectUrl(nextPath?: string): string {
  if (typeof window === "undefined") return `/${DEFAULT_PREFERENCES.locale}/login`;

  const pathname = nextPath ?? window.location.pathname;
  const localeSegment = pathname.split("/")[1];
  const locale: Locale = isValidLocale(localeSegment) ? localeSegment : DEFAULT_PREFERENCES.locale;
  const next = nextPath ?? pathname;

  const params = new URLSearchParams();
  if (next && !isAuthRoute(next)) {
    params.set("next", next);
  }

  const query = params.toString();
  return `/${locale}/login${query ? `?${query}` : ""}`;
}

/** Clear client session and redirect to login (unless already on auth pages). */
export function handleSessionExpired(options?: { redirect?: boolean }): void {
  if (typeof window === "undefined" || handlingExpiry) return;

  handlingExpiry = true;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return;

    let memberId: string | undefined;
    try {
      const parsed = JSON.parse(raw) as AuthSession;
      if (!parsed?.accessToken) return;
      memberId = enrichSession(parsed).memberId;
    } catch {
      return;
    }

    if (memberId) clearLocalWallet(memberId);
    clearMemberProfileCache();
    clearAuthSession();

    const redirect = options?.redirect !== false;
    if (redirect && !isAuthRoute(window.location.pathname)) {
      window.location.replace(buildLoginRedirectUrl());
    }
  } finally {
    handlingExpiry = false;
  }
}

/** Returns true when an expired session was cleared and redirect was triggered. */
export function expireSessionIfNeeded(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return false;

    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed?.accessToken || !isJwtExpired(parsed.accessToken)) return false;

    handleSessionExpired();
    return true;
  } catch {
    return false;
  }
}

export function handleUnauthorizedResponse(res: Response, hadAuthToken = true): boolean {
  if (res.status === 401 && hadAuthToken) {
    handleSessionExpired();
    return true;
  }
  return false;
}
