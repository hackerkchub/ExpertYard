import React, { useState, useEffect } from "react";
import "./Workspace.css";
import APP_CONFIG from "../../../config/appConfig";
import OverviewTab from "./tabs/OverviewTab";
import TimelineTab from "./tabs/TimelineTab";
import DiscussionTab from "./tabs/DiscussionTab";
import DocumentsTab from "./tabs/DocumentsTab";
import ChecklistTab from "./tabs/ChecklistTab";
import DeliveryTab from "./tabs/DeliveryTab";
import InvoiceTab from "./tabs/InvoiceTab";
import ReviewTab from "./tabs/ReviewTab";
import {
  getWorkspace,
  updateWorkspaceStep,
} from "../../api/workspace.api";

export default function BookingWorkspaceShell({ bookingId, currentUserRole = "user" }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [workspaceData, setWorkspaceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ⭐⭐⭐ UPDATED: fetchWorkspace using workspace.api ⭐⭐⭐
  const fetchWorkspace = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔍 [WORKSPACE] Loading:", bookingId);

      const response = await getWorkspace(bookingId);

      console.log("✅ [WORKSPACE] Response:", response.data);

      if (response.data.success) {
        setWorkspaceData(response.data.data);
        setError(null);
      } else {
        setError(response.data.message || "Failed to load workspace.");
      }

    } catch (err) {

      console.error("🚨 Workspace Error:", err);

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Network error loading workspace."
      );

    } finally {
      setLoading(false);
    }
  };

  // ⭐⭐⭐ UPDATED: handleStepOverride using workspace.api ⭐⭐⭐
  const handleStepOverride = async (targetStepKey) => {
    try {

      const response = await updateWorkspaceStep(
        bookingId,
        targetStepKey
      );

      if (response.data.success) {
        fetchWorkspace();
      } else {
        alert(response.data.message || "Failed to override step.");
      }

    } catch (err) {

      alert(
        err?.response?.data?.message ||
        err?.message ||
        "Error overriding step."
      );

    }
  };

  useEffect(() => {
    if (bookingId) {
      fetchWorkspace();
    } else {
      console.warn("⚠️ [DIAGNOSTIC] bookingId is", bookingId, "- Fetch skipped!");
    }
  }, [bookingId]);

  if (loading) {
    return (
      <div className="workspace-skeleton">
        <div className="skeleton-header"></div>
        <div className="skeleton-tabs"></div>
        <div className="skeleton-content"></div>
      </div>
    );
  }

  if (error || !workspaceData) {
    return (
      <div className="workspace-error-card" style={{ padding: "2rem", textAlign: "center", background: "#fff", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", margin: "2rem auto", maxWidth: "600px" }}>
        <h3 style={{ color: "#ef4444", marginBottom: "0.5rem" }}>Workspace Unavailable</h3>
        <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>{error || "Unable to retrieve workspace data."}</p>
        <button onClick={fetchWorkspace} className="btn-reload" style={{ padding: "0.5rem 1.25rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "700", cursor: "pointer" }}>Retry</button>
      </div>
    );
  }

  const { workspace, snapshot, timeline, documents, current_permissions } = workspaceData;

  const clientDocuments = (documents || []).filter((d) => {
    const role = String(d.uploaded_by_role || "").trim().toUpperCase();
    const docType = String(d.doc_type_key || "").trim().toUpperCase();
    return role !== "EXPERT" && role !== "ADMIN" && docType !== "FINAL_DELIVERABLE" && docType !== "DELIVERY" && !docType.includes("DELIVER");
  });
  const deliverableDocuments = (documents || []).filter((d) => {
    const role = String(d.uploaded_by_role || "").trim().toUpperCase();
    const docType = String(d.doc_type_key || "").trim().toUpperCase();
    return role === "EXPERT" || role === "ADMIN" || docType === "FINAL_DELIVERABLE" || docType === "DELIVERY" || docType.includes("DELIVER");
  });

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "timeline", label: `Timeline (${timeline?.length || 0})` },
    { id: "discussion", label: "Discussion (Free)" },
    { id: "documents", label: `Documents (${clientDocuments.length})` },
    { id: "checklist", label: "Checklist" },
    { id: "delivery", label: `Delivery (${deliverableDocuments.length})` },
    { id: "invoice", label: "Invoice" },
    { id: "review", label: "Review" },
  ];

  return (
    <div className="workspace-shell">
      {/* Admin Supervisory Banner */}
      {currentUserRole === "admin" && (
        <div style={{ background: "#1e293b", color: "#fff", padding: "0.75rem 1.25rem", borderRadius: "10px 10px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.1rem" }}>🛡️</span>
            <span style={{ fontWeight: "700", fontSize: "0.9rem" }}>ADMIN SUPERVISORY CONTROL — Booking #{bookingId}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>Override Step:</span>
            <select
              value={workspace?.current_step_key || "SUBMITTED"}
              onChange={(e) => handleStepOverride(e.target.value)}
              style={{ padding: "0.35rem 0.65rem", borderRadius: "6px", border: "none", background: "#334155", color: "#fff", fontWeight: "700", fontSize: "0.85rem", cursor: "pointer" }}
            >
              <option value="SUBMITTED">1. SUBMITTED</option>
              <option value="EXPERT_ASSIGNED">2. EXPERT_ASSIGNED</option>
              <option value="IN_REVIEW">3. IN_REVIEW</option>
              <option value="DELIVERED">4. DELIVERED</option>
              <option value="COMPLETED">5. COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
        </div>
      )}

      {/* Top Workspace Header */}
      <div className="workspace-header">
        <div className="header-meta">
          <span className="booking-badge">Booking #{bookingId}</span>
          <h2 className="service-title">{snapshot?.service_meta?.title || workspace?.master_service_title || "Digital Service Execution"}</h2>
          <span className={`status-pill status-${(workspace?.current_step_key || 'submitted').toLowerCase()}`}>
            Status: {workspace?.current_step_key || "SUBMITTED"}
          </span>
        </div>
        <div className="header-action">
          <button className="btn-refresh" onClick={fetchWorkspace}>↻ Refresh</button>
        </div>
      </div>

      {workspace?.expert_status_request && (
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <strong style={{ color: '#92400e', fontSize: '0.9rem', display: 'block' }}>
              {workspace.expert_status_request === "COMPLETED_REQUESTED"
                ? "🏆 Pending Admin Completion Approval"
                : "🚫 Pending Admin Cancellation Approval"}
            </strong>
            {workspace.expert_request_notes && (
              <span style={{ color: '#b45309', fontSize: '0.85rem' }}>
                Expert Notes: "{workspace.expert_request_notes}"
              </span>
            )}
          </div>
          {currentUserRole === "admin" && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => handleStepOverride(workspace.expert_status_request === "COMPLETED_REQUESTED" ? "COMPLETED" : "CANCELLED")}
                style={{ padding: '0.4rem 0.85rem', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Approve & Update Status
              </button>
            </div>
          )}
        </div>
      )}

      {/* 8-Tab Navigation Bar */}
      <div className="workspace-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Tab View Body */}
      <div className="workspace-body">
        {activeTab === "overview" && (
          <OverviewTab workspace={workspace} snapshot={snapshot} role={currentUserRole} />
        )}
        {activeTab === "timeline" && (
          <TimelineTab timeline={timeline} />
        )}
        {activeTab === "discussion" && (
          <DiscussionTab
            bookingId={bookingId}
            workspace={workspace}
            snapshot={snapshot}
            permissions={current_permissions}
            currentUserRole={currentUserRole}
          />
        )}
        {activeTab === "documents" && (
          <DocumentsTab
            bookingId={bookingId}
            documents={documents}
            snapshot={snapshot}
            permissions={current_permissions}
            onRefresh={fetchWorkspace}
            currentUserRole={currentUserRole}
          />
        )}
        {activeTab === "checklist" && (
          <ChecklistTab snapshot={snapshot} workspace={workspace} />
        )}
        {activeTab === "delivery" && (
          <DeliveryTab
            bookingId={bookingId}
            workspace={workspace}
            snapshot={snapshot}
            documents={documents}
            permissions={current_permissions}
            onRefresh={fetchWorkspace}
            currentUserRole={currentUserRole}
          />
        )}
        {activeTab === "invoice" && (
          <InvoiceTab snapshot={snapshot} workspace={workspace} />
        )}
        {activeTab === "review" && (
          <ReviewTab bookingId={bookingId} workspace={workspace} snapshot={snapshot} />
        )}
      </div>
    </div>
  );
}