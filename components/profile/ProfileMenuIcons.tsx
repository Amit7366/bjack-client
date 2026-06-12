/** Bottom nav size (28×28) */
export function BottomProfileNavIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
      <circle cx="14" cy="14" r="12" fill="#3d2e0a" stroke="#f5c518" strokeWidth="1.2" />
      <circle cx="14" cy="10.5" r="4" fill="#f5c518" />
      <path
        d="M7 22c1.4-3.2 3.8-4.8 7-4.8s5.6 1.6 7 4.8"
        stroke="#f5c518"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ProfileNavIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="10" fill="#3d2e0a" stroke="#f5c518" strokeWidth="1" />
      <circle cx="11" cy="8.5" r="3.2" fill="#f5c518" />
      <path
        d="M5.5 17.5c1.2-2.8 3.4-4.2 5.5-4.2s4.3 1.4 5.5 4.2"
        stroke="#f5c518"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="8" height="12" viewBox="0 0 8 12" fill="none" aria-hidden className="shrink-0 opacity-60">
      <path
        d="M1.5 1l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <rect x="4.5" y="4.5" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M3 9.5V3.5A1.5 1.5 0 014.5 2H9.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ProfileMenuIcon({ name }: { name: string }) {
  const common = "shrink-0";
  switch (name) {
    case "bell":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className={common}>
          <path
            d="M10 3a4.5 4.5 0 00-4.5 4.5v2.2L4 12.5h12l-1.5-2.8V7.5A4.5 4.5 0 0010 3z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <path d="M8 14.5a2 2 0 004 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case "user":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className={common}>
          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="10" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M5.5 15c1-2 2.7-3 4.5-3s3.5 1 4.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case "lock":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className={common}>
          <rect x="5" y="9" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
          <path
            d="M7 9V6.5a3 3 0 016 0V9"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
      );
    case "shield":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className={common}>
          <path
            d="M10 3l6 2.5v5c0 3.5-2.5 5.8-6 6.5-3.5-.7-6-3-6-6.5v-5L10 3z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <path d="M7.5 10l1.8 1.8 3.7-3.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "transaction":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className={common}>
          <rect x="4" y="3" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="14" cy="13" r="2.5" fill="#178358" stroke="currentColor" strokeWidth="0.8" />
        </svg>
      );
    case "betting":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className={common}>
          <rect x="4" y="3" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.2" />
          <path d="M8 10h4M10 8v4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
      );
    case "chart":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className={common}>
          <path d="M4 15l4-5 3 3 5-8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 16h14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case "crown":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className={common}>
          <path
            d="M3 14h14l-1.5-8-3.5 5L10 5 7.5 11 3 6 1.5 14z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <rect x="4" y="14" width="12" height="2" rx="0.5" fill="currentColor" />
        </svg>
      );
    case "referral":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className={common}>
          <circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="13" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="10" cy="13" r="2.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M8.5 8.5l1 2M11.5 8.5l-1 2M8.8 11.2l2.4.8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
      );
    case "wallet":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className={common}>
          <rect x="3" y="5.5" width="14" height="10" rx="1.8" stroke="currentColor" strokeWidth="1.2" />
          <path d="M3 8h14" stroke="currentColor" strokeWidth="1.1" />
          <path d="M13 11.5h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M6 3.5h8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
      );
    case "member":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className={common}>
          <path
            d="M6 4.5h8l4.5 6.5-8.5 8.5L2 11 6 4.5z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path
            d="M2.8 11h14.4M6 4.5l2.5 6.5 2.5-3 2.5 3L14 4.5"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinejoin="round"
            opacity="0.85"
          />
        </svg>
      );
    default:
      return null;
  }
}

export { ChevronRight, CopyIcon };
