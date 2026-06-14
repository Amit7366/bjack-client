import type { ApiGameTxnRecord } from "@/lib/betting-records-api";
import type { BettingRecord, BettingResult } from "@/lib/betting-records-data";
import type { Locale } from "@/lib/locale";

const GAME_TYPE_LABELS: Record<string, { en: string; bn: string; hi: string }> = {
  slot: { en: "Slots", bn: "স্লট", hi: "स्लॉट" },
  fish: { en: "Fishing", bn: "ফিশিং", hi: "फिशिंग" },
  fishing: { en: "Fishing", bn: "ফিশিং", hi: "फिशिंग" },
  live: { en: "Live Casino", bn: "লাইভ ক্যাসিনো", hi: "लाइव कैसीनो" },
  sport: { en: "Sports", bn: "স্পোর্টস", hi: "स्पोर्ट्स" },
  sports: { en: "Sports", bn: "স্পোর্টস", hi: "स्पोर्ट्स" },
  all: { en: "Games", bn: "গেম", hi: "गेम" },
};

function categoryLabel(gameType: string | undefined, locale: Locale): string {
  const key = (gameType || "all").toLowerCase();
  const entry = GAME_TYPE_LABELS[key] ?? GAME_TYPE_LABELS.all;
  if (locale === "bn") return entry.bn;
  if (locale === "hi") return entry.hi;
  return entry.en;
}

function gameTitle(row: ApiGameTxnRecord, locale: Locale): string {
  const name = row.game?.name?.trim();
  if (name) return name;
  return locale === "bn" ? "অজানা গেম" : locale === "hi" ? "अज्ञात गेम" : "Unknown game";
}

function mapResult(bet: number, win: number): BettingResult {
  if (bet > 0 && win === bet) return "void";
  if (win > bet) return "won";
  if (win > 0) return "won";
  return "lost";
}

export function mapGameTxnToRecord(row: ApiGameTxnRecord, locale: Locale): BettingRecord {
  const stake = Number(row.bet) || 0;
  const payout = Number(row.win) || 0;
  const settledAt =
    typeof row.providerTsUtc === "string"
      ? row.providerTsUtc
      : new Date(row.providerTsUtc).toISOString();

  return {
    id: row.txnId,
    betId: row.gameRound ? `${row.txnId} · ${row.gameRound}` : row.txnId,
    gameName: gameTitle(row, locale),
    category: categoryLabel(row.game?.type, locale),
    stake,
    payout,
    result: mapResult(stake, payout),
    settledAt,
    status: "completed",
  };
}
