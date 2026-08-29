"use client";

import Image from "next/image";
import { useLocale } from "@/components/LocaleProvider";
import { useToast } from "@/components/ToastProvider";
import { usePwaInstall } from "@/lib/use-pwa-install";
import { rajabaji_ANDROID_APP_PATH, SITE_ICONS } from "@/lib/seo/site-config";

type AppDownloadPromptProps = {
  onClose: () => void;
};

function AndroidIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.6 9.48l1.84-3.18c.16-.28.06-.64-.22-.8a.61.61 0 00-.83.22l-1.88 3.24a11.43 11.43 0 00-8.94 0L5.69 5.72a.61.61 0 00-.83-.22c-.28.16-.38.52-.22.8L6.4 9.48A10.81 10.81 0 001 18h22a10.81 10.81 0 00-5.4-8.52zM7 15.25a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm10 0a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M1 1l10 10M11 1L1 11"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AppDownloadPrompt({ onClose }: AppDownloadPromptProps) {
  const { t } = useLocale();
  const { showToast } = useToast();
  const { canInstall, install } = usePwaInstall();
  const m = t.appDownloadPrompt;

  const handlePwaInstall = async () => {
    if (canInstall) {
      const accepted = await install();
      if (accepted) onClose();
      return;
    }
    showToast(m.pwaUnavailable);
  };

  return (
    <div
      role="dialog"
      aria-label={m.title}
      className="animate-slide-up fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom)+0.5rem)] left-3 right-3 z-50 mx-auto max-w-lg rounded-2xl bg-[#f2f2f2] p-4 shadow-[0_4px_24px_rgba(0,0,0,0.28)] lg:hidden"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={m.close}
        className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#9ca3af] text-white"
      >
        <CloseIcon />
      </button>

      <div className="flex items-start gap-3 pr-8">
        <Image
          src={SITE_ICONS.pwa192}
          alt=""
          width={56}
          height={56}
          className="h-14 w-14 shrink-0 rounded-xl object-cover"
        />
        <p className="pt-1 text-sm font-semibold leading-snug text-[#1f2937]">{m.title}</p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mx-auto mt-3 block text-sm text-[#3b82f6] underline underline-offset-2"
      >
        {m.continueInBrowser}
      </button>

      <div className="mt-4 flex gap-3">
        <a
          href={rajabaji_ANDROID_APP_PATH}
          download
          className="relative flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#3b82f6] py-3 text-sm font-bold text-white"
        >
          <span className="absolute -left-1 -top-2 rounded-md bg-[#ef4444] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
            {m.badge}
          </span>
          <AndroidIcon className="h-5 w-5" />
          {m.apkLabel}
        </a>

        <button
          type="button"
          onClick={() => void handlePwaInstall()}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#3b82f6] bg-white py-3 text-sm font-semibold text-[#3b82f6]"
        >
          <AndroidIcon className="h-5 w-5" />
          {m.webAppLabel}
        </button>
      </div>
    </div>
  );
}
