import { authFetchData } from "@/lib/auth/auth-fetch";
import type { BettingTab } from "@/lib/betting-records-data";
import { getDateRangeForFilter } from "@/lib/transaction-records-api";
import type { TransactionDateFilter } from "@/lib/transactions-data";

export const BETTING_RECORDS_PAGE_SIZE = 20;

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
  page: number;
  limit: number;
  totalPages: number;
  history: ApiGameTxnRecord[];
  message?: string;
};

export async function fetchUserBetHistory(params: {
  dateFilter: TransactionDateFilter;
  tab: BettingTab;
  page?: number;
  limit?: number;
}): Promise<GameBetHistoryResponse> {
  const { from, to } = getDateRangeForFilter(params.dateFilter);
  const page = params.page ?? 1;
  const limit = params.limit ?? BETTING_RECORDS_PAGE_SIZE;

  const q = new URLSearchParams({
    from,
    to,
    page: String(page),
    limit: String(limit),
  });

  if (params.tab === "unsettled") {
    q.set("tab", "unsettled");
  }

  const data = await authFetchData<GameBetHistoryResponse>(
    `/gameRecords-txns/gametxnrecords/user-bets/me?${q.toString()}`,
  );

  return {
    ...data,
    history: data.history ?? [],
    total: data.total ?? 0,
    page: data.page ?? page,
    limit: data.limit ?? limit,
    totalPages: data.totalPages ?? 0,
  };
}
