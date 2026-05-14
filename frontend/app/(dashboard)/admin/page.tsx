/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState, useRef } from "react";
import {
  Search,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  FileText,
  Pencil,
  Plus,
  Upload,
} from "lucide-react";
import { formatRupiah } from "@/utils/formatRupiah";
import { getPengeluaran, createPengeluaran } from "@/services/pengeluaranService";
import { getLaporanUsers } from "@/services/laporanService";
import Swal from "sweetalert2";

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
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const daysInMonth = new Date(viewDate.year, viewDate.month + 1, 0).getDate();
  const firstDay = new Date(viewDate.year, viewDate.month, 1).getDay();
  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const selectedDay = value ? new Date(value).getDate() : null;
  const selectedMonth = value ? new Date(value).getMonth() : null;
  const selectedYear = value ? new Date(value).getFullYear() : null;

  const prevMonth = () => setViewDate((v) => {
    const m = v.month === 0 ? 11 : v.month - 1;
    const y = v.month === 0 ? v.year - 1 : v.year;
    return { year: y, month: m };
  });
  const nextMonth = () => setViewDate((v) => {
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
    ? new Date(value).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : "Hari/Bulan/Tahun";

  return (
    <div ref={ref} className="relative z-50">
      <button onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between gap-3 bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 font-medium w-48 cursor-pointer">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-500" />
          <span className="truncate">{displayLabel}</span>
        </div>
        {value && (
          <span onClick={(e) => { e.stopPropagation(); onChange(""); }}
            className="text-gray-400 hover:text-red-500 transition-colors" title="Hapus Tanggal">
            <X size={14} />
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-gray-200 shadow-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <button onClick={prevMonth} className="p-1 rounded-lg hover:bg-gray-100 transition-colors"><ChevronLeft size={16} className="text-gray-600" /></button>
            <span className="text-sm font-bold text-gray-700">{monthNames[viewDate.month]} {viewDate.year}</span>
            <button onClick={nextMonth} className="p-1 rounded-lg hover:bg-gray-100 transition-colors"><ChevronRight size={16} className="text-gray-600" /></button>
          </div>
          <div className="grid grid-cols-7 mb-1">
            {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => (
              <div key={d} className="text-center text-[10px] font-bold text-gray-400 py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-1">
            {Array(firstDay).fill(null).map((_, i) => <div key={`e-${i}`} />)}
            {Array(daysInMonth).fill(null).map((_, i) => {
              const day = i + 1;
              const isSelected = day === selectedDay && viewDate.month === selectedMonth && viewDate.year === selectedYear;
              const isToday = day === new Date().getDate() && viewDate.month === new Date().getMonth() && viewDate.year === new Date().getFullYear();
              return (
                <button key={day} onClick={() => selectDay(day)}
                  className={`text-center text-sm h-8 w-full rounded-lg font-medium transition-colors ${isSelected ? "bg-red-500 text-white" : ""} ${isToday && !isSelected ? "border border-red-500 text-red-500" : ""} ${!isSelected && !isToday ? "text-gray-700 hover:bg-gray-100" : ""}`}>
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

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"users" | "shifts" | "expenses">("users");
  const [selectedExpenseDate, setSelectedExpenseDate] = useState("");
  const [searchExpense, setSearchExpense] = useState("");
  const [expenses, setExpenses] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({ nama_pengeluaran: "", jumlah: "", kategori: "Operasional", deskripsi: "", tanggal: "" });
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);

  const fetchExpenses = async () => {
    try {
      const data = await getPengeluaran();
      setExpenses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const filteredExpenses = expenses.filter((e) => {
    const matchSearch = e.nama?.toLowerCase().includes(searchExpense.toLowerCase()) || e.id?.includes(searchExpense);
    const matchDate = selectedExpenseDate ? e.waktu === selectedExpenseDate : true;
    return matchSearch && matchDate;
  });

  const handleCreateExpense = async () => {
    if (!formData.nama_pengeluaran || !formData.jumlah) {
      Swal.fire("Error", "Nama dan jumlah harus diisi", "error");
      return;
    }
    try {
      const fd = new FormData();
      fd.append("nama_pengeluaran", formData.nama_pengeluaran);
      fd.append("jumlah", formData.jumlah);
      fd.append("kategori", formData.kategori);
      fd.append("deskripsi", formData.deskripsi);
      fd.append("tanggal", formData.tanggal || new Date().toISOString().split("T")[0]);
      if (evidenceFile) fd.append("evidence", evidenceFile);

      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/api/pengeluaran", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const json = await res.json();
      if (json.success) {
        Swal.fire("Berhasil", "Pengeluaran berhasil dicatat", "success");
        setShowCreateModal(false);
        setFormData({ nama_pengeluaran: "", jumlah: "", kategori: "Operasional", deskripsi: "", tanggal: "" });
        setEvidenceFile(null);
        fetchExpenses();
      } else {
        Swal.fire("Error", json.message || "Gagal", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Gagal menyimpan", "error");
    }
  };

  const tabs = [
    { key: "users" as const, label: "User" },
    { key: "shifts" as const, label: "Shift" },
    { key: "expenses" as const, label: "Pengeluaran Operasional" },
  ];

  return (
    <div className="h-full w-full overflow-y-auto bg-[#efefef] p-8 pb-12 font-sans text-gray-800 relative">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#F53E1B] mb-2">Admin - Dashboard</h1>
        <p className="text-gray-500 font-medium">Laporan Pemasukan Mi Madyang</p>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-3 rounded-t-lg font-bold text-sm transition-colors ${
              activeTab === tab.key ? "bg-white text-[#F53E1B] shadow-sm border-t border-l border-r" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "users" && (
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="p-5 border-b"><h2 className="text-xl font-bold text-black">User</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-gray-500">
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
                  <tr key={index} className={`border border-neutral-100 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}>
                    <td className="py-4 px-6 font-bold text-gray-800">{user.id}</td>
                    <td className="py-4 px-6 font-bold text-gray-800">{user.nama}</td>
                    <td className="py-4 px-6 text-gray-600">{user.role}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-md text-xs font-bold inline-flex items-center gap-1.5 ${user.status === "Online" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
                        <span className={`w-2 h-2 rounded-full ${user.status === "Online" ? "bg-green-600" : "bg-red-600"}`}></span>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center text-gray-400">
                      <button className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-200 p-2 rounded-lg transition-colors inline-flex justify-center items-center">
                        <Pencil size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t flex justify-between items-center text-sm bg-white rounded-b-xl">
            <span className="text-gray-500 font-medium">Showing 1-9 of 2810 Transaction</span>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded bg-[#f87171] text-white"><ChevronLeft size={16} /></button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-[#f87171] text-white shadow-sm font-bold">1</button>
              {[2,3,4,5].map((n) => (
                <button key={n} className="w-8 h-8 flex items-center justify-center rounded bg-gray-200 text-gray-700 font-bold">{n}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "shifts" && (
        <div className="bg-white rounded-xl shadow-sm mb-12">
          <div className="p-5 border-b"><h2 className="text-xl font-bold text-black">Shift</h2></div>
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
                  <tr key={index} className={`border border-neutral-100 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}>
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
          <div className="p-4 border-t flex justify-between items-center text-sm bg-white rounded-b-xl">
            <span className="text-gray-500 font-medium">Showing 1-9 of 2810 Shift</span>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded bg-[#f87171] text-white"><ChevronLeft size={16} /></button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-[#f87171] text-white shadow-sm font-bold">1</button>
              {[2,3,4,5].map((n) => (
                <button key={n} className="w-8 h-8 flex items-center justify-center rounded bg-gray-200 text-gray-700 font-bold">{n}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "expenses" && (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-[#f85656] hover:bg-[#e04545] text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
            >
              <Plus size={16} />
              Tambah Pengeluaran
            </button>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-neutral-100">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Harian</p>
              <p className="text-lg font-extrabold text-neutral-800">
                {formatRupiah(filteredExpenses.reduce((s, e) => s + Number(e.jumlah), 0))}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-5 flex justify-between items-center border-b relative z-20">
              <h2 className="text-xl font-bold text-black">Pengeluaran Operasional</h2>
              <div className="flex gap-3">
                <CalendarPicker value={selectedExpenseDate} onChange={setSelectedExpenseDate} />
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input type="text" placeholder="Cari pengeluaran" value={searchExpense}
                    onChange={(e) => setSearchExpense(e.target.value)}
                    className="bg-gray-200 text-gray-700 placeholder-gray-500 pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 font-medium w-48" />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-gray-500 border border-neutral-100 bg-white">
                  <tr>
                    <th className="py-4 px-6 font-medium">ID</th>
                    <th className="py-4 px-6 font-medium">Nama Pengeluaran</th>
                    <th className="py-4 px-6 font-medium">Kategori</th>
                    <th className="py-4 px-6 font-medium">Tanggal</th>
                    <th className="py-4 px-6 font-medium">User</th>
                    <th className="py-4 px-6 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.length === 0 ? (
                    <tr><td colSpan={6} className="py-12 text-center text-gray-400">Belum ada data pengeluaran</td></tr>
                  ) : (
                    filteredExpenses.map((expense, index) => (
                      <tr key={index} className={`border border-neutral-100 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}>
                        <td className="py-4 px-6 font-bold text-gray-800">{expense.id}</td>
                        <td className="py-4 px-6 text-gray-600">{expense.nama}</td>
                        <td className="py-4 px-6">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">{expense.kategori}</span>
                        </td>
                        <td className="py-4 px-6 text-gray-600">{expense.waktu}</td>
                        <td className="py-4 px-6 text-gray-600">{expense.user_id}</td>
                        <td className="py-4 px-6 font-bold text-gray-800">{formatRupiah(expense.jumlah)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Tambah Pengeluaran</h2>
              <button onClick={() => setShowCreateModal(false)}><X size={20} className="text-neutral-400" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Nama Pengeluaran *</label>
                <input value={formData.nama_pengeluaran} onChange={(e) => setFormData({ ...formData, nama_pengeluaran: e.target.value })}
                  placeholder="Contoh: Gaji Karyawan" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Jumlah (Rp) *</label>
                <input type="number" value={formData.jumlah} onChange={(e) => setFormData({ ...formData, jumlah: e.target.value })}
                  placeholder="0" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Kategori</label>
                <select value={formData.kategori} onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                  className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200">
                  <option>Operasional</option>
                  <option>Gaji</option>
                  <option>Sewa</option>
                  <option>Bahan Baku</option>
                  <option>Lain-lain</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Deskripsi</label>
                <textarea value={formData.deskripsi} onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  placeholder="Deskripsi (opsional)" rows={3}
                  className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Tanggal</label>
                <input type="date" value={formData.tanggal} onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                  className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Evidence (Bukti)</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-gray-400 transition-colors"
                  onClick={() => document.getElementById("evidence-input")?.click()}>
                  {evidenceFile ? (
                    <p className="text-sm text-gray-600">{evidenceFile.name}</p>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <Upload size={20} className="text-gray-300" />
                      <p className="text-xs text-gray-400">Upload bukti (opsional)</p>
                    </div>
                  )}
                </div>
                <input id="evidence-input" type="file" accept=".jpg,.jpeg,.png,.pdf,.zip" onChange={(e) => setEvidenceFile(e.target.files?.[0] || null)} className="hidden" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-3 rounded-xl font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors">Batal</button>
              <button onClick={handleCreateExpense} className="flex-1 px-4 py-3 rounded-xl font-semibold text-white bg-[#f85656] hover:bg-[#e04545] transition-colors">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
