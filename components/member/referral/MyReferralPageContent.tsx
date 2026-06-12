"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import ReferralRulesModal from "@/components/referral/ReferralRulesModal";
import {
  MEMBER_PAGE_BG,
  memberBtnPrimary,
  memberBtnSecondary,
  memberContainerXl,
  memberPagePadding,
  memberPanelBorder,
  MemberPageHeader,
} from "@/components/member/shared/member-ui";
import { useLocale } from "@/components/LocaleProvider";
import { useToast } from "@/components/ToastProvider";
import { AUTH_CHANGE_EVENT } from "@/lib/auth/session";
import { getProfileMessages } from "@/lib/i18n/profile-messages";
import {
  formatMyReferralAmount,
  getMyReferralMessages,
  type MyReferralTab,
} from "@/lib/i18n/my-referral-messages";
import type { Locale } from "@/lib/locale";
import { formatReferralNumber } from "@/lib/i18n/referral-messages";
import { referralMonthlyMilestones } from "@/lib/my-referral-data";
import { referralRewardLevels } from "@/lib/referral-data";
import {
  buildReferralQrUrl,
  buildReferralRegisterLink,
  fetchMyReferralSummary,
  type MyReferralSummary,
  type ReferredUserRow,
} from "@/lib/referral-api";

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden>
      <rect x="4.5" y="4.5" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M3 9.5V3.5A1.5 1.5 0 014.5 2H9.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className="text-[#9ca3af]">
      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7 6.2V10M7 4.4v.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#1f4d38] bg-[#0d3d2b]/80 px-3 py-3 text-center">
      <p className="text-[11px] text-[#b8d4c8] sm:text-[12px]">{label}</p>
      <p className="mt-1 text-[15px] font-semibold text-white sm:text-[16px]">{value}</p>
    </div>
  );
}

function ReferralSidebar({
  referralId,
  referralLink,
  qrUrl,
  labels,
  onCopyCode,
  onCopyLink,
  onShare,
  busy,
}: {
  referralId: string;
  referralLink: string;
  qrUrl: string;
  labels: ReturnType<typeof getMyReferralMessages>;
  onCopyCode: () => void;
  onCopyLink: () => void;
  onShare: () => void;
  busy: boolean;
}) {
  return (
    <aside className={`${memberPanelBorder} flex flex-col items-center p-5 sm:p-6`}>
      <div className="rounded-lg bg-white p-3">
        <Image
          src={qrUrl}
          alt=""
          width={180}
          height={180}
          unoptimized
          className="h-[180px] w-[180px]"
        />
      </div>

      <p className="mt-5 text-[13px] text-[#9ca3af]">{labels.yourReferralCode}</p>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-[22px] font-bold tracking-wide text-white sm:text-[24px]">
          {referralId}
        </span>
        <button
          type="button"
          onClick={onCopyCode}
          disabled={busy}
          className="focus-ring rounded-md p-2 text-[#9ca3af] transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
          aria-label={labels.copyCode}
        >
          <CopyIcon />
        </button>
      </div>

      <div className="mt-6 flex w-full gap-3">
        <button
          type="button"
          onClick={onCopyLink}
          disabled={busy}
          className={`${memberBtnSecondary} flex-1`}
        >
          {labels.copyLink}
        </button>
        <button
          type="button"
          onClick={onShare}
          disabled={busy}
          className={`${memberBtnPrimary} flex-1`}
        >
          {labels.share}
        </button>
      </div>
      <p className="mt-3 w-full break-all text-center text-[11px] text-[#6b7280]">{referralLink}</p>
    </aside>
  );
}

function formatReferredDate(iso: string, locale: Locale): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(locale === "bn" ? "bn-BD" : locale === "hi" ? "hi-IN" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

function ReferredUsersList({
  users,
  locale,
  labels,
}: {
  users: ReferredUserRow[];
  locale: Locale;
  labels: ReturnType<typeof getMyReferralMessages>;
}) {
  return (
    <section className={`${memberPanelBorder} p-4 sm:p-5`}>
      <h2 className="text-[15px] font-bold text-white sm:text-[16px]">{labels.referredUsersTitle}</h2>

      {users.length === 0 ? (
        <p className="mt-4 text-center text-[13px] text-[#9ca3af]">{labels.noReferredUsers}</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-lg border border-[#2f2f2f]">
          <table className="w-full min-w-[320px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#2f2f2f] bg-[#141414] text-[#9ca3af]">
                <th className="px-3 py-2.5 font-medium sm:px-4">{labels.usernameColumn}</th>
                <th className="px-3 py-2.5 font-medium sm:px-4">{labels.totalDepositColumn}</th>
                <th className="px-3 py-2.5 font-medium sm:px-4">{labels.turnoverColumn}</th>
                <th className="px-3 py-2.5 font-medium sm:px-4">{labels.rewardStatusColumn}</th>
                <th className="hidden px-3 py-2.5 font-medium sm:table-cell sm:px-4">
                  {labels.referredAtColumn}
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((row) => (
                <tr
                  key={row.userId}
                  className="border-b border-[#2a2a2a] last:border-b-0 hover:bg-white/[0.02]"
                >
                  <td className="px-3 py-3 font-medium text-white sm:px-4">{row.username}</td>
                  <td className="px-3 py-3 tabular-nums text-[#f5c518] sm:px-4">
                    ৳ {formatMyReferralAmount(locale, row.totalDeposit)}
                  </td>
                  <td className="px-3 py-3 tabular-nums text-white sm:px-4">
                    {formatMyReferralAmount(locale, row.turnoverCompleted)} /{" "}
                    {formatMyReferralAmount(locale, row.turnoverRequired)}
                  </td>
                  <td className="px-3 py-3 sm:px-4">
                    <span
                      className={
                        row.rewardPaid
                          ? "font-medium text-[#4ade80]"
                          : "text-[#9ca3af]"
                      }
                    >
                      {row.rewardPaid ? labels.rewardPaid : labels.rewardPending}
                    </span>
                  </td>
                  <td className="hidden px-3 py-3 text-[#9ca3af] sm:table-cell sm:px-4">
                    {formatReferredDate(row.referredAt, locale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function MonthlyMilestones({
  inviteCount,
  locale,
  labels,
}: {
  inviteCount: number;
  locale: Locale;
  labels: ReturnType<typeof getMyReferralMessages>;
}) {
  const maxInvites = referralMonthlyMilestones[referralMonthlyMilestones.length - 1]?.invites ?? 200;
  const progressPercent = Math.min(100, (inviteCount / maxInvites) * 100);

  return (
    <div className="mt-5 rounded-xl border border-[#1f4d38] bg-[#0a2e20]/70 p-4 sm:p-5">
      <p className="mb-4 text-[13px] font-semibold text-white">{labels.monthly}</p>
      <div className="relative">
        <div className="absolute left-0 right-0 top-[18px] h-[2px] bg-[#2f5f4a]" />
        <div
          className="absolute left-0 top-[18px] h-[2px] bg-[#f5c518] transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
        <div className="relative grid grid-cols-3 gap-y-6 sm:grid-cols-6">
          {referralMonthlyMilestones.map((milestone) => {
            const reached = inviteCount >= milestone.invites;
            return (
              <div key={milestone.id} className="flex flex-col items-center text-center">
                <span className="text-[11px] text-[#b8d4c8]">{labels.invite}</span>
                <span
                  className={`mt-1 flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-bold ${
                    reached ? "bg-[#f5c518] text-[#1a1a1a]" : "bg-[#2a4a3a] text-white"
                  }`}
                >
                  {formatReferralNumber(locale, String(milestone.invites))}
                </span>
                <span className="mt-2 text-[12px] font-semibold text-[#f5c518] sm:text-[13px]">
                  +{formatMyReferralAmount(locale, milestone.reward)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function MyReferralPageContent() {
  const { preferences } = useLocale();
  const { showToast } = useToast();
  const locale = preferences.locale;
  const m = getMyReferralMessages(locale);
  const p = getProfileMessages(locale);
  const base = `/${locale}`;

  const [tab, setTab] = useState<MyReferralTab>("details");
  const [summary, setSummary] = useState<MyReferralSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);

  const loadSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMyReferralSummary();
      setSummary(data);
    } catch (err) {
      setSummary(null);
      setError(err instanceof Error ? err.message : m.loadError);
    } finally {
      setLoading(false);
    }
  }, [m.loadError]);

  useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    const onAuthChange = () => void loadSummary();
    window.addEventListener(AUTH_CHANGE_EVENT, onAuthChange);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, onAuthChange);
  }, [loadSummary]);

  const referralId = summary?.referralId ?? "";
  const referralLink = useMemo(
    () => (referralId ? buildReferralRegisterLink(locale, referralId) : ""),
    [locale, referralId],
  );
  const qrUrl = useMemo(
    () => (referralLink ? buildReferralQrUrl(referralLink) : ""),
    [referralLink],
  );

  async function copyText(text: string, successMessage: string) {
    if (!text) return;
    setActionBusy(true);
    try {
      await navigator.clipboard.writeText(text);
      showToast(successMessage, { variant: "success" });
    } catch {
      showToast(m.copyFailed, { variant: "error" });
    } finally {
      setActionBusy(false);
    }
  }

  async function handleShare() {
    if (!referralLink) return;
    setActionBusy(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: m.shareTitle,
          text: `${m.shareText} ${referralLink}`,
          url: referralLink,
        });
      } else {
        await navigator.clipboard.writeText(referralLink);
        showToast(m.linkCopied, { variant: "success" });
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      showToast(m.copyFailed, { variant: "error" });
    } finally {
      setActionBusy(false);
    }
  }

  const tabs: MyReferralTab[] = ["info", "details", "rewards"];

  return (
    <div className={MEMBER_PAGE_BG}>
      <MemberPageHeader
        title={p.sectionTitles["my-referral"]}
        backHref={base}
        backLabel={p.navLabel}
        width="xl"
      />

      <div className={`${memberContainerXl} ${memberPagePadding}`}>
        <div className="mb-5 flex border-b border-[#2a2a2a]">
          {tabs.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`focus-ring relative flex-1 px-2 py-3 text-[13px] font-medium transition-colors sm:text-[14px] ${
                tab === id ? "text-[#178358]" : "text-[#9ca3af] hover:text-white"
              }`}
            >
              {m.tabs[id]}
              {tab === id ? (
                <span className="absolute inset-x-2 bottom-0 h-[2px] rounded-full bg-[#178358]" />
              ) : null}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="py-12 text-center text-[14px] text-[#9ca3af]">{m.loading}</p>
        ) : error ? (
          <div className="py-12 text-center">
            <p className="text-[14px] text-[#fca5a5]">{error}</p>
            <button type="button" onClick={() => void loadSummary()} className={`${memberBtnSecondary} mt-4`}>
              {m.retry}
            </button>
          </div>
        ) : summary && tab === "info" ? (
          <section className={`${memberPanelBorder} space-y-4 p-5 sm:p-6`}>
            <h2 className="text-[16px] font-bold text-white sm:text-[17px]">{m.infoTitle}</h2>
            <p className="text-[13px] leading-relaxed text-[#b3b3b3] sm:text-[14px]">{m.infoP1}</p>
            <p className="text-[13px] leading-relaxed text-[#b3b3b3] sm:text-[14px]">{m.infoP2}</p>
            <ReferralSidebar
              referralId={referralId}
              referralLink={referralLink}
              qrUrl={qrUrl}
              labels={m}
              onCopyCode={() => void copyText(referralId, m.codeCopied)}
              onCopyLink={() => void copyText(referralLink, m.linkCopied)}
              onShare={() => void handleShare()}
              busy={actionBusy}
            />
          </section>
        ) : summary && tab === "rewards" ? (
          <section className="space-y-4">
            <div className={`${memberPanelBorder} p-5 sm:p-6`}>
              <h2 className="text-[16px] font-bold text-white sm:text-[17px]">{m.rewardsTitle}</h2>
              <p className="mt-2 text-[13px] text-[#9ca3af]">{m.rewardsSubtitle}</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {referralRewardLevels.map((level) => (
                  <div
                    key={level.id}
                    className="flex items-center justify-between rounded-lg border border-[#2f2f2f] bg-[#141414] px-4 py-3"
                  >
                    <span className="text-[14px] text-white">
                      {m.levelLabel} {formatReferralNumber(locale, String(level.level))}
                    </span>
                    <span className="text-[15px] font-bold text-[#f5c518]">{level.rate}</span>
                  </div>
                ))}
              </div>
            </div>
            <ReferralSidebar
              referralId={referralId}
              referralLink={referralLink}
              qrUrl={qrUrl}
              labels={m}
              onCopyCode={() => void copyText(referralId, m.codeCopied)}
              onCopyLink={() => void copyText(referralLink, m.linkCopied)}
              onShare={() => void handleShare()}
              busy={actionBusy}
            />
          </section>
        ) : summary ? (
          <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-5">
            <ReferralSidebar
              referralId={referralId}
              referralLink={referralLink}
              qrUrl={qrUrl}
              labels={m}
              onCopyCode={() => void copyText(referralId, m.codeCopied)}
              onCopyLink={() => void copyText(referralLink, m.linkCopied)}
              onShare={() => void handleShare()}
              busy={actionBusy}
            />

            <div className="space-y-4">
              <section className="rounded-xl bg-gradient-to-br from-[#178358] to-[#0d4a2e] p-4 sm:p-5">
                <h2 className="text-[15px] font-bold text-white sm:text-[16px]">{m.programStatusTitle}</h2>
                <div className="mt-4 grid gap-4 lg:grid-cols-[140px_1fr]">
                  <div className="flex flex-col items-center justify-center rounded-xl border border-[#1f4d38] bg-[#0a2e20]/60 px-4 py-5 text-center">
                    <span className="text-[36px] font-black leading-none text-[#f5c518] sm:text-[42px]">
                      {formatReferralNumber(locale, String(summary.activeDownline))}
                    </span>
                    <span className="mt-2 flex items-center gap-1 text-[12px] text-[#d4f0e4] sm:text-[13px]">
                      {m.activeDownline}
                      <InfoIcon />
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <StatBox
                      label={m.totalRewards}
                      value={formatMyReferralAmount(locale, summary.totalRewards)}
                    />
                    <StatBox
                      label={m.downlineTurnover}
                      value={formatMyReferralAmount(locale, summary.downlineTurnover)}
                    />
                    <StatBox
                      label={m.rewards}
                      value={formatMyReferralAmount(locale, summary.rewards)}
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-xl bg-gradient-to-br from-[#178358] to-[#0d4a2e] p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h2 className="text-[15px] font-bold text-white sm:text-[16px]">{m.earnedStatusTitle}</h2>
                  <button
                    type="button"
                    onClick={() => setRulesOpen(true)}
                    className="focus-ring text-[12px] text-[#b8e6d0] underline-offset-2 hover:underline sm:text-[13px]"
                  >
                    {m.earnedBonusRules}
                  </button>
                </div>

                <div className="mt-4 flex flex-col items-center rounded-xl border border-[#1f4d38] bg-[#0a2e20]/60 px-4 py-5 text-center sm:max-w-[180px]">
                  <span className="text-[36px] font-black leading-none text-[#f5c518] sm:text-[42px]">
                    {formatMyReferralAmount(locale, summary.earnedReward)}
                  </span>
                  <span className="mt-2 flex items-center gap-1 text-[12px] text-[#d4f0e4] sm:text-[13px]">
                    {m.rewardCurrency}
                    <InfoIcon />
                  </span>
                </div>

                <MonthlyMilestones inviteCount={summary.inviteCount} locale={locale} labels={m} />
              </section>

              <ReferredUsersList users={summary.referredUsers ?? []} locale={locale} labels={m} />
            </div>
          </div>
        ) : null}
      </div>

      <ReferralRulesModal open={rulesOpen} locale={locale} onClose={() => setRulesOpen(false)} />
    </div>
  );
}
