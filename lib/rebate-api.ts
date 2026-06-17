import { authFetchJson } from "@/lib/auth/auth-fetch";
import type {
  ManualRebateData,
  RebateClaimRecord,
  RebateHistoryData,
} from "@/lib/i18n/rebate-messages";

async function parseData<T>(path: string, init?: RequestInit): Promise<T> {
  const { ok, body } = await authFetchJson<T>(path, init);
  if (!ok || body.data == null) {
    throw new Error(body.message || "Request failed");
  }
  return body.data;
}

export async function fetchManualRebate(day?: string): Promise<ManualRebateData> {
  const query = day ? `?day=${encodeURIComponent(day)}` : "";
  return parseData<ManualRebateData>(`/rebate/manual${query}`);
}

export async function claimDailyRebate(): Promise<{
  claim: RebateClaimRecord;
  balance: string;
  summary: ManualRebateData;
}> {
  return parseData(`/rebate/claim`, { method: "POST" });
}

export async function fetchRebateHistory(params: {
  from?: string;
  to?: string;
  page?: number;
}): Promise<RebateHistoryData> {
  const search = new URLSearchParams();
  if (params.from) search.set("from", params.from);
  if (params.to) search.set("to", params.to);
  if (params.page) search.set("page", String(params.page));
  const query = search.toString();
  return parseData<RebateHistoryData>(`/rebate/history${query ? `?${query}` : ""}`);
}
