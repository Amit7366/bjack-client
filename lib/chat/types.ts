export type SupportRoom = {
  roomId: string;
  memberObjectId: string;
  assignedOfficerId: string | null;
  officerAssigned: boolean;
  unreadForMember: number;
  unreadForOfficer: number;
  lastMessage: string;
  lastMessageAt: string;
};

export type ChatMessage = {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  roomId: string;
  isRead: boolean;
  createdAt?: string;
  updatedAt?: string;
};
