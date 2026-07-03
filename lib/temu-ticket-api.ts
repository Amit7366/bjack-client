import { authFetchData } from "@/lib/auth/auth-fetch";

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

export async function fetchTemuTicketHistory(): Promise<TemuTicketHistory> {
  return authFetchData<TemuTicketHistory>("/temu-ticket/history");
}
