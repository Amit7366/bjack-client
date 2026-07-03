import type { Locale } from "@/lib/locale";

export type MissionTab = "running" | "coming-soon" | "closed";

export type MissionMessages = {
  pageTitle: string;
  running: string;
  comingSoon: string;
  closed: string;
  date: string;
  remaining: string;
  target: string;
  rules: string;
  rulesTitle: string;
  close: string;
  empty: string;
  loadError: string;
  remainingPlaceholder: string;
};

const en: MissionMessages = {
  pageTitle: "Mission",
  running: "Running",
  comingSoon: "Coming Soon",
  closed: "Closed",
  date: "Date",
  remaining: "Remaining",
  target: "Target",
  rules: "Rules",
  rulesTitle: "Mission Rules",
  close: "Close",
  empty: "No missions in this tab.",
  loadError: "Could not load missions.",
  remainingPlaceholder: "----",
};

const bn: MissionMessages = {
  pageTitle: "মিশন",
  running: "চলমান",
  comingSoon: "শীঘ্রই আসছে",
  closed: "শেষ",
  date: "তারিখ",
  remaining: "অবশিষ্ট",
  target: "লক্ষ্য",
  rules: "নিয়ম",
  rulesTitle: "মিশনের নিয়ম",
  close: "বন্ধ",
  empty: "এই ট্যাবে কোনো মিশন নেই।",
  loadError: "মিশন লোড করা যায়নি।",
  remainingPlaceholder: "----",
};

const hi: MissionMessages = {
  pageTitle: "मिशन",
  running: "चल रहा",
  comingSoon: "जल्द आ रहा",
  closed: "समाप्त",
  date: "तारीख",
  remaining: "शेष",
  target: "लक्ष्य",
  rules: "नियम",
  rulesTitle: "मिशन नियम",
  close: "बंद करें",
  empty: "इस टैब में कोई मिशन नहीं।",
  loadError: "मिशन लोड नहीं हो सके।",
  remainingPlaceholder: "----",
};

const byLocale: Record<Locale, MissionMessages> = { en, bn, hi };

export function getMissionMessages(locale: Locale): MissionMessages {
  return byLocale[locale] ?? en;
}
