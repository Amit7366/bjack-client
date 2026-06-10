import type { MemberCenterItemId } from "@/lib/i18n/member-center-messages";

const GOLD = "#d4a13c";
const GOLD_DARK = "#b8862c";
const GOLD_FILL = "#ecca7c";

type IconProps = { size?: number };

function Svg({ children, size = 30 }: IconProps & { children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      {children}
    </svg>
  );
}

function RewardCenterIcon() {
  return (
    <Svg>
      <path
        d="M9 6h14v6a7 7 0 01-14 0V6z"
        fill={GOLD_FILL}
        stroke={GOLD_DARK}
        strokeWidth="1.6"
      />
      <path
        d="M9 8H5.5a4.5 4.5 0 004.5 5M23 8h3.5a4.5 4.5 0 01-4.5 5"
        stroke={GOLD_DARK}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M16 19v4" stroke={GOLD_DARK} strokeWidth="1.6" />
      <path d="M11 26h10M13 23h6" stroke={GOLD_DARK} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M14 9.5l2-2 2 2-2 2-2-2z" fill="#fff" opacity="0.7" />
    </Svg>
  );
}

function BettingRecordIcon() {
  return (
    <Svg>
      <path
        d="M16 4l2.2 7.2L16 16l-2.2-4.8L16 4zM28 16l-7.2 2.2L16 16l4.8-2.2L28 16zM16 28l-2.2-7.2L16 16l2.2 4.8L16 28zM4 16l7.2-2.2L16 16l-4.8 2.2L4 16z"
        fill={GOLD_FILL}
        stroke={GOLD_DARK}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="16" r="2" fill={GOLD_DARK} />
    </Svg>
  );
}

function ProfitAndLossIcon() {
  return (
    <Svg>
      <rect x="6" y="5" width="20" height="22" rx="2" fill={GOLD_FILL} stroke={GOLD_DARK} strokeWidth="1.6" />
      <circle cx="16" cy="13" r="4.5" fill="#fff" opacity="0.6" />
      <path
        d="M17.8 10.8h-3.2a1.4 1.4 0 000 2.8h2.8a1.4 1.4 0 010 2.8h-3.2M16 9.6v8"
        stroke={GOLD_DARK}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path d="M10 21.5h12M10 24.5h8" stroke={GOLD_DARK} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

function ClipboardIcon({ arrow }: { arrow: "up" | "down" }) {
  return (
    <Svg>
      <rect x="6" y="6" width="20" height="22" rx="2" fill={GOLD_FILL} stroke={GOLD_DARK} strokeWidth="1.6" />
      <rect x="11" y="3.5" width="10" height="5" rx="1.5" fill="#fff" stroke={GOLD_DARK} strokeWidth="1.4" />
      <path d="M10.5 14h11M10.5 17.5h7" stroke={GOLD_DARK} strokeWidth="1.5" strokeLinecap="round" />
      {arrow === "up" ? (
        <path
          d="M21 25.5v-4.5M21 21l-2.2 2.2M21 21l2.2 2.2"
          stroke={GOLD_DARK}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M21 21v4.5M21 25.5l-2.2-2.2M21 25.5l2.2-2.2"
          stroke={GOLD_DARK}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </Svg>
  );
}

function AccountRecordIcon() {
  return (
    <Svg>
      <rect x="6" y="4" width="17" height="22" rx="2" fill={GOLD_FILL} stroke={GOLD_DARK} strokeWidth="1.6" />
      <path d="M10 10h9M10 14h9M10 18h5" stroke={GOLD_DARK} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="21.5" cy="21.5" r="5" fill="#fff" stroke={GOLD_DARK} strokeWidth="1.6" />
      <path d="M25 25l3 3" stroke={GOLD_DARK} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="21.5" cy="21.5" r="2" stroke={GOLD_DARK} strokeWidth="1.3" />
    </Svg>
  );
}

function MyAccountIcon() {
  return (
    <Svg>
      <circle cx="16" cy="16" r="12" fill={GOLD_FILL} stroke={GOLD_DARK} strokeWidth="1.6" />
      <circle cx="16" cy="13" r="4" fill="#fff" stroke={GOLD_DARK} strokeWidth="1.4" />
      <path
        d="M8.5 24.5c1.4-3.6 4.2-5.5 7.5-5.5s6.1 1.9 7.5 5.5"
        fill="#fff"
        stroke={GOLD_DARK}
        strokeWidth="1.4"
      />
    </Svg>
  );
}

function SecurityCenterIcon() {
  return (
    <Svg>
      <path
        d="M16 3.5l10 3.5v8c0 6.5-4.2 11-10 13.5C10.2 26 6 21.5 6 15V7l10-3.5z"
        fill={GOLD_FILL}
        stroke={GOLD_DARK}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="13" r="3" fill="#fff" stroke={GOLD_DARK} strokeWidth="1.3" />
      <path d="M11.5 21c1-2.4 2.7-3.7 4.5-3.7s3.5 1.3 4.5 3.7" fill="#fff" stroke={GOLD_DARK} strokeWidth="1.3" />
    </Svg>
  );
}

function InviteFriendsIcon() {
  return (
    <Svg>
      <circle cx="13.5" cy="12" r="4.5" fill={GOLD_FILL} stroke={GOLD_DARK} strokeWidth="1.5" />
      <path
        d="M5.5 25c1.5-4 4.5-6 8-6s6.5 2 8 6"
        fill={GOLD_FILL}
        stroke={GOLD_DARK}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M24 10v8M20 14h8" stroke={GOLD_DARK} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

function MissionIcon() {
  return (
    <Svg>
      <rect x="5" y="12" width="22" height="15" rx="1.5" fill={GOLD_FILL} stroke={GOLD_DARK} strokeWidth="1.6" />
      <rect x="4" y="9" width="24" height="5" rx="1" fill="#fff" stroke={GOLD_DARK} strokeWidth="1.4" />
      <path d="M16 9v18" stroke={GOLD_DARK} strokeWidth="1.6" />
      <path
        d="M16 9c-3 0-5.5-1.4-5.5-3.4S13 2.8 16 5c3-2.2 5.5-1.4 5.5.6S19 9 16 9z"
        fill="#fff"
        stroke={GOLD_DARK}
        strokeWidth="1.3"
      />
    </Svg>
  );
}

function RebateIcon() {
  return (
    <Svg>
      <ellipse cx="14" cy="22" rx="8" ry="3.5" fill={GOLD_FILL} stroke={GOLD_DARK} strokeWidth="1.4" />
      <ellipse cx="14" cy="18.5" rx="8" ry="3.5" fill={GOLD_FILL} stroke={GOLD_DARK} strokeWidth="1.4" />
      <circle cx="21" cy="11" r="6.5" fill="#fff" stroke={GOLD_DARK} strokeWidth="1.5" />
      <path
        d="M22.8 8.8h-2.6a1.2 1.2 0 000 2.4h1.6a1.2 1.2 0 010 2.4h-2.6M21 7.6v7"
        stroke={GOLD_DARK}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function InternalMessageIcon() {
  return (
    <Svg>
      <circle cx="16" cy="16" r="12" fill={GOLD_FILL} stroke={GOLD_DARK} strokeWidth="1.6" />
      <path
        d="M20.5 11.5a6 6 0 10-1 9.6c1.6.9 3.5.4 3.5.4s-1.3-1.1-1.1-2.4"
        fill="#fff"
        stroke={GOLD_DARK}
        strokeWidth="1.4"
      />
      <circle cx="16" cy="16" r="2.2" stroke={GOLD_DARK} strokeWidth="1.3" />
    </Svg>
  );
}

function SuggestionIcon() {
  return (
    <Svg>
      <path
        d="M5 8a2 2 0 012-2h18a2 2 0 012 2v12a2 2 0 01-2 2H13l-5 4v-4H7a2 2 0 01-2-2V8z"
        fill={GOLD_FILL}
        stroke={GOLD_DARK}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M10 12h12M10 16h8" stroke={GOLD_DARK} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M22 14.5l1-2 1 2-1 1-1-1z" fill="#fff" />
    </Svg>
  );
}

function DownloadAppIcon() {
  return (
    <Svg>
      <rect x="9" y="3.5" width="14" height="25" rx="2.5" fill={GOLD_FILL} stroke={GOLD_DARK} strokeWidth="1.6" />
      <path d="M13 6h6" stroke={GOLD_DARK} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="16" cy="25" r="1.2" fill={GOLD_DARK} />
      <path
        d="M16 11v7M16 18l-3-3M16 18l3-3"
        stroke={GOLD_DARK}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CustomerServiceIcon() {
  return (
    <Svg>
      <circle cx="16" cy="16" r="12" fill={GOLD_FILL} stroke={GOLD_DARK} strokeWidth="1.6" />
      <path
        d="M10 17v-1.5a6 6 0 0112 0V17"
        stroke={GOLD_DARK}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect x="8.5" y="15.5" width="3" height="5" rx="1.5" fill="#fff" stroke={GOLD_DARK} strokeWidth="1.2" />
      <rect x="20.5" y="15.5" width="3" height="5" rx="1.5" fill="#fff" stroke={GOLD_DARK} strokeWidth="1.2" />
      <path d="M22 20.5c0 2-2 3.5-4.5 3.5" stroke={GOLD_DARK} strokeWidth="1.3" strokeLinecap="round" />
    </Svg>
  );
}

function LogoutIcon() {
  return (
    <Svg>
      <circle cx="16" cy="16" r="12" fill={GOLD_FILL} stroke={GOLD_DARK} strokeWidth="1.6" />
      <path
        d="M14 10.5h-3.5v11H14"
        stroke={GOLD_DARK}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 16h8M22.5 16l-2.8-2.8M22.5 16l-2.8 2.8"
        stroke={GOLD_DARK}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function MemberCenterItemIcon({ name }: { name: MemberCenterItemId }) {
  switch (name) {
    case "reward-center":
      return <RewardCenterIcon />;
    case "betting-record":
      return <BettingRecordIcon />;
    case "profit-and-loss":
      return <ProfitAndLossIcon />;
    case "deposit-record":
      return <ClipboardIcon arrow="up" />;
    case "withdrawal-record":
      return <ClipboardIcon arrow="down" />;
    case "account-record":
      return <AccountRecordIcon />;
    case "my-account":
      return <MyAccountIcon />;
    case "security-center":
      return <SecurityCenterIcon />;
    case "invite-friends":
      return <InviteFriendsIcon />;
    case "mission":
      return <MissionIcon />;
    case "rebate":
      return <RebateIcon />;
    case "internal-message":
      return <InternalMessageIcon />;
    case "suggestion":
      return <SuggestionIcon />;
    case "download-app":
      return <DownloadAppIcon />;
    case "customer-service":
      return <CustomerServiceIcon />;
    case "logout":
      return <LogoutIcon />;
    default:
      return null;
  }
}

export function VipMedalIcon({ size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M5 1.5h6l-1.5 4h-3L5 1.5z" fill="#8fa3b8" />
      <circle cx="8" cy="9.5" r="4.5" fill="#c8d4e0" stroke="#8fa3b8" />
      <path d="M8 7.2l.8 1.6 1.7.2-1.2 1.2.3 1.7L8 11l-1.6.9.3-1.7-1.2-1.2 1.7-.2L8 7.2z" fill="#7d92a8" />
    </svg>
  );
}

/** Big silver badge watermark behind the account card. */
export function SilverBadgeWatermark() {
  return (
    <svg
      width="150"
      height="170"
      viewBox="0 0 150 170"
      fill="none"
      aria-hidden
      className="opacity-70"
    >
      <path d="M55 8h40l-10 34H65L55 8z" fill="#cdd6e2" />
      <path d="M95 8h22l-18 40-13-8 9-32z" fill="#bcc7d6" />
      <path d="M55 8H33l18 40 13-8-9-32z" fill="#dbe2eb" />
      <circle cx="75" cy="95" r="58" fill="#e3e9f0" />
      <circle cx="75" cy="95" r="48" fill="#cdd7e3" />
      <circle cx="75" cy="95" r="38" fill="#dde4ed" />
      <path
        d="M75 65l9 18 20 3-14.5 14 3.5 20-18-9.5L57 120l3.5-20L46 86l20-3 9-18z"
        fill="#b3c0d1"
      />
    </svg>
  );
}

export function CopyIdIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="5.5" y="5.5" width="8" height="9" rx="1.5" fill="#2b2b2b" />
      <rect x="2.5" y="1.5" width="8" height="9" rx="1.5" fill="#2b2b2b" stroke="#fff" strokeWidth="1" />
    </svg>
  );
}

export function EditPencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M11.3 2.2l2.5 2.5-8.3 8.3-3.2.7.7-3.2 8.3-8.3z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RefreshBalanceIcon({ spinning }: { spinning?: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className={spinning ? "animate-spin" : undefined}
    >
      <path
        d="M16.5 4v3.8h-3.8M3.5 16v-3.8h3.8M16.5 4a7 7 0 00-11.7-1.5M3.5 16a7 7 0 0011.7 1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SignInEnvelopeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="1.5" y="3" width="13" height="10" rx="1.5" fill="#fff" />
      <path d="M2 4l6 5 6-5" stroke="#d22b1f" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

export function HeaderBackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M12.5 4.5L7 10l5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DefaultAvatarIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 64 64" fill="none" aria-hidden>
      <rect width="64" height="64" fill="#e8edf3" />
      <circle cx="32" cy="25" r="11" fill="#aab8c9" />
      <path d="M10 58c3.5-12 12-18 22-18s18.5 6 22 18" fill="#aab8c9" />
    </svg>
  );
}
