import axios from "axios";
import { logout } from "@/utils/auth"; // we'll create this

const api = axios.create({
  baseURL: "https://backend.tritorc.com/api",
  // baseURL: "http://localhost:4000/api",
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 469) {
      logout(); // clear tokens + redirect
    }
    return Promise.reject(error);
  }
);

export default api;
