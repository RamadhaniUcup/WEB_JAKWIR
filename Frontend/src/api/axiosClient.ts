import axios from "axios";
import { useAuthStore } from "../store/useAuthStore.js";

// Buat client Axios kustom
export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Menyisipkan JWT token secara otomatis ke header Authorization
axiosClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Menangani error global (misal: redirect ke login jika 401)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Sesi kedaluwarsa atau tidak valid, pemicu logout global
      useAuthStore.getState().logout();
      window.location.href = "/debitur/login";
    }
    return Promise.reject(error);
  }
);
