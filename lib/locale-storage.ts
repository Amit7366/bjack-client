import {
  LOCALE_COOKIE,
  type LocalePreferences,
  currencyForCountry,
  isValidLocale,
  type Country,
} from "./locale";

function isValidCountry(value: unknown): value is Country {
  return value === "bd" || value === "in";
}

export function parsePreferences(raw: string | null | undefined): LocalePreferences | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<LocalePreferences>;
    if (!isValidCountry(parsed.country) || !parsed.locale || !isValidLocale(parsed.locale)) {
      return null;
    }

    return {
      country: parsed.country,
      locale: parsed.locale,
      currency: currencyForCountry(parsed.country),
    };
  } catch {
    return null;
  }
}

export function readPreferencesFromCookie(cookieHeader: string | null): LocalePreferences | null {
  if (!cookieHeader) return null;

  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${LOCALE_COOKIE}=`));

  if (!match) return null;

  const value = decodeURIComponent(match.slice(LOCALE_COOKIE.length + 1));
  return parsePreferences(value);
}
