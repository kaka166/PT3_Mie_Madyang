const API_BASE_URL = "http://127.0.0.1:8000/api";

const getHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: HeadersInit = { Accept: "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
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
  const res = await fetch(`${API_BASE_URL}/qris-settings`, { headers: getHeaders() });
  return res.json();
};

export const createQrisSetting = async (formData: FormData): Promise<{ success: boolean; message: string; data: QrisSetting }> => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE_URL}/qris-settings`, {
    method: "POST",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    body: formData,
  });
  return res.json();
};

export const updateQrisSetting = async (id: number, formData: FormData): Promise<{ success: boolean; message: string; data: QrisSetting }> => {
  formData.append("_method", "PUT");
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE_URL}/qris-settings/${id}`, {
    method: "POST",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    body: formData,
  });
  return res.json();
};

export const deleteQrisSetting = async (id: number): Promise<{ success: boolean; message: string }> => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE_URL}/qris-settings/${id}`, {
    method: "DELETE",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  });
  return res.json();
};