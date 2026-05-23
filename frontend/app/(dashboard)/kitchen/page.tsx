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
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "riwayat"
                    ? "bg-white text-[#F53E1B] shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Riwayat Selesai
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

        {/* Tabel - Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="py-4 px-4 font-medium">Order ID</th>
                <th className="py-4 px-4 font-medium">Waktu</th>
                <th className="py-4 px-4 font-medium">Customer</th>
                <th className="py-4 px-4 font-medium">Total Item</th>
                <th className="py-4 px-4 font-medium">Total Harga</th>
                <th className="py-4 px-4 font-medium">Kondisi</th>
                <th className="py-4 px-4 font-medium">Status</th>
                <th className="py-4 px-4 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => (
                <tr
                  key={index}
                  className="border border-neutral-100 even:bg-gray-50 hover:bg-gray-100 transition-colors">
                  <td className="py-4 px-4 font-bold text-gray-800">
                    {item.id}
                  </td>
                  <td className="py-4 px-4 text-gray-700">
                    {formatTanggal(item.waktu)}
                  </td>
                  <td className="py-4 px-4 font-bold text-gray-800">
                    {item.customer}
                  </td>
                  <td className="py-4 px-4 font-medium">{item.items}</td>
                  <td className="py-4 px-4 font-bold text-gray-800">
                    {formatRupiah(item.harga)}
                  </td>
                  <td className="py-4 px-4 font-bold text-gray-800">
                    {item.kondisi}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-bold inline-block w-24 text-center ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      {item.status === "Antri" && (
                        <button
                          onClick={async () => {
                            const ok = await updateOrderStatus(Number(item.original_id), "cooking");
                            if (ok) {
                              addNotification(`#${String(item.id).replace("#","")} diproses`, `${item.customer} → Dimasak`, "warning", true, "kitchen");
                              fetchOrders();
                            }
                          }}
                          className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-xs font-bold transition-all active:scale-95">
                          🍳 Proses
                        </button>
                      )}
                      {item.status === "Dimasak" && (
                        <button
                          onClick={async () => {
                            const ok = await updateOrderStatus(Number(item.original_id), "done");
                            if (ok) {
                              addNotification(`#${String(item.id).replace("#","")} selesai`, `${item.customer} → Ready`, "success", true, "kitchen");
                              fetchOrders();
                            }
                          }}
                          className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-bold transition-all active:scale-95">
                          ✅ Selesai
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-700">
                        <MoreHorizontal size={18} />
                      </button>
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
            <div key={index} className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-sm">
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
                {item.status === 'Antri' && (
                  <button
                    onClick={async () => {
                      const ok = await updateOrderStatus(Number(item.original_id), "cooking");
                      if (ok) {
                        addNotification(`#${String(item.id).replace("#","")} diproses`, `${item.customer} → Dimasak`, "warning", true, "kitchen");
                        fetchOrders();
                      }
                    }}
                    className="flex-1 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl text-xs font-bold transition-all active:scale-95">
                    🍳 Proses
                  </button>
                )}
                {item.status === 'Dimasak' && (
                  <button
                    onClick={async () => {
                      const ok = await updateOrderStatus(Number(item.original_id), "done");
                      if (ok) {
                        addNotification(`#${String(item.id).replace("#","")} selesai`, `${item.customer} → Ready`, "success", true, "kitchen");
                        fetchOrders();
                      }
                    }}
                    className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-bold transition-all active:scale-95">
                    ✅ Selesai
                  </button>
                )}
                <button
                  onClick={() => handleOpenModal(item)}
                  className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                  <MoreHorizontal size={16} className="text-gray-500" />
                </button>
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
              className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
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
                  className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
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
              className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl flex w-full max-w-4xl h-[550px] overflow-hidden relative">
            {/* PANEL KIRI - Info Pesanan */}
            <div className="w-[35%] bg-white p-8 flex flex-col border-r border-gray-200">
              <h2 className="text-2xl font-bold mb-6 text-black">Pesanan</h2>

              <div className="bg-[#f0f0f0] rounded-xl p-5 mb-8">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 font-medium">ID</p>
                  <p className="text-xl font-bold text-black">
                    {selectedOrder.id}
                  </p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500 font-medium">Kondisi:</p>
                  <p className="font-semibold text-black">
                    {selectedOrder.kondisi}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Total Item:
                  </p>
                  <p className="font-semibold text-black">
                    {selectedOrder.items}
                  </p>
                </div>
              </div>

              <h3 className="font-bold text-lg mb-3 text-black">Status:</h3>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setModalStatus("Dimasak")}
                  className={`py-2.5 rounded-lg font-semibold transition-colors ${
                    modalStatus === "Dimasak"
                      ? "bg-[#e5e5e5] text-black"
                      : "bg-[#f5f5f5] text-gray-500 hover:bg-[#e5e5e5]"
                  }`}>
                  Dimasak
                </button>
                <button
                  onClick={() => setModalStatus("Ready")}
                  className={`py-2.5 rounded-lg font-semibold transition-colors ${
                    modalStatus === "Ready"
                      ? "bg-[#e5e5e5] text-black"
                      : "bg-[#f5f5f5] text-gray-500 hover:bg-[#e5e5e5]"
                  }`}>
                  Ready
                </button>
              </div>
            </div>

            {/* PANEL KANAN - Detail Item */}
            <div className="w-[65%] bg-[#f3f4f6] p-8 flex flex-col relative">
              <button
                onClick={handleCloseModal}
                className="absolute top-6 right-6 bg-[#fca5a5] hover:bg-[#f87171] text-red-900 rounded-lg p-1.5 transition-colors">
                <X size={20} strokeWidth={3} />
              </button>

              <h2 className="text-2xl font-bold mb-6 text-black">Item</h2>

              <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                {(selectedOrder.details ?? []).map(
                  (detail: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-white p-5 rounded-2xl shadow-sm">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-lg font-bold text-black">
                          {detail.nama}
                        </h4>
                        <span className="text-[#e11d48] font-bold text-lg">
                          x {detail.qty}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 font-medium">
                        Note: {detail.note || "-"}
                      </p>
                    </div>
                  ),
                )}
              </div>

              <div className="mt-6 pt-2">
                {statusError && (
                  <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium">
                    {statusError}
                  </div>
                )}
                <button
                  onClick={handleSimpanStatus}
                  className="w-full bg-[#f85656] hover:bg-[#e04545] text-white py-3.5 rounded-xl font-bold text-lg transition-colors shadow-sm">
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
