"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, Plus, Package, Pencil, X, CircleHelp } from "lucide-react";
import { hppService, HppHistory, HppRequestBahan } from "@/services/hppService";
import { formatRupiah, parseRupiah } from "@/utils/formatRupiah";
import { menuService, Menu } from "@/services/menuService";
import { addNotification } from "@/services/notificationService";

export default function HPPPage() {
  const [search, setSearch] = useState("");
  const [riwayat, setRiwayat] = useState<HppHistory[]>([]);
  const [menuList, setMenuList] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- STATE MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<HppHistory | null>(null);
  const [showRincian, setShowRincian] = useState(false);

  // --- STATE FORM (Pakai string kosong agar placeholder muncul) ---
  const [namaMenu, setNamaMenu] = useState("");
  const [targetPenjualan, setTargetPenjualan] = useState<string | number>("");
  const [bebanSewa, setBebanSewa] = useState<string | number>("");
  const [bebanGaji, setBebanGaji] = useState<string | number>("");
  const [bebanLain, setBebanLain] = useState<string | number>("");

  const [bahanList, setBahanList] = useState<
    Array<{
      id: number;
      nama: string;
      jumlah: string;
      harga: string;
    }>
  >([
    { id: 1, nama: "", jumlah: "", harga: "" },
    { id: 2, nama: "", jumlah: "", harga: "" },
  ]);

  useEffect(() => {
    fetchData();
    fetchMenuList();
  }, []);

  const fetchMenuList = async () => {
    try {
      const res = await menuService.getAll();
      setMenuList(res.data);
    } catch (error) {
      console.error("Gagal mengambil menu", error);
    }
  };

  const fetchData = async () => {
    try {
      const data = await hppService.getHistory();
      setRiwayat(data);
    } catch (error) {
      console.error("Gagal mengambil history", error);
    }
  };

  // Handler input angka agar tidak minus
  const handleNumberInput = (
    value: string,
    setter: (v: number | string) => void,
  ) => {
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
          jumlah: Number(d.jumlah_porsi).toString(),
          harga: Number(d.harga_beli).toString(),
        })),
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
      { id: 1, nama: "", jumlah: "", harga: "" },
      { id: 2, nama: "", jumlah: "", harga: "" },
    ]);
  };

  const handleAddBahan = () => {
    setBahanList([
      ...bahanList,
      { id: Date.now(), nama: "", jumlah: "", harga: "" },
    ]);
  };

  const handleRemoveBahan = (idToRemove: number) => {
    setBahanList(bahanList.filter((b) => b.id !== idToRemove));
  };

  const handleSave = async () => {
    if (!namaMenu) return;
    if (Number(targetPenjualan) < 1) return;

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
        return;
      }

      const payload = {
        nama_menu: namaMenu,
        bahan: payloadBahan,
        target_penjualan: Number(targetPenjualan) || 1,
        beban_sewa: Number(bebanSewa) || 0,
        beban_gaji: Number(bebanGaji) || 0,
        beban_lain_lain: Number(bebanLain) || 0,
      };

      if (selectedMenu) {
        await hppService.updateHistory(selectedMenu.id, payload);
        addNotification(
          "HPP Diperbarui",
          `HPP untuk "${namaMenu}" berhasil diperbarui`,
          "success",
          true,
          "admin",
        );
      } else {
        await hppService.calculateAndSave(payload);
        addNotification(
          "HPP Tersimpan",
          `HPP untuk "${namaMenu}" berhasil disimpan`,
          "success",
          true,
          "admin",
        );
      }

      fetchData();
      handleCloseModal();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculationPreview = useMemo(() => {
    const hppPerPorsiBahan = bahanList.reduce((acc, curr) => {
      const harga = parseFloat(curr.harga) || 0;
      const jumlahPorsi = parseFloat(curr.jumlah) || 1;
      return acc + harga / jumlahPorsi;
    }, 0);

    const target = Number(targetPenjualan) || 1;
    const sewaPerPorsi = (Number(bebanSewa) || 0) / target;

    const gajiPerPorsi = (Number(bebanGaji) || 0) / target;

    const bebanLainPerPorsi = (Number(bebanLain) || 0) / target;

    const totalOpex = sewaPerPorsi + gajiPerPorsi + bebanLainPerPorsi;

    const hppPerPorsi = hppPerPorsiBahan + totalOpex;
    const totalBiayaBahan = hppPerPorsiBahan * target;

    return {
      totalBiayaBahan,
      totalOpex,
      hppPerPorsi,
      target,
    };
  }, [bahanList, targetPenjualan, bebanSewa, bebanGaji, bebanLain]);

  return (
    <div className="h-full w-full overflow-y-auto bg-neutral-100 p-8 pb-12 font-sans text-gray-800">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#F53E1B] mb-1">HPP</h1>
        <p className="text-gray-500 font-medium">
          Laporan Harga Pokok Penjualan Mi Madyang
        </p>
      </div>

      <button
        onClick={() => handleOpenModal()}
        className="flex items-center gap-2 bg-[#f85656] hover:bg-[#e04545] text-white px-4 py-2.5 rounded-lg font-semibold text-sm mb-6 transition-colors shadow-sm">
        <Package size={18} />
        Hitung HPP
      </button>

      {/* --- TABEL HPP --- */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 flex justify-between items-center border-b ">
          <h2 className="text-xl font-bold text-black">HPP Per Menu</h2>
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

        <div className="overflow-x-auto bg-white rounded-3xl shadow-sm border border-gray-100">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-5 py-3 font-semibold">ID</th>
                <th className="px-5 py-3 font-semibold">Nama Menu</th>
                <th className="px-5 py-3 font-semibold">Total HPP</th>
                <th className="px-5 py-3 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {riwayat
                .filter((i) =>
                  i.nama_menu.toLowerCase().includes(search.toLowerCase()),
                )
                .map((item, index) => (
                  <tr
                    key={item.id}
                    className="even:bg-gray-50 odd:bg-white hover:bg-red-50 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-gray-700">
                      #{item.id}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-gray-800">
                      {item.nama_menu}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-gray-700">
                      {formatRupiah(item.total_hpp)}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-200 p-2 rounded-lg transition-colors">
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
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row w-full max-w-5xl max-h-[90vh] h-full min-h-0 overflow-hidden relative">
            {/* PANEL KIRI */}
            <div className="w-full md:w-[40%] bg-white p-6 flex flex-col border-r border-gray-200 h-full min-h-0">
              <h2 className="text-2xl font-bold mb-4 text-black">Hitung HPP</h2>
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block font-bold text-gray-800 mb-0.5">
                    Nama Menu
                  </label>
                  <select
                    value={namaMenu}
                    onChange={(e) => setNamaMenu(e.target.value)}
                    className="w-full bg-[#f0f0f0] rounded-xl px-4 py-2 focus:outline-none font-medium text-sm">
                    <option value="">Pilih menu...</option>
                    {menuList
                      .filter((m) => m.is_active !== 0)
                      .map((m) => (
                        <option key={m.id} value={m.nama_menu}>
                          {m.nama_menu}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-800 mb-0.5">
                    Target Jual (Porsi)
                  </label>
                  <input
                    value={targetPenjualan}
                    onChange={(e) =>
                      handleNumberInput(e.target.value, setTargetPenjualan)
                    }
                    type="number"
                    min="0"
                    placeholder="Contoh: 1000"
                    className="w-full bg-[#f0f0f0] rounded-xl px-4 py-2 focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-800 mb-1 text-xs">
                    Beban Sewa (Rp)
                  </label>
                  <input
                    type="text"
                    value={formatRupiah(bebanSewa)}
                    onChange={(e) => {
                      const raw = parseRupiah(e.target.value);
                      setBebanSewa(raw);
                    }}
                    placeholder="0"
                    className="w-full bg-[#f0f0f0] rounded-xl px-4 py-2 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-800 mb-1 text-xs">
                    Beban Gaji (Rp)
                  </label>
                  <input
                    type="text"
                    value={formatRupiah(bebanGaji)}
                    onChange={(e) => {
                      const raw = parseRupiah(e.target.value);
                      setBebanGaji(raw);
                    }}
                    placeholder="0"
                    className="w-full bg-[#f0f0f0] rounded-xl px-4 py-2 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-800 mb-1 text-xs">
                    Beban Lain (Rp)
                  </label>
                  <input
                    type="text"
                    value={formatRupiah(bebanLain)}
                    onChange={(e) => {
                      const raw = parseRupiah(e.target.value);
                      setBebanLain(raw);
                    }}
                    placeholder="0"
                    className="w-full bg-[#f0f0f0] rounded-xl px-4 py-2 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-auto space-y-3">
                <div
                  className="bg-[#f0f0f0] rounded-2xl p-4 cursor-pointer hover:bg-[#e8e8e8] transition-colors"
                  onClick={() => setShowRincian(true)}
                >
                  <div className="flex items-center gap-1.5 mb-3">
                    <h3 className="font-bold">Hasil perhitungan HPP</h3>
                    <CircleHelp size={13} className="text-gray-400" />
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        Estimasi Total Produksi:
                      </span>
                      <span className="font-bold">
                        {formatRupiah(calculationPreview.totalBiayaBahan)}
                      </span>
                    </div>
                    {calculationPreview.totalOpex > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">
                          Total Operasional:
                        </span>
                        <span className="font-bold">
                          {formatRupiah(calculationPreview.totalOpex)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between border-b border-gray-300 pb-1">
                      <span className="text-gray-400">Target Porsi:</span>
                      <span className="font-bold">
                        {calculationPreview.target} porsi
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">HPP per Porsi:</span>
                      <span className="font-extrabold text-[#f85656]">
                        {formatRupiah(calculationPreview.hppPerPorsi)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  disabled={isLoading}
                  onClick={handleSave}
                  className={`w-full ${
                    isLoading
                      ? "bg-gray-400"
                      : "bg-[#f85656] hover:bg-[#e04545]"
                  } text-white py-3 rounded-xl font-bold transition-colors shadow-sm shrink-0`}>
                  {isLoading ? "Menyimpan..." : "Simpan HPP"}
                </button>
              </div>
            </div>

            {/* PANEL KANAN */}
            <div className="w-full md:w-[60%] bg-[#f4f4f5] p-6 flex flex-col relative h-full min-h-0 overflow-y-auto custom-scrollbar">
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors z-10">
                ×
              </button>
              <h2 className="text-2xl font-bold mb-4 text-black">
                Masukan Bahan Baku
              </h2>

              <div className="space-y-3">
                {bahanList.map((bahan, index) => (
                  <div
                    key={bahan.id}
                    className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold text-black">
                        Bahan {index + 1}
                      </h4>
                      {bahanList.length > 1 && (
                        <button
                          onClick={() => handleRemoveBahan(bahan.id)}
                          className="bg-[#fca5a5] text-red-900 rounded-lg p-0.5">
                          <X size={14} />
                        </button>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="block font-bold text-gray-800 mb-1 text-xs">
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
                        className="w-full bg-[#f5f5f5] rounded-xl px-4 py-2 focus:outline-none text-sm"
                      />
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-[2]">
                        <div className="flex items-center gap-1 mb-1">
                          <label className="font-bold text-gray-800 text-xs">
                            Bisa Untuk (Porsi)
                          </label>

                          <div className="relative group">
                            <CircleHelp
                              size={14}
                              className="text-gray-400 cursor-help"
                            />

                            <div className="absolute left-5 top-1/2 -translate-y-1/2 z-50 hidden group-hover:block w-64 bg-gray-900 text-white text-[11px] rounded-lg px-3 py-2 shadow-lg">
                              Contoh: 1 pack mie seharga Rp120.000 dapat
                              digunakan untuk 40 porsi.
                            </div>
                          </div>
                        </div>
                        <input
                          type="number"
                          min="1"
                          value={bahan.jumlah}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "" || parseFloat(val) >= 0) {
                              const newList = [...bahanList];
                              newList[index].jumlah = val;
                              setBahanList(newList);
                            }
                          }}
                          placeholder="1"
                          className="w-full bg-[#f5f5f5] rounded-xl px-4 py-2 focus:outline-none text-sm"
                        />
                      </div>
                      <div className="flex-[2]">
                        <label className="block font-bold text-gray-800 mb-1 text-xs">
                          Harga Beli (Rp)
                        </label>
                        <input
                          type="text"
                          value={formatRupiah(bahan.harga)}
                          onChange={(e) => {
                            const raw = parseRupiah(e.target.value);
                            const newList = [...bahanList];
                            newList[index].harga = raw;
                            setBahanList(newList);
                          }}
                          placeholder="0"
                          className="w-full bg-[#f5f5f5] rounded-xl px-4 py-2 focus:outline-none text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={handleAddBahan}
                  className="w-full border-2 border-dashed border-gray-400 text-gray-800 font-bold py-4 rounded-2xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm">
                  <Plus size={18} /> Klik Untuk Menambahkan Bahan Tambahan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL RINCIAN HPP --- */}
      {showRincian && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] h-full flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center px-6 pt-6 pb-0 shrink-0">
              <h2 className="text-xl font-bold">Rincian Perhitungan HPP</h2>
              <button onClick={() => setShowRincian(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 min-h-0 px-6 pb-6">
              <div className="pt-6 space-y-5">
                {/* BAHAN BAKU */}
                <div>
                  <h3 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-2">Bahan Baku</h3>
                  <div className="space-y-2">
                    {bahanList
                      .filter(b => b.nama.trim() !== "")
                      .map((b, i) => {
                        const harga = parseFloat(b.harga) || 0;
                        const jumlah = parseFloat(b.jumlah) || 1;
                        const perPorsi = harga / jumlah;
                        return (
                          <div key={i} className="bg-gray-50 rounded-xl px-4 py-3">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-sm">{b.nama}</span>
                              <span className="font-bold text-sm">{formatRupiah(perPorsi)}</span>
                            </div>
                            <div className="text-[11px] text-gray-400 mt-0.5">
                              {formatRupiah(harga)} &divide; {jumlah} porsi = {formatRupiah(perPorsi)} / porsi
                            </div>
                          </div>
                        );
                      })}
                    <div className="flex justify-between px-4 py-2 border-t border-gray-200">
                      <span className="font-bold text-sm">Total Biaya Bahan / Porsi</span>
                      <span className="font-bold text-sm">
                        {formatRupiah(bahanList
                          .filter(b => b.nama.trim() !== "")
                          .reduce((acc, b) => acc + (parseFloat(b.harga) || 0) / (parseFloat(b.jumlah) || 1), 0)
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* BEBAN OPERASIONAL */}
                {(Number(bebanSewa) || Number(bebanGaji) || Number(bebanLain)) > 0 && (
                  <div>
                    <h3 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-2">Beban Operasional</h3>
                    <div className="space-y-2">
                      {[
                        { label: "Sewa", total: Number(bebanSewa) || 0 },
                        { label: "Gaji", total: Number(bebanGaji) || 0 },
                        { label: "Lain-lain", total: Number(bebanLain) || 0 },
                      ].filter(b => b.total > 0).map((b, i) => {
                        const target = Number(targetPenjualan) || 1;
                        return (
                          <div key={i} className="bg-gray-50 rounded-xl px-4 py-3">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-sm">{b.label}</span>
                              <span className="font-bold text-sm">{formatRupiah(b.total / target)}</span>
                            </div>
                            <div className="text-[11px] text-gray-400 mt-0.5">
                              {formatRupiah(b.total)} &divide; {target} porsi = {formatRupiah(b.total / target)} / porsi
                            </div>
                          </div>
                        );
                      })}
                      <div className="flex justify-between px-4 py-2 border-t border-gray-200">
                        <span className="font-bold text-sm">Total Operasional / Porsi</span>
                        <span className="font-bold text-sm">
                          {formatRupiah(calculationPreview.totalOpex)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TARGET */}
                <div className="flex justify-between items-center bg-gray-50 rounded-xl px-4 py-3">
                  <span className="font-bold text-sm">Target Penjualan</span>
                  <span className="font-bold text-sm">{calculationPreview.target} porsi</span>
                </div>

                {/* TOTAL HPP */}
                <div className="bg-red-50 rounded-2xl p-5 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Biaya Bahan / Porsi</span>
                    <span className="font-semibold">
                      {formatRupiah(calculationPreview.hppPerPorsi - calculationPreview.totalOpex)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Operasional / Porsi</span>
                    <span className="font-semibold">{formatRupiah(calculationPreview.totalOpex)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-extrabold border-t border-red-200 pt-2">
                    <span>HPP per Porsi</span>
                    <span className="text-[#f85656]">{formatRupiah(calculationPreview.hppPerPorsi)}</span>
                  </div>
                </div>
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
