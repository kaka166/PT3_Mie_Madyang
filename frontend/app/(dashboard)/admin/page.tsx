/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Search,
  X,
  Pencil,
  Plus,
  Upload,
  Trash2,
  Users,
  Clock,
  TrendingDown,
  Activity,
  UserCheck,
  ShoppingBag,
  RefreshCw,
  UserPlus,
} from "lucide-react";
import { formatRupiah } from "@/utils/formatRupiah";
import { formatTanggal } from "@/utils/formatTanggal";
import { getPengeluaran } from "@/services/pengeluaranService";
import {
  getLaporanUsers,
  getLaporanShifts,
  getAttendanceHistory,
  updateUser,
  deleteUser,
  createUser,
} from "@/services/laporanService";
import { getAllActiveSessions } from "@/services/sessionService";
import { addNotification } from "@/services/notificationService";
import { PeriodFilter, DateRange } from "@/components/common/PeriodFilter";
import Swal from "sweetalert2";
import { API_BASE_URL } from "@/config";

const ROLE_LABELS: Record<number, string> = { 1: "Owner", 2: "Kasir", 3: "Dapur" };
const ROLE_COLORS: Record<number, string> = {
  1: "bg-purple-100 text-purple-700",
  2: "bg-blue-100 text-blue-700",
  3: "bg-orange-100 text-orange-700",
};

function StatCard({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{label}</p>
        <p className="text-xl font-extrabold text-neutral-800">{value}</p>
        {sub && <p className="text-xs text-neutral-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const today = new Date();
  const todayISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const [activeTab, setActiveTab] = useState<"staff" | "shifts" | "attendance" | "expenses">("staff");

  // Data states
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [shifts, setShifts] = useState<any[]>([]);
  const [loadingShifts, setLoadingShifts] = useState(true);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loadingAttendance, setLoadingAttendance] = useState(true);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [searchExpense, setSearchExpense] = useState("");
  const [expenseDateRange, setExpenseDateRange] = useState<DateRange>({ start: todayISO, end: todayISO });
  const [shiftDateRange, setShiftDateRange] = useState<DateRange>({ start: "", end: "" });
  const [attendanceDateRange, setAttendanceDateRange] = useState<DateRange>({ start: todayISO, end: todayISO });

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({ nama_pengeluaran: "", jumlah: "", kategori: "Operasional", deskripsi: "", tanggal: "" });
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({ username: "", name: "", email: "", phone: "", role: 2, password: "" });
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [createUserForm, setCreateUserForm] = useState({ username: "", name: "", email: "", phone: "", password: "", role: 2 });

  const fetchAll = useCallback(async () => {
    setLoadingUsers(true);
    setLoadingShifts(true);
    setLoadingAttendance(true);
    try {
      const [usersRes, shiftsRes, sessionsRes, attendRes, expRes] = await Promise.all([
        getLaporanUsers(),
        getLaporanShifts({ start_date: shiftDateRange.start || undefined, end_date: shiftDateRange.end || undefined }),
        getAllActiveSessions(),
        getAttendanceHistory({ start_date: attendanceDateRange.start || undefined, end_date: attendanceDateRange.end || undefined }),
        getPengeluaran(),
      ]);
      setUsers(usersRes?.data || []);
      setShifts(shiftsRes?.data || []);
      setActiveSessions(sessionsRes?.data || []);
      setAttendance(attendRes?.data || []);
      setExpenses(Array.isArray(expRes) ? expRes : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
      setLoadingShifts(false);
      setLoadingAttendance(false);
    }
  }, [shiftDateRange, attendanceDateRange]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Derived stats
  const staffOnline = activeSessions.length;
  const totalPemasukanHariIni = shifts
    .filter(s => !s.selesai && s.mulai && new Date(s.mulai).toDateString() === today.toDateString())
    .reduce((sum, s) => sum + Number(s.total_pemasukan || 0), 0);
  const staffHadirHariIni = attendance.filter(a => {
    const tgl = a.tanggal || "";
    return tgl === todayISO && a.status === "hadir";
  }).length;

  const filteredExpenses = expenses.filter(e => {
    const matchSearch = !searchExpense || e.nama?.toLowerCase().includes(searchExpense.toLowerCase());
    const matchDate = expenseDateRange.start
      ? new Date(e.waktu || e.tanggal) >= new Date(expenseDateRange.start) &&
        new Date(e.waktu || e.tanggal) <= (() => { const d = new Date(expenseDateRange.end || expenseDateRange.start); d.setHours(23,59,59); return d; })()
      : true;
    return matchSearch && matchDate;
  });
  const totalExpense = filteredExpenses.reduce((s, e) => s + Number(e.jumlah || 0), 0);

  const filteredShifts = shifts.filter(s => {
    if (!shiftDateRange.start) return true;
    const d = new Date(s.mulai);
    return d >= new Date(shiftDateRange.start) &&
      d <= (() => { const end = new Date(shiftDateRange.end || shiftDateRange.start); end.setHours(23,59,59); return end; })();
  });

  const filteredAttendance = attendance.filter(a => {
    if (!attendanceDateRange.start) return true;
    const tgl = a.tanggal || "";
    return tgl >= attendanceDateRange.start && tgl <= (attendanceDateRange.end || attendanceDateRange.start);
  });

  const handleCreateExpense = async () => {
    if (!formData.nama_pengeluaran || !formData.jumlah) {
      Swal.fire("Error", "Nama dan jumlah harus diisi", "error"); return;
    }
    try {
      const fd = new FormData();
      fd.append("nama_pengeluaran", formData.nama_pengeluaran);
      fd.append("jumlah", formData.jumlah);
      fd.append("kategori", formData.kategori);
      fd.append("deskripsi", formData.deskripsi);
      fd.append("tanggal", formData.tanggal || todayISO);
      if (evidenceFile) fd.append("evidence", evidenceFile);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/pengeluaran`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const json = await res.json();
      if (json.success) {
        addNotification("Pengeluaran Dicatat", `${formData.nama_pengeluaran}`, "success", true, "admin");
        setShowCreateModal(false);
        setFormData({ nama_pengeluaran: "", jumlah: "", kategori: "Operasional", deskripsi: "", tanggal: "" });
        setEvidenceFile(null);
        fetchAll();
      } else Swal.fire("Error", json.message || "Gagal", "error");
    } catch (err) { console.error(err); }
  };

  const handleDeleteUser = async (user: any) => {
    const result = await Swal.fire({
      title: "Hapus User?",
      text: `User "${user.name}" akan dihapus.`,
      icon: "warning", showCancelButton: true,
      confirmButtonColor: "#d33", cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, hapus!", cancelButtonText: "Batal",
    });
    if (!result.isConfirmed) return;
    try {
      const json = await deleteUser(user.id);
      if (json.success) {
        addNotification("User Dihapus", `"${user.name}" dihapus`, "warning", true, "admin");
        fetchAll();
      } else Swal.fire("Error", json.message || "Gagal", "error");
    } catch { Swal.fire("Error", "Gagal menghapus user", "error"); }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    try {
      const payload: any = {};
      if (editForm.username !== editingUser.username) payload.username = editForm.username;
      if (editForm.name !== editingUser.name) payload.name = editForm.name;
      if (editForm.email !== editingUser.email) payload.email = editForm.email;
      if (editForm.phone !== (editingUser.phone || "")) payload.phone = editForm.phone;
      if (editForm.role !== editingUser.role) payload.role = editForm.role;
      if (editForm.password) payload.password = editForm.password;
      if (Object.keys(payload).length === 0) { setShowEditModal(false); return; }
      const json = await updateUser(editingUser.id, payload);
      if (json.success) {
        addNotification("User Diupdate", `"${editForm.name}" diperbarui`, "success", true, "admin");
        setShowEditModal(false); setEditingUser(null); fetchAll();
      } else Swal.fire("Error", json.message || "Gagal", "error");
    } catch { Swal.fire("Error", "Gagal mengupdate user", "error"); }
  };

  const handleCreateUser = async () => {
    if (!createUserForm.username || !createUserForm.name || !createUserForm.email || !createUserForm.password) {
      Swal.fire("Error", "Semua field wajib diisi", "error"); return;
    }
    try {
      const json = await createUser(createUserForm);
      if (json.success) {
        addNotification("User Dibuat", `"${createUserForm.name}" berhasil ditambahkan`, "success", true, "admin");
        setShowCreateUserModal(false);
        setCreateUserForm({ username: "", name: "", email: "", phone: "", password: "", role: 2 });
        fetchAll();
      } else Swal.fire("Error", json.message || "Gagal", "error");
    } catch { Swal.fire("Error", "Gagal membuat user", "error"); }
  };

  const tabs = [
    { key: "staff" as const, label: "Staf", icon: Users },
    { key: "shifts" as const, label: "Shift Kasir", icon: Activity },
    { key: "attendance" as const, label: "Absensi", icon: UserCheck },
    { key: "expenses" as const, label: "Pengeluaran", icon: TrendingDown },
  ];

  return (
    <div className="h-full w-full overflow-y-auto bg-[#f5f5f5] p-4 md:p-8 pb-12 font-sans text-gray-800 relative">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-[#F53E1B] mb-1">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm font-medium">Kontrol penuh operasional Mie Madyang</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard icon={Users} label="Total Staf" value={users.length} sub="Semua role" color="bg-blue-50 text-blue-500" />
        <StatCard icon={Activity} label="Sesi Aktif" value={staffOnline} sub="Kasir sedang bertugas" color="bg-green-50 text-green-500" />
        <StatCard icon={UserCheck} label="Hadir Hari Ini" value={staffHadirHariIni} sub="Absen masuk" color="bg-purple-50 text-purple-500" />
        <StatCard icon={ShoppingBag} label="Pemasukan Aktif" value={formatRupiah(totalPemasukanHariIni)} sub="Dari sesi aktif" color="bg-orange-50 text-orange-500" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? "bg-white text-[#F53E1B] shadow-sm border border-neutral-200"
                : "text-gray-500 hover:text-gray-700 hover:bg-white/60"
            }`}>
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
        <button onClick={fetchAll} className="ml-auto flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-white transition-all">
          <RefreshCw size={14} />
          <span className="text-xs font-medium">Refresh</span>
        </button>
      </div>

      {/* TAB: STAF */}
      {activeTab === "staff" && (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100">
          <div className="p-5 border-b flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Data Staf</h2>
            <button onClick={() => setShowCreateUserModal(true)}
              className="flex items-center gap-2 bg-[#F53E1B] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-red-600 active:scale-95">
              <UserPlus size={15} /> Tambah User
            </button>
          </div>
          <div className="overflow-x-auto bg-white rounded-3xl shadow-sm border border-gray-100">
            {loadingUsers ? (
              <div className="p-8 space-y-3">{[1,2,3].map(i => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}</div>
            ) : users.length === 0 ? (
              <div className="py-12 text-center text-gray-400">Belum ada data staf</div>
            ) : (
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="py-3 px-4 font-semibold text-left">Nama</th>
                    <th className="py-3 px-4 font-semibold text-left">Username</th>
                    <th className="py-3 px-4 font-semibold text-left">Role</th>
                    <th className="py-3 px-4 font-semibold text-left">Email</th>
                    <th className="py-3 px-4 font-semibold text-left">No HP</th>
                    <th className="py-3 px-4 font-semibold text-center">Sesi Aktif</th>
                    <th className="py-3 px-4 font-semibold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: any, idx: number) => {
                    const hasSession = activeSessions.some(s => s.user_id === user.id);
                    const sessionData = activeSessions.find(s => s.user_id === user.id);
                    return (
                      <tr key={user.id} className={`border-b border-neutral-50 transition-colors hover:bg-red-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                        <td className="py-3.5 px-4 font-bold text-gray-800">{user.name}</td>
                        <td className="py-3.5 px-4 text-gray-500">@{user.username}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${ROLE_COLORS[user.role] || "bg-gray-100 text-gray-600"}`}>
                            {ROLE_LABELS[user.role] || "Staff"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-500 text-xs">{user.email}</td>
                        <td className="py-3.5 px-4 text-gray-500 text-xs">{user.phone || "-"}</td>
                        <td className="py-3.5 px-4 text-center">
                          {hasSession ? (
                            <div>
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                Aktif
                              </span>
                              {sessionData && (
                                <div className="text-[10px] text-gray-400 mt-0.5">{formatRupiah(sessionData.total_pemasukan || 0)}</div>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-300">–</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => { setEditingUser(user); setEditForm({ username: user.username||"" , name: user.name||"" , email: user.email||"" , phone: user.phone||"" , role: user.role, password: "" }); setShowEditModal(true); }}
                              className="text-gray-400 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 p-2 rounded-lg transition-colors">
                              <Pencil size={15} />
                            </button>
                            <button onClick={() => handleDeleteUser(user)}
                              className="text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
          <div className="p-4 border-t text-xs text-gray-400">Total {users.length} staf terdaftar</div>
        </div>
      )}

      {/* TAB: SHIFT */}
      {activeTab === "shifts" && (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100">
          <div className="p-5 border-b flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-lg font-bold text-gray-900">Riwayat Shift Kasir</h2>
            <PeriodFilter value={shiftDateRange} onChange={setShiftDateRange} />
          </div>
          {/* Active sessions badge */}
          {activeSessions.length > 0 && (
            <div className="px-5 py-3 bg-green-50 border-b border-green-100">
              <p className="text-xs font-bold text-green-700">🟢 {activeSessions.length} Sesi Sedang Aktif</p>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {activeSessions.map(s => (
                  <span key={s.id} className="px-2.5 py-1 bg-white border border-green-200 rounded-full text-xs font-semibold text-green-700">
                    {s.user_name} — {formatRupiah(s.total_pemasukan || 0)} ({s.total_transaksi || 0} trx)
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="overflow-x-auto bg-white rounded-3xl shadow-sm border border-gray-100">
            {loadingShifts ? (
              <div className="p-8 space-y-3">{[1,2,3].map(i => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}</div>
            ) : filteredShifts.length === 0 ? (
              <div className="py-12 text-center text-gray-400">Belum ada data shift</div>
            ) : (
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="py-3 px-4 font-semibold text-left">ID</th>
                    <th className="py-3 px-4 font-semibold text-left">Kasir</th>
                    <th className="py-3 px-4 font-semibold text-left">Role</th>
                    <th className="py-3 px-4 font-semibold text-left">Mulai</th>
                    <th className="py-3 px-4 font-semibold text-left">Selesai</th>
                    <th className="py-3 px-4 font-semibold text-left">Durasi</th>
                    <th className="py-3 px-4 font-semibold text-left">Uang Awal</th>
                    <th className="py-3 px-4 font-semibold text-left">Total Masuk</th>
                    <th className="py-3 px-4 font-semibold text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShifts.map((shift: any, idx: number) => (
                    <tr key={shift.id} className={`border-b border-neutral-50 hover:bg-red-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                      <td className="py-3.5 px-4 font-bold text-gray-500 text-xs">{shift.id}</td>
                      <td className="py-3.5 px-4 font-bold text-gray-800">{shift.nama}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${ROLE_COLORS[shift.role] || "bg-gray-100 text-gray-600"}`}>
                          {ROLE_LABELS[shift.role] || "Staff"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-gray-600">{shift.mulai ? new Date(shift.mulai).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-"}</td>
                      <td className="py-3.5 px-4 text-xs text-gray-600">{shift.selesai ? new Date(shift.selesai).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "–"}</td>
                      <td className="py-3.5 px-4 text-gray-600">{shift.durasi || "–"}</td>
                      <td className="py-3.5 px-4 text-gray-600">{formatRupiah(shift.opening_cash || 0)}</td>
                      <td className="py-3.5 px-4 font-bold text-green-700">{formatRupiah(shift.total_pemasukan || 0)}</td>
                      <td className="py-3.5 px-4">
                        {!shift.selesai ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Aktif
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-semibold">Selesai</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="p-4 border-t text-xs text-gray-400">Total {filteredShifts.length} shift</div>
        </div>
      )}

      {/* TAB: ABSENSI */}
      {activeTab === "attendance" && (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100">
          <div className="p-5 border-b flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-lg font-bold text-gray-900">Riwayat Absensi</h2>
            <PeriodFilter value={attendanceDateRange} onChange={setAttendanceDateRange} />
          </div>
          <div className="overflow-x-auto bg-white rounded-3xl shadow-sm border border-gray-100">
            {loadingAttendance ? (
              <div className="p-8 space-y-3">{[1,2,3].map(i => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}</div>
            ) : filteredAttendance.length === 0 ? (
              <div className="py-12 text-center text-gray-400">Belum ada data absensi</div>
            ) : (
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="py-3 px-4 font-semibold text-left">Tanggal</th>
                    <th className="py-3 px-4 font-semibold text-left">Nama Staf</th>
                    <th className="py-3 px-4 font-semibold text-left">Role</th>
                    <th className="py-3 px-4 font-semibold text-left">Jam Masuk</th>
                    <th className="py-3 px-4 font-semibold text-left">Jam Keluar</th>
                    <th className="py-3 px-4 font-semibold text-left">Durasi</th>
                    <th className="py-3 px-4 font-semibold text-left">Status</th>
                    <th className="py-3 px-4 font-semibold text-left">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendance.map((row: any, idx: number) => {
                    // Hitung durasi
                    let durasi = "–";
                    if (row.jam_masuk && row.jam_keluar) {
                      const [hm, mm] = row.jam_masuk.split(":").map(Number);
                      const [hk, mk] = row.jam_keluar.split(":").map(Number);
                      const diff = (hk * 60 + mk) - (hm * 60 + mm);
                      if (diff > 0) durasi = `${Math.floor(diff/60)}j ${diff%60}m`;
                    }
                    return (
                      <tr key={idx} className={`border-b border-neutral-50 hover:bg-red-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                        <td className="py-3.5 px-4 text-gray-600 text-xs">{formatTanggal(row.tanggal)}</td>
                        <td className="py-3.5 px-4 font-bold text-gray-800">{row.user?.name || "-"}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${ROLE_COLORS[row.user?.role] || "bg-gray-100 text-gray-600"}`}>
                            {ROLE_LABELS[row.user?.role] || "Staff"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-gray-800">{row.jam_masuk || "–"}</td>
                        <td className="py-3.5 px-4 font-semibold text-gray-800">{row.jam_keluar || "–"}</td>
                        <td className="py-3.5 px-4 text-gray-500">{durasi}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            row.status === "hadir" ? "bg-green-100 text-green-700" :
                            row.status === "sakit" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                          }`}>{row.status}</span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-400 italic text-xs">{row.keterangan || "–"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
          <div className="p-4 border-t text-xs text-gray-400">Total {filteredAttendance.length} record absensi</div>
        </div>
      )}

      {/* TAB: PENGELUARAN */}
      {activeTab === "expenses" && (
        <div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <button onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-[#f85656] hover:bg-[#e04545] text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95">
              <Plus size={16} /> Tambah Pengeluaran
            </button>
            <div className="bg-white px-4 py-2.5 rounded-xl shadow-sm border border-neutral-100">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Total Pengeluaran</p>
              <p className="text-lg font-extrabold text-red-600">{formatRupiah(totalExpense)}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100">
            <div className="p-5 flex flex-wrap justify-between items-center border-b gap-3 relative z-20">
              <h2 className="text-lg font-bold text-gray-900">Pengeluaran Operasional</h2>
              <div className="flex gap-2 flex-wrap items-center">
                <PeriodFilter value={expenseDateRange} onChange={setExpenseDateRange} />
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input type="text" placeholder="Cari..." value={searchExpense}
                    onChange={(e) => setSearchExpense(e.target.value)}
                    className="bg-gray-100 pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none w-36" />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto bg-white rounded-3xl shadow-sm border border-gray-100">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="py-3 px-4 font-semibold text-left">ID</th>
                    <th className="py-3 px-4 font-semibold text-left">Nama</th>
                    <th className="py-3 px-4 font-semibold text-left">Kategori</th>
                    <th className="py-3 px-4 font-semibold text-left">Tanggal</th>
                    <th className="py-3 px-4 font-semibold text-left">Oleh</th>
                    <th className="py-3 px-4 font-semibold text-right">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.length === 0 ? (
                    <tr><td colSpan={6} className="py-12 text-center text-gray-400">Belum ada data pengeluaran</td></tr>
                  ) : (
                    filteredExpenses.map((expense, idx) => (
                      <tr key={idx} className={`border-b border-neutral-50 hover:bg-red-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                        <td className="py-3.5 px-4 text-gray-400 text-xs">{expense.id}</td>
                        <td className="py-3.5 px-4 font-semibold text-gray-800">{expense.nama}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">{expense.kategori}</span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-500 text-xs">{expense.waktu ? formatTanggal(expense.waktu) : expense.tanggal || "–"}</td>
                        <td className="py-3.5 px-4 text-gray-500 text-xs">{expense.user_id || "–"}</td>
                        <td className="py-3.5 px-4 font-bold text-red-600 text-right">{formatRupiah(expense.jumlah)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t text-xs text-gray-400">Total {filteredExpenses.length} pengeluaran</div>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH PENGELUARAN */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold">Tambah Pengeluaran</h2>
              <button onClick={() => setShowCreateModal(false)}><X size={20} className="text-neutral-400" /></button>
            </div>
            <div className="space-y-4">
              {[{label:"Nama Pengeluaran *",key:"nama_pengeluaran",placeholder:"Contoh: Gaji Karyawan",type:"text"},
                {label:"Jumlah (Rp) *",key:"jumlah",placeholder:"0",type:"number"}].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">{f.label}</label>
                  <input type={f.type} value={(formData as any)[f.key]} placeholder={f.placeholder}
                    onChange={(e) => setFormData({...formData, [f.key]: e.target.value})}
                    className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Kategori</label>
                <select value={formData.kategori} onChange={(e) => setFormData({...formData, kategori: e.target.value})}
                  className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200">
                  {["Operasional","Gaji","Sewa","Bahan Baku","Lain-lain"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Deskripsi</label>
                <textarea value={formData.deskripsi} onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                  placeholder="Deskripsi (opsional)" rows={2}
                  className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Tanggal</label>
                <input type="date" value={formData.tanggal} onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                  className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Bukti (Opsional)</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-gray-400 transition-colors"
                  onClick={() => document.getElementById("evidence-input")?.click()}>
                  {evidenceFile ? <p className="text-sm text-gray-600">{evidenceFile.name}</p> : (
                    <div className="flex flex-col items-center gap-1">
                      <Upload size={20} className="text-gray-300" />
                      <p className="text-xs text-gray-400">Upload bukti</p>
                    </div>
                  )}
                </div>
                <input id="evidence-input" type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => setEvidenceFile(e.target.files?.[0] || null)} className="hidden" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-3 rounded-xl font-semibold text-gray-500 bg-gray-100">Batal</button>
              <button onClick={handleCreateExpense} className="flex-1 px-4 py-3 rounded-xl font-semibold text-white bg-[#f85656] hover:bg-[#e04545]">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT USER */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold">Edit User</h2>
              <button onClick={() => { setShowEditModal(false); setEditingUser(null); }}><X size={20} className="text-neutral-400" /></button>
            </div>
            <div className="space-y-4">
              {[
                {label:"Username",key:"username"},{label:"Nama",key:"name"},
                {label:"Email",key:"email",type:"email"},{label:"No. HP",key:"phone"}
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">{f.label}</label>
                  <input type={f.type || "text"} value={(editForm as any)[f.key]}
                    onChange={(e) => setEditForm({...editForm, [f.key]: e.target.value})}
                    className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Role</label>
                <select value={editForm.role} onChange={(e) => setEditForm({...editForm, role: Number(e.target.value)})}
                  className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200">
                  <option value={1}>Owner</option><option value={2}>Kasir</option><option value={3}>Dapur</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Password Baru</label>
                <input type="password" value={editForm.password} placeholder="Kosongkan jika tidak diubah"
                  onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                  className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => { setShowEditModal(false); setEditingUser(null); }} className="flex-1 px-4 py-3 rounded-xl font-semibold text-gray-500 bg-gray-100">Batal</button>
              <button onClick={handleUpdateUser} className="flex-1 px-4 py-3 rounded-xl font-semibold text-white bg-[#f85656] hover:bg-[#e04545]">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CREATE USER */}
      {showCreateUserModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold">Tambah User Baru</h2>
              <button onClick={() => setShowCreateUserModal(false)}><X size={20} className="text-neutral-400" /></button>
            </div>
            <div className="space-y-4">
              {[
                {label:"Username *",key:"username"},{label:"Nama Lengkap *",key:"name"},
                {label:"Email *",key:"email",type:"email"},{label:"No. HP",key:"phone"},
                {label:"Password *",key:"password",type:"password"}
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">{f.label}</label>
                  <input type={f.type || "text"} value={(createUserForm as any)[f.key]}
                    onChange={(e) => setCreateUserForm({...createUserForm, [f.key]: e.target.value})}
                    className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Role</label>
                <select value={createUserForm.role} onChange={(e) => setCreateUserForm({...createUserForm, role: Number(e.target.value)})}
                  className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200">
                  <option value={1}>Owner</option><option value={2}>Kasir</option><option value={3}>Dapur</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowCreateUserModal(false)} className="flex-1 px-4 py-3 rounded-xl font-semibold text-gray-500 bg-gray-100">Batal</button>
              <button onClick={handleCreateUser} className="flex-1 px-4 py-3 rounded-xl font-semibold text-white bg-[#F53E1B] hover:bg-red-600">Tambah</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
