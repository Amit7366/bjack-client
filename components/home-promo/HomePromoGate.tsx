"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import HomePromoSliderModal from "./HomePromoSliderModal";

const DISMISS_KEY_PREFIX = "rajabaji.homePromo.dismissed.";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function isHomePath(pathname: string): boolean {
  return /^\/(bn|en|hi)\/?$/.test(pathname);
}

export default function HomePromoGate() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isHomePath(pathname)) {
      setOpen(false);
      return;
    }

    try {
      const dismissKey = `${DISMISS_KEY_PREFIX}${todayKey()}`;
      if (sessionStorage.getItem(dismissKey) === "1") return;
    } catch {
      // Ignore storage errors
    }

    const timer = window.setTimeout(() => setOpen(true), 400);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  const handleClose = useCallback(() => {
    try {
      sessionStorage.setItem(`${DISMISS_KEY_PREFIX}${todayKey()}`, "1");
    } catch {
      // Ignore storage errors
    }
    setOpen(false);
  }, []);

  return <HomePromoSliderModal open={open} onClose={handleClose} />;
}
