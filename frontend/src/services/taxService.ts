import { API_BASE_URL } from "@/config";

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

  const text = await res.text();
  if (!res.ok) {
    let msg = "Gagal fetch tax";
    try { const j = JSON.parse(text); msg = j.message || j.error || msg; } catch {}
    throw new Error(msg);
  }

  return JSON.parse(text);
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

  const text = await res.text();
  if (!res.ok) {
    let msg = "Gagal update tax";
    try { const j = JSON.parse(text); msg = j.message || j.error || msg; } catch {}
    throw new Error(msg);
  }

  return JSON.parse(text);
};
