import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
const getServiceImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  const base = API_BASE ? API_BASE.replace(/\/api\/?$/, "") : "http://localhost:5000";
  return `${base}${cleanPath}`;
};

export default function AdminAllMasterServicesPage() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");

  const loadServices = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await apiFetch("/api/master-services", { headers: authHeaders() });
      const data = await res.json();
      if (data.success) {
        setServices(data.data || []);
      } else {
        setError(data.message || "Failed to load master services.");
      }
    } catch (err) {
      setError(err.message || "Error loading master services.");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await apiFetch("/api/category/list?admin=true");
      const data = await res.json();
      const rows = data?.data?.data || data?.data || [];
      setCategories(Array.isArray(rows) ? rows : []);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  useEffect(() => {
    loadServices();
    loadCategories();
  }, []);

  const deleteService = async (service) => {
    if (!window.confirm(`Are you sure you want to delete "${service.title}"?`)) return;
    try {
      const res = await apiFetch(`/api/master-services/${service.id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Master service "${service.title}" deleted.`);
        await loadServices();
      } else {
        alert(data.message || "Unable to delete service.");
      }
    } catch (err) {
      alert(err.message || "Failed to delete service.");
    }
  };

  const filteredServices = useMemo(() => {
    return services.filter((svc) => {
      // Search filter
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = svc.title?.toLowerCase().includes(q);
        const matchesSlug = svc.slug?.toLowerCase().includes(q);
        const matchesCat = (svc.categories || []).some((c) => c.name?.toLowerCase().includes(q));
        const matchesSubcat = (svc.subcategories || []).some((sc) => sc.name?.toLowerCase().includes(q));

        if (!matchesTitle && !matchesSlug && !matchesCat && !matchesSubcat) {
          return false;
        }
      }

      // Category filter
      if (selectedCategoryFilter !== "") {
        const catId = Number(selectedCategoryFilter);
        const hasCategory = (svc.category_ids || []).map(Number).includes(catId) || Number(svc.category_id) === catId;
        if (!hasCategory) return false;
      }

      // Status filter
      if (selectedStatusFilter === "published" && !svc.is_active) return false;
      if (selectedStatusFilter === "draft" && svc.is_active) return false;

      return true;
    });
  }, [services, searchQuery, selectedCategoryFilter, selectedStatusFilter]);

  return (
    <div style={{ padding: "1.5rem", display: "grid", gap: "1.5rem", maxWidth: "1300px", margin: "0 auto" }}>
      {/* HEADER */}
      <header style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "1.25rem 1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ margin: 0, color: "#0f172a", fontSize: "1.6rem" }}>All Master Services Catalogue</h2>
            <p style={{ margin: "0.25rem 0 0", color: "#64748b", fontSize: "0.9rem" }}>
              Enterprise catalogue of all published and draft master service templates ({services.length} Total).
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link
              to="/admin/master-services"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "#2563eb",
                color: "#fff",
                padding: "0.6rem 1.25rem",
                borderRadius: 8,
                fontWeight: 800,
                fontSize: 14,
                textDecoration: "none"
              }}
            >
              + Create New Service
            </Link>
          </div>
        </div>
      </header>

      {error && (
        <div style={{ background: "#fef2f2", color: "#b42318", border: "1px solid #fecaca", padding: "0.85rem 1rem", borderRadius: 8 }}>
          {error}
        </div>
      )}

      {/* FILTER BAR */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "1rem 1.25rem", display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <input
          type="text"
          placeholder="Search by service title, slug, category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, minWidth: 260, padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14 }}
        />

        <select
          value={selectedCategoryFilter}
          onChange={(e) => setSelectedCategoryFilter(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, background: "#fff" }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <select
          value={selectedStatusFilter}
          onChange={(e) => setSelectedStatusFilter(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, background: "#fff" }}
        >
          <option value="all">All Statuses</option>
          <option value="published">Published Only</option>
          <option value="draft">Drafts Only</option>
        </select>

        <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>
          Showing <strong>{filteredServices.length}</strong> of {services.length} services
        </span>
      </div>

      {/* CATALOGUE TABLE */}
      <section style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        {loading ? (
          <p style={{ padding: "2rem", color: "#64748b" }}>Loading master services catalogue...</p>
        ) : filteredServices.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center" }}>
            <p style={{ color: "#64748b", margin: 0, fontSize: "1.1rem" }}>No master services match your filter criteria.</p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedCategoryFilter(""); setSelectedStatusFilter("all"); }}
              style={{ marginTop: "1rem", padding: "6px 14px", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: 6, cursor: "pointer", fontWeight: 700 }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1100 }}>
              <thead>
                <tr style={{ background: "#f8fafc", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>
                  <Th>Master Service</Th>
                  <Th>Categories & Subcategories</Th>
                  <Th>Base Price</Th>
                  <Th>Assignment Mode</Th>
                  <Th>Assigned Experts</Th>
                  <Th>Status</Th>
                  <Th>Control Consoles</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service) => (
                  <tr key={service.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <Td>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {service.image_url || service.thumbnail_url || service.icon_url ? (
                          <img
                            src={getServiceImageUrl(service.image_url || service.thumbnail_url || service.icon_url)}
                            alt={service.title}
                            style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover", border: "1px solid #cbd5e1", flexShrink: 0 }}
                          />
                        ) : (
                          <div style={{ width: 44, height: 44, borderRadius: 8, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#94a3b8", flexShrink: 0 }}>
                            🛠️
                          </div>
                        )}
                        <div>
                          <Link to={`/admin/master-services/${service.id}`} style={{ color: "#0f172a", textDecoration: "none", fontWeight: "800", fontSize: 15 }}>
                            {service.title}
                          </Link>
                          <div style={{ color: "#2563eb", fontSize: 13, fontWeight: 600 }}>/{service.slug}</div>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {Array.isArray(service.categories) && service.categories.length > 0 ? (
                            service.categories.map((c) => (
                              <span key={c.id} style={{ background: "#dbeafe", color: "#1e40af", padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
                                {c.name} {c.is_primary ? "★" : ""}
                              </span>
                            ))
                          ) : (
                            <span style={{ color: "#94a3b8", fontSize: 12 }}>{service.category_name || "No category"}</span>
                          )}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {Array.isArray(service.subcategories) && service.subcategories.length > 0 ? (
                            service.subcategories.map((sc) => (
                              <span key={sc.id} style={{ background: "#ecfdf5", color: "#065f46", padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 600 }}>
                                {sc.name}
                              </span>
                            ))
                          ) : (
                            <span style={{ color: "#94a3b8", fontSize: 12 }}>{service.subcategory_name || "No subcategory"}</span>
                          )}
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <strong style={{ color: "#0f172a" }}>₹{Number(service.base_price || 0).toLocaleString("en-IN")}</strong>
                      <div style={{ fontSize: 11, color: "#64748b" }}>GST {service.gst_percent || 18}%</div>
                    </Td>
                    <Td>
                      <span style={{ background: service.expert_assignment_mode === "manual" ? "#fef3c7" : service.expert_assignment_mode === "hybrid" ? "#f3e8ff" : "#f1f5f9", color: "#1e293b", padding: "3px 8px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
                        {service.expert_assignment_mode ? service.expert_assignment_mode.toUpperCase() : "AUTO"}
                      </span>
                    </Td>
                    <Td>
                      <span style={{ background: "#eff6ff", color: "#1d4ed8", padding: "3px 10px", borderRadius: 12, fontSize: 12, fontWeight: 700 }}>
                        {Array.isArray(service.assigned_experts) ? service.assigned_experts.length : 0} Experts
                      </span>
                    </Td>
                    <Td>
                      <span style={{ background: service.is_active ? "#dcfce7" : "#fef2f2", color: service.is_active ? "#15803d" : "#b42318", padding: "3px 8px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
                        {service.is_active ? "Published" : "Draft"}
                      </span>
                    </Td>
                    <Td>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, fontSize: 12 }}>
                        <Link to={`/admin/master-services/${service.id}`} style={{ fontWeight: 700, color: "#2563eb" }}>Control Center</Link>
                        <span style={{ color: "#cbd5e1" }}>|</span>
                        <Link to={`/admin/form-builder/${service.id}`} style={{ color: "#475569" }}>Form</Link>
                        <span style={{ color: "#cbd5e1" }}>|</span>
                        <Link to={`/admin/document-builder/${service.id}`} style={{ color: "#475569" }}>Docs</Link>
                        <span style={{ color: "#cbd5e1" }}>|</span>
                        <Link to={`/admin/workflow-builder/${service.id}`} style={{ color: "#475569" }}>Workflow</Link>
                      </div>
                    </Td>
                    <Td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/master-services?edit=${service.id}`)}
                          style={{ padding: "4px 10px", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: 6, cursor: "pointer", fontWeight: 700, fontSize: 12 }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteService(service)}
                          style={{ padding: "4px 10px", background: "#fef2f2", color: "#b42318", border: "1px solid #fecaca", borderRadius: 6, cursor: "pointer", fontWeight: 700, fontSize: 12 }}
                        >
                          Delete
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Th({ children }) {
  return <th style={{ padding: "1rem" }}>{children}</th>;
}

function Td({ children }) {
  return <td style={{ padding: "1rem", verticalAlign: "top" }}>{children}</td>;
}
