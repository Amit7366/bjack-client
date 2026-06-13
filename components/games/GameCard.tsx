"use client";

import Image from "next/image";
import { isValidGameImageUrl, normalizeGameImage } from "@/lib/vendor-games-data";
import { useGamePlayGate } from "./GamePlayGateProvider";

function BjMark() {
  return (
    <span className="text-[8px] font-bold leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] lg:text-[11px]">
      <span className="text-white">bk</span>
      <span className="text-[#ed1c24]">b</span>
    </span>
  );
}

function GameImagePlaceholder({ title, provider }: { title?: string; provider?: string }) {
  const displayTitle = title?.trim() || "Game";
  const displayProvider = provider?.trim();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[#1f1f1f] px-2 py-3 text-center">
      <p className="line-clamp-4 text-[10px] font-semibold leading-snug text-white sm:text-[11px] lg:text-xs">
        {displayTitle}
      </p>
      {displayProvider ? (
        <p className="mt-1.5 line-clamp-2 text-[9px] font-medium uppercase tracking-wide text-[#9ca3af] sm:text-[10px]">
          {displayProvider}
        </p>
      ) : null}
    </div>
  );
}

export type GameCardProps = {
  image: string;
  /** Client-side game id shown in toast with title */
  gameId?: string;
  /** Provider game_code from server game data */
  gameCode?: string;
  title?: string;
  provider?: string;
  priority?: boolean;
  sizes?: string;
  onClick?: () => void;
  className?: string;
  imageClassName?: string;
  contentClassName?: string;
  unoptimized?: boolean;
  ariaLabel?: string;
};

export default function GameCard(props: GameCardProps) {
  const { handleGameClick } = useGamePlayGate();
  const src = normalizeGameImage(props.image);
  const hasImage = isValidGameImageUrl(src);
  const alt =
    props.title && props.provider ? `${props.title} — ${props.provider}` : "";
  const defaultClassName =
    "group relative block w-full overflow-hidden rounded-md bg-[#141414] text-left shadow-[0_2px_10px_rgba(0,0,0,0.35)] transition-transform duration-200 active:scale-[0.98] lg:rounded-[10px] lg:shadow-[0_4px_16px_rgba(0,0,0,0.35)] lg:active:scale-100 lg:hover:scale-[1.02]";
  const buttonClass = (props.className ?? defaultClassName).trim();

  function handleClick() {
    handleGameClick({
      title: props.title,
      gameId: props.gameId,
      gameCode: props.gameCode,
      onAuthorized: props.onClick,
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={props.ariaLabel}
      className={buttonClass}
    >
      <div className={`relative aspect-[3/4] w-full ${props.contentClassName ?? ""}`.trim()}>
        {hasImage ? (
          <Image
            src={src}
            alt={alt}
            fill
            priority={props.priority}
            sizes={props.sizes ?? "(max-width: 1023px) 33vw, 12.5vw"}
            className={`object-cover object-center ${props.imageClassName ?? ""}`.trim()}
            unoptimized={props.unoptimized}
          />
        ) : (
          <GameImagePlaceholder title={props.title} provider={props.provider} />
        )}
        <span className="absolute right-1 top-1 z-[2] lg:right-2 lg:top-2">
          <BjMark />
        </span>
      </div>
    </button>
  );
}
