"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getUserRole } from "@/utils/auth";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function DashboardLayout({ children }) {
    const router = useRouter();
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [role, setRole] = useState(null);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.replace("/login");
        } else {
            setRole(getUserRole()); // fetch role from JWT/localStorage
            setCheckingAuth(false);
        }
    }, [router]);

    if (checkingAuth) {
        return <div className="p-6">Checking authentication...</div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Header full width */}
            <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            {/* Below header: sidebar + content */}
            <div className="flex flex-1">
                {/* Sidebar */}
                <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} role={role} />

                {/* Main content */}
                <main className="flex-1 ml-12 mt-2 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}
