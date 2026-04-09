"use client";

import React from "react";
import { MoreHorizontal, ChevronRight } from "lucide-react";

// --- DUMMY DATA ---
const stockData = [
  {
    nama: "Tepung Terigu Segitiga Biru",
    terakhirSuplai: "02 Apr 2026",
    sisa: 142,
    satuan: "KG",
    status: "Aman",
    statusColor: "bg-green-100 text-green-700",
  },
  {
    nama: "Minyak Goreng Bimoli 5L",
    terakhirSuplai: "05 Apr 2026",
    sisa: 8,
    satuan: "Jerigen",
    status: "Menipis",
    statusColor: "bg-yellow-100 text-yellow-700",
  },
  {
    nama: "Daging Ayam Fillet",
    terakhirSuplai: "08 Apr 2026",
    sisa: 4,
    satuan: "KG",
    status: "Kritis",
    statusColor: "bg-red-100 text-red-700",
  },
  {
    nama: "Kecap Manis Bango",
    terakhirSuplai: "28 Mar 2026",
    sisa: 24,
    satuan: "Pouch",
    status: "Aman",
    statusColor: "bg-green-100 text-green-700",
  },
  {
    nama: "Bawang Merah",
    terakhirSuplai: "06 Apr 2026",
    sisa: 12,
    satuan: "KG",
    status: "Aman",
    statusColor: "bg-green-100 text-green-700",
  },
];
// -------------------

export default function LaporanStockBahan() {
  return (
    // [KOMENTAR] DITAMBAHKAN KESELURUHAN CLASS UNTUK PENGATURAN TINGGI, BACKGROUND, DAN PADDING
    <div className="min-h-screen bg-neutral-0 p-8 font-sans">
      
      {/* Header Utama (Sama seperti Laporan Pemasukan) */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#8B1A1A] mb-1">Laporan Stok Bahan</h1>
        <p className="text-neutral-500">Pantau ketersediaan bahan baku operasional Mie Madyang</p>
      </div>

      {/* Bagian Tabel Stock Inventory */}
      <div className="mt-4">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-xl font-bold text-neutral-800">
              Rincian Stock Bahan Baku
            </h2>
            <p className="text-sm text-zinc-500">
              Pantau ketersediaan bahan real-time.
            </p>
          </div>
        </div>

        {/* Wrapper Tabel */}
        <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead className="bg-zinc-50/50 text-[10px] uppercase font-bold text-zinc-400 tracking-widest border-b border-zinc-100">
                <tr>
                  <th className="px-6 py-4 text-left">Bahan Baku</th>
                  <th className="px-6 py-4 text-left">Terakhir Suplai</th>
                  <th className="px-6 py-4 text-center">Stok Sisa</th>
                  <th className="px-6 py-4 text-left">Satuan</th>
                  <th className="px-6 py-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {stockData.map((item, index) => (
                  <tr key={index} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-neutral-700">
                      {item.nama}
                    </td>
                    <td className="px-6 py-4 text-zinc-500">{item.terakhirSuplai}</td>
                    <td className="px-6 py-4 text-center font-black text-neutral-800">
                      {item.sisa}
                    </td>
                    <td className="px-6 py-4 text-zinc-500">{item.satuan}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${item.statusColor}`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}