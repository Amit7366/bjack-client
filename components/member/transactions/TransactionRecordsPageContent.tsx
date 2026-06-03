"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  memberBtnPrimary,
  memberContainerXl,
  MEMBER_PAGE_BG,
  memberPagePadding,
  memberRecordCardClass,
  MemberEmptyState,
  MemberFilterToolbar,
  MemberPageHeader,
} from "@/components/member/shared/member-ui";
import { getProfileMessages } from "@/lib/i18n/profile-messages";
import { getTransactionMessages } from "@/lib/i18n/transaction-messages";
import {
  formatAmount,
  formatLocalDateOnly,
  formatTransactionDateOnly,
  formatTransactionDateTime,
  getGatewayTypeLabel,
  getPaymentTypeDetailLabel,
  TRANSACTION_DATE_FILTER_IDS,
  TRANSACTION_PAYMENT_TYPE_IDS,
  TRANSACTION_STATUS_IDS,
  type TransactionDateFilter,
  type TransactionPaymentType,
  type TransactionRecord,
  type TransactionStatus,
} from "@/lib/transactions-data";
import {
  fetchUserTransactions,
  getDateRangeForFilter,
  uiStatusesToApiParam,
  uiTypesToApiParam,
} from "@/lib/transaction-records-api";
import { mapApiTransactionToRecord } from "@/lib/transaction-records-mapper";
import { useLocale } from "@/components/LocaleProvider";

type AppliedFilters = {
  statuses: Set<TransactionStatus>;
  paymentTypes: Set<TransactionPaymentType>;
  date: TransactionDateFilter;
};

const DEFAULT_FILTERS: AppliedFilters = {
  statuses: new Set(),
  paymentTypes: new Set(),
  date: "last7days",
};

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className="text-white">
      <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function AccordionChevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={`shrink-0 text-white transition-transform duration-200 ${open ? "" : "rotate-180"}`}
    >
      <path d="M3.5 9L7 5.5l3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StatusIcon({ status }: { status: TransactionStatus }) {
  if (status === "rejected") {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
        <path d="M4.5 4.5l5 5M9.5 4.5l-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }
  if (status === "approved") {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (status === "processing") {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M7 4v3l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M4 7h6M7 4v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function statusBadgeClass(status: TransactionStatus): string {
  switch (status) {
    case "rejected":
      return "bg-[#5c1a1a] text-[#f5a8a8] border-[#7a2a2a]";
    case "approved":
      return "bg-[#0f3d2a] text-[#86efac] border-[#178358]/40";
    case "processing":
      return "bg-[#3d3208] text-[#fde047] border-[#5c4a10]";
    case "reverted":
      return "bg-[#2a2a2a] text-[#d4d4d4] border-[#444]";
    default:
      return "bg-[#2a2a2a] text-[#d4d4d4] border-[#444]";
  }
}

function amountClass(amount: number): string {
  if (amount > 0) return "text-[#4ade80]";
  if (amount < 0) return "text-[#f87171]";
  return "text-white";
}

function PaymentMethodLogo({ method }: { method?: "bkash" | "nagad" | "rocket" }) {
  if (method === "bkash") {
    return (
      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#e2136e] text-[10px] font-bold text-white">
        b
      </span>
    );
  }
  if (method === "nagad") {
    return (
      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#f6921e] text-[10px] font-bold text-white">
        N
      </span>
    );
  }
  if (method === "rocket") {
    return (
      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#8b2f8f] text-[10px] font-bold text-white">
        R
      </span>
    );
  }
  return null;
}

function groupTransactions(
  records: TransactionRecord[],
  labels: ReturnType<typeof getTransactionMessages>,
  now = new Date(),
): { key: string; label: string; items: TransactionRecord[] }[] {
  const today = formatLocalDateOnly(now);
  const yesterdayDate = new Date(now);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = formatLocalDateOnly(yesterdayDate);

  const map = new Map<string, TransactionRecord[]>();
  for (const r of records) {
    const day = formatTransactionDateOnly(r.createdAt);
    const list = map.get(day) ?? [];
    list.push(r);
    map.set(day, list);
  }

  const sortedDays = [...map.keys()].sort((a, b) => b.localeCompare(a));

  return sortedDays.map((day) => {
    let label = labels.dateGroupOn(day);
    if (day === today) label = labels.dateGroupToday(day);
    else if (day === yesterday) label = labels.dateGroupYesterday(day);
    const items = (map.get(day) ?? []).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return { key: day, label, items };
  });
}

type FilterPanelProps = {
  labels: ReturnType<typeof getTransactionMessages>;
  draft: AppliedFilters;
  statusOpen: boolean;
  paymentOpen: boolean;
  dateOpen: boolean;
  onToggleStatus: () => void;
  onTogglePayment: () => void;
  onToggleDate: () => void;
  onDraftChange: (next: AppliedFilters) => void;
  onClear: () => void;
  onApply: () => void;
  onClose?: () => void;
  showClose?: boolean;
};

function TransactionFilterPanel({
  labels,
  draft,
  statusOpen,
  paymentOpen,
  dateOpen,
  onToggleStatus,
  onTogglePayment,
  onToggleDate,
  onDraftChange,
  onClear,
  onApply,
  onClose,
  showClose,
}: FilterPanelProps) {
  const toggleStatus = (id: TransactionStatus) => {
    const n = new Set(draft.statuses);
    if (n.has(id)) n.delete(id);
    else n.add(id);
    onDraftChange({ ...draft, statuses: n });
  };

  const togglePayment = (id: TransactionPaymentType) => {
    const n = new Set(draft.paymentTypes);
    if (n.has(id)) n.delete(id);
    else n.add(id);
    onDraftChange({ ...draft, paymentTypes: n });
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#121212]">
      <header className="flex shrink-0 items-center justify-between border-b border-[#2a2a2a] px-4 py-3">
        <h2 id="tx-filter-title" className="text-lg font-bold text-white">
          {labels.filterTitle}
        </h2>
        {showClose && onClose ? (
          <button
            type="button"
            className="focus-ring rounded-md p-2 hover:bg-white/10"
            aria-label={labels.filterClose}
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        ) : null}
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-4 [-webkit-overflow-scrolling:touch]">
        <div className="border-b border-[#2a2a2a]">
          <button
            type="button"
            className="flex w-full items-center justify-between px-2 py-3 text-left"
            onClick={onToggleStatus}
            aria-expanded={statusOpen}
          >
            <span className="text-[15px] font-semibold text-white">{labels.filterStatus}</span>
            <AccordionChevron open={statusOpen} />
          </button>
          {statusOpen ? (
            <ul className="pb-2 pl-1">
              {TRANSACTION_STATUS_IDS.map((id) => (
                <li key={id}>
                  <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-2 py-2.5 hover:bg-white/[0.04]">
                    <span className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded border border-[#404040] bg-[#1a1a1a]">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={draft.statuses.has(id)}
                        onChange={() => toggleStatus(id)}
                      />
                      <span className="pointer-events-none hidden text-[11px] font-bold text-emerald-500 peer-checked:block">
                        ✓
                      </span>
                    </span>
                    <span className="text-[14px] text-[#b3b3b3]">{labels.statusLabels[id]}</span>
                  </label>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="border-b border-[#2a2a2a]">
          <button
            type="button"
            className="flex w-full items-center justify-between px-2 py-3 text-left"
            onClick={onTogglePayment}
            aria-expanded={paymentOpen}
          >
            <span className="text-[15px] font-semibold text-white">{labels.filterPaymentType}</span>
            <AccordionChevron open={paymentOpen} />
          </button>
          {paymentOpen ? (
            <ul className="pb-2 pl-1">
              {TRANSACTION_PAYMENT_TYPE_IDS.map((id) => (
                <li key={id}>
                  <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-2 py-2.5 hover:bg-white/[0.04]">
                    <span className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded border border-[#404040] bg-[#1a1a1a]">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={draft.paymentTypes.has(id)}
                        onChange={() => togglePayment(id)}
                      />
                      <span className="pointer-events-none hidden text-[11px] font-bold text-emerald-500 peer-checked:block">
                        ✓
                      </span>
                    </span>
                    <span className="text-[14px] text-[#b3b3b3]">{labels.paymentTypeLabels[id]}</span>
                  </label>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="border-b border-[#2a2a2a]">
          <button
            type="button"
            className="flex w-full items-center justify-between px-2 py-3 text-left"
            onClick={onToggleDate}
            aria-expanded={dateOpen}
          >
            <span className="text-[15px] font-semibold text-white">{labels.filterDate}</span>
            <AccordionChevron open={dateOpen} />
          </button>
          {dateOpen ? (
            <ul className="pb-2 pl-1">
              {TRANSACTION_DATE_FILTER_IDS.map((id) => (
                <li key={id}>
                  <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-2 py-2.5 hover:bg-white/[0.04]">
                    <span className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#404040] bg-[#1a1a1a]">
                      <input
                        type="radio"
                        name="tx-date-filter"
                        className="peer sr-only"
                        checked={draft.date === id}
                        onChange={() => onDraftChange({ ...draft, date: id })}
                      />
                      <span className="pointer-events-none hidden h-2.5 w-2.5 rounded-full bg-[#178358] peer-checked:block" />
                    </span>
                    <span className="text-[14px] text-[#b3b3b3]">{labels.dateFilterLabels[id]}</span>
                  </label>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <footer className="safe-bottom flex shrink-0 gap-2 border-t border-[#2a2a2a] bg-[#121212] p-3">
        <button
          type="button"
          className="focus-ring min-h-11 flex-1 rounded-md border border-[#3f3f3f] py-3 text-[14px] font-semibold text-[#d4d4d4] transition-colors hover:bg-white/[0.06]"
          onClick={onClear}
        >
          {labels.filterClearAll}
        </button>
        <button
          type="button"
          className="focus-ring min-h-11 flex-[1.15] rounded-md bg-[#178358] py-3 text-[14px] font-bold text-white transition-colors hover:bg-[#1a9664]"
          onClick={onApply}
        >
          {labels.filterApply}
        </button>
      </footer>
    </div>
  );
}

function TransactionCard({
  record,
  labels,
  locale,
  onDetails,
}: {
  record: TransactionRecord;
  labels: ReturnType<typeof getTransactionMessages>;
  locale: "en" | "bn" | "hi";
  onDetails: () => void;
}) {
  return (
    <article className={memberRecordCardClass}>
      <div className="flex items-start justify-between gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[12px] font-medium ${statusBadgeClass(record.status)}`}
        >
          <StatusIcon status={record.status} />
          {labels.statusLabels[record.status]}
        </span>
        <button
          type="button"
          onClick={onDetails}
          className="focus-ring shrink-0 rounded-md border border-[#555] px-3 py-1.5 text-[13px] font-medium text-white transition-colors hover:border-[#777] hover:bg-white/5"
        >
          {labels.details}
        </button>
      </div>

      <p className="mt-2 text-center text-[12px] text-[#9ca3af]">{record.referenceId}</p>

      <h3 className="mt-2 text-[17px] font-bold text-white">
        {labels.paymentTypeLabels[record.paymentType]}
      </h3>

      <p className="mt-1 text-[14px] text-[#d4d4d4]">{record.method}</p>

      <div className="mt-4 flex items-end justify-between gap-4">
        <p className="text-[12px] text-[#9ca3af]">{formatTransactionDateTime(record.createdAt)}</p>
        <p className={`text-[16px] font-bold tabular-nums ${amountClass(record.amount)}`}>
          {formatAmount(record.amount, locale)}
        </p>
      </div>
    </article>
  );
}

export default function TransactionRecordsPageContent() {
  const { preferences } = useLocale();
  const locale = preferences.locale;
  const labels = getTransactionMessages(locale);
  const profile = getProfileMessages(locale);
  const base = `/${locale}`;

  const [applied, setApplied] = useState<AppliedFilters>(() => ({
    statuses: new Set(DEFAULT_FILTERS.statuses),
    paymentTypes: new Set(DEFAULT_FILTERS.paymentTypes),
    date: DEFAULT_FILTERS.date,
  }));
  const [draft, setDraft] = useState<AppliedFilters>(() => ({
    statuses: new Set(DEFAULT_FILTERS.statuses),
    paymentTypes: new Set(DEFAULT_FILTERS.paymentTypes),
    date: DEFAULT_FILTERS.date,
  }));

  const [filterOpen, setFilterOpen] = useState(false);
  const [filterPortalReady, setFilterPortalReady] = useState(false);
  const [statusOpen, setStatusOpen] = useState(true);
  const [paymentOpen, setPaymentOpen] = useState(true);
  const [dateOpen, setDateOpen] = useState(true);
  const [detailsRecord, setDetailsRecord] = useState<TransactionRecord | null>(null);
  const [records, setRecords] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    setFilterPortalReady(true);
  }, []);

  useEffect(() => {
    if (!filterOpen) return;
    setDraft({
      statuses: new Set(applied.statuses),
      paymentTypes: new Set(applied.paymentTypes),
      date: applied.date,
    });
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [filterOpen, applied]);

  useEffect(() => {
    if (!detailsRecord) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setDetailsRecord(null);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [detailsRecord]);

  const loadRecords = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const { from, to } = getDateRangeForFilter(applied.date);
      const data = await fetchUserTransactions({
        from,
        to,
        status: uiStatusesToApiParam(applied.statuses),
        transactionType: uiTypesToApiParam(applied.paymentTypes),
      });
      setRecords(data.map((tx) => mapApiTransactionToRecord(tx, locale)));
    } catch {
      setLoadError(labels.loadError);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [applied, locale, labels.loadError]);

  useEffect(() => {
    void loadRecords();
  }, [loadRecords]);

  const groups = useMemo(() => groupTransactions(records, labels), [records, labels]);

  const openFilter = useCallback(() => {
    setDraft({
      statuses: new Set(applied.statuses),
      paymentTypes: new Set(applied.paymentTypes),
      date: applied.date,
    });
    setFilterOpen(true);
  }, [applied]);

  const toggleFilter = useCallback(() => {
    if (filterOpen) {
      setFilterOpen(false);
      return;
    }
    openFilter();
  }, [filterOpen, openFilter]);

  const applyFilters = useCallback(() => {
    setApplied({
      statuses: new Set(draft.statuses),
      paymentTypes: new Set(draft.paymentTypes),
      date: draft.date,
    });
    setFilterOpen(false);
  }, [draft]);

  const clearDraft = useCallback(() => {
    setDraft({
      statuses: new Set(),
      paymentTypes: new Set(),
      date: "last7days",
    });
  }, []);

  const dateChipLabel = labels.dateFilterLabels[applied.date];
  const total = records.length;
  const from = total === 0 ? 0 : 1;
  const to = total;

  const filterPanelProps: FilterPanelProps = {
    labels,
    draft,
    statusOpen,
    paymentOpen,
    dateOpen,
    onToggleStatus: () => setStatusOpen((o) => !o),
    onTogglePayment: () => setPaymentOpen((o) => !o),
    onToggleDate: () => setDateOpen((o) => !o),
    onDraftChange: setDraft,
    onClear: clearDraft,
    onApply: applyFilters,
    onClose: () => setFilterOpen(false),
    showClose: true,
  };

  return (
    <div className={MEMBER_PAGE_BG}>
      <MemberPageHeader
        width="xl"
        title={labels.pageTitle}
        backHref={base}
        backLabel={profile.navLabel}
      />

      <div className={`${memberContainerXl} ${memberPagePadding}`}>
        <MemberFilterToolbar
          dateLabel={dateChipLabel}
          onDateClick={openFilter}
          filterOpen={filterOpen}
          onFilterToggle={toggleFilter}
          filterAriaLabel={labels.filterTitle}
        />

        {loading ? (
          <p className="py-12 text-center text-[14px] text-[#9ca3af]">{labels.loading}</p>
        ) : loadError ? (
          <div className="space-y-3 py-8 text-center">
            <p className="text-[14px] text-[#f87171]">{loadError}</p>
            <button type="button" className={memberBtnSecondary} onClick={() => void loadRecords()}>
              {locale === "bn" ? "আবার চেষ্টা করুন" : "Try again"}
            </button>
          </div>
        ) : total === 0 ? (
          <MemberEmptyState message={labels.empty} />
        ) : (
          <div className="space-y-6">
            {groups.map((group) => (
              <section key={group.key}>
                <h2 className="mb-3 text-[13px] font-medium text-[#9ca3af]">{group.label}</h2>
                <ul className="space-y-3">
                  {group.items.map((record) => (
                    <li key={record.id}>
                      <TransactionCard
                        record={record}
                        labels={labels}
                        locale={locale}
                        onDetails={() => setDetailsRecord(record)}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}

        {total > 0 ? (
          <p className="mt-6 text-[13px] text-[#9ca3af]">
            {labels.recordsCount(from, to, total)}
          </p>
        ) : null}
      </div>

      {filterPortalReady && filterOpen
        ? createPortal(
            <div
              className="fixed inset-0 z-[60] flex flex-col justify-end bg-black/55 lg:flex-row lg:justify-end"
              role="presentation"
              onClick={() => setFilterOpen(false)}
            >
              <aside
                className="flex max-h-[min(92dvh,100dvh)] w-full flex-col rounded-t-2xl bg-[#121212] shadow-2xl lg:h-full lg:max-h-none lg:max-w-[280px] lg:rounded-none"
                role="dialog"
                aria-modal="true"
                aria-labelledby="tx-filter-title"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex shrink-0 justify-center pt-2.5 lg:hidden" aria-hidden>
                  <span className="h-1 w-10 rounded-full bg-[#555]" />
                </div>
                <TransactionFilterPanel {...filterPanelProps} />
              </aside>
            </div>,
            document.body,
          )
        : null}

      {filterPortalReady && detailsRecord
        ? createPortal(
            <div
              className="fixed inset-0 z-[70] flex items-end justify-center bg-black/65 p-0 sm:items-center sm:p-4"
              role="presentation"
              onClick={() => setDetailsRecord(null)}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="tx-details-title"
                className="safe-bottom flex max-h-[92dvh] w-full max-w-md flex-col rounded-t-2xl border border-[#333] bg-[#1a1a1a] shadow-2xl sm:max-h-[85vh] sm:rounded-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-[#2a2a2a] px-4 py-4">
                  <h2 id="tx-details-title" className="text-[17px] font-bold text-white">
                    {labels.detailsTitle}
                  </h2>
                  <button
                    type="button"
                    className="focus-ring rounded-md p-2 hover:bg-white/10"
                    aria-label={labels.detailsClose}
                    onClick={() => setDetailsRecord(null)}
                  >
                    <CloseIcon />
                  </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
                  <p
                    className={`text-center text-[28px] font-bold tabular-nums ${amountClass(detailsRecord.amount)}`}
                  >
                    {formatAmount(detailsRecord.amount, locale)}
                  </p>
                  <p className="mt-1 text-center text-[13px] text-[#9ca3af]">
                    {getGatewayTypeLabel(detailsRecord.paymentType, locale)}
                  </p>

                  <div
                    className={`mt-4 flex items-center gap-2 rounded-md border px-3 py-2.5 ${
                      detailsRecord.status === "rejected"
                        ? "border-[#7a2a2a] bg-[#5c1a1a]/80 text-[#f5a8a8]"
                        : detailsRecord.status === "approved"
                          ? "border-[#178358]/40 bg-[#0f3d2a]/80 text-[#86efac]"
                          : "border-[#5c4a10] bg-[#3d3208]/80 text-[#fde047]"
                    }`}
                  >
                    <StatusIcon status={detailsRecord.status} />
                    <span className="text-[14px] font-medium">
                      {labels.statusLabels[detailsRecord.status]}
                    </span>
                  </div>

                  {detailsRecord.timeline && detailsRecord.timeline.length > 0 ? (
                    <div className="mt-4 rounded-lg border border-[#2a2a2a] bg-[#141414] p-4">
                      <ul className="space-y-0">
                        {detailsRecord.timeline.map((step, index) => (
                          <li key={step.id} className="relative flex gap-3 pb-5 last:pb-0">
                            {index < detailsRecord.timeline!.length - 1 ? (
                              <span
                                className="absolute left-[9px] top-5 h-[calc(100%-12px)] w-px bg-[#23c97f]/50"
                                aria-hidden
                              />
                            ) : null}
                            <span
                              className={`relative z-[1] mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 ${
                                step.active
                                  ? "border-[#23c97f] bg-[#1a1a1a]"
                                  : "border-[#23c97f] bg-[#23c97f]"
                              }`}
                            >
                              {step.active ? (
                                <span className="h-2 w-2 rounded-full bg-[#23c97f]" />
                              ) : (
                                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                              )}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-[14px] font-medium text-white">{step.label}</p>
                              <p className="mt-0.5 text-[12px] text-[#9ca3af]">
                                {formatTransactionDateTime(step.at)}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  <dl className="mt-4 space-y-3 rounded-lg border border-[#2a2a2a] bg-[#141414] p-4 text-[14px]">
                    <div className="flex justify-between gap-4">
                      <dt className="text-[#9ca3af]">{labels.no}</dt>
                      <dd className="text-right font-medium text-white">{detailsRecord.referenceId}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-[#9ca3af]">{labels.gatewayType}</dt>
                      <dd className="text-right text-white">
                        {getGatewayTypeLabel(detailsRecord.paymentType, locale)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-[#9ca3af]">{labels.paymentMethod}</dt>
                      <dd className="flex items-center justify-end gap-2 text-white">
                        <PaymentMethodLogo method={detailsRecord.paymentMethod} />
                        <span>{detailsRecord.method.split(" (")[0]}</span>
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-[#9ca3af]">{labels.paymentTypeDetail}</dt>
                      <dd className="text-right text-white">
                        {getPaymentTypeDetailLabel(detailsRecord.paymentMethod, locale)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-[#9ca3af]">{labels.phoneNumber}</dt>
                      <dd className="text-right text-white">
                        {detailsRecord.walletNumber || "—"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-[#9ca3af]">{labels.amount}</dt>
                      <dd
                        className={`text-right font-semibold tabular-nums ${amountClass(detailsRecord.amount)}`}
                      >
                        {formatAmount(detailsRecord.amount, locale)}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="border-t border-[#2a2a2a] p-4">
                  <button
                    type="button"
                    className={memberBtnPrimary}
                    onClick={() => setDetailsRecord(null)}
                  >
                    {labels.close}
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
