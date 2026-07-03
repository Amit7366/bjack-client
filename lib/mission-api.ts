import { authFetchData } from "@/lib/auth/auth-fetch";
import type { MissionTab } from "@/lib/i18n/mission-messages";

export type MissionItem = {
  id: string;
  slug: string;
  title: string;
  rules: string;
  dateRange: string;
  startsAt: string;
  endsAt: string;
  remainingSeconds: number | null;
  currentValue: number;
  targetValue: number;
  percent: number;
  medalType: "bronze" | "silver";
};

export type MissionListResponse = {
  tab: MissionTab;
  items: MissionItem[];
};

export async function fetchMissions(tab: MissionTab, locale: string): Promise<MissionListResponse> {
  const query = new URLSearchParams({ tab, locale });
  return authFetchData<MissionListResponse>(`/missions?${query.toString()}`);
}

export async function fetchMissionAvailableCount(): Promise<number> {
  const data = await authFetchData<{ availableCount: number }>("/missions/summary");
  return Number(data.availableCount ?? 0);
}
