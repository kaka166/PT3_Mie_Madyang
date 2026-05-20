"use client";

import { useState, useEffect } from "react";
import { Save, Image as ImageIcon } from "lucide-react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "@/config";

export default function LandingPageSettings() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    hero_title: "",
    hero_subtitle: "",
    hero_cta: "",
  });
  
  const [heroImage, setHeroImage] = useState<File | null>(null);
  const [mascotImage, setMascotImage] = useState<File | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/landing-page`);
      const result = await res.json();
      if (result.success && result.data) {
        setData({
          hero_title: result.data.hero_title || "",
          hero_subtitle: result.data.hero_subtitle || "",
          hero_cta: result.data.hero_cta || "",
        });
      }
    } catch (error) {
      console.error("Gagal load setting", error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("hero_title", data.hero_title);
      formData.append("hero_subtitle", data.hero_subtitle);
      formData.append("hero_cta", data.hero_cta);
      
      if (heroImage) formData.append("hero_image", heroImage);
      if (mascotImage) formData.append("mascot_image", mascotImage);

      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/landing-page`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Pengaturan Landing Page telah diperbarui.",
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
        <h1 className="text-3xl font-black text-gray-800 mb-2">Landing Page Settings</h1>
        <p className="text-gray-500 mb-8 font-medium">Ubah tampilan halaman utama website Anda.</p>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Teks Utama (Hero)</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">
                  Judul Utama
                </label>
                <input
                  type="text"
                  value={data.hero_title}
                  onChange={(e) => setData({ ...data, hero_title: e.target.value })}
                  placeholder="Contoh: Cita Rasa Legendaris"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#c93535] focus:ring-2 focus:ring-red-100 outline-none transition-all font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">
                  Sub-Judul (Deskripsi Singkat)
                </label>
                <textarea
                  value={data.hero_subtitle}
                  onChange={(e) => setData({ ...data, hero_subtitle: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#c93535] focus:ring-2 focus:ring-red-100 outline-none transition-all font-medium"
                  placeholder="Deskripsi..."
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">
                  Teks Tombol Aksi (CTA)
                </label>
                <input
                  type="text"
                  value={data.hero_cta}
                  onChange={(e) => setData({ ...data, hero_cta: e.target.value })}
                  placeholder="Contoh: Pesan Sekarang"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#c93535] focus:ring-2 focus:ring-red-100 outline-none transition-all font-medium"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Gambar (Assets)</h2>
            
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center justify-between">
                  <span>Banner Utama (Hero)</span>
                  <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-md">Rekomendasi: 1920x1080px (16:9)</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setHeroImage(e.target.files?.[0] || null)}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-red-50 file:text-[#c93535] hover:file:bg-red-100"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center justify-between">
                  <span>Gambar Mascot</span>
                  <span className="text-[10px] bg-green-50 text-green-600 px-2 py-1 rounded-md">Rekomendasi: 800x800px (1:1), Transparan (PNG)</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={(e) => setMascotImage(e.target.files?.[0] || null)}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-red-50 file:text-[#c93535] hover:file:bg-red-100"
                  />
                </div>
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
              {loading ? "Menyimpan..." : "Simpan Pengaturan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
