export type ApiMenu = {
  id: number;
  nama_menu: string;
  harga_jual: string; // Ubah ke string karena di JSON pake kutip "10099.00"
  is_active: number;
  gambar?: string | null;
  kategori?: {
    nama_kategori: string;
  };
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

export const getMenus = async (): Promise<MenuItem[]> => {
  try {
    const res = await fetch("https://api.farelzy.my.id/api/menu");

    if (!res.ok) throw new Error("Gagal ambil data dari server");

    const data: { data: ApiMenu[] } = await res.json();
    return (data.data || [])
      .filter((item) => item.is_active === 1)
      .map((item) => ({
        id: item.id,
        name: item.nama_menu,
        price: parseFloat(item.harga_jual),
        stock: 50,
        kategori: item.kategori?.nama_kategori || "Umum",
        gambar: item.gambar || "",
      }));
  } catch (error) {
    console.error("Error GetMenus:", error);
    return [];
  }

};

// Ambil Kategori Aktif
export const getCategories = async (): Promise<string[]> => {
  try {
    const res = await fetch("https://api.farelzy.my.id/api/kategori");
    const data: { data: ApiCategory[] } = await res.json();
    const activeCats = (data.data || [])
      .filter((cat) => cat.is_active === 1)
      .map((cat) => cat.nama_kategori);
    return ["All Items", ...activeCats];
  } catch (error) {
    console.error("Error GetCategories:", error);
    return ["All Items"];
  }
};