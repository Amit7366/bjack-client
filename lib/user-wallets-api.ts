import type { ApiResponse } from "@/lib/api/types";
import { readAuthSession } from "@/lib/auth/session";

const API_PREFIX = "/api/v1";

export const MAX_USER_WALLETS = 5;

export type UserWalletRecord = {
  _id: string;
  userId: string;
  walletType: "ewallet" | "bank";
  walletName: string;
  accountHolderName: string;
  walletNumber: string;
  isDefault?: boolean;
};

export type CreateUserWalletInput = {
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

export async function createUserWallet(
  input: CreateUserWalletInput,
): Promise<UserWalletRecord> {
  const session = readAuthSession();
  if (!session?.accessToken || !session.objectId) {
    throw new Error("Please log in to continue");
  }

  const res = await fetch(`${API_PREFIX}/wallets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
    credentials: "include",
    body: JSON.stringify({
      userId: session.objectId,
      walletType: input.walletType,
      walletName: input.walletName.trim(),
      accountHolderName: input.accountHolderName.trim(),
      walletNumber: input.walletNumber.trim(),
      isDefault: input.isDefault ?? false,
    }),
  });

  const body = (await res.json()) as ApiResponse<UserWalletRecord>;
  if (!res.ok || !body.success || !body.data) {
    throw new Error(body.message || "Failed to add wallet");
  }
  return body.data;
}

export async function deleteUserWallet(walletId: string): Promise<void> {
  const session = readAuthSession();
  if (!session?.accessToken) {
    throw new Error("Please log in to continue");
  }

  const res = await fetch(`${API_PREFIX}/wallets/${encodeURIComponent(walletId)}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    credentials: "include",
  });

  const body = (await res.json()) as ApiResponse<null>;
  if (!res.ok || !body.success) {
    throw new Error(body.message || "Failed to delete wallet");
  }
}
