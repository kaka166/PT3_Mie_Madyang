"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getBahan } from "@/services/stockService";

const unitOptions = ["Kg", "G", "L", "Ml", "Pack", "Ikat"];

interface ProduksiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProduksiModal({ isOpen, onClose }: ProduksiModalProps) {
  const [bahanMaster, setBahanMaster] = useState<any[]>([]);
  const [selectedHasil, setSelectedHasil] = useState<any>(null);
  const [jumlahHasil, setJumlahHasil] = useState("");

  const [isProduksiBahanBaru, setIsProduksiBahanBaru] = useState(true);
  const [bahanList, setBahanList] = useState([
    { id: "", jumlah: "", satuan: "Kg" },
  ]);

  // ================= FETCH BAHAN =================
  useEffect(() => {
    if (isOpen) {
      getBahan().then(setBahanMaster);
    }
  }, [isOpen]);

  // ================= TAMBAH BAHAN =================
  const tambahBahan = () => {
    setBahanList([...bahanList, { id: "", jumlah: "", satuan: "Kg" }]);
  };

  // ================= HANDLE PRODUKSI =================
  const handleProduksi = async () => {
    if (!selectedHasil) return alert("Pilih hasil produksi dulu");

    await fetch("http://127.0.0.1:8000/api/produksi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hasil_id: selectedHasil.id,
        jumlah_hasil: Number(jumlahHasil),
        satuan: "Kg",
        bahan: bahanList.map((b) => ({
          id: Number(b.id),
          jumlah: Number(b.jumlah),
          satuan: b.satuan,
        })),
      }),
    });

    onClose(); // tutup modal
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-5xl flex-col md:flex-row overflow-hidden rounded-2xl bg-white shadow-2xl max-h-[90vh]">
        {/* ================= LEFT ================= */}
        <div className="w-full md:w-[45%] p-8 flex flex-col overflow-y-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 leading-tight">
            Laporan Produksi <br /> Bahan Setengah jadi
          </h2>

          {/* NAMA BARANG */}
          <div className="mb-6">
            <label className="block text-base font-semibold mb-2">
              Nama Barang
            </label>
            <select
              className="w-full bg-gray-100 border-none rounded-xl p-4 text-sm"
              onChange={(e) => {
                const id = Number(e.target.value);
                const bahan = bahanMaster.find((b) => b.id === id);
                setSelectedHasil(bahan);
              }}>
              <option value="">Masukan nama barang</option>
              {bahanMaster.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nama}
                </option>
              ))}
            </select>
          </div>

          {/* JUMLAH */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2">
                Jumlah Sekarang
              </label>
              <div className="text-lg font-bold">
                {selectedHasil?.qty ?? 0} {selectedHasil?.satuan ?? ""}
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2">Jumlah</label>
              <div className="flex border rounded-lg overflow-hidden bg-gray-100">
                <input
                  type="number"
                  value={jumlahHasil}
                  onChange={(e) => setJumlahHasil(e.target.value)}
                  placeholder="Jumlah"
                  className="w-full bg-transparent p-2 text-sm outline-none"
                />
                <select className="bg-gray-200 border-l px-2 text-sm font-medium">
                  {unitOptions.map((u) => (
                    <option key={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* TOGGLE */}
          <div className="mb-6">
            <label className="block text-base font-semibold mb-3">
              Penambahan Bahan Baru?
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setIsProduksiBahanBaru(true)}
                className={`px-8 py-2.5 rounded-lg text-sm ${
                  isProduksiBahanBaru ? "bg-red-500 text-white" : "bg-gray-200"
                }`}>
                Ya
              </button>
              <button
                onClick={() => setIsProduksiBahanBaru(false)}
                className={`px-8 py-2.5 rounded-lg text-sm ${
                  !isProduksiBahanBaru ? "bg-red-500 text-white" : "bg-gray-200"
                }`}>
                Tidak
              </button>
            </div>
          </div>

          <button className="mt-auto w-full bg-red-500 text-white py-4 rounded-xl text-lg">
            Tambahkan
          </button>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="w-full md:w-[55%] bg-[#f4f4f4] p-8 relative flex flex-col">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-red-300 p-2 rounded-lg">
            <X size={20} />
          </button>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-2">
            Masukan Bahan Baku
          </h2>

          <div className="flex-1 overflow-y-auto space-y-4">
            {bahanList.map((b, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl">
                <h3 className="font-bold text-lg mb-4">Bahan {index + 1}</h3>

                {/* SELECT BAHAN */}
                <select
                  className="w-full bg-gray-100 p-3 rounded-xl mb-3"
                  onChange={(e) => {
                    const updated = [...bahanList];
                    updated[index].id = e.target.value;
                    setBahanList(updated);
                  }}>
                  <option>Masukan nama Bahan</option>
                  {bahanMaster.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.nama}
                    </option>
                  ))}
                </select>

                {/* JUMLAH */}
                <div className="flex border rounded-lg overflow-hidden bg-gray-100">
                  <input
                    type="number"
                    onChange={(e) => {
                      const updated = [...bahanList];
                      updated[index].jumlah = e.target.value;
                      setBahanList(updated);
                    }}
                    className="w-full p-2"
                  />
                  <select
                    onChange={(e) => {
                      const updated = [...bahanList];
                      updated[index].satuan = e.target.value;
                      setBahanList(updated);
                    }}
                    className="bg-gray-200 px-2">
                    {unitOptions.map((u) => (
                      <option key={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}

            <button
              onClick={tambahBahan}
              className="w-full border-dashed border-2 py-6">
              Tambah Bahan
            </button>
          </div>

          <div className="mt-4">
            <button
              onClick={handleProduksi}
              className="w-full bg-red-500 text-white py-4 rounded-xl text-lg">
              Simpan Data Produksi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
