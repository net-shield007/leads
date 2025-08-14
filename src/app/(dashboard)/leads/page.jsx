"use client";
import { useState } from "react";
import ProductsTable from "@/components/leads/ProductsTable";
import ContactTable from "@/components/leads/ContactTable";
import DistributionTable from "@/components/leads/DistributionTable";

export default function LeadsPage() {
    const [activeTab, setActiveTab] = useState("products");

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Tabs */}
            <div className="flex space-x-4 border-b mb-6">
                {[
                    { id: "products", label: "Product Leads" },
                    { id: "contact", label: "Contact Leads" },
                    { id: "distribution", label: "Distribution Leads" },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`pb-2 px-4 border-b-2 transition-colors ${activeTab === tab.id
                                ? "border-red-600 text-red-600"
                                : "border-transparent text-gray-600 hover:text-red-600"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tables */}
            {activeTab === "products" && <ProductsTable />}
            {activeTab === "contact" && <ContactTable />}
            {activeTab === "distribution" && <DistributionTable />}
        </div>
    );
}
