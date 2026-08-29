const GAME_SESSION_PENDING_KEY = "rajabaji.gameSessionPending";

let memoryPending = false;

function canUseSessionStorage(): boolean {
  return typeof window !== "undefined";
}

/** Survives full redirect to the game provider (same tab, same origin on return). */
export function markGameSessionPending() {
  memoryPending = true;
  if (!canUseSessionStorage()) return;
  try {
    sessionStorage.setItem(GAME_SESSION_PENDING_KEY, "1");
  } catch {
    /* private mode / quota */
  }
}

export function clearGameSessionPending() {
  memoryPending = false;
  if (!canUseSessionStorage()) return;
  try {
    sessionStorage.removeItem(GAME_SESSION_PENDING_KEY);
  } catch {
    /* ignore */
  }
}

export function isGameSessionPending(): boolean {
  if (memoryPending) return true;
  if (!canUseSessionStorage()) return false;
  try {
    return sessionStorage.getItem(GAME_SESSION_PENDING_KEY) === "1";
  } catch {
    return false;
  }
}
