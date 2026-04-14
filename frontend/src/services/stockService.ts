const API_BASE_URL = "https://api.farelzy.my.id/api";

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
// GET BAHAN (WAJIB 🔥)
// ==========================
export const getBahan = async (): Promise<Bahan[]> => {
  const res = await fetch(`${API_BASE_URL}/bahan`);

  if (!res.ok) {
    throw new Error("Gagal fetch bahan");
  }

  return res.json();
};

// ==========================
// GET HISTORY BY BAHAN
// ==========================
export const getStockHistory = async (
  bahanId: number,
): Promise<StockHistory[]> => {
  const res = await fetch(`${API_BASE_URL}/stok-history/${bahanId}`);

  if (!res.ok) {
    throw new Error("Gagal fetch history");
  }

  return res.json();
};

// ==========================
// CREATE STOCK MOVEMENT
// ==========================
export const createStockMovement = async (payload: CreateStockPayload) => {
  const res = await fetch(`${API_BASE_URL}/stok-movement`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Gagal simpan data");
  }

  return res.json();
};

// ==========================
// GET STOCK LIST (TABLE)
// ==========================
export const getStockList = async () => {
  const res = await fetch(`${API_BASE_URL}/stock-list`);

  if (!res.ok) {
    throw new Error("Gagal fetch stock list");
  }

  return res.json();
};

// ==========================
// GET FULL HISTORY (TABLE)
// ==========================
export const getFullHistory = async () => {
  const res = await fetch(`${API_BASE_URL}/stock-history`);

  if (!res.ok) {
    throw new Error("Gagal fetch history");
  }

  return res.json();
};
