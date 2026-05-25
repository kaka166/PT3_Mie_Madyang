import { API_BASE_URL } from "@/config";

const getHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: HeadersInit = { Accept: "application/json", "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

const fetchJson = async (url: string, init?: RequestInit) => {
  const res = await fetch(url, init);
  const text = await res.text();
  if (!res.ok) {
    let msg = "Request gagal";
    try { const j = JSON.parse(text); msg = j.message || j.error || msg; } catch {}
    throw new Error(msg);
  }
  return JSON.parse(text);
};

export const getLabaRugi = async (params?: { start_date?: string; end_date?: string }) => {
  const query = new URLSearchParams();
  if (params?.start_date) query.set("start_date", params.start_date);
  if (params?.end_date) query.set("end_date", params.end_date);
  const qs = query.toString();

  return fetchJson(`${API_BASE_URL}/laba-rugi${qs ? "?" + qs : ""}`, { headers: getHeaders() });
};

export const getLaporanPemasukan = async (params?: {
  user_id?: number;
  start_date?: string;
  end_date?: string;
  metode?: string;
}) => {
  const query = new URLSearchParams();
  if (params?.user_id) query.set("user_id", String(params.user_id));
  if (params?.start_date) query.set("start_date", params.start_date);
  if (params?.end_date) query.set("end_date", params.end_date);
  if (params?.metode) query.set("metode", params.metode);
  const qs = query.toString();

  return fetchJson(`${API_BASE_URL}/laporan/pemasukan${qs ? "?" + qs : ""}`, { headers: getHeaders() });
};

export const getLaporanPengeluaran = async (params?: {
  user_id?: number;
  start_date?: string;
  end_date?: string;
  kategori?: string;
}) => {
  const query = new URLSearchParams();
  if (params?.user_id) query.set("user_id", String(params.user_id));
  if (params?.start_date) query.set("start_date", params.start_date);
  if (params?.end_date) query.set("end_date", params.end_date);
  if (params?.kategori) query.set("kategori", params.kategori);
  const qs = query.toString();

  return fetchJson(`${API_BASE_URL}/laporan/pengeluaran${qs ? "?" + qs : ""}`, { headers: getHeaders() });
};

export const getLaporanUsers = async () => {
  return fetchJson(`${API_BASE_URL}/laporan/users`, { headers: getHeaders() });
};

export const getLaporanShifts = async (params?: { start_date?: string; end_date?: string }) => {
  const query = new URLSearchParams();
  if (params?.start_date) query.set("start_date", params.start_date);
  if (params?.end_date) query.set("end_date", params.end_date);
  const qs = query.toString();

  return fetchJson(`${API_BASE_URL}/laporan/shifts${qs ? "?" + qs : ""}`, { headers: getHeaders() });
};

export const getLaporanMenuItems = async () => {
  return fetchJson(`${API_BASE_URL}/laporan/menu-items`, { headers: getHeaders() });
};

export const updateUser = async (id: number, data: {
  username?: string;
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  role?: number;
}) => {
  return fetchJson(`${API_BASE_URL}/users/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
};

export const deleteUser = async (id: number) => {
  return fetchJson(`${API_BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
};

export const getAttendanceHistory = async (params?: { start_date?: string; end_date?: string }) => {
  const query = new URLSearchParams();
  if (params?.start_date) query.set("start_date", params.start_date);
  if (params?.end_date) query.set("end_date", params.end_date);
  const qs = query.toString();

  return fetchJson(`${API_BASE_URL}/attendance/history${qs ? "?" + qs : ""}`, { headers: getHeaders() });
};

export const createUser = async (data: {
  username: string;
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: number;
}) => {
  return fetchJson(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
};
