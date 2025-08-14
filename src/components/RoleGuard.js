"use client";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function RoleGuard({ allowedRoles, children }) {
  const { authenticated, role } = useContext(AuthContext);

  if (!authenticated) return null;
  if (!allowedRoles.includes(role)) return null;

  return <>{children}</>;
}
