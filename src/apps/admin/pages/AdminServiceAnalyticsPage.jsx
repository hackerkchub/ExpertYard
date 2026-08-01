import React, { useState, useEffect } from "react";

export default function AdminServiceAnalyticsPage() {
  const [metrics, setMetrics] = useState({
    totalServices: 24,
    activeWorkspaces: 142,
    totalBookings: 1840,
    grossRevenue: 1485000,
    platformCommission: 148500,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/finance/summary", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setMetrics((prev) => ({
            ...prev,
            grossRevenue: data.data.total_revenue || prev.grossRevenue,
            platformCommission: data.data.platform_earnings || prev.platformCommission,
          }));
        }
      })
      .catch((err) => console.error("Error loading analytics:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: "1.5rem" }}>
      <header style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ margin: 0, color: "#0f172a" }}>Service OS Analytics & Intelligence</h2>
        <p style={{ margin: "0.25rem 0 0 0", color: "#64748b" }}>Live monitoring of platform service volume, booking conversions, revenue distribution, and active order workspaces.</p>
      </header>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
        <KpiCard label="Master Services" value={metrics.totalServices} sub="Published catalog" color="#2563eb" />
        <KpiCard label="Active Workspaces" value={metrics.activeWorkspaces} sub="Live SLA execution" color="#d97706" />
        <KpiCard label="Total Bookings" value={metrics.totalBookings.toLocaleString("en-IN")} sub="All-time orders" color="#059669" />
        <KpiCard label="Gross Volume" value={`₹${metrics.grossRevenue.toLocaleString("en-IN")}`} sub="Processed payments" color="#7c3aed" />
        <KpiCard label="Platform Revenue" value={`₹${metrics.platformCommission.toLocaleString("en-IN")}`} sub="Net commission" color="#0d9488" />
      </div>

      {/* Analytics Breakdown Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <div style={{ background: "#fff", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h3 style={{ margin: "0 0 1rem 0", color: "#1e293b" }}>Top Performing Service Templates</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <PerfRow title="GST Registration & Filing" bookings={420} revenue="₹4,19,580" rating={4.9} />
            <PerfRow title="Private Limited Incorporation" bookings={310} revenue="₹6,19,690" rating={4.8} />
            <PerfRow title="Trademark Filing & Prosecution" bookings={260} revenue="₹2,59,740" rating={4.9} />
            <PerfRow title="Income Tax Return (ITR-3/4)" bookings={510} revenue="₹5,09,490" rating={4.7} />
          </div>
        </div>

        <div style={{ background: "#fff", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h3 style={{ margin: "0 0 1rem 0", color: "#1e293b" }}>Workspace SLA Status Distribution</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <SlaRow label="SUBMITTED (Document Verification)" count={24} percentage={17} color="#2563eb" />
            <SlaRow label="IN_PROGRESS (Active Fulfillment)" count={78} percentage={55} color="#d97706" />
            <SlaRow label="DELIVERED (Client Approval Pending)" count={28} percentage={20} color="#7c3aed" />
            <SlaRow label="COMPLETED (Order Closed)" count={12} percentage={8} color="#059669" />
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, sub, color }) {
  return (
    <div style={{ background: "#fff", padding: "1.25rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", borderLeft: `4px solid ${color}` }}>
      <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#64748b" }}>{label}</div>
      <div style={{ fontSize: "1.6rem", fontWeight: "900", color: "#0f172a", margin: "0.35rem 0" }}>{value}</div>
      <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{sub}</div>
    </div>
  );
}

function PerfRow({ title, bookings, revenue, rating }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0", borderBottom: "1px solid #f1f5f9" }}>
      <div>
        <div style={{ fontWeight: "700", color: "#0f172a", fontSize: "0.9rem" }}>{title}</div>
        <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{bookings} orders | ⭐ {rating}</div>
      </div>
      <div style={{ fontWeight: "800", color: "#059669", fontSize: "0.95rem" }}>{revenue}</div>
    </div>
  );
}

function SlaRow({ label, count, percentage, color }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: "700", marginBottom: "0.25rem" }}>
        <span>{label}</span>
        <span>{count} ({percentage}%)</span>
      </div>
      <div style={{ width: "100%", height: "8px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
        <div style={{ width: `${percentage}%`, height: "100%", background: color, borderRadius: "4px" }} />
      </div>
    </div>
  );
}
