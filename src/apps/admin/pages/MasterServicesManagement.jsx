import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import APP_CONFIG from "../../../config/appConfig";

const initialForm = {
  title: "",
  slug: "",
  category_id: "",
  category_ids: [],
  subcategory_id: "",
  subcategory_ids: [],
  assigned_experts: [],
  short_description: "",
  full_description: "",
  base_price: 999,
  gst_percent: 18,
  commission_percent: 0,
  delivery_time_days: 1,
  seo_title: "",
  seo_description: "",
  image_url: "",
  icon_url: "",
  banner_url: "",
  thumbnail_url: "",
  tags: "",
  visibility: "public",
  expert_assignment_mode: "auto",
  featured_first: true,
  hide_in_search: false,
  show_on_homepage: false,
  is_recommended: false,
  is_featured: false,
  is_trending: false,
  is_popular: false,
  is_active: 1,
};

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

export default function MasterServicesManagement() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editParamId = searchParams.get("edit");

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");

  // Optional Expert Search inside Master Service Form
  const [expertFormSearchText, setExpertFormSearchText] = useState("");
  const [formSearchResults, setFormSearchResults] = useState([]);
  const [searchingFormExperts, setSearchingFormExperts] = useState(false);

  const selectedCategoryIds = useMemo(() => {
    if (Array.isArray(formData.category_ids) && formData.category_ids.length > 0) {
      return formData.category_ids.map((id) => Number(id));
    }
    return formData.category_id ? [Number(formData.category_id)] : [];
  }, [formData.category_ids, formData.category_id]);

  const filteredSubcategories = useMemo(
    () =>
      subcategories.filter((item) =>
        selectedCategoryIds.includes(Number(item.category_id))
      ),
    [subcategories, selectedCategoryIds]
  );

  const loadCategories = async () => {
    const res = await apiFetch("/api/category/list?admin=true");
    const data = await res.json();
    const rows = data?.data?.data || data?.data || [];
    setCategories(Array.isArray(rows) ? rows : []);
  };

  const loadSubcategories = async () => {
    const res = await apiFetch("/api/subcategory?admin=true");
    const data = await res.json();
    const rows = data?.data?.data || data?.data || [];
    setSubcategories(Array.isArray(rows) ? rows : []);
  };

  const loadServiceForEdit = async (id) => {
    try {
      setLoading(true);
      const res = await apiFetch(`/api/master-services/${id}`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success && data.data) {
        editService(data.data);
      } else {
        setError("Service to edit not found.");
      }
    } catch (err) {
      console.error("Error loading service for edit:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadAll = async () => {
    try {
      setLoading(true);
      setError("");
      await Promise.all([loadCategories(), loadSubcategories()]);
      if (editParamId) {
        await loadServiceForEdit(editParamId);
      }
    } catch (err) {
      setError(err.message || "Unable to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [editParamId]);

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleCategorySelection = (catId) => {
    const numId = Number(catId);
    setFormData((prev) => {
      const currentIds = prev.category_ids.map(Number);
      let nextIds;
      if (currentIds.includes(numId)) {
        nextIds = currentIds.filter((id) => id !== numId);
      } else {
        nextIds = [...currentIds, numId];
      }
      const nextSubIds = prev.subcategory_ids.filter((subId) => {
        const sub = subcategories.find((s) => Number(s.id) === Number(subId));
        return sub && nextIds.includes(Number(sub.category_id));
      });

      return {
        ...prev,
        category_ids: nextIds,
        category_id: nextIds[0] || "",
        subcategory_ids: nextSubIds,
        subcategory_id: nextSubIds[0] || "",
      };
    });
  };

  const toggleSubcategorySelection = (subId) => {
    const numId = Number(subId);
    setFormData((prev) => {
      const currentIds = prev.subcategory_ids.map(Number);
      let nextIds;
      if (currentIds.includes(numId)) {
        nextIds = currentIds.filter((id) => id !== numId);
      } else {
        nextIds = [...currentIds, numId];
      }
      return {
        ...prev,
        subcategory_ids: nextIds,
        subcategory_id: nextIds[0] || "",
      };
    });
  };

  // Live Expert Search inside Form
  const handleExpertFormSearch = async (query) => {
    setExpertFormSearchText(query);
    if (!query || query.trim().length < 2) {
      setFormSearchResults([]);
      return;
    }
    try {
      setSearchingFormExperts(true);
      const res = await apiFetch(`/api/master-services/experts/search?q=${encodeURIComponent(query.trim())}`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) {
        setFormSearchResults(data.data || []);
      }
    } catch (err) {
      console.error("Error searching experts for form:", err);
    } finally {
      setSearchingFormExperts(false);
    }
  };

  const selectExpertForForm = (expert) => {
    setFormData((prev) => {
      const current = prev.assigned_experts || [];
      if (current.some((item) => Number(item.expert_id || item.id) === Number(expert.id))) {
        return prev;
      }
      return {
        ...prev,
        assigned_experts: [
          ...current,
          {
            expert_id: expert.id,
            name: expert.name,
            phone: expert.phone,
            email: expert.email,
            priority: 10,
            featured: 1,
            status: "active"
          }
        ]
      };
    });
    setExpertFormSearchText("");
    setFormSearchResults([]);
  };

  const updateAssignedExpertInForm = (index, field, value) => {
    setFormData((prev) => {
      const list = [...(prev.assigned_experts || [])];
      if (list[index]) {
        list[index] = { ...list[index], [field]: value };
      }
      return { ...prev, assigned_experts: list };
    });
  };

  const removeAssignedExpertFromForm = (index) => {
    setFormData((prev) => {
      const list = [...(prev.assigned_experts || [])];
      list.splice(index, 1);
      return { ...prev, assigned_experts: list };
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(initialForm);
    setExpertFormSearchText("");
    setFormSearchResults([]);
    if (editParamId) {
      navigate("/admin/master-services");
    }
  };

  const editService = (service) => {
    setEditingId(service.id);
    const catIds = service.category_ids || (service.category_id ? [service.category_id] : []);
    const subCatIds = service.subcategory_ids || (service.subcategory_id ? [service.subcategory_id] : []);

    setFormData({
      ...initialForm,
      ...service,
      image_url: service.image_url || service.thumbnail_url || service.image || "",
      category_id: service.category_id || catIds[0] || "",
      category_ids: catIds,
      subcategory_id: service.subcategory_id || subCatIds[0] || "",
      subcategory_ids: subCatIds,
      assigned_experts: Array.isArray(service.assigned_experts) ? service.assigned_experts : [],
      expert_assignment_mode: service.expert_assignment_mode || "auto",
      featured_first: Boolean(service.featured_first ?? true),
      hide_in_search: Boolean(service.hide_in_search),
      show_on_homepage: Boolean(service.show_on_homepage),
      is_recommended: Boolean(service.is_recommended),
      is_featured: Boolean(service.is_featured),
      is_trending: Boolean(service.is_trending),
      is_popular: Boolean(service.is_popular),
      is_active: service.is_active === 0 ? 0 : 1,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveService = async (event) => {
    event.preventDefault();
    if (!formData.title || !formData.title.trim()) {
      setError("Service title is required.");
      return;
    }
    if (selectedCategoryIds.length === 0) {
      setError("Select at least one Category for this service.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      const endpoint = editingId ? `/api/master-services/${editingId}` : "/api/master-services";
      const method = editingId ? "PUT" : "POST";

      const payload = {
        ...formData,
        title: formData.title.trim(),
        slug: formData.slug ? formData.slug.trim() : undefined,
        image_url: formData.image_url ? formData.image_url.trim() : null,
        thumbnail_url: formData.image_url ? formData.image_url.trim() : (formData.thumbnail_url || null),
        category_id: Number(selectedCategoryIds[0]),
        category_ids: selectedCategoryIds,
        subcategory_id: formData.subcategory_ids[0] ? Number(formData.subcategory_ids[0]) : null,
        subcategory_ids: formData.subcategory_ids.map(Number),
        assigned_experts: formData.assigned_experts,
        base_price: Number(formData.base_price || 0),
        gst_percent: Number(formData.gst_percent || 0),
        commission_percent: Number(formData.commission_percent || 0),
        delivery_time_days: Number(formData.delivery_time_days || 1),
        is_active: Number(formData.is_active),
      };

      const res = await apiFetch(endpoint, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || `HTTP ${res.status}: Unable to save master service.`);
      }
      const newId = data.data?.id || editingId;
      alert(`Master service "${formData.title}" ${editingId ? "updated" : "created"} successfully!`);
      resetForm();
      navigate(`/admin/master-services/list`);
    } catch (err) {
      setError(err.message || "Unable to save master service.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: "1.5rem", display: "grid", gap: "1.5rem", maxWidth: "1240px", margin: "0 auto" }}>
      <header style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "1.25rem 1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ margin: 0, color: "#0f172a", fontSize: "1.6rem" }}>
              {editingId ? `Edit Master Service #${editingId}` : "Create Master Service"}
            </h2>
            <p style={{ margin: "0.25rem 0 0", color: "#64748b", fontSize: "0.9rem" }}>
              Configure service details, many-to-many categories, subcategories, and expert assignment mode.
            </p>
          </div>
          <Link
            to="/admin/master-services/list"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "#2563eb",
              color: "#ffffff",
              padding: "10px 18px",
              borderRadius: "8px",
              fontWeight: "700",
              fontSize: "14px",
              textDecoration: "none",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              cursor: "pointer"
            }}
          >
            View All Services →
          </Link>
        </div>
      </header>

      {error && (
        <div style={{ background: "#fef2f2", color: "#b42318", border: "1px solid #fecaca", padding: "0.85rem 1rem", borderRadius: 8 }}>
          {error}
        </div>
      )}

      <form onSubmit={saveService} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "1.5rem", display: "grid", gap: "1.25rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", borderBottom: "1px solid #f1f5f9", paddingBottom: "1rem" }}>
          <h3 style={{ margin: 0, color: "#0f172a" }}>{editingId ? `Editing Service #${editingId}` : "Service Setup Form"}</h3>
          {editingId && <button type="button" onClick={resetForm} style={{ background: "#f1f5f9", border: 0, padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>Cancel Edit</button>}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
          <Field label="Title" value={formData.title} onChange={(value) => updateField("title", value)} required placeholder="e.g. GST Registration & Advisory" />
          <Field label="Slug" value={formData.slug || ""} onChange={(value) => updateField("slug", value)} placeholder="auto-generated-from-title" />
          <Field type="number" label="Base Price (₹)" value={formData.base_price} onChange={(value) => updateField("base_price", value)} required />
          <Field type="number" label="GST %" value={formData.gst_percent} onChange={(value) => updateField("gst_percent", value)} />
          <Field type="number" label="Commission %" value={formData.commission_percent} onChange={(value) => updateField("commission_percent", value)} />
          <Field type="number" label="Delivery (Days)" value={formData.delivery_time_days} onChange={(value) => updateField("delivery_time_days", value)} />
        </div>

        {/* MANY-TO-MANY CATEGORIES MULTI-SELECT */}
        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "1rem", display: "grid", gap: "0.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={{ fontWeight: 800, color: "#1e293b" }}>
              Linked Categories (Multi-Select) <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <span style={{ fontSize: 12, color: "#64748b" }}>
              Selected: <strong>{selectedCategoryIds.length}</strong> categories
            </span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, maxHeight: 180, overflowY: "auto", padding: "4px" }}>
            {categories.map((cat) => {
              const isChecked = selectedCategoryIds.includes(Number(cat.id));
              const isPrimary = Number(selectedCategoryIds[0]) === Number(cat.id);
              return (
                <label
                  key={cat.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 12px",
                    borderRadius: 20,
                    border: isChecked ? "1px solid #2563eb" : "1px solid #cbd5e1",
                    background: isChecked ? "#eff6ff" : "#fff",
                    color: isChecked ? "#1e40af" : "#475569",
                    fontSize: 13,
                    fontWeight: isChecked ? 700 : 500,
                    cursor: "pointer"
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCategorySelection(cat.id)}
                  />
                  {cat.name}
                  {isPrimary && <span style={{ background: "#2563eb", color: "#fff", padding: "1px 6px", borderRadius: 10, fontSize: 10 }}>Primary</span>}
                </label>
              );
            })}
          </div>
        </div>

        {/* MANY-TO-MANY SUBCATEGORIES MULTI-SELECT */}
        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "1rem", display: "grid", gap: "0.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={{ fontWeight: 800, color: "#1e293b" }}>
              Linked Subcategories (Filtered by Selected Categories)
            </label>
            <span style={{ fontSize: 12, color: "#64748b" }}>
              Selected: <strong>{formData.subcategory_ids.length}</strong> subcategories
            </span>
          </div>
          {filteredSubcategories.length === 0 ? (
            <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>
              Select categories above to load available subcategories.
            </p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, maxHeight: 180, overflowY: "auto", padding: "4px" }}>
              {filteredSubcategories.map((sub) => {
                const isChecked = formData.subcategory_ids.map(Number).includes(Number(sub.id));
                return (
                  <label
                    key={sub.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 12px",
                      borderRadius: 20,
                      border: isChecked ? "1px solid #059669" : "1px solid #cbd5e1",
                      background: isChecked ? "#ecfdf5" : "#fff",
                      color: isChecked ? "#065f46" : "#475569",
                      fontSize: 13,
                      fontWeight: isChecked ? 700 : 500,
                      cursor: "pointer"
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleSubcategorySelection(sub.id)}
                    />
                    {sub.name}
                  </label>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
          <label style={labelStyle}>
            Expert Assignment Mode
            <select value={formData.expert_assignment_mode || "auto"} onChange={(e) => updateField("expert_assignment_mode", e.target.value)} style={inputStyle}>
              <option value="auto">Auto Assignment (All Activated Experts)</option>
              <option value="manual">Manual Assignment (Admin Direct Selection)</option>
              <option value="hybrid">Hybrid (Assigned Experts First + Activated Experts)</option>
            </select>
          </label>

          <label style={labelStyle}>
            Visibility Status
            <select value={formData.visibility || "public"} onChange={(event) => updateField("visibility", event.target.value)} style={inputStyle}>
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="hidden">Hidden</option>
            </select>
          </label>

          <label style={labelStyle}>
            Publish Status
            <select value={formData.is_active} onChange={(event) => updateField("is_active", Number(event.target.value))} style={inputStyle}>
              <option value={1}>Published (Active)</option>
              <option value={0}>Draft (Inactive)</option>
            </select>
          </label>
        </div>

        {/* OPTIONAL DYNAMIC EXPERT SEARCH & PRE-ASSIGNMENT IN FORM */}
        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "1rem", display: "grid", gap: "0.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={{ fontWeight: 800, color: "#1e293b" }}>
              Assign Experts (Optional Live Dynamic Search & Direct Mapping)
            </label>
            <span style={{ fontSize: 12, color: "#64748b" }}>
              Assigned: <strong>{formData.assigned_experts?.length || 0}</strong> experts
            </span>
          </div>

          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Search active experts by name, email, phone, city..."
              value={expertFormSearchText}
              onChange={(e) => handleExpertFormSearch(e.target.value)}
              style={inputStyle}
            />
            {searchingFormExperts && <div style={{ fontSize: 12, color: "#2563eb", marginTop: 4 }}>Searching active experts...</div>}

            {formSearchResults.length > 0 && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 30, background: "#fff", border: "1px solid #cbd5e1", borderRadius: 8, maxHeight: 180, overflowY: "auto", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", marginTop: 4 }}>
                {formSearchResults.map((exp) => (
                  <div
                    key={exp.id}
                    onClick={() => selectExpertForForm(exp)}
                    style={{ padding: "8px 12px", borderBottom: "1px solid #f1f5f9", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                  >
                    <div>
                      <strong style={{ color: "#0f172a" }}>{exp.name}</strong> <span style={{ fontSize: 12, color: "#64748b" }}>({exp.phone || exp.email})</span>
                      <div style={{ fontSize: 11, color: "#64748b" }}>{exp.city || "General"} • {exp.position || exp.education || "Expert"}</div>
                    </div>
                    <span style={{ background: "#2563eb", color: "#fff", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>+ Assign</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* LIST OF PRE-ASSIGNED EXPERTS IN FORM */}
          {Array.isArray(formData.assigned_experts) && formData.assigned_experts.length > 0 && (
            <div style={{ display: "grid", gap: 6, marginTop: 4 }}>
              {formData.assigned_experts.map((exp, idx) => (
                <div key={exp.expert_id || exp.id || idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#eff6ff", border: "1px solid #bfdbfe", padding: "6px 12px", borderRadius: 8, fontSize: 13, flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <strong style={{ color: "#1e40af" }}>{exp.name || `Expert #${exp.expert_id || exp.id}`}</strong>
                    <span style={{ fontSize: 11, color: "#3b82f6", marginLeft: 6 }}>({exp.phone || exp.email || "Assigned Expert"})</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#1e3a8a", display: "flex", alignItems: "center", gap: 4 }}>
                      Priority:
                      <input
                        type="number"
                        value={exp.priority ?? 10}
                        onChange={(e) => updateAssignedExpertInForm(idx, "priority", Number(e.target.value))}
                        style={{ width: 55, padding: "2px 4px", borderRadius: 4, border: "1px solid #93c5fd" }}
                      />
                    </label>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#1e3a8a", display: "flex", alignItems: "center", gap: 4 }}>
                      <input
                        type="checkbox"
                        checked={Boolean(exp.featured)}
                        onChange={(e) => updateAssignedExpertInForm(idx, "featured", e.target.checked)}
                      />
                      Featured
                    </label>
                    <button
                      type="button"
                      onClick={() => removeAssignedExpertFromForm(idx)}
                      style={{ background: "#fef2f2", color: "#b42318", border: "1px solid #fecaca", borderRadius: 4, padding: "2px 8px", cursor: "pointer", fontSize: 11, fontWeight: 700 }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MASTER SERVICE IMAGE FIELD */}
        <div style={{ background: "#ffffff", border: "1.5px dashed #3b82f6", borderRadius: 12, padding: "1.25rem", display: "grid", gap: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <div>
              <label style={{ fontWeight: 800, color: "#0f172a", fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                🖼️ Master Service Image <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748b" }}>
                This primary image will be displayed on all service cards, user service detail pages, and expert service activation lists.
              </p>
            </div>
            <span style={{ fontSize: 11, background: "#dbeafe", color: "#1e40af", padding: "4px 10px", borderRadius: 20, fontWeight: 700 }}>
              Recommended: 800x500px (JPG, PNG, WebP)
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", alignItems: "center" }}>
            <div style={{ display: "grid", gap: 8 }}>
              <label style={labelStyle}>
                Image URL
                <input
                  type="text"
                  placeholder="https://example.com/service-banner.jpg"
                  value={formData.image_url || ""}
                  onChange={(e) => updateField("image_url", e.target.value)}
                  style={inputStyle}
                />
              </label>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>OR Upload File:</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    
                    try {
                      const uploadFormData = new FormData();
                      uploadFormData.append("image", file);
                      
                      const token = localStorage.getItem("admin_token") || localStorage.getItem("token") || localStorage.getItem("adminToken") || "";
                      const res = await apiFetch("/api/master-services/upload-image", {
                        method: "POST",
                        headers: token ? { Authorization: `Bearer ${token}` } : {},
                        body: uploadFormData,
                      });
                      const data = await res.json();
                      if (data.success && (data.data?.url || data.url)) {
                        updateField("image_url", data.data?.url || data.url);
                        return;
                      }
                    } catch (uploadErr) {
                      console.warn("Direct upload failed, using data URL fallback:", uploadErr);
                    }

                    // Fallback to Data URL
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      updateField("image_url", reader.result);
                    };
                    reader.readAsDataURL(file);
                  }}
                  style={{ fontSize: 12, color: "#334155" }}
                />
              </div>
            </div>

            {formData.image_url ? (
              <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#f8fafc", padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0" }}>
                <img
                  src={getServiceImageUrl(formData.image_url)}
                  alt="Master Service Preview"
                  style={{ width: 80, height: 60, borderRadius: 8, objectFit: "cover", border: "1px solid #cbd5e1", boxShadow: "0 2px 4px rgba(0,0,0,0.08)" }}
                />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1e293b" }}>Image Preview</div>
                  <button
                    type="button"
                    onClick={() => updateField("image_url", "")}
                    style={{ marginTop: 4, background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                  >
                    Remove Image
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ background: "#f1f5f9", padding: "12px", borderRadius: 8, textAlign: "center", fontSize: 12, color: "#94a3b8" }}>
                No Image Selected (Enter URL or choose file)
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
          <Field label="Icon URL" value={formData.icon_url || ""} onChange={(value) => updateField("icon_url", value)} />
          <Field label="Banner URL" value={formData.banner_url || ""} onChange={(value) => updateField("banner_url", value)} />
          <Field label="Tags (comma separated)" value={formData.tags || ""} onChange={(value) => updateField("tags", value)} placeholder="gst, tax, business" />
        </div>

        <RichTextHtmlEditor
          label="Short Description"
          value={formData.short_description || ""}
          onChange={(val) => updateField("short_description", val)}
          placeholder="Format product overview with bold text, lists, links, badges, or HTML design cards..."
        />

        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.2rem", background: "#f8fafc", padding: "1rem", borderRadius: 8 }}>
          {[
            ["featured_first", "Featured Experts First"],
            ["hide_in_search", "Hide in Search"],
            ["show_on_homepage", "Show on Homepage"],
            ["is_recommended", "Recommended Badge"],
            ["is_featured", "Featured Flag"],
            ["is_trending", "Trending Flag"],
            ["is_popular", "Popular Flag"]
          ].map(([key, label]) => (
            <label key={key} style={{ display: "flex", gap: 8, alignItems: "center", fontWeight: 700, fontSize: 13, color: "#334155" }}>
              <input type="checkbox" checked={Boolean(formData[key])} onChange={(event) => updateField(key, event.target.checked)} />
              {label}
            </label>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" disabled={saving} style={{ padding: "0.85rem 1.75rem", background: "#2563eb", color: "#fff", border: 0, borderRadius: 8, fontWeight: 800, cursor: "pointer" }}>
            {saving ? "Saving Master Service..." : editingId ? "Update Master Service" : "Create Master Service"}
          </button>
        </div>
      </form>
    </div>
  );
}

function RichTextHtmlEditor({ label, value, onChange, placeholder = "Enter formatted description..." }) {
  const [activeTab, setActiveTab] = React.useState("editor"); // "editor", "code", "preview"
  const textareaRef = React.useRef(null);

  const insertTag = (openTag, closeTag = "") => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange((value || "") + openTag + closeTag);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = value || "";
    const selectedText = currentVal.substring(start, end);
    const replacement = selectedText ? `${openTag}${selectedText}${closeTag}` : `${openTag}${closeTag}`;
    const newVal = currentVal.substring(0, start) + replacement + currentVal.substring(end);
    
    onChange(newVal);

    setTimeout(() => {
      textarea.focus();
      const cursorPosition = start + openTag.length + (selectedText ? selectedText.length : 0);
      textarea.setSelectionRange(cursorPosition, cursorPosition);
    }, 50);
  };

  const handleInsertLink = () => {
    const url = prompt("Enter link URL (e.g. https://example.com):", "https://");
    if (!url) return;
    const text = prompt("Enter link text:", "Click Here");
    insertTag(`<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: underline; font-weight: 600;">`, `${text || "Link"}</a>`);
  };

  const handleInsertCallout = () => {
    insertTag(`<div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 10px 14px; border-radius: 8px; margin: 10px 0; color: #1e40af; font-size: 13px;">\n  <strong>Note:</strong> Enter important details here...\n</div>`);
  };

  const handleInsertBadge = () => {
    insertTag(`<span style="background: #dcfce7; color: #166534; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 700; display: inline-block; margin-right: 6px;">✓ `, `Verified Feature</span>`);
  };

  return (
    <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: 12, overflow: "hidden", margin: "10px 0" }}>
      {/* HEADER & TABS */}
      <div style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 14 }}>
          {label} <span style={{ fontSize: 11, color: "#64748b", fontWeight: 500 }}>(HTML & Rich Text Formatted)</span>
        </div>
        <div style={{ display: "flex", gap: 4, background: "#e2e8f0", padding: 3, borderRadius: 8 }}>
          <button
            type="button"
            onClick={() => setActiveTab("editor")}
            style={{ padding: "4px 10px", border: 0, borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer", background: activeTab === "editor" ? "#ffffff" : "transparent", color: activeTab === "editor" ? "#2563eb" : "#64748b" }}
          >
            ✏️ Rich Toolbar Editor
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("code")}
            style={{ padding: "4px 10px", border: 0, borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer", background: activeTab === "code" ? "#ffffff" : "transparent", color: activeTab === "code" ? "#2563eb" : "#64748b" }}
          >
            &lt;/&gt; Raw HTML Code
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            style={{ padding: "4px 10px", border: 0, borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer", background: activeTab === "preview" ? "#ffffff" : "transparent", color: activeTab === "preview" ? "#059669" : "#64748b" }}
          >
            👁️ Live Preview
          </button>
        </div>
      </div>

      {/* TOOLBAR */}
      {activeTab !== "preview" && (
        <div style={{ background: "#f1f5f9", borderBottom: "1px solid #e2e8f0", padding: "6px 10px", display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center" }}>
          <button type="button" onClick={() => insertTag("<b>", "</b>")} style={toolbarBtnStyle} title="Bold"><b>B</b></button>
          <button type="button" onClick={() => insertTag("<i>", "</i>")} style={toolbarBtnStyle} title="Italic"><i>I</i></button>
          <button type="button" onClick={() => insertTag("<u>", "</u>")} style={toolbarBtnStyle} title="Underline"><u>U</u></button>
          <button type="button" onClick={() => insertTag("<s>", "</s>")} style={toolbarBtnStyle} title="Strikethrough"><s>S</s></button>
          <span style={dividerStyle} />
          <button type="button" onClick={() => insertTag("<h3 style='color:#0f172a; margin:10px 0 4px;'>", "</h3>")} style={toolbarBtnStyle}>H3</button>
          <button type="button" onClick={() => insertTag("<h4 style='color:#1e293b; margin:8px 0 4px;'>", "</h4>")} style={toolbarBtnStyle}>H4</button>
          <span style={dividerStyle} />
          <button type="button" onClick={() => insertTag("<ul style='margin:8px 0; padding-left:20px; display:grid; gap:4px;'>\n  <li>", "</li>\n  <li>Second item...</li>\n</ul>")} style={toolbarBtnStyle}>• Bullet List</button>
          <button type="button" onClick={() => insertTag("<ol style='margin:8px 0; padding-left:20px; display:grid; gap:4px;'>\n  <li>", "</li>\n  <li>Step 2...</li>\n</ol>")} style={toolbarBtnStyle}>1. Numbered List</button>
          <span style={dividerStyle} />
          <button type="button" onClick={handleInsertLink} style={toolbarBtnStyle}>🔗 Add Link</button>
          <button type="button" onClick={handleInsertCallout} style={toolbarBtnStyle}>📌 Callout Box</button>
          <button type="button" onClick={handleInsertBadge} style={toolbarBtnStyle}>🏷️ Badge</button>
          <button type="button" onClick={() => onChange("")} style={{ ...toolbarBtnStyle, color: "#dc2626", marginLeft: "auto" }}>Clear</button>
        </div>
      )}

      {/* INPUT AREA / PREVIEW AREA */}
      {activeTab === "editor" || activeTab === "code" ? (
        <textarea
          ref={textareaRef}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={6}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "12px",
            border: 0,
            outline: "none",
            fontFamily: activeTab === "code" ? "monospace" : "inherit",
            fontSize: activeTab === "code" ? 13 : 14,
            lineHeight: 1.6,
            color: "#0f172a",
            resize: "vertical",
            minHeight: 120,
            background: "#ffffff"
          }}
        />
      ) : (
        <div
          style={{
            padding: "14px",
            minHeight: 120,
            background: "#fafafa",
            fontSize: 14,
            lineHeight: 1.6,
            color: "#334155"
          }}
        >
          {value ? (
            <div dangerouslySetInnerHTML={{ __html: value }} />
          ) : (
            <span style={{ color: "#94a3b8", fontStyle: "italic" }}>No content entered yet to preview.</span>
          )}
        </div>
      )}
    </div>
  );
}

const toolbarBtnStyle = {
  padding: "4px 8px",
  background: "#ffffff",
  border: "1px solid #cbd5e1",
  borderRadius: 4,
  fontSize: 12,
  fontWeight: 700,
  color: "#334155",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 3,
};

const dividerStyle = {
  width: 1,
  height: 18,
  background: "#cbd5e1",
  margin: "0 4px",
};

function Field({ label, value, onChange, type = "text", required = false, placeholder = "" }) {
  return (
    <label style={labelStyle}>
      {label}
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        style={inputStyle}
      />
    </label>
  );
}

const labelStyle = { display: "grid", gap: 6, fontWeight: 700, color: "#334155", fontSize: 13 };
const inputStyle = { width: "100%", padding: "0.65rem 0.75rem", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14 };
