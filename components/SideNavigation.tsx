"use client";

import Link from "next/link";
import type { SidebarMenuItem } from "./sidebar-menu";
import PromotionSidebarSlider from "./promotions/PromotionSidebarSlider";
import {
  sidebarMenuItems,
  sidebarPrimaryItems,
  sidebarSecondaryItems,
} from "./sidebar-menu";
import { ExternalLinkIcon, LiveSupportIcon, SubItemIcon, menuIconFor } from "./SidebarIcons";
import { sidebarItemHref, sidebarSubItemHref } from "@/lib/sidebar-routes";
import { BKBAJI_ANDROID_APP_PATH } from "@/lib/seo/site-config";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { memberLiveChatHref } from "@/lib/member-routes";
import { useLocale } from "./LocaleProvider";

type SideNavigationProps = {
  expanded: boolean;
  expandedId: string | null;
  onToggleItem: (id: string) => void;
  onItemClick: (id: string) => void;
  onExpand: () => void;
};

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden
      className={`block shrink-0 text-[#a8a8a8] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M1.5 3.5L5 7l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PromoBanner() {
  const { t } = useLocale();

  return (
    <div className="mx-2 mb-2 shrink-0 overflow-hidden rounded-lg">
      <div className="relative flex min-h-[72px] items-center overflow-hidden rounded-lg bg-gradient-to-r from-[#2a0808] via-[#5c1010] to-[#8b1a1a] px-3 py-2.5">
        <p className="min-w-0 flex-1 pr-[84px] text-[11px] font-semibold uppercase leading-[1.45] tracking-wide text-white/95 sm:text-[12px]">
          {t.promoSponsor}
        </p>
        <div className="absolute -right-1 bottom-0 top-0 flex w-[88px] items-center justify-center">
          <div className="flex h-14 w-14 flex-col items-center justify-center rounded-full bg-[#1a2d6e] text-center shadow-lg">
            <span className="text-[9px] font-bold leading-none text-[#f5c518]">MI</span>
            <span className="mt-0.5 text-[7px] font-semibold leading-none text-white">EMIRATES</span>
          </div>
        </div>
      </div>
    </div>
  );
}

type MenuRowProps = {
  item: SidebarMenuItem;
  expandedId: string | null;
  onToggleItem: (id: string) => void;
};

function MenuRow({ item, expandedId, onToggleItem }: MenuRowProps) {
  const { t, preferences } = useLocale();
  const kind = item.kind ?? (item.subItems?.length ? "dropdown" : "link");
  const isOpen = expandedId === item.id;
  const label = t.sidebar[item.id] ?? item.id;
  const isPromotions = item.id === "promotions";

  const icon = (
    <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center">
      {menuIconFor(item.id)}
    </span>
  );

  if (kind === "link") {
    const href = sidebarItemHref(preferences.locale, item.id);
    const rowClass =
      "flex w-full items-center gap-3 px-3 py-[13px] text-left transition-opacity hover:opacity-90";
    if (href === BKBAJI_ANDROID_APP_PATH) {
      return (
        <a href={href} download className={rowClass}>
          {icon}
          <span className="min-w-0 flex-1 text-[14px] font-normal leading-snug text-[#c8c8c8]">{label}</span>
          <span className="w-4 shrink-0" />
        </a>
      );
    }
    if (href) {
      return (
        <Link href={href} className={rowClass}>
          {icon}
          <span className="min-w-0 flex-1 text-[14px] font-normal leading-snug text-[#c8c8c8]">{label}</span>
          <span className="w-4 shrink-0" />
        </Link>
      );
    }
    return (
      <a href="#" className={rowClass}>
        {icon}
        <span className="min-w-0 flex-1 text-[14px] font-normal leading-snug text-[#c8c8c8]">{label}</span>
        <span className="w-4 shrink-0" />
      </a>
    );
  }

  if (kind === "external") {
    const externalHref = item.externalUrl ?? "#";
    return (
      <a
        href={externalHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center gap-3 px-3 py-[13px] text-left transition-opacity hover:opacity-90"
      >
        {icon}
        <span className="min-w-0 flex-1 text-[14px] font-normal leading-snug text-[#c8c8c8]">{label}</span>
        <span className="flex w-4 shrink-0 items-center justify-end">
          <ExternalLinkIcon />
        </span>
      </a>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => onToggleItem(item.id)}
        className="focus-ring flex w-full items-center gap-3 px-3 py-[13px] text-left transition-opacity hover:opacity-90"
        aria-expanded={isOpen}
      >
        {icon}
        <span className="min-w-0 flex-1 text-[14px] font-normal leading-snug text-[#c8c8c8]">{label}</span>
        <span className="flex shrink-0 items-center gap-2">
          {item.showViewAll ? (
            <Link
              href={`/${preferences.locale}/promotion`}
              onClick={(e) => e.stopPropagation()}
              className="text-[12px] font-medium text-[#4ade80] underline-offset-2 hover:underline"
            >
              {t.viewAll}
            </Link>
          ) : null}
          <Chevron open={isOpen} />
        </span>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          {isPromotions && isOpen ? (
            <PromotionSidebarSlider />
          ) : (
            <div className="space-y-1 px-2 pb-1">
              {item.subItems?.map((sub) => {
                const href = sidebarSubItemHref(preferences.locale, item.id, sub.id);
                const rowClass =
                  "flex items-center gap-3 rounded-md bg-[#242424] px-3 py-2.5 text-[13px] text-[#d8d8d8] transition-colors hover:bg-[#2e2e2e]";
                const content = (
                  <>
                    <SubItemIcon id={sub.id} label={t.sub[sub.id] ?? sub.id} accent={sub.accent} />
                    <span className="truncate">{t.sub[sub.id] ?? sub.id}</span>
                  </>
                );
                if (href) {
                  const isExternal = href.startsWith("http") || href.startsWith("mailto:");
                  if (isExternal) {
                    return (
                      <a
                        key={sub.id}
                        href={href}
                        target={href.startsWith("mailto:") ? undefined : "_blank"}
                        rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                        className={rowClass}
                      >
                        {content}
                      </a>
                    );
                  }
                  return (
                    <Link key={sub.id} href={href} className={rowClass}>
                      {content}
                    </Link>
                  );
                }
                return (
                  <a key={sub.id} href="#" className={rowClass}>
                    {content}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SideNavigation({
  expanded,
  expandedId,
  onToggleItem,
  onItemClick,
  onExpand,
}: SideNavigationProps) {
  const { t, preferences } = useLocale();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  function goLiveChat() {
    const href = memberLiveChatHref(preferences.locale);
    if (!isAuthenticated) {
      router.push(`/${preferences.locale}/login?next=${encodeURIComponent(href)}`);
      return;
    }
    router.push(href);
    onItemClick("");
  }

  return (
    <aside
      className={`relative z-20 flex h-full max-h-full min-h-0 shrink-0 flex-col border-r border-[#2a2a2a] bg-[#1a1a1a] transition-[width] duration-300 ease-in-out ${
        expanded
          ? "w-[min(100vw,272px)] max-lg:fixed max-lg:bottom-0 max-lg:left-0 max-lg:top-[52px] max-lg:z-30"
          : "w-0 overflow-hidden border-r-0 max-lg:hidden lg:w-[52px] lg:overflow-visible lg:border-r"
      }`}
    >
      <div className={`shrink-0 p-2 ${expanded ? "" : "flex justify-center"}`}>
        <button
          type="button"
          onClick={goLiveChat}
          className={
            expanded
              ? "flex w-full items-center gap-3 rounded-lg bg-[#262626] px-3 py-3 text-left text-[14px] font-medium text-white transition-colors hover:bg-[#303030]"
              : "flex h-10 w-10 items-center justify-center rounded-lg bg-[#262626] transition-colors hover:bg-[#303030]"
          }
        >
          <LiveSupportIcon />
          {expanded ? <span>{t.liveSupport}</span> : null}
        </button>
      </div>

      {expanded ? <PromoBanner /> : null}

      <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]">
        {expanded ? (
          <div className="pb-3">
            {sidebarPrimaryItems.map((item) => (
              <MenuRow
                key={item.id}
                item={item}
                expandedId={expandedId}
                onToggleItem={onToggleItem}
              />
            ))}

            <div className="my-1 border-t border-[#2a2a2a]" />

            {sidebarSecondaryItems.map((item) => (
              <MenuRow
                key={item.id}
                item={item}
                expandedId={expandedId}
                onToggleItem={onToggleItem}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-0.5 px-1 py-1">
            {sidebarMenuItems.map((item) => {
              const href = sidebarItemHref(preferences.locale, item.id);
              const label = t.sidebar[item.id] ?? item.id;
              const railClass =
                "focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-[#262626]";
              if (href === BKBAJI_ANDROID_APP_PATH) {
                return (
                  <a
                    key={item.id}
                    href={href}
                    download
                    aria-label={label}
                    className={railClass}
                  >
                    {menuIconFor(item.id)}
                  </a>
                );
              }
              if (item.kind === "external" && item.externalUrl) {
                return (
                  <a
                    key={item.id}
                    href={item.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={railClass}
                  >
                    {menuIconFor(item.id)}
                  </a>
                );
              }
              if (href) {
                return (
                  <Link key={item.id} href={href} aria-label={label} className={railClass}>
                    {menuIconFor(item.id)}
                  </Link>
                );
              }
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-label={label}
                  onClick={() => onItemClick(item.id)}
                  className={railClass}
                >
                  {menuIconFor(item.id)}
                </button>
              );
            })}
          </div>
        )}
      </nav>
    </aside>
  );
}
