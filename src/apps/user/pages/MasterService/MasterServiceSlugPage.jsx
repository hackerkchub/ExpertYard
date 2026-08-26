import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import APP_CONFIG from "../../../../config/appConfig";
import AddBalancePopup from "../../components/AddBalancePopup/AddBalancePopup";
import { uploadWorkspaceFile } from "../../../../shared/api/workspace.api";
import PremiumCenterLoader from "../../../../shared/components/Loader/PremiumCenterLoader";
import { useLoader } from "../../../../shared/loaders/LoaderContext";

// Sub-components
import ServiceHero from "./components/ServiceHero";
import ExpertSection from "./components/ExpertSection";
import RequiredDocuments from "./components/RequiredDocuments";
import ServiceProcess from "./components/ServiceProcess";
import FaqSection from "./components/FaqSection";
import RelatedServices from "./components/RelatedServices";
import MobileStickyBookingBar from "./components/MobileStickyBookingBar";
import ActiveBookingNotice from "./components/ActiveBookingNotice";
import SelectExpertModal from "./components/SelectExpertModal";
import BookingModal from "./components/BookingModal";

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

  const isTerminalStatus = (st) =>
    ["COMPLETED", "CANCELLED", "CLOSED"].includes(String(st || "").toUpperCase());

  const isAlreadyBooked = useMemo(() => {
    return Boolean(
      activeUserBooking && !isTerminalStatus(activeUserBooking.status)
    );
  }, [activeUserBooking]);

  // Lock body scroll when any modal or sheet is open
  useEffect(() => {
    const isAnyModalOpen = Boolean(
      selectedExpertForBooking || showSelectExpertModal || showActiveBookingDialog || showRechargePopup
    );

    if (isAnyModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedExpertForBooking, showSelectExpertModal, showActiveBookingDialog, showRechargePopup]);

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
                !isTerminalStatus(b.status)
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

  const { startLoading, stopLoading } = useLoader();

  useEffect(() => {
    if (!targetSlug) return;
    const fetchServiceAndExperts = async () => {
      try {
        startLoading();
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
        setError("Failed to connect to server.");
      } finally {
        setLoading(false);
        stopLoading();
      }
    };

    fetchServiceAndExperts();
  }, [targetSlug, startLoading, stopLoading]);

  // Auto-open booking modal when navigated with ?action=book
  const autoBookHandledRef = useRef(false);
  useEffect(() => {
    if (loading || !service || autoBookHandledRef.current) return;
    const params = new URLSearchParams(location.search);
    const action = params.get("action") || params.get("autoAction");
    if (action === "book" || params.get("book") === "true") {
      autoBookHandledRef.current = true;
      setTimeout(() => {
        if (experts && experts.length > 1) {
          setShowSelectExpertModal(true);
        } else {
          handleOpenBookingModal(experts?.[0] || null);
        }
      }, 300);
    }
  }, [loading, service, experts, location.search]);

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
          `Please upload all mandatory documents: ${missingMandatory.map((m) => m.label).join(", ")}`
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
          `Please fill in all required form fields: ${missingFields.map((m) => m.field_label || m.label).join(", ")}`
        );
        return;
      }
    }

    const basePrice = Number(selectedExpertForBooking.custom_price || service.base_price || 0);
    const offerPrice = selectedExpertForBooking.offer_price ? Number(selectedExpertForBooking.offer_price) : null;
    const effectiveBase = offerPrice && offerPrice > 0 ? offerPrice : basePrice;
    const totalPayable = effectiveBase;

    if (walletBalance < totalPayable) {
      const deficit = totalPayable - walletBalance;
      setBookingError(`Insufficient wallet balance. Total payable is ₹${totalPayable}, but your wallet balance is ₹${walletBalance}.`);
      handleTriggerRecharge(deficit);
      return;
    }

    try {
      setBookingInProgress(true);
      setBookingError("");

      const processedDocs = await Promise.all(
        combinedDocs.map(async (doc) => {
          if (doc.raw_file) {
            try {
              const formData = new FormData();
              formData.append("file", doc.raw_file);
              const uploadRes = await uploadWorkspaceFile(formData);
              const uploadData = uploadRes.data;
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
      a: "Review the 'Required Documents Checklist' section on this page. You can upload mandatory identity and service files during booking or inside your workspace anytime."
    }
  ];

  if (loading) {
    return null;
  }

  if (error || !service) {
    return (
      <div className="msp-error-screen">
        <div className="msp-error-box">
          <div className="msp-error-icon">📦</div>
          <h3 className="msp-error-title">Service Unavailable</h3>
          <p className="msp-error-text">{error || "The requested master service does not exist or has been archived."}</p>
          <Link to="/all-services" className="msp-btn-primary msp-error-btn">
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

  const handleHeroPrimaryBookClick = () => {
    if (experts && experts.length > 0) {
      setShowSelectExpertModal(true);
    } else {
      handleOpenBookingModal(primaryExpert);
    }
  };

  const handleHeroViewExpertsClick = () => {
    const el = document.getElementById("experts-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="msp-root">
      <style>{`
        /* =========================================================
           🎨 MASTER SERVICE PAGE — PRODUCTION DESIGN SYSTEM
        ========================================================= */
        .msp-root {
          background: #f8fafc;
          min-height: 100vh;
          padding: 1.5rem 1rem 7rem;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #0f172a;
          box-sizing: border-box;
          overflow-x: hidden;
        }

        .msp-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
          box-sizing: border-box;
        }

        /* LOADING & ERROR SCREENS */
        .msp-loading-screen, .msp-error-screen {
          background: #f8fafc;
          min-height: 80vh;
          display: grid;
          place-Items: center;
          padding: 2rem 1rem;
        }
        .msp-loading-box, .msp-error-box {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 3rem 2rem;
          text-align: center;
          max-width: 460px;
          width: 100%;
          box-shadow: 0 10px 30px rgba(0,0,0,0.04);
        }
        .msp-loading-spinner { fontSize: 2.5rem; margin-bottom: 12px; }
        .msp-loading-title, .msp-error-title { margin: 0 0 8px; color: #0f172a; font-size: 1.3rem; font-weight: 800; }
        .msp-loading-sub, .msp-error-text { margin: 0; color: #64748b; font-size: 14px; line-height: 1.5; }
        .msp-error-btn { display: inline-block; margin-top: 1.25rem; text-decoration: none; }


        /* HERO CARD */
        .msp-hero-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 2.25rem;
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.04);
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 2.5rem;
          align-items: center;
        }

        .msp-hero-content {
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
        }

        .msp-hero-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
        }

        .msp-badge {
          padding: 4px 10px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          line-height: 1.3;
        }
        .msp-badge-blue { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
        .msp-badge-emerald { background: #f8fafc; color: #475569; border: 1px solid #e2e8f0; }
        .msp-badge-amber { background: #f8fafc; color: #475569; border: 1px solid #e2e8f0; }
        .msp-badge-green { background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }

        .msp-hero-title {
          margin: 0;
          color: #0f172a;
          font-size: clamp(1.4rem, 2.5vw, 2.25rem);
          font-weight: 900;
          line-height: 1.25;
          letter-spacing: -0.02em;
        }

        .msp-hero-desc-wrapper {
          color: #475569;
          font-size: 0.95rem;
          line-height: 1.6;
        }
        .msp-desc-clamped {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .msp-read-more-btn {
          background: transparent;
          border: 0;
          color: #2563eb;
          font-weight: 800;
          font-size: 13px;
          padding: 4px 0 0;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        /* TRUST INDICATORS INSIDE HERO */
        .msp-trust-indicators {
          display: flex;
          flex-wrap: wrap;
          gap: 12px 20px;
          padding: 10px 14px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          width: fit-content;
        }
        .msp-trust-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          color: #334155;
        }
        .msp-trust-icon { font-size: 15px; color: #64748b; }
        .msp-icon-amber { color: #64748b; }
        .msp-icon-blue { color: #64748b; }
        .msp-icon-emerald { color: #64748b; }

        /* PRICE CARD IN HERO */
        .msp-hero-price-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 1rem 1.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }
        .msp-price-label {
          font-size: 11px;
          color: #64748b;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .msp-price-amount {
          font-size: 1.85rem;
          font-weight: 900;
          color: #0f172a;
          line-height: 1.1;
        }
        .msp-price-gst {
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
          margin-top: 2px;
        }
        .msp-value-tag {
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #e2e8f0;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
        }

        /* HERO ACTION BUTTONS */
        .msp-hero-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .msp-btn-primary {
          background: #2563eb;
          color: #ffffff;
          border: 0;
          border-radius: 12px;
          padding: 12px 24px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          min-height: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 2px 6px rgba(37, 99, 235, 0.15);
          transition: all 0.2s ease;
        }
        .msp-btn-primary:hover {
          background: #1d4ed8;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
        }
        .msp-btn-already-booked {
          background: #2563eb;
          box-shadow: none;
          cursor: default;
        }
        .msp-btn-secondary {
          background: #ffffff;
          color: #0f172a;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          min-height: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s ease;
        }
        .msp-btn-secondary:hover { background: #f8fafc; border-color: #cbd5e1; }

        /* RIGHT DECORATIVE VISUAL CARD */
        .msp-hero-visual-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .msp-visual-container {
          position: relative;
          width: 100%;
          height: 240px;
          border-radius: 14px;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
        }
        .msp-hero-visual-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          display: block;
        }
        .msp-visual-badge {
          position: absolute;
          bottom: 10px;
          left: 10px;
          right: 10px;
          background: rgba(15, 23, 42, 0.88);
          backdrop-filter: blur(6px);
          color: #ffffff;
          padding: 6px 12px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .msp-visual-shield { color: #38bdf8; }
        .msp-visual-features {
          display: flex;
          justify-content: space-around;
          font-size: 11px;
          font-weight: 700;
          color: #475569;
          background: #ffffff;
          padding: 8px 10px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
        }
        .msp-vfeat { display: flex; align-items: center; gap: 4px; }
        .msp-vfeat-icon { color: #64748b; }

        /* SECTION CARD BASE */
        .msp-section-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 0 4px 14px rgba(0,0,0,0.02);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .msp-section-header-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }
        .msp-section-title {
          margin: 0;
          color: #0f172a;
          font-size: 1.25rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .msp-section-title-icon { color: #2563eb; }

        /* EXPERTS SEARCH & SORT BAR */
        .msp-filter-controls {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
        }
        .msp-search-input-wrapper {
          position: relative;
        }
        .msp-search-icon {
          position: absolute;
          left: 11px;
          top: 10px;
          color: #94a3b8;
          font-size: 14px;
        }
        .msp-search-input {
          padding: 8px 12px 8px 34px;
          border-radius: 10px;
          border: 1px solid #cbd5e1;
          font-size: 13px;
          min-width: 200px;
          outline: none;
          background: #ffffff;
        }
        .msp-search-input:focus { border-color: #2563eb; }
        .msp-sort-select {
          padding: 8px 12px;
          border-radius: 10px;
          border: 1px solid #cbd5e1;
          font-size: 13px;
          background: #ffffff;
          color: #334155;
          font-weight: 700;
          outline: none;
        }

        /* EXPERTS GRID & CARDS */
        .msp-experts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.25rem;
        }
        .msp-expert-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 1.15rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 12px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.02);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .msp-expert-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 18px rgba(0,0,0,0.05);
          border-color: #cbd5e1;
        }
        .msp-exp-card-header {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .msp-exp-avatar-wrapper {
          position: relative;
          width: 52px;
          height: 52px;
          flex-shrink: 0;
        }
        .msp-exp-avatar {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #e2e8f0;
        }
        .msp-exp-verified-badge {
          position: absolute;
          bottom: 0;
          right: 0;
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #a7f3d0;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 900;
        }
        .msp-exp-meta {
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow: hidden;
        }
        .msp-exp-name {
          margin: 0;
          color: #0f172a;
          font-size: 1rem;
          font-weight: 800;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .msp-exp-role {
          font-size: 12px;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .msp-exp-rating {
          font-size: 12px;
          color: #d97706;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .msp-star-icon { fill: #f59e0b; color: #f59e0b; }
        .msp-rating-count { color: #64748b; font-weight: 500; }
        .msp-exp-bio {
          margin: 0;
          color: #475569;
          font-size: 12px;
          line-height: 1.45;
          background: #f8fafc;
          padding: 8px 10px;
          border-radius: 8px;
          border: 1px solid #f1f5f9;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .msp-exp-card-footer {
          border-top: 1px solid #f1f5f9;
          padding-top: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
        }
        .msp-exp-price-label, .msp-exp-sla-label {
          font-size: 10px;
          color: #64748b;
          font-weight: 700;
          text-transform: uppercase;
        }
        .msp-exp-price-val {
          font-size: 1.15rem;
          font-weight: 900;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .msp-exp-old-price {
          font-size: 11px;
          color: #94a3b8;
          text-decoration: line-through;
          font-weight: 500;
        }
        .msp-exp-sla-val {
          font-size: 12px;
          font-weight: 800;
          color: #1e293b;
          display: flex;
          align-items: center;
          gap: 3px;
        }
        .msp-exp-book-btn {
          padding: 8px 14px;
          background: #2563eb;
          color: #ffffff;
          border: 0;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .msp-exp-book-btn:hover { background: #1d4ed8; }

        .msp-empty-experts {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 2rem;
          text-align: center;
          color: #64748b;
        }

        /* REQUIRED DOCUMENTS CHECKLIST */
        .msp-docs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 12px;
        }
        .msp-doc-item {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .msp-doc-icon-status { font-size: 18px; flex-shrink: 0; display: flex; }
        .msp-check-mandatory { color: #2563eb; }
        .msp-check-optional { color: #94a3b8; }
        .msp-doc-info { display: flex; flex-direction: column; gap: 2px; }
        .msp-doc-name { font-size: 13px; font-weight: 700; color: #0f172a; }
        .msp-doc-badge {
          font-size: 10px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
          display: inline-block;
          width: fit-content;
        }
        .msp-badge-req { background: #f1f5f9; color: #334155; border: 1px solid #e2e8f0; }
        .msp-badge-opt { background: #f8fafc; color: #64748b; }

        /* HOW IT WORKS / SERVICE PROCESS */
        .msp-process-timeline-desktop {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          position: relative;
          padding: 10px 0;
        }
        .msp-process-step-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 8px;
          position: relative;
          z-index: 1;
          padding: 12px 10px;
          border-radius: 16px;
          border: 1px solid transparent;
          transition: background-color 0.25s ease, border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
          cursor: pointer;
        }
        .msp-process-step-item:hover {
          background-color: #eff6ff;
          border-color: #bfdbfe;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.06);
        }
        .msp-step-num-badge {
          background: #f1f5f9;
          color: #64748b;
          border: 1px solid #cbd5e1;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 13px;
          transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;
        }
        .msp-process-step-item:hover .msp-step-num-badge,
        .msp-step-active .msp-step-num-badge {
          background: #2563eb;
          color: #ffffff;
          border-color: #2563eb;
        }
        .msp-step-done .msp-step-num-badge {
          background: #ecfdf5;
          color: #047857;
          border-color: #a7f3d0;
        }
        .msp-step-icon-wrapper {
          background: #f8fafc;
          color: #64748b;
          border: 1px solid #e2e8f0;
          width: 46px;
          height: 46px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .msp-process-step-item:hover .msp-step-icon-wrapper,
        .msp-step-active .msp-step-icon-wrapper {
          background: #ffffff;
          color: #2563eb;
          border-color: #93c5fd;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.12);
        }
        .msp-step-done .msp-step-icon-wrapper {
          background: #ecfdf5;
          color: #047857;
          border-color: #a7f3d0;
        }
        .msp-step-title { margin: 0; font-size: 14px; font-weight: 800; color: #0f172a; }
        .msp-step-desc { margin: 0; font-size: 12px; color: #64748b; line-height: 1.45; max-width: 180px; }
        .msp-step-connector {
          flex: 0 0 60px;
          height: 2px;
          background: #e2e8f0;
          margin-top: 26px;
        }
        .msp-process-timeline-mobile { display: none; }

        /* FAQ SECTION */
        .msp-faq-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .msp-faq-item {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.2s ease;
        }
        .msp-faq-item-open {
          background: #ffffff;
          border-color: #cbd5e1;
        }
        .msp-faq-trigger {
          width: 100%;
          padding: 16px 18px;
          min-height: 52px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: transparent;
          border: 0;
          cursor: pointer;
          text-align: left;
          font-size: 14px;
          font-weight: 800;
          color: #0f172a;
          gap: 12px;
        }
        .msp-faq-chevron { color: #2563eb; font-size: 16px; flex-shrink: 0; }
        .msp-faq-answer {
          padding: 0 18px 16px 18px;
          color: #475569;
          font-size: 13px;
          line-height: 1.6;
        }
        .msp-faq-answer p { margin: 0; }

        /* RELATED SERVICES */
        .msp-related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
          gap: 1rem;
        }
        .msp-related-item-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.02);
          transition: transform 0.2s ease;
        }
        .msp-related-item-card:hover { transform: translateY(-2px); border-color: #cbd5e1; }
        .msp-related-img-box { width: 100%; height: 130px; background: #f1f5f9; }
        .msp-related-img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .msp-related-info { padding: 12px; display: flex; flex-direction: column; gap: 6px; }
        .msp-related-title { margin: 0; font-size: 13px; font-weight: 800; color: #0f172a; line-height: 1.3; }
        .msp-related-bottom { display: flex; justify-content: space-between; align-items: center; font-size: 13px; }
        .msp-related-price { font-weight: 900; color: #0f172a; }
        .msp-related-arrow { font-size: 11px; font-weight: 700; color: #2563eb; display: flex; align-items: center; gap: 2px; }

        /* ACTIVE BOOKING NOTICE CARD */
        .msp-active-notice-card {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 18px;
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-shadow: 0 4px 12px rgba(37,99,235,0.04);
        }
        .msp-active-notice-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 10px;
        }
        .msp-active-notice-title { margin: 0; color: #1e40af; font-size: 1.1rem; font-weight: 800; }
        .msp-active-notice-meta { font-size: 13px; color: #3b82f6; margin-top: 4px; }
        .msp-active-status-badge { text-transform: uppercase; background: #dbeafe; color: #1e40af; padding: 2px 6px; border-radius: 4px; }
        .msp-active-tag { background: #2563eb; color: #ffffff; padding: 4px 12px; border-radius: 16px; font-size: 11px; font-weight: 800; }
        .msp-active-notice-actions { display: flex; gap: 10px; flex-wrap: wrap; }
        .msp-active-btn {
          padding: 8px 14px;
          border: 0;
          border-radius: 8px;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .msp-active-btn-chat { background: #ffffff; color: #0f172a; border: 1px solid #e2e8f0; }
        .msp-active-btn-call { background: #ffffff; color: #0f172a; border: 1px solid #e2e8f0; }
        .msp-active-btn-workspace { background: #2563eb; color: #ffffff; }

        /* MODALS & OVERLAYS */
        .msp-modal-overlay {
          position: fixed !important;
          inset: 0 !important;
          z-index: 100000 !important;
          background: rgba(15, 23, 42, 0.75) !important;
          backdrop-filter: blur(8px) !important;
          -webkit-backdrop-filter: blur(8px) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 1rem !important;
          box-sizing: border-box !important;
        }
        .msp-modal-box {
          position: relative !important;
          z-index: 100001 !important;
          background: #ffffff !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 24px !important;
          padding: 1.75rem !important;
          width: 100% !important;
          max-width: 600px !important;
          max-height: 88vh !important;
          overflow-y: auto !important;
          -webkit-overflow-scrolling: touch !important;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25) !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 1.25rem !important;
          box-sizing: border-box !important;
        }
        .msp-modal-drag-handle { display: none; }
        .msp-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 12px;
        }
        .msp-modal-title { margin: 0; color: #0f172a; font-size: 1.25rem; font-weight: 800; }
        .msp-modal-subtitle { font-size: 13px; color: #64748b; margin-top: 2px; }
        .msp-modal-close-btn {
          background: #f1f5f9;
          color: #64748b;
          border: 0;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
        }

        /* SELECT EXPERT MODAL LIST */
        .msp-select-expert-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 55vh;
          overflow-y: auto;
        }
        .msp-select-expert-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 12px 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .msp-select-exp-info { display: flex; gap: 10px; align-items: center; }
        .msp-select-exp-avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; }
        .msp-select-exp-name-row { display: flex; align-items: center; gap: 6px; }
        .msp-select-exp-name { color: #0f172a; font-size: 14px; }
        .msp-select-exp-rating { font-size: 11px; color: #ca8a04; font-weight: 800; display: flex; align-items: center; gap: 2px; }
        .msp-select-exp-meta { font-size: 11px; color: #64748b; margin-top: 2px; }
        .msp-select-exp-action-row { display: flex; align-items: center; gap: 12px; }
        .msp-select-exp-amount { font-size: 14px; font-weight: 900; color: #059669; }
        .msp-select-exp-old { font-size: 10px; color: #94a3b8; text-decoration: line-through; }
        .msp-select-btn { padding: 6px 12px; font-size: 12px; min-height: 36px; }

        /* BOOKING MODAL STEPS BAR & SUMMARY */
        .msp-booking-steps-bar {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 4px;
        }
        .msp-step-pill {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
          background: #f1f5f9;
          color: #64748b;
          white-space: nowrap;
        }
        .msp-step-active { background: #dbeafe; color: #1e40af; }
        .msp-step-done { background: #dcfce7; color: #15803d; }

        .msp-booking-expert-summary {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 10px 12px;
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .msp-summary-avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; }
        .msp-summary-label { font-size: 11px; color: #64748b; }
        .msp-summary-name { color: #0f172a; font-size: 14px; }
        .msp-summary-sla { font-size: 11px; color: #059669; font-weight: 700; }

        .msp-section-subheading { margin: 0 0 8px; color: #0f172a; font-size: 13px; font-weight: 800; }
        .msp-booking-form-section, .msp-booking-docs-section { display: flex; flex-direction: column; gap: 8px; }
        .msp-form-group { display: flex; flex-direction: column; gap: 4px; }
        .msp-form-label { font-size: 12px; font-weight: 700; color: #334155; }
        .msp-required-star { color: #dc2626; }
        .msp-form-input {
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          font-size: 13px;
          outline: none;
          background: #ffffff;
        }
        .msp-form-input:focus { border-color: #2563eb; }

        .msp-upload-row {
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          padding: 8px 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }
        .msp-upload-name { font-size: 12px; font-weight: 700; color: #0f172a; }
        .msp-upload-status { font-size: 11px; }
        .msp-status-uploaded { color: #059669; font-weight: 700; }
        .msp-status-pending { color: #64748b; }
        .msp-file-btn-label { cursor: pointer; }
        .msp-hidden-file-input { display: none; }
        .msp-file-btn-text {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          color: #334155;
        }

        .msp-payment-breakdown-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .msp-breakdown-row { display: flex; justify-content: space-between; font-size: 13px; color: #475569; }
        .msp-breakdown-divider { border: 0; border-top: 1px solid #e2e8f0; margin: 4px 0; }
        .msp-breakdown-total { font-size: 15px; font-weight: 900; color: #0f172a; }
        .msp-total-amount { color: #059669; }

        .msp-wallet-status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          margin-top: 4px;
        }
        .msp-wallet-balance-text { color: #64748b; }
        .msp-add-balance-btn {
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #bfdbfe;
          padding: 3px 8px;
          border-radius: 6px;
          font-weight: 800;
          cursor: pointer;
        }

        .msp-booking-error-alert {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .msp-error-icon { flex-shrink: 0; }
        .msp-confirm-booking-btn { width: 100%; border-radius: 14px; }

        /* SUCCESS VIEW IN BOOKING MODAL */
        .msp-booking-success-view {
          text-align: center;
          padding: 1rem 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .msp-success-icon { font-size: 3rem; }
        .msp-success-title { margin: 0; color: #059669; font-size: 1.3rem; font-weight: 800; }
        .msp-success-desc { margin: 0; color: #475569; font-size: 13px; }
        .msp-success-actions { display: flex; gap: 10px; }

        /* ACTIVE BOOKING DIALOG */
        .msp-active-dialog-box {
          position: relative !important;
          z-index: 100001 !important;
          background: #ffffff !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 24px !important;
          padding: 2rem 1.5rem 1.5rem !important;
          width: 100% !important;
          max-width: 420px !important;
          text-align: center !important;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25) !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 12px !important;
        }
        .msp-active-dialog-icon { font-size: 2.5rem; margin-bottom: -4px; }
        .msp-active-dialog-title { margin: 0; color: #0f172a; font-size: 1.25rem; font-weight: 800; }
        .msp-active-dialog-text { margin: 0; color: #475569; font-size: 13px; line-height: 1.5; }
        .msp-active-dialog-badge-row {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          border-radius: 12px;
          padding: 8px 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #065f46;
          font-weight: 700;
        }
        .msp-active-status-tag { background: #059669; color: #ffffff; padding: 2px 8px; border-radius: 10px; font-size: 10px; }
        .msp-active-dialog-actions { display: flex; flex-direction: column; gap: 8px; }

        /* MOBILE STICKY BOOKING BAR */
        .msp-mobile-sticky-bar {
          display: none;
        }

        /* =========================================================
           📱 RESPONSIVE MEDIA QUERIES & BREAKPOINT FIXES
        ========================================================= */

        /* DESKTOP LARGE (≥1024px) */
        @media (min-width: 1024px) {
          .msp-hero-card {
            grid-template-columns: 1fr 360px;
          }
        }

        /* TABLET & MOBILE (<900px / <768px) */
        @media (max-width: 900px) {
          .msp-hero-card {
            grid-template-columns: 1fr;
            padding: 1.5rem;
            gap: 1.5rem;
          }
          .msp-hero-visual-card {
            order: -1;
          }
          .msp-visual-container {
            height: 180px;
          }
        }

        @media (max-width: 768px) {
          .msp-root {
            padding: 1rem 0.75rem calc(110px + env(safe-area-inset-bottom, 0px));
          }
          .msp-container {
            gap: 1.25rem;
          }
          .msp-hero-card {
            padding: 1.25rem;
            border-radius: 18px;
          }
          .msp-trust-indicators {
            width: 100%;
            box-sizing: border-box;
            justify-content: space-between;
          }
          .msp-hero-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }
          .msp-btn-primary, .msp-btn-secondary {
            width: 100%;
            min-height: 44px;
            font-size: 14px;
            padding: 10px 14px;
          }

          /* EXPERTS HORIZONTAL SCROLL CAROUSEL ON MOBILE */
          .msp-experts-grid {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            padding-bottom: 8px;
            -webkit-overflow-scrolling: touch;
            margin: 0 -0.75rem;
            padding-left: 0.75rem;
            padding-right: 0.75rem;
          }
          .msp-expert-card {
            flex: 0 0 82%;
            min-width: 260px;
            max-width: 300px;
            scroll-snap-align: start;
          }

          /* PROCESS TIMELINE MOBILE */
          .msp-process-timeline-desktop { display: none; }
          .msp-process-timeline-mobile {
            display: flex;
            flex-direction: column;
            gap: 0;
            padding: 4px 0;
          }
          .msp-mobile-step-row {
            display: flex;
            gap: 14px;
            padding: 8px 10px;
            border-radius: 12px;
            border: 1px solid transparent;
            transition: background-color 0.25s ease, border-color 0.25s ease;
          }
          @media (hover: hover) {
            .msp-mobile-step-row:hover {
              background-color: #eff6ff;
              border-color: #bfdbfe;
            }
          }
          .msp-mobile-step-left {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .msp-mobile-step-badge {
            background: #2563eb;
            color: #ffffff;
            width: 26px;
            height: 26px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 900;
            flex-shrink: 0;
          }
          .msp-mobile-step-line {
            width: 2px;
            flex-grow: 1;
            background: #cbd5e1;
            margin: 4px 0;
            min-height: 24px;
          }
          .msp-mobile-step-content {
            padding-bottom: 16px;
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          .msp-mobile-step-header {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .msp-mobile-step-icon { color: #2563eb; font-size: 16px; }
          .msp-mobile-step-title { margin: 0; font-size: 14px; font-weight: 800; color: #0f172a; }
          .msp-mobile-step-desc { margin: 0; font-size: 12px; color: #64748b; line-height: 1.45; }

          /* RELATED SERVICES HORIZONTAL CAROUSEL */
          .msp-related-grid {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            padding-bottom: 8px;
            margin: 0 -0.75rem;
            padding-left: 0.75rem;
            padding-right: 0.75rem;
            -webkit-overflow-scrolling: touch;
          }
          .msp-related-item-card {
            flex: 0 0 70%;
            min-width: 200px;
            max-width: 240px;
            scroll-snap-align: start;
          }

          /* MOBILE BOTTOM SHEET FOR MODALS */
          .msp-modal-overlay {
            align-items: flex-end !important;
            padding: 0 !important;
            z-index: 100000 !important;
          }
          .msp-modal-box {
            width: 100% !important;
            max-width: 100% !important;
            border-radius: 24px 24px 0 0 !important;
            max-height: 90dvh !important;
            padding: 1.25rem 1rem calc(1.5rem + env(safe-area-inset-bottom, 0px)) !important;
            box-shadow: 0 -10px 40px rgba(0,0,0,0.3) !important;
            animation: mspSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
            z-index: 100001 !important;
          }
          .msp-modal-drag-handle {
            display: block;
            width: 40px;
            height: 4px;
            border-radius: 2px;
            background: #cbd5e1;
            margin: 0 auto 8px;
          }
          @keyframes mspSlideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }

          /* MOBILE STICKY BOOKING BAR DISPLAY */
          .msp-mobile-sticky-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: fixed;
            left: 0;
            right: 0;
            bottom: calc(60px + env(safe-area-inset-bottom, 0px));
            background: #ffffff;
            border-top: 1px solid #e2e8f0;
            padding: 8px 16px;
            z-index: 998;
            box-shadow: 0 -4px 16px rgba(0,0,0,0.06);
          }
          .msp-mobile-bar-price-col { display: flex; flex-direction: column; }
          .msp-mobile-bar-label { font-size: 10px; color: #64748b; font-weight: 700; text-transform: uppercase; }
          .msp-mobile-bar-price { font-size: 1.15rem; font-weight: 900; color: #059669; }
          .msp-mobile-bar-gst { font-size: 10px; color: #64748b; font-weight: 600; }
          .msp-mobile-bar-action-col { flex: 0 0 55%; max-width: 200px; }
          .msp-mobile-bar-btn {
            width: 100%;
            border: 0;
            border-radius: 10px;
            padding: 10px 14px;
            font-size: 13px;
            font-weight: 800;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
          }
          .msp-mobile-bar-primary { background: #2563eb; color: #ffffff; }
          .msp-mobile-bar-active { background: #059669; color: #ffffff; }
        }

        /* ULTRA SMALL MOBILES (320px - 360px) */
        @media (max-width: 360px) {
          .msp-root { padding-left: 0.5rem; padding-right: 0.5rem; }
          .msp-hero-actions { grid-template-columns: 1fr; }
          .msp-docs-grid { grid-template-columns: 1fr; }
          .msp-filter-controls { width: 100%; flex-direction: column; align-items: stretch; }
          .msp-search-input, .msp-sort-select { width: 100%; min-width: auto; }
          .msp-expert-card { flex: 0 0 88%; min-width: 240px; }
        }
      `}</style>

      <div className="msp-container">
        {/* 🌟 SERVICE HERO */}
        <ServiceHero
          service={service}
          displayMinPrice={displayMinPrice}
          isDescExpanded={isDescExpanded}
          setIsDescExpanded={setIsDescExpanded}
          isAlreadyBooked={isAlreadyBooked}
          onBookClick={handleHeroPrimaryBookClick}
          onViewExpertsClick={handleHeroViewExpertsClick}
          getServiceImageUrl={getServiceImageUrl}
        />

        {/* ACTIVE BOOKING NOTICE CARD (IF USER HAS ACTIVE ORDER) */}
        <ActiveBookingNotice
          activeUserBooking={activeUserBooking}
          serviceTitle={service.title}
          showActiveBookingDialog={showActiveBookingDialog}
          setShowActiveBookingDialog={setShowActiveBookingDialog}
        />

        {/* 👥 RECOMMENDED EXPERTS SECTION */}
        {!isAlreadyBooked && (
          <ExpertSection
            experts={experts}
            processedExperts={processedExperts}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            serviceBasePrice={service.base_price}
            onBookExpert={handleOpenBookingModal}
            onAutoBook={() => handleOpenBookingModal(primaryExpert)}
          />
        )}

        {/* 📄 REQUIRED DOCUMENTS CHECKLIST */}
        <RequiredDocuments documentSpecs={service.document_specs} />

        {/* ⚙️ SERVICE FULFILLMENT PROCESS */}
        <ServiceProcess workflowSteps={service.workflow_steps} />

        {/* ❓ FREQUENTLY ASKED QUESTIONS */}
        <FaqSection
          defaultFaqs={defaultFaqs}
          openFaqIndex={openFaqIndex}
          setOpenFaqIndex={setOpenFaqIndex}
        />

        {/* 🔗 RELATED MASTER SERVICES */}
        <RelatedServices
          relatedServices={relatedServices}
          getServiceImageUrl={getServiceImageUrl}
        />
      </div>

      {/* 📱 MOBILE STICKY BOOKING BAR */}
      <MobileStickyBookingBar
        displayMinPrice={displayMinPrice}
        isAlreadyBooked={isAlreadyBooked}
        onBookClick={handleHeroPrimaryBookClick}
        onOpenWorkspaceClick={() => {
          if (activeUserBooking) {
            navigate(`/user/workspace/${activeUserBooking.booking_id || activeUserBooking.id}`);
          }
        }}
      />

      {/* 💳 BOOKING & WALLET PAYMENT MODAL */}
      {selectedExpertForBooking && (
        <BookingModal
          service={service}
          selectedExpert={selectedExpertForBooking}
          onClose={() => setSelectedExpertForBooking(null)}
          completedBooking={completedBooking}
          onNavigateWorkspace={(wId) => navigate(`/user/workspace/${wId}`)}
          bookingFormResponses={bookingFormResponses}
          setBookingFormResponses={setBookingFormResponses}
          bookingDocumentsMap={bookingDocumentsMap}
          onSpecFileSelect={handleSpecFileSelect}
          walletBalance={walletBalance}
          onTriggerRecharge={handleTriggerRecharge}
          bookingError={bookingError}
          bookingInProgress={bookingInProgress}
          onConfirmWalletBooking={handleConfirmWalletBooking}
        />
      )}

      {/* 🌟 SELECT AN EXPERT MODAL */}
      {showSelectExpertModal && !isAlreadyBooked && (
        <SelectExpertModal
          service={service}
          processedExperts={processedExperts}
          onClose={() => setShowSelectExpertModal(false)}
          onSelectExpert={handleOpenBookingModal}
        />
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
