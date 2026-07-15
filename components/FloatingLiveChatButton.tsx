"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { useLocale } from "@/components/LocaleProvider";
import { memberLiveChatHref } from "@/lib/member-routes";

export default function FloatingLiveChatButton() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { t, preferences } = useLocale();
  const label = t.sub.liveChat;

  function goLiveChat() {
    const href = memberLiveChatHref(preferences.locale);
    if (!isAuthenticated) {
      router.push(`/${preferences.locale}/login?next=${encodeURIComponent(href)}`);
      return;
    }
    router.push(href);
  }

  return (
    <button
      type="button"
      onClick={goLiveChat}
      aria-label={label}
      className="fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom)+0.75rem)] right-3 z-40 flex flex-col items-center gap-0.5 transition-transform hover:scale-105 active:scale-95 lg:bottom-6 lg:right-6"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#178358] shadow-[0_4px_16px_rgba(0,0,0,0.35)]">
        <Image
          src="/live-chat.png"
          alt=""
          width={22}
          height={22}
          className="h-[22px] w-[22px] object-contain"
          priority
        />
      </span>
      <span className="max-w-[4.5rem] text-center text-[9px] font-semibold leading-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
        {label}
      </span>
    </button>
  );
}
