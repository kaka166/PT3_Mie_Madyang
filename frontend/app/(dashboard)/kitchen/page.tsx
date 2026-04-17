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
    // Penyesuaian agar zona waktu lokal tidak membuat tanggal mundur 1 hari saat di-parse ke ISO
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
          {/* Nav */}
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

          {/* Day labels */}
          <div className="grid grid-cols-7 mb-1">
            {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => (
              <div
                key={d}
                className="text-center text-[10px] font-bold text-gray-400 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
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

// Fungsi bantuan untuk menentukan warna badge status
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
      const orderDate = new Date(item.waktu).toISOString().split("T")[0];

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

  return (
    <div className="h-full w-full overflow-y-auto bg-gray-100 p-6 pb-12 font-sans text-gray-800">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-700 mb-1">
          Kitchen Dashboard
        </h1>
        <p className="text-gray-400 text-sm font-medium">
          Real Time, Track Pesanan
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-sm">
        {/* Toolbar Card */}
        <div className="p-4 flex justify-between items-center border-b relative-z[20]">
          <h2 className="text-xl font-bold text-gray-900">Pesanan</h2>

          <div className="flex gap-3">
            {/* Filter Tanggal KUSTOM (Menggantikan input bawaan browser) */}
            <CalendarPicker value={selectedDate} onChange={setSelectedDate} />

            {/* Input Pencarian */}
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
            <thead className="text-gray-400 border-b bg-white">
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
                  className="border-b last:border-0 even:bg-gray-50 hover:bg-gray-100 transition-colors">
                  <td className="py-4 px-4 font-bold text-gray-800">
                    {item.id}
                  </td>
                  <td className="py-4 px-4 text-gray-700">
                    <div>{new Date(item.waktu).toLocaleDateString()}</div>
                    <div>{new Date(item.waktu).toLocaleTimeString()}</div>
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
                    <div className="flex justify-center">
                      <div className="flex bg-gray-100 rounded-full p-1 text-xs font-bold">
                        {/* MASAK */}
                        <button
                          onClick={async () => {
                            await updateOrderStatus(
                              Number(item.id.replace("#", "")),
                              "cooking",
                            );
                            fetchOrders();
                          }}
                          className={`px-3 py-1 rounded-full transition-all ${
                            item.status === "Dimasak"
                              ? "bg-yellow-400 text-white"
                              : "text-gray-500"
                          }`}>
                          Masak
                        </button>

                        {/* SELESAI */}
                        <button
                          onClick={async () => {
                            await updateOrderStatus(
                              Number(item.id.replace("#", "")),
                              "done",
                            );
                            fetchOrders();
                          }}
                          className={`px-3 py-1 rounded-full transition-all ${
                            item.status === "Ready"
                              ? "bg-green-500 text-white"
                              : "text-gray-500"
                          }`}>
                          Selesai
                        </button>
                      </div>
                    </div>
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
            {/* LEFT */}
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

            {/* NUMBER */}
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

            {/* RIGHT */}
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
    </div>
  );
}
