import React, { useState, useEffect, useCallback } from "react";
import {
  FiSend,
  FiUsers,
  FiUser,
  FiSearch,
  FiPlus,
  FiX,
  FiCheck,
  FiCalendar,
  FiAlertCircle,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiRefreshCw,
  FiFilter,
  FiLink,
  FiImage,
  FiLayers,
} from "react-icons/fi";
import APP_CONFIG from "../../../../config/appConfig";

export default function AdminNotificationManager({ targetRole = "user" }) {
  const isUserRole = targetRole === "user";
  const roleLabel = isUserRole ? "User" : "Expert";
  const rolesLabel = isUserRole ? "Users" : "Experts";

  // Form State
  const [targetScope, setTargetScope] = useState("all"); // "all", "selected", "single"
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [notificationType, setNotificationType] = useState("admin_announcement");
  const [priority, setPriority] = useState("normal");
  const [scheduleTime, setScheduleTime] = useState("");

  const [isSending, setIsSending] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState(null);

  // History List State
  const [batches, setBatches] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historySearch, setHistorySearch] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [page, setPage] = useState(1);

  // Edit Modal State
  const [editingBatch, setEditingBatch] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editTargetUrl, setEditTargetUrl] = useState("");
  const [editPriority, setEditPriority] = useState("normal");
  const [isUpdating, setIsUpdating] = useState(false);

  const getHeaders = () => {
    const adminToken =
      localStorage.getItem("admin_token") ||
      localStorage.getItem("adminToken") ||
      localStorage.getItem("token") ||
      "";
    const headers = {
      "Content-Type": "application/json",
    };
    if (adminToken) {
      headers["Authorization"] = `Bearer ${adminToken}`;
      headers["x-admin-token"] = adminToken;
    }
    return headers;
  };

  // Search Recipients
  useEffect(() => {
    if (!searchQuery.trim() || targetScope === "all") {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `${APP_CONFIG.API_BASE_URL}/admin/notifications/recipients/search?role=${targetRole}&q=${encodeURIComponent(
            searchQuery.trim()
          )}`,
          { headers: getHeaders() }
        );
        const json = await res.json();
        if (json.success) {
          setSearchResults(json.data || []);
        }
      } catch (err) {
        console.error("Recipient search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, targetRole, targetScope]);

  // Load Sent Batches History
  const fetchHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const url = `${APP_CONFIG.API_BASE_URL}/admin/notifications/list?role=${targetRole}&search=${encodeURIComponent(
        historySearch
      )}&date_filter=${dateFilter}&priority=${priorityFilter}&page=${page}&limit=10`;
      const res = await fetch(url, { headers: getHeaders() });
      const json = await res.json();
      if (json.success) {
        setBatches(json.data || []);
        setTotalCount(json.pagination?.total || 0);
      }
    } catch (err) {
      console.error("Fetch history error:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [targetRole, historySearch, dateFilter, priorityFilter, page]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Add recipient to selection
  const handleAddRecipient = (rec) => {
    if (!selectedRecipients.find((r) => r.id === rec.id)) {
      if (targetScope === "single") {
        setSelectedRecipients([rec]);
      } else {
        setSelectedRecipients([...selectedRecipients, rec]);
      }
    }
  };

  const handleRemoveRecipient = (id) => {
    setSelectedRecipients(selectedRecipients.filter((r) => r.id !== id));
  };

  const handleSelectAllFound = () => {
    const newItems = searchResults.filter(
      (res) => !selectedRecipients.some((r) => r.id === res.id)
    );
    setSelectedRecipients([...selectedRecipients, ...newItems]);
  };

  // Submit Notification Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      setStatusFeedback({ type: "error", message: "Title and message are required." });
      return;
    }

    if (
      (targetScope === "single" || targetScope === "selected") &&
      selectedRecipients.length === 0
    ) {
      setStatusFeedback({
        type: "error",
        message: `Please search and select at least one ${roleLabel}.`,
      });
      return;
    }

    setIsSending(true);
    setStatusFeedback(null);

    const payload = {
      title,
      message,
      description,
      imageUrl,
      targetUrl,
      notificationType,
      priority,
      targetScope,
      selectedIds: selectedRecipients.map((r) => r.id),
      scheduleTime: scheduleTime || null,
    };

    const endpoint = isUserRole
      ? `${APP_CONFIG.API_BASE_URL}/admin/notifications/send-users`
      : `${APP_CONFIG.API_BASE_URL}/admin/notifications/send-experts`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setStatusFeedback({
          type: "success",
          message: json.message || `Notification sent successfully!`,
        });
        // Reset Form
        setTitle("");
        setMessage("");
        setDescription("");
        setImageUrl("");
        setTargetUrl("");
        setScheduleTime("");
        setSelectedRecipients([]);
        setSearchQuery("");
        fetchHistory();
      } else {
        setStatusFeedback({
          type: "error",
          message: json.message || "Failed to send notification.",
        });
      }
    } catch (err) {
      setStatusFeedback({ type: "error", message: err.message || "Network error occurred." });
    } finally {
      setIsSending(false);
    }
  };

  // Delete Batch
  const handleDeleteBatch = async (batchId) => {
    if (!window.confirm("Are you sure you want to delete this notification batch and all recipient rows?")) {
      return;
    }
    try {
      const res = await fetch(
        `${APP_CONFIG.API_BASE_URL}/admin/notifications/${batchId}`,
        {
          method: "DELETE",
          headers: getHeaders(),
        }
      );
      const json = await res.json();
      if (json.success) {
        fetchHistory();
      } else {
        alert(json.message || "Failed to delete notification.");
      }
    } catch (err) {
      alert("Error deleting notification.");
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (batch) => {
    setEditingBatch(batch);
    setEditTitle(batch.title || "");
    setEditMessage(batch.message || "");
    setEditDescription(batch.description || "");
    setEditImageUrl(batch.image_url || "");
    setEditTargetUrl(batch.target_url || "");
    setEditPriority(batch.priority || "normal");
  };

  // Update Batch Submit
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingBatch) return;

    setIsUpdating(true);
    try {
      const res = await fetch(
        `${APP_CONFIG.API_BASE_URL}/admin/notifications/${editingBatch.batch_id}`,
        {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify({
            title: editTitle,
            message: editMessage,
            description: editDescription,
            image_url: editImageUrl,
            target_url: editTargetUrl,
            priority: editPriority,
          }),
        }
      );
      const json = await res.json();
      if (json.success) {
        setEditingBatch(null);
        fetchHistory();
      } else {
        alert(json.message || "Failed to update notification.");
      }
    } catch (err) {
      alert("Error updating notification.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div style={{ padding: "1.5rem", maxWidth: "1280px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.5rem", color: "#0f172a", fontWeight: "700" }}>
            Admin Notifications – Send to {rolesLabel}
          </h2>
          <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "0.9rem" }}>
            Create and broadcast real-time socket and push notifications to online & offline {rolesLabel.toLowerCase()}.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchHistory}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 14px",
            background: "#f1f5f9",
            color: "#334155",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            fontSize: "0.875rem",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          <FiRefreshCw size={14} /> Refresh History
        </button>
      </div>

      {/* Main Grid: Form Left, Stats/Quick Tips Right */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.5rem", marginBottom: "2rem" }}>
        {/* Left Column: Notification Form */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <h3 style={{ margin: "0 0 1.25rem 0", fontSize: "1.1rem", color: "#1e293b", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
            <FiSend color="#2563eb" /> Compose Broadcast Notification
          </h3>

          {statusFeedback && (
            <div
              style={{
                marginBottom: "1.25rem",
                padding: "0.85rem 1rem",
                borderRadius: "8px",
                fontSize: "0.9rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: statusFeedback.type === "success" ? "#dcfce7" : "#fee2e2",
                color: statusFeedback.type === "success" ? "#15803d" : "#b91c1c",
                border: `1px solid ${statusFeedback.type === "success" ? "#bbf7d0" : "#fca5a5"}`,
              }}
            >
              {statusFeedback.type === "success" ? <FiCheck size={18} /> : <FiAlertCircle size={18} />}
              {statusFeedback.message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* 1. Recipient Scope Selection */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#334155", marginBottom: "0.5rem" }}>
                Select Recipient Scope
              </label>
              <div style={{ display: "flex", gap: "1rem" }}>
                {[
                  { id: "all", label: `All ${rolesLabel}`, icon: FiUsers },
                  { id: "selected", label: `Selected ${rolesLabel}`, icon: FiUsers },
                  { id: "single", label: `Single ${roleLabel}`, icon: FiUser },
                ].map((scope) => {
                  const Icon = scope.icon;
                  const active = targetScope === scope.id;
                  return (
                    <button
                      key={scope.id}
                      type="button"
                      onClick={() => {
                        setTargetScope(scope.id);
                        if (scope.id === "all") setSelectedRecipients([]);
                      }}
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        padding: "10px",
                        borderRadius: "8px",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        border: active ? "2px solid #2563eb" : "1px solid #cbd5e1",
                        background: active ? "#eff6ff" : "#ffffff",
                        color: active ? "#1d4ed8" : "#475569",
                      }}
                    >
                      <Icon size={16} /> {scope.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Interactive Recipient Search & Selector */}
            {targetScope !== "all" && (
              <div style={{ marginBottom: "1.25rem", background: "#f8fafc", padding: "1rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                  Search {rolesLabel} by ID, Name, Email, or Mobile
                </label>
                <div style={{ position: "relative" }}>
                  <FiSearch style={{ position: "absolute", left: "12px", top: "12px", color: "#94a3b8" }} size={16} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Type ${roleLabel} ID, name, email or phone...`}
                    style={{
                      width: "100%",
                      padding: "9px 12px 9px 36px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.875rem",
                      boxSizing: "border-box",
                    }}
                  />
                  {isSearching && (
                    <span style={{ position: "absolute", right: "12px", top: "10px", fontSize: "0.75rem", color: "#64748b" }}>
                      Searching...
                    </span>
                  )}
                </div>

                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                  <div style={{ marginTop: "8px", maxHeight: "180px", overflowY: "auto", background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px" }}>
                    <div style={{ padding: "6px 12px", background: "#f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#475569" }}>
                        Found {searchResults.length} {rolesLabel}
                      </span>
                      {targetScope === "selected" && (
                        <button
                          type="button"
                          onClick={handleSelectAllFound}
                          style={{ border: "none", background: "none", color: "#2563eb", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
                        >
                          Select All Found
                        </button>
                      )}
                    </div>
                    {searchResults.map((rec) => {
                      const isSelected = selectedRecipients.some((r) => r.id === rec.id);
                      return (
                        <div
                          key={rec.id}
                          style={{
                            padding: "8px 12px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderBottom: "1px solid #f1f5f9",
                            fontSize: "0.85rem",
                          }}
                        >
                          <div>
                            <strong>{rec.name}</strong> <span style={{ color: "#64748b" }}>(ID: #{rec.id})</span>
                            <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{rec.email} | {rec.mobile}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAddRecipient(rec)}
                            disabled={isSelected}
                            style={{
                              padding: "4px 10px",
                              borderRadius: "4px",
                              border: isSelected ? "1px solid #bbf7d0" : "1px solid #2563eb",
                              background: isSelected ? "#dcfce7" : "#2563eb",
                              color: isSelected ? "#15803d" : "#ffffff",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              cursor: isSelected ? "default" : "pointer",
                            }}
                          >
                            {isSelected ? "Added" : "+ Add"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Selected Recipients Chips */}
                {selectedRecipients.length > 0 && (
                  <div style={{ marginTop: "12px" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                      Selected Recipients ({selectedRecipients.length}):
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {selectedRecipients.map((rec) => (
                        <span
                          key={rec.id}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "3px 8px",
                            background: "#e0e7ff",
                            color: "#3730a3",
                            borderRadius: "16px",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                          }}
                        >
                          {rec.name} (#{rec.id})
                          <FiX
                            size={12}
                            style={{ cursor: "pointer", color: "#4338ca" }}
                            onClick={() => handleRemoveRecipient(rec.id)}
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Title & Message */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                  Notification Title <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Special Platform Announcement"
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.875rem", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                  Notification Type
                </label>
                <select
                  value={notificationType}
                  onChange={(e) => setNotificationType(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.875rem", boxSizing: "border-box" }}
                >
                  <option value="admin_announcement">📢 Admin Announcement</option>
                  <option value="admin_offer">🎁 Offer & Promotion</option>
                  <option value="admin_alert">⚠️ System Alert / Warning</option>
                  <option value="system_update">🚀 Feature Update</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                Short Message / Body <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <textarea
                required
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Brief summary that appears in push notification and toast..."
                style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.875rem", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                Full Description (Optional for Detail View Modal)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed description displayed when the recipient opens the notification..."
                style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.875rem", boxSizing: "border-box" }}
              />
            </div>

            {/* Additional Fields: Image URL, Target URL, Priority */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                  Image URL (Optional)
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/banner.jpg"
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                  Target URL / Deep Link
                </label>
                <input
                  type="text"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder={isUserRole ? "/user/my-bookings" : "/expert/earnings"}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                  Priority Level
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem", boxSizing: "border-box" }}
                >
                  <option value="normal">Normal Priority</option>
                  <option value="high">🔥 High Priority (Require Interaction)</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                disabled={isSending}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 24px",
                  background: isSending ? "#94a3b8" : "#2563eb",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  cursor: isSending ? "not-allowed" : "pointer",
                  boxShadow: "0 2px 4px rgba(37,99,235,0.2)",
                }}
              >
                <FiSend size={16} />
                {isSending ? "Dispatching Notifications..." : `Send Notification to ${rolesLabel}`}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Information Panel & Quick Stats */}
        <div>
          <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "12px", padding: "1.25rem", marginBottom: "1.25rem" }}>
            <h4 style={{ margin: "0 0 0.75rem 0", color: "#0f172a", fontSize: "1rem", fontWeight: 700 }}>
              💡 Delivery & Socket Rules
            </h4>
            <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "#475569", fontSize: "0.85rem", lineHeight: "1.5" }}>
              <li style={{ marginBottom: "8px" }}>
                <strong>1 Row Per Recipient:</strong> Database stores 1 notification record per targeted {roleLabel.toLowerCase()}.
              </li>
              <li style={{ marginBottom: "8px" }}>
                <strong>Online Recipients:</strong> Real-time Socket.IO emission (`notification:new`) delivers instant toast alerts.
              </li>
              <li style={{ marginBottom: "8px" }}>
                <strong>Offline Recipients:</strong> FCM Push Notification is triggered automatically for backgrounded/offline devices.
              </li>
              <li style={{ marginBottom: "8px" }}>
                <strong>In-App Detail Modal:</strong> Opening the notification opens a rich detail modal and marks it as read.
              </li>
              <li>
                <strong>Real-Time Edits:</strong> Editing or deleting a batch automatically syncs across connected client apps.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sent Notifications History Section */}
      <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "1.15rem", color: "#0f172a", fontWeight: 700 }}>
              Sent {rolesLabel} Notifications History ({totalCount})
            </h3>
            <p style={{ margin: "2px 0 0 0", color: "#64748b", fontSize: "0.85rem" }}>
              Audit past broadcasts, view read/unread counts, edit content or delete entries.
            </p>
          </div>

          {/* Filters Bar */}
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <input
              type="text"
              value={historySearch}
              onChange={(e) => {
                setHistorySearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search title/message..."
              style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem" }}
            />

            <select
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setPage(1);
              }}
              style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem" }}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last7">Last 7 Days</option>
              <option value="last30">Last 30 Days</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setPage(1);
              }}
              style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem" }}
            >
              <option value="all">All Priorities</option>
              <option value="normal">Normal</option>
              <option value="high">High Priority</option>
            </select>
          </div>
        </div>

        {/* History Table */}
        {isLoadingHistory ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>Loading history...</div>
        ) : batches.length === 0 ? (
          <div style={{ padding: "2.5rem", textAlign: "center", color: "#64748b", background: "#f8fafc", borderRadius: "8px" }}>
            No sent notification records found for selected filters.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0", color: "#475569", textAlign: "left" }}>
                  <th style={{ padding: "10px 12px" }}>Title & Message</th>
                  <th style={{ padding: "10px 12px" }}>Scope</th>
                  <th style={{ padding: "10px 12px" }}>Priority</th>
                  <th style={{ padding: "10px 12px" }}>Total Sent</th>
                  <th style={{ padding: "10px 12px" }}>Read Count</th>
                  <th style={{ padding: "10px 12px" }}>Unread</th>
                  <th style={{ padding: "10px 12px" }}>Date</th>
                  <th style={{ padding: "10px 12px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((batch) => (
                  <tr key={batch.batch_id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "12px" }}>
                      <div style={{ fontWeight: 700, color: "#0f172a" }}>{batch.title}</div>
                      <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "2px" }}>{batch.message}</div>
                    </td>
                    <td style={{ padding: "12px", textTransform: "capitalize" }}>
                      <span style={{ padding: "3px 8px", background: "#f1f5f9", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 600 }}>
                        {batch.target_scope}
                      </span>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          padding: "3px 8px",
                          borderRadius: "12px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          background: batch.priority === "high" ? "#fee2e2" : "#e0e7ff",
                          color: batch.priority === "high" ? "#b91c1c" : "#3730a3",
                        }}
                      >
                        {batch.priority === "high" ? "🔥 High" : "Normal"}
                      </span>
                    </td>
                    <td style={{ padding: "12px", fontWeight: 700 }}>{batch.recipient_count}</td>
                    <td style={{ padding: "12px", color: "#15803d", fontWeight: 700 }}>{batch.read_count}</td>
                    <td style={{ padding: "12px", color: "#b91c1c", fontWeight: 700 }}>{batch.unread_count}</td>
                    <td style={{ padding: "12px", fontSize: "0.8rem", color: "#64748b" }}>
                      {new Date(batch.created_at).toLocaleString()}
                    </td>
                    <td style={{ padding: "12px", textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(batch)}
                          style={{ padding: "6px 10px", background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", borderRadius: "6px", cursor: "pointer", fontWeight: 600 }}
                        >
                          <FiEdit2 size={14} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBatch(batch.batch_id)}
                          style={{ padding: "6px 10px", background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca", borderRadius: "6px", cursor: "pointer", fontWeight: 600 }}
                        >
                          <FiTrash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Notification Modal */}
      {editingBatch && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ background: "#ffffff", borderRadius: "12px", maxWidth: "600px", width: "100%", padding: "1.5rem", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#0f172a" }}>Edit Broadcast Notification</h3>
              <FiX size={20} style={{ cursor: "pointer" }} onClick={() => setEditingBatch(null)} />
            </div>

            <form onSubmit={handleUpdateSubmit}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.3rem" }}>Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.3rem" }}>Short Message</label>
                <textarea
                  required
                  rows={2}
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.3rem" }}>Full Description</label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button type="button" onClick={() => setEditingBatch(null)} style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#ffffff", cursor: "pointer" }}>
                  Cancel
                </button>
                <button type="submit" disabled={isUpdating} style={{ padding: "8px 20px", borderRadius: "6px", border: "none", background: "#2563eb", color: "#ffffff", fontWeight: 700, cursor: "pointer" }}>
                  {isUpdating ? "Saving..." : "Save & Sync Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
