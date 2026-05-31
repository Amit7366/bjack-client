"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Messages } from "@/lib/i18n/messages";
import { LOBBY_GAME_TYPE_IDS, type LobbyGameTypeId } from "@/lib/lobby-game-types";
import { LOBBY_GAMES_PAGE_SIZE } from "@/lib/lobby-pagination";
import { lobbyFilterProviderRows, providerLabelKeyForVendorCode } from "@/lib/lobby-filter-providers";
import {
  LOBBY_HEADER_MENU_KINDS,
  LOBBY_VENDOR_ALL,
  isAllLobbyVendors,
  lobbyCategoryHref,
  type LobbyKind,
} from "@/lib/vendor-routes";
import type { GameTile } from "@/lib/game-tile";
import { menuIconFor } from "./SidebarIcons";
import { useLocale } from "./LocaleProvider";
import GameCard from "./games/GameCard";

function lobbyCategoryLabel(t: Messages, kind: LobbyKind): string {
  if (kind === "sports") return t.home.tabs.sports;
  return t.lobby.categories[kind];
}

function menuIconIdForKind(kind: LobbyKind): string {
  if (kind === "slot") return "slots";
  return kind;
}

function FilterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className="text-[#a3a3a3]">
      <path d="M3 5h14M6 10h8M9 15h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="5" cy="5" r="1.5" fill="currentColor" />
      <circle cx="14" cy="10" r="1.5" fill="currentColor" />
      <circle cx="11" cy="15" r="1.5" fill="currentColor" />
    </svg>
  );
}

function SortIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className="text-[#a3a3a3]">
      <path d="M3 5h9M3 9.5h6M3 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15 5v9M15 14l-1.8-1.8M15 14l1.8-1.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type LobbySortMode = "recommend" | "a-z" | "z-a" | "new-old" | "old-new";

const SORT_OPTIONS: LobbySortMode[] = ["recommend", "a-z", "z-a", "new-old", "old-new"];

function sortLabel(t: Messages, mode: LobbySortMode): string {
  switch (mode) {
    case "recommend":
      return t.lobby.sortRecommend;
    case "a-z":
      return t.lobby.sortAZ;
    case "z-a":
      return t.lobby.sortZA;
    case "new-old":
      return t.lobby.sortNewOld;
    case "old-new":
      return t.lobby.sortOldNew;
    default:
      return t.lobby.sortRecommend;
  }
}

/** Lower index in source list = newer (top of API / curated list). */
function applyLobbySort(list: GameTile[], mode: LobbySortMode, order: Map<string, number>): GameTile[] {
  const arr = [...list];
  const rank = (id: string) => order.get(id) ?? 1e6;
  switch (mode) {
    case "recommend":
      return arr;
    case "a-z":
      return arr.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: "base" }));
    case "z-a":
      return arr.sort((a, b) => b.title.localeCompare(a.title, undefined, { sensitivity: "base" }));
    case "new-old":
      return arr.sort((a, b) => rank(a.id) - rank(b.id));
    case "old-new":
      return arr.sort((a, b) => rank(b.id) - rank(a.id));
    default:
      return arr;
  }
}

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden
      className={`shrink-0 text-[#a3a3a3] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path d="M1.5 3.5L5 7l3.5-3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AccordionChevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={`shrink-0 text-white transition-transform duration-200 ${open ? "" : "rotate-180"}`}
    >
      <path d="M3.5 9L7 5.5l3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden className="shrink-0 text-[#6b7280]">
      <circle cx="7.5" cy="7.5" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 11l4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className="text-white">
      <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function vendorDisplayName(t: Messages, kind: LobbyKind, vendorCode: string): string {
  const labelKey = providerLabelKeyForVendorCode(kind, vendorCode);
  if (labelKey && t.home.providers[labelKey]) return t.home.providers[labelKey];
  return vendorCode
    .replace(/^awcv2_/i, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function pushLobbyUrl(
  router: ReturnType<typeof useRouter>,
  pathname: string,
  kind: LobbyKind,
  nextVendors: string[],
  nextTypes: string[],
) {
  const q = new URLSearchParams();
  const vNorm = nextVendors.length > 0 ? nextVendors : [LOBBY_VENDOR_ALL];
  q.set("vendor", vNorm.join(","));
  if (nextTypes.length) q.set("type", nextTypes.join(","));
  router.push(`${pathname}?${q.toString()}`);
}

function ProviderFilterAvatar({ label }: { label: string }) {
  const initials = label.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase() || "?";
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#262626] text-[10px] font-bold text-[#d4d4d4]">
      {initials}
    </div>
  );
}

type VendorGamesLobbyProps = {
  locale: string;
  kind: LobbyKind;
  vendors: string[];
  activeTypes: string[];
  games: GameTile[];
};

export default function VendorGamesLobby({ locale, kind, vendors, activeTypes, games }: VendorGamesLobbyProps) {
  const { t } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const categoryLabel = lobbyCategoryLabel(t, kind);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [sortMode, setSortMode] = useState<LobbySortMode>("recommend");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterPortalReady, setFilterPortalReady] = useState(false);
  const [providersOpen, setProvidersOpen] = useState(true);
  const [gameTypesOpen, setGameTypesOpen] = useState(true);
  const [draftVendors, setDraftVendors] = useState<Set<string>>(() => new Set(vendors));
  const [draftTypes, setDraftTypes] = useState<Set<string>>(() => new Set(activeTypes));
  const [visibleCount, setVisibleCount] = useState(LOBBY_GAMES_PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const menuWrapRef = useRef<HTMLDivElement>(null);
  const sortWrapRef = useRef<HTMLDivElement>(null);

  const vendorQuery = isAllLobbyVendors(vendors) ? LOBBY_VENDOR_ALL : vendors.join(",");
  const vendorTagsForChips = isAllLobbyVendors(vendors) ? [] : vendors;
  const typeTagsForChips = activeTypes;
  const hasActiveFilterChips = vendorTagsForChips.length > 0 || typeTagsForChips.length > 0;

  const removeVendorChip = (code: string) => {
    const next = vendors.filter((v) => v !== code);
    const normalized = next.length > 0 ? next : [LOBBY_VENDOR_ALL];
    pushLobbyUrl(router, pathname, kind, normalized, activeTypes);
  };

  const removeTypeChip = (typeId: string) => {
    pushLobbyUrl(
      router,
      pathname,
      kind,
      vendors,
      activeTypes.filter((x) => x !== typeId),
    );
  };

  useEffect(() => {
    setFilterPortalReady(true);
  }, []);

  useEffect(() => {
    if (!filterOpen) return;
    setDraftVendors(isAllLobbyVendors(vendors) ? new Set() : new Set(vendors));
    setDraftTypes(new Set(activeTypes));
  }, [vendors, activeTypes, filterOpen]);

  useEffect(() => {
    if (!filterOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [filterOpen]);
  const sourceOrder = useMemo(() => new Map(games.map((g, i) => [g.id, i])), [games]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return games;
    return games.filter(
      (g) =>
        g.title.toLowerCase().includes(q) || g.providerLabel.toLowerCase().includes(q),
    );
  }, [games, query]);

  const sortedGames = useMemo(
    () => applyLobbySort(filtered, sortMode, sourceOrder),
    [filtered, sortMode, sourceOrder],
  );

  const totalGames = sortedGames.length;
  const visibleGames = useMemo(
    () => sortedGames.slice(0, visibleCount),
    [sortedGames, visibleCount],
  );
  const canLoadMore = visibleCount < totalGames;
  const progressPct = totalGames > 0 ? Math.min(100, (visibleCount / totalGames) * 100) : 0;

  useEffect(() => {
    setVisibleCount(LOBBY_GAMES_PAGE_SIZE);
  }, [games, query, sortMode, vendors, activeTypes]);

  const handleLoadMore = () => {
    if (!canLoadMore || loadingMore) return;
    setLoadingMore(true);
    window.setTimeout(() => {
      setVisibleCount((n) => Math.min(n + LOBBY_GAMES_PAGE_SIZE, totalGames));
      setLoadingMore(false);
    }, 280);
  };

  function formatShownGames(shown: number, total: number): string {
    return t.lobby.shownGames.replace("{shown}", String(shown)).replace("{total}", String(total));
  }

  const applyFiltersToUrl = () => {
    const vArr = draftVendors.size > 0 ? Array.from(draftVendors) : [LOBBY_VENDOR_ALL];
    const tyArr = Array.from(draftTypes);
    pushLobbyUrl(router, pathname, kind, vArr, tyArr);
    setFilterOpen(false);
  };

  const clearFilterDraft = () => {
    setDraftVendors(new Set());
    setDraftTypes(new Set());
  };

  const openFilterPanel = () => {
    setMenuOpen(false);
    setSortMenuOpen(false);
    setDraftVendors(isAllLobbyVendors(vendors) ? new Set() : new Set(vendors));
    setDraftTypes(new Set(activeTypes));
    setProvidersOpen(true);
    setGameTypesOpen(true);
    setFilterOpen(true);
  };

  const providerRows = useMemo(() => lobbyFilterProviderRows(kind), [kind]);

  function gameTypeChipLabel(typeId: string): string {
    if (LOBBY_GAME_TYPE_IDS.includes(typeId as LobbyGameTypeId)) {
      return t.lobby.gameTypes[typeId as LobbyGameTypeId];
    }
    return typeId;
  }

  useEffect(() => {
    if (!menuOpen && !sortMenuOpen && !filterOpen) return;
    function onPointerDown(e: PointerEvent) {
      if (!menuOpen && !sortMenuOpen) return;
      const node = e.target as Node;
      if (menuWrapRef.current?.contains(node)) return;
      if (sortWrapRef.current?.contains(node)) return;
      setMenuOpen(false);
      setSortMenuOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSortMenuOpen(false);
        setFilterOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, sortMenuOpen, filterOpen]);

  const iconId = menuIconIdForKind(kind);

  function gameTypeLabel(id: LobbyGameTypeId): string {
    return t.lobby.gameTypes[id];
  }

  return (
    <div className="min-h-full bg-[#0a0a0a] pb-8 lg:pb-8 max-lg:pb-mobile-nav">
      <div className="border-b border-[#1f1f1f]">
        <div className="mx-auto w-full max-w-[1400px] px-3 py-3 sm:px-4 lg:px-10 xl:px-16">
        <div className="mb-3 flex items-center justify-between">
          <div className="relative min-w-0" ref={menuWrapRef}>
            <button
              type="button"
              className="focus-ring flex max-w-full items-center gap-2 rounded-md bg-transparent py-1.5 pr-1 text-left"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              aria-controls="lobby-category-menu"
              aria-label={t.lobby.pickCategory}
              onClick={() => {
                setSortMenuOpen(false);
                setMenuOpen((o) => !o);
              }}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center">{menuIconFor(iconId)}</span>
              <span className="truncate text-[15px] font-semibold text-white">{categoryLabel}</span>
              <ChevronDown open={menuOpen} />
            </button>

            {menuOpen ? (
              <div
                id="lobby-category-menu"
                role="menu"
                aria-label={t.lobby.pickCategory}
                className="absolute left-0 top-[calc(100%+6px)] z-50 min-w-[min(100vw-2rem,280px)] overflow-hidden rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] py-1 shadow-[0_12px_40px_rgba(0,0,0,0.65)]"
              >
                {LOBBY_HEADER_MENU_KINDS.map((menuKind) => {
                  const href = lobbyCategoryHref(locale, menuKind);
                  const active = menuKind === kind;
                  const itemIconId = menuIconIdForKind(menuKind);
                  return (
                    <Link
                      key={menuKind}
                      role="menuitem"
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[#262626] ${active ? "bg-[#2a2a2a]" : ""
                        }`}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center">{menuIconFor(itemIconId)}</span>
                      <span className="truncate text-[14px] font-medium text-white">{lobbyCategoryLabel(t, menuKind)}</span>
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              aria-label={t.lobby.filter}
              className="focus-ring flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-white/5"
              onClick={openFilterPanel}
            >
              <FilterIcon />
            </button>
            <div className="relative" ref={sortWrapRef}>
              <button
                type="button"
                aria-expanded={sortMenuOpen}
                aria-haspopup="menu"
                aria-controls="lobby-sort-menu"
                aria-label={t.lobby.pickSort}
                className="focus-ring flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-white/5"
                onClick={() => {
                  setMenuOpen(false);
                  setSortMenuOpen((o) => !o);
                }}
              >
                <SortIcon />
              </button>
              {sortMenuOpen ? (
                <div
                  id="lobby-sort-menu"
                  role="menu"
                  aria-label={t.lobby.pickSort}
                  className="absolute right-0 top-[calc(100%+6px)] z-50 min-w-[200px] overflow-hidden rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] py-1 shadow-[0_12px_40px_rgba(0,0,0,0.65)]"
                >
                  {SORT_OPTIONS.map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setSortMode(mode);
                        setSortMenuOpen(false);
                      }}
                      className={`flex w-full px-3 py-2.5 text-left text-[14px] font-medium text-white transition-colors hover:bg-[#262626] ${sortMode === mode ? "bg-[#2a2a2a]" : ""
                        }`}
                    >
                      {sortLabel(t, mode)}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="relative flex items-center gap-2 rounded-md border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2.5">
          <SearchIcon />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.lobby.searchPlaceholder}
            className="min-w-0 flex-1 bg-transparent text-[14px] text-white placeholder:text-[#5c5c5c] outline-none"
          />
        </div>

        {hasActiveFilterChips ? (
          <div className="mt-2 flex flex-wrap gap-2" aria-label={t.lobby.filterPanelTitle}>
            {vendorTagsForChips.map((code) => {
              const name = vendorDisplayName(t, kind, code);
              return (
                <button
                  key={`v-${code}`}
                  type="button"
                  className="inline-flex max-w-full items-center gap-1.5 rounded-md bg-[#2a2a2a] py-1 pl-2.5 pr-1.5 text-left text-[13px] font-medium text-[#e5e5e5] transition-colors hover:bg-[#333333]"
                  aria-label={`${t.lobby.removeFilterTag}: ${name}`}
                  onClick={() => removeVendorChip(code)}
                >
                  <span className="min-w-0 truncate">{name}</span>
                  <span className="shrink-0 text-[15px] leading-none text-[#9ca3af] hover:text-white" aria-hidden>
                    ×
                  </span>
                </button>
              );
            })}
            {typeTagsForChips.map((typeId) => {
              const name = gameTypeChipLabel(typeId);
              return (
                <button
                  key={`t-${typeId}`}
                  type="button"
                  className="inline-flex max-w-full items-center gap-1.5 rounded-md bg-[#2a2a2a] py-1 pl-2.5 pr-1.5 text-left text-[13px] font-medium text-[#e5e5e5] transition-colors hover:bg-[#333333]"
                  aria-label={`${t.lobby.removeFilterTag}: ${name}`}
                  onClick={() => removeTypeChip(typeId)}
                >
                  <span className="min-w-0 truncate">{name}</span>
                  <span className="shrink-0 text-[15px] leading-none text-[#9ca3af] hover:text-white" aria-hidden>
                    ×
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-3 pt-4 sm:px-4 lg:px-10 xl:px-16">
        <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-3 sm:gap-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {visibleGames.map((game) => (
            <GameCard
              key={game.id}
              gameId={game.id}
              gameCode={game.gameCode}
              image={game.image}
              title={game.title}
              provider={game.providerLabel}
              sizes="(max-width: 640px) 33vw, (max-width: 1023px) 25vw, 12.5vw"
              imageClassName="transition-transform duration-200 group-hover:scale-105"
              ariaLabel={`${game.title} — ${game.providerLabel}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-md bg-[#141414]"
            />
          ))}
        </div>

        {totalGames === 0 ? (
          <p className="mx-auto mt-8 max-w-md rounded-lg border border-dashed border-[#2a2a2a] bg-[#141414] px-4 py-10 text-center text-sm text-[#9ca3af]">
            {t.lobby.noGamesFound}
          </p>
        ) : null}

        {totalGames > 0 ? (
          <div className="mt-8 flex flex-col items-center gap-3 pb-2">
            {canLoadMore ? (
              <button
                type="button"
                disabled={loadingMore}
                onClick={handleLoadMore}
                className="focus-ring min-h-11 min-w-[140px] rounded-md bg-[#2a2a2a] px-8 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#353535] disabled:cursor-wait disabled:opacity-70"
              >
                {loadingMore ? "…" : t.lobby.loadMore}
              </button>
            ) : null}
            <div
              className="h-1 w-full max-w-md overflow-hidden rounded-full bg-[#2a2a2a]"
              role="progressbar"
              aria-valuenow={Math.round(progressPct)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-[#178358] transition-[width] duration-300 ease-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-center text-[13px] text-[#9ca3af]">
              {formatShownGames(Math.min(visibleCount, totalGames), totalGames)}
            </p>
          </div>
        ) : null}

        <div className="mt-6 flex justify-center">
          <Link
            href={`/${locale}`}
            className="text-sm font-medium text-[#4ade80] underline-offset-2 hover:underline"
          >
            ← {t.ui.backHome}
          </Link>
        </div>
      </div>

      {filterPortalReady && filterOpen
        ? createPortal(
            <div
              className="fixed inset-0 z-[60] flex flex-col justify-end bg-black/55 lg:flex-row lg:justify-end"
              role="presentation"
              onClick={() => setFilterOpen(false)}
            >
              <aside
                className="flex max-h-[min(92dvh,100dvh)] w-full flex-col rounded-t-2xl bg-[#121212] shadow-2xl lg:h-full lg:max-h-none lg:max-w-md lg:rounded-none"
                role="dialog"
                aria-modal="true"
                aria-labelledby="lobby-filter-title"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex shrink-0 justify-center pt-2.5 lg:hidden" aria-hidden>
                  <span className="h-1 w-10 rounded-full bg-[#555]" />
                </div>

                <header className="flex shrink-0 items-center justify-between border-b border-[#2a2a2a] px-4 py-3">
                  <h2 id="lobby-filter-title" className="text-lg font-bold text-white">
                    {t.lobby.filterPanelTitle}
                  </h2>
                  <button
                    type="button"
                    className="focus-ring rounded-md p-2 hover:bg-white/10"
                    aria-label={t.lobby.filterClose}
                    onClick={() => setFilterOpen(false)}
                  >
                    <CloseIcon />
                  </button>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-4 [-webkit-overflow-scrolling:touch]">
                  <div className="border-b border-[#2a2a2a]">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between px-2 py-3 text-left"
                      onClick={() => setProvidersOpen((o) => !o)}
                      aria-expanded={providersOpen}
                    >
                      <span className="text-[15px] font-semibold text-white">{t.lobby.filterProviders}</span>
                      <AccordionChevron open={providersOpen} />
                    </button>
                    {providersOpen ? (
                      <ul className="pb-2 pl-1">
                        {providerRows.map((row) => {
                          const name =
                            t.home.providers[row.labelKey as keyof typeof t.home.providers] ?? row.labelKey;
                          const checked = draftVendors.has(row.vendorCode);
                          return (
                            <li key={row.vendorCode}>
                              <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-2 py-2.5 hover:bg-white/[0.04]">
                                <span className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded border border-[#404040] bg-[#1a1a1a]">
                                  <input
                                    type="checkbox"
                                    className="peer sr-only"
                                    checked={checked}
                                    onChange={() => {
                                      setDraftVendors((prev) => {
                                        const n = new Set(prev);
                                        if (n.has(row.vendorCode)) n.delete(row.vendorCode);
                                        else n.add(row.vendorCode);
                                        return n;
                                      });
                                    }}
                                  />
                                  <span className="pointer-events-none hidden text-[11px] font-bold text-emerald-500 peer-checked:block">
                                    ✓
                                  </span>
                                </span>
                                <ProviderFilterAvatar label={name} />
                                <span className="truncate text-[14px] text-[#b3b3b3]">{name}</span>
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </div>

                  <div className="border-b border-[#2a2a2a]">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between px-2 py-3 text-left"
                      onClick={() => setGameTypesOpen((o) => !o)}
                      aria-expanded={gameTypesOpen}
                    >
                      <span className="text-[15px] font-semibold text-white">{t.lobby.filterGameType}</span>
                      <AccordionChevron open={gameTypesOpen} />
                    </button>
                    {gameTypesOpen ? (
                      <ul className="pb-2 pl-1">
                        {LOBBY_GAME_TYPE_IDS.map((typeId) => {
                          const checked = draftTypes.has(typeId);
                          return (
                            <li key={typeId}>
                              <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-2 py-2.5 hover:bg-white/[0.04]">
                                <span className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded border border-[#404040] bg-[#1a1a1a]">
                                  <input
                                    type="checkbox"
                                    className="peer sr-only"
                                    checked={checked}
                                    onChange={() => {
                                      setDraftTypes((prev) => {
                                        const n = new Set(prev);
                                        if (n.has(typeId)) n.delete(typeId);
                                        else n.add(typeId);
                                        return n;
                                      });
                                    }}
                                  />
                                  <span className="pointer-events-none hidden text-[11px] font-bold text-emerald-500 peer-checked:block">
                                    ✓
                                  </span>
                                </span>
                                <span className="truncate text-[14px] text-[#b3b3b3]">{gameTypeLabel(typeId)}</span>
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </div>
                </div>

                <footer className="safe-bottom flex shrink-0 gap-2 border-t border-[#2a2a2a] bg-[#121212] p-3">
                  <button
                    type="button"
                    className="focus-ring min-h-11 flex-1 rounded-md border border-[#3f3f3f] py-3 text-[14px] font-semibold text-[#d4d4d4] transition-colors hover:bg-white/[0.06]"
                    onClick={clearFilterDraft}
                  >
                    {t.lobby.filterClearAll}
                  </button>
                  <button
                    type="button"
                    className="focus-ring min-h-11 flex-[1.15] rounded-md bg-[#178358] py-3 text-[14px] font-bold text-white transition-colors hover:bg-[#1a9664]"
                    onClick={applyFiltersToUrl}
                  >
                    {t.lobby.filterApply}
                  </button>
                </footer>
              </aside>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
