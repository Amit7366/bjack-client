export type JwtAuthClaims = {
  exp?: number;
  id?: string;
  objectId?: string;
  role?: string;
  email?: string;
  userName?: string;
  contactNo?: string;
};

/** True when the access token is past expiry (with optional leeway). */
export function isJwtExpired(token: string, leewaySeconds = 30): boolean {
  const claims = parseJwtPayload(token);
  if (!claims?.exp) return false;
  return Date.now() >= (claims.exp - leewaySeconds) * 1000;
}

export function parseJwtPayload(token: string): JwtAuthClaims | null {
  try {
    const segment = token.split(".")[1];
    if (!segment) return null;
    const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const json =
      typeof atob !== "undefined"
        ? atob(padded)
        : Buffer.from(padded, "base64").toString("utf8");
    return JSON.parse(json) as JwtAuthClaims;
  } catch {
    return null;
  }
}
