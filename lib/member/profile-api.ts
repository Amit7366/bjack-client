import type { ApiResponse } from "@/lib/api/types";
import { parseJwtPayload } from "@/lib/auth/jwt";
import { readAuthSession } from "@/lib/auth/session";
import { writeMemberProfileCache } from "./profile-cache";

const API_PREFIX = "/api/v1";

export type NormalUserProfile = {
  name?: string;
  userName?: string;
  contactNo?: string;
  email?: string;
  dateOfBirth?: string;
  profileImg?: string;
  createdAt?: string;
};

async function requestJson<T>(
  path: string,
  init?: RequestInit,
): Promise<{ ok: boolean; status: number; body: ApiResponse<T> }> {
  const session = readAuthSession();
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

export function getAuthObjectId(): string | null {
  const session = readAuthSession();
  if (session?.objectId) return session.objectId;
  if (!session?.accessToken) return null;
  return parseJwtPayload(session.accessToken)?.objectId ?? null;
}

export function formatDateOfBirthForInput(value?: string | Date | null): string {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function syncCacheFromProfile(profile: NormalUserProfile) {
  writeMemberProfileCache({
    legalName: profile.name,
    email: profile.email,
    dateOfBirth: formatDateOfBirthForInput(profile.dateOfBirth),
  });
}

async function patchMyProfile(normalUser: Record<string, unknown>): Promise<NormalUserProfile> {
  const objectId = getAuthObjectId();
  if (!objectId) {
    throw new Error("Not authenticated");
  }

  const { ok, body } = await requestJson<NormalUserProfile>(
    `/normalUsers/${encodeURIComponent(objectId)}`,
    {
      method: "PATCH",
      body: JSON.stringify({ normalUser }),
    },
  );

  if (!ok || !body.data) {
    throw new Error(body.message || "Failed to update profile");
  }

  const profile = {
    ...body.data,
    dateOfBirth: formatDateOfBirthForInput(body.data.dateOfBirth),
  };
  syncCacheFromProfile(profile);
  return profile;
}

export async function fetchMyNormalUserProfile(): Promise<NormalUserProfile> {
  const objectId = getAuthObjectId();
  if (!objectId) {
    throw new Error("Not authenticated");
  }

  const { ok, body } = await requestJson<NormalUserProfile>(
    `/normalUsers/${encodeURIComponent(objectId)}`,
    { method: "GET" },
  );

  if (!ok || !body.data) {
    throw new Error(body.message || "Failed to load profile");
  }

  const profile = {
    ...body.data,
    dateOfBirth: formatDateOfBirthForInput(body.data.dateOfBirth),
  };
  syncCacheFromProfile(profile);
  return profile;
}

export async function updateMyLegalName(name: string): Promise<NormalUserProfile> {
  const trimmed = name.trim();
  const profile = await patchMyProfile({ name: trimmed });
  return { ...profile, name: profile.name ?? trimmed };
}

export async function updateMyDateOfBirth(dateOfBirth: string): Promise<NormalUserProfile> {
  const trimmed = dateOfBirth.trim();
  const profile = await patchMyProfile({ dateOfBirth: trimmed });
  const formatted = formatDateOfBirthForInput(profile.dateOfBirth ?? trimmed);
  return { ...profile, dateOfBirth: formatted };
}

export async function updateMyEmail(email: string): Promise<NormalUserProfile> {
  const trimmed = email.trim().toLowerCase();
  const profile = await patchMyProfile({ email: trimmed });
  return { ...profile, email: profile.email ?? trimmed };
}
