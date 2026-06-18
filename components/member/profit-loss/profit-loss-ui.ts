import type { ProfitLossCategory } from "@/lib/i18n/profit-loss-messages";

export const PROFIT_LOSS_LIGHT_BG = "min-h-full bg-[#f3f4f6]";
export const PROFIT_LOSS_ACCENT = "#2196F3";

function dhakaParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const y = parts.find((p) => p.type === "year")?.value ?? "1970";
  const m = parts.find((p) => p.type === "month")?.value ?? "01";
  const d = parts.find((p) => p.type === "day")?.value ?? "01";
  return { y: Number(y), m: Number(m), d: Number(d) };
}

export function dhakaTodayKey(): string {
  const { y, m, d } = dhakaParts();
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function addDaysToKey(key: string, delta: number): string {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + delta));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

export function formatReportAmount(value: number, locale: string): string {
  try {
    return new Intl.NumberFormat(
      locale === "bn" ? "bn-BD" : locale === "hi" ? "hi-IN" : "en-US",
      { minimumFractionDigits: 2, maximumFractionDigits: 2 },
    ).format(value);
  } catch {
    return value.toFixed(2);
  }
}

export function formatPnlAmount(value: number, locale: string): string {
  const abs = formatReportAmount(Math.abs(value), locale);
  if (value < 0) return `-${abs}`;
  return abs;
}

export function pnlColor(value: number): string {
  if (value > 0) return "#16a34a";
  if (value < 0) return "#dc2626";
  return "#6b7280";
}

export function formatRangeLabel(from: string, to: string): string {
  const fmt = (key: string) => {
    const [, m, d] = key.split("-");
    return `${m}/${d}`;
  };
  return `${fmt(from)} - ${fmt(to)}`;
}

export const CATEGORY_ICON_STYLES: Record<
  ProfitLossCategory,
  { bg: string; label: string }
> = {
  all: { bg: "#f3f4f6", label: "▦" },
  slot: { bg: "#7c4dff", label: "777" },
  live: { bg: "#ff7043", label: "♣" },
  sports: { bg: "#43a047", label: "⚽" },
  poker: { bg: "#f06292", label: "♠" },
  fishing: { bg: "#26a69a", label: "🐟" },
};
