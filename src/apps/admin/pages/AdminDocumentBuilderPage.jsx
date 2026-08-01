import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import APP_CONFIG from "../../../config/appConfig";

const DOC_TYPES = [
  { key: "PAN", label: "PAN Card", defaultExt: ["pdf", "jpg", "png"] },
  { key: "GST", label: "GST Certificate", defaultExt: ["pdf"] },
  { key: "PASSPORT", label: "Passport Copy", defaultExt: ["pdf", "jpg"] },
  { key: "PHOTO", label: "Passport Photograph", defaultExt: ["jpg", "png"] },
  { key: "DRIVING_LICENSE", label: "Driving License", defaultExt: ["pdf", "jpg", "png"] },
  { key: "PDF", label: "PDF Document", defaultExt: ["pdf"] },
  { key: "IMAGE", label: "Image (JPG/PNG)", defaultExt: ["jpg", "png"] },
  { key: "ZIP", label: "ZIP Archive", defaultExt: ["zip"] },
  { key: "DOC", label: "Word Document (DOC/DOCX)", defaultExt: ["doc", "docx"] },
  { key: "CUSTOM", label: "Custom Document", defaultExt: ["pdf", "jpg", "png", "zip"] },
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

export default function AdminDocumentBuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [masterServices, setMasterServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(id || "");
  const [documentSpecs, setDocumentSpecs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

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
    setLoading(true);
    apiFetch(`/api/master-services/${selectedServiceId}`, { headers: authHeaders() })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.document_specs) {
          setDocumentSpecs(data.data.document_specs);
        } else {
          setDocumentSpecs([]);
        }
      })
      .catch((err) => console.error("Error loading document specs:", err))
      .finally(() => setLoading(false));
  }, [selectedServiceId]);

  const addDocSpec = (typeObj) => {
    const newSpec = {
      doc_type_key: `${typeObj.key}_${Date.now()}`,
      label: typeObj.label,
      is_mandatory: 1,
      allowed_extensions_json: typeObj.defaultExt,
      max_file_size_mb: 10,
    };
    setDocumentSpecs([...documentSpecs, newSpec]);
  };

  const removeDocSpec = (index) => {
    setDocumentSpecs(documentSpecs.filter((_, i) => i !== index));
  };

  const updateSpecField = (index, field, value) => {
    const updated = [...documentSpecs];
    updated[index] = { ...updated[index], [field]: value };
    setDocumentSpecs(updated);
  };

  const handleSave = async () => {
    if (!selectedServiceId) return alert("Select a service first.");
    try {
      setSaving(true);
      const res = await apiFetch(`/api/master-services/${selectedServiceId}/document-specs`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ documents: documentSpecs }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Document requirements published successfully!");
        navigate("/admin/master-services");
      } else {
        alert(data.message || "Failed to publish document requirements.");
      }
    } catch (err) {
      alert("Error publishing document requirements.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: "1.5rem", background: "#f8fafc", minHeight: "90vh" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ margin: 0, color: "#0f172a" }}>Document Requirement Builder</h2>
          <p style={{ margin: "0.25rem 0 0 0", color: "#64748b" }}>Specify mandatory and optional document uploads required from customers during booking.</p>
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
            style={{ padding: "0.65rem 1.25rem", background: "#059669", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}
          >
            {saving ? "Publishing..." : "🚀 Save Document Specs"}
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading document specifications...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: "1.5rem" }}>
          {/* Document Types Toolbox */}
          <div style={{ background: "#fff", padding: "1.25rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h4 style={{ margin: "0 0 1rem 0", color: "#1e293b" }}>Document Types</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {DOC_TYPES.map((dt) => (
                <button
                  key={dt.key}
                  onClick={() => addDocSpec(dt)}
                  style={{
                    padding: "0.65rem 0.85rem",
                    textAlign: "left",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                    color: "#334155",
                    cursor: "pointer",
                  }}
                >
                  + {dt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Configured Document Specs List */}
          <div style={{ background: "#fff", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h3 style={{ margin: "0 0 1rem 0", color: "#1e293b" }}>Required Documents ({documentSpecs.length})</h3>

            {documentSpecs.length === 0 ? (
              <p style={{ color: "#94a3b8", textAlign: "center", padding: "3rem 0" }}>No document requirements added yet. Click any document type on the left to add.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {documentSpecs.map((spec, idx) => (
                  <div key={idx} style={{ padding: "1rem", border: "1px solid #e2e8f0", borderRadius: "8px", background: "#ffffff", display: "grid", gridTemplateColumns: "1fr 140px 120px auto", gap: "1rem", alignItems: "center" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "700", color: "#64748b" }}>Document Label</label>
                      <input
                        type="text"
                        value={spec.label || ""}
                        onChange={(e) => updateSpecField(idx, "label", e.target.value)}
                        style={{ width: "100%", padding: "0.45rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "700", color: "#64748b" }}>Max Size (MB)</label>
                      <input
                        type="number"
                        value={spec.max_file_size_mb || 10}
                        onChange={(e) => updateSpecField(idx, "max_file_size_mb", Number(e.target.value))}
                        style={{ width: "100%", padding: "0.45rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "700", fontSize: "0.85rem", cursor: "pointer", marginTop: "1rem" }}>
                        <input
                          type="checkbox"
                          checked={spec.is_mandatory === 1 || spec.is_mandatory === true}
                          onChange={(e) => updateSpecField(idx, "is_mandatory", e.target.checked ? 1 : 0)}
                        />
                        Mandatory
                      </label>
                    </div>

                    <button
                      onClick={() => removeDocSpec(idx)}
                      style={{ background: "#fee2e2", color: "#dc2626", border: "none", padding: "0.45rem 0.75rem", borderRadius: "6px", fontWeight: "700", cursor: "pointer" }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
