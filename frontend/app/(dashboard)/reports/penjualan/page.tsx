"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Banknote,
  Receipt,
  Wallet,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  ChevronDown,
  Calendar,
  Search,
  X,
  User,
  Printer,
} from "lucide-react";

import { getPemasukan, Pemasukan } from "@/services/penjualanService";
import { formatTanggal, formatTanggalRange } from "@/utils/formatTanggal";
import { formatRupiah } from "@/utils/formatRupiah";

type FilterPeriod = "Minggu" | "Bulan" | "Tahun";

function FilterDropdown({
  value,
  onChange,
}: {
  value: FilterPeriod;
  onChange: (v: FilterPeriod) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const options: FilterPeriod[] = ["Minggu", "Bulan", "Tahun"];

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-200 bg-white text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors shadow-sm">
        <SlidersHorizontal size={14} className="text-neutral-400" />
        Filter: {value}
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl border border-neutral-200 shadow-lg z-20 py-1 overflow-hidden">
          {options.map((opt) => (
            <button key={opt} onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${value === opt ? "bg-[#FF7067]/10 text-[#FF7067]" : "text-neutral-700 hover:bg-neutral-50"}`}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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
        className="bg-gray-100 pl-3 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200 flex items-center gap-2">
        <Calendar size={14} className="text-neutral-400" />
        {displayLabel}
        {value.start && (
          <span onClick={(e) => { e.stopPropagation(); onChange({ start: "", end: "" }); }}
            className="ml-1 text-neutral-400 hover:text-neutral-600"><X size={12} /></span>
        )}
      </button>
      {open && (
        <div className={`absolute right-0 w-72 bg-white rounded-2xl border border-neutral-200 shadow-xl z-50 p-4 ${position === "bottom" ? "mt-2 top-full" : "mb-2 bottom-full"}`}>
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

export default function LaporanPemasukan() {
  const [rekapFilter, setRekapFilter] = useState<FilterPeriod>("Bulan");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: "", end: "" });
  const [search, setSearch] = useState("");
  const [kasirFilter, setKasirFilter] = useState("");
  const [metodeFilter, setMetodeFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const pageSizeOptions = [10, 20, 30, 40];

  const [riwayatData, setRiwayatData] = useState<Pemasukan[]>([]);

  useEffect(() => {
    let mounted = true;
    getPemasukan()
      .then((data) => { if (mounted) setRiwayatData(data); })
      .catch(() => {});
    const interval = setInterval(() => {
      getPemasukan()
        .then((data) => setRiwayatData(data))
        .catch(() => {});
    }, 3000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  const filteredRiwayat = riwayatData.filter((item) => {
    if (!item.waktu) return true;
    const date = new Date(item.waktu);
    const now = new Date();

    const matchSearch = item.nama?.toLowerCase().includes(search.toLowerCase());

    const matchKasir = kasirFilter ? item.kasir?.toLowerCase().includes(kasirFilter.toLowerCase()) : true;
    const matchMetode = metodeFilter ? item.metode === metodeFilter : true;

    const matchDate = dateRange.start && dateRange.end
      ? new Date(item.waktu) >= new Date(dateRange.start) &&
        new Date(item.waktu) <= (() => { const end = new Date(dateRange.end); end.setHours(23, 59, 59, 999); return end; })()
      : true;

    let matchPeriod = true;
    if (rekapFilter === "Minggu") {
      const diff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
      matchPeriod = diff <= 7;
    }
    if (rekapFilter === "Bulan") {
      matchPeriod = date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }
    if (rekapFilter === "Tahun") {
      matchPeriod = date.getFullYear() === now.getFullYear();
    }

    return matchSearch && matchDate && matchPeriod && matchKasir && matchMetode;
  });

  const totalItems = filteredRiwayat.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = (filteredRiwayat || []).slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const filteredRekap = riwayatData.filter((item) => {
    if (!item.waktu) return true;
    const date = new Date(item.waktu);
    const now = new Date();
    let matchPeriod = true;
    if (rekapFilter === "Minggu") {
      const diff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
      matchPeriod = diff <= 7;
    }
    if (rekapFilter === "Bulan") {
      matchPeriod = date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }
    if (rekapFilter === "Tahun") {
      matchPeriod = date.getFullYear() === now.getFullYear();
    }
    return matchPeriod;
  });

  const groupedRekap = Object.values(
    filteredRekap.reduce((acc: Record<string, { rentang: string; total: number; transaksi: number }>, item: Pemasukan) => {
      const date = new Date(item.waktu);
      let key = "";
      if (rekapFilter === "Minggu") {
        const start = new Date(date);
        start.setDate(date.getDate() - date.getDay());
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        key = formatTanggalRange(start.toISOString(), end.toISOString());
      }
      if (rekapFilter === "Bulan") {
        key = date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
      }
      if (rekapFilter === "Tahun") {
        key = date.getFullYear().toString();
      }
      if (!acc[key]) acc[key] = { rentang: key, total: 0, transaksi: 0 };
      acc[key].total += Number(item.jumlah || 0);
      acc[key].transaksi += 1;
      return acc;
    }, {}),
  );

  const totalPemasukan = filteredRekap.reduce((acc, item) => acc + Number(item.jumlah || 0), 0);
  const totalTransaksi = filteredRekap.length;
  const rataRata = totalTransaksi > 0 ? totalPemasukan / totalTransaksi : 0;

  const [rekapPage, setRekapPage] = useState(1);
  const [rekapLimit, setRekapLimit] = useState(10);
  const totalRekap = groupedRekap.length;
  const startRekap = (rekapPage - 1) * rekapLimit;
  const paginatedRekap = groupedRekap.slice(startRekap, startRekap + rekapLimit);
  const totalRekapPages = Math.ceil(totalRekap / rekapLimit);

  const [selectedTransaksi, setSelectedTransaksi] = useState<Pemasukan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (data: Pemasukan) => { setSelectedTransaksi(data); setIsModalOpen(true); };
  const closeModal = () => { setSelectedTransaksi(null); setIsModalOpen(false); };

  const exportCSV = () => {
    const headers = ["No. Transaksi", "Nama", "Waktu", "Kasir", "Metode", "Jumlah"];
    const rows = filteredRiwayat.map((item) => [
      item.no || "",
      item.nama || "",
      item.waktu ? formatTanggal(item.waktu) : "",
      item.kasir || "",
      item.metode || "",
      item.jumlah || 0,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `penjualan_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full overflow-y-auto min-h-screen bg-neutral-100 p-8 font-sans pb-24">
      <div className="max-w-1xl mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-[#F53E1B]">Laporan Penjualan</h1>
            <p className="text-sm text-neutral-500 mt-1">Laporan Pemasukan Mi Madyang</p>
          </div>
          <button onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors shadow-sm">
            <Printer size={16} /> Export CSV
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "TOTAL PENJUALAN", value: formatRupiah(totalPemasukan), icon: Banknote },
            { title: "TOTAL TRANSAKSI", value: totalTransaksi.toLocaleString("id-ID"), icon: Receipt },
            { title: "RATA RATA NOMINAL PENJUALAN", value: formatRupiah(rataRata), icon: Wallet },
          ].map((metric, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm flex flex-col justify-between min-h-[130px] transition-all hover:shadow-md">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2.5 bg-blue-50 text-blue-500 rounded-xl"><metric.icon size={20} /></div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">{metric.title}</p>
                <p className="text-2xl font-extrabold text-neutral-800">{metric.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="p-6 flex flex-wrap justify-between items-center border-b relative z-20">
            <h2 className="text-xl font-bold text-neutral-900">Ringkasan Penjualan</h2>
            <FilterDropdown value={rekapFilter} onChange={(v) => { setRekapFilter(v); setCurrentPage(1); }} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-neutral-400 text-xs font-semibold uppercase tracking-wider border-b border-neutral-100">
                  <th className="px-6 py-3">Rentang Waktu</th>
                  <th className="px-6 py-3">Total Penghasilan</th>
                  <th className="px-6 py-3">Jumlah Transaksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRekap.map((row: { rentang: string; total: number; transaksi: number }, idx: number) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                    <td className="px-6 py-4 text-neutral-600">{row.rentang}</td>
                    <td className="px-6 py-4 font-semibold text-neutral-800">{formatRupiah(row.total)}</td>
                    <td className="px-6 py-4 text-neutral-600">{row.transaksi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t flex justify-between items-center text-sm text-gray-500 bg-white">
            <div className="flex items-center gap-3">
              <span>Showing {totalRekap === 0 ? 0 : startRekap + 1}-{Math.min(startRekap + rekapLimit, totalRekap)} of {totalRekap}</span>
              <select value={rekapLimit} onChange={(e) => { setRekapLimit(Number(e.target.value)); setRekapPage(1); }}
                className="bg-gray-100 px-2 py-1 rounded text-sm">
                {[10, 20, 30, 40].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setRekapPage((p) => Math.max(p - 1, 1))}
                className="w-8 h-8 flex items-center justify-center rounded bg-gray-100">‹</button>
              {Array.from({ length: Math.min(totalRekapPages, 5) }, (_, i) => (
                <button key={i} onClick={() => setRekapPage(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded ${rekapPage === i + 1 ? "bg-red-400 text-white" : "bg-gray-100"}`}>{i + 1}</button>
              ))}
              <button onClick={() => setRekapPage((p) => Math.min(p + 1, totalRekapPages || 1))}
                className="w-8 h-8 flex items-center justify-center rounded bg-gray-100">›</button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-visible">
          <div className="p-6 flex flex-wrap justify-between items-center border-b relative z-20">
            <h2 className="text-xl font-bold text-neutral-900">Detail Pemasukan</h2>
            <div className="flex flex-wrap gap-2 items-center">
              <select value={metodeFilter} onChange={(e) => { setMetodeFilter(e.target.value); setCurrentPage(1); }}
                className="bg-gray-100 px-3 py-2 rounded-lg text-sm focus:outline-none">
                <option value="">Semua Metode</option>
                <option value="Tunai">Tunai</option>
                <option value="QRIS">QRIS</option>
              </select>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Filter kasir..." value={kasirFilter}
                  onChange={(e) => { setKasirFilter(e.target.value); setCurrentPage(1); }}
                  className="bg-gray-100 pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200 w-32" />
              </div>
              <CalendarPicker value={dateRange} onChange={(v) => { setDateRange(v); setCurrentPage(1); }} />
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" placeholder="Cari nomor transaksi..." value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  className="bg-gray-100 pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200" />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-neutral-400 text-xs font-semibold uppercase tracking-wider border-b border-neutral-100">
                  <th className="px-6 py-3">Nomor Transaksi</th>
                  <th className="px-6 py-3">Nama Pemasukan</th>
                  <th className="px-6 py-3">Waktu</th>
                  <th className="px-6 py-3">Kasir</th>
                  <th className="px-6 py-3">Metode</th>
                  <th className="px-6 py-3">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  (paginatedData || []).map((row, idx) => (
                    <tr key={idx} onClick={() => openModal(row)}
                      className={`cursor-pointer ${idx % 2 === 0 ? "bg-white" : "bg-gray-100"} hover:bg-red-50 transition`}>
                      <td className="px-6 py-4 font-semibold text-neutral-700">{row.no}</td>
                      <td className="px-6 py-4 font-bold text-neutral-800">{row.nama}</td>
                      <td className="px-6 py-4 text-neutral-500">{formatTanggal(row.waktu)}</td>
                      <td className="px-6 py-4 text-neutral-600">{row.kasir}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${row.metode === "QRIS" ? "bg-purple-50 text-purple-600" : "bg-green-50 text-green-600"}`}>{row.metode}</span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-neutral-800">{formatRupiah(row.jumlah)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-neutral-400 font-medium">Belum ada data penjualan</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t flex justify-between items-center text-sm text-gray-500 bg-white">
            <div className="flex items-center gap-3">
              <span>Showing {totalItems === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems}</span>
              <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="bg-gray-100 px-2 py-1 rounded text-sm focus:outline-none">
                {pageSizeOptions.map((size) => <option key={size} value={size}>{size}</option>)}
              </select>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="w-8 h-8 flex items-center justify-center rounded bg-gray-100">‹</button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded ${currentPage === i + 1 ? "bg-red-400 text-white" : "bg-gray-100"}`}>{i + 1}</button>
              ))}
              <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="w-8 h-8 flex items-center justify-center rounded bg-gray-100">›</button>
            </div>
          </div>
        </div>

        {isModalOpen && selectedTransaksi && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative">
              <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">✕</button>
              <h2 className="text-xl font-bold mb-4">Detail Transaksi {selectedTransaksi.no}</h2>
              <div className="space-y-2 text-sm mb-4">
                <p><b>Customer:</b> {selectedTransaksi.nama}</p>
                <p><b>Waktu:</b> {formatTanggal(selectedTransaksi.waktu)}</p>
                <p><b>Kasir:</b> {selectedTransaksi.kasir}</p>
                <p><b>Metode:</b> {selectedTransaksi.metode}</p>
                <p><b>Kondisi:</b> {selectedTransaksi.kondisi}</p>
              </div>
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Rincian Pesanan</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedTransaksi.details.map((item, i) => (
                    <div key={i} className="flex justify-between bg-gray-50 p-3 rounded-lg">
                      <div>
                        <p className="font-semibold text-sm">{item.nama}</p>
                        {item.note && <p className="text-xs text-gray-400">Note: {item.note}</p>}
                        <p className="text-xs text-gray-500">{formatRupiah(item.harga)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">x{item.qty}</p>
                        <p className="text-xs text-gray-500">{formatRupiah(item.subtotal)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatRupiah(selectedTransaksi.jumlah)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
