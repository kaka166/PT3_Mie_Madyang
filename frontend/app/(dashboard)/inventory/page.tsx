"use client";
import { useState } from "react";
import {
  Search,
  Plus,
  Calculator,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Utensils,
  Coffee,
  Beef,
  Soup,
  MoreHorizontal,
} from "lucide-react";

export default function InventoryPage() {
  const [menus, setMenus] = useState([
    {
      name: "Mie Ayam Spesial Ma-Dyang",
      category: "Mie & Bakso",
      price: "28.000",
      active: true,
      icon: <Utensils size={16} />,
    },
    {
      name: "Es Teh Manis",
      category: "Signature Drinks",
      price: "5.000",
      active: true,
      icon: <Coffee size={16} />,
    },
    {
      name: "Pangsit Goreng (3 pcs)",
      category: "Extra Toppings",
      price: "8.000",
      active: true,
      icon: <Beef size={16} />,
    },
    {
      name: "Extra Bakso Halus",
      category: "Extra Toppings",
      price: "12.000",
      active: false,
      icon: <Soup size={16} />,
    },
  ]);

  const toggleMenu = (index: number) => {
    const updated = [...menus];
    updated[index].active = !updated[index].active;
    setMenus(updated);
  };

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
          {/* SEARCH */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              size={16}
            />
            <input
              placeholder="Search items..."
              className="pl-9 pr-4 py-2 bg-zinc-100 rounded-full text-sm w-64"
            />
          </div>

          <button className="flex items-center gap-2 px-5 py-2 bg-green-700 text-white rounded-xl font-semibold">
            <Calculator size={16} /> Kalkulator
          </button>

          <button className="flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-xl font-semibold">
            <Plus size={16} /> Tambah
          </button>
        </div>
      </div>

      {/* FILTER */}
      <div className="flex gap-2 mb-6">
        {["All Items", "Mie & Bakso", "Extra Toppings", "Drinks"].map(
          (item, i) => (
            <button
              key={i}
              className={`px-4 py-2 rounded-full text-sm ${
                i === 0
                  ? "bg-red-600 text-white"
                  : "bg-white border text-zinc-600"
              }`}
            >
              {item}
            </button>
          ),
        )}
      </div>

      {/* TABLE */}
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
            {menus.map((item, i) => (
              <tr key={i} className="border-t border-zinc-200 hover:bg-zinc-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-100 text-red-600 p-2 rounded-lg">
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className="text-xs bg-zinc-100 px-2 py-1 rounded font-semibold">
                    {item.category}
                  </span>
                </td>

                <td className="px-6 py-4 font-semibold">{item.price}</td>

                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => toggleMenu(i)}
                    className={`w-11 h-6 flex items-center rounded-full transition ${
                      item.active ? "bg-red-600" : "bg-zinc-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow transform transition ${
                        item.active ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </td>

                <td className="px-6 py-4 flex justify-end gap-2">
                  <Pencil size={16} className="text-zinc-500" />
                  <Trash2 size={16} className="text-red-500" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-zinc-200 text-xs">
          <span className="text-zinc-500">Showing 1–4 of 32 menu items</span>

          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center bg-white border border-zinc-200 rounded">
              <ChevronLeft size={14} />
            </button>

            <button className="w-8 h-8 bg-red-600 text-white rounded text-xs">
              1
            </button>

            <button className="w-8 h-8 bg-white border border-zinc-200 rounded text-xs">
              2
            </button>

            <button className="w-8 h-8 bg-white border border-zinc-200 rounded text-xs">
              3
            </button>

            <button className="w-8 h-8 flex items-center justify-center bg-white border border-zinc-200 rounded">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* STOCK INVENTORY */}
      <div>
        <h2 className="text-xl font-bold mb-1">Stock Inventory (Bahan Baku)</h2>
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
              {[
                {
                  name: "Tepung Terigu",
                  date: "Oct 24",
                  stock: 142,
                  unit: "KG",
                  status: "safe",
                },
                {
                  name: "Daging Ayam",
                  date: "Oct 26",
                  stock: 12,
                  unit: "KG",
                  status: "low",
                },
                {
                  name: "Minyak",
                  date: "Oct 20",
                  stock: 2,
                  unit: "L",
                  status: "critical",
                },
                {
                  name: "Sawi",
                  date: "Oct 27",
                  stock: 45,
                  unit: "Ikat",
                  status: "safe",
                },
              ].map((item, i) => (
                <tr key={i} className="border-t border-zinc-200 hover:bg-zinc-50">
                  <td className="px-6 py-4 font-medium">{item.name}</td>

                  <td className="px-6 py-4 text-zinc-500 text-sm">
                    {item.date}
                  </td>

                  <td className="px-6 py-4 text-center font-bold">
                    {item.stock}
                  </td>

                  <td className="px-6 py-4 text-xs">{item.unit}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        item.status === "safe"
                          ? "bg-green-100 text-green-700"
                          : item.status === "low"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <MoreHorizontal size={16} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
