"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  getBahan,
  getStockHistory,
  createStockMovement,
} from "@/services/stockService";

const alasanOptions = [
  "Rusak",
  "Hilang",
  "Kadaluwarsa",
  "Salah Hitung",
  "Sisa",
  "Penjualan",
];

const unitOptions = ["Kg", "G", "L", "Ml", "Pack", "Ikat"];

interface penyesuaianProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function penyesuaian({
  isOpen,
  onClose,
  onSuccess,
}: penyesuaianProps) {
  const [bahanList, setBahanList] = useState<any[]>([]);
  const [selectedBahan, setSelectedBahan] = useState<any>(null);

  const [jumlah, setJumlah] = useState("");
  const [satuan, setSatuan] = useState("Kg");
  const [alasan, setAlasan] = useState("");
  const [tipe, setTipe] = useState<"plus" | "minus">("minus");

  const [riwayat, setRiwayat] = useState<any[]>([]);

  // ================= FETCH BAHAN =================
  useEffect(() => {
    if (isOpen) {
      getBahan().then(setBahanList);
    }
  }, [isOpen]);

  // ================= FETCH RIWAYAT =================
  const fetchRiwayat = async (id: number) => {
    const data = await getStockHistory(id);
    setRiwayat(data);
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (!selectedBahan) return alert("Pilih barang dulu");

    await createStockMovement({
      bahan_id: selectedBahan.id,
      jumlah: Number(jumlah),
      satuan,
      tipe,
      kategori: "penyesuaian",
      alasan,
    });

    await fetchRiwayat(selectedBahan.id);

    onSuccess?.();
    onClose();
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-4xl flex-col md:flex-row overflow-hidden rounded-2xl bg-white shadow-2xl max-h-[90vh]">
        {/* ================= LEFT ================= */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Penyesuaian Stock
          </h2>

          {/* NAMA BARANG */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Nama Barang
            </label>
            <select
              className="w-full bg-gray-100 border-none rounded-lg p-3 text-sm"
              onChange={(e) => {
                const id = Number(e.target.value);
                const bahan = bahanList.find((b) => b.id === id);

                setSelectedBahan(bahan);
                setSatuan(bahan?.satuan || "Kg");
                fetchRiwayat(id);
              }}>
              <option value="">Pilih barang</option>
              {bahanList.map((b) => (
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
                {selectedBahan?.qty ?? 0} {selectedBahan?.satuan ?? ""}
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2">
                Jumlah Dikurangi
              </label>
              <div className="flex border rounded-lg overflow-hidden bg-gray-100">
                <input
                  type="number"
                  value={jumlah}
                  onChange={(e) => setJumlah(e.target.value)}
                  className="w-full bg-transparent p-2 text-sm outline-none"
                />
                <select
                  value={satuan}
                  onChange={(e) => setSatuan(e.target.value)}
                  className="bg-gray-200 border-l px-2 text-sm font-medium">
                  {unitOptions.map((u) => (
                    <option key={u}>{u}</option>
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
                    alasan === a ? "bg-red-500 text-white" : "bg-gray-100"
                  }`}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="mt-auto w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl">
            Simpan
          </button>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="flex-1 bg-gray-100 p-6 relative flex flex-col">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-red-200 text-gray-700 hover:bg-red-300 p-1 rounded-md">
            <X size={20} />
          </button>

          {/* INFO */}
          <div className="bg-white p-4 rounded-xl shadow-sm mb-6 mt-6 md:mt-0">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="font-bold text-gray-800">
                {selectedBahan?.nama || "-"}
              </h3>
              <span className="text-xs text-gray-400">
                #{selectedBahan?.id || "-"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-y-4 text-sm mb-4">
              <div>
                <div className="text-gray-400 text-xs mb-1">
                  Alasan perubahan
                </div>
                <div className="font-medium text-gray-700">{alasan || "-"}</div>
              </div>

              <div>
                <div className="text-gray-400 text-xs mb-1">
                  Perubahan Stok Terakhir
                </div>
                <div className="font-medium text-gray-700">
                  {riwayat[0] ? formatDate(riwayat[0].created_at) : "-"}
                </div>
              </div>

              <div>
                <div className="text-gray-400 text-xs mb-1">
                  Jumlah Sekarang
                </div>
                <div className="font-medium text-gray-700">
                  {selectedBahan?.qty ?? 0} {selectedBahan?.satuan ?? ""}
                </div>
              </div>
            </div>
          </div>

          {/* RIWAYAT */}
          <h3 className="font-bold text-lg mb-4">Riwayat Perubahan Stock</h3>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 pb-4">
            {riwayat.map((item, index) => (
              <div key={index} className="bg-white p-3 rounded-xl shadow-sm">
                <div className="flex justify-between">
                  <span className="font-bold">{selectedBahan?.nama}</span>
                  <span
                    className={
                      item.tipe === "plus" ? "text-green-500" : "text-red-500"
                    }>
                    {item.tipe === "plus" ? "+" : "-"} {item.jumlah}{" "}
                    {item.satuan}
                  </span>
                </div>

                <div className="flex justify-between text-xs mt-1">
                  <span className="text-gray-400">User</span>
                  <span className="text-red-500">{item.alasan}</span>
                  <span className="text-gray-500">
                    {formatDate(item.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
