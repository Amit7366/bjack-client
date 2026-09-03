export const USER_ROLE = "user" as const;

export const AUTH_TOKEN_COOKIE = "city777_token";
export const AUTH_ROLE_COOKIE = "city777_role";

/** ~30 days — aligned with long-lived refresh sessions */
export const AUTH_COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 30;
