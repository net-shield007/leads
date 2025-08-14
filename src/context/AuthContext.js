"use client";
import { createContext, useState, useEffect } from "react";
import { isAuthenticated, getUserRole } from "@/utils/auth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  const syncAuth = () => {
    setAuthenticated(isAuthenticated());
    setRole(getUserRole());
  };

  useEffect(() => {
    syncAuth();

    const handleStorageChange = () => {
      syncAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ authenticated, role, setAuthenticated, setRole }}>
      {children}
    </AuthContext.Provider>
  );
}
