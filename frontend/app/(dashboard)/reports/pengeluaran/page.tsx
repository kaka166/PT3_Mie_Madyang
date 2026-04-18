/* eslint-disable @typescript-eslint/no-explicit-any */
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
} from "lucide-react";

// ─── TYPES ────────────────────────────────────────────────────────────────────
type FilterPeriod = "Minggu" | "Bulan" | "Tahun";

type Pengeluaran = {
  id: string;
  nama: string;
  kategori: string;
  waktu: string;
  pembuat: string;
  jumlah: number;
};

// ─── BACKEND PLACEHOLDER ──────────────────────────────────────────────────────
// TIM BACKEND: Ganti isi fungsi ini dengan pemanggilan API sesungguhnya.
const getPengeluaran = async (): Promise<Pengeluaran[]> => {
  // Dummy data untuk sementara agar UI bisa di-test
  return [
    {
      id: "#22398",
      nama: "Terigu",
      kategori: "Bahan Baku",
      pembuat: "Kevin",
      waktu: "2026-02-14T18:22:32",
      jumlah: 60000,
    },
    {
      id: "#22399",
      nama: "Listrik Bulan Februari",
      kategori: "Operasional",
      pembuat: "Kevin",
      waktu: "2026-02-15T10:00:00",
      jumlah: 500000,
    },
    {
      id: "#22400",
      nama: "Dada Ayam",
      kategori: "Bahan Baku",
      pembuat: "Kevin",
      waktu: "2026-02-16T08:30:00",
      jumlah: 60000,
    },
    {
      id: "#22401",
      nama: "Plastik & Kardus",
      kategori: "Packaging",
      pembuat: "Kevin",
      waktu: "2026-02-16T09:15:00",
      jumlah: 120000,
    },
    {
      id: "#22402",
      nama: "Sayur Cesim",
      kategori: "Bahan Baku",
      pembuat: "Kevin",
      waktu: "2026-02-17T07:45:00",
      jumlah: 60000,
    },
    {
      id: "#22403",
      nama: "Minyak Goreng",
      kategori: "Bahan Baku",
      pembuat: "Kevin",
      waktu: "2026-02-18T18:22:32",
      jumlah: 60000,
    },
  ];
};

// ─── SUB COMPONENTS ────────────────────────────────────────────────────────────

/** Dropdown filter Minggu / Bulan / Tahun */
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
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const options: FilterPeriod[] = ["Minggu", "Bulan", "Tahun"];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-200 bg-white text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors shadow-sm">
        <SlidersHorizontal size={14} className="text-neutral-400" />
        Filter: {value}
        <ChevronDown
          size={14}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl border border-neutral-200 shadow-lg z-20 py-1 overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                value === opt
                  ? "bg-[#FF7067]/10 text-[#FF7067]"
                  : "text-neutral-700 hover:bg-neutral-50"
              }`}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Inline calendar date picker dengan ikon kalender (Mendukung Date Range) */
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
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const daysInMonth = new Date(viewDate.year, viewDate.month + 1, 0).getDate();
  const firstDay = new Date(viewDate.year, viewDate.month, 1).getDay();
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const selectedDay = value.start ? new Date(value.start).getDate() : null;
  const selectedMonth = value.start ? new Date(value.start).getMonth() : null;
  const selectedYear = value.start ? new Date(value.start).getFullYear() : null;

  const prevMonth = () =>
    setViewDate((v) => {
      const m = v.month === 0 ? 11 : v.month - 1;
      const y = v.month === 0 ? v.year - 1 : v.year;
      return { year: y, month: m };
    });
  const nextMonth = () =>
    setViewDate((v) => {
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

    if (value.start && !value.end) {
      setOpen(false);
    }

    setTimeout(() => setOpen(false), 0);
  };

  const displayLabel =
    value.start && value.end
      ? `${new Date(value.start).toLocaleDateString("id-ID")} - ${new Date(
          value.end,
        ).toLocaleDateString("id-ID")}`
      : value.start
        ? new Date(value.start).toLocaleDateString("id-ID")
        : "Hari/Bulan/Tahun";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => {
          setOpen((o) => !o);

          const rect = ref.current?.getBoundingClientRect();
          if (!rect) return;

          const spaceBottom = window.innerHeight - rect.bottom;

          if (spaceBottom < 300) {
            setPosition("top");
          } else {
            setPosition("bottom");
          }
        }}
        className="bg-gray-100 pl-3 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200 flex items-center gap-2">
        <Calendar size={14} className="text-neutral-400" />
        {displayLabel}
        {value.start && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onChange({ start: "", end: "" });
            }}
            className="ml-1 text-neutral-400 hover:text-neutral-600">
            <X size={12} />
          </span>
        )}
      </button>

      {open && (
        <div
          className={`absolute right-0 w-72 bg-white rounded-2xl border border-neutral-200 shadow-xl z-50 p-4
            ${position === "bottom" ? "mt-2 top-full" : "mb-2 bottom-full"}
          `}>
          {/* Nav */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={prevMonth}
              className="p-1 rounded-lg hover:bg-neutral-100 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-bold text-neutral-700">
              {monthNames[viewDate.month]} {viewDate.year}
            </span>
            <button
              onClick={nextMonth}
              className="p-1 rounded-lg hover:bg-neutral-100 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 mb-1">
            {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => (
              <div
                key={d}
                className="text-center text-[10px] font-bold text-neutral-400 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-y-1">
            {Array(firstDay)
              .fill(null)
              .map((_, i) => (
                <div key={`e-${i}`} />
              ))}
            {Array(daysInMonth)
              .fill(null)
              .map((_, i) => {
                const day = i + 1;
                const isSelected =
                  day === selectedDay &&
                  viewDate.month === selectedMonth &&
                  viewDate.year === selectedYear;
                const isToday =
                  day === new Date().getDate() &&
                  viewDate.month === new Date().getMonth() &&
                  viewDate.year === new Date().getFullYear();

                const currentDate = new Date(
                  viewDate.year,
                  viewDate.month,
                  day,
                );

                const isInRange =
                  value.start &&
                  value.end &&
                  currentDate >= new Date(value.start) &&
                  currentDate <= new Date(value.end);

                const isStart =
                  value.start &&
                  day === new Date(value.start).getDate() &&
                  viewDate.month === new Date(value.start).getMonth() &&
                  viewDate.year === new Date(value.start).getFullYear();

                const isEnd =
                  value.end &&
                  day === new Date(value.end).getDate() &&
                  viewDate.month === new Date(value.end).getMonth() &&
                  viewDate.year === new Date(value.end).getFullYear();
                return (
                  <button
                    key={day}
                    onClick={() => selectDay(day)}
                    className={`text-center text-sm h-8 w-full rounded-lg font-medium transition-colors
                    ${isStart || isEnd ? "bg-[#FF7067] text-white" : ""}
                    ${isInRange && !isStart && !isEnd ? "bg-red-100 text-red-600" : ""}
                    ${isToday && !isSelected ? "border border-[#FF7067] text-[#FF7067]" : ""}
                    ${!isSelected && !isToday ? "text-neutral-700 hover:bg-neutral-100" : ""}
                  `}>
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
  const [rekapFilter, setRekapFilter] = useState<FilterPeriod>("Bulan");
  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  }>({ start: "", end: "" });
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const pageSizeOptions = [10, 20, 30, 40];

  const [riwayatData, setRiwayatData] = useState<Pengeluaran[]>([]);

  // ── BACKEND FETCHING ──
  const fetchData = async () => {
    try {
      const data = await getPengeluaran();
      setRiwayatData(data);
    } catch (error) {
      console.error("Failed to fetch pengeluaran data", error);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchData();
    };

    load();
    // Jika tidak butuh real-time polling, interval ini bisa dihapus/di-comment
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCurrentPage((prev) => (prev !== 1 ? 1 : prev));
  }, [dateRange, search, rekapFilter]);

  // ── FILTERING DATA UNTUK TABEL DETAIL PENGELUARAN ──
  const filteredRiwayat = riwayatData.filter((item) => {
    if (!item.waktu) return true;

    const date = new Date(item.waktu);
    const now = new Date();

    const matchSearch =
      item.id?.toLowerCase().includes(search.toLowerCase()) ||
      item.nama?.toLowerCase().includes(search.toLowerCase());

    const matchDate =
      dateRange.start && dateRange.end
        ? new Date(item.waktu) >= new Date(dateRange.start) &&
          new Date(item.waktu) <=
            (() => {
              const end = new Date(dateRange.end);
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
      matchPeriod =
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();
    }
    if (rekapFilter === "Tahun") {
      matchPeriod = date.getFullYear() === now.getFullYear();
    }

    return matchSearch && matchDate && matchPeriod;
  });

  const totalItems = filteredRiwayat.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = (filteredRiwayat || []).slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  // ── FILTERING & GROUPING UNTUK TABEL RINGKASAN PENGELUARAN ──
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
      matchPeriod =
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();
    }
    if (rekapFilter === "Tahun") {
      matchPeriod = date.getFullYear() === now.getFullYear();
    }

    return matchPeriod;
  });

  const groupedRekap = Object.values(
    filteredRekap.reduce((acc: Record<string, any>, item: Pengeluaran) => {
      const date = new Date(item.waktu);
      let key = "";

      if (rekapFilter === "Minggu") {
        const start = new Date(date);
        start.setDate(date.getDate() - date.getDay());
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        key = `${start.toLocaleDateString("id-ID")} - ${end.toLocaleDateString("id-ID")}`;
      }
      if (rekapFilter === "Bulan") {
        key = date.toLocaleDateString("id-ID", {
          month: "long",
          year: "numeric",
        });
      }
      if (rekapFilter === "Tahun") {
        key = date.getFullYear().toString();
      }

      if (!acc[key]) {
        acc[key] = { rentang: key, total: 0, transaksi: 0 };
      }

      acc[key].total += Number(item.jumlah || 0);
      acc[key].transaksi += 1;

      return acc;
    }, {}),
  );

  const totalPengeluaran = filteredRekap.reduce(
    (acc, item) => acc + Number(item.jumlah || 0),
    0,
  );
  const totalTransaksi = filteredRekap.length;
  const rataRata = totalTransaksi > 0 ? totalPengeluaran / totalTransaksi : 0;

  const [rekapPage, setRekapPage] = useState(1);
  const [rekapLimit, setRekapLimit] = useState(10);
  const totalRekap = groupedRekap.length;
  const startRekap = (rekapPage - 1) * rekapLimit;
  const paginatedRekap = groupedRekap.slice(
    startRekap,
    startRekap + rekapLimit,
  );
  const totalRekapPages = Math.ceil(totalRekap / rekapLimit);

  // ── RENDER COMPONENT ──
  return (
    <div className="h-full overflow-y-auto min-h-screen bg-neutral-100 p-8 font-sans pb-24">
      <div className="max-w-1xl mx-auto space-y-6">
        {/* ── Header ── */}
        <div>
          <h1 className="text-3xl font-bold text-[#8B1A1A]">
            Laporan Pengeluaran
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Laporan Pengeluaran Mi Madyang
          </p>
        </div>

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "TOTAL PENGELUARAN",
              value: formatRupiah(totalPengeluaran),
              icon: Banknote,
            },
            {
              title: "TOTAL TRANSAKSI",
              value: totalTransaksi.toLocaleString("id-ID"),
              icon: Receipt,
            },
            {
              title: "RATA RATA NOMINAL PENGELUARAN",
              value: formatRupiah(rataRata),
              icon: Wallet,
            },
          ].map((metric, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm flex flex-col justify-between min-h-[130px]">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2.5 bg-red-50 text-red-500 rounded-xl">
                  <metric.icon size={20} />
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
                  {metric.title}
                </p>
                <p className="text-2xl font-extrabold text-neutral-800">
                  {metric.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Ringkasan Pengeluaran Table ── */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          {/* header */}
          <div className="p-6 flex flex-wrap justify-between items-center border-b border-neutral-100 relative z-20">
            <h2 className="text-xl font-bold text-neutral-900">
              Ringkasan Pengeluaran
            </h2>
            <FilterDropdown value={rekapFilter} onChange={setRekapFilter} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-neutral-400 text-xs font-semibold uppercase tracking-wider border-b border-neutral-100">
                  <th className="px-6 py-3">Rentang Waktu</th>
                  <th className="px-6 py-3">Total Pengeluaran</th>
                  <th className="px-6 py-3">Jumlah Transaksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRekap.map(
                  (
                    row: { rentang: string; total: number; transaksi: number },
                    idx: number,
                  ) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? "bg-white" : "bg-neutral-50"}>
                      <td className="px-6 py-4 text-neutral-600">
                        {row.rentang}
                      </td>

                      <td className="px-6 py-4 font-semibold text-neutral-800">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(row.total)}
                      </td>

                      <td className="px-6 py-4 text-neutral-600">
                        {row.transaksi}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>

          {/* pagination ringkasan */}
          <div className="p-4 border-t flex justify-between items-center text-sm text-gray-500 bg-white">
            <div className="flex items-center gap-3">
              <span>
                Showing {totalRekap === 0 ? 0 : startRekap + 1}-
                {Math.min(startRekap + rekapLimit, totalRekap)} of {totalRekap}
              </span>

              <select
                value={rekapLimit}
                onChange={(e) => {
                  setRekapLimit(Number(e.target.value));
                  setRekapPage(1);
                }}
                className="bg-gray-100 px-2 py-1 rounded text-sm">
                {[10, 20, 30, 40].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-1">
              <button
                onClick={() => setRekapPage((p) => Math.max(p - 1, 1))}
                className="w-8 h-8 flex items-center justify-center rounded bg-gray-100">
                ‹
              </button>

              {Array.from({ length: Math.min(totalRekapPages, 5) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setRekapPage(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded ${
                    rekapPage === i + 1
                      ? "bg-red-400 text-white"
                      : "bg-gray-100"
                  }`}>
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setRekapPage((p) => Math.min(p + 1, totalRekapPages || 1))
                }
                className="w-8 h-8 flex items-center justify-center rounded bg-gray-100">
                ›
              </button>
            </div>
          </div>
        </div>

        {/* ── Detail Pengeluaran Table ── */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-visible">
          {/* table header bar */}
          <div className="p-6 flex flex-wrap justify-between items-center border-b border-neutral-100 relative z-20">
            <h2 className="text-xl font-bold text-neutral-900">
              Detail Pengeluaran
            </h2>
            <div className="flex flex-wrap gap-2 items-center">
              <CalendarPicker value={dateRange} onChange={setDateRange} />

              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Cari transaksi..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-gray-100 pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-neutral-400 text-xs font-semibold uppercase tracking-wider border-b border-neutral-100">
                  <th className="px-6 py-3">ID Transaksi</th>
                  <th className="px-6 py-3">Nama Pengeluaran</th>
                  <th className="px-6 py-3">Kategori</th>
                  <th className="px-6 py-3">Waktu</th>
                  <th className="px-6 py-3">Dibuat Oleh</th>
                  <th className="px-6 py-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {(paginatedData || []).map((row, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-white" : "bg-neutral-50"}>
                    <td className="px-6 py-4 font-semibold text-neutral-700">
                      {row.id}
                    </td>
                    <td className="px-6 py-4 font-bold text-neutral-800">
                      {row.nama}
                    </td>
                    <td className="px-6 py-4 text-neutral-600">
                      {row.kategori}
                    </td>
                    <td className="px-6 py-4 text-neutral-500">
                      {new Date(row.waktu).toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-neutral-600">
                      {row.pembuat}
                    </td>
                    <td className="px-6 py-4 font-semibold text-neutral-800">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(row.jumlah)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* pagination detail */}
          <div className="p-4 border-t flex justify-between items-center text-sm text-gray-500 bg-white">
            <div className="flex items-center gap-3">
              <span>
                Showing {totalItems === 0 ? 0 : startIndex + 1}-
                {Math.min(startIndex + itemsPerPage, totalItems)} of{" "}
                {totalItems}
              </span>

              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-gray-100 px-2 py-1 rounded text-sm focus:outline-none">
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="w-8 h-8 flex items-center justify-center rounded bg-gray-100">
                ‹
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded ${
                    currentPage === i + 1
                      ? "bg-red-400 text-white"
                      : "bg-gray-100"
                  }`}>
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="w-8 h-8 flex items-center justify-center rounded bg-gray-100">
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
