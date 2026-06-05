import type { ApiResponse } from "@/lib/api/types";
import type { DocumentTypeId } from "@/lib/documents-data";
import { readAuthSession } from "@/lib/auth/session";

const API_PREFIX = "/api/v1";

export type KycStatus = "pending" | "approved" | "rejected" | null;

export type MyKycStatus = {
  kycStatus: KycStatus;
  kycVerified: boolean;
  documentType: string | null;
  documentNo: string | null;
  documentExpiry: string | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
};

export type AdminKycSubmission = {
  userId: string;
  memberId: string | null;
  userName: string | null;
  contactNo: string | null;
  email?: string | null;
  kycStatus: Exclude<KycStatus, null>;
  kycVerified: boolean;
  documentType: string | null;
  documentNo: string | null;
  documentExpiry: string | null;
  documentUrls?: {
    front: string | null;
    back: string | null;
    selfie: string | null;
  };
  submittedAt: string | null;
  reviewedAt: string | null;
  reviewNote?: string | null;
};

async function requestJson<T>(
  path: string,
  init?: RequestInit,
): Promise<{ ok: boolean; body: ApiResponse<T> }> {
  const session = readAuthSession();
  const res = await fetch(`${API_PREFIX}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(session?.accessToken
        ? { Authorization: `Bearer ${session.accessToken}` }
        : {}),
      ...(init?.headers ?? {}),
    },
  });

  const body = (await res.json()) as ApiResponse<T>;
  return { ok: res.ok && body.success, body };
}

export async function submitKycDocuments(input: {
  documentType: DocumentTypeId;
  documentNo: string;
  documentExpiry: string;
  files: {
    front: File;
    back: File;
    selfie: File;
  };
}): Promise<{ message: string }> {
  const formData = new FormData();
  formData.append("documentType", input.documentType);
  formData.append("documentNo", input.documentNo.trim());
  formData.append("documentExpiry", input.documentExpiry);
  formData.append("front", input.files.front);
  formData.append("back", input.files.back);
  formData.append("selfie", input.files.selfie);

  const { ok, body } = await requestJson<{ kycStatus: string }>("/kyc/submit", {
    method: "POST",
    body: formData,
  });

  if (!ok) {
    throw new Error(body.message || "Failed to submit documents");
  }

  return { message: body.message ?? "Documents submitted successfully" };
}

export async function fetchMyKycStatus(): Promise<MyKycStatus> {
  const { ok, body } = await requestJson<MyKycStatus>("/kyc/me", { method: "GET" });
  if (!ok || !body.data) {
    throw new Error(body.message || "Failed to load KYC status");
  }
  return body.data;
}

export async function fetchKycSubmissions(params?: {
  status?: Exclude<KycStatus, null>;
  page?: number;
  limit?: number;
}): Promise<{ items: AdminKycSubmission[]; meta: Record<string, unknown> }> {
  const search = new URLSearchParams();
  if (params?.status) search.set("status", params.status);
  if (params?.page) search.set("page", String(params.page));
  if (params?.limit) search.set("limit", String(params.limit));

  const qs = search.toString();
  const { ok, body } = await requestJson<AdminKycSubmission[]>(
    `/kyc/submissions${qs ? `?${qs}` : ""}`,
    { method: "GET" },
  );

  if (!ok || !body.data) {
    throw new Error(body.message || "Failed to load KYC submissions");
  }

  return { items: body.data, meta: body.meta ?? {} };
}

export async function fetchKycSubmission(userId: string): Promise<AdminKycSubmission> {
  const { ok, body } = await requestJson<AdminKycSubmission>(
    `/kyc/submissions/${encodeURIComponent(userId)}`,
    { method: "GET" },
  );

  if (!ok || !body.data) {
    throw new Error(body.message || "Failed to load KYC submission");
  }

  return body.data;
}

export async function updateKycSubmissionStatus(
  userId: string,
  status: "approved" | "rejected",
  note?: string,
): Promise<{ message: string }> {
  const { ok, body } = await requestJson<{ kycStatus: string }>(
    `/kyc/submissions/${encodeURIComponent(userId)}/status`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, ...(note ? { note } : {}) }),
    },
  );

  if (!ok) {
    throw new Error(body.message || "Failed to update KYC status");
  }

  return { message: body.message ?? "KYC status updated" };
}
