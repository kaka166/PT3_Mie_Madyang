"use client";
import { useEffect, useState, useCallback } from "react";
import {
  Search,
  Plus,
  Calculator,
  Pencil,
  FolderPlus,
  X,
  AlertTriangle,
} from "lucide-react";
import { menuService, Menu, Category } from "@/services/menuService";

export default function InventoryPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("All Items");
  const [search, setSearch] = useState("");

  // --- MODAL & UI STATE ---
  const [showModal, setShowModal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [confirmPopup, setConfirmPopup] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: "danger" | "warning";
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "warning",
  });

  // --- FORM & CALC STATE ---
  const [form, setForm] = useState({
    nama_menu: "",
    harga_jual: "",
    kategori_id: "",
    gambar: null as File | null,
  });

  const [calc, setCalc] = useState({
    hpp: 0,
    mode: "manual",
    value: 0,
  });

  const [editingCatId, setEditingCatId] = useState<number | null>(null);
  const [editingCatName, setEditingCatName] = useState("");
  const [newCatName, setNewCatName] = useState("");

  const formatRupiah = (value: string | number) => {
    if (!value) return "";
    return new Intl.NumberFormat("id-ID").format(Number(value));
  };

  // --- DATA FETCHING ---
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [mRes, cRes] = await Promise.all([
        menuService.getAll(),
        menuService.getCategories(),
      ]);
      setMenus(mRes.data);
      setCategories(cRes.data);
    } catch (err) {
      console.error("Gagal load data inventory:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- PRICE CALCULATOR LOGIC ---
  const updateCalculatedPrice = (hpp: number, mode: string, value: number) => {
    if (mode === "manual") return;
    let total = hpp;
    if (mode === "margin") total = hpp + value;
    else if (mode === "percent") total = hpp + (hpp * value) / 100;
    setForm((f) => ({ ...f, harga_jual: String(Math.round(total)) }));
  };

  const handleCalcChange = (
    field: "hpp" | "mode" | "value",
    val: string | number,
  ) => {
    const numVal = Number(val);

    const nextCalc = {
      ...calc,
      [field]: field === "mode" ? val : numVal,
    };

    setCalc(nextCalc);

    const hpp = field === "hpp" ? numVal : calc.hpp;
    const mode = field === "mode" ? String(val) : calc.mode;
    const value = field === "value" ? numVal : calc.value;

    if (mode !== "manual" && (!hpp || !value)) {
      return;
    }

    updateCalculatedPrice(hpp, mode, value);
  };

  // --- MENU ACTIONS ---
  const toggleMenu = async (menu: Menu) => {
    try {
      // Update UI langsung
      setMenus((prev) =>
        prev.map((m) =>
          m.id === menu.id ? { ...m, is_active: m.is_active ? 0 : 1 } : m,
        ),
      );

      await menuService.toggleStatus(menu);
    } catch (err) {
      console.error(err);
      fetchData(); // reload jika gagal
    }
  };

  const submitMenu = async () => {
    const formData = new FormData();
    formData.append("nama_menu", form.nama_menu);
    formData.append("harga_jual", form.harga_jual);
    formData.append("kategori_id", form.kategori_id);
    if (form.gambar) formData.append("gambar", form.gambar);

    try {
      if (isEdit && selectedId) {
        formData.append("_method", "PUT");
        await menuService.update(selectedId, formData);
      } else {
        await menuService.create(formData);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
      fetchData(); // reload jika gagal
    }
  };

  // const deleteMenu = (id: number) => {
  //   setConfirmPopup({
  //     isOpen: true,
  //     type: "danger",
  //     title: "Hapus Menu?",
  //     message: "Data menu ini akan dihapus permanen dari sistem database.",
  //     onConfirm: async () => {
  //       await menuService.delete(id);
  //       setConfirmPopup((prev) => ({ ...prev, isOpen: false }));
  //       fetchData();
  //     },
  //   });
  // };

  // --- CATEGORY ACTIONS ---
  const handleToggleCategory = (cat: Category) => {
    const isActivating = cat.is_active === 0;
    setConfirmPopup({
      isOpen: true,
      type: isActivating ? "warning" : "warning",
      title: isActivating ? "Aktifkan Kategori?" : "Nonaktifkan Kategori?",
      message: isActivating
        ? `Mengaktifkan ${cat.nama_kategori} akan memunculkan kembali kategori ini di POS.`
        : `Jika ${cat.nama_kategori} dimatikan, semua menu di dalamnya otomatis nonaktif di POS.`,
      onConfirm: async () => {
        try {
          await menuService.toggleCategoryStatus(cat);
          setConfirmPopup((prev) => ({ ...prev, isOpen: false }));
          fetchData();
        } catch (err) {
          alert("Gagal mengubah status kategori.");
        }
      },
    });
  };

  const handleAddCategory = async () => {
    if (!newCatName) return;
    await menuService.createCategory(newCatName);
    setNewCatName("");
    setShowCatModal(false);
    fetchData();
  };

  const handleUpdateCategory = async (id: number) => {
    await menuService.updateCategory(id, editingCatName);
    setEditingCatId(null);
    fetchData();
  };

  const filteredMenus = menus.filter((menu) => {
    const matchFilter =
      filter === "All Items" || menu.kategori?.nama_kategori === filter;
    const matchSearch = menu.nama_menu
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#f9f9f9] p-4 md:p-8 font-sans">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F53E1B] tracking-tight">
            Menu
          </h1>
          <p className="text-sm text-zinc-500">
            Kelola menu dan strategi harga
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              size={16}
            />
            <input
              placeholder="Cari menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
            />
          </div>

          <button
            onClick={() => setShowCatModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white rounded-xl text-sm font-bold active:scale-95 transition-all shadow-lg shadow-zinc-200"
          >
            <FolderPlus size={16} /> Kategori
          </button>

          <button
            onClick={() => {
              setIsEdit(false);
              setCalc({ hpp: 0, mode: "manual", value: 0 });
              setForm({
                nama_menu: "",
                harga_jual: "",
                kategori_id: categories[0]?.id.toString() || "",
                gambar: null,
              });
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold active:scale-95 transition-all shadow-lg shadow-red-600/20"
          >
            <Plus size={16} /> Tambah Menu
          </button>
        </div>
      </div>

      {/* 2. FILTER TABS */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setFilter("All Items")}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${filter === "All Items" ? "bg-red-600 text-white shadow-md shadow-red-200" : "bg-white border text-zinc-500 hover:bg-zinc-50"}`}
        >
          Semua
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.nama_kategori)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${filter === cat.nama_kategori ? "bg-red-600 text-white shadow-md shadow-red-200" : "bg-white border text-zinc-500 hover:bg-zinc-50"}`}
          >
            {cat.nama_kategori}
          </button>
        ))}
      </div>

      {/* 3. MENU TABLE */}
      <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden mb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            {" "}
            <thead>
              <tr className="text-gray-500 text-xs font-semibold uppercase tracking-wider border-b">
                <th className="py-3 px-4 text-left">Nama Makanan</th>
                <th className="py-3 px-4 text-left">Kategori</th>
                <th className="py-3 px-4 text-left">HPP</th>
                <th className="py-3 px-4 text-center">Harga Jual</th>
                <th className="px-6 py-4 text-center">Visibilitas POS</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filteredMenus.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-zinc-50/30 transition-colors group"
                >
                  <td className="px-6 py-4 font-bold text-neutral-700">
                    {item.nama_menu}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-zinc-100 text-zinc-500 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tight">
                      {item.kategori?.nama_kategori}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-neutral-800">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(item.harga_jual)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="number"
                      defaultValue={item.stock ?? 0}
                      className="w-20 text-center border rounded-lg px-2 py-1"
                      onBlur={async (e) => {
                        const newStock = Number(e.target.value);

                        try {
                          await menuService.updateStock(item.id, newStock);
                          setMenus((prev) =>
                            prev.map((m) =>
                              m.id === item.id
                                ? {
                                    ...m,
                                    stock: newStock,
                                  }
                                : m,
                            ),
                          );
                        } catch (err) {
                          alert("Gagal update stok");
                          fetchData();
                        }
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleMenu(item)}
                      className={`w-11 h-6 flex items-center rounded-full transition-all mx-auto ${item.is_active ? "bg-green-500" : "bg-zinc-300"}`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-all ${item.is_active ? "translate-x-6" : "translate-x-1"}`}
                      />
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2 text-zinc-400">
                      <button
                        onClick={() => {
                          setIsEdit(true);
                          setSelectedId(item.id);
                          setForm({
                            nama_menu: item.nama_menu,
                            harga_jual: String(item.harga_jual),
                            kategori_id: String(item.kategori_id),
                            gambar: null,
                          });
                          setShowModal(true);
                        }}
                        className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                      >
                        <Pencil size={16} />
                      </button>
                      {/* <button
                        onClick={() => deleteMenu(item.id)}
                        className="p-2 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL POPUPS --- */}

      {/* CONFIRMATION POPUP */}
      {confirmPopup.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200 text-center">
            <div
              className={`w-16 h-16 rounded-2xl mb-6 mx-auto flex items-center justify-center ${confirmPopup.type === "danger" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"}`}
            >
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-neutral-800 mb-2">
              {confirmPopup.title}
            </h3>
            <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
              {confirmPopup.message}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setConfirmPopup((prev) => ({ ...prev, isOpen: false }))
                }
                className="flex-1 py-3 text-sm font-bold text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmPopup.onConfirm}
                className={`flex-1 py-3 rounded-2xl text-sm font-bold text-white shadow-lg active:scale-95 transition-all ${confirmPopup.type === "danger" ? "bg-red-600 shadow-red-200" : "bg-amber-600 shadow-amber-200"}`}
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KATEGORI */}
      {showCatModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-neutral-800">
                Kelola Kategori
              </h2>
              <button
                onClick={() => setShowCatModal(false)}
                className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex gap-2 mb-8">
              <input
                type="text"
                placeholder="Tambah kategori..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="flex-1 border-b border-zinc-200 py-2 outline-none focus:border-green-600 text-sm font-medium"
              />
              <button
                onClick={handleAddCategory}
                className="bg-green-700 text-white px-5 py-2 rounded-xl text-sm font-bold active:scale-95 transition-all shadow-lg shadow-green-100"
              >
                Tambah
              </button>
            </div>

            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-4">
                Daftar Kategori Aktif
              </label>
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className={`flex items-center justify-between p-4 rounded-2xl transition-all border group ${cat.is_active ? "bg-zinc-50 border-transparent hover:border-zinc-200" : "bg-zinc-100/50 border-zinc-200 opacity-60"}`}
                >
                  <div className="flex flex-col">
                    {editingCatId === cat.id ? (
                      <input
                        autoFocus
                        type="text"
                        value={editingCatName}
                        onChange={(e) => setEditingCatName(e.target.value)}
                        className="bg-transparent border-b border-green-600 outline-none text-sm font-bold"
                      />
                    ) : (
                      <span
                        className={`text-sm font-bold transition-all ${cat.is_active ? "text-zinc-700" : "text-zinc-400 line-through"}`}
                      >
                        {cat.nama_kategori}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {editingCatId === cat.id ? (
                      <button
                        onClick={() => handleUpdateCategory(cat.id)}
                        className="text-[10px] font-bold text-green-600 uppercase px-3 py-1 bg-green-50 rounded-lg"
                      >
                        Simpan
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleToggleCategory(cat)}
                          className={`w-8 h-4.5 flex items-center rounded-full transition-all px-0.5 mr-2 ${cat.is_active ? "bg-green-500 shadow-md" : "bg-zinc-300"}`}
                        >
                          <div
                            className={`w-3.5 h-3.5 bg-white rounded-full transform transition-all ${cat.is_active ? "translate-x-3.5" : "translate-x-0"}`}
                          />
                        </button>
                        <button
                          onClick={() => {
                            setEditingCatId(cat.id);
                            setEditingCatName(cat.nama_kategori);
                          }}
                          className="p-1.5 text-zinc-400 opacity-0 group-hover:opacity-100 hover:text-blue-500 transition-all"
                        >
                          <Pencil size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL MENU */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-neutral-800">
                {isEdit ? "Update Menu" : "Tambah Menu Baru"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">
                    Nama Menu
                  </label>
                  <input
                    type="text"
                    value={form.nama_menu}
                    onChange={(e) =>
                      setForm({ ...form, nama_menu: e.target.value })
                    }
                    className="w-full border-b-2 border-zinc-100 py-2 outline-none focus:border-red-500 font-bold text-lg transition-all"
                    placeholder="Masukkan nama..."
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">
                    Kategori
                  </label>
                  <select
                    value={form.kategori_id}
                    onChange={(e) =>
                      setForm({ ...form, kategori_id: e.target.value })
                    }
                    className="w-full border-b-2 border-zinc-100 py-2 outline-none bg-transparent font-bold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id.toString()}>
                        {c.nama_kategori}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* KALKULATOR HARGA JUAL */}
              <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100 space-y-5">
                <div className="flex items-center gap-2 text-red-600 font-bold text-[11px] uppercase tracking-widest">
                  <Calculator size={16} /> Kalkulator Harga Jual
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-bold text-zinc-400 uppercase block mb-1">
                      HPP (Modal)
                    </label>
                    <input
                      type="number"
                      placeholder="Modal bahan..."
                      className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none shadow-sm focus:ring-2 ring-red-500/10 transition-all"
                      onChange={(e) => handleCalcChange("hpp", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-zinc-400 uppercase block mb-1">
                      Metode Laba
                    </label>
                    <select
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm outline-none shadow-sm transition-all font-medium"
                      value={calc.mode}
                      onChange={(e) => handleCalcChange("mode", e.target.value)}
                    >
                      <option value="manual">Harga Manual</option>
                      <option value="margin">Margin Rp</option>
                      <option value="percent">Persentase (%)</option>
                    </select>
                  </div>
                </div>

                {calc.mode !== "manual" && (
                  <div className="animate-in slide-in-from-top-2 duration-300">
                    <label className="text-[9px] font-bold text-zinc-400 uppercase block mb-1">
                      {calc.mode === "margin"
                        ? "Input Margin Untung (Rp)"
                        : "Input Persentase Untung (%)"}
                    </label>
                    <input
                      type="number"
                      placeholder={
                        calc.mode === "margin" ? "Contoh: 5000" : "Contoh: 30"
                      }
                      className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none shadow-sm transition-all"
                      onChange={(e) =>
                        handleCalcChange("value", e.target.value)
                      }
                    />
                  </div>
                )}

                <div className="pt-4 border-t border-zinc-200">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase block mb-2">
                    Hasil Harga Jual Akhir
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-zinc-400">Rp</span>
                    <input
                      type="text" // ⬅️ ganti dari number ke text
                      value={formatRupiah(form.harga_jual)}
                      readOnly={calc.mode !== "manual"}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, ""); // ambil angka saja
                        setForm({ ...form, harga_jual: raw });
                      }}
                      className={`text-4xl font-black bg-transparent outline-none w-full tracking-tighter ${
                        calc.mode !== "manual"
                          ? "text-green-600"
                          : "text-neutral-800"
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-3">
                  Foto Produk
                </label>
                <div className="border-2 border-dashed border-zinc-200 rounded-3xl p-6 text-center hover:border-red-200 transition-all cursor-pointer relative group">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        gambar: e.target.files ? e.target.files[0] : null,
                      })
                    }
                  />
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Plus size={24} />
                    </div>
                    <p className="text-xs font-bold text-zinc-400">
                      {form.gambar
                        ? form.gambar.name
                        : "Klik untuk upload foto menu"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-10">
              <button
                onClick={() => setShowModal(false)}
                className="px-8 py-3 text-sm font-bold text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={submitMenu}
                className="px-10 py-3 bg-neutral-900 hover:bg-black text-white rounded-2xl text-sm font-bold active:scale-95 transition-all shadow-xl shadow-zinc-200"
              >
                Simpan Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Tambahan Lucide-React yang mungkin belum diimport (ChevronRight)
const ChevronRight = ({ size }: { size: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-chevron-right"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);
