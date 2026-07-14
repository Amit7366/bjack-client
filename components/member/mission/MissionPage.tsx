"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useLocale } from "@/components/LocaleProvider";
import { useToast } from "@/components/ToastProvider";
import { formatDisplayBalance } from "@/lib/format-balance";
import { getMissionMessages, type MissionTab } from "@/lib/i18n/mission-messages";
import { memberCenterHref } from "@/lib/member-routes";
import { fetchMissions, type MissionItem } from "@/lib/mission-api";
import {
  fetchMyNormalUserProfile,
  type NormalUserProfile,
} from "@/lib/member/profile-api";
import { AUTH_CHANGE_EVENT } from "@/lib/auth/session";
import { DefaultAvatarIcon, HeaderBackIcon, RefreshBalanceIcon } from "../center/MemberCenterIcons";

function formatCountdown(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((part) => String(part).padStart(2, "0")).join(":");
}

function RocketIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3c2.5 3.5 4 7.2 4 11.2 0 1.2-.2 2.3-.6 3.3l-1.9 4.5-1.5-3.2-2.4 2.4 1.2 3.8-3.2-1.8-2.8 2.8 1.8-3.2-3.8 1.2 2.4-2.4-3.2-1.5 4.5-1.9c1-.4 2.1-.6 3.3-.6 4 0 7.7 1.5 11.2 4z"
        fill={active ? "#e53935" : "#9ca3af"}
      />
    </svg>
  );
}

function ClockIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8.5" stroke={active ? "#e53935" : "#9ca3af"} strokeWidth="1.8" />
      <path d="M12 7.5V12l3.2 2.2" stroke={active ? "#e53935" : "#9ca3af"} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ClosedIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8.5" stroke={active ? "#e53935" : "#9ca3af"} strokeWidth="1.8" />
      <path
        d="M8.5 9.5c1.2-1.2 2.4-1.8 3.5-1.8s2.3.6 3.5 1.8M9 14.5h6"
        stroke={active ? "#e53935" : "#9ca3af"}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BronzeMedalIcon() {
  return (
    <svg width="72" height="88" viewBox="0 0 72 88" fill="none" aria-hidden>
      <path d="M22 4l6 14 15-3-9 12 12 9-15-2-6 14-6-14-15 2 12-9-9 12 15 3-6-14z" fill="#2f6fd6" />
      <path d="M50 4l6 14 15-3-9 12 12 9-15-2-6 14-6-14-15 2 12-9-9 12 15 3-6-14z" fill="#f5c518" />
      <circle cx="36" cy="58" r="22" fill="url(#bronze)" stroke="#a85f24" strokeWidth="2" />
      <circle cx="36" cy="58" r="14" fill="#d4883f" stroke="#8f4f18" strokeWidth="1.5" />
      <path
        d="M36 48l2.6 5.3 5.9.9-4.2 4.1 1 5.9-5.3-2.8-5.3 2.8 1-5.9-4.2-4.1 5.9-.9L36 48z"
        fill="#f7e6b8"
      />
      <defs>
        <radialGradient id="bronze" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(36 58) rotate(90) scale(22)">
          <stop stopColor="#f0b56d" />
          <stop offset="1" stopColor="#a85f24" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function SilverMedalIcon() {
  return (
    <svg width="72" height="88" viewBox="0 0 72 88" fill="none" aria-hidden>
      <path d="M22 4l6 14 15-3-9 12 12 9-15-2-6 14-6-14-15 2 12-9-9 12 15 3-6-14z" fill="#8ea3b8" />
      <path d="M50 4l6 14 15-3-9 12 12 9-15-2-6 14-6-14-15 2 12-9-9 12 15 3-6-14z" fill="#c7d2dc" />
      <circle cx="36" cy="58" r="22" fill="url(#silver)" stroke="#7b8794" strokeWidth="2" />
      <circle cx="36" cy="58" r="14" fill="#c5ced6" stroke="#6b7785" strokeWidth="1.5" />
      <path
        d="M36 48l2.6 5.3 5.9.9-4.2 4.1 1 5.9-5.3-2.8-5.3 2.8 1-5.9-4.2-4.1 5.9-.9L36 48z"
        fill="#f3f6f8"
      />
      <defs>
        <radialGradient id="silver" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(36 58) rotate(90) scale(22)">
          <stop stopColor="#eef2f5" />
          <stop offset="1" stopColor="#8b98a5" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function RulesModal({
  open,
  title,
  body,
  closeLabel,
  onClose,
}: {
  open: boolean;
  title: string;
  body: string;
  closeLabel: string;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-4 sm:items-center">
      <button type="button" className="absolute inset-0" aria-label={closeLabel} onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
        <h2 className="text-[16px] font-bold text-[#1f2937]">{title}</h2>
        <p className="mt-3 text-[14px] leading-relaxed text-[#4b5563]">{body}</p>
        <button
          type="button"
          onClick={onClose}
          className="focus-ring mt-5 w-full rounded-full bg-[#5b6cff] py-2.5 text-[14px] font-semibold text-white"
        >
          {closeLabel}
        </button>
      </div>
    </div>
  );
}

function MissionCard({
  mission,
  tab,
  labels,
}: {
  mission: MissionItem;
  tab: MissionTab;
  labels: ReturnType<typeof getMissionMessages>;
}) {
  const [rulesOpen, setRulesOpen] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(mission.remainingSeconds ?? 0);

  useEffect(() => {
    setRemainingSeconds(mission.remainingSeconds ?? 0);
  }, [mission.remainingSeconds]);

  useEffect(() => {
    if (tab !== "running" || mission.remainingSeconds == null) return undefined;

    const timer = window.setInterval(() => {
      setRemainingSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [mission.remainingSeconds, tab]);

  const remainingDisplay =
    tab === "running" && mission.remainingSeconds != null
      ? formatCountdown(remainingSeconds)
      : labels.remainingPlaceholder;

  return (
    <>
      <div className="rounded-2xl bg-[#e8edf3] px-3 py-3 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
        <div className="flex gap-3">
          <div className="flex w-[78px] shrink-0 flex-col items-center">
            {mission.medalType === "silver" ? <SilverMedalIcon /> : <BronzeMedalIcon />}
            <span className="-mt-1 text-[18px] font-extrabold text-[#1f2937]">{mission.percent}%</span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-[#1f2937]">
                {mission.title}
              </h3>
              <button
                type="button"
                onClick={() => setRulesOpen(true)}
                className="focus-ring shrink-0 rounded-full border border-[#c5ced8] bg-white px-3 py-0.5 text-[12px] font-medium text-[#4b5563]"
              >
                {labels.rules}
              </button>
            </div>

            <div className="mt-2 space-y-1 text-[13px]">
              <div className="flex justify-between gap-3">
                <span className="text-[#6b7280]">{labels.date}</span>
                <span className="text-right font-medium text-[#1f2937]">{mission.dateRange}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-[#6b7280]">{labels.remaining}</span>
                <span className="text-right font-medium tabular-nums text-[#1f2937]">{remainingDisplay}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-[#6b7280]">{labels.target}</span>
                <span className="text-right font-medium tabular-nums text-[#1f2937]">
                  {mission.currentValue}/{mission.targetValue}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 h-3 overflow-hidden rounded-full bg-white">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#8ea8ff] to-[#5b6cff] transition-all duration-300"
            style={{ width: `${mission.percent}%` }}
          />
        </div>
      </div>

      <RulesModal
        open={rulesOpen}
        title={labels.rulesTitle}
        body={mission.rules}
        closeLabel={labels.close}
        onClose={() => setRulesOpen(false)}
      />
    </>
  );
}

const TABS: MissionTab[] = ["running", "coming-soon", "closed"];

export default function MissionPage() {
  const { session, refreshBalance, balanceSyncing } = useAuth();
  const { preferences } = useLocale();
  const { showToast } = useToast();
  const locale = preferences.locale;
  const labels = getMissionMessages(locale);

  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<NormalUserProfile | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<MissionTab>("running");
  const [missions, setMissions] = useState<MissionItem[]>([]);
  const [loading, setLoading] = useState(true);

  const displayId = profile?.userName ?? session?.userName ?? session?.memberId ?? "—";
  const avatarSrc = profile?.profileImg?.trim() || "";
  const balanceDisplay = formatDisplayBalance(session?.balance, locale);

  const loadMissions = useCallback(
    (tab: MissionTab) => {
      setLoading(true);
      void fetchMissions(tab, locale)
        .then((data) => setMissions(data.items))
        .catch(() => {
          showToast(labels.loadError, { variant: "error" });
          setMissions([]);
        })
        .finally(() => setLoading(false));
    },
    [locale, labels.loadError, showToast],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchMyNormalUserProfile()
      .then((data) => {
        if (!cancelled) setProfile(data);
      })
      .catch(() => {
        /* profile optional */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    loadMissions(activeTab);
  }, [activeTab, loadMissions]);

  useEffect(() => {
    const onAuthChange = () => loadMissions(activeTab);
    window.addEventListener(AUTH_CHANGE_EVENT, onAuthChange);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, onAuthChange);
  }, [activeTab, loadMissions]);

  const onRefresh = useCallback(async () => {
    if (refreshing || balanceSyncing) return;
    setRefreshing(true);
    try {
      await refreshBalance();
    } finally {
      setRefreshing(false);
    }
  }, [refreshBalance, balanceSyncing, refreshing]);

  const tabLabel: Record<MissionTab, string> = {
    running: labels.running,
    "coming-soon": labels.comingSoon,
    closed: labels.closed,
  };

  const tabIcon = (tab: MissionTab, active: boolean) => {
    if (tab === "running") return <RocketIcon active={active} />;
    if (tab === "coming-soon") return <ClockIcon active={active} />;
    return <ClosedIcon active={active} />;
  };

  if (!mounted) return null;

  return (
    <div className="min-h-full bg-[#eef0f2]">
      <div className="mx-auto w-full max-w-lg">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#6b4cff] via-[#5a63ff] to-[#4f8dff] pb-20">
          <span aria-hidden className="absolute -left-8 top-10 h-28 w-28 rounded-full border border-white/20" />
          <span aria-hidden className="absolute right-6 top-16 h-20 w-20 rounded-full border border-white/15" />
          <span aria-hidden className="absolute -right-10 bottom-8 h-36 w-36 rounded-full bg-white/10 blur-2xl" />

          <header className="relative z-10">
            <div className="relative flex min-h-[52px] items-center justify-center px-3">
              <Link
                href={memberCenterHref(locale)}
                aria-label={labels.pageTitle}
                className="focus-ring absolute left-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-white transition-colors hover:bg-white/10"
              >
                <HeaderBackIcon />
              </Link>
              <h1 className="text-[18px] font-bold text-white">{labels.pageTitle}</h1>
            </div>
          </header>

          <div className="relative z-10 mt-2 flex items-center gap-3 px-4">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-white/70 shadow-md">
              {avatarSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarSrc} alt="" className="h-full w-full object-cover" />
              ) : (
                <DefaultAvatarIcon />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[17px] font-bold text-white">{displayId}</p>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="text-[18px] font-extrabold tabular-nums text-white">৳ {balanceDisplay}</span>
                <button
                  type="button"
                  onClick={() => void onRefresh()}
                  disabled={refreshing || balanceSyncing}
                  aria-label="Refresh balance"
                  className="focus-ring rounded-full p-1 text-white/90 transition-colors hover:bg-white/10 disabled:opacity-50"
                >
                  <RefreshBalanceIcon spinning={refreshing || balanceSyncing} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-20 -mt-12 px-3">
          <div className="overflow-hidden rounded-t-2xl bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
            <div className="grid grid-cols-3 border-b border-[#eceff3]">
              {TABS.map((tab) => {
                const active = tab === activeTab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className="focus-ring relative flex flex-col items-center gap-1 px-2 py-3"
                  >
                    {tabIcon(tab, active)}
                    <span className={`text-[13px] font-semibold ${active ? "text-[#e53935]" : "text-[#9ca3af]"}`}>
                      {tabLabel[tab]}
                    </span>
                    {active ? (
                      <span className="absolute inset-x-4 bottom-0 h-[2px] rounded-full bg-[#e53935]" />
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="space-y-3 bg-[#f3f5f7] p-3 pb-mobile-nav lg:pb-6">
              {loading ? (
                <div className="py-10 text-center text-[14px] text-[#9ca3af]">…</div>
              ) : missions.length ? (
                missions.map((mission) => (
                  <MissionCard key={mission.id} mission={mission} tab={activeTab} labels={labels} />
                ))
              ) : (
                <p className="py-10 text-center text-[14px] text-[#9ca3af]">{labels.empty}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
