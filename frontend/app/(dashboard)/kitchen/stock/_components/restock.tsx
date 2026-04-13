"use client";

import { useState } from "react";
import { X } from "lucide-react";

const keranjangData = [
  { nama: "Daging Ayam Segar", qty: "25", unit: "Kg", pembuat: "Staff Kasir Wirman", waktu: "14-02-26 18:22:32" },
  { nama: "Kaldu Jamur totole", qty: "1", unit: "Pack", pembuat: "Staff Kasir Wirman", waktu: "14-02-26 18:22:32" },
  { nama: "Minyak Bimoli", qty: "10", unit: "L", pembuat: "Staff Kasir Wirman", waktu: "14-02-26 18:22:32" },
  { nama: "Minyak apalahh", qty: "800", unit: "ml", pembuat: "Staff Kasir Wirman", waktu: "14-02-26 18:22:32" },
];

const unitOptions = ["Kg", "L", "Pack", "ml"];

interface RestockModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RestockModal({ isOpen, onClose }: RestockModalProps) {
  const [isBahanBaru, setIsBahanBaru] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-4xl flex-col md:flex-row overflow-hidden rounded-2xl bg-white shadow-2xl max-h-[90vh]">
        {/* Bagian Kiri: Form Input */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Laporan Restock</h2>

          {/* Toggle Penambahan Bahan Baru */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3">Penambahan Bahan Baru?</label>
            <div className="flex gap-3">
              <button
                onClick={() => setIsBahanBaru(true)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${isBahanBaru ? "bg-red-500 text-white shadow-sm" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                Ya
              </button>
              <button
                onClick={() => setIsBahanBaru(false)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${!isBahanBaru ? "bg-red-500 text-white shadow-sm" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                Tidak
              </button>
            </div>
          </div>

          {/* Input Nama Barang */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Nama Barang</label>
            <select className="w-full bg-gray-100 border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-200 outline-none appearance-none">
              <option>Nama barang...</option>
              <option>Ayam Potong</option>
              <option>Mie Mentah</option>
            </select>
          </div>

          {/* Jumlah Sekarang & Jumlah Baru */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2">Jumlah Sekarang</label>
              <div className="text-lg font-bold">15 Kg</div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2">Jumlah Baru</label>
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

          {/* Harga per Satuan */}
          <div className="mb-6 w-1/2 pr-2">
            <label className="block text-sm font-semibold mb-2">Harga per satuan</label>
            <input
              type="number"
              placeholder="Harga"
              className="w-full bg-gray-100 border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-200 outline-none"
            />
          </div>

          <button className="mt-auto w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors">
            Tambahkan ke keranjang
          </button>
        </div>

        {/* Bagian Kanan: Keranjang */}
        <div className="flex-1 bg-gray-100 p-6 relative flex flex-col h-full border-l border-gray-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-red-200 text-gray-700 hover:bg-red-300 p-1 rounded-md transition-colors"
          >
            <X size={20} />
          </button>

          <h3 className="font-bold text-xl mb-6 text-gray-900 mt-2 md:mt-0">Keranjang</h3>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 pb-6">
            {keranjangData.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-xl shadow-sm flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800 text-base">{item.nama}</span>
                  <span className="font-bold text-xl text-red-600">
                    {item.qty}{" "}
                    <span className="text-sm text-gray-900">{item.unit}</span>
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs mt-1">
                  <span className="text-gray-400 font-medium">{item.pembuat}</span>
                  <span className="text-gray-500">{item.waktu}</span>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-auto w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors shadow-md">
            Simpan Data Restock
          </button>
        </div>
      </div>
    </div>
  );
}