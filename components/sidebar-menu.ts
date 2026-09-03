export type SidebarSubItem = {
  id: string;
  accent?: string;
};

export type SidebarMenuItem = {
  id: string;
  kind?: "link" | "dropdown" | "external";
  externalUrl?: string;
  showViewAll?: boolean;
  subItems?: SidebarSubItem[];
};

export const sidebarPrimaryItems: SidebarMenuItem[] = [
  { id: "exclusive", kind: "link" },
  {
    id: "sports",
    kind: "dropdown",
    subItems: [
      { id: "all" },
      { id: "cricket" },
      { id: "football" },
      { id: "tennis" },
    ],
  },
  {
    id: "casino",
    kind: "dropdown",
    subItems: [
      { id: "all" },
      { id: "evolution" },
      { id: "pragmatic" },
      { id: "sexy" },
    ],
  },
  {
    id: "slots",
    kind: "dropdown",
    subItems: [
      { id: "all" },
      { id: "jdb" },
      { id: "pg" },
      { id: "jili" },
    ],
  },
  {
    id: "crash",
    kind: "dropdown",
    subItems: [
      { id: "all" },
      { id: "aviator" },
      { id: "spribe" },
    ],
  },
  {
    id: "table",
    kind: "dropdown",
    subItems: [
      { id: "all" },
      { id: "baccarat" },
      { id: "roulette" },
    ],
  },
  {
    id: "fishing",
    kind: "dropdown",
    subItems: [
      { id: "all" },
      { id: "jdb" },
      { id: "jili" },
    ],
  },
  {
    id: "arcade",
    kind: "dropdown",
    subItems: [
      { id: "all" },
      { id: "jdb", accent: "#f5a623" },
      { id: "fachai", accent: "#3b82f6" },
      { id: "pragmatic", accent: "#f97316" },
      { id: "rich88", accent: "#a855f7" },
      { id: "youlian", accent: "#38bdf8" },
      { id: "hacksaw", accent: "#e5e7eb" },
    ],
  },
  {
    id: "lottery",
    kind: "dropdown",
    subItems: [
      { id: "all" },
      { id: "tc" },
      { id: "king" },
    ],
  },
  {
    id: "promotions",
    kind: "dropdown",
    showViewAll: true,
    subItems: [
      { id: "all" },
      { id: "welcome" },
      { id: "cashback" },
    ],
  },
];

export const sidebarSecondaryItems: SidebarMenuItem[] = [
  { id: "vipClub", kind: "link" },
  { id: "referral", kind: "link" },
  { id: "affiliate", kind: "external", externalUrl: "https://aff.city777.shop/" },
  { id: "brandAmbassadors", kind: "link" },
  { id: "appDownload", kind: "link" },
  {
    id: "contactUs",
    kind: "dropdown",
    subItems: [{ id: "liveChat" }, { id: "email" }, { id: "telegram" }],
  },
  { id: "newMemberGuide", kind: "external" },
  { id: "bjForum", kind: "external" },
];

export const sidebarMenuItems: SidebarMenuItem[] = [
  ...sidebarPrimaryItems,
  ...sidebarSecondaryItems,
];
