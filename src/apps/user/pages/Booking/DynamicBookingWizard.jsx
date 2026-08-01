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
  FiEdit3
} from "react-icons/fi";
import AddBalancePopup from "../../components/AddBalancePopup/AddBalancePopup";

const WIZARD_CSS_STYLES = `
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  
  *, *:before, *:after {
    box-sizing: border-box !important;
  }

  .dbw-page-wrapper {
    min-height: 90vh;
    background: #f8fafc;
    padding: 1rem 0.75rem 5rem;
    overflow-x: hidden !important;
    width: 100% !important;
    max-width: 100vw !important;
    box-sizing: border-box !important;
  }

  .dbw-container {
    max-width: 1040px;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 auto;
    display: grid;
    gap: 1.25rem;
    box-sizing: border-box !important;
    overflow-x: hidden !important;
  }

  .dbw-step-panel {
    display: grid;
    gap: 1.25rem;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 auto !important;
    padding: 0 !important;
    box-sizing: border-box !important;
    overflow-x: hidden !important;
  }

  .dbw-expert-banner {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 12px;
    padding: 10px 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
  }

  .dbw-form-2col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
  }

  .dbw-field-group {
    display: grid;
    gap: 4px;
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
  }

  .dbw-field-label {
    font-size: 12px;
    font-weight: 700;
    color: #334155;
    display: block;
    margin-bottom: 4px;
    overflow-wrap: break-word;
    max-width: 100%;
  }

  .dbw-input-field {
    font-size: 16px !important;
    padding: 9px 12px !important;
    border-radius: 8px !important;
    border: 1px solid #cbd5e1 !important;
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
    background: #fff;
    color: #0f172a;
  }

  .dbw-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px 18px;
    border-radius: 8px;
    font-weight: 700;
    font-size: 14px;
    border: 0;
    cursor: pointer;
    transition: all 0.15s ease;
    box-sizing: border-box !important;
    text-align: center;
    max-width: 100% !important;
    white-space: normal !important;
    word-break: break-word !important;
  }

  /* ==========================================================================
     MOBILE RESPONSIVE CSS REFACTORING (300px - 575px VIEWPORTS)
     ========================================================================== */

  /* Global Mobile Base Reset (max-width: 575px) */
  @media (max-width: 575px) {
    html, body {
      overflow-x: hidden !important;
      max-width: 100vw !important;
      width: 100% !important;
    }
    
    *, *:before, *:after {
      box-sizing: border-box !important;
      max-width: 100% !important;
    }

    .dbw-page-wrapper {
      width: 100% !important;
      max-width: 100vw !important;
      overflow-x: hidden !important;
      box-sizing: border-box !important;
    }

    .dbw-container {
      width: 100% !important;
      max-width: 100% !important;
      margin: 0 auto !important;
      box-sizing: border-box !important;
      padding: 0 !important;
      overflow-x: hidden !important;
    }

    .dbw-main-grid {
      grid-template-columns: 1fr !important;
      gap: 0.75rem !important;
      width: 100% !important;
      max-width: 100% !important;
      box-sizing: border-box !important;
      overflow-x: hidden !important;
    }

    .dbw-sidebar-card {
      display: none !important;
    }

    .dbw-main-panel {
      width: 100% !important;
      max-width: 100% !important;
      box-sizing: border-box !important;
      margin: 0 auto !important;
      overflow-x: hidden !important;
    }

    .dbw-step-panel {
      display: grid !important;
      width: 100% !important;
      max-width: 100% !important;
      margin: 0 auto !important;
      padding: 0 !important;
      box-sizing: border-box !important;
      overflow-x: hidden !important;
    }

    .dbw-form-2col {
      grid-template-columns: 1fr !important;
      gap: 10px !important;
      width: 100% !important;
      max-width: 100% !important;
      box-sizing: border-box !important;
    }

    .dbw-field-group {
      display: grid !important;
      gap: 4px !important;
      width: 100% !important;
      max-width: 100% !important;
      box-sizing: border-box !important;
    }

    .dbw-input-field {
      width: 100% !important;
      max-width: 100% !important;
      box-sizing: border-box !important;
      font-size: 16px !important;
    }

    .dbw-action-btn-group {
      display: flex !important;
      flex-direction: column-reverse !important;
      width: 100% !important;
      max-width: 100% !important;
      gap: 8px !important;
      box-sizing: border-box !important;
    }

    .dbw-btn {
      width: 100% !important;
      max-width: 100% !important;
      box-sizing: border-box !important;
      justify-content: center !important;
      text-align: center !important;
      white-space: normal !important;
      word-break: break-word !important;
    }

    .dbw-stepper-wrap {
      display: flex !important;
      overflow-x: auto !important;
      scroll-snap-type: x mandatory !important;
      padding-bottom: 4px !important;
      -webkit-overflow-scrolling: touch !important;
      width: 100% !important;
      max-width: 100% !important;
      box-sizing: border-box !important;
    }

    .dbw-stepper-item {
      flex: 0 0 auto !important;
      scroll-snap-align: start !important;
    }
  }

  /* --------------------------------------------------------------------------
     BREAKPOINT 1: Ultra Small Mobile (300px – 319px)
     -------------------------------------------------------------------------- */
/* 1. Smallest Mobile (320px to 359px) */
@media (max-width: 359px) {
  .dbw-main-grid {
    width: 100%;
    max-width: 300px !important;
  
    box-sizing: border-box;
  }
}

/* 2. Standard Mobile (360px to 389px) */
@media (min-width: 360px) and (max-width: 389px) {
  .dbw-main-grid {
    width: 100%;
    max-width: 340px !important;
  
    box-sizing: border-box;
  }
}

/* 3. Medium Mobile (390px to 429px) */
@media (min-width: 390px) and (max-width: 429px) {
  .dbw-main-grid {
    width: 100%;
    max-width: 370px !important;
    
    box-sizing: border-box;
  }
}

/* 4. Large Mobile (430px to 500px) */
@media (min-width: 430px) and (max-width: 500px) {
  .dbw-main-grid {
    width: 100%;
    max-width: 410px !important;
  
    box-sizing: border-box;
  }
}



  @media (min-width: 300px) and (max-width: 319px) {
    .dbw-page-wrapper {
      padding: 0.4rem 4px 4rem !important;
    }
    .dbw-container {
      gap: 0.5rem !important;
    }
    .dbw-main-panel {
      padding: 6px 8px !important;
      border-radius: 8px !important;
    }
    .dbw-header-box {
      padding: 6px 8px !important;
      gap: 0.4rem !important;
      border-radius: 8px !important;
    }
    .dbw-header-title {
      font-size: 0.92rem !important;
      line-height: 1.25 !important;
    }
    .dbw-step-panel {
      gap: 0.6rem !important;
    }
    .dbw-step-panel h2 {
      font-size: 0.92rem !important;
    }
    .dbw-step-panel p {
      font-size: 0.74rem !important;
    }
    .dbw-expert-banner {
      padding: 6px 8px !important;
      gap: 6px !important;
      border-radius: 8px !important;
    }
    .dbw-field-label {
      font-size: 10px !important;
    }
    .dbw-input-field {
      padding: 6px 8px !important;
      font-size: 13px !important;
      border-radius: 6px !important;
    }
    .dbw-btn {
      padding: 8px 10px !important;
      font-size: 11.5px !important;
      border-radius: 6px !important;
    }
    .dbw-action-btn-group {
      margin-top: 0.5rem !important;
      gap: 6px !important;
    }
  }

  /* --------------------------------------------------------------------------
     BREAKPOINT 2: Small Mobile (320px – 359px)
     -------------------------------------------------------------------------- */
  @media (min-width: 320px) and (max-width: 359px) {
    .dbw-page-wrapper {
      padding: 0.5rem 6px 4.5rem !important;
    }
    .dbw-container {
      gap: 0.6rem !important;
    }
    .dbw-main-panel {
      padding: 8px 10px !important;
      border-radius: 10px !important;
    }
    .dbw-header-box {
      padding: 8px 10px !important;
      gap: 0.5rem !important;
      border-radius: 10px !important;
    }
    .dbw-header-title {
      font-size: 0.98rem !important;
      line-height: 1.28 !important;
    }
    .dbw-step-panel {
      gap: 0.68rem !important;
    }
    .dbw-step-panel h2 {
      font-size: 0.98rem !important;
    }
    .dbw-step-panel p {
      font-size: 0.77rem !important;
    }
    .dbw-expert-banner {
      padding: 8px 10px !important;
      gap: 6px !important;
      border-radius: 10px !important;
    }
    .dbw-field-label {
      font-size: 10.5px !important;
    }
    .dbw-input-field {
      padding: 7px 9px !important;
      font-size: 13.5px !important;
      border-radius: 6px !important;
    }
    .dbw-btn {
      padding: 9px 12px !important;
      font-size: 12px !important;
      border-radius: 7px !important;
    }
    .dbw-action-btn-group {
      margin-top: 0.6rem !important;
      gap: 6px !important;
    }
  }

  /* --------------------------------------------------------------------------
     BREAKPOINT 3: Standard Mobile (360px – 374px)
     -------------------------------------------------------------------------- */
  @media (min-width: 360px) and (max-width: 374px) {
    .dbw-page-wrapper {
      padding: 0.5rem 8px 4.5rem !important;
    }
    .dbw-container {
      gap: 0.65rem !important;
    }
    .dbw-main-panel {
      padding: 10px 12px !important;
      border-radius: 12px !important;
    }
    .dbw-header-box {
      padding: 10px 12px !important;
      gap: 0.5rem !important;
      border-radius: 12px !important;
    }
    .dbw-header-title {
      font-size: 1.02rem !important;
    }
    .dbw-step-panel {
      gap: 0.72rem !important;
    }
    .dbw-step-panel h2 {
      font-size: 1.02rem !important;
    }
    .dbw-step-panel p {
      font-size: 0.8rem !important;
    }
    .dbw-expert-banner {
      padding: 8px 12px !important;
      gap: 8px !important;
      border-radius: 10px !important;
    }
    .dbw-field-label {
      font-size: 11px !important;
    }
    .dbw-input-field {
      padding: 8px 10px !important;
      font-size: 14px !important;
      border-radius: 7px !important;
    }
    .dbw-btn {
      padding: 9.5px 14px !important;
      font-size: 12.5px !important;
      border-radius: 7px !important;
    }
    .dbw-action-btn-group {
      margin-top: 0.65rem !important;
      gap: 8px !important;
    }
  }

  /* --------------------------------------------------------------------------
     BREAKPOINT 4: Medium Mobile (375px – 389px)
     -------------------------------------------------------------------------- */
  @media (min-width: 375px) and (max-width: 389px) {
    .dbw-page-wrapper {
      padding: 0.6rem 10px 4.8rem !important;
    }
    .dbw-container {
      gap: 0.7rem !important;
    }
    .dbw-main-panel {
      padding: 12px 14px !important;
      border-radius: 12px !important;
    }
    .dbw-header-box {
      padding: 12px 14px !important;
      gap: 0.6rem !important;
      border-radius: 12px !important;
    }
    .dbw-header-title {
      font-size: 1.05rem !important;
    }
    .dbw-step-panel {
      gap: 0.78rem !important;
    }
    .dbw-step-panel h2 {
      font-size: 1.05rem !important;
    }
    .dbw-step-panel p {
      font-size: 0.82rem !important;
    }
    .dbw-expert-banner {
      padding: 10px 12px !important;
      gap: 8px !important;
      border-radius: 12px !important;
    }
    .dbw-field-label {
      font-size: 11.5px !important;
    }
    .dbw-input-field {
      padding: 8.5px 11px !important;
      font-size: 14.5px !important;
      border-radius: 8px !important;
    }
    .dbw-btn {
      padding: 10px 15px !important;
      font-size: 13px !important;
      border-radius: 8px !important;
    }
    .dbw-action-btn-group {
      margin-top: 0.7rem !important;
      gap: 8px !important;
    }
  }

  /* --------------------------------------------------------------------------
     BREAKPOINT 5: Large Mobile (390px – 411px)
     -------------------------------------------------------------------------- */
  @media (min-width: 390px) and (max-width: 411px) {
    .dbw-page-wrapper {
      padding: 0.6rem 12px 5rem !important;
    }
    .dbw-container {
      gap: 0.75rem !important;
    }
    .dbw-main-panel {
      padding: 14px 16px !important;
      border-radius: 14px !important;
    }
    .dbw-header-box {
      padding: 14px 16px !important;
      gap: 0.65rem !important;
      border-radius: 14px !important;
    }
    .dbw-header-title {
      font-size: 1.08rem !important;
    }
    .dbw-step-panel {
      gap: 0.82rem !important;
    }
    .dbw-step-panel h2 {
      font-size: 1.08rem !important;
    }
    .dbw-step-panel p {
      font-size: 0.85rem !important;
    }
    .dbw-expert-banner {
      padding: 10px 14px !important;
      gap: 10px !important;
      border-radius: 12px !important;
    }
    .dbw-field-label {
      font-size: 12px !important;
    }
    .dbw-input-field {
      padding: 9px 12px !important;
      font-size: 15px !important;
      border-radius: 8px !important;
    }
    .dbw-btn {
      padding: 10.5px 16px !important;
      font-size: 13.5px !important;
      border-radius: 8px !important;
    }
    .dbw-action-btn-group {
      margin-top: 0.75rem !important;
      gap: 8px !important;
    }
  }

  /* --------------------------------------------------------------------------
     BREAKPOINT 6: Plus Mobile (412px – 429px)
     -------------------------------------------------------------------------- */
  @media (min-width: 412px) and (max-width: 429px) {
    .dbw-page-wrapper {
      padding: 0.65rem 14px 5rem !important;
    }
    .dbw-container {
      gap: 0.8rem !important;
    }
    .dbw-main-panel {
      padding: 15px 16px !important;
      border-radius: 14px !important;
    }
    .dbw-header-box {
      padding: 15px 16px !important;
      gap: 0.7rem !important;
      border-radius: 14px !important;
    }
    .dbw-header-title {
      font-size: 1.1rem !important;
    }
    .dbw-step-panel {
      gap: 0.85rem !important;
    }
    .dbw-step-panel h2 {
      font-size: 1.1rem !important;
    }
    .dbw-step-panel p {
      font-size: 0.86rem !important;
    }
    .dbw-expert-banner {
      padding: 11px 14px !important;
      gap: 10px !important;
      border-radius: 12px !important;
    }
    .dbw-field-label {
      font-size: 12px !important;
    }
    .dbw-input-field {
      padding: 9.5px 12px !important;
      font-size: 15px !important;
      border-radius: 8px !important;
    }
    .dbw-btn {
      padding: 11px 16px !important;
      font-size: 13.5px !important;
      border-radius: 8px !important;
    }
    .dbw-action-btn-group {
      margin-top: 0.8rem !important;
      gap: 10px !important;
    }
  }

  /* --------------------------------------------------------------------------
     BREAKPOINT 7: Max Mobile (430px – 479px)
     -------------------------------------------------------------------------- */
  @media (min-width: 430px) and (max-width: 479px) {
    .dbw-page-wrapper {
      padding: 0.7rem 16px 5rem !important;
    }
    .dbw-container {
      gap: 0.85rem !important;
    }
    .dbw-main-panel {
      padding: 16px 18px !important;
      border-radius: 14px !important;
    }
    .dbw-header-box {
      padding: 16px 18px !important;
      gap: 0.75rem !important;
      border-radius: 14px !important;
    }
    .dbw-header-title {
      font-size: 1.12rem !important;
    }
    .dbw-step-panel {
      gap: 0.9rem !important;
    }
    .dbw-step-panel h2 {
      font-size: 1.12rem !important;
    }
    .dbw-step-panel p {
      font-size: 0.87rem !important;
    }
    .dbw-expert-banner {
      padding: 12px 16px !important;
      gap: 10px !important;
      border-radius: 12px !important;
    }
    .dbw-field-label {
      font-size: 12px !important;
    }
    .dbw-input-field {
      padding: 10px 13px !important;
      font-size: 15.5px !important;
      border-radius: 8px !important;
    }
    .dbw-btn {
      padding: 11.5px 18px !important;
      font-size: 14px !important;
      border-radius: 8px !important;
    }
    .dbw-action-btn-group {
      margin-top: 0.85rem !important;
      gap: 10px !important;
    }
  }

  /* --------------------------------------------------------------------------
     BREAKPOINT 8: Extra Large Mobile / Phablet (480px – 575px)
     -------------------------------------------------------------------------- */
/* 1. Smallest Mobile (320px to 359px) */
@media (max-width: 359px) {
  .order-summary-bar-mobile {
    width: 100%;
    max-width: 300px !important;
    box-sizing: border-box;
  }
}

/* 2. Standard Mobile (360px to 389px) */
@media (min-width: 360px) and (max-width: 389px) {
  .order-summary-bar-mobile {
    width: 100%;
    max-width: 340px !important;
    box-sizing: border-box;
  }
}

/* 3. Medium Mobile (390px to 429px) */
@media (min-width: 390px) and (max-width: 429px) {
  .order-summary-bar-mobile {
    width: 100%;
    max-width: 370px !important;
    box-sizing: border-box;
  }
}

/* 4. Large Mobile (430px to 500px) */
@media (min-width: 430px) and (max-width: 500px) {
  .order-summary-bar-mobile {
    width: 100%;
    max-width: 410px !important;
    box-sizing: border-box;
  }
}
     











  @media (min-width: 480px) and (max-width: 575px) {
    .dbw-page-wrapper {
      padding: 0.75rem 18px 5rem !important;
    }
    .dbw-container {
      gap: 0.9rem !important;
    }
    .dbw-main-panel {
      padding: 18px 20px !important;
      border-radius: 16px !important;
    }
    .dbw-header-box {
      padding: 18px 20px !important;
      gap: 0.8rem !important;
      border-radius: 16px !important;
    }
    .dbw-header-title {
      font-size: 1.15rem !important;
    }
    .dbw-step-panel {
      gap: 1rem !important;
    }
    .dbw-step-panel h2 {
      font-size: 1.15rem !important;
    }
    .dbw-step-panel p {
      font-size: 0.88rem !important;
    }
    .dbw-expert-banner {
      padding: 12px 16px !important;
      gap: 12px !important;
      border-radius: 12px !important;
    }
    .dbw-field-label {
      font-size: 12px !important;
    }
    .dbw-input-field {
      padding: 10px 14px !important;
      font-size: 16px !important;
      border-radius: 8px !important;
    }
    .dbw-btn {
      padding: 12px 20px !important;
      font-size: 14px !important;
      border-radius: 8px !important;
    }
    .dbw-action-btn-group {
      margin-top: 0.9rem !important;
      gap: 10px !important;
    }
  }
`;

export default function DynamicBookingWizard() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // URL search params
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const queryExpertId = searchParams.get("expertId") || searchParams.get("expert_id");
  const queryActivationId = searchParams.get("activationId") || searchParams.get("activation_id");

  // Passed state
  const stateExpert = location.state?.expert;
  const stateService = location.state?.service;

  // Check if an expert was pre-selected from previous page or URL params
  const hasPreselectedExpert = Boolean(stateExpert || queryExpertId || queryActivationId);

  // Step state: if expert was pre-selected, start directly on Step 2 (Intake Form), bypassing redundant list step
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
    fetchWalletBalance();
  }, [fetchWalletBalance]);

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
            // Pre-selected expert flow: bypass redundant list step
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
  const gstAmount = Math.round(effectiveBase * 0.18);
  const totalPayable = effectiveBase + gstAmount;

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

  const handleGenericDocSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setGenericDocs((prev) => [
      ...prev,
      {
        doc_type_key: "INITIAL_DOCUMENT",
        label: "Attachment",
        file_name: file.name,
        file_size: file.size,
        rawFile: file
      }
    ]);
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
    return true;
  };

  const validateStep3 = () => {
    const missingDocs = documentSpecs.filter((spec) => {
      const isReq = spec.is_mandatory === 1 || spec.is_mandatory === true;
      return isReq && !documentsMap[spec.doc_type_key];
    });
    if (missingDocs.length > 0) {
      alert(`Please upload all mandatory documents: ${missingDocs.map((d) => d.label).join(", ")}`);
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

      // Combine documents
      const allDocs = [...Object.values(documentsMap), ...genericDocs];

      // Upload files
      const processedDocs = await Promise.all(
        allDocs.map(async (doc) => {
          if (doc.rawFile) {
            try {
              const formData = new FormData();
              formData.append("file", doc.rawFile);
              const upRes = await fetch("/api/workspace/upload-file", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData
              });
              const upData = await upRes.json();
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
        setStep(5);
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
    return (
      <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: 16 }}>
        <div style={{ width: 44, height: 44, border: "4px solid #e2e8f0", borderTopColor: "#2563eb", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <p style={{ color: "#64748b", fontWeight: 600, fontSize: "0.95rem" }}>Loading Booking Details...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (bookingError && !service) {
    return (
      <div style={{ maxWidth: 600, margin: "2rem auto", padding: "1.5rem", background: "#fff", borderRadius: 16, border: "1px solid #fecaca", textAlign: "center", boxSizing: "border-box" }}>
        <h3 style={{ color: "#dc2626", margin: "0 0 0.5rem 0" }}>Booking Unavailable</h3>
        <p style={{ color: "#64748b", marginBottom: "1.25rem", fontSize: 14 }}>{bookingError}</p>
        <button onClick={() => navigate(-1)} style={{ padding: "0.6rem 1.25rem", background: "#2563eb", color: "#fff", border: 0, borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>
          ← Back to Service Details
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: 16 }}>
        <style dangerouslySetInnerHTML={{ __html: WIZARD_CSS_STYLES }} />
        <div style={{ width: 44, height: 44, border: "4px solid #e2e8f0", borderTopColor: "#2563eb", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <p style={{ color: "#64748b", fontWeight: 600, fontSize: "0.95rem" }}>Loading Booking Details...</p>
      </div>
    );
  }

  if (bookingError && !service) {
    return (
      <div style={{ maxWidth: 600, margin: "2rem auto", padding: "1.5rem", background: "#fff", borderRadius: 16, border: "1px solid #fecaca", textAlign: "center", boxSizing: "border-box" }}>
        <style dangerouslySetInnerHTML={{ __html: WIZARD_CSS_STYLES }} />
        <h3 style={{ color: "#dc2626", margin: "0 0 0.5rem 0" }}>Booking Unavailable</h3>
        <p style={{ color: "#64748b", marginBottom: "1.25rem", fontSize: 14 }}>{bookingError}</p>
        <button onClick={() => navigate(-1)} style={{ padding: "0.6rem 1.25rem", background: "#2563eb", color: "#fff", border: 0, borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>
          ← Back to Service Details
        </button>
      </div>
    );
  }

  const stepsList = [
    { id: 1, label: "Expert" },
    { id: 2, label: "Intake Form" },
    { id: 3, label: "Documents" },
    { id: 4, label: "Payment" }
  ];

  return (
    <div className="dbw-page-wrapper">
      <style dangerouslySetInnerHTML={{ __html: WIZARD_CSS_STYLES }} />

      <div className="dbw-container">
        
        {/* HEADER BAR */}
        {/* <div className="dbw-header-box" style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "1.25rem 1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{ background: "#f1f5f9", border: 0, width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#334155", flexShrink: 0 }}
              title="Back"
            >
              <FiArrowLeft size={18} />
            </button>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Standalone Booking Page
              </div>
              <h1 className="dbw-header-title" style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                Book Service: {service?.title}
              </h1>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#eff6ff", padding: "5px 12px", borderRadius: 20, border: "1px solid #bfdbfe", flexShrink: 0 }}>
            <FiShield size={14} color="#2563eb" />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#1e40af" }}>100% Guarantee</span>
          </div>
        </div> */}

        {/* MOBILE COLLAPSIBLE ORDER SUMMARY BAR (MOBILE ONLY) */}
        {step <= 4 && (
          <div className="order-summary-bar-mobile" style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: "10px 14px", width: "100%", boxSizing: "border-box" }}>
            <div
              onClick={() => setShowMobileSummary(!showMobileSummary)}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FiCreditCard size={18} color="#2563eb" />
                <span style={{ fontSize: 13, fontWeight: 800, color: "#1e40af" }}>
                  Total Payable: ₹{totalPayable}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#2563eb", fontWeight: 700 }}>
                <span>{showMobileSummary ? "Hide Details" : "View Breakdown"}</span>
                {showMobileSummary ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
              </div>
            </div>

            {showMobileSummary && (
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px dashed #bfdbfe", display: "grid", gap: 6, fontSize: 13, color: "#334155" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Service:</span>
                  <strong style={{ textAlign: "right" }}>{service?.title}</strong>
                </div>
                {selectedExpert && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Expert:</span>
                    <strong style={{ color: "#2563eb", textAlign: "right" }}>{selectedExpert.expert_name || selectedExpert.name}</strong>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Base Price:</span>
                  <span>₹{effectiveBase}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>GST (18%):</span>
                  <span>₹{gstAmount}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#1e40af", fontWeight: 800, paddingTop: 4 }}>
                  <span>Wallet Balance:</span>
                  <span>₹{walletBalance}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP PROGRESS BAR */}
        {step <= 4 && (
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", padding: "0.75rem", boxShadow: "0 1px 2px rgba(0,0,0,0.04)", width: "100%", boxSizing: "border-box" }}>
            <div className="dbw-stepper-wrap" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {stepsList.map((s) => {
                const isActive = step === s.id;
                const isPassed = step > s.id;
                return (
                  <div
                    key={s.id}
                    className="dbw-stepper-item"
                    onClick={() => { setStep(s.id); }}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 10,
                      background: isActive ? "#2563eb" : isPassed ? "#dcfce7" : "#f1f5f9",
                      color: isActive ? "#fff" : isPassed ? "#15803d" : "#64748b",
                      fontWeight: 700,
                      fontSize: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <span style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: isActive ? "#fff" : isPassed ? "#16a34a" : "#cbd5e1",
                      color: isActive ? "#2563eb" : isPassed ? "#fff" : "#475569",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 900,
                      flexShrink: 0
                    }}>
                      {isPassed ? "✓" : s.id}
                    </span>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP CONTENT BODY */}
        <div className="dbw-main-grid" style={{ display: "grid", gridTemplateColumns: step === 5 ? "1fr" : "1fr 320px", gap: "1.25rem", alignItems: "start", width: "100%", boxSizing: "border-box" }}>
          
          {/* MAIN WIZARD FORM PANEL */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "1.25rem 1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", display: "grid", gap: "1.25rem", width: "100%", boxSizing: "border-box" }}>
            
            {/* STEP 1: SERVICE & EXPERT SELECTION */}
            {step === 1 && (
              <div style={{ display: "grid", gap: "1.25rem" }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>
                    Expert Selection
                  </div>
                  <h2 style={{ margin: "0 0 0.4rem 0", color: "#0f172a", fontSize: "1.2rem", fontWeight: 800 }}>
                    Step 1: Choose Your Expert
                  </h2>
                  <p style={{ margin: 0, color: "#64748b", fontSize: "0.88rem" }}>
                    Select a verified expert below to fulfill your digital service order.
                  </p>
                </div>

                {experts.length === 0 ? (
                  <div style={{ padding: "1.25rem", background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0", textAlign: "center", color: "#64748b", fontSize: 13 }}>
                    Standard platform expert will be assigned upon booking.
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
                          style={{
                            border: isSel ? "2px solid #2563eb" : "1px solid #e2e8f0",
                            background: isSel ? "#f0f6ff" : "#ffffff",
                            borderRadius: 14,
                            padding: "1rem",
                            display: "grid",
                            gap: 12,
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                            boxShadow: isSel ? "0 4px 12px rgba(37, 99, 235, 0.08)" : "0 1px 3px rgba(0,0,0,0.02)",
                            boxSizing: "border-box"
                          }}
                        >
                          {/* TOP ROW: AVATAR, NAME, TITLE & RADIO CHECKMARK */}
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", gap: 10 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>
                              <div style={{
                                width: 44,
                                height: 44,
                                borderRadius: "50%",
                                background: isSel ? "#2563eb" : "#3b82f6",
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 800,
                                fontSize: "1.05rem",
                                flexShrink: 0,
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                              }}>
                                {(exp.expert_name || exp.name || "E").slice(0, 2).toUpperCase()}
                              </div>
                              <div style={{ minWidth: 0, flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                                  <span style={{ fontWeight: 800, color: "#0f172a", fontSize: "0.98rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {exp.expert_name || exp.name}
                                  </span>
                                  <span style={{ background: "#dcfce7", color: "#15803d", fontSize: 10, fontWeight: 800, padding: "2px 6px", borderRadius: 10, flexShrink: 0 }}>
                                    ✓ Verified
                                  </span>
                                </div>
                                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  {exp.position || "Certified Platform Expert"}
                                </div>
                              </div>
                            </div>

                            <div style={{
                              width: 22,
                              height: 22,
                              borderRadius: "50%",
                              border: isSel ? "6px solid #2563eb" : "2px solid #cbd5e1",
                              background: "#fff",
                              flexShrink: 0,
                              transition: "all 0.15s ease"
                            }} />
                          </div>

                          {/* BOTTOM ROW: SLA BADGE & PRICE */}
                          <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            background: isSel ? "#dbeafe" : "#f8fafc",
                            padding: "8px 12px",
                            borderRadius: 10,
                            border: isSel ? "1px solid #bfdbfe" : "1px solid #f1f5f9",
                            flexWrap: "wrap",
                            gap: 8
                          }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#334155", fontWeight: 700 }}>
                              <FiClock size={14} color="#2563eb" />
                              <span>SLA Delivery: <strong style={{ color: "#0f172a" }}>{sla} Day{sla > 1 ? "s" : ""}</strong></span>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ fontSize: 11, color: "#64748b" }}>Price:</span>
                              <span style={{ fontSize: "1.1rem", fontWeight: 900, color: "#059669" }}>₹{price}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="dbw-action-btn-group" style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
                  <button
                    type="button"
                    className="dbw-btn"
                    onClick={() => {
                      if (!selectedExpert && experts.length > 0) {
                        setSelectedExpert(experts[0]);
                      }
                      setStep(2);
                    }}
                    style={{ background: "#2563eb", color: "#fff" }}
                  >
                    Next: Intake Requirements →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: INTAKE REQUIREMENTS & FORM */}
            {step === 2 && (
              <div className="dbw-step-panel">
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>
                    Requirements Intake
                  </div>
                  <h2 style={{ margin: "0 0 0.4rem 0", color: "#0f172a", fontSize: "1.2rem", fontWeight: 800, overflowWrap: "break-word" }}>
                    Step 2: Service Requirements
                  </h2>
                  <p style={{ margin: 0, color: "#64748b", fontSize: "0.88rem", overflowWrap: "break-word" }}>
                    Provide your contact details and instructions for the expert.
                  </p>
                </div>

                {/* PRE-SELECTED EXPERT SUMMARY BANNER */}
                {selectedExpert && (
                  <div className="dbw-expert-banner">
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#2563eb", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
                        {(selectedExpert.expert_name || selectedExpert.name || "E").slice(0, 2).toUpperCase()}
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: 11, color: "#64748b" }}>Selected Expert</div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#1e40af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {selectedExpert.expert_name || selectedExpert.name}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      style={{ background: "#fff", border: "1px solid #cbd5e1", borderRadius: 6, padding: "4px 10px", fontSize: 12, fontWeight: 700, color: "#2563eb", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}
                    >
                      <FiEdit3 size={12} /> Change Expert
                    </button>
                  </div>
                )}

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
                      placeholder="Contact Phone Number"
                    />
                  </div>
                </div>

                <div className="dbw-field-group">
                  <label className="dbw-field-label">Email Address</label>
                  <input
                    type="email"
                    className="dbw-input-field"
                    value={formResponses.email || ""}
                    onChange={(e) => handleFormFieldChange("email", e.target.value)}
                    placeholder="name@example.com"
                  />
                </div>

                <div className="dbw-field-group">
                  <label className="dbw-field-label">Specific Instructions / Requirements Note</label>
                  <textarea
                    rows={3}
                    className="dbw-input-field"
                    value={formResponses.requirements_note || ""}
                    onChange={(e) => handleFormFieldChange("requirements_note", e.target.value)}
                    placeholder="Provide specific notes, domain details, or requirements for your order..."
                    style={{ resize: "vertical" }}
                  />
                </div>

                {/* DYNAMIC FORM FIELDS */}
                {formFields.length > 0 && (
                  <div style={{ borderTop: "1px dashed #cbd5e1", paddingTop: "1rem", display: "grid", gap: 12, width: "100%", boxSizing: "border-box" }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>📝 Additional Intake Questions</div>
                    {formFields.map((field) => {
                      const key = field.field_key || field.key || field.id;
                      const label = field.field_label || field.label || "Field";
                      const isReq = field.is_required === 1 || field.is_required === true;
                      const type = (field.field_type || field.type || "text").toLowerCase();
                      const val = formResponses[key] || "";

                      return (
                        <div key={key} className="dbw-field-group">
                          <label className="dbw-field-label">
                            {label} {isReq && <span style={{ color: "#ef4444" }}>*</span>}
                          </label>
                          {type === "textarea" ? (
                            <textarea
                              rows={2}
                              className="dbw-input-field"
                              value={val}
                              onChange={(e) => handleFormFieldChange(key, e.target.value)}
                              placeholder={`Enter ${label}...`}
                              style={{ resize: "vertical" }}
                            />
                          ) : type === "select" || type === "dropdown" ? (
                            <select
                              value={val}
                              className="dbw-input-field"
                              onChange={(e) => handleFormFieldChange(key, e.target.value)}
                            >
                              <option value="">-- Select {label} --</option>
                              {Array.isArray(field.options) && field.options.map((opt, idx) => {
                                const oVal = typeof opt === "string" ? opt : (opt.value || opt.option_value || opt.label);
                                return <option key={idx} value={oVal}>{oVal}</option>;
                              })}
                            </select>
                          ) : (
                            <input
                              type={type === "number" ? "number" : "text"}
                              className="dbw-input-field"
                              value={val}
                              onChange={(e) => handleFormFieldChange(key, e.target.value)}
                              placeholder={`Enter ${label}...`}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="dbw-action-btn-group">
                  <button type="button" className="dbw-btn" onClick={() => setStep(1)} style={{ background: "#f1f5f9", color: "#334155", border: "1px solid #cbd5e1" }}>
                    ← Back to Expert List
                  </button>
                  <button
                    type="button"
                    className="dbw-btn"
                    onClick={() => {
                      if (validateStep2()) setStep(3);
                    }}
                    style={{ background: "#2563eb", color: "#fff" }}
                  >
                    Next: Document Checklist →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: DOCUMENT UPLOADS */}
            {step === 3 && (
              <div style={{ display: "grid", gap: "1.25rem" }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>
                    Document Uploads
                  </div>
                  <h2 style={{ margin: "0 0 0.4rem 0", color: "#0f172a", fontSize: "1.2rem", fontWeight: 800 }}>Step 3: Document Checklist</h2>
                  <p style={{ margin: 0, color: "#64748b", fontSize: "0.88rem" }}>Attach required identity or service specification documents.</p>
                </div>

                {documentSpecs.length > 0 ? (
                  <div style={{ display: "grid", gap: 10 }}>
                    {documentSpecs.map((spec) => {
                      const isUploaded = !!documentsMap[spec.doc_type_key];
                      const uploaded = documentsMap[spec.doc_type_key];

                      return (
                        <div
                          key={spec.id || spec.doc_type_key}
                          style={{
                            background: isUploaded ? "#f0fdf4" : "#f8fafc",
                            border: isUploaded ? "1px solid #86efac" : "1px solid #e2e8f0",
                            borderRadius: 12,
                            padding: "0.85rem 1rem",
                            display: "grid",
                            gap: 6,
                            boxSizing: "border-box"
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
                            <span style={{ fontWeight: 800, color: "#0f172a", fontSize: "0.9rem" }}>
                              {spec.label} {spec.is_mandatory ? <strong style={{ color: "#ef4444" }}>* (Mandatory)</strong> : <span style={{ color: "#64748b", fontWeight: 400 }}>(Optional)</span>}
                            </span>
                            {isUploaded && <span style={{ color: "#059669", fontWeight: 800, fontSize: 11 }}>✓ Attached</span>}
                          </div>
                          <input
                            type="file"
                            onChange={(e) => handleSpecDocSelect(spec, e.target.files[0])}
                            style={{ fontSize: 12, maxWidth: "100%", boxSizing: "border-box" }}
                          />
                          {uploaded && (
                            <div style={{ fontSize: 11, color: "#047857", fontWeight: 600, overflowWrap: "anywhere" }}>
                              Attached: {uploaded.file_name} ({(uploaded.file_size / 1024).toFixed(1)} KB)
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ padding: "1rem", background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0" }}>
                    <p style={{ margin: "0 0 8px 0", color: "#64748b", fontSize: 13 }}>No mandatory upfront documents required. You may attach optional files below:</p>
                    <input type="file" onChange={handleGenericDocSelect} style={{ fontSize: 12, maxWidth: "100%" }} />
                    {genericDocs.length > 0 && (
                      <div style={{ marginTop: 6, fontSize: 11, color: "#059669", fontWeight: 700 }}>
                        ✓ {genericDocs.length} optional document(s) attached
                      </div>
                    )}
                  </div>
                )}

                <div className="dbw-action-btn-group" style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: "0.5rem" }}>
                  <button type="button" className="dbw-btn" onClick={() => setStep(2)} style={{ background: "#f1f5f9", color: "#334155", border: "1px solid #cbd5e1" }}>
                    ← Back
                  </button>
                  <button
                    type="button"
                    className="dbw-btn"
                    onClick={() => {
                      if (validateStep3()) setStep(4);
                    }}
                    style={{ background: "#2563eb", color: "#fff" }}
                  >
                    Next: Checkout & Payment →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: ORDER CHECKOUT & PAYMENT */}
            {step === 4 && (
              <div style={{ display: "grid", gap: "1.25rem" }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>
                    Payment Checkout
                  </div>
                  <h2 style={{ margin: "0 0 0.4rem 0", color: "#0f172a", fontSize: "1.2rem", fontWeight: 800 }}>Step 4: Confirm & Pay</h2>
                  <p style={{ margin: 0, color: "#64748b", fontSize: "0.88rem" }}>Review your order details and confirm payment via your user wallet.</p>
                </div>

                {bookingError && (
                  <div style={{ background: "#fef2f2", color: "#b42318", border: "1px solid #fecaca", padding: "0.85rem 1rem", borderRadius: 10, fontSize: 13, fontWeight: 600 }}>
                    {bookingError}
                  </div>
                )}

                {/* WALLET SUMMARY WIDGET */}
                <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, boxSizing: "border-box" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <FiCreditCard size={20} color="#2563eb" />
                    <div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>Your Current Wallet Balance</div>
                      <strong style={{ fontSize: "1.15rem", color: "#1e40af" }}>₹{walletBalance}</strong>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setRechargeDeficit(walletBalance < totalPayable ? totalPayable - walletBalance : null);
                      setShowRechargePopup(true);
                    }}
                    style={{ fontSize: 12, color: "#fff", background: "#2563eb", fontWeight: 700, border: 0, padding: "8px 12px", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <FiPlusCircle /> Top Up Wallet
                  </button>
                </div>

                {/* BILLING BREAKDOWN TABLE */}
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "1rem", display: "grid", gap: 8, boxSizing: "border-box" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#475569" }}>
                    <span>Expert Selling Price ({selectedExpert?.expert_name || "Assigned Expert"}):</span>
                    <strong style={{ color: "#0f172a" }}>₹{effectiveBase}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#475569" }}>
                    <span>GST Tax (18%):</span>
                    <strong style={{ color: "#0f172a" }}>₹{gstAmount}</strong>
                  </div>
                  <div style={{ borderTop: "1px dashed #cbd5e1", paddingTop: 8, display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 900, color: "#0f172a" }}>
                    <span>Total Amount Payable:</span>
                    <span style={{ color: "#059669" }}>₹{totalPayable}</span>
                  </div>
                </div>

                <div className="dbw-action-btn-group" style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: "0.5rem" }}>
                  <button type="button" className="dbw-btn" onClick={() => setStep(3)} style={{ background: "#f1f5f9", color: "#334155", border: "1px solid #cbd5e1" }}>
                    ← Back
                  </button>
                  <button
                    type="button"
                    className="dbw-btn"
                    onClick={handleConfirmBooking}
                    disabled={submitting || walletLoading}
                    style={{ background: "#059669", color: "#fff", padding: "12px 20px" }}
                  >
                    {submitting ? "Processing Payment..." : `💳 Pay ₹${totalPayable} & Complete Order`}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: BOOKING CONFIRMATION */}
            {step === 5 && completedBooking && (
              <div style={{ textAlign: "center", display: "grid", gap: "1.25rem", padding: "0.5rem 0" }}>
                <div style={{ background: "#dcfce7", color: "#15803d", width: 56, height: 56, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", fontSize: 28, fontWeight: 900 }}>
                  ✓
                </div>
                <div>
                  <h2 style={{ margin: 0, color: "#0f172a", fontSize: "1.45rem", fontWeight: 800 }}>Booking Confirmed!</h2>
                  <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: "0.9rem" }}>
                    Order <strong>#{completedBooking.booking_id}</strong> created successfully. Wallet payment processed.
                  </p>
                </div>

                {/* FUNNEL ACTIONS */}
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 14, padding: "1.25rem", display: "grid", gap: 10, maxWidth: 440, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
                  <span style={{ fontSize: 12, color: "#475569", fontWeight: 800 }}>Connect & Coordinate with Fulfilling Expert:</span>
                  <div className="dbw-funnel-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <button
                      type="button"
                      className="dbw-btn"
                      onClick={() => navigate(`/user/chat?expert_id=${completedBooking.expert_id}`)}
                      style={{ background: "#2563eb", color: "#fff" }}
                    >
                      <FiMessageCircle /> Start Chat
                    </button>
                    <button
                      type="button"
                      className="dbw-btn"
                      onClick={() => navigate(`/user/voice-call/${completedBooking.expert_id}`)}
                      style={{ background: "#059669", color: "#fff" }}
                    >
                      <FiPhone /> Voice Call
                    </button>
                  </div>
                  <button
                    type="button"
                    className="dbw-btn"
                    onClick={() => navigate(`/user/workspace/${completedBooking.booking_id}`)}
                    style={{ background: "#0f172a", color: "#fff", width: "100%", padding: "12px" }}
                  >
                    <FiFolder /> Launch Execution Workspace 🚀
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR SUMMARY PANEL (DESKTOP / TABLET) */}
          {step <= 4 && (
            <div className="dbw-sidebar-card" style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "1.25rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", display: "grid", gap: "1rem", boxSizing: "border-box" }}>
              <h3 style={{ margin: 0, color: "#0f172a", fontSize: "1.05rem", fontWeight: 800 }}>Order Summary</h3>
              
              <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: "0.85rem" }}>
                <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>Service</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", marginTop: 2, overflowWrap: "break-word" }}>{service?.title}</div>
              </div>

              {selectedExpert && (
                <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: "0.85rem" }}>
                  <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>Assigned Expert</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#2563eb", marginTop: 2, overflowWrap: "break-word" }}>{selectedExpert.expert_name || selectedExpert.name}</div>
                  <div style={{ fontSize: 12, color: "#059669", fontWeight: 700, marginTop: 2 }}>⚡ {selectedExpert.delivery_time_days || 1} Days SLA Delivery</div>
                </div>
              )}

              <div style={{ display: "grid", gap: 6, fontSize: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#475569" }}>
                  <span>Base Price:</span>
                  <strong>₹{effectiveBase}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#475569" }}>
                  <span>GST (18%):</span>
                  <strong>₹{gstAmount}</strong>
                </div>
                <div style={{ borderTop: "1px dashed #cbd5e1", paddingTop: 6, display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 900, color: "#0f172a" }}>
                  <span>Total Payable:</span>
                  <span style={{ color: "#059669" }}>₹{totalPayable}</span>
                </div>
              </div>

              <div style={{ background: "#f8fafc", borderRadius: 10, padding: 8, fontSize: 11, color: "#64748b", lineHeight: 1.4 }}>
                🔒 Payment is held in secure platform escrow until service delivery is completed.
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
          createOrder={handleCreateRechargeOrder}
          onConfirm={handleConfirmRecharge}
        />
      )}
    </div>
  );
}
