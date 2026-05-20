// src/config.ts

export const getBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://127.0.0.1:8000";
    }
  }
  // Production VPS Backend
  return "https://api.farelzy.my.id";
};

export const API_BASE_URL = `${getBaseUrl()}/api`;
export const STORAGE_BASE_URL = `${getBaseUrl()}/storage`;
