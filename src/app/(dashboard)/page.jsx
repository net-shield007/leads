"use client";

import React, { useEffect, useMemo, useState } from "react";
import api  from "@/lib/axios"
import {
  Users,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// ===== Components =====
function StatCard({
  label,
  value,
  colorClasses,
  icon,
}) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className={`text-2xl font-bold ${colorClasses || "text-gray-900"}`}>
            {value}
          </p>
        </div>
        <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
          {icon || <Users className="text-red-600" size={24} />}
        </div>
      </div>
    </div>
  );
}

function StatusPie({ data }) {
  // optional color palette (kept neutral; feel free to tweak)
  const COLORS = ["#ef4444", "#f59e0b", "#10b981", "#ef4444aa"];

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Leads by Status</h3>
      <div className="w-full h-[300px]">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
              label={(entry) => `${entry.name} (${entry.value})`}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <ReTooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function WeeklyBar({ data }) {
  // X labels prettier: show like "Aug 5"
  const formatted = data.map((d) => {
    const dt = new Date(d.weekStart);
    const short = dt.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    return { ...d, label: short };
  });

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Leads per Week (Last 4 Weeks)</h3>
      <div className="w-full h-[300px]">
        <ResponsiveContainer>
          <BarChart data={formatted}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis allowDecimals={false} />
            <ReTooltip />
            <Bar dataKey="count" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function LeadDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await api.get(`/dashboard/summary`, { cache: "no-store" });
        if (!res.status === 200) {
          throw new Error(`Failed to load summary (${res.status})`);
        }
        setSummary(res.data);
      } catch (e) {
        setErr(e.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const stats = useMemo(() => {
    if (!summary) {
      return { total: 0, new: 0, contacted: 0, qualified: 0, hot: 0 };
    }
    return summary.totals;
  }, [summary]);

  return (
    <div className="min-h-screen bg-gray-50 min-w-auto p-8">
      <div className="mx-auto">
        <h1 className="text-2xl font-bold mb-6">Lead Dashboard</h1>

        {loading && (
          <div className="bg-white p-6 rounded-xl border">
            Loading dashboard…
          </div>
        )}

        {err && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 mb-6">
            {err}
          </div>
        )}

        {!loading && !err && summary && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              <StatCard label="Total Leads" value={stats.total} />
              <StatCard label="New" value={stats.new} colorClasses="text-red-600" />
              <StatCard label="Contacted" value={stats.contacted} colorClasses="text-orange-600" />
              <StatCard label="Qualified" value={stats.qualified} colorClasses="text-green-600" />
              <StatCard label="Hot" value={stats.hot} colorClasses="text-red-600" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StatusPie data={summary.pie} />
              <WeeklyBar data={summary.weekly} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
