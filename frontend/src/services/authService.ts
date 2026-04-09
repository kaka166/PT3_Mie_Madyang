// src/services/authService.ts

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  phone?: string;
  role: number; // Menggunakan ID: 1 (Owner), 2 (Kasir), 3 (Dapur)
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

const API_URL = "https://api.farelzy.my.id/api";

export const authService = {
  async login(identifier: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          login: identifier,
          password: password,
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server tidak merespon dengan JSON. Cek apakah backend menyala?");
      }

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
      console.error("Auth Error:", error);
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
          "Accept": "application/json",
        },
        body: JSON.stringify({
          username,
          fullName,
          email,
          phone,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorData = result as ErrorResponse;
        const firstError = errorData.errors ? Object.values(errorData.errors)[0][0] : null;
        throw new Error(firstError || errorData.message || "Pendaftaran gagal!");
      }

      return result as LoginResponse;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Terjadi kesalahan koneksi ke server.");
    }
  },

  getRole(): number | null {
    if (typeof window !== "undefined") {
      const userJson = localStorage.getItem("user");
      if (userJson) {
        try {
          const user = JSON.parse(userJson) as User;
          return Number(user.role);
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  },

  getRoleName(roleId: number): string {
    const roles: Record<number, string> = {
      1: "Owner",
      2: "Kasir",
      3: "Dapur",
    };
    return roles[roleId] || "Guest";
  },

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },
};