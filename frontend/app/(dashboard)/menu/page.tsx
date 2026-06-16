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
import { formatRupiah, parseRupiah } from "@/utils/formatRupiah";
import { addNotification } from "@/services/notificationService";
import { STORAGE_BASE_URL } from "@/config";

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
        addNotification("Menu Diperbarui", `"${form.nama_menu}" berhasil diperbarui`, "success", true, "admin");
      } else {
        await menuService.create(formData);
        addNotification("Menu Ditambahkan", `"${form.nama_menu}" berhasil ditambahkan`, "success", true, "admin");
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
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white rounded-xl text-sm font-bold active:scale-95 transition-all shadow-lg shadow-zinc-200">
            <FolderPlus size={16} /> Kategori
          </button>

          <button
            onClick={() => {
              setIsEdit(false);
              setPreviewUrl(null);

              setCalc({
                hpp: 0,
                mode: "manual",
                value: 0,
              });

              setForm({
                nama_menu: "",
                harga_jual: "",
                kategori_id: categories[0]?.id.toString() || "",
                gambar: null,
              });

              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold active:scale-95 transition-all shadow-lg shadow-emerald-600/20">
            <Plus size={16} /> Tambah Menu
          </button>
        </div>
      </div>

      {/* 2. FILTER TABS */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setFilter("All Items")}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${filter === "All Items" ? "bg-emerald-600 text-white shadow-md shadow-emerald-200" : "bg-white border text-zinc-500 hover:bg-zinc-50"}`}>
          Semua
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.nama_kategori)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${filter === cat.nama_kategori ? "bg-emerald-600 text-white shadow-md shadow-emerald-200" : "bg-white border text-zinc-500 hover:bg-zinc-50"}`}>
            {cat.nama_kategori}
          </button>
        ))}
      </div>

      {/* 3. MENU TABLE - Desktop */}
      <div className="hidden md:block bg-white rounded-3xl shadow-sm border border-zinc-100 mb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-xs lg:text-sm text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-3 lg:px-5 py-3 text-left whitespace-nowrap">Nama Makanan</th>
                <th className="px-3 lg:px-5 py-3 text-left whitespace-nowrap">Kategori</th>
                <th className="px-3 lg:px-5 py-3 text-left whitespace-nowrap">Harga Jual</th>
                <th className="px-3 lg:px-5 py-3 text-center whitespace-nowrap">Stok</th>
                <th className="px-3 lg:px-5 py-3 text-center whitespace-nowrap">Visibilitas POS</th>
                <th className="px-3 lg:px-5 py-3 text-right whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filteredMenus.map((item) => (
                  <tr key={item.id} className="even:bg-gray-50 odd:bg-white hover:bg-red-50 transition-colors">
                    <td className="px-3 lg:px-5 py-3 text-neutral-700">
                      <div className="flex items-center gap-2 lg:gap-3">
                        {item.gambar ? (
                          <img
                            src={`${STORAGE_BASE_URL}/menu/${item.gambar}`}
                            alt={item.nama_menu}
                            className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg object-cover flex-shrink-0"
                            onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100/eeeeee/999999?text=Menu'; }}
                          />
                        ) : (
                          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-gray-100 flex items-center justify-center text-base lg:text-lg flex-shrink-0">🍜</div>
                        )}
                        <span className="truncate max-w-[120px] lg:max-w-none">{item.nama_menu}</span>
                      </div>
                    </td>
                  <td className="px-3 lg:px-5 py-3">
                    <span className="bg-zinc-100 text-zinc-500 px-2 py-0.5 lg:px-2.5 lg:py-1 rounded-lg text-[9px] lg:text-[10px] font-bold uppercase tracking-tight whitespace-nowrap">
                      {item.kategori?.nama_kategori}
                    </span>
                  </td>
                  <td className="px-3 lg:px-5 py-3 text-neutral-800 whitespace-nowrap">
                    {formatRupiah(item.harga_jual)}
                  </td>
                  <td className="px-3 lg:px-5 py-3 text-center">
                    <input
                      type="number"
                      defaultValue={item.stock ?? 0}
                      className="w-14 lg:w-20 text-center border rounded-lg px-1 lg:px-2 py-1 text-xs lg:text-sm"
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
                  <td className="px-3 lg:px-5 py-3 text-center">
                    <button
                      onClick={() => toggleMenu(item)}
                      className={`w-9 lg:w-11 h-5 lg:h-6 flex items-center rounded-full transition-all mx-auto ${item.is_active ? "bg-green-500" : "bg-zinc-300"}`}>
                      <div
                        className={`w-3.5 h-3.5 lg:w-4 lg:h-4 bg-white rounded-full shadow-md transform transition-all ${item.is_active ? "translate-x-[18px] lg:translate-x-6" : "translate-x-0.5 lg:translate-x-1"}`}
                      />
                    </button>
                  </td>
                  <td className="px-3 lg:px-5 py-3">
                    <div className="flex justify-end gap-1 lg:gap-2 text-zinc-400">
                      <button
                        onClick={() => {
                          setIsEdit(true);
                          setSelectedId(item.id);
                          setPreviewUrl(item.gambar ? `${STORAGE_BASE_URL}/menu/${item.gambar}` : null);
                          setForm({
                            nama_menu: item.nama_menu,
                            harga_jual: String(item.harga_jual),
                            kategori_id: String(item.kategori_id),
                            gambar: null,
                          });
                          setShowModal(true);
                        }}
                        className="p-1.5 lg:p-2 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all">
                        <Pencil size={14} className="lg:size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3b. MENU CARDS - Mobile */}
      <div className="md:hidden space-y-2 mb-12">
        {filteredMenus.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-3">
            <div className="flex items-start gap-2.5">
              {item.gambar ? (
                <img
                  src={`${STORAGE_BASE_URL}/menu/${item.gambar}`}
                  alt={item.nama_menu}
                  className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                  onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100/eeeeee/999999?text=Menu'; }}
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-lg flex-shrink-0">🍜</div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1.5">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-neutral-800 text-sm truncate">{item.nama_menu}</h3>
                    <span className="inline-block mt-0.5 bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-tight">
                      {item.kategori?.nama_kategori}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-neutral-800 whitespace-nowrap shrink-0">{formatRupiah(item.harga_jual)}</span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-50">
                  <div className="flex items-center gap-1.5">
                    <label className="text-[9px] font-bold text-zinc-400 uppercase">Stok</label>
                    <input
                      type="number"
                      defaultValue={item.stock ?? 0}
                      className="w-12 text-center border rounded-lg px-1 py-0.5 text-[11px]"
                      onBlur={async (e) => {
                        const newStock = Number(e.target.value);
                        try {
                          await menuService.updateStock(item.id, newStock);
                          setMenus((prev) =>
                            prev.map((m) =>
                              m.id === item.id ? { ...m, stock: newStock } : m,
                            ),
                          );
                        } catch (err) {
                          alert("Gagal update stok");
                          fetchData();
                        }
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleMenu(item)}
                      className={`w-8 h-4.5 flex items-center rounded-full transition-all ${item.is_active ? "bg-green-500" : "bg-zinc-300"}`}>
                      <div
                        className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-all ${item.is_active ? "translate-x-[15px]" : "translate-x-0.5"}`}
                      />
                    </button>
                    <button
                      onClick={() => {
                        setIsEdit(true);
                        setSelectedId(item.id);
                        setPreviewUrl(item.gambar ? `${STORAGE_BASE_URL}/menu/${item.gambar}` : null);
                        setForm({
                          nama_menu: item.nama_menu,
                          harga_jual: String(item.harga_jual),
                          kategori_id: String(item.kategori_id),
                          gambar: null,
                        });
                        setShowModal(true);
                      }}
                      className="p-1 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all text-zinc-400">
                      <Pencil size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL POPUPS --- */}

      {/* CONFIRMATION POPUP */}
      {confirmPopup.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[210] p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200 text-center">
            <div
              className={`w-16 h-16 rounded-2xl mb-6 mx-auto flex items-center justify-center ${confirmPopup.type === "danger" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"}`}>
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
                className="flex-1 py-3 text-sm font-bold text-zinc-400 hover:text-zinc-600 transition-colors">
                Batal
              </button>
              <button
                onClick={confirmPopup.onConfirm}
                className={`flex-1 py-3 rounded-2xl text-sm font-bold text-white shadow-lg active:scale-95 transition-all ${confirmPopup.type === "danger" ? "bg-red-600 shadow-emerald-200" : "bg-amber-600 shadow-amber-200"}`}>
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KATEGORI */}
      {showCatModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-neutral-800">
                Kelola Kategori
              </h2>
              <button
                onClick={() => setShowCatModal(false)}
                className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
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
                className="bg-green-700 text-white px-5 py-2 rounded-xl text-sm font-bold active:scale-95 transition-all shadow-lg shadow-green-100">
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
                  className={`flex items-center justify-between p-4 rounded-2xl transition-all border group ${cat.is_active ? "bg-zinc-50 border-transparent hover:border-zinc-200" : "bg-zinc-100/50 border-zinc-200 opacity-60"}`}>
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
                        className={`text-sm font-bold transition-all ${cat.is_active ? "text-zinc-700" : "text-zinc-400 line-through"}`}>
                        {cat.nama_kategori}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {editingCatId === cat.id ? (
                      <button
                        onClick={() => handleUpdateCategory(cat.id)}
                        className="text-[10px] font-bold text-green-600 uppercase px-3 py-1 bg-green-50 rounded-lg">
                        Simpan
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleToggleCategory(cat)}
                          className={`w-8 h-4.5 flex items-center rounded-full transition-all px-0.5 mr-2 ${cat.is_active ? "bg-green-500 shadow-md" : "bg-zinc-300"}`}>
                          <div
                            className={`w-3.5 h-3.5 bg-white rounded-full transform transition-all ${cat.is_active ? "translate-x-3.5" : "translate-x-0"}`}
                          />
                        </button>
                        <button
                          onClick={() => {
                            setEditingCatId(cat.id);
                            setEditingCatName(cat.nama_kategori);
                          }}
                          className="p-1.5 text-zinc-400 opacity-0 group-hover:opacity-100 hover:text-blue-500 transition-all">
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] px-2 sm:px-4 py-6 sm:py-10 md:py-16">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl max-h-[85vh] h-full flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center px-4 md:px-8 pt-4 md:pt-8 shrink-0">
              <h2 className="text-lg md:text-2xl font-bold text-neutral-800">
                {isEdit ? "Update Menu" : "Tambah Menu Baru"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                <X size={22} className="md:size-6" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 min-h-0 px-4 md:px-8 custom-scrollbar">
              <div className="space-y-4 md:space-y-6 pt-4 md:pt-8 pb-6 md:pb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1 md:mb-2">
                      Nama Menu
                    </label>
                    <input
                      type="text"
                      value={form.nama_menu}
                      onChange={(e) =>
                        setForm({ ...form, nama_menu: e.target.value })
                      }
                      className="w-full border-b-2 border-zinc-100 py-1.5 md:py-2 outline-none focus:border-red-500 font-bold text-base md:text-lg transition-all"
                      placeholder="Masukkan nama..."
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1 md:mb-2">
                      Kategori
                    </label>
                    <select
                      value={form.kategori_id}
                      onChange={(e) =>
                        setForm({ ...form, kategori_id: e.target.value })
                      }
                      className="w-full border-b-2 border-zinc-100 py-1.5 md:py-2 outline-none bg-transparent font-bold text-base md:text-lg">
                      {categories.map((c) => (
                        <option key={c.id} value={c.id.toString()}>
                          {c.nama_kategori}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* KALKULATOR HARGA JUAL */}
                <div className="bg-zinc-50 p-4 md:p-6 rounded-3xl border border-zinc-100 space-y-3 md:space-y-5">
                  <div className="flex items-center gap-2 text-red-600 font-bold text-[11px] uppercase tracking-widest">
                    <Calculator size={14} className="md:size-4" /> Kalkulator Harga Jual
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label className="text-[9px] font-bold text-zinc-400 uppercase block mb-1">
                        HPP (Modal)
                      </label>
                      <div className="flex items-center bg-white border border-zinc-200 rounded-xl px-3 py-2 shadow-sm focus-within:ring-2 ring-red-500/10">
                        <span className="text-sm font-semibold text-zinc-500 mr-2">
                          Rp
                        </span>
                        <input
                          type="text"
                          placeholder="0"
                          className="w-full bg-transparent outline-none text-sm"
                          value={formatRupiah(calc.hpp).replace("Rp", "").trim()}
                          onChange={(e) => {
                            const raw = parseRupiah(e.target.value);
                            handleCalcChange("hpp", raw);
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-zinc-400 uppercase block mb-1">
                        Metode Laba
                      </label>
                      <select
                        className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-sm outline-none shadow-sm transition-all font-medium"
                        value={calc.mode}
                        onChange={(e) =>
                          handleCalcChange("mode", e.target.value)
                        }>
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
                        className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2 text-sm outline-none shadow-sm transition-all"
                        onChange={(e) =>
                          handleCalcChange("value", e.target.value)
                        }
                      />
                    </div>
                  )}

                  <div className="pt-3 md:pt-4 border-t border-zinc-200">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase block mb-1 md:mb-2">
                      Hasil Harga Jual Akhir
                    </span>
                    <div className="flex items-baseline gap-2">
                      <input
                        type="text"
                        value={formatRupiah(form.harga_jual)}
                        readOnly={calc.mode !== "manual"}
                        onChange={(e) => {
                          const raw = parseRupiah(e.target.value);
                          setForm({ ...form, harga_jual: raw });
                        }}
                        className={`text-2xl md:text-4xl font-black bg-transparent outline-none w-full tracking-tighter ${
                          calc.mode !== "manual"
                            ? "text-green-600"
                            : "text-neutral-800"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center justify-between mb-2 md:mb-3">
                    <span>Foto Produk</span>
                    <span className="text-[9px] bg-red-50 text-[#b93b3b] px-2 py-1 rounded">400x400px</span>
                  </label>
                  <div className="border-2 border-dashed border-zinc-200 rounded-3xl p-4 md:p-6 text-center hover:border-red-200 transition-all cursor-pointer relative group">
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files ? e.target.files[0] : null;
                        setForm({ ...form, gambar: file });
                        if (file) {
                          const url = URL.createObjectURL(file);
                          setPreviewUrl(url);
                        }
                      }}
                    />
                    <div className="flex flex-col items-center gap-2">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-2xl mb-1 shadow-sm"
                        />
                      ) : (
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Plus size={20} className="md:size-6" />
                        </div>
                      )}
                      <p className="text-xs font-bold text-zinc-400">
                        {form.gambar
                          ? form.gambar.name
                          : previewUrl
                          ? "Klik untuk ganti foto"
                          : "Klik untuk upload foto menu"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 md:gap-3 px-4 md:px-8 pb-4 md:pb-8 pt-3 md:pt-4 shrink-0">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 md:px-8 py-2.5 md:py-3 text-sm font-bold text-zinc-400 hover:text-zinc-600 transition-colors">
                Batal
              </button>
              <button
                onClick={submitMenu}
                className="px-6 md:px-10 py-2.5 md:py-3 bg-neutral-900 hover:bg-black text-white rounded-2xl text-sm font-bold active:scale-95 transition-all shadow-xl shadow-zinc-200">
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
    className="lucide lucide-chevron-right">
    <path d="m9 18 6-6-6-6" />
  </svg>
);
