"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  Phone,
  Mail,
  Building,
  User,
  MessageSquare,
  Calendar,
  TrendingUp,
  X,
  Plus,
  FileText,
  Globe,
  Users,
  Bell,
  Settings,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
} from "lucide-react";

const LeadDashboard = () => {
  // --- Authentication State ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });

  const handleLogin = (e) => {
    e.preventDefault();
    if (
      loginForm.username === "ishaan" &&
      loginForm.password === "Ishaan@1234"
    ) {
      setIsAuthenticated(true);
    } else {
      alert("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginForm({ username: "", password: "" });
  };

  // --- Dashboard State ---
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedLead, setSelectedLead] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [leadsPerPage] = useState(10);

  const [newLead, setNewLead] = useState({
    fullName: "",
    email: "",
    countryCode: "+1",
    phoneNumber: "",
    companyName: "",
    subject: "",
    message: "",
    preferredContact: "email",
    subscribeNewsletter: false,
    pdfFile: null,
    status: "new",
    priority: "medium",
  });

  // Countries data
  const countries = [
    { name: "United States", code: "+1", flag: "🇺🇸" },
    { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
    { name: "Canada", code: "+1", flag: "🇨🇦" },
    { name: "Australia", code: "+61", flag: "🇦🇺" },
    { name: "Germany", code: "+49", flag: "🇩🇪" },
    { name: "France", code: "+33", flag: "🇫🇷" },
    { name: "Japan", code: "+81", flag: "🇯🇵" },
    { name: "China", code: "+86", flag: "🇨🇳" },
    { name: "India", code: "+91", flag: "🇮🇳" },
    { name: "Brazil", code: "+55", flag: "🇧🇷" },
  ];

  // Generate Lead ID
  const generateLeadId = () => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substr(2, 4);
    return `LD-${timestamp}-${randomStr}`.toUpperCase();
  };

  // Sample data
  useEffect(() => {
    const sampleLeads = [
      {
        id: 1,
        leadId: "LD-001-A8B9",
        fullName: "Sarah Johnson",
        companyName: "TechCorp Solutions",
        countryCode: "+1",
        phoneNumber: "(555) 123-4567",
        email: "sarah.johnson@techcorp.com",
        subject: "Enterprise Solution Demo",
        message:
          "We're interested in your enterprise solution for our development team of 50+ members. Could we schedule a demo?",
        preferredContact: "email",
        subscribeNewsletter: true,
        pdfFile: "requirements.pdf",
        status: "new",
        createdAt: "2024-06-05T10:30:00Z",
        priority: "high",
      },
      {
        id: 2,
        leadId: "LD-002-C7D8",
        fullName: "Michael Chen",
        companyName: "StartupXYZ",
        countryCode: "+1",
        phoneNumber: "(555) 987-6543",
        email: "michael@startupxyz.io",
        subject: "Pricing Information",
        message:
          "Looking for pricing options for a small team. What packages do you offer for startups?",
        preferredContact: "phone",
        subscribeNewsletter: false,
        pdfFile: null,
        status: "contacted",
        createdAt: "2024-06-04T14:15:00Z",
        priority: "medium",
      },
      {
        id: 3,
        leadId: "LD-003-E5F6",
        fullName: "Emily Rodriguez",
        companyName: "Design Studio Pro",
        countryCode: "+44",
        phoneNumber: "(20) 7946-0958",
        email: "emily@designstudiopro.com",
        subject: "API Integration",
        message:
          "Need custom API integration with our existing workflow. Do you provide technical support?",
        preferredContact: "email",
        subscribeNewsletter: true,
        pdfFile: "api-specs.pdf",
        status: "qualified",
        createdAt: "2024-06-03T09:45:00Z",
        priority: "high",
      },
      {
        id: 4,
        leadId: "LD-004-G3H4",
        fullName: "David Thompson",
        companyName: "Global Solutions Ltd",
        countryCode: "+1",
        phoneNumber: "(555) 777-8888",
        email: "david@globalsolutions.com",
        subject: "Feature Comparison",
        message:
          "Evaluating multiple vendors. Please send detailed feature comparison and pricing information.",
        preferredContact: "email",
        subscribeNewsletter: false,
        pdfFile: null,
        status: "new",
        createdAt: "2024-06-02T16:20:00Z",
        priority: "medium",
      },
      {
        id: 5,
        leadId: "LD-005-I1J2",
        fullName: "Lisa Park",
        companyName: "Innovation Hub",
        countryCode: "+82",
        phoneNumber: "02-1234-5678",
        email: "lisa@innovationhub.org",
        subject: "Urgent Implementation",
        message:
          "Need urgent implementation by month-end. What's your fastest deployment timeline?",
        preferredContact: "phone",
        subscribeNewsletter: true,
        pdfFile: "timeline.pdf",
        status: "hot",
        createdAt: "2024-06-01T11:00:00Z",
        priority: "urgent",
      },
    ];
    setLeads(sampleLeads);
    setFilteredLeads(sampleLeads);
  }, []);

  // Filter and search
  useEffect(() => {
    let filtered = leads;

    if (searchTerm) {
      filtered = filtered.filter(
        (lead) =>
          lead.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.leadId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((lead) => lead.status === filterStatus);
    }

    setFilteredLeads(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterStatus, leads]);

  // Pagination
  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

  // Utility functions
  const getStatusConfig = (status) => {
    const configs = {
      new: {
        bg: "bg-red-50",
        text: "text-red-700",
        icon: <Star size={14} />,
      },
      contacted: {
        bg: "bg-orange-50",
        text: "text-orange-700",
        icon: <Clock size={14} />,
      },
      qualified: {
        bg: "bg-green-50",
        text: "text-green-700",
        icon: <CheckCircle size={14} />,
      },
      hot: {
        bg: "bg-red-50",
        text: "text-red-700",
        icon: <AlertCircle size={14} />,
      },
    };
    return (
      configs[status] || {
        bg: "bg-gray-50",
        text: "text-gray-700",
        icon: <Star size={14} />,
      }
    );
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      urgent: { color: "bg-red-500", text: "Urgent" },
      high: { color: "bg-orange-500", text: "High" },
      medium: { color: "bg-yellow-500", text: "Medium" },
      low: { color: "bg-green-500", text: "Low" },
    };
    return configs[priority] || { color: "bg-gray-500", text: "Low" };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Actions
  const openModal = (lead) => {
    setSelectedLead(lead);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedLead(null);
  };

  const deleteLead = (leadId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this lead?")) {
      setLeads(leads.filter((lead) => lead.id !== leadId));
    }
  };

  const updateLeadStatus = (leadId, newStatus) => {
    setLeads(
      leads.map((lead) =>
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      )
    );
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }
  };

  const addNewLead = () => {
    if (newLead.fullName && newLead.email) {
      const lead = {
        ...newLead,
        id: Date.now(),
        leadId: generateLeadId(),
        createdAt: new Date().toISOString(),
      };
      setLeads([lead, ...leads]);
      setNewLead({
        fullName: "",
        email: "",
        countryCode: "+1",
        phoneNumber: "",
        companyName: "",
        subject: "",
        message: "",
        preferredContact: "email",
        subscribeNewsletter: false,
        pdfFile: null,
        status: "new",
        priority: "medium",
      });
      setShowAddModal(false);
    }
  };

  const exportLeads = () => {
    const csvContent = [
      [
        "Lead ID",
        "Full Name",
        "Company",
        "Email",
        "Phone",
        "Subject",
        "Status",
        "Priority",
        "Date",
        "Contact Preference",
        "Newsletter",
      ],
      ...filteredLeads.map((lead) => [
        lead.leadId,
        lead.fullName,
        lead.companyName,
        lead.email,
        `${lead.countryCode} ${lead.phoneNumber}`,
        lead.subject,
        lead.status,
        lead.priority,
        formatDate(lead.createdAt),
        lead.preferredContact,
        lead.subscribeNewsletter ? "Yes" : "No",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    qualified: leads.filter((l) => l.status === "qualified").length,
    hot: leads.filter((l) => l.status === "hot").length,
  };

  // --- LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Lead Dashboard
            </h1>
            <p className="text-gray-600">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, username: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-50 transition-all"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-50 transition-all"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-xl font-medium transition-colors"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- MAIN DASHBOARD ---
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Lead Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Manage your sales pipeline
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                <Plus size={18} className="mr-2" />
                Add Lead
              </button>

              <button
                onClick={exportLeads}
                className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                <Download size={18} className="mr-2" />
                Export
              </button>

              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <Users className="text-red-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New</p>
                <p className="text-2xl font-bold text-red-600">{stats.new}</p>
              </div>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Contacted</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.contacted}
                </p>
              </div>
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Qualified</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.qualified}
                </p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hot</p>
                <p className="text-2xl font-bold text-red-600">{stats.hot}</p>
              </div>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search leads by name, company, email, or Lead ID..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-red-500 focus:ring-4 focus:ring-red-50 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative lg:w-48">
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <select
                className="w-full pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:border-red-500 focus:ring-4 focus:ring-red-50 transition-all bg-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="hot">Hot</option>
              </select>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">
              Leads ({filteredLeads.length})
            </h3>
          </div>

          {/* Table Content */}
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
                {currentLeads.map((lead) => {
                  const statusConfig = getStatusConfig(lead.status);
                  const priorityConfig = getPriorityConfig(lead.priority);

                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => openModal(lead)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-2 h-2 rounded-full ${priorityConfig.color}`}
                          ></div>
                          <div>
                            <div className="text-xs font-mono text-gray-500 mb-1">
                              {lead.leadId}
                            </div>
                            <div className="font-medium text-gray-900">
                              {lead.fullName}
                            </div>
                            <div className="text-sm text-gray-600">
                              {lead.companyName}
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
                            {lead.countryCode} {lead.phoneNumber}
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
                          {formatDate(lead.createdAt)}
                        </div>
                        <div className="text-xs text-gray-600">
                          {formatTime(lead.createdAt)}
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
                          <button
                            onClick={(e) => deleteLead(lead.id, e)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredLeads.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No leads found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {indexOfFirstLead + 1} to {Math.min(indexOfLastLead, filteredLeads.length)} of {filteredLeads.length} results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lead Details Modal */}
      {showModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Lead Details
                </h2>
                <p className="text-sm text-gray-600 font-mono">
                  {selectedLead.leadId}
                </p>
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
                        {selectedLead.fullName}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company
                      </label>
                      <p className="text-gray-900 font-medium">
                        {selectedLead.companyName}
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
                        href={`tel:${selectedLead.countryCode}${selectedLead.phoneNumber}`}
                        className="text-red-600 hover:text-red-700 font-medium"
                      >
                        {selectedLead.countryCode} {selectedLead.phoneNumber}
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
                        onChange={(e) =>
                          updateLeadStatus(selectedLead.id, e.target.value)
                        }
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
                        Priority
                      </label>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            getPriorityConfig(selectedLead.priority).color
                          }`}
                        ></div>
                        <span className="text-gray-900 capitalize">
                          {selectedLead.priority}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Contact
                      </label>
                      <div className="flex items-center space-x-2">
                        {selectedLead.preferredContact === "email" ? (
                          <Mail size={16} className="text-gray-600" />
                        ) : (
                          <Phone size={16} className="text-gray-600" />
                        )}
                        <span className="text-gray-900 capitalize">
                          {selectedLead.preferredContact}
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
                            selectedLead.subscribeNewsletter
                              ? "text-green-600"
                              : "text-gray-400"
                          }
                        />
                        <span className="text-gray-900">
                          {selectedLead.subscribeNewsletter
                            ? "Subscribed"
                            : "Not subscribed"}
                        </span>
                      </div>
                    </div>

                    {selectedLead.pdfFile && (
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
                            {formatDate(selectedLead.createdAt)}
                          </div>
                          <div className="text-gray-600 text-xs">
                            {formatTime(selectedLead.createdAt)}
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
                href={`tel:${selectedLead.countryCode}${selectedLead.phoneNumber}`}
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

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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
                    <select
                      value={newLead.countryCode}
                      onChange={(e) =>
                        setNewLead({ ...newLead, countryCode: e.target.value })
                      }
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-4 focus:ring-red-50"
                    >
                      {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={newLead.phoneNumber}
                      onChange={(e) =>
                        setNewLead({ ...newLead, phoneNumber: e.target.value })
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-4 focus:ring-red-50"
                      placeholder="Enter phone number"
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={newLead.status}
                    onChange={(e) =>
                      setNewLead({ ...newLead, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-4 focus:ring-red-50"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="hot">Hot</option>
                  </select>
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
                disabled={!newLead.fullName || !newLead.email}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                Add Lead
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
    </div>
  );
};

export default LeadDashboard;
