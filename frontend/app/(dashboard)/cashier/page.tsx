"use client";
import React, { useEffect, useState } from "react";

/* ================= TYPES ================= */
type MenuItem = {
  id: number;
  name: string;
  price: number;
  stock: number;
  kategori: string;
  gambar?: string;
};

type CartItem = {
  id: number;
  name: string;
  price: number;
  qty: number;
};

/* ================= COMPONENT ================= */
export default function POSPage() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [filter, setFilter] = useState("All Items");
  const [search, setSearch] = useState("");

  /* ================= FETCH MENU FROM INVENTORY ================= */
  const fetchMenu = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/menu");
      const data = await res.json();

      const activeMenus = data.data
        .filter((item: any) => item.is_active === 1)
        .map((item: any) => ({
          id: item.id,
          name: item.nama_menu,
          price: item.harga_jual,
          stock: 50,
          kategori: item.kategori?.nama_kategori,
          gambar: item.gambar,
        }));

      setMenus(activeMenus);
    } catch (error) {
      console.error("Gagal fetch menu:", error);
    }
  };

  useEffect(() => {
    fetchMenu();

    const interval = setInterval(() => {
      fetchMenu();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  /* ================= FILTER + SEARCH ================= */
  const filteredMenus = menus.filter((menu) => {
    const matchFilter =
      filter === "All Items" || menu.kategori === filter;

    const matchSearch = menu.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchFilter && matchSearch;
  });

  /* ================= LOGIC CART ================= */

  const addToCart = (menu: MenuItem) => {
    if (menu.stock === 0) return;

    setCart((prev) => {
      const exist = prev.find((i) => i.id === menu.id);

      if (exist) {
        if (exist.qty >= menu.stock) return prev;

        return prev.map((i) =>
          i.id === menu.id ? { ...i, qty: i.qty + 1 } : i
        );
      }

      return [
        ...prev,
        { id: menu.id, name: menu.name, price: menu.price, qty: 1 },
      ];
    });

    setMenus((prev) =>
      prev.map((m) =>
        m.id === menu.id ? { ...m, stock: m.stock - 1 } : m
      )
    );
  };

  const increaseQty = (id: number) => {
    setCart((prev) =>
      prev.map((item) => {
        const menu = menus.find((m) => m.id === id);
        if (!menu || menu.stock === 0) return item;

        setMenus((prevMenus) =>
          prevMenus.map((m) =>
            m.id === id ? { ...m, stock: m.stock - 1 } : m
          )
        );

        return item.id === id ? { ...item, qty: item.qty + 1 } : item;
      })
    );
  };

  const decreaseQty = (id: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            setMenus((prevMenus) =>
              prevMenus.map((m) =>
                m.id === id ? { ...m, stock: m.stock + 1 } : m
              )
            );
            return { ...item, qty: item.qty - 1 };
          }
          return item;
        })
        .filter((item) => item.qty > 0)
    );
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  /* ================= UI ================= */

  return (
    <div className="bg-background text-on-surface flex h-screen overflow-hidden">
      <main className="flex-1 flex flex-col min-w-0">
        {/* HEADER */}
        <header className="bg-white flex justify-between items-center w-full px-8 py-4">
          <div className="flex items-center gap-6">
            <span className="text-xl font-bold text-[#a0383b]">
              Mie Ayam Ma-Dyang
            </span>

            <div className="relative">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-4 pr-4 py-2 bg-gray-100 rounded-full text-sm w-64"
                placeholder="Search menu items..."
              />
            </div>
          </div>
        </header>

        {/* BODY */}
        <div className="flex-1 flex overflow-hidden p-6 gap-6">
          {/* MENU */}
          <div className="flex-[2] flex flex-col gap-6 overflow-hidden">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {["All Items", "Mie", "Topping", "Minuman", "Snacks"].map(
                (c, i) => (
                  <button
                    key={i}
                    onClick={() => setFilter(c)}
                    className={`px-6 py-2.5 rounded-full text-sm font-semibold ${
                      filter === c
                        ? "bg-[#a0383b] text-white"
                        : "bg-white border"
                    }`}
                  >
                    {c}
                  </button>
                )
              )}
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 pb-8">
              {filteredMenus.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white p-4 rounded-2xl hover:shadow-lg transition"
                >
                  <div className="relative h-40 w-full mb-4 rounded-xl overflow-hidden">
                    <img
                      src={
                        item.gambar
                          ? `http://127.0.0.1:8000/storage/menu/${item.gambar}`
                          : `https://placehold.co/400x300?text=${encodeURIComponent(item.name)}`
                      }
                      className={`w-full h-full object-cover ${
                        item.stock === 0 ? "opacity-50" : ""
                      }`}
                    />

                    <div className="absolute top-3 right-3 bg-green-600 px-3 py-1 rounded-full text-white text-xs font-bold">
                      Stok: {item.stock}
                    </div>

                    {item.stock === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          Sold Out
                        </span>
                      </div>
                    )}
                  </div>

                  <h3 className="font-bold text-sm">{item.name}</h3>

                  <div className="flex justify-between items-center mt-2">
                    <span
                      className={`font-bold ${
                        item.stock === 0 ? "text-gray-400" : "text-red-600"
                      }`}
                    >
                      Rp {item.price.toLocaleString()}
                    </span>

                    <button
                      onClick={() => addToCart(item)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        item.stock === 0
                          ? "bg-gray-200 text-gray-400"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CART */}
          <div className="flex-1 max-w-md flex flex-col bg-white rounded-2xl shadow overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-lg font-bold">Order Details</h2>
              <p className="text-xs text-gray-500">Order #001</p>
            </div>

            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold">{item.name}</p>
                    <p className="text-xs text-red-600">
                      Rp {item.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 gap-2 shadow-inner">
                    <button
                      onClick={() => decreaseQty(item.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-white shadow"
                    >
                      −
                    </button>

                    <span className="text-sm font-bold w-5 text-center">
                      {item.qty}
                    </span>

                    <button
                      onClick={() => increaseQty(item.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-white shadow"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t space-y-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>Rp {tax.toLocaleString()}</span>
              </div>

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-red-600">
                  Rp {total.toLocaleString()}
                </span>
              </div>

              <button className="w-full bg-red-600 text-white py-3 rounded-xl font-bold">
                Bayar
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}