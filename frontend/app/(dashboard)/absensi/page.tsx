"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Clock,
  UserCheck,
  UserX,
  FileText,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { attendanceService, AttendanceData } from "@/services/attendanceService";
import { authService } from "@/services/authService";

// Format tanggal saja (tanpa jam) dari string tanggal DB
const formatDateOnly = (dateStr: string) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr + "T00:00:00+07:00");
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });
};

// Format waktu HH:MM:SS ke HH:MM (waktu sudah dalam WIB dari backend)
const formatTimeWIB = (timeStr: string | null) => {
  if (!timeStr) return "-";
  return timeStr.substring(0, 5);
};

export default function AbsensiPage() {
  const [time, setTime] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [loading, setLoading] = useState(true);
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState<AttendanceData | null>(
    null,
  );
  const [history, setHistory] = useState<AttendanceData[]>([]);
  const [roleId, setRoleId] = useState<number | null>(null);

  // Form State
  const [status, setStatus] = useState("hadir");
  const [keterangan, setKeterangan] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Clock Effect
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
      setDateStr(
        now.toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      const role = authService.getRole();
      setRoleId(role);

      const statusRes = await attendanceService.getStatus();
      if (statusRes.success) {
        setCheckedIn(statusRes.data.checked_in);
        setCheckedOut(statusRes.data.checked_out);
        setTodayAttendance(statusRes.data.attendance);
      }

      const historyRes = await attendanceService.getHistory();
      if (historyRes.success) {
        setHistory(historyRes.data);
      }
    } catch (err) {
      console.error("Gagal memuat data absensi", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await attendanceService.checkIn(status, keterangan);
      if (res.success) {
        await Swal.fire({
          title: "Sukses!",
          text: res.message,
          icon: "success",
          confirmButtonColor: "#F53E1B",
        });
        setShowForm(false);
        setKeterangan("");
        await fetchAttendanceData();
      } else {
        await Swal.fire({
          title: "Gagal",
          text: res.message,
          icon: "error",
          confirmButtonColor: "#F53E1B",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckOut = async () => {
    // Cek sesi kasir aktif terlebih dahulu
    try {
      const { getActiveSession } = await import("@/services/sessionService");
      const sessionRes = await getActiveSession();
      if (sessionRes?.data?.id) {
        await Swal.fire({
          title: "Sesi Kasir Masih Aktif!",
          text: "Tutup sesi kasir terlebih dahulu sebelum melakukan absen keluar.",
          icon: "error",
          confirmButtonColor: "#F53E1B",
        });
        return;
      }
    } catch (e) {
      console.error("Gagal cek sesi:", e);
    }

    const confirm = await Swal.fire({
      title: "Absen Keluar?",
      text: "Apakah Anda yakin ingin mengakhiri jam kerja sekarang?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#F53E1B",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Ya, Absen Keluar!",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) return;

    setSubmitting(true);
    try {
      const res = await attendanceService.checkOut();
      if (res.success) {
        await Swal.fire({
          title: "Sukses!",
          text: res.message,
          icon: "success",
          confirmButtonColor: "#F53E1B",
        });
        await fetchAttendanceData();
      } else {
        await Swal.fire({
          title: "Gagal",
          text: res.message,
          icon: "error",
          confirmButtonColor: "#F53E1B",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-gray-100 p-6 pb-12 font-sans text-gray-800">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#F53E1B] mb-1">
            Absensi Staf
          </h1>
          <p className="text-gray-400 text-sm font-medium">
            Catat Kehadiran Harian Anda
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Interactive Clock & Status Box */}
        <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden border border-neutral-100 col-span-1 lg:col-span-1 min-h-[300px]">
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#F53E1B]"></div>

          <Clock className="text-[#F53E1B] w-12 h-12 mb-4 animate-pulse" />
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-1">
            {time || "--:--:--"}
          </h2>
          <p className="text-sm font-bold text-gray-500 mb-6">{dateStr}</p>

          {loading ? (
            <div className="text-gray-400 font-bold text-sm">Loading...</div>
          ) : (
            <div className="w-full">
              {!checkedIn ? (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full bg-[#F53E1B] hover:bg-[#e03515] text-white py-3.5 rounded-xl font-bold text-base transition-all shadow-md active:scale-95">
                  Absen Masuk
                </button>
              ) : !checkedOut ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 py-2.5 px-4 rounded-xl border border-green-100 mb-3">
                    <UserCheck size={18} />
                    <span className="text-sm font-bold">
                      Sudah Masuk ({todayAttendance?.jam_masuk})
                    </span>
                  </div>
                  <button
                    onClick={handleCheckOut}
                    disabled={submitting}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-xl font-bold text-base transition-all shadow-md active:scale-95">
                    Absen Keluar
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 py-2.5 px-4 rounded-xl border border-green-100">
                    <UserCheck size={18} />
                    <span className="text-sm font-bold">
                      Sudah Masuk ({todayAttendance?.jam_masuk})
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-gray-500 bg-gray-50 py-2.5 px-4 rounded-xl border border-gray-200">
                    <UserX size={18} />
                    <span className="text-sm font-bold">
                      Sudah Keluar ({todayAttendance?.jam_keluar})
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Details Check In Modal/Form (Conditional) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 col-span-1 lg:col-span-2 flex flex-col justify-center min-h-[300px]">
          {showForm ? (
            <form onSubmit={handleCheckIn} className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
                <FileText className="text-[#F53E1B]" size={20} />
                Detail Kehadiran Masuk
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-gray-500 block mb-1.5">
                    Status Kehadiran
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-gray-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-[#F53E1B] transition-all text-sm font-semibold">
                    <option value="hadir">Hadir / Masuk Kerja</option>
                    <option value="izin">Izin</option>
                    <option value="sakit">Sakit</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-500 block mb-1.5">
                    Keterangan (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Jalan macet, sakit demam, dll"
                    value={keterangan}
                    onChange={(e) => setKeterangan(e.target.value)}
                    className="w-full bg-gray-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-[#F53E1B] transition-all text-sm font-semibold"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition text-sm">
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-[#F53E1B] text-white rounded-xl font-bold transition shadow-md hover:bg-[#e03515] disabled:opacity-50 text-sm">
                  {submitting ? "Mengirim..." : "Kirim Absensi"}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center sm:text-left flex flex-col justify-center h-full">
              <h3 className="text-lg font-black mb-2 text-gray-900 flex items-center justify-center sm:justify-start gap-2">
                <AlertCircle className="text-[#F53E1B]" size={20} />
                Catatan Penting Absensi
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                Absensi wajib dilakukan setiap hari kerja. Pastikan Anda melakukan
                **Absen Masuk** sesampainya di outlet/dapur dan melakukan
                **Absen Keluar** setelah jam kerja Anda selesai untuk memastikan
                pencatatan jam kerja yang valid dan akurat.
              </p>
              <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex gap-3 text-yellow-800 text-xs">
                <Calendar size={18} className="shrink-0" />
                <div>
                  <span className="font-bold">Info Perizinan:</span> Jika Anda
                  memilih status **Izin** atau **Sakit**, pastikan mengisi
                  keterangan singkat dengan jelas dan menyerahkan surat
                  pendukung secara fisik kepada manajemen.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* History Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {roleId === 1 ? "Riwayat Semua Kehadiran" : "Riwayat Kehadiran Saya"}
          </h2>
          <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-3 py-1.5 rounded-full">
            Total {history.length} Hari
          </span>
        </div>

        {/* Tabel Riwayat */}
        <div className="overflow-x-auto bg-white rounded-3xl shadow-sm border border-gray-100">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="py-4 px-4 font-semibold">Tanggal</th>
                {roleId === 1 && (
                  <th className="py-4 px-4 font-semibold">Nama Staf</th>
                )}
                {roleId === 1 && (
                  <th className="py-4 px-4 font-semibold">Role</th>
                )}
                <th className="py-4 px-4 font-semibold">Jam Masuk</th>
                <th className="py-4 px-4 font-semibold">Jam Keluar</th>
                <th className="py-4 px-4 font-semibold">Status</th>
                <th className="py-4 px-4 font-semibold">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td
                    colSpan={roleId === 1 ? 7 : 5}
                    className="py-12 text-gray-400 font-medium">
                    Belum ada riwayat absensi.
                  </td>
                </tr>
              ) : (
                history.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-neutral-50 even:bg-neutral-50/50 hover:bg-neutral-50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-gray-700">
                      {formatDateOnly(row.tanggal)}
                    </td>
                    {roleId === 1 && (
                      <td className="py-4 px-4 font-bold text-gray-900">
                        {row.user?.name || "-"}
                      </td>
                    )}
                    {roleId === 1 && (
                      <td className="py-4 px-4 font-semibold text-gray-600">
                        {authService.getRoleName(row.user?.role ?? 2)}
                      </td>
                    )}
                    <td className="py-4 px-4 text-gray-800 font-bold">
                      {formatTimeWIB(row.jam_masuk)}
                    </td>
                    <td className="py-4 px-4 text-gray-800 font-bold">
                      {formatTimeWIB(row.jam_keluar)}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold inline-block w-20 text-center ${
                          row.status === "hadir"
                            ? "bg-green-100 text-green-700"
                            : row.status === "sakit"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}>
                        {row.status === "hadir"
                          ? "Hadir"
                          : row.status === "sakit"
                            ? "Sakit"
                            : "Izin"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600 font-medium italic">
                      {row.keterangan || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
