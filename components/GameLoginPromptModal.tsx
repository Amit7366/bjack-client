"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useLocale } from "./LocaleProvider";

function BjLogoLarge() {
  return (
    <span className="inline-block text-[52px] font-black leading-none tracking-tighter sm:text-[60px]">
      <span className="bg-gradient-to-b from-[#f0f0f0] via-[#c0c0c0] to-[#707070] bg-clip-text text-transparent drop-shadow-[0_3px_6px_rgba(0,0,0,0.45)]">
        b
      </span>
      <span className="bg-gradient-to-b from-[#ffb347] via-[#ff8c00] to-[#e65100] bg-clip-text text-transparent drop-shadow-[0_3px_6px_rgba(0,0,0,0.45)]">
        j
      </span>
    </span>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3.5 3.5l9 9M12.5 3.5l-9 9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

type GameLoginPromptModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function GameLoginPromptModal({ open, onClose }: GameLoginPromptModalProps) {
  const { t, preferences } = useLocale();
  const base = `/${preferences.locale}`;
  const copy = t.gameLoginPrompt;

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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="presentation"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" aria-hidden />

      <div
        className="relative z-[101] flex w-full max-w-[340px] flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="game-login-prompt-title"
          className="w-full rounded-2xl bg-[#222222] px-6 pb-6 pt-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.65)] sm:px-8 sm:pb-7 sm:pt-9"
        >
          <div className="mb-5 flex justify-center">
            <BjLogoLarge />
          </div>

          <h2 id="game-login-prompt-title" className="text-[17px] font-bold leading-snug text-white sm:text-[18px]">
            {copy.title}
          </h2>

          <p className="mt-3 text-[13px] leading-relaxed text-[#b3b3b3] sm:text-[14px]">{copy.description}</p>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              href={`${base}/register`}
              onClick={onClose}
              className="focus-ring flex min-h-11 items-center justify-center rounded-lg bg-[#2d7d5a] px-4 text-[15px] font-semibold text-white transition-colors hover:bg-[#35966d]"
            >
              {t.signUp}
            </Link>
            <Link
              href={`${base}/login`}
              onClick={onClose}
              className="focus-ring flex min-h-11 items-center justify-center rounded-lg border border-[#555555] bg-transparent px-4 text-[15px] font-semibold text-white transition-colors hover:border-[#777777] hover:bg-white/5"
            >
              {t.login}
            </Link>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label={copy.close}
          className="focus-ring mt-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#333333] text-[#d4d4d4] transition-colors hover:bg-[#404040] hover:text-white"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
}
