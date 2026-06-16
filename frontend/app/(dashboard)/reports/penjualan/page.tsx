"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Banknote,
  Receipt,
  Wallet,
  SlidersHorizontal,
  ChevronDown,
  Search,
  User,
  Printer,
  FileSpreadsheet,
} from "lucide-react";
import { getLaporanPemasukan } from "@/services/laporanService";
import { formatTanggal, formatTanggalRange } from "@/utils/formatTanggal";
import { formatRupiah } from "@/utils/formatRupiah";
import {
  PeriodFilter,
  DateRange,
  PERIOD_PRESETS,
} from "@/components/common/PeriodFilter";

type FilterPeriod = "Harian" | "Mingguan" | "Bulanan" | "Tahunan";

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
  const options: FilterPeriod[] = ["Harian", "Mingguan", "Bulanan", "Tahunan"];

  useEffect(() => {
    if (!open) return;
    const handler = () => setOpen(false);
    window.addEventListener("scroll", handler, true);
    return () => window.removeEventListener("scroll", handler, true);
  }, [open]);

  return (
    <div ref={ref}>
      <button
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) {
            const rect = ref.current?.getBoundingClientRect();
            if (rect) {
              setDropStyle({
                position: "fixed",
                top: rect.bottom + 8,
                right: window.innerWidth - rect.right,
                width: 160,
              });
            }
          }
        }}
        className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-xl border border-neutral-200 bg-white text-xs md:text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors shadow-sm">
        <SlidersHorizontal size={13} className="text-neutral-400" />
        <span className="hidden sm:inline">Rekap: {value}</span>
        <span className="sm:hidden">{value}</span>
        <ChevronDown
          size={14}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div
          style={dropStyle}
          className="bg-white rounded-xl border border-neutral-200 shadow-lg z-[9999] py-1">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${value === opt ? "bg-red-50 text-[#FF7067]" : "text-neutral-700 hover:bg-neutral-50"}`}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LaporanPemasukan() {
  const [rekapFilter, setRekapFilter] = useState<FilterPeriod>("Bulanan");
  const [dateRange, setDateRange] = useState<DateRange>({ start: "", end: "" });
  const [search, setSearch] = useState("");
  const [kasirFilter, setKasirFilter] = useState("");
  const [metodeFilter, setMetodeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getLaporanPemasukan({
        start_date: dateRange.start || undefined,
        end_date: dateRange.end || undefined,
        metode: metodeFilter || undefined,
      });
      if (res.success) setData(res.data || []);
      else setData([]);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [dateRange, metodeFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredData = data.filter((item) => {
    const matchSearch =
      !search ||
      item.nama?.toLowerCase().includes(search.toLowerCase()) ||
      item.no?.includes(search);
    const matchKasir =
      !kasirFilter ||
      item.kasir?.toLowerCase().includes(kasirFilter.toLowerCase());
    return matchSearch && matchKasir;
  });

  // Group for rekap
  const getGroupKey = (waktu: string) => {
    const d = new Date(waktu);
    if (rekapFilter === "Harian")
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    if (rekapFilter === "Mingguan") {
      const start = new Date(d);
      start.setDate(d.getDate() - d.getDay());
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return formatTanggalRange(
        start.toISOString().slice(0, 10),
        end.toISOString().slice(0, 10),
      );
    }
    if (rekapFilter === "Bulanan")
      return d.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
    return d.getFullYear().toString();
  };

  const groupedRekap = Object.values(
    data.reduce(
      (
        acc: Record<
          string,
          { rentang: string; total: number; transaksi: number }
        >,
        item,
      ) => {
        if (!item.waktu) return acc;
        const key = getGroupKey(item.waktu);
        if (!acc[key]) acc[key] = { rentang: key, total: 0, transaksi: 0 };
        acc[key].total += Number(item.jumlah || 0);
        acc[key].transaksi += 1;
        return acc;
      },
      {},
    ),
  );

  const totalPemasukan = data.reduce(
    (acc, i) => acc + Number(i.jumlah || 0),
    0,
  );
  const totalTransaksi = data.length;
  const rataRata = totalTransaksi > 0 ? totalPemasukan / totalTransaksi : 0;

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const exportCSV = () => {
    const headers = [
      "No. Transaksi",
      "Nama",
      "Waktu",
      "Kasir",
      "Metode",
      "Kondisi",
      "Jumlah",
    ];
    const rows = filteredData.map((item) => [
      item.no || "",
      item.nama || "",
      item.waktu ? formatTanggal(item.waktu) : "",
      item.kasir || "",
      item.metode || "",
      item.kondisi || "",
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

  const printReport = () => window.print();

  return (
    <div className="h-full overflow-y-auto min-h-screen bg-neutral-100 p-4 md:p-8 font-sans pb-24">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#F53E1B]">
              Laporan Penjualan
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Laporan Pemasukan Mi Madyang
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-600 hover:bg-neutral-50 shadow-sm">
              <FileSpreadsheet size={15} /> CSV
            </button>
            <button
              onClick={printReport}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-600 hover:bg-neutral-50 shadow-sm">
              <Printer size={15} /> Print
            </button>
          </div>
        </div>

        {/* Period filter presets */}
        <div className="flex flex-wrap gap-2 items-center">
          {PERIOD_PRESETS.map((p) => {
            const today = new Date();
            const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
            const startDate =
              p.days === 0
                ? todayStr
                : (() => {
                    const d = new Date();
                    d.setDate(d.getDate() - p.days);
                    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                  })();
            const isActive =
              dateRange.start === startDate && dateRange.end === todayStr;
            return (
              <button
                key={p.label}
                onClick={() =>
                  setDateRange({ start: startDate, end: todayStr })
                }
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                  isActive
                    ? "bg-[#F53E1B] text-white border-[#F53E1B]"
                    : "bg-white border-neutral-200 text-neutral-600 hover:border-red-300 hover:text-red-500"
                }`}>
                {p.label}
              </button>
            );
          })}
          <PeriodFilter
            value={dateRange}
            onChange={setDateRange}
            showPresets={false}
          />
          {(dateRange.start || dateRange.end) && (
            <button
              onClick={() => setDateRange({ start: "", end: "" })}
              className="text-xs text-gray-400 hover:text-red-500 underline">
              Reset
            </button>
          )}
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          {[
            {
              title: "TOTAL PENJUALAN",
              value: formatRupiah(totalPemasukan),
              icon: Banknote,
            },
            {
              title: "TOTAL TRANSAKSI",
              value: totalTransaksi.toLocaleString("id-ID"),
              icon: Receipt,
            },
            {
              title: "RATA-RATA PER TRANSAKSI",
              value: formatRupiah(rataRata),
              icon: Wallet,
            },
          ].map((m, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 md:p-5 border border-neutral-100 shadow-sm hover:shadow-md transition-all">
              <div className="p-2 md:p-2.5 bg-blue-50 text-blue-500 rounded-xl w-fit mb-2 md:mb-3">
                <m.icon size={18} />
              </div>
              <div>
                <p className="text-[9px] md:text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5 md:mb-1">
                  {m.title}
                </p>
                <p className="text-xl md:text-2xl font-extrabold text-neutral-800">
                  {loading ? "..." : m.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Rekap Table */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-visible">
          <div className="p-4 md:p-5 flex flex-wrap justify-between items-center border-b gap-2 md:gap-3 relative z-50">
            <h2 className="text-base md:text-lg font-bold text-neutral-900">
              Ringkasan Penjualan
            </h2>
            <FilterDropdown value={rekapFilter} onChange={setRekapFilter} />
          </div>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-5 py-3 whitespace-nowrap">Rentang Waktu</th>
                  <th className="px-5 py-3 whitespace-nowrap">Total Penghasilan</th>
                  <th className="px-5 py-3 whitespace-nowrap">Jumlah Transaksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-400">
                      Memuat...
                    </td>
                  </tr>
                ) : groupedRekap.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-400">
                      Belum ada data
                    </td>
                  </tr>
                ) : (
                  groupedRekap.map((row: any, idx) => (
                    <tr
                      key={idx}
                      className="even:bg-gray-50 odd:bg-white hover:bg-red-50 transition-colors">
                      <td className="px-5 py-3.5 text-neutral-600">
                        {row.rentang}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-neutral-800">
                        {formatRupiah(row.total)}
                      </td>
                      <td className="px-5 py-3.5 text-neutral-600">
                        {row.transaksi}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {loading ? (
              <div className="py-6 text-center text-gray-400 text-sm">Memuat...</div>
            ) : groupedRekap.length === 0 ? (
              <div className="py-6 text-center text-gray-400 text-sm">Belum ada data</div>
            ) : (
              groupedRekap.map((row: any, idx) => (
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
        </div>

        {/* Detail Table */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-visible">
          <div className="p-4 md:p-5 flex flex-wrap justify-between items-center border-b gap-2 md:gap-3 relative z-20">
            <h2 className="text-base md:text-lg font-bold text-neutral-900">
              Detail Pemasukan
            </h2>
            <div className="flex flex-wrap gap-1.5 md:gap-2 items-center">
              <select
                value={metodeFilter}
                onChange={(e) => {
                  setMetodeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-gray-100 px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm focus:outline-none">
                <option value="">Semua Metode</option>
                <option value="Tunai">Tunai</option>
                <option value="QRIS">QRIS</option>
              </select>
              <div className="relative">
                <User size={12} className="md:size-[14px] absolute left-2.5 md:left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Kasir..."
                  value={kasirFilter}
                  onChange={(e) => {
                    setKasirFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-gray-100 pl-7 md:pl-9 pr-2 md:pr-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm focus:outline-none w-24 md:w-32"
                />
              </div>
              <div className="relative">
                <Search
                  className="absolute left-2.5 md:left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={12} />
                <input
                  type="text"
                  placeholder="Cari..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-gray-100 pl-7 md:pl-9 pr-2 md:pr-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm focus:outline-none w-20 md:w-auto"
                />
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="overflow-x-auto bg-white rounded-3xl shadow-sm border border-gray-100">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-5 py-3 ">No. Transaksi</th>
                    <th className="px-5 py-3 ">Customer</th>
                    <th className="px-5 py-3 ">Waktu</th>
                    <th className="px-5 py-3 ">Kasir</th>
                    <th className="px-5 py-3 ">Metode</th>
                    <th className="px-5 py-3 ">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-400">
                        Memuat data...
                      </td>
                    </tr>
                  ) : paginatedData.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-gray-400">
                        Belum ada data penjualan
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((row, idx) => (
                      <tr
                        key={idx}
                        onClick={() => setSelectedRow(row)}
                        className={`cursor-pointer ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-red-50 transition`}>
                        <td className="px-5 py-3.5 font-semibold text-neutral-700">
                          {row.no}
                        </td>
                        <td className="px-5 py-3.5 font-bold text-neutral-800">
                          {row.nama}
                        </td>
                        <td className="px-5 py-3.5 text-neutral-500 text-xs">
                          {formatTanggal(row.waktu)}
                        </td>
                        <td className="px-5 py-3.5 text-neutral-600">
                          {row.kasir}
                        </td>
                        <td className="px-5 py-3.5 ">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${row.metode === "QRIS" ? "bg-purple-50 text-purple-600" : "bg-green-50 text-green-600"}`}>
                            {row.metode}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-neutral-800">
                          {formatRupiah(row.jumlah)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="md:hidden divide-y divide-gray-100">
            {loading ? (
              <div className="py-6 text-center text-gray-400 text-sm">Memuat data...</div>
            ) : paginatedData.length === 0 ? (
              <div className="py-6 text-center text-gray-400 text-sm">Belum ada data penjualan</div>
            ) : (
              paginatedData.map((row, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedRow(row)}
                  className="px-3 py-2.5 hover:bg-red-50 transition cursor-pointer">
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-xs font-semibold text-neutral-800 truncate">{row.no}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-orange-50 text-[#F53E1B] shrink-0">{row.kondisi}</span>
                    </div>
                    <span className={`shrink-0 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${row.metode === "QRIS" ? "bg-purple-50 text-purple-600" : "bg-green-50 text-green-600"}`}>{row.metode}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-neutral-800 truncate">{row.nama}</p>
                      <p className="text-[10px] text-neutral-400 truncate">{row.kasir} &middot; {formatTanggal(row.waktu)}</p>
                    </div>
                    <span className="text-xs font-bold text-neutral-800 shrink-0 ml-2">{formatRupiah(row.jumlah)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Pagination */}
          <div className="p-4 border-t flex justify-between items-center text-sm text-gray-500">
            <span>
              Showing {filteredData.length === 0 ? 0 : startIndex + 1}–
              {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
              {filteredData.length}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center rounded bg-gray-100 disabled:opacity-40">
                ‹
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 flex items-center justify-center rounded ${currentPage === i + 1 ? "bg-[#F53E1B] text-white" : "bg-gray-100"}`}>
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded bg-gray-100 disabled:opacity-40">
                ›
              </button>
            </div>
          </div>
        </div>

        {/* Modal detail */}
        {selectedRow && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative">
              <button
                onClick={() => setSelectedRow(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                ✕
              </button>
              <h2 className="text-xl font-bold mb-4">
                Detail Transaksi {selectedRow.no}
              </h2>
              <div className="space-y-2 text-sm mb-4">
                <p>
                  <b>Customer:</b> {selectedRow.nama}
                </p>
                <p>
                  <b>Waktu:</b> {formatTanggal(selectedRow.waktu)}
                </p>
                <p>
                  <b>Kasir:</b> {selectedRow.kasir}
                </p>
                <p>
                  <b>Metode:</b> {selectedRow.metode}
                </p>
                <p>
                  <b>Kondisi:</b> {selectedRow.kondisi}
                </p>
              </div>
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Rincian Pesanan</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {(selectedRow.items || []).map((item: any, i: number) => (
                    <div
                      key={i}
                      className="flex justify-between bg-gray-50 p-3 rounded-lg">
                      <div>
                        <p className="font-semibold text-sm">
                          {item.nama_menu || item.nama}
                        </p>
                        {item.note && (
                          <p className="text-xs text-gray-400">
                            Note: {item.note}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          {formatRupiah(item.harga)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">x{item.qty}</p>
                        <p className="text-xs text-gray-500">
                          {formatRupiah(item.subtotal)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatRupiah(selectedRow.jumlah)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
