/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState, useRef } from "react";
import { getOrders, updateOrderStatus } from "@/services/penjualanService";
import {
  Search,
  Calendar,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

// --- KOMPONEN CALENDAR PICKER (KUSTOM) ---
function CalendarPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    const d = value ? new Date(value) : new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const daysInMonth = new Date(viewDate.year, viewDate.month + 1, 0).getDate();
  const firstDay = new Date(viewDate.year, viewDate.month, 1).getDay();
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const selectedDay = value ? new Date(value).getDate() : null;
  const selectedMonth = value ? new Date(value).getMonth() : null;
  const selectedYear = value ? new Date(value).getFullYear() : null;

  const prevMonth = () =>
    setViewDate((v) => {
      const m = v.month === 0 ? 11 : v.month - 1;
      const y = v.month === 0 ? v.year - 1 : v.year;
      return { year: y, month: m };
    });
  const nextMonth = () =>
    setViewDate((v) => {
      const m = v.month === 11 ? 0 : v.month + 1;
      const y = v.month === 11 ? v.year + 1 : v.year;
      return { year: y, month: m };
    });

  const selectDay = (day: number) => {
    const d = new Date(viewDate.year, viewDate.month, day);
    const offset = d.getTimezoneOffset();
    const adjustedDate = new Date(d.getTime() - offset * 60 * 1000);
    const iso = adjustedDate.toISOString().split("T")[0];

    onChange(iso);
    setOpen(false);
  };

  const displayLabel = value
    ? new Date(value).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Jakarta",
      })
    : "Hari/Bulan/Tahun";

  return (
    <div ref={ref} className="relative z-50">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between gap-3 bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 font-medium w-48 cursor-pointer">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-500" />
          <span className="truncate">{displayLabel}</span>
        </div>
        {value && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="Hapus Tanggal">
            <X size={14} />
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-gray-200 shadow-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={prevMonth}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
              <ChevronLeft size={16} className="text-gray-600" />
            </button>
            <span className="text-sm font-bold text-gray-700">
              {monthNames[viewDate.month]} {viewDate.year}
            </span>
            <button
              onClick={nextMonth}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
              <ChevronRight size={16} className="text-gray-600" />
            </button>
          </div>

          <div className="grid grid-cols-7 mb-1">
            {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => (
              <div
                key={d}
                className="text-center text-[10px] font-bold text-gray-400 py-1">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1">
            {Array(firstDay)
              .fill(null)
              .map((_, i) => (
                <div key={`e-${i}`} />
              ))}
            {Array(daysInMonth)
              .fill(null)
              .map((_, i) => {
                const day = i + 1;
                const isSelected =
                  day === selectedDay &&
                  viewDate.month === selectedMonth &&
                  viewDate.year === selectedYear;
                const isToday =
                  day === new Date().getDate() &&
                  viewDate.month === new Date().getMonth() &&
                  viewDate.year === new Date().getFullYear();

                return (
                  <button
                    key={day}
                    onClick={() => selectDay(day)}
                    className={`text-center text-sm h-8 w-full rounded-lg font-medium transition-colors
                    ${isSelected ? "bg-red-500 text-white" : ""}
                    ${isToday && !isSelected ? "border border-red-500 text-red-500" : ""}
                    ${!isSelected && !isToday ? "text-gray-700 hover:bg-gray-100" : ""}
                  `}>
                    {day}
                  </button>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
// --- END KOMPONEN KUSTOM ---

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
  const [selectedDate, setSelectedDate] = useState("");
  const [searchId, setSearchId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // --- STATE UNTUK MODAL ---
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [modalStatus, setModalStatus] = useState<string>("");

  const fetchOrders = async () => {
    const data = await getOrders();
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

      const orderDate = date.toLocaleDateString("sv-SE", {
        timeZone: "Asia/Jakarta",
      });
      const matchDate = selectedDate ? orderDate === selectedDate : true;
      const matchSearch = searchId
        ? item.id.replace("#", "").includes(searchId)
        : true;
      return matchDate && matchSearch;
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
    if (!selectedOrder) return;

    // Deklarasikan tipe secara eksplisit sesuai yang diminta backend
    let statusBackend: "cooking" | "done" | "pending";

    // Mapping status dari bahasa Indonesia ke format backend
    if (modalStatus === "Dimasak") {
      statusBackend = "cooking";
    } else if (modalStatus === "Ready") {
      statusBackend = "done";
    } else {
      // Jika statusnya "Antri" atau belum diubah, kita jadikan "pending"
      statusBackend = "pending";
    }

    // Eksekusi fungsi update
    await updateOrderStatus(
      Number(selectedOrder.id.replace("#", "")),
      statusBackend,
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
        <div className="p-4 flex justify-between items-center border-b relative z-20">
          <h2 className="text-xl font-bold text-gray-900">Pesanan</h2>

          <div className="flex gap-3">
            <CalendarPicker value={selectedDate} onChange={setSelectedDate} />
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                size={16}
              />
              <input
                type="text"
                placeholder="Cari Pesanan (ID)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="bg-gray-200 text-gray-700 placeholder-gray-500 pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 font-medium w-44"
              />
            </div>
          </div>
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center">
            <thead className="text-gray-400 border border-neutral-100 bg-white">
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
                    <div>
                      {new Date(item.waktu).toLocaleDateString("id-ID", {
                        timeZone: "Asia/Jakarta",
                      })}
                    </div>
                    <div>
                      {new Date(item.waktu).toLocaleTimeString("id-ID", {
                        timeZone: "Asia/Jakarta",
                      })}
                    </div>
                  </td>
                  <td className="py-4 px-4 font-bold text-gray-800">
                    {item.customer}
                  </td>
                  <td className="py-4 px-4 font-medium">{item.items}</td>
                  <td className="py-4 px-4 font-bold text-gray-800">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(item.harga)}
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
                  <td className="py-4 px-4 text-gray-500 flex justify-center items-center h-full">
                    {/* BUTTON AKSI DIGANTI MENJADI TITIK TIGA */}
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-800">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
