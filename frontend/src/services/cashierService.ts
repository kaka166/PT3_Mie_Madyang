export type ApiMenu = {
  id: number;
  nama_menu: string;
  harga_jual: number;
  is_active: number;
  gambar?: string;
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

export const getMenus = async (): Promise<MenuItem[]> => {
  const res = await fetch("http://127.0.0.1:8000/api/menu");
  const data: { data: ApiMenu[] } = await res.json();

  return data.data
    .filter((item) => item.is_active === 1)
    .map((item) => ({
      id: item.id,
      name: item.nama_menu,
      price: item.harga_jual,
      stock: 50,
      kategori: item.kategori?.nama_kategori || "",
      gambar: item.gambar,
    }));
};