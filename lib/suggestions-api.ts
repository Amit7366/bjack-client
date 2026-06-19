import type { ApiResponse } from "@/lib/api/types";
import { authFetchJson } from "@/lib/auth/auth-fetch";
import type { SuggestionCategory } from "@/lib/i18n/suggestion-messages";

export type SuggestionCaptcha = {
  captchaId: string;
  image: string;
};

export type MemberSuggestion = {
  id: string;
  userId: string;
  memberId: string | null;
  userName: string | null;
  contactNo: string | null;
  category: SuggestionCategory;
  message: string;
  imageUrl: string | null;
  status: "pending" | "reviewed";
  reviewedAt: string | null;
  adminNote: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

async function requestJson<T>(
  path: string,
  init?: RequestInit,
): Promise<{ ok: boolean; body: ApiResponse<T> }> {
  const { ok, body } = await authFetchJson<T>(path, init);
  return { ok, body };
}

export async function fetchSuggestionCaptcha(): Promise<SuggestionCaptcha> {
  const { ok, body } = await requestJson<SuggestionCaptcha>("/suggestions/captcha", {
    method: "GET",
  });
  if (!ok || !body.data) {
    throw new Error(body.message || "Failed to load verification code");
  }
  return body.data;
}

export async function submitSuggestion(input: {
  category: SuggestionCategory;
  message: string;
  captchaId: string;
  captchaCode: string;
  image?: File | null;
}): Promise<{ message: string }> {
  const formData = new FormData();
  formData.append("category", input.category);
  formData.append("message", input.message.trim());
  formData.append("captchaId", input.captchaId);
  formData.append("captchaCode", input.captchaCode.trim());
  if (input.image) {
    formData.append("image", input.image);
  }

  const { ok, body } = await requestJson<MemberSuggestion>("/suggestions", {
    method: "POST",
    body: formData,
  });

  if (!ok) {
    throw new Error(body.message || "Failed to submit suggestion");
  }

  return { message: body.message ?? "Suggestion submitted successfully" };
}

export async function fetchSuggestions(params?: {
  status?: "pending" | "reviewed";
  category?: SuggestionCategory;
  page?: number;
  limit?: number;
}): Promise<{ items: MemberSuggestion[]; meta: Record<string, unknown> }> {
  const search = new URLSearchParams();
  if (params?.status) search.set("status", params.status);
  if (params?.category) search.set("category", params.category);
  if (params?.page) search.set("page", String(params.page));
  if (params?.limit) search.set("limit", String(params.limit));

  const qs = search.toString();
  const { ok, body } = await requestJson<MemberSuggestion[]>(
    `/suggestions/manage${qs ? `?${qs}` : ""}`,
    { method: "GET" },
  );

  if (!ok || !body.data) {
    throw new Error(body.message || "Failed to load suggestions");
  }

  return { items: body.data, meta: body.meta ?? {} };
}

export async function markSuggestionReviewed(
  suggestionId: string,
  adminNote?: string,
): Promise<{ message: string }> {
  const { ok, body } = await requestJson<MemberSuggestion>(
    `/suggestions/manage/${encodeURIComponent(suggestionId)}/status`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "reviewed",
        ...(adminNote ? { adminNote } : {}),
      }),
    },
  );

  if (!ok) {
    throw new Error(body.message || "Failed to update suggestion");
  }

  return { message: body.message ?? "Suggestion marked as reviewed" };
}
