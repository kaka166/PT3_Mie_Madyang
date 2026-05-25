/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  getBahan,
  createStockMovement,
} from "@/services/stockService";
import { addNotification } from "@/services/notificationService";

const alasanOptions = [
  "Rusak",
  "Hilang",
  "Kadaluwarsa",
  "Salah Hitung",
  "Sisa",
  "Penjualan",
];

const unitOptions = ["Kg", "G", "L", "Ml", "Pack", "Ikat"];

interface PenyesuaianProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function Penyesuaian({
  isOpen,
  onClose,
  onSuccess,
}: PenyesuaianProps) {
  const [bahanMaster, setBahanMaster] = useState<any[]>([]);
  const [selectedBahan, setSelectedBahan] = useState<any>(null);

  const [jumlah, setJumlah] = useState("");
  const [satuan, setSatuan] = useState("Kg");
  const [alasan, setAlasan] = useState("");

  const [search, setSearch] = useState("");
  const filteredBahan = bahanMaster.filter((b) =>
    b.nama.toLowerCase().includes(search.toLowerCase()),
  );

  const [keranjang, setKeranjang] = useState<any[]>([]);
  const [error, setError] = useState("");

  // ================= FETCH BAHAN =================
  useEffect(() => {
    if (!isOpen) return;

    const load = async () => {
      try {
        const data = await getBahan();
        setBahanMaster(data);
      } catch (err) {
        console.error("ERROR GET BAHAN:", err);
      }
    };

    load();
  }, [isOpen]);

  // ================= TAMBAH KE KERANJANG =================
  const handleTambah = () => {
    if (!selectedBahan || !selectedBahan.nama) {
      return alert("Pilih bahan dulu");
    }
    if (!jumlah || Number(jumlah) <= 0) {
      return alert("Jumlah harus lebih dari 0");
    }
    if (!alasan) {
      return alert("Pilih alasan perubahan");
    }
    if (Number(jumlah) > (selectedBahan?.qty ?? 0)) {
      return alert(`Stok ${selectedBahan.nama} tidak mencukupi. Sisa stok: ${selectedBahan.qty} ${satuan}`);
    }

    const existingIndex = keranjang.findIndex(
      (k) => k.nama === selectedBahan.nama,
    );

    if (existingIndex !== -1) {
      const updated = [...keranjang];
      updated[existingIndex].jumlah = String(
        Number(updated[existingIndex].jumlah) + Number(jumlah),
      );
      setKeranjang(updated);
    } else {
      setKeranjang([
        ...keranjang,
        {
          id: selectedBahan.id,
          nama: selectedBahan.nama,
          jumlah,
          satuan,
          alasan,
        },
      ]);
    }

    setJumlah("");
    setAlasan("");
    setSearch("");
    setSelectedBahan(null);
  };

  const handleRemoveItem = (index: number) => {
    const updated = keranjang.filter((_, i) => i !== index);
    setKeranjang(updated);
  };

  // ================= SIMPAN PENYESUAIAN =================
  const handleSubmit = async () => {
    setError("");

    if (keranjang.length === 0) {
      setError("Keranjang kosong");
      return;
    }

    try {
      await Promise.all(
        keranjang.map((item) =>
          createStockMovement({
            bahan_id: item.id,
            jumlah: Number(item.jumlah),
            satuan: item.satuan,
            tipe: "minus",
            kategori: "penyesuaian",
            alasan: item.alasan,
          }),
        ),
      );
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Gagal menyimpan penyesuaian";
      setError(msg);
      return;
    }

    onSuccess?.();

    addNotification("Penyesuaian Dicatat", `${keranjang.length} bahan disesuaikan`, "success", true, "kitchen");

    setKeranjang([]);
    setJumlah("");
    setAlasan("");
    setSearch("");
    setSelectedBahan(null);

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-4xl flex-col md:flex-row overflow-hidden rounded-2xl bg-white shadow-2xl max-h-[90vh] relative">
        {/* CLOSE BUTTON — always visible */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-red-200 hover:bg-red-300 p-2 rounded-md">
          <X size={20} />
        </button>

        {/* ================= LEFT ================= */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col max-h-[50vh] md:max-h-none">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Penyesuaian Stock
          </h2>

          {/* SEARCH + DROPDOWN */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Nama Barang
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Cari bahan..."
                value={selectedBahan ? selectedBahan.nama : search}
                onChange={(e) => {
                  setSelectedBahan(null);
                  setSearch(e.target.value);
                }}
                className="w-full bg-gray-100 rounded-lg p-3 text-sm"
              />

              {search && !selectedBahan && (
                <div className="absolute z-10 w-full bg-white border rounded-lg mt-1 max-h-40 overflow-y-auto shadow">
                  {filteredBahan.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => {
                        setSelectedBahan(b);
                        setSatuan(b.satuan || "Kg");
                        setSearch("");
                      }}
                      className="p-2 hover:bg-gray-100 cursor-pointer text-sm">
                      {b.nama}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* JUMLAH */}
          <div className="flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="text-sm font-semibold mb-2">
                Jumlah Sekarang
              </label>
              <div className="text-lg font-bold">
                {selectedBahan?.qty ?? 0} {selectedBahan?.satuan ?? ""}
              </div>
            </div>

            <div className="flex-1">
              <label className="text-sm font-semibold mb-2">
                Jumlah Dikurangi
              </label>
              <div className="flex border rounded-lg bg-gray-100">
                <input
                  type="number"
                  value={jumlah}
                  onChange={(e) => { setError(""); setJumlah(e.target.value); }}
                  className="w-full p-2"
                />
                <select
                  value={satuan}
                  onChange={(e) => setSatuan(e.target.value)}
                  className="bg-gray-200 px-2">
                  {unitOptions.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ALASAN */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3">
              Alasan Perubahan Stock
            </label>
            <div className="flex flex-wrap gap-3">
              {alasanOptions.map((a) => (
                <button
                  key={a}
                  onClick={() => setAlasan(a)}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    alasan === a ? "bg-emerald-500 text-white" : "bg-gray-100"
                  }`}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleTambah}
            className="mt-auto w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95">
            + Tambahkan ke Keranjang
          </button>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="flex-1 bg-gray-100 p-4 sm:p-6 relative flex flex-col border-t md:border-t-0 md:border-l max-h-[40vh] md:max-h-none">
          <h3 className="font-bold text-xl mb-4 mt-1 md:mt-2">Keranjang</h3>
          <div className="flex-1 overflow-y-auto space-y-3">
            {keranjang.map((item, i) => (
              <div
                key={`${item.nama}-${i}`}
                className="bg-white p-4 rounded-xl relative">
                <button
                  onClick={() => handleRemoveItem(i)}
                  className="absolute top-0 right-0 p-2.5 text-gray-400 hover:text-red-500">
                  <X size={16} />
                </button>

                <div className="flex justify-between">
                  <span className="font-bold">{item.nama}</span>
                  <span className="font-bold text-red-600">
                    - {item.jumlah} {item.satuan}
                  </span>
                </div>

                <div className="text-xs text-gray-400 mt-1">
                  {item.alasan}
                </div>
              </div>
            ))}
          </div>
          {error && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium">
              {error}
            </div>
          )}
          <button
            onClick={handleSubmit}
            className="mt-auto w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95">
            Simpan Penyesuaian
          </button>
        </div>
      </div>
    </div>
  );
}
