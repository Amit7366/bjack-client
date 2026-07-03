import { authFetchData, authFetchJson } from "@/lib/auth/auth-fetch";

export type TemuTicketHistoryItem = {
  id: string;
  date: string;
  ticketName: string;
  condition: string;
  addedAmount: number;
};

export type TemuTicketHistory = {
  totalClaimed: number;
  items: TemuTicketHistoryItem[];
};

export type TemuTicketStatus = {
  sessionId: string;
  targetAmount: number;
  progressAmount: number;
  percent: number;
  remainingToTarget: number;
  inviteCount: number;
  rewardClaimed: boolean;
  status: "active" | "completed" | "expired";
  expiresAt: string;
  ticketName: string;
  canClaimReward: boolean;
  claimableAmount: number;
};

export type TemuTicketClaimResult = {
  claim: {
    id: string;
    addedAmount: number;
    condition: string;
    ticketName: string;
    claimedAt: string;
  };
  balance: string;
  status: TemuTicketStatus;
};

export async function fetchTemuTicketStatus(locale: string): Promise<TemuTicketStatus> {
  const query = new URLSearchParams({ locale });
  return authFetchData<TemuTicketStatus>(`/temu-ticket/status?${query.toString()}`);
}

export async function fetchTemuTicketHistory(): Promise<TemuTicketHistory> {
  return authFetchData<TemuTicketHistory>("/temu-ticket/history");
}

export async function claimTemuReward(locale: string): Promise<TemuTicketClaimResult> {
  const { ok, body } = await authFetchJson<TemuTicketClaimResult>("/temu-ticket/claim", {
    method: "POST",
    body: JSON.stringify({ locale }),
  });
  if (!ok || !body.data) {
    throw new Error(body.message || "Failed to claim reward");
  }
  return body.data;
}
