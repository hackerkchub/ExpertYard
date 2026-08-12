import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { 
  FiSearch, FiFilter, FiCheckCircle, FiClock, FiStar, FiShield, 
  FiDollarSign, FiMessageSquare, FiMessageCircle, FiPhone, FiVideo, FiFolder, 
  FiCreditCard, FiArrowRight, FiPlusCircle, FiChevronDown, FiChevronUp, FiZap, FiAward, FiFileText,
  FiCheck, FiX, FiHelpCircle, FiUser, FiInfo
} from "react-icons/fi";
import APP_CONFIG from "../../../../config/appConfig";
import AddBalancePopup from "../../components/AddBalancePopup/AddBalancePopup";

const userAuthHeaders = () => {
  const token = localStorage.getItem("token") || localStorage.getItem("userToken") || localStorage.getItem("user_token") || "";
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

const DEFAULT_SERVICE_IMAGE = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80";

const getServiceImageUrl = (url) => {
  if (!url) return DEFAULT_SERVICE_IMAGE;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  const base = API_BASE.replace(/\/api\/?$/, "");
  return `${base}${cleanPath}`;
};

export default function MasterServiceSlugPage() {
  const { slug, masterServiceSlug } = useParams();
  const targetSlug = masterServiceSlug || slug;
  const navigate = useNavigate();
  const location = useLocation();

  const [service, setService] = useState(null);
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Expert Filters & Search
  const [sortBy, setSortBy] = useState("recommended");
  const [searchQuery, setSearchQuery] = useState("");

  // Description Read More Toggle
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  // FAQ Accordion Open State
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

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

  // Active Booking Detection & Mobile App Styled Alert Dialog State
  const [activeUserBooking, setActiveUserBooking] = useState(null);
  const [showActiveBookingDialog, setShowActiveBookingDialog] = useState(false);
  const [showSelectExpertModal, setShowSelectExpertModal] = useState(false);

  // Related Services
  const [relatedServices, setRelatedServices] = useState([]);

  const isAlreadyBooked = useMemo(() => {
    return Boolean(
      activeUserBooking &&
      !["COMPLETED", "CANCELLED", "CLOSED", "completed", "cancelled", "closed"].includes(activeUserBooking.status)
    );
  }, [activeUserBooking]);

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

    // Fetch related services in same category
    if (service.category_id) {
      apiFetch(`/api/services/master?category_id=${service.category_id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.data)) {
            setRelatedServices(data.data.filter((s) => Number(s.id) !== Number(service.id)).slice(0, 4));
          }
        })
        .catch(() => {});
    }
  }, [service?.id, service?.category_id]);

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
    const token = localStorage.getItem("token") || localStorage.getItem("userToken") || localStorage.getItem("user_token");
    const userRaw = localStorage.getItem("user") || localStorage.getItem("userData");
    let user = null;
    try { if (userRaw) user = JSON.parse(userRaw); } catch(e) {}

    if (!token || !user) {
      const redirectPath = `${location.pathname}${location.search}${location.hash}`;
      navigate(`/user/auth?redirect=${encodeURIComponent(redirectPath)}`, {
        state: { from: location },
      });
      return;
    }

    if (activeUserBooking && !["COMPLETED", "CANCELLED", "CLOSED", "completed", "cancelled", "closed"].includes(activeUserBooking.status)) {
      setShowActiveBookingDialog(true);
      return;
    }
    
    // Fallback top expert if direct click
    const targetExpert = exp || experts[0] || {
      id: service?.expert_id || 1,
      expert_id: service?.expert_id || 1,
      expert_name: service?.expert_name || "Top Verified Expert",
      custom_price: service?.base_price || 999
    };

    setSelectedExpertForBooking(targetExpert);
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

  // Compute Minimum Price Across Service and All Experts
  const displayMinPrice = useMemo(() => {
    if (!service) return 0;
    const validPrices = [
      service.min_price,
      service.offer_price,
      service.price,
      service.base_price,
      ...(experts || []).map((e) => Number(e.offer_price || e.custom_price || e.price || 0)),
    ]
      .map((p) => Number(p))
      .filter((p) => !isNaN(p) && p > 0);

    return validPrices.length > 0 ? Math.min(...validPrices) : (service.base_price || 0);
  }, [service, experts]);

  // Default FAQs
  const defaultFaqs = [
    {
      q: "How does the Master Service fulfillment process work?",
      a: "Once booked, your order is assigned to a verified expert. You receive instant access to a private workspace where you can upload documents, chat directly, schedule calls, and track real-time progress through delivery."
    },
    {
      q: "What is the turnaround SLA for this service?",
      a: `The standard delivery SLA is ${service?.delivery_time_days || 1} business day(s). Verified experts commit to strict turnaround times with automated progress updates.`
    },
    {
      q: "Can I communicate directly with the assigned expert?",
      a: "Yes! Your booking includes direct 1-on-1 messaging, voice calls, and document sharing with your assigned expert inside the dedicated order workspace."
    },
    {
      q: "What documents are required to initiate work?",
      a: "Review the 'Required Documents Checklist' section below on this page. You can upload mandatory identity and service files during booking or inside your workspace anytime."
    }
  ];

  if (loading) {
    return (
      <div style={{ background: "#f8fafc", minHeight: "100vh", display: "grid", placeItems: "center", padding: "4rem 1rem" }}>
        <div style={{ textAlign: "center", color: "#64748b" }}>
          <div style={{ fontSize: "2rem", marginBottom: 12 }}>⚡</div>
          <h3 style={{ margin: 0, color: "#0f172a", fontSize: "1.25rem" }}>Loading Master Service Marketplace...</h3>
          <p style={{ margin: "4px 0 0", fontSize: 14 }}>Fetching service details, verified experts & workspace specs...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div style={{ background: "#f8fafc", minHeight: "100vh", padding: "4rem 1rem", display: "grid", placeItems: "center" }}>
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: "3rem 2rem", textAlign: "center", maxWidth: 500, boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: "3rem", marginBottom: 12 }}>📦</div>
          <h3 style={{ color: "#0f172a", margin: "0 0 8px", fontSize: "1.4rem" }}>Service Unavailable</h3>
          <p style={{ color: "#64748b", margin: 0, fontSize: 14, lineHeight: 1.6 }}>{error || "The requested master service does not exist or has been archived."}</p>
          <Link to="/all-services" style={{ display: "inline-block", marginTop: "1.5rem", padding: "12px 24px", background: "#2563eb", color: "#fff", borderRadius: 12, textDecoration: "none", fontWeight: 800 }}>
            Explore All Services
          </Link>
        </div>
      </div>
    );
  }

  const primaryExpert = experts[0] || {
    id: service.expert_id || 1,
    expert_id: service.expert_id || 1,
    expert_name: service.expert_name || "Verified Expert",
    custom_price: service.base_price || displayMinPrice
  };

  return (
    <div className="msp-root">
      <style>{`
        .msp-root {
          background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
          min-height: 100vh;
          padding: 2rem 1rem 4rem;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #0f172a;
        }

        .msp-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          gap: 2rem;
        }

        /* BREADCRUMB */
        .msp-breadcrumb {
          font-size: 13px;
          color: #64748b;
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }
        .msp-breadcrumb a {
          color: #2563eb;
          text-decoration: none;
          font-weight: 600;
        }
        .msp-breadcrumb a:hover {
          text-decoration: underline;
        }

        /* HERO CARD */
        .msp-hero-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 2.25rem;
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.05);
          display: grid;
          grid-template-columns: 45% 52%;
          gap: 3%;
          align-items: start;
        }

        /* LEFT IMAGE CONTAINER */
        .msp-image-col {
          position: relative;
          width: 100%;
          height: 520px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          box-sizing: border-box;
          box-shadow: inset 0 2px 6px rgba(0,0,0,0.02);
        }
        .msp-hero-img {
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
          object-fit: contain;
          object-position: center;
          display: block;
          transition: transform 0.3s ease;
        }
        .msp-image-col:hover .msp-hero-img {
          transform: scale(1.02);
        }

        .msp-image-badge {
          position: absolute;
          bottom: 14px;
          left: 14px;
          right: 14px;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(8px);
          color: #ffffff;
          padding: 8px 14px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        /* RIGHT CONTENT COL */
        .msp-content-col {
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
        }

        /* BADGES ROW */
        .msp-badges-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
        }
        .msp-pill {
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          line-height: 1;
        }
        .msp-pill-blue { background: #dbeafe; color: #1e40af; }
        .msp-pill-emerald { background: #ecfdf5; color: #065f46; }
        .msp-pill-amber { background: #fff7ed; color: #c2410c; }
        .msp-pill-green { background: #f0fdf4; color: #15803d; }

        /* TITLE */
        .msp-title {
          margin: 0;
          color: #0f172a;
          font-size: 2.35rem;
          font-weight: 900;
          line-height: 1.2;
          letter-spacing: -0.02em;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* RATING & REVIEWS BAR */
        .msp-meta-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          align-items: center;
          font-size: 13px;
          color: #475569;
          background: #f8fafc;
          padding: 8px 14px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          width: fit-content;
        }
        .msp-rating-star { color: #eab308; font-weight: 900; }

        /* SHORT DESCRIPTION BOX */
        .msp-desc-box {
          color: #475569;
          font-size: 0.95rem;
          line-height: 1.6;
          position: relative;
        }
        .msp-desc-clamped {
          display: -webkit-box;
          -webkit-line-clamp: 6;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .msp-read-more-btn {
          background: transparent;
          border: 0;
          color: #2563eb;
          font-weight: 800;
          font-size: 13px;
          padding: 4px 0;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-top: 4px;
        }
        .msp-read-more-btn:hover {
          text-decoration: underline;
        }

        /* HIGHLIGHT CHIPS */
        .msp-highlights-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .msp-chip {
          background: #f1f5f9;
          color: #334155;
          border: 1px solid #cbd5e1;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        /* PRICE BOX */
        .msp-price-card {
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 18px;
          padding: 1.1rem 1.4rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }
        .msp-price-val {
          font-size: 2.1rem;
          font-weight: 900;
          color: #059669;
          line-height: 1;
        }
        .msp-price-gst {
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
          margin-top: 4px;
        }

        /* ACTION BUTTONS GRID */
        .msp-action-grid {
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 10px;
          margin-top: 4px;
        }
        .msp-btn-primary {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: #ffffff;
          border: 0;
          border-radius: 14px;
          padding: 14px 24px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          min-height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
          transition: all 0.2s ease;
        }
        .msp-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.35);
        }
        .msp-btn-secondary {
          background: #eff6ff;
          color: #1d4ed8;
          border: 1.5px solid #bfdbfe;
          border-radius: 14px;
          padding: 14px 20px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          min-height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s ease;
        }
        .msp-btn-secondary:hover {
          background: #dbeafe;
        }
        .msp-btn-emerald {
          background: #ecfdf5;
          color: #047857;
          border: 1.5px solid #a7f3d0;
          border-radius: 14px;
          padding: 14px 20px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          min-height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s ease;
        }
        .msp-btn-emerald:hover {
          background: #d1fae5;
        }

        /* SECTION CARD */
        .msp-section-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 1.75rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
          display: grid;
          gap: 1.25rem;
        }
        .msp-section-title {
          margin: 0;
          color: #0f172a;
          font-size: 1.35rem;
          font-weight: 900;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* EXPERTS GRID */
        .msp-experts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
          gap: 1.25rem;
        }
        .msp-expert-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 14px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.03);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .msp-expert-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.06);
          border-color: #cbd5e1;
        }

        /* MOBILE RESPONSIVE MEDIA QUERIES */
        @media (max-width: 900px) {
          .msp-breadcrumb {
            display: none !important;
          }
          .msp-hero-card {
            grid-template-columns: 1fr;
            padding: 1.25rem;
            gap: 1.25rem;
            border-radius: 20px;
          }
          .msp-image-col {
            height: 280px;
            border-radius: 16px;
          }
          .msp-title {
            font-size: 1.65rem;
            -webkit-line-clamp: 3;
          }
          .msp-action-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }
          .msp-btn-primary, .msp-btn-secondary, .msp-btn-emerald {
            width: 100%;
            min-height: 52px;
          }
          .msp-experts-grid {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            padding-bottom: 8px;
            -webkit-overflow-scrolling: touch;
          }
          .msp-expert-card {
            min-width: 290px;
            scroll-snap-align: start;
          }
        }
      `}</style>

      <div className="msp-container">

        {/* BREADCRUMB NAVIGATION */}
        <nav className="msp-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/all-services">Master Services</Link>
          {service.category_name && (
            <>
              <span>/</span>
              <span style={{ color: "#475569" }}>{service.category_name}</span>
            </>
          )}
          <span>/</span>
          <strong style={{ color: "#0f172a" }}>{service.title}</strong>
        </nav>

        {/* 🌟 TWO-COLUMN HERO SECTION (DESKTOP) / SINGLE-COLUMN (MOBILE) */}
        <header className="msp-hero-card">
          
          {/* LEFT 45% COL: PRODUCT IMAGE (FIXED HEIGHT, OBJECT-FIT: CONTAIN) */}
          <div className="msp-image-col">
            <img
              src={getServiceImageUrl(service.image_url || service.thumbnail_url || service.banner_url || service.icon_url)}
              alt={service.title}
              className="msp-hero-img"
              onError={(e) => { e.target.src = DEFAULT_SERVICE_IMAGE; }}
            />
            <div className="msp-image-badge">
              <FiShield style={{ color: "#38bdf8" }} /> 100% Guaranteed SLA & Verified Experts
            </div>
          </div>

          {/* RIGHT 55% COL: BADGES, TITLE, RATING, SHORT DESC, CHIPS, PRICE & CALL TO ACTIONS */}
          <div className="msp-content-col">
            
            {/* BADGES ROW */}
            <div className="msp-badges-row">
              {service.category_name && (
                <span className="msp-pill msp-pill-blue">
                  🏷️ {service.category_name}
                </span>
              )}
              {service.subcategory_name && (
                <span className="msp-pill msp-pill-emerald">
                  ❖ {service.subcategory_name}
                </span>
              )}
              <span className="msp-pill msp-pill-amber">
                ⚡ {service.delivery_time_days || 1} Day Turnaround SLA
              </span>
              <span className="msp-pill msp-pill-green">
                ✓ Verified Master Service
              </span>
            </div>

            {/* PRODUCT TITLE */}
            <h1 className="msp-title">
              {service.title}
            </h1>

            {/* FORMATTED SHORT DESCRIPTION WITH READ MORE TOGGLE */}
            {service.short_description && (
              <div className="msp-desc-box">
                <div
                  className={`master-service-rich-description ${!isDescExpanded ? "msp-desc-clamped" : ""}`}
                  dangerouslySetInnerHTML={{ __html: service.short_description }}
                />
                {service.short_description.length > 220 && (
                  <button
                    type="button"
                    className="msp-read-more-btn"
                    onClick={() => setIsDescExpanded(!isDescExpanded)}
                  >
                    {isDescExpanded ? (
                      <>Show Less <FiChevronUp /></>
                    ) : (
                      <>Read More <FiChevronDown /></>
                    )}
                  </button>
                )}
              </div>
            )}


            {/* PRICING BLOCK */}
            <div className="msp-price-card">
              <div>
                <span style={{ fontSize: 12, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>Starting Service Fee</span>
                <div className="msp-price-val">
                  ₹{displayMinPrice.toLocaleString("en-IN")}
                </div>
                <div className="msp-price-gst">+ 18% GST • Inclusive of all workspace tools & delivery</div>
              </div>

              <div style={{ textAlign: "right" }}>
                <span style={{ background: "#dcfce7", color: "#15803d", padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 800 }}>
                  Best Value Guaranteed
                </span>
              </div>
            </div>

            {/* PRIMARY CALL TO ACTION BUTTONS */}
            <div className="msp-action-grid">
              {isAlreadyBooked ? (
                <button
                  type="button"
                  className="msp-btn-primary"
                  style={{
                    background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                    color: "#ffffff",
                    cursor: "default",
                    boxShadow: "0 4px 14px rgba(5, 150, 105, 0.25)",
                    border: 0
                  }}
                  onClick={(e) => e.preventDefault()}
                >
                  <FiCheckCircle size={18} /> You Have Already Booked This Service
                </button>
              ) : (
                <button
                  type="button"
                  className="msp-btn-primary"
                  onClick={() => {
                    if (experts && experts.length > 0) {
                      setShowSelectExpertModal(true);
                    } else {
                      handleOpenBookingModal(primaryExpert);
                    }
                  }}
                >
                  <FiZap /> Book Service Now
                </button>
              )}
            </div>

          </div>
        </header>

        {/* ACTIVE BOOKING NOTICE CARD (IF USER HAS ACTIVE ORDER) */}
        {activeUserBooking && (
          <div id="active-booking-notice" style={{ background: "#ecfdf5", border: "1.5px solid #6ee7b7", borderRadius: 20, padding: "1.25rem 1.5rem", display: "grid", gap: 12, boxShadow: "0 6px 16px rgba(5,150,105,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <div>
                <h4 style={{ margin: 0, color: "#065f46", fontSize: "1.15rem", fontWeight: 800 }}>
                  🎉 You have an active booking for this service!
                </h4>
                <div style={{ fontSize: 13, color: "#047857", marginTop: 4 }}>
                  Order #{activeUserBooking.id} • Status: <strong style={{ textTransform: "uppercase", background: "#d1fae5", padding: "2px 8px", borderRadius: 6 }}>{activeUserBooking.status}</strong> • Assigned Expert: <strong>{activeUserBooking.expert_name || "Assigned Expert"}</strong>
                </div>
              </div>
              <span style={{ background: "#059669", color: "#fff", padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 800 }}>
                Active Order In Progress
              </span>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
              {activeUserBooking.expert_id && (
                <>
                  <button
                    type="button"
                    onClick={() => navigate(`/user/chat?expert_id=${activeUserBooking.expert_id}`)}
                    style={{ padding: "10px 16px", background: "#2563eb", color: "#fff", border: 0, borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <FiMessageSquare /> Start Chat
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/user/voice-call/${activeUserBooking.expert_id}`, {
                      state: { pricingMode: "master_service", bookingId: activeUserBooking.id, serviceTitle: service.title }
                    })}
                    style={{ padding: "10px 16px", background: "#059669", color: "#fff", border: 0, borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <FiPhone /> Voice Call
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => navigate(`/user/workspace/${activeUserBooking.booking_id || activeUserBooking.id}`)}
                style={{ padding: "10px 16px", background: "#0f172a", color: "#fff", border: 0, borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
              >
                <FiFolder /> Open Dedicated Workspace
              </button>
            </div>
          </div>
        )}

        {/* 👥 VERIFIED EXPERTS OFFERING THIS SERVICE (HIDDEN IF USER HAS ACTIVE BOOKING) */}
        {!isAlreadyBooked && (
          <section className="msp-section-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <h2 className="msp-section-title">
                <FiAward style={{ color: "#2563eb" }} /> Verified Experts Offering This Service ({processedExperts.length})
              </h2>

              {/* EXPERTS SEARCH & FILTERS */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    placeholder="Search expert by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ padding: "8px 12px 8px 34px", borderRadius: 10, border: "1px solid #cbd5e1", fontSize: 13, minWidth: 210, outline: "none" }}
                  />
                  <FiSearch style={{ position: "absolute", left: 11, top: 11, color: "#94a3b8" }} />
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid #cbd5e1", fontSize: 13, background: "#fff", color: "#334155", fontWeight: 700 }}
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
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 16, padding: "2.5rem", textAlign: "center" }}>
                <p style={{ color: "#64748b", margin: 0, fontSize: "1.05rem" }}>No experts match your search criteria. You can proceed with instant auto-assignment.</p>
                <button
                  type="button"
                  onClick={() => handleOpenBookingModal(primaryExpert)}
                  style={{ marginTop: 14, padding: "10px 20px", background: "#2563eb", color: "#fff", border: 0, borderRadius: 10, fontWeight: 800, cursor: "pointer" }}
                >
                  Book with Auto-Assigned Verified Expert
                </button>
              </div>
            ) : (
              <div className="msp-experts-grid">
                {processedExperts.map((exp) => {
                  const effectivePrice = Number(exp.offer_price || exp.custom_price || service.base_price || 0);
                  const hasOffer = exp.offer_price && Number(exp.offer_price) < Number(exp.custom_price || service.base_price);
                  const expSla = exp.delivery_time_days || service.delivery_time_days || 1;
                  return (
                    <div key={exp.id || exp.expert_id} className="msp-expert-card">
                      <div>
                        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                          <img
                            src={exp.profile_photo || exp.profile_image || "https://via.placeholder.com/60"}
                            alt={exp.expert_name || exp.name}
                            style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover", border: "2px solid #e2e8f0" }}
                          />
                          <div>
                            <h4 style={{ margin: 0, color: "#0f172a", fontSize: "1.1rem", fontWeight: 800 }}>{exp.expert_name || exp.name}</h4>
                            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{exp.position || "Verified Expert"} • {exp.location || exp.city || "India"}</div>
                            <div style={{ fontSize: 12, color: "#ca8a04", fontWeight: 800, marginTop: 4 }}>
                              ★ {exp.avg_rating || "4.9"} <span style={{ color: "#64748b", fontWeight: 500 }}>({exp.total_reviews || 12} reviews)</span>
                            </div>
                          </div>
                        </div>

                        {exp.custom_bio && (
                          <p style={{ margin: "12px 0 0", color: "#475569", fontSize: "0.85rem", lineHeight: 1.5, background: "#f8fafc", padding: "10px 12px", borderRadius: 10, border: "1px solid #f1f5f9" }}>
                            "{exp.custom_bio}"
                          </p>
                        )}
                      </div>

                      <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                        <div>
                          <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700 }}>Expert Price</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: "1.3rem", fontWeight: 900, color: "#059669" }}>
                              ₹{effectivePrice.toLocaleString("en-IN")}
                            </span>
                            {hasOffer && (
                              <span style={{ fontSize: 12, color: "#94a3b8", textDecoration: "line-through" }}>
                                ₹{Number(exp.custom_price || service.base_price).toLocaleString("en-IN")}
                              </span>
                            )}
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700 }}>Guaranteed SLA</div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: "#1e293b" }}>⚡ {expSla} Day(s)</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleOpenBookingModal(exp)}
                          style={{ padding: "10px 18px", background: "#2563eb", color: "#fff", border: 0, borderRadius: 10, fontWeight: 800, fontSize: 13, cursor: "pointer" }}
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
        )}

        {/* 📄 REQUIRED DOCUMENTS & FULFILLMENT STEPS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.5rem" }}>
          
          {/* REQUIRED DOCUMENTS CHECKLIST */}
          <div className="msp-section-card">
            <h3 className="msp-section-title">
              <FiFileText style={{ color: "#2563eb" }} /> Required Documents Checklist
            </h3>
            {Array.isArray(service.document_specs) && service.document_specs.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "#334155", display: "grid", gap: 10, fontSize: 14 }}>
                {service.document_specs.map((doc) => (
                  <li key={doc.id || doc.doc_type_key} style={{ lineHeight: 1.5 }}>
                    <strong>{doc.label}</strong>{" "}
                    {doc.is_mandatory ? (
                      <span style={{ color: "#dc2626", fontWeight: 700, fontSize: 12, background: "#fef2f2", padding: "2px 8px", borderRadius: 6 }}>* Mandatory</span>
                    ) : (
                      <span style={{ color: "#64748b", fontSize: 12, background: "#f1f5f9", padding: "2px 8px", borderRadius: 6 }}>(Optional)</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ margin: 0, color: "#64748b", fontSize: 14, lineHeight: 1.6 }}>Standard identity and service execution documents required during fulfillment.</p>
            )}
          </div>

          {/* SERVICE FULFILLMENT STEPS */}
          <div className="msp-section-card">
            <h3 className="msp-section-title">
              <FiCheckCircle style={{ color: "#059669" }} /> Service Fulfillment Steps
            </h3>
            {Array.isArray(service.workflow_steps) && service.workflow_steps.length > 0 ? (
              <div style={{ display: "grid", gap: 12 }}>
                {service.workflow_steps.map((step, idx) => (
                  <div key={step.id || idx} style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 14, color: "#334155" }}>
                    <span style={{ background: "#2563eb", color: "#fff", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, shrink: 0 }}>
                      {step.step_order || idx + 1}
                    </span>
                    <strong style={{ color: "#0f172a" }}>{step.step_label}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {[
                  "Step 1: Booking Confirmation & Document Upload",
                  "Step 2: Expert Review & Preparation",
                  "Step 3: Execution & Workspace Communication",
                  "Step 4: Final Delivery & Quality Approval"
                ].map((stepText, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 14, color: "#334155" }}>
                    <span style={{ background: "#2563eb", color: "#fff", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13 }}>
                      {idx + 1}
                    </span>
                    <strong style={{ color: "#0f172a" }}>{stepText}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* 💬 FREQUENTLY ASKED QUESTIONS (FAQS) */}
        <section className="msp-section-card">
          <h3 className="msp-section-title">
            ❓ Frequently Asked Questions
          </h3>
          <div style={{ display: "grid", gap: 10 }}>
            {defaultFaqs.map((faq, idx) => (
              <div
                key={idx}
                style={{
                  background: openFaqIndex === idx ? "#eff6ff" : "#f8fafc",
                  border: `1px solid ${openFaqIndex === idx ? "#bfdbfe" : "#e2e8f0"}`,
                  borderRadius: 14,
                  overflow: "hidden",
                  transition: "all 0.2s ease"
                }}
              >
                <div
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", fontWeight: 800, color: "#0f172a", fontSize: 15 }}
                >
                  <span>{faq.q}</span>
                  {openFaqIndex === idx ? <FiChevronUp style={{ color: "#2563eb" }} /> : <FiChevronDown style={{ color: "#64748b" }} />}
                </div>
                {openFaqIndex === idx && (
                  <div style={{ padding: "0 18px 14px 18px", color: "#475569", fontSize: 14, lineHeight: 1.6 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 🔗 RELATED / SIMILAR MASTER SERVICES */}
        {relatedServices.length > 0 && (
          <section className="msp-section-card">
            <h3 className="msp-section-title">
              🔗 Similar Master Services You Might Need
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
              {relatedServices.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => navigate(`/user/service/${rel.slug || rel.id}`)}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 16,
                    overflow: "hidden",
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                    transition: "all 0.2s ease"
                  }}
                >
                  <img
                    src={getServiceImageUrl(rel.image_url || rel.thumbnail_url)}
                    alt={rel.title}
                    style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }}
                    onError={(e) => { e.target.src = DEFAULT_SERVICE_IMAGE; }}
                  />
                  <div style={{ padding: "1rem", display: "grid", gap: 6 }}>
                    <h4 style={{ margin: 0, color: "#0f172a", fontSize: 14, fontWeight: 800, lineHeight: 1.3 }}>
                      {rel.title}
                    </h4>
                    <div style={{ fontSize: 14, fontWeight: 900, color: "#059669" }}>
                      ₹{Number(rel.base_price || 999).toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* 💳 BOOKING & WALLET PAYMENT MODAL */}
      {selectedExpertForBooking && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(15, 23, 42, 0.75)", backdropFilter: "blur(6px)", display: "grid", placeItems: "center", padding: "1rem", overflowY: "auto" }}>
          <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 24, padding: "2rem", width: "100%", maxWidth: 620, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", display: "grid", gap: "1.25rem", maxHeight: "90vh", overflowY: "auto" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9", paddingBottom: "1rem" }}>
              <div>
                <h3 style={{ margin: 0, color: "#0f172a", fontSize: "1.3rem", fontWeight: 900 }}>Confirm Service Booking</h3>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{service.title}</div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedExpertForBooking(null)}
                style={{ background: "#f1f5f9", color: "#64748b", border: 0, borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontWeight: 800 }}
              >
                ✕
              </button>
            </div>

            {completedBooking ? (
              <div style={{ textAlign: "center", padding: "1.5rem 0", display: "grid", gap: 14 }}>
                <div style={{ fontSize: "3.5rem" }}>🎉</div>
                <h3 style={{ margin: 0, color: "#059669", fontSize: "1.4rem" }}>Service Booked Successfully!</h3>
                <p style={{ margin: 0, color: "#475569", fontSize: 14 }}>
                  Order <strong>#{completedBooking.booking_id}</strong> is active. Your assigned expert is <strong>{completedBooking.expert_name}</strong>.
                </p>
                <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 10 }}>
                  <button
                    type="button"
                    onClick={() => navigate(`/user/workspace/${completedBooking.workspace_id || completedBooking.booking_id}`)}
                    style={{ padding: "12px 24px", background: "#2563eb", color: "#fff", border: 0, borderRadius: 12, fontWeight: 800, cursor: "pointer" }}
                  >
                    Open Order Workspace
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedExpertForBooking(null)}
                    style={{ padding: "12px 20px", background: "#f1f5f9", color: "#334155", border: 0, borderRadius: 12, fontWeight: 700, cursor: "pointer" }}
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* ASSIGNED EXPERT SUMMARY */}
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 14, padding: "1rem", display: "flex", gap: 12, alignItems: "center" }}>
                  <img
                    src={selectedExpertForBooking.profile_photo || selectedExpertForBooking.profile_image || "https://via.placeholder.com/50"}
                    alt={selectedExpertForBooking.expert_name || selectedExpertForBooking.name}
                    style={{ width: 50, height: 50, borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>Selected Verified Expert</div>
                    <strong style={{ color: "#0f172a", fontSize: 15 }}>{selectedExpertForBooking.expert_name || selectedExpertForBooking.name}</strong>
                  </div>
                </div>

                {/* DYNAMIC FORM FIELDS */}
                {Array.isArray(service.form_fields) && service.form_fields.length > 0 && (
                  <div style={{ display: "grid", gap: 10 }}>
                    <h4 style={{ margin: 0, color: "#0f172a", fontSize: 14 }}>Service Requirements Form</h4>
                    {service.form_fields.map((field) => {
                      const key = field.field_key || field.key || field.id;
                      return (
                        <div key={key} style={{ display: "grid", gap: 4 }}>
                          <label style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>
                            {field.field_label || field.label} {field.is_required ? <span style={{ color: "#dc2626" }}>*</span> : ""}
                          </label>
                          <input
                            type="text"
                            placeholder={field.placeholder || "Enter details..."}
                            value={bookingFormResponses[key] || ""}
                            onChange={(e) => setBookingFormResponses({ ...bookingFormResponses, [key]: e.target.value })}
                            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* MANDATORY DOCUMENT UPLOADS */}
                {Array.isArray(service.document_specs) && service.document_specs.length > 0 && (
                  <div style={{ display: "grid", gap: 10 }}>
                    <h4 style={{ margin: 0, color: "#0f172a", fontSize: 14 }}>Upload Required Documents</h4>
                    {service.document_specs.map((docSpec) => {
                      const uploaded = bookingDocumentsMap[docSpec.doc_type_key];
                      return (
                        <div key={docSpec.id || docSpec.doc_type_key} style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: 10, padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                              {docSpec.label} {docSpec.is_mandatory ? <span style={{ color: "#dc2626" }}>*</span> : ""}
                            </div>
                            <div style={{ fontSize: 11, color: uploaded ? "#059669" : "#64748b" }}>
                              {uploaded ? `✓ ${uploaded.file_name}` : "Not uploaded yet"}
                            </div>
                          </div>
                          <input
                            type="file"
                            onChange={(e) => handleSpecFileSelect(docSpec, e.target.files[0])}
                            style={{ fontSize: 12 }}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* PAYMENT BREAKDOWN */}
                {(() => {
                  const basePrice = Number(selectedExpertForBooking.custom_price || service.base_price || 0);
                  const offerPrice = selectedExpertForBooking.offer_price ? Number(selectedExpertForBooking.offer_price) : null;
                  const effectiveBase = offerPrice && offerPrice > 0 ? offerPrice : basePrice;
                  const gstAmount = Math.round(effectiveBase * 0.18);
                  const totalPayable = effectiveBase + gstAmount;

                  return (
                    <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 14, padding: "1rem", display: "grid", gap: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#475569" }}>
                        <span>Service Base Price</span>
                        <span>₹{effectiveBase.toLocaleString("en-IN")}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#475569" }}>
                        <span>GST (18%)</span>
                        <span>₹{gstAmount.toLocaleString("en-IN")}</span>
                      </div>
                      <div style={{ borderTop: "1px solid #cbd5e1", paddingTop: 8, display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 900, color: "#0f172a" }}>
                        <span>Total Payable</span>
                        <span style={{ color: "#059669" }}>₹{totalPayable.toLocaleString("en-IN")}</span>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, marginTop: 4 }}>
                        <span style={{ color: "#64748b" }}>Wallet Balance: <strong>₹{walletBalance.toLocaleString("en-IN")}</strong></span>
                        {walletBalance < totalPayable && (
                          <button
                            type="button"
                            onClick={() => handleTriggerRecharge(totalPayable - walletBalance)}
                            style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", padding: "4px 10px", borderRadius: 6, fontWeight: 700, cursor: "pointer" }}
                          >
                            + Add ₹{totalPayable - walletBalance} Balance
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {bookingError && (
                  <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", borderRadius: 10, padding: "10px 14px", fontSize: 13, fontWeight: 600 }}>
                    {bookingError}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleConfirmWalletBooking}
                  disabled={bookingInProgress}
                  style={{
                    padding: "14px",
                    background: bookingInProgress ? "#94a3b8" : "linear-gradient(135deg, #059669 0%, #047857 100%)",
                    color: "#fff",
                    border: 0,
                    borderRadius: 14,
                    fontWeight: 900,
                    fontSize: 16,
                    cursor: bookingInProgress ? "not-allowed" : "pointer"
                  }}
                >
                  {bookingInProgress ? "Initiating Booking & Workspace..." : "Confirm & Pay via Wallet"}
                </button>
              </>
            )}

          </div>
        </div>
      )}

      {/* 🌟 PLEASE SELECT AN EXPERT FOR BOOKING POPUP MODAL */}
      {showSelectExpertModal && !isAlreadyBooked && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.7)",
            backdropFilter: "blur(6px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => setShowSelectExpertModal(false)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: 24,
              maxWidth: 600,
              width: "100%",
              maxHeight: "85vh",
              overflowY: "auto",
              padding: "1.75rem",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              display: "grid",
              gap: 16,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9", paddingBottom: "1rem" }}>
              <div>
                <h3 style={{ margin: 0, color: "#0f172a", fontSize: "1.3rem", fontWeight: 900 }}>
                  Please Select an Expert for Booking
                </h3>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>
                  Choose your preferred verified expert for {service?.title}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSelectExpertModal(false)}
                style={{ background: "#f1f5f9", color: "#64748b", border: 0, borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontWeight: 800 }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "grid", gap: 12, maxHeight: "55vh", overflowY: "auto", paddingRight: 4 }}>
              {processedExperts.map((exp) => {
                const effectivePrice = Number(exp.offer_price || exp.custom_price || service?.base_price || 0);
                const hasOffer = exp.offer_price && Number(exp.offer_price) < Number(exp.custom_price || service?.base_price);
                const expSla = exp.delivery_time_days || service?.delivery_time_days || 1;

                return (
                  <div
                    key={exp.id || exp.expert_id}
                    style={{
                      background: "#f8fafc",
                      border: "1.5px solid #e2e8f0",
                      borderRadius: 16,
                      padding: "1rem 1.25rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <img
                        src={exp.profile_photo || exp.profile_image || "https://via.placeholder.com/50"}
                        alt={exp.expert_name || exp.name}
                        style={{ width: 50, height: 50, borderRadius: "50%", objectFit: "cover", border: "2px solid #2563eb" }}
                      />
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <strong style={{ color: "#0f172a", fontSize: 15 }}>{exp.expert_name || exp.name}</strong>
                          <span style={{ fontSize: 11, color: "#ca8a04", fontWeight: 800 }}>★ {exp.avg_rating || "4.9"}</span>
                        </div>
                        <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                          {exp.position || "Verified Expert"} • SLA: {expSla} Day(s)
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 15, fontWeight: 900, color: "#059669" }}>
                          ₹{effectivePrice.toLocaleString("en-IN")}
                        </div>
                        {hasOffer && (
                          <div style={{ fontSize: 11, color: "#94a3b8", textDecoration: "line-through" }}>
                            ₹{Number(exp.custom_price || service?.base_price).toLocaleString("en-IN")}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setShowSelectExpertModal(false);
                          handleOpenBookingModal(exp);
                        }}
                        style={{
                          padding: "8px 16px",
                          background: "#2563eb",
                          color: "#ffffff",
                          border: 0,
                          borderRadius: 10,
                          fontWeight: 800,
                          fontSize: 13,
                          cursor: "pointer",
                          boxShadow: "0 2px 6px rgba(37, 99, 235, 0.2)",
                        }}
                      >
                        Select & Book
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {showActiveBookingDialog && activeUserBooking && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 10000,
          background: "rgba(15, 23, 42, 0.75)",
          backdropFilter: "blur(8px)",
          display: "grid",
          placeItems: "center",
          padding: "1rem"
        }}>
          <div style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: 28,
            padding: "2rem 1.75rem 1.75rem",
            width: "100%",
            maxWidth: 440,
            textAlign: "center",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            animation: "flutterPop 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
          }}>
            <style>{`
              @keyframes flutterPop {
                0% { transform: scale(0.85); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
              }
            `}</style>

            {/* ICON BADGE */}
            <div style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "#eff6ff",
              color: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              margin: "0 auto 1.25rem",
              boxShadow: "0 8px 16px rgba(37, 99, 235, 0.15)"
            }}>
              📋
            </div>

            {/* TITLE */}
            <h3 style={{
              margin: "0 0 8px",
              color: "#0f172a",
              fontSize: "1.35rem",
              fontWeight: 900,
              letterSpacing: "-0.01em"
            }}>
              Active Order in Progress
            </h3>

            {/* SUBTITLE & ORDER BADGE */}
            <p style={{
              margin: "0 0 1.25rem",
              color: "#475569",
              fontSize: "0.95rem",
              lineHeight: 1.55
            }}>
              You already have an active booking for <strong>"{service?.title}"</strong>. Please wait for completion or cancellation of your current order before placing a new one.
            </p>

            <div style={{
              background: "#ecfdf5",
              border: "1px solid #a7f3d0",
              borderRadius: 16,
              padding: "10px 14px",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 13
            }}>
              <span style={{ color: "#065f46", fontWeight: 700 }}>Order ID: #{activeUserBooking.id}</span>
              <span style={{
                background: "#059669",
                color: "#ffffff",
                padding: "3px 10px",
                borderRadius: 12,
                fontSize: 11,
                fontWeight: 800,
                textTransform: "uppercase"
              }}>
                {activeUserBooking.status || "IN PROGRESS"}
              </span>
            </div>

            {/* BUTTON ACTIONS */}
            <div style={{ display: "grid", gap: 10 }}>
              <button
                type="button"
                onClick={() => {
                  setShowActiveBookingDialog(false);
                  navigate(`/user/workspace/${activeUserBooking.booking_id || activeUserBooking.id}`);
                }}
                style={{
                  padding: "14px",
                  background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                  color: "#ffffff",
                  border: 0,
                  borderRadius: 16,
                  fontWeight: 800,
                  fontSize: 15,
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)"
                }}
              >
                🚀 Open Order Workspace
              </button>

              <button
                type="button"
                onClick={() => setShowActiveBookingDialog(false)}
                style={{
                  padding: "12px",
                  background: "#f1f5f9",
                  color: "#475569",
                  border: 0,
                  borderRadius: 16,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer"
                }}
              >
                Got It, Thanks
              </button>
            </div>

          </div>
        </div>
      )}

      {/* RECHARGE WALLET POPUP */}
      {showRechargePopup && (
        <AddBalancePopup
          amountPreset={rechargeAmountNeeded}
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
