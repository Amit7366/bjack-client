export type AccountStatus = "active" | "frozen" | "deactivated" | "pending";

export function isAccountStatus(value: string | undefined | null): value is AccountStatus {
  return (
    value === "active" ||
    value === "frozen" ||
    value === "deactivated" ||
    value === "pending"
  );
}

export function canPlayGames(status?: string | null): boolean {
  return !status || status === "active";
}

export function canWithdraw(status?: string | null): boolean {
  return !status || status === "active";
}
