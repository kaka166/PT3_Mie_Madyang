"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Receipt,
  BarChart3,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { getLabaRugi } from "@/services/laporanService";
import { formatRupiah } from "@/utils/formatRupiah";
import { formatTanggal, formatTanggalRange } from "@/utils/formatTanggal";

function CalendarPicker({
  value,
  onChange,
}: {
  value: { start: string; end: string };
  onChange: (v: { start: string; end: string }) => void;
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

  const daysInMonth = new Date(viewDate.year, viewDate.month + 1, 0).getDate();
  const firstDay = new Date(viewDate.year, viewDate.month, 1).getDay();
  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  const selectedDay = value.start ? new Date(value.start).getDate() : null;
  const selectedMonth = value.start ? new Date(value.start).getMonth() : null;
  const selectedYear = value.start ? new Date(value.start).getFullYear() : null;

  const prevMonth = () => setViewDate((v) => {
    const m = v.month === 0 ? 11 : v.month - 1;
    const y = v.month === 0 ? v.year - 1 : v.year;
    return { year: y, month: m };
  });
  const nextMonth = () => setViewDate((v) => {
    const m = v.month === 11 ? 0 : v.month + 1;
    const y = v.month === 11 ? v.year + 1 : v.year;
    return { year: y, month: m };
  });

  const selectDay = (day: number) => {
    const d = new Date(viewDate.year, viewDate.month, day);
    const formatDateLocal = (date: Date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const iso = formatDateLocal(d);

    if (!value.start || (value.start && value.end)) {
      onChange({ start: iso, end: "" });
    } else {
      if (new Date(iso) < new Date(value.start)) {
        onChange({ start: iso, end: value.start });
      } else {
        onChange({ start: value.start, end: iso });
      }
    }
    if (value.start && !value.end) setOpen(false);
    setTimeout(() => setOpen(false), 0);
  };

  const displayLabel = value.start && value.end
    ? formatTanggalRange(value.start, value.end)
    : value.start ? formatTanggalRange(value.start, "") : "Hari/Bulan/Tahun";

  return (
    <div ref={ref} className="relative">
      <button onClick={() => {
        setOpen((o) => !o);
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        setPosition(window.innerHeight - rect.bottom < 300 ? "top" : "bottom");
      }}
        className="bg-white border border-neutral-200 pl-3 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200 flex items-center gap-2 shadow-sm">
        <Calendar size={14} className="text-neutral-400" />
        {displayLabel}
        {value.start && (
          <span onClick={(e) => { e.stopPropagation(); onChange({ start: "", end: "" }); }}
            className="ml-1 text-neutral-400 hover:text-neutral-600"><X size={12} /></span>
        )}
      </button>
      {open && (
        <div className={`absolute right-0 w-72 bg-white rounded-2xl border border-neutral-200 shadow-xl z-[9999] p-4 ${position === "bottom" ? "mt-2 top-full" : "mb-2 bottom-full"}`}>
          <div className="flex items-center justify-between mb-3">
            <button onClick={prevMonth} className="p-1 rounded-lg hover:bg-neutral-100 transition-colors"><ChevronLeft size={16} /></button>
            <span className="text-sm font-bold text-neutral-700">{monthNames[viewDate.month]} {viewDate.year}</span>
            <button onClick={nextMonth} className="p-1 rounded-lg hover:bg-neutral-100 transition-colors"><ChevronRight size={16} /></button>
          </div>
          <div className="grid grid-cols-7 mb-1">
            {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => (
              <div key={d} className="text-center text-[10px] font-bold text-neutral-400 py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-1">
            {Array(firstDay).fill(null).map((_, i) => <div key={`e-${i}`} />)}
            {Array(daysInMonth).fill(null).map((_, i) => {
              const day = i + 1;
              const isSelected = day === selectedDay && viewDate.month === selectedMonth && viewDate.year === selectedYear;
              const isToday = day === new Date().getDate() && viewDate.month === new Date().getMonth() && viewDate.year === new Date().getFullYear();
              const currentDate = new Date(viewDate.year, viewDate.month, day);
              const isInRange = value.start && value.end && currentDate >= new Date(value.start) && currentDate <= new Date(value.end);
              const isStart = value.start && day === new Date(value.start).getDate() && viewDate.month === new Date(value.start).getMonth() && viewDate.year === new Date(value.start).getFullYear();
              const isEnd = value.end && day === new Date(value.end).getDate() && viewDate.month === new Date(value.end).getMonth() && viewDate.year === new Date(value.end).getFullYear();
              return (
                <button key={day} onClick={() => selectDay(day)}
                  className={`text-center text-sm h-8 w-full rounded-lg font-medium transition-colors ${isStart || isEnd ? "bg-[#FF7067] text-white" : ""} ${isInRange && !isStart && !isEnd ? "bg-red-100 text-red-600" : ""} ${isToday && !isSelected ? "border border-[#FF7067] text-[#FF7067]" : ""} ${!isSelected && !isToday ? "text-neutral-700 hover:bg-neutral-100" : ""}`}>
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LabaRugiPage() {
  const [data, setData] = useState<any>(null);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: "", end: "" });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getLabaRugi({
        start_date: dateRange.start || undefined,
        end_date: dateRange.end || undefined,
      });
      if (result.success) setData(result.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const ringkasan = data?.ringkasan;

  const metrics = ringkasan
    ? [
        { label: "TOTAL PENJUALAN", value: formatRupiah(ringkasan.total_penjualan), icon: BarChart3, color: "blue" },
        { label: "TOTAL PEMASUKAN", value: formatRupiah(ringkasan.total_pemasukan), icon: TrendingUp, color: "green" },
        { label: "TOTAL PENGELUARAN", value: formatRupiah(ringkasan.total_pengeluaran), icon: TrendingDown, color: "red" },
        { label: "HPP PER PORSI", value: formatRupiah(ringkasan.hpp_per_porsi), icon: Wallet, color: "orange" },
        { label: "LABA KOTOR", value: formatRupiah(ringkasan.laba_kotor), icon: TrendingUp, color: "blue" },
        { label: "LABA BERSIH", value: formatRupiah(ringkasan.laba_bersih), icon: TrendingUp, color: "green" },
      ]
    : [];

  return (
    <div className="h-full overflow-y-auto min-h-screen bg-neutral-100 p-8 font-sans pb-24">
      <div className="max-w-1xl mx-auto space-y-6">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#F53E1B]">Laba Rugi</h1>
            <p className="text-sm text-neutral-500 mt-1">
              Laporan Laba Rugi Mi Madyang
            </p>
          </div>
          <div className="flex-shrink-0">
            <CalendarPicker value={dateRange} onChange={setDateRange} />
          </div>
        </div>

        {loading ? (
          <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm min-h-[130px]">
                  <div className="h-10 w-10 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-28"></div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
              <div className="h-5 bg-gray-200 rounded w-48 mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {metrics.map((m, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm flex flex-col justify-between min-h-[130px] transition-all hover:shadow-md"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className={`p-2.5 bg-${m.color}-50 text-${m.color}-500 rounded-xl`}>
                      <m.icon size={20} />
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
                      {m.label}
                    </p>
                    <p className="text-2xl font-extrabold text-neutral-800">{m.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-neutral-900">Ringkasan Laba Rugi</h2>
              </div>
              <div className="p-6">
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      { label: "Total Penjualan", value: ringkasan?.total_penjualan, type: "plus" },
                      { label: "HPP (Harga Pokok Penjualan)", value: ringkasan?.total_hpp, type: "minus" },
                      { label: "Total Pengeluaran Operasional", value: ringkasan?.total_pengeluaran, type: "minus" },
                      { label: "", value: null, type: "separator" },
                      { label: "Laba Bersih", value: ringkasan?.laba_bersih, type: "result" },
                    ].map((row, i) =>
                      row.type === "separator" ? (
                        <tr key={i}><td colSpan={2}><hr className="my-3" /></td></tr>
                      ) : (
                        <tr key={i} className="border-b border-neutral-100">
                          <td className="py-3 font-semibold text-neutral-700">{row.label}</td>
                          <td className={`py-3 text-right font-bold ${
                            row.type === "result"
                              ? (ringkasan?.laba_bersih >= 0 ? "text-green-600" : "text-red-600")
                              : row.type === "plus" ? "text-green-600" : "text-red-600"
                          }`}>
                            {row.type === "result" ? "" : (row.type === "plus" ? "+ " : "- ")}
                            {formatRupiah(row.value)}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
                <div className="mt-4 p-4 bg-green-50 rounded-xl">
                  <p className="text-sm font-semibold text-green-700">
                    {ringkasan?.laba_bersih >= 0
                      ? `UNTUNG: ${formatRupiah(ringkasan.laba_bersih)}`
                      : `RUGI: ${formatRupiah(Math.abs(ringkasan?.laba_bersih))}`}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Porsi terjual: {ringkasan?.total_porsi_terjual || 0} porsi
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="font-bold text-neutral-900">Riwayat Pemasukan</h3>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {data?.riwayat_pemasukan?.length > 0 ? (
                    data.riwayat_pemasukan.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between px-4 py-3 border-b border-neutral-50 text-sm">
                        <div>
                          <p className="font-semibold">{item.nama}</p>
                          <p className="text-xs text-neutral-400">{formatTanggal(item.waktu)}</p>
                        </div>
                        <p className="font-bold text-green-600">{formatRupiah(item.total)}</p>
                      </div>
                    ))
                  ) : (
                    <p className="p-4 text-sm text-neutral-400">Belum ada data</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="font-bold text-neutral-900">Riwayat Pengeluaran</h3>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {data?.riwayat_pengeluaran?.length > 0 ? (
                    data.riwayat_pengeluaran.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between px-4 py-3 border-b border-neutral-50 text-sm">
                        <div>
                          <p className="font-semibold">{item.nama}</p>
                          <p className="text-xs text-neutral-400">{item.kategori}</p>
                        </div>
                        <p className="font-bold text-red-600">{formatRupiah(item.total)}</p>
                      </div>
                    ))
                  ) : (
                    <p className="p-4 text-sm text-neutral-400">Belum ada data</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
