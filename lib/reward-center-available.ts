import { fetchRewardOffers } from "@/lib/reward-offers-api";
import { fetchRescueFundClaimableCount } from "@/lib/rescue-fund-api";
import { fetchSignInRewardStatus } from "@/lib/sign-in-reward-api";

/** Count claimable bonus offers, sign-in, and rescue fund rewards when available. */
export async function countAvailableRewards(): Promise<number> {
  const [offers, signIn, rescueFundCount] = await Promise.all([
    fetchRewardOffers().catch(() => [] as Awaited<ReturnType<typeof fetchRewardOffers>>),
    fetchSignInRewardStatus().catch(() => null),
    fetchRescueFundClaimableCount().catch(() => 0),
  ]);

  let count = offers.filter((offer) => offer.canClaim).length;

  if (signIn?.canClaimToday && signIn.minimumDepositMet) {
    count += 1;
  }

  count += rescueFundCount;
  return count;
}

/** Count claimable bonus offers only (reward-center bonus tile). */
export async function countAvailableBonusOffers(): Promise<number> {
  const offers = await fetchRewardOffers().catch(
    () => [] as Awaited<ReturnType<typeof fetchRewardOffers>>,
  );
  return offers.filter((offer) => offer.canClaim).length;
}
