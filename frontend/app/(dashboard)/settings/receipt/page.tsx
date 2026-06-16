"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "@/config";

export default function ReceiptSettings() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    store_name: "",
    store_motto: "",
    store_address: "",
    store_phone: "",
    footer_msg1: "",
    footer_msg2: "",
    print_server_url: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/receipt-settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (result.success && result.data) {
        setData({
          store_name: result.data.store_name || "",
          store_motto: result.data.store_motto || "",
          store_address: result.data.store_address || "",
          store_phone: result.data.store_phone || "",
          footer_msg1: result.data.footer_msg1 || "",
          footer_msg2: result.data.footer_msg2 || "",
          print_server_url: result.data.print_server_url || "",
        });
      }
    } catch (error) {
      console.error("Gagal load setting nota", error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/receipt-settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Pengaturan Nota telah diperbarui.",
        });
      } else {
        throw new Error(result.message || "Gagal menyimpan");
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: error.message || "Terjadi kesalahan server.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 h-full overflow-y-auto no-scrollbar">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-gray-800 mb-2">Receipt Settings</h1>
        <p className="text-gray-500 mb-8 font-medium">Ubah teks yang akan tercetak pada header dan footer nota kasir.</p>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-4">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Header Nota</h2>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Nama Toko</label>
                <input
                  type="text"
                  value={data.store_name}
                  onChange={(e) => setData({ ...data, store_name: e.target.value })}
                  placeholder={data.store_name || "MIE MA-DYANG"}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#b93b3b] focus:ring-2 outline-none font-medium text-center"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Moto / Tagline</label>
                <input
                  type="text"
                  value={data.store_motto}
                  onChange={(e) => setData({ ...data, store_motto: e.target.value })}
                  placeholder={data.store_motto || "The Culinary Curator"}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#b93b3b] focus:ring-2 outline-none font-medium text-center"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Alamat Toko</label>
                <input
                  type="text"
                  value={data.store_address}
                  onChange={(e) => setData({ ...data, store_address: e.target.value })}
                  placeholder={data.store_address || "Jl. Raya Madyang No. 16, Malang"}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#b93b3b] focus:ring-2 outline-none font-medium text-center"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">No Telepon</label>
                <input
                  type="text"
                  value={data.store_phone}
                  onChange={(e) => setData({ ...data, store_phone: e.target.value })}
                  placeholder={data.store_phone || "0812-3456-7890"}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#b93b3b] focus:ring-2 outline-none font-medium text-center"
                />
              </div>

              <h2 className="text-xl font-bold mb-4 mt-8 text-gray-800">Koneksi Print Server (Printer Lokal)</h2>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">URL Print Server</label>
                <input
                  type="text"
                  value={data.print_server_url}
                  onChange={(e) => setData({ ...data, print_server_url: e.target.value })}
                  placeholder="http://192.168.1.10:5000/print"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#b93b3b] focus:ring-2 outline-none font-medium text-center text-blue-600 bg-blue-50"
                />
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  Isi dengan IP komputer yang menjalankan <b>print_server.py</b> (contoh: <code>http://192.168.1.10:5000/print</code>) agar kasir bisa mencetak langsung dari HP. Biarkan default <code>http://localhost:5000/print</code> jika kasir menggunakan PC yang sama.
                  <br/><br/>
                  <b>KHUSUS ANDROID:</b> Isi dengan <code>bluetooth</code> jika Anda ingin mencetak langsung menggunakan Bluetooth HP (Web Bluetooth API) tanpa print server.
                </p>
              </div>

              <h2 className="text-xl font-bold mb-4 mt-8 text-gray-800">Footer Nota</h2>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Pesan 1</label>
                <input
                  type="text"
                  value={data.footer_msg1}
                  onChange={(e) => setData({ ...data, footer_msg1: e.target.value })}
                  placeholder={data.footer_msg1 || "Terima kasih!"}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#b93b3b] focus:ring-2 outline-none font-medium text-center"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Pesan 2</label>
                <input
                  type="text"
                  value={data.footer_msg2}
                  onChange={(e) => setData({ ...data, footer_msg2: e.target.value })}
                  placeholder={data.footer_msg2 || "Selamat menikmati :)"}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#b93b3b] focus:ring-2 outline-none font-medium text-center"
                />
              </div>
            </div>

            {/* Simulasi Tampilan Nota */}
            <div className="w-full md:w-80 flex-shrink-0">
              <div className="bg-gray-50 p-6 rounded-xl border-2 border-dashed border-gray-300 font-mono text-xs leading-relaxed text-center shadow-inner">
                <p className="font-bold text-sm mb-1">{data.store_name || "MIE MA-DYANG"}</p>
                <p>{data.store_motto || "The Culinary Curator"}</p>
                <p>{data.store_address || "Jl. Raya Madyang No. 16, Malang"}</p>
                <p>{data.store_phone || "0812-3456-7890"}</p>
                <p className="my-2">--------------------------------</p>
                <p className="text-left">No   : #20260523001<br/>Kasir: Admin</p>
                <p className="my-2">--------------------------------</p>
                <div className="text-left mb-2">
                  <p>Mie Ayam Spesial</p>
                  <div className="flex justify-between"><span>  1 x 25.000</span><span>25.000</span></div>
                </div>
                <p className="my-2">--------------------------------</p>
                <div className="text-right">
                  <p>TOTAL   : 25.000</p>
                </div>
                <p className="my-2 text-center">--------------------------------</p>
                <p>{data.footer_msg1 || "Terima kasih!"}</p>
                <p>{data.footer_msg2 || "Selamat menikmati :)"}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-[#b93b3b] text-white rounded-2xl font-black shadow-lg shadow-red-200 hover:bg-[#a12f2f] active:scale-95 transition-all flex items-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save size={20} />
              )}
              {loading ? "Menyimpan..." : "Simpan Pengaturan Nota"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
