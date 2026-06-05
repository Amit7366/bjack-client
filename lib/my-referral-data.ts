export type ReferralMonthlyMilestone = {
  id: string;
  invites: number;
  reward: number;
};

export const referralMonthlyMilestones: ReferralMonthlyMilestone[] = [
  { id: "m5", invites: 5, reward: 500 },
  { id: "m15", invites: 15, reward: 1300 },
  { id: "m25", invites: 25, reward: 2100 },
  { id: "m50", invites: 50, reward: 8100 },
  { id: "m100", invites: 100, reward: 11000 },
  { id: "m200", invites: 200, reward: 21000 },
];
