const API_BASE_URL = "https://api.farelzy.my.id/api";

// ==========================
// TYPES
// ==========================
export interface Pengeluaran {
  id: string;
  nama: string;
  kategori: string;
  user_id: string;
  waktu: string;
  jumlah: number;
}

// ==========================
// AUTH HEADER HELPER
// ==========================
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token tidak ditemukan, silakan login ulang");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// ==========================
// HELPER FETCH
// ==========================
const handleResponse = async (res: Response) => {
  const text = await res.text();

  if (!res.ok) {
    console.error("API ERROR:", text);
    throw new Error("Request gagal");
  }

  try {
    return JSON.parse(text);
  } catch {
    console.error("Bukan JSON:", text);
    throw new Error("Response bukan JSON");
  }
};

// ==========================
// GET PENGELUARAN (LIST)
// ==========================
export const getPengeluaran = async (): Promise<Pengeluaran[]> => {
  const res = await fetch(`${API_BASE_URL}/pengeluaran`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
};

// ==========================
// CREATE PENGELUARAN (OPTIONAL)
// ==========================
export const createPengeluaran = async (payload: {
  nama_pengeluaran: string;
  jumlah: number;
  tanggal?: string;
}) => {
  const res = await fetch(`${API_BASE_URL}/pengeluaran`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
};
