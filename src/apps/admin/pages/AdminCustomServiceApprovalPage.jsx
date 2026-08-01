import React, { useState, useEffect } from "react";

export default function AdminCustomServiceApprovalPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/master-services/custom-requests", {
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_token") || localStorage.getItem("token") || ""}` },
      });
      const data = await res.json();
      if (data.success) {
        setRequests(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching custom requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomRequests();
  }, []);

  const handleAction = async (id, status) => {
    try {
      const res = await fetch(`/api/master-services/custom-requests/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token") || localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Custom service request #${id} marked as ${status}`);
        fetchCustomRequests();
      } else {
        alert(data.message || "Failed to update request.");
      }
    } catch (err) {
      alert("Error processing custom service request.");
    }
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ margin: 0, color: "#0f172a" }}>Custom Service Approval Queue</h2>
          <p style={{ margin: "0.25rem 0 0 0", color: "#64748b" }}>Review custom service proposals submitted by experts before publishing them to the public platform.</p>
        </div>
        <button onClick={fetchCustomRequests} style={{ padding: "0.5rem 1rem", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}>
          ↻ Refresh
        </button>
      </div>

      {loading ? (
        <p>Loading pending custom service requests...</p>
      ) : requests.length === 0 ? (
        <p style={{ color: "#64748b" }}>No custom service requests pending approval.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {requests.map((req) => (
            <div key={req.id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.25rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", display: "grid", gridTemplateColumns: "1fr auto", gap: "1rem", alignItems: "center" }}>
              <div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <span style={{ fontSize: "0.75rem", background: "#fef3c7", color: "#b45309", padding: "0.15rem 0.5rem", borderRadius: "4px", fontWeight: "700" }}>
                    Pending Approval
                  </span>
                  <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Submitted by {req.expert_name} ({req.category_name})</span>
                </div>
                <h3 style={{ margin: "0.5rem 0 0.25rem 0", color: "#0f172a" }}>{req.title}</h3>
                <p style={{ margin: 0, color: "#475569", fontSize: "0.9rem" }}>{req.description}</p>
                <div style={{ marginTop: "0.75rem", fontWeight: "800", color: "#059669" }}>
                  Proposed Price: ₹{Number(req.proposed_price || 0).toLocaleString("en-IN")}
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  onClick={() => handleAction(req.id, "REJECTED")}
                  style={{ padding: "0.6rem 1.25rem", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}
                >
                  Reject
                </button>
                <button
                  onClick={() => handleAction(req.id, "APPROVED")}
                  style={{ padding: "0.6rem 1.25rem", background: "#059669", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}
                >
                  Approve & Publish
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
