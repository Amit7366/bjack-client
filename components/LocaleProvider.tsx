"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { LocalePreferences } from "@/lib/locale";
import { buildPreferences, savePreferences } from "@/lib/locale-storage-client";
import type { Country, Locale } from "@/lib/locale";
import { getMessages, type Messages } from "@/lib/i18n/messages";

type LocaleContextValue = {
  locale: Locale;
  preferences: LocalePreferences;
  t: Messages;
  setPreferences: (country: Country, locale: Locale) => void;
  modalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function resolvePreferences(
  locale: Locale,
  initialPreferences?: LocalePreferences | null,
): LocalePreferences {
  if (initialPreferences) {
    return { ...initialPreferences, locale };
  }
  return buildPreferences("bd", locale);
}

export function LocaleProvider({
  children,
  locale,
  initialPreferences,
}: {
  children: React.ReactNode;
  locale: Locale;
  initialPreferences?: LocalePreferences | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [modalOpen, setModalOpen] = useState(false);
  const [preferences, setPreferencesState] = useState<LocalePreferences>(() =>
    resolvePreferences(locale, initialPreferences),
  );

  const setPreferences = useCallback(
    (country: Country, nextLocale: Locale) => {
      const next = buildPreferences(country, nextLocale);
      setPreferencesState(next);
      savePreferences(next);

      if (nextLocale !== locale) {
        const suffix = pathname.replace(/^\/[^/]+/, "") || "";
        router.push(`/${nextLocale}${suffix}`);
      }

      setModalOpen(false);
    },
    [locale, pathname, router],
  );

  const value = useMemo(
    () => ({
      locale,
      preferences,
      t: getMessages(locale),
      setPreferences,
      modalOpen,
      openModal: () => setModalOpen(true),
      closeModal: () => setModalOpen(false),
    }),
    [locale, preferences, setPreferences, modalOpen],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}
