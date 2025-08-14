"use client";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import api from "@/lib/axios"; // your axios instance
import RoleGuard from "@/components/RoleGuard";


export default function UserPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "",
    });
    const [loading, setLoading] = useState(false);
    const { authenticated, role } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        const allowedRoles = ["superadmin", "admin"];
        if (!authenticated || !allowedRoles.includes(role)) {
            router.push("/");
        }
    }, [authenticated, role, router]);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post("/auth/register", formData);
            toast.success("User created successfully!");
            setFormData({ name: "", email: "", password: "", role: "" });
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message || "Failed to create user");
            } else {
                toast.error("Network error. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <ToastContainer />
            <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md p-6">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                    Add New User
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full pl-2 pr-4 py-3 border border-gray-200 rounded-lg focus:border-red-500 focus:ring-4 focus:ring-red-50 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full pl-2 pr-4 py-3 border border-gray-200 rounded-lg focus:border-red-500 focus:ring-4 focus:ring-red-50 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full pl-2 pr-4 py-3 border border-gray-200 rounded-lg focus:border-red-500 focus:ring-4 focus:ring-red-50 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role
                        </label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            className="w-full pl-2 pr-4 py-3 border border-gray-200 rounded-lg focus:border-red-500 focus:ring-4 focus:ring-red-50 transition-all"
                        >
                            <option value="">Select Role</option>
                            <RoleGuard allowedRoles={["superadmin"]}>
                                <option value="superadmin">Super Admin</option>
                            </RoleGuard>
                            <RoleGuard allowedRoles={["superadmin", "admin"]}>
                                <option value="admin">Admin</option>
                                <option value="editor">Editor</option>
                                <option value="viewer">Viewer</option>
                            </RoleGuard>
                        </select>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                    >
                        {loading ? "Creating..." : "Create User"}
                    </button>
                </form>
            </div>
        </div>
    );
}
