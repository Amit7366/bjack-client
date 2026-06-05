"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MEMBER_PAGE_BG,
  memberBtnSecondary,
  memberContainerXl,
  memberPagePadding,
  memberPanelBorder,
  memberRecordCardClass,
  MemberEmptyState,
  MemberPageHeader,
} from "@/components/member/shared/member-ui";
import { useLocale } from "@/components/LocaleProvider";
import { AUTH_CHANGE_EVENT } from "@/lib/auth/session";
import {
  GAME_RETURN_EVENT,
  TURNOVER_REFRESH_EVENT,
} from "@/lib/game-return-events";
import { getProfileMessages } from "@/lib/i18n/profile-messages";
import {
  formatTurnoverAmount,
  getTurnoverMessages,
} from "@/lib/i18n/turnover-messages";
import {
  fetchTurnoverSummary,
  type TurnoverProgressItem,
  type TurnoverSummary,
} from "@/lib/turnover-api";

function RefreshIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M13.5 8a5.5 5.5 0 0 1-9.2 4M2.5 8a5.5 5.5 0 0 1 9.2-4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M11.5 2.5V5h-2.5M4.5 13.5V11H7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProgressBar({ percent }: { percent: number }) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#2a2a2a]">
      <div
        className="h-full rounded-full bg-[#178358] transition-[width] duration-500 ease-out"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

function StatCell({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-lg border border-[#2f2f2f] bg-[#141414] px-3 py-3 text-center sm:px-4">
      <p className="text-[11px] uppercase tracking-wide text-[#9ca3af] sm:text-[12px]">{label}</p>
      <p className={`mt-1 text-[15px] font-semibold sm:text-[16px] ${accent ?? "text-white"}`}>
        {value}
      </p>
    </div>
  );
}

function eligibleGamesLabel(
  types: string[] | undefined,
  labels: ReturnType<typeof getTurnoverMessages>,
): string | null {
  if (!types?.length) return null;
  if (types.includes("all")) return labels.allGames;
  if (types.includes("none")) return null;
  return types.join(", ");
}

function TurnoverItemCard({
  item,
  labels,
}: {
  item: TurnoverProgressItem;
  labels: ReturnType<typeof getTurnoverMessages>;
}) {
  const percent =
    item.turnoverRequired > 0
      ? (item.turnoverCompleted / item.turnoverRequired) * 100
      : 0;
  const games = eligibleGamesLabel(item.eligibleGameTypes, labels);

  return (
    <article className={memberRecordCardClass}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[14px] font-semibold text-white sm:text-[15px]">
            {item.promoCode ? `${labels.kinds[item.kind]} (${item.promoCode})` : labels.kinds[item.kind]}
          </h3>
          {games ? (
            <p className="mt-1 text-[12px] text-[#9ca3af]">
              {labels.eligibleGames}: {games}
            </p>
          ) : null}
        </div>
        {item.isActive ? (
          <span className="rounded-full border border-[#178358]/40 bg-[#0f3d2a] px-2.5 py-0.5 text-[11px] font-medium text-[#4ade80]">
            {labels.activePromotion}
          </span>
        ) : null}
      </div>

      <ProgressBar percent={percent} />

      <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
        <StatCell label={labels.required} value={formatTurnoverAmount(item.turnoverRequired)} />
        <StatCell
          label={labels.completed}
          value={formatTurnoverAmount(item.turnoverCompleted)}
          accent="text-[#4ade80]"
        />
        <StatCell
          label={labels.remaining}
          value={formatTurnoverAmount(item.remaining)}
          accent="text-[#fbbf24]"
        />
      </div>
    </article>
  );
}

export default function TurnoverPageContent() {
  const { preferences } = useLocale();
  const p = getProfileMessages(preferences.locale);
  const t = getTurnoverMessages(preferences.locale);
  const base = `/${preferences.locale}`;

  const [summary, setSummary] = useState<TurnoverSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const runningRef = useRef(false);

  const load = useCallback(async () => {
    if (runningRef.current) return;
    runningRef.current = true;
    setError(null);
    try {
      const data = await fetchTurnoverSummary();
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.loadError);
    } finally {
      setLoading(false);
      runningRef.current = false;
    }
  }, [t.loadError]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const refresh = () => {
      void load();
    };

    window.addEventListener("focus", refresh);
    window.addEventListener(GAME_RETURN_EVENT, refresh);
    window.addEventListener(TURNOVER_REFRESH_EVENT, refresh);
    window.addEventListener(AUTH_CHANGE_EVENT, refresh);

    const onVisibility = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener(GAME_RETURN_EVENT, refresh);
      window.removeEventListener(TURNOVER_REFRESH_EVENT, refresh);
      window.removeEventListener(AUTH_CHANGE_EVENT, refresh);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [load]);

  const progress = summary?.progress;
  const items = progress?.items ?? [];
  const totalRequired = progress?.totalRequired ?? summary?.totalTurnoverRequired ?? 0;
  const totalCompleted = progress?.totalCompleted ?? summary?.totalTurnoverCompleted ?? 0;
  const totalRemaining = progress?.totalRemaining ?? Math.max(0, totalRequired - totalCompleted);
  const completionPercentage = useMemo(() => {
    if (progress?.completionPercentage != null) return progress.completionPercentage;
    if (summary?.completionPercentage != null) return summary.completionPercentage;
    return totalRequired > 0 ? (totalCompleted / totalRequired) * 100 : 100;
  }, [progress, summary, totalCompleted, totalRequired]);

  const activeDeposit = progress?.activeDeposit;
  const hasPending = items.length > 0;

  return (
    <div className={`${MEMBER_PAGE_BG} ${memberPagePadding}`}>
      <div className={`${memberContainerXl} space-y-4`}>
        <MemberPageHeader
          title={p.sectionTitles.turnover}
          backHref={base}
          backLabel={p.navLabel}
          width="xl"
          trailing={
            <button
              type="button"
              className={`${memberBtnSecondary} inline-flex items-center gap-2`}
              onClick={() => void load()}
              disabled={loading}
            >
              <RefreshIcon />
              {t.refresh}
            </button>
          }
        />

        {loading && !summary ? (
          <div className={`${memberPanelBorder} px-4 py-10 text-center text-[14px] text-[#9ca3af]`}>
            …
          </div>
        ) : null}

        {error ? (
          <div className={`${memberPanelBorder} px-4 py-6 text-center`}>
            <p className="text-[14px] text-[#f87171]">{error}</p>
            <button type="button" className={`${memberBtnSecondary} mt-4`} onClick={() => void load()}>
              {t.retry}
            </button>
          </div>
        ) : null}

        {!loading && !error && summary ? (
          <>
            <section className={`${memberPanelBorder} p-4 sm:p-5`}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-[15px] font-semibold text-white sm:text-[16px]">{t.progress}</h2>
                <span className="text-[13px] font-medium text-[#4ade80]">
                  {completionPercentage.toFixed(1)}%
                </span>
              </div>

              <ProgressBar percent={completionPercentage} />

              <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
                <StatCell label={t.required} value={formatTurnoverAmount(totalRequired)} />
                <StatCell
                  label={t.completed}
                  value={formatTurnoverAmount(totalCompleted)}
                  accent="text-[#4ade80]"
                />
                <StatCell
                  label={t.remaining}
                  value={formatTurnoverAmount(totalRemaining)}
                  accent="text-[#fbbf24]"
                />
              </div>

              {activeDeposit && activeDeposit.remaining > 0 ? (
                <p className="mt-4 text-[12px] text-[#9ca3af] sm:text-[13px]">
                  {t.activePromotion}
                  {activeDeposit.promoCode ? `: ${activeDeposit.promoCode}` : ""}
                  {" — "}
                  {formatTurnoverAmount(activeDeposit.remaining)} {t.remaining.toLowerCase()}
                </p>
              ) : null}
            </section>

            {hasPending ? (
              <div className="space-y-3">
                {items.map((item) => (
                  <TurnoverItemCard key={item.id} item={item} labels={t} />
                ))}
              </div>
            ) : (
              <MemberEmptyState message={`${t.noPending}. ${t.noPendingHint}`} />
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
