export type JwtAuthClaims = {
  id?: string;
  role?: string;
  email?: string;
  userName?: string;
  contactNo?: string;
};

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
