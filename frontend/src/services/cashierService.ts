export type ApiMenu = {
  id: number;
  nama_menu: string;
  harga_jual: string;
  is_active: number;
  is_fast_moving?: boolean;
  gambar?: string | null;
  kategori?: { nama_kategori: string };
  stock?: number;
};

export type MenuItem = {
  id: number;
  name: string;
  price: number;
  stock: number;
  kategori: string;
  gambar?: string;
  is_fast_moving?: boolean;
};

export type ApiCategory = {
  id: number;
  nama_kategori: string;
  is_active: number;
};

import { API_BASE_URL } from "@/config";

// Helper Headers khusus Kasir
const getCashierHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: HeadersInit = { Accept: "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

export const getMenus = async (): Promise<MenuItem[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/menu`, {
      headers: getCashierHeaders(),
    });

    const text = await res.text();
    if (!res.ok) {
      let msg = "Gagal ambil data dari server";
      try { const j = JSON.parse(text); msg = j.message || j.error || msg; } catch {}
      throw new Error(msg);
    }

    const data: { data: ApiMenu[] } = JSON.parse(text);
    return (data.data || [])
      .filter((item) => item.is_active === 1)
      .map((item) => ({
        id: item.id,
        name: item.nama_menu,
        price: parseFloat(item.harga_jual),
        stock: item.stock ?? 0,
        kategori: item.kategori?.nama_kategori || "Umum",
        gambar: item.gambar || "",
        is_fast_moving: item.is_fast_moving ?? false,
      }));
  } catch (error) {
    console.error("Error GetMenus Kasir:", error);
    return [];
  }
};

export const getCategories = async (): Promise<string[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/kategori`, {
      headers: getCashierHeaders(),
    });

    const text = await res.text();
    if (!res.ok) {
      let msg = "Gagal ambil kategori";
      try { const j = JSON.parse(text); msg = j.message || j.error || msg; } catch {}
      throw new Error(msg);
    }

    const data: { data: ApiCategory[] } = JSON.parse(text);
    const activeCats = (data.data || [])
      .filter((cat) => cat.is_active === 1)
      .map((cat) => cat.nama_kategori);

    return ["All Items", ...activeCats];
  } catch (error) {
    console.error("Error GetCategories Kasir:", error);
    return ["All Items"];
  }
};
