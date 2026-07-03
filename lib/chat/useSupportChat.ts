"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { readAuthSession } from "@/lib/auth/session";
import { fetchMySupportRoom, fetchRoomMessages, markChatRoomRead, sendChatMessage } from "./api";
import { disconnectChatSocket, getChatSocket } from "./socket";
import type { ChatMessage, SupportRoom } from "./types";

export function useSupportChat() {
  const [room, setRoom] = useState<SupportRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [typingFrom, setTypingFrom] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const myObjectId = useRef<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const session = readAuthSession();
      myObjectId.current = session?.objectId ?? null;
      const roomData = await fetchMySupportRoom();
      setRoom(roomData);
      const history = await fetchRoomMessages(roomData.roomId);
      setMessages(history);
      await markChatRoomRead(roomData.roomId).catch(() => undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load chat");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!room?.roomId) return;

    let socket: ReturnType<typeof getChatSocket>;
    try {
      socket = getChatSocket();
    } catch {
      return;
    }

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onNewMessage = (msg: ChatMessage) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
      if (String(msg.senderId) !== myObjectId.current) {
        void markChatRoomRead(room.roomId).catch(() => undefined);
      }
    };
    const onTyping = (data: { from: string; roomId: string }) => {
      if (data.roomId === room.roomId && data.from !== myObjectId.current) {
        setTypingFrom(data.from);
      }
    };
    const onStopTyping = () => setTypingFrom(null);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("new_message", onNewMessage);
    socket.on("typing", onTyping);
    socket.on("stop_typing", onStopTyping);
    socket.emit("join_support_room", room.roomId);
    if (socket.connected) setConnected(true);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("new_message", onNewMessage);
      socket.off("typing", onTyping);
      socket.off("stop_typing", onStopTyping);
      disconnectChatSocket();
    };
  }, [room?.roomId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!room?.roomId || !content.trim()) return;
      setSending(true);
      setError(null);
      try {
        const msg = await sendChatMessage(room.roomId, content.trim());
        setMessages((prev) => (prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to send");
        throw err;
      } finally {
        setSending(false);
      }
    },
    [room?.roomId],
  );

  const notifyTyping = useCallback(
    (typing: boolean) => {
      if (!room?.roomId) return;
      try {
        const socket = getChatSocket();
        socket.emit(typing ? "typing" : "stop_typing", { roomId: room.roomId });
      } catch {
        /* ignore */
      }
    },
    [room?.roomId],
  );

  return {
    room,
    messages,
    loading,
    error,
    sending,
    typingFrom,
    connected,
    sendMessage,
    notifyTyping,
    reload: load,
  };
}
