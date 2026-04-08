import React, { useRef, useEffect, useState, useMemo } from "react";
import { usePublicExpert as useExpert } from "../../context/PublicExpertContext";
import { getTopRatedExpertsApi } from "../../../../shared/api/expertapi/filter.api";
import { getExpertPriceByIdApi } from "../../../../shared/api/expertapi/price.api";
import { getPlansApi } from "../../../../shared/api/userApi/subscription.api";
import { useNavigate } from "react-router-dom";
import useChatRequest from "../../../../shared/hooks/useChatRequest.jsx";

export default function Experts() {
  const scrollContainerRef = useRef(null);
  const { experts, expertsLoading } = useExpert();
  const navigate = useNavigate();
  const { startChat, ChatPopups } = useChatRequest();

  const [topIds, setTopIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expertPricing, setExpertPricing] = useState({});

  /* ================= FETCH TOP RATED ================= */
  useEffect(() => {
    const loadTopRated = async () => {
      try {
        setLoading(true);
        const res = await getTopRatedExpertsApi(50);
        const ids = res?.data?.data?.map((e) => e.expert_id || e.id) || [];
        setTopIds(ids);
      } catch (err) {
        console.error("Top rated load failed", err);
      } finally {
        setLoading(false);
      }
    };
    loadTopRated();
  }, []);

  /* ================= FILTER FROM CONTEXT ================= */
  const topExperts = useMemo(() => {
    if (!experts?.length) return [];
    return experts.filter((e) => topIds.includes(e.id));
  }, [experts, topIds]);

  /* ================= FETCH PRICING & PLANS ================= */
  useEffect(() => {
    const loadExpertPricing = async () => {
      const pricingMap = {};

      for (let ex of topExperts) {
        try {
          // Fetch price data
          const priceRes = await getExpertPriceByIdApi(ex.id);
          const priceData = priceRes?.data?.data || priceRes?.data || {};

          // Fetch subscription plans
          let hasPlans = false;
          try {
            const plansRes = await getPlansApi(ex.id);
            hasPlans = plansRes?.data?.success && plansRes?.data?.data?.length > 0;
          } catch {
            hasPlans = false;
          }

          // Determine pricing modes
          const pricingModes = priceData.pricing_modes || [];
          const hasPerMinute = pricingModes.includes('per_minute');
          const hasSession = pricingModes.includes('session');
          
          // Get prices
          const callPrice = priceData.call?.per_minute || priceData.call_per_minute || 0;
          const chatPrice = priceData.chat?.per_minute || priceData.chat_per_minute || 0;
          const sessionPrice = priceData.session?.price || priceData.session_price || 0;
          const sessionDuration = priceData.session?.duration || priceData.session_duration || 0;

          pricingMap[ex.id] = {
            hasPricing: hasPerMinute || hasSession || hasPlans,
            hasPerMinute,
            hasSession,
            hasPlans,
            callPrice,
            chatPrice,
            sessionPrice,
            sessionDuration,
            displayPrice: hasPerMinute ? chatPrice : (hasSession ? sessionPrice : 0),
            displayText: hasPerMinute ? `${chatPrice}/min` : (hasSession ? `${sessionPrice}/${sessionDuration}min` : (hasPlans ? "Plans Available" : "Contact")),
            primaryAction: hasPerMinute ? "chat" : (hasSession ? "session" : (hasPlans ? "view" : "none")),
          };
        } catch (error) {
          console.error(`Failed to load pricing for expert ${ex.id}:`, error);
          pricingMap[ex.id] = {
            hasPricing: false,
            hasPerMinute: false,
            hasSession: false,
            hasPlans: false,
            callPrice: 0,
            chatPrice: 0,
            sessionPrice: 0,
            sessionDuration: 0,
            displayPrice: 0,
            displayText: "Contact",
            primaryAction: "none",
          };
        }
      }

      setExpertPricing(pricingMap);
    };

    if (topExperts.length) {
      loadExpertPricing();
    }
  }, [topExperts]);

  /* ================= HANDLE EXPERT ACTION ================= */
  const handleExpertAction = (e, expert, pricing) => {
    e.stopPropagation();

    switch (pricing.primaryAction) {
      case "chat":
        startChat({
          expertId: expert.id,
          chatPrice: pricing.chatPrice,
          expertName: expert.name,
        });
        break;
      
      case "session":
        // Navigate to expert profile for session booking
        navigate(`/user/experts/${expert.id}`, { 
          state: { scrollToBooking: true, bookingType: "session" }
        });
        break;
      
      case "view":
        // Navigate to expert profile to view subscription plans
        navigate(`/user/experts/${expert.id}`, { 
          state: { scrollToPlans: true }
        });
        break;
      
      default:
        // Navigate to profile
        navigate(`/user/experts/${expert.id}`);
        break;
    }
  };

  /* ================= GET BUTTON TEXT ================= */
  const getButtonText = (pricing) => {
    switch (pricing.primaryAction) {
      case "chat":
        return `Chat ₹${pricing.displayPrice}/min`;
      case "session":
        return `Book Session (₹${pricing.displayPrice})`;
      case "view":
        return "View Plans";
      default:
        return "View Profile";
    }
  };

  /* ================= GET BUTTON STYLE ================= */
  const getButtonStyle = (pricing) => {
    switch (pricing.primaryAction) {
      case "chat":
        return "btn-primary small";
      case "session":
        return "btn-session small";
      case "view":
        return "btn-plans small";
      default:
        return "btn-secondary small";
    }
  };

  /* ================= SCROLL ================= */
  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  if (loading || expertsLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading experts...</p>
      </div>
    );
  }

  const getInitials = (name = "") => {
    const words = name.trim().split(" ");
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  };

  return (
    <>
      <style>{`
        .loading-container {
          text-align: center;
          padding: 40px;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e2e8f0;
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 16px;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .btn-session {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .btn-session:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }
        
        .btn-plans {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .btn-plans:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }
        
        .btn-secondary {
          background: #64748b;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .btn-secondary:hover {
          background: #475569;
        }
        
        .expert-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .expert-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.1);
        }
        
        .pricing-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          margin-top: 8px;
        }
        
        .badge-per-minute {
          background: #dbeafe;
          color: #1e40af;
        }
        
        .badge-session {
          background: #fef3c7;
          color: #92400e;
        }
        
        .badge-plans {
          background: #ede9fe;
          color: #5b21b6;
        }
        
        .price-tag {
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
          margin: 8px 0;
        }
        
        .chat-btn-container {
          margin-top: 12px;
        }
      `}</style>

      <section className="section-expert">
        <div className="section-header">
          <h2>Popular Experts</h2>
          <div className="scroll-controls">
            <button className="scroll-btn left-btn" onClick={scrollLeft}>◀</button>
            <button className="scroll-btn right-btn" onClick={scrollRight}>▶</button>
          </div>
        </div>

        <div className="expert-container">
          <div className="expert-row" ref={scrollContainerRef}>
            {topExperts.map((ex) => {
              const pricing = expertPricing[ex.id] || {
                hasPricing: false,
                hasPerMinute: false,
                hasSession: false,
                hasPlans: false,
                displayText: "Contact",
                primaryAction: "none",
              };

              return (
                <div
                  className="expert-card"
                  key={ex.id}
                  onClick={() => navigate(`/user/experts/${ex.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  {ex.profile_photo ? (
                    <img src={ex.profile_photo} alt={ex.name} className="avatar" />
                  ) : (
                    <div className="avatar-fallback">{getInitials(ex.name)}</div>
                  )}

                  <h4>{ex.name}</h4>
                  <p>{ex.position}</p>

                  <div className="rating">★★★★★</div>

                  {/* Pricing Badge */}
                  {pricing.hasPerMinute && (
                    <div className="pricing-badge badge-per-minute">💰 Per Minute</div>
                  )}
                  {pricing.hasSession && !pricing.hasPerMinute && (
                    <div className="pricing-badge badge-session">📋 Session Based</div>
                  )}
                  {pricing.hasPlans && !pricing.hasPerMinute && !pricing.hasSession && (
                    <div className="pricing-badge badge-plans">📦 Subscription Plans</div>
                  )}

                  {/* Price Display */}
                  <div className="price-tag">
                    {pricing.hasPerMinute && `₹${pricing.chatPrice}/min`}
                    {pricing.hasSession && !pricing.hasPerMinute && `₹${pricing.sessionPrice} / ${pricing.sessionDuration}min`}
                    {pricing.hasPlans && !pricing.hasPerMinute && !pricing.hasSession && "Starting from plans"}
                    {!pricing.hasPricing && "Contact for pricing"}
                  </div>

                  {/* Action Button */}
                  <div className="chat-btn-container">
                    <button
                      className={getButtonStyle(pricing)}
                      onClick={(e) => handleExpertAction(e, ex, pricing)}
                    >
                      {getButtonText(pricing)}
                    </button>
                  </div>

                  {/* Subscription hint */}
                  {pricing.hasPlans && pricing.hasPerMinute && (
                    <small style={{ display: "block", marginTop: 8, fontSize: 11, color: "#8b5cf6" }}>
                      ✨ Subscription plans available
                    </small>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <ChatPopups />
    </>
  );
}