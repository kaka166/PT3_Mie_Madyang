export type ApiMenu = {
  id: number;
  nama_menu: string;
  harga_jual: string;
  is_active: number;
  gambar?: string | null;
  kategori?: { nama_kategori: string };
};

export type MenuItem = {
  id: number;
  name: string;
  price: number;
  stock: number;
  kategori: string;
  gambar?: string;
};

export type ApiCategory = {
  id: number;
  nama_kategori: string;
  is_active: number;
};

const API_BASE_URL = "http://127.0.0.1:8000/api";

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

    if (!res.ok) throw new Error("Gagal ambil data dari server");

    const data: { data: ApiMenu[] } = await res.json();
    return (data.data || [])
      .filter((item) => item.is_active === 1)
      .map((item) => ({
        id: item.id,
        name: item.nama_menu,
        price: parseFloat(item.harga_jual),
        stock: 50, // Dummy stock
        kategori: item.kategori?.nama_kategori || "Umum",
        gambar: item.gambar || "",
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
    if (!res.ok) throw new Error("Gagal ambil kategori");

    const data: { data: ApiCategory[] } = await res.json();
    const activeCats = (data.data || [])
      .filter((cat) => cat.is_active === 1)
      .map((cat) => cat.nama_kategori);

    return ["All Items", ...activeCats];
  } catch (error) {
    console.error("Error GetCategories Kasir:", error);
    return ["All Items"];
  }
};
