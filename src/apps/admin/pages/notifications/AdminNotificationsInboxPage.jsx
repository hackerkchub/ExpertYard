import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiBell,
  FiCheck,
  FiCheckCircle,
  FiMessageSquare,
  FiLayers,
  FiFilter,
  FiRefreshCw,
  FiAlertCircle,
  FiSend,
  FiTrash2,
  FiArrowRight,
  FiInfo,
} from "react-icons/fi";
import { connectSocket, socket } from "../../../../shared/api/socket.js";
import APP_CONFIG from "../../../../config/appConfig";

import {
  DashboardContainer,
  DashboardHeader,
  SectionBox,
  LoadingSpinner,
  EmptyState,
} from "../../styles/dashboard";

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

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (e) {
    return dateStr;
  }
};

export default function AdminNotificationsInboxPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // "all", "unread", "read"
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [markingAll, setMarkingAll] = useState(false);

  // Fetch Notifications List
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let queryUrl = `/api/notifications?receiverRole=admin&receiverId=0&page=${page}&limit=${limit}`;
      if (filter === "unread") {
        queryUrl += "&read_status=unread";
      }

      const res = await apiFetch(queryUrl);
      const data = await res.json();

      if (res.ok && data.success) {
        setNotifications(data.data || []);
      } else {
        setError(data.message || "Failed to load notifications.");
      }
    } catch (err) {
      console.error("fetchNotifications error:", err);
      setError("Network error loading notifications.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, filter]);

  // Fetch Unread Count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await apiFetch("/api/notifications/unread-count?receiverRole=admin&receiverId=0");
      const data = await res.json();
      if (res.ok && data.count !== undefined) {
        setUnreadCount(Number(data.count || 0));
      }
    } catch (err) {
      console.error("fetchUnreadCount error:", err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

  // Real-time Socket.IO Listeners
  useEffect(() => {
    const token =
      localStorage.getItem("admin_token") ||
      localStorage.getItem("adminToken") ||
      localStorage.getItem("token") ||
      "";

    if (token) {
      connectSocket({ userId: 0, role: "admin" });
      socket.emit("register", { userId: 0, role: "admin" });

      const handleNewNotif = (newNotif) => {
        setNotifications((prev) => {
          if (newNotif.id && prev.some((n) => n.id === newNotif.id)) return prev;
          return [newNotif, ...prev];
        });
        setUnreadCount((prev) => prev + 1);
      };

      socket.on("notification:new", handleNewNotif);
      socket.on("admin_notification:new", handleNewNotif);

      return () => {
        socket.off("notification:new", handleNewNotif);
        socket.off("admin_notification:new", handleNewNotif);
      };
    }
  }, []);

  // Mark Single Notification as Read
  const handleMarkRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      const res = await apiFetch(`/api/notifications/${id}/read?receiverRole=admin&receiverId=0`, {
        method: "PATCH",
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, is_read: 1, read_status: "read" } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("handleMarkRead error:", err);
    }
  };

  // Mark All Notifications as Read
  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      const res = await apiFetch("/api/notifications/read-all", {
        method: "PATCH",
        body: JSON.stringify({ receiverId: 0, receiverRole: "admin" }),
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, is_read: 1, read_status: "read" }))
        );
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("handleMarkAllRead error:", err);
    } finally {
      setMarkingAll(false);
    }
  };

  // Notification Item Click Handler
  const handleNotificationClick = async (notif) => {
    if (!notif.is_read) {
      handleMarkRead(notif.id);
    }

    const type = String(notif.type || "").toLowerCase();
    const targetUrl = notif.targetUrl || notif.target_url || "";
    const relatedId = notif.relatedId || notif.related_id || "";

    if (type.includes("inquiry") || targetUrl.includes("inquiries")) {
      const inqId = relatedId || (targetUrl.match(/id=(\d+)/) || [])[1];
      if (inqId) {
        navigate(`/admin/inquiries?id=${inqId}`);
        return;
      }
      navigate("/admin/inquiries");
      return;
    }

    if (targetUrl) {
      navigate(targetUrl);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    const isUnread = !n.is_read && n.read_status !== "read";
    if (filter === "unread") return isUnread;
    if (filter === "read") return !isUnread;
    return true;
  });

  return (
    <DashboardContainer>
      {/* HEADER */}
      <DashboardHeader style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1>
            <FiBell /> Admin Notifications Inbox
          </h1>
          <p>Review system announcements, customer service inquiries, and automated platform alerts.</p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={markingAll || unreadCount === 0}
            style={{
              padding: "8px 16px",
              borderRadius: "10px",
              border: "1px solid #cbd5e1",
              background: "#ffffff",
              color: unreadCount === 0 ? "#94a3b8" : "#2563eb",
              fontWeight: "700",
              fontSize: "13px",
              cursor: markingAll || unreadCount === 0 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <FiCheckCircle /> Mark All as Read ({unreadCount})
          </button>

          <button
            type="button"
            onClick={fetchNotifications}
            title="Refresh List"
            style={{
              height: "38px",
              width: "38px",
              borderRadius: "10px",
              border: "1px solid #cbd5e1",
              background: "#ffffff",
              color: "#475569",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FiRefreshCw className={loading ? "spin" : ""} />
          </button>
        </div>
      </DashboardHeader>

      <SectionBox>
        {/* TAB FILTERS */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          {[
            { key: "all", label: `All (${notifications.length})` },
            { key: "unread", label: `Unread (${unreadCount})` },
            { key: "read", label: "Read" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              style={{
                padding: "8px 18px",
                borderRadius: "20px",
                border: filter === tab.key ? "1px solid #2563eb" : "1px solid #e2e8f0",
                background: filter === tab.key ? "#2563eb" : "#ffffff",
                color: filter === tab.key ? "#ffffff" : "#475569",
                fontWeight: "700",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ERROR BANNER */}
        {error && (
          <div style={{ background: "#fef2f2", color: "#991b1b", padding: "14px 18px", borderRadius: "10px", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FiAlertCircle /> {error}
            </div>
            <button type="button" onClick={fetchNotifications} style={{ padding: "6px 14px", borderRadius: "6px", background: "#991b1b", color: "#fff", border: 0, cursor: "pointer", fontWeight: "700" }}>
              Retry
            </button>
          </div>
        )}

        {/* LOADING & LIST */}
        {loading ? (
          <div style={{ padding: "3rem 1rem", textAlign: "center" }}>
            <LoadingSpinner style={{ margin: "0 auto 1rem" }} />
            <p style={{ color: "#64748b", fontWeight: "600" }}>Loading inbox notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <EmptyState style={{ padding: "3rem 1rem" }}>
            <FiBell size={48} style={{ color: "#cbd5e1", marginBottom: "1rem" }} />
            <h4 style={{ margin: "0 0 6px", color: "#1e293b", fontSize: "16px" }}>No Notifications Found</h4>
            <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
              You have no notifications matching your current filter selection.
            </p>
          </EmptyState>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {filteredNotifications.map((notif) => {
              const isUnread = !notif.is_read && notif.read_status !== "read";
              const isServiceInquiry = String(notif.type || "").toLowerCase().includes("inquiry");

              return (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  style={{
                    padding: "16px 20px",
                    borderRadius: "14px",
                    background: isUnread ? "#f0f9ff" : "#ffffff",
                    border: isUnread ? "1px solid #bae6fd" : "1px solid #e2e8f0",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "16px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: isUnread ? "0 4px 12px rgba(14, 165, 233, 0.06)" : "none",
                  }}
                >
                  <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "12px",
                        background: isServiceInquiry ? "rgba(37, 99, 235, 0.1)" : "rgba(100, 116, 139, 0.1)",
                        color: isServiceInquiry ? "#2563eb" : "#475569",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {isServiceInquiry ? <FiMessageSquare size={20} /> : <FiInfo size={20} />}
                    </div>

                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "14px", fontWeight: "800", color: "#0f172a" }}>
                          {notif.title}
                        </span>
                        {isUnread && (
                          <span style={{ fontSize: "10px", fontWeight: "800", background: "#2563eb", color: "#ffffff", padding: "2px 8px", borderRadius: "10px", textTransform: "uppercase" }}>
                            Unread
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: "13px", color: "#475569", marginTop: "4px", lineHeight: "1.5" }}>
                        {notif.message || notif.body}
                      </div>

                      <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "6px" }}>
                        {formatDate(notif.created_at)}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                    {isUnread && (
                      <button
                        type="button"
                        onClick={(e) => handleMarkRead(notif.id, e)}
                        title="Mark as Read"
                        style={{
                          background: "#ffffff",
                          border: "1px solid #cbd5e1",
                          color: "#166534",
                          padding: "6px 12px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: "700",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <FiCheck /> Mark Read
                      </button>
                    )}
                    {isServiceInquiry && (
                      <span style={{ color: "#2563eb", fontWeight: "700", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                        View Inquiry <FiArrowRight />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionBox>
    </DashboardContainer>
  );
}
