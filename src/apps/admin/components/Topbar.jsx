import React, { useState, useRef, useEffect, useCallback } from "react";
import { FiBell, FiUser, FiMenu, FiCheck, FiCheckCircle, FiMessageSquare, FiInfo, FiArrowRight } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { connectSocket, socket } from "../../../shared/api/socket.js";
import APP_CONFIG from "../../../config/appConfig";
import logo from "../../../assets/logo.webp";

import {
  TopbarWrap,
  LeftSide,
  BrandingGroup,
  BrandBox,
  BrandLogo,
  AdminTitle,
  RightSide,
  IconButton,
  DropMenu,
  DropItem,
  MobileToggle
} from "../styles/Topbar.styles";

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
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (e) {
    return dateStr;
  }
};

export default function Topbar({ setMobileOpen }) {
  const navigate = useNavigate();
  const [openProfile, setOpenProfile] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);

  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  const profileRef = useRef();
  const notifRef = useRef();

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

  // Fetch Latest Notifications for Dropdown
  const fetchLatestNotifications = useCallback(async () => {
    setLoadingNotifs(true);
    try {
      const res = await apiFetch("/api/notifications?receiverRole=admin&receiverId=0&page=1&limit=6");
      const data = await res.json();
      if (res.ok && data.success) {
        setNotifications(data.data || []);
      }
    } catch (err) {
      console.error("fetchLatestNotifications error:", err);
    } finally {
      setLoadingNotifs(false);
    }
  }, []);

  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

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
          return [newNotif, ...prev.slice(0, 5)];
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

  // Close dropdown on outside click
  useEffect(() => {
    function closeAll(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setOpenNotif(false);
      }
    }
    document.addEventListener("mousedown", closeAll);
    return () => document.removeEventListener("mousedown", closeAll);
  }, []);

  const handleToggleNotif = () => {
    if (!openNotif) {
      fetchLatestNotifications();
      fetchUnreadCount();
    }
    setOpenNotif(!openNotif);
    setOpenProfile(false);
  };

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

  const handleMarkAllRead = async (e) => {
    if (e) e.stopPropagation();
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
    }
  };

  const handleNotificationClick = (notif) => {
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
      } else {
        navigate("/admin/inquiries");
      }
    } else if (targetUrl) {
      navigate(targetUrl);
    } else {
      navigate("/admin/notifications");
    }

    setOpenNotif(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <TopbarWrap>
      <LeftSide>
        {/* Mobile Sidebar Button */}
        <MobileToggle onClick={() => setMobileOpen(true)}>
          <FiMenu size={22} />
        </MobileToggle>

        {/* Branding */}
        <BrandingGroup>
          <BrandBox to="/admin/dashboard">
            <BrandLogo src={logo} alt="logo" />
            <AdminTitle>Admin Panel</AdminTitle>
          </BrandBox>
        </BrandingGroup>
      </LeftSide>

      {/* Right Icons */}
      <RightSide>
        {/* NOTIFICATION BELL BLOCK */}
        <div ref={notifRef} style={{ position: "relative" }}>
          <IconButton onClick={handleToggleNotif} style={{ position: "relative" }}>
            <FiBell size={20} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-6px",
                  background: "#ef4444",
                  color: "#ffffff",
                  fontSize: "10px",
                  fontWeight: "800",
                  padding: "2px 6px",
                  borderRadius: "10px",
                  lineHeight: "1",
                  border: "2px solid #121826",
                }}
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </IconButton>

          {/* NOTIFICATION DROPDOWN MENU */}
          <DropMenu $show={openNotif} $width="320px" style={{ padding: "0", overflow: "hidden" }}>
            <div
              style={{
                padding: "12px 16px",
                background: "rgba(30, 41, 59, 0.95)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#ffffff" }}>
                Notifications ({unreadCount})
              </span>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  style={{
                    background: "none",
                    border: 0,
                    color: "#38bdf8",
                    fontSize: "11px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  Mark all read
                </button>
              )}
            </div>

            <div style={{ maxHeight: "320px", overflowY: "auto" }}>
              {loadingNotifs ? (
                <div style={{ padding: "16px", textAlign: "center", color: "#94a3b8", fontSize: "12px" }}>
                  Loading notifications...
                </div>
              ) : notifications.length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>
                  No notifications
                </div>
              ) : (
                notifications.map((notif) => {
                  const isUnread = !notif.is_read && notif.read_status !== "read";
                  const isServiceInquiry = String(notif.type || "").toLowerCase().includes("inquiry");

                  return (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      style={{
                        padding: "10px 14px",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                        background: isUnread ? "rgba(14, 165, 233, 0.1)" : "transparent",
                        cursor: "pointer",
                        display: "flex",
                        gap: "10px",
                        alignItems: "flex-start",
                        transition: "background 0.2s ease",
                      }}
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: isUnread ? "#38bdf8" : "transparent",
                          marginTop: "6px",
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "12px", fontWeight: "700", color: "#f8fafc" }}>
                          {notif.title}
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#cbd5e1",
                            marginTop: "2px",
                            lineHeight: "1.4",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "230px",
                          }}
                        >
                          {notif.message || notif.body}
                        </div>
                        <div style={{ fontSize: "10px", color: "#64748b", marginTop: "3px" }}>
                          {formatDate(notif.created_at)}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div
              onClick={() => {
                setOpenNotif(false);
                navigate("/admin/notifications");
              }}
              style={{
                padding: "10px",
                textAlign: "center",
                background: "rgba(15, 23, 42, 0.95)",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                fontSize: "12px",
                fontWeight: "700",
                color: "#38bdf8",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
              }}
            >
              View All Notifications <FiArrowRight size={13} />
            </div>
          </DropMenu>
        </div>

        {/* PROFILE BLOCK */}
        <div ref={profileRef} style={{ position: "relative" }}>
          <IconButton
            onClick={() => {
              setOpenProfile(!openProfile);
              setOpenNotif(false);
            }}
          >
            <FiUser size={20} />
          </IconButton>

          <DropMenu $show={openProfile} $width="160px">
            <DropItem onClick={() => navigate("/admin/dashboard")}>Dashboard</DropItem>
            <DropItem onClick={() => navigate("/admin/notifications")}>Notifications</DropItem>
            <DropItem onClick={handleLogout} style={{ color: "#ef4444" }}>
              Logout
            </DropItem>
          </DropMenu>
        </div>
      </RightSide>
    </TopbarWrap>
  );
}
