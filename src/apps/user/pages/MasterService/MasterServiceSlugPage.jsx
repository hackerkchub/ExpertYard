import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FiSearch, FiFilter, FiCheckCircle, FiClock, FiStar, FiShield, FiDollarSign, FiMessageCircle, FiPhone, FiVideo, FiFolder, FiCreditCard, FiArrowRight, FiPlusCircle } from "react-icons/fi";
import APP_CONFIG from "../../../../config/appConfig";
import AddBalancePopup from "../../components/AddBalancePopup/AddBalancePopup";

const userAuthHeaders = () => {
  const token = localStorage.getItem("token") || localStorage.getItem("userToken") || localStorage.getItem("user_token") || "";
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
const DEFAULT_SERVICE_IMAGE = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80";

const getServiceImageUrl = (url) => {
  if (!url) return DEFAULT_SERVICE_IMAGE;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  const base = API_BASE ? API_BASE.replace(/\/api\/?$/, "") : "http://localhost:5000";
  return `${base}${cleanPath}`;
};

export default function MasterServiceSlugPage() {
  const { slug, masterServiceSlug } = useParams();
  const targetSlug = masterServiceSlug || slug;
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Expert Filters
  const [sortBy, setSortBy] = useState("recommended"); // recommended | price_asc | price_desc | sla_asc | rating_desc
  const [searchQuery, setSearchQuery] = useState("");

  // Booking & Wallet Payment Modal State
  const [selectedExpertForBooking, setSelectedExpertForBooking] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [walletLoading, setWalletLoading] = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [completedBooking, setCompletedBooking] = useState(null);
  const [bookingFormResponses, setBookingFormResponses] = useState({});
  const [bookingDocuments, setBookingDocuments] = useState([]);
  const [bookingDocumentsMap, setBookingDocumentsMap] = useState({});

  // Recharge Popup State
  const [showRechargePopup, setShowRechargePopup] = useState(false);
  const [rechargeAmountNeeded, setRechargeAmountNeeded] = useState(null);

  // Active Booking Detection State
  const [activeUserBooking, setActiveUserBooking] = useState(null);

  const fetchWalletBalance = async () => {
    try {
      setWalletLoading(true);
      const res = await apiFetch("/api/wallet", { headers: userAuthHeaders() });
      const data = await res.json();
      if (data.success || data.balance !== undefined) {
        setWalletBalance(Number(data.balance || data.data?.balance || 0));
      }
    } catch {
      setWalletBalance(0);
    } finally {
      setWalletLoading(false);
    }
  };

  useEffect(() => {
    if (!service?.id) return;
    const userRaw = localStorage.getItem("user") || localStorage.getItem("userData");
    let userId = null;
    try {
      if (userRaw) userId = JSON.parse(userRaw)?.id;
    } catch (e) {}

    if (userId) {
      apiFetch(`/api/bookings/user/${userId}`, { headers: userAuthHeaders() })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.data)) {
            const active = data.data.find(
              (b) =>
                (Number(b.master_service_id) === Number(service.id) || Number(b.service_id) === Number(service.id)) &&
                !["COMPLETED", "CANCELLED", "completed", "cancelled"].includes(b.status)
            );
            setActiveUserBooking(active || null);
          }
        })
        .catch(() => {});
    }
  }, [service?.id]);

  useEffect(() => {
    if (!targetSlug) return;
    const fetchServiceAndExperts = async () => {
      try {
        setLoading(true);
        setError("");
        
        const res = await apiFetch(`/api/services/master/${targetSlug}`);
        const data = await res.json();
        
        if (data.success && data.data) {
          const svc = data.data;
          setService(svc);

          // Fetch active experts for this master service
          const expRes = await apiFetch(`/api/expert-activations/master-service/${svc.id}/experts`);
          const expData = await expRes.json();
          if (expData.success) {
            setExperts(expData.data || []);
          } else {
            setExperts(svc.assigned_experts || []);
          }
        } else {
          setError(data.message || "Master service not found.");
        }
      } catch (err) {
        setError(err.message || "Error loading service page.");
      } finally {
        setLoading(false);
      }
    };

    fetchServiceAndExperts();
  }, [targetSlug]);

  // Open Booking Modal & Refresh Wallet Balance
  const handleOpenBookingModal = async (exp) => {
    const userRaw = localStorage.getItem("user") || localStorage.getItem("userData");
    let user = null;
    try { if (userRaw) user = JSON.parse(userRaw); } catch(e) {}
    
    setSelectedExpertForBooking(exp);
    setCompletedBooking(null);
    setBookingError("");
    setBookingFormResponses({
      full_name: user?.name || (user?.first_name ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : ""),
      email: user?.email || "",
      phone: user?.phone || user?.mobile || "",
      requirements_note: ""
    });
    setBookingDocuments([]);
    setBookingDocumentsMap({});
    await fetchWalletBalance();
  };

  // Handle specific document spec selection
  const handleSpecFileSelect = (docSpec, file) => {
    if (!file) return;
    setBookingDocumentsMap((prev) => ({
      ...prev,
      [docSpec.doc_type_key]: {
        doc_type_key: docSpec.doc_type_key,
        label: docSpec.label,
        file_name: file.name,
        file_size: file.size,
        file_url: URL.createObjectURL(file),
        raw_file: file
      }
    }));
  };

  // Handle generic document selection in modal
  const handleDocFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBookingDocuments((prev) => [
      ...prev,
      {
        doc_type_key: "INITIAL_DOCUMENT",
        file_name: file.name,
        file_size: file.size,
        file_url: URL.createObjectURL(file),
        raw_file: file
      }
    ]);
  };

  // Filtered & Sorted Experts
  const processedExperts = useMemo(() => {
    let result = [...experts];

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) => (e.expert_name || e.name || "").toLowerCase().includes(q) || (e.position || "").toLowerCase().includes(q)
      );
    }

    if (sortBy === "price_asc") {
      result.sort((a, b) => Number(a.custom_price || 0) - Number(b.custom_price || 0));
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => Number(b.custom_price || 0) - Number(a.custom_price || 0));
    } else if (sortBy === "sla_asc") {
      result.sort((a, b) => Number(a.delivery_time_days || 999) - Number(b.delivery_time_days || 999));
    } else if (sortBy === "rating_desc") {
      result.sort((a, b) => Number(b.avg_rating || 5) - Number(a.avg_rating || 5));
    }

    return result;
  }, [experts, searchQuery, sortBy]);

  // Open Add Balance Popup for Top Up
  const handleTriggerRecharge = (neededAmount = null) => {
    setRechargeAmountNeeded(neededAmount);
    setShowRechargePopup(true);
  };

  // Cashfree Order Creation for AddBalancePopup
  const handleCreateRechargeOrder = async (amount) => {
    const res = await apiFetch("/api/wallet/create-order", {
      method: "POST",
      headers: userAuthHeaders(),
      body: JSON.stringify({ amount })
    });
    return await res.json();
  };

  // Cashfree Confirm for AddBalancePopup
  const handleConfirmRecharge = async (paymentDetails) => {
    const res = await apiFetch("/api/wallet/add", {
      method: "POST",
      headers: userAuthHeaders(),
      body: JSON.stringify(paymentDetails)
    });
    const data = await res.json();
    if (data.success) {
      await fetchWalletBalance();
    }
    return data;
  };

  // Confirm Wallet Payment & Create Booking
  const handleConfirmWalletBooking = async () => {
    if (!selectedExpertForBooking || !service) return;

    // Check mandatory document specs
    const combinedDocs = [...Object.values(bookingDocumentsMap), ...bookingDocuments];
    if (Array.isArray(service.document_specs) && service.document_specs.length > 0) {
      const missingMandatory = service.document_specs.filter(
        (spec) => (spec.is_mandatory === 1 || spec.is_mandatory === true) && !bookingDocumentsMap[spec.doc_type_key]
      );
      if (missingMandatory.length > 0) {
        setBookingError(
          `Please upload all mandatory documents from the checklist: ${missingMandatory.map((m) => m.label).join(", ")}`
        );
        return;
      }
    }

    // Check mandatory form fields
    if (Array.isArray(service.form_fields) && service.form_fields.length > 0) {
      const missingFields = service.form_fields.filter((f) => {
        const isRequired = f.is_required === 1 || f.is_required === true;
        const key = f.field_key || f.key || f.id;
        return isRequired && !bookingFormResponses[key];
      });
      if (missingFields.length > 0) {
        setBookingError(
          `Please fill in all mandatory form fields: ${missingFields.map((m) => m.field_label || m.label).join(", ")}`
        );
        return;
      }
    }

    const basePrice = Number(selectedExpertForBooking.custom_price || service.base_price || 0);
    const offerPrice = selectedExpertForBooking.offer_price ? Number(selectedExpertForBooking.offer_price) : null;
    const effectiveBase = offerPrice && offerPrice > 0 ? offerPrice : basePrice;
    const gstAmount = Math.round(effectiveBase * 0.18);
    const totalPayable = effectiveBase + gstAmount;

    if (walletBalance < totalPayable) {
      const deficit = totalPayable - walletBalance;
      setBookingError(`Insufficient wallet balance. Total payable is ₹${totalPayable}, but your wallet balance is ₹${walletBalance}.`);
      handleTriggerRecharge(deficit);
      return;
    }

    try {
      setBookingInProgress(true);
      setBookingError("");

      // Upload raw files to server first to get permanent URLs
      const uploadHeaders = userAuthHeaders();
      const processedDocs = await Promise.all(
        combinedDocs.map(async (doc) => {
          if (doc.raw_file) {
            try {
              const formData = new FormData();
              formData.append("file", doc.raw_file);
              const uploadRes = await fetch("/api/workspace/upload-file", {
                method: "POST",
                headers: {
                  Authorization: uploadHeaders.Authorization
                },
                body: formData
              });
              const uploadData = await uploadRes.json();
              if (uploadData.success && uploadData.data?.file_url) {
                return {
                  doc_type_key: doc.doc_type_key,
                  label: doc.label,
                  file_name: doc.file_name,
                  file_size: doc.file_size,
                  file_url: uploadData.data.file_url
                };
              }
            } catch (e) {
              console.warn("File upload fallback error during booking initiation:", e.message);
            }
          }
          return {
            doc_type_key: doc.doc_type_key,
            label: doc.label,
            file_name: doc.file_name,
            file_size: doc.file_size,
            file_url: doc.file_url
          };
        })
      );

      const res = await apiFetch("/api/bookings/initiate", {
        method: "POST",
        headers: userAuthHeaders(),
        body: JSON.stringify({
          master_service_id: service.id,
          expert_activation_id: selectedExpertForBooking.id || selectedExpertForBooking.activation_id,
          expert_id: selectedExpertForBooking.expert_id || selectedExpertForBooking.id,
          payment_method: "wallet",
          custom_price: effectiveBase,
          form_responses: bookingFormResponses,
          initial_documents: processedDocs
        })
      });

      const data = await res.json();
      if (data.success) {
        setCompletedBooking({
          booking_id: data.data?.booking_id || data.booking_id,
          workspace_id: data.data?.workspace_id || data.workspace_id,
          expert_id: selectedExpertForBooking.expert_id || selectedExpertForBooking.id,
          expert_name: selectedExpertForBooking.expert_name || selectedExpertForBooking.name,
          total_amount: totalPayable
        });
        await fetchWalletBalance();
      } else {
        setBookingError(data.message || "Booking creation failed.");
      }
    } catch (err) {
      setBookingError(err.message || "Network error while confirming booking.");
    } finally {
      setBookingInProgress(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "4rem 1rem", textAlign: "center", color: "#64748b", fontWeight: 700 }}>
        Loading Master Service & Verified Experts...
      </div>
    );
  }

  if (error || !service) {
    return (
      <div style={{ padding: "4rem 1rem", textAlign: "center", maxWidth: 600, margin: "0 auto" }}>
        <h3 style={{ color: "#0f172a" }}>Service Not Found</h3>
        <p style={{ color: "#64748b" }}>{error || "The requested master service does not exist or has been archived."}</p>
        <Link to="/all-services" style={{ display: "inline-block", marginTop: "1rem", padding: "10px 20px", background: "#2563eb", color: "#fff", borderRadius: 8, textDecoration: "none", fontWeight: 700 }}>
          Explore All Master Services
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: 1150, margin: "0 auto", display: "grid", gap: "1.75rem" }}>
        
        {/* BREADCRUMB NAVIGATION */}
        <nav style={{ fontSize: 13, color: "#64748b", display: "flex", gap: 6, alignItems: "center" }}>
          <Link to="/" style={{ color: "#2563eb", textDecoration: "none" }}>Home</Link>
          <span>/</span>
          <Link to="/all-services" style={{ color: "#2563eb", textDecoration: "none" }}>Services</Link>
          {service.category_name && (
            <>
              <span>/</span>
              <span style={{ color: "#475569" }}>{service.category_name}</span>
            </>
          )}
          <span>/</span>
          <strong style={{ color: "#0f172a" }}>{service.title}</strong>
        </nav>

        {/* MASTER SERVICE HERO BANNER CARD */}
        <header style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "1.5rem", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", alignItems: "center" }}>
          <div style={{ position: "relative", width: "100%", maxHeight: 260, borderRadius: 12, overflow: "hidden", border: "1px solid #cbd5e1", background: "#f8fafc" }}>
            <img
              src={getServiceImageUrl(service.image_url || service.thumbnail_url || service.banner_url || service.icon_url)}
              alt={service.title}
              style={{ width: "100%", height: 260, objectFit: "cover", display: "block" }}
              onError={(e) => { e.target.src = DEFAULT_SERVICE_IMAGE; }}
            />
          </div>

          <div style={{ display: "grid", gap: "0.75rem" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
              {service.category_name && (
                <span style={{ background: "#dbeafe", color: "#1e40af", padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                  {service.category_name}
                </span>
              )}
              {service.subcategory_name && (
                <span style={{ background: "#ecfdf5", color: "#065f46", padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                  {service.subcategory_name}
                </span>
              )}
              <span style={{ background: "#f1f5f9", color: "#475569", padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                SLA: {service.delivery_time_days || 1} Day(s)
              </span>
            </div>

            <h1 style={{ margin: 0, color: "#0f172a", fontSize: "1.75rem", fontWeight: 900, lineHeight: 1.25 }}>
              {service.title}
            </h1>

            {service.short_description && (
              <p style={{ margin: 0, color: "#475569", fontSize: "0.95rem", lineHeight: 1.5 }}>
                {service.short_description}
              </p>
            )}

            <div style={{ display: "flex", gap: 16, alignItems: "center", paddingTop: 4 }}>
              <div>
                <span style={{ fontSize: 12, color: "#64748b" }}>Starting Base Price</span>
                <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#059669" }}>
                  ₹{service.base_price || 0}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ACTIVE BOOKING NOTICE CARD */}
        {activeUserBooking && (
          <div style={{ background: "#ecfdf5", border: "1px solid #6ee7b7", borderRadius: 16, padding: "1.25rem 1.5rem", display: "grid", gap: 12, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <div>
                <h4 style={{ margin: 0, color: "#065f46", fontSize: "1.15rem" }}>
                  You have an active booking for this service!
                </h4>
                <div style={{ fontSize: 13, color: "#047857", marginTop: 4 }}>
                  Order #{activeUserBooking.id} • Status: <strong style={{ textTransform: "uppercase", background: "#d1fae5", padding: "2px 8px", borderRadius: 6 }}>{activeUserBooking.status}</strong> • Expert: <strong>{activeUserBooking.expert_name || "Assigned Expert"}</strong>
                </div>
              </div>
              <span style={{ background: "#059669", color: "#fff", padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 800 }}>
                Active Order In Progress
              </span>
            </div>

            {/* REUSE COMMUNICATION & WORKSPACE FUNNEL */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
              {activeUserBooking.expert_id && (
                <>
                  <button
                    type="button"
                    onClick={() => navigate(`/user/chat?expert_id=${activeUserBooking.expert_id}`)}
                    style={{ padding: "8px 14px", background: "#2563eb", color: "#fff", border: 0, borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <FiMessageCircle /> Start Chat
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/user/voice-call/${activeUserBooking.expert_id}`)}
                    style={{ padding: "8px 14px", background: "#059669", color: "#fff", border: 0, borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <FiPhone /> Voice Call
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => navigate(`/user/workspace/${activeUserBooking.booking_id || activeUserBooking.id}`)}
                style={{ padding: "8px 14px", background: "#0f172a", color: "#fff", border: 0, borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
              >
                <FiFolder /> Open Workspace
              </button>
            </div>
          </div>
        )}



        {/* ACTIVATED EXPERTS LISTINGS WITH FILTERS */}
        <section style={{ display: "grid", gap: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <h2 style={{ margin: 0, color: "#0f172a", fontSize: "1.4rem" }}>
              Verified Experts Offering This Service ({processedExperts.length})
            </h2>

            {/* FILTERS TOOLBAR */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="Search expert by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ padding: "6px 12px 6px 30px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13, minWidth: 200 }}
                />
                <FiSearch style={{ position: "absolute", left: 10, top: 9, color: "#94a3b8" }} />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13, background: "#fff", color: "#334155", fontWeight: 600 }}
              >
                <option value="recommended">Sort: Recommended</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="sla_asc">SLA: Fastest Delivery</option>
                <option value="rating_desc">Rating: Highest First</option>
              </select>
            </div>
          </div>

          {processedExperts.length === 0 ? (
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "2.5rem", textAlign: "center" }}>
              <p style={{ color: "#64748b", margin: 0, fontSize: "1.05rem" }}>No experts match your search criteria. You can proceed with instant auto-assignment.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.25rem" }}>
              {processedExperts.map((exp) => {
                const expPrice = Number(exp.custom_price || service.base_price);
                const expSla = exp.delivery_time_days || service.delivery_time_days || 1;
                return (
                  <div
                    key={exp.id || exp.expert_id}
                    style={{
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: 14,
                      padding: "1.25rem",
                      display: "flex",
                      flexDirection: "column",
                      justify: "space-between",
                      gap: 12,
                      boxShadow: "0 2px 4px rgba(0,0,0,0.04)"
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <img
                          src={exp.profile_photo || exp.profile_image || "https://via.placeholder.com/60"}
                          alt={exp.expert_name || exp.name}
                          style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", border: "2px solid #e2e8f0" }}
                        />
                        <div>
                          <h4 style={{ margin: 0, color: "#0f172a", fontSize: "1.1rem" }}>{exp.expert_name || exp.name}</h4>
                          <div style={{ fontSize: 12, color: "#64748b" }}>{exp.position || "Verified Expert"} • {exp.location || exp.city || "India"}</div>
                          <div style={{ fontSize: 12, color: "#ca8a04", fontWeight: 700, marginTop: 2 }}>
                            ★ {exp.avg_rating || "4.9"} <span style={{ color: "#64748b", fontWeight: 500 }}>({exp.total_reviews || 12} reviews)</span>
                          </div>
                        </div>
                      </div>

                      {exp.custom_bio && (
                        <p style={{ margin: "10px 0 0", color: "#475569", fontSize: "0.85rem", lineHeight: 1.4, background: "#f8fafc", padding: "8px 10px", borderRadius: 8 }}>
                          "{exp.custom_bio}"
                        </p>
                      )}
                    </div>

                    <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "0.85rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>Expert Selling Price</div>
                        <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#059669" }}>
                          ₹{expPrice}
                        </div>
                        {exp.offer_price && <span style={{ fontSize: 11, color: "#94a3b8", textDecoration: "line-through" }}>₹{exp.offer_price}</span>}
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>Guaranteed SLA</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{expSla} Days Turnaround</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const activeSlug = targetSlug || service?.slug || service?.id;
                          const expId = exp.expert_id || exp.id;
                          const actId = exp.id || exp.activation_id;
                          navigate(`/user/booking/${activeSlug}?expertId=${expId}&activationId=${actId}`, {
                            state: { expert: exp, service }
                          });
                        }}
                        style={{ padding: "8px 16px", background: "#2563eb", color: "#fff", border: 0, borderRadius: 8, fontWeight: 800, fontSize: 13, cursor: "pointer" }}
                      >
                        Book Service
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* DYNAMIC FORM & WORKFLOW SPECIFICATIONS */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
          {/* REQUIRED DOCUMENTS */}
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "1.25rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <h3 style={{ margin: "0 0 0.75rem 0", color: "#0f172a", fontSize: "1.15rem" }}>Required Documents Checklist</h3>
            {Array.isArray(service.document_specs) && service.document_specs.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "#334155", display: "grid", gap: 8, fontSize: 14 }}>
                {service.document_specs.map((doc) => (
                  <li key={doc.id || doc.doc_type_key}>
                    <strong>{doc.label}</strong> {doc.is_mandatory ? <span style={{ color: "#ef4444" }}>* (Mandatory)</span> : <span style={{ color: "#64748b" }}>(Optional)</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>Standard identity and tax documents required during execution.</p>
            )}
          </div>

          {/* WORKFLOW PIPELINE STEPS */}
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "1.25rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <h3 style={{ margin: "0 0 0.75rem 0", color: "#0f172a", fontSize: "1.15rem" }}>Service Fulfillment Steps</h3>
            {Array.isArray(service.workflow_steps) && service.workflow_steps.length > 0 ? (
              <div style={{ display: "grid", gap: 10 }}>
                {service.workflow_steps.map((step, idx) => (
                  <div key={step.id || idx} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14, color: "#334155" }}>
                    <span style={{ background: "#2563eb", color: "#fff", width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12 }}>
                      {step.step_order || idx + 1}
                    </span>
                    <strong>{step.step_label}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>Step 1: Document Upload → Step 2: Expert Preparation → Step 3: Final Delivery</p>
            )}
          </div>
        </section>

      </div>



      {/* RECHARGE WALLET POPUP */}
      {showRechargePopup && (
        <AddBalancePopup
          amountPreset={rechargeAmountNeeded}
          onClose={() => setShowRechargePopup(false)}
          createOrder={handleCreateRechargeOrder}
          onConfirm={handleConfirmRecharge}
        />
      )}
    </div>
  );
}
