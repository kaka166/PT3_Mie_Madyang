/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  PackagePlus,
  RefreshCw,
  Edit,
} from "lucide-react";

import Penyesuaian from "./_components/penyesuaian";
import Restock from "./_components/restock";

import { getStockList, getFullHistory } from "@/services/stockService";

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
          className="w-8 h-8 flex items-center justify-center rounded bg-gray-100">
          ‹
        </button>

        {Array.from({ length: Math.min(totalPages || 1, 5) }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`w-8 h-8 flex items-center justify-center rounded ${
              currentPage === i + 1 ? "bg-red-400 text-white" : "bg-gray-100"
            }`}>
            {i + 1}
          </button>
        ))}

        <button
          onClick={() =>
            setCurrentPage((p: number) => Math.min(p + 1, totalPages || 1))
          }
          className="w-8 h-8 flex items-center justify-center rounded bg-gray-100">
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

  // ================= FILTER =================
  const filteredRiwayat = selectedFilter
    ? riwayatData.filter((r) =>
        r.tipe.toLowerCase().includes(selectedFilter.toLowerCase()),
      )
    : riwayatData;

  const [stockPage, setStockPage] = useState(1);
  const [stockLimit, setStockLimit] = useState(10);

  const [riwayatPage, setRiwayatPage] = useState(1);
  const [riwayatLimit, setRiwayatLimit] = useState(10);

  // STOCK
  const stockTotal = stockListData.length;
  const stockStart = (stockPage - 1) * stockLimit;

  const paginatedStock = stockListData.slice(
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
        <h1 className="text-2xl font-bold text-gray-900">Stock Bahan</h1>
        <p className="text-gray-500 text-sm">Real-time Finance Tracking</p>
      </div>

      <button className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 mb-6">
        <Download size={16} />
        Download Report
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
              className="bg-gray-100 pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200"
              placeholder="Cari..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Nama Barang</th>
                <th className="py-3 px-4">Jumlah Stock</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {paginatedStock.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-left">{item.id}</td>
                  <td className="py-3 px-4 text-left">{item.nama}</td>
                  <td className="py-3 px-4">
                    {item.jumlah}
                    <div className="text-xs text-gray-400">
                      Limit: {item.stock_limit}
                    </div>
                  </td>
                  <td className="py-3 px-4 flex justify-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
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
        <PaginationBar
          totalItems={stockTotal}
          currentPage={stockPage}
          itemsPerPage={stockLimit}
          setCurrentPage={setStockPage}
          setItemsPerPage={setStockLimit}
        />
      </div>

      {/* ================= ACTION ================= */}
      <div className="flex justify-between items-end mb-6">
        <div className="flex gap-3">
          <button
            onClick={() => setIsRestockOpen(true)}
            className="bg-red-400 text-white px-4 py-2 rounded-lg flex gap-2">
            <PackagePlus size={16} /> Laporkan Restock
          </button>

          <button
            onClick={() => setIsPenyesuaianOpen(true)}
            className="bg-red-400 text-white px-4 py-2 rounded-lg flex gap-2">
            <Edit size={16} /> Laporkan Penyesuaian
          </button>
        </div>

        {/* FILTER */}
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="bg-gray-200 px-4 py-2 rounded-lg flex gap-2">
            <Filter size={16} />
            {selectedFilter || "Filter"}
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow border">
              {filterOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setSelectedFilter(opt);
                    setIsFilterOpen(false);
                  }}
                  className="block px-4 py-2 text-sm hover:bg-gray-100">
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================= RIWAYAT ================= */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold">Riwayat Perubahan</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-neutral-400 text-xs font-semibold uppercase tracking-wider border-b border-neutral-100">
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Item ID</th>
                <th className="px-6 py-3">Nama Barang</th>
                <th className="px-6 py-3">Tipe</th>
                <th className="px-6 py-3">Alasan</th>
                <th className="px-6 py-3">Kuantiti</th>
                <th className="px-6 py-3">Perubahan</th>
                <th className="px-6 py-3">Dibuat Oleh</th>
              </tr>
            </thead>

            <tbody>
              {(paginatedRiwayat || []).map((item, i) => (
                <tr
                  key={`${item.nama}-${i}`}
                  className={i % 2 === 0 ? "bg-white" : "bg-neutral-50"}>
                  <td className="px-6 py-4 font-semibold text-neutral-700">
                    {item.id}
                  </td>

                  <td className="px-6 py-4 text-neutral-600">{item.itemId}</td>

                  <td className="px-6 py-4 font-bold text-neutral-800">
                    {item.nama}
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600">
                      {item.tipe}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-neutral-600">{item.alasan}</td>

                  <td className="px-6 py-4 font-semibold text-neutral-800">
                    {item.kuantiti}
                  </td>

                  <td className="px-6 py-4 text-neutral-500">
                    {new Date(item.waktu).toLocaleString("id-ID")}
                  </td>

                  <td className="px-6 py-4 text-neutral-600">{item.pembuat}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
