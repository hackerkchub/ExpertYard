import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import APP_CONFIG from "../../../config/appConfig";

const ACTION_TYPES = [
  { value: "NONE", label: "None (Standard Step)" },
  { value: "UPLOAD_DOCUMENTS", label: "Upload Required Documents" },
  { value: "FILL_FORM", label: "Fill Form Inputs" },
  { value: "EXPERT_DELIVER_FILE", label: "Expert Deliver Work Files" },
  { value: "USER_APPROVE_DELIVERY", label: "User Approve Delivery & Complete" },
];

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

export default function AdminWorkflowBuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [masterServices, setMasterServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(id || "");
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);

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
      .catch((err) => console.error("Error loading master services:", err));
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
        if (data.success && data.data?.workflow_steps?.length > 0) {
          setSteps(data.data.workflow_steps);
        } else {
          // Default initial workflow
          setSteps([
            {
              step_key: "SUBMITTED",
              step_label: "Requirement Submitted",
              step_order: 1,
              allowed_roles_json: ["USER", "EXPERT", "ADMIN"],
              required_action: "UPLOAD_DOCUMENTS",
              permission_matrix_json: { chat: true, voice_call: true, video_call: false, upload_docs: true, delivery: false },
            },
            {
              step_key: "IN_PROGRESS",
              step_label: "Expert Processing",
              step_order: 2,
              allowed_roles_json: ["EXPERT", "ADMIN"],
              required_action: "EXPERT_DELIVER_FILE",
              permission_matrix_json: { chat: true, voice_call: true, video_call: true, upload_docs: true, delivery: true },
            },
            {
              step_key: "COMPLETED",
              step_label: "Order Delivered & Approved",
              step_order: 3,
              allowed_roles_json: ["USER", "EXPERT", "ADMIN"],
              required_action: "USER_APPROVE_DELIVERY",
              permission_matrix_json: { chat: true, voice_call: false, video_call: false, upload_docs: false, delivery: false },
            },
          ]);
        }
      })
      .catch((err) => console.error("Error loading workflow steps:", err))
      .finally(() => setLoading(false));
  }, [selectedServiceId]);

  const addStep = () => {
    const nextOrder = steps.length + 1;
    const newStep = {
      step_key: `STEP_${nextOrder}`,
      step_label: `Step ${nextOrder}`,
      step_order: nextOrder,
      allowed_roles_json: ["EXPERT", "ADMIN"],
      required_action: "NONE",
      permission_matrix_json: { chat: true, voice_call: true, video_call: true, upload_docs: true, delivery: false },
    };
    setSteps([...steps, newStep]);
    setSelectedStepIndex(steps.length);
  };

  const removeStep = (index) => {
    const updated = steps.filter((_, i) => i !== index).map((s, i) => ({ ...s, step_order: i + 1 }));
    setSteps(updated);
    if (selectedStepIndex >= updated.length) {
      setSelectedStepIndex(Math.max(0, updated.length - 1));
    }
  };

  const updateSelectedStep = (key, value) => {
    const updated = [...steps];
    updated[selectedStepIndex] = { ...updated[selectedStepIndex], [key]: value };
    setSteps(updated);
  };

  const updatePermission = (permKey, val) => {
    const current = steps[selectedStepIndex] || {};
    const currentMatrix = current.permission_matrix_json || {};
    updateSelectedStep("permission_matrix_json", { ...currentMatrix, [permKey]: val });
  };

  const handleSave = async () => {
    if (!selectedServiceId) return alert("Select a master service first.");
    try {
      setSaving(true);
      const res = await apiFetch(`/api/master-services/${selectedServiceId}/workflow-steps`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ steps }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Workflow steps saved and published successfully!");
        navigate("/admin/master-services");
      } else {
        alert(data.message || "Failed to save workflow steps.");
      }
    } catch (err) {
      alert("Error publishing workflow steps.");
    } finally {
      setSaving(false);
    }
  };

  const currentStep = steps[selectedStepIndex];

  return (
    <div style={{ padding: "1.5rem", background: "#f8fafc", minHeight: "90vh" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ margin: 0, color: "#0f172a" }}>Visual Workflow Step Builder</h2>
          <p style={{ margin: "0.25rem 0 0 0", color: "#64748b" }}>Define multi-stage execution pipelines, step actions, and role permission matrices for order workspaces.</p>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
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
          <button
            onClick={handleSave}
            disabled={saving || !selectedServiceId}
            style={{ padding: "0.65rem 1.25rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}
          >
            {saving ? "Publishing..." : "🚀 Publish Workflow"}
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading workflow pipeline...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "1.5rem" }}>
          {/* Visual Step Canvas */}
          <div style={{ background: "#fff", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ margin: 0, color: "#1e293b" }}>Execution Steps ({steps.length})</h3>
              <button onClick={addStep} style={{ padding: "0.5rem 1rem", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "6px", fontWeight: "700", cursor: "pointer" }}>
                + Add Step
              </button>
            </div>

            {/* Stepper Flow Bar */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.5rem", padding: "1rem", background: "#f8fafc", borderRadius: "8px" }}>
              {steps.map((s, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedStepIndex(idx)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.6rem 1rem",
                    borderRadius: "8px",
                    background: selectedStepIndex === idx ? "#2563eb" : "#ffffff",
                    color: selectedStepIndex === idx ? "#ffffff" : "#334155",
                    border: "1px solid #cbd5e1",
                    cursor: "pointer",
                    fontWeight: "700",
                    fontSize: "0.85rem",
                  }}
                >
                  <span style={{ width: 22, height: 22, borderRadius: "50%", background: selectedStepIndex === idx ? "#ffffff" : "#e2e8f0", color: selectedStepIndex === idx ? "#2563eb" : "#475569", display: "grid", placeItems: "center", fontSize: "0.75rem" }}>
                    {idx + 1}
                  </span>
                  {s.step_label}
                </div>
              ))}
            </div>

            {/* Detailed Step List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {steps.map((s, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedStepIndex(idx)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1rem 1.25rem",
                    border: selectedStepIndex === idx ? "2px solid #2563eb" : "1px solid #e2e8f0",
                    borderRadius: "10px",
                    background: selectedStepIndex === idx ? "#eff6ff" : "#fff",
                    cursor: "pointer",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontWeight: "800", color: "#0f172a" }}>Step {idx + 1}: {s.step_label}</span>
                      <span style={{ background: "#e2e8f0", color: "#475569", padding: "0.15rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "700" }}>{s.step_key}</span>
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "0.25rem" }}>
                      Action: <strong>{s.required_action}</strong>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeStep(idx);
                    }}
                    style={{ background: "#fee2e2", color: "#dc2626", border: "none", padding: "0.4rem 0.75rem", borderRadius: "6px", fontWeight: "700", cursor: "pointer" }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Inspector Panel */}
          <div style={{ background: "#fff", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h3 style={{ margin: "0 0 1rem 0", color: "#1e293b" }}>Step Configuration</h3>

            {currentStep ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", marginBottom: "0.25rem" }}>Step Label</label>
                  <input
                    type="text"
                    value={currentStep.step_label || ""}
                    onChange={(e) => updateSelectedStep("step_label", e.target.value)}
                    style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", marginBottom: "0.25rem" }}>Step Key (UPPERCASE_SNAKE)</label>
                  <input
                    type="text"
                    value={currentStep.step_key || ""}
                    onChange={(e) => updateSelectedStep("step_key", e.target.value.toUpperCase().replace(/\s+/g, "_"))}
                    style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", marginBottom: "0.25rem" }}>Required Action</label>
                  <select
                    value={currentStep.required_action || "NONE"}
                    onChange={(e) => updateSelectedStep("required_action", e.target.value)}
                    style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  >
                    {ACTION_TYPES.map((act) => (
                      <option key={act.value} value={act.value}>
                        {act.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "1rem" }}>
                  <h4 style={{ margin: "0 0 0.75rem 0", color: "#334155" }}>Step Feature Permissions</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {[
                      ["chat", "Enable Chat Discussion"],
                      ["voice_call", "Enable Voice Call"],
                      ["video_call", "Enable Video Call"],
                      ["upload_docs", "Allow Document Upload"],
                      ["delivery", "Allow Delivery Files"],
                    ].map(([key, label]) => (
                      <label key={key} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "600", fontSize: "0.85rem", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={Boolean(currentStep.permission_matrix_json?.[key])}
                          onChange={(e) => updatePermission(key, e.target.checked)}
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p style={{ color: "#94a3b8" }}>Select or add a step to edit configuration.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
