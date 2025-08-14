"use client";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import RoleGuard from "@/components/RoleGuard";
import api from "@/lib/axios"; // your global axios instance
import { getStatusConfig, formatDate, formatTime } from "@/utils/func";
import { ToastContainer, toast } from 'react-toastify';

import {
    Eye,
    Trash2,
    Phone,
    Mail,
    Calendar,
    X,
    FileText,
    Bell,
} from "lucide-react";

export default function ContactTable() {
    const { role } = useContext(AuthContext);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [orderBy, setOrderBy] = useState("created_at");
    const [order, setOrder] = useState("desc");
    const [totalPages, setTotalPages] = useState(1);
    const [selectedLead, setSelectedLead] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false); // added loading state

    useEffect(() => {
        fetchData();
    }, [page, orderBy, order]);

    async function fetchData() {
        setLoading(true);
        try {
            const res = await api.get("/contact", {
                params: { page, limit, orderBy, order },
            });
            setData(res.data.data);
            setTotalPages(res.data.pagination.totalPages);
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message || "Failed to fetch leads");
            } else {
                toast.error("Network error. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    async function updateLeadStatus(id, e) {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.patch(`/contact/${id}`, {
                status: e.target.value
            });
            if (res.status === 200) {
                toast.success("Status Updated successfully");
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message || "Failed to update lead");
            } else {
                toast.error("Network error. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    async function deleteLead(id, e) {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.delete(`/contact/${id}`);
            if (res.status === 200) {
                setData((prev) => prev.filter((item) => item.id !== id));
                toast.success("Lead deleted successfully");
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message || "Failed to delete lead");
            } else {
                toast.error("Network error. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    const toggleOrder = (col) => {
        if (orderBy === col) {
            setOrder(order === "asc" ? "desc" : "asc");
        } else {
            setOrderBy(col);
            setOrder("asc");
        }
    };

    const openModal = (lead) => {
        setSelectedLead(lead);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedLead(null);
    };

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden relative">
            <ToastContainer />

            {/* Loading overlay */}
            {loading && (
                <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
                    <div className="loader border-t-transparent border-solid rounded-full border-red-500 border-4 h-8 w-8 animate-spin"></div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">
                                Lead
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">
                                Contact
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">
                                Subject
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">
                                Status
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">
                                Date
                            </th>
                            <th className="text-right px-6 py-4 text-sm font-medium text-gray-700">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.length === 0 && !loading ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="text-center py-6 text-gray-500"
                                >
                                    No data found
                                </td>
                            </tr>
                        ) : (
                            data.map((lead) => {
                                const statusConfig = getStatusConfig(lead.status);
                                return (
                                    <tr
                                        key={lead.id}
                                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                                        onClick={() => openModal(lead)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {lead.full_name}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {lead.company}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Mail size={14} className="mr-2 text-gray-400" />
                                                    {lead.email}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Phone size={14} className="mr-2 text-gray-400" />
                                                    {lead.phone}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="max-w-xs">
                                                <div className="font-medium text-gray-900 truncate">
                                                    {lead.subject}
                                                </div>
                                                <div className="text-sm text-gray-600 truncate">
                                                    {lead.message.substring(0, 60)}...
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}
                                            >
                                                {statusConfig.icon}
                                                <span className="ml-1 capitalize">{lead.status}</span>
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {formatDate(lead.created_at)}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                {formatTime(lead.created_at)}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openModal(lead);
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <RoleGuard allowedRoles={["superadmin", "admin", "editor"]}>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteLead(lead.id, e);
                                                        }}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </RoleGuard>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between p-4 border-t">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                    Prev
                </button>
                <span>
                    Page {page} of {totalPages}
                </span>
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>

            {showModal && selectedLead && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    Contact Lead Details
                                </h2>
                                {/* <p className="text-sm text-gray-600 font-mono">
                                    Product: {selectedLead.product_name}
                                </p> */}
                            </div>
                            <button
                                onClick={closeModal}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Basic Info */}
                                <div className="lg:col-span-2">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Contact Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Full Name
                                            </label>
                                            <p className="text-gray-900 font-medium">
                                                {selectedLead.full_name}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Company
                                            </label>
                                            <p className="text-gray-900 font-medium">
                                                {selectedLead.company}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Email
                                            </label>
                                            <a
                                                href={`mailto:${selectedLead.email}`}
                                                className="text-red-600 hover:text-red-700 font-medium"
                                            >
                                                {selectedLead.email}
                                            </a>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Phone
                                            </label>
                                            <a
                                                href={`tel:${selectedLead.phone}`}
                                                className="text-red-600 hover:text-red-700 font-medium"
                                            >
                                                {selectedLead.phone}
                                            </a>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Message Details
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Subject
                                            </label>
                                            <p className="text-gray-900 font-medium">
                                                {selectedLead.subject}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Message
                                            </label>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <p className="text-gray-800 leading-relaxed">
                                                    {selectedLead.message}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Sidebar */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Lead Status
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Status
                                            </label>
                                            <select
                                                value={selectedLead.status}
                                                onChange={(e) => {
                                                    const newStatus = e.target.value;
                                                    updateLeadStatus(selectedLead.id, e).then(() => {
                                                        setSelectedLead((prev) => ({
                                                            ...prev,
                                                            status: newStatus
                                                        }));

                                                        // Update in list (setData)
                                                        setData((prev) =>
                                                            prev.map((item) =>
                                                                item.id === selectedLead.id
                                                                    ? { ...item, status: newStatus }
                                                                    : item
                                                            )
                                                        );
                                                    });
                                                }}
                                                disabled={role === 'viewer'}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-4 focus:ring-red-50"
                                            >
                                                <option value="new">New</option>
                                                <option value="contacted">Contacted</option>
                                                <option value="qualified">Qualified</option>
                                                <option value="hot">Hot</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Preferred Contact
                                            </label>
                                            <div className="flex items-center space-x-2">
                                                {selectedLead.preferred_contact_method === "email" ? (
                                                    <Mail size={16} className="text-gray-600" />
                                                ) : (
                                                    <Phone size={16} className="text-gray-600" />
                                                )}
                                                <span className="text-gray-900 capitalize">
                                                    {selectedLead.preferred_contact_method}
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Newsletter
                                            </label>
                                            <div className="flex items-center space-x-2">
                                                <Bell
                                                    size={16}
                                                    className={
                                                        selectedLead.subscribe_newsletter
                                                            ? "text-green-600"
                                                            : "text-gray-400"
                                                    }
                                                />
                                                <span className="text-gray-900">
                                                    {selectedLead.subscribe_newsletter
                                                        ? "Subscribed"
                                                        : "Not subscribed"}
                                                </span>
                                            </div>
                                        </div>

                                        {selectedLead?.pdfFile && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Attachment
                                                </label>
                                                <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
                                                    <FileText size={16} className="text-gray-600" />
                                                    <span className="text-gray-900 text-sm">
                                                        {selectedLead.pdfFile}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Received
                                            </label>
                                            <div className="flex items-center space-x-2">
                                                <Calendar size={16} className="text-gray-600" />
                                                <div>
                                                    <div className="text-gray-900 text-sm">
                                                        {formatDate(selectedLead.created_at)}
                                                    </div>
                                                    <div className="text-gray-600 text-xs">
                                                        {formatTime(selectedLead.created_at)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 flex space-x-3">
                            <a
                                href={`tel:${selectedLead.phone}`}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg text-center font-medium transition-colors"
                            >
                                Call Lead
                            </a>
                            <a
                                href={`mailto:${selectedLead.email}?subject=Re: ${selectedLead.subject}`}
                                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg text-center font-medium transition-colors"
                            >
                                Send Email
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
