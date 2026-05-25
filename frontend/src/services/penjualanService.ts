import { API_BASE_URL } from "@/config";

// 🔥 Helper Headers (pakai token kalau ada)
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

// ================= TYPES =================

export type OrderItemPayload = {
  menu_id: number;
  qty: number;
  note?: string;
};

export type CreateOrderPayload = {
  customer_name?: string;
  order_type: string;
  metode_pembayaran: "QRIS" | "Tunai";
  items: OrderItemPayload[];
};
export type Order = {
  id: string;
  original_id: number;
  waktu: string;
  customer: string;
  items: number;
  harga: number;
  kondisi: string;
  status: string;
};

export type DetailItem = {
  nama: string;
  qty: number;
  note: string;
  harga: number;
  subtotal: number;
};

export type Pemasukan = {
  no: string;
  nama: string;
  waktu: string;
  kasir: string;
  metode: string;
  jumlah: number;
  kondisi: string;
  details: DetailItem[];
  tunai?: number;
  kembalian?: number;
};

// ================= API FUNCTIONS =================

// 🔥 GET ORDERS (Kitchen)
export const getOrders = async (): Promise<Order[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      headers: getHeaders(),
    });

    const text = await res.text();
    if (!res.ok) {
      let msg = "Gagal ambil orders";
      try { const j = JSON.parse(text); msg = j.message || j.error || msg; } catch {}
      throw new Error(msg);
    }

    return JSON.parse(text) || [];
  } catch (error) {
    console.error("Error getOrders:", error);
    return [];
  }
};

// 🔥 CREATE ORDER (Cashier)
export const createOrder = async (
  payload: CreateOrderPayload,
): Promise<any> => {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      credentials: "include",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("ERROR BACKEND:", data);
      throw new Error(data.message || "Gagal create order");
    }

    return data;
  } catch (error) {
    console.error("Error createOrder:", error);
    return null;
  }
};

// 🔥 UPDATE STATUS (Kitchen)
export const updateOrderStatus = async (
  id: number,
  status: "pending" | "cooking" | "done",
): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });

    const text = await res.text();
    if (!res.ok) {
      let msg = "Gagal update status";
      try { const j = JSON.parse(text); msg = j.message || j.error || msg; } catch {}
      throw new Error(msg);
    }

    return true;
  } catch (error) {
    console.error("Error updateStatus:", error);
    return false;
  }
};

export const getPemasukan = async (sessionId?: number | null): Promise<Pemasukan[]> => {
  try {
    let url = `${API_BASE_URL}/pemasukan`;
    if (sessionId) {
      url += `?session_id=${sessionId}`;
    }
    const res = await fetch(url, {
      headers: getHeaders(),
    });

    const text = await res.text();
    if (!res.ok) {
      let msg = "Gagal ambil pemasukan";
      try { const j = JSON.parse(text); msg = j.message || j.error || msg; } catch {}
      throw new Error(msg);
    }

    return JSON.parse(text);
  } catch (err) {
    console.error(err);
    return [];
  }
};
