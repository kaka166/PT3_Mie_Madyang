"use client";

import React from "react";
import { Banknote, Receipt, Wallet, ChevronLeft, ChevronRight } from "lucide-react";

// --- DUMMY DATA ---
const summaryMetrics = [
  { title: "TOTAL PENJUALAN", value: "Rp 4.450.000", icon: Banknote, trend: "+8.2%" },
  { title: "TOTAL TRANSAKSI", value: "2.810", icon: Receipt }, // Diubah ke angka karena lebih masuk akal untuk "Total Transaksi"
  { title: "RATA RATA NOMINAL PENJUALAN", value: "Rp 2.500.000", icon: Wallet },
];

const summaryTableData = [
  { rentang: "14 Mar - 21 Mar", penghasilan: "Rp. 60.000,00", kasir: "Kevin", metode: "QRIS", jumlah: "Rp. 60.000,00" },
  { rentang: "7 Mar - 14 Mar", penghasilan: "Rp. 60.000,00", kasir: "Kevin", metode: "Tunai", jumlah: "Rp. 60.000,00" },
  { rentang: "1 Mar - 7 Mar", penghasilan: "Rp. 60.000,00", kasir: "Kevin", metode: "QRIS", jumlah: "Rp. 60.000,00" },
  { rentang: "21 Feb - 28 Feb", penghasilan: "Rp. 60.000,00", kasir: "Kevin", metode: "Tunai", jumlah: "Rp. 60.000,00" },
  { rentang: "14 Feb - 21 Feb", penghasilan: "Rp. 60.000,00", kasir: "Kevin", metode: "QRIS", jumlah: "Rp. 60.000,00" },
];

const detailTableData = Array(5).fill({
  no: "#22398",
  nama: "Mie Madyang Asin + Es Teh",
  waktu: "14-02-26 18:22:32",
  kasir: "Kevin",
  metode: "QRIS",
  jumlah: "Rp. 60.000,00"
});
// -------------------

export default function LaporanPenjualan() {
  return (
    // Asumsi ada padding dari layout utama, bg-neutral-100 untuk background keseluruhan
    <div className="h-full overflow-y-auto bg-neutral-0 p-8 font-sans">
      
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#8B1A1A] mb-1">Laporan Pemasukan</h1>
        <p className="text-neutral-500">Laporan Pemasukan Mi Madyang</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {summaryMetrics.map((metric, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <metric.icon size={24} />
              </div>
              {metric.trend && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  {metric.trend}
                </span>
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-400 mb-1 uppercase tracking-wider">{metric.title}</p>
              <h2 className="text-2xl font-extrabold text-neutral-800">{metric.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Table 1: Rekap Rentang Waktu */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 mb-8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-neutral-500 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Rentang Waktu</th>
                <th className="px-6 py-4 font-semibold">Penghasilan</th>
                <th className="px-6 py-4 font-semibold">Kasir</th>
                <th className="px-6 py-4 font-semibold">Metode</th>
                <th className="px-6 py-4 font-semibold">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {summaryTableData.map((row, idx) => (
                <tr key={idx} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 text-neutral-700">{row.rentang}</td>
                  <td className="px-6 py-4 font-medium text-neutral-800">{row.penghasilan}</td>
                  <td className="px-6 py-4 text-neutral-600">{row.kasir}</td>
                  <td className="px-6 py-4 text-neutral-600">{row.metode}</td>
                  <td className="px-6 py-4 font-medium text-neutral-800">{row.jumlah}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Table 1 */}
        <div className="p-4 border-t flex justify-between items-center text-sm text-gray-500">
          <span>Showing 1-9 of 2810 Transaction</span>
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded bg-red-400 text-white"><ChevronLeft size={16} /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-red-400 text-white">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200">4</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200">5</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-red-400 text-white"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {/* Table 2: Detail Transaksi */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-neutral-500 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Nomor Transaksi</th>
                <th className="px-6 py-4 font-semibold">Nama Pemasukan</th>
                <th className="px-6 py-4 font-semibold">Waktu</th>
                <th className="px-6 py-4 font-semibold">Kasir</th>
                <th className="px-6 py-4 font-semibold">Metode</th>
                <th className="px-6 py-4 font-semibold">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {detailTableData.map((row, idx) => (
                <tr key={idx} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-800">{row.no}</td>
                  <td className="px-6 py-4 font-bold text-neutral-700">{row.nama}</td>
                  <td className="px-6 py-4 text-neutral-600">{row.waktu}</td>
                  <td className="px-6 py-4 text-neutral-600">{row.kasir}</td>
                  <td className="px-6 py-4 text-neutral-600">{row.metode}</td>
                  <td className="px-6 py-4 font-medium text-neutral-800">{row.jumlah}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Table 2 */}
        <div className="p-4 border-t flex justify-between items-center text-sm text-gray-500">
          <span>Showing 1-9 of 2810 Transaction</span>
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded bg-red-400 text-white"><ChevronLeft size={16} /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-red-400 text-white">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200">4</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200">5</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-red-400 text-white"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

    </div>
  );
}