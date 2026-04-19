"use client";
import React, { useEffect, useState, useCallback } from "react";
import { formatRupiah } from "@/utils/formatCurrency";
import { getMenus, getCategories, MenuItem } from "@/services/cashierService";
import { getTax, updateTax } from "@/services/taxService";
import { createOrder } from "@/services/penjualanService";
import {
  startSession,
  endSession,
  getActiveSession,
} from "@/services/sessionService";
import { X } from "lucide-react";

/* ================= TYPES ================= */
type CartItem = {
  id: number;
  name: string;
  price: number;
  qty: number;
  note?: string;
};

export default function POSPage() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>(["All Items"]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [filter, setFilter] = useState("All Items");
  const [search, setSearch] = useState("");
  const [orderType, setOrderType] = useState("Dine In");
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);

  const [isCartOpenMobile, setIsCartOpenMobile] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"QRIS" | "Tunai">("QRIS");
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");

  const [isTaxEnabled, setIsTaxEnabled] = useState(true);
  const [taxPercent, setTaxPercent] = useState(0);
  const [showTaxModal, setShowTaxModal] = useState(false);

  type SessionResult = {
    opening_cash: number;
    total_pemasukan: number;
    expected_cash: number;
    closing_cash: number;
    selisih: number;
  };

  const [showEndSessionModal, setShowEndSessionModal] = useState(false);
  const [closingCash, setClosingCash] = useState("");
  const [sessionResult, setSessionResult] = useState<SessionResult | null>(
    null,
  );

  const [sessionActive, setSessionActive] = useState(false);
  const [openingCash, setOpeningCash] = useState("");

  const handleStartSession = async () => {
    const cash = Number(openingCash);

    if (!cash || cash < 0) {
      alert("Masukkan uang awal dulu!");
      return;
    }

    try {
      await startSession(cash);
      setSessionActive(true);
      alert("Sesi dimulai!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Gagal memulai sesi");
      }
    }
  };

  const handleEndSession = () => {
    setShowEndSessionModal(true);
  };

  const handleConfirmEndSession = async () => {
    const cash = Number(closingCash);

    if (!cash || cash < 0) {
      alert("Masukkan uang akhir yang valid!");
      return;
    }

    try {
      const res = await endSession(cash);
      const data = res.data ?? res;

      setSessionResult(data);
      setShowEndSessionModal(false);
      setSessionActive(false);
      setClosingCash("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Gagal mengakhiri sesi");
      }
    }
  };

  /* ================= FETCH LOGIC ================= */
  const fetchMenu = async () => {
    try {
      const activeMenus = await getMenus();
      setMenus(activeMenus);
    } catch (error) {
      console.error("Gagal fetch menu:", error);
    }
  };

  const loadInitialData = useCallback(async () => {
    try {
      const [menuData, catData] = await Promise.all([
        getMenus(),
        getCategories(),
      ]);
      setMenus(menuData);
      setCategories(catData);
    } catch (error) {
      console.error("Gagal sinkronisasi data:", error);
    }
  }, []);

  const fetchTax = async () => {
    try {
      const data = await getTax();
      setIsTaxEnabled(data.is_enabled);
      setTaxPercent(data.tax_percent);
    } catch (err) {
      console.error("Gagal fetch tax:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchTax();
      await loadInitialData();

      const session = await getActiveSession();

      if (session?.data?.id) {
        setSessionActive(true);
      } else {
        setSessionActive(false);
      }
    };
    init();
    const intervalId = setInterval(fetchMenu, 5000);
    return () => clearInterval(intervalId);
  }, [loadInitialData]);

  /* ================= LOGIC CART ================= */
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
        { id: menu.id, name: menu.name, price: menu.price, qty: 1, note: "" },
      ];
    });
  };

  const increaseQty = (id: number) => {
    setCart((prev) =>
      prev.map((item) => {
        const menu = menus.find((m) => m.id === id);
        if (!menu || menu.stock === 0) return item;
        return item.id === id ? { ...item, qty: item.qty + 1 } : item;
      }),
    );
  };

  const decreaseQty = (id: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            return { ...item, qty: item.qty - 1 };
          }
          return item;
        })
        .filter((item) => item.qty > 0),
    );
  };

  const removeItem = (id: number) => {
    setCart((prev) => {
      const itemToRemove = prev.find((i) => i.id === id);
      if (itemToRemove) {
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const updateNote = (id: number, note: string) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, note } : item)),
    );
  };

  const filteredMenus = menus.filter((m) => {
    const matchCat = filter === "All Items" || m.kategori === filter;
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const diskon = 0;
  const tax = isTaxEnabled ? Math.round((subtotal * taxPercent) / 100) : 0;
  const total = subtotal - diskon + tax;

  return (
    // Gunakan h-screen agar layout utama tidak overflow keluar viewport dan scroll internal aktif
    <div className="bg-gray-50 text-gray-800 flex flex-col lg:flex-row h-screen overflow-hidden font-sans relative">
      {/* ================= MODAL PAJAK ================= */}
      {showTaxModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-lg font-bold mb-4">Atur Pajak (%)</h2>
            <input
              type="number"
              value={taxPercent}
              onChange={(e) =>
                setTaxPercent(
                  Math.min(100, Math.max(0, parseInt(e.target.value) || 0)),
                )
              }
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 mb-4 outline-none focus:border-[#ff6b6b] transition-all"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowTaxModal(false)}
                className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition">
                Batal
              </button>
              <button
                onClick={async () => {
                  try {
                    await updateTax({
                      is_enabled: isTaxEnabled,
                      tax_percent: taxPercent,
                    });
                    setShowTaxModal(false);
                    await fetchTax();
                  } catch (err) {
                    console.error("Gagal update tax:", err);
                  }
                }}
                className="flex-1 py-3 bg-[#ff6b6b] text-white rounded-xl font-bold shadow-lg shadow-red-100">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL PEMBAYARAN ================= */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-0 md:p-4">
          <div className="bg-white rounded-none md:rounded-3xl w-full h-full md:h-auto md:max-w-5xl flex flex-col md:flex-row shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Modal Kiri: Detail Tagihan */}
            <div className="flex-[3] p-6 md:p-8 bg-white border-r border-gray-100 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-gray-800 tracking-tight">
                  Pembayaran
                </h2>
                <span className="font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full text-xs">
                  #99282
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <input
                  type="text"
                  placeholder="Nama Customer"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-red-100 focus:bg-white rounded-2xl px-4 py-3 outline-none transition-all text-sm font-bold"
                />
                <input
                  type="text"
                  placeholder="Nomor Meja"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-red-100 focus:bg-white rounded-2xl px-4 py-3 outline-none transition-all text-sm font-bold"
                />
              </div>

              <div className="space-y-4 mb-8">
                {cart.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-gray-50/50 p-3 rounded-2xl">
                    <div className="flex gap-3 items-center">
                      <span className="font-bold text-[#ff6b6b] text-sm">
                        {item.qty}x
                      </span>
                      <p className="font-bold text-sm text-gray-800">
                        {item.name}
                      </p>
                    </div>
                    <span className="font-black text-sm">
                      {formatRupiah(item.price * item.qty)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t-2 border-dashed border-gray-100">
                <div className="flex justify-between text-gray-400 font-bold text-xs uppercase">
                  <span>Subtotal</span>
                  <span>{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-400 font-bold text-xs uppercase">
                  <span>Pajak ({taxPercent}%)</span>
                  <span>{formatRupiah(tax)}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-black text-[#ff6b6b]">
                    TOTAL
                  </span>
                  <span className="text-3xl font-black text-gray-900 tracking-tighter">
                    {formatRupiah(total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Kanan: Metode Bayar */}
            <div className="flex-[2] bg-gray-50 p-6 md:p-8 flex flex-col border-t md:border-t-0 md:border-l border-gray-100">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 text-center">
                Metode Pembayaran
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-8">
                <button
                  onClick={() => setPaymentMethod("QRIS")}
                  className={`py-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === "QRIS" ? "bg-white border-[#ff6b6b] shadow-xl shadow-red-100" : "bg-white/50 border-transparent text-gray-400 hover:bg-white hover:border-gray-200"}`}>
                  <span
                    className={`font-black text-sm ${paymentMethod === "QRIS" ? "text-[#ff6b6b]" : "text-gray-400"}`}>
                    QRIS
                  </span>
                </button>
                <button
                  onClick={() => setPaymentMethod("Tunai")}
                  className={`py-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === "Tunai" ? "bg-white border-[#ff6b6b] shadow-xl shadow-red-100" : "bg-white/50 border-transparent text-gray-400 hover:bg-white hover:border-gray-200"}`}>
                  <span
                    className={`font-black text-sm ${paymentMethod === "Tunai" ? "text-[#ff6b6b]" : "text-gray-400"}`}>
                    TUNAI
                  </span>
                </button>
              </div>

              <div className="flex-1 min-h-[180px] bg-white rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-6 mb-8 shadow-inner">
                {paymentMethod === "QRIS" ? (
                  <div className="text-center animate-pulse">
                    <img
                      src="https://placehold.co/200x200?text=SCAN+QR"
                      className="w-32 h-32 rounded-2xl mb-3 opacity-80"
                      alt="QR"
                    />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Menunggu...
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                      Terima Tunai
                    </p>
                    <p className="text-2xl font-black text-gray-800">
                      {formatRupiah(total)}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={async () => {
                    const result = await createOrder({
                      customer_name: customerName,
                      order_type: orderType,
                      metode_pembayaran: paymentMethod,
                      items: cart.map((item) => ({
                        menu_id: item.id,
                        qty: item.qty,
                        note: item.note || "",
                      })),
                    });

                    if (result) {
                      alert("Pesanan masuk kitchen!");

                      setMenus((prevMenus) =>
                        prevMenus.map((menu) => {
                          const orderedItem = cart.find(
                            (c) => c.id === menu.id,
                          );

                          if (!orderedItem) return menu;

                          return {
                            ...menu,
                            stock: Math.max(0, menu.stock - orderedItem.qty),
                          };
                        }),
                      );

                      await fetchMenu();

                      setShowPaymentModal(false);
                      setCart([]);
                      setCustomerName("");
                      setTableNumber("");
                    } else {
                      alert("Gagal kirim ke kitchen");
                    }
                  }}
                  className="w-full bg-[#ff6b6b] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-red-200 active:scale-95 transition-all">
                  Selesaikan Pesanan
                </button>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="w-full text-gray-400 font-bold py-2 hover:text-gray-600 transition-colors">
                  Kembali
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEndSessionModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-lg font-bold mb-4">Tutup Sesi</h2>

            <input
              type="number"
              placeholder="Masukkan uang akhir"
              value={closingCash}
              onChange={(e) => setClosingCash(e.target.value)}
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 mb-4 outline-none"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setShowEndSessionModal(false)}
                className="flex-1 py-3 text-gray-500 font-bold">
                Batal
              </button>

              <button
                onClick={handleConfirmEndSession}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {sessionResult && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-lg font-bold mb-4">Ringkasan Sesi</h2>

            <div className="space-y-2 text-sm">
              <p>Opening: {formatRupiah(sessionResult.opening_cash)}</p>
              <p>Penjualan: {formatRupiah(sessionResult.total_pemasukan)}</p>
              <p>Seharusnya: {formatRupiah(sessionResult.expected_cash)}</p>
              <p>Uang Akhir: {formatRupiah(sessionResult.closing_cash)}</p>
              <p className="font-bold text-red-500">
                Selisih: {formatRupiah(sessionResult.selisih)}
              </p>
            </div>

            <button
              onClick={() => setSessionResult(null)}
              className="mt-4 w-full py-3 bg-[#ff6b6b] text-white rounded-xl font-bold">
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 flex flex-col min-w-0 bg-white lg:bg-transparent relative z-10 overflow-hidden">
        <header className="bg-white px-6 py-5 flex flex-col lg:flex-row justify-between items-center gap-4 border-b border-gray-100 shadow-sm">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <h1 className="text-xl font-black text-[#F53E1B] tracking-tighter uppercase italic">
              Ma-Dyang <span className="text-gray-300 not-italic">POS</span>
            </h1>
            <button
              onClick={() => setIsCartOpenMobile(true)}
              className="lg:hidden relative p-3 bg-gray-50 rounded-2xl active:scale-90 transition-all border border-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#a0383b]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 11V7a4 4 0 118 0m-4 4v2m0 0l-5.432 4.87a1 1 0 01-1.336 0L3 13m11 0V9a2 2 0 10-4 0v5"
                />
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ff6b6b] text-white text-[10px] w-6 h-6 flex items-center justify-center rounded-full border-4 border-white font-black">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-3 w-full lg:w-auto">
            {/* SEARCH */}
            <div className="w-full sm:w-80 relative group">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-5 pr-5 py-3 bg-gray-50 border-2 border-transparent focus:border-red-100 focus:bg-white rounded-2xl text-sm font-bold outline-none transition-all shadow-inner"
                placeholder="Cari menu..."
              />
            </div>

            {/* SESSION */}
            <div className="flex gap-2 items-center">
              {!sessionActive ? (
                <>
                  <input
                    type="number"
                    placeholder="Uang awal"
                    value={openingCash}
                    onChange={(e) => setOpeningCash(e.target.value)}
                    className="px-3 py-2 border rounded-lg text-xs w-28"
                  />
                  <button
                    onClick={handleStartSession}
                    className="bg-green-500 text-white px-3 py-2 rounded-lg text-xs font-bold">
                    Mulai Sesi
                  </button>
                </>
              ) : (
                <>
                  <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded">
                    Sesi Aktif
                  </span>

                  <button
                    onClick={handleEndSession}
                    className="bg-red-500 text-white px-3 py-2 rounded-lg text-xs font-bold">
                    Tutup Sesi
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col p-4 md:p-8 gap-8 overflow-hidden">
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar flex-shrink-0">
            {categories.map((c, i) => (
              <button
                key={i}
                onClick={() => setFilter(c)}
                className={`whitespace-nowrap px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${filter === c ? "bg-[#F53E1B] text-white shadow-xl shadow-red-100 scale-105" : "bg-white border-2 border-gray-100 text-gray-400  hover:text-[#F53E1B]"}`}>
                {c}
              </button>
            ))}
          </div>

          {/* Container Menu - iso di scroll */}
          <div className="flex-1 overflow-y-auto no-scrollbar pb-32 lg:pb-8 px-1">
            {/* Grid diset 2 kolom mobile dan 4 kolom desktop sesuai permintaan */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredMenus.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white p-4 rounded-[2rem] shadow-sm hover:shadow-2xl border-2 border-transparent hover:border-red-50 transition-all active:scale-95 flex flex-col">
                  <div className="relative aspect-square w-full mb-4 rounded-[1.5rem] overflow-hidden bg-gray-50">
                    <img
                      src={
                        item.gambar
                          ? `http://127.0.0.1:8000/storage/menu/${item.gambar}`
                          : `https://placehold.co/400x400?text=${item.name}`
                      }
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${item.stock === 0 ? "opacity-40 grayscale" : ""}`}
                      alt={item.name}
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black shadow-sm text-gray-600">
                      {item.stock} STOK
                    </div>
                    {item.stock === 0 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center font-black text-white text-xs tracking-widest">
                        HABIS
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm line-clamp-2 flex-1 leading-snug mb-3 px-1">
                    {item.name}
                  </h3>
                  <div className="flex justify-between items-center pt-3 border-t-2 border-gray-50">
                    <span className="text-[#F53E1B] font-black text-base">
                      {formatRupiah(item.price)}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      disabled={item.stock === 0}
                      className="w-10 h-10 rounded-2xl bg-red-50 text-[#a0383b] flex items-center justify-center font-black text-xl hover:bg-[#F53E1B] hover:text-white transition-all shadow-sm active:scale-90">
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ================= ASIDE (KERANJANG) ================= */}
      <aside
        className={`
        fixed inset-y-0 right-0 z-[40] 
        w-[85%] max-w-[320px] lg:max-w-[26rem] lg:w-full 
        bg-white lg:bg-gray-100 backdrop-blur-md
        transform transition-transform duration-500 ease-in-out lg:relative lg:translate-x-0 lg:flex lg:flex-col
        ${isCartOpenMobile ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        `}>
        <div className="h-full flex flex-col pt-2 lg:pt-0 py-10">
          {/* Header - Padding dikurangi dari p-8 ke p-5 di mobile */}
          <div className="p-10 lg:p-8 pb-3 flex justify-between items-center">
            <h2 className="text-xl lg:text-2xl font-black tracking-tight flex items-center gap-2">
              Pesanan{" "}
              <span className="text-[9px] bg-[#ff6b6b] text-white px-2 py-0.5 rounded-full shadow-md uppercase tracking-widest">
                {cart.length} ITEM
              </span>
            </h2>
            <button
              onClick={() => setIsCartOpenMobile(false)}
              className="lg:hidden p-2 bg-gray-100 rounded-xl text-gray-400 active:scale-90 transition-all">
              <X size={20} strokeWidth={3} />
            </button>
          </div>

          {/* Cart Items - Padding samping dikurangi sedikit */}
          <div className="flex-1 px-4 lg:px-6 overflow-y-auto space-y-3 pb-6 no-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-6">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                  <span className="text-3xl grayscale opacity-30">🍜</span>
                </div>
                <p className="font-black text-gray-300 uppercase tracking-widest text-[9px] leading-relaxed">
                  Belum ada menu
                  <br />
                  yang dipesan
                </p>
              </div>
            ) : (
              cart.map((item) => (
                // Card item dibuat lebih tipis (p-5 ke p-4)
                <div
                  key={item.id}
                  className="bg-white rounded-[1.2rem] p-4 lg:p-5 shadow-sm border-2 border-transparent hover:border-red-50 transition-all group relative overflow-hidden">
                  <div className="flex justify-between items-start mb-1 relative z-10">
                    <h3 className="font-bold text-gray-800 text-xs lg:text-sm w-4/5 line-clamp-1 leading-tight">
                      {item.name}
                    </h3>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-200 hover:text-red-500 transition-colors active:scale-90">
                      <X size={14} strokeWidth={3} />
                    </button>
                  </div>
                  <p className="text-[10px] lg:text-xs font-black text-[#F53E1B] mb-3">
                    {formatRupiah(item.price * item.qty)}
                  </p>

                  <div className="flex justify-between items-center relative z-10">
                    <div className="flex items-center bg-gray-50 rounded-lg p-0.5 border border-gray-100">
                      <button
                        onClick={() => decreaseQty(item.id)}
                        className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500 font-black text-base">
                        −
                      </button>
                      <span className="text-[10px] font-black w-6 text-center text-gray-700">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => increaseQty(item.id)}
                        className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-green-500 font-black text-base">
                        +
                      </button>
                    </div>
                    <div className="flex-1 ml-3 overflow-hidden">
                      {editingNoteId === item.id ? (
                        <input
                          autoFocus
                          value={item.note || ""}
                          onChange={(e) => updateNote(item.id, e.target.value)}
                          onBlur={() => setEditingNoteId(null)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && setEditingNoteId(null)
                          }
                          className="text-[9px] w-full border-b border-[#ff6b6b] bg-transparent outline-none py-1 font-bold italic"
                          placeholder="Catatan..."
                        />
                      ) : (
                        <button
                          onClick={() => setEditingNoteId(item.id)}
                          className="text-[9px] text-gray-400 hover:text-[#F53E1B] flex items-center gap-1 font-bold italic truncate">
                          {item.note ? `"${item.note}"` : "+ Catatan"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* FOOTER SIDEBAR - Lebih compact di mobile */}
          <div className="p-5 lg:p-8 bg-white lg:bg-transparent border-t-2 lg:border-none rounded-t-[2rem] lg:rounded-none shadow-2xl lg:shadow-none relative z-30">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-[9px] font-black text-gray-400 uppercase tracking-widest">
                <span>Subtotal</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[9px] font-black text-gray-400 uppercase tracking-widest">
                <span
                  onClick={() => isTaxEnabled && setShowTaxModal(true)}
                  className="cursor-pointer underline decoration-dashed decoration-2 hover:text-gray-600">
                  Pajak ({taxPercent}%)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      const newValue = !isTaxEnabled;
                      setIsTaxEnabled(newValue);

                      try {
                        await updateTax({
                          is_enabled: newValue,
                          tax_percent: taxPercent,
                        });
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    className={`w-8 h-4 rounded-full p-0.5 transition-all duration-300 ${isTaxEnabled ? "bg-[#ff6b6b]" : "bg-gray-300"}`}>
                    <div
                      className={`bg-white w-3 h-3 rounded-full transition-transform duration-300 ${isTaxEnabled ? "translate-x-3.5" : ""}`}
                    />
                  </button>
                  <span>{formatRupiah(tax)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-dashed border-gray-100">
                <span className="text-sm font-black text-gray-900 tracking-tight">
                  TOTAL
                </span>
                <span className="text-xl font-black text-[#F53E1B] tracking-tighter">
                  {formatRupiah(total)}
                </span>
              </div>
            </div>

            <div className="bg-[#ff6b6b] rounded-[1.2rem] overflow-hidden shadow-xl shadow-red-100">
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
                className="w-full bg-black/10 text-white py-2 lg:py-3 px-4 text-[9px] font-black uppercase tracking-[0.1em] outline-none cursor-pointer appearance-none border-b border-white/10 text-center">
                <option value="Dine In" className="text-gray-800">
                  🍽️ MAKAN DI TEMPAT
                </option>
                <option value="Take Away" className="text-gray-800">
                  🥡 BUNGKUS
                </option>
              </select>
              <button
                onClick={() => {
                  if (!sessionActive) {
                    alert("Mulai sesi dulu!");
                    return;
                  }
                  setShowPaymentModal(true);
                }}
                disabled={cart.length === 0}
                className="w-full text-white py-4 lg:py-5 font-black text-xs lg:text-sm uppercase tracking-[0.2em] disabled:opacity-50 active:scale-95 transition-all cursor-pointer relative z-40">
                Bayar Sekarang
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Backdrop Mobile - FIXED Z-INDEX */}
      {isCartOpenMobile && (
        <div
          onClick={() => setIsCartOpenMobile(false)}
          className="lg:hidden fixed inset-0 bg-black/50  z-[140] animate-in fade-in duration-300"
        />
      )}
    </div>
  );
}
