/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState, useRef } from "react";
import { getOrders, updateOrderStatus } from "@/services/penjualanService";
import {
  Search,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  Check,
} from "lucide-react";
import { formatTanggal } from "@/utils/formatTanggal";
import { formatRupiah } from "@/utils/formatRupiah";
import { addNotification } from "@/services/notificationService";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Antri":
      return "bg-gray-300 text-gray-600";
    case "Dimasak":
      return "bg-yellow-400 text-yellow-800";
    case "Ready":
      return "bg-green-300 text-green-800";
    default:
      return "bg-gray-200 text-gray-700";
  }
};

export default function KitchenDashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [searchId, setSearchId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState<"aktif" | "riwayat">("aktif");

  // --- STATE UNTUK MODAL ---
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [modalStatus, setModalStatus] = useState<string>("");
  const [statusError, setStatusError] = useState("");
  const [confirmSelesai, setConfirmSelesai] = useState<any | null>(null);
  const previousOrderIds = useRef<Set<string>>(new Set());

  const fetchOrders = async () => {
    const data = await getOrders();
    const currentIds = new Set(data.map((o: any) => o.id));

    if (previousOrderIds.current.size > 0) {
      const newOrderIds = [...currentIds].filter(
        (id) => !previousOrderIds.current.has(id)
      );
      if (newOrderIds.length > 0) {
        newOrderIds.forEach((id) => {
          const order = data.find((o: any) => o.id === id);
          if (order) {
            addNotification(
              "Pesanan Baru!",
              `#${order.id} - ${order.customer} (${order.items} item)`,
              "success",
              true,
              "kitchen"
            );
          }
        });
      }
      const removedOrderIds = [...previousOrderIds.current].filter(
        (id) => !currentIds.has(id)
      );
      if (removedOrderIds.length > 0) {

      }
    }

    previousOrderIds.current = currentIds;
    setOrders(data);
  };

  useEffect(() => {
    const load = async () => {
      await fetchOrders();
    };

    load();

    const interval = setInterval(() => {
      load();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const filteredOrders = [...orders]
    .sort((a, b) => new Date(b.waktu).getTime() - new Date(a.waktu).getTime())
    .filter((item) => {
      const date = new Date(item.waktu);

      const matchSearch = searchId
        ? String(item.id).replace("#", "").includes(searchId)
        : true;

      const matchTab =
        activeTab === "aktif"
          ? item.status === "Antri" || item.status === "Dimasak"
          : item.status === "Ready";

      return matchSearch && matchTab;
    });

  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // --- FUNGSI MODAL ---
  const handleOpenModal = (order: any) => {
    setSelectedOrder(order);
    // Atur default status di modal sesuai dengan status order saat ini
    setModalStatus(order.status === "Antri" ? "Dimasak" : order.status);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setModalStatus("");
  };

  const handleSimpanStatus = async () => {
    setStatusError("");
    if (!selectedOrder) return;

    let statusBackend: "cooking" | "done" | "pending";

    if (modalStatus === "Dimasak") {
      statusBackend = "cooking";
    } else if (modalStatus === "Ready") {
      statusBackend = "done";
    } else {
      statusBackend = "pending";
    }

    const ok = await updateOrderStatus(
      Number(selectedOrder.original_id),
      statusBackend,
    );

    if (!ok) {
      setStatusError("Gagal memperbarui status pesanan");
      return;
    }

    addNotification(
      `Status #${String(selectedOrder.id).replace("#", "")} diperbarui`,
      `${selectedOrder.customer} → ${modalStatus}`,
      modalStatus === "Ready" ? "success" : "warning",
      true,
      "kitchen"
    );

    fetchOrders();
    handleCloseModal();
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-gray-100 p-6 pb-12 font-sans text-gray-800">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#F53E1B] mb-1">
          Kitchen Dashboard
        </h1>
        <p className="text-gray-400 text-sm font-medium">
          Real Time, Track Pesanan
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-sm">
        {/* Toolbar Card */}
        <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-b relative z-20">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <h2 className="text-xl font-bold text-gray-900">Pesanan</h2>
            
            {/* Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => {
                  setActiveTab("aktif");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "aktif"
                    ? "bg-white text-[#F53E1B] shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Pesanan Aktif
              </button>
              <button
                onClick={() => {
                  setActiveTab("riwayat");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex flex-col items-center sm:flex-row sm:gap-1 ${
                  activeTab === "riwayat"
                    ? "bg-white text-[#F53E1B] shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Riwayat Selesai <span className="text-[10px] font-normal opacity-75">(24 Jam Terakhir)</span>
              </button>
            </div>
          </div>

          <div className="flex gap-3 w-full sm:w-auto justify-end">
            <div className="relative w-full sm:w-auto">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                size={16}
              />
              <input
                type="text"
                placeholder="Cari Pesanan (ID)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="bg-gray-200 text-gray-700 placeholder-gray-500 pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 font-medium w-full sm:w-44"
              />
            </div>
          </div>
        </div>

        {/* Kanban Board / Quick Summary */}
        {activeTab === "aktif" && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 border-b bg-white">
            {/* Kolom Antri */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 min-h-[80px] custom-scrollbar">
              <h3 className="font-bold text-gray-700 mb-3 sticky top-0 bg-gray-50 py-1">Pesanan Selanjutnya</h3>
              <div className="space-y-3">
                {orders.filter(o => o.status === "Antri").map((order, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold text-gray-800">{order.id}</p>
                      <p className="text-xs font-semibold text-gray-500">{order.customer}</p>
                    </div>
                    <ul className="text-sm space-y-1.5">
                      {(order.details || []).map((d: any, i: number) => (
                        <li key={i} className="flex justify-between text-gray-700">
                          <span><span className="font-bold text-[#F53E1B]">{d.qty}x</span> {d.nama}</span>
                          {d.note && <span className="text-xs text-gray-400 italic bg-gray-50 px-1.5 rounded">{d.note}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Kolom Dimasak */}
            <div className="bg-orange-50 rounded-xl p-4 border border-orange-100 min-h-[80px] custom-scrollbar">
              <h3 className="font-bold text-orange-800 mb-3 sticky top-0 bg-orange-50 py-1">Pesanan Dimasak</h3>
              <div className="space-y-3">
                {orders.filter(o => o.status === "Dimasak").map((order, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg shadow-sm border border-orange-100">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold text-gray-800">{order.id}</p>
                      <p className="text-xs font-semibold text-gray-500">{order.customer}</p>
                    </div>
                    <ul className="text-sm space-y-1.5">
                      {(order.details || []).map((d: any, i: number) => (
                        <li key={i} className="flex justify-between text-gray-700">
                          <span><span className="font-bold text-[#F53E1B]">{d.qty}x</span> {d.nama}</span>
                          {d.note && <span className="text-xs text-orange-400 italic bg-orange-50 px-1.5 rounded">{d.note}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>


          </div>
        )}

        {/* Tabel - Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-5 py-3.5 font-medium">Order ID</th>
                <th className="px-5 py-3.5 font-medium">Waktu</th>
                <th className="px-5 py-3.5 font-medium">Customer</th>
                <th className="px-5 py-3.5 font-medium">Total Item</th>
                <th className="px-5 py-3.5 font-medium">Total Harga</th>
                <th className="px-5 py-3.5 font-medium">Kondisi</th>
                <th className="px-5 py-3.5 font-medium">Status</th>
                <th className="px-5 py-3.5 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => (
                <tr key={index} onClick={() => handleOpenModal(item)} className="even:bg-gray-50 odd:bg-white hover:bg-red-50 transition-colors cursor-pointer">
                  <td className="px-5 py-3.5 font-bold text-gray-800">
                    {item.id}
                  </td>
                  <td className="px-5 py-3.5 text-gray-700">
                    {formatTanggal(item.waktu)}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-gray-800">
                    {item.customer}
                  </td>
                  <td className="px-5 py-3.5 font-medium">{item.items}</td>
                  <td className="px-5 py-3.5 font-bold text-gray-800">
                    {formatRupiah(item.harga)}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-gray-800">
                    {item.kondisi}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-bold inline-flex items-center w-24 text-center ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">
                    <div className="flex items-center gap-2">
                      {item.status === "Antri" ? (
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            const ok = await updateOrderStatus(Number(item.original_id), "cooking");
                            if (ok) {
                              addNotification(`#${String(item.id).replace("#","")} diproses`, `${item.customer} → Dimasak`, "warning", true, "kitchen");
                              fetchOrders();
                            }
                          }}
                          className="min-w-[88px] inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-xs font-bold transition-all active:scale-95">
                          <Play size={12} fill="currentColor" /> Proses
                        </button>
                      ) : (
                        <button
                          disabled={item.status === "Ready"}
                          onClick={(e) => { e.stopPropagation(); setConfirmSelesai(item); }}
                          className={`min-w-[88px] inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-center ${
                            item.status === "Dimasak"
                              ? "bg-green-500 hover:bg-green-600 text-white active:scale-95"
                              : "bg-gray-200 text-gray-400 cursor-not-allowed"
                          }`}>
                          <Check size={14} /> Selesai
                        </button>
                      )}
                      <span className="text-gray-300">
                        <MoreHorizontal size={18} />
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3 px-2 py-4">
          {currentData.map((item, index) => (
            <div key={index} onClick={() => handleOpenModal(item)} className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-sm cursor-pointer active:scale-[0.99] transition-transform">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-gray-800 text-base">{item.id}</p>
                  <p className="text-sm font-semibold text-gray-600">{item.customer}</p>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${getStatusBadge(item.status)}`}>
                  {item.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                <span>{formatTanggal(item.waktu)}</span>
                <span>{item.items} item</span>
                <span className="font-bold text-gray-700">{formatRupiah(item.harga)}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.status === 'Antri' ? (
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      const ok = await updateOrderStatus(Number(item.original_id), "cooking");
                      if (ok) {
                        addNotification(`#${String(item.id).replace("#","")} diproses`, `${item.customer} → Dimasak`, "warning", true, "kitchen");
                        fetchOrders();
                      }
                    }}
                    className="flex-1 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl text-xs font-bold transition-all active:scale-95 inline-flex items-center justify-center gap-1.5">
                    <Play size={12} fill="currentColor" /> Proses
                  </button>
                ) : (
                  <button
                    disabled={item.status === "Ready"}
                    onClick={(e) => { e.stopPropagation(); setConfirmSelesai(item); }}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all inline-flex items-center justify-center gap-1.5 ${
                      item.status === 'Dimasak'
                        ? "bg-green-500 hover:bg-green-600 text-white active:scale-95"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}>
                    <Check size={14} /> Selesai
                  </button>
                )}
                <span className="p-2.5 bg-gray-100 rounded-xl">
                  <MoreHorizontal size={16} className="text-gray-400" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer & Pagination */}
        <div className="p-4 border-t flex justify-between items-center text-sm text-gray-500 bg-white">
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-500">
              Showing {totalItems === 0 ? 0 : startIndex + 1}-
              {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems}
            </span>

            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-gray-100 px-2 py-1 rounded text-sm focus:outline-none">
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={40}>40</option>
            </select>
          </div>
          <div className="flex items-center gap-1.5 font-bold">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`w-9 h-9 flex items-center justify-center rounded transition-colors ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}>
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={i}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 flex items-center justify-center rounded transition-colors ${
                    currentPage === page
                      ? "bg-red-500 text-white shadow-sm"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}>
                  {page}
                </button>
              );
            })}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalPages === 0}
              className={`w-9 h-9 flex items-center justify-center rounded transition-colors ${
                currentPage === totalPages || totalPages === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* --- KOMPONEN POP UP MODAL --- */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4" onClick={handleCloseModal}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-black text-gray-900">#{selectedOrder.id}</h2>
                <p className="text-sm font-bold text-gray-500 mt-0.5">{selectedOrder.customer}</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            {/* BODY */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {/* Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Kondisi</p>
                  <p className="text-sm font-bold text-gray-800">{selectedOrder.kondisi}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Item</p>
                  <p className="text-sm font-bold text-gray-800">{selectedOrder.items}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total</p>
                  <p className="text-sm font-bold text-gray-800">{formatRupiah(selectedOrder.harga)}</p>
                </div>
              </div>

              {/* Daftar Item */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Daftar Item</h3>
                <div className="space-y-2">
                  {(selectedOrder.details ?? []).map((detail: any, idx: number) => (
                    <div key={idx} className="flex items-start justify-between bg-gray-50 rounded-xl px-4 py-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">{detail.nama}</p>
                        {detail.note && (
                          <p className="text-xs text-gray-400 font-medium mt-0.5">Note: {detail.note}</p>
                        )}
                      </div>
                      <span className="text-sm font-black text-[#F53E1B] ml-3 shrink-0">x{detail.qty}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ubah Status */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Ubah Status</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => setModalStatus("Dimasak")}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                      modalStatus === "Dimasak"
                        ? "bg-yellow-400 text-yellow-900 shadow-sm ring-2 ring-yellow-500 ring-offset-2"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}>
                    Dimasak
                  </button>
                  <button
                    onClick={() => setModalStatus("Ready")}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                      modalStatus === "Ready"
                        ? "bg-green-400 text-green-900 shadow-sm ring-2 ring-green-500 ring-offset-2"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}>
                    Ready
                  </button>
                </div>
              </div>

              {statusError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium">
                  {statusError}
                </div>
              )}
            </div>

            {/* FOOTER */}
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={handleCloseModal}
                className="flex-1 py-3 rounded-xl font-bold text-sm bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all active:scale-[0.98]">
                Tutup
              </button>
              <button
                onClick={handleSimpanStatus}
                className="flex-[2] py-3 rounded-xl font-bold text-sm bg-[#F53E1B] hover:bg-[#d93515] text-white transition-all active:scale-[0.98] shadow-sm">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
      {/* --- KOMPONEN POP UP KONFIRMASI SELESAI --- */}
      {confirmSelesai && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Konfirmasi Selesai</h3>
            <p className="text-gray-600 mb-6">
              Yakin pesanan <span className="font-bold text-black">{confirmSelesai.id}</span> dari <span className="font-bold text-black">{confirmSelesai.customer}</span> sudah selesai?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setConfirmSelesai(null)}
                className="px-5 py-2.5 rounded-xl font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={async () => {
                  const item = confirmSelesai;
                  setConfirmSelesai(null);
                  const ok = await updateOrderStatus(Number(item.original_id), "done");
                  if (ok) {
                    addNotification(`#${String(item.id).replace("#","")} selesai`, `${item.customer} → Ready`, "success", true, "kitchen");
                    fetchOrders();
                  }
                }}
                className="px-5 py-2.5 rounded-xl font-bold bg-green-500 hover:bg-green-600 text-white shadow-sm transition-colors"
              >
                Ya, Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
