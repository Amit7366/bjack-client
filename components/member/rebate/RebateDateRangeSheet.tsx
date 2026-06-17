"use client";

import { useMemo, useState } from "react";
import type { RebateMessages } from "@/lib/i18n/rebate-messages";
import { formatRangeLabel } from "./rebate-ui";

type RebateDateRangeSheetProps = {
  open: boolean;
  from: string;
  to: string;
  labels: RebateMessages;
  locale: string;
  onClose: () => void;
  onConfirm: (from: string, to: string) => void;
};

function parseDay(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function toDayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function monthLabel(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale === "bn" ? "bn-BD" : locale === "hi" ? "hi-IN" : "en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

const WEEKDAYS_BN = ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহ", "শুক্র", "শনি"];
const WEEKDAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function RebateDateRangeSheet({
  open,
  from,
  to,
  labels,
  locale,
  onClose,
  onConfirm,
}: RebateDateRangeSheetProps) {
  const initial = parseDay(from);
  const [viewMonth, setViewMonth] = useState(
    () => new Date(initial.getFullYear(), initial.getMonth(), 1),
  );
  const [start, setStart] = useState(from);
  const [end, setEnd] = useState(to);

  const weekdays = locale === "bn" ? WEEKDAYS_BN : WEEKDAYS_EN;

  const days = useMemo(() => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const first = new Date(year, month, 1);
    const startPad = first.getDay();
    const total = new Date(year, month + 1, 0).getDate();
    const cells: (string | null)[] = [];
    for (let i = 0; i < startPad; i++) cells.push(null);
    for (let d = 1; d <= total; d++) {
      cells.push(toDayKey(new Date(year, month, d)));
    }
    return cells;
  }, [viewMonth]);

  if (!open) return null;

  const onPick = (key: string) => {
    if (!start || (start && end && start !== end)) {
      setStart(key);
      setEnd(key);
      return;
    }
    if (key < start) {
      setEnd(start);
      setStart(key);
      return;
    }
    setEnd(key);
  };

  const inRange = (key: string) => {
    const a = start <= end ? start : end;
    const b = start <= end ? end : start;
    return key >= a && key <= b;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45">
      <button type="button" className="absolute inset-0" aria-label={labels.close} onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-t-2xl bg-white px-4 pb-6 pt-4 shadow-2xl">
        <p className="mb-3 text-center text-[15px] font-semibold text-[#333]">
          {formatRangeLabel(start, end)}
        </p>

        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            className="rounded-md px-2 py-1 text-[#2196F3]"
            onClick={() =>
              setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))
            }
          >
            ‹
          </button>
          <span className="text-[15px] font-medium text-[#333]">
            {monthLabel(viewMonth, locale)}
          </span>
          <button
            type="button"
            className="rounded-md px-2 py-1 text-[#2196F3]"
            onClick={() =>
              setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))
            }
          >
            ›
          </button>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] text-[#9ca3af]">
          {weekdays.map((w) => (
            <div key={w}>{w}</div>
          ))}
        </div>

        <div className="mb-5 grid grid-cols-7 gap-1">
          {days.map((key, idx) =>
            key ? (
              <button
                key={key}
                type="button"
                onClick={() => onPick(key)}
                className={`flex h-9 items-center justify-center rounded-full text-[13px] ${
                  key === start || key === end
                    ? "bg-[#2196F3] text-white"
                    : inRange(key)
                      ? "bg-[#e3f2fd] text-[#1976d2]"
                      : "text-[#333] hover:bg-[#f5f5f5]"
                }`}
              >
                {Number(key.split("-")[2])}
              </button>
            ) : (
              <div key={`pad-${idx}`} />
            ),
          )}
        </div>

        <button
          type="button"
          className="w-full rounded-md bg-[#2196F3] py-3 text-[16px] font-semibold text-white"
          onClick={() => {
            const a = start <= end ? start : end;
            const b = start <= end ? end : start;
            onConfirm(a, b);
            onClose();
          }}
        >
          {labels.dateRangeOk}
        </button>
      </div>
    </div>
  );
}
