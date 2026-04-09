export interface Menu {
  id: number;
  nama_menu: string;
  harga_jual: number;
  kategori_id: number;
  is_active: number;
  gambar?: string;
  kategori?: {
    nama_kategori: string;
  };
}

export interface Category {
  id: number;
  nama_kategori: string;
  is_active: number;
}

const API_BASE_URL = "http://localhost:8000/api";

export const menuService = {
  // ========================
  // GET DATA
  // ========================
  getCategories: async () => {
    const res = await fetch(`${API_BASE_URL}/kategori`);
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Gagal fetch kategori");
    return data;
  },

  getAll: async (): Promise<{ data: Menu[] }> => {
    const res = await fetch(`${API_BASE_URL}/menu`, {
      headers: { Accept: "application/json" },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Gagal mengambil menu");
    return data;
  },

  // ========================
  // CATEGORY
  // ========================
  createCategory: async (nama: string) => {
    const res = await fetch(`${API_BASE_URL}/kategori`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama_kategori: nama }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("ERROR LARAVEL:", data);
      throw new Error(data.message || "Gagal tambah kategori");
    }

    return data;
  },

  updateCategory: async (id: number, nama: string) => {
    const res = await fetch(`${API_BASE_URL}/kategori/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama_kategori: nama }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Gagal update kategori");
    return data;
  },

  deleteCategory: async (id: number) => {
    const res = await fetch(`${API_BASE_URL}/kategori/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Gagal hapus kategori");
    return data;
  },

  toggleCategoryStatus: async (category: Category) => {
    const res = await fetch(`${API_BASE_URL}/kategori/${category.id}/toggle`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
      },
    });

    const data = await res.json();

    console.log("RESPONSE TOGGLE:", data);

    if (!res.ok) {
      console.error("TOGGLE ERROR:", data);
      throw new Error(data.message || "Gagal toggle kategori");
    }

    return data;
  },

  // ========================
  // MENU
  // ========================
  create: async (formData: FormData) => {
    const res = await fetch(`${API_BASE_URL}/menu`, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("CREATE MENU ERROR:", data);
      throw new Error(data.message || "Gagal tambah menu");
    }
  },

  update: async (id: number, formData: FormData) => {
    const res = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("UPDATE MENU ERROR:", data);
      throw new Error(data.message || "Gagal update menu");
    }
  },

  toggleStatus: async (menu: Menu) => {
    const res = await fetch(`${API_BASE_URL}/menu/${menu.id}/toggle`, {
      method: "PUT",
      headers: { Accept: "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("TOGGLE MENU ERROR:", data);
      throw new Error(data.message || "Gagal toggle menu");
    }
  },

  delete: async (id: number) => {
    const res = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Gagal hapus menu");
  },
};
