import type { ApiResponse } from "@/lib/api/types";
import { isJwtExpired } from "./jwt";
import { handleSessionExpired, handleUnauthorizedResponse } from "./session-expired";
import { readAuthSession } from "./session";

export const API_PREFIX = "/api/v1";

export class SessionExpiredError extends Error {
  constructor(message = "Session expired") {
    super(message);
    this.name = "SessionExpiredError";
  }
}

function emptyApiResponse<T>(res: Response, message?: string): ApiResponse<T> {
  return {
    success: false,
    statusCode: res.status,
    message: message ?? (res.statusText || `Request failed (${res.status})`),
    data: undefined as T,
  };
}

async function parseApiResponse<T>(res: Response): Promise<ApiResponse<T>> {
  const text = await res.text();
  if (!text.trim()) {
    return emptyApiResponse<T>(res);
  }

  try {
    return JSON.parse(text) as ApiResponse<T>;
  } catch {
    return emptyApiResponse<T>(res, "Invalid server response");
  }
}

function assertAuthenticatedSession() {
  const session = readAuthSession();
  if (!session?.accessToken) {
    throw new Error("Please log in to continue");
  }
  if (isJwtExpired(session.accessToken)) {
    handleSessionExpired();
    throw new SessionExpiredError();
  }
  return session;
}

function buildAuthHeaders(session: ReturnType<typeof readAuthSession>, init?: RequestInit) {
  const headers = new Headers(init?.headers);
  if (session?.accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${session.accessToken}`);
  }
  const isFormData = typeof FormData !== "undefined" && init?.body instanceof FormData;
  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return headers;
}

export async function authFetch(path: string, init?: RequestInit): Promise<Response> {
  const session = assertAuthenticatedSession();

  const res = await fetch(`${API_PREFIX}${path}`, {
    ...init,
    credentials: "include",
    cache: "no-store",
    headers: buildAuthHeaders(session, init),
  });

  handleUnauthorizedResponse(res);
  return res;
}

export async function authFetchJson<T>(
  path: string,
  init?: RequestInit,
): Promise<{ ok: boolean; status: number; body: ApiResponse<T> }> {
  const session = readAuthSession();
  const hadAuthToken = Boolean(session?.accessToken);

  if (hadAuthToken && session?.accessToken && isJwtExpired(session.accessToken)) {
    handleSessionExpired();
    throw new SessionExpiredError();
  }

  const res = await fetch(`${API_PREFIX}${path}`, {
    ...init,
    credentials: "include",
    cache: "no-store",
    headers: buildAuthHeaders(session, init),
  });

  if (handleUnauthorizedResponse(res, hadAuthToken)) {
    throw new SessionExpiredError();
  }

  const body = await parseApiResponse<T>(res);
  return { ok: res.ok && body.success, status: res.status, body };
}

export async function authFetchData<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await authFetch(path, init);
  const body = await parseApiResponse<T>(res);
  if (!res.ok || !body.success) {
    throw new Error(body.message || "Request failed");
  }
  return body.data as T;
}
