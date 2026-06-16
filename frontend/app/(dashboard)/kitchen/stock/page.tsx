/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Download,
  Filter,
  PackagePlus,
  Edit,
} from "lucide-react";

import Penyesuaian from "./_components/penyesuaian";
import Restock from "./_components/restock";

import { getStockList, getFullHistory } from "@/services/stockService";
import { formatTanggal } from "@/utils/formatTanggal";

const filterOptions = ["Penyesuaian", "Restock"];

const PaginationBar = ({
  totalItems,
  currentPage,
  itemsPerPage,
  setCurrentPage,
  setItemsPerPage,
}: any) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <div className="p-4 border-t flex justify-between items-center text-sm text-gray-500 bg-white">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <span>
          Showing {totalItems === 0 ? 0 : startIndex + 1}-
          {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems}
        </span>

        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="bg-gray-100 px-2 py-1 rounded text-sm">
          {[10, 20, 30, 40].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      {/* RIGHT */}
      <div className="flex gap-1">
        <button
          onClick={() => setCurrentPage((p: number) => Math.max(p - 1, 1))}
          className="w-9 h-9 flex items-center justify-center rounded bg-gray-100">
          ‹
        </button>

        {Array.from({ length: Math.min(totalPages || 1, 5) }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`w-9 h-9 flex items-center justify-center rounded ${
              currentPage === i + 1 ? "bg-red-400 text-white" : "bg-gray-100"
            }`}>
            {i + 1}
          </button>
        ))}

        <button
          onClick={() =>
            setCurrentPage((p: number) => Math.min(p + 1, totalPages || 1))
          }
          className="w-9 h-9 flex items-center justify-center rounded bg-gray-100">
          ›
        </button>
      </div>
    </div>
  );
};

export default function StockBahanPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");

  const [isPenyesuaianOpen, setIsPenyesuaianOpen] = useState(false);
  const [isRestockOpen, setIsRestockOpen] = useState(false);

  // ================= STATE DATA =================
  const [stockListData, setStockListData] = useState<any[]>([]);
  const [riwayatData, setRiwayatData] = useState<any[]>([]);

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      const stock = await getStockList();
      const history = await getFullHistory();

      setStockListData(stock);
      setRiwayatData(history);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchData();
    };

    load();
  }, []);

  const downloadCSV = () => {
    const rows: string[] = [];

    const esc = (v: any) => {
      const s = String(v ?? "");
      return s.includes(",") || s.includes('"') || s.includes("\n")
        ? `"${s.replace(/"/g, '""')}"`
        : s;
    };

    rows.push("STOCK LIST");
    rows.push(["ID", "Nama Barang", "Jumlah Stock", "Stock Limit", "Status"].map(esc).join(","));
    stockListData.forEach((item) => {
      rows.push([item.id, item.nama, item.jumlah, item.stock_limit, item.status].map(esc).join(","));
    });

    rows.push("");
    rows.push("RIWAYAT PERUBAHAN");
    rows.push(["ID", "Item ID", "Nama Barang", "Tipe", "Alasan", "Kuantiti", "Waktu", "Dibuat Oleh"].map(esc).join(","));
    riwayatData.forEach((item) => {
      rows.push([item.id, item.itemId, item.nama, item.tipe, item.alasan, item.kuantiti, formatTanggal(item.waktu), item.pembuat].map(esc).join(","));
    });

    const bom = "\uFEFF";
    const blob = new Blob([bom + rows.join("\r\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stock_bahan_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const [stockPage, setStockPage] = useState(1);
  const [stockLimit, setStockLimit] = useState(10);

  const [stockSearch, setStockSearch] = useState("");
  const [riwayatSearch, setRiwayatSearch] = useState("");
  const [riwayatPage, setRiwayatPage] = useState(1);
  const [riwayatLimit, setRiwayatLimit] = useState(10);

  // ================= FILTER =================
  const filteredRiwayat = riwayatData.filter((r) => {
    const matchTipe = selectedFilter
      ? r.tipe.toLowerCase().includes(selectedFilter.toLowerCase())
      : true;
    const matchSearch = riwayatSearch
      ? r.nama.toLowerCase().includes(riwayatSearch.toLowerCase())
      : true;
    return matchTipe && matchSearch;
  });

  // STOCK
  const filteredStock = stockSearch
    ? stockListData.filter((s) =>
        s.nama?.toLowerCase().includes(stockSearch.toLowerCase()),
      )
    : stockListData;
  const stockTotal = filteredStock.length;
  const stockStart = (stockPage - 1) * stockLimit;

  const paginatedStock = filteredStock.slice(
    stockStart,
    stockStart + stockLimit,
  );

  // RIWAYAT
  const riwayatTotal = filteredRiwayat.length;
  const riwayatStart = (riwayatPage - 1) * riwayatLimit;

  const paginatedRiwayat = filteredRiwayat.slice(
    riwayatStart,
    riwayatStart + riwayatLimit,
  );

  return (
    <div className="h-full w-full overflow-y-auto bg-gray-100 p-6 pb-12 font-sans text-gray-800">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#F53E1B]">Stock Bahan</h1>
        <p className="text-gray-500 text-sm">Real-time Finance Tracking</p>
      </div>

      <button
        onClick={downloadCSV}
        className="bg-red-400 hover:bg-red-500 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium flex items-center gap-1.5 md:gap-2 mb-6">
        <Download size={14} className="md:size-4" />
        <span className="hidden sm:inline">Download Report</span>
        <span className="sm:hidden">Report</span>
      </button>

      {/* ================= STOCK LIST ================= */}
      <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-bold">Stock List</h2>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              value={stockSearch}
              onChange={(e) => { setStockSearch(e.target.value); setStockPage(1); }}
              className="bg-gray-100 pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200"
              placeholder="Cari..."
            />
          </div>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-xs lg:text-sm text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-3 lg:px-5 py-3 text-left whitespace-nowrap">ID</th>
                <th className="px-3 lg:px-5 py-3 text-left whitespace-nowrap">Nama Barang</th>
                <th className="px-3 lg:px-5 py-3 whitespace-nowrap">Jumlah Stock</th>
                <th className="px-3 lg:px-5 py-3 whitespace-nowrap">Stock Limit</th>
                <th className="px-3 lg:px-5 py-3 whitespace-nowrap">Status</th>
              </tr>
            </thead>

            <tbody>
              {(paginatedStock || []).map((item, i) => (
                <tr
                  key={`${item.nama}-${i}`}
                  onClick={() => { setRiwayatSearch(item.nama); setRiwayatPage(1); }}
                  className="even:bg-gray-50 odd:bg-white hover:bg-red-50 transition-colors cursor-pointer">
                  <td className="px-3 lg:px-5 py-3">{item.id}</td>
                  <td className="px-3 lg:px-5 py-3 font-medium truncate max-w-[160px] lg:max-w-none">{item.nama}</td>
                  <td className="px-3 lg:px-5 py-3">{item.jumlah}</td>
                  <td className="px-3 lg:px-5 py-3 text-gray-500">{item.stock_limit}</td>
                  <td className="px-3 lg:px-5 py-3">
                    <span
                      className={`inline-block px-2 lg:px-3 py-0.5 lg:py-1 rounded-full text-[10px] lg:text-xs ${
                        item.status === "Aman"
                          ? "bg-green-200 text-green-700"
                          : "bg-red-500 text-white"
                      }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {(paginatedStock || []).map((item, i) => (
            <div
              key={`mobile-stock-${item.nama}-${i}`}
              onClick={() => { setRiwayatSearch(item.nama); setRiwayatPage(1); }}
              className="flex items-center gap-3 p-3 hover:bg-red-50 transition-colors cursor-pointer">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.nama}</p>
                <p className="text-[10px] text-gray-400">ID: {item.id}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-gray-400 uppercase font-medium">Stok</span>
                    <span className="text-xs font-semibold">{item.jumlah}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-gray-400 uppercase font-medium">Limit</span>
                    <span className="text-xs text-gray-500">{item.stock_limit}</span>
                  </div>
                </div>
              </div>
              <span
                className={`shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                  item.status === "Aman"
                    ? "bg-green-200 text-green-700"
                    : "bg-red-500 text-white"
                }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
        <PaginationBar
          totalItems={stockTotal}
          currentPage={stockPage}
          itemsPerPage={stockLimit}
          setCurrentPage={setStockPage}
          setItemsPerPage={setStockLimit}
        />
      </div>

      {/* ================= ACTION ================= */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          onClick={() => setIsRestockOpen(true)}
          className="bg-red-400 hover:bg-red-500 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-medium transition-all active:scale-95">
          <PackagePlus size={14} className="md:size-4" /> 
          <span className="hidden sm:inline">Laporkan Restock</span>
          <span className="sm:hidden">Restock</span>
        </button>

        <button
          onClick={() => setIsPenyesuaianOpen(true)}
          className="bg-red-400 hover:bg-red-500 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-medium transition-all active:scale-95">
          <Edit size={14} className="md:size-4" /> 
          <span className="hidden sm:inline">Laporkan Penyesuaian</span>
          <span className="sm:hidden">Penyesuaian</span>
        </button>

        {/* FILTER */}
        <div className="relative ml-auto">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`px-3 md:px-4 py-2 rounded-lg flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-medium transition-all
              ${
                selectedFilter
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}>
            <Filter size={14} className="md:size-4" />
            <span className="hidden sm:inline">{selectedFilter || "Filter"}</span>
            <span className="sm:hidden">{selectedFilter ? `Filter: ${selectedFilter}` : "Filter"}</span>
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-xl shadow-lg border p-1.5 sm:p-2 space-y-0.5 sm:space-y-1 z-50">
              {/* OPTION */}
              {filterOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setSelectedFilter(opt);
                    setIsFilterOpen(false);
                  }}
                  className={`w-full text-left px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition ${
                    selectedFilter === opt
                      ? "bg-red-100 text-red-600 font-medium"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}>
                  {opt}
                </button>
              ))}

              {/* DIVIDER */}
              <div className="border-t my-0.5 sm:my-1"></div>

              {/* RESET BUTTON */}
              <button
                onClick={() => {
                  setSelectedFilter("");
                  setIsFilterOpen(false);
                }}
                className="w-full text-left px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm text-gray-500 hover:bg-gray-100">
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================= RIWAYAT ================= */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-3 md:p-4 border-b flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <h2 className="text-base md:text-lg font-bold">Riwayat Perubahan</h2>
          <div className="relative w-full sm:w-48 md:w-56">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Cari barang..."
              value={riwayatSearch}
              onChange={(e) => { setRiwayatSearch(e.target.value); setRiwayatPage(1); }}
              className="bg-gray-100 pl-8 md:pl-9 pr-3 md:pr-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200 w-full"
            />
          </div>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-xs lg:text-sm text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-2 md:px-3 lg:px-5 py-3 whitespace-nowrap">ID</th>
                <th className="px-2 md:px-3 lg:px-5 py-3 whitespace-nowrap">Nama Barang</th>
                <th className="px-2 md:px-3 lg:px-5 py-3 whitespace-nowrap">Tipe</th>
                <th className="px-2 md:px-3 lg:px-5 py-3 whitespace-nowrap">Kuantiti</th>
                <th className="hidden lg:table-cell px-2 md:px-3 lg:px-5 py-3 whitespace-nowrap">Alasan</th>
                <th className="px-2 md:px-3 lg:px-5 py-3 whitespace-nowrap">Waktu</th>
                <th className="hidden lg:table-cell px-2 md:px-3 lg:px-5 py-3 whitespace-nowrap">Oleh</th>
              </tr>
            </thead>

            <tbody>
              {(paginatedRiwayat || []).map((item, i) => (
                <tr
                  key={`${item.nama}-${i}`}
                  className="even:bg-gray-50 odd:bg-white hover:bg-red-50 transition-colors">
                  <td className="px-2 md:px-3 lg:px-5 py-3 text-neutral-700">{item.id}</td>
                  <td className="px-2 md:px-3 lg:px-5 py-3 text-neutral-700 font-medium">
                    <span className="block truncate max-w-[120px] md:max-w-[180px] lg:max-w-[220px]" title={item.nama}>{item.nama}</span>
                  </td>
                  <td className="px-2 md:px-3 lg:px-5 py-3">
                    <span
                      className={`inline-block px-1.5 md:px-2 py-0.5 rounded-full text-[9px] md:text-[10px] lg:text-xs font-bold ${
                        item.tipe.toLowerCase() === "restock"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}>
                      {item.tipe}
                    </span>
                  </td>
                  <td className="px-2 md:px-3 lg:px-5 py-3 text-neutral-700">{item.kuantiti}</td>
                  <td className="hidden lg:table-cell px-2 md:px-3 lg:px-5 py-3 text-neutral-600">
                    <span className="block truncate max-w-[160px]" title={item.alasan}>{item.alasan}</span>
                  </td>
                  <td className="px-2 md:px-3 lg:px-5 py-3 text-neutral-700 whitespace-nowrap text-[10px] md:text-xs lg:text-sm">{formatTanggal(item.waktu)}</td>
                  <td className="hidden lg:table-cell px-2 md:px-3 lg:px-5 py-3 text-neutral-600">
                    <span className="block truncate max-w-[120px]" title={item.pembuat}>{item.pembuat}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {(paginatedRiwayat || []).map((item, i) => (
            <div
              key={`mobile-riwayat-${item.nama}-${i}`}
              className="px-3 py-2.5 hover:bg-red-50 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.nama}</p>
                  <p className="text-[10px] text-gray-400">#{item.id}</p>
                </div>
                <span
                  className={`shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    item.tipe.toLowerCase() === "restock"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}>
                  {item.tipe}
                </span>
              </div>
              <div className="mt-1 flex items-baseline gap-3 text-[11px]">
                <span className="font-semibold text-gray-700">{item.kuantiti}</span>
                {item.alasan && (
                  <span className="text-gray-400 truncate max-w-[160px]" title={item.alasan}>{item.alasan}</span>
                )}
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-[10px] text-gray-400">
                <span>{formatTanggal(item.waktu)}</span>
                {item.pembuat && <span className="truncate">· {item.pembuat}</span>}
              </div>
            </div>
          ))}
        </div>
        <PaginationBar
          totalItems={riwayatTotal}
          currentPage={riwayatPage}
          itemsPerPage={riwayatLimit}
          setCurrentPage={setRiwayatPage}
          setItemsPerPage={setRiwayatLimit}
        />
      </div>

      {/* MODAL */}
      <Penyesuaian
        isOpen={isPenyesuaianOpen}
        onClose={() => setIsPenyesuaianOpen(false)}
        onSuccess={fetchData}
      />
      <Restock
        isOpen={isRestockOpen}
        onClose={() => setIsRestockOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
}
