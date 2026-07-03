import { io, type Socket } from "socket.io-client";
import { readAuthSession } from "@/lib/auth/session";

const SOCKET_URL = (
  process.env.NEXT_PUBLIC_SOCKET_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000"
).replace(/\/$/, "");

let socket: Socket | null = null;

export function getChatSocket(): Socket {
  if (socket?.connected) return socket;

  const session = readAuthSession();
  if (!session?.accessToken) {
    throw new Error("Not authenticated");
  }

  socket = io(SOCKET_URL, {
    path: "/socket.io",
    auth: { token: session.accessToken },
    transports: ["websocket", "polling"],
    autoConnect: true,
  });

  return socket;
}

export function disconnectChatSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
