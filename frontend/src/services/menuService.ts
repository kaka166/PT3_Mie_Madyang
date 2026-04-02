// src/services/menuService.ts

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

// UBAH 127.0.0.1 JADI localhost AGAR SAMA DENGAN FRONTEND
const API_BASE_URL = "http://localhost:8000/api";

export const menuService = {
    getCategories: async () => {
        const res = await fetch(`${API_BASE_URL}/kategori`);
        if (!res.ok) throw new Error("Gagal fetch kategori");
        return res.json();
    },

    getAll: async (): Promise<{ data: Menu[] }> => {
        const res = await fetch(`${API_BASE_URL}/menu`, {
            headers: { "Accept": "application/json" }
        });
        if (!res.ok) throw new Error("Gagal mengambil data menu");
        return res.json();
    },

    // Tambah menu baru
    create: async (formData: FormData): Promise<void> => {
        const res = await fetch(`${API_BASE_URL}/menu`, {
            method: "POST",
            body: formData,
            // PENTING: Jangan pasang header Content-Type di sini kalau pakai FormData
            headers: { "Accept": "application/json" }
        });

        if (!res.ok) {
            const errorData = await res.json();
            console.error("Laravel Validation Error:", errorData);
            throw new Error(errorData.message || "Gagal menambah menu");
        }
    },

    createCategory: async (nama: string) => {
        const res = await fetch(`${API_BASE_URL}/kategori`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nama_kategori: nama }),
        });
        if (!res.ok) throw new Error("Gagal simpan kategori");
        return res.json();
    },

    updateCategory: async (id: number, nama: string) => {
        const res = await fetch(`http://localhost:8000/api/kategori/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nama_kategori: nama }),
        });
        return res.json();
    },
    deleteCategory: async (id: number) => {
        const res = await fetch(`http://localhost:8000/api/kategori/${id}`, {
            method: "DELETE",
        });
        return res.json();
    },

    // Update menu (dengan spoofing PUT)
    update: async (id: number, formData: FormData): Promise<void> => {
        const res = await fetch(`${API_BASE_URL}/menu/${id}`, {
            method: "POST", // Tetap POST untuk upload file di Laravel
            body: formData,
            headers: { "Accept": "application/json" }
        });

        if (!res.ok) {
            const errorData = await res.json();
            console.error("Laravel Update Error:", errorData);
            throw new Error(errorData.message || "Gagal mengupdate menu");
        }
    },

    // Toggle status
    toggleStatus: async (menu: Menu): Promise<void> => {
        const res = await fetch(`${API_BASE_URL}/menu/${menu.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                nama_menu: menu.nama_menu,
                harga_jual: menu.harga_jual,
                kategori_id: menu.kategori_id,
                is_active: menu.is_active ? 0 : 1,
            }),
        });
        if (!res.ok) throw new Error("Gagal mengubah status menu");
    },

    toggleCategoryStatus: async (category: Category) => {
        const res = await fetch(`http://localhost:8000/api/kategori/${category.id}/toggle`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        if (!res.ok) {
            // Ambil pesan error asli dari Laravel
            const errorData = await res.json().catch(() => ({}));
            console.error("LARAVEL NYERAH KARENA:", errorData); // <--- CEK DI CONSOLE F12
            throw new Error(errorData.message || "Gagal mengubah status kategori");
        }
        return res.json();
    },

    // Hapus menu
    delete: async (id: number): Promise<void> => {
        const res = await fetch(`${API_BASE_URL}/menu/${id}`, {
            method: "DELETE",
            headers: { "Accept": "application/json" }
        });
        if (!res.ok) throw new Error("Gagal menghapus menu");
    },
};