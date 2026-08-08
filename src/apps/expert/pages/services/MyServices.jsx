import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2, FiPackage, FiFolder, FiCheckCircle, FiPauseCircle, FiPlayCircle, FiFileText, FiLayers, FiDollarSign, FiList, FiPhone, FiVideo, FiMessageSquare, FiUser } from "react-icons/fi";
import { useExpert } from "../../../../shared/context/ExpertContext";
import APP_CONFIG from "../../../../config/appConfig";
import * as S from "./MyServices.style";

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

// Scroll lock utility
const useScrollLock = (isLocked) => {
  useEffect(() => {
    if (isLocked) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
      
      return () => {
        const scrollY = document.body.style.top;
        document.body.style.overflow = originalStyle;
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
        }
      };
    }
  }, [isLocked]);
};

export default function MyServices() {
  const navigate = useNavigate();
  const { expertData, profileLoading } = useExpert();

  const [activations, setActivations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  // Edit Modal State & OS V2 Module States
  const [editingActivation, setEditingActivation] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [editForm, setEditForm] = useState({
    custom_price: "",
    offer_price: "",
    delivery_time_days: 1,
    custom_bio: "",
  });
  const [editDocSpecs, setEditDocSpecs] = useState([]);
  const [editFormFields, setEditFormFields] = useState([]);
  const [editWorkflowSteps, setEditWorkflowSteps] = useState([]);
  const [newDocLabel, setNewDocLabel] = useState("");
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newStepLabel, setNewStepLabel] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Call User Modal State
  const [callModalService, setCallModalService] = useState(null);
  const [expertBookings, setExpertBookings] = useState([]);
  const [userProfiles, setUserProfiles] = useState({});
  const [directUserId, setDirectUserId] = useState("");
  const [loadingBookings, setLoadingBookings] = useState(false);

  const handleOpenCallModal = async (act) => {
    setCallModalService(act);
    if (!expertData?.expertId) return;

    try {
      setLoadingBookings(true);
      const res = await apiFetch(`/api/bookings/expert/${expertData.expertId}`);
      if (res.ok) {
        const data = await res.json();
        const bList = data.data || [];
        setExpertBookings(bList);

        const uIds = [...new Set(bList.map((b) => b.user_id))];
        const uMap = {};
        await Promise.all(
          uIds.map(async (uid) => {
            try {
              const uRes = await apiFetch(`/api/user/public/${uid}`);
              if (uRes.ok) {
                const uData = await uRes.json();
                uMap[uid] = uData.data || uData;
              }
            } catch (e) {}
          })
        );
        setUserProfiles(uMap);
      }
    } catch (e) {
      console.error("Error fetching bookings for call:", e);
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchMyActivations = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiFetch("/api/expert-activations/my-services", { headers: authHeaders() });
      const data = await res.json();
      if (data.success) {
        setActivations(data.data || []);
      } else {
        setError(data.message || "Failed to load activated services.");
      }
    } catch (err) {
      console.error("Error fetching activated services:", err);
      setError("Failed to load services. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get correct image URL
  const getImageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/200x150?text=No+Image";
    if (img.startsWith("http")) return img;
    return `https://softmaxs.com/${img}`;
  };

  // Helper function to render deliverables
  const renderDeliverables = (deliverables) => {
    if (!deliverables) return null;
    if (Array.isArray(deliverables)) {
      return (
        <ul>
          {deliverables.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    }
    return <div dangerouslySetInnerHTML={{ __html: deliverables }} />;
  };

  useEffect(() => {
    fetchMyActivations();
  }, []);

  const handleToggleStatus = async (act) => {
    try {
      const nextStatus = act.is_available ? 0 : 1;
      const res = await apiFetch(`/api/expert-activations/${act.id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ is_available: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Service "${act.master_service_title}" status set to ${nextStatus ? "Active (Online)" : "Paused (Offline)"}.`);
        await fetchMyActivations();
      } else {
        alert(data.message || "Failed to update service status.");
      }
    } catch (err) {
      alert("Error updating service status.");
    }
  };

  const handleEditClick = (act) => {
    setEditingActivation(act);
    setActiveTab("overview");
    setEditForm({
      custom_price: act.custom_price || act.base_price || "",
      offer_price: act.offer_price || "",
      delivery_time_days: act.delivery_time_days || act.base_delivery_days || 1,
      custom_bio: act.custom_bio || "",
    });

    // 1. Documents Created by Admin
    let docs = [];
    if (act.custom_document_specs_json) {
      try {
        const parsed = typeof act.custom_document_specs_json === 'string' ? JSON.parse(act.custom_document_specs_json) : act.custom_document_specs_json;
        if (Array.isArray(parsed) && parsed.length > 0) docs = parsed;
      } catch (e) { console.error(e); }
    }
    if (docs.length === 0 && Array.isArray(act.document_specs)) {
      docs = act.document_specs;
    }
    setEditDocSpecs(docs.map(d => ({
      id: d.id || Math.random(),
      doc_type_key: d.doc_type_key || d.label?.toLowerCase().replace(/\s+/g, "_"),
      label: d.label,
      is_mandatory: Boolean(d.is_mandatory ?? 1),
      instructions: d.instructions || ""
    })));

    // 2. Form Fields Created by Admin
    let fields = [];
    if (act.custom_form_fields_json) {
      try {
        const parsed = typeof act.custom_form_fields_json === 'string' ? JSON.parse(act.custom_form_fields_json) : act.custom_form_fields_json;
        if (Array.isArray(parsed) && parsed.length > 0) fields = parsed;
      } catch (e) { console.error(e); }
    }
    if (fields.length === 0 && Array.isArray(act.form_fields)) {
      fields = act.form_fields;
    }
    setEditFormFields(fields.map(f => ({
      id: f.id || Math.random(),
      field_key: f.field_key || f.field_label?.toLowerCase().replace(/\s+/g, "_"),
      field_label: f.field_label,
      field_type: f.field_type || "text",
      is_required: Boolean(f.is_required ?? 0),
      placeholder: f.placeholder || ""
    })));

    // 3. Workflow Steps Created by Admin
    let steps = [];
    if (act.custom_workflow_steps_json) {
      try {
        const parsed = typeof act.custom_workflow_steps_json === 'string' ? JSON.parse(act.custom_workflow_steps_json) : act.custom_workflow_steps_json;
        if (Array.isArray(parsed) && parsed.length > 0) steps = parsed;
      } catch (e) { console.error(e); }
    }
    if (steps.length === 0 && Array.isArray(act.workflow_steps)) {
      steps = act.workflow_steps;
    }
    setEditWorkflowSteps(steps.map((st, i) => ({
      id: st.id || Math.random(),
      step_order: st.step_order || i + 1,
      step_label: st.step_label,
      estimated_days: st.estimated_days || 1,
      step_description: st.step_description || ""
    })));
  };

  // Helper functions for OS V2 modules editing
  const handleToggleDocMandatory = (idx) => {
    const copy = [...editDocSpecs]; copy[idx].is_mandatory = !copy[idx].is_mandatory; setEditDocSpecs(copy);
  };
  const handleAddCustomDoc = () => {
    if (!newDocLabel.trim()) return;
    setEditDocSpecs([...editDocSpecs, { id: Date.now(), doc_type_key: newDocLabel.toLowerCase().replace(/\s+/g, "_"), label: newDocLabel.trim(), is_mandatory: true, instructions: "" }]);
    setNewDocLabel("");
  };

  const handleToggleFieldRequired = (idx) => {
    const copy = [...editFormFields]; copy[idx].is_required = !copy[idx].is_required; setEditFormFields(copy);
  };
  const handleAddCustomField = () => {
    if (!newFieldLabel.trim()) return;
    setEditFormFields([...editFormFields, { id: Date.now(), field_key: newFieldLabel.toLowerCase().replace(/\s+/g, "_"), field_label: newFieldLabel.trim(), field_type: "text", is_required: false, placeholder: "" }]);
    setNewFieldLabel("");
  };

  const handleAddWorkflowStep = () => {
    if (!newStepLabel.trim()) return;
    setEditWorkflowSteps([...editWorkflowSteps, { id: Date.now(), step_order: editWorkflowSteps.length + 1, step_label: newStepLabel.trim(), estimated_days: 1, step_description: "" }]);
    setNewStepLabel("");
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingActivation) return;

    try {
      setSubmitting(true);
      const res = await apiFetch(`/api/expert-activations/${editingActivation.id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({
          custom_price: Number(editForm.custom_price),
          offer_price: editForm.offer_price ? Number(editForm.offer_price) : null,
          delivery_time_days: Number(editForm.delivery_time_days || 1),
          custom_bio: editForm.custom_bio,
          custom_document_specs: editDocSpecs,
          custom_form_fields: editFormFields,
          custom_workflow_steps: editWorkflowSteps
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Service customization & all Admin document/workflow details updated successfully!");
        setEditingActivation(null);
        await fetchMyActivations();
      } else {
        alert(data.message || "Failed to update service.");
      }
    } catch (err) {
      alert("Error updating service.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (act) => {
    if (!window.confirm(`Delete service activation for "${act.master_service_title}"?`)) return;
    try {
      const res = await apiFetch(`/api/expert-activations/${act.id}`, {
        method: "DELETE",
        headers: authHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Service activation deleted successfully.");
        await fetchMyActivations();
      } else {
        alert(data.message || "Unable to delete service activation.");
      }
    } catch (err) {
      alert(err.message || "Error deleting service activation.");
    }
  };

  if (profileLoading || loading) {
    return (
      <S.PageWrapper>
        <div style={{ padding: "3rem", textAlign: "center", color: "#64748b", fontWeight: 700 }}>Loading Activated Master Services...</div>
      </S.PageWrapper>
    );
  }

  return (
    <S.PageWrapper>
      <S.Container>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#f0f2f5", padding: "10px 16px", borderRadius: "12px", border: "1px solid #e9edef", marginBottom: "1rem" }}>
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
          <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, color: "#111b21" }}>My Services</h2>
        </div>

        <S.Header>
          <div>
            <h1>My Activated Master Services</h1>
            <p>Manage your localized pricing, Admin document specs, workflow steps, and online/offline availability.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/expert/services/activation")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "#2563eb",
              color: "#fff",
              padding: "10px 18px",
              borderRadius: "8px",
              fontWeight: "700",
              fontSize: "14px",
              border: 0,
              cursor: "pointer"
            }}
          >
            <FiPlus /> Activate New Master Service
          </button>
        </S.Header>

        {error && <div style={{ background: "#fef2f2", color: "#b42318", border: "1px solid #fecaca", padding: "1rem", borderRadius: 8, marginBottom: "1rem" }}>{error}</div>}
        {successMsg && <div style={{ background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0", padding: "1rem", borderRadius: 8, marginBottom: "1rem" }}>{successMsg}</div>}

        {activations.length === 0 ? (
          <S.EmptyState>
            <FiPackage size={44} />
            <p style={{ margin: "8px 0 16px", fontSize: "1.1rem", color: "#475569" }}>You haven't activated any master services yet.</p>
            <button
              type="button"
              onClick={() => navigate("/expert/services/activation")}
              style={{ padding: "0.75rem 1.5rem", background: "#2563eb", color: "#fff", border: 0, borderRadius: 8, fontWeight: "700", cursor: "pointer" }}
            >
              Browse & Activate Admin Master Services →
            </button>
          </S.EmptyState>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.25rem" }}>
            {activations.map((act) => (
              <div
                key={act.id}
                style={{
                  background: "#fff",
                  border: act.is_available ? "1px solid #e2e8f0" : "1px solid #fecaca",
                  borderRadius: 14,
                  padding: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 12,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.04)"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <h3 style={{ margin: 0, color: "#0f172a", fontSize: "1.15rem" }}>{act.master_service_title}</h3>
                    <span style={{
                      background: act.is_available ? "#dcfce7" : "#fef2f2",
                      color: act.is_available ? "#15803d" : "#b42318",
                      padding: "3px 10px",
                      borderRadius: 12,
                      fontSize: 11,
                      fontWeight: 800
                    }}>
                      {act.is_available ? "ACTIVE" : "PAUSED"}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: "#2563eb", fontWeight: 600, marginTop: 2 }}>/{act.master_service_slug}</div>

                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "8px 0" }}>
                    <span style={{ background: "#f1f5f9", color: "#475569", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
                      {act.category_name || "Category"}
                    </span>
                    {act.subcategory_name && (
                      <span style={{ background: "#ecfdf5", color: "#065f46", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
                        {act.subcategory_name}
                      </span>
                    )}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, margin: "6px 0", fontSize: 11, color: "#475569", background: "#f8fafc", padding: "6px 8px", borderRadius: 6 }}>
                    <div>📋 Admin Docs: <strong>{(act.document_specs || []).length} Required</strong></div>
                    <div>⚡ Workflow: <strong>{(act.workflow_steps || []).length} Steps</strong></div>
                  </div>

                  {act.custom_bio && (
                    <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: "0.85rem", lineHeight: 1.4 }}>
                      "{act.custom_bio}"
                    </p>
                  )}
                </div>

                <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "0.85rem", display: "grid", gap: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>Your Price</div>
                      <strong style={{ color: "#059669", fontSize: "1.2rem" }}>₹{act.custom_price}</strong>
                      {act.offer_price && <span style={{ fontSize: 11, color: "#94a3b8", textDecoration: "line-through", marginLeft: 6 }}>₹{act.offer_price}</span>}
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>SLA Delivery</div>
                      <strong style={{ color: "#1e293b", fontSize: "0.95rem" }}>{act.delivery_time_days || 1} Days</strong>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(act)}
                      style={{
                        flex: 1,
                        padding: "6px",
                        background: act.is_available ? "#fef3c7" : "#dcfce7",
                        color: act.is_available ? "#92400e" : "#15803d",
                        border: 0,
                        borderRadius: 6,
                        fontWeight: 700,
                        fontSize: 12,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 4
                      }}
                    >
                      {act.is_available ? <><FiPauseCircle /> Pause</> : <><FiPlayCircle /> Resume</>}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditClick(act)}
                      style={{ flex: 1.2, padding: "6px", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}
                    >
                      <FiEdit2 /> Edit Docs & Modules
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(act)}
                      style={{ padding: "6px 10px", background: "#fef2f2", color: "#b42318", border: "1px solid #fecaca", borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: "pointer" }}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FULL EDIT MODAL WITH ALL 4 ADMIN OS MODULES */}
        {editingActivation && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15,23,42,0.65)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100000, padding: "12px", boxSizing: "border-box" }}>
            <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 750, maxHeight: "min(90vh, 90dvh)", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", boxSizing: "border-box" }}>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #f1f5f9", paddingBottom: "1rem" }}>
                <div>
                  <h3 style={{ margin: 0, color: "#0f172a", fontSize: "1.3rem" }}>Manage Master Service: {editingActivation.master_service_title}</h3>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Admin Base Price: ₹{editingActivation.base_price} • GST {editingActivation.gst_percent || 18}% • Commission {editingActivation.commission_percent || 0}%</div>
                </div>
                <button type="button" onClick={() => setEditingActivation(null)} style={{ background: "#f1f5f9", border: 0, padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontWeight: 700 }}>✕</button>
              </div>

              {/* TABS FOR ALL 4 ADMIN MODULES */}
              <div style={{ display: "flex", borderBottom: "2px solid #e2e8f0", gap: 8, flexWrap: "wrap" }}>
                {[
                  { id: "overview", label: "⚙️ Overview & Pricing" },
                  { id: "documents", label: `📄 Admin Docs (${editDocSpecs.length})` },
                  { id: "form", label: `📋 Form Fields (${editFormFields.length})` },
                  { id: "workflow", label: `⚡ Workflow (${editWorkflowSteps.length})` },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: "8px 12px",
                      border: 0,
                      borderBottom: activeTab === tab.id ? "3px solid #2563eb" : "3px solid transparent",
                      background: "transparent",
                      color: activeTab === tab.id ? "#2563eb" : "#64748b",
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: "pointer"
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleEditSubmit} style={{ display: "grid", gap: "1rem" }}>
                
                {/* TAB 1: OVERVIEW & PRICING */}
                {activeTab === "overview" && (
                  <div style={{ display: "grid", gap: "1rem" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <label style={labelStyle}>
                        Your Custom Price (₹)
                        <input
                          type="number"
                          value={editForm.custom_price}
                          onChange={(e) => setEditForm({ ...editForm, custom_price: e.target.value })}
                          required
                          style={inputStyle}
                        />
                      </label>
                      <label style={labelStyle}>
                        Offer Price (₹)
                        <input
                          type="number"
                          value={editForm.offer_price}
                          onChange={(e) => setEditForm({ ...editForm, offer_price: e.target.value })}
                          style={inputStyle}
                        />
                      </label>
                    </div>

                    <label style={labelStyle}>
                      Delivery SLA (Days)
                      <input
                        type="number"
                        value={editForm.delivery_time_days}
                        onChange={(e) => setEditForm({ ...editForm, delivery_time_days: e.target.value })}
                        required
                        style={inputStyle}
                      />
                    </label>

                    <label style={labelStyle}>
                      Custom Service Bio / Pitch
                      <textarea
                        value={editForm.custom_bio}
                        onChange={(e) => setEditForm({ ...editForm, custom_bio: e.target.value })}
                        rows={3}
                        style={inputStyle}
                      />
                    </label>

                    {editingActivation.full_description && (
                      <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "0.85rem", borderRadius: 8 }}>
                        <strong style={{ fontSize: 12, color: "#334155" }}>Admin Service Description & Scope:</strong>
                        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b", lineHeight: 1.4 }}>{editingActivation.full_description}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: ADMIN DOCUMENTS SPECIFICATIONS */}
                {activeTab === "documents" && (
                  <div style={{ display: "grid", gap: "0.75rem" }}>
                    <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>Admin document specifications required from users. Edit instructions or add expert document requirements.</p>
                    {editDocSpecs.map((doc, idx) => (
                      <div key={doc.id || idx} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "0.75rem", display: "grid", gap: 6 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontWeight: 700, color: "#1e293b", fontSize: 13 }}>📄 {doc.label}</span>
                          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            <label style={{ fontSize: 12, color: "#334155", display: "flex", gap: 4, alignItems: "center", cursor: "pointer" }}>
                              <input type="checkbox" checked={doc.is_mandatory} onChange={() => handleToggleDocMandatory(idx)} /> Mandatory
                            </label>
                            <button type="button" onClick={() => setEditDocSpecs(editDocSpecs.filter((_, i) => i !== idx))} style={{ background: "#fef2f2", color: "#b42318", border: 0, padding: "2px 6px", borderRadius: 4, fontSize: 11, cursor: "pointer" }}>Remove</button>
                          </div>
                        </div>
                        <input
                          type="text"
                          placeholder="Custom expert instructions for this document..."
                          value={doc.instructions}
                          onChange={(e) => { const copy = [...editDocSpecs]; copy[idx].instructions = e.target.value; setEditDocSpecs(copy); }}
                          style={{ ...inputStyle, fontSize: 12, padding: "4px 8px" }}
                        />
                      </div>
                    ))}
                    <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                      <input
                        type="text"
                        placeholder="Add custom document specification..."
                        value={newDocLabel}
                        onChange={(e) => setNewDocLabel(e.target.value)}
                        style={{ ...inputStyle, flex: 1, fontSize: 13 }}
                      />
                      <button type="button" onClick={handleAddCustomDoc} style={{ padding: "6px 14px", background: "#059669", color: "#fff", border: 0, borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>+ Add Doc</button>
                    </div>
                  </div>
                )}

                {/* TAB 3: ADMIN DYNAMIC FORM FIELDS */}
                {activeTab === "form" && (
                  <div style={{ display: "grid", gap: "0.75rem" }}>
                    <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>Admin user submission input fields. Customize labels or required flags.</p>
                    {editFormFields.map((f, idx) => (
                      <div key={f.id || idx} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <strong style={{ fontSize: 13, color: "#1e293b" }}>📋 {f.field_label}</strong>
                          <span style={{ fontSize: 11, color: "#64748b", marginLeft: 6 }}>({f.field_type})</span>
                        </div>
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          <label style={{ fontSize: 12, color: "#334155", display: "flex", gap: 4, alignItems: "center", cursor: "pointer" }}>
                            <input type="checkbox" checked={f.is_required} onChange={() => handleToggleFieldRequired(idx)} /> Required
                          </label>
                          <button type="button" onClick={() => setEditFormFields(editFormFields.filter((_, i) => i !== idx))} style={{ background: "#fef2f2", color: "#b42318", border: 0, padding: "2px 6px", borderRadius: 4, fontSize: 11, cursor: "pointer" }}>Remove</button>
                        </div>
                      </div>
                    ))}
                    <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                      <input
                        type="text"
                        placeholder="Add custom input field label..."
                        value={newFieldLabel}
                        onChange={(e) => setNewFieldLabel(e.target.value)}
                        style={{ ...inputStyle, flex: 1, fontSize: 13 }}
                      />
                      <button type="button" onClick={handleAddCustomField} style={{ padding: "6px 14px", background: "#2563eb", color: "#fff", border: 0, borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>+ Add Field</button>
                    </div>
                  </div>
                )}

                {/* TAB 4: ADMIN VISUAL WORKFLOW STEPS */}
                {activeTab === "workflow" && (
                  <div style={{ display: "grid", gap: "0.75rem" }}>
                    <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>Admin execution steps and milestone triggers.</p>
                    {editWorkflowSteps.map((st, idx) => (
                      <div key={st.id || idx} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <strong style={{ fontSize: 13, color: "#1e293b" }}>Step {st.step_order || idx+1}: {st.step_label}</strong>
                          <div style={{ fontSize: 11, color: "#64748b" }}>Turnaround SLA: {st.estimated_days || 1} Days</div>
                        </div>
                        <button type="button" onClick={() => setEditWorkflowSteps(editWorkflowSteps.filter((_, i) => i !== idx))} style={{ background: "#fef2f2", color: "#b42318", border: 0, padding: "2px 6px", borderRadius: 4, fontSize: 11, cursor: "pointer" }}>Remove</button>
                      </div>
                    ))}
                    <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                      <input
                        type="text"
                        placeholder="Add custom execution step..."
                        value={newStepLabel}
                        onChange={(e) => setNewStepLabel(e.target.value)}
                        style={{ ...inputStyle, flex: 1, fontSize: 13 }}
                      />
                      <button type="button" onClick={handleAddWorkflowStep} style={{ padding: "6px 14px", background: "#ca8a04", color: "#fff", border: 0, borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>+ Add Step</button>
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: "0.5rem", borderTop: "1px solid #f1f5f9", paddingTop: "1rem" }}>
                  <button type="button" onClick={() => setEditingActivation(null)} style={{ padding: "0.65rem 1.25rem", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
                  <button type="submit" disabled={submitting} style={{ padding: "0.65rem 1.5rem", background: "#2563eb", color: "#fff", border: 0, borderRadius: 8, fontWeight: 800, cursor: "pointer" }}>
                    {submitting ? "Saving..." : "Save Service & Document Details"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* CALL USER / CONTACT CLIENTS MODAL */}
        {callModalService && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15,23,42,0.65)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100000, padding: "12px", boxSizing: "border-box" }}>
            <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 600, maxHeight: "min(85vh, 85dvh)", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", boxSizing: "border-box" }}>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9", paddingBottom: "1rem" }}>
                <div>
                  <h3 style={{ margin: 0, color: "#0f172a", fontSize: "1.25rem", display: "flex", alignItems: "center", gap: 8 }}>
                    <FiPhone color="#059669" /> Call Clients — {callModalService.master_service_title}
                  </h3>
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b" }}>Initiate voice call, video call, or chat with users for this service.</p>
                </div>
                <button type="button" onClick={() => setCallModalService(null)} style={{ background: "#f1f5f9", border: 0, padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontWeight: 700 }}>✕</button>
              </div>

              {/* QUICK DIRECT USER CALL INPUT */}
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "1rem", borderRadius: 10, display: "grid", gap: 8 }}>
                <strong style={{ fontSize: 13, color: "#334155" }}>⚡ Direct Call / Search User ID:</strong>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="number"
                    placeholder="Enter Client User ID..."
                    value={directUserId}
                    onChange={(e) => setDirectUserId(e.target.value)}
                    style={{ ...inputStyle, flex: 1, fontSize: 13 }}
                  />
                  <button
                    type="button"
                    disabled={!directUserId}
                    onClick={() => {
                      if (directUserId) {
                        setCallModalService(null);
                        navigate(`/expert/voice-call/${directUserId}`);
                      }
                    }}
                    style={{ padding: "6px 14px", background: "#059669", color: "#fff", border: 0, borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: directUserId ? "pointer" : "not-allowed", opacity: directUserId ? 1 : 0.6, display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <FiPhone size={13} /> Voice Call
                  </button>
                  <button
                    type="button"
                    disabled={!directUserId}
                    onClick={() => {
                      if (directUserId) {
                        setCallModalService(null);
                        navigate(`/expert/video-call/${directUserId}`);
                      }
                    }}
                    style={{ padding: "6px 14px", background: "#2563eb", color: "#fff", border: 0, borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: directUserId ? "pointer" : "not-allowed", opacity: directUserId ? 1 : 0.6, display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <FiVideo size={13} /> Video Call
                  </button>
                </div>
              </div>

              {/* SERVICE CLIENT BOOKINGS LIST */}
              <div>
                <h4 style={{ margin: "0 0 10px", fontSize: 14, color: "#1e293b" }}>Clients Who Ordered This Service</h4>
                
                {loadingBookings ? (
                  <div style={{ textAlign: "center", padding: "1.5rem", color: "#64748b", fontSize: 13 }}>Loading client details...</div>
                ) : (() => {
                  const serviceBookings = expertBookings.filter(b => Number(b.master_service_id) === Number(callModalService.master_service_id));
                  const listToRender = serviceBookings.length > 0 ? serviceBookings : expertBookings;

                  if (listToRender.length === 0) {
                    return (
                      <div style={{ background: "#fffbe6", border: "1px solid #ffe58f", padding: "1rem", borderRadius: 8, textAlign: "center", fontSize: 13, color: "#d48806" }}>
                        No active bookings yet. You can use the Direct Call input above with any Client User ID.
                      </div>
                    );
                  }

                  return (
                    <div style={{ display: "grid", gap: 10 }}>
                      {listToRender.map((b) => {
                        const uProfile = userProfiles[b.user_id] || {};
                        const uName = uProfile.name || uProfile.full_name || `Client #${b.user_id}`;
                        const uPhone = uProfile.phone || b.phone || "";

                        return (
                          <div key={b.id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "0.85rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
                            <div>
                              <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                                <FiUser size={13} color="#2563eb" /> {uName}
                              </div>
                              <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                                Order #{b.id} • Booking Date: {b.booking_date ? new Date(b.booking_date).toLocaleDateString() : "Recent"}
                              </div>
                              {uPhone && <div style={{ fontSize: 11, color: "#059669", marginTop: 2, fontWeight: 600 }}>📞 {uPhone}</div>}
                            </div>

                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setCallModalService(null);
                                  navigate(`/expert/voice-call/${b.user_id}`);
                                }}
                                style={{ padding: "6px 10px", background: "#dcfce7", color: "#15803d", border: "1px solid #bbf7d0", borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                                title="Voice Call"
                              >
                                <FiPhone size={12} /> Call
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setCallModalService(null);
                                  navigate(`/expert/video-call/${b.user_id}`);
                                }}
                                style={{ padding: "6px 10px", background: "#dbeafe", color: "#1e40af", border: "1px solid #bfdbfe", borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                                title="Video Call"
                              >
                                <FiVideo size={12} /> Video
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setCallModalService(null);
                                  const expId = b.expert_id || expertData?.expertId || expertData?.id;
                                  navigate(`/expert/chat/chat_${b.user_id}_${expId}`);
                                }}
                                style={{ padding: "6px 10px", background: "#f1f5f9", color: "#334155", border: "1px solid #cbd5e1", borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                                title="Chat"
                              >
                                <FiMessageSquare size={12} /> Chat
                              </button>
                              {uPhone && (
                                <a
                                  href={`tel:${uPhone}`}
                                  style={{ padding: "6px 10px", background: "#fef3c7", color: "#92400e", border: "1px solid #fde68a", borderRadius: 6, fontWeight: 700, fontSize: 12, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}
                                  title="Cellular Phone Call"
                                >
                                  📱 Phone
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

            </div>
          </div>
        )}
      </S.Container>
    </S.PageWrapper>
  );
}

const labelStyle = { display: "grid", gap: 4, fontWeight: 700, color: "#334155", fontSize: 13 };
const inputStyle = { width: "100%", padding: "0.6rem 0.75rem", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, background: "#fff" };
