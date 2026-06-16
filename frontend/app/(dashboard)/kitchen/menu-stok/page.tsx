/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Minus, Pizza } from "lucide-react";
import { menuService, Menu } from "@/services/menuService";
import { addNotification } from "@/services/notificationService";

export default function MenuStokPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      const res = await menuService.getAll();
      setMenus(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = menus.filter((m) =>
    m.nama_menu.toLowerCase().includes(search.toLowerCase()),
  );

  const handleRestok = async (menu: Menu, qty: number) => {
    if (qty <= 0) return;
    setUpdatingId(menu.id);
    try {
      await menuService.updateStock(menu.id, (menu.stock || 0) + qty);
      setMenus((prev) =>
        prev.map((m) =>
          m.id === menu.id ? { ...m, stock: (m.stock || 0) + qty } : m,
        ),
      );
      addNotification("Stok Ditambahkan", `${menu.nama_menu}: +${qty} porsi`, "success", false, "kitchen");
    } catch (err: any) {
      addNotification("Gagal", err.message || "Terjadi kesalahan", "error", false, "kitchen");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-gray-100 p-6 pb-12 font-sans text-gray-800">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#F53E1B]">Stok Menu</h1>
        <p className="text-gray-500 text-sm">Kelola stok porsi menu</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#F53E1B]"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Pizza size={16} />
            <span>{filtered.length} menu</span>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400">Memuat data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-500 uppercase text-xs tracking-wider">
                  <th className="px-4 py-3 font-medium">Menu</th>
                  <th className="px-4 py-3 font-medium">Kategori</th>
                  <th className="px-4 py-3 font-medium">Harga</th>
                  <th className="px-4 py-3 font-medium">Stok Saat Ini</th>
                  <th className="px-4 py-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                      Tidak ada menu ditemukan
                    </td>
                  </tr>
                ) : (
                  filtered.map((menu) => (
                    <MenuRow
                      key={menu.id}
                      menu={menu}
                      onRestok={handleRestok}
                      updating={updatingId === menu.id}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function MenuRow({
  menu,
  onRestok,
  updating,
}: {
  menu: Menu;
  onRestok: (menu: Menu, qty: number) => Promise<void>;
  updating: boolean;
}) {
  const [qty, setQty] = useState(1);

  return (
    <tr className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 font-medium">{menu.nama_menu}</td>
      <td className="px-4 py-3 text-gray-500">{menu.kategori?.nama_kategori ?? "-"}</td>
      <td className="px-4 py-3">Rp {(menu.harga_jual ?? 0).toLocaleString("id-ID")}</td>
      <td className="px-4 py-3">
        <span
          className={`font-bold ${
            (menu.stock ?? 0) <= 0
              ? "text-red-500"
              : (menu.stock ?? 0) <= 5
                ? "text-yellow-500"
                : "text-green-600"
          }`}>
          {menu.stock ?? 0}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100">
            <Minus size={14} />
          </button>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
            className="w-14 text-center border border-gray-200 rounded-lg py-1 text-sm outline-none focus:border-[#F53E1B]"
          />
          <button
            onClick={() => setQty((q) => q + 1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100">
            <Plus size={14} />
          </button>
          <button
            onClick={() => onRestok(menu, qty)}
            disabled={updating}
            className="ml-2 bg-[#F53E1B] hover:bg-red-600 disabled:opacity-50 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
            {updating ? "..." : "Restok"}
          </button>
        </div>
      </td>
    </tr>
  );
}
