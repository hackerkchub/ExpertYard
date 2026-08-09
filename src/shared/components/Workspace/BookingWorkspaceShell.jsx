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

const getEndpointUrl = (path) => {
  const envUrl = import.meta.env?.VITE_API_BASE_URL;
  const configUrl = APP_CONFIG?.API_BASE_URL;
  const base = envUrl || configUrl || "/api";
  const cleanBase = base.replace(/\/api\/?$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}/api${normalizedPath}`;
};

export const getAuthToken = (role = "user") => {
  if (role === "admin") {
    return (
      localStorage.getItem("admin_token") ||
      localStorage.getItem("adminToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("user_token") ||
      localStorage.getItem("expert_token") ||
      ""
    );
  }
  if (role === "expert") {
    return (
      localStorage.getItem("expert_token") ||
      localStorage.getItem("expertToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("user_token") ||
      ""
    );
  }
  return (
    localStorage.getItem("user_token") ||
    localStorage.getItem("userToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("expert_token") ||
    ""
  );
};

export default function BookingWorkspaceShell({ bookingId, currentUserRole = "user" }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [workspaceData, setWorkspaceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWorkspace = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const numBookingId = Number(bookingId);
      if (!bookingId || isNaN(numBookingId) || numBookingId <= 0) {
        setWorkspaceData(null);
        setError(`Invalid Booking ID: #${bookingId}`);
        setLoading(false);
        return;
      }

      const url = getEndpointUrl(`/workspace/${numBookingId}`);
      const token = getAuthToken(currentUserRole);
      
      console.log("🔍 [DIAGNOSTIC] ===== FETCH STARTED =====");
      console.log("🔍 [STEP 1] Full Request URL:", url);
      console.log("🔍 [STEP 2] Booking ID:", bookingId);
      console.log("🔍 [STEP 3] Token exists?", token ? "✅ Yes (length: " + token.length + ")" : "❌ No");
      
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      console.log("🔍 [STEP 4] HTTP Status Code:", res.status, res.statusText);
      
      if (!res.ok) {
        let errMessage = `HTTP ${res.status}: ${res.statusText}`;
        try {
          const errData = await res.json();
          if (errData && errData.message) {
            errMessage = errData.message;
          }
        } catch (_) {}
        throw new Error(errMessage);
      }

      const contentType = res.headers.get("content-type");
      console.log("🔍 [STEP 5] Content-Type Header:", contentType);

      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("❌ [DIAGNOSTIC] Non-JSON Response (Likely HTML/Proxy Error):", text.substring(0, 300));
        throw new Error(`Server returned ${contentType || 'non-JSON'} instead of JSON.`);
      }

      const data = await res.json();
      console.log("🔍 [STEP 6] Parsed Response Data:", data);

      if (data.success && data.data) {
        const fetchedWorkspace = data.data.workspace;
        const returnedBookingId = fetchedWorkspace?.booking_id || fetchedWorkspace?.id;

        // Client-side data integrity validation
        if (returnedBookingId && String(returnedBookingId) !== String(numBookingId)) {
          console.error(`❌ [DATA MISMATCH] Requested bookingId #${numBookingId} but received workspace data for bookingId #${returnedBookingId}`);
          setWorkspaceData(null);
          setError(`Workspace Unavailable: Data mismatch for Booking #${numBookingId}.`);
          return;
        }

        console.log("✅ [DIAGNOSTIC] Success! Data received and validated.");
        setWorkspaceData(data.data);
        setError(null);
      } else {
        console.error("❌ [DIAGNOSTIC] Backend returned success: false, Message:", data.message);
        setWorkspaceData(null);
        setError(data.message || "Failed to load workspace.");
      }

    } catch (err) {
      console.error("🚨 [FATAL ERROR] Exception Caught:", err);
      
      let userFriendlyMessage = err.message || "Network error loading workspace.";
      if (err.message?.includes("Failed to fetch")) {
        userFriendlyMessage = "❌ Network Error: Server unreachable or CORS blocked.";
      }
      
      setWorkspaceData(null);
      setError(userFriendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleStepOverride = async (targetStepKey) => {
    try {
      const token = getAuthToken();
      const url = getEndpointUrl(`/workspace/${bookingId}/transition`);
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ target_step_key: targetStepKey }),
      });
      const data = await res.json();
      if (data.success) {
        fetchWorkspace();
      } else {
        alert(data.message || "Failed to override step.");
      }
    } catch {
      alert("Error overriding step.");
    }
  };

  useEffect(() => {
    if (bookingId) {
      fetchWorkspace();
    } else {
      // अगर bookingId नहीं है तो कंसोल में वार्निंग दें
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

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "timeline", label: `Timeline (${timeline?.length || 0})` },
    { id: "discussion", label: "Discussion (Free)" },
    { id: "documents", label: `Documents (${documents?.length || 0})` },
    { id: "checklist", label: "Checklist" },
    { id: "delivery", label: "Delivery" },
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