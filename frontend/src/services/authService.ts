// src/services/authService.ts

export interface User {
  id: number;
  username: string; // Tambahkan ini
  name: string; // Ini dari fullName di database
  email: string;
  phone?: string; // Tambahkan ini (optional)
  role: string; // Sekarang sudah ada di DB
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

const API_URL = "/api";

export const authService = {
  async login(identifier: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          login: identifier, // Bisa diisi username atau email
          password: password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorData = result as ErrorResponse;
        throw new Error(errorData.message || "Login gagal, lur!");
      }

      const successData = result as LoginResponse;

      if (typeof window !== "undefined") {
        localStorage.setItem("token", successData.data.token);
        localStorage.setItem("user", JSON.stringify(successData.data.user));
      }

      return successData;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Terjadi kesalahan koneksi ke server.");
    }
  },

  async register(
    username: string,
    fullName: string,
    email: string,
    phone: string,
    password: string,
  ): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username: username, // Kirim username ke kolom baru
          fullName: fullName, // Kirim ke name di Laravel
          email: email,
          phone: phone, // Kirim ke phone di Laravel
          password: password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Jika ada error validasi dari Laravel (misal email duplikat)
        const errorData = result as ErrorResponse;
        throw new Error(errorData.message || "Pendaftaran gagal, lur!");
      }

      return result as LoginResponse;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Terjadi kesalahan saat mendaftar.");
    }
  },

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },
};
