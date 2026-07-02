"use client";

import Link from "next/link";
import { useState } from "react";
import {
  categoryProviders,
  homeTabIds,
  type HomeTabId,
  type PopularGame,
} from "@/lib/home-games-data";
import { categoryProviderHref, lobbyCategoryHref } from "@/lib/vendor-routes";
import ProviderLogo from "./ProviderLogo";
import { useLocale } from "./LocaleProvider";
import GameCard from "./games/GameCard";
import HomeTabAnimatedIcon from "./HomeTabAnimatedIcon";

function ProviderCard({
  id,
  label,
  color,
  initials,
  activeTab,
}: {
  id: string;
  label: string;
  color: string;
  initials: string;
  activeTab: Exclude<HomeTabId, "popular">;
}) {
  const { preferences } = useLocale();
  const href = categoryProviderHref(preferences.locale, activeTab, id);

  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-md bg-[#262626] px-2.5 py-2.5 transition-colors hover:bg-[#303030]"
    >
      <ProviderLogo providerKey={id} initials={initials} color={color} size="sm" />
      <span className="truncate text-[12px] font-medium leading-snug text-[#e5e5e5]">{label}</span>
    </Link>
  );
}

export default function HomeGameTabs({ popularGames }: { popularGames: PopularGame[] }) {
  const { t, preferences } = useLocale();
  const [activeTab, setActiveTab] = useState<HomeTabId>("popular");

  return (
    <section className="bg-[#0a0a0a]">
      <div className="mx-auto w-full max-w-[1400px] px-3 py-4 sm:px-4 lg:px-10 xl:px-16">
      <div className="flex gap-1 overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {homeTabIds.map((tabId) => {
          const active = activeTab === tabId;
          return (
            <button
              key={tabId}
              type="button"
              onClick={() => setActiveTab(tabId)}
              className={`focus-ring flex min-h-11 min-w-[76px] shrink-0 flex-col items-center justify-center gap-1 rounded-lg px-2 py-2 transition-colors sm:min-w-[84px] ${
                active
                  ? "bg-[#178358] text-white"
                  : "text-[#a3a3a3] hover:bg-[#1f1f1f] hover:text-white"
              }`}
            >
              <span className="flex h-7 w-7 items-center justify-center">
                <HomeTabAnimatedIcon
                  tabId={tabId}
                  isActive={activeTab === tabId}
                  isInitialActive={tabId === "popular"}
                />
              </span>
              <span className="text-center text-[10px] font-medium leading-snug sm:text-[11px]">
                {t.home.tabs[tabId]}
              </span>
            </button>
          );
        })}
      </div>

      {activeTab === "popular" ? (
        <div>
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 lg:grid-cols-9 lg:gap-2.5">
            {popularGames.map((game, index) => (
              <GameCard
                key={game.id}
                gameId={game.id}
                gameCode={game.gameCode}
                title={t.home.games[game.id] ?? game.id}
                provider={t.home.providers[game.providerKey] ?? game.providerKey}
                image={game.image}
                priority={index < 4}
                className="group relative block w-full overflow-hidden rounded-md bg-[#141414] text-left shadow-[0_2px_10px_rgba(0,0,0,0.35)] transition-transform duration-200 active:scale-[0.98] lg:rounded-[10px] lg:shadow-[0_4px_16px_rgba(0,0,0,0.35)] lg:active:scale-100 lg:hover:scale-[1.02]"
              />
            ))}
          </div>
          <div className="mt-4 flex justify-center sm:mt-5">
            <Link
              href={lobbyCategoryHref(preferences.locale, "slot")}
              className="focus-ring inline-flex min-h-11 items-center rounded-md bg-[#178358] px-10 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1a9664]"
            >
              {t.home.more}
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {categoryProviders[activeTab].map((provider) => (
            <ProviderCard
              key={provider.id}
              id={provider.id}
              label={t.home.providers[provider.id] ?? provider.id}
              color={provider.color}
              initials={provider.initials}
              activeTab={activeTab}
            />
          ))}
        </div>
      )}
      </div>
    </section>
  );
}
