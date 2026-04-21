export interface Menu {
  id: number;
  nama_menu: string;
  harga_jual: number;
  kategori_id: number;
  is_active: number;
  gambar?: string;
  kategori?: { nama_kategori: string };
  stock: number;
}

export interface Category {
  id: number;
  nama_kategori: string;
  is_active: number;
}

const API_BASE_URL = "https://api.farelzy.my.id/api";

// Helper buat ambil Token & Header
const getAdminHeaders = (isFormData = false) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: HeadersInit = { Accept: "application/json" };
  if (!isFormData) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

export const menuService = {
  // GET DATA
  getCategories: async () => {
    const res = await fetch(`${API_BASE_URL}/kategori`, {
      headers: getAdminHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal fetch kategori");
    return data;
  },

  getAll: async (): Promise<{ data: Menu[] }> => {
    const res = await fetch(`${API_BASE_URL}/menu`, {
      headers: getAdminHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil menu");
    return data;
  },

  // CATEGORY CRUD
  createCategory: async (nama: string) => {
    const res = await fetch(`${API_BASE_URL}/kategori`, {
      method: "POST",
      headers: getAdminHeaders(),
      body: JSON.stringify({ nama_kategori: nama }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal tambah kategori");
    return data;
  },

  updateCategory: async (id: number, nama: string) => {
    const res = await fetch(`${API_BASE_URL}/kategori/${id}`, {
      method: "PUT",
      headers: getAdminHeaders(),
      body: JSON.stringify({ nama_kategori: nama }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal update kategori");
    return data;
  },

  deleteCategory: async (id: number) => {
    const res = await fetch(`${API_BASE_URL}/kategori/${id}`, {
      method: "DELETE",
      headers: getAdminHeaders(),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Gagal hapus kategori");
    }
  },

  toggleCategoryStatus: async (category: Category) => {
    const res = await fetch(`${API_BASE_URL}/kategori/${category.id}/toggle`, {
      method: "PUT",
      headers: getAdminHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal toggle kategori");
    return data;
  },

  // MENU CRUD
  create: async (formData: FormData) => {
    const res = await fetch(`${API_BASE_URL}/menu`, {
      method: "POST",
      body: formData,
      headers: getAdminHeaders(true), // Pake true karena FormData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal tambah menu");
    return data;
  },

  update: async (id: number, formData: FormData) => {
    const res = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: "POST",
      body: formData,
      headers: getAdminHeaders(true),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal update menu");
    return data;
  },

  toggleStatus: async (menu: Menu) => {
    const res = await fetch(`${API_BASE_URL}/menu/${menu.id}/toggle`, {
      method: "PUT",
      headers: getAdminHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal toggle menu");
    return data;
  },

  delete: async (id: number) => {
    const res = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: "DELETE",
      headers: getAdminHeaders(),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Gagal hapus menu");
    }
  },

  updateStock: async (id: number, stock: number) => {
    const res = await fetch(`${API_BASE_URL}/menu/${id}/stock`, {
      method: "PATCH",
      headers: getAdminHeaders(),
      body: JSON.stringify({ stock }),
    });

    if (!res.ok) throw new Error("Gagal update stok");
  },
};
