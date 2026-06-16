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
import { getPengeluaran } from "@/services/pengeluaranService";
import { formatTanggal, formatTanggalRange } from "@/utils/formatTanggal";
import { formatRupiah } from "@/utils/formatRupiah";

type FilterPeriod = "Minggu" | "Bulan" | "Tahun";

type Pengeluaran = {
  id: string;
  nama: string;
  kategori: string;
  waktu: string;
  user_id: string;
  jumlah: number;
  deskripsi?: string;
};

function FilterDropdown({
  value,
  onChange,
}: {
  value: FilterPeriod;
  onChange: (v: FilterPeriod) => void;
}) {
  const [open, setOpen] = useState(false);
  const [dropStyle, setDropStyle] = useState<React.CSSProperties>({});
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = () => setOpen(false);
    window.addEventListener("scroll", handler, true);
    return () => window.removeEventListener("scroll", handler, true);
  }, [open]);

  const options: FilterPeriod[] = ["Minggu", "Bulan", "Tahun"];

  return (
    <div ref={ref}>
      <button onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) {
            const rect = ref.current?.getBoundingClientRect();
            if (rect) {
              setDropStyle({
                position: "fixed",
                top: rect.bottom + 8,
                right: window.innerWidth - rect.right,
                width: 144,
              });
            }
          }
        }}
        className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-xl border border-neutral-200 bg-white text-xs md:text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors shadow-sm">
        <SlidersHorizontal size={13} className="text-neutral-400" />
        <span className="hidden sm:inline">Filter: {value}</span>
        <span className="sm:hidden">{value}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div style={dropStyle} className="bg-white rounded-xl border border-neutral-200 shadow-lg z-[9999] py-1">
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

import { PeriodFilter, PERIOD_PRESETS, DateRange } from "@/components/common/PeriodFilter";

export default function LaporanPengeluaran() {
  const [rekapFilter, setRekapFilter] = useState<FilterPeriod>("Bulan");
  const today = new Date();
  const todayISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: todayISO, end: todayISO });
  const [search, setSearch] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const pageSizeOptions = [10, 20, 30, 40];

  const [riwayatData, setRiwayatData] = useState<Pengeluaran[]>([]);

  useEffect(() => {
    let mounted = true;
    getPengeluaran()
      .then((data) => { if (mounted) setRiwayatData(data); })
      .catch((error) => console.error("Failed to fetch pengeluaran data", error));
    const interval = setInterval(() => {
      getPengeluaran()
        .then((data) => setRiwayatData(data))
        .catch((error) => console.error("Failed to fetch pengeluaran data", error));
    }, 3000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  const filteredRiwayat = riwayatData.filter((item) => {
    if (!item.waktu) return true;
    const date = new Date(item.waktu);
    const now = new Date();

    const matchSearch = item.id?.toLowerCase().includes(search.toLowerCase()) ||
      item.nama?.toLowerCase().includes(search.toLowerCase());

    const matchUser = userFilter ? item.user_id?.toLowerCase().includes(userFilter.toLowerCase()) : true;

    const matchKategori = kategoriFilter ? item.kategori === kategoriFilter : true;

    const matchDate = dateRange.start
      ? new Date(item.waktu) >= new Date(dateRange.start) &&
        new Date(item.waktu) <= (() => {
          const end = dateRange.end ? new Date(dateRange.end) : new Date(dateRange.start);
          end.setHours(23, 59, 59, 999);
          return end;
        })()
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

    return matchSearch && matchDate && matchPeriod && matchUser && matchKategori;
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
    filteredRekap.reduce((acc: Record<string, { rentang: string; total: number; transaksi: number }>, item: Pengeluaran) => {
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

  const totalPengeluaran = filteredRekap.reduce((acc, item) => acc + Number(item.jumlah || 0), 0);
  const totalTransaksi = filteredRekap.length;
  const rataRata = totalTransaksi > 0 ? totalPengeluaran / totalTransaksi : 0;

  const [rekapPage, setRekapPage] = useState(1);
  const [rekapLimit, setRekapLimit] = useState(10);
  const totalRekap = groupedRekap.length;
  const startRekap = (rekapPage - 1) * rekapLimit;
  const paginatedRekap = groupedRekap.slice(startRekap, startRekap + rekapLimit);
  const totalRekapPages = Math.ceil(totalRekap / rekapLimit);

  const kategoriOptions = ["", "Operasional", "Gaji", "Sewa", "Bahan Baku", "Lain-lain"];

  const exportCSV = () => {
    const headers = ["ID Transaksi", "Nama", "Kategori", "Waktu", "Dibuat Oleh", "Total"];
    const rows = filteredRiwayat.map((item) => [
      item.id || "",
      item.nama || "",
      item.kategori || "",
      item.waktu ? formatTanggal(item.waktu) : "",
      item.user_id || "",
      item.jumlah || 0,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pengeluaran_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full overflow-y-auto min-h-screen bg-neutral-100 p-4 md:p-8 font-sans pb-24">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-[#F53E1B]">Laporan Pengeluaran</h1>
            <p className="text-xs md:text-sm text-neutral-500 mt-0.5 md:mt-1">Laporan Pengeluaran Mi Madyang</p>
          </div>
          <button onClick={exportCSV}
            className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white border border-neutral-200 rounded-xl text-xs md:text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors shadow-sm">
            <Printer size={14} /> CSV
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {[
            { title: "TOTAL PENGELUARAN", value: formatRupiah(totalPengeluaran), icon: Banknote },
            { title: "TOTAL TRANSAKSI", value: totalTransaksi.toLocaleString("id-ID"), icon: Receipt },
            { title: "RATA RATA NOMINAL PENGELUARAN", value: formatRupiah(rataRata), icon: Wallet },
          ].map((metric, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4 md:p-6 border border-neutral-100 shadow-sm transition-all hover:shadow-md">
              <div className="p-2 md:p-2.5 bg-red-50 text-red-500 rounded-xl w-fit mb-2 md:mb-3"><metric.icon size={18} /></div>
              <div>
                <p className="text-[9px] md:text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5 md:mb-1">{metric.title}</p>
                <p className="text-xl md:text-2xl font-extrabold text-neutral-800">{metric.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-visible">
          <div className="p-4 md:p-6 flex flex-wrap justify-between items-center border-b relative z-20">
            <h2 className="text-base md:text-xl font-bold text-neutral-900">Ringkasan Pengeluaran</h2>
            <FilterDropdown value={rekapFilter} onChange={(v) => { setRekapFilter(v); setCurrentPage(1); }} />
          </div>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-5 py-3 whitespace-nowrap">Rentang Waktu</th>
                  <th className="px-5 py-3 whitespace-nowrap">Total Pengeluaran</th>
                  <th className="px-5 py-3 whitespace-nowrap">Jumlah Transaksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRekap.map((row: { rentang: string; total: number; transaksi: number }, idx: number) => (
                  <tr key={idx} className="even:bg-gray-50 odd:bg-white hover:bg-red-50 transition-colors">
                    <td className="px-5 py-3.5 text-neutral-600">{row.rentang}</td>
                    <td className="px-5 py-3.5 font-semibold text-neutral-800">{formatRupiah(row.total)}</td>
                    <td className="px-5 py-3.5 text-neutral-600">{row.transaksi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {paginatedRekap.length === 0 ? (
              <div className="py-6 text-center text-gray-400 text-sm">Belum ada data</div>
            ) : (
              paginatedRekap.map((row, idx) => (
                <div key={idx} className="flex items-center justify-between px-3 py-2.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-neutral-700 truncate">{row.rentang}</p>
                    <p className="text-[10px] text-neutral-400">{row.transaksi} transaksi</p>
                  </div>
                  <span className="text-sm font-bold text-neutral-800 shrink-0 ml-2">{formatRupiah(row.total)}</span>
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t flex justify-between items-center bg-white">
            <div className="flex items-center gap-4">
              <span className="text-gray-500 font-medium text-sm">
                Showing {totalRekap === 0 ? 0 : startRekap + 1}-{Math.min(startRekap + rekapLimit, totalRekap)} of {totalRekap}
              </span>
              <select value={rekapLimit} onChange={(e) => { setRekapLimit(Number(e.target.value)); setRekapPage(1); }}
                className="bg-gray-100 px-2 py-1 rounded text-sm">
                {[10, 20, 30, 40].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-1.5 font-bold">
              <button onClick={() => setRekapPage((p) => Math.max(p - 1, 1))} disabled={rekapPage === 1}
                className={`w-9 h-9 flex items-center justify-center rounded ${rekapPage === 1 ? "bg-gray-100 text-gray-400" : "bg-red-400 text-white"}`}>
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalRekapPages }, (_, i) => {
                const page = i + 1;
                return (
                  <button key={i} onClick={() => setRekapPage(page)}
                    className={`w-9 h-9 flex items-center justify-center rounded ${rekapPage === page ? "bg-red-400 text-white" : "bg-gray-100"}`}>
                    {page}
                  </button>
                );
              })}
              <button onClick={() => setRekapPage((p) => Math.min(p + 1, totalRekapPages))} disabled={rekapPage === totalRekapPages || totalRekapPages === 0}
                className={`w-9 h-9 flex items-center justify-center rounded ${rekapPage === totalRekapPages || totalRekapPages === 0 ? "bg-gray-100 text-gray-400" : "bg-red-400 text-white"}`}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-visible">
          <div className="p-4 md:p-6 flex flex-col md:flex-row md:flex-wrap justify-between items-start md:items-center border-b gap-2 md:gap-3 relative z-20">
            <h2 className="text-base md:text-xl font-bold text-neutral-900">Detail Pengeluaran</h2>
            <div className="flex flex-wrap gap-1.5 md:gap-2 items-center w-full md:w-auto">
              <select value={kategoriFilter} onChange={(e) => setKategoriFilter(e.target.value)}
                className="bg-gray-100 px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm focus:outline-none">
                {kategoriOptions.map((k) => (
                  <option key={k} value={k}>{k || "Semua"}</option>
                ))}
              </select>
              <div className="relative">
                <User size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="User..." value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="bg-gray-100 pl-7 md:pl-9 pr-2 md:pr-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm focus:outline-none w-20 md:w-32" />
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                <input type="text" placeholder="Cari..." value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  className="bg-gray-100 pl-7 md:pl-9 pr-2 md:pr-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm focus:outline-none w-20 md:w-auto" />
              </div>
            </div>
          </div>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-5 py-3 whitespace-nowrap">ID Transaksi</th>
                  <th className="px-5 py-3 whitespace-nowrap">Nama Pengeluaran</th>
                  <th className="px-5 py-3 whitespace-nowrap">Kategori</th>
                  <th className="px-5 py-3 whitespace-nowrap">Waktu</th>
                  <th className="px-5 py-3 whitespace-nowrap">Dibuat Oleh</th>
                  <th className="px-5 py-3 whitespace-nowrap">Total</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  (paginatedData || []).map((row, idx) => (
                    <tr key={idx} className="even:bg-gray-50 odd:bg-white hover:bg-red-50 transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-neutral-700">{row.id}</td>
                      <td className="px-5 py-3.5 font-bold text-neutral-800">{row.nama}</td>
                      <td className="px-5 py-3.5 ">
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{
                          backgroundColor: row.kategori === "Operasional" ? "#e0f2fe" : row.kategori === "Gaji" ? "#dcfce7" : row.kategori === "Sewa" ? "#fef3c7" : row.kategori === "Bahan Baku" ? "#fae8ff" : "#f3e8ff",
                          color: row.kategori === "Operasional" ? "#0369a1" : row.kategori === "Gaji" ? "#166534" : row.kategori === "Sewa" ? "#92400e" : row.kategori === "Bahan Baku" ? "#86198f" : "#5b21b6",
                        }}>{row.kategori}</span>
                      </td>
                      <td className="px-5 py-3.5 text-neutral-500">{formatTanggal(row.waktu)}</td>
                      <td className="px-5 py-3.5 text-neutral-600">{row.user_id}</td>
                      <td className="px-5 py-3.5 font-semibold text-neutral-800">{formatRupiah(row.jumlah)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-neutral-400 font-medium">Belum ada data pengeluaran</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <div key={idx} className="px-3 py-2.5 hover:bg-red-50 transition-colors">
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-neutral-800 truncate">{row.nama}</p>
                      <p className="text-[10px] text-neutral-400">#{row.id}</p>
                    </div>
                    <span className="text-xs font-bold text-neutral-800 shrink-0">{formatRupiah(row.jumlah)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-neutral-400">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={{
                      backgroundColor: row.kategori === "Operasional" ? "#e0f2fe" : row.kategori === "Gaji" ? "#dcfce7" : row.kategori === "Sewa" ? "#fef3c7" : row.kategori === "Bahan Baku" ? "#fae8ff" : "#f3e8ff",
                      color: row.kategori === "Operasional" ? "#0369a1" : row.kategori === "Gaji" ? "#166534" : row.kategori === "Sewa" ? "#92400e" : row.kategori === "Bahan Baku" ? "#86198f" : "#5b21b6",
                    }}>{row.kategori}</span>
                    <span>{formatTanggal(row.waktu)}</span>
                    <span>{row.user_id}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-neutral-400 text-sm">Belum ada data pengeluaran</div>
            )}
          </div>
          <div className="p-4 border-t flex justify-between items-center bg-white">
            <div className="flex items-center gap-4">
              <span className="text-gray-500 font-medium text-sm">
                Showing {totalItems === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems}
              </span>
              <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="bg-gray-100 px-2 py-1 rounded text-sm">
                {pageSizeOptions.map((size) => <option key={size} value={size}>{size}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-1.5 font-bold">
              <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}
                className={`w-9 h-9 flex items-center justify-center rounded ${currentPage === 1 ? "bg-gray-100 text-gray-400" : "bg-red-400 text-white"}`}>
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => {
                const page = i + 1;
                return (
                  <button key={i} onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 flex items-center justify-center rounded ${currentPage === page ? "bg-red-400 text-white" : "bg-gray-100"}`}>
                    {page}
                  </button>
                );
              })}
              <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0}
                className={`w-9 h-9 flex items-center justify-center rounded ${currentPage === totalPages || totalPages === 0 ? "bg-gray-100 text-gray-400" : "bg-red-400 text-white"}`}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
