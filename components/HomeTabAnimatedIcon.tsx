"use client";

import { useEffect, useRef, useState } from "react";
import type { HomeTabId } from "@/lib/home-games-data";
import {
  getHomeTabSpriteMetrics,
  HOME_TAB_ICON_SIZE,
  homeTabAnimatedIconUrl,
} from "@/lib/home-tab-icons";

type IconPhase = "idle" | "ended" | "playing-forward" | "playing-reverse";

type HomeTabAnimatedIconProps = {
  tabId: HomeTabId;
  isActive: boolean;
  isInitialActive?: boolean;
};

export default function HomeTabAnimatedIcon({
  tabId,
  isActive,
  isInitialActive = false,
}: HomeTabAnimatedIconProps) {
  const [phase, setPhase] = useState<IconPhase>(isInitialActive ? "ended" : "idle");
  const wasActiveRef = useRef(isInitialActive);

  const { bgWidth, endX } = getHomeTabSpriteMetrics();

  useEffect(() => {
    if (isActive === wasActiveRef.current) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isActive) {
      if (prefersReducedMotion) {
        setPhase("ended");
        wasActiveRef.current = true;
        return;
      }

      setPhase("idle");
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setPhase("playing-forward"));
      });
      wasActiveRef.current = true;
      return () => cancelAnimationFrame(frame);
    }

    if (prefersReducedMotion) {
      setPhase("idle");
      wasActiveRef.current = false;
      return;
    }

    setPhase("playing-reverse");
    wasActiveRef.current = false;
  }, [isActive]);

  const showActiveSize =
    isActive || phase === "ended" || phase === "playing-reverse";

  const backgroundPosition =
    phase === "idle" ? "0 center" : phase === "ended" ? `${endX}px center` : undefined;

  function handleAnimationEnd() {
    if (phase === "playing-forward") {
      setPhase("ended");
      return;
    }

    if (phase === "playing-reverse") {
      setPhase("idle");
    }
  }

  return (
    <span
      aria-hidden
      className={`home-tab-icon-sprite block h-7 w-7 shrink-0 ${
        showActiveSize ? "home-tab-icon-sprite--active" : ""
      } ${phase === "playing-forward" ? "home-tab-icon-sprite--forward" : ""} ${
        phase === "playing-reverse" ? "home-tab-icon-sprite--reverse" : ""
      }`}
      style={{
        backgroundImage: `url("${homeTabAnimatedIconUrl(tabId)}")`,
        backgroundSize: `${bgWidth}px ${HOME_TAB_ICON_SIZE}px`,
        ...(backgroundPosition ? { backgroundPosition } : {}),
        ["--home-tab-sprite-end-x" as string]: `${endX}px`,
      }}
      onAnimationEnd={handleAnimationEnd}
    />
  );
}
