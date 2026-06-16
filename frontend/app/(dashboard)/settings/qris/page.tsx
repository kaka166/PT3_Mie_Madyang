"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, X, QrCode, Trash2 } from "lucide-react";
import { getQrisSettings, createQrisSetting, updateQrisSetting, deleteQrisSetting, QrisSetting } from "@/services/qrisService";
import { addNotification } from "@/services/notificationService";
import { STORAGE_BASE_URL } from "@/config";

export default function QrisSettingsPage() {
  const [settings, setSettings] = useState<QrisSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [form, setForm] = useState({
    nama_bank: "",
    nama_pemilik: "",
    no_rekening: "",
    is_active: true,
  });
  const [gambar, setGambar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getQrisSettings();
      if (res.success) setSettings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => {
    setEditId(null);
    setForm({ nama_bank: "", nama_pemilik: "", no_rekening: "", is_active: true });
    setGambar(null);
    setPreview(null);
    setShowModal(true);
  };

  const openEdit = (item: QrisSetting) => {
    setEditId(item.id);
    setForm({
      nama_bank: item.nama_bank || "",
      nama_pemilik: item.nama_pemilik || "",
      no_rekening: item.no_rekening || "",
      is_active: item.is_active,
    });
    setGambar(null);
    setPreview(item.gambar_qris ? `${STORAGE_BASE_URL}/qris/${item.gambar_qris}` : null);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    const fd = new FormData();
    fd.append("nama_bank", form.nama_bank);
    fd.append("nama_pemilik", form.nama_pemilik);
    fd.append("no_rekening", form.no_rekening);
    fd.append("is_active", form.is_active ? "1" : "0");
    if (gambar) fd.append("gambar", gambar);

    try {
      if (editId) {
        await updateQrisSetting(editId, fd);
        addNotification("QRIS Diperbarui", `${form.nama_bank} - ${form.nama_pemilik}`, "success", true, "admin");
      } else {
        await createQrisSetting(fd);
        addNotification("QRIS Ditambahkan", `${form.nama_bank} - ${form.nama_pemilik}`, "success", true, "admin");
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus setting QRIS ini?")) return;
    try {
      await deleteQrisSetting(id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleActive = async (item: QrisSetting) => {
    const fd = new FormData();
    fd.append("is_active", item.is_active ? "0" : "1");
    fd.append("nama_bank", item.nama_bank || "");
    fd.append("nama_pemilik", item.nama_pemilik || "");
    fd.append("no_rekening", item.no_rekening || "");
    try {
      await updateQrisSetting(item.id, fd);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] p-4 md:p-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F53E1B] tracking-tight">Pengaturan QRIS</h1>
          <p className="text-sm text-zinc-500">Kelola QRIS untuk pembayaran di POS</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold active:scale-95 transition-all shadow-lg shadow-emerald-600/20">
          <Plus size={16} /> Tambah QRIS
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-zinc-400">Memuat data...</div>
      ) : settings.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 p-12 text-center">
          <QrCode size={48} className="mx-auto text-zinc-300 mb-4" />
          <p className="text-zinc-500 font-semibold">Belum ada pengaturan QRIS</p>
          <p className="text-zinc-400 text-sm mt-1">Klik &quot;Tambah QRIS&quot; untuk menambahkan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settings.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
              <div className="p-6 flex flex-col items-center">
                {item.gambar_qris ? (
                  <img src={`${STORAGE_BASE_URL}/qris/${item.gambar_qris}`} alt="QRIS" className="w-40 h-40 object-contain rounded-2xl mb-4 bg-zinc-50" />
                ) : (
                  <div className="w-40 h-40 rounded-2xl mb-4 bg-zinc-100 flex items-center justify-center">
                    <QrCode size={48} className="text-zinc-300" />
                  </div>
                )}
                <h3 className="font-bold text-neutral-800">{item.nama_bank || "Tanpa Nama"}</h3>
                <p className="text-sm text-zinc-500">{item.nama_pemilik || "-"}</p>
                <p className="text-xs text-zinc-400 mt-1">{item.no_rekening || "-"}</p>
                <button
                  onClick={() => handleToggleActive(item)}
                  className={`mt-4 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${item.is_active ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-400"}`}>
                  {item.is_active ? "Aktif" : "Nonaktif"}
                </button>
              </div>
              <div className="flex border-t border-zinc-100">
                <button onClick={() => openEdit(item)} className="flex-1 py-3 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-1 text-sm font-semibold">
                  <Pencil size={14} /> Edit
                </button>
                <button onClick={() => handleDelete(item.id)} className="flex-1 py-3 text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-all flex items-center justify-center gap-1 text-sm font-semibold border-l border-zinc-100">
                  <Trash2 size={14} /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] px-2 sm:px-4 py-6 sm:py-10 md:py-16">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center px-4 md:px-10 pt-4 md:pt-8 pb-0 shrink-0">
              <h2 className="text-base md:text-2xl font-bold text-neutral-800">{editId ? "Edit QRIS" : "Tambah QRIS"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 md:p-2 hover:bg-zinc-100 rounded-full transition-colors"><X size={18} className="md:size-6" /></button>
            </div>
            <div className="overflow-y-auto flex-1 min-h-0 px-4 md:px-10 pb-4 md:pb-8">
              <div className="space-y-4 md:space-y-5 pt-4 md:pt-8">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1 md:mb-2">Nama Bank</label>
                  <input type="text" value={form.nama_bank} onChange={(e) => setForm({ ...form, nama_bank: e.target.value })} className="w-full border-b-2 border-zinc-100 py-1.5 md:py-2 outline-none focus:border-red-500 font-bold text-sm md:text-lg transition-all" placeholder="Contoh: BCA" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1 md:mb-2">Nama Pemilik</label>
                  <input type="text" value={form.nama_pemilik} onChange={(e) => setForm({ ...form, nama_pemilik: e.target.value })} className="w-full border-b-2 border-zinc-100 py-1.5 md:py-2 outline-none focus:border-red-500 font-bold text-sm md:text-lg transition-all" placeholder="Nama pemilik rekening" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1 md:mb-2">No Rekening</label>
                  <input type="text" value={form.no_rekening} onChange={(e) => setForm({ ...form, no_rekening: e.target.value })} className="w-full border-b-2 border-zinc-100 py-1.5 md:py-2 outline-none focus:border-red-500 font-bold text-sm md:text-lg transition-all" placeholder="Nomor rekening" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1 md:mb-2">Gambar QRIS</label>
                  <div className="border-2 border-dashed border-zinc-200 rounded-2xl md:rounded-3xl p-4 md:p-6 text-center hover:border-red-200 transition-all cursor-pointer relative group">
                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setGambar(file);
                      if (file) setPreview(URL.createObjectURL(file));
                    }} />
                    {preview ? (
                      <img src={preview} alt="Preview" className="w-24 h-24 md:w-32 md:h-32 object-contain mx-auto rounded-xl" />
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 md:gap-2">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><Plus size={18} className="md:size-6" /></div>
                        <p className="text-[10px] md:text-xs font-bold text-zinc-400">Klik untuk upload gambar QR</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between bg-zinc-50 p-3 md:p-4 rounded-xl md:rounded-2xl">
                  <div>
                    <p className="text-xs md:text-sm font-bold text-neutral-700">Aktif</p>
                    <p className="text-[10px] text-zinc-400">Tampilkan di POS</p>
                  </div>
                  <button type="button" onClick={() => setForm({ ...form, is_active: !form.is_active })} className={`w-11 md:w-12 h-6 md:h-7 flex items-center rounded-full transition-all px-0.5 shrink-0 ${form.is_active ? "bg-green-500" : "bg-zinc-300"}`}>
                    <div className={`w-[18px] md:w-5 h-[18px] md:h-5 bg-white rounded-full shadow-md transform transition-all ${form.is_active ? "translate-x-[22px] md:translate-x-6" : "translate-x-0"}`} />
                  </button>
                </div>
              </div>
              <div className="flex justify-end gap-2 md:gap-3 mt-6 md:mt-10 shrink-0">
                <button onClick={() => setShowModal(false)} className="px-5 md:px-8 py-2.5 md:py-3 text-xs md:text-sm font-bold text-zinc-400 hover:text-zinc-600 transition-colors">Batal</button>
                <button onClick={handleSubmit} className="px-6 md:px-10 py-2.5 md:py-3 bg-neutral-900 hover:bg-black text-white rounded-xl md:rounded-2xl text-xs md:text-sm font-bold active:scale-95 transition-all shadow-lg md:shadow-xl shadow-zinc-200">Simpan</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}