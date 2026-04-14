/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getBahan, createStockMovement } from "@/services/stockService";

const unitOptions = ["Kg", "L","ml", "Pack", "Ikat"];

interface RestockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function RestockModal({
  isOpen,
  onClose,
  onSuccess,
}: RestockModalProps) {
  const [isBahanBaru, setIsBahanBaru] = useState(true);

  const [bahanMaster, setBahanMaster] = useState<any[]>([]);
  const [selectedBahan, setSelectedBahan] = useState<any>(null);

  const [jumlah, setJumlah] = useState("");
  const [satuan, setSatuan] = useState("Kg");
  const [harga, setHarga] = useState("");

  const [search, setSearch] = useState("");
  const filteredBahan = bahanMaster.filter((b) =>
    b.nama.toLowerCase().includes(search.toLowerCase()),
  );

  const [keranjang, setKeranjang] = useState<any[]>([]);

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
      return alert("Isi bahan dulu");
    }
    if (!jumlah || Number(jumlah) <= 0) {
      return alert("Jumlah harus lebih dari 0");
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
          id: selectedBahan?.id || null,
          nama: selectedBahan.nama,
          jumlah,
          satuan,
          harga,
        },
      ]);
    }

    setJumlah("");
    setHarga("");
    setSearch("");
    setSelectedBahan(null);
  };

  // ================= SIMPAN RESTOCK =================
  const handleSubmit = async () => {
    if (keranjang.length === 0) {
      return alert("Keranjang kosong");
    }
    await Promise.all(
      keranjang.map((item) =>
        createStockMovement({
          bahan_id: item.id || null,
          nama: item.nama,
          jumlah: Number(item.jumlah),
          satuan: item.satuan,
          tipe: "plus",
          kategori: "restock",
          alasan: "Restock",
        }),
      ),
    );

    onSuccess?.();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-4xl flex-col md:flex-row overflow-hidden rounded-2xl bg-white shadow-2xl max-h-[90vh]">
        {/* ================= LEFT ================= */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Laporan Restock
          </h2>

          {/* TOGGLE */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3">
              Penambahan Bahan Baru?
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setIsBahanBaru(true)}
                className={`px-6 py-2 rounded-lg ${
                  isBahanBaru ? "bg-red-500 text-white" : "bg-gray-200"
                }`}>
                Ya
              </button>
              <button
                onClick={() => setIsBahanBaru(false)}
                className={`px-6 py-2 rounded-lg ${
                  !isBahanBaru ? "bg-red-500 text-white" : "bg-gray-200"
                }`}>
                Tidak
              </button>
            </div>
          </div>

          {/* SELECT */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Nama Barang
            </label>

            {isBahanBaru ? (
              // ==========================
              // INPUT BAHAN BARU
              // ==========================
              <input
                type="text"
                placeholder="Masukkan nama barang"
                className="w-full bg-gray-100 rounded-lg p-3 text-sm"
                onChange={(e) =>
                  setSelectedBahan({
                    id: null,
                    nama: e.target.value,
                  })
                }
              />
            ) : (
              // ==========================
              // SEARCH + DROPDOWN
              // ==========================
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari bahan..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-gray-100 rounded-lg p-3 text-sm"
                />

                {search && (
                  <div className="absolute z-10 w-full bg-white border rounded-lg mt-1 max-h-40 overflow-y-auto shadow">
                    {filteredBahan.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => {
                          setSelectedBahan(b);
                          setSearch(b.nama);
                          setSatuan(b.satuan || "Kg");
                        }}
                        className="p-2 hover:bg-gray-100 cursor-pointer text-sm">
                        {b.nama}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* JUMLAH */}
          <div className="flex gap-4 mb-6">
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
                Jumlah Ditambahkan
              </label>
              <div className="flex border rounded-lg bg-gray-100">
                <input
                  type="number"
                  value={jumlah}
                  onChange={(e) => setJumlah(e.target.value)}
                  className="w-full p-2"
                />
                <select
                  value={satuan}
                  onChange={(e) => setSatuan(e.target.value)}
                  disabled={!isBahanBaru}
                  className={`bg-gray-200 px-2 ${
                    !isBahanBaru ? "opacity-50 cursor-not-allowed" : ""
                  }`}>
                  {unitOptions.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* HARGA */}
          <div className="mb-6 w-1/2 pr-2">
            <label className="text-sm font-semibold mb-2">
              Harga per satuan
            </label>
            <input
              type="number"
              value={harga}
              onChange={(e) => setHarga(e.target.value)}
              className="w-full bg-gray-100 p-3 rounded-lg"
            />
          </div>

          <button
            onClick={handleTambah}
            className="mt-auto w-full bg-red-500 text-white py-3 rounded-xl">
            Tambahkan ke keranjang
          </button>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="flex-1 bg-gray-100 p-6 relative flex flex-col border-l">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-red-200 p-1 rounded-md">
            <X size={20} />
          </button>

          <h3 className="font-bold text-xl mb-6 mt-2">Keranjang</h3>

          <div className="flex-1 overflow-y-auto space-y-3">
            {keranjang.map((item, i) => (
              <div
                key={`${item.nama}-${i}`}
                className="bg-white p-4 rounded-xl">
                <div className="flex justify-between">
                  <span className="font-bold">{item.nama}</span>
                  <span className="text-red-600 font-bold">
                    {item.jumlah} {item.satuan}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Rp {item.harga}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className="mt-auto w-full bg-red-500 text-white py-3 rounded-xl">
            Simpan Data Restock
          </button>
        </div>
      </div>
    </div>
  );
}
