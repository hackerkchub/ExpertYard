import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import APP_CONFIG from "../../../config/appConfig";
import DynamicFormRenderer from "../../../shared/components/DynamicForm/DynamicFormRenderer";

const FIELD_TYPES = [
  "text", "textarea", "email", "phone", "number", "currency", "pan", "gst",
  "aadhaar", "passport", "driving_license", "ifsc", "bank_account", "upi",
  "address", "pincode", "dropdown", "radio", "checkbox", "multi_select",
  "date", "time", "datetime", "location", "signature", "file_upload",
  "image_upload", "section", "divider", "heading", "paragraph", "rich_text",
  "hidden", "custom_regex"
];

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

export default function AdminFormBuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [masterServices, setMasterServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(id || "");
  const [fields, setFields] = useState([]);
  const [activeTab, setActiveTab] = useState("builder"); // builder | preview
  const [saving, setSaving] = useState(false);
  const [selectedField, setSelectedField] = useState(null);

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
      .catch((err) => console.error("Error fetching master services:", err));
  }, []);

  useEffect(() => {
    if (id) setSelectedServiceId(id);
  }, [id]);

  useEffect(() => {
    if (!selectedServiceId) return;
    apiFetch(`/api/forms/preview/${selectedServiceId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.form_fields) {
          setFields(data.data.form_fields);
        } else {
          setFields([]);
        }
      })
      .catch((err) => console.error("Error fetching form fields:", err));
  }, [selectedServiceId]);

  const addField = (type) => {
    const newField = {
      id: Date.now(),
      field_key: `field_${Date.now()}`,
      field_label: `New ${type.toUpperCase()} Field`,
      field_type: type,
      placeholder: `Enter ${type}...`,
      is_required: false,
      validation_rules_json: {},
      visibility_rules_json: null
    };
    setFields([...fields, newField]);
    setSelectedField(newField);
  };

  const removeField = (fieldId) => {
    setFields(fields.filter((f) => f.id !== fieldId));
    if (selectedField?.id === fieldId) setSelectedField(null);
  };

  const updateFieldProperty = (key, value) => {
    if (!selectedField) return;
    const updated = fields.map((f) => {
      if (f.id === selectedField.id) {
        return { ...f, [key]: value };
      }
      return f;
    });
    setFields(updated);
    setSelectedField({ ...selectedField, [key]: value });
  };

  const handlePublish = async () => {
    if (!selectedServiceId) return alert("Select a Master Service first.");
    try {
      setSaving(true);
      const res = await apiFetch(`/api/master-services/${selectedServiceId}/form/publish`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ fields })
      });
      const data = await res.json();
      if (data.success) {
        alert("Dynamic Form Published Successfully!");
        navigate("/admin/master-services");
      } else {
        alert(data.message || "Failed to publish form.");
      }
    } catch (err) {
      alert("Error publishing dynamic form schema.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: "1.5rem", background: "#f8fafc", minHeight: "90vh" }}>
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ margin: 0, color: "#0f172a" }}>Dynamic Form Builder Console (Master Service #{id})</h2>
          <p style={{ margin: "0.25rem 0 0 0", color: "#64748b" }}>Build dynamic multi-field form schemas with live client/server validation and versioning.</p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={() => setActiveTab(activeTab === "builder" ? "preview" : "builder")}
            style={{ padding: "0.65rem 1.25rem", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}
          >
            {activeTab === "builder" ? "👁 Live Preview" : "✏ Edit Builder"}
          </button>
          <button
            onClick={handlePublish}
            disabled={saving}
            style={{ padding: "0.65rem 1.25rem", background: "#059669", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}
          >
            {saving ? "Publishing..." : "🚀 Publish Form Schema"}
          </button>
        </div>
      </div>

      {activeTab === "preview" ? (
        <div style={{ background: "#fff", padding: "2rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", maxWidth: "800px", margin: "0 auto" }}>
          <h3>Live Form Preview Mode</h3>
          <DynamicFormRenderer formFields={fields} onSubmit={(vals) => alert("Preview submission payload: " + JSON.stringify(vals, null, 2))} />
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "250px 1fr 320px", gap: "1.5rem" }}>
          {/* Left Toolbox */}
          <div style={{ background: "#fff", padding: "1.25rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h4 style={{ margin: "0 0 1rem 0", color: "#1e293b" }}>Field Library</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "70vh", overflowY: "auto" }}>
              {FIELD_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => addField(t)}
                  style={{
                    padding: "0.6rem 0.85rem",
                    textAlign: "left",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                    color: "#334155",
                    cursor: "pointer",
                    textTransform: "capitalize"
                  }}
                >
                  + {t.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Center Canvas */}
          <div style={{ background: "#fff", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", minHeight: "70vh" }}>
            <h4 style={{ margin: "0 0 1rem 0", color: "#1e293b" }}>Form Fields Canvas ({fields.length})</h4>
            {fields.length === 0 ? (
              <p style={{ color: "#94a3b8", textAlign: "center", padding: "3rem 0" }}>No fields added yet. Click any field type from the left library to add.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {fields.map((f, idx) => (
                  <div
                    key={f.id}
                    onClick={() => setSelectedField(f)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "1rem",
                      border: selectedField?.id === f.id ? "2px solid #2563eb" : "1px solid #e2e8f0",
                      borderRadius: "8px",
                      background: selectedField?.id === f.id ? "#eff6ff" : "#ffffff",
                      cursor: "pointer"
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: "700", color: "#0f172a" }}>{f.field_label}</span>
                      <span style={{ marginLeft: "0.5rem", fontSize: "0.75rem", background: "#e2e8f0", padding: "0.15rem 0.4rem", borderRadius: "4px", color: "#475569" }}>{f.field_type}</span>
                      {f.is_required && <span style={{ marginLeft: "0.5rem", color: "#ef4444", fontWeight: "700" }}>*Required</span>}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeField(f.id);
                      }}
                      style={{ background: "#fee2e2", color: "#dc2626", border: "none", padding: "0.35rem 0.65rem", borderRadius: "6px", cursor: "pointer", fontWeight: "700" }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Inspector */}
          <div style={{ background: "#fff", padding: "1.25rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h4 style={{ margin: "0 0 1rem 0", color: "#1e293b" }}>Field Properties</h4>
            {selectedField ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", marginBottom: "0.25rem" }}>Label</label>
                  <input
                    type="text"
                    value={selectedField.field_label || ""}
                    onChange={(e) => updateFieldProperty("field_label", e.target.value)}
                    style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", marginBottom: "0.25rem" }}>Field Key</label>
                  <input
                    type="text"
                    value={selectedField.field_key || ""}
                    onChange={(e) => updateFieldProperty("field_key", e.target.value)}
                    style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", marginBottom: "0.25rem" }}>Placeholder</label>
                  <input
                    type="text"
                    value={selectedField.placeholder || ""}
                    onChange={(e) => updateFieldProperty("placeholder", e.target.value)}
                    style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  />
                </div>
                <div>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "700", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={selectedField.is_required === true || selectedField.is_required === 1}
                      onChange={(e) => updateFieldProperty("is_required", e.target.checked)}
                    />
                    Is Required Field
                  </label>
                </div>
              </div>
            ) : (
              <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Select a field on the canvas to edit its properties.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
