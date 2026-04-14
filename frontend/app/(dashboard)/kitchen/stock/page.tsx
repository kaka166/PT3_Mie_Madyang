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
import Produksi from "./_components/produksi";

import { getStockList, getFullHistory } from "@/services/stockService";

const filterOptions = ["Penyesuaian", "Restock", "Produksi"];

const PaginationBar = () => (
  <div className="p-4 border-t flex justify-between items-center text-sm text-gray-500">
    <span>Showing latest data</span>
    <div className="flex gap-1">
      {[<ChevronLeft size={16} />, 1, 2, 3, <ChevronRight size={16} />].map(
        (item, i) => (
          <button
            key={i}
            className="w-8 h-8 flex items-center justify-center rounded bg-gray-100">
            {item}
          </button>
        ),
      )}
    </div>
  </div>
);

export default function StockBahanPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");

  const [isPenyesuaianOpen, setIsPenyesuaianOpen] = useState(false);
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [isProduksiOpen, setIsProduksiOpen] = useState(false);

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
              className="bg-gray-100 pl-9 pr-4 py-2 rounded-lg text-sm"
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
              {stockListData.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-left">{item.id}</td>
                  <td className="py-3 px-4 text-left">{item.nama}</td>
                  <td className="py-3 px-4">{item.jumlah}</td>
                  <td className="py-3 px-4 flex justify-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        item.status === "Aman"
                          ? "bg-green-200 text-green-700"
                          : "bg-red-400 text-white"
                      }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <PaginationBar />
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
            onClick={() => setIsProduksiOpen(true)}
            className="bg-red-400 text-white px-4 py-2 rounded-lg flex gap-2">
            <RefreshCw size={16} /> Laporkan Produksi
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
          <table className="w-full text-sm text-center">
            <thead className="text-gray-500 border-b">
              <tr>
                <th>ID</th>
                <th>Item ID</th>
                <th>Nama Barang</th>
                <th>Tipe</th>
                <th>Alasan</th>
                <th>Kuantiti</th>
                <th>Perubahan Terakhir</th>
                <th>Dibuat Oleh</th>
              </tr>
            </thead>

            <tbody>
              {filteredRiwayat.map((item, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td>{item.id}</td>
                  <td>{item.itemId}</td>
                  <td>{item.nama}</td>
                  <td>{item.tipe}</td>
                  <td>{item.alasan}</td>
                  <td>{item.kuantiti}</td>
                  <td>{new Date(item.waktu).toLocaleString("id-ID")}</td>
                  <td>{item.pembuat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <PaginationBar />
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
      <Produksi
        isOpen={isProduksiOpen}
        onClose={() => setIsProduksiOpen(false)}
      />
    </div>
  );
}
