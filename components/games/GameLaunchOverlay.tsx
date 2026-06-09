"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

type GameLaunchOverlayProps = {
  open: boolean;
  gameTitle?: string;
  /** balance = waiting for PHP preview; launch = opening game URL */
  phase?: "balance" | "launch";
};

export default function GameLaunchOverlay({
  open,
  gameTitle,
  phase = "launch",
}: GameLaunchOverlayProps) {
  const updatingBalance = phase === "balance";
  const [mounted, setMounted] = useState(
    () => typeof document !== "undefined",
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;
  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#050505]/92 backdrop-blur-md"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={gameTitle ? `Launching ${gameTitle}` : "Launching game"}
    >
      <div className="pointer-events-none flex flex-col items-center px-6 text-center">
        <div className="relative mb-8 h-28 w-28">
          <span className="absolute inset-0 rounded-full border-2 border-[#178358]/25" />
          <span className="absolute inset-0 animate-game-launch-ping rounded-full border border-[#178358]/50" />
          <span className="absolute inset-2 animate-game-launch-spin rounded-full border-[3px] border-transparent border-t-[#178358] border-r-[#22c55e]" />
          <span className="absolute inset-5 animate-game-launch-spin-slow rounded-full border-2 border-transparent border-b-[#fbbf24] border-l-[#178358]/60" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="text-[28px] font-black leading-none tracking-tighter">
              <span className="text-white">b</span>
              <span className="text-[#ed1c24]">j</span>
            </span>
          </span>
        </div>

        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#178358]">
          {updatingBalance ? "Balance sync" : "Please wait"}
        </p>
        <h2 className="mt-2 max-w-[min(90vw,320px)] text-[18px] font-semibold text-white sm:text-[20px]">
          {updatingBalance
            ? "Updating your balance"
            : gameTitle
              ? `Launching ${gameTitle}`
              : "Launching your game"}
        </h2>
        <p className="mt-2 text-[13px] text-[#9ca3af]">
          {updatingBalance
            ? "Fetching your latest game results…"
            : "Connecting to the game server…"}
        </p>

        <div className="mt-8 flex h-1 w-48 overflow-hidden rounded-full bg-[#1f1f1f]">
          <span className="h-full w-1/3 animate-game-launch-bar rounded-full bg-gradient-to-r from-[#178358] via-[#22c55e] to-[#178358]" />
        </div>
      </div>
    </div>,
    document.body,
  );
}
