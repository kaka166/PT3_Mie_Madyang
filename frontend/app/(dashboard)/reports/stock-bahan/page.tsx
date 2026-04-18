"use client";

import React, { useState, useEffect } from "react";
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

import { getStockList } from "@/services/stockService";

export default function StockBahanPage() {
  type StockItem = {
    id: number;
    nama: string;
    jumlah: number;
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

  const fetchData = async () => {
    try {
      const stock = await getStockList();
      setStockListData(stock);
    } catch (err) {
      console.error("Gagal ambil stock:", err);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchData();
    };

    load();
  }, []);

  const filterOptions = ["Penyesuaian", "Re Stock", "Produksi"];

  return (
    <div className="min-h-screen bg-neutral-0 p-8 font-sans">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#F53E1B] mb-1">
          Laporan Stock Bahan
        </h1>
        <p className="text-gray-500 text-sm">Real-time Finance Tracking</p>
      </div>

      <button className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 mb-6 transition-colors">
        <Download size={16} />
        Download Report
      </button>

      {/* Stock List Section */}
      <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
        <div className="p-4 flex justify-between items-center border-b">
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
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="py-3 px-4 font-medium text-left">ID</th>
                <th className="py-3 px-4 font-medium text-left">Nama Barang</th>
                <th className="py-3 px-4 font-medium">Jumlah Stock</th>
                <th className="py-3 px-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b last:border-0 hover:bg-gray-50">
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
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
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
        {/* Pagination Dummy */}
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
              <ChevronLeft size={16} />
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
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
