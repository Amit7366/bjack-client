import { authFetchData } from "@/lib/auth/auth-fetch";
import type { PersonalReportData } from "@/lib/i18n/profit-loss-messages";

export async function fetchPersonalReport(params: {
  from: string;
  to: string;
}): Promise<PersonalReportData> {
  const search = new URLSearchParams();
  search.set("from", params.from);
  search.set("to", params.to);
  return authFetchData<PersonalReportData>(`/profit-loss/report?${search.toString()}`);
}
