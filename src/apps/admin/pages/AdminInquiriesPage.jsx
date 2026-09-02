import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  FiMessageSquare,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiEye,
  FiX,
  FiSend,
  FiUser,
  FiMail,
  FiPhone,
  FiClock,
  FiCalendar,
  FiCheckCircle,
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight,
  FiTag,
  FiLayers,
} from "react-icons/fi";
import APP_CONFIG from "../../../config/appConfig";

import {
  DashboardContainer,
  DashboardHeader,
  SectionBox,
  Table,
  TableHead,
  TableRow,
  TableCell,
  StatusBadge,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  LoadingSpinner,
  EmptyState,
  TextArea,
  Select,
  Input,
  ActionButton,
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

const getStatusBadge = (status) => {
  const st = String(status || "").toLowerCase();
  switch (st) {
    case "new":
    case "unread":
      return <StatusBadge $warning style={{ background: "#dbeafe", color: "#1e40af", borderColor: "#bfdbfe" }}>New</StatusBadge>;
    case "opened":
    case "in_progress":
      return <StatusBadge $warning style={{ background: "#fef3c7", color: "#92400e", borderColor: "#fde68a" }}>In Progress</StatusBadge>;
    case "user_replied":
      return <StatusBadge style={{ background: "#f3e8ff", color: "#6b21a8", borderColor: "#e9d5ff" }}>User Replied</StatusBadge>;
    case "admin_replied":
    case "expert_replied":
      return <StatusBadge style={{ background: "#e0f2fe", color: "#075985", borderColor: "#bae6fd" }}>Replied</StatusBadge>;
    case "closed":
      return <StatusBadge style={{ background: "#f1f5f9", color: "#475569", borderColor: "#cbd5e1" }}>Closed</StatusBadge>;
    case "converted":
      return <StatusBadge $success style={{ background: "#dcfce7", color: "#166534", borderColor: "#bbf7d0" }}>Converted</StatusBadge>;
    default:
      return <StatusBadge>{status || "New"}</StatusBadge>;
  }
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters & Pagination
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Detail Modal & Message Thread State
  const [selectedInquiryId, setSelectedInquiryId] = useState(null);
  const [inquiryDetail, setInquiryDetail] = useState(null);
  const [messages, setMessages] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  // Reply State
  const [replyMessage, setReplyMessage] = useState("");
  const [replying, setReplying] = useState(false);
  const [replyError, setReplyError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // Status Update State inside Modal
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to page 1 on search change
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch Inquiries List from Backend API
  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let queryUrl = `/api/inquiries/admin/all?page=${page}&limit=${limit}`;
      if (statusFilter && statusFilter !== "all") {
        queryUrl += `&status=${encodeURIComponent(statusFilter)}`;
      }
      if (debouncedSearch.trim()) {
        queryUrl += `&search=${encodeURIComponent(debouncedSearch.trim())}`;
      }

      const res = await apiFetch(queryUrl);
      const data = await res.json();

      if (res.ok && data.success) {
        setInquiries(data.data || []);
        if (data.pagination) {
          setTotalCount(data.pagination.total || 0);
          setTotalPages(data.pagination.totalPages || 1);
        } else {
          setTotalCount(data.data?.length || 0);
          setTotalPages(1);
        }
      } else {
        setError(data.message || "Failed to load inquiries.");
      }
    } catch (err) {
      console.error("fetchInquiries error:", err);
      setError("Network error. Failed to load inquiries.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, statusFilter, debouncedSearch]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  // Fetch Inquiry Detail & Messages
  const fetchInquiryDetail = async (id) => {
    setDetailLoading(true);
    setDetailError("");
    setReplyError("");
    try {
      const res = await apiFetch(`/api/inquiries/admin/${id}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setInquiryDetail(data.data.inquiry || null);
        setMessages(data.data.messages || []);
      } else {
        setDetailError(data.message || "Failed to fetch inquiry details.");
      }
    } catch (err) {
      console.error("fetchInquiryDetail error:", err);
      setDetailError("Network error loading inquiry details.");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleOpenDetail = (id) => {
    setSelectedInquiryId(id);
    fetchInquiryDetail(id);
  };

  const handleCloseDetail = () => {
    setSelectedInquiryId(null);
    setInquiryDetail(null);
    setMessages([]);
    setReplyMessage("");
    setReplyError("");
  };

  // Status Change Handler inside Detail Modal
  const handleStatusChange = async (newStatus) => {
    if (!selectedInquiryId) return;
    setUpdatingStatus(true);
    try {
      const res = await apiFetch(`/api/inquiries/admin/${selectedInquiryId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setInquiryDetail((prev) => (prev ? { ...prev, status: newStatus } : prev));
        showToast("Inquiry status updated successfully!");
        fetchInquiries(); // Refresh table list
      } else {
        alert(data.message || "Failed to update status.");
      }
    } catch (err) {
      alert("Network error updating status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Submit Admin Reply Handler
  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || replying || !selectedInquiryId) return;

    if (replyMessage.trim().length < 5) {
      setReplyError("Reply message must be at least 5 characters long.");
      return;
    }

    setReplying(true);
    setReplyError("");

    try {
      const res = await apiFetch(`/api/inquiries/admin/${selectedInquiryId}/reply`, {
        method: "POST",
        body: JSON.stringify({ message: replyMessage.trim() }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setReplyMessage("");
        showToast("Reply sent successfully!");
        // Refresh details & message thread
        await fetchInquiryDetail(selectedInquiryId);
        fetchInquiries();
      } else {
        setReplyError(data.message || "Failed to send reply.");
      }
    } catch (err) {
      console.error("handleSendReply error:", err);
      setReplyError("Network error. Failed to send reply.");
    } finally {
      setReplying(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  return (
    <DashboardContainer>
      {/* PAGE HEADER */}
      <DashboardHeader>
        <h1>
          <FiMessageSquare /> Inquiries Management
        </h1>
        <p>Manage, review, and respond to customer service inquiries in real time.</p>
      </DashboardHeader>

      {/* TOAST NOTIFICATION BANNER */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 100050,
            background: "#0f172a",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
            fontSize: "14px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <FiCheckCircle style={{ color: "#10b981" }} /> {toastMessage}
        </div>
      )}

      <SectionBox>
        {/* FILTER & SEARCH BAR */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          {/* STATUS TAB PILLS */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {[
              { key: "all", label: "All Inquiries" },
              { key: "new", label: "New" },
              { key: "in_progress", label: "In Progress" },
              { key: "closed", label: "Closed" },
              { key: "converted", label: "Converted" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setStatusFilter(tab.key);
                  setPage(1);
                }}
                style={{
                  padding: "8px 16px",
                  borderRadius: "20px",
                  border: statusFilter === tab.key ? "1px solid #2563eb" : "1px solid #e2e8f0",
                  background: statusFilter === tab.key ? "#2563eb" : "#ffffff",
                  color: statusFilter === tab.key ? "#ffffff" : "#475569",
                  fontWeight: "700",
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* SEARCH & REFRESH */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center", width: "100%", maxWidth: "340px" }}>
            <div style={{ position: "relative", width: "100%" }}>
              <FiSearch
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                }}
              />
              <Input
                type="text"
                placeholder="Search ID, user, service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: "36px", height: "40px", fontSize: "13px" }}
              />
            </div>
            <button
              type="button"
              onClick={fetchInquiries}
              title="Refresh List"
              style={{
                height: "40px",
                width: "40px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#475569",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <FiRefreshCw className={loading ? "spin" : ""} />
            </button>
          </div>
        </div>

        {/* ERROR STATE */}
        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#991b1b",
              padding: "16px",
              borderRadius: "12px",
              marginBottom: "20px",
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
              onClick={fetchInquiries}
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

        {/* LOADING STATE */}
        {loading ? (
          <div style={{ padding: "3rem 1rem", textAlgin: "center" }}>
            <LoadingSpinner style={{ margin: "0 auto 1rem" }} />
            <p style={{ textAlign: "center", color: "#64748b", fontWeight: "600" }}>Loading inquiries...</p>
          </div>
        ) : inquiries.length === 0 ? (
          /* EMPTY STATE */
          <EmptyState style={{ padding: "3rem 1rem" }}>
            <FiMessageSquare size={48} style={{ color: "#cbd5e1", marginBottom: "1rem" }} />
            <h4 style={{ margin: "0 0 6px", color: "#1e293b", fontSize: "16px" }}>No Inquiries Found</h4>
            <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
              There are no inquiries matching your active status filter or search query.
            </p>
          </EmptyState>
        ) : (
          /* INQUIRIES TABLE */
          <div style={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Inquiry ID</TableCell>
                  <TableCell>Customer Details</TableCell>
                  <TableCell>Service</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell style={{ textAlign: "right" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <tbody>
                {inquiries.map((inq) => (
                  <TableRow key={inq.id}>
                    <TableCell style={{ fontWeight: "800", color: "#0f172a" }}>#{inq.id}</TableCell>

                    {/* CUSTOMER INFO */}
                    <TableCell>
                      <div style={{ fontWeight: "700", color: "#0f172a" }}>
                        {inq.user_name_snapshot || inq.user_name || "G9User"}
                      </div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>
                        {inq.user_email_snapshot || inq.user_email || "N/A"}
                      </div>
                    </TableCell>

                    {/* SERVICE */}
                    <TableCell>
                      {inq.service_name ? (
                        <div style={{ fontWeight: "700", color: "#2563eb", display: "flex", alignItems: "center", gap: "4px" }}>
                          <FiLayers size={13} /> {inq.service_name}
                        </div>
                      ) : inq.expert_name ? (
                        <div style={{ fontSize: "13px", color: "#475569" }}>
                          Direct Expert ({inq.expert_name})
                        </div>
                      ) : (
                        <div style={{ fontSize: "13px", color: "#94a3b8" }}>General Inquiry</div>
                      )}
                    </TableCell>

                    {/* SUBJECT */}
                    <TableCell style={{ maxWidth: "220px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      <span title={inq.subject} style={{ fontSize: "13px", color: "#334155", fontWeight: "500" }}>
                        {inq.subject}
                      </span>
                    </TableCell>

                    {/* STATUS */}
                    <TableCell>{getStatusBadge(inq.status)}</TableCell>

                    {/* DATE */}
                    <TableCell style={{ fontSize: "12px", color: "#64748b" }}>
                      {formatDate(inq.created_at || inq.last_message_at)}
                    </TableCell>

                    {/* ACTION */}
                    <TableCell style={{ textAlign: "right" }}>
                      <ActionButton
                        type="button"
                        onClick={() => handleOpenDetail(inq.id)}
                        style={{
                          background: "#eff6ff",
                          color: "#2563eb",
                          border: "1px solid #bfdbfe",
                          padding: "6px 14px",
                          borderRadius: "8px",
                          fontWeight: "700",
                          fontSize: "12px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <FiEye /> View
                      </ActionButton>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {/* PAGINATION BAR */}
        {!loading && inquiries.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
              marginTop: "20px",
              paddingTop: "16px",
              borderTop: "1px solid #f1f5f9",
            }}
          >
            <div style={{ fontSize: "13px", color: "#64748b" }}>
              Showing <strong>{(page - 1) * limit + 1}</strong> to <strong>{Math.min(page * limit, totalCount)}</strong> of <strong>{totalCount}</strong> inquiries
            </div>

            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  background: page <= 1 ? "#f8fafc" : "#ffffff",
                  color: page <= 1 ? "#94a3b8" : "#334155",
                  cursor: page <= 1 ? "not-allowed" : "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <FiChevronLeft /> Previous
              </button>

              <span style={{ fontSize: "13px", fontWeight: "700", padding: "0 8px", color: "#0f172a" }}>
                Page {page} of {totalPages || 1}
              </span>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  background: page >= totalPages ? "#f8fafc" : "#ffffff",
                  color: page >= totalPages ? "#94a3b8" : "#334155",
                  cursor: page >= totalPages ? "not-allowed" : "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                Next <FiChevronRight />
              </button>
            </div>
          </div>
        )}
      </SectionBox>

      {/* INQUIRY DETAIL & CONVERSATION MODAL */}
      {selectedInquiryId && (
        <Modal style={{ zIndex: 100000 }}>
          <ModalContent style={{ maxWidth: "760px", width: "95%", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
            {/* MODAL HEADER */}
            <ModalHeader style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "800", color: "#0f172a" }}>
                  Inquiry #{selectedInquiryId}
                </h3>
                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                  Created on {formatDate(inquiryDetail?.created_at)}
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseDetail}
                style={{ background: "#f1f5f9", border: 0, borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <FiX />
              </button>
            </ModalHeader>

            <ModalBody style={{ overflowY: "auto", flex: 1, padding: "16px 20px" }}>
              {detailLoading ? (
                <div style={{ padding: "3rem 1rem", textAlign: "center" }}>
                  <LoadingSpinner style={{ margin: "0 auto 1rem" }} />
                  <p style={{ color: "#64748b", fontWeight: "600" }}>Loading inquiry details...</p>
                </div>
              ) : detailError ? (
                <div style={{ background: "#fef2f2", color: "#991b1b", padding: "16px", borderRadius: "10px", textAlign: "center" }}>
                  <FiAlertCircle size={24} style={{ marginBottom: "8px" }} />
                  <div>{detailError}</div>
                  <button type="button" onClick={() => fetchInquiryDetail(selectedInquiryId)} style={{ marginTop: "12px", padding: "6px 14px", borderRadius: "6px", background: "#991b1b", color: "#fff", border: 0, cursor: "pointer" }}>
                    Retry
                  </button>
                </div>
              ) : inquiryDetail ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  {/* METADATA GRID */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", background: "#f8fafc", padding: "16px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
                    <div>
                      <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#64748b" }}>
                        Customer
                      </span>
                      <div style={{ fontWeight: "700", color: "#0f172a", fontSize: "14px", marginTop: "2px" }}>
                        {inquiryDetail.user_name || inquiryDetail.user_name_snapshot || "G9User"}
                      </div>
                      <div style={{ fontSize: "12px", color: "#475569", display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                        <FiMail size={12} /> {inquiryDetail.user_email || inquiryDetail.user_email_snapshot || "N/A"}
                      </div>
                      <div style={{ fontSize: "12px", color: "#475569", display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                        <FiPhone size={12} /> {inquiryDetail.user_mobile_snapshot || "N/A"}
                      </div>
                    </div>

                    <div>
                      <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#64748b" }}>
                        Target Service
                      </span>
                      <div style={{ fontWeight: "700", color: "#2563eb", fontSize: "14px", marginTop: "2px" }}>
                        {inquiryDetail.service_name || "Direct Inquiry"}
                      </div>
                      <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                        Method: <strong>{inquiryDetail.preferred_contact_method || "Phone Call"}</strong>
                      </div>
                      <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                        Time: <strong>{inquiryDetail.preferred_contact_time || "Anytime"}</strong>
                      </div>
                    </div>

                    <div>
                      <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#64748b" }}>
                        Status Management
                      </span>
                      <div style={{ marginTop: "4px" }}>
                        <Select
                          value={inquiryDetail.status || "new"}
                          disabled={updatingStatus}
                          onChange={(e) => handleStatusChange(e.target.value)}
                          style={{ fontSize: "13px", padding: "6px 10px", borderRadius: "8px", fontWeight: "700" }}
                        >
                          <option value="new">New</option>
                          <option value="opened">Opened</option>
                          <option value="in_progress">In Progress</option>
                          <option value="closed">Closed</option>
                          <option value="converted">Converted</option>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* SUBJECT BANNER */}
                  <div style={{ borderLeft: "4px solid #2563eb", paddingLeft: "12px" }}>
                    <div style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#64748b" }}>
                      Subject
                    </div>
                    <div style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", marginTop: "2px" }}>
                      {inquiryDetail.subject}
                    </div>
                  </div>

                  {/* CONVERSATION THREAD */}
                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: "800", color: "#0f172a", margin: "0 0 12px 0", display: "flex", alignItems: "center", gap: "6px" }}>
                      <FiMessageSquare style={{ color: "#2563eb" }} /> Conversation History ({messages.length})
                    </h4>

                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "300px", overflowY: "auto", paddingRight: "6px" }}>
                      {messages.map((msg) => {
                        const isAdmin = msg.sender_type === "admin";
                        const isUser = msg.sender_type === "user";

                        return (
                          <div
                            key={msg.id}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: isAdmin ? "flex-end" : "flex-start",
                            }}
                          >
                            <div style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", marginBottom: "3px" }}>
                              {isAdmin ? "🛡️ Admin" : isUser ? "👤 Customer" : "⭐ Expert"}{" "}
                              <span style={{ fontWeight: "400", fontSize: "10px", color: "#94a3b8" }}>
                                • {formatDate(msg.created_at)}
                              </span>
                            </div>
                            <div
                              style={{
                                maxWidth: "80%",
                                padding: "10px 14px",
                                borderRadius: isAdmin ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                                background: isAdmin ? "#2563eb" : "#f1f5f9",
                                color: isAdmin ? "#ffffff" : "#0f172a",
                                fontSize: "13px",
                                lineHeight: "1.5",
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              {msg.message}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ADMIN REPLY FORM */}
                  <form onSubmit={handleSendReply} style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px", paddingTop: "14px", borderTop: "1px solid #f1f5f9" }}>
                    <label style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>
                      Post Admin Reply
                    </label>

                    {replyError && (
                      <div style={{ fontSize: "12px", color: "#dc2626", background: "#fef2f2", padding: "8px 12px", borderRadius: "6px" }}>
                        {replyError}
                      </div>
                    )}

                    <TextArea
                      rows={3}
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type your response to the customer..."
                      required
                      minLength={5}
                      style={{ fontSize: "13px", padding: "10px 12px" }}
                    />

                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <button
                        type="submit"
                        disabled={replying || !replyMessage.trim()}
                        style={{
                          background: "#2563eb",
                          color: "#ffffff",
                          border: 0,
                          borderRadius: "8px",
                          padding: "8px 20px",
                          fontWeight: "700",
                          fontSize: "13px",
                          cursor: replying || !replyMessage.trim() ? "not-allowed" : "pointer",
                          opacity: replying || !replyMessage.trim() ? 0.6 : 1,
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        {replying ? (
                          <>Sending...</>
                        ) : (
                          <>
                            <FiSend /> Send Reply
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              ) : null}
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </DashboardContainer>
  );
}
