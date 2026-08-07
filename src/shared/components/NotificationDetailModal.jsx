import React from "react";
import { FiX, FiArrowLeft, FiExternalLink, FiBell, FiAlertCircle, FiCalendar } from "react-icons/fi";

export default function NotificationDetailModal({ notification, onClose, onNavigate }) {
  if (!notification) return null;

  const meta = typeof notification.meta === "object" ? notification.meta : {};
  const title = notification.title || "Notification";
  const body = notification.body || notification.message || meta.description || "";
  const resolveTargetUrl = () => {
    let rawUrl = notification.target_url || notification.targetUrl || meta.target_url || meta.targetUrl || meta.url || meta.click_action || "";
    if (rawUrl) return rawUrl;

    const role = notification.receiver_role || notification.panel || "user";
    const typeStr = String(notification.type || "").toLowerCase();

    if (role === "expert") {
      if (typeStr.includes("chat")) {
        return meta.room_id ? `/expert/chat/${meta.room_id}` : "/expert/chat-history";
      }
      if (typeStr.includes("call") || typeStr.includes("video")) {
        return "/expert/home";
      }
      if (typeStr.includes("service") || typeStr.includes("booking") || typeStr.includes("workspace")) {
        return meta.booking_id ? `/expert/workspace/${meta.booking_id}` : "/expert/mybookings";
      }
      if (typeStr.includes("lead") || typeStr.includes("custom_request")) {
        return "/expert/leads";
      }
      return "/expert/home";
    } else {
      if (typeStr.includes("chat")) {
        return meta.room_id ? `/user/chat/${meta.room_id}` : "/user/chat-history";
      }
      if (typeStr.includes("call")) {
        return "/user/call-chat?mode=call";
      }
      if (typeStr.includes("video")) {
        return "/user/call-chat?mode=video";
      }
      if (typeStr.includes("service") || typeStr.includes("booking") || typeStr.includes("workspace")) {
        return meta.booking_id ? `/user/workspace/${meta.booking_id}` : "/user/my-bookings";
      }
      return "/user/my-bookings";
    }
  };

  const targetUrl = resolveTargetUrl();
  const priority = meta.priority || "normal";
  const type = notification.type || "admin_announcement";
  const createdAt = notification.created_at || notification.createdAt;
  const imageUrl =
    notification.image_url ||
    notification.imageUrl ||
    meta.image_url ||
    meta.imageUrl ||
    meta.banner ||
    meta.image ||
    null;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(4px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.25rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          maxWidth: "540px",
          width: "100%",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          animation: "fadeIn 0.2s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner or Image */}
        {imageUrl ? (
          <div style={{ position: "relative", width: "100%", maxHeight: "220px", overflow: "hidden", background: "#0f172a" }}>
            <img src={imageUrl} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <button
              onClick={onClose}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                background: "rgba(0, 0, 0, 0.5)",
                color: "#ffffff",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <FiX size={18} />
            </button>
          </div>
        ) : (
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FiBell size={20} color="#2563eb" />
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>
                {type.replace("_", " ")}
              </span>
            </div>
            <button
              onClick={onClose}
              style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: "4px" }}
            >
              <FiX size={20} />
            </button>
          </div>
        )}

        {/* Content Body */}
        <div style={{ padding: "1.5rem" }}>
          {/* Badges & Date */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", marginBottom: "1rem" }}>
            {priority === "high" && (
              <span style={{ padding: "3px 10px", borderRadius: "12px", background: "#fee2e2", color: "#b91c1c", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                <FiAlertCircle size={12} /> High Priority
              </span>
            )}
            {formattedDate && (
              <span style={{ fontSize: "0.8rem", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                <FiCalendar size={12} /> {formattedDate}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.25rem", color: "#0f172a", fontWeight: 700, lineHeight: 1.3 }}>
            {title}
          </h3>

          {/* Full Description */}
          <div style={{ fontSize: "0.95rem", color: "#334155", lineHeight: 1.6, whiteSpace: "pre-line", marginBottom: "1.5rem" }}>
            {body}
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", paddingTop: "1rem", borderTop: "1px solid #f1f5f9" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#475569",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <FiArrowLeft size={16} /> Back
            </button>

            {targetUrl && onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate(targetUrl)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 20px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#2563eb",
                  color: "#ffffff",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(37, 99, 235, 0.2)",
                }}
              >
                Open Link <FiExternalLink size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
