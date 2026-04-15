/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Banknote, Search, Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";

// ─── DUMMY DATA ───────────────────────────────────────────────────────────────
const riwayatPengeluaran = [
  { id: "#22398", nama: "Terigu", jumlah: "10 kg", pembuat: "Kevin", waktu: "14-02-26 18:22:32", total: "Rp. 60.000,00" },
  { id: "#22398", nama: "Telur", jumlah: "10 kg", pembuat: "Kevin", waktu: "14-02-26 18:22:32", total: "Rp. 60.000,00" },
  { id: "#22398", nama: "Dada Ayam", jumlah: "5 kg", pembuat: "Kevin", waktu: "14-02-26 18:22:32", total: "Rp. 60.000,00" },
  { id: "#22398", nama: "Es Kristal", jumlah: "3 Pack", pembuat: "Kevin", waktu: "14-02-26 18:22:32", total: "Rp. 60.000,00" },
  { id: "#22398", nama: "Sayur Cesim", jumlah: "12 Ikat", pembuat: "Kevin", waktu: "14-02-26 18:22:32", total: "Rp. 60.000,00" },
  { id: "#22398", nama: "Minyak Goreng", jumlah: "500ml", pembuat: "Kevin", waktu: "14-02-26 18:22:32", total: "Rp. 60.000,00" },
];

// ─── KOMPONEN CALENDAR PICKER ─────────────────────────────────────────────────
function CalendarPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    const d = value ? new Date(value) : new Date();
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
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const selectedDay = value ? new Date(value).getDate() : null;
  const selectedMonth = value ? new Date(value).getMonth() : null;
  const selectedYear = value ? new Date(value).getFullYear() : null;

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
    const offset = d.getTimezoneOffset();
    const adjustedDate = new Date(d.getTime() - (offset * 60 * 1000));
    const iso = adjustedDate.toISOString().split("T")[0];
    
    onChange(iso);
    setOpen(false);
  };

  const displayLabel = value
    ? new Date(value).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : "Hari/Bulan/Tahun";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="bg-gray-100 pl-3 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200 flex items-center gap-2"
      >
        <Calendar size={14} className="text-neutral-400" />
        {displayLabel}
        {value && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
            className="ml-1 text-neutral-400 hover:text-neutral-600"
          >
            <X size={12} />
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-neutral-200 shadow-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <button onClick={prevMonth} className="p-1 rounded-lg hover:bg-neutral-100 transition-colors">
              <ChevronLeft size={16} className="text-neutral-600" />
            </button>
            <span className="text-sm font-bold text-neutral-700">
              {monthNames[viewDate.month]} {viewDate.year}
            </span>
            <button onClick={nextMonth} className="p-1 rounded-lg hover:bg-neutral-100 transition-colors">
              <ChevronRight size={16} className="text-neutral-600" />
            </button>
          </div>

          <div className="grid grid-cols-7 mb-1">
            {["Min","Sen","Sel","Rab","Kam","Jum","Sab"].map((d) => (
              <div key={d} className="text-center text-[10px] font-bold text-neutral-400 py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1">
            {Array(firstDay).fill(null).map((_, i) => <div key={`e-${i}`} />)}
            {Array(daysInMonth).fill(null).map((_, i) => {
              const day = i + 1;
              const isSelected = day === selectedDay && viewDate.month === selectedMonth && viewDate.year === selectedYear;
              const isToday = day === new Date().getDate() && viewDate.month === new Date().getMonth() && viewDate.year === new Date().getFullYear();
                
              return (
                <button
                  key={day}
                  onClick={() => selectDay(day)}
                  className={`text-center text-sm h-8 w-full rounded-lg font-medium transition-colors
                    ${isSelected ? "bg-red-500 text-white" : ""}
                    ${isToday && !isSelected ? "border border-red-500 text-red-500" : ""}
                    ${!isSelected && !isToday ? "text-neutral-700 hover:bg-neutral-100" : ""}
                  `}
                >
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

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function LaporanPengeluaran() {
  const [selectedDate, setSelectedDate] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="h-full overflow-y-auto bg-gray-100 p-8 font-sans pb-24 min-h-screen">
      <div className="max-w-1xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#8B1A1A] mb-1 tracking-tight">Laporan Pengeluaran</h1>
          <p className="text-neutral-500 text-sm">Laporan Pengeluaran Mi Madyang</p>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 max-w-[320px] mb-8">
          <div className="p-2.5 bg-red-50 text-[#FF5C5C] rounded-lg w-fit mb-4">
            <Banknote size={20} />
          </div>
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
            Total Pengeluaran
          </p>
          <p className="text-3xl font-extrabold text-neutral-800">Rp 2.450.000</p>
        </div>

        {/* Tabel Riwayat Pengeluaran */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
          
          {/* Toolbar */}
          <div className="p-6 flex flex-wrap justify-between items-center border-b border-neutral-100 relative z-20">
            <h2 className="text-xl font-bold text-neutral-900">Riwayat Pengeluaran</h2>
            
            <div className="flex flex-wrap gap-3 items-center">
              {/* Date Picker Kustom */}
              <CalendarPicker value={selectedDate} onChange={setSelectedDate} />

              {/* Input Pencarian */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Cari Pesanan (ID)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2.5 rounded-lg bg-gray-100 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300 w-52 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto relative z-10">
            <table className="w-full text-sm text-center">
              <thead className="text-neutral-400">
                <tr>
                  <th className="px-6 py-4 font-medium text-left">ID</th>
                  <th className="px-6 py-4 font-medium">Nama Pengeluaran</th>
                  <th className="px-6 py-4 font-medium">Jumlah</th>
                  <th className="px-6 py-4 font-medium">Dibuat Oleh</th>
                  <th className="px-6 py-4 font-medium">Waktu</th>
                  <th className="px-6 py-4 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody className="text-neutral-700">
                {riwayatPengeluaran.map((row, idx) => (
                  <tr key={idx} className="border-t border-neutral-200 hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-5 font-semibold text-left">{row.id}</td>
                    <td className="px-6 py-5 font-bold text-neutral-800">{row.nama}</td>
                    <td className="px-6 py-5 font-semibold text-neutral-600">{row.jumlah}</td>
                    <td className="px-6 py-5 text-neutral-500">{row.pembuat}</td>
                    <td className="px-6 py-5 text-neutral-600">{row.waktu}</td>
                    <td className="px-6 py-5 font-bold text-neutral-800 text-right">{row.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Pagination Bar */}
          <div className="px-6 py-4 bg-neutral-200/50 flex justify-between items-center text-sm text-neutral-500 border-t border-neutral-200">
            <span className="font-semibold">Showing 1-9 of 2810 Transaction</span>
            <div className="flex gap-1.5 font-bold">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="w-8 h-8 flex items-center justify-center rounded bg-[#FF5C5C] text-white hover:bg-red-500 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                    currentPage === page 
                      ? "bg-[#FF5C5C] text-white" 
                      : "bg-white text-neutral-700 hover:bg-neutral-100 shadow-sm"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, 5))}
                className="w-8 h-8 flex items-center justify-center rounded bg-[#FF5C5C] text-white hover:bg-red-500 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}