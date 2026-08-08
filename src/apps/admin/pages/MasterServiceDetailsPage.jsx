import React, { useEffect, useState } from "react";
import MasterServiceConstraintsTab from "./MasterServiceConstraintsTab";
import { useParams, Link, useNavigate } from "react-router-dom";
import APP_CONFIG from "../../../config/appConfig";

const authHeaders = () => {
  const token = localStorage.getItem("admin_token") || localStorage.getItem("token") || localStorage.getItem("adminToken") || "";
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

export default function MasterServiceDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);

  // Expert Assignment state
  const [assignedExperts, setAssignedExperts] = useState([]);
  const [expertSearchQuery, setExpertSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchingExperts, setSearchingExperts] = useState(false);
  const [selectedExpertToAssign, setSelectedExpertToAssign] = useState(null);
  const [assignPriority, setAssignPriority] = useState(10);
  const [assignFeatured, setAssignFeatured] = useState(true);
  const [assigning, setAssigning] = useState(false);

  const loadServiceDetails = async () => {
    try {
      setLoading(true);
      const res = await apiFetch(`/api/master-services/${id}`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success && data.data) {
        setService(data.data);
      } else {
        setError(data.message || "Master Service not found");
      }
    } catch (err) {
      setError(err.message || "Error loading service");
    } finally {
      setLoading(false);
    }
  };

  const loadAssignedExperts = async () => {
    try {
      const res = await apiFetch(`/api/master-services/${id}/experts/assigned`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) {
        setAssignedExperts(data.data || []);
      }
    } catch (err) {
      console.error("Error loading assigned experts:", err);
    }
  };

  useEffect(() => {
    if (!id) return;
    loadServiceDetails();
    loadAssignedExperts();
  }, [id]);

  const searchExperts = async (query) => {
    setExpertSearchQuery(query);
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      setSearchingExperts(true);
      const res = await apiFetch(`/api/master-services/experts/search?q=${encodeURIComponent(query.trim())}`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) {
        setSearchResults(data.data || []);
      }
    } catch (err) {
      console.error("Error searching experts:", err);
    } finally {
      setSearchingExperts(false);
    }
  };

  const assignExpert = async (expert) => {
    try {
      setAssigning(true);
      const res = await apiFetch(`/api/master-services/${id}/experts`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          expert_id: expert.id,
          priority: Number(assignPriority),
          featured: assignFeatured ? 1 : 0,
          status: "active"
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Expert "${expert.name}" assigned successfully!`);
        setSelectedExpertToAssign(null);
        setExpertSearchQuery("");
        setSearchResults([]);
        await loadAssignedExperts();
      } else {
        alert(data.message || "Failed to assign expert.");
      }
    } catch (err) {
      alert(err.message || "Unable to assign expert.");
    } finally {
      setAssigning(false);
    }
  };

  const removeAssignedExpert = async (expertId, expertName) => {
    if (!window.confirm(`Unassign expert ${expertName} from this service?`)) return;
    try {
      const res = await apiFetch(`/api/master-services/${id}/experts/${expertId}`, {
        method: "DELETE",
        headers: authHeaders()
      });
      const data = await res.json();
      if (data.success) {
        await loadAssignedExperts();
      } else {
        alert(data.message || "Unable to remove expert.");
      }
    } catch (err) {
      alert(err.message || "Failed to remove expert.");
    }
  };

  const saveVisibilitySettings = async (updates) => {
    try {
      setSavingSettings(true);
      const res = await apiFetch(`/api/master-services/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data.success) {
        setService((prev) => ({ ...prev, ...data.data }));
      }
    } catch (err) {
      alert(err.message || "Unable to update visibility settings.");
    } finally {
      setSavingSettings(false);
    }
  };

  if (loading) return <div style={{ padding: "2rem" }}>Loading Master Service Control Center...</div>;
  if (error || !service) {
    return (
      <div style={{ padding: "2rem", color: "#b42318" }}>
        {error || "Master Service not found"}
        <br /><br />
        <Link to="/admin/master-services" style={{ color: "#2563eb", fontWeight: "700" }}>Back to Master Services List</Link>
      </div>
    );
  }

  const formFieldsCount = service.form_fields?.length || 0;
  const docSpecsCount = service.document_specs?.length || 0;
  const workflowStepsCount = service.workflow_steps?.length || 0;
  const categoriesList = service.categories || [];
  const subcategoriesList = service.subcategories || [];

  return (
    <div style={{ padding: "1.5rem", maxWidth: "1240px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <Link to="/admin/master-services" style={{ color: "#2563eb", textDecoration: "none", fontWeight: "700", fontSize: "0.9rem" }}>
            ← Back to Catalogue
          </Link>
          <h2 style={{ margin: "0.5rem 0 0", color: "#0f172a", fontSize: "1.75rem" }}>{service.title}</h2>
          <div style={{ color: "#64748b", fontSize: "0.9rem", marginTop: "4px", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span>Slug: <code style={{ color: "#2563eb" }}>/{service.slug}</code></span>
            <span>|</span>
            <span>UUID: <code>{service.service_uuid || "auto"}</code></span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <span style={{ padding: "0.4rem 0.85rem", borderRadius: "6px", fontSize: "0.85rem", fontWeight: "700", background: service.status === "published" || service.is_active ? "#dcfce7" : "#fef2f2", color: service.status === "published" || service.is_active ? "#15803d" : "#b42318" }}>
            {service.is_active ? "PUBLISHED" : "DRAFT"}
          </span>
          <button
            onClick={() => navigate("/admin/master-services")}
            style={{ padding: "0.55rem 1.1rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "700", cursor: "pointer" }}>
            Edit Service Settings
          </button>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", padding: "1.25rem", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <small style={{ color: "#64748b", fontWeight: 700 }}>Base Price</small>
          <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0f172a", marginTop: 4 }}>₹{Number(service.base_price || 0).toLocaleString("en-IN")}</div>
          <small style={{ color: "#10b981", fontWeight: 600 }}>+ {service.gst_percent || 18}% GST Tax</small>
        </div>

        <div style={{ background: "#fff", border: "1px solid #e2e8f0", padding: "1.25rem", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <small style={{ color: "#64748b", fontWeight: 700 }}>Platform Commission</small>
          <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#1d4ed8", marginTop: 4 }}>{service.commission_percent || 0}%</div>
          <small style={{ color: "#64748b" }}>SLA Delivery: {service.delivery_time_days || 1} Days</small>
        </div>

        <div style={{ background: "#fff", border: "1px solid #e2e8f0", padding: "1.25rem", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <small style={{ color: "#64748b", fontWeight: 700 }}>Assignment Engine Mode</small>
          <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "#7e22ce", marginTop: 4 }}>
            {(service.expert_assignment_mode || "auto").toUpperCase()}
          </div>
          <small style={{ color: "#64748b" }}>Assigned Experts: {assignedExperts.length}</small>
        </div>
      </div>

      {/* LINKED CATEGORIES & SUBCATEGORIES SECTION */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.25rem", display: "grid", gap: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, color: "#0f172a" }}>Linked Categories & Subcategories (Many-to-Many Mappings)</h3>
          <button onClick={() => navigate("/admin/master-services")} style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontWeight: 700, fontSize: 12 }}>
            Manage Mappings
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#475569" }}>Categories ({categoriesList.length}):</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
              {categoriesList.length > 0 ? (
                categoriesList.map((c) => (
                  <span key={c.id} style={{ background: "#dbeafe", color: "#1e40af", padding: "4px 10px", borderRadius: 16, fontSize: 12, fontWeight: 700 }}>
                    {c.name} {c.is_primary ? "(Primary)" : ""}
                  </span>
                ))
              ) : (
                <span style={{ color: "#94a3b8", fontSize: 13 }}>{service.category_name || "None assigned"}</span>
              )}
            </div>
          </div>

          <div>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#475569" }}>Subcategories ({subcategoriesList.length}):</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
              {subcategoriesList.length > 0 ? (
                subcategoriesList.map((sc) => (
                  <span key={sc.id} style={{ background: "#ecfdf5", color: "#065f46", padding: "4px 10px", borderRadius: 16, fontSize: 12, fontWeight: 600 }}>
                    {sc.name}
                  </span>
                ))
              ) : (
                <span style={{ color: "#94a3b8", fontSize: 13 }}>{service.subcategory_name || "None assigned"}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ASSIGNED EXPERTS & VISIBILITY CONSOLE */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.5rem", display: "grid", gap: "1.25rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h3 style={{ margin: 0, color: "#0f172a" }}>Assigned Experts & Service Visibility Console</h3>
            <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 13 }}>
              Assign specific experts to this service, set priority ordering, and configure discovery modes.
            </p>
          </div>
        </div>

        {/* VISIBILITY CONTROLS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", background: "#f8fafc", padding: "1rem", borderRadius: 10, border: "1px solid #e2e8f0" }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
              Expert Assignment Mode
            </label>
            <select
              value={service.expert_assignment_mode || "auto"}
              disabled={savingSettings}
              onChange={(e) => saveVisibilitySettings({ expert_assignment_mode: e.target.value })}
              style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontWeight: 700 }}
            >
              <option value="auto">Auto Assignment (All Activated Experts)</option>
              <option value="manual">Manual Assignment (Assigned Experts Only)</option>
              <option value="hybrid">Hybrid Mode (Assigned Experts First + Remaining Activated)</option>
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, justifyContent: "center" }}>
            {[
              ["featured_first", "Featured Experts First"],
              ["hide_in_search", "Hide in Search Engine"],
              ["show_on_homepage", "Show on Homepage"],
              ["is_recommended", "Recommended Badge"]
            ].map(([key, label]) => (
              <label key={key} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, fontWeight: 700, color: "#334155" }}>
                <input
                  type="checkbox"
                  checked={Boolean(service[key])}
                  disabled={savingSettings}
                  onChange={(e) => saveVisibilitySettings({ [key]: e.target.checked })}
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* EXPERT SEARCH & ASSIGNMENT INPUT */}
        <div style={{ display: "grid", gap: "0.75rem" }}>
          <h4 style={{ margin: 0, color: "#1e293b" }}>Assign Expert to Service</h4>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="Search experts by name, email, phone, city..."
              value={expertSearchQuery}
              onChange={(e) => searchExperts(e.target.value)}
              style={{ flex: 1, minWidth: 260, padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1" }}
            />
          </div>

          {/* SEARCH RESULTS DROPDOWN */}
          {searchingExperts && <div style={{ fontSize: 13, color: "#64748b" }}>Searching active experts...</div>}
          {searchResults.length > 0 && (
            <div style={{ background: "#fff", border: "1px solid #cbd5e1", borderRadius: 8, maxHeight: 200, overflowY: "auto", display: "grid" }}>
              {searchResults.map((exp) => (
                <div
                  key={exp.id}
                  onClick={() => setSelectedExpertToAssign(exp)}
                  style={{
                    padding: "8px 12px",
                    borderBottom: "1px solid #f1f5f9",
                    cursor: "pointer",
                    background: selectedExpertToAssign?.id === exp.id ? "#eff6ff" : "#fff",
                    display: "flex",
                    justify: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <strong style={{ color: "#0f172a" }}>{exp.name}</strong> <span style={{ color: "#64748b", fontSize: 12 }}>({exp.phone || exp.email})</span>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{exp.city || "City not set"} • {exp.position || exp.education || "Expert"}</div>
                  </div>
                  <button type="button" style={{ padding: "4px 8px", background: "#2563eb", color: "#fff", border: 0, borderRadius: 4, fontSize: 12, fontWeight: 700 }}>
                    Select
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* SELECTED EXPERT ASSIGN CARD */}
          {selectedExpertToAssign && (
            <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "1rem", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <strong style={{ color: "#1e40af" }}>Assigning: {selectedExpertToAssign.name}</strong>
                <div style={{ fontSize: 12, color: "#3b82f6" }}>{selectedExpertToAssign.phone} • {selectedExpertToAssign.email}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#1e3a8a", display: "flex", alignItems: "center", gap: 6 }}>
                  Priority:
                  <input
                    type="number"
                    value={assignPriority}
                    onChange={(e) => setAssignPriority(e.target.value)}
                    style={{ width: 60, padding: "4px 6px", borderRadius: 4, border: "1px solid #93c5fd" }}
                  />
                </label>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#1e3a8a", display: "flex", alignItems: "center", gap: 6 }}>
                  <input
                    type="checkbox"
                    checked={assignFeatured}
                    onChange={(e) => setAssignFeatured(e.target.checked)}
                  />
                  Featured Badge
                </label>
                <button
                  type="button"
                  disabled={assigning}
                  onClick={() => assignExpert(selectedExpertToAssign)}
                  style={{ padding: "6px 14px", background: "#1d4ed8", color: "#fff", border: 0, borderRadius: 6, fontWeight: 800, cursor: "pointer" }}
                >
                  {assigning ? "Assigning..." : "Confirm Assignment"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedExpertToAssign(null)}
                  style={{ background: "none", border: 0, color: "#64748b", cursor: "pointer", fontSize: 12 }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* ASSIGNED EXPERTS TABLE */}
          <div style={{ marginTop: "0.5rem" }}>
            <h4 style={{ margin: "0 0 0.5rem", color: "#1e293b" }}>Currently Assigned Experts ({assignedExperts.length})</h4>
            {assignedExperts.length === 0 ? (
              <p style={{ color: "#94a3b8", fontSize: 13, margin: 0 }}>No experts directly assigned to this service yet.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
                  <thead>
                    <tr style={{ background: "#f8fafc", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>
                      <th style={{ padding: "8px 12px", fontSize: 12 }}>Expert</th>
                      <th style={{ padding: "8px 12px", fontSize: 12 }}>Contact / City</th>
                      <th style={{ padding: "8px 12px", fontSize: 12 }}>Priority</th>
                      <th style={{ padding: "8px 12px", fontSize: 12 }}>Featured</th>
                      <th style={{ padding: "8px 12px", fontSize: 12 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignedExperts.map((exp) => (
                      <tr key={exp.expert_id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "8px 12px", fontWeight: 700, color: "#0f172a", fontSize: 13 }}>{exp.name}</td>
                        <td style={{ padding: "8px 12px", color: "#475569", fontSize: 12 }}>{exp.phone || exp.email} • {exp.city || "General"}</td>
                        <td style={{ padding: "8px 12px", fontSize: 12 }}>
                          <span style={{ background: "#f1f5f9", padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>
                            {exp.priority || 0}
                          </span>
                        </td>
                        <td style={{ padding: "8px 12px", fontSize: 12 }}>
                          {exp.featured ? (
                            <span style={{ background: "#fef3c7", color: "#92400e", padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 700 }}>Featured</span>
                          ) : (
                            <span style={{ color: "#94a3b8" }}>-</span>
                          )}
                        </td>
                        <td style={{ padding: "8px 12px" }}>
                          <button
                            type="button"
                            onClick={() => removeAssignedExpert(exp.expert_id, exp.name)}
                            style={{ padding: "3px 8px", background: "#fef2f2", color: "#b42318", border: "1px solid #fecaca", borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                          >
                            Unassign
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* EXPERT CUSTOMIZATION CONSTRAINTS MODULE */}
      <MasterServiceConstraintsTab masterService={service} onSaveSuccess={loadServiceDetails} />

      {/* MODULE CARDS */}
      <h3 style={{ margin: "0.5rem 0 0", color: "#0f172a" }}>Service Operating System Modules</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.25rem", display: "grid", gap: "0.85rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4 style={{ margin: 0, color: "#0f172a" }}>Dynamic Form Builder</h4>
            <span style={{ background: "#eff6ff", color: "#1d4ed8", padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "700" }}>{formFieldsCount} Fields</span>
          </div>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>Configure user submission inputs, PAN/GST regex validation, file uploads, and conditional rules.</p>
          <Link to={`/admin/form-builder/${service.id}`} style={{ display: "block", textAlign: "center", padding: "0.65rem", background: "#2563eb", color: "#fff", borderRadius: "6px", textDecoration: "none", fontWeight: "700" }}>Configure Form Schema</Link>
        </div>

        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.25rem", display: "grid", gap: "0.85rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4 style={{ margin: 0, color: "#0f172a" }}>Document Requirements</h4>
            <span style={{ background: "#f0fdf4", color: "#15803d", padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "700" }}>{docSpecsCount} Docs Required</span>
          </div>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>Specify mandatory PAN, Passport, Photo, PDF, and image document upload specifications.</p>
          <Link to={`/admin/document-builder/${service.id}`} style={{ display: "block", textAlign: "center", padding: "0.65rem", background: "#059669", color: "#fff", borderRadius: "6px", textDecoration: "none", fontWeight: "700" }}>Configure Document Specs</Link>
        </div>

        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.25rem", display: "grid", gap: "0.85rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4 style={{ margin: 0, color: "#0f172a" }}>Visual Workflow Builder</h4>
            <span style={{ background: "#fefce8", color: "#a16207", padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "700" }}>{workflowStepsCount} Pipeline Steps</span>
          </div>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>Build execution steps, role permission matrix (chat, calls, delivery), and milestone triggers.</p>
          <Link to={`/admin/workflow-builder/${service.id}`} style={{ display: "block", textAlign: "center", padding: "0.65rem", background: "#ca8a04", color: "#fff", borderRadius: "6px", textDecoration: "none", fontWeight: "700" }}>Configure Workflow Steps</Link>
        </div>

        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.25rem", display: "grid", gap: "0.85rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4 style={{ margin: 0, color: "#0f172a" }}>Pricing Rules & Engine</h4>
            <span style={{ background: "#f3e8ff", color: "#7e22ce", padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "700" }}>Live Engine</span>
          </div>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>Simulate base pricing, GST calculations, platform commission rates, and net expert payouts.</p>
          <Link to={`/admin/pricing-rules/${service.id}`} style={{ display: "block", textAlign: "center", padding: "0.65rem", background: "#7e22ce", color: "#fff", borderRadius: "6px", textDecoration: "none", fontWeight: "700" }}>Configure Pricing Rules</Link>
        </div>
      </div>
    </div>
  );
}
