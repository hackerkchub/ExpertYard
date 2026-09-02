import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiFileText,
  FiFolder,
  FiCreditCard,
  FiPlusCircle,
  FiUser,
  FiClock,
  FiMessageCircle,
  FiPhone,
  FiShield,
  FiUploadCloud,
  FiChevronDown,
  FiChevronUp,
  FiEdit3,
  FiStar,
  FiAlertCircle
} from "react-icons/fi";
import AddBalancePopup from "../../components/AddBalancePopup/AddBalancePopup";
import { uploadWorkspaceFile } from "../../../../shared/api/workspace.api";
import PremiumCenterLoader from "../../../../shared/components/Loader/PremiumCenterLoader";

const WIZARD_CANVAS_STYLES = `
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  
  *, *:before, *:after {
    box-sizing: border-box !important;
  }

  .dbw-page-wrapper {
    min-height: 90vh;
    background: #f8fafc;
    padding: 1.25rem 0.75rem 5rem;
    overflow-x: hidden !important;
    width: 100% !important;
    max-width: 100vw !important;
    box-sizing: border-box !important;
  }

  .dbw-container {
    max-width: 1040px;
    width: 100% !important;
    margin: 0 auto;
    display: grid;
    gap: 1.25rem;
    box-sizing: border-box !important;
    overflow-x: hidden !important;
  }

  .dbw-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 1.25rem 1.5rem;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    box-sizing: border-box !important;
  }

  .dbw-expert-card {
    border: 1px solid #e2e8f0;
    background: #ffffff;
    border-radius: 14px;
    padding: 1.15rem;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  }

  .dbw-expert-card:hover {
    border-color: #d8b4fe;
    box-shadow: 0 4px 12px rgba(107, 70, 193, 0.08);
  }

  .dbw-expert-card.selected {
    border: 2px solid #6b46c1 !important;
    background: #faf5ff !important;
    box-shadow: 0 4px 14px rgba(107, 70, 193, 0.12) !important;
  }

  .dbw-form-2col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    width: 100% !important;
    box-sizing: border-box !important;
  }

  .dbw-field-group {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    width: 100% !important;
    box-sizing: border-box !important;
  }

  .dbw-field-label {
    font-size: 0.82rem;
    font-weight: 700;
    color: #334155;
    margin-bottom: 2px;
  }

  .dbw-input-field {
    font-size: 15px !important;
    padding: 10px 14px !important;
    border-radius: 10px !important;
    border: 1px solid #cbd5e1 !important;
    width: 100% !important;
    box-sizing: border-box !important;
    background: #fff;
    color: #0f172a;
    transition: border-color 0.15s ease;
  }

  .dbw-input-field:focus {
    outline: none !important;
    border-color: #6b46c1 !important;
    box-shadow: 0 0 0 3px rgba(107, 70, 193, 0.12) !important;
  }

  .dbw-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    padding: 11px 20px;
    border-radius: 10px;
    font-weight: 800;
    font-size: 14px;
    border: 0;
    cursor: pointer;
    transition: all 0.15s ease;
    box-sizing: border-box !important;
    text-align: center;
  }

  .dbw-btn-purple {
    background: #6b46c1;
    color: #ffffff;
  }
  .dbw-btn-purple:hover {
    background: #553c9a;
  }

  .dbw-btn-green {
    background: #10b981;
    color: #ffffff;
  }
  .dbw-btn-green:hover {
    background: #059669;
  }

  .dbw-btn-outline {
    background: #ffffff;
    color: #334155;
    border: 1px solid #cbd5e1;
  }
  .dbw-btn-outline:hover {
    background: #f1f5f9;
  }

  @media (max-width: 768px) {
    .dbw-form-2col {
      grid-template-columns: 1fr !important;
    }
    .dbw-main-grid {
      grid-template-columns: 1fr !important;
    }
    .dbw-sidebar-card {
      display: none !important;
    }
  }
`;

export default function DynamicBookingWizard() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Parse URL search params
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const queryExpertId = searchParams.get("expertId") || searchParams.get("expert_id");
  const queryActivationId = searchParams.get("activationId") || searchParams.get("activation_id");

  const stateExpert = location.state?.expert;
  const stateService = location.state?.service;

  // Check pre-selected expert
  const hasPreselectedExpert = Boolean(stateExpert || queryExpertId || queryActivationId);

  // Wizard step state (1: Choose Expert, 2: Details & Documents, 3: Review & Pay, 4: Confirmed)
  const [step, setStep] = useState(hasPreselectedExpert ? 2 : 1);

  // Mobile Order Summary Collapse Toggle
  const [showMobileSummary, setShowMobileSummary] = useState(false);

  // Master Service & Experts State
  const [service, setService] = useState(stateService || null);
  const [experts, setExperts] = useState([]);
  const [selectedExpert, setSelectedExpert] = useState(stateExpert || null);

  // Form & Documents State
  const [formResponses, setFormResponses] = useState({
    full_name: "",
    email: "",
    phone: "",
    requirements_note: ""
  });
  const [documentsMap, setDocumentsMap] = useState({});
  const [genericDocs, setGenericDocs] = useState([]);

  // Wallet & Payment State
  const [walletBalance, setWalletBalance] = useState(0);
  const [walletLoading, setWalletLoading] = useState(false);
  const [showRechargePopup, setShowRechargePopup] = useState(false);
  const [rechargeDeficit, setRechargeDeficit] = useState(null);

  // Status & Progress State
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [completedBooking, setCompletedBooking] = useState(null);

  // Auto pre-fill user info from auth
  useEffect(() => {
    const userRaw = localStorage.getItem("user") || localStorage.getItem("userData");
    if (userRaw) {
      try {
        const u = JSON.parse(userRaw);
        setFormResponses((prev) => ({
          ...prev,
          full_name: prev.full_name || u.name || (u.first_name ? `${u.first_name || ''} ${u.last_name || ''}`.trim() : ""),
          email: prev.email || u.email || "",
          phone: prev.phone || u.phone || u.mobile || ""
        }));
      } catch (e) {}
    }
  }, []);

  // Fetch Wallet Balance
  const fetchWalletBalance = useCallback(async () => {
    try {
      setWalletLoading(true);
      const token = localStorage.getItem("user_token") || localStorage.getItem("userToken") || localStorage.getItem("token") || "";
      const res = await fetch("/api/wallet", {
        headers: { Authorization: token ? `Bearer ${token}` : "" }
      });
      const data = await res.json();
      if (data.success || data.balance !== undefined) {
        setWalletBalance(Number(data.balance || data.data?.balance || 0));
      }
    } catch {
      setWalletBalance(0);
    } finally {
      setWalletLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("userToken") || localStorage.getItem("user_token");
    const userRaw = localStorage.getItem("user") || localStorage.getItem("userData");
    let userObj = null;
    try { if (userRaw) userObj = JSON.parse(userRaw); } catch(e) {}

    if (!token || !userObj) {
      const redirectPath = `${location.pathname}${location.search}${location.hash}`;
      navigate(`/user/auth?redirect=${encodeURIComponent(redirectPath)}`, {
        state: { from: location },
      });
      return;
    }
    fetchWalletBalance();
  }, [fetchWalletBalance, location, navigate]);

  // Fetch Service Details and Experts
  useEffect(() => {
    if (!slug) return;

    const fetchServiceData = async () => {
      try {
        setLoading(true);
        setBookingError("");

        const svcRes = await fetch(`/api/services/master/${slug}`);
        const svcData = await svcRes.json();

        if (svcData.success && svcData.data) {
          const masterSvc = svcData.data.masterService || svcData.data;
          setService(masterSvc);

          // Fetch Experts for this master service
          const serviceId = masterSvc.id;
          const expRes = await fetch(`/api/expert-activations/master-service/${serviceId}/experts`);
          const expData = await expRes.json();
          const activeExperts = expData.success ? (expData.data || []) : (svcData.data.experts || []);

          setExperts(activeExperts);

          // Auto select expert matched from query/state or choose first available
          let matched = null;
          if (queryActivationId) {
            matched = activeExperts.find((e) => String(e.id) === String(queryActivationId) || String(e.activation_id) === String(queryActivationId));
          }
          if (!matched && queryExpertId) {
            matched = activeExperts.find((e) => String(e.expert_id) === String(queryExpertId) || String(e.id) === String(queryExpertId));
          }
          if (!matched && stateExpert) {
            matched = stateExpert;
          }
          if (!matched && activeExperts.length > 0) {
            matched = activeExperts[0];
          }

          if (matched) {
            setSelectedExpert(matched);
            if (hasPreselectedExpert) {
              setStep(2);
            }
          }
        } else {
          setBookingError(svcData.message || "Master service unavailable.");
        }
      } catch (err) {
        setBookingError("Network error loading service details.");
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [slug, queryExpertId, queryActivationId, hasPreselectedExpert]);

  // Pricing calculations
  const basePrice = Number(selectedExpert?.custom_price || selectedExpert?.price_per_unit || service?.base_price || 0);
  const offerPrice = selectedExpert?.offer_price ? Number(selectedExpert.offer_price) : null;
  const effectiveBase = offerPrice && offerPrice > 0 ? offerPrice : basePrice;
  const totalPayable = effectiveBase;

  // Form Fields & Document Specs lists
  const formFields = service?.form_fields || service?.form_schema || [];
  const documentSpecs = service?.document_specs || service?.document_spec || [];

  // Handlers
  const handleFormFieldChange = (key, val) => {
    setFormResponses((prev) => ({ ...prev, [key]: val }));
  };

  const handleSpecDocSelect = (docSpec, file) => {
    if (!file) return;
    setDocumentsMap((prev) => ({
      ...prev,
      [docSpec.doc_type_key]: {
        doc_type_key: docSpec.doc_type_key,
        label: docSpec.label,
        file_name: file.name,
        file_size: file.size,
        rawFile: file
      }
    }));
  };

  // Validation
  const validateStep2 = () => {
    if (!formResponses.full_name || !formResponses.full_name.trim()) {
      alert("Please enter your full name.");
      return false;
    }
    if (!formResponses.phone || !formResponses.phone.trim()) {
      alert("Please enter your phone number.");
      return false;
    }
    const missingForm = formFields.filter((f) => {
      const isReq = f.is_required === 1 || f.is_required === true;
      const key = f.field_key || f.key || f.id;
      return isReq && !formResponses[key];
    });
    if (missingForm.length > 0) {
      alert(`Please fill in all mandatory form fields: ${missingForm.map((f) => f.field_label || f.label).join(", ")}`);
      return false;
    }

    // Mandatory Document Validation
    const missingDocs = documentSpecs.filter((spec) => {
      const isReq = spec.is_mandatory === 1 || spec.is_mandatory === true;
      return isReq && !documentsMap[spec.doc_type_key];
    });
    if (missingDocs.length > 0) {
      alert(`Please attach all mandatory documents: ${missingDocs.map((d) => d.label).join(", ")}`);
      return false;
    }

    return true;
  };

  // Wallet Top up Order handlers for AddBalancePopup
  const handleCreateRechargeOrder = async (amount) => {
    const token = localStorage.getItem("user_token") || localStorage.getItem("userToken") || localStorage.getItem("token") || "";
    const res = await fetch("/api/wallet/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ amount })
    });
    return await res.json();
  };

  const handleConfirmRecharge = async (paymentDetails) => {
    const token = localStorage.getItem("user_token") || localStorage.getItem("userToken") || localStorage.getItem("token") || "";
    const res = await fetch("/api/wallet/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(paymentDetails)
    });
    const data = await res.json();
    if (data.success) {
      await fetchWalletBalance();
    }
    return data;
  };

  // Submit Booking & Process Payment
  const handleConfirmBooking = async () => {
    if (!selectedExpert || !service) {
      alert("Missing service or selected expert.");
      return;
    }

    if (walletBalance < totalPayable) {
      const deficit = totalPayable - walletBalance;
      setRechargeDeficit(deficit);
      setShowRechargePopup(true);
      return;
    }

    try {
      setSubmitting(true);
      setBookingError("");
      const token = localStorage.getItem("user_token") || localStorage.getItem("userToken") || localStorage.getItem("token") || "";

      const allDocs = [...Object.values(documentsMap), ...genericDocs];

      const processedDocs = await Promise.all(
        allDocs.map(async (doc) => {
          if (doc.rawFile) {
            try {
              const formData = new FormData();
              formData.append("file", doc.rawFile);
              const upRes = await uploadWorkspaceFile(formData);
              const upData = upRes.data;
              if (upData.success && upData.data?.file_url) {
                return {
                  doc_type_key: doc.doc_type_key,
                  label: doc.label || "Document",
                  file_name: doc.file_name,
                  file_size: doc.file_size,
                  file_url: upData.data.file_url
                };
              }
            } catch (e) {
              console.warn("Doc upload fallback error:", e);
            }
          }
          return {
            doc_type_key: doc.doc_type_key,
            label: doc.label || "Document",
            file_name: doc.file_name,
            file_size: doc.file_size,
            file_url: doc.file_url || ""
          };
        })
      );

      const payload = {
        master_service_id: service.id,
        expert_activation_id: selectedExpert.id || selectedExpert.activation_id,
        expert_id: selectedExpert.expert_id || selectedExpert.id,
        payment_method: "wallet",
        custom_price: effectiveBase,
        form_responses: formResponses,
        initial_documents: processedDocs
      };

      const res = await fetch("/api/bookings/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        setCompletedBooking(data.data);
        setStep(4); // Confirmed Step
      } else {
        setBookingError(data.message || "Failed to confirm booking.");
      }
    } catch (err) {
      setBookingError("Network error confirming booking.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <PremiumCenterLoader />;
  }

  if (bookingError && !service) {
    return (
      <div style={{ maxWidth: 600, margin: "2rem auto", padding: "1.5rem", background: "#fff", borderRadius: 16, border: "1px solid #fecaca", textAlign: "center", boxSizing: "border-box" }}>
        <style dangerouslySetInnerHTML={{ __html: WIZARD_CANVAS_STYLES }} />
        <h3 style={{ color: "#dc2626", margin: "0 0 0.5rem 0" }}>Booking Unavailable</h3>
        <p style={{ color: "#64748b", marginBottom: "1.25rem", fontSize: 14 }}>{bookingError}</p>
        <button onClick={() => navigate(-1)} style={{ padding: "0.6rem 1.25rem", background: "#6b46c1", color: "#fff", border: 0, borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>
          ← Back to Service Details
        </button>
      </div>
    );
  }

  const stepsList = [
    { id: 1, label: "Choose Expert" },
    { id: 2, label: "Details & Documents" },
    { id: 3, label: "Review & Pay" }
  ];

  // Document upload count calculation
  const reqSpecs = documentSpecs.filter((s) => s.is_mandatory === 1 || s.is_mandatory === true);
  const uploadedReqCount = reqSpecs.filter((s) => !!documentsMap[s.doc_type_key]).length;

  return (
    <div className="dbw-page-wrapper">
      <style dangerouslySetInnerHTML={{ __html: WIZARD_CANVAS_STYLES }} />

      <div className="dbw-container">
        
        {/* TOP NAVIGATION BACK BAR & STEPPER */}
        {step <= 3 && (
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "1rem 1.25rem", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            
            <button
              type="button"
              onClick={() => {
                if (step > 1) setStep(step - 1);
                else navigate(-1);
              }}
              style={{ background: "#f1f5f9", border: 0, padding: "0.45rem 0.9rem", borderRadius: 8, fontWeight: 700, fontSize: "0.82rem", color: "#334155", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
            >
              <FiArrowLeft size={16} /> Back
            </button>

            {/* CANVAS BLUEPRINT STEPPER */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              {stepsList.map((s, idx) => {
                const isActive = step === s.id;
                const isPassed = step > s.id;
                return (
                  <React.Fragment key={s.id}>
                    <div
                      onClick={() => { if (isPassed) setStep(s.id); }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        cursor: isPassed ? "pointer" : "default"
                      }}
                    >
                      <div style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: isActive ? "#6b46c1" : isPassed ? "#ecfdf5" : "#f1f5f9",
                        color: isActive ? "#fff" : isPassed ? "#10b981" : "#64748b",
                        border: isPassed ? "1px solid #10b981" : "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 900
                      }}>
                        {isPassed ? "✓" : s.id}
                      </div>
                      <span style={{ fontSize: "0.82rem", fontWeight: isActive ? 800 : 600, color: isActive ? "#0f172a" : isPassed ? "#047857" : "#64748b" }}>
                        {s.label}
                      </span>
                    </div>
                    {idx < stepsList.length - 1 && (
                      <span style={{ color: "#cbd5e1", fontSize: "0.8rem" }}>────────</span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        {/* MAIN WIZARD BODY GRID */}
        <div className="dbw-main-grid" style={{ display: "grid", gridTemplateColumns: step === 4 ? "1fr" : "1fr 320px", gap: "1.25rem", alignItems: "start", width: "100%" }}>
          
          {/* LEFT PRIMARY PANEL */}
          <div className="dbw-card">
            
            {/* =========================================================================
               STEP 1: CHOOSE EXPERT
               ========================================================================= */}
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#6b46c1", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    STEP 1 OF 3
                  </span>
                  <h2 style={{ margin: "0.2rem 0 0.4rem 0", color: "#0f172a", fontSize: "1.3rem", fontWeight: 800 }}>
                    Choose Your Expert
                  </h2>
                  <p style={{ margin: 0, color: "#64748b", fontSize: "0.88rem" }}>
                    Select a verified subject-matter expert for <strong>{service?.title}</strong>.
                  </p>
                </div>

                {experts.length === 0 ? (
                  <div style={{ padding: "1.25rem", background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0", textAlign: "center", color: "#64748b", fontSize: 13 }}>
                    Standard platform expert will be assigned upon booking confirmation.
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: 12 }}>
                    {experts.map((exp) => {
                      const expId = exp.expert_id || exp.id;
                      const isSel = selectedExpert && String(selectedExpert.expert_id || selectedExpert.id) === String(expId);
                      const price = exp.custom_price || exp.price_per_unit || service?.base_price || 0;
                      const sla = exp.delivery_time_days || 1;

                      return (
                        <div
                          key={expId}
                          onClick={() => setSelectedExpert(exp)}
                          className={`dbw-expert-card ${isSel ? "selected" : ""}`}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", gap: 12 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>
                              <div style={{
                                width: 48,
                                height: 48,
                                borderRadius: "50%",
                                background: isSel ? "#6b46c1" : "#f3e8ff",
                                color: isSel ? "#fff" : "#6b46c1",
                                border: "1px solid #d8b4fe",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 800,
                                fontSize: "1.1rem",
                                flexShrink: 0
                              }}>
                                {(exp.expert_name || exp.name || "E").slice(0, 2).toUpperCase()}
                              </div>
                              <div style={{ minWidth: 0, flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                                  <span style={{ fontWeight: 800, color: "#0f172a", fontSize: "1rem" }}>
                                    {exp.expert_name || exp.name}
                                  </span>
                                  <span style={{ background: "#dcfce7", color: "#15803d", fontSize: 10, fontWeight: 800, padding: "2px 7px", borderRadius: 10 }}>
                                    ✓ VERIFIED EXPERT
                                  </span>
                                </div>
                                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                                  ⭐ {exp.expert_rating || 4.9} Rating • {exp.position || "Certified Expert"}
                                </div>
                              </div>
                            </div>

                            <div style={{ textAlign: "right" }}>
                              <span style={{ fontSize: "1.2rem", fontWeight: 900, color: "#059669", display: "block" }}>₹{price}</span>
                              <span style={{ fontSize: 11, color: "#64748b" }}>{sla} Day SLA</span>
                            </div>
                          </div>

                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: 10 }}>
                            <span style={{ fontSize: 12, color: "#475569" }}>
                              Specialization: {exp.specialization || "Service Fulfillment"}
                            </span>

                            <button
                              type="button"
                              className={`dbw-btn ${isSel ? "dbw-btn-purple" : "dbw-btn-outline"}`}
                              style={{ padding: "6px 14px", fontSize: 12 }}
                            >
                              {isSel ? "✓ SELECTED" : "SELECT EXPERT"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
                  <button
                    type="button"
                    className="dbw-btn dbw-btn-purple"
                    onClick={() => {
                      if (!selectedExpert && experts.length > 0) {
                        setSelectedExpert(experts[0]);
                      }
                      setStep(2);
                    }}
                  >
                    Continue to Details & Documents →
                  </button>
                </div>
              </div>
            )}

            {/* =========================================================================
               STEP 2: DETAILS & DOCUMENTS
               ========================================================================= */}
            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#6b46c1", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    STEP 2 OF 3
                  </span>
                  <h2 style={{ margin: "0.2rem 0 0.4rem 0", color: "#0f172a", fontSize: "1.3rem", fontWeight: 800 }}>
                    Your Details & Documents
                  </h2>
                  <p style={{ margin: 0, color: "#64748b", fontSize: "0.88rem" }}>
                    Provide contact information and attach service requirements.
                  </p>
                </div>

                {/* SELECTED EXPERT SUMMARY CHIP */}
                {selectedExpert && (
                  <div style={{ background: "#faf5ff", border: "1px solid #d8b4fe", borderRadius: 12, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#6b46c1", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12 }}>
                        {(selectedExpert.expert_name || selectedExpert.name || "E").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>Selected Expert</div>
                        <strong style={{ fontSize: 13, color: "#553c9a" }}>{selectedExpert.expert_name || selectedExpert.name}</strong>
                      </div>
                    </div>
                    <button type="button" onClick={() => setStep(1)} style={{ background: "#fff", border: "1px solid #cbd5e1", borderRadius: 6, padding: "4px 10px", fontSize: 12, fontWeight: 700, color: "#6b46c1", cursor: "pointer" }}>
                      Change Expert
                    </button>
                  </div>
                )}

                {/* SECTION 1: YOUR INFORMATION */}
                <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: "1.15rem", display: "flex", flexDirection: "column", gap: "0.85rem", background: "#ffffff" }}>
                  <h4 style={{ margin: 0, color: "#0f172a", fontSize: "0.95rem", fontWeight: 800 }}>SECTION 1: YOUR CONTACT INFORMATION</h4>
                  
                  <div className="dbw-form-2col">
                    <div className="dbw-field-group">
                      <label className="dbw-field-label">Full Name *</label>
                      <input
                        type="text"
                        className="dbw-input-field"
                        value={formResponses.full_name || ""}
                        onChange={(e) => handleFormFieldChange("full_name", e.target.value)}
                        placeholder="Your Full Name"
                      />
                    </div>
                    <div className="dbw-field-group">
                      <label className="dbw-field-label">Phone Number *</label>
                      <input
                        type="text"
                        className="dbw-input-field"
                        value={formResponses.phone || ""}
                        onChange={(e) => handleFormFieldChange("phone", e.target.value)}
                        placeholder="Mobile Number"
                      />
                    </div>
                  </div>

                  <div className="dbw-field-group">
                    <label className="dbw-field-label">Email ID</label>
                    <input
                      type="email"
                      className="dbw-input-field"
                      value={formResponses.email || ""}
                      onChange={(e) => handleFormFieldChange("email", e.target.value)}
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                {/* SECTION 2: SERVICE REQUIREMENT */}
                <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: "1.15rem", display: "flex", flexDirection: "column", gap: "0.85rem", background: "#ffffff" }}>
                  <h4 style={{ margin: 0, color: "#0f172a", fontSize: "0.95rem", fontWeight: 800 }}>SECTION 2: SERVICE REQUIREMENT & INSTRUCTIONS</h4>
                  
                  <div className="dbw-field-group">
                    <label className="dbw-field-label">What do you need help with?</label>
                    <textarea
                      rows={3}
                      className="dbw-input-field"
                      value={formResponses.requirements_note || ""}
                      onChange={(e) => handleFormFieldChange("requirements_note", e.target.value)}
                      placeholder="Tell the expert what you need..."
                      style={{ resize: "vertical" }}
                    />
                  </div>

                  {/* DYNAMIC FORM FIELDS */}
                  {formFields.length > 0 && formFields.map((field) => {
                    const key = field.field_key || field.key || field.id;
                    const label = field.field_label || field.label || "Field";
                    const isReq = field.is_required === 1 || field.is_required === true;
                    return (
                      <div key={key} className="dbw-field-group">
                        <label className="dbw-field-label">
                          {label} {isReq && <span style={{ color: "#ef4444" }}>*</span>}
                        </label>
                        <input
                          type="text"
                          className="dbw-input-field"
                          value={formResponses[key] || ""}
                          onChange={(e) => handleFormFieldChange(key, e.target.value)}
                          placeholder={`Enter ${label}...`}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* SECTION 3: REQUIRED DOCUMENTS */}
                <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: "1.15rem", display: "flex", flexDirection: "column", gap: "0.85rem", background: "#ffffff" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h4 style={{ margin: 0, color: "#0f172a", fontSize: "0.95rem", fontWeight: 800 }}>SECTION 3: REQUIRED & OPTIONAL DOCUMENTS</h4>
                    {reqSpecs.length > 0 && (
                      <span style={{ fontSize: 11, fontWeight: 800, color: uploadedReqCount === reqSpecs.length ? "#059669" : "#b45309", background: uploadedReqCount === reqSpecs.length ? "#ecfdf5" : "#fffbeb", padding: "3px 8px", borderRadius: 10 }}>
                        {uploadedReqCount} of {reqSpecs.length} required uploaded
                      </span>
                    )}
                  </div>

                  {documentSpecs.length > 0 ? (
                    <div style={{ display: "grid", gap: 10 }}>
                      {documentSpecs.map((spec) => {
                        const isUploaded = !!documentsMap[spec.doc_type_key];
                        const uploaded = documentsMap[spec.doc_type_key];
                        const isMandatory = spec.is_mandatory === 1 || spec.is_mandatory === true;

                        return (
                          <div
                            key={spec.id || spec.doc_type_key}
                            style={{
                              background: isUploaded ? "#ecfdf5" : isMandatory ? "#fffbeb" : "#f8fafc",
                              border: isUploaded ? "1px solid #a7f3d0" : isMandatory ? "1px solid #fde68a" : "1px solid #e2e8f0",
                              borderRadius: 12,
                              padding: "0.85rem 1rem",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              flexWrap: "wrap",
                              gap: 8
                            }}
                          >
                            <div>
                              <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "#0f172a" }}>
                                📄 {spec.label}
                                {isMandatory ? (
                                  <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 800, color: "#b45309", background: "#fef3c7", padding: "2px 6px", borderRadius: 6 }}>REQUIRED</span>
                                ) : (
                                  <span style={{ marginLeft: 6, fontSize: 10, color: "#64748b" }}>OPTIONAL</span>
                                )}
                              </div>
                              {uploaded && (
                                <span style={{ fontSize: 11, color: "#047857", fontWeight: 700, display: "block", marginTop: 2 }}>
                                  ✓ Attached: {uploaded.file_name}
                                </span>
                              )}
                            </div>

                            <input
                              type="file"
                              onChange={(e) => handleSpecDocSelect(spec, e.target.files[0])}
                              style={{ fontSize: 12, maxWidth: 220 }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p style={{ margin: 0, fontSize: "0.83rem", color: "#64748b" }}>
                      No mandatory upfront documents required. You may attach optional files later in workspace.
                    </p>
                  )}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: "0.5rem" }}>
                  <button type="button" className="dbw-btn dbw-btn-outline" onClick={() => setStep(1)}>
                    ← Back to Expert List
                  </button>
                  <button
                    type="button"
                    className="dbw-btn dbw-btn-purple"
                    onClick={() => {
                      if (validateStep2()) setStep(3);
                    }}
                  >
                    Next: Review & Pay →
                  </button>
                </div>
              </div>
            )}

            {/* =========================================================================
               STEP 3: REVIEW & PAY
               ========================================================================= */}
            {step === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#6b46c1", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    STEP 3 OF 3
                  </span>
                  <h2 style={{ margin: "0.2rem 0 0.4rem 0", color: "#0f172a", fontSize: "1.3rem", fontWeight: 800 }}>
                    Review & Pay
                  </h2>
                  <p style={{ margin: 0, color: "#64748b", fontSize: "0.88rem" }}>
                    Review your order details and confirm payment via user wallet.
                  </p>
                </div>

                {bookingError && (
                  <div style={{ background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca", padding: "0.85rem 1rem", borderRadius: 10, fontSize: 13, fontWeight: 600 }}>
                    {bookingError}
                  </div>
                )}

                {/* ORDER SUMMARY RECAP */}
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 14, padding: "1.15rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  <h4 style={{ margin: 0, color: "#0f172a", fontSize: "0.95rem", fontWeight: 800 }}>ORDER RECAP</h4>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: "#64748b" }}>Service:</span>
                    <strong style={{ color: "#0f172a" }}>{service?.title}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: "#64748b" }}>Assigned Expert:</span>
                    <strong style={{ color: "#6b46c1" }}>{selectedExpert?.expert_name || selectedExpert?.name}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: "#64748b" }}>Customer:</span>
                    <strong style={{ color: "#0f172a" }}>{formResponses.full_name} ({formResponses.phone})</strong>
                  </div>
                </div>

                {/* PRICE BREAKDOWN TABLE */}
                <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "1.15rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <h4 style={{ margin: 0, color: "#0f172a", fontSize: "0.95rem", fontWeight: 800 }}>PRICE BREAKDOWN</h4>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#475569" }}>
                    <span>Service Price:</span>
                    <strong style={{ color: "#0f172a" }}>₹{effectiveBase}</strong>
                  </div>
                  <div style={{ borderTop: "1px dashed #cbd5e1", paddingTop: 8, display: "flex", justifyContent: "space-between", fontSize: "1.15rem", fontWeight: 900, color: "#0f172a" }}>
                    <span>Total Amount Payable:</span>
                    <span style={{ color: "#10b981" }}>₹{totalPayable}</span>
                  </div>
                </div>

                {/* WALLET STATUS CARD */}
                <div style={{
                  background: walletBalance >= totalPayable ? "#ecfdf5" : "#fffbeb",
                  border: walletBalance >= totalPayable ? "1px solid #a7f3d0" : "1px solid #fde68a",
                  borderRadius: 14,
                  padding: "1.15rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 10
                }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: walletBalance >= totalPayable ? "#047857" : "#b45309" }}>
                      {walletBalance >= totalPayable ? "✓ Sufficient Wallet Balance" : "⚠️ Insufficient Wallet Balance"}
                    </div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#0f172a", marginTop: 2 }}>
                      Available: ₹{walletBalance} {walletBalance < totalPayable && `(Shortfall: ₹${totalPayable - walletBalance})`}
                    </div>
                  </div>

                  {walletBalance < totalPayable && (
                    <button
                      type="button"
                      className="dbw-btn dbw-btn-purple"
                      onClick={() => {
                        setRechargeDeficit(totalPayable - walletBalance);
                        setShowRechargePopup(true);
                      }}
                      style={{ padding: "8px 14px", fontSize: 12 }}
                    >
                      <FiPlusCircle /> Top Up ₹{totalPayable - walletBalance}
                    </button>
                  )}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: "0.5rem" }}>
                  <button type="button" className="dbw-btn dbw-btn-outline" onClick={() => setStep(2)}>
                    ← Back
                  </button>
                  <button
                    type="button"
                    className="dbw-btn dbw-btn-green"
                    onClick={handleConfirmBooking}
                    disabled={submitting || walletLoading}
                    style={{ padding: "12px 24px", fontSize: 15 }}
                  >
                    {submitting ? "Processing Payment..." : `💳 CONFIRM & PAY ₹${totalPayable}`}
                  </button>
                </div>
              </div>
            )}

            {/* =========================================================================
               STEP 4: ORDER CONFIRMED (SUCCESS CONFIRMATION)
               ========================================================================= */}
            {step === 4 && completedBooking && (
              <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "1.25rem", padding: "1rem 0" }}>
                <div style={{ background: "#ecfdf5", color: "#10b981", width: 64, height: 64, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", fontSize: 32, fontWeight: 900, border: "2px solid #10b981" }}>
                  ✓
                </div>

                <div>
                  <h2 style={{ margin: 0, color: "#0f172a", fontSize: "1.6rem", fontWeight: 900 }}>ORDER CONFIRMED!</h2>
                  <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: "0.95rem" }}>
                    Your request has been assigned to <strong>{selectedExpert?.expert_name || selectedExpert?.name}</strong>.
                  </p>
                </div>

                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 14, padding: "1.25rem", display: "flex", flexDirection: "column", gap: 8, maxWidth: 460, margin: "0 auto", width: "100%", textAlign: "left" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: "#64748b" }}>Order Reference ID:</span>
                    <strong style={{ color: "#6b46c1" }}>#{completedBooking.booking_id}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: "#64748b" }}>Service Booked:</span>
                    <strong style={{ color: "#0f172a" }}>{service?.title}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: "#64748b" }}>Assigned Expert:</span>
                    <strong style={{ color: "#0f172a" }}>{selectedExpert?.expert_name || selectedExpert?.name}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: "#64748b" }}>Total Amount Paid:</span>
                    <strong style={{ color: "#10b981" }}>₹{totalPayable}</strong>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 460, margin: "0 auto", width: "100%" }}>
                  <button
                    type="button"
                    className="dbw-btn dbw-btn-purple"
                    onClick={() => navigate(`/user/workspace/${completedBooking.booking_id}`)}
                    style={{ width: "100%", padding: "14px", fontSize: 15 }}
                  >
                    TRACK MY ORDER →
                  </button>
                  <button
                    type="button"
                    className="dbw-btn dbw-btn-outline"
                    onClick={() => navigate("/user/my-orders")}
                    style={{ width: "100%" }}
                  >
                    Go to My Orders
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT SIDEBAR SUMMARY CARD (DESKTOP) */}
          {step <= 3 && (
            <div className="dbw-card dbw-sidebar-card" style={{ sticky: "top", top: 20 }}>
              <h3 style={{ margin: 0, color: "#0f172a", fontSize: "1.05rem", fontWeight: 800 }}>Order Summary</h3>
              
              <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: "0.85rem" }}>
                <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>Service</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", marginTop: 2 }}>{service?.title}</div>
              </div>

              {selectedExpert && (
                <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: "0.85rem" }}>
                  <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>Assigned Expert</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#6b46c1", marginTop: 2 }}>{selectedExpert.expert_name || selectedExpert.name}</div>
                  <div style={{ fontSize: 12, color: "#059669", fontWeight: 700, marginTop: 2 }}>⚡ {selectedExpert.delivery_time_days || 1} Days SLA Delivery</div>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#475569" }}>
                  <span>Service Fee:</span>
                  <strong>₹{effectiveBase}</strong>
                </div>
                <div style={{ borderTop: "1px dashed #cbd5e1", paddingTop: 6, display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 900, color: "#0f172a" }}>
                  <span>Total Payable:</span>
                  <span style={{ color: "#10b981" }}>₹{totalPayable}</span>
                </div>
              </div>

              <div style={{ background: "#faf5ff", borderRadius: 10, padding: 10, fontSize: 11, color: "#553c9a", lineHeight: 1.4, border: "1px solid #d8b4fe" }}>
                🔒 100% Escrow Protection. Funds are released upon completion.
              </div>
            </div>
          )}

        </div>
      </div>

      {/* RECHARGE WALLET POPUP */}
      {showRechargePopup && (
        <AddBalancePopup
          amountPreset={rechargeDeficit}
          onClose={() => setShowRechargePopup(false)}
          onSuccess={() => {
            setShowRechargePopup(false);
            setBookingError("");
          }}
          createOrder={handleCreateRechargeOrder}
          onConfirm={handleConfirmRecharge}
        />
      )}
    </div>
  );
}
