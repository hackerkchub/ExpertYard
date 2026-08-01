import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import APP_CONFIG from "../../../../config/appConfig";
import ServiceActivationModal from "./ServiceActivationModal";

const authHeaders = () => {
  const token = localStorage.getItem("expert_token") || localStorage.getItem("token") || localStorage.getItem("expertToken") || "";
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

export default function ActivateServicesPage() {
  const navigate = useNavigate();
  const [masterServices, setMasterServices] = useState([]);
  const [activatedServices, setActivatedServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  // Inspection Drawer State
  const [inspectingService, setInspectingService] = useState(null);

  // Activation Modal State
  const [selectedServiceForModal, setSelectedServiceForModal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [svcRes, actRes, catRes, subRes] = await Promise.all([
        apiFetch("/api/expert/master-services/available", { headers: authHeaders() }),
        apiFetch("/api/expert/service-activations/my-services", { headers: authHeaders() }),
        apiFetch("/api/category/list"),
        apiFetch("/api/subcategory")
      ]);

      const [svcData, actData, catData, subData] = await Promise.all([
        svcRes.json(),
        actRes.json(),
        catRes.json(),
        subRes.json()
      ]);

      if (svcData.success) setMasterServices(svcData.data || []);
      if (actData.success) setActivatedServices(actData.data || []);

      const catRows = catData?.data?.data || catData?.data || [];
      setCategories(Array.isArray(catRows) ? catRows : []);

      const subRows = subData?.data?.data || subData?.data || [];
      setSubcategories(Array.isArray(subRows) ? subRows : []);
    } catch (err) {
      console.error("Error loading master services catalog:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredSubcategories = useMemo(() => {
    if (!selectedCategory) return subcategories;
    return subcategories.filter((s) => Number(s.category_id) === Number(selectedCategory));
  }, [subcategories, selectedCategory]);

  const filteredServices = useMemo(() => {
    return masterServices.filter((svc) => {
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesTitle = svc.title?.toLowerCase().includes(q);
        const matchesSlug = svc.slug?.toLowerCase().includes(q);
        const matchesDesc = svc.short_description?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSlug && !matchesDesc) return false;
      }

      if (selectedCategory !== "") {
        const catId = Number(selectedCategory);
        const hasCat = (svc.categories || []).some((c) => Number(c.id) === catId) || Number(svc.category_id) === catId;
        if (!hasCat) return false;
      }

      if (selectedSubcategory !== "") {
        const subId = Number(selectedSubcategory);
        const hasSub = (svc.subcategories || []).some((sc) => Number(sc.id) === subId) || Number(svc.subcategory_id) === subId;
        if (!hasSub) return false;
      }

      return true;
    });
  }, [masterServices, searchQuery, selectedCategory, selectedSubcategory]);

  const handleOpenModal = (service) => {
    setInspectingService(null);
    setSelectedServiceForModal(service);
    setIsModalOpen(true);
  };

  return (
    <div style={{ padding: "1.5rem", maxWidth: "1240px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      {/* HEADER */}
      <header style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "1.25rem 1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <div>
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
            <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, color: "#111b21" }}>Activate Services</h2>
          </div>
          <p style={{ margin: "0.25rem 0 0", color: "#64748b", fontSize: "0.9rem" }}>
            Browse Admin master service templates, inspect document specs and workflow steps, and activate listings.
          </p>
        </div>
      </header>

      {/* FILTER BAR */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "1rem 1.25rem", display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
        <input
          type="text"
          placeholder="Search services by title, slug, or keywords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, minWidth: 240, padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14 }}
        />

        <select
          value={selectedCategory}
          onChange={(e) => { setSelectedCategory(e.target.value); setSelectedSubcategory(""); }}
          style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, background: "#fff" }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <select
          value={selectedSubcategory}
          onChange={(e) => setSelectedSubcategory(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, background: "#fff" }}
        >
          <option value="">All Subcategories</option>
          {filteredSubcategories.map((sub) => (
            <option key={sub.id} value={sub.id}>{sub.name}</option>
          ))}
        </select>

        <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>
          Showing <strong>{filteredServices.length}</strong> services
        </span>
      </div>

      {/* SERVICES CATALOGUE GRID */}
      {loading ? (
        <p style={{ padding: "2rem", color: "#64748b" }}>Loading master services catalog...</p>
      ) : filteredServices.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "3rem", textAlign: "center" }}>
          <p style={{ color: "#64748b", margin: 0, fontSize: "1.1rem" }}>No master services match your filter selection.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.25rem" }}>
          {filteredServices.map((svc) => {
            const isActivated = activatedServices.some((act) => Number(act.master_service_id) === Number(svc.id));
            return (
              <div
                key={svc.id}
                style={{
                  background: "#fff",
                  border: isActivated ? "1.5px solid #bbf7d0" : "1px solid #e2e8f0",
                  borderRadius: 12,
                  padding: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  justify: "space-between",
                  gap: 12,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                }}
              >
                <div>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    {svc.image_url || svc.thumbnail_url || svc.icon_url ? (
                      <img
                        src={getServiceImageUrl(svc.image_url || svc.thumbnail_url || svc.icon_url)}
                        alt={svc.title}
                        style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover", border: "1px solid #cbd5e1", flexShrink: 0 }}
                      />
                    ) : (
                      <div style={{ width: 48, height: 48, borderRadius: 8, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#94a3b8", flexShrink: 0 }}>
                        🛠️
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                        <h4 style={{ margin: 0, color: "#0f172a", fontSize: "1.1rem" }}>{svc.title}</h4>
                        {isActivated ? (
                          <span style={{ background: "#dcfce7", color: "#15803d", padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                            Activated ✓
                          </span>
                        ) : (
                          <span style={{ background: "#eff6ff", color: "#1d4ed8", padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                            Available
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, margin: "6px 0 10px" }}>
                    {Array.isArray(svc.categories) && svc.categories.length > 0 ? (
                      svc.categories.map((c) => (
                        <span key={c.id} style={{ background: "#f1f5f9", color: "#475569", padding: "2px 6px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
                          {c.name}
                        </span>
                      ))
                    ) : (
                      <span style={{ background: "#f1f5f9", color: "#475569", padding: "2px 6px", borderRadius: 4, fontSize: 11 }}>
                        {svc.category_name || "General"}
                      </span>
                    )}
                  </div>

                  <p style={{ margin: 0, color: "#64748b", fontSize: "0.85rem", lineHeight: 1.4 }}>
                    {svc.short_description || "Standard master service template ready for expert activation."}
                  </p>
                </div>

                <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>Base Price</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#059669" }}>₹{svc.base_price}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      type="button"
                      onClick={() => setInspectingService(svc)}
                      style={{ padding: "6px 10px", background: "#f8fafc", color: "#475569", border: "1px solid #cbd5e1", borderRadius: 6, fontWeight: 600, fontSize: 12, cursor: "pointer" }}
                    >
                      Inspect
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenModal(svc)}
                      style={{
                        padding: "6px 14px",
                        background: isActivated ? "#f1f5f9" : "#2563eb",
                        color: isActivated ? "#334155" : "#fff",
                        border: "1px solid #cbd5e1",
                        borderRadius: 6,
                        fontWeight: 700,
                        fontSize: 12,
                        cursor: "pointer"
                      }}
                    >
                      {isActivated ? "Edit SLA" : "Activate"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SERVICE INSPECTION MODAL */}
      {inspectingService && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "1rem" }}>
          <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 750, maxHeight: "90vh", overflowY: "auto", padding: "1.75rem", display: "grid", gap: "1.25rem", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #f1f5f9", paddingBottom: "1rem" }}>
              <div>
                <h3 style={{ margin: 0, color: "#0f172a", fontSize: "1.4rem" }}>{inspectingService.title}</h3>
                <div style={{ fontSize: 12, color: "#2563eb", fontWeight: 600 }}>SEO Route: /service/{inspectingService.slug}</div>
              </div>
              <button type="button" onClick={() => setInspectingService(null)} style={{ background: "#f1f5f9", border: 0, padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontWeight: 700 }}>
                ✕
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", background: "#f8fafc", padding: "1rem", borderRadius: 10 }}>
              <div>
                <small style={{ color: "#64748b", fontWeight: 700 }}>Base Price</small>
                <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#059669" }}>₹{inspectingService.base_price}</div>
              </div>
              <div>
                <small style={{ color: "#64748b", fontWeight: 700 }}>Platform Rules</small>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>GST {inspectingService.gst_percent || 18}% • Comm {inspectingService.commission_percent || 0}%</div>
              </div>
              <div>
                <small style={{ color: "#64748b", fontWeight: 700 }}>Delivery SLA</small>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{inspectingService.delivery_time_days || 1} Days</div>
              </div>
            </div>

            <div>
              <h4 style={{ margin: "0 0 0.5rem 0", color: "#0f172a" }}>Full Description & Scope</h4>
              <p style={{ margin: 0, color: "#475569", lineHeight: 1.5, fontSize: 14 }}>
                {inspectingService.full_description || inspectingService.short_description || "Standard master service description."}
              </p>
            </div>

            {/* 4 OPERATING SYSTEM V2 MODULES CARDS */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
              {/* DYNAMIC FORM BUILDER CARD */}
              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "1rem", display: "grid", gap: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ color: "#0f172a", fontSize: 13 }}>Dynamic Form Builder</strong>
                  <span style={{ background: "#eff6ff", color: "#1d4ed8", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                    {(inspectingService.form_fields || []).length} Fields
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>User inputs, PAN/GST regex validation, file uploads, and conditional rules.</p>
                {Array.isArray(inspectingService.form_fields) && inspectingService.form_fields.length > 0 && (
                  <div style={{ fontSize: 11, color: "#334155", background: "#f8fafc", padding: "6px 8px", borderRadius: 6, display: "grid", gap: 2 }}>
                    {inspectingService.form_fields.slice(0, 3).map((f) => (
                      <div key={f.id || f.field_key}>• {f.field_label} ({f.field_type})</div>
                    ))}
                  </div>
                )}
              </div>

              {/* DOCUMENT REQUIREMENTS CARD */}
              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "1rem", display: "grid", gap: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ color: "#0f172a", fontSize: 13 }}>Document Requirements</strong>
                  <span style={{ background: "#f0fdf4", color: "#15803d", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                    {(inspectingService.document_specs || []).length} Docs Required
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>Mandatory PAN, Passport, Photo, PDF, and image upload specifications.</p>
                {Array.isArray(inspectingService.document_specs) && inspectingService.document_specs.length > 0 && (
                  <div style={{ fontSize: 11, color: "#334155", background: "#f8fafc", padding: "6px 8px", borderRadius: 6, display: "grid", gap: 2 }}>
                    {inspectingService.document_specs.slice(0, 3).map((d) => (
                      <div key={d.id || d.doc_type_key}>• {d.label} {d.is_mandatory ? "*" : ""}</div>
                    ))}
                  </div>
                )}
              </div>

              {/* VISUAL WORKFLOW BUILDER CARD */}
              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "1rem", display: "grid", gap: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ color: "#0f172a", fontSize: 13 }}>Visual Workflow Builder</strong>
                  <span style={{ background: "#fefce8", color: "#a16207", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                    {(inspectingService.workflow_steps || []).length} Pipeline Steps
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>Execution steps, role permissions (chat, calls, delivery), and milestones.</p>
                {Array.isArray(inspectingService.workflow_steps) && inspectingService.workflow_steps.length > 0 && (
                  <div style={{ fontSize: 11, color: "#334155", background: "#f8fafc", padding: "6px 8px", borderRadius: 6, display: "grid", gap: 2 }}>
                    {inspectingService.workflow_steps.slice(0, 3).map((st, idx) => (
                      <div key={st.id || idx}>Step {st.step_order || idx+1}: {st.step_label}</div>
                    ))}
                  </div>
                )}
              </div>

              {/* PRICING RULES & ENGINE CARD */}
              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "1rem", display: "grid", gap: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ color: "#0f172a", fontSize: 13 }}>Pricing Rules & Engine</strong>
                  <span style={{ background: "#f3e8ff", color: "#7e22ce", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>Live Engine</span>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>Base pricing, GST calculations, platform commission rates, and net payouts.</p>
                <div style={{ fontSize: 11, color: "#334155", background: "#f8fafc", padding: "6px 8px", borderRadius: 6 }}>
                  Net Payout Estimate: <strong>₹{Math.round(inspectingService.base_price * (1 - (inspectingService.commission_percent || 0)/100))}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, borderTop: "1px solid #f1f5f9", paddingTop: "1rem" }}>
              <button type="button" onClick={() => setInspectingService(null)} style={{ padding: "0.65rem 1.25rem", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>
                Close
              </button>
              <button type="button" onClick={() => handleOpenModal(inspectingService)} style={{ padding: "0.65rem 1.5rem", background: "#2563eb", color: "#fff", border: 0, borderRadius: 8, fontWeight: 800, cursor: "pointer" }}>
                🚀 Proceed to Activate & Customize
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVATION MODAL */}
      <ServiceActivationModal
        masterService={selectedServiceForModal}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => loadData()}
      />
    </div>
  );
}
