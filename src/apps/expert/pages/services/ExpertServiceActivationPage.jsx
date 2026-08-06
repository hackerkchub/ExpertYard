import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import APP_CONFIG from "../../../../config/appConfig";
import ServiceActivationModal from "./ServiceActivationModal";
import { useExpert } from "../../../../shared/context/ExpertContext";

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

export default function ExpertServiceActivationPage() {
  const navigate = useNavigate();
  const { expertData } = useExpert();
  const [activeTab, setActiveTab] = useState("available"); // available | my_services | custom_proposal
  const [masterServices, setMasterServices] = useState([]);
  const [activatedServices, setActivatedServices] = useState([]);
  const [customRequests, setCustomRequests] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("");

  // Activation Modal State
  const [selectedService, setSelectedService] = useState(null);
  const [activationForm, setActivationForm] = useState({
    custom_price: 1299,
    offer_price: 999,
    delivery_time_days: 2,
    custom_bio: "",
  });

  // Edit Activation State
  const [editingActivation, setEditingActivation] = useState(null);

  // Custom Proposal Form State
  const [customForm, setCustomForm] = useState({
    category_id: "",
    title: "",
    description: "",
    proposed_price: 1999
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [masterRes, expertMasterRes, publicMasterRes, actRes, customRes, catRes] = await Promise.all([
        apiFetch("/api/expert-activations/available-master-services", { headers: authHeaders() }).catch(() => null),
        apiFetch("/api/expert/master-services/available", { headers: authHeaders() }).catch(() => null),
        apiFetch("/api/master-services/public").catch(() => null),
        apiFetch("/api/expert-activations/my-services", { headers: authHeaders() }).catch(() => null),
        apiFetch("/api/expert-activations/my-custom-requests", { headers: authHeaders() }).catch(() => null),
        apiFetch("/api/category/list").catch(() => null)
      ]);

      const [masterData, expertMasterData, publicMasterData, actData, customData, catData] = await Promise.all([
        masterRes ? masterRes.json().catch(() => ({})) : {},
        expertMasterRes ? expertMasterRes.json().catch(() => ({})) : {},
        publicMasterRes ? publicMasterRes.json().catch(() => ({})) : {},
        actRes ? actRes.json().catch(() => ({})) : {},
        customRes ? customRes.json().catch(() => ({})) : {},
        catRes ? catRes.json().catch(() => ({})) : {}
      ]);

      const list1 = masterData?.data || [];
      const list2 = expertMasterData?.data || expertMasterData?.services || [];
      const list3 = publicMasterData?.data || publicMasterData?.services || publicMasterData?.master_services || [];

      const combined = [...list1, ...list2, ...list3];
      const masterMap = new Map();

      combined.forEach((svc) => {
        if (!svc) return;
        const key = String(svc.id || svc._id || svc.slug || svc.title || "");
        if (key && !masterMap.has(key)) {
          masterMap.set(key, svc);
        }
      });

      setMasterServices(Array.from(masterMap.values()));
      if (actData?.success || Array.isArray(actData?.data)) {
        setActivatedServices(actData.data || []);
      }
      if (customData?.success || Array.isArray(customData?.data)) {
        setCustomRequests(customData.data || []);
      }
      
      const catRows = catData?.data?.data || catData?.data || [];
      setCategories(Array.isArray(catRows) ? catRows : []);
    } catch (err) {
      console.error("Error loading expert service portal data:", err);
      setError("Failed to load service portal data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [expertData?.categoryId, expertData?.primaryCategoryId, JSON.stringify(expertData?.categoryIds || [])]);

  const openActivationModal = (svc) => {
    setSelectedService(svc);
    setActivationForm({
      custom_price: svc.custom_price || svc.base_price || 999,
      offer_price: svc.offer_price || Math.round((svc.base_price || 999) * 0.9),
      delivery_time_days: svc.delivery_time_days || 2,
      custom_bio: "",
    });
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleActivateService = async (e) => {
    e.preventDefault();
    if (!selectedService) return;

    try {
      setSubmitting(true);
      setError("");
      const res = await apiFetch("/api/expert-activations/activate", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          master_service_id: selectedService.id,
          custom_price: Number(activationForm.custom_price),
          offer_price: Number(activationForm.offer_price || 0),
          delivery_time_days: Number(activationForm.delivery_time_days || 1),
          custom_bio: activationForm.custom_bio,
          is_available: 1
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Service "${selectedService.title}" activated successfully!`);
        setSelectedService(null);
        await loadData();
        setActiveTab("my_services");
      } else {
        setError(data.message || "Failed to activate service.");
      }
    } catch (err) {
      setError("Error activating service.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleAvailability = async (activation) => {
    try {
      const nextStatus = activation.is_available ? 0 : 1;
      const res = await apiFetch(`/api/expert-activations/${activation.id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ is_available: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        await loadData();
      } else {
        alert(data.message || "Failed to update availability.");
      }
    } catch (err) {
      alert("Error updating availability.");
    }
  };

  const handleUpdateActivation = async (e) => {
    e.preventDefault();
    if (!editingActivation) return;
    try {
      setSubmitting(true);
      const res = await apiFetch(`/api/expert-activations/${editingActivation.id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({
          custom_price: Number(editingActivation.custom_price),
          offer_price: Number(editingActivation.offer_price || 0),
          delivery_time_days: Number(editingActivation.delivery_time_days),
          custom_bio: editingActivation.custom_bio
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Service customization updated successfully!");
        setEditingActivation(null);
        await loadData();
      } else {
        setError(data.message || "Failed to update activation.");
      }
    } catch (err) {
      setError("Error updating service customization.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (activation) => {
    if (!window.confirm(`Deactivate "${activation.master_service_title}"? Clients will no longer be able to book this service from your profile.`)) return;
    try {
      const res = await apiFetch(`/api/expert-activations/${activation.id}/deactivate`, {
        method: "PATCH",
        headers: authHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Service deactivated.`);
        await loadData();
      } else {
        alert(data.message || "Unable to deactivate.");
      }
    } catch (err) {
      alert("Failed to deactivate service.");
    }
  };

  const handleCustomProposalSubmit = async (e) => {
    e.preventDefault();
    if (!customForm.category_id || !customForm.title || !customForm.description) {
      setError("Category, Title, and Description are required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      const res = await apiFetch("/api/expert-activations/custom-request", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          ...customForm,
          proposed_price: Number(customForm.proposed_price || 1999)
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Custom service proposal submitted to Admin for approval!");
        setCustomForm({ category_id: "", title: "", description: "", proposed_price: 1999 });
        await loadData();
      } else {
        setError(data.message || "Failed to submit proposal.");
      }
    } catch (err) {
      setError("Error submitting custom service proposal.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredMasterServices = useMemo(() => {
    const expertCatIds = new Set(
      [
        expertData?.categoryId,
        expertData?.primaryCategoryId,
        ...(expertData?.categoryIds || []),
        ...(expertData?.categorySelections || []).map((c) => c.category_id),
      ]
        .map(Number)
        .filter(Boolean)
    );

    return masterServices.filter((svc) => {
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesTitle = svc.title?.toLowerCase().includes(q);
        const matchesSlug = svc.slug?.toLowerCase().includes(q);
        const matchesDesc = svc.short_description?.toLowerCase().includes(q);
        const matchesCat = svc.category_name?.toLowerCase().includes(q) || svc.subcategory_name?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSlug && !matchesDesc && !matchesCat) return false;
      }

      if (selectedCategoryFilter !== "") {
        const catId = Number(selectedCategoryFilter);
        const hasCat =
          (svc.categories || []).some((c) => Number(c.id || c.category_id) === catId) ||
          Number(svc.category_id) === catId ||
          Number(svc.categoryId) === catId;
        if (!hasCat) return false;
      } else if (expertCatIds.size > 0) {
        const svcCatId = Number(svc.category_id || svc.categoryId || 0);
        const svcSubCatId = Number(svc.subcategory_id || svc.subcategoryId || 0);
        const hasCatInCategories = (svc.categories || []).some((c) => expertCatIds.has(Number(c.id || c.category_id)));

        const matchesExpertCategories =
          expertCatIds.has(svcCatId) ||
          expertCatIds.has(svcSubCatId) ||
          hasCatInCategories ||
          !svcCatId; // include general templates

        if (!matchesExpertCategories) return false;
      }

      return true;
    });
  }, [masterServices, searchQuery, selectedCategoryFilter, expertData]);

  return (
    <div style={{ padding: "1.5rem", maxWidth: "1200px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      {/* HEADER */}
      <header style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "1.25rem 1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
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
              <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, color: "#111b21" }}>Master Service OS Portal</h2>
            </div>
            <p style={{ margin: "0.25rem 0 0", color: "#64748b", fontSize: "0.9rem" }}>
              Activate enterprise Admin master service templates, set custom SLA & pricing, or propose custom service templates.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setActiveTab("available")}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "1px solid #cbd5e1",
                background: activeTab === "available" ? "#2563eb" : "#fff",
                color: activeTab === "available" ? "#fff" : "#475569",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer"
              }}
            >
              Available Templates ({masterServices.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("my_services")}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "1px solid #cbd5e1",
                background: activeTab === "my_services" ? "#2563eb" : "#fff",
                color: activeTab === "my_services" ? "#fff" : "#475569",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer"
              }}
            >
              My Activated Services ({activatedServices.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("custom_proposal")}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "1px solid #cbd5e1",
                background: activeTab === "custom_proposal" ? "#2563eb" : "#fff",
                color: activeTab === "custom_proposal" ? "#fff" : "#475569",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer"
              }}
            >
              + Propose Custom Service
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div style={{ background: "#fef2f2", color: "#b42318", border: "1px solid #fecaca", padding: "0.85rem 1rem", borderRadius: 8, fontSize: 14 }}>
          {error}
        </div>
      )}

      {successMsg && (
        <div style={{ background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0", padding: "0.85rem 1rem", borderRadius: 8, fontSize: 14 }}>
          {successMsg}
        </div>
      )}

      {/* TAB 1: AVAILABLE MASTER SERVICES */}
      {activeTab === "available" && (
        <div style={{ display: "grid", gap: "1.25rem" }}>
          {/* SEARCH & FILTERS */}
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "1rem 1.25rem", display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
            <input
              type="text"
              placeholder="Search master services by name, description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, minWidth: 240, padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14 }}
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
          </div>

          {/* ACTIVATION & CUSTOMIZATION MODAL WITH ALL 4 OS V2 MODULES */}
          <ServiceActivationModal
            masterService={selectedService}
            isOpen={Boolean(selectedService)}
            onClose={() => setSelectedService(null)}
            onSuccess={() => loadData()}
          />

          {/* GRID OF MASTER SERVICES */}
          {loading ? (
            <p style={{ padding: "2rem", color: "#64748b" }}>Loading master services templates...</p>
          ) : filteredMasterServices.length === 0 ? (
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "3rem", textAlign: "center" }}>
              <p style={{ color: "#64748b", margin: 0, fontSize: "1.1rem" }}>No master services match your search criteria.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.25rem" }}>
              {filteredMasterServices.map((svc) => {
                const isActivated = activatedServices.some((act) => Number(act.master_service_id) === Number(svc.id));
                return (
                  <div
                    key={svc.id}
                    style={{
                      background: "#fff",
                      border: isActivated ? "1px solid #bbf7d0" : "1px solid #e2e8f0",
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
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                        <h4 style={{ margin: 0, color: "#0f172a", fontSize: "1.1rem" }}>{svc.title}</h4>
                        {isActivated ? (
                          <span style={{ background: "#dcfce7", color: "#15803d", padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
                            Activated ✓
                          </span>
                        ) : (
                          <span style={{ background: "#eff6ff", color: "#1d4ed8", padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
                            Template
                          </span>
                        )}
                      </div>

                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, margin: "6px 0 10px" }}>
                        {Array.isArray(svc.categories) && svc.categories.length > 0 ? (
                          svc.categories.map((c) => (
                            <span key={c.id} style={{ background: "#dbeafe", color: "#1e40af", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                              {c.name} {c.is_primary ? "(Primary)" : ""}
                            </span>
                          ))
                        ) : (
                          <span style={{ background: "#dbeafe", color: "#1e40af", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                            {svc.category_name || "General Category"}
                          </span>
                        )}
                        {svc.subcategory_name && (
                          <span style={{ background: "#ecfdf5", color: "#065f46", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
                            {svc.subcategory_name}
                          </span>
                        )}
                      </div>



                      {/* ALL ADMIN MASTER SERVICE DETAILS */}
                      <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 10px", display: "grid", gap: 6, fontSize: 11, color: "#334155" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span>Platform Rules:</span>
                          <strong>GST {svc.gst_percent || 18}% • Comm {svc.commission_percent || 0}%</strong>
                        </div>

                        {Array.isArray(svc.document_specs) && svc.document_specs.length > 0 && (
                          <div>
                            <span style={{ fontWeight: 700, color: "#0f172a" }}>📄 Required Documents ({svc.document_specs.length}):</span>
                            <div style={{ color: "#64748b", marginTop: 2 }}>
                              {svc.document_specs.slice(0, 3).map(d => d.label).join(", ")}
                              {svc.document_specs.length > 3 ? "..." : ""}
                            </div>
                          </div>
                        )}

                        {Array.isArray(svc.form_fields) && svc.form_fields.length > 0 && (
                          <div>
                            <span style={{ fontWeight: 700, color: "#0f172a" }}>📋 Dynamic Form ({svc.form_fields.length} Fields):</span>
                            <div style={{ color: "#64748b", marginTop: 2 }}>
                              {svc.form_fields.slice(0, 3).map(f => f.field_label).join(", ")}
                              {svc.form_fields.length > 3 ? "..." : ""}
                            </div>
                          </div>
                        )}

                        {Array.isArray(svc.workflow_steps) && svc.workflow_steps.length > 0 && (
                          <div>
                            <span style={{ fontWeight: 700, color: "#0f172a" }}>⚡ Visual Workflow ({svc.workflow_steps.length} Steps):</span>
                            <div style={{ color: "#64748b", marginTop: 2 }}>
                              {svc.workflow_steps.slice(0, 3).map((st, i) => `${i+1}. ${st.step_label}`).join(" → ")}
                            </div>
                          </div>
                        )}

                        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 4, display: "flex", justifyContent: "space-between", color: "#15803d" }}>
                          <span>Est. Net Expert Payout:</span>
                          <strong>₹{Math.round(svc.base_price * (1 - (svc.commission_percent || 0)/100))}</strong>
                        </div>
                      </div>
                    </div>

                    <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>Base Price</div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: "#059669" }}>₹{svc.base_price}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>Standard SLA</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>{svc.delivery_time_days || 1} Days</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => openActivationModal(svc)}
                        style={{
                          padding: "6px 14px",
                          background: isActivated ? "#f1f5f9" : "#2563eb",
                          color: isActivated ? "#334155" : "#fff",
                          border: "1px solid #cbd5e1",
                          borderRadius: 8,
                          fontWeight: 700,
                          fontSize: 12,
                          cursor: "pointer"
                        }}
                      >
                        {isActivated ? "Re-configure" : "Activate"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY ACTIVATED SERVICES */}
      {activeTab === "my_services" && (
        <div style={{ display: "grid", gap: "1.25rem" }}>
          {editingActivation && (
            <div style={{ background: "#fff", border: "2px solid #2563eb", borderRadius: 12, padding: "1.5rem", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ margin: 0, color: "#0f172a" }}>Edit Service Customization: {editingActivation.master_service_title}</h3>
                <button type="button" onClick={() => setEditingActivation(null)} style={{ background: "#f1f5f9", border: 0, padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>
                  Cancel
                </button>
              </div>
              <form onSubmit={handleUpdateActivation} style={{ display: "grid", gap: "1rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                  <label style={labelStyle}>
                    Custom Price (₹)
                    <input
                      type="number"
                      value={editingActivation.custom_price}
                      onChange={(e) => setEditingActivation({ ...editingActivation, custom_price: e.target.value })}
                      required
                      style={inputStyle}
                    />
                  </label>
                  <label style={labelStyle}>
                    Offer Price (₹)
                    <input
                      type="number"
                      value={editingActivation.offer_price || ""}
                      onChange={(e) => setEditingActivation({ ...editingActivation, offer_price: e.target.value })}
                      style={inputStyle}
                    />
                  </label>
                  <label style={labelStyle}>
                    Delivery SLA (Days)
                    <input
                      type="number"
                      value={editingActivation.delivery_time_days || 1}
                      onChange={(e) => setEditingActivation({ ...editingActivation, delivery_time_days: e.target.value })}
                      required
                      style={inputStyle}
                    />
                  </label>
                </div>
                <label style={labelStyle}>
                  Custom Bio / Pitch
                  <textarea
                    value={editingActivation.custom_bio || ""}
                    onChange={(e) => setEditingActivation({ ...editingActivation, custom_bio: e.target.value })}
                    rows={3}
                    style={inputStyle}
                  />
                </label>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button type="submit" disabled={submitting} style={{ padding: "0.75rem 1.5rem", background: "#2563eb", color: "#fff", border: 0, borderRadius: 8, fontWeight: 800, cursor: "pointer" }}>
                    Save Customization
                  </button>
                </div>
              </form>
            </div>
          )}

          {activatedServices.length === 0 ? (
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "3rem", textAlign: "center" }}>
              <p style={{ color: "#64748b", margin: 0, fontSize: "1.1rem" }}>You haven't activated any master services yet.</p>
              <button
                type="button"
                onClick={() => setActiveTab("available")}
                style={{ marginTop: "1rem", padding: "8px 16px", background: "#2563eb", color: "#fff", border: 0, borderRadius: 8, fontWeight: 700, cursor: "pointer" }}
              >
                Browse & Activate Templates
              </button>
            </div>
          ) : (
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
                  <thead>
                    <tr style={{ background: "#f8fafc", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>
                      <Th>Master Service</Th>
                      <Th>Category</Th>
                      <Th>Custom Pricing</Th>
                      <Th>Delivery SLA</Th>
                      <Th>Availability</Th>
                      <Th>Actions</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {activatedServices.map((act) => (
                      <tr key={act.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                        <Td>
                          <strong style={{ color: "#0f172a", fontSize: 15 }}>{act.master_service_title}</strong>
                          <div style={{ fontSize: 12, color: "#2563eb" }}>/{act.master_service_slug}</div>
                        </Td>
                        <Td>
                          <span style={{ background: "#f1f5f9", color: "#475569", padding: "2px 8px", borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
                            {act.category_name || "General"}
                          </span>
                        </Td>
                        <Td>
                          <strong style={{ color: "#059669" }}>₹{act.custom_price}</strong>
                          {act.offer_price && <span style={{ fontSize: 11, color: "#94a3b8", textDecoration: "line-through", marginLeft: 6 }}>₹{act.offer_price}</span>}
                          <div style={{ fontSize: 11, color: "#64748b" }}>Base: ₹{act.base_price}</div>
                        </Td>
                        <Td>
                          <span style={{ fontWeight: 700, color: "#334155" }}>{act.delivery_time_days || 1} Days</span>
                        </Td>
                        <Td>
                          <button
                            type="button"
                            onClick={() => handleToggleAvailability(act)}
                            style={{
                              padding: "4px 10px",
                              borderRadius: 20,
                              border: 0,
                              background: act.is_available ? "#dcfce7" : "#fef2f2",
                              color: act.is_available ? "#15803d" : "#b42318",
                              fontWeight: 800,
                              fontSize: 12,
                              cursor: "pointer"
                            }}
                          >
                            {act.is_available ? "Online (Active)" : "Offline (Inactive)"}
                          </button>
                        </Td>
                        <Td>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button
                              type="button"
                              onClick={() => setEditingActivation(act)}
                              style={{ padding: "4px 10px", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: 6, cursor: "pointer", fontWeight: 700, fontSize: 12 }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeactivate(act)}
                              style={{ padding: "4px 10px", background: "#fef2f2", color: "#b42318", border: "1px solid #fecaca", borderRadius: 6, cursor: "pointer", fontWeight: 700, fontSize: 12 }}
                            >
                              Deactivate
                            </button>
                          </div>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PROPOSE CUSTOM SERVICE */}
      {activeTab === "custom_proposal" && (
        <div style={{ display: "grid", gap: "1.5rem" }}>
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", maxWidth: 700, margin: "0 auto", width: "100%" }}>
            <h3 style={{ margin: "0 0 0.5rem 0", color: "#0f172a" }}>Propose Custom Service Template</h3>
            <p style={{ margin: "0 0 1.25rem 0", color: "#64748b", fontSize: "0.85rem" }}>
              If a specialized master service template is missing, propose it here. Admin will review and publish it as an official template.
            </p>

            <form onSubmit={handleCustomProposalSubmit} style={{ display: "grid", gap: "1rem" }}>
              <label style={labelStyle}>
                Target Category <span style={{ color: "#ef4444" }}>*</span>
                <select
                  value={customForm.category_id}
                  onChange={(e) => setCustomForm({ ...customForm, category_id: e.target.value })}
                  required
                  style={inputStyle}
                >
                  <option value="">Select Category...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </label>

              <label style={labelStyle}>
                Proposed Service Title <span style={{ color: "#ef4444" }}>*</span>
                <input
                  type="text"
                  value={customForm.title}
                  onChange={(e) => setCustomForm({ ...customForm, title: e.target.value })}
                  placeholder="e.g. Virtual CFO Advisory & Compliance Audit"
                  required
                  style={inputStyle}
                />
              </label>

              <label style={labelStyle}>
                Service Scope, Deliverables & Requirements <span style={{ color: "#ef4444" }}>*</span>
                <textarea
                  value={customForm.description}
                  onChange={(e) => setCustomForm({ ...customForm, description: e.target.value })}
                  rows={4}
                  placeholder="Detailed description of deliverables, user document inputs, and workflow steps..."
                  required
                  style={inputStyle}
                />
              </label>

              <label style={labelStyle}>
                Proposed Offering Base Price (₹)
                <input
                  type="number"
                  value={customForm.proposed_price}
                  onChange={(e) => setCustomForm({ ...customForm, proposed_price: e.target.value })}
                  required
                  style={inputStyle}
                />
              </label>

              <button type="submit" disabled={submitting} style={{ padding: "0.85rem", background: "#059669", color: "#fff", border: 0, borderRadius: 8, fontWeight: 800, cursor: "pointer", marginTop: "0.5rem" }}>
                {submitting ? "Submitting Proposal..." : "Submit Proposal for Admin Review"}
              </button>
            </form>
          </div>

          {/* MY CUSTOM SERVICE PROPOSALS TABLE */}
          {customRequests.length > 0 && (
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "1.25rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <h4 style={{ margin: "0 0 1rem 0", color: "#0f172a" }}>My Custom Service Proposals</h4>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>
                      <Th>Proposed Title</Th>
                      <Th>Proposed Price</Th>
                      <Th>Status</Th>
                      <Th>Date</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {customRequests.map((req) => (
                      <tr key={req.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                        <Td>
                          <strong style={{ color: "#0f172a" }}>{req.title}</strong>
                          <div style={{ fontSize: 12, color: "#64748b" }}>{req.description?.substring(0, 80)}...</div>
                        </Td>
                        <Td>₹{req.proposed_price}</Td>
                        <Td>
                          <span style={{
                            background: req.status === "approved" ? "#dcfce7" : req.status === "rejected" ? "#fef2f2" : "#fef3c7",
                            color: req.status === "approved" ? "#15803d" : req.status === "rejected" ? "#b42318" : "#92400e",
                            padding: "2px 8px",
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 700
                          }}>
                            {(req.status || "PENDING").toUpperCase()}
                          </span>
                        </Td>
                        <Td>{req.created_at ? new Date(req.created_at).toLocaleDateString("en-IN") : "Recent"}</Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Th({ children }) {
  return <th style={{ padding: "0.85rem 1rem" }}>{children}</th>;
}

function Td({ children }) {
  return <td style={{ padding: "0.85rem 1rem", verticalAlign: "top" }}>{children}</td>;
}

const labelStyle = { display: "grid", gap: 6, fontWeight: 700, color: "#334155", fontSize: 13 };
const inputStyle = { width: "100%", padding: "0.65rem 0.75rem", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14 };
