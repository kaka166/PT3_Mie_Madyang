"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  BarChart3,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { getLabaRugi } from "@/services/laporanService";
import { formatRupiah } from "@/utils/formatRupiah";
import { formatTanggal, formatTanggalRange } from "@/utils/formatTanggal";

interface RingkasanLabaRugi {
  total_penjualan: number;
  total_pemasukan: number;
  total_pengeluaran: number;
  hpp_per_porsi: number;
  laba_kotor: number;
  laba_bersih: number;
  total_hpp: number;
  total_porsi_terjual: number;
}

interface RiwayatItem {
  nama: string;
  waktu: string;
  total: number;
  kategori?: string;
}

interface LabaRugiData {
  ringkasan: RingkasanLabaRugi;
  riwayat_pemasukan: RiwayatItem[];
  riwayat_pengeluaran: RiwayatItem[];
}

import { PeriodFilter, PERIOD_PRESETS } from "@/components/common/PeriodFilter";

export default function LabaRugiPage() {
  const [data, setData] = useState<LabaRugiData | null>(null);
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
  const pemasukanList = data?.riwayat_pemasukan ?? [];
  const pengeluaranList = data?.riwayat_pengeluaran ?? [];

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
    <div className="h-full overflow-y-auto min-h-screen bg-neutral-100 p-4 md:p-8 font-sans pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#F53E1B]">Laba Rugi</h1>
            <p className="text-sm text-neutral-500 mt-1">
              Laporan Laba Rugi Mi Madyang
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {PERIOD_PRESETS.map((p) => {
              const today = new Date();
              const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
              const startDate = p.days === 0 ? todayStr : (() => { const d = new Date(); d.setDate(d.getDate() - p.days); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; })();
              const isActive = dateRange.start === startDate && dateRange.end === todayStr;
              return (
                <button
                  key={p.label}
                  onClick={() => setDateRange({ start: startDate, end: todayStr })}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                    isActive ? "bg-[#F53E1B] text-white border-[#F53E1B]" : "bg-white border-neutral-200 text-neutral-600 hover:border-red-300 hover:text-red-500"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
            <div className="flex-shrink-0">
              <PeriodFilter value={dateRange} onChange={setDateRange} showPresets={false} />
            </div>
            {(dateRange.start || dateRange.end) && (
              <button onClick={() => setDateRange({ start: "", end: "" })} className="text-xs text-gray-400 hover:text-red-500 underline">Reset</button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="space-y-4 md:space-y-6 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-4 md:p-6 border border-neutral-100 shadow-sm">
                  <div className="h-8 md:h-10 w-8 md:w-10 bg-gray-200 rounded-xl mb-3 md:mb-4"></div>
                  <div className="h-2 md:h-3 bg-gray-200 rounded w-20 md:w-24 mb-1 md:mb-2"></div>
                  <div className="h-5 md:h-6 bg-gray-200 rounded w-24 md:w-28"></div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4 md:p-6">
              <div className="h-5 bg-gray-200 rounded w-36 md:w-48 mb-4 md:mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              {metrics.map((m, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-4 md:p-6 border border-neutral-100 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="p-2 md:p-2.5 bg-red-50 text-red-500 rounded-xl w-fit mb-2 md:mb-3">
                    <m.icon size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] md:text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5 md:mb-1">
                      {m.label}
                    </p>
                    <p className="text-xl md:text-2xl font-extrabold text-neutral-800">{m.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
              <div className="p-4 md:p-6 border-b">
                <h2 className="text-base md:text-xl font-bold text-neutral-900">Ringkasan Laba Rugi</h2>
              </div>
              <div className="p-4 md:p-6">
                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
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
                        <tr key={i} className="even:bg-gray-50 odd:bg-white hover:bg-red-50 transition-colors">
                          <td className="px-5 py-3.5 font-semibold text-neutral-700">{row.label}</td>
                          <td className={`pr-5 py-3.5 text-right font-bold ${
                            row.type === "result"
                              ? (ringkasan!.laba_bersih >= 0 ? "text-green-600" : "text-red-600")
                              : row.type === "plus" ? "text-green-600" : "text-red-600"
                          }`}>
                            {row.type === "result" ? "" : (row.type === "plus" ? "+ " : "- ")}
                            {formatRupiah(row.value ?? 0)}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
                </div>
                {/* Mobile cards */}
                <div className="md:hidden space-y-1.5">
                  {[
                    { label: "Total Penjualan", value: ringkasan?.total_penjualan, type: "plus" },
                    { label: "HPP (Harga Pokok Penjualan)", value: ringkasan?.total_hpp, type: "minus" },
                    { label: "Total Pengeluaran Operasional", value: ringkasan?.total_pengeluaran, type: "minus" },
                    { label: "", value: null, type: "separator" },
                    { label: "Laba Bersih", value: ringkasan?.laba_bersih, type: "result" },
                  ]
                    .filter(row => row.type !== "separator")
                    .map((row, i) => (
                      <div key={i} className="flex justify-between items-center bg-gray-50 rounded-xl px-3 py-2.5">
                        <span className="text-xs font-semibold text-neutral-700">{row.label}</span>
                        <span className={`text-xs font-bold shrink-0 ml-2 ${
                          row.type === "result"
                            ? (ringkasan!.laba_bersih >= 0 ? "text-green-600" : "text-red-600")
                            : row.type === "plus" ? "text-green-600" : "text-red-600"
                        }`}>
                          {row.type === "result" ? "" : (row.type === "plus" ? "+ " : "- ")}
                          {formatRupiah(row.value ?? 0)}
                        </span>
                      </div>
                    ))}
                </div>
                <div className="mt-3 md:mt-4 p-3 md:p-4 bg-green-50 rounded-xl">
                  <p className="text-xs md:text-sm font-semibold text-green-700">
                    {ringkasan!.laba_bersih >= 0
                      ? `UNTUNG: ${formatRupiah(ringkasan!.laba_bersih)}`
                      : `RUGI: ${formatRupiah(Math.abs(ringkasan!.laba_bersih))}`}
                  </p>
                  <p className="text-[10px] md:text-xs text-green-600 mt-0.5 md:mt-1">
                    Porsi terjual: {ringkasan?.total_porsi_terjual || 0} porsi
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                <div className="px-4 md:px-4 py-2.5 md:py-3 border-b">
                  <h3 className="text-sm md:text-base font-bold text-neutral-900">Riwayat Pemasukan</h3>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {pemasukanList.length > 0 ? (
                    pemasukanList.map((item: RiwayatItem, i: number) => (
                      <div key={i} className="flex justify-between px-3 py-2.5 border-b border-neutral-50">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate">{item.nama}</p>
                          <p className="text-[10px] text-neutral-400">{formatTanggal(item.waktu)}</p>
                        </div>
                        <p className="text-xs font-bold text-green-600 shrink-0 ml-2">{formatRupiah(item.total)}</p>
                      </div>
                    ))
                  ) : (
                    <p className="p-3 text-xs text-neutral-400">Belum ada data</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                <div className="px-4 md:px-4 py-2.5 md:py-3 border-b">
                  <h3 className="text-sm md:text-base font-bold text-neutral-900">Riwayat Pengeluaran</h3>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {pengeluaranList.length > 0 ? (
                    pengeluaranList.map((item: RiwayatItem, i: number) => (
                      <div key={i} className="flex justify-between px-3 py-2.5 border-b border-neutral-50">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate">{item.nama}</p>
                          <p className="text-[10px] text-neutral-400">{item.kategori}</p>
                        </div>
                        <p className="text-xs font-bold text-red-600 shrink-0 ml-2">{formatRupiah(item.total)}</p>
                      </div>
                    ))
                  ) : (
                    <p className="p-3 text-xs text-neutral-400">Belum ada data</p>
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
