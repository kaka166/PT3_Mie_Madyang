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
  note?: string;
};

/* ================= COMPONENT ================= */
export default function POSPage() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [filter, setFilter] = useState("All Items");
  const [search, setSearch] = useState("");
  const [orderType, setOrderType] = useState("Dine In");
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);

  // State Baru untuk Pop-up Pembayaran
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("QRIS"); // Default QRIS
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");

  /* ================= FETCH MENU ================= */
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
    const matchFilter = filter === "All Items" || menu.kategori === filter;
    const matchSearch = menu.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  /* ================= LOGIC CART ================= */
  const addToCart = (menu: MenuItem) => {
    if (menu.stock === 0) return;
    setCart((prev) => {
      const exist = prev.find((i) => i.id === menu.id);
      if (exist) {
        if (exist.qty >= menu.stock) return prev;
        return prev.map((i) => (i.id === menu.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { id: menu.id, name: menu.name, price: menu.price, qty: 1, note: "" }];
    });
    setMenus((prev) => prev.map((m) => (m.id === menu.id ? { ...m, stock: m.stock - 1 } : m)));
  };

  const increaseQty = (id: number) => {
    setCart((prev) =>
      prev.map((item) => {
        const menu = menus.find((m) => m.id === id);
        if (!menu || menu.stock === 0) return item;
        setMenus((prevMenus) => prevMenus.map((m) => (m.id === id ? { ...m, stock: m.stock - 1 } : m)));
        return item.id === id ? { ...item, qty: item.qty + 1 } : item;
      })
    );
  };

  const decreaseQty = (id: number) => {
    setCart((prev) =>
      prev.map((item) => {
          if (item.id === id) {
            setMenus((prevMenus) => prevMenus.map((m) => (m.id === id ? { ...m, stock: m.stock + 1 } : m)));
            return { ...item, qty: item.qty - 1 };
          }
          return item;
        }).filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id: number) => {
    setCart((prev) => {
      const itemToRemove = prev.find((i) => i.id === id);
      if (itemToRemove) {
        setMenus((prevMenus) => prevMenus.map((m) => (m.id === id ? { ...m, stock: m.stock + itemToRemove.qty } : m)));
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const updateNote = (id: number, note: string) => {
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, note } : item)));
  };

  // Kalkulasi Harga
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const diskon = 0; 
  const tax = subtotal * 0.11; 
  const total = subtotal - diskon + tax;

  /* ================= UI HELPER ================= */
  const today = new Date();
  const formattedDate = today.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeNow = today.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-background text-on-surface flex h-screen overflow-hidden font-sans relative">
      
      {/* ================= MODAL / POP-UP PEMBAYARAN ================= */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-5xl flex flex-col md:flex-row shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Modal Kiri: Detail Tagihan */}
            <div className="flex-[3] p-8 bg-white border-r border-gray-100">
              <div className="flex justify-between items-end mb-1">
                <h2 className="text-2xl font-bold text-gray-800">Pembayaran Tagihan</h2>
                <span className="font-bold text-gray-800">Tagihan 99282</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400 font-medium border-b border-gray-200 pb-4 mb-6">
                <span>{formattedDate} &nbsp; {timeNow}</span>
                <span>Kasir : Kevin</span>
              </div>

              {/* Input Nama & Meja */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1 flex items-center bg-gray-100 rounded-lg px-3 py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <input 
                    type="text" 
                    placeholder="Masukan Nama Customer" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="bg-transparent w-full text-sm outline-none text-gray-700"
                  />
                </div>
                <div className="flex-1 flex items-center bg-gray-100 rounded-lg px-3 py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input 
                    type="text" 
                    placeholder="Masukan Nomor Meja / Lokasi" 
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="bg-transparent w-full text-sm outline-none text-gray-700"
                  />
                </div>
              </div>

              {/* Tabel Pesanan */}
              <div className="grid grid-cols-[40px_1fr_100px_100px] text-xs font-bold text-gray-500 bg-gray-200 rounded-full px-4 py-2 mb-2">
                <span>Qty</span>
                <span>Item</span>
                <span className="text-right">Subtotal</span>
                <span className="text-right">Total</span>
              </div>
              
              <div className="max-h-[200px] overflow-y-auto mb-6">
                {cart.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-[40px_1fr_100px_100px] text-sm py-3 px-4 border-b border-gray-100 items-start">
                    <span className="font-bold text-gray-800">{item.qty}</span>
                    <div>
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      {item.note && (
                        <ul className="list-disc pl-4 mt-1 text-xs text-gray-500">
                          <li>{item.note}</li>
                        </ul>
                      )}
                    </div>
                    <span className="text-right text-gray-600">Rp{(item.price).toLocaleString("id-ID")}</span>
                    <span className="text-right font-bold text-gray-800">Rp{(item.price * item.qty).toLocaleString("id-ID")}</span>
                  </div>
                ))}
              </div>

              {/* Summary Kalkulasi Modal */}
              <div className="border-t border-gray-300 pt-4 w-2/3 ml-auto space-y-2">
                <div className="flex justify-between text-base font-medium text-gray-400">
                  <span>Subtotal</span>
                  <span>Rp. {subtotal.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-base font-medium text-gray-400">
                  <span>Diskon</span>
                  <span>Rp. {diskon.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-base font-medium text-gray-400 pb-4 border-b border-gray-200">
                  <span>Pajak(PPN 11%)</span>
                  <span>Rp. {tax.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between items-end pt-2">
                  <span className="text-xl font-bold text-[#ff6b6b]">Total</span>
                  <span className="text-4xl font-extrabold text-gray-800">Rp. {total.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>

            {/* Modal Kanan: Metode Pembayaran */}
            <div className="flex-[2] bg-gray-50 p-8 flex flex-col border-l border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Pilih Metode Pembayaran</h3>
              
              <div className="flex gap-4 mb-6">
                <button 
                  onClick={() => setPaymentMethod("QRIS")}
                  className={`flex-1 py-6 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition bg-white ${paymentMethod === "QRIS" ? "border-[#ff6b6b] shadow-sm" : "border-transparent text-gray-400 hover:border-gray-200"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${paymentMethod === "QRIS" ? "text-gray-800" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  <span className={`font-bold ${paymentMethod === "QRIS" ? "text-gray-800" : "text-gray-500"}`}>QRIS</span>
                </button>
                <button 
                  onClick={() => setPaymentMethod("Tunai")}
                  className={`flex-1 py-6 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition bg-white ${paymentMethod === "Tunai" ? "border-[#ff6b6b] shadow-sm" : "border-transparent text-gray-400 hover:border-gray-200"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${paymentMethod === "Tunai" ? "text-gray-800" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className={`font-bold ${paymentMethod === "Tunai" ? "text-gray-800" : "text-gray-500"}`}>Tunai</span>
                </button>
              </div>

              {/* Area Konten Kondisional: QRIS / Tunai */}
              <div className="flex-1 bg-gray-100 rounded-3xl p-6 flex flex-col items-center justify-center mb-6">
                {paymentMethod === "QRIS" ? (
                  <>
                    <div className="bg-white p-4 rounded-2xl shadow-sm mb-4 w-full flex justify-center">
                      <img src="https://placehold.co/400x400?text=Scan+QRIS" alt="QRIS Code" className="w-48 h-48 object-cover rounded-xl" />
                    </div>
                    <p className="text-sm font-bold text-gray-600 text-center">Scan QR Untuk<br/>Melakukan Pembayaran</p>
                  </>
                ) : (
                  <>
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <p className="text-sm font-bold text-gray-600 text-center">Silakan terima uang tunai<br/>sebesar Rp{total.toLocaleString("id-ID")} dari pelanggan.</p>
                    </div>
                  </>
                )}
              </div>

              {/* Tombol Aksi Modal */}
              <div className="flex flex-col gap-3 mt-auto">
                <button 
                  onClick={() => {
                    alert("Proses Cetak Struk dan Kirim Data ke Backend!");
                    setShowPaymentModal(false);
                    setCart([]); 
                  }}
                  className="w-full bg-[#ff6b6b] text-white py-4 rounded-xl font-bold text-sm tracking-wide hover:bg-[#ff5252] transition shadow-md"
                >
                  KONFIRMASI & CETAK STRUK
                </button>
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="w-full py-3 text-sm font-bold text-gray-400 hover:text-gray-600 transition"
                >
                  Batalkan & Kembali ke POS
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
      {/* ========================================================== */}

      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white flex justify-between items-center w-full px-8 py-4 z-10 shadow-sm relative">
          <div className="flex items-center gap-6">
            <span className="text-xl font-bold text-[#a0383b]">Mie Ayam Ma-Dyang</span>
            <div className="relative">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-4 pr-4 py-2 bg-gray-100 rounded-full text-sm w-64 border-none outline-none"
                placeholder="Search menu items..."
              />
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden p-6 gap-6 relative z-0">
          <div className="flex-[2] flex flex-col gap-6 overflow-hidden">
            
            {/* BAGIAN YANG KONFLIK SUDAH DIBERESKAN DI SINI */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {["All Items", "Mie", "Topping", "Minuman", "Snacks"].map((c, i) => (
                <button
                  key={i}
                  onClick={() => setFilter(c)}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold transition ${
                    filter === c ? "bg-[#a0383b] text-white shadow-md" : "bg-white border text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-8 pr-2">
              {filteredMenus.map((item) => (
                <div key={item.id} className="group bg-white p-4 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition duration-200 flex flex-col">
                  <div className="relative h-40 w-full mb-4 rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={item.gambar ? `http://127.0.0.1:8000/storage/menu/${item.gambar}` : `https://placehold.co/400x300?text=${encodeURIComponent(item.name)}`}
                      className={`w-full h-full object-cover ${item.stock === 0 ? "opacity-50 grayscale" : ""}`}
                      alt={item.name}
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-gray-800 text-xs font-bold shadow-sm">
                      Stok: {item.stock}
                    </div>
                    {item.stock === 0 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-white font-bold text-sm tracking-wider">SOLD OUT</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm flex-1 leading-snug">{item.name}</h3>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                    <span className={`font-bold ${item.stock === 0 ? "text-gray-400" : "text-[#a0383b]"}`}>
                      Rp {item.price.toLocaleString("id-ID")}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      disabled={item.stock === 0}
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition ${
                        item.stock === 0 ? "bg-gray-100 text-gray-300 cursor-not-allowed" : "bg-red-50 text-[#a0383b] hover:bg-[#a0383b] hover:text-white"
                      }`}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 max-w-[26rem] flex flex-col bg-gray-100 rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 pb-4">
              <div className="flex justify-between items-end mb-1">
                <h2 className="text-2xl font-extrabold text-gray-800">Tagihan Baru</h2>
                <span className="text-sm font-semibold text-gray-800">Tagihan 99282</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400 font-medium border-b border-gray-300 pb-4">
                <span>{formattedDate}</span>
                <span>{timeNow}</span>
              </div>
            </div>

            <div className="flex-1 px-6 overflow-y-auto space-y-3 pb-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm relative">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-800 text-base w-4/5">{item.name}</h3>
                    <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  <p className="text-sm font-bold text-yellow-500 mt-1 mb-3">
                    Rp{item.price.toLocaleString("id-ID")} x {item.qty} = Rp{(item.price * item.qty).toLocaleString("id-ID")}
                  </p>

                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      <button onClick={() => decreaseQty(item.id)} className="w-8 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-200 font-bold">−</button>
                      <span className="text-xs font-bold w-6 text-center text-gray-700">{item.qty}</span>
                      <button onClick={() => increaseQty(item.id)} className="w-8 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-200 font-bold">+</button>
                    </div>

                    {editingNoteId === item.id ? (
                      <input
                        type="text"
                        autoFocus
                        value={item.note || ""}
                        onChange={(e) => updateNote(item.id, e.target.value)}
                        onBlur={() => setEditingNoteId(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingNoteId(null)}
                        placeholder="Ketik catatan..."
                        className="text-xs border border-gray-300 rounded px-2 py-1.5 w-32 outline-none focus:border-[#a0383b]"
                      />
                    ) : (
                      <button onClick={() => setEditingNoteId(item.id)} className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition ${item.note ? "bg-red-50 text-[#a0383b] border-red-200" : "text-gray-400 bg-white border-gray-200 hover:bg-gray-50"}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        {item.note ? "Edit Notes" : "Add Notes"}
                      </button>
                    )}
                  </div>
                  {item.note && editingNoteId !== item.id && (
                    <div className="mt-3 text-xs text-gray-500 bg-gray-50 p-2 rounded-md border border-gray-100">
                      <span className="font-semibold text-gray-600">Catatan: </span>{item.note}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="px-6 pb-6 pt-2 bg-gray-100">
              <div className="border-t border-gray-300 pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-sm font-medium text-gray-500">
                  <span>Subtotal</span><span>Rp.{subtotal.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-500 items-center">
                  <span>Pajak (11%)</span><span>Rp.{tax.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between font-extrabold text-base text-gray-800 pt-1">
                  <span>Total</span><span>Rp.{total.toLocaleString("id-ID")}</span>
                </div>
              </div>

              <div className="flex flex-col rounded-xl overflow-hidden bg-[#ff6b6b] shadow-md">
                <div className="relative border-b border-white/20 bg-[#fa7878]">
                  <select 
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value)}
                    className="w-full bg-transparent text-white py-3 px-4 font-bold text-sm appearance-none outline-none cursor-pointer"
                  >
                    <option value="Dine In" className="text-gray-800">Dine In</option>
                    <option value="Take Away" className="text-gray-800">Take Away</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <button 
                  onClick={() => setShowPaymentModal(true)}
                  disabled={cart.length === 0}
                  className="w-full text-white py-4 font-extrabold text-sm tracking-wide hover:bg-[#ff5252] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  LANJUTKAN KE PEMBAYARAN
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}