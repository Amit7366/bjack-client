"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import BettingNoData from "./BettingNoData";
import {
  MEMBER_PAGE_BG,
  memberBtnSecondary,
  memberContainerXl,
  memberPagePadding,
  memberRecordCardClass,
  MemberFilterToolbar,
  MemberPageHeader,
  MemberTabBar,
} from "@/components/member/shared/member-ui";
import { getProfileMessages } from "@/lib/i18n/profile-messages";
import { getBettingMessages } from "@/lib/i18n/betting-messages";
import { fetchUserBetHistory } from "@/lib/betting-records-api";
import { mapGameTxnToRecord } from "@/lib/betting-records-mapper";
import {
  formatBetAmount,
  formatBettingDateOnly,
  formatBettingDateTime,
  type BettingRecord,
  type BettingTab,
} from "@/lib/betting-records-data";
import {
  formatLocalDateOnly,
  TRANSACTION_DATE_FILTER_IDS,
  type TransactionDateFilter,
} from "@/lib/transactions-data";
import { useLocale } from "@/components/LocaleProvider";

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

function resultBadgeClass(result: BettingRecord["result"]): string {
  switch (result) {
    case "won":
      return "bg-[#0f3d2a] text-[#4ade80] border-[#178358]/40";
    case "lost":
      return "bg-[#5c1a1a] text-[#f5a8a8] border-[#7a2a2a]";
    default:
      return "bg-[#2a2a2a] text-[#d4d4d4] border-[#444]";
  }
}

function payoutClass(result: BettingRecord["result"], payout: number): string {
  if (result === "won") return "text-[#4ade80]";
  if (result === "lost") return "text-[#f87171]";
  return payout >= 0 ? "text-[#d4d4d4]" : "text-[#f87171]";
}

function groupBets(
  records: BettingRecord[],
  labels: ReturnType<typeof getBettingMessages>,
  now = new Date(),
) {
  const today = formatLocalDateOnly(now);
  const yesterdayDate = new Date(now);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = formatLocalDateOnly(yesterdayDate);

  const map = new Map<string, BettingRecord[]>();
  for (const r of records) {
    const day = formatBettingDateOnly(r.settledAt);
    const list = map.get(day) ?? [];
    list.push(r);
    map.set(day, list);
  }

  return [...map.keys()]
    .sort((a, b) => b.localeCompare(a))
    .map((day) => {
      let label = labels.dateGroupOn(day);
      if (day === today) label = labels.dateGroupToday(day);
      else if (day === yesterday) label = labels.dateGroupYesterday(day);
      return {
        key: day,
        label,
        items: (map.get(day) ?? []).sort(
          (a, b) => new Date(b.settledAt).getTime() - new Date(a.settledAt).getTime(),
        ),
      };
    });
}

function BettingCard({
  record,
  labels,
  locale,
}: {
  record: BettingRecord;
  labels: ReturnType<typeof getBettingMessages>;
  locale: "en" | "bn" | "hi";
}) {
  return (
    <article className={memberRecordCardClass}>
      <div className="flex items-start justify-between gap-3">
        <span
          className={`inline-flex rounded-md border px-2 py-1 text-[12px] font-medium ${resultBadgeClass(record.result)}`}
        >
          {labels.resultLabels[record.result]}
        </span>
        <span className="text-[12px] text-[#9ca3af]">{record.category}</span>
      </div>

      <p className="mt-2 text-center text-[12px] text-[#9ca3af]">{record.betId}</p>

      <h3 className="mt-2 text-[17px] font-bold text-white">{record.gameName}</h3>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[12px] text-[#9ca3af]">{formatBettingDateTime(record.settledAt)}</p>
          <p className="mt-1 text-[13px] text-[#d4d4d4]">
            {labels.stake}: {formatBetAmount(record.stake, locale).replace(/^\+/, "")}
          </p>
        </div>
        <p className={`text-[16px] font-bold tabular-nums ${payoutClass(record.result, record.payout)}`}>
          {formatBetAmount(record.payout, locale)}
        </p>
      </div>
    </article>
  );
}

export default function BettingRecordsPageContent() {
  const { preferences } = useLocale();
  const locale = preferences.locale;
  const labels = getBettingMessages(locale);
  const profile = getProfileMessages(locale);
  const base = `/${locale}`;

  const [activeTab, setActiveTab] = useState<BettingTab>("settled");
  const [appliedDate, setAppliedDate] = useState<TransactionDateFilter>("last7days");
  const [draftDate, setDraftDate] = useState<TransactionDateFilter>("last7days");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterPortalReady, setFilterPortalReady] = useState(false);
  const [dateOpen, setDateOpen] = useState(true);
  const [records, setRecords] = useState<BettingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    setFilterPortalReady(true);
  }, []);

  useEffect(() => {
    if (!filterOpen) return;
    setDraftDate(appliedDate);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [filterOpen, appliedDate]);

  const loadRecords = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const result = await fetchUserBetHistory({
        dateFilter: appliedDate,
        tab: activeTab,
      });
      setRecords(result.history.map((tx) => mapGameTxnToRecord(tx, locale)));
    } catch {
      setLoadError(labels.loadError);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, appliedDate, locale, labels.loadError]);

  useEffect(() => {
    void loadRecords();
  }, [loadRecords]);

  const groups = useMemo(() => groupBets(records, labels), [records, labels]);

  const openFilter = useCallback(() => {
    setDraftDate(appliedDate);
    setFilterOpen(true);
  }, [appliedDate]);

  const toggleFilter = useCallback(() => {
    if (filterOpen) {
      setFilterOpen(false);
      return;
    }
    openFilter();
  }, [filterOpen, openFilter]);

  const applyFilters = useCallback(() => {
    setAppliedDate(draftDate);
    setFilterOpen(false);
  }, [draftDate]);

  const clearDraft = useCallback(() => {
    setDraftDate("last7days");
  }, []);

  const dateChipLabel = labels.dateFilterLabels[appliedDate];
  const total = records.length;
  const from = total === 0 ? 0 : 1;
  const to = total;
  const showNoData = !loading && !loadError && total === 0;

  return (
    <div className={MEMBER_PAGE_BG}>
      <MemberPageHeader
        width="xl"
        title={labels.pageTitle}
        backHref={base}
        backLabel={profile.navLabel}
      />

      <MemberTabBar
        tabs={["settled", "unsettled"] as const}
        active={activeTab}
        onChange={setActiveTab}
        labels={labels.tabs}
        ariaLabel={labels.pageTitle}
        fullWidthContainer
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
        ) : showNoData ? (
          <BettingNoData message={labels.noData} />
        ) : (
          <div className="space-y-6">
            {groups.map((group) => (
              <section key={group.key}>
                <h2 className="mb-3 text-[13px] font-medium text-[#9ca3af]">{group.label}</h2>
                <ul className="space-y-3">
                  {group.items.map((record) => (
                    <li key={record.id}>
                      <BettingCard record={record} labels={labels} locale={locale} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}

        {!showNoData ? (
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
                aria-labelledby="betting-filter-title"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex shrink-0 justify-center pt-2.5 lg:hidden" aria-hidden>
                  <span className="h-1 w-10 rounded-full bg-[#555]" />
                </div>

                <header className="flex shrink-0 items-center justify-between border-b border-[#2a2a2a] px-4 py-3">
                  <h2 id="betting-filter-title" className="text-lg font-bold text-white">
                    {labels.filterTitle}
                  </h2>
                  <button
                    type="button"
                    className="focus-ring rounded-md p-2 hover:bg-white/10"
                    aria-label={labels.filterClose}
                    onClick={() => setFilterOpen(false)}
                  >
                    <CloseIcon />
                  </button>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-4">
                  <div className="border-b border-[#2a2a2a]">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between px-2 py-3 text-left"
                      onClick={() => setDateOpen((o) => !o)}
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
                                  name="betting-date-filter"
                                  className="peer sr-only"
                                  checked={draftDate === id}
                                  onChange={() => setDraftDate(id)}
                                />
                                <span className="pointer-events-none hidden h-2.5 w-2.5 rounded-full bg-[#178358] peer-checked:block" />
                              </span>
                              <span className="text-[14px] text-[#b3b3b3]">
                                {labels.dateFilterLabels[id]}
                              </span>
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
                    onClick={clearDraft}
                  >
                    {labels.filterClearAll}
                  </button>
                  <button
                    type="button"
                    className="focus-ring min-h-11 flex-[1.15] rounded-md bg-[#178358] py-3 text-[14px] font-bold text-white transition-colors hover:bg-[#1a9664]"
                    onClick={applyFilters}
                  >
                    {labels.filterApply}
                  </button>
                </footer>
              </aside>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
