import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

export default function AdminPricingRulesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [masterServices, setMasterServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(id || "");
  const [pricingData, setPricingData] = useState({
    base_price: 999,
    gst_percent: 18,
    commission_percent: 10,
    delivery_time_days: 1,
    min_price_floor: 499,
    max_discount_percent: 30,
    surge_multiplier: 1.0,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiFetch("/api/master-services", { headers: authHeaders() })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMasterServices(data.data || []);
          if (!selectedServiceId && data.data?.length > 0) {
            setSelectedServiceId(data.data[0].id);
          }
        }
      })
      .catch((err) => console.error("Error loading services:", err));
  }, []);

  useEffect(() => {
    if (id) setSelectedServiceId(id);
  }, [id]);

  useEffect(() => {
    if (!selectedServiceId) return;
    setLoading(true);
    apiFetch(`/api/master-services/${selectedServiceId}`, { headers: authHeaders() })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const svc = data.data;
          setPricingData({
            base_price: svc.base_price || 999,
            gst_percent: svc.gst_percent || 18,
            commission_percent: svc.commission_percent || 10,
            delivery_time_days: svc.delivery_time_days || 1,
            min_price_floor: Math.round((svc.base_price || 999) * 0.5),
            max_discount_percent: 30,
            surge_multiplier: 1.0,
          });
        }
      })
      .catch((err) => console.error("Error loading service pricing:", err))
      .finally(() => setLoading(false));
  }, [selectedServiceId]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedServiceId) return alert("Select a service first.");

    try {
      setSaving(true);
      const res = await apiFetch(`/api/master-services/${selectedServiceId}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({
          base_price: Number(pricingData.base_price),
          gst_percent: Number(pricingData.gst_percent),
          commission_percent: Number(pricingData.commission_percent),
          delivery_time_days: Number(pricingData.delivery_time_days),
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Pricing rules updated successfully!");
        navigate("/admin/master-services");
      } else {
        alert(data.message || "Failed to update pricing rules.");
      }
    } catch (err) {
      alert("Error updating pricing rules.");
    } finally {
      setSaving(false);
    }
  };

  const gstAmount = (Number(pricingData.base_price) * Number(pricingData.gst_percent)) / 100;
  const platformEarnings = (Number(pricingData.base_price) * Number(pricingData.commission_percent)) / 100;
  const expertNetPayout = Number(pricingData.base_price) - platformEarnings;
  const customerTotal = Number(pricingData.base_price) + gstAmount;

  return (
    <div style={{ padding: "1.5rem", background: "#f8fafc", minHeight: "90vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ margin: 0, color: "#0f172a" }}>Service Pricing & Revenue Rules</h2>
          <p style={{ margin: "0.25rem 0 0 0", color: "#64748b" }}>Configure base pricing floors, platform commissions, GST taxes, and payouts.</p>
        </div>
        <select
          value={selectedServiceId}
          onChange={(e) => setSelectedServiceId(e.target.value)}
          style={{ padding: "0.6rem 1rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontWeight: "600" }}
        >
          <option value="">Select Service...</option>
          {masterServices.map((svc) => (
            <option key={svc.id} value={svc.id}>
              {svc.title} (#{svc.id})
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading pricing details...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "1.5rem" }}>
          {/* Pricing Form */}
          <form onSubmit={handleSave} style={{ background: "#fff", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", display: "grid", gap: "1.25rem" }}>
            <h3 style={{ margin: 0 }}>Configure Price Rules</h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontWeight: "700", marginBottom: "0.25rem" }}>Base Price (₹)</label>
                <input
                  type="number"
                  value={pricingData.base_price}
                  onChange={(e) => setPricingData({ ...pricingData, base_price: e.target.value })}
                  style={{ width: "100%", padding: "0.6rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontWeight: "700", marginBottom: "0.25rem" }}>GST Tax (%)</label>
                <input
                  type="number"
                  value={pricingData.gst_percent}
                  onChange={(e) => setPricingData({ ...pricingData, gst_percent: e.target.value })}
                  style={{ width: "100%", padding: "0.6rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  required
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontWeight: "700", marginBottom: "0.25rem" }}>Platform Commission (%)</label>
                <input
                  type="number"
                  value={pricingData.commission_percent}
                  onChange={(e) => setPricingData({ ...pricingData, commission_percent: e.target.value })}
                  style={{ width: "100%", padding: "0.6rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontWeight: "700", marginBottom: "0.25rem" }}>Delivery SLA (Days)</label>
                <input
                  type="number"
                  value={pricingData.delivery_time_days}
                  onChange={(e) => setPricingData({ ...pricingData, delivery_time_days: e.target.value })}
                  style={{ width: "100%", padding: "0.6rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  required
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
              <button type="submit" disabled={saving} style={{ padding: "0.75rem 1.5rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "800", cursor: "pointer" }}>
                {saving ? "Saving..." : "Save Pricing Rules"}
              </button>
            </div>
          </form>

          {/* Realtime Financial Simulator */}
          <div style={{ background: "#fff", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h3 style={{ margin: "0 0 1rem 0", color: "#1e293b" }}>Revenue Simulator</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <SimRow label="Base Price" value={`₹${Number(pricingData.base_price).toLocaleString("en-IN")}`} />
              <SimRow label={`GST Tax (${pricingData.gst_percent}%)`} value={`+ ₹${gstAmount.toLocaleString("en-IN")}`} color="#166534" />
              <SimRow label="Total Customer Pay" value={`₹${customerTotal.toLocaleString("en-IN")}`} strong />
              <hr style={{ border: 0, borderTop: "1px dashed #e2e8f0" }} />
              <SimRow label={`Platform Fee (${pricingData.commission_percent}%)`} value={`₹${platformEarnings.toLocaleString("en-IN")}`} color="#2563eb" />
              <SimRow label="Expert Net Payout" value={`₹${expertNetPayout.toLocaleString("en-IN")}`} color="#15803d" strong />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SimRow({ label, value, color, strong }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: strong ? "1.05rem" : "0.9rem", fontWeight: strong ? "800" : "500", color: color || "#334155" }}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
