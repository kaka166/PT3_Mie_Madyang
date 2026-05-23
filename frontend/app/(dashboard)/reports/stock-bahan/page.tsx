"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { getStockList } from "@/services/stockService";

export default function StockBahanPage() {
  type StockItem = {
    id: number;
    nama: string;
    jumlah: string;
    stock_limit: number;
    status: string;
  };

  const [stockListData, setStockListData] = useState<StockItem[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const pageSizeOptions = [10, 20, 30, 40];

  const filteredData = stockListData.filter((item) =>
    item.nama?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    let mounted = true;
    getStockList()
      .then((stock) => { if (mounted) setStockListData(stock); })
      .catch((err) => console.error("Gagal ambil stock:", err));
    return () => { mounted = false; };
  }, []);

  const getQtyValue = (jumlah: string): number => {
    const match = jumlah.match(/^([\d.]+)/);
    return match ? parseFloat(match[1]) : 0;
  };

  return (
    <div className="min-h-screen bg-neutral-100 p-8 font-sans pb-24">
      <div className="max-w-1xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#F53E1B] mb-1">
            Laporan Stock Bahan
          </h1>
          <p className="text-gray-500 text-sm">Status stok bahan baku dengan limit</p>
        </div>

        {/* Stock List Section */}
        <div className="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden border border-neutral-100">
          <div className="p-4 flex flex-wrap justify-between items-center border-b gap-3">
            <h2 className="text-lg font-bold">Stock List</h2>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Cari..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-gray-100 pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200"
              />
            </div>
          </div>
          <div className="overflow-x-auto bg-white rounded-3xl shadow-sm border border-gray-100">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-5 py-3 text-left">ID</th>
                  <th className="px-5 py-3 text-left">Nama Barang</th>
                  <th className="px-5 py-3 ">Jumlah Stock</th>
                  <th className="px-5 py-3 ">Stock Limit</th>
                  <th className="px-5 py-3 ">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => {
                  const qtyValue = getQtyValue(item.jumlah);
                  const limit = item.stock_limit || 5;
                  const percentage = limit > 0 ? Math.min((qtyValue / limit) * 100, 100) : 0;
                  const isKritis = item.status === "Kritis";

                  return (
                    <tr key={item.id} className="even:bg-gray-50 odd:bg-white hover:bg-red-50 transition-colors">
                      <td className="px-5 py-3.5 text-left font-semibold text-neutral-700">{item.id}</td>
                      <td className="px-5 py-3.5 text-left font-bold text-neutral-800">{item.nama}</td>
                      <td className="px-5 py-3.5 text-center font-semibold">{item.jumlah}</td>
                      <td className="px-5 py-3.5 text-center">
                        <span className="text-xs text-neutral-500">{item.stock_limit}</span>
                      </td>
                      <td className="px-5 py-3.5 ">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-full max-w-[100px] h-2 bg-neutral-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${isKritis ? "bg-red-500" : "bg-green-500"
                                }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span
                            className={`px-3 py-0.5 rounded-full text-xs font-bold ${item.status === "Aman"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-500 text-white"
                              }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-neutral-400 font-medium">Belum ada data stok bahan</td>
                </tr>
              )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t flex justify-between items-center text-sm text-gray-500">
            <div className="flex items-center gap-3">
              <span>
                Showing {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
                {filteredData.length}
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-gray-100 px-2 py-1 rounded text-sm focus:outline-none"
              >
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
                className="w-8 h-8 flex items-center justify-center rounded bg-gray-100"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded ${currentPage === i + 1
                    ? "bg-red-400 text-white"
                    : "bg-gray-100"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="w-8 h-8 flex items-center justify-center rounded bg-gray-100"
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
