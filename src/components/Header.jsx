"use client";

import { useState } from "react";
import { BarChart3, Plus, Menu, X } from "lucide-react";
import { logout } from "@/utils/auth";
import RoleGuard from "@/components/RoleGuard";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { toast } from "react-toastify";
import api from "@/lib/axios"

export default function Header({ toggleSidebar }) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [newLead, setNewLead] = useState({
        fullName: "",
        email: "",
        phone: "",
        countryCode: "",
        companyName: "",
        subject: "",
        message: "",
        preferredContact: "email",
        subscribeNewsletter: false,
        status: "new",
    });
    const [loading, setLoading] = useState(false);

    function handleLogout() {
        logout();
    }

    const handlePhoneChange = (value, data) => {
        const cleaned = `+${value.replace(/\D/g, "")}`;
        setNewLead((prev) => ({
            ...prev,
            countryCode: `+${data.dialCode}`,
            phone: cleaned,
        }));
    };

    const addNewLead = async () => {
        try {
            setLoading(true);
            const payload = {
                fullName: newLead.fullName,
                email: newLead.email,
                phone: newLead.phone,
                company: newLead.companyName,
                subject: newLead.subject,
                message: newLead.message,
                preferredContactMethod: newLead.preferredContact,
                subscribeNewsletter: newLead.subscribeNewsletter,
            };

            const res = await api.post("/contact", payload);

            if (!res.status === 201) {
                throw new Error("Failed to create lead");
            }

            toast.success("Lead created");

            // Reset form and close modal
            setNewLead({
                fullName: "",
                email: "",
                phone: "",
                countryCode: "",
                companyName: "",
                subject: "",
                message: "",
                preferredContact: "email",
                subscribeNewsletter: false,
                status: "new",
            });
            setShowAddModal(false);
        } catch (error) {
            toast.error("Error creating lead");
        } finally {
            setLoading(false);
        }
    };

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
            <div className="mx-auto px-2 py-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button onClick={toggleSidebar} className="p-2 rounded hover:bg-gray-100">
                            <Menu size={20} className="text-black" />
                        </button>
                        <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                            <BarChart3 className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">
                                Lead Dashboard
                            </h1>
                            <p className="text-sm text-gray-600">
                                Manage your sales pipeline
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <RoleGuard allowedRoles={['superadmin', 'admin', 'editor']}>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                            >
                                <Plus size={18} className="mr-2" />
                                Add Lead
                            </button>
                        </RoleGuard>

                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            {/* Add Lead Modal */}
            <RoleGuard allowedRoles={['superadmin', 'admin', 'editor']}>
                {showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-100">
                        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            {/* Modal Header */}
                            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Add New Lead</h2>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={newLead.fullName}
                                            onChange={(e) =>
                                                setNewLead({ ...newLead, fullName: e.target.value })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-4 focus:ring-red-50"
                                            placeholder="Enter full name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Company Name
                                        </label>
                                        <input
                                            type="text"
                                            value={newLead.companyName}
                                            onChange={(e) =>
                                                setNewLead({ ...newLead, companyName: e.target.value })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-4 focus:ring-red-50"
                                            placeholder="Enter company name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            value={newLead.email}
                                            onChange={(e) =>
                                                setNewLead({ ...newLead, email: e.target.value })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-4 focus:ring-red-50"
                                            placeholder="Enter email address"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <div className="flex space-x-2">
                                            <PhoneInput
                                                country={"us"}
                                                value={newLead.phone.replace("+", "")}
                                                onChange={handlePhoneChange}
                                                inputClass="!w-full !py-5 !text-base"
                                                buttonClass="!py-5"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Subject
                                        </label>
                                        <input
                                            type="text"
                                            value={newLead.subject}
                                            onChange={(e) =>
                                                setNewLead({ ...newLead, subject: e.target.value })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-4 focus:ring-red-50"
                                            placeholder="Enter subject"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        value={newLead.message}
                                        onChange={(e) =>
                                            setNewLead({ ...newLead, message: e.target.value })
                                        }
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-4 focus:ring-red-50"
                                        placeholder="Enter message"
                                    />
                                </div>

                                <div className="mt-6 flex items-center space-x-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Preferred Contact
                                        </label>
                                        <div className="flex space-x-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="preferredContact"
                                                    value="email"
                                                    checked={newLead.preferredContact === "email"}
                                                    onChange={(e) =>
                                                        setNewLead({
                                                            ...newLead,
                                                            preferredContact: e.target.value,
                                                        })
                                                    }
                                                    className="mr-2"
                                                />
                                                Email
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="preferredContact"
                                                    value="phone"
                                                    checked={newLead.preferredContact === "phone"}
                                                    onChange={(e) =>
                                                        setNewLead({
                                                            ...newLead,
                                                            preferredContact: e.target.value,
                                                        })
                                                    }
                                                    className="mr-2"
                                                />
                                                Phone
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="flex items-center mt-6">
                                            <input
                                                type="checkbox"
                                                checked={newLead.subscribeNewsletter}
                                                onChange={(e) =>
                                                    setNewLead({
                                                        ...newLead,
                                                        subscribeNewsletter: e.target.checked,
                                                    })
                                                }
                                                className="mr-2"
                                            />
                                            Subscribe to newsletter
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 border-t border-gray-200 flex space-x-3">
                                <button
                                    onClick={addNewLead}
                                    disabled={!newLead.fullName || !newLead.email || loading}
                                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                                >
                                    {loading ? "Adding..." : "Add Lead"}
                                </button>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </RoleGuard>
        </header>
    );
}
