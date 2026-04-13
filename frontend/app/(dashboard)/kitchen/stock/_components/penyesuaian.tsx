"use client";

import { useState } from "react";
import { X } from "lucide-react";

const riwayatModalData = [
  { alasan: "Rusak", qty: "- 25", unit: "Kg", pembuat: "Hafizh", waktu: "14-02-26 18:22:32", type: "minus" },
  { alasan: "Kadaluwarsa", qty: "- 2.3", unit: "Kg", pembuat: "Hafizh", waktu: "14-02-26 18:22:32", type: "minus" },
  { alasan: "Salah Hitung", qty: "- 2.3", unit: "Kg", pembuat: "Hafizh", waktu: "14-02-26 18:22:32", type: "minus" },
  { alasan: "Sisa", qty: "- 1", unit: "Kg", pembuat: "Hafizh", waktu: "14-02-26 18:22:32", type: "minus" },
];

const alasanOptions = ["Rusak", "Hilang", "Kadaluwarsa", "Salah Hitung", "Sisa", "Penjualan"];
const unitOptions = ["Kg", "G", "L", "Ml", "Pack", "Ikat"];

interface penyesuaianProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function penyesuaian({ isOpen, onClose }: penyesuaianProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-4xl flex-col md:flex-row overflow-hidden rounded-2xl bg-white shadow-2xl max-h-[90vh]">
        {/* Bagian Kiri: Form Input */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Penyesuaian Stock</h2>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Nama Barang</label>
            <select className="w-full bg-gray-100 border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-200 outline-none appearance-none">
              <option>Nama barang...</option>
              <option>Ayam Potong</option>
              <option>Mie Mentah</option>
            </select>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2">Jumlah Sekarang</label>
              <div className="text-lg font-bold">15 Kg</div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2">Jumlah perubahan stock</label>
              <div className="flex border rounded-lg overflow-hidden bg-gray-100">
                <input
                  type="number"
                  placeholder="Jumlah"
                  className="w-full bg-transparent p-2 text-sm outline-none"
                />
                <select className="bg-gray-200 border-l px-2 text-sm outline-none font-medium">
                  {unitOptions.map((u) => <option key={u}>{u}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3">Alasan Perubahan Stock</label>
            <div className="flex flex-wrap gap-3">
              {alasanOptions.map((alasan) => (
                <button
                  key={alasan}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                >
                  {alasan}
                </button>
              ))}
            </div>
          </div>

          <button className="mt-auto w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors">
            Simpan
          </button>
        </div>

        {/* Bagian Kanan: Info & Riwayat */}
        <div className="flex-1 bg-gray-100 p-6 relative flex flex-col h-full">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-red-200 text-gray-700 hover:bg-red-300 p-1 rounded-md transition-colors"
          >
            <X size={20} />
          </button>

          {/* Info Card */}
          <div className="bg-white p-4 rounded-xl shadow-sm mb-6 mt-6 md:mt-0">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="font-bold text-gray-800">Daging Ayam</h3>
              <span className="text-xs text-gray-400">#443245</span>
            </div>
            <div className="grid grid-cols-2 gap-y-4 text-sm mb-4">
              <div>
                <div className="text-gray-400 text-xs mb-1">Alasan perubahan</div>
                <div className="font-medium text-gray-700">Rusak</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs mb-1">Perubahan Stok Terakhir</div>
                <div className="font-medium text-gray-700">14-02-26 18:22:32</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs mb-1">Jumlah Sekarang</div>
                <div className="font-medium text-gray-700">15 Kg</div>
              </div>
            </div>
          </div>

          <h3 className="font-bold text-lg mb-4">Riwayat Perubahan Stock</h3>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 pb-4">
            {riwayatModalData.map((item, index) => (
              <div key={index} className="bg-white p-3 rounded-xl shadow-sm flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800">Daging Ayam</span>
                  <span className={`font-bold text-lg ${item.type === "plus" ? "text-green-500" : "text-red-500"}`}>
                    {item.qty}{" "}
                    <span className="text-sm text-gray-800">{item.unit}</span>
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">{item.pembuat}</span>
                  <span className={`font-medium ${item.type === "plus" ? "text-green-500" : "text-red-500"}`}>
                    {item.alasan}
                  </span>
                  <span className="text-gray-500">{item.waktu}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}