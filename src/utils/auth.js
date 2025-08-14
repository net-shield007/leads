import {jwtDecode} from "jwt-decode";

export function isAuthenticated() {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("access_token");
}

export function getUserRole() {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.role || null;
  } catch (e) {
    return null;
  }
}

export function login(token) {
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", token);
  }
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  }
}
