const API_BASE_URL = "http://127.0.0.1:8000/api";

// ==========================
// TYPES
// ==========================
export interface Bahan {
  id: number;
  nama: string;
}

export interface StockHistory {
  id: number;
  bahan_id: number;
  tipe: "plus" | "minus";
  kategori: string;
  alasan: string;
  jumlah: number;
  satuan: string;
  created_at: string;
}

export interface CreateStockPayload {
  bahan_id: number | null;
  nama?: string;
  jumlah: number;
  satuan: string;
  tipe: "plus" | "minus";
  kategori: "penyesuaian" | "restock" | "produksi";
  alasan?: string;
}

// ==========================
// AUTH HEADER HELPER 🔥
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
// HELPER FETCH (ANTI ERROR)
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
// GET BAHAN
// ==========================
export const getBahan = async (): Promise<Bahan[]> => {
  const res = await fetch(`${API_BASE_URL}/bahan`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
};

// ==========================
// GET HISTORY BY BAHAN
// ==========================
export const getStockHistory = async (
  bahanId: number,
): Promise<StockHistory[]> => {
  const res = await fetch(`${API_BASE_URL}/stok-history/${bahanId}`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
};

// ==========================
// CREATE STOCK MOVEMENT
// ==========================
export const createStockMovement = async (payload: CreateStockPayload) => {
  const res = await fetch(`${API_BASE_URL}/stok-movement`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
};

// ==========================
// GET STOCK LIST (TABLE)
// ==========================
export const getStockList = async () => {
  const res = await fetch(`${API_BASE_URL}/stock-list`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
};

// ==========================
// GET FULL HISTORY (TABLE)
// ==========================
export const getFullHistory = async () => {
  const res = await fetch(`${API_BASE_URL}/stock-history`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
};
