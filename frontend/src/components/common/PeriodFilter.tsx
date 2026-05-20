"use client";

import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { formatTanggalRange } from "@/utils/formatTanggal";

export type DateRange = { start: string; end: string };

export const PERIOD_PRESETS = [
  { label: "Hari Ini", days: 0 },
  { label: "7 Hari", days: 7 },
  { label: "30 Hari", days: 30 },
  { label: "3 Bulan", days: 90 },
  { label: "6 Bulan", days: 180 },
  { label: "1 Tahun", days: 365 },
  { label: "2 Tahun", days: 730 },
];

function getDateStr(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function PeriodFilter({
  value,
  onChange,
  showPresets = true,
}: {
  value: DateRange;
  onChange: (v: DateRange) => void;
  showPresets?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<"top" | "bottom">("bottom");
  const [viewDate, setViewDate] = useState(() => {
    const d = value.start ? new Date(value.start) : new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const today = new Date();
  const todayStr = getDateStr(today);
  
  const applyPreset = (days: number) => {
    if (days === 0) {
      onChange({ start: todayStr, end: todayStr });
    } else {
      const start = new Date();
      start.setDate(start.getDate() - days);
      onChange({ start: getDateStr(start), end: todayStr });
    }
    setOpen(false);
  };

  const daysInMonth = new Date(viewDate.year, viewDate.month + 1, 0).getDate();
  const firstDay = new Date(viewDate.year, viewDate.month, 1).getDay();
  const monthNames = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

  const selectDay = (day: number) => {
    const d = new Date(viewDate.year, viewDate.month, day);
    const iso = getDateStr(d);
    if (!value.start || (value.start && value.end)) {
      onChange({ start: iso, end: "" });
    } else {
      if (new Date(iso) < new Date(value.start)) {
        onChange({ start: iso, end: value.start });
      } else {
        onChange({ start: value.start, end: iso });
      }
      setOpen(false);
    }
  };

  const displayLabel = value.start && value.end
    ? formatTanggalRange(value.start, value.end)
    : value.start ? formatTanggalRange(value.start, "") : "Pilih Periode";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => {
          setOpen(o => !o);
          const rect = ref.current?.getBoundingClientRect();
          if (!rect) return;
          setPosition(window.innerHeight - rect.bottom < 360 ? "top" : "bottom");
        }}
        className="bg-white border border-neutral-200 pl-3 pr-4 py-2 rounded-xl text-sm focus:outline-none flex items-center gap-2 shadow-sm hover:bg-neutral-50 transition-colors"
      >
        <Calendar size={14} className="text-neutral-400" />
        <span className="font-medium text-neutral-600">{displayLabel}</span>
        {value.start && (
          <span onClick={(e) => { e.stopPropagation(); onChange({ start: "", end: "" }); }}
            className="ml-1 text-neutral-400 hover:text-red-500">
            <X size={12} />
          </span>
        )}
      </button>

      {open && (
        <div className={`absolute right-0 w-80 bg-white rounded-2xl border border-neutral-200 shadow-xl z-[9999] ${position === "bottom" ? "mt-2 top-full" : "mb-2 bottom-full"}`}>
          {showPresets && (
            <div className="p-3 border-b border-neutral-100">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Preset Cepat</p>
              <div className="flex flex-wrap gap-1.5">
                {PERIOD_PRESETS.map(p => (
                  <button key={p.label} onClick={() => applyPreset(p.days)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-50 hover:bg-red-50 hover:text-red-600 border border-neutral-200 hover:border-red-200 transition-all">
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <button onClick={() => setViewDate(v => { const m = v.month === 0 ? 11 : v.month-1; const y = v.month === 0 ? v.year-1 : v.year; return {year: y, month: m}; })}
                className="p-1 rounded-lg hover:bg-neutral-100">
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-bold text-neutral-700">{monthNames[viewDate.month]} {viewDate.year}</span>
              <button onClick={() => setViewDate(v => { const m = v.month === 11 ? 0 : v.month+1; const y = v.month === 11 ? v.year+1 : v.year; return {year: y, month: m}; })}
                className="p-1 rounded-lg hover:bg-neutral-100">
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-7 mb-1">
              {["Min","Sen","Sel","Rab","Kam","Jum","Sab"].map(d => (
                <div key={d} className="text-center text-[10px] font-bold text-neutral-400 py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-1">
              {Array(firstDay).fill(null).map((_, i) => <div key={`e-${i}`} />)}
              {Array(daysInMonth).fill(null).map((_, i) => {
                const day = i + 1;
                const currentDate = new Date(viewDate.year, viewDate.month, day);
                const iso = getDateStr(currentDate);
                const isStart = value.start && iso === value.start;
                const isEnd = value.end && iso === value.end;
                const isInRange = value.start && value.end && currentDate >= new Date(value.start) && currentDate <= new Date(value.end);
                const isToday = iso === todayStr;
                return (
                  <button key={day} onClick={() => selectDay(day)}
                    className={`text-center text-xs h-8 w-full rounded-lg font-medium transition-colors
                      ${isStart || isEnd ? "bg-[#FF7067] text-white" : ""}
                      ${isInRange && !isStart && !isEnd ? "bg-red-100 text-red-600" : ""}
                      ${isToday && !isStart && !isEnd ? "border border-[#FF7067] text-[#FF7067]" : ""}
                      ${!isStart && !isEnd && !isInRange && !isToday ? "text-neutral-700 hover:bg-neutral-100" : ""}
                    `}>
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
