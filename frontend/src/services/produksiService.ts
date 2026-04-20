// const BASE_URL = "https://api.farelzy.my.id/api/hpp";

// type ProduksiPayload = {
//   nama_menu: string;
//   bahan: {
//     nama: string;
//     harga_beli: number;
//     jumlah_porsi: number;
//   }[];
//   target_penjualan: number;
//   beban_sewa: number;
//   beban_gaji: number;
//   beban_lain_lain: number;
// };

// export const produksiService = {
//   async getProduksi() {
//     const res = await fetch(`${BASE_URL}/produksi`);
//     return res.json();
//   },

//   async getMenu() {
//     const res = await fetch(`${BASE_URL}/menu`);
//     return res.json();
//   },

//   async getBahan() {
//     const res = await fetch(`${BASE_URL}/bahan`);
//     return res.json();
//   },

//   async createProduksi(data: ProduksiPayload) {
//     const res = await fetch(`${BASE_URL}/produksi`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });

//     return res.json();
//   },

//   async updateProduksi(id: number, data: any) {
//     const res = await fetch(`${BASE_URL}/produksi/${id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });

//     return res.json();
//   },
// };
