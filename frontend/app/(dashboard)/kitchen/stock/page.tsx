"use client";

import React from "react";
import { 
  Download, 
  RefreshCcw, 
  PackageSearch, 
  Search, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

// --- DATA DUMMY ---
const recentChanges = [
  {
    type: "Pembelian",
    staff: "Staff Kitchen",
    item: "+ Daging Ayam Segar",
    qty: "2 Kg",
  },
  {
    type: "Produksi",
    staff: "Staff Kitchen",
    item: "+ Mie Mentah",
    qty: "1 Kg",
  },
  {
    type: "Operasional",
    staff: "Staff Kitchen",
    item: "- Tisue Meja",
    qty: "2 Bungkus",
  },
];

// DATA DUMMY BUAT STOCK LIST, NANTI DIAMBIL DARI BACKEND YA MAS MAS
const stockList = [
  {
    nomor: "#443241", kategori: "Bahan Pokok", nama: "Mie Mentah Spesial", stok: "15", satuan: "Kg", estimasi: "Rp. 300.000", status: "Aman", tanggal: "10-04-26", waktu: "07:30:00"
  },
  {
    nomor: "#443242", kategori: "Lauk", nama: "Daging Ayam Bumbu", stok: "8", satuan: "Kg", estimasi: "Rp. 400.000", status: "Aman", tanggal: "10-04-26", waktu: "08:15:22"
  },
  {
    nomor: "#443243", kategori: "Sayuran", nama: "Sawi Hijau (Caisim)", stok: "3", satuan: "Ikat", estimasi: "Rp. 15.000", status: "Menipis", tanggal: "09-04-26", waktu: "06:00:10"
  },
  {
    nomor: "#443244", kategori: "Bumbu", nama: "Kecap Manis Bango", stok: "5", satuan: "Jerigen", estimasi: "Rp. 350.000", status: "Aman", tanggal: "05-04-26", waktu: "14:20:00"
  },
  {
    nomor: "#443245", kategori: "Bumbu", nama: "Minyak Bawang", stok: "1.5", satuan: "Liter", estimasi: "Rp. 45.000", status: "Kritis", tanggal: "08-04-26", waktu: "09:10:05"
  },
  {
    nomor: "#443246", kategori: "Pendamping", nama: "Kulit Pangsit", stok: "20", satuan: "Bungkus", estimasi: "Rp. 200.000", status: "Aman", tanggal: "10-04-26", waktu: "07:45:00"
  }
];
// -------------------

export default function StokBahanPage() {
  return (
    <div className="min-h-screen bg-neutral-100 p-8 font-sans">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-neutral-800 tracking-tight">Stok Bahan</h1>
        <p className="text-neutral-500 font-medium mt-1">Real-time Finance Tracking</p>
      </div>

      {/* Bagian Perubahan Terakhir */}
      <div className="mb-8">
        <h2 className="text-xl font-extrabold text-neutral-900 mb-4">Perubahan Terakhir</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recentChanges.map((change, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-neutral-800">{change.type}</span>
                <span className="text-[10px] font-semibold text-neutral-400">{change.staff}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-neutral-800">{change.item}</span>
                <span className="text-sm font-bold text-red-600">{change.qty}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar (Tombol Aksi & Pencarian) */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex items-center gap-2 bg-[#FF6565] hover:bg-red-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-colors">
            <Download size={18} />
            Download Report
          </button>
          <button className="flex items-center gap-2 bg-[#FF6565] hover:bg-red-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-colors">
            <RefreshCcw size={18} />
            Laporkan Produksi
          </button>
          <button className="flex items-center gap-2 bg-[#FF6565] hover:bg-red-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-colors">
            <PackageSearch size={18} />
            Laporkan Restock
          </button>
        </div>

        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-neutral-500" />
          </div>
          <input 
            type="text" 
            placeholder="Cari Pesanan" 
            className="w-full bg-neutral-200/70 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-neutral-700 placeholder-neutral-400 focus:ring-2 focus:ring-[#FF6565] focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Tabel Stock List */}
      <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="p-6 pb-4">
          <h2 className="text-xl font-extrabold text-neutral-900">Stock List</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-neutral-500 font-semibold border-b border-neutral-100">
              <tr>
                <th className="px-6 py-4">Nomor</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Nama Barang</th>
                <th className="px-6 py-4 text-center">Jumlah Stok</th>
                <th className="px-6 py-4">Satuan</th>
                <th className="px-6 py-4">Estimasi Biaya</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4">Perubahan Terakhir</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {stockList.map((row, idx) => (
                <tr 
                  key={idx} 
                  // Zebra striping: warna abu-abu sangat muda selang-seling seperti di gambar
                  className={idx % 2 === 1 ? "bg-neutral-50/60" : "bg-white"}
                >
                  <td className="px-6 py-4 font-bold text-neutral-800">{row.nomor}</td>
                  <td className="px-6 py-4 text-neutral-600 font-medium">{row.kategori}</td>
                  <td className="px-6 py-4 font-extrabold text-neutral-800">{row.nama}</td>
                  <td className="px-6 py-4 text-center font-bold text-neutral-800">{row.stok}</td>
                  <td className="px-6 py-4 font-bold text-neutral-800">{row.satuan}</td>
                  <td className="px-6 py-4 font-bold text-neutral-800">{row.estimasi}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-[#93FF96] text-green-800 px-4 py-1.5 rounded-full text-xs font-bold">
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-600 font-medium">
                    <div className="flex flex-col">
                      <span>{row.tanggal}</span>
                      <span>{row.waktu}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-neutral-400 hover:text-neutral-800 transition-colors">
                      <MoreHorizontal size={20} className="mx-auto" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination di dalam card tabel */}
        <div className="border-t border-neutral-100 px-6 py-4 flex items-center justify-between bg-white">
          <span className="text-sm font-semibold text-neutral-400">Showing 1-9 of 2810 Transaction</span>
          <div className="flex gap-1.5">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#FF6565] text-white hover:bg-red-500 transition-colors shadow-sm"><ChevronLeft size={16} /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#FF6565] text-white font-bold shadow-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 font-semibold hover:bg-neutral-200 transition-colors">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 font-semibold hover:bg-neutral-200 transition-colors">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 font-semibold hover:bg-neutral-200 transition-colors">4</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 font-semibold hover:bg-neutral-200 transition-colors">5</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#FF6565] text-white hover:bg-red-500 transition-colors shadow-sm"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

    </div>
  );
}