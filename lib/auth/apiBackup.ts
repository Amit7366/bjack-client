import type { ApiResponse, LoginResponseData, RegisterResponseData } from "@/lib/api/types";
import { clearMemberProfileCache } from "@/lib/member/profile-cache";
import { clearAuthSession, enrichSession, saveAuthSession, type AuthSession } from "./session";

const API_PREFIX = "/api/v1";

async function requestJson<T>(
  path: string,
  init?: RequestInit,
): Promise<{ ok: boolean; status: number; body: ApiResponse<T> }> {
  const session = typeof window !== "undefined" ? readAuthSessionForRequest() : null;
  const res = await fetch(`${API_PREFIX}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(session?.accessToken
        ? { Authorization: `Bearer ${session.accessToken}` }
        : {}),
      ...(init?.headers ?? {}),
    },
  });

  const body = (await res.json()) as ApiResponse<T>;
  return { ok: res.ok && body.success, status: res.status, body };
}

function readAuthSessionForRequest(): AuthSession | null {
  try {
    const raw = localStorage.getItem("city777.auth");
    if (!raw) return null;
    return enrichSession(JSON.parse(raw) as AuthSession);
  } catch {
    return null;
  }
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
  const { ok, body } = await requestJson<LoginResponseData>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ userName: userName.trim(), password }),
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
  });

  saveAuthSession(session);

  try {
    const fresh = await refreshWalletBalance();
    if (fresh) {
      return {
        session: { ...session, balance: fresh },
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

  const { ok, body } = await requestJson<RegisterResponseData>("/users/create-user", {
    method: "POST",
    body: JSON.stringify({
      password: input.password,
      normalUser: {
        name: userName,
        userName,
        contactNo,
        country: input.currency === "INR" ? "India" : "Bangladesh",
        ...(input.referredBy ? { referredBy: input.referredBy } : {}),
      },
    }),
  });

  if (!ok) {
    throw new Error(body.message || "Registration failed");
  }

  return { message: body.message ?? "Account created" };
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
  const current = readAuthSessionForRequest();
  const memberId = current?.memberId;
  if (!current?.accessToken || !memberId) return current?.balance;

  const { ok, body } = await requestJson<BalancePayload>(
    `/transaction/balance/${encodeURIComponent(memberId)}`,
    { method: "GET" },
  );

  if (!ok || !body.data) return current.balance;

  const formatted = formatWalletBalance(
    body.data.currentBalance ?? body.data.balance,
  );

  if (formatted !== undefined) {
    saveAuthSession({ ...current, balance: formatted });
    return formatted;
  }
  return current.balance;
}

/** Invalidate refresh cookie on server and clear local session */
export async function logoutUser(): Promise<void> {
  try {
    await requestJson<null>("/auth/logout", { method: "POST" });
  } catch {
    /* still clear client session if network fails */
  } finally {
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
