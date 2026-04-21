const API_BASE_URL = "https://api.farelzy.my.id/api";

const getHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

export const startSession = async (opening_cash: number) => {
  const res = await fetch(`${API_BASE_URL}/session/start`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ opening_cash }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const endSession = async (closing_cash: number) => {
  const res = await fetch(`${API_BASE_URL}/session/end`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ closing_cash }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const getActiveSession = async () => {
  const res = await fetch(`${API_BASE_URL}/session/active`, {
    headers: getHeaders(),
  });

  if (!res.ok) return null;

  return await res.json();
};
