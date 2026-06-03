import { readAuthSession } from "@/lib/auth/session";
import type { BettingTab } from "@/lib/betting-records-data";
import { getDateRangeForFilter } from "@/lib/transaction-records-api";
import type { TransactionDateFilter } from "@/lib/transactions-data";

const API_PREFIX = "/api/v1";

export type ApiGameTxnRecord = {
  txnId: string;
  gameRound?: string | null;
  bet: number;
  win: number;
  currencyCode: string;
  providerTsUtc: string;
  gameUid?: string;
  game?: {
    name?: string;
    code?: string;
    provider?: string;
    type?: string;
  };
};

export type GameBetHistoryResponse = {
  success?: boolean;
  sbmId?: string;
  total: number;
  totalBets: number;
  totalWins: number;
  history: ApiGameTxnRecord[];
  message?: string;
};

export async function fetchUserBetHistory(params: {
  dateFilter: TransactionDateFilter;
  tab: BettingTab;
  page?: number;
  limit?: number;
}): Promise<GameBetHistoryResponse> {
  const session = readAuthSession();
  if (!session?.accessToken) {
    throw new Error("Please log in to continue");
  }

  const sbmId = session.memberId?.trim().toLowerCase();
  if (!sbmId) {
    throw new Error("Session expired. Please log in again.");
  }

  const { from, to } = getDateRangeForFilter(params.dateFilter);
  const q = new URLSearchParams({
    from,
    to,
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 200),
  });

  if (params.tab === "unsettled") {
    q.set("tab", "unsettled");
  }

  const res = await fetch(
    `${API_PREFIX}/gameRecords-txns/gametxnrecords/user-bets/me?${q.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      credentials: "include",
    },
  );

  const body = (await res.json()) as GameBetHistoryResponse;
  if (!res.ok || body.success === false) {
    throw new Error(body.message || "Failed to load betting records");
  }

  return {
    ...body,
    history: body.history ?? [],
    total: body.total ?? body.history?.length ?? 0,
  };
}
