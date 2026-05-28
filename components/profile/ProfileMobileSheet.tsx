"use client";

import { useEffect } from "react";
import { getProfileMessages } from "@/lib/i18n/profile-messages";
import { useLocale } from "@/components/LocaleProvider";
import ProfileMenuPanel from "./ProfileMenuPanel";

type ProfileMobileSheetProps = {
  open: boolean;
  onClose: () => void;
};

export default function ProfileMobileSheet({ open, onClose }: ProfileMobileSheetProps) {
  const { preferences } = useLocale();
  const p = getProfileMessages(preferences.locale);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden"
      role="presentation"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" aria-hidden />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={p.navLabel}
        onClick={(e) => e.stopPropagation()}
        className="animate-slide-up relative flex max-h-[min(92dvh,780px)] w-full flex-col overflow-hidden rounded-t-2xl border border-b-0 border-[#333] bg-[#1e1e1e] shadow-[0_-16px_48px_rgba(0,0,0,0.55)]"
      >
        <div className="flex shrink-0 justify-center pb-1 pt-3" aria-hidden>
          <span className="h-1 w-10 rounded-full bg-[#555]" />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch]">
          <ProfileMenuPanel onClose={onClose} />
        </div>
      </div>
    </div>
  );
}
