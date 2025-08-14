"use client";
import Link from "next/link";
import { Home, Users, Settings } from "lucide-react";

const routes = [
    { name: "Dashboard", path: "/", icon: Home, roles: ["superadmin", "admin", "editor", "viewer"] },
    { name: "Leads", path: "/leads", icon: Users, roles: ["superadmin", "admin", "editor", "viewer"] },
    { name: "Users", path: "/users", icon: Settings, roles: ["superadmin", "admin"] },
];

export default function Sidebar({ open, setOpen, role }) {
    const allowedRoutes = routes.filter((route) => route.roles.includes(role));

    return (
        <aside
            className={`bg-white shadow-md fixed left-0 top-[64px]  // 64px = header height
            transition-all duration-300 z-1
            ${open ? "w-44" : "w-16"} flex flex-col`}
            style={{ height: "calc(100vh - 64px)" }}
        >
            <nav className="flex-1 mt-4 space-y-1 overflow-y-auto">
                {allowedRoutes.map(({ name, path, icon: Icon }) => (
                    <Link
                        key={path}
                        href={path}
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                    >
                        <Icon size={20} />
                        {open && <span>{name}</span>}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
