"use client";
import React, { useState } from "react";

/* ================= TYPES ================= */
type MenuItem = {
  id: number;
  name: string;
  price: number;
  stock: number;
  img: string;
};

type CartItem = {
  id: number;
  name: string;
  price: number;
  qty: number;
};

/* ================= DATA ================= */
const initialMenus: MenuItem[] = [
  {
    id: 1,
    name: "Mie Ayam Spesial",
    price: 18000,
    stock: 42,
    img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d",
  },
  {
    id: 2,
    name: "Mie Ayam Bakso Pedas",
    price: 22000,
    stock: 15,
    img: "https://images.unsplash.com/photo-1604908177522-4027c8b4a0d4",
  },
  {
    id: 3,
    name: "Pangsit Goreng (3pcs)",
    price: 5000,
    stock: 120,
    img: "https://images.unsplash.com/photo-1604908177341-cb8c55e4f7f2",
  },
  {
    id: 4,
    name: "Es Teh Manis",
    price: 6000,
    stock: 85,
    img: "https://images.unsplash.com/photo-1551024709-8f23befc6c43",
  },
  {
    id: 5,
    name: "Sate Ati Ampela",
    price: 4000,
    stock: 0,
    img: "https://images.unsplash.com/photo-1604908177010-5c5c1f4b4f9f",
  },
  {
    id: 6,
    name: "Wedang Jahe",
    price: 8000,
    stock: 24,
    img: "https://images.unsplash.com/photo-1604908177456-1a0d1c4e0c3a",
  },
];

/* ================= COMPONENT ================= */
export default function POSPage() {
  const [menus, setMenus] = useState<MenuItem[]>(initialMenus);
  const [cart, setCart] = useState<CartItem[]>([]);

  /* ================= LOGIC ================= */

  const addToCart = (menu: MenuItem) => {
    if (menu.stock === 0) return;

    setCart((prev) => {
      const exist = prev.find((i) => i.id === menu.id);

      if (exist) {
        if (exist.qty >= menu.stock) return prev;

        return prev.map((i) =>
          i.id === menu.id ? { ...i, qty: i.qty + 1 } : i,
        );
      }

      return [
        ...prev,
        { id: menu.id, name: menu.name, price: menu.price, qty: 1 },
      ];
    });

    setMenus((prev) =>
      prev.map((m) => (m.id === menu.id ? { ...m, stock: m.stock - 1 } : m)),
    );
  };

  const increaseQty = (id: number) => {
    setCart((prev) =>
      prev.map((item) => {
        const menu = menus.find((m) => m.id === id);
        if (!menu || menu.stock === 0) return item;

        setMenus((prevMenus) =>
          prevMenus.map((m) =>
            m.id === id ? { ...m, stock: m.stock - 1 } : m,
          ),
        );

        return item.id === id ? { ...item, qty: item.qty + 1 } : item;
      }),
    );
  };

  const decreaseQty = (id: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            setMenus((prevMenus) =>
              prevMenus.map((m) =>
                m.id === id ? { ...m, stock: m.stock + 1 } : m,
              ),
            );
            return { ...item, qty: item.qty - 1 };
          }
          return item;
        })
        .filter((item) => item.qty > 0),
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
                    className={`px-6 py-2.5 rounded-full text-sm font-semibold ${
                      i === 0 ? "bg-[#a0383b] text-white" : "bg-white border"
                    }`}
                  >
                    {c}
                  </button>
                ),
              )}
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 pb-8">
              {menus.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white p-4 rounded-2xl hover:shadow-lg transition"
                >
                  <div className="relative h-40 w-full mb-4 rounded-xl overflow-hidden">
                    <img
                      src={`https://placehold.co/400x300?text=${encodeURIComponent(item.name)}`}
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
                      className={`font-bold ${item.stock === 0 ? "text-gray-400" : "text-red-600"}`}
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
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm font-bold">{item.name}</p>
                    <p className="text-xs text-red-600">
                      Rp {item.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 gap-2 shadow-inner">
                    <button
                      onClick={() => decreaseQty(item.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-white shadow text-gray-600 hover:bg-red-500 hover:text-white transition active:scale-90"
                    >
                      −
                    </button>

                    <span className="text-sm font-bold w-5 text-center">
                      {item.qty}
                    </span>

                    <button
                      onClick={() => increaseQty(item.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-white shadow text-gray-600 hover:bg-green-500 hover:text-white transition active:scale-90"
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
