"use client";
import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Calculator,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Utensils,
  MoreHorizontal,
} from "lucide-react";

// TYPE MENU
type Menu = {
  id: number;
  nama_menu: string;
  harga_jual: number;
  kategori_id: number;
  is_active: number;
  gambar?: string;
  kategori?: {
    nama_kategori: string;
  };
};

export default function InventoryPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [filter, setFilter] = useState("All Items");
  const [search, setSearch] = useState("");

  // MODAL STATE
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [form, setForm] = useState({
    nama_menu: "",
    harga_jual: "",
    kategori_id: "1",
    gambar: null as File | null,
  });

  // FETCH MENU
  const fetchMenu = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/menu");
      const data = await res.json();
      setMenus(data.data);
    } catch (error) {
      console.error("Gagal fetch menu:", error);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // TOGGLE POS
  const toggleMenu = async (menu: Menu) => {
    await fetch(`http://127.0.0.1:8000/api/menu/${menu.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kategori_id: menu.kategori_id,
        nama_menu: menu.nama_menu,
        harga_jual: menu.harga_jual,
        is_active: menu.is_active ? 0 : 1,
      }),
    });

    fetchMenu();
  };

  // DELETE
  const deleteMenu = async (id: number) => {
    if (!confirm("Hapus menu ini?")) return;

    await fetch(`http://127.0.0.1:8000/api/menu/${id}`, {
      method: "DELETE",
    });

    fetchMenu();
  };

  // OPEN ADD MODAL
  const openAddModal = () => {
    setIsEdit(false);
    setForm({
      nama_menu: "",
      harga_jual: "",
      kategori_id: "1",
      gambar: null,
    });
    setShowModal(true);
  };

  // OPEN EDIT MODAL
  const openEditModal = (menu: Menu) => {
    setIsEdit(true);
    setSelectedId(menu.id);
    setForm({
      nama_menu: menu.nama_menu,
      harga_jual: String(menu.harga_jual),
      kategori_id: String(menu.kategori_id),
      gambar: null,
    });
    setShowModal(true);
  };

  // SUBMIT (ADD / EDIT + UPLOAD GAMBAR)
  const submitMenu = async () => {
    const formData = new FormData();
    formData.append("nama_menu", form.nama_menu);
    formData.append("harga_jual", form.harga_jual);
    formData.append("kategori_id", form.kategori_id);
    if (form.gambar) formData.append("gambar", form.gambar);

    if (isEdit) {
      formData.append("_method", "PUT"); // Laravel PUT via POST
      await fetch(`http://127.0.0.1:8000/api/menu/${selectedId}`, {
        method: "POST",
        body: formData,
      });
    } else {
      await fetch("http://127.0.0.1:8000/api/menu", {
        method: "POST",
        body: formData,
      });
    }

    setShowModal(false);
    fetchMenu();
  };

  // FILTER + SEARCH
  const filteredMenus = menus.filter((menu) => {
    const matchFilter =
      filter === "All Items" ||
      menu.kategori?.nama_kategori === filter;

    const matchSearch = menu.nama_menu
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchFilter && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#f9f9f9] p-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Menu & POS Controls</h1>
          <p className="text-sm text-zinc-500">
            Curate your offerings and manage pricing visibility.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              size={16}
            />
            <input
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-zinc-100 rounded-full text-sm w-64"
            />
          </div>

          <button className="flex items-center gap-2 px-5 py-2 bg-green-700 text-white rounded-xl font-semibold">
            <Calculator size={16} /> Kalkulator
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-xl font-semibold"
          >
            <Plus size={16} /> Tambah
          </button>
        </div>
      </div>

      {/* FILTER */}
      <div className="flex gap-2 mb-6">
        {["All Items", "Mie", "Topping", "Minuman"].map((item, i) => (
          <button
            key={i}
            onClick={() => setFilter(item)}
            className={`px-4 py-2 rounded-full text-sm ${
              filter === item
                ? "bg-red-600 text-white"
                : "bg-white border text-zinc-600"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* TABLE MENU */}
      <div className="bg-white rounded-2xl shadow overflow-hidden mb-10">
        <table className="w-full text-sm">
          <thead className="bg-zinc-100 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-6 py-3 text-left">Menu Name</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-center">POS Visibility</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredMenus.map((item) => (
              <tr key={item.id} className="border-t border-zinc-200 hover:bg-zinc-50">
                <td className="px-6 py-4">{item.nama_menu}</td>
                <td className="px-6 py-4">{item.kategori?.nama_kategori}</td>
                <td className="px-6 py-4">Rp {item.harga_jual}</td>

                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => toggleMenu(item)}
                    className={`w-11 h-6 flex items-center rounded-full transition ${
                      item.is_active ? "bg-red-600" : "bg-zinc-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow transform transition ${
                        item.is_active ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </td>

                <td className="px-6 py-4 flex justify-end gap-2">
                  <Pencil
                    size={16}
                    className="text-zinc-500 cursor-pointer"
                    onClick={() => openEditModal(item)}
                  />
                  <Trash2
                    size={16}
                    className="text-red-500 cursor-pointer"
                    onClick={() => deleteMenu(item.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center px-6 py-4 border-t border-zinc-200 text-xs">
          <span className="text-zinc-500">
            Total Menu: {filteredMenus.length}
          </span>
        </div>
      </div>

      {/* STOCK INVENTORY */}
      <div>
        <h2 className="text-xl font-bold mb-1">
          Stock Inventory (Bahan Baku)
        </h2>
        <p className="text-sm text-zinc-500 mb-4">
          Real-time tracking of ingredients and supply health.
        </p>

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-100 text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-6 py-3 text-left">Ingredient</th>
                <th className="px-6 py-3 text-left">Last Supply</th>
                <th className="px-6 py-3 text-center">Stock</th>
                <th className="px-6 py-3 text-left">Unit</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-t border-zinc-200">
                <td className="px-6 py-4">Tepung Terigu</td>
                <td className="px-6 py-4">Oct 24</td>
                <td className="px-6 py-4 text-center font-bold">142</td>
                <td className="px-6 py-4">KG</td>
                <td className="px-6 py-4">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                    safe
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <MoreHorizontal size={16} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[400px]">
            <h2 className="text-lg font-bold mb-4">
              {isEdit ? "Edit Menu" : "Tambah Menu"}
            </h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nama Menu"
                value={form.nama_menu}
                onChange={(e) =>
                  setForm({ ...form, nama_menu: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                type="number"
                placeholder="Harga"
                value={form.harga_jual}
                onChange={(e) =>
                  setForm({ ...form, harga_jual: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              />

              <select
                value={form.kategori_id}
                onChange={(e) =>
                  setForm({ ...form, kategori_id: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="1">Mie</option>
                <option value="2">Topping</option>
                <option value="3">Minuman</option>
              </select>

              <input
                type="file"
                onChange={(e) =>
                  setForm({
                    ...form,
                    gambar: e.target.files ? e.target.files[0] : null,
                  })
                }
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Batal
              </button>

              <button
                onClick={submitMenu}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}