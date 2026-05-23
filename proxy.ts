import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_ROLE_COOKIE, AUTH_TOKEN_COOKIE, USER_ROLE } from "@/lib/auth/constants";
import { DEFAULT_PREFERENCES, isValidLocale, type Locale } from "@/lib/locale";
import { readPreferencesFromCookie } from "@/lib/locale-storage";

function localeFromPath(pathname: string, cookieHeader: string | null): Locale {
  const segment = pathname.split("/")[1];
  if (segment && isValidLocale(segment)) return segment;
  const saved = readPreferencesFromCookie(cookieHeader);
  return saved?.locale ?? DEFAULT_PREFERENCES.locale;
}

function isMemberPath(pathname: string): boolean {
  return /\/member(\/|$)/.test(pathname);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    const saved = readPreferencesFromCookie(request.headers.get("cookie"));
    const locale = saved?.locale ?? DEFAULT_PREFERENCES.locale;
    const response = NextResponse.redirect(new URL(`/${locale}`, request.url));
    response.headers.set("x-locale", locale);
    return response;
  }

  if (pathname === "/login" || pathname === "/register") {
    const saved = readPreferencesFromCookie(request.headers.get("cookie"));
    const locale = saved?.locale ?? DEFAULT_PREFERENCES.locale;
    const response = NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
    response.headers.set("x-locale", locale);
    return response;
  }

  const localeSegment = pathname.split("/")[1];
  if (localeSegment && !isValidLocale(localeSegment)) {
    const response = NextResponse.redirect(new URL(`/${DEFAULT_PREFERENCES.locale}`, request.url));
    response.headers.set("x-locale", DEFAULT_PREFERENCES.locale);
    return response;
  }

  if (isMemberPath(pathname)) {
    const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;
    const role = request.cookies.get(AUTH_ROLE_COOKIE)?.value;
    if (!token || role !== USER_ROLE) {
      const locale = localeFromPath(pathname, request.headers.get("cookie"));
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next();
  if (localeSegment && isValidLocale(localeSegment)) {
    response.headers.set("x-locale", localeSegment);
  }
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
