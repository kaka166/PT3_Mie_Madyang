import { API_BASE_URL } from "@/config";

const getHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: HeadersInit = { Accept: "application/json" };
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

export interface QrisSetting {
  id: number;
  nama_bank: string | null;
  nama_pemilik: string | null;
  no_rekening: string | null;
  gambar_qris: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const getQrisSettings = async (): Promise<{ success: boolean; data: QrisSetting[] }> => {
  return fetchJson(`${API_BASE_URL}/qris-settings`, { headers: getHeaders() });
};

export const createQrisSetting = async (formData: FormData): Promise<{ success: boolean; message: string; data: QrisSetting }> => {
  const token = localStorage.getItem("token");
  return fetchJson(`${API_BASE_URL}/qris-settings`, {
    method: "POST",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    body: formData,
  });
};

export const updateQrisSetting = async (id: number, formData: FormData): Promise<{ success: boolean; message: string; data: QrisSetting }> => {
  formData.append("_method", "PUT");
  const token = localStorage.getItem("token");
  return fetchJson(`${API_BASE_URL}/qris-settings/${id}`, {
    method: "POST",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    body: formData,
  });
};

export const deleteQrisSetting = async (id: number): Promise<{ success: boolean; message: string }> => {
  const token = localStorage.getItem("token");
  return fetchJson(`${API_BASE_URL}/qris-settings/${id}`, {
    method: "DELETE",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  });
};
