import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiLayers,
  FiGrid,
  FiCheckCircle,
  FiMessageSquare,
  FiClock,
  FiDollarSign,
  FiTrendingUp,
  FiRefreshCw,
  FiEye,
  FiBell,
  FiArrowRight,
  FiAlertCircle,
  FiActivity,
  FiPieChart,
} from "react-icons/fi";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import APP_CONFIG from "../../../config/appConfig";

import {
  DashboardContainer,
  DashboardHeader,
  StatsSection,
  SectionTitle,
  StatsGrid,
  StatCard,
  StatIcon,
  StatLabel,
  StatValue,
  StatTrend,
  ContentGrid,
  SectionBox,
  Table,
  TableHead,
  TableRow,
  TableCell,
  StatusBadge,
  ActionButton,
  LoadingSpinner,
  EmptyState,
} from "../styles/dashboard";

const API_BASE = APP_CONFIG.API_BASE_URL;

const adminAuthHeaders = () => {
  const token =
    localStorage.getItem("admin_token") ||
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token") ||
    "";
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

const apiFetch = async (path, options = {}) => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const primaryUrl = cleanPath.startsWith("/api")
    ? `${API_BASE.replace(/\/api\/?$/, "")}${cleanPath}`
    : `${API_BASE}${cleanPath}`;
  return await fetch(primaryUrl, {
    ...options,
    headers: {
      ...adminAuthHeaders(),
      ...(options.headers || {}),
    },
  });
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return dateString;
  }
};

const getInquiryStatusBadge = (status) => {
  const st = String(status || "").toLowerCase();
  switch (st) {
    case "new":
    case "unread":
      return <StatusBadge style={{ background: "#dbeafe", color: "#1e40af", borderColor: "#bfdbfe" }}>New</StatusBadge>;
    case "opened":
    case "in_progress":
      return <StatusBadge style={{ background: "#fef3c7", color: "#92400e", borderColor: "#fde68a" }}>In Progress</StatusBadge>;
    case "closed":
      return <StatusBadge style={{ background: "#f1f5f9", color: "#475569", borderColor: "#cbd5e1" }}>Closed</StatusBadge>;
    case "converted":
      return <StatusBadge style={{ background: "#dcfce7", color: "#166534", borderColor: "#bbf7d0" }}>Converted</StatusBadge>;
    default:
      return <StatusBadge>{status || "New"}</StatusBadge>;
  }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [dashboardData, setDashboardData] = useState({
    totals: {
      total_services: 0,
      total_experts: 0,
      total_categories: 0,
      total_subcategories: 0,
      total_users: 0,
      total_orders: 0,
      total_inquiries: 0,
      pending_inquiries: 0,
      unread_notifications: 0,
      total_earning: 0,
      total_withdrawn: 0,
    },
    pending: {
      pending_requests: 0,
      pending_amount: 0,
    },
    recent: [],
    recent_inquiries: [],
    recent_notifications: [],
  });

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/api/admin/dashboard");
      const data = await res.json();

      if (res.ok && data.success && data.data) {
        setDashboardData({
          totals: {
            total_services: Number(data.data.totals?.total_services || 0),
            total_experts: Number(data.data.totals?.total_experts || 0),
            total_categories: Number(data.data.totals?.total_categories || 0),
            total_subcategories: Number(data.data.totals?.total_subcategories || 0),
            total_users: Number(data.data.totals?.total_users || 0),
            total_orders: Number(data.data.totals?.total_orders || 0),
            total_inquiries: Number(data.data.totals?.total_inquiries || 0),
            pending_inquiries: Number(data.data.totals?.pending_inquiries || 0),
            unread_notifications: Number(data.data.totals?.unread_notifications || 0),
            total_earning: Number(data.data.totals?.total_earning || 0),
            total_withdrawn: Number(data.data.totals?.total_withdrawn || 0),
          },
          pending: {
            pending_requests: Number(data.data.pending?.pending_requests || 0),
            pending_amount: Number(data.data.pending?.pending_amount || 0),
          },
          recent: data.data.recent || [],
          recent_inquiries: data.data.recent_inquiries || [],
          recent_notifications: data.data.recent_notifications || [],
        });
      } else {
        setError(data.message || "Failed to load dashboard statistics.");
      }
    } catch (err) {
      console.error("fetchDashboardData error:", err);
      setError("Network error. Unable to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Business summary cards definition
  const businessCards = [
    {
      label: "Total Services",
      value: dashboardData.totals.total_services,
      icon: FiLayers,
      color: "#2563eb",
      bg: "rgba(37, 99, 235, 0.1)",
      link: "/admin/master-services/list",
    },
    {
      label: "Total Experts",
      value: dashboardData.totals.total_experts,
      icon: FiUsers,
      color: "#059669",
      bg: "rgba(5, 150, 105, 0.1)",
      link: "/admin/expert-management",
    },
    {
      label: "Total Categories",
      value: dashboardData.totals.total_categories,
      icon: FiGrid,
      color: "#7c3aed",
      bg: "rgba(124, 58, 237, 0.1)",
      link: "/admin/category-management",
    },
    {
      label: "Subcategories",
      value: dashboardData.totals.total_subcategories,
      icon: FiGrid,
      color: "#0284c7",
      bg: "rgba(2, 132, 199, 0.1)",
      link: "/admin/sub-category-management",
    },
    {
      label: "Total Users",
      value: dashboardData.totals.total_users,
      icon: FiUsers,
      color: "#d97706",
      bg: "rgba(217, 119, 6, 0.1)",
    },
    {
      label: "Active Orders",
      value: dashboardData.totals.total_orders,
      icon: FiCheckCircle,
      color: "#16a34a",
      bg: "rgba(22, 163, 74, 0.1)",
      link: "/admin/workspace-monitoring",
    },
    {
      label: "Total Inquiries",
      value: dashboardData.totals.total_inquiries,
      icon: FiMessageSquare,
      color: "#ea580c",
      bg: "rgba(234, 88, 12, 0.1)",
      link: "/admin/inquiries",
    },
    {
      label: "Pending Inquiries",
      value: dashboardData.totals.pending_inquiries,
      icon: FiClock,
      color: "#dc2626",
      bg: "rgba(220, 38, 38, 0.1)",
      link: "/admin/inquiries?status=new",
    },
  ];

  return (
    <DashboardContainer>
      {/* HEADER */}
      <DashboardHeader style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1>
            <FiActivity /> Admin Overview Dashboard
          </h1>
          <p>Real-time summary of business services, experts, users, orders, inquiries & financial metrics.</p>
        </div>
        <ActionButton onClick={fetchDashboardData} disabled={loading} style={{ background: "#ffffff", color: "#334155", border: "1px solid #cbd5e1" }}>
          <FiRefreshCw className={loading ? "spin" : ""} /> Refresh Dashboard
        </ActionButton>
      </DashboardHeader>

      {/* ERROR BANNER */}
      {error && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#991b1b",
            padding: "14px 18px",
            borderRadius: "12px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            justify: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FiAlertCircle /> {error}
          </div>
          <button
            type="button"
            onClick={fetchDashboardData}
            style={{
              background: "#991b1b",
              color: "#fff",
              border: 0,
              padding: "6px 14px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "12px",
            }}
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div style={{ padding: "4rem 1rem", textAlign: "center" }}>
          <LoadingSpinner style={{ margin: "0 auto 1rem" }} />
          <p style={{ color: "#64748b", fontWeight: "600" }}>Loading dashboard statistics...</p>
        </div>
      ) : (
        <>
          {/* 📊 BUSINESS OVERVIEW SUMMARY CARDS */}
          <StatsSection>
            <SectionTitle>
              <FiPieChart /> Platform Summary Metrics
            </SectionTitle>
            <StatsGrid style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
              {businessCards.map((card, idx) => (
                <StatCard
                  key={idx}
                  onClick={() => card.link && navigate(card.link)}
                  style={{ cursor: card.link ? "pointer" : "default" }}
                >
                  <StatIcon style={{ background: card.bg }}>
                    <card.icon color={card.color} />
                  </StatIcon>
                  <div style={{ flex: 1 }}>
                    <StatLabel>{card.label}</StatLabel>
                    <StatValue>{card.value}</StatValue>
                    <StatTrend $positive={card.value > 0}>
                      {card.link ? "View Details →" : "Live count"}
                    </StatTrend>
                  </div>
                </StatCard>
              ))}
            </StatsGrid>
          </StatsSection>

          {/* 💰 FINANCIAL & PAYOUT METRICS SECTION (PRESERVED) */}
          <StatsSection style={{ marginTop: "24px" }}>
            <SectionTitle>
              <HiOutlineCurrencyRupee /> Financial Overview & Payouts
            </SectionTitle>
            <StatsGrid style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
              <StatCard style={{ background: "linear-gradient(135deg, #059669 0%, #10b981 100%)", color: "#ffffff" }}>
                <StatIcon style={{ background: "rgba(255,255,255,0.2)" }}>
                  <FiDollarSign color="#ffffff" />
                </StatIcon>
                <div>
                  <StatLabel style={{ color: "rgba(255,255,255,0.9)" }}>Total Platform Earnings</StatLabel>
                  <StatValue style={{ color: "#ffffff" }}>{formatCurrency(dashboardData.totals.total_earning)}</StatValue>
                  <span style={{ fontSize: "12px", opacity: 0.9 }}>Aggregated Expert Earnings</span>
                </div>
              </StatCard>

              <StatCard style={{ background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)", color: "#ffffff" }}>
                <StatIcon style={{ background: "rgba(255,255,255,0.2)" }}>
                  <FiTrendingUp color="#ffffff" />
                </StatIcon>
                <div>
                  <StatLabel style={{ color: "rgba(255,255,255,0.9)" }}>Total Withdrawn</StatLabel>
                  <StatValue style={{ color: "#ffffff" }}>{formatCurrency(dashboardData.totals.total_withdrawn)}</StatValue>
                  <span style={{ fontSize: "12px", opacity: 0.9 }}>Processed Payouts</span>
                </div>
              </StatCard>

              <StatCard style={{ background: "#ffffff", border: "1px solid #e2e8f0" }}>
                <StatIcon style={{ background: "rgba(245, 158, 11, 0.1)" }}>
                  <FiClock color="#f59e0b" />
                </StatIcon>
                <div>
                  <StatLabel style={{ color: "#64748b" }}>Pending Payout Requests</StatLabel>
                  <StatValue style={{ color: "#0f172a" }}>{dashboardData.pending.pending_requests}</StatValue>
                  <span style={{ fontSize: "12px", color: "#f59e0b", fontWeight: "700" }}>
                    {formatCurrency(dashboardData.pending.pending_amount)} Pending
                  </span>
                </div>
              </StatCard>

              <StatCard style={{ background: "#ffffff", border: "1px solid #e2e8f0" }}>
                <StatIcon style={{ background: "rgba(220, 38, 38, 0.1)" }}>
                  <FiBell color="#dc2626" />
                </StatIcon>
                <div>
                  <StatLabel style={{ color: "#64748b" }}>Unread Admin Notifications</StatLabel>
                  <StatValue style={{ color: "#0f172a" }}>{dashboardData.totals.unread_notifications}</StatValue>
                  <span style={{ fontSize: "12px", color: "#dc2626", fontWeight: "700" }}>
                    System Notifications
                  </span>
                </div>
              </StatCard>
            </StatsGrid>
          </StatsSection>

          {/* ⚡ RECENT ACTIVITY SPLIT SECTION */}
          <ContentGrid style={{ marginTop: "24px" }}>
            {/* RECENT INQUIRIES BOX */}
            <SectionBox>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: "#0f172a", display: "flex", alignItems: "center", gap: "6px" }}>
                  <FiMessageSquare style={{ color: "#ea580c" }} /> Recent Customer Inquiries
                </h3>
                <Link to="/admin/inquiries" style={{ fontSize: "13px", color: "#2563eb", fontWeight: "700", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
                  View All <FiArrowRight />
                </Link>
              </div>

              {dashboardData.recent_inquiries.length === 0 ? (
                <EmptyState style={{ padding: "2rem 1rem" }}>
                  <FiMessageSquare size={36} style={{ color: "#cbd5e1", marginBottom: "8px" }} />
                  <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>No recent inquiries recorded.</p>
                </EmptyState>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Customer</TableCell>
                      <TableCell>Service</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell style={{ textAlign: "right" }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <tbody>
                    {dashboardData.recent_inquiries.map((inq) => (
                      <TableRow key={inq.id}>
                        <TableCell>
                          <div style={{ fontWeight: "700", color: "#0f172a", fontSize: "13px" }}>
                            {inq.user_name_snapshot || "G9User"}
                          </div>
                          <div style={{ fontSize: "11px", color: "#64748b" }}>#{inq.id}</div>
                        </TableCell>
                        <TableCell style={{ fontSize: "12px", fontWeight: "600", color: "#2563eb" }}>
                          {inq.service_name || "General Inquiry"}
                        </TableCell>
                        <TableCell>{getInquiryStatusBadge(inq.status)}</TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          <Link
                            to={`/admin/inquiries?id=${inq.id}`}
                            style={{
                              padding: "4px 10px",
                              borderRadius: "6px",
                              background: "#eff6ff",
                              color: "#2563eb",
                              fontSize: "12px",
                              fontWeight: "700",
                              textDecoration: "none",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <FiEye /> View
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </Table>
              )}
            </SectionBox>

            {/* RECENT NOTIFICATIONS BOX */}
            <SectionBox>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: "#0f172a", display: "flex", alignItems: "center", gap: "6px" }}>
                  <FiBell style={{ color: "#2563eb" }} /> Recent Admin Notifications
                </h3>
                <span style={{ fontSize: "12px", background: "#dbeafe", color: "#1e40af", padding: "4px 10px", borderRadius: "12px", fontWeight: "700" }}>
                  {dashboardData.totals.unread_notifications} Unread
                </span>
              </div>

              {dashboardData.recent_notifications.length === 0 ? (
                <EmptyState style={{ padding: "2rem 1rem" }}>
                  <FiBell size={36} style={{ color: "#cbd5e1", marginBottom: "8px" }} />
                  <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>No recent notifications.</p>
                </EmptyState>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {dashboardData.recent_notifications.map((notif) => (
                    <div
                      key={notif.id}
                      style={{
                        padding: "12px 14px",
                        borderRadius: "12px",
                        background: notif.is_read ? "#f8fafc" : "#eff6ff",
                        border: notif.is_read ? "1px solid #e2e8f0" : "1px solid #bfdbfe",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: notif.is_read ? "#cbd5e1" : "#2563eb",
                          marginTop: "6px",
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>
                          {notif.title}
                        </div>
                        <div style={{ fontSize: "12px", color: "#475569", marginTop: "2px" }}>
                          {notif.message}
                        </div>
                        <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
                          {formatDate(notif.created_at)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionBox>
          </ContentGrid>
        </>
      )}
    </DashboardContainer>
  );
}