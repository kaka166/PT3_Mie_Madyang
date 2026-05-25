"use client";
import React, { useEffect, useState, useCallback } from "react";
import { formatRupiah } from "@/utils/formatRupiah";
import { getMenus, getCategories, MenuItem } from "@/services/cashierService";
import { getTax, updateTax } from "@/services/taxService";
import { createOrder, getPemasukan, Pemasukan } from "@/services/penjualanService";
import {
  startSession,
  endSession,
  getActiveSession,
} from "@/services/sessionService";
import { getQrisSettings, QrisSetting } from "@/services/qrisService";
import { X, QrCode } from "lucide-react";
import { addNotification } from "@/services/notificationService";
import { STORAGE_BASE_URL } from "@/config";
import { smartPrint } from "@/services/printService";

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
  const [uangTunai, setUangTunai] = useState<number | "">("");

  const [isTaxEnabled, setIsTaxEnabled] = useState(true);
  const [taxPercent, setTaxPercent] = useState(0);
  const [showTaxModal, setShowTaxModal] = useState(false);

  const [qrisSettings, setQrisSettings] = useState<QrisSetting[]>([]);

  const [isNavigating, setIsNavigating] = useState(false);

  // --- TRANSAKSI RIWAYAT & PRINT STRUK ---
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyList, setHistoryList] = useState<Pemasukan[]>([]);
  const [searchHistory, setSearchHistory] = useState("");
  const [selectedHistoryOrder, setSelectedHistoryOrder] = useState<Pemasukan | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [checkoutSuccessOrder, setCheckoutSuccessOrder] = useState<Pemasukan | null>(null);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await getPemasukan();
      setHistoryList(data || []);
      if (data && data.length > 0) {
        setSelectedHistoryOrder(data[0]);
      }
    } catch (error) {
      console.error("Gagal fetch history:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (showHistoryModal) {
      fetchHistory();
    }
  }, [showHistoryModal]);

  // Cetak struk via print server lokal (auto) atau browser dialog (fallback)
  const printReceipt = async (order: Pemasukan) => {
    let receiptConfig = {};
    try {
      const res = await fetch(`${API_BASE_URL}/receipt-settings`);
      const result = await res.json();
      if (result.success && result.data) {
        receiptConfig = result.data;
      }
    } catch (e) {
      console.error("Gagal get receipt settings:", e);
    }

    const result = await smartPrint({
      no: order.no || "-",
      nama: order.nama || "Guest",
      kasir: order.kasir || "-",
      metode: order.metode || "-",
      waktu: order.waktu || "",
      kondisi: order.kondisi || "-",
      total: order.jumlah || 0,
      tunai: order.tunai,
      kembalian: order.kembalian,
      receipt_config: receiptConfig,
      items: (order.details || []).map((d) => ({
        nama: d.nama,
        qty: d.qty,
        harga: d.harga,
        subtotal: d.subtotal || d.qty * d.harga,
      })),
    });
    if (result === "server") {
      addNotification("Struk Dicetak", "Struk berhasil dicetak via printer", "success", false, "cashier");
    } else if (result === "failed") {
      addNotification("Gagal Cetak", "Tidak bisa mencetak struk", "error", false, "cashier");
    }
    // result === "browser" → sudah terbuka dialog print, tidak perlu notif
  };

  type SessionResult = {
    opening_cash: number;
    total_pemasukan: number;
    total_pengeluaran: number;
    expected_cash: number;
    closing_cash: number;
    selisih: number;
  };

  const [showEndSessionModal, setShowEndSessionModal] = useState(false);
  const [closingCash, setClosingCash] = useState("");
  const [sessionResult, setSessionResult] = useState<SessionResult | null>(
    null,
  );
  const [loadingEnd, setLoadingEnd] = useState(false);

  const [sessionActive, setSessionActive] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const [openingCash, setOpeningCash] = useState("");
  const [showStartSessionModal, setShowStartSessionModal] = useState(false);
  const [loadingStart, setLoadingStart] = useState(false);

  const [showSessionWarning, setShowSessionWarning] = useState(false);
  const [user, setUser] = useState<{role: number; name: string} | null>(null);

  const handleStartSession = async () => {
    const cash = Number(openingCash);

    if (!cash || cash < 0) {
      return false;
    }

    try {
      const res = await startSession(cash);
      setSessionActive(true);
      setActiveSessionId(res.data?.id ?? null);
      setOpeningCash("");
      addNotification("Sesi Dimulai", `Sesi kasir #${res.data?.id} berhasil dimulai dengan uang awal Rp${cash.toLocaleString("id-ID")}`, "success", true, "cashier");
      return true;
    } catch (err: unknown) {
      return false;
    }
  };

  const handleEndSession = () => {
    setShowEndSessionModal(true);
  };

  const handleConfirmEndSession = async (): Promise<SessionResult | null> => {
    const cash = Number(closingCash);

    if (!cash || cash < 0) {
      return null;
    }

    try {
      const res = await endSession(cash);
      addNotification("Sesi Diakhiri", `Sesi kasir berakhir. Uang akhir: Rp${cash.toLocaleString("id-ID")}`, "info", true, "cashier");
      return res.data ?? res;
    } catch (err: any) {
      import("sweetalert2").then(Swal => Swal.default.fire("Gagal Tutup Sesi", err.message || "Terjadi kesalahan", "error"));
      return null;
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
    const isFirstVisit = sessionStorage.getItem("first_visit");

    if (!isFirstVisit) {
      localStorage.removeItem("hasSeenStartSession");
      sessionStorage.setItem("first_visit", "true");
    }

    const init = async () => {
      const userData = localStorage.getItem("user");
      const parsedUser = userData ? JSON.parse(userData) : null;
      setUser(parsedUser);

      const [session] = await Promise.all([
        getActiveSession(),
        fetchTax(),
        loadInitialData().catch(() => {}),
        getQrisSettings().then((qrisRes) => {
          if (qrisRes.success) setQrisSettings(qrisRes.data.filter((q) => q.is_active));
        }).catch((err) => console.error("Gagal fetch QRIS:", err)),
      ]);

      if (session?.data?.id) {
        setSessionActive(true);
        setActiveSessionId(session.data.id);
      } else {
        setSessionActive(false);

        const params = new URLSearchParams(window.location.search);
        const startSession = params.get("startSession");

        // Cashier login → auto-show modal start session
        if (parsedUser?.role === 2 && startSession === "1") {
          setShowStartSessionModal(true);
          window.history.replaceState({}, "", "/cashier");
          return;
        }

        // Owner → never auto-show, only via button
        if (parsedUser?.role === 1) {
          return;
        }

        const hasSeenModal = localStorage.getItem("hasSeenStartSession");

        if (!hasSeenModal) {
          setShowStartSessionModal(true);
          localStorage.setItem("hasSeenStartSession", "true");
        }
      }
    };
    init();
    const intervalId = setInterval(fetchMenu, 5000);
    return () => clearInterval(intervalId);
  }, [loadInitialData]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (sessionActive && !isNavigating) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [sessionActive]);

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
        if (item.qty >= menu.stock) return item;
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
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 mb-4 outline-none focus:border-[#b93b3b] transition-all"
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
                className="flex-1 py-3 bg-[#b93b3b] text-white rounded-xl font-bold shadow-lg shadow-red-100">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {showStartSessionModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl flex overflow-hidden relative">
            {/* 🔥 TOMBOL CLOSE */}
            {user?.role !== 2 && (
              <button
                onClick={() => {
                  setShowStartSessionModal(false);
                  localStorage.setItem("hasSeenStartSession", "true");
                }}
                className="absolute top-4 right-4 bg-red-100 hover:bg-red-200 text-red-500 w-8 h-8 flex items-center justify-center rounded-full font-bold">
                ×
              </button>
            )}
            {/* LEFT */}
            <div className="flex-1 p-8">
              <h2 className="text-2xl font-black mb-6">Mulai Sesi Kasir</h2>

              <label className="text-sm font-bold text-gray-500">
                Uang Modal Awal
              </label>

              <input
                type="text"
                value={formatRupiah(openingCash)}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, "");
                  setOpeningCash(raw);
                }}
                placeholder="Masukkan uang awal"
                className="w-full mt-2 border-2 border-gray-100 rounded-2xl px-4 py-3 outline-none focus:border-[#b93b3b]"
              />
            </div>

            {/* RIGHT */}
            <div className="w-[40%] bg-gray-50 p-8 flex flex-col justify-between">
              <div>
                <h3 className="font-black text-gray-400 uppercase text-sm mb-4">
                  Status
                </h3>
                <p className="text-sm text-gray-500">
                  Silakan masukkan uang awal untuk memulai sesi kasir hari ini.
                </p>
              </div>

              <button
                onClick={async () => {
                  setLoadingStart(true);

                  const success = await handleStartSession();

                  setLoadingStart(false);

                  if (success) {
                    setShowStartSessionModal(false);
                    localStorage.setItem("hasSeenStartSession", "true");
                  }
                }}
                disabled={loadingStart}
                className="w-full bg-[#b93b3b] text-white py-4 rounded-2xl font-black shadow-xl disabled:opacity-50">
                {loadingStart ? "Memproses..." : "Mulai Sesi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSessionWarning && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl">
            <h2 className="text-lg font-black mb-2">Sesi Belum Dimulai</h2>

            <p className="text-sm text-gray-500 mb-6">
              Silakan mulai sesi kasir terlebih dahulu.
            </p>

            <button
              onClick={() => {
                setShowSessionWarning(false);
                setShowStartSessionModal(true);
              }}
              className="w-full bg-[#b93b3b] text-white py-3 rounded-xl font-bold">
              Mulai Sesi
            </button>
          </div>
        </div>
      )}

      {sessionResult && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl flex overflow-hidden">
            {/* LEFT - DATA */}
            <div className="flex-1 p-8">
              <h2 className="text-2xl font-black mb-6">Ringkasan Sesi</h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Uang Awal</span>
                  <span className="font-bold">
                    {formatRupiah(sessionResult.opening_cash)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Total Penjualan</span>
                  <span className="font-bold text-green-600">
                    + {formatRupiah(sessionResult.total_pemasukan)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Pengeluaran</span>
                  <span className="font-bold text-red-500">
                    - {formatRupiah(sessionResult.total_pengeluaran || 0)}
                  </span>
                </div>

                <div className="border-t pt-3 flex justify-between">
                  <span className="font-bold">Seharusnya</span>
                  <span className="font-black">
                    {formatRupiah(sessionResult.expected_cash)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Uang Aktual</span>
                  <span className="font-bold">
                    {formatRupiah(sessionResult.closing_cash)}
                  </span>
                </div>

                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="font-bold">Selisih</span>
                  <span
                    className={`font-black text-lg ${
                      sessionResult.selisih < 0
                        ? "text-red-500"
                        : "text-green-600"
                    }`}>
                    {formatRupiah(sessionResult.selisih)}
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT - STATUS */}
            <div className="w-[40%] bg-gray-50 p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-black text-gray-400 uppercase mb-4">
                  Status
                </h3>

                {sessionResult.selisih === 0 ? (
                  <p className="text-green-600 font-bold">
                    Saldo sesuai dengan modal awal
                  </p>
                ) : sessionResult.selisih < 0 ? (
                  <p className="text-red-500 font-bold">
                    Terdapat selisih kekurangan
                  </p>
                ) : (
                  <p className="text-yellow-500 font-bold">
                    Terdapat selisih kelebihan
                  </p>
                )}
              </div>

              <button
                onClick={() => setSessionResult(null)}
                className="w-full bg-[#b93b3b] text-white py-4 rounded-2xl font-black shadow-xl">
                Tutup
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
                      <span className="font-bold text-[#b93b3b] text-sm">
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
                <div className="flex justify-between text-xs font-bold text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-800">
                    {formatRupiah(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-xs font-bold">
                  <span
                    className={
                      isTaxEnabled ? "text-gray-600" : "text-gray-400"
                    }>
                    Pajak ({taxPercent}%)
                  </span>
                  <span
                    className={
                      isTaxEnabled ? "text-gray-800 font-bold" : "text-gray-400"
                    }>
                    {formatRupiah(tax)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-black text-[#b93b3b]">
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
                  className={`py-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === "QRIS" ? "bg-white border-[#1a1a2e] shadow-xl shadow-slate-200" : "bg-white/50 border-transparent text-gray-400 hover:bg-white hover:border-gray-200"}`}>
                  <span
                    className={`font-black text-sm ${paymentMethod === "QRIS" ? "text-[#1a1a2e]" : "text-gray-400"}`}>
                    QRIS
                  </span>
                </button>
                <button
                  onClick={() => setPaymentMethod("Tunai")}
                  className={`py-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === "Tunai" ? "bg-white border-[#1a1a2e] shadow-xl shadow-slate-200" : "bg-white/50 border-transparent text-gray-400 hover:bg-white hover:border-gray-200"}`}>
                  <span
                    className={`font-black text-sm ${paymentMethod === "Tunai" ? "text-[#1a1a2e]" : "text-gray-400"}`}>
                    TUNAI
                  </span>
                </button>
              </div>

              <div className="flex-1 min-h-[180px] bg-white rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-6 mb-8 shadow-inner">
                {paymentMethod === "QRIS" ? (
                  <div className="text-center">
                    {qrisSettings.length > 0 ? (
                      <>
                        <img
                          src={`${STORAGE_BASE_URL}/qris/${qrisSettings[0].gambar_qris}`}
                          className="w-40 h-40 object-contain rounded-2xl mb-3"
                          alt="QRIS"
                        />
                        <p className="text-[10px] font-bold text-gray-500">{qrisSettings[0].nama_bank} - {qrisSettings[0].nama_pemilik}</p>
                      </>
                    ) : (
                      <div className="text-center">
                        <QrCode size={48} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Scan QRIS
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center w-full">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                      Terima Tunai
                    </p>
                    <p className="text-2xl font-black text-gray-800 mb-4">
                      {formatRupiah(total)}
                    </p>
                    <input
                      type="number"
                      placeholder="Masukkan Uang Diterima"
                      value={uangTunai}
                      onChange={(e) => setUangTunai(e.target.value ? Number(e.target.value) : "")}
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-red-100 rounded-xl px-4 py-3 outline-none text-center font-bold text-lg"
                    />
                    {typeof uangTunai === "number" && uangTunai >= total && (
                      <p className="mt-2 text-sm font-bold text-green-600">
                        Kembalian: {formatRupiah(uangTunai - total)}
                      </p>
                    )}
                    {typeof uangTunai === "number" && uangTunai > 0 && uangTunai < total && (
                      <p className="mt-2 text-sm font-bold text-red-500">
                        Uang kurang {formatRupiah(total - uangTunai)}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <button
                  disabled={paymentMethod === "Tunai" && (typeof uangTunai !== "number" || uangTunai < total)}
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
                      setIsNavigating(true);
                      addNotification(
                        "Pesanan Terkirim!",
                        `${customerName || "Guest"} - ${cart.reduce((s, i) => s + i.qty, 0)} item telah masuk ke kitchen`,
                        "success",
                        true,
                        "cashier"
                      );

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

                      const dt = new Date(result.data.tanggal);
                      const dateStr = dt.getFullYear() + String(dt.getMonth()+1).padStart(2,'0') + String(dt.getDate()).padStart(2,'0');
                      const formattedNo = "#" + dateStr + String(result.data.id).padStart(3,'0');

                      const newOrder: Pemasukan = {
                        no: formattedNo,
                        nama: customerName || "Guest",
                        waktu: result.data.tanggal,
                        kasir: user?.name || "Unknown",
                        metode: paymentMethod,
                        jumlah: result.data.total,
                        kondisi: orderType === 'Dine In' ? 'Makan di Tempat' : 'Bungkus',
                        tunai: paymentMethod === 'Tunai' && typeof uangTunai === 'number' ? uangTunai : undefined,
                        kembalian: paymentMethod === 'Tunai' && typeof uangTunai === 'number' ? uangTunai - total : undefined,
                        details: result.data.detail.map((d: any) => ({
                          nama: d.menu.nama_menu,
                          qty: d.qty,
                          note: d.note || "",
                          harga: d.harga,
                          subtotal: d.subtotal
                        }))
                      };

                      setCheckoutSuccessOrder(newOrder);
                      setShowPaymentModal(false);
                      setCart([]);
                      setCustomerName("");
                      setTableNumber("");
                      setUangTunai("");
                    }
                  }}
                  className="w-full bg-[#b93b3b] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-red-200/50 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  Selesaikan Pesanan
                </button>
                <button
                  onClick={() => {
                    setIsNavigating(true);
                    setShowPaymentModal(false);
                  }}
                  className="w-full text-gray-400 font-bold py-2 hover:text-gray-600 transition-colors">
                  Kembali
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NOTA SUKSES */}
      {checkoutSuccessOrder && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-300 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-black text-gray-800 mb-2">Pesanan Berhasil!</h2>
            <p className="text-gray-500 mb-8 font-medium">Order {checkoutSuccessOrder.no} telah diteruskan ke dapur.</p>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  printReceipt(checkoutSuccessOrder);
                }}
                className="w-full bg-[#b93b3b] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-red-200/50 active:scale-95 transition-all">
                Cetak Struk
              </button>
              
              <button
                onClick={() => {
                  setCheckoutSuccessOrder(null);
                }}
                className="w-full text-gray-400 font-bold py-3 hover:text-gray-600 transition-colors">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {showEndSessionModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl flex overflow-hidden relative">
            {/* 🔥 TOMBOL CLOSE */}
            <button
              onClick={() => {
                setShowEndSessionModal(false);
              }}
              className="absolute top-4 right-4 bg-red-100 hover:bg-red-200 text-red-500 w-8 h-8 flex items-center justify-center rounded-full font-bold">
              ×
            </button>
            {/* LEFT */}
            <div className="flex-1 p-8">
              <h2 className="text-2xl font-black mb-6">Tutup Sesi Kasir</h2>

              <label className="text-sm font-bold text-gray-500">
                Uang Akhir (Fisik)
              </label>

              <input
                type="text"
                inputMode="numeric"
                value={formatRupiah(closingCash)}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, "");
                  setClosingCash(raw);
                }}
                placeholder="Masukkan uang akhir"
                className="w-full mt-2 border-2 border-gray-100 rounded-2xl px-4 py-3 outline-none focus:border-red-400"
              />
            </div>

            {/* RIGHT */}
            <div className="w-[40%] bg-gray-50 p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-black text-gray-400 uppercase mb-4">
                  Konfirmasi
                </h3>

                <p className="text-sm text-gray-500">
                  Pastikan uang fisik sudah dihitung sebelum menutup sesi.
                </p>
              </div>

              <button
                onClick={async () => {
                  setLoadingEnd(true);

                  const data = await handleConfirmEndSession();

                  setLoadingEnd(false);

                  if (data) {
                    setSessionResult(data);
                    setShowEndSessionModal(false);
                    setSessionActive(false);
                    setActiveSessionId(null);
                    setClosingCash("");
                    localStorage.setItem("lastSessionRecap", JSON.stringify(data));
                  }
                }}
                disabled={loadingEnd}
                className="w-full bg-red-500 text-white py-4 rounded-2xl font-black shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
                {loadingEnd ? "Memproses..." : "Konfirmasi Tutup"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 flex flex-col min-w-0 bg-white lg:bg-transparent relative z-10 overflow-hidden">
        <header className="bg-white px-4 py-3 flex flex-col gap-3 border-b border-gray-100 shadow-sm">
          {/* ROW 1 - Logo + Cart (mobile) */}
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-black text-[#b93b3b] tracking-tighter uppercase italic">
              Ma-Dyang <span className="text-gray-300 not-italic">POS</span>
            </h1>
            <button
              onClick={() => setIsCartOpenMobile(true)}
              className="lg:hidden relative p-3 bg-gray-50 rounded-2xl active:scale-90 transition-all border border-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#b93b3b]"
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
                <span className="absolute -top-1 -right-1 bg-[#b93b3b] text-white text-[10px] w-6 h-6 flex items-center justify-center rounded-full border-4 border-white font-black">
                  {cart.length}
                </span>
              )}
            </button>
          </div>

          {/* ROW 2 - Search + Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* SEARCH */}
            <div className="flex-1 min-w-[160px] relative">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-4 pr-4 py-2.5 bg-gray-50 border-2 border-transparent focus:border-[#b93b3b]/20 focus:bg-white rounded-xl text-sm font-bold outline-none transition-all"
                placeholder="Cari menu..."
              />
            </div>

            {/* RIWAYAT */}
            <button
              onClick={() => setShowHistoryModal(true)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 whitespace-nowrap"
            >
              Riwayat
            </button>

            {/* SESSION STATUS */}
            {sessionActive ? (
              <>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-2 rounded-xl whitespace-nowrap">
                  ✓ Sesi Aktif
                </span>
                <button
                  onClick={handleEndSession}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 whitespace-nowrap">
                  Tutup Sesi
                </button>
              </>
            ) : (
              <>
                <span className="text-xs text-gray-400 italic whitespace-nowrap hidden sm:inline">
                  Belum ada sesi
                </span>
                <button
                  onClick={() => setShowStartSessionModal(true)}
                  className="bg-[#b93b3b] hover:bg-[#a12e2e] text-white px-3 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 whitespace-nowrap">
                  Mulai Sesi
                </button>
              </>
            )}
          </div>
        </header>

        <div className="flex-1 flex flex-col p-4 md:p-8 gap-8 overflow-hidden">
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar flex-shrink-0">
            {categories.map((c, i) => (
              <button
                key={i}
                onClick={() => setFilter(c)}
                className={`whitespace-nowrap px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${filter === c ? "bg-[#1a1a2e] text-white shadow-lg" : "bg-white border-2 border-gray-100 text-gray-500 hover:border-[#b93b3b]/30 hover:text-[#b93b3b]"}`}>
                {c}
              </button>
            ))}
          </div>

          {/* Container Menu - iso di scroll */}
          <div className="flex-1 overflow-y-auto no-scrollbar pb-32 lg:pb-8 px-1">
            {/* Grid diset 2 kolom mobile, 3 kolom tablet, dan 4 kolom desktop sesuai permintaan */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredMenus.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white p-4 rounded-[2rem] shadow-sm hover:shadow-2xl border-2 border-transparent hover:border-red-50 transition-all active:scale-95 flex flex-col">
                  <div className="relative aspect-square w-full mb-4 rounded-[1.5rem] overflow-hidden bg-gray-50">
                    <img
                      src={
                        item.gambar
                          ? `${STORAGE_BASE_URL}/menu/${item.gambar}`
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
                    <span className="text-[#b93b3b] font-black text-base">
                      {formatRupiah(item.price)}
                    </span>
                    <button
                      onClick={() => {
                        if (!sessionActive) {
                          setShowSessionWarning(true);
                          return;
                        }
                        addToCart(item);
                      }}
                      disabled={item.stock === 0}
                      className="w-10 h-10 rounded-2xl bg-red-50 text-[#b93b3b] flex items-center justify-center font-black text-xl hover:bg-[#b93b3b] hover:text-white transition-all shadow-sm active:scale-90">
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
              <span className="text-[9px] bg-[#b93b3b] text-white px-2 py-0.5 rounded-full shadow-md uppercase tracking-widest">
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
                  <p className="text-[10px] lg:text-xs font-black text-[#b93b3b] mb-3">
                    {formatRupiah(item.price * item.qty)}
                  </p>

                  <div className="flex justify-between items-center relative z-10">
                    <div className="flex items-center bg-gray-50 rounded-lg p-0.5 border border-gray-100">
                      <button
                        onClick={() => decreaseQty(item.id)}
                        className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500 font-black text-base">
                        −
                      </button>
                      {/* 🔥 INI DIGANTI */}
                      <input
                        type="text"
                        inputMode="numeric"
                        value={item.qty}
                        onChange={(e) => {
                          const value =
                            parseInt(e.target.value.replace(/\D/g, "")) || 0;

                          setCart((prev) =>
                            prev.map((cartItem) => {
                              if (cartItem.id !== item.id) return cartItem;

                              const menu = menus.find((m) => m.id === item.id);
                              if (!menu) return cartItem;

                              // ❗ batas max stok
                              if (value > menu.stock) {
                                return { ...cartItem, qty: menu.stock };
                              }

                              // ❗ minimal 1
                              if (value < 1) {
                                return cartItem;
                              }

                              return { ...cartItem, qty: value };
                            }),
                          );
                        }}
                        className="text-[10px] font-black w-10 text-center bg-transparent outline-none"
                      />
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
                          className="text-[9px] w-full border-b border-[#b93b3b] bg-transparent outline-none py-1 font-bold italic"
                          placeholder="Catatan..."
                        />
                      ) : (
                        <button
                          onClick={() => setEditingNoteId(item.id)}
                          className="text-[9px] text-gray-400 hover:text-[#b93b3b] flex items-center gap-1 font-bold italic truncate">
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
              <div className="flex justify-between text-xs font-bold text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold text-gray-800">
                  {formatRupiah(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-xs font-bold text-gray-600">
                <span
                  onClick={() => isTaxEnabled && setShowTaxModal(true)}
                  className={`cursor-pointer font-bold text-xs ${
                    isTaxEnabled
                      ? "text-gray-600 hover:text-[#b93b3b]"
                      : "text-gray-400"
                  }`}>
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
                    className={`w-8 h-4 rounded-full p-0.5 transition-all duration-300 ${isTaxEnabled ? "bg-[#b93b3b]" : "bg-gray-300"}`}>
                    <div
                      className={`bg-white w-3 h-3 rounded-full transition-transform duration-300 ${isTaxEnabled ? "translate-x-3.5" : ""}`}
                    />
                  </button>
                  <span
                    className={`font-bold ${isTaxEnabled ? "text-gray-800" : "text-gray-400"}`}>
                    {formatRupiah(tax)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-dashed border-gray-100">
                <span className="text-sm font-black text-gray-900 tracking-tight">
                  TOTAL
                </span>
                <span className="text-xl font-black text-[#b93b3b] tracking-tighter">
                  {formatRupiah(total)}
                </span>
              </div>
            </div>

            <div className="bg-[#b93b3b] rounded-[1.2rem] overflow-hidden shadow-xl shadow-red-100">
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
                    setShowSessionWarning(true);
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

      {/* ================= MODAL RIWAYAT TRANSAKSI ================= */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl w-full max-w-5xl h-[600px] flex flex-col md:flex-row shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* PANEL KIRI: LIST NOTA / RIWAYAT */}
            <div className="w-full md:w-[35%] bg-gray-50 border-r border-gray-100 flex flex-col h-full">
              <div className="p-6 border-b border-gray-200/60">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-black text-gray-800">
                    Riwayat Transaksi
                  </h3>
                  <button 
                    onClick={() => setShowHistoryModal(false)}
                    className="md:hidden text-gray-400 hover:text-gray-600 transition"
                  >
                    <X size={20} />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Cari Customer / ID..."
                  value={searchHistory}
                  onChange={(e) => setSearchHistory(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#b93b3b] transition-all text-xs font-bold text-gray-700"
                />
              </div>

              {/* List Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
                {loadingHistory ? (
                  <div className="h-full flex items-center justify-center text-gray-400 font-bold text-xs uppercase tracking-widest animate-pulse">
                    Memuat...
                  </div>
                ) : historyList.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 p-6">
                    <span className="text-2xl mb-2">📄</span>
                    <p className="text-[10px] font-black uppercase tracking-widest">Belum ada transaksi</p>
                  </div>
                ) : (
                  historyList
                    .filter(
                      (item) =>
                        item.nama.toLowerCase().includes(searchHistory.toLowerCase()) ||
                        item.no.toLowerCase().includes(searchHistory.toLowerCase())
                    )
                    .map((item) => (
                      <button
                        key={item.no}
                        onClick={() => setSelectedHistoryOrder(item)}
                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex flex-col gap-1 ${
                          selectedHistoryOrder?.no === item.no
                            ? "bg-white border-[#b93b3b] shadow-lg shadow-red-50/50"
                            : "bg-white border-transparent hover:border-gray-200"
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="font-black text-xs text-gray-800">
                            {item.no}
                          </span>
                          <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {item.kondisi}
                          </span>
                        </div>
                        <div className="flex justify-between items-center w-full">
                          <span className="font-bold text-sm text-gray-600 truncate max-w-[120px]">
                            {item.nama}
                          </span>
                          <span className="font-black text-sm text-[#b93b3b]">
                            {formatRupiah(item.jumlah)}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {item.waktu}
                        </span>
                      </button>
                    ))
                )}
              </div>
            </div>

            {/* PANEL KANAN: DETAIL NOTA */}
            <div className="flex-1 bg-white flex flex-col h-full relative">
              {/* Close Button Desktop */}
              <button
                onClick={() => setShowHistoryModal(false)}
                className="hidden md:flex absolute top-6 right-6 bg-red-50 hover:bg-red-100 text-red-500 rounded-full w-8 h-8 items-center justify-center font-bold transition-colors"
              >
                ×
              </button>

              {selectedHistoryOrder ? (
                <div className="flex-1 flex flex-col h-full overflow-hidden p-8">
                  {/* Header Detail */}
                  <div className="border-b border-gray-100 pb-5 mb-5 flex-shrink-0">
                    <div className="flex items-center gap-3 mb-4">
                      <h2 className="text-2xl font-black text-gray-800">
                        Detail Transaksi
                      </h2>
                      <span className="font-black text-[#b93b3b] bg-red-50 px-3 py-1 rounded-full text-xs">
                        {selectedHistoryOrder.no}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold text-gray-500">
                      <div>
                        <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Pelanggan</p>
                        <p className="text-gray-800 text-sm mt-0.5">{selectedHistoryOrder.nama}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Waktu</p>
                        <p className="text-gray-800 mt-0.5">{selectedHistoryOrder.waktu}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Kasir</p>
                        <p className="text-gray-800 mt-0.5">{selectedHistoryOrder.kasir}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Metode</p>
                        <p className="text-gray-800 mt-0.5">{selectedHistoryOrder.metode}</p>
                      </div>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-5 no-scrollbar">
                    {selectedHistoryOrder.details.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 flex justify-between items-center transition hover:bg-gray-50"
                      >
                        <div>
                          <p className="font-bold text-sm text-gray-800">{item.nama}</p>
                          <p className="text-[10px] text-gray-400 font-bold mt-1">
                            {item.qty}x @ {formatRupiah(item.harga)}
                          </p>
                          {item.note && (
                            <p className="text-[10px] text-red-500 font-semibold italic mt-0.5">
                              * Note: &quot;{item.note}&quot;
                            </p>
                          )}
                        </div>
                        <span className="font-black text-sm text-gray-800">
                          {formatRupiah(item.subtotal || item.qty * item.harga)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Ringkasan Total */}
                  <div className="border-t border-dashed border-gray-200 pt-5 flex-shrink-0">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Pembayaran</p>
                        <p className="text-3xl font-black text-gray-900 tracking-tight mt-0.5">
                          {formatRupiah(selectedHistoryOrder.jumlah)}
                        </p>
                      </div>

                      <button
                        onClick={() => printReceipt(selectedHistoryOrder)}
                        className="bg-[#b93b3b] hover:bg-[#e85a5a] text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-red-100 active:scale-95 transition-all flex items-center gap-2"
                      >
                        🖨️ Cetak Struk
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400">
                  <span className="text-4xl mb-3">🔍</span>
                  <p className="text-sm font-black uppercase tracking-wider">
                    Pilih transaksi dari daftar di samping kiri
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
