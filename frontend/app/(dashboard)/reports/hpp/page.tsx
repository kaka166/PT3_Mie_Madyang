"use client";

import React, { useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Package,
  Pencil,
  X,
  Plus
} from "lucide-react";

// --- DUMMY DATA ---
const dummyRiwayat = [
  { id: "#22398", nama: "Mie Madyang", total: 60000 },
  { id: "#22398", nama: "Bakso Bakar", total: 60000 },
  { id: "#22398", nama: "Pangsit Goreng", total: 60000 },
  { id: "#22398", nama: "Pangsit Rebus", total: 60000 },
  { id: "#22398", nama: "Empis goreng", total: 60000 },
  { id: "#22398", nama: "Kentangnya Farrel", total: 60000 },
];

export default function HPPPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- STATE MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<any>(null);

  // --- STATE FORM DINAMIS BAHAN BAKU ---
  const [bahanList, setBahanList] = useState([
    { id: 1, nama: "", jumlah: "", unit: "Kg", harga: "" },
    { id: 2, nama: "", jumlah: "", unit: "Kg", harga: "" },
  ]);

  const handleOpenModal = (menu?: any) => {
    setSelectedMenu(menu || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMenu(null);
    // Reset form bahan baku ke default
    setBahanList([
      { id: 1, nama: "", jumlah: "", unit: "Kg", harga: "" },
      { id: 2, nama: "", jumlah: "", unit: "Kg", harga: "" },
    ]);
  };

  const handleAddBahan = () => {
    setBahanList([
      ...bahanList,
      { id: Date.now(), nama: "", jumlah: "", unit: "Kg", harga: "" }
    ]);
  };

  const handleRemoveBahan = (idToRemove: number) => {
    setBahanList(bahanList.filter(b => b.id !== idToRemove));
  };

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 2,
    }).format(value).replace("Rp", "Rp.");
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-neutral-100 p-8 pb-12 font-sans text-gray-800">
      
      {/* --- HEADER --- */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#F53E1B] mb-1">
          HPP
        </h1>
        <p className="text-gray-500 font-medium">
          Laporan Harga Pokok Penjualan Mi Madyang
        </p>
      </div>

      {/* --- SUMMARY CARD --- */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 w-full max-w-sm">
        <div className="bg-red-50 p-2.5 rounded-lg w-max mb-4">
          <Package className="text-[#f85656]" size={20} />
        </div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
          INI DATA APA NTAR...
        </p>
        <p className="text-3xl font-extrabold text-gray-900">
          Rp 2.450.000
        </p>
      </div>

      <button 
        onClick={() => handleOpenModal()} // Tombol ini juga bisa untuk tambah produksi baru
        className="flex items-center gap-2 bg-[#f85656] hover:bg-[#e04545] text-white px-4 py-2.5 rounded-lg font-semibold text-sm mb-6 transition-colors shadow-sm"
      >
        <Package size={18} />
        Laporkan Produksi
      </button>

      {/* --- TABEL RIWAYAT --- */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 flex justify-between items-center border-b ">
          <h2 className="text-xl font-bold text-black">Riwayat Pengeluaran</h2>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Cari menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-200 text-gray-600 placeholder-gray-400 pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 w-56 font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-neutral-400 text-xs font-semibold uppercase tracking-wider border-b border-neutral-100">
              <tr>
                <th className="py-4 px-6 font-semibold">ID</th>
                <th className="py-4 px-6 font-semibold">Nama Menu</th>
                <th className="py-4 px-6 font-semibold">Total</th>
                <th className="py-4 px-6 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dummyRiwayat.map((item, index) => (
                <tr 
                  key={index} 
                  className={`border-b border-gray-100 transition-colors hover:bg-gray-100 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-100"
                  }`}
                >
                  <td className="py-4 px-6 font-semibold text-gray-700">{item.id}</td>
                  <td className="py-4 px-6 font-bold text-gray-800">{item.nama}</td>
                  <td className="py-4 px-6 font-medium text-gray-700">
                    {formatRupiah(item.total)}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button 
                      onClick={() => handleOpenModal(item)}
                      className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-200 p-2 rounded-lg transition-colors inline-flex justify-center items-center"
                      title="Edit Produksi"
                    >
                      <Pencil size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t flex justify-between items-center text-sm bg-white">
          <span className="text-gray-500 font-medium">Showing 1-9 of 2810 Transaction</span>
          <div className="flex items-center gap-1.5 font-bold">
            <button className="w-8 h-8 flex items-center justify-center rounded bg-[#f85656] text-white hover:bg-[#e04545]"><ChevronLeft size={16} /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-[#f85656] text-white shadow-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-200 text-gray-700 hover:bg-gray-300">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-200 text-gray-700 hover:bg-gray-300">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-200 text-gray-700 hover:bg-gray-300">4</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-200 text-gray-700 hover:bg-gray-300">5</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-[#f85656] text-white hover:bg-[#e04545]"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {/* --- KOMPONEN POP UP MODAL PRODUKSI --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl flex w-full max-w-5xl h-[600px] overflow-hidden relative">
            
            {/* PANEL KIRI - Info Produksi */}
            <div className="w-[40%] bg-white p-8 flex flex-col border-r border-gray-200 overflow-y-auto custom-scrollbar">
              <h2 className="text-3xl font-bold mb-8 text-black">Produksi</h2>
              
              <div className="mb-6">
                <label className="block font-bold text-gray-800 mb-2">Nama Menu</label>
                <input 
                  type="text" 
                  defaultValue={selectedMenu ? selectedMenu.nama : ""}
                  placeholder="Masukan nama barang"
                  className="w-full bg-[#f0f0f0] border-none rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 font-medium"
                />
              </div>

              <div className="mb-8">
                <label className="block font-bold text-gray-800 mb-2">Jumlah Produk</label>
                <div className="relative">
                  <input 
                    type="number" 
                    placeholder="Jumlah"
                    className="w-full bg-[#f0f0f0] border-none rounded-xl px-4 py-3 pr-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 font-medium"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-800">
                    unit
                  </span>
                </div>
              </div>

              {/* Box Hasil Perhitungan */}
              <div className="bg-[#f0f0f0] rounded-2xl p-6 mt-auto">
                <h3 className="font-bold text-lg mb-4 text-black">Hasil perhitungan HPP</h3>
                
                <div className="mb-4">
                  <p className="text-gray-400 font-bold text-sm mb-1">Total bahan baku:</p>
                  <p className="font-extrabold text-black text-lg">Rp. 15.000</p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-400 font-bold text-sm mb-1">Biaya Operasional:</p>
                  <p className="font-extrabold text-black text-lg">Rp. 15.000</p>
                </div>
                <div>
                  <p className="text-gray-400 font-bold text-sm mb-1">HPP per produk</p>
                  <p className="font-extrabold text-black text-lg">Rp. 15.000</p>
                </div>
              </div>
            </div>

            {/* PANEL KANAN - Masukan Bahan Baku */}
            <div className="w-[60%] bg-[#f4f4f5] p-8 flex flex-col relative overflow-y-auto custom-scrollbar">
              <button
                onClick={handleCloseModal}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-colors z-10"
              >
                <X size={24} />
              </button>
              
              <h2 className="text-3xl font-bold mb-8 text-black">Masukan Bahan Baku</h2>

              <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-6">
                {bahanList.map((bahan, index) => (
                  <div key={bahan.id} className="bg-white p-6 rounded-2xl shadow-sm relative border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xl font-bold text-black">Bahan {index + 1}</h4>
                      {/* Tombol Delete Bahan (Muncul jika bahan > 1) */}
                      {bahanList.length > 1 && (
                        <button 
                          onClick={() => handleRemoveBahan(bahan.id)}
                          className="bg-[#fca5a5] hover:bg-[#f87171] text-red-900 rounded-lg p-1 transition-colors"
                        >
                          <X size={16} strokeWidth={3} />
                        </button>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block font-bold text-gray-800 mb-2 text-sm">Nama Bahan</label>
                      <select className="w-full bg-[#f5f5f5] border-none rounded-xl px-4 py-3 text-gray-500 focus:outline-none font-medium appearance-none">
                        <option value="">Masukan nama Bahan</option>
                        <option value="Tepung">Tepung Terigu</option>
                        <option value="Ayam">Daging Ayam</option>
                        <option value="Bumbu">Bumbu Rahasia</option>
                      </select>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block font-bold text-gray-800 mb-2 text-sm">Jumlah Bahan Produksi</label>
                        <div className="flex bg-[#f5f5f5] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-gray-300">
                          <input 
                            type="number" 
                            placeholder="Jumlah"
                            className="w-full bg-transparent border-none px-4 py-3 text-gray-700 focus:outline-none font-medium"
                          />
                          {/* INI DATA BUAT DROP DOWN */}
                          <select className="bg-[#e5e5e5] border-none px-3 py-3 text-black font-bold focus:outline-none cursor-pointer">
                            <option value="Kg">Kg</option>
                            <option value="Gram">Gram</option>
                            <option value="Pcs">Pcs</option>
                            <option value="Liter">Liter</option>
                            <option value="Mililiter">Mililiter</option>
                            <option value="Ikat">Ikat</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <label className="block font-bold text-gray-800 mb-2 text-sm">Harga Satuan</label>
                        <input 
                          type="number" 
                          placeholder="Jumlah"
                          className="w-full bg-[#f5f5f5] border-none rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 font-medium"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Tombol Tambah Bahan Baru */}
                <button 
                  onClick={handleAddBahan}
                  className="w-full border-2 border-dashed border-gray-400 text-gray-800 font-bold py-6 rounded-2xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  Klik Untuk Menambahkan Bahan Tambahan
                </button>
              </div>

              {/* Tombol Simpan (Fixed di bawah kanan) */}
              <div className="mt-auto pt-2">
                <button
                  onClick={handleCloseModal}
                  className="w-full bg-[#f85656] hover:bg-[#e04545] text-white py-4 rounded-xl font-bold text-xl transition-colors shadow-sm"
                >
                  Simpan Data Produksi
                </button>
              </div>
            </div>
            
          </div>
        </div>
      )}

      {/* Tambahan CSS untuk scrollbar khusus modal (Opsional, letakkan di global.css aslinya) */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 20px;
        }
      `}} />

    </div>
  );
}