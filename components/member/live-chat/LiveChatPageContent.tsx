"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useLocale } from "@/components/LocaleProvider";
import { useSupportChat } from "@/lib/chat/useSupportChat";
import { memberCenterHref } from "@/lib/member-routes";

function formatTime(value?: string): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function LiveChatPageContent() {
  const { session } = useAuth();
  const { preferences, t } = useLocale();
  const locale = preferences.locale;
  const {
    room,
    messages,
    loading,
    error,
    sending,
    typingFrom,
    connected,
    sendMessage,
    notifyTyping,
  } = useSupportChat();
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const myId = session?.objectId ?? "";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, typingFrom]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim() || sending) return;
    const text = draft;
    setDraft("");
    notifyTyping(false);
    try {
      await sendMessage(text);
    } catch {
      setDraft(text);
    }
  }

  const canSend = Boolean(room?.roomId) && !sending && !loading;

  return (
    <div className="flex min-h-full flex-col bg-[#f2f3f5]">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-[#e5e7eb] bg-white px-4 py-3 shadow-sm">
        <Link
          href={memberCenterHref(locale)}
          className="focus-ring rounded-md p-1 text-[#374151] hover:bg-black/5"
          aria-label="Back"
        >
          ←
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[16px] font-semibold text-[#111827]">{t.liveSupport}</h1>
          <p className="text-[12px] text-[#6b7280]">
            {connected ? t.chatOnline ?? "Online" : t.chatReconnecting ?? "Reconnecting…"}
          </p>
        </div>
      </header>

      {!room?.officerAssigned && !loading ? (
        <div className="mx-4 mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-900">
          {t.chatNoAgent ?? "No dedicated agent is assigned yet. You can still send a message — our support team will reply as soon as possible."}
        </div>
      ) : null}

      {error ? (
        <div className="mx-4 mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-[13px] text-red-700">
          {error}
        </div>
      ) : null}

      <div className="flex-1 overflow-y-auto px-3 py-4">
        {loading ? (
          <p className="text-center text-[14px] text-[#6b7280]">{t.loading ?? "Loading…"}</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-[14px] text-[#6b7280]">
            {t.chatEmpty ?? "Start a conversation with customer service."}
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {messages.map((msg) => {
              const mine = String(msg.senderId) === myId;
              return (
                <li key={msg._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed shadow-sm ${
                      mine
                        ? "rounded-br-md bg-[#3b3127] text-white"
                        : "rounded-bl-md border border-[#e5e7eb] bg-white text-[#111827]"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                    <p className={`mt-1 text-[10px] ${mine ? "text-white/70" : "text-[#9ca3af]"}`}>
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        {typingFrom ? (
          <p className="mt-2 text-[12px] text-[#6b7280]">{t.chatTyping ?? "Agent is typing…"}</p>
        ) : null}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => void onSubmit(e)}
        className="sticky bottom-0 border-t border-[#e5e7eb] bg-white px-3 py-3 pb-mobile-nav"
      >
        <div className="flex items-end gap-2">
          <textarea
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              notifyTyping(e.target.value.length > 0);
            }}
            onBlur={() => notifyTyping(false)}
            rows={1}
            placeholder={t.chatPlaceholder ?? "Type your message…"}
            disabled={!canSend}
            className="max-h-28 min-h-[44px] text-black flex-1 resize-none rounded-xl border border-[#d1d5db] px-3 py-2.5 text-[14px] outline-none focus:border-[#3b3127] disabled:bg-[#f3f4f6]"
          />
          <button
            type="submit"
            disabled={!canSend || !draft.trim()}
            className="focus-ring min-h-[44px] shrink-0 rounded-xl bg-[#3b3127] px-4 text-[14px] font-semibold text-white disabled:opacity-50"
          >
            {t.chatSend ?? "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
