import type { ApiResponse } from "@/lib/api/types";
import { readAuthSession } from "@/lib/auth/session";

const API_PREFIX = "/api/v1";

export type UserWalletRecord = {
  _id: string;
  userId: string;
  walletType: "ewallet" | "bank";
  walletName: string;
  accountHolderName: string;
  walletNumber: string;
  isDefault?: boolean;
};

export async function fetchUserWallets(): Promise<UserWalletRecord[]> {
  const session = readAuthSession();
  if (!session?.accessToken || !session.objectId) {
    throw new Error("Please log in to continue");
  }

  const res = await fetch(
    `${API_PREFIX}/wallets/user/${encodeURIComponent(session.objectId)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      credentials: "include",
    },
  );

  const body = (await res.json()) as ApiResponse<UserWalletRecord[]>;
  if (!res.ok || !body.success || !body.data) {
    throw new Error(body.message || "Failed to load wallets");
  }
  return body.data;
}
