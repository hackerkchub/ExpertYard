import React, { useState, useEffect } from "react";
import APP_CONFIG from "../../../../config/appConfig";

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

export default function ServiceActivationModal({ masterService, isOpen, onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState("pricing");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    custom_price: 999,
    offer_price: "",
    delivery_time_days: 1,
    custom_bio: "",
    portfolio_url: "",
  });

  // OS V2 Module States
  const [docSpecs, setDocSpecs] = useState([]);
  const [formFields, setFormFields] = useState([]);
  const [workflowSteps, setWorkflowSteps] = useState([]);
  const [newDocLabel, setNewDocLabel] = useState("");
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newStepLabel, setNewStepLabel] = useState("");

  useEffect(() => {
    if (masterService) {
      const defaultPrice = masterService.custom_price || masterService.base_price || 999;
      setForm({
        custom_price: defaultPrice,
        offer_price: masterService.offer_price || Math.round(defaultPrice * 0.9),
        delivery_time_days: masterService.delivery_time_days || masterService.min_delivery_days || 1,
        custom_bio: masterService.custom_bio || "",
        portfolio_url: "",
      });

      // 1. Documents
      let baseDocs = Array.isArray(masterService.document_specs) ? masterService.document_specs : [];
      if (masterService.custom_document_specs_json) {
        try {
          const parsed = typeof masterService.custom_document_specs_json === 'string' ? JSON.parse(masterService.custom_document_specs_json) : masterService.custom_document_specs_json;
          if (Array.isArray(parsed) && parsed.length > 0) baseDocs = parsed;
        } catch (e) { console.error(e); }
      }
      setDocSpecs(baseDocs.map(d => ({
        id: d.id || Math.random(),
        doc_type_key: d.doc_type_key || d.label?.toLowerCase().replace(/\s+/g, "_"),
        label: d.label,
        is_mandatory: Boolean(d.is_mandatory ?? 1),
        instructions: d.instructions || ""
      })));

      // 2. Form Fields
      let baseFields = Array.isArray(masterService.form_fields) ? masterService.form_fields : [];
      if (masterService.custom_form_fields_json) {
        try {
          const parsed = typeof masterService.custom_form_fields_json === 'string' ? JSON.parse(masterService.custom_form_fields_json) : masterService.custom_form_fields_json;
          if (Array.isArray(parsed) && parsed.length > 0) baseFields = parsed;
        } catch (e) { console.error(e); }
      }
      setFormFields(baseFields.map(f => ({
        id: f.id || Math.random(),
        field_key: f.field_key || f.field_label?.toLowerCase().replace(/\s+/g, "_"),
        field_label: f.field_label,
        field_type: f.field_type || "text",
        is_required: Boolean(f.is_required ?? 0),
        placeholder: f.placeholder || ""
      })));

      // 3. Workflow Steps
      let baseSteps = Array.isArray(masterService.workflow_steps) ? masterService.workflow_steps : [];
      if (masterService.custom_workflow_steps_json) {
        try {
          const parsed = typeof masterService.custom_workflow_steps_json === 'string' ? JSON.parse(masterService.custom_workflow_steps_json) : masterService.custom_workflow_steps_json;
          if (Array.isArray(parsed) && parsed.length > 0) baseSteps = parsed;
        } catch (e) { console.error(e); }
      }
      setWorkflowSteps(baseSteps.map((st, i) => ({
        id: st.id || Math.random(),
        step_order: st.step_order || i + 1,
        step_label: st.step_label,
        estimated_days: st.estimated_days || 1,
        step_description: st.step_description || ""
      })));

      setError("");
    }
  }, [masterService]);

  if (!isOpen || !masterService) return null;

  const allowPriceOverride = masterService.allow_price_override ?? true;
  const allowSlaOverride = masterService.allow_sla_override ?? true;
  const allowCustomBio = masterService.allow_custom_bio ?? true;
  const allowPortfolioUpload = masterService.allow_portfolio_upload ?? true;

  const minPrice = masterService.min_price;
  const maxPrice = masterService.max_price;
  const minDeliveryDays = masterService.min_delivery_days || 1;

  // Document Helpers
  const handleToggleDocMandatory = (idx) => {
    const copy = [...docSpecs]; copy[idx].is_mandatory = !copy[idx].is_mandatory; setDocSpecs(copy);
  };
  const handleAddCustomDoc = () => {
    if (!newDocLabel.trim()) return;
    setDocSpecs([...docSpecs, { id: Date.now(), doc_type_key: newDocLabel.toLowerCase().replace(/\s+/g, "_"), label: newDocLabel.trim(), is_mandatory: true, instructions: "" }]);
    setNewDocLabel("");
  };

  // Form Field Helpers
  const handleToggleFieldRequired = (idx) => {
    const copy = [...formFields]; copy[idx].is_required = !copy[idx].is_required; setFormFields(copy);
  };
  const handleAddCustomField = () => {
    if (!newFieldLabel.trim()) return;
    setFormFields([...formFields, { id: Date.now(), field_key: newFieldLabel.toLowerCase().replace(/\s+/g, "_"), field_label: newFieldLabel.trim(), field_type: "text", is_required: false, placeholder: "" }]);
    setNewFieldLabel("");
  };

  // Workflow Helpers
  const handleAddWorkflowStep = () => {
    if (!newStepLabel.trim()) return;
    setWorkflowSteps([...workflowSteps, { id: Date.now(), step_order: workflowSteps.length + 1, step_label: newStepLabel.trim(), estimated_days: 1, step_description: "" }]);
    setNewStepLabel("");
  };

  // Pricing Engine Calculations
  const sellingPrice = Number(form.custom_price) || 0;
  const commPercent = Number(masterService.commission_percent || 0);
  const gstPercent = Number(masterService.gst_percent || 18);
  const platformFee = Math.round((sellingPrice * commPercent) / 100);
  const gstAmount = Math.round((sellingPrice * gstPercent) / 100);
  const netPayout = Math.max(0, sellingPrice - platformFee);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError("");

      const priceVal = Number(form.custom_price);
      const deliveryVal = Number(form.delivery_time_days);

      if (allowPriceOverride) {
        if (minPrice !== null && minPrice !== undefined && priceVal < Number(minPrice)) {
          setError(`Price cannot be lower than minimum platform limit ₹${minPrice}`);
          setSubmitting(false);
          return;
        }
        if (maxPrice !== null && maxPrice !== undefined && priceVal > Number(maxPrice)) {
          setError(`Price cannot exceed maximum platform limit ₹${maxPrice}`);
          setSubmitting(false);
          return;
        }
      }

      if (allowSlaOverride && minDeliveryDays && deliveryVal < Number(minDeliveryDays)) {
        setError(`Delivery turnaround cannot be faster than ${minDeliveryDays} days.`);
        setSubmitting(false);
        return;
      }

      const res = await apiFetch("/api/expert/service-activations", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          master_service_id: masterService.id,
          custom_price: allowPriceOverride ? priceVal : masterService.base_price,
          offer_price: form.offer_price ? Number(form.offer_price) : null,
          delivery_time_days: allowSlaOverride ? deliveryVal : masterService.delivery_time_days,
          custom_bio: allowCustomBio ? form.custom_bio : "",
          portfolio: form.portfolio_url ? [form.portfolio_url] : [],
          custom_document_specs: docSpecs,
          custom_form_fields: formFields,
          custom_workflow_steps: workflowSteps,
          custom_pricing_rules: { base_price: masterService.base_price, selling_price: priceVal, platform_commission: commPercent, gst_percent: gstPercent, net_payout: netPayout },
          is_available: 1
        })
      });

      const data = await res.json();
      if (data.success) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setError(data.message || "Failed to activate service.");
      }
    } catch (err) {
      setError(err.message || "Error activating service.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "1rem" }}>
      <div style={{ background: "#fff", border: "1px solid #cbd5e1", borderRadius: 16, width: "100%", maxWidth: 750, maxHeight: "90vh", overflowY: "auto", padding: "1.75rem", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", display: "grid", gap: "1.25rem" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #f1f5f9", paddingBottom: "1rem" }}>
          <div>
            <h3 style={{ margin: 0, color: "#0f172a", fontSize: "1.35rem" }}>Activate Service: {masterService.title}</h3>
            <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "0.85rem" }}>
              Configure all 4 Service OS V2 modules synchronized with Admin.
            </p>
          </div>
          <button type="button" onClick={onClose} style={{ background: "#f1f5f9", border: 0, padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontWeight: 700 }}>✕</button>
        </div>

        {error && <div style={{ background: "#fef2f2", color: "#b42318", border: "1px solid #fecaca", padding: "0.75rem 1rem", borderRadius: 8, fontSize: 13 }}>{error}</div>}

        {/* 4 OPERATING MODULE TABS */}
        <div style={{ display: "flex", borderBottom: "2px solid #e2e8f0", gap: 12 }}>
          {[
            { id: "pricing", label: "💰 Pricing Engine" },
            { id: "documents", label: `📄 Documents (${docSpecs.length})` },
            { id: "form", label: `📋 Form Fields (${formFields.length})` },
            { id: "workflow", label: `⚡ Workflow (${workflowSteps.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "8px 14px",
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

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.1rem" }}>
          {/* TAB 1: PRICING ENGINE */}
          {activeTab === "pricing" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: 10, border: "1px solid #e2e8f0", display: "grid", gap: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ fontWeight: 700, color: "#1e293b" }}>Pricing Engine & Commission Simulator</span>
                  <span style={{ color: "#64748b" }}>Platform Base: <strong>₹{masterService.base_price}</strong></span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <label style={labelStyle}>
                    Your Selling Price (₹)
                    <input
                      type="number"
                      value={form.custom_price}
                      disabled={!allowPriceOverride}
                      onChange={(e) => setForm({ ...form, custom_price: e.target.value })}
                      style={inputStyle}
                      required
                    />
                  </label>
                  <label style={labelStyle}>
                    Special Offer Price (₹)
                    <input
                      type="number"
                      value={form.offer_price}
                      disabled={!allowPriceOverride}
                      onChange={(e) => setForm({ ...form, offer_price: e.target.value })}
                      style={inputStyle}
                      placeholder="Optional discount price"
                    />
                  </label>
                </div>

                {/* LIVE NET PAYOUT ESTIMATOR */}
                <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "0.85rem", borderRadius: 8, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", fontSize: 12 }}>
                  <div><span style={{ color: "#64748b" }}>Platform Comm ({commPercent}%):</span> <strong style={{ color: "#1e293b", display: "block" }}>₹{platformFee}</strong></div>
                  <div><span style={{ color: "#64748b" }}>GST ({gstPercent}%):</span> <strong style={{ color: "#1e293b", display: "block" }}>₹{gstAmount}</strong></div>
                  <div><span style={{ color: "#15803d", fontWeight: 700 }}>Estimated Net Payout:</span> <strong style={{ color: "#15803d", fontSize: 15, display: "block" }}>₹{netPayout}</strong></div>
                </div>
              </div>

              <label style={labelStyle}>
                Guaranteed Delivery SLA (Days)
                <input
                  type="number"
                  value={form.delivery_time_days}
                  disabled={!allowSlaOverride}
                  onChange={(e) => setForm({ ...form, delivery_time_days: e.target.value })}
                  style={inputStyle}
                  required
                />
              </label>

              {allowCustomBio && (
                <label style={labelStyle}>
                  Personalized Service Bio
                  <textarea value={form.custom_bio} onChange={(e) => setForm({ ...form, custom_bio: e.target.value })} rows={2} style={inputStyle} />
                </label>
              )}
            </div>
          )}

          {/* TAB 2: DOCUMENT REQUIREMENTS */}
          {activeTab === "documents" && (
            <div style={{ display: "grid", gap: "0.75rem" }}>
              <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>Customize document specifications required from the user during order placement.</p>
              {docSpecs.map((doc, idx) => (
                <div key={doc.id || idx} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "0.75rem", display: "grid", gap: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 700, color: "#1e293b", fontSize: 13 }}>📄 {doc.label}</span>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <label style={{ fontSize: 12, color: "#334155", display: "flex", gap: 4, alignItems: "center", cursor: "pointer" }}>
                        <input type="checkbox" checked={doc.is_mandatory} onChange={() => handleToggleDocMandatory(idx)} /> Mandatory
                      </label>
                      <button type="button" onClick={() => setDocSpecs(docSpecs.filter((_, i) => i !== idx))} style={{ background: "#fef2f2", color: "#b42318", border: 0, padding: "2px 6px", borderRadius: 4, fontSize: 11, cursor: "pointer" }}>Remove</button>
                    </div>
                  </div>
                  <input type="text" placeholder="Instructions..." value={doc.instructions} onChange={(e) => { const copy = [...docSpecs]; copy[idx].instructions = e.target.value; setDocSpecs(copy); }} style={{ ...inputStyle, fontSize: 12, padding: "4px 8px" }} />
                </div>
              ))}
              <div style={{ display: "flex", gap: 8 }}>
                <input type="text" placeholder="Add required document name..." value={newDocLabel} onChange={(e) => setNewDocLabel(e.target.value)} style={{ ...inputStyle, flex: 1, fontSize: 13 }} />
                <button type="button" onClick={handleAddCustomDoc} style={{ padding: "6px 14px", background: "#059669", color: "#fff", border: 0, borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>+ Add Doc</button>
              </div>
            </div>
          )}

          {/* TAB 3: DYNAMIC FORM BUILDER */}
          {activeTab === "form" && (
            <div style={{ display: "grid", gap: "0.75rem" }}>
              <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>Inspect & configure user submission input fields.</p>
              {formFields.map((f, idx) => (
                <div key={f.id || idx} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong style={{ fontSize: 13, color: "#1e293b" }}>📋 {f.field_label}</strong>
                    <span style={{ fontSize: 11, color: "#64748b", marginLeft: 6 }}>({f.field_type})</span>
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <label style={{ fontSize: 12, color: "#334155", display: "flex", gap: 4, alignItems: "center", cursor: "pointer" }}>
                      <input type="checkbox" checked={f.is_required} onChange={() => handleToggleFieldRequired(idx)} /> Required
                    </label>
                    <button type="button" onClick={() => setFormFields(formFields.filter((_, i) => i !== idx))} style={{ background: "#fef2f2", color: "#b42318", border: 0, padding: "2px 6px", borderRadius: 4, fontSize: 11, cursor: "pointer" }}>Remove</button>
                  </div>
                </div>
              ))}
              <div style={{ display: "flex", gap: 8 }}>
                <input type="text" placeholder="Add custom input field label..." value={newFieldLabel} onChange={(e) => setNewFieldLabel(e.target.value)} style={{ ...inputStyle, flex: 1, fontSize: 13 }} />
                <button type="button" onClick={handleAddCustomField} style={{ padding: "6px 14px", background: "#2563eb", color: "#fff", border: 0, borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>+ Add Field</button>
              </div>
            </div>
          )}

          {/* TAB 4: VISUAL WORKFLOW BUILDER */}
          {activeTab === "workflow" && (
            <div style={{ display: "grid", gap: "0.75rem" }}>
              <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>Execution steps, milestone triggers, and SLA turnaround timeline.</p>
              {workflowSteps.map((st, idx) => (
                <div key={st.id || idx} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong style={{ fontSize: 13, color: "#1e293b" }}>Step {st.step_order || idx+1}: {st.step_label}</strong>
                    <div style={{ fontSize: 11, color: "#64748b" }}>Est turnaround: {st.estimated_days || 1} Days</div>
                  </div>
                  <button type="button" onClick={() => setWorkflowSteps(workflowSteps.filter((_, i) => i !== idx))} style={{ background: "#fef2f2", color: "#b42318", border: 0, padding: "2px 6px", borderRadius: 4, fontSize: 11, cursor: "pointer" }}>Remove</button>
                </div>
              ))}
              <div style={{ display: "flex", gap: 8 }}>
                <input type="text" placeholder="Add workflow step label..." value={newStepLabel} onChange={(e) => setNewStepLabel(e.target.value)} style={{ ...inputStyle, flex: 1, fontSize: 13 }} />
                <button type="button" onClick={handleAddWorkflowStep} style={{ padding: "6px 14px", background: "#ca8a04", color: "#fff", border: 0, borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>+ Add Step</button>
              </div>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: "0.5rem", borderTop: "1px solid #f1f5f9", paddingTop: "1rem" }}>
            <button type="button" onClick={onClose} style={{ padding: "0.65rem 1.25rem", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
            <button type="submit" disabled={submitting} style={{ padding: "0.65rem 1.5rem", background: "#2563eb", color: "#fff", border: 0, borderRadius: 8, fontWeight: 800, cursor: "pointer" }}>
              {submitting ? "Activating..." : "🚀 Save & Confirm Activation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const labelStyle = { display: "grid", gap: 4, fontWeight: 700, color: "#334155", fontSize: 13 };
const inputStyle = { width: "100%", padding: "0.6rem 0.75rem", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, background: "#fff" };
