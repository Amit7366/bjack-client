import {
  DEFAULT_PREFERENCES,
  LOCALE_COOKIE,
  type LocalePreferences,
  currencyForCountry,
  type Country,
  type Locale,
} from "./locale";
import { parsePreferences } from "./locale-storage";

export function readPreferencesFromStorage(): LocalePreferences | null {
  if (typeof window === "undefined") return null;
  return parsePreferences(localStorage.getItem(LOCALE_COOKIE));
}

export function savePreferences(preferences: LocalePreferences) {
  const payload = JSON.stringify(preferences);

  if (typeof window !== "undefined") {
    localStorage.setItem(LOCALE_COOKIE, payload);
    document.cookie = `${LOCALE_COOKIE}=${encodeURIComponent(payload)};path=/;max-age=31536000;SameSite=Lax`;
  }
}

export function buildPreferences(country: Country, locale: Locale): LocalePreferences {
  return {
    country,
    locale,
    currency: currencyForCountry(country),
  };
}

export function getDefaultPreferences(): LocalePreferences {
  return { ...DEFAULT_PREFERENCES };
}
