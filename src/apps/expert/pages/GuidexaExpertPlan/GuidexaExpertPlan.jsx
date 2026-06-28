import React, { useState, useEffect, useRef } from "react";
import { useExpert } from "../../../../shared/context/ExpertContext";
import Loader from "../../../../shared/components/Loader/Loader";
import {
  getExpertCurrentPlanApi,
  getActiveMembershipPlansApi,
  createExpertPlanOrderApi,
  verifyExpertPlanPaymentApi
} from "../../../../shared/api/expertapi/expertMembershipPlan.api";

const GuidexaExpertPlan = () => {
  const { expertData } = useExpert();
  const [currentPlan, setCurrentPlan] = useState(null);
  const [allPlans, setAllPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasActivePlan, setHasActivePlan] = useState(false);
  const [purchasing, setPurchasing] = useState(null);
  const [activeTab, setActiveTab] = useState(1);
  const [isSdkReady, setIsSdkReady] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const tabsRef = useRef(null);
  const stickyPlaceholderRef = useRef(null);

  const expertId = expertData?.expertId || 132;

  // Load Razorpay SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => {
      setIsSdkReady(true);
    };

    document.body.appendChild(script);
  }, []);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Sticky tabs logic - only for desktop
  useEffect(() => {
    const handleScroll = () => {
      if (isSmallScreen) {
        setIsSticky(false);
        return;
      }
      
      if (tabsRef.current) {
        const rect = tabsRef.current.getBoundingClientRect();
        const shouldSticky = rect.top <= 80;
        setIsSticky(shouldSticky);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isSmallScreen]);

  // Feature mapping for different plan types
  const getPlanFeatures = (planName, durationYears) => {
    const baseFeatures = [
      { name: "Expert Profile Listing", icon: "👤" },
      { name: "Service Selling", icon: "💼" },
      { name: "Basic Leads Access", icon: "📊" },
      { name: "Profile Ownership", icon: "🔐" },
      { name: "Standard Support", icon: "💬" }
    ];

    const premiumFeatures = [
      { name: "Expert Profile Listing", icon: "👤" },
      { name: "Service Selling", icon: "💼" },
      { name: "Premium Leads", icon: "⭐" },
      { name: "Profile Ownership", icon: "🔐" },
      { name: "Premium Customer Support", icon: "🎯" },
      { name: "Trust Stamp", icon: "✅" },
      { name: "Verified Seal", icon: "🛡️" },
      { name: "Higher Visibility", icon: "📈" },
      { name: "Priority Onboarding", icon: "🚀" }
    ];

    const planNameLower = planName?.toLowerCase() || "";
    
    if (planNameLower.includes("premium") || 
        planNameLower.includes("advanced") || 
        planNameLower.includes("gold") ||
        planNameLower.includes("pro")) {
      return premiumFeatures;
    }
    
    return baseFeatures;
  };

  // Get original price per year based on plan type
  const getOriginalPricePerYear = (planName) => {
    const planNameLower = planName?.toLowerCase() || "";
    
    if (planNameLower.includes("standard") || planNameLower.includes("basic")) {
      return 9999;
    } else if (planNameLower.includes("advanced") || 
               planNameLower.includes("premium") || 
               planNameLower.includes("pro") ||
               planNameLower.includes("gold")) {
      return 14999;
    }
    return planNameLower.includes("standard") ? 9999 : 14999;
  };

  // Calculate discount with progressive savings
  const calculateDiscount = (plan) => {
    if (!plan) return { 
      discount: 0, 
      discountedPrice: 0, 
      savedAmount: 0, 
      originalPrice: 0, 
      monthlyCost: 0,
      discountPercent: 0,
      originalTotal: 0,
      yearlySavings: 0,
      savingsPerMonth: 0,
      savingsIncrease: 0,
      previousYearSavings: 0
    };
    
    const originalPricePerYear = getOriginalPricePerYear(plan.plan_name);
    const originalTotal = originalPricePerYear * plan.duration_years;
    
    let discountedPrice = plan.amount;
    
    const totalSaved = originalTotal - discountedPrice;
    const discountPercent = Math.round((totalSaved / originalTotal) * 100);
    
    const yearlySavings = Math.round(totalSaved / plan.duration_years);
    const savingsPerMonth = Math.round(yearlySavings / 12);
    
    let previousYearSavings = 0;
    if (plan.duration_years > 1) {
      const previousYears = plan.duration_years - 1;
      const previousOriginalTotal = originalPricePerYear * previousYears;
      const estimatedPreviousDiscounted = (discountedPrice / plan.duration_years) * previousYears;
      const previousSaved = previousOriginalTotal - estimatedPreviousDiscounted;
      previousYearSavings = Math.round(previousSaved);
    }
    
    const monthlyCost = Math.round(discountedPrice / (plan.duration_years * 12));
    
    return {
      originalPrice: originalPricePerYear,
      originalTotal: Math.round(originalTotal),
      discountedPrice: Math.round(discountedPrice),
      savedAmount: Math.round(totalSaved),
      discount: 0,
      discountPercent: discountPercent,
      monthlyCost: monthlyCost,
      yearlySavings: yearlySavings,
      savingsPerMonth: savingsPerMonth,
      savingsIncrease: Math.round(totalSaved - (previousYearSavings || 0)),
      previousYearSavings: previousYearSavings
    };
  };

  // Get plan recommendation
  const getPlanRecommendation = (plans) => {
    if (!plans || plans.length === 0) return null;
    
    const plansWithDiscount = plans.map(plan => ({
      ...plan,
      discountInfo: calculateDiscount(plan)
    }));
    
    const sortedByDiscount = [...plansWithDiscount].sort((a, b) => 
      b.discountInfo.discountPercent - a.discountInfo.discountPercent
    );
    
    const premiumPlan = plansWithDiscount.find(p => 
      p.plan_name.toLowerCase().includes('advanced') ||
      p.plan_name.toLowerCase().includes('premium') ||
      p.plan_name.toLowerCase().includes('pro')
    );
     
    const bestValuePlan = sortedByDiscount[0];
    
    return {
      bestValue: bestValuePlan,
      recommended: premiumPlan || bestValuePlan,
      popular: plansWithDiscount.find(p => p.duration_years === 1) || plansWithDiscount[0]
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        try {
          const currentPlanRes = await getExpertCurrentPlanApi(expertId);
          if (currentPlanRes?.data?.success && currentPlanRes?.data?.data) {
            setCurrentPlan(currentPlanRes.data.data);
            setHasActivePlan(true);
          } else {
            setCurrentPlan(null);
            setHasActivePlan(false);
          }
        } catch (err) {
          console.log("No active plan found for expert");
          setCurrentPlan(null);
          setHasActivePlan(false);
        }

        try {
          const plansRes = await getActiveMembershipPlansApi();
          if (plansRes?.data?.success && plansRes?.data?.data) {
            setAllPlans(plansRes.data.data || []);
          } else {
            setAllPlans([]);
          }
        } catch (err) {
          console.error("Error fetching plans:", err);
          setError("Unable to fetch available plans. Please try again.");
        }

      } catch (err) {
        setError("Unable to connect to the server. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    if (expertId) fetchData();
  }, [expertId]);

  const handlePurchase = async (planId) => {
    try {
      if (!window.Razorpay || !isSdkReady) {
        alert("Razorpay is loading, please wait...");
        return;
      }

      setPurchasing(planId);

      const response = await createExpertPlanOrderApi({
        plan_id: planId
      });

      const order = response.data;

      const options = {
        key: order.key_id,
        amount: Math.round(order.amount * 100),
        currency: "INR",
        order_id: order.order_id,
        name: "G9 Expert",
        description: "Expert Membership",
        prefill: {
          name: expertData?.name || "",
          email: expertData?.email || "",
          contact: expertData?.phone || ""
        },
        theme: {
          color: "#0a1628"
        },
        handler: async function (payment) {
          try {
            const verify = await verifyExpertPlanPaymentApi({
              razorpay_payment_id: payment.razorpay_payment_id,
              razorpay_order_id: payment.razorpay_order_id,
              razorpay_signature: payment.razorpay_signature
            });

            if (verify.data.success) {
              alert("Payment Successful");
              window.location.reload();
            }
          } catch (err) {
            alert(
              err.response?.data?.message ||
              "Payment verification failed"
            );
          }
        },
        modal: {
          ondismiss() {
            setPurchasing(null);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.log(err);
      alert(
        err.response?.data?.message ||
        "Unable to create order"
      );
    } finally {
      setPurchasing(null);
    }
  };

  const isPlanActive = () => {
    if (!currentPlan?.expiry_date) return currentPlan?.plan_status === 1;
    return new Date(currentPlan.expiry_date) > new Date();
  };

  // Group plans by duration
  const getPlansByDuration = () => {
    const grouped = {};
    allPlans.forEach(plan => {
      const key = plan.duration_years;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(plan);
    });
    return grouped;
  };

  // Get unique duration years sorted
  const getDurationYears = () => {
    const years = [...new Set(allPlans.map(plan => plan.duration_years))];
    return years.sort((a, b) => a - b);
  };

  if (loading) return <Loader />;

  const plansByDuration = getPlansByDuration();
  const durationYears = getDurationYears();
  const recommendation = getPlanRecommendation(allPlans);

  // Show error if no plans available
  if (!loading && allPlans.length === 0 && !error) {
    return (
      <div className="g9-expert-plan-container">
        <style>{`
          .g9-expert-plan-container {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            padding: 24px;
            max-width: 800px;
            margin: 0 auto;
            background: #f0f4f8;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .no-plans-card {
            background: white;
            border-radius: 20px;
            padding: 48px;
            text-align: center;
            box-shadow: 0 4px 20px rgba(0,0,0,0.06);
            border: 1px solid #e8edf4;
          }
          .no-plans-card .icon {
            font-size: 64px;
            margin-bottom: 16px;
          }
          .no-plans-card h2 {
            font-size: 24px;
            font-weight: 700;
            color: #0a1628;
            margin-bottom: 8px;
          }
          .no-plans-card p {
            color: #64748b;
            font-size: 16px;
            margin-bottom: 24px;
          }
        `}</style>
        <div className="no-plans-card">
          <div className="icon">📋</div>
          <h2>No Plans Available</h2>
          <p>There are no active membership plans available at the moment. Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="g9-expert-plan-container">
      <style>{`
        /* ===== RESET & BASE ===== */
        .g9-expert-plan-container * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .g9-expert-plan-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          padding: 32px;
          max-width: 1400px;
          margin: 0 auto;
          background: #f0f4f8;
          min-height: 100vh;
        }

        /* ===== HEADER ===== */
        .plan-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .plan-header-left h1 {
          font-size: 32px;
          font-weight: 800;
          color: #0a1628;
          margin: 0;
          letter-spacing: -0.5px;
        }

        .plan-header-left .subtitle {
          color: #64748b;
          font-size: 15px;
          margin-top: 4px;
        }

        .plan-header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .plan-header-right .badge {
          padding: 8px 20px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 600;
        }

        .badge-active {
          background: #dcfce7;
          color: #16a34a;
        }

        .badge-inactive {
          background: #fef3c7;
          color: #92400e;
        }

        /* ===== NO PLAN BANNER ===== */
        .no-plan-banner {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border: 2px solid #f59e0b;
          border-radius: 16px;
          padding: 24px 32px;
          margin-bottom: 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .no-plan-banner .banner-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .no-plan-banner .banner-icon {
          font-size: 32px;
        }

        .no-plan-banner .banner-text h3 {
          font-size: 18px;
          font-weight: 700;
          color: #92400e;
          margin: 0;
        }

        .no-plan-banner .banner-text p {
          color: #78350f;
          margin: 4px 0 0 0;
          font-size: 14px;
        }

        /* ===== RECOMMENDATION CARDS ===== */
        .recommendation-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .rec-card {
          background: white;
          border-radius: 12px;
          padding: 16px 20px;
          border: 1px solid #e8edf4;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.2s ease;
        }

        .rec-card:hover {
          border-color: #0a1628;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .rec-card .rec-icon {
          font-size: 28px;
        }

        .rec-card .rec-content {
          flex: 1;
        }

        .rec-card .rec-content .rec-label {
          font-size: 11px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .rec-card .rec-content .rec-value {
          font-size: 15px;
          font-weight: 600;
          color: #0a1628;
        }

        .rec-card .rec-content .rec-desc {
          font-size: 13px;
          color: #64748b;
        }

        /* ===== CURRENT PLAN CARD ===== */
        .current-plan-wrapper {
          margin-bottom: 48px;
        }

        .current-plan-card {
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          border: 1px solid #e8edf4;
        }

        .current-plan-card .plan-hero {
          background: linear-gradient(135deg, #0a1628 0%, #1a2a4a 100%);
          padding: 32px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .current-plan-card .plan-hero .hero-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .current-plan-card .plan-hero .plan-icon {
          width: 56px;
          height: 56px;
          background: rgba(255,255,255,0.1);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
        }

        .current-plan-card .plan-hero .plan-title {
          color: white;
          font-size: 22px;
          font-weight: 700;
          margin: 0;
        }

        .current-plan-card .plan-hero .plan-subtitle {
          color: #94a3b8;
          font-size: 14px;
          margin: 2px 0 0 0;
        }

        .current-plan-card .plan-hero .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 600;
        }

        .status-badge.active {
          background: #10b981;
          color: white;
        }

        .status-badge.active::before {
          content: "●";
          animation: pulse-dot 2s infinite;
        }

        .status-badge.expired {
          background: #ef4444;
          color: white;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .current-plan-card .plan-body {
          padding: 32px 40px;
        }

        .current-plan-card .plan-body .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 20px 32px;
          margin-bottom: 24px;
        }

        .current-plan-card .plan-body .detail-item {
          display: flex;
          flex-direction: column;
        }

        .current-plan-card .plan-body .detail-item .label {
          font-size: 11px;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .current-plan-card .plan-body .detail-item .value {
          font-size: 15px;
          font-weight: 600;
          color: #0a1628;
        }

        .current-plan-card .plan-body .detail-item .value .payment-id {
          font-family: 'Courier New', monospace;
          background: #f1f5f9;
          padding: 2px 10px;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 500;
        }

        /* Features in current plan */
        .current-plan-card .plan-body .features-wrap {
          padding-top: 24px;
          border-top: 1px solid #e8edf4;
          margin-bottom: 24px;
        }

        .current-plan-card .plan-body .features-wrap .features-title {
          font-size: 14px;
          font-weight: 600;
          color: #0a1628;
          margin-bottom: 12px;
        }

        .current-plan-card .plan-body .features-wrap .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 6px 12px;
        }

        .current-plan-card .plan-body .features-wrap .feature-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #334155;
          padding: 4px 0;
        }

        .current-plan-card .plan-body .features-wrap .feature-item .fi {
          font-size: 16px;
        }

        /* Billing */
        .current-plan-card .plan-body .billing-box {
          background: #f8fafc;
          border-radius: 12px;
          padding: 16px 24px;
          border: 1px solid #e8edf4;
        }

        .current-plan-card .plan-body .billing-box .bill-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          font-size: 14px;
          color: #475569;
        }

        .current-plan-card .plan-body .billing-box .bill-row.total {
          border-top: 2px solid #e2e8f0;
          margin-top: 6px;
          padding-top: 14px;
          font-size: 17px;
          font-weight: 700;
          color: #0a1628;
        }

        .current-plan-card .plan-body .billing-box .bill-row .discount-tag {
          color: #10b981;
          font-weight: 600;
        }

        /* ===== STICKY TABS ===== */
        .tabs-sticky-placeholder {
          height: 0;
          transition: height 0.3s ease;
        }

        .tabs-sticky-placeholder.active {
          height: 82px;
        }

        .tabs-wrapper {
          margin-top: 8px;
          transition: all 0.3s ease;
        }

        .tabs-wrapper.sticky {
          position: fixed;
          top: 80px;
          left: 0;
          right: 0;
          z-index: 1000;
          background: #f0f4f8;
          padding: 12px 32px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          animation: slideDown 0.3s ease;
          max-width: 100%;
        }

        .tabs-wrapper.sticky .tabs-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .tabs-wrapper.sticky .tabs-header {
          display: none;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .tabs-wrapper .tabs-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .tabs-wrapper .tabs-header .tabs-title {
          font-size: 24px;
          font-weight: 700;
          color: #0a1628;
        }

        .tabs-wrapper .tabs-header .tabs-subtitle {
          color: #64748b;
          font-size: 14px;
        }

        .tabs-container {
          display: flex;
          gap: 8px;
          margin-bottom: 28px;
          flex-wrap: wrap;
          background: white;
          padding: 6px;
          border-radius: 16px;
          border: 1px solid #e8edf4;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .tabs-container::-webkit-scrollbar {
          height: 4px;
        }

        .tabs-container::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }

        .tabs-container::-webkit-scrollbar-thumb {
          background: #94a3b8;
          border-radius: 4px;
        }

        .tab-btn {
          padding: 12px 28px;
          border-radius: 12px;
          border: none;
          background: transparent;
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          transition: all 0.3s ease;
          flex: 1;
          min-width: 120px;
          text-align: center;
          position: relative;
          white-space: nowrap;
        }

        .tab-btn:hover {
          background: #f1f5f9;
          color: #0a1628;
        }

        .tab-btn.active {
          background: #0a1628;
          color: white;
          box-shadow: 0 4px 16px rgba(10, 22, 40, 0.15);
        }

        .tab-btn .tab-badge {
          display: block;
          font-size: 11px;
          font-weight: 400;
          opacity: 0.7;
          margin-top: 2px;
        }

        .tab-btn.active .tab-badge {
          opacity: 0.8;
        }

        .tab-btn .tab-savings {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: #10b981;
          margin-top: 2px;
        }

        .tab-btn.active .tab-savings {
          color: #a7f3d0;
        }

        /* ===== PLAN CARDS GRID ===== */
        .plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          gap: 24px;
        }

        /* When expert has active plan - show 2 cards side by side on big screens */
        .plans-grid.has-plan {
          grid-template-columns: repeat(2, 1fr);
        }

        @media (max-width: 1024px) {
          .plans-grid.has-plan {
            grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          }
        }

        .plan-card {
          background: white;
          border-radius: 20px;
          padding: 28px;
          border: 1px solid #e8edf4;
          transition: all 0.3s ease;
          position: relative;
        }

        .plan-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.08);
          border-color: #0a1628;
        }

        .plan-card.recommended {
          border-color: #f59e0b;
          border-width: 2px;
        }

        .plan-card .card-badge {
          position: absolute;
          top: -10px;
          right: 20px;
          padding: 4px 16px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .card-badge.popular {
          background: #f59e0b;
          color: white;
        }

        .card-badge.best-value {
          background: #10b981;
          color: white;
        }

        .card-badge.current {
          background: #0a1628;
          color: white;
        }

        .card-badge.most-savings {
          background: #8b5cf6;
          color: white;
        }

        .plan-card .plan-name {
          font-size: 22px;
          font-weight: 700;
          color: #0a1628;
          margin-bottom: 2px;
          text-transform: capitalize;
        }

        .plan-card .plan-duration {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 16px;
        }

        /* Original Price Banner */
        .plan-card .original-banner {
          background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
          border: 1px solid #fca5a5;
          border-radius: 12px;
          padding: 12px 16px;
          margin-bottom: 16px;
        }

        .plan-card .original-banner .orig-label {
          font-size: 12px;
          color: #991b1b;
          font-weight: 600;
        }

        .plan-card .original-banner .orig-amount {
          font-size: 20px;
          font-weight: 700;
          color: #991b1b;
          text-decoration: line-through;
        }

        .plan-card .original-banner .save-highlight {
          font-size: 14px;
          color: #16a34a;
          font-weight: 700;
          margin-top: 4px;
        }

        .plan-card .original-banner .save-highlight .save-amount {
          font-size: 18px;
        }

        .plan-card .pricing-row {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 4px;
        }

        .plan-card .pricing-row .price-current {
          font-size: 32px;
          font-weight: 800;
          color: #0a1628;
        }

        .plan-card .pricing-row .price-label {
          font-size: 14px;
          color: #64748b;
        }

        .plan-card .discount-tag {
          display: inline-block;
          background: #dcfce7;
          color: #16a34a;
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .plan-card .offer-text {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border-radius: 8px;
          padding: 10px 14px;
          margin: 8px 0 12px 0;
          font-size: 13px;
          font-weight: 600;
          color: #92400e;
          text-align: center;
        }

        .plan-card .offer-text .hl {
          color: #dc2626;
          font-weight: 800;
        }

        .plan-card .savings-compare {
          background: #f0fdf4;
          border: 1px solid #86efac;
          border-radius: 8px;
          padding: 10px 14px;
          margin: 8px 0 12px 0;
          font-size: 13px;
          color: #166534;
          text-align: center;
        }

        .plan-card .savings-compare .inc {
          color: #dc2626;
          font-weight: 800;
          font-size: 15px;
        }

        .plan-card .monthly-cost {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 20px;
          padding: 8px 14px;
          background: #f8fafc;
          border-radius: 8px;
          display: inline-block;
        }

        .plan-card .monthly-cost strong {
          color: #0a1628;
        }

        .plan-card .features-list {
          list-style: none;
          padding: 0;
          margin: 0 0 24px 0;
        }

        .plan-card .features-list li {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 5px 0;
          font-size: 14px;
          color: #334155;
        }

        .plan-card .features-list li .fi {
          font-size: 16px;
        }

        .plan-card .btn-primary {
          width: 100%;
          padding: 14px;
          background: #0a1628;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .plan-card .btn-primary:hover:not(:disabled) {
          background: #1a2a4a;
          transform: scale(1.01);
        }

        .plan-card .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .plan-card .btn-current {
          width: 100%;
          padding: 14px;
          background: #f1f5f9;
          color: #64748b;
          border: 2px solid #e8edf4;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: default;
        }

        .btn-primary .btn-save {
          font-size: 12px;
          opacity: 0.8;
          margin-left: 4px;
        }

        /* Limited Time Badge */
        .limited-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #dc2626;
          color: white;
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          animation: pulse-badge 2s infinite;
        }

        @keyframes pulse-badge {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .g9-expert-plan-container {
            padding: 24px;
          }

          .tabs-wrapper.sticky {
            padding: 12px 24px;
          }
        }

        @media (max-width: 768px) {
          .g9-expert-plan-container {
            padding: 16px;
          }

          .plan-header h1 {
            font-size: 26px;
          }

          .current-plan-card .plan-hero {
            padding: 24px;
            flex-direction: column;
            align-items: flex-start;
          }

          .current-plan-card .plan-body {
            padding: 24px;
          }

          .current-plan-card .plan-body .details-grid {
            grid-template-columns: 1fr 1fr;
            gap: 14px;
          }

          .current-plan-card .plan-body .features-wrap .features-grid {
            grid-template-columns: 1fr 1fr;
          }

          .plans-grid {
            grid-template-columns: 1fr !important;
          }

          .tabs-container {
            flex-wrap: nowrap;
            overflow-x: auto;
            padding: 6px;
            gap: 6px;
            border-radius: 12px;
          }

          .tab-btn {
            min-width: 100px;
            padding: 10px 16px;
            font-size: 13px;
            flex: 0 0 auto;
          }

          .tab-btn .tab-badge {
            font-size: 10px;
          }

          .tab-btn .tab-savings {
            font-size: 10px;
          }

          .recommendation-section {
            grid-template-columns: 1fr;
          }

          .no-plan-banner {
            padding: 16px 20px;
            flex-direction: column;
            align-items: flex-start;
          }

          /* Disable sticky on mobile */
          .tabs-wrapper.sticky {
            position: relative !important;
            top: auto !important;
            padding: 0 !important;
            box-shadow: none !important;
            animation: none !important;
            background: transparent !important;
          }

          .tabs-wrapper.sticky .tabs-header {
            display: flex !important;
          }

          .tabs-sticky-placeholder.active {
            height: 0 !important;
          }
        }

        @media (max-width: 480px) {
          .g9-expert-plan-container {
            padding: 12px;
          }

          .plan-header h1 {
            font-size: 22px;
          }

          .current-plan-card .plan-hero .plan-title {
            font-size: 18px;
          }

          .current-plan-card .plan-body .details-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .current-plan-card .plan-body .features-wrap .features-grid {
            grid-template-columns: 1fr;
          }

          .current-plan-card .plan-body {
            padding: 16px;
          }

          .plan-card {
            padding: 20px;
          }

          .plan-card .pricing-row .price-current {
            font-size: 28px;
          }

          .plan-card .original-banner .orig-amount {
            font-size: 18px;
          }

          .current-plan-card .plan-body .billing-box {
            padding: 14px 16px;
          }

          .tab-btn {
            min-width: 80px;
            padding: 8px 14px;
            font-size: 12px;
          }
        }

        /* Desktop only sticky */
        @media (min-width: 769px) {
          .tabs-wrapper.sticky {
            position: fixed;
            top: 80px;
            left: 0;
            right: 0;
            z-index: 1000;
            background: #f0f4f8;
            padding: 12px 32px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            animation: slideDown 0.3s ease;
            max-width: 100%;
          }

          .tabs-wrapper.sticky .tabs-container {
            max-width: 1400px;
            margin: 0 auto;
          }

          .tabs-wrapper.sticky .tabs-header {
            display: none;
          }

          .tabs-sticky-placeholder.active {
            height: 82px;
          }
        }
      `}</style>

      {/* ===== HEADER ===== */}
      <div className="plan-header">
        <div className="plan-header-left">
          <h1>{hasActivePlan ? 'My Subscription Plan' : 'Choose Your Plan'}</h1>
          <div className="subtitle">
            {hasActivePlan 
              ? 'Manage your G9 Expert membership' 
              : 'Select the perfect plan to grow your expert business'}
          </div>
        </div>
        {hasActivePlan && currentPlan && (
          <div className="plan-header-right">
            <span className={`badge ${isPlanActive() ? 'badge-active' : 'badge-inactive'}`}>
              {isPlanActive() ? '● Active' : '● Expired'}
            </span>
          </div>
        )}
      </div>

      {/* ===== NO PLAN BANNER ===== */}
      {!hasActivePlan && (
        <div className="no-plan-banner">
          <div className="banner-content">
            <div className="banner-icon">🚀</div>
            <div className="banner-text">
              <h3>Get Started with G9 Expert</h3>
              <p>Choose a plan that fits your needs and start growing your expert business today!</p>
            </div>
          </div>
          <div>
            <span style={{ fontWeight: '600', color: '#92400e' }}>
              ✨ Higher savings on multi-year plans
            </span>
          </div>
        </div>
      )}

      {/* ===== RECOMMENDATIONS ===== */}
      {!hasActivePlan && recommendation && allPlans.length > 0 && (
        <div className="recommendation-section">
          <div className="rec-card">
            <div className="rec-icon">🏆</div>
            <div className="rec-content">
              <div className="rec-label">Best Value</div>
              <div className="rec-value">{recommendation.bestValue?.plan_name} - {recommendation.bestValue?.duration_years}Y</div>
              <div className="rec-desc">Save {recommendation.bestValue?.discountInfo?.discountPercent}%</div>
            </div>
          </div>
          <div className="rec-card">
            <div className="rec-icon">⭐</div>
            <div className="rec-content">
              <div className="rec-label">Most Popular</div>
              <div className="rec-value">{recommendation.popular?.plan_name} - {recommendation.popular?.duration_years}Y</div>
              <div className="rec-desc">Perfect for most experts</div>
            </div>
          </div>
          <div className="rec-card">
            <div className="rec-icon">💎</div>
            <div className="rec-content">
              <div className="rec-label">Premium Choice</div>
              <div className="rec-value">{recommendation.recommended?.plan_name}</div>
              <div className="rec-desc">Maximum features & visibility</div>
            </div>
          </div>
        </div>
      )}

      {/* ===== CURRENT PLAN ===== */}
      {hasActivePlan && currentPlan && isPlanActive() && (
        <div className="current-plan-wrapper">
          <div className="current-plan-card">
            <div className="plan-hero">
              <div className="hero-left">
                <div className="plan-icon">📋</div>
                <div>
                  <h2 className="plan-title">{currentPlan.plan_name}</h2>
                  <p className="plan-subtitle">
                    {currentPlan.duration_years} Year{currentPlan.duration_years > 1 ? 's' : ''} Plan
                  </p>
                </div>
              </div>
              <span className={`status-badge ${isPlanActive() ? 'active' : 'expired'}`}>
                {isPlanActive() ? 'Active' : 'Expired'}
              </span>
            </div>

            <div className="plan-body">
              <div className="details-grid">
                <div className="detail-item">
                  <span className="label">Expert ID</span>
                  <span className="value">#{currentPlan.expert_id}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Plan</span>
                  <span className="value" style={{ textTransform: 'capitalize' }}>
                    {currentPlan.plan_name}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Start Date</span>
                  <span className="value">
                    {new Date(currentPlan.start_date).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Expiry Date</span>
                  <span className="value">
                    {new Date(currentPlan.expiry_date).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Payment ID</span>
                  <span className="value">
                    <span className="payment-id">{currentPlan.razorpay_payment_id || 'N/A'}</span>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Validity</span>
                  <span className="value">{currentPlan.duration_years} Year</span>
                </div>
              </div>

              {/* Features */}
              <div className="features-wrap">
                <div className="features-title">✨ Plan Features</div>
                <div className="features-grid">
                  {getPlanFeatures(currentPlan.plan_name, currentPlan.duration_years).map((feature, idx) => (
                    <div key={idx} className="feature-item">
                      <span className="fi">{feature.icon}</span>
                      {feature.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Billing */}
              <div className="billing-box">
                <div className="bill-row">
                  <span>Plan Amount</span>
                  <span>₹{currentPlan.base_amount || currentPlan.amount || 0}</span>
                </div>
                <div className="bill-row">
                  <span>GST (18%)</span>
                  <span>₹{currentPlan.gst_amount || 0}</span>
                </div>
                {currentPlan.duration_years > 1 && (
                  <div className="bill-row">
                    <span>Bulk Discount</span>
                    <span className="discount-tag">-{currentPlan.duration_years === 2 ? '10' : '18'}%</span>
                  </div>
                )}
                <div className="bill-row total">
                  <span>Total Paid</span>
                  <span>₹{currentPlan.total_paid || currentPlan.amount || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== ALL PLANS ===== */}
      {allPlans.length > 0 && (
        <>
          {/* Sticky Placeholder */}
          <div 
            ref={stickyPlaceholderRef} 
            className={`tabs-sticky-placeholder ${isSticky ? 'active' : ''}`}
          />

          <div 
            ref={tabsRef} 
            className={`tabs-wrapper ${isSticky ? 'sticky' : ''}`}
          >
            <div className="tabs-header">
              <div>
                <h3 className="tabs-title">{hasActivePlan ? '🚀 Upgrade Your Plan' : '📋 Available Plans'}</h3>
                <div className="tabs-subtitle">
                  {hasActivePlan 
                    ? 'Choose a higher plan to unlock more features' 
                    : 'Select a plan to start your journey with G9 Expert'}
                </div>
              </div>
            </div>

            {/* Tabs - Scrollable on mobile */}
            <div className="tabs-container">
              {durationYears.map((years) => {
                const plansForYear = plansByDuration[years] || [];
                let maxSavings = 0;
                plansForYear.forEach(plan => {
                  const info = calculateDiscount(plan);
                  if (info.savedAmount > maxSavings) maxSavings = info.savedAmount;
                });

                return (
                  <button
                    key={years}
                    className={`tab-btn ${activeTab === years ? 'active' : ''}`}
                    onClick={() => setActiveTab(years)}
                  >
                    {years} Year{years > 1 ? 's' : ''}
                    <span className="tab-badge">
                      {plansForYear.length} plan{plansForYear.length > 1 ? 's' : ''}
                    </span>
                    {maxSavings > 0 && (
                      <span className="tab-savings">
                        Save ₹{maxSavings.toLocaleString()}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Plans Grid - 2 columns when expert has plan */}
            <div className={`plans-grid ${hasActivePlan ? 'has-plan' : ''}`}>
              {(plansByDuration[activeTab] || []).map((plan) => {
                const isCurrentPlan = currentPlan && 
                  plan.plan_name === currentPlan.plan_name && 
                  plan.duration_years === currentPlan.duration_years;
                
                const discountInfo = calculateDiscount(plan);
                const features = getPlanFeatures(plan.plan_name, plan.duration_years);
                const isBestValue = recommendation?.bestValue?.id === plan.id;
                const isPopular = recommendation?.popular?.id === plan.id;
                
                const plansForYear = plansByDuration[activeTab] || [];
                let maxSavingsInYear = 0;
                plansForYear.forEach(p => {
                  const info = calculateDiscount(p);
                  if (info.savedAmount > maxSavingsInYear) maxSavingsInYear = info.savedAmount;
                });
                const hasMostSavings = discountInfo.savedAmount === maxSavingsInYear && maxSavingsInYear > 0;
                
                const planTypeLabel = plan.plan_name.toLowerCase().includes('advanced') ? 'Premium' : 'Standard';

                return (
                  <div key={plan.id} className={`plan-card ${(isBestValue && !isCurrentPlan) || (hasMostSavings && !isCurrentPlan) ? 'recommended' : ''}`}>
                    {isCurrentPlan && (
                      <div className="card-badge current">✓ Current</div>
                    )}
                    {!isCurrentPlan && isBestValue && (
                      <div className="card-badge best-value">Best Value</div>
                    )}
                    {!isCurrentPlan && isPopular && !isBestValue && (
                      <div className="card-badge popular">Popular</div>
                    )}
                    {!isCurrentPlan && hasMostSavings && !isBestValue && !isPopular && (
                      <div className="card-badge most-savings">Max Savings</div>
                    )}
                    
                    <div className="plan-name">{plan.plan_name}</div>
                    <div className="plan-duration">
                      {plan.duration_years} Year{plan.duration_years > 1 ? 's' : ''} Plan
                      {!isCurrentPlan && (
                        <span className="limited-badge" style={{ marginLeft: '10px' }}>
                          ⏰ Limited Time
                        </span>
                      )}
                    </div>

                    {/* Original Price Banner */}
                    {!isCurrentPlan && (
                      <div className="original-banner">
                        <div className="orig-label">💰 Original Price</div>
                        <div className="orig-amount">₹{discountInfo.originalTotal.toLocaleString()}</div>
                        <div className="save-highlight">
                          🎉 You Save <span className="save-amount">₹{discountInfo.savedAmount.toLocaleString()}</span> 
                          ({discountInfo.discountPercent}% OFF)
                        </div>
                      </div>
                    )}
                    
                    <div className="pricing-row">
                      <span className="price-current">₹{discountInfo.discountedPrice.toLocaleString()}</span>
                      <span className="price-label">/{plan.duration_years} Year{plan.duration_years > 1 ? 's' : ''}</span>
                    </div>

                    {/* Progressive Savings */}
                    {!isCurrentPlan && plan.duration_years > 1 && discountInfo.savingsIncrease > 0 && (
                      <div className="savings-compare">
                        📈 <strong>₹{discountInfo.yearlySavings.toLocaleString()}</strong> saved per year • 
                        <span className="inc"> +₹{discountInfo.savingsIncrease.toLocaleString()}</span> more than {plan.duration_years - 1}-year plan
                      </div>
                    )}

                    {!isCurrentPlan && plan.duration_years === 1 && (
                      <div className="offer-text">
                        ⚡ <span className="hl">₹{discountInfo.savedAmount.toLocaleString()}</span> savings on 
                        {planTypeLabel} Plan • Limited period offer
                      </div>
                    )}

                    {!isCurrentPlan && plan.duration_years > 1 && (
                      <div className="offer-text">
                        ⚡ <span className="hl">₹{discountInfo.savedAmount.toLocaleString()}</span> total savings • 
                        <span className="hl"> ₹{discountInfo.yearlySavings.toLocaleString()}</span>/year
                      </div>
                    )}
                    
                    <div className="monthly-cost">
                      Just <strong>₹{discountInfo.monthlyCost}</strong>/month • 
                      Save <strong>₹{discountInfo.savingsPerMonth}</strong> monthly
                    </div>

                    <ul className="features-list">
                      {features.map((feature, idx) => (
                        <li key={idx}>
                          <span className="fi">{feature.icon}</span>
                          {feature.name}
                        </li>
                      ))}
                    </ul>

                    {isCurrentPlan ? (
                      <button className="btn-current" disabled>
                        ✓ Current Plan
                      </button>
                    ) : (
                      <button 
                        className="btn-primary"
                        onClick={() => handlePurchase(plan.id)}
                        disabled={purchasing === plan.id}
                      >
                        {purchasing === plan.id ? 'Processing...' : (
                          <>
                            {hasActivePlan ? 'Upgrade Now' : 'Get Started'} 
                            <span className="btn-save">
                              (Save ₹{discountInfo.savedAmount.toLocaleString()})
                            </span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* No plans message */}
            {(plansByDuration[activeTab] || []).length === 0 && (
              <div style={{ 
                textAlign: 'center', 
                padding: '48px', 
                background: 'white', 
                borderRadius: '16px',
                border: '1px solid #e8edf4'
              }}>
                <p style={{ color: '#64748b' }}>No plans available for {activeTab} year{activeTab > 1 ? 's' : ''}.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* ===== ERROR ===== */}
      {error && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#64748b',
          background: 'white',
          borderRadius: '16px',
          marginTop: '24px',
          border: '1px solid #fee2e2'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>⚠️</div>
          <p style={{ color: '#dc2626' }}>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '16px',
              padding: '10px 24px',
              background: '#0a1628',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default GuidexaExpertPlan;