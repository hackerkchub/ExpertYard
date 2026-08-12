import React, { useState } from "react";
import { FiCheckCircle, FiClipboard, FiFileText, FiUser, FiPhone, FiInfo } from "react-icons/fi";
import { confirmWorkspaceForm } from "../../../api/workspace.api";

export default function OverviewTab({ workspace, snapshot, role }) {
  const meta = snapshot?.service_meta || {};
  const fin = snapshot?.financial || {};
  const exp = snapshot?.expert || {};
  const formSchema = snapshot?.form_schema_snapshot || snapshot?.form_schema || [];
  const formResponses = snapshot?.form_responses_snapshot || snapshot?.form_responses || {};

  const [confirming, setConfirming] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(workspace?.form_details_status === "CONFIRMED");
  const [message, setMessage] = useState("");

  const handleConfirmForm = async () => {
    try {
      setConfirming(true);
      const bookingId = workspace?.booking_id || workspace?.id;
      
      const response = await confirmWorkspaceForm(bookingId);
      
      if (response.data.success) {
        setIsConfirmed(true);
        setMessage("Client form responses and requirement details confirmed successfully!");
      } else {
        setMessage(response.data.message || "Failed to confirm form details.");
      }
    } catch {
      setMessage("Error confirming form details.");
    } finally {
      setConfirming(false);
    }
  };

  // Build key-label map from schema or response object
  const responseEntries = Object.entries(formResponses).map(([key, val]) => {
    const matchedField = Array.isArray(formSchema)
      ? formSchema.find((f) => (f.field_key || f.key || f.id) === key)
      : null;
    const label = matchedField
      ? matchedField.field_label || matchedField.label
      : key.replace(/_/g, " ").toUpperCase();
    return { key, label, value: typeof val === "boolean" ? (val ? "Yes / Confirmed" : "No") : String(val) };
  });

  return (
    <div className="tab-overview" style={{ display: "grid", gap: "1.25rem" }}>
      <h3 className="tab-panel-title">Service Workspace Overview</h3>

      <div className="overview-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {/* Service Details Card */}
        <div className="card-box" style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>Service Details</h4>
          <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#475569' }}><strong>Service Name:</strong> {meta.title}</p>
        </div>

        {/* Financial Breakdown Card */}
        <div className="card-box" style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>Payment Breakdown</h4>
          <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#475569' }}><strong>Base Amount:</strong> ₹{fin.effective_base_amount || fin.base_amount || 0}</p>
          <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#475569' }}><strong>GST (18%):</strong> ₹{fin.gst_amount || 0}</p>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.1rem', fontWeight: '800', color: '#166534' }}>
            Total Paid: ₹{fin.total_amount || 0}
          </p>
        </div>

        {/* Expert Info Card */}
        <div className="card-box" style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>Assigned Expert</h4>
          <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#475569' }}><strong>Name:</strong> {exp.expert_name || "Assigned Expert"}</p>
          <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#475569' }}><strong>Rating:</strong> ⭐ {exp.expert_rating || 5.0} / 5</p>
          <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#475569' }}><strong>Delivery Guarantee:</strong> {exp.delivery_time_days || 1} Day(s)</p>
        </div>
      </div>

      {/* CLIENT FORM SUBMISSION & REQUIREMENTS CARD */}
      <div style={{ background: "#ffffff", padding: "1.25rem", borderRadius: "10px", border: "1px solid #cbd5e1", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", display: "grid", gap: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.75rem", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FiFileText color="#2563eb" size={20} />
            <div>
              <h4 style={{ margin: 0, color: "#0f172a", fontSize: "1.05rem" }}>Client Service Form & Requirement Answers</h4>
              <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Submitted parameters and specific instructions by client</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {isConfirmed ? (
              <span style={{ background: "#dcfce7", color: "#166534", padding: "4px 10px", borderRadius: 6, fontWeight: 700, fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                <FiCheckCircle /> ✓ Form Details Verified & Confirmed
              </span>
            ) : (
              <span style={{ background: "#fef3c7", color: "#92400e", padding: "4px 10px", borderRadius: 6, fontWeight: 700, fontSize: 12 }}>
                📥 Form Responses Received (Pending Expert Review)
              </span>
            )}
          </div>
        </div>

        {message && (
          <div style={{ background: "#eff6ff", color: "#1e40af", padding: "0.6rem 0.85rem", borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
            {message}
          </div>
        )}

        {responseEntries.length === 0 ? (
          <div style={{ color: "#64748b", fontSize: "0.9rem", padding: "0.5rem 0" }}>
            No custom form parameters submitted for this service order.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.85rem" }}>
            {responseEntries.map((item) => (
              <div key={item.key} style={{ background: "#f8fafc", padding: "0.75rem 1rem", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 3 }}>
                  {item.label}
                </div>
                <div style={{ fontSize: "0.95rem", color: "#0f172a", fontWeight: 700, wordBreak: "break-word" }}>
                  {item.value || "N/A"}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Expert & Admin Approval Button */}
        {(role === "expert" || role === "admin") && !isConfirmed && (
          <div style={{ borderTop: "1px dashed #cbd5e1", paddingTop: "0.75rem", display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={handleConfirmForm}
              disabled={confirming}
              style={{
                padding: "0.55rem 1.25rem",
                background: "#059669",
                color: "#ffffff",
                border: 0,
                borderRadius: 6,
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
            >
              <FiCheckCircle /> {confirming ? "Confirming..." : "✓ Confirm & Approve Client Form Details"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}