import { authFetchData } from "@/lib/auth/auth-fetch";
import { readAuthSession } from "@/lib/auth/session";

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
  if (!session?.objectId) {
    throw new Error("Please log in to continue");
  }

  return authFetchData<UserWalletRecord[]>(
    `/wallets/user/${encodeURIComponent(session.objectId)}`,
  );
}

export async function createUserWallet(
  input: CreateUserWalletInput,
): Promise<UserWalletRecord> {
  const session = readAuthSession();
  if (!session?.objectId) {
    throw new Error("Please log in to continue");
  }

  return authFetchData<UserWalletRecord>("/wallets", {
    method: "POST",
    body: JSON.stringify({
      userId: session.objectId,
      walletType: input.walletType,
      walletName: input.walletName.trim(),
      accountHolderName: input.accountHolderName.trim(),
      walletNumber: input.walletNumber.trim(),
      isDefault: input.isDefault ?? false,
    }),
  });
}

export async function deleteUserWallet(walletId: string): Promise<void> {
  await authFetchData<null>(`/wallets/${encodeURIComponent(walletId)}`, {
    method: "DELETE",
  });
}
