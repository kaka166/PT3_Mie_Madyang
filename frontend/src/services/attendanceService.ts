const API_BASE_URL = "https://api.farelzy.my.id/api";

const getHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (token) headers["Authorization"] = `Bearer ${token}`;

  return headers;
};

export interface AttendanceData {
  id: number;
  user_id: number;
  tanggal: string;
  jam_masuk: string | null;
  jam_keluar: string | null;
  status: string;
  keterangan: string | null;
  user?: {
    id: number;
    name: string;
    username: string;
    role: number;
  };
}

export interface AttendanceStatusResponse {
  success: boolean;
  data: {
    checked_in: boolean;
    checked_out: boolean;
    attendance: AttendanceData | null;
  };
}

export const attendanceService = {
  async getStatus(): Promise<AttendanceStatusResponse> {
    try {
      const res = await fetch(`${API_BASE_URL}/attendance/status`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Gagal mengambil status absensi");
      return await res.json();
    } catch (error) {
      console.error("Error getStatus:", error);
      return {
        success: false,
        data: { checked_in: false, checked_out: false, attendance: null },
      };
    }
  },

  async checkIn(
    status: string = "hadir",
    keterangan: string = "",
  ): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/attendance/check-in`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ status, keterangan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal absen masuk");
      return {
        success: true,
        message: data.message || "Absen masuk berhasil!",
      };
    } catch (error) {
      console.error("Error checkIn:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Gagal melakukan absen masuk.",
      };
    }
  },

  async checkOut(): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/attendance/check-out`, {
        method: "POST",
        headers: getHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal absen keluar");
      return {
        success: true,
        message: data.message || "Absen keluar berhasil!",
      };
    } catch (error) {
      console.error("Error checkOut:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Gagal melakukan absen keluar.",
      };
    }
  },

  async getHistory(): Promise<{ success: boolean; data: AttendanceData[] }> {
    try {
      const res = await fetch(`${API_BASE_URL}/attendance/history`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Gagal mengambil riwayat absensi");
      return await res.json();
    } catch (error) {
      console.error("Error getHistory:", error);
      return { success: false, data: [] };
    }
  },
};
