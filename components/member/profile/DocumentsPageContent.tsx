"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { authInputClass } from "@/components/auth/AuthField";
import {
  DOCUMENT_TYPE_IDS,
  DOCUMENT_UPLOAD_SLOTS,
  type DocumentTypeId,
  type DocumentUploadSlot,
} from "@/lib/documents-data";
import { validateDocumentFile } from "@/lib/documents-upload";
import { getDocumentsMessages } from "@/lib/i18n/documents-messages";
import { fetchMyKycStatus, submitKycDocuments } from "@/lib/kyc-api";
import { memberSectionHref } from "@/lib/member-routes";
import {
  memberBtnPrimary,
  memberContainerNarrow,
  MEMBER_PAGE_BG,
  memberPagePaddingFormSticky,
  MemberFieldLabel,
  MemberPageHeader,
  MemberStickyFooter,
} from "@/components/member/shared/member-ui";
import { useLocale } from "@/components/LocaleProvider";

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="8"
      viewBox="0 0 14 8"
      fill="none"
      aria-hidden
      className={`shrink-0 text-[#9ca3af] transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M1 1.5l6 5 6-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden className="text-[#9ca3af]">
      <rect x="2.5" y="4" width="13" height="11.5" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2.5 7h13M6 2.5v3M12 2.5v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden className="shrink-0 text-[#9ca3af]">
      <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M9 8v4M9 5.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

type UploadState = {
  file: File | null;
  fileName: string;
};

const EMPTY_UPLOADS: Record<DocumentUploadSlot, UploadState> = {
  front: { file: null, fileName: "" },
  back: { file: null, fileName: "" },
  selfie: { file: null, fileName: "" },
};

const EXPIRY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export default function DocumentsPageContent() {
  const { preferences } = useLocale();
  const locale = preferences.locale;
  const d = getDocumentsMessages(locale);
  const router = useRouter();

  const [docType, setDocType] = useState<DocumentTypeId | "">("");
  const [docNo, setDocNo] = useState("");
  const [expiry, setExpiry] = useState("");
  const [uploads, setUploads] = useState(EMPTY_UPLOADS);
  const [reminderOpen, setReminderOpen] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [slotError, setSlotError] = useState<Partial<Record<DocumentUploadSlot, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [kycStatus, setKycStatus] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  const fileRefs = useRef<Record<DocumentUploadSlot, HTMLInputElement | null>>({
    front: null,
    back: null,
    selfie: null,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const status = await fetchMyKycStatus();
        if (cancelled) return;
        setKycStatus(status.kycStatus);
        if (status.documentType) {
          setDocType(status.documentType as DocumentTypeId);
        }
        if (status.documentNo) {
          setDocNo(status.documentNo);
        }
        if (status.documentExpiry) {
          setExpiry(status.documentExpiry);
        }
      } catch {
        /* first visit or not logged in — form stays empty */
      } finally {
        if (!cancelled) setLoadingStatus(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const submissionLocked = kycStatus === "pending" || kycStatus === "approved";

  const handleFile = useCallback(
    (slot: DocumentUploadSlot, file: File | null) => {
      if (!file) return;
      const err = validateDocumentFile(file);
      if (err === "type") {
        setSlotError((s) => ({ ...s, [slot]: d.errors.fileType }));
        return;
      }
      if (err === "size") {
        setSlotError((s) => ({ ...s, [slot]: d.errors.fileSize }));
        return;
      }
      setSlotError((s) => {
        const next = { ...s };
        delete next[slot];
        return next;
      });
      setUploads((prev) => ({
        ...prev,
        [slot]: { file, fileName: file.name },
      }));
    },
    [d.errors.fileSize, d.errors.fileType],
  );

  const canSubmit =
    docType !== "" &&
    docNo.trim().length > 0 &&
    EXPIRY_PATTERN.test(expiry) &&
    DOCUMENT_UPLOAD_SLOTS.every((slot) => uploads[slot].file !== null) &&
    Object.keys(slotError).length === 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (kycStatus === "pending") {
      setFormError(d.errors.pendingReview);
      return;
    }
    if (kycStatus === "approved") {
      setFormError(d.errors.alreadyApproved);
      return;
    }

    if (docType === "") {
      setFormError(d.errors.required);
      return;
    }

    if (!EXPIRY_PATTERN.test(expiry)) {
      setFormError(d.errors.expiryFormat);
      return;
    }
    if (!canSubmit) {
      setFormError(d.errors.required);
      return;
    }

    const front = uploads.front.file!;
    const back = uploads.back.file!;
    const selfie = uploads.selfie.file!;

    setSubmitting(true);
    void submitKycDocuments({
      documentType: docType,
      documentNo: docNo.trim(),
      documentExpiry: expiry,
      files: { front, back, selfie },
    })
      .then(() => {
        setSubmitted(true);
        setKycStatus("pending");
        window.setTimeout(() => {
          router.push(memberSectionHref(locale, "verification"));
        }, 700);
      })
      .catch((err) => {
        setFormError(err instanceof Error ? err.message : d.errors.submitFailed);
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  return (
    <div className={MEMBER_PAGE_BG}>
      <MemberPageHeader
        title={d.pageTitle}
        backHref={memberSectionHref(locale, "verification")}
        backLabel={d.back}
      />

      <form onSubmit={handleSubmit} className={`${memberContainerNarrow} ${memberPagePaddingFormSticky}`}>
        {loadingStatus ? (
          <p className="py-8 text-center text-[14px] text-[#9ca3af]">{d.submitting}</p>
        ) : null}

        {!loadingStatus && kycStatus === "pending" ? (
          <p className="mb-4 rounded-md border border-[#3a3a3a] bg-[#1a1a1a] px-3 py-2 text-[13px] text-[#f5c518]">
            {d.errors.pendingReview}
          </p>
        ) : null}

        {!loadingStatus && kycStatus === "approved" ? (
          <p className="mb-4 rounded-md border border-[#1f4d38] bg-[#0d3d2b]/50 px-3 py-2 text-[13px] text-[#4ade80]">
            {d.errors.alreadyApproved}
          </p>
        ) : null}

        <div className={`space-y-5 ${loadingStatus || submissionLocked ? "pointer-events-none opacity-60" : ""}`}>
          <label className="block">
            <MemberFieldLabel>{d.documentTypeLabel}</MemberFieldLabel>
            <div className="relative">
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as DocumentTypeId | "")}
                className={`${authInputClass()} appearance-none pr-10`}
              >
                <option value="" disabled>
                  {d.documentTypePlaceholder}
                </option>
                {DOCUMENT_TYPE_IDS.map((id) => (
                  <option key={id} value={id}>
                    {d.documentTypes[id]}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#9ca3af]">
                <ChevronDown open={false} />
              </span>
            </div>
          </label>

          <label className="block">
            <MemberFieldLabel>{d.documentNoLabel}</MemberFieldLabel>
            <input
              type="text"
              value={docNo}
              onChange={(e) => setDocNo(e.target.value)}
              placeholder={d.documentNoPlaceholder}
              className={authInputClass()}
            />
          </label>

          <label className="block">
            <MemberFieldLabel>{d.expiryDateLabel}</MemberFieldLabel>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder={d.expiryDatePlaceholder}
                className={`${authInputClass()} pr-11`}
                pattern="\d{4}-\d{2}-\d{2}"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center"
                onClick={() => {
                  const el = document.getElementById("expiry-date-picker") as HTMLInputElement | null;
                  el?.showPicker?.();
                  el?.click();
                }}
                aria-label={d.expiryDateLabel}
              >
                <CalendarIcon />
              </button>
              <input
                id="expiry-date-picker"
                type="date"
                className="pointer-events-none absolute h-0 w-0 opacity-0"
                tabIndex={-1}
                onChange={(e) => {
                  if (e.target.value) setExpiry(e.target.value);
                }}
              />
            </div>
          </label>

          {DOCUMENT_UPLOAD_SLOTS.map((slot) => (
            <div key={slot}>
              <MemberFieldLabel>{d.uploadLabels[slot]}</MemberFieldLabel>
              <div className="rounded-lg bg-[#1e1e1e] px-3 py-5 text-center sm:px-4">
                <input
                  ref={(el) => {
                    fileRefs.current[slot] = el;
                  }}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,.jpg,.jpeg,.png"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    handleFile(slot, file);
                    e.target.value = "";
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileRefs.current[slot]?.click()}
                  className="focus-ring rounded-md bg-[#178358] px-8 py-2 text-[14px] font-medium text-white transition-colors hover:bg-[#1a9664]"
                >
                  {uploads[slot].file ? d.uploadReplace : d.uploadButton}
                </button>
                {uploads[slot].fileName ? (
                  <p className="mt-2 truncate text-[12px] text-[#d4d4d4]">{uploads[slot].fileName}</p>
                ) : null}
                <p className="mt-2 text-[12px] text-[#6b7280]">{d.uploadHint}</p>
                {slotError[slot] ? (
                  <p className="mt-2 text-[12px] text-[#e85d4a]" role="alert">
                    {slotError[slot]}
                  </p>
                ) : null}
              </div>
            </div>
          ))}

          <div className="rounded-lg border border-dashed border-[#3a3a3a] bg-[#1a1a1a]">
            <button
              type="button"
              onClick={() => setReminderOpen((o) => !o)}
              className="focus-ring flex w-full items-center gap-2 border-b border-[#2a2a2a] px-4 py-3 text-left"
              aria-expanded={reminderOpen}
            >
              <InfoIcon />
              <span className="flex-1 text-[14px] font-medium text-white">{d.reminderTitle}</span>
              <ChevronDown open={reminderOpen} />
            </button>
            {reminderOpen ? (
              <ol className="list-decimal space-y-2 px-4 py-3 pl-8 text-[12px] leading-relaxed text-[#9ca3af] sm:text-[13px]">
                {d.reminderItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ol>
            ) : null}
          </div>

          <p className="text-[12px] leading-relaxed text-[#9ca3af] sm:text-[13px]">
            {d.privacyText}
            <Link href={`/${locale}/support`} className="text-[#178358] underline hover:text-[#1a9664]">
              {d.contactCs}
            </Link>
          </p>

          {formError ? (
            <p className="text-[13px] text-[#e85d4a]" role="alert">
              {formError}
            </p>
          ) : null}
        </div>

        <MemberStickyFooter>
          <button
            type="submit"
            disabled={!canSubmit || submitted || submitting || submissionLocked || loadingStatus}
            className={memberBtnPrimary}
          >
            {submitted ? d.submitted : submitting ? d.submitting : d.submit}
          </button>
        </MemberStickyFooter>
      </form>
    </div>
  );
}
