import type {
  ApiResponse,
  DeviceRegistrationStatusData,
  LoginResponseData,
  RegisterResponseData,
} from "@/lib/api/types";
import { API_PREFIX, authFetchJson } from "@/lib/auth/auth-fetch";
import { clearMemberProfileCache } from "@/lib/member/profile-cache";
import { clearAuthSession, enrichSession, readAuthSession, saveAuthSession, type AuthSession } from "./session";
import { isAccountStatus } from "@/lib/account-status";
import { clearLocalWallet, initWalletFromDb, reanchorWalletFromDb } from "@/lib/wallet-local-state";
import { getDeviceFingerprint } from "@/lib/device-fingerprint";

async function requestJson<T>(
  path: string,
  init?: RequestInit,
): Promise<{ ok: boolean; status: number; body: ApiResponse<T> }> {
  return authFetchJson<T>(path, init);
}

function readAuthSessionForRequest(): AuthSession | null {
  return readAuthSession();
}

export function formatContactNo(phone: string, currency: "BDT" | "INR"): string {
  const digits = phone.replace(/\D/g, "");
  if (currency === "INR") return `+91${digits}`;
  return `+880${digits}`;
}

export async function loginWithUsername(
  userName: string,
  password: string,
): Promise<{ session: AuthSession; message: string }> {
  const deviceFingerprint = await getDeviceFingerprint().catch(() => undefined);

  const { ok, body } = await requestJson<LoginResponseData>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      userName: userName.trim(),
      password,
      ...(deviceFingerprint ? { deviceFingerprint } : {}),
    }),
  });

  if (!ok || !body.data?.accessToken) {
    throw new Error(body.message || "Login failed");
  }

  const session = enrichSession({
    accessToken: body.data.accessToken,
    memberId: body.data.memberId,
    balance: formatWalletBalance(body.data.balance) ?? body.data.balance,
    userName: userName.trim(),
    needsPasswordChange: body.data.needsPasswordChange,
    accountStatus: isAccountStatus(body.data.status) ? body.data.status : "active",
  });

  saveAuthSession(session);

  try {
    const memberId = session.memberId ?? body.data.memberId;
    if (memberId) {
      const freshBalance = await initWalletFromDb(memberId);
      return {
        session: { ...session, balance: freshBalance.toFixed(2) },
        message: body.message ?? "Logged in",
      };
    }
  } catch {
    /* login response balance is still usable */
  }

  return { session: readAuthSessionForRequest() ?? session, message: body.message ?? "Logged in" };
}

export async function registerUser(input: {
  userName: string;
  password: string;
  contactNo: string;
  currency: "BDT" | "INR";
  referredBy?: string;
}): Promise<{ message: string }> {
  const contactNo = formatContactNo(input.contactNo, input.currency);
  const userName = input.userName.trim();
  const deviceFingerprint = await getDeviceFingerprint();

  const { ok, status, body } = await requestJson<RegisterResponseData>("/users/create-user", {
    method: "POST",
    body: JSON.stringify({
      password: input.password,
      normalUser: {
        name: userName,
        userName,
        contactNo,
        country: input.currency === "INR" ? "India" : "Bangladesh",
        deviceFingerprint,
        ...(input.referredBy ? { referredBy: input.referredBy } : {}),
      },
    }),
  });

  if (!ok) {
    throw new Error(body.message || (status === 409 ? "Registration blocked" : "Registration failed"));
  }

  return { message: body.message ?? "Account created" };
}

export async function checkDeviceRegistrationStatus(): Promise<DeviceRegistrationStatusData> {
  const deviceFingerprint = await getDeviceFingerprint();

  const { ok, body } = await requestJson<DeviceRegistrationStatusData>(
    "/users/device-registration-status",
    {
      method: "POST",
      body: JSON.stringify({ deviceFingerprint }),
    },
  );

  if (!ok || !body.data) {
    throw new Error(body.message || "Could not verify device registration status");
  }

  return body.data;
}

export async function registerAndLogin(input: {
  userName: string;
  password: string;
  contactNo: string;
  currency: "BDT" | "INR";
  referredBy?: string;
}): Promise<{ session: AuthSession; message: string }> {
  const registerResult = await registerUser(input);
  const loginResult = await loginWithUsername(input.userName, input.password);
  const contactNo = formatContactNo(input.contactNo, input.currency);
  const session = { ...loginResult.session, contactNo };
  saveAuthSession(session);
  return { session, message: registerResult.message };
}

type BalancePayload = {
  currentBalance?: number;
  balance?: string;
  id?: string;
  walletRevision?: number;
  lastGameSyncAt?: string;
};

export type WalletMeta = {
  balance: string;
  walletRevision?: number;
  lastGameSyncAt?: string;
};

/** Normalize wallet amount from API / login payload. */
export function formatWalletBalance(value: number | string | undefined | null): string | undefined {
  if (value == null || value === "") return undefined;
  const num = typeof value === "number" ? value : Number.parseFloat(String(value));
  if (!Number.isFinite(num)) return undefined;
  return num.toFixed(2);
}

/** Authoritative balance from UserBalance collection (by member id). */
export async function refreshWalletBalance(): Promise<string | undefined> {
  const meta = await fetchWalletMeta();
  return meta?.balance;
}

/** DB balance + revision for cross-device / re-anchor checks. */
export async function fetchWalletMeta(): Promise<WalletMeta | undefined> {
  const current = readAuthSessionForRequest();
  const memberId = current?.memberId;
  if (!current?.accessToken || !memberId) return undefined;

  const { ok, body } = await requestJson<BalancePayload>(
    `/transaction/balance/${encodeURIComponent(memberId)}`,
    { method: "GET" },
  );

  if (!ok || !body.data) return undefined;

  const formatted = formatWalletBalance(
    body.data.currentBalance ?? body.data.balance,
  );

  if (formatted !== undefined) {
    saveAuthSession({ ...current, balance: formatted });
    return {
      balance: formatted,
      walletRevision: body.data.walletRevision,
      lastGameSyncAt: body.data.lastGameSyncAt,
    };
  }
  return undefined;
}

/** Force DB re-anchor into local wallet cache. */
export async function reanchorWalletFromApi(memberId: string): Promise<string | undefined> {
  const balance = await reanchorWalletFromDb(memberId);
  return balance.toFixed(2);
}

/** Invalidate refresh cookie on server and clear local session */
export async function logoutUser(): Promise<void> {
  const session = readAuthSessionForRequest();
  try {
    await fetch(`${API_PREFIX}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(session?.accessToken
          ? { Authorization: `Bearer ${session.accessToken}` }
          : {}),
      },
    });
  } catch {
    /* still clear client session if network fails */
  } finally {
    const memberId = session?.memberId ?? readAuthSessionForRequest()?.memberId;
    if (memberId) clearLocalWallet(memberId);
    clearMemberProfileCache();
    clearAuthSession();
  }
}

export async function changePasswordUser(oldPassword: string, newPassword: string): Promise<void> {
  const { ok, body } = await requestJson<null>("/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ oldPassword, newPassword }),
  });

  if (!ok) {
    throw new Error(body.message || "Failed to change password");
  }
}
