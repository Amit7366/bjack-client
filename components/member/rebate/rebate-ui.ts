export const REBATE_LIGHT_BG = "min-h-full bg-[#f3f4f6]";

export const REBATE_TAB_ACTIVE = "#2196F3";

export type RebateRowId = "date" | "slot" | "live" | "sports" | "poker" | "fish" | "total";

export const REBATE_ROW_STYLES: Record<
  RebateRowId,
  { labelBg: string; accent: string }
> = {
  date: { labelBg: "#f08080", accent: "#f08080" },
  slot: { labelBg: "#4a90d9", accent: "#4a90d9" },
  live: { labelBg: "#9b7bd4", accent: "#9b7bd4" },
  sports: { labelBg: "#4db6ac", accent: "#4db6ac" },
  poker: { labelBg: "#f06292", accent: "#f06292" },
  fish: { labelBg: "#e57373", accent: "#e57373" },
  total: { labelBg: "#3f51b5", accent: "#3f51b5" },
};

export function formatRebateAmount(value: number, locale: string): string {
  try {
    return new Intl.NumberFormat(
      locale === "bn" ? "bn-BD" : locale === "hi" ? "hi-IN" : "en-US",
      { minimumFractionDigits: 2, maximumFractionDigits: 2 },
    ).format(value);
  } catch {
    return value.toFixed(2);
  }
}

export function formatRebateDateLabel(isoDay: string): string {
  return isoDay;
}

export function formatHistoryCardDate(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatRangeLabel(from: string, to: string): string {
  const fmt = (key: string) => {
    const [, m, d] = key.split("-");
    return `${m}/${d}`;
  };
  if (from === to) return `${fmt(from)} - ${fmt(to)}`;
  return `${fmt(from)} - ${fmt(to)}`;
}

export function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
