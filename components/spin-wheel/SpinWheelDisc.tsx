"use client";

import { useMemo } from "react";
import type { SpinWheelSegment } from "@/lib/spin-api";
import type { Locale } from "@/lib/locale";
import { formatSpinAmount } from "@/lib/i18n/spin-wheel-messages";

const SEGMENT_COLORS = [
  "#1a5c3a",
  "#2d7a52",
  "#1e4d8c",
  "#5c3d2e",
  "#1a6b45",
  "#2a5f8f",
  "#4a3528",
  "#1f7a4d",
  "#234e8a",
  "#3d5c30",
] as const;

const SIZE = 320;
const CX = SIZE / 2;
const CY = SIZE / 2;
const RIM = 148;
const INNER = 118;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}

function BjHubLogo() {
  return (
    <text
      x={CX}
      y={CY + 8}
      textAnchor="middle"
      fontSize="28"
      fontWeight="900"
      fontFamily="system-ui, sans-serif"
    >
      <tspan fill="#e8e8e8">b</tspan>
      <tspan fill="#ffb347">j</tspan>
    </text>
  );
}

function FsBadge({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x - 10}, ${y - 8})`}>
      <polygon
        points="10,0 18,5 18,15 10,20 2,15 2,5"
        fill="#1faa59"
        stroke="#7dff9e"
        strokeWidth="0.8"
      />
      <text x="10" y="13" textAnchor="middle" fontSize="6" fontWeight="800" fill="#fff">
        ৳
      </text>
    </g>
  );
}

type SpinWheelDiscProps = {
  segments: SpinWheelSegment[];
  rotation: number;
  locale: Locale;
  spinning: boolean;
  skipAnimation: boolean;
};

export function computeSpinRotation(
  segmentIndex: number,
  currentRotation: number,
  segmentCount: number,
  extraSpins = 6
): number {
  const segmentAngle = 360 / segmentCount;
  const segmentCenter = segmentIndex * segmentAngle + segmentAngle / 2;
  const targetMod = (360 - segmentCenter + 360) % 360;
  const currentMod = ((currentRotation % 360) + 360) % 360;
  let delta = targetMod - currentMod;
  if (delta <= 0) delta += 360;
  return currentRotation + extraSpins * 360 + delta;
}

export default function SpinWheelDisc({
  segments,
  rotation,
  locale,
  spinning,
  skipAnimation,
}: SpinWheelDiscProps) {
  const count = segments.length || 10;
  const segmentAngle = 360 / count;

  const wedges = useMemo(() => {
    return segments.map((seg, i) => {
      const start = i * segmentAngle;
      const end = (i + 1) * segmentAngle;
      const mid = start + segmentAngle / 2;
      const labelPos = polarToCartesian(CX, CY, (RIM + INNER) / 2, mid);
      const badgePos = polarToCartesian(CX, CY, INNER + 14, mid);
      return {
        ...seg,
        path: describeArc(CX, CY, RIM, start, end),
        color: SEGMENT_COLORS[i % SEGMENT_COLORS.length],
        labelPos,
        badgePos,
        mid,
        label: `৳${formatSpinAmount(seg.amount, locale)}`,
      };
    });
  }, [segments, segmentAngle, locale]);

  const transitionStyle =
    spinning && !skipAnimation
      ? "transform 4.8s cubic-bezier(0.15, 0.85, 0.2, 1)"
      : "transform 0.15s ease-out";

  return (
    <div className="relative mx-auto w-full max-w-[min(100%,340px)]">
      {/* Pointer */}
      <div className="pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1">
        <svg width="36" height="44" viewBox="0 0 36 44" aria-hidden>
          <defs>
            <linearGradient id="spin-pointer-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffe566" />
              <stop offset="50%" stopColor="#f7c948" />
              <stop offset="100%" stopColor="#c9a020" />
            </linearGradient>
            <filter id="spin-pointer-glow">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#f7c948" floodOpacity="0.6" />
            </filter>
          </defs>
          <path
            d="M18 4 L32 38 Q18 32 4 38 Z"
            fill="url(#spin-pointer-grad)"
            stroke="#fff8d0"
            strokeWidth="1.2"
            filter="url(#spin-pointer-glow)"
          />
        </svg>
      </div>

      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.35)_0%,transparent_70%)] blur-md" />

      <div
        className="relative mx-auto aspect-square w-full"
        style={{ maxWidth: SIZE }}
      >
        {/* Golden rim (static) */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, #f7d060, #fff3b0, #d4a820, #f7d060, #fff8c8, #c9a020, #f7d060)",
            padding: "6px",
            boxShadow:
              "0 0 24px rgba(247,201,72,0.45), inset 0 0 12px rgba(255,255,255,0.25)",
          }}
        >
          <div
            className="h-full w-full rounded-full"
            style={{
              background: "#0d3d28",
              boxShadow: "inset 0 0 20px rgba(0,0,0,0.5)",
            }}
          />
        </div>

        {/* Rotating wheel */}
        <div
          className="absolute inset-[8px] will-change-transform"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: transitionStyle,
          }}
        >
          <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="h-full w-full drop-shadow-[0_4px_20px_rgba(0,0,0,0.45)]"
            aria-hidden
          >
            <defs>
              <radialGradient id="hub-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#2d6b4a" />
                <stop offset="100%" stopColor="#0f2d1e" />
              </radialGradient>
            </defs>

            {wedges.map((w) => (
              <g key={w.index}>
                <path d={w.path} fill={w.color} stroke="#0a1f14" strokeWidth="1.2" />
                <text
                  x={w.labelPos.x}
                  y={w.labelPos.y}
                  fill="#fff8e0"
                  fontSize="13"
                  fontWeight="800"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${w.mid}, ${w.labelPos.x}, ${w.labelPos.y})`}
                  style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
                >
                  {w.label}
                </text>
                <FsBadge x={w.badgePos.x} y={w.badgePos.y} />
              </g>
            ))}

            <circle cx={CX} cy={CY} r={42} fill="url(#hub-grad)" stroke="#f7c948" strokeWidth="3" />
            <circle cx={CX} cy={CY} r={36} fill="#143d2a" stroke="#2d8f5c" strokeWidth="1.5" />
            <BjHubLogo />
          </svg>
        </div>
      </div>
    </div>
  );
}
