const BASE_URL = "https://api.farelzy.my.id/api/hpp";

export const produksiService = {
  async getProduksi() {
    const res = await fetch(`${BASE_URL}/produksi`);
    return res.json();
  },

  async getMenu() {
    const res = await fetch(`${BASE_URL}/menu`);
    return res.json();
  },

  async getBahan() {
    const res = await fetch(`${BASE_URL}/bahan`);
    return res.json();
  },

  async createProduksi(data: any) {
    const res = await fetch(`${BASE_URL}/produksi`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return res.json();
  },

  async updateProduksi(id: number, data: any) {
    const res = await fetch(`${BASE_URL}/produksi/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return res.json();
  },
};
