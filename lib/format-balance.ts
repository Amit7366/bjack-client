/** Format wallet balance for UI. Never shows negatives — ≤ 0 renders as 0.00. */
export function formatDisplayBalance(amount: string | undefined, locale: string): string {
  const num = Number.parseFloat(amount ?? "0");
  if (!Number.isFinite(num)) return "0.00";
  const safe = Math.max(0, num);
  try {
    return new Intl.NumberFormat(locale === "bn" ? "bn-BD" : locale === "hi" ? "hi-IN" : "en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(safe);
  } catch {
    return safe.toFixed(2);
  }
}
