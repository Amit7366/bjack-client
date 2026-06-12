"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { fetchSpinStatus, type SpinStatus } from "@/lib/spin-api";
import SpinWheelModal from "./SpinWheelModal";

const DISMISS_KEY_PREFIX = "bkbaji.spin.dismissed.";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function isHomePath(pathname: string): boolean {
  return /^\/(bn|en|hi)\/?$/.test(pathname);
}

export default function HomeSpinWheelGate() {
  const pathname = usePathname();
  const { isAuthenticated, authReady } = useAuth();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<SpinStatus | null>(null);
  const checkedRef = useRef(false);

  const checkAndShow = useCallback(async () => {
    if (!isHomePath(pathname) || !isAuthenticated) return;

    const dismissKey = `${DISMISS_KEY_PREFIX}${todayKey()}`;
    if (sessionStorage.getItem(dismissKey) === "1") return;

    try {
      const data = await fetchSpinStatus();
      if (!data.canSpin) return;
      setStatus(data);
      setOpen(true);
    } catch {
      // Silent — don't block home page
    }
  }, [pathname, isAuthenticated]);

  useEffect(() => {
    if (!authReady || !isHomePath(pathname) || !isAuthenticated) return;
    if (checkedRef.current) return;

    checkedRef.current = true;
    void checkAndShow();
  }, [authReady, pathname, isAuthenticated, checkAndShow]);

  useEffect(() => {
    if (!isAuthenticated) {
      checkedRef.current = false;
      setOpen(false);
    }
  }, [isAuthenticated]);

  const handleClose = useCallback(() => {
    const dismissKey = `${DISMISS_KEY_PREFIX}${todayKey()}`;
    sessionStorage.setItem(dismissKey, "1");
    setOpen(false);
  }, []);

  if (!open) return null;

  return <SpinWheelModal open={open} onClose={handleClose} initialStatus={status} />;
}
