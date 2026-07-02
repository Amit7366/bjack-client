const STORAGE_KEY = "bkbaji.deviceFingerprint";

let fingerprintPromise: Promise<string> | null = null;

function readCachedFingerprint(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const value = sessionStorage.getItem(STORAGE_KEY);
    return value?.trim() ? value : null;
  } catch {
    return null;
  }
}

function writeCachedFingerprint(value: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* ignore quota / private mode */
  }
}

/**
 * Returns a stable browser visitor id for referral device checks.
 * Cached for the current tab session.
 */
export async function getDeviceFingerprint(): Promise<string> {
  const cached = readCachedFingerprint();
  if (cached) return cached;

  if (!fingerprintPromise) {
    fingerprintPromise = (async () => {
      const FingerprintJS = await import("@fingerprintjs/fingerprintjs");
      const agent = await FingerprintJS.load();
      const result = await agent.get();
      const visitorId = result.visitorId?.trim();
      if (!visitorId) {
        throw new Error("Device verification failed");
      }
      writeCachedFingerprint(visitorId);
      return visitorId;
    })();
  }

  return fingerprintPromise;
}
