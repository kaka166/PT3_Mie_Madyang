// src/config.ts

const PROD_BASE_URL = "https://api.farelzy.my.id";
const DEV_BASE_URL = "http://127.0.0.1:8000";

export const getBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return DEV_BASE_URL;
    }
  }
  // Production VPS Backend
  return PROD_BASE_URL;
};

// Getter functions so URL is resolved dynamically at call time (not frozen at SSR module load)
export const getApiBaseUrl = (): string => `${getBaseUrl()}/api`;
export const getStorageBaseUrl = (): string => `${getBaseUrl()}/storage`;

// Also export as static constants (evaluated client-side at module load)
export const API_BASE_URL = typeof window !== "undefined"
  ? (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? `${DEV_BASE_URL}/api`
      : `${PROD_BASE_URL}/api`)
  : `${PROD_BASE_URL}/api`;

export const STORAGE_BASE_URL = typeof window !== "undefined"
  ? (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? `${DEV_BASE_URL}/storage`
      : `${PROD_BASE_URL}/storage`)
  : `${PROD_BASE_URL}/storage`;

