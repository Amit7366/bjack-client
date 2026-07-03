import { authFetchData } from "@/lib/auth/auth-fetch";
import type { ChatMessage, SupportRoom } from "./types";

export async function fetchMySupportRoom(): Promise<SupportRoom> {
  return authFetchData<SupportRoom>("/chatRooms/support/my-room");
}

export async function fetchRoomMessages(roomId: string): Promise<ChatMessage[]> {
  return authFetchData<ChatMessage[]>(`/messages/room/${encodeURIComponent(roomId)}`);
}

export async function sendChatMessage(roomId: string, content: string): Promise<ChatMessage> {
  return authFetchData<ChatMessage>("/messages/send", {
    method: "POST",
    body: JSON.stringify({ roomId, content }),
  });
}

export async function markChatRoomRead(roomId: string): Promise<void> {
  await authFetchData<null>(`/messages/room/${encodeURIComponent(roomId)}/read`, {
    method: "PATCH",
  });
}
