const API_BASE_URL = "https://api.farelzy.my.id/api";

// ================= TYPES =================
export interface TaxSetting {
  id?: number;
  is_enabled: boolean;
  tax_percent: number;
}

// ================= GET TAX =================
export const getTax = async (): Promise<TaxSetting> => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/tax`, {
    headers,
  });

  if (!res.ok) {
    throw new Error("Gagal fetch tax");
  }

  return res.json();
};

// ================= UPDATE TAX =================
export const updateTax = async (payload: TaxSetting): Promise<TaxSetting> => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await fetch(`${API_BASE_URL}/tax`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Gagal update tax");
  }

  return res.json();
};
