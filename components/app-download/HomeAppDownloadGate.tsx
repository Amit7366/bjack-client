"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { usePwaInstall } from "@/lib/use-pwa-install";
import AppDownloadPrompt from "./AppDownloadPrompt";

const DISMISS_KEY = "city777.appDownload.dismissed";

function isHomePath(pathname: string): boolean {
  return /^\/(bn|en|hi)\/?$/.test(pathname);
}

export default function HomeAppDownloadGate() {
  const pathname = usePathname();
  const { isStandalone } = usePwaInstall();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isHomePath(pathname) || isStandalone) {
      setOpen(false);
      return;
    }

    try {
      if (localStorage.getItem(DISMISS_KEY) === "1") return;
    } catch {
      // Ignore storage errors (private browsing, etc.)
    }

    setOpen(true);
  }, [pathname, isStandalone]);

  const handleClose = useCallback(() => {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Ignore storage errors
    }
    setOpen(false);
  }, []);

  if (!open) return null;

  return <AppDownloadPrompt onClose={handleClose} />;
}
