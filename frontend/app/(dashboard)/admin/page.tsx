/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState, useRef } from "react";
import {
  Search,
  Calendar,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  FileText,
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

// --- DUMMY DATA ---
const dummyUsers = [
  { id: "#1", nama: "Hafizh", role: "Admin", status: "Online" },
  { id: "#2", nama: "Haikal", role: "Kitchen", status: "Offline" },
  { id: "#3", nama: "Jonson", role: "Cashier", status: "Offline" },
];

const dummyShifts = [
  { id: "#1", nama: "Hafizh", role: "Admin", mulai: "07.00", selesai: "17.00", durasi: "8:15:29" },
  { id: "#2", nama: "Haikal", role: "Kitchen", mulai: "07.30", selesai: "17.30", durasi: "8:15:29" },
  { id: "#3", nama: "Jonson", role: "Cashier", mulai: "07.30", selesai: "17.30", durasi: "8:15:29" },
];

const dummyExpenses = [
  { id: "OP-1", nama: "Gaji Karyawan", kategori: "Operasional", tanggal: "14-02-26", waktu: "18:22:32", total: 2500000 },
  { id: "OP-2", nama: "", kategori: "", tanggal: "14-02-26", waktu: "18:22:32", total: null },
  { id: "OP-3", nama: "", kategori: "", tanggal: "14-02-26", waktu: "18:22:32", total: null },
  { id: "OP-4", nama: "", kategori: "", tanggal: "14-02-26", waktu: "18:22:32", total: null },
  { id: "OP-5", nama: "", kategori: "", tanggal: "14-02-26", waktu: "18:22:32", total: null },
];

export default function AdminDashboardPage() {
  const [selectedExpenseDate, setSelectedExpenseDate] = useState("");
  const [searchExpense, setSearchExpense] = useState("");

  // Pagination states (Simplified for visuals)
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5; // Hardcoded sesuai UI Mockup

  return (
    <div className="h-full w-full overflow-y-auto bg-[#efefef] p-8 pb-12 font-sans text-gray-800">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#F53E1B] mb-2">
          Admin - Dashboard
        </h1>
        <p className="text-gray-500 font-medium">
          Laporan Pemasukan Mi Madyang
        </p>
      </div>

      {/* SECTION 1: USER */}
      <div className="bg-white rounded-xl shadow-sm mb-8">
        <div className="p-5 border-b">
          <h2 className="text-xl font-bold text-black">User</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-500 border-b bg-white">
              <tr>
                <th className="py-4 px-6 font-medium">ID</th>
                <th className="py-4 px-6 font-medium">Nama</th>
                <th className="py-4 px-6 font-medium">Role</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium text-center">Edit</th>
              </tr>
            </thead>
            <tbody>
              {dummyUsers.map((user, index) => (
                <tr key={index} className="border-b last:border-0 even:bg-[#f9f9f9]">
                  <td className="py-4 px-6 font-bold text-gray-800">{user.id}</td>
                  <td className="py-4 px-6 font-bold text-gray-800">{user.nama}</td>
                  <td className="py-4 px-6 text-gray-600">{user.role}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-bold inline-flex items-center gap-1.5 ${
                        user.status === "Online"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${user.status === "Online" ? "bg-green-600" : "bg-red-600"}`}></span>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center text-gray-400">
                    <button className="hover:text-gray-700 transition-colors">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Footer */}
        <div className="p-4 border-t flex justify-between items-center text-sm bg-white rounded-b-xl">
          <span className="text-gray-500 font-medium">Showing 1-9 of 2810 Transaction</span>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded bg-[#f87171] text-white"><ChevronLeft size={16} /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-[#f87171] text-white shadow-sm font-bold">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-200 text-gray-700 font-bold">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-200 text-gray-700 font-bold">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-200 text-gray-700 font-bold">4</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-200 text-gray-700 font-bold">5</button>
          </div>
        </div>
      </div>

      {/* SECTION 2: SHIFT */}
      <div className="bg-white rounded-xl shadow-sm mb-12">
        <div className="p-5 border-b">
          <h2 className="text-xl font-bold text-black">Shift</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-500 border-b bg-white">
              <tr>
                <th className="py-4 px-6 font-medium">ID</th>
                <th className="py-4 px-6 font-medium">Nama</th>
                <th className="py-4 px-6 font-medium">Role</th>
                <th className="py-4 px-6 font-medium">Waktu Mulai</th>
                <th className="py-4 px-6 font-medium">Waktu Selesai</th>
                <th className="py-4 px-6 font-medium">Durasi</th>
              </tr>
            </thead>
            <tbody>
              {dummyShifts.map((shift, index) => (
                <tr key={index} className="border-b last:border-0 even:bg-[#f9f9f9]">
                  <td className="py-4 px-6 font-bold text-gray-800">{shift.id}</td>
                  <td className="py-4 px-6 font-bold text-gray-800">{shift.nama}</td>
                  <td className="py-4 px-6 text-gray-600">{shift.role}</td>
                  <td className="py-4 px-6 text-gray-600">{shift.mulai}</td>
                  <td className="py-4 px-6 text-gray-600">{shift.selesai}</td>
                  <td className="py-4 px-6 text-gray-600">{shift.durasi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Footer */}
        <div className="p-4 border-t flex justify-between items-center text-sm bg-white rounded-b-xl">
          <span className="text-gray-500 font-medium">Showing 1-9 of 2810 Shift</span>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded bg-[#f87171] text-white"><ChevronLeft size={16} /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-[#f87171] text-white shadow-sm font-bold">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-200 text-gray-700 font-bold">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-200 text-gray-700 font-bold">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-200 text-gray-700 font-bold">4</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-200 text-gray-700 font-bold">5</button>
          </div>
        </div>
      </div>

      {/* DIVIDER LINE (Opsional sesuai gambar, saya gunakan margin saja untuk memisahkan section) */}
      <hr className="border-gray-300 mb-8" />

      {/* SECTION 3: PENGELUARAN OPERASIONAL */}
      <div>
        <button className="flex items-center gap-2 bg-[#f85656] hover:bg-[#e04545] text-white px-4 py-2 rounded-lg font-semibold text-sm mb-4 transition-colors">
          <FileText size={16} />
          Laporkan pengeluaran
        </button>

        <div className="bg-white rounded-xl shadow-sm">
          {/* Toolbar Pengeularan */}
          <div className="p-5 flex justify-between items-center border-b relative z-20">
            <h2 className="text-xl font-bold text-black">Pengeluaran Operasional</h2>

            <div className="flex gap-3">
              {/* Filter Tanggal dengan CalendarPicker yang diminta */}
              <CalendarPicker value={selectedExpenseDate} onChange={setSelectedExpenseDate} />

              {/* Input Pencarian */}
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Cari pengeluaran"
                  value={searchExpense}
                  onChange={(e) => setSearchExpense(e.target.value)}
                  className="bg-gray-200 text-gray-700 placeholder-gray-500 pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 font-medium w-48"
                />
              </div>
            </div>
          </div>

          {/* Tabel Pengeluaran */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-gray-500 border-b bg-white">
                <tr>
                  <th className="py-4 px-6 font-medium">ID</th>
                  <th className="py-4 px-6 font-medium">Nama Pengeluaran</th>
                  <th className="py-4 px-6 font-medium">Kategori</th>
                  <th className="py-4 px-6 font-medium">Perubahan Terakhir</th>
                  <th className="py-4 px-6 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {dummyExpenses.map((expense, index) => (
                  <tr key={index} className="border-b last:border-0 even:bg-[#f9f9f9]">
                    <td className="py-4 px-6 font-bold text-gray-800">{expense.id}</td>
                    <td className="py-4 px-6 text-gray-600">{expense.nama}</td>
                    <td className="py-4 px-6 text-gray-600">{expense.kategori}</td>
                    <td className="py-4 px-6 text-gray-600">
                      {expense.tanggal} <span className="ml-1">{expense.waktu}</span>
                    </td>
                    <td className="py-4 px-6 font-bold text-gray-800">
                      {expense.total 
                        ? new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(expense.total)
                        : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer */}
          <div className="p-4 border-t flex justify-between items-center text-sm bg-white rounded-b-xl">
            <span className="text-gray-500 font-medium">Showing 1-9 of 2810 Transaction</span>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded bg-[#f87171] text-white"><ChevronLeft size={16} /></button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-[#f87171] text-white shadow-sm font-bold">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-200 text-gray-700 font-bold">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-200 text-gray-700 font-bold">3</button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-200 text-gray-700 font-bold">4</button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-200 text-gray-700 font-bold">5</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}