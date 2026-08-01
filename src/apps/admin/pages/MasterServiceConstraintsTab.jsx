import React, { useState, useEffect } from "react";
import APP_CONFIG from "../../../config/appConfig";

const authHeaders = () => {
  const token = localStorage.getItem("admin_token") || localStorage.getItem("token") || localStorage.getItem("adminToken") || "";
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

const API_BASE = APP_CONFIG?.API_BASE_URL || "/api";
const FALLBACK_API_BASE = "http://localhost:5000/api";

const apiFetch = async (path, options = {}) => {
  const cleanPath = path.replace(/^\/api/, "");
  const primaryUrl = `${API_BASE}${cleanPath}`;
  try {
    const res = await fetch(primaryUrl, options);
    if (res.status === 404 && API_BASE !== FALLBACK_API_BASE) {
      return await fetch(`${FALLBACK_API_BASE}${cleanPath}`, options);
    }
    return res;
  } catch {
    return await fetch(`${FALLBACK_API_BASE}${cleanPath}`, options);
  }
};

export default function MasterServiceConstraintsTab({ masterService, onSaveSuccess }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [constraints, setConstraints] = useState({
    allow_price_override: true,
    min_price: "",
    max_price: "",
    allow_sla_override: true,
    min_delivery_days: 1,
    allow_custom_bio: true,
    allow_portfolio_upload: true,
  });

  useEffect(() => {
    if (masterService) {
      setConstraints({
        allow_price_override: Boolean(masterService.allow_price_override ?? true),
        min_price: masterService.min_price !== null && masterService.min_price !== undefined ? masterService.min_price : "",
        max_price: masterService.max_price !== null && masterService.max_price !== undefined ? masterService.max_price : "",
        allow_sla_override: Boolean(masterService.allow_sla_override ?? true),
        min_delivery_days: masterService.min_delivery_days || 1,
        allow_custom_bio: Boolean(masterService.allow_custom_bio ?? true),
        allow_portfolio_upload: Boolean(masterService.allow_portfolio_upload ?? true),
      });
    }
  }, [masterService]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!masterService?.id) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        allow_price_override: constraints.allow_price_override ? 1 : 0,
        min_price: constraints.min_price !== "" ? Number(constraints.min_price) : null,
        max_price: constraints.max_price !== "" ? Number(constraints.max_price) : null,
        allow_sla_override: constraints.allow_sla_override ? 1 : 0,
        min_delivery_days: Number(constraints.min_delivery_days || 1),
        allow_custom_bio: constraints.allow_custom_bio ? 1 : 0,
        allow_portfolio_upload: constraints.allow_portfolio_upload ? 1 : 0,
      };

      const res = await apiFetch(`/api/admin/master-services/${masterService.id}/constraints`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess("Expert Customization Constraints saved successfully!");
        if (onSaveSuccess) onSaveSuccess(data.data);
      } else {
        setError(data.message || "Failed to save constraints.");
      }
    } catch (err) {
      setError(err.message || "Error saving constraints.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
      <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: "1rem", marginBottom: "1.25rem" }}>
        <h3 style={{ margin: 0, color: "#0f172a", fontSize: "1.25rem" }}>Expert Customization Constraints</h3>
        <p style={{ margin: "0.25rem 0 0", color: "#64748b", fontSize: "0.88rem" }}>
          Configure per-service rules to restrict or allow experts from overriding base prices, delivery SLAs, and bio notes.
        </p>
      </div>

      {error && (
        <div style={{ background: "#fef2f2", color: "#b42318", border: "1px solid #fecaca", padding: "0.85rem 1rem", borderRadius: 8, marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0", padding: "0.85rem 1rem", borderRadius: 8, marginBottom: "1rem" }}>
          {success}
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: "grid", gap: "1.5rem" }}>
        {/* PRICE OVERRIDE RULES */}
        <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: 10, padding: "1.25rem", display: "grid", gap: "1rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700, color: "#0f172a", fontSize: 14, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={constraints.allow_price_override}
              onChange={(e) => setConstraints({ ...constraints, allow_price_override: e.target.checked })}
              style={{ width: 18, height: 18 }}
            />
            Allow Experts to Edit Custom Price / Offer Price
          </label>
          <span style={{ fontSize: 12, color: "#64748b", marginLeft: 28 }}>
            If unchecked, experts must list this service strictly at the platform base price (₹{masterService?.base_price || 0}).
          </span>

          {constraints.allow_price_override && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginTop: 4 }}>
              <label style={labelStyle}>
                Minimum Allowed Price (₹)
                <input
                  type="number"
                  placeholder="e.g. 500 (Leave empty for no floor)"
                  value={constraints.min_price}
                  onChange={(e) => setConstraints({ ...constraints, min_price: e.target.value })}
                  style={inputStyle}
                />
              </label>
              <label style={labelStyle}>
                Maximum Allowed Price (₹)
                <input
                  type="number"
                  placeholder="e.g. 10000 (Leave empty for no ceiling)"
                  value={constraints.max_price}
                  onChange={(e) => setConstraints({ ...constraints, max_price: e.target.value })}
                  style={inputStyle}
                />
              </label>
            </div>
          )}
        </div>

        {/* SLA DELIVERY OVERRIDE RULES */}
        <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: 10, padding: "1.25rem", display: "grid", gap: "1rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700, color: "#0f172a", fontSize: 14, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={constraints.allow_sla_override}
              onChange={(e) => setConstraints({ ...constraints, allow_sla_override: e.target.checked })}
              style={{ width: 18, height: 18 }}
            />
            Allow Experts to Customize Delivery SLA Days
          </label>
          <span style={{ fontSize: 12, color: "#64748b", marginLeft: 28 }}>
            If unchecked, the platform standard SLA of {masterService?.delivery_time_days || 1} Days will be enforced.
          </span>

          {constraints.allow_sla_override && (
            <div style={{ maxWidth: 300 }}>
              <label style={labelStyle}>
                Minimum Required Turnaround (Days)
                <input
                  type="number"
                  value={constraints.min_delivery_days}
                  onChange={(e) => setConstraints({ ...constraints, min_delivery_days: e.target.value })}
                  style={inputStyle}
                />
              </label>
            </div>
          )}
        </div>

        {/* OTHER PERMISSIONS */}
        <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: 10, padding: "1.25rem", display: "grid", gap: "0.85rem" }}>
          <h4 style={{ margin: 0, color: "#0f172a", fontSize: 14 }}>Expert Content Permissions</h4>
          
          <label style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 600, color: "#334155", fontSize: 13, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={constraints.allow_custom_bio}
              onChange={(e) => setConstraints({ ...constraints, allow_custom_bio: e.target.checked })}
            />
            Allow Experts to add Custom Service Pitch / Bio
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 600, color: "#334155", fontSize: 13, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={constraints.allow_portfolio_upload}
              onChange={(e) => setConstraints({ ...constraints, allow_portfolio_upload: e.target.checked })}
            />
            Allow Experts to attach Portfolio Samples & Gallery Images
          </label>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#2563eb",
              color: "#fff",
              border: 0,
              borderRadius: 8,
              fontWeight: 800,
              fontSize: 14,
              cursor: "pointer"
            }}
          >
            {saving ? "Saving Constraints..." : "Save Customization Constraints"}
          </button>
        </div>
      </form>
    </div>
  );
}

const labelStyle = { display: "grid", gap: 6, fontWeight: 700, color: "#334155", fontSize: 13 };
const inputStyle = { width: "100%", padding: "0.6rem 0.75rem", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, background: "#fff" };
