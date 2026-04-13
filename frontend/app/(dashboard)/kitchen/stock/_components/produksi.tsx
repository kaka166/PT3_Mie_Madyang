"use client";

import { useState } from "react";
import { X } from "lucide-react";

const unitOptions = ["Kg", "G", "L", "Ml", "Pack", "Ikat"];

interface ProduksiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProduksiModal({ isOpen, onClose }: ProduksiModalProps) {
    // STATENYA DISINI YA BOSSQUEEE 
  const [isProduksiBahanBaru, setIsProduksiBahanBaru] = useState(true);
  const [bahanList, setBahanList] = useState([1, 2]);

  const tambahBahan = () => {
    setBahanList([...bahanList, bahanList.length + 1]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-5xl flex-col md:flex-row overflow-hidden rounded-2xl bg-white shadow-2xl max-h-[90vh]">
        {/* Bagian Kiri: Laporan Produksi */}
        <div className="w-full md:w-[45%] p-8 flex flex-col overflow-y-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 leading-tight">
            Laporan Produksi <br /> Bahan Setengah jadi
          </h2>

          {/* NAMA BARANG INI */}
          <div className="mb-6">
            <label className="block text-base font-semibold mb-2">Nama Barang</label>
            <select className="w-full bg-gray-100 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-red-200 outline-none appearance-none cursor-pointer">
              <option>Masukan nama barang</option>
              <option>Adonan Mie</option>
              <option>Pangsit Mentah</option>
            </select>
          </div>

          {/* Jumlah Sekarang & Jumlah Produksi */}
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

          {/* Penambahan Bahan Baru */}
          <div className="mb-6">
            <label className="block text-base font-semibold mb-3">Penambahan Bahan Baru?</label>
            <div className="flex gap-3">
              <button
                onClick={() => setIsProduksiBahanBaru(true)}
                className={`px-8 py-2.5 rounded-lg text-sm font-medium transition-colors ${isProduksiBahanBaru ? "bg-red-500 text-white shadow-sm" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                Ya
              </button>
              <button
                onClick={() => setIsProduksiBahanBaru(false)}
                className={`px-8 py-2.5 rounded-lg text-sm font-medium transition-colors ${!isProduksiBahanBaru ? "bg-red-500 text-white shadow-sm" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                Tidak
              </button>
            </div>
          </div>

          <button className="mt-auto w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-xl transition-colors text-lg">
            Tambahkan
          </button>
        </div>

        {/* Bagian Kanan: Masukan Bahan Baku */}
        <div className="w-full md:w-[55%] bg-[#f4f4f4] p-8 relative flex flex-col">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-red-300 text-gray-800 hover:bg-red-400 p-2 rounded-lg transition-colors z-10"
          >
            <X size={20} strokeWidth={3} />
          </button>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-2">Masukan Bahan Baku</h2>

          <div className="flex-1 overflow-y-auto pr-2 pb-4 space-y-4">
            {bahanList.map((num, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg mb-4 text-gray-800">Bahan {num}</h3>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2 text-gray-800">Nama Bahan</label>
                  <select className="w-full bg-[#f8f8f8] border border-gray-200 rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-red-200 outline-none appearance-none cursor-pointer">
                    <option>Masukan nama Bahan</option>
                    <option>Tepung Terigu</option>
                    <option>Telur Ayam</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-2">
                    Masukan Jumlah Bahan Untuk Produksi ini
                  </label>
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
            ))}

            <button
              onClick={tambahBahan}
              className="w-full border-2 border-dashed border-gray-400 text-gray-800 font-medium py-8 rounded-2xl hover:bg-gray-200 transition-colors mt-4 bg-transparent"
            >
              Klik Untuk Menambahkan Bahan Tambahan
            </button>
          </div>

          <div className="pt-4 mt-auto">
            <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-xl transition-colors shadow-md text-lg">
              Simpan Data Produksi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}