"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Package,
  Pencil,
  X,
  Plus,
} from "lucide-react";
import { produksiService } from "@/services/produksiService";
import { formatRupiah, parseRupiah } from "@/utils/formatRupiah";

export default function HPPPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // --- STATE MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<any>(null);

  // --- STATE FORM DINAMIS BAHAN BAKU ---
  const [bahanList, setBahanList] = useState([
    { id: 1, nama: "", jumlah: "", unit: "Kg", harga: "" },
    { id: 2, nama: "", jumlah: "", unit: "Kg", harga: "" },
  ]);

  const handleOpenModal = (item?: any) => {
    console.log("ITEM EDIT:", item);

    if (item) {
      setIsEdit(true);
      setEditId(item.id);
      // 🔥 MODE EDIT
      setSelectedMenu(item.menu_id);

      const mappedBahan = (item.details || []).map((d: any, index: number) => ({
        id: Date.now() + index,
        nama: d.bahan_id || "",
        jumlah: d.qty?.toString() || "",
        unit: "Kg",
        harga: d.harga_satuan?.toString() || "",
      }));

      // kalau tidak ada detail, kasih default 1 row
      setBahanList(
        mappedBahan.length > 0
          ? mappedBahan
          : [{ id: 1, nama: "", jumlah: "", unit: "Kg", harga: "" }],
      );
    } else {
      // 🔥 MODE TAMBAH
      setIsEdit(false);
      setEditId(null);
      setSelectedMenu(null);
      setBahanList([
        { id: 1, nama: "", jumlah: "", unit: "Kg", harga: "" },
        { id: 2, nama: "", jumlah: "", unit: "Kg", harga: "" },
      ]);
    }

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
      { id: Date.now(), nama: "", jumlah: "", unit: "Kg", harga: "" },
    ]);
  };

  const handleRemoveBahan = (idToRemove: number) => {
    setBahanList(bahanList.filter((b) => b.id !== idToRemove));
  };

  const [riwayat, setRiwayat] = useState<any[]>([]);
  const [menuList, setMenuList] = useState<any[]>([]);
  const [bahanMaster, setBahanMaster] = useState<any[]>([]);

  const filteredData = riwayat.filter((item) =>
    item.menu?.nama_menu?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalItems = filteredData.length;

  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const produksi = await produksiService.getProduksi();
      const menu = await produksiService.getMenu();
      const bahan = await produksiService.getBahan();

      setRiwayat(produksi);
      setMenuList(menu);
      setBahanMaster(bahan);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!selectedMenu) {
        alert("Pilih menu dulu!");
        return;
      }

      if (bahanList.some((b) => !b.nama || !b.jumlah || !b.harga)) {
        alert("Semua bahan harus diisi!");
        return;
      }
      const payload = {
        menu_id: Number(selectedMenu),
        tanggal_produksi: new Date().toISOString().split("T")[0],
        jumlah_porsi: 1, // sementara (nanti bisa input)
        bahan: bahanList.map((b) => ({
          bahan_id: Number(b.nama),
          qty: Number(b.jumlah),
          harga_satuan: Number(b.harga),
        })),
      };

      console.log("PAYLOAD:", payload);

      let res;

      if (isEdit && editId) {
        res = await produksiService.updateProduksi(editId, payload);
      } else {
        res = await produksiService.createProduksi(payload);
      }

      console.log("RESPONSE BACKEND:", res);

      if (res.error) {
        alert("Error: " + res.error);
        return;
      }

      alert("Berhasil simpan produksi");
      handleCloseModal();
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-neutral-100 p-8 pb-12 font-sans text-gray-800">
      {/* --- HEADER --- */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#F53E1B] mb-1">HPP</h1>
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
        <p className="text-3xl font-extrabold text-gray-900">Rp 2.450.000</p>
      </div>

      <button
        onClick={() => handleOpenModal()} // Tombol ini juga bisa untuk tambah produksi baru
        className="flex items-center gap-2 bg-[#f85656] hover:bg-[#e04545] text-white px-4 py-2.5 rounded-lg font-semibold text-sm mb-6 transition-colors shadow-sm">
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
              {paginatedData.map((item, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-100 transition-colors hover:bg-gray-100 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-100"
                  }`}>
                  <td className="py-4 px-6 font-semibold text-gray-700">
                    {item.id}
                  </td>
                  <td className="py-4 px-6 font-bold text-gray-800">
                    {item.menu?.nama_menu}
                  </td>
                  <td className="py-4 px-6 font-medium text-gray-700">
                    {formatRupiah(item.hpp_per_porsi)}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-200 p-2 rounded-lg transition-colors inline-flex justify-center items-center"
                      title="Edit Produksi">
                      <Pencil size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t flex justify-between items-center bg-white">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <span className="text-gray-500 font-medium text-sm">
              Showing {totalItems === 0 ? 0 : startIndex + 1}-
              {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems}
            </span>

            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1); // reset ke page 1
              }}
              className="bg-gray-100 px-2 py-1 rounded text-sm">
              {[10, 20, 30, 40].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-1.5 font-bold">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`w-8 h-8 flex items-center justify-center rounded ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400"
                  : "bg-[#f85656] text-white"
              }`}>
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={i}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded ${
                    currentPage === page
                      ? "bg-[#f85656] text-white"
                      : "bg-gray-200"
                  }`}>
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`w-8 h-8 flex items-center justify-center rounded ${
                currentPage === totalPages || totalPages === 0
                  ? "bg-gray-200 text-gray-400"
                  : "bg-[#f85656] text-white"
              }`}>
              <ChevronRight size={16} />
            </button>
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
                <label className="block font-bold text-gray-800 mb-2">
                  Nama Menu
                </label>
                <select
                  className="w-full bg-[#f0f0f0] rounded-xl px-4 py-3"
                  value={selectedMenu || ""}
                  onChange={(e) => setSelectedMenu(e.target.value)}>
                  <option value="">Pilih Menu</option>
                  {menuList.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nama_menu}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* PANEL KANAN - Masukan Bahan Baku */}
            <div className="w-[60%] bg-[#f4f4f5] p-8 flex flex-col relative overflow-y-auto custom-scrollbar">
              <button
                onClick={handleCloseModal}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-colors z-10">
                <X size={24} />
              </button>

              <h2 className="text-3xl font-bold mb-8 text-black">
                Masukan Bahan Baku
              </h2>

              <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-6">
                {bahanList.map((bahan, index) => (
                  <div
                    key={bahan.id}
                    className="bg-white p-6 rounded-2xl shadow-sm relative border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xl font-bold text-black">
                        Bahan {index + 1}
                      </h4>
                      {/* Tombol Delete Bahan (Muncul jika bahan > 1) */}
                      {bahanList.length > 1 && (
                        <button
                          onClick={() => handleRemoveBahan(bahan.id)}
                          className="bg-[#fca5a5] hover:bg-[#f87171] text-red-900 rounded-lg p-1 transition-colors">
                          <X size={16} strokeWidth={3} />
                        </button>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block font-bold text-gray-800 mb-2 text-sm">
                        Nama Bahan
                      </label>
                      <select
                        className="w-full bg-[#f5f5f5] border-none rounded-xl px-4 py-3 text-gray-500 focus:outline-none font-medium appearance-none"
                        value={bahan.nama || ""}
                        onChange={(e) => {
                          const newList = [...bahanList];
                          newList[index].nama = e.target.value;
                          setBahanList(newList);
                        }}>
                        <option value="">Pilih Bahan</option>
                        {bahanMaster.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.nama_bahan}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block font-bold text-gray-800 mb-2 text-sm">
                          Jumlah Bahan Produksi
                        </label>
                        <div className="flex bg-[#f5f5f5] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-gray-300">
                          <input
                            type="number"
                            placeholder="Jumlah"
                            className="w-full bg-transparent border-none px-4 py-3 text-gray-700 focus:outline-none font-medium"
                            value={bahan.jumlah}
                            onChange={(e) => {
                              const newList = [...bahanList];
                              newList[index].jumlah = e.target.value;
                              setBahanList(newList);
                            }}
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
                        <label className="block font-bold text-gray-800 mb-2 text-sm">
                          Harga Satuan
                        </label>
                        <input
                          type="text"
                          placeholder="Harga"
                          className="w-full bg-[#f5f5f5] border-none rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 font-medium"
                          value={formatRupiah(bahan.harga)}
                          onChange={(e) => {
                            const raw = parseRupiah(e.target.value);

                            const newList = [...bahanList];
                            newList[index].harga = raw;
                            setBahanList(newList);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Tombol Tambah Bahan Baru */}
                <button
                  onClick={handleAddBahan}
                  className="w-full border-2 border-dashed border-gray-400 text-gray-800 font-bold py-6 rounded-2xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                  Klik Untuk Menambahkan Bahan Tambahan
                </button>
              </div>

              {/* Tombol Simpan (Fixed di bawah kanan) */}
              <div className="mt-auto pt-2">
                <button
                  onClick={handleSubmit}
                  className="w-full bg-[#f85656] hover:bg-[#e04545] text-white py-4 rounded-xl font-bold text-xl transition-colors shadow-sm">
                  Simpan Data Produksi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tambahan CSS untuk scrollbar khusus modal (Opsional, letakkan di global.css aslinya) */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
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
      `,
        }}
      />
    </div>
  );
}
