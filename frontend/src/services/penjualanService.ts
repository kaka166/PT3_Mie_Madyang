const API_BASE_URL = "https://api.farelzy.my.id/api";

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
};

export type CreateOrderPayload = {
  customer_name?: string;
  order_type: string;
  metode_pembayaran: "QRIS" | "Tunai";
  items: OrderItemPayload[];
};

export type Order = {
  id: string;
  waktu: string;
  customer: string;
  items: number;
  harga: number;
  kondisi: string;
  status: string;
};

// ================= API FUNCTIONS =================

// 🔥 GET ORDERS (Kitchen)
export const getOrders = async (): Promise<Order[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      headers: getHeaders(),
    });

    if (!res.ok) throw new Error("Gagal ambil orders");

    const data = await res.json();
    return data || [];
  } catch (error) {
    console.error("Error getOrders:", error);
    return [];
  }
};

// 🔥 CREATE ORDER (Cashier)
export const createOrder = async (
  payload: CreateOrderPayload,
): Promise<boolean> => {
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

    return true;
  } catch (error) {
    console.error("Error createOrder:", error);
    return false;
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

    if (!res.ok) throw new Error("Gagal update status");

    return true;
  } catch (error) {
    console.error("Error updateStatus:", error);
    return false;
  }
};

export const getPemasukan = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/pemasukan`, {
      headers: getHeaders(),
    });

    if (!res.ok) throw new Error("Gagal ambil pemasukan");

    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};
