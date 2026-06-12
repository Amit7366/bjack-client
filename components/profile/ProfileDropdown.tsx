"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { getProfileMessages } from "@/lib/i18n/profile-messages";
import { useLocale } from "@/components/LocaleProvider";
import ProfileMenuPanel from "./ProfileMenuPanel";
import { ProfileNavIcon } from "./ProfileMenuIcons";

const HOVER_CLOSE_DELAY_MS = 180;

type ProfileDropdownProps = {
  variant?: "default" | "compact";
  /** Where the dropdown panel anchors under the trigger */
  menuAlign?: "start" | "end";
};

export default function ProfileDropdown({
  variant = "default",
  menuAlign = "start",
}: ProfileDropdownProps) {
  const { preferences } = useLocale();
  const locale = preferences.locale;
  const p = getProfileMessages(locale);
  const pathname = usePathname();
  const memberBase = `/${locale}/member`;

  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const isMemberRoute = pathname === memberBase || pathname.startsWith(`${memberBase}/`);
  const isActive = open || isMemberRoute;

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), HOVER_CLOSE_DELAY_MS);
  }, [clearCloseTimer]);

  const handleEnter = useCallback(() => {
    clearCloseTimer();
    setOpen(true);
  }, [clearCloseTimer]);

  const handleLeave = useCallback(() => {
    scheduleClose();
  }, [scheduleClose]);

  useEffect(() => {
    return () => clearCloseTimer();
  }, [clearCloseTimer]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const isCompact = variant === "compact";
  const menuPositionClass = menuAlign === "end" ? "right-0" : "left-0";

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={p.navLabel}
        onClick={() => setOpen((v) => !v)}
        className={`focus-ring relative flex items-center justify-center transition-colors ${
          isCompact
            ? `h-9 w-9 rounded-full bg-gradient-to-br from-[#22c55e] to-[#0d3d24] ${
                isActive ? "ring-2 ring-[#178358]" : ""
              }`
            : `gap-1.5 rounded-md px-2.5 py-2 text-[13px] ${
                isActive ? "text-white" : "text-[#d4d4d4] hover:bg-white/5 hover:text-white"
              }`
        }`}
      >
        {!isCompact && isActive ? (
          <span
            className="absolute inset-x-1 top-0 h-0.5 rounded-full bg-[#178358]"
            aria-hidden
          />
        ) : null}
        <ProfileNavIcon />
        {!isCompact ? <span>{p.navLabel}</span> : null}
      </button>

      <div
        className={`absolute ${menuPositionClass} top-full z-[60] w-[min(100vw-1.5rem,320px)] pt-1 transition-all duration-150 ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        }`}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <div className="overflow-hidden rounded-lg border border-[#333] bg-[#1e1e1e] shadow-[0_16px_48px_rgba(0,0,0,0.55)]">
          <ProfileMenuPanel onClose={() => setOpen(false)} showMemberHubLink />
        </div>
      </div>
    </div>
  );
}
