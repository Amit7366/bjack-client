export type DepositBonusPreview = {
  applicable: true;
  bonusAmount: number;
  bonusRate: number;
  turnoverX: number;
  totalCredited: number;
  tierNumber: number | null;
  isTierBonus: boolean;
  successfulDeposits: number;
};

export type DepositBonusPreviewResult =
  | DepositBonusPreview
  | { applicable: false };

export function formatNormalBonusHint(
  isBn: boolean,
  preview: DepositBonusPreview,
): string {
  const pct = Math.round(preview.bonusRate * 100);
  const bonusStr = preview.bonusAmount.toLocaleString("en-US");

  if (preview.isTierBonus && preview.tierNumber) {
    const tierLabel = isBn
      ? `${preview.tierNumber === 1 ? "প্রথম" : preview.tierNumber === 2 ? "দ্বিতীয়" : "তৃতীয়"} ডিপোজিট`
      : `${preview.tierNumber === 1 ? "1st" : preview.tierNumber === 2 ? "2nd" : "3rd"} deposit`;
    return isBn
      ? `${tierLabel}: ${pct}% বোনাস (৳${bonusStr}) · ${preview.turnoverX}× টার্নওভার`
      : `${tierLabel}: ${pct}% bonus (৳${bonusStr}) · ${preview.turnoverX}× turnover`;
  }

  return isBn
    ? `${pct}% বোনাস (৳${bonusStr}) · ১× টার্নওভার`
    : `${pct}% bonus (৳${bonusStr}) · 1× turnover`;
}

export function formatNormalBonusVerifyMessage(
  isBn: boolean,
  preview: DepositBonusPreview,
): string {
  const bonusStr = preview.bonusAmount.toLocaleString("en-US");

  if (preview.isTierBonus) {
    const pct = Math.round(preview.bonusRate * 100);
    return isBn
      ? `ভেরিফিকেশনের পর ${pct}% বোনাস (৳${bonusStr}) পাবেন · ${preview.turnoverX}× টার্নওভার`
      : `You will receive a ${pct}% bonus (৳${bonusStr}) after verification · ${preview.turnoverX}× turnover`;
  }

  const pct = Math.round(preview.bonusRate * 100);
  return isBn
    ? `ভেরিফিকেশনের পর ${pct}% বোনাস (৳${bonusStr}) পাবেন`
    : `You will receive a ${pct}% bonus (৳${bonusStr}) after verification`;
}
