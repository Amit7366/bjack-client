export const REFERRAL_BANNER_IMAGE =
  "https://i.ibb.co.com/xrSP5vL/referral-program.png";

export type ReferralRewardLevel = {
  id: string;
  level: number;
  rate: string;
};

export type ReferralRangeStat = {
  id: "turnover" | "deposit" | "winloss";
  value: string;
};

export type ReferralTopRank = {
  id: string;
  rank: 1 | 2 | 3;
  username: string;
  amount: string;
  avatarSeed: string;
};

export type ReferralRecentWinner = {
  id: string;
  username: string;
  amount: string;
  timestamp: string;
};

export const referralRewardLevels: ReferralRewardLevel[] = [
  { id: "l1", level: 1, rate: "0.1%" },
  { id: "l2", level: 2, rate: "0.05%" },
  { id: "l3", level: 3, rate: "0.01%" },
];

export const referralRangeStats: ReferralRangeStat[] = [
  { id: "turnover", value: "100" },
  { id: "deposit", value: "0" },
  { id: "winloss", value: "0" },
];

export const referralTopRanks: ReferralTopRank[] = [
  { id: "r2", rank: 2, username: "key****123", amount: "16,232.32", avatarSeed: "key123" },
  { id: "r1", rank: 1, username: "badr****san4...", amount: "18,910.86", avatarSeed: "badr" },
  { id: "r3", rank: 3, username: "si****500", amount: "11,655.89", avatarSeed: "si500" },
];

export const referralRecentWinners: ReferralRecentWinner[] = [
  { id: "w1", username: "**lonbd**", amount: "21.25", timestamp: "2026-05-19 18:49:22" },
  { id: "w2", username: "**hasinahm**", amount: "18.50", timestamp: "2026-05-19 18:47:10" },
  { id: "w3", username: "**rakib88**", amount: "32.00", timestamp: "2026-05-19 18:45:03" },
  { id: "w4", username: "**sumaiya**", amount: "15.75", timestamp: "2026-05-19 18:42:18" },
  { id: "w5", username: "**nabil12**", amount: "9.20", timestamp: "2026-05-19 18:40:55" },
  { id: "w6", username: "**farhan**", amount: "44.10", timestamp: "2026-05-19 18:38:31" },
  { id: "w7", username: "**mim2024**", amount: "12.80", timestamp: "2026-05-19 18:36:09" },
  { id: "w8", username: "**arifbd**", amount: "27.60", timestamp: "2026-05-19 18:33:44" },
];
