import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminServiceTemplatesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadTemplates = () => {
    setLoading(true);
    fetch("/api/master-services", {
      headers: { Authorization: `Bearer ${localStorage.getItem("admin_token") || localStorage.getItem("token") || ""}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setServices(data.data || []);
        }
      })
      .catch((err) => console.error("Error fetching templates:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleClone = async (id) => {
    try {
      const res = await fetch(`/api/master-services/${id}/clone`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_token") || localStorage.getItem("token") || ""}` }
      });
      const data = await res.json();
      if (data.success) {
        alert("Template cloned successfully!");
        loadTemplates();
      } else {
        alert(data.message || "Failed to clone template.");
      }
    } catch {
      alert("Error cloning template.");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/master-services/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token") || localStorage.getItem("token") || ""}`
        },
        body: JSON.stringify({ is_active: currentStatus ? 0 : 1 })
      });
      const data = await res.json();
      if (data.success) {
        loadTemplates();
      }
    } catch {
      alert("Error toggling template status.");
    }
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ margin: 0, color: "#0f172a" }}>Service Templates Catalog</h2>
          <p style={{ margin: "0.25rem 0 0 0", color: "#64748b" }}>Manage pre-configured Service Operating System templates available for expert activation.</p>
        </div>
        <button
          onClick={() => navigate("/admin/master-services")}
          style={{ padding: "0.65rem 1.25rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}
        >
          + Create Template
        </button>
      </div>

      {loading ? (
        <p>Loading service templates...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {services.map((svc) => (
            <div key={svc.id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.25rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.75rem", background: "#eff6ff", color: "#1d4ed8", padding: "0.2rem 0.5rem", borderRadius: "4px", fontWeight: "700" }}>
                    {svc.category_name} / {svc.subcategory_name || "General"}
                  </span>
                  <span style={{ fontSize: "0.75rem", background: svc.is_active ? "#dcfce7" : "#f1f5f9", color: svc.is_active ? "#15803d" : "#64748b", padding: "0.2rem 0.5rem", borderRadius: "4px", fontWeight: "700" }}>
                    {svc.is_active ? "Published" : "Draft"}
                  </span>
                </div>
                <h3 style={{ margin: "0.75rem 0 0.5rem 0", color: "#0f172a" }}>{svc.title}</h3>
                <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0, lineHeight: 1.5 }}>
                  {svc.short_description || "Pre-configured service template."}
                </p>
                <div style={{ marginTop: "1rem", fontSize: "0.95rem", fontWeight: "800", color: "#166534" }}>
                  Base Price: ₹{Number(svc.base_price || 0).toLocaleString("en-IN")}
                </div>
              </div>

              <div style={{ marginTop: "1.25rem", paddingTop: "0.75rem", borderTop: "1px solid #f1f5f9", display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                <Link to={`/admin/form-builder/${svc.id}`} style={{ padding: "0.4rem 0.65rem", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.8rem", fontWeight: "700", textDecoration: "none", color: "#334155" }}>
                  Form
                </Link>
                <Link to={`/admin/document-builder/${svc.id}`} style={{ padding: "0.4rem 0.65rem", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.8rem", fontWeight: "700", textDecoration: "none", color: "#334155" }}>
                  Docs
                </Link>
                <Link to={`/admin/workflow-builder/${svc.id}`} style={{ padding: "0.4rem 0.65rem", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.8rem", fontWeight: "700", textDecoration: "none", color: "#334155" }}>
                  Workflow
                </Link>
                <button
                  type="button"
                  onClick={() => handleClone(svc.id)}
                  style={{ padding: "0.4rem 0.65rem", background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1d4ed8", borderRadius: "6px", fontSize: "0.8rem", fontWeight: "700", cursor: "pointer" }}
                >
                  Clone
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleStatus(svc.id, svc.is_active)}
                  style={{ padding: "0.4rem 0.65rem", background: svc.is_active ? "#fff1f2" : "#f0fdf4", border: "1px solid #fecdd3", color: svc.is_active ? "#be123c" : "#15803d", borderRadius: "6px", fontSize: "0.8rem", fontWeight: "700", cursor: "pointer", marginLeft: "auto" }}
                >
                  {svc.is_active ? "Unpublish" : "Publish"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
