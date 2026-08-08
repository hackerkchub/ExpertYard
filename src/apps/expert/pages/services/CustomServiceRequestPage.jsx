import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import APP_CONFIG from "../../../../config/appConfig";

const authHeaders = () => {
  const token = localStorage.getItem("expert_token") || localStorage.getItem("token") || localStorage.getItem("expertToken") || "";
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

const API_BASE = APP_CONFIG.API_BASE_URL;

const apiFetch = async (path, options = {}) => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const primaryUrl = cleanPath.startsWith("/api") ? `${API_BASE.replace(/\/api\/?$/, "")}${cleanPath}` : `${API_BASE}${cleanPath}`;
  return await fetch(primaryUrl, options);
};

export default function CustomServiceRequestPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    title: "",
    category_id: "",
    subcategory_id: "",
    suggested_price: "",
    description: "",
    documents_needed: "",
    workflow_notes: ""
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [reqRes, catRes, subRes] = await Promise.all([
        apiFetch("/api/expert-activations/my-custom-requests", { headers: authHeaders() }),
        apiFetch("/api/category/list"),
        apiFetch("/api/subcategory")
      ]);

      const [reqData, catData, subData] = await Promise.all([
        reqRes.json(),
        catRes.json(),
        subRes.json()
      ]);

      if (reqData.success) setRequests(reqData.data || []);
      
      const catRows = catData?.data?.data || catData?.data || [];
      setCategories(Array.isArray(catRows) ? catRows : []);

      const subRows = subData?.data?.data || subData?.data || [];
      setSubcategories(Array.isArray(subRows) ? subRows : []);
    } catch (err) {
      console.error("Error loading custom service requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setErrorMsg("");
      setSuccessMsg("");

      const res = await apiFetch("/api/expert-activations/custom-request", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          title: form.title,
          category_id: Number(form.category_id),
          subcategory_id: form.subcategory_id ? Number(form.subcategory_id) : null,
          suggested_price: Number(form.suggested_price),
          description: form.description,
          documents_needed: form.documents_needed,
          workflow_notes: form.workflow_notes
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Custom service request submitted to Admin for review!");
        setForm({
          title: "",
          category_id: "",
          subcategory_id: "",
          suggested_price: "",
          description: "",
          documents_needed: "",
          workflow_notes: ""
        });
        await loadData();
      } else {
        setErrorMsg(data.message || "Failed to submit request.");
      }
    } catch (err) {
      setErrorMsg(err.message || "Error submitting custom service request.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredSubcategories = form.category_id
    ? subcategories.filter((sc) => Number(sc.category_id) === Number(form.category_id))
    : subcategories;

  return (
    <div style={{ padding: "1.5rem", maxWidth: "1100px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <header style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "1.25rem 1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#f0f2f5", padding: "10px 16px", borderRadius: "12px", border: "1px solid #e9edef", marginBottom: "0.5rem" }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
            }}
            title="Go Back"
          >
            <FiArrowLeft size={18} color="#111b21" />
          </button>
          <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, color: "#111b21" }}>Propose Custom Master Service</h2>
        </div>
        <p style={{ margin: "0.25rem 0 0", color: "#64748b", fontSize: "0.9rem" }}>
          Can't find a service in the platform catalog? Submit a proposal to Admin. Once approved, it converts to a Master Service for the marketplace.
        </p>
      </header>

      {successMsg && <div style={{ background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0", padding: "1rem", borderRadius: 8 }}>{successMsg}</div>}
      {errorMsg && <div style={{ background: "#fef2f2", color: "#b42318", border: "1px solid #fecaca", padding: "1rem", borderRadius: 8 }}>{errorMsg}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", alignItems: "start" }}>
        {/* NEW PROPOSAL FORM */}
        <form onSubmit={handleSubmit} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "1.5rem", display: "grid", gap: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <h3 style={{ margin: 0, color: "#0f172a" }}>Submit Service Request</h3>

          <label style={labelStyle}>
            Proposed Service Title *
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              placeholder="e.g. FSSAI Food Safety Audit License"
              style={inputStyle}
            />
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <label style={labelStyle}>
              Category *
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value, subcategory_id: "" })}
                required
                style={inputStyle}
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </label>

            <label style={labelStyle}>
              Subcategory
              <select
                value={form.subcategory_id}
                onChange={(e) => setForm({ ...form, subcategory_id: e.target.value })}
                style={inputStyle}
              >
                <option value="">Select Subcategory</option>
                {filteredSubcategories.map((sc) => (
                  <option key={sc.id} value={sc.id}>{sc.name}</option>
                ))}
              </select>
            </label>
          </div>

          <label style={labelStyle}>
            Suggested Base Price (₹) *
            <input
              type="number"
              value={form.suggested_price}
              onChange={(e) => setForm({ ...form, suggested_price: e.target.value })}
              required
              placeholder="1499"
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            Service Scope & Description *
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              required
              placeholder="Describe deliverables, eligibility, and process..."
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            Suggested Documents Required
            <textarea
              value={form.documents_needed}
              onChange={(e) => setForm({ ...form, documents_needed: e.target.value })}
              rows={2}
              placeholder="e.g. PAN Card, GST Certificate, Premises Photo"
              style={inputStyle}
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            style={{ padding: "0.75rem", background: "#2563eb", color: "#fff", border: 0, borderRadius: 8, fontWeight: 800, cursor: "pointer", fontSize: 14 }}
          >
            {submitting ? "Submitting..." : "Submit Proposal to Admin"}
          </button>
        </form>

        {/* MY REQUESTS STATUS TABLE */}
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "1.5rem", display: "grid", gap: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <h3 style={{ margin: 0, color: "#0f172a" }}>My Service Proposals</h3>

          {loading ? (
            <p style={{ color: "#64748b" }}>Loading proposals...</p>
          ) : requests.length === 0 ? (
            <p style={{ color: "#64748b", margin: 0, fontSize: 13 }}>No custom service proposals submitted yet.</p>
          ) : (
            <div style={{ display: "grid", gap: "0.85rem" }}>
              {requests.map((req) => (
                <div key={req.id} style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: "1rem", background: "#f8fafc", display: "grid", gap: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong style={{ color: "#0f172a" }}>{req.title}</strong>
                    <span style={{
                      padding: "2px 8px",
                      borderRadius: 12,
                      fontSize: 11,
                      fontWeight: 800,
                      background: req.status === "approved" ? "#dcfce7" : req.status === "rejected" ? "#fef2f2" : "#fefce8",
                      color: req.status === "approved" ? "#15803d" : req.status === "rejected" ? "#b42318" : "#a16207"
                    }}>
                      {(req.status || "PENDING").toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>Category: {req.category_name || "General"} • Suggested: ₹{req.suggested_price || 0}</div>
                  {req.admin_notes && (
                    <div style={{ fontSize: 12, color: "#475569", background: "#fff", padding: "6px 8px", borderRadius: 6, border: "1px solid #cbd5e1", marginTop: 4 }}>
                      <strong>Admin Feedback:</strong> {req.admin_notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const labelStyle = { display: "grid", gap: 4, fontWeight: 700, color: "#334155", fontSize: 13 };
const inputStyle = { width: "100%", padding: "0.6rem 0.75rem", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, background: "#fff" };
