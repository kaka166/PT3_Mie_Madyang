"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, Plus, ChevronLeft, ChevronRight, Package, Pencil, X } from "lucide-react";
import { hppService, HppHistory, HppRequestBahan } from "@/services/hppService";

export default function HPPPage() {
  const [search, setSearch] = useState("");
  const [riwayat, setRiwayat] = useState<HppHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- STATE MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<HppHistory | null>(null);

  // --- STATE FORM (Pakai string kosong agar placeholder muncul) ---
  const [namaMenu, setNamaMenu] = useState("");
  const [targetPenjualan, setTargetPenjualan] = useState<string | number>("");
  const [bebanSewa, setBebanSewa] = useState<string | number>("");
  const [bebanGaji, setBebanGaji] = useState<string | number>("");
  const [bebanLain, setBebanLain] = useState<string | number>("");

  const [bahanList, setBahanList] = useState<
    Array<{ id: number; nama: string; jumlah: string; unit: string; harga: string }>
  >([
    { id: 1, nama: "", jumlah: "", unit: "Kg", harga: "" },
    { id: 2, nama: "", jumlah: "", unit: "Kg", harga: "" },
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await hppService.getHistory();
      setRiwayat(data);
    } catch (error) {
      console.error("Gagal mengambil history", error);
    }
  };

  // Handler input angka agar tidak minus
  const handleNumberInput = (value: string, setter: (v: number | string) => void) => {
    const num = parseFloat(value);
    if (value === "") {
      setter("");
    } else if (num >= 0) {
      setter(num);
    }
  };

  const handleOpenModal = (menu?: HppHistory) => {
    if (menu) {
      setSelectedMenu(menu);
      setNamaMenu(menu.nama_menu);
      setTargetPenjualan(menu.target_penjualan);
      setBebanSewa(Number(menu.beban_sewa));
      setBebanGaji(Number(menu.beban_gaji));
      setBebanLain(Number(menu.beban_lain_per_porsi));
      setBahanList(
        menu.details.map((d, i) => ({
          id: i,
          nama: d.nama_bahan,
          jumlah: d.jumlah_porsi.toString(),
          unit: "Unit",
          harga: d.harga_beli.toString(),
        }))
      );
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMenu(null);
    setNamaMenu("");
    setTargetPenjualan("");
    setBebanSewa("");
    setBebanGaji("");
    setBebanLain("");
    setBahanList([
      { id: 1, nama: "", jumlah: "", unit: "Kg", harga: "" },
      { id: 2, nama: "", jumlah: "", unit: "Kg", harga: "" },
    ]);
  };

  const handleAddBahan = () => {
    setBahanList([...bahanList, { id: Date.now(), nama: "", jumlah: "", unit: "Kg", harga: "" }]);
  };

  const handleRemoveBahan = (idToRemove: number) => {
    setBahanList(bahanList.filter((b) => b.id !== idToRemove));
  };

  const handleSave = async () => {
    if (!namaMenu) return alert("Nama menu tidak boleh kosong");
    if (Number(targetPenjualan) < 1) return alert("Target penjualan minimal 1 porsi");

    setIsLoading(true);
    try {
      const payloadBahan: HppRequestBahan[] = bahanList
        .filter((b) => b.nama.trim() !== "")
        .map((b) => ({
          nama: b.nama,
          harga_beli: parseFloat(b.harga) || 0,
          jumlah_porsi: parseFloat(b.jumlah) || 1,
        }));

      if (payloadBahan.length === 0) {
        setIsLoading(false);
        return alert("Minimal harus ada satu bahan baku");
      }

      await hppService.calculateAndSave({
        nama_menu: namaMenu,
        bahan: payloadBahan,
        target_penjualan: Number(targetPenjualan) || 1,
        beban_sewa: Number(bebanSewa) || 0,
        beban_gaji: Number(bebanGaji) || 0,
        beban_lain_lain: Number(bebanLain) || 0,
      });

      fetchData();
      handleCloseModal();
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan data.");
    } finally {
      setIsLoading(false);
    }
  };

  const calculationPreview = useMemo(() => {
    const totalBahan = bahanList.reduce((acc, curr) => {
      const hppItem = (parseFloat(curr.harga) || 0) / (parseFloat(curr.jumlah) || 1);
      return acc + hppItem;
    }, 0);

    const target = Number(targetPenjualan) || 1;
    const operasionalPerPorsi = (Number(bebanSewa) + Number(bebanGaji)) / target + Number(bebanLain);

    return {
      totalBahan,
      operasional: operasionalPerPorsi,
      totalHpp: totalBahan + operasionalPerPorsi,
    };
  }, [bahanList, bebanSewa, bebanGaji, targetPenjualan, bebanLain]);

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-neutral-100 p-8 pb-12 font-sans text-gray-800">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#F53E1B] mb-1">HPP</h1>
        <p className="text-gray-500 font-medium">Laporan Harga Pokok Penjualan Mi Madyang</p>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 w-full max-w-sm">
        <div className="bg-red-50 p-2.5 rounded-lg w-max mb-4">
          <Package className="text-[#f85656]" size={20} />
        </div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
          gatau mau isi apa, pake last input aja deh wkwkwkwkwkwkwk
        </p>
        <p className="text-3xl font-extrabold text-gray-900">
          {formatRupiah(riwayat[0]?.total_hpp || 0)}
        </p>
      </div>

      <button
        onClick={() => handleOpenModal()}
        className="flex items-center gap-2 bg-[#f85656] hover:bg-[#e04545] text-white px-4 py-2.5 rounded-lg font-semibold text-sm mb-6 transition-colors shadow-sm"
      >
        <Package size={18} />
        Laporkan Produksi
      </button>

      {/* --- TABEL RIWAYAT --- */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 flex justify-between items-center border-b ">
          <h2 className="text-xl font-bold text-black">Riwayat Pengeluaran</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
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
                <th className="py-4 px-6 font-semibold">Total HPP</th>
                <th className="py-4 px-6 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {riwayat
                .filter((i) => i.nama_menu.toLowerCase().includes(search.toLowerCase()))
                .map((item, index) => (
                  <tr
                    key={item.id}
                    className={`border-b border-gray-100 transition-colors hover:bg-gray-100 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="py-4 px-6 font-semibold text-gray-700">#{item.id}</td>
                    <td className="py-4 px-6 font-bold text-gray-800">{item.nama_menu}</td>
                    <td className="py-4 px-6 font-medium text-gray-700">
                      {formatRupiah(item.total_hpp)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-200 p-2 rounded-lg transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL PRODUKSI --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl flex w-full max-w-5xl h-[650px] overflow-hidden relative">
            {/* PANEL KIRI */}
            <div className="w-[40%] bg-white p-8 flex flex-col border-r border-gray-200 overflow-y-auto custom-scrollbar">
              <h2 className="text-3xl font-bold mb-8 text-black">Produksi</h2>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Nama Menu</label>
                  <input
                    value={namaMenu}
                    onChange={(e) => setNamaMenu(e.target.value)}
                    type="text"
                    placeholder="Contoh: Mie Iblis"
                    className="w-full bg-[#f0f0f0] rounded-xl px-4 py-3 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Target Jual (Porsi)</label>
                  <input
                    value={targetPenjualan}
                    onChange={(e) => handleNumberInput(e.target.value, setTargetPenjualan)}
                    type="number"
                    min="0"
                    placeholder="Contoh: 1000"
                    className="w-full bg-[#f0f0f0] rounded-xl px-4 py-3 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-gray-800 mb-1 text-xs">Sewa (Rp)</label>
                    <input
                      value={bebanSewa}
                      onChange={(e) => handleNumberInput(e.target.value, setBebanSewa)}
                      type="number"
                      min="0"
                      placeholder="0"
                      className="w-full bg-[#f0f0f0] rounded-xl px-4 py-2 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-800 mb-1 text-xs">Gaji (Rp)</label>
                    <input
                      value={bebanGaji}
                      onChange={(e) => handleNumberInput(e.target.value, setBebanGaji)}
                      type="number"
                      min="0"
                      placeholder="0"
                      className="w-full bg-[#f0f0f0] rounded-xl px-4 py-2 text-sm focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-gray-800 mb-1 text-xs">Beban Lain/Porsi (Rp)</label>
                  <input
                    value={bebanLain}
                    onChange={(e) => handleNumberInput(e.target.value, setBebanLain)}
                    type="number"
                    min="0"
                    placeholder="0"
                    className="w-full bg-[#f0f0f0] rounded-xl px-4 py-2 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="bg-[#f0f0f0] rounded-2xl p-6 mt-auto">
                <h3 className="font-bold text-lg mb-4">Hasil perhitungan HPP</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Bahan baku:</span>
                    <span className="font-bold">{formatRupiah(calculationPreview.totalBahan)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Operasional:</span>
                    <span className="font-bold">{formatRupiah(calculationPreview.operasional)}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2 flex justify-between">
                    <span className="font-bold">Total HPP:</span>
                    <span className="font-extrabold text-[#f85656]">
                      {formatRupiah(calculationPreview.totalHpp)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* PANEL KANAN */}
            <div className="w-[60%] bg-[#f4f4f5] p-8 flex flex-col relative overflow-y-auto custom-scrollbar">
              <button
                onClick={handleCloseModal}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-colors z-10">
                <X size={24} />
              </button>
              <h2 className="text-3xl font-bold mb-8 text-black">Masukan Bahan Baku</h2>

              <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-6">
                {bahanList.map((bahan, index) => (
                  <div
                    key={bahan.id}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xl font-bold text-black">Bahan {index + 1}</h4>
                      {bahanList.length > 1 && (
                        <button
                          onClick={() => handleRemoveBahan(bahan.id)}
                          className="bg-[#fca5a5] text-red-900 rounded-lg p-1"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    <div className="mb-4">
                      <label className="block font-bold text-gray-800 mb-2 text-sm">
                        Nama Bahan
                      </label>
                      <input
                        value={bahan.nama}
                        onChange={(e) => {
                          const newList = [...bahanList];
                          newList[index].nama = e.target.value;
                          setBahanList(newList);
                        }}
                        placeholder="Masukan nama bahan"
                        className="w-full bg-[#f5f5f5] rounded-xl px-4 py-3 focus:outline-none"
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block font-bold text-gray-800 mb-2 text-sm">
                          Jumlah Porsi
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={bahan.jumlah}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "" || parseFloat(val) >= 0) {
                              const newList = [...bahanList];
                              newList[index].jumlah = val;
                              setBahanList(newList);
                            }
                          }}
                          placeholder="0"
                          className="w-full bg-[#f5f5f5] rounded-xl px-4 py-3 focus:outline-none"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block font-bold text-gray-800 mb-2 text-sm">
                          Harga Beli (Rp)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={bahan.harga}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "" || parseFloat(val) >= 0) {
                              const newList = [...bahanList];
                              newList[index].harga = val;
                              setBahanList(newList);
                            }
                          }}
                          placeholder="0"
                          className="w-full bg-[#f5f5f5] rounded-xl px-4 py-3 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={handleAddBahan}
                  className="w-full border-2 border-dashed border-gray-400 text-gray-800 font-bold py-6 rounded-2xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={20} /> Klik Untuk Menambahkan Bahan Tambahan
                </button>
              </div>

              <div className="mt-auto">
                <button
                  disabled={isLoading}
                  onClick={handleSave}
                  className={`w-full ${
                    isLoading ? "bg-gray-400" : "bg-[#f85656] hover:bg-[#e04545]"
                  } text-white py-4 rounded-xl font-bold text-xl transition-colors shadow-sm`}
                >
                  {isLoading ? "Menyimpan..." : "Simpan Data Produksi"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `.custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #d1d5db; border-radius: 20px; }`,
        }}
      />
    </div>
  );
}
