import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { AuthProvider } from "@/components/AuthProvider";
import { LocaleProvider } from "@/components/LocaleProvider";
import { isValidLocale, type Locale } from "@/lib/locale";
import { readPreferencesFromCookie } from "@/lib/locale-storage";

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale: localeParam } = await params;

  if (!isValidLocale(localeParam)) {
    notFound();
  }

  const locale = localeParam as Locale;
  const cookieStore = await cookies();
  const initialPreferences = readPreferencesFromCookie(cookieStore.toString());

  return (
    <LocaleProvider locale={locale} initialPreferences={initialPreferences}>
      <AuthProvider>{children}</AuthProvider>
    </LocaleProvider>
  );
}
