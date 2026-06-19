"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { useToast } from "@/components/ToastProvider";
import {
  getSuggestionMessages,
  MAX_SUGGESTION_MESSAGE_LENGTH,
  SUGGESTION_CATEGORY_ORDER,
  type SuggestionCategory,
} from "@/lib/i18n/suggestion-messages";
import { memberCenterHref } from "@/lib/member-routes";
import { fetchSuggestionCaptcha, submitSuggestion } from "@/lib/suggestions-api";
import { HeaderBackIcon } from "@/components/member/center/MemberCenterIcons";

function UploadIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
      <rect x="6" y="10" width="28" height="20" rx="3" stroke="#9ca3af" strokeWidth="1.5" />
      <circle cx="14" cy="17" r="2.5" fill="#9ca3af" />
      <path d="M6 26l8-7 6 5 5-4 9 8" stroke="#9ca3af" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M20 4v10M16 8l4-4 4 4" stroke="#6b7280" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M4.5 7l4.5 4.5L13.5 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SuggestionPageContent() {
  const { preferences } = useLocale();
  const locale = preferences.locale;
  const labels = getSuggestionMessages(locale);
  const { showToast } = useToast();

  const [category, setCategory] = useState<SuggestionCategory | null>(null);
  const [message, setMessage] = useState("");
  const [captchaCode, setCaptchaCode] = useState("");
  const [captchaId, setCaptchaId] = useState("");
  const [captchaImage, setCaptchaImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingCaptcha, setLoadingCaptcha] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadCaptcha = useCallback(async () => {
    setLoadingCaptcha(true);
    try {
      const data = await fetchSuggestionCaptcha();
      setCaptchaId(data.captchaId);
      setCaptchaImage(data.image);
      setCaptchaCode("");
    } catch (err) {
      showToast(err instanceof Error ? err.message : labels.captchaError, { variant: "error" });
    } finally {
      setLoadingCaptcha(false);
    }
  }, [labels.captchaError, showToast]);

  useEffect(() => {
    void loadCaptcha();
  }, [loadCaptcha]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const canSubmit = useMemo(
    () =>
      Boolean(category) &&
      message.trim().length > 0 &&
      captchaCode.trim().length > 0 &&
      !submitting &&
      !loadingCaptcha,
    [category, message, captchaCode, submitting, loadingCaptcha],
  );

  const onPickImage = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast(labels.invalidImage, { variant: "error" });
      return;
    }
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const onRemoveImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async () => {
    if (!canSubmit || !category) {
      showToast(labels.requiredFields, { variant: "default" });
      return;
    }

    setSubmitting(true);
    try {
      await submitSuggestion({
        category,
        message,
        captchaId,
        captchaCode,
        image: imageFile,
      });
      showToast(labels.submitSuccess, { variant: "success" });
      setCategory(null);
      setMessage("");
      onRemoveImage();
      await loadCaptcha();
    } catch (err) {
      showToast(err instanceof Error ? err.message : labels.submitError, { variant: "error" });
      await loadCaptcha();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-full bg-[#f2f3f5]">
      <header className="sticky top-0 z-30 bg-[#1a1a1a]">
        <div className="relative mx-auto flex min-h-[52px] w-full max-w-lg items-center justify-center px-3">
          <Link
            href={memberCenterHref(locale)}
            aria-label={labels.back}
            className="focus-ring absolute left-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-white transition-colors hover:bg-white/10"
          >
            <HeaderBackIcon />
          </Link>
          <h1 className="text-[17px] font-semibold text-white">{labels.pageTitle}</h1>
        </div>
      </header>

      <div className="mx-auto w-full max-w-lg px-3 pb-28 pt-4">
        {/* Category */}
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="focus-ring mb-4 flex w-full items-stretch overflow-hidden rounded-lg bg-[#e8eaed] text-left"
        >
          <span
            className={`min-h-[48px] flex-1 px-3 py-3 text-[14px] ${
              category ? "font-medium text-[#1f2937]" : "text-[#9ca3af]"
            }`}
          >
            {category ? labels.categories[category] : labels.categoryPlaceholder}
          </span>
          <span className="flex w-12 shrink-0 items-center justify-center bg-[#3b82f6] text-white">
            <ChevronDownIcon />
          </span>
        </button>

        {/* Message */}
        <div className="mb-4 rounded-lg bg-[#e8eaed] px-3 py-3">
          <label className="mb-2 block text-[14px] font-medium text-[#374151]">
            {labels.messageLabel}
          </label>
          <textarea
            value={message}
            onChange={(e) =>
              setMessage(e.target.value.slice(0, MAX_SUGGESTION_MESSAGE_LENGTH))
            }
            placeholder={labels.messagePlaceholder}
            rows={6}
            className="w-full resize-none bg-transparent text-[14px] text-[#1f2937] placeholder:text-[#9ca3af] focus:outline-none"
          />
          <div className="mt-1 text-right text-[13px] text-[#9ca3af]">
            {labels.charCount(message.length, MAX_SUGGESTION_MESSAGE_LENGTH)}
          </div>
        </div>

        {/* Image upload */}
        <div className="mb-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="sr-only"
            onChange={(e) => onPickImage(e.target.files?.[0])}
          />
          {imagePreview ? (
            <div className="relative inline-block rounded-lg border border-dashed border-[#d1d5db] bg-[#eef0f2] p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt=""
                className="max-h-40 max-w-full rounded object-contain"
              />
              <button
                type="button"
                onClick={onRemoveImage}
                aria-label="Remove image"
                className="focus-ring absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#6b7280] text-[12px] font-bold text-white"
              >
                ×
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="focus-ring flex min-h-[120px] w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#d1d5db] bg-[#eef0f2] text-[#6b7280]"
            >
              <UploadIcon />
              <span className="text-[14px]">{labels.uploadLabel}</span>
            </button>
          )}
        </div>

        {/* Captcha */}
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            inputMode="numeric"
            value={captchaCode}
            onChange={(e) => setCaptchaCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder={labels.captchaPlaceholder}
            className="min-h-[48px] flex-1 rounded-lg bg-[#e8eaed] px-3 text-[14px] text-[#1f2937] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/40"
          />
          <button
            type="button"
            onClick={() => void loadCaptcha()}
            disabled={loadingCaptcha}
            className="focus-ring shrink-0 overflow-hidden rounded-lg border border-[#d1d5db] bg-white disabled:opacity-60"
            aria-label="Refresh verification code"
          >
            {captchaImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={captchaImage} alt="" className="h-12 w-[130px] object-cover" />
            ) : (
              <span className="flex h-12 w-[130px] items-center justify-center text-[12px] text-[#9ca3af]">
                …
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Submit */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-[#e5e7eb] bg-[#f2f3f5]/95 px-3 py-3 backdrop-blur-sm pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <div className="mx-auto w-full max-w-lg">
          <button
            type="button"
            onClick={() => void onSubmit()}
            disabled={!canSubmit}
            className={`focus-ring min-h-[48px] w-full rounded-full text-[16px] font-semibold text-white transition-colors ${
              canSubmit
                ? "bg-[#178358] hover:bg-[#1a9664] active:scale-[0.99]"
                : "cursor-not-allowed bg-[#b8bcc4]"
            }`}
          >
            {submitting ? "…" : labels.submit}
          </button>
        </div>
      </div>

      {/* Category bottom sheet */}
      {sheetOpen ? (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-black/40"
            onClick={() => setSheetOpen(false)}
          />
          <div className="relative mx-auto w-full max-w-lg rounded-t-2xl bg-white pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <p className="border-b border-[#e5e7eb] px-4 py-4 text-center text-[15px] font-medium text-[#374151]">
              {labels.categorySheetTitle}
            </p>
            <ul>
              {SUGGESTION_CATEGORY_ORDER.map((item) => (
                <li key={item} className="border-b border-[#f3f4f6] last:border-b-0">
                  <button
                    type="button"
                    onClick={() => {
                      setCategory(item);
                      setSheetOpen(false);
                    }}
                    className="focus-ring w-full px-4 py-4 text-left text-[15px] text-[#1f2937] hover:bg-[#f9fafb]"
                  >
                    {labels.categories[item]}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
