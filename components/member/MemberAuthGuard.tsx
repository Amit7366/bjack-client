"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { useLocale } from "@/components/LocaleProvider";

export default function MemberAuthGuard({ children }: { children: React.ReactNode }) {
  const { isUser, isAuthenticated, authReady } = useAuth();
  const { preferences } = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!authReady) return;
    if (!isAuthenticated || !isUser) {
      const loginUrl = `/${preferences.locale}/login?next=${encodeURIComponent(pathname)}`;
      router.replace(loginUrl);
    }
  }, [authReady, isAuthenticated, isUser, pathname, preferences.locale, router]);

  if (!authReady || !isUser) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-[#9ca3af]">
        …
      </div>
    );
  }

  return <>{children}</>;
}
