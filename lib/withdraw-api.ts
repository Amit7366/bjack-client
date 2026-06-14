import { authFetchData } from "@/lib/auth/auth-fetch";
import { readAuthSession } from "@/lib/auth/session";

export type WithdrawPaymentMethod = "bkash" | "nagad" | "rocket";

export type ManualWithdrawRecord = {
  _id: string;
  amount: number;
  status: string;
  paymentMethod: string;
  walletNumber?: string;
};

/** Map saved wallet name (bKash, NAGAD, …) → API paymentMethod enum. */
export function mapWalletNameToPaymentMethod(name: string): WithdrawPaymentMethod {
  const n = name.trim().toLowerCase();
  if (n.includes("nagad")) return "nagad";
  if (n.includes("rocket")) return "rocket";
  return "bkash";
}

export async function createManualWithdraw(input: {
  amount: number;
  paymentMethod: WithdrawPaymentMethod;
  walletNumber: string;
  accountHolderName?: string;
}): Promise<ManualWithdrawRecord> {
  const session = readAuthSession();
  if (!session?.objectId || !session.memberId) {
    throw new Error("Please log in to continue");
  }

  const payload = {
    userId: session.objectId,
    id: session.memberId,
    amount: input.amount,
    paymentMethod: input.paymentMethod,
    transactionId: "sbm",
    walletNumber: input.walletNumber.trim(),
    accountHolderName: input.accountHolderName?.trim() || session.userName || "Member",
    bonusAmount: 0,
  };

  return authFetchData<ManualWithdrawRecord>("/transaction/withdraw/manual", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
