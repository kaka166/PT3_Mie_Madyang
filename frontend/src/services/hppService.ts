import axios from "axios";

const API_URL = "https://api.farelzy.my.id/api";

export interface HppHistoryDetail {
  id: number;
  hpp_history_id: number;
  nama_bahan: string;
  harga_beli: number;
  jumlah_porsi: number;
  hpp_per_porsi: number;
}

export interface HppHistory {
  id: number;
  nama_menu: string;
  target_penjualan: number;
  beban_sewa: number;
  beban_gaji: number;
  beban_lain_per_porsi: number;
  total_hpp: number;
  created_at: string;
  details: HppHistoryDetail[];
}

export interface HppRequestBahan {
  nama: string;
  harga_beli: number;
  jumlah_porsi: number;
}

export interface CalculateHppRequest {
  nama_menu: string;
  bahan: HppRequestBahan[];
  target_penjualan: number;
  beban_sewa: number;
  beban_gaji: number;
  beban_lain_lain: number;
}

const getHeaders = () => {
  // Ambil token dari localStorage (sesuaikan key 'token' dengan yang kamu pakai saat login)
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };
};

export const hppService = {
  // Ambil Riwayat dari DB
  getHistory: async (): Promise<HppHistory[]> => {
    const response = await axios.get(`${API_URL}/hpp-history`, getHeaders());
    return response.data.data;
  },

  calculateAndSave: async (data: CalculateHppRequest): Promise<HppHistory> => {
    const response = await axios.post(`${API_URL}/calculate-hpp`, data, getHeaders());
    return response.data.data;
  },
};