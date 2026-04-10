// src/apps/user/components/userExperts/ExpertCard.jsx - ✅ UPDATED with multiple pricing modes
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiStar, FiPhoneCall, FiMessageSquare, FiMapPin, FiX, FiZap, FiBookOpen } from "react-icons/fi";

import { useAuth } from "../../../../shared/context/UserAuthContext";
import { useWallet } from "../../../../shared/context/WalletContext";

import { getExpertPriceByIdApi } from "../../../../shared/api/expertapi/price.api";
import { getExpertFollowersApi } from "../../../../shared/api/expertapi/follower.api";
import { getReviewsByExpertApi } from "../../../../shared/api/expertapi/reviews.api";
import { getPlansApi } from "../../../../shared/api/userApi/subscription.api";

import {
  Card,
  CardHeader,
  AvatarWrap,
  AvatarImg,
  StatusDot,
  NameRow,
  Name,
  Badge,
  Role,
  MetaRow,
  MetaItem,
  RatingStar,
  LangRow,
  LangChip,
  PriceRow,
  PriceLabel,
  PriceTag,
  ActionRow,
  PrimaryBtn,
  GhostBtn,
  PricingBadge,
  PricingInfo,
} from "./ExpertCard.styles";

const DEFAULT_AVATAR = "https://i.pravatar.cc/150?img=12";
const MIN_CHAT_MINUTES = 5;

const ExpertCard = ({ data, mode, maxPrice, onStartChat, onStartCall }) => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const userId = user?.id;
  const { balance } = useWallet();

  // Pricing data
  const [callPrice, setCallPrice] = useState(data.callPrice || 0);
  const [chatPrice, setChatPrice] = useState(data.chatPrice || 0);
  const [sessionPrice, setSessionPrice] = useState(data.sessionPrice || 0);
  const [sessionDuration, setSessionDuration] = useState(data.sessionDuration || 0);
  const [pricingModes, setPricingModes] = useState([]);
  const [hasPlans, setHasPlans] = useState(false);
  
  // Meta data
  const [followersCount, setFollowersCount] = useState(data.followersCount || 0);
  const [avgRating, setAvgRating] = useState(data.avgRating || 0);
  const [totalReviews, setTotalReviews] = useState(data.totalReviews || 0);
  const [loadingMeta, setLoadingMeta] = useState(true);
  
  // UI states
  const [showRecharge, setShowRecharge] = useState(false);
  const [requiredAmount, setRequiredAmount] = useState(0);
  const [showPricingModal, setShowPricingModal] = useState(false);

  const expertId = data.id;

  // Load price, plans, followers & reviews
  useEffect(() => {
    let cancelled = false;
    if (!expertId) return;

    const loadMeta = async () => {
      try {
        setLoadingMeta(true);

        // Fetch price data
        const priceRes = await getExpertPriceByIdApi(expertId);
        const priceData = priceRes?.data?.data || priceRes?.data || {};
        
        // Parse pricing modes
        let modes = priceData.pricing_modes || [];
        if (typeof modes === 'string') {
          try {
            modes = JSON.parse(modes);
          } catch {
            modes = [];
          }
        }
        
        if (!cancelled) {
          setPricingModes(modes);
          setCallPrice(Number(priceData.call?.per_minute || priceData.call_per_minute || 0));
          setChatPrice(Number(priceData.chat?.per_minute || priceData.chat_per_minute || 0));
          setSessionPrice(Number(priceData.session?.price || priceData.session_price || 0));
          setSessionDuration(Number(priceData.session?.duration || priceData.session_duration || 0));
        }

        // Fetch subscription plans
        try {
          const plansRes = await getPlansApi(expertId);
          const hasActivePlans = plansRes?.data?.success && plansRes.data.data?.length > 0;
          if (!cancelled) {
            setHasPlans(hasActivePlans);
          }
        } catch (error) {
          console.error("Failed to fetch plans:", error);
          if (!cancelled) setHasPlans(false);
        }

        // Fetch followers
        const followersRes = await getExpertFollowersApi(expertId);
        if (!cancelled && followersRes?.data) {
          setFollowersCount(
            followersRes.data.total_followers ||
              followersRes.data.followers?.length ||
              0
          );
        }

        // Fetch reviews
        const reviewsRes = await getReviewsByExpertApi(expertId);
        const rData = reviewsRes?.data?.data || {};
        if (!cancelled) {
          setAvgRating(Number(rData.avg_rating || 0));
          setTotalReviews(rData.total_reviews || (rData.reviews || []).length || 0);
        }
      } catch (err) {
        console.error("ExpertCard meta load failed:", err);
      } finally {
        if (!cancelled) setLoadingMeta(false);
      }
    };

    loadMeta();
    return () => {
      cancelled = true;
    };
  }, [expertId]);

  // Check if expert has specific pricing mode
  const hasPerMinute = useMemo(() => pricingModes.includes('per_minute'), [pricingModes]);
  const hasSession = useMemo(() => pricingModes.includes('session'), [pricingModes]);
  const hasSubscription = useMemo(() => hasPlans, [hasPlans]);

  // Get display price for the card based on mode
  const getDisplayPrice = useMemo(() => {
    if (mode === "chat" && hasPerMinute) {
      return { price: chatPrice, unit: "/min", label: "Chat Rate" };
    }
    if (mode === "call" && hasPerMinute) {
      return { price: callPrice, unit: "/min", label: "Call Rate" };
    }
    if (hasSession && (mode === "chat" || mode === "call")) {
      return { price: sessionPrice, unit: `/${sessionDuration}min`, label: "Session Rate" };
    }
    if (hasSubscription) {
      return { price: null, unit: "", label: "Plans Available" };
    }
    return { price: 0, unit: "/min", label: "Rate" };
  }, [mode, hasPerMinute, hasSession, hasSubscription, chatPrice, callPrice, sessionPrice, sessionDuration]);

  // Max price filter
  const isHiddenByPrice = useMemo(() => {
    if (!maxPrice) return false;
    const mp = Number(maxPrice);
    if (!mp) return false;
    
    if (hasPerMinute) {
      if (mode === "call") return callPrice > mp;
      if (mode === "chat") return chatPrice > mp;
    }
    if (hasSession) {
      return sessionPrice > mp;
    }
    return false;
  }, [maxPrice, mode, hasPerMinute, hasSession, callPrice, chatPrice, sessionPrice]);

  if (isHiddenByPrice) return null;

  // Handle start chat with balance check
  const handleStartChatLocal = useCallback(() => {
    if (!isLoggedIn) {
      navigate("/user/auth", { state: { from: `/user/experts/${expertId}` } });
      return;
    }

    // Check if expert has per-minute pricing
    if (hasPerMinute && chatPrice > 0) {
      const minRequired = chatPrice * MIN_CHAT_MINUTES;
      const userBalance = Number(balance || 0);

      if (userBalance >= minRequired) {
        if (onStartChat) {
          onStartChat(expertId);
        } else {
          // Direct socket emit
          window.socket?.emit("request_chat", { 
            user_id: userId, 
            expert_id: Number(expertId),
            user_name: user?.name || "User"
          });
        }
      } else {
        setRequiredAmount(Math.max(0, minRequired - userBalance));
        setShowRecharge(true);
      }
    }
    // Check if expert has session pricing
    else if (hasSession && sessionPrice > 0) {
      const userBalance = Number(balance || 0);
      if (userBalance >= sessionPrice) {
        navigate(`/user/experts/${expertId}`, { 
          state: { scrollToBooking: true, bookingType: "session" }
        });
      } else {
        setRequiredAmount(Math.max(0, sessionPrice - userBalance));
        setShowRecharge(true);
      }
    }
    // Check if expert has subscription plans
    else if (hasSubscription) {
      navigate(`/user/experts/${expertId}`, { 
        state: { scrollToPlans: true }
      });
    }
    else {
      alert("Chat is not available for this expert. Please check their profile for pricing options.");
      navigate(`/user/experts/${expertId}`);
    }
  }, [isLoggedIn, navigate, expertId, hasPerMinute, hasSession, hasSubscription, 
      chatPrice, sessionPrice, balance, userId, user, onStartChat]);

  // Handle start call with balance check
  const handleStartCallLocal = useCallback(() => {
    if (!isLoggedIn) {
      navigate("/user/auth", { state: { from: `/user/experts/${expertId}` } });
      return;
    }

    if (onStartCall) {
      onStartCall(expertId);
      return;
    }

    // Check if expert has per-minute pricing
    if (hasPerMinute && callPrice > 0) {
      const minRequired = callPrice * MIN_CHAT_MINUTES;
      const userBalance = Number(balance || 0);

      if (userBalance >= minRequired) {
        navigate(`/user/voice-call/${expertId}`, {
          state: { fromCard: true, callType: "voice" },
        });
      } else {
        setRequiredAmount(Math.max(0, minRequired - userBalance));
        setShowRecharge(true);
      }
    }
    // Check if expert has session pricing
    else if (hasSession && sessionPrice > 0) {
      const userBalance = Number(balance || 0);
      if (userBalance >= sessionPrice) {
        navigate(`/user/experts/${expertId}`, { 
          state: { scrollToBooking: true, bookingType: "call_session" }
        });
      } else {
        setRequiredAmount(Math.max(0, sessionPrice - userBalance));
        setShowRecharge(true);
      }
    }
    // Check if expert has subscription plans
    else if (hasSubscription) {
      navigate(`/user/experts/${expertId}`, { 
        state: { scrollToPlans: true }
      });
    }
    else {
      alert("Call is not available for this expert. Please check their profile for pricing options.");
      navigate(`/user/experts/${expertId}`);
    }
  }, [isLoggedIn, navigate, expertId, hasPerMinute, hasSession, hasSubscription,
      callPrice, sessionPrice, balance, onStartCall]);

  const handleViewProfile = useCallback(() => {
    navigate(`/user/experts/${expertId}`);
  }, [expertId, navigate]);

  const handleRechargeClose = useCallback(() => {
    setShowRecharge(false);
    setRequiredAmount(0);
  }, []);

  const languages = data.languages && data.languages.length > 0
    ? data.languages
    : ["English", "Hindi"];

  // Get button text based on pricing mode
  const getButtonText = () => {
    if (mode === "chat") {
      if (hasPerMinute) return `Chat ₹${chatPrice}/min`;
      if (hasSession) return `Book Session (₹${sessionPrice})`;
      if (hasSubscription) return "View Plans";
      return "Contact Expert";
    } else {
      if (hasPerMinute) return `Call ₹${callPrice}/min`;
      if (hasSession) return `Book Call Session (₹${sessionPrice})`;
      if (hasSubscription) return "View Plans";
      return "Contact Expert";
    }
  };

  // Check if button should be disabled
  const isButtonDisabled = () => {
    if (loadingMeta) return true;
    if (mode === "chat") {
      if (hasPerMinute) return chatPrice <= 0;
      if (hasSession) return sessionPrice <= 0;
      return false;
    } else {
      if (hasPerMinute) return callPrice <= 0;
      if (hasSession) return sessionPrice <= 0;
      return false;
    }
  };

  const Spinner = () => (
    <div
      style={{
        width: 28,
        height: 28,
        border: "3px solid #e2e8f0",
        borderTopColor: "#10b981",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
        margin: "0 auto",
      }}
    />
  );

  return (
    <>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      <Card>
        <CardHeader>
          <AvatarWrap $isAI={false}>
            <AvatarImg src={data.profile_photo || DEFAULT_AVATAR} alt={data.name} />
            <StatusDot $online={data.isOnline === true} />
          </AvatarWrap>

          <div>
            <NameRow>
              <Name>{data.name}</Name>
              <Badge>Verified</Badge>
            </NameRow>
            <Role>{data.position || "Expert"}</Role>

            <MetaRow>
              <MetaItem>
                <FiMapPin size={12} />
                {data.location || "India"}
              </MetaItem>
              <MetaItem>
                <RatingStar>★</RatingStar>
                {avgRating ? avgRating.toFixed(1) : "—"} ({totalReviews})
              </MetaItem>
              <MetaItem>Followers: {followersCount}</MetaItem>
            </MetaRow>
          </div>
        </CardHeader>

        {data.speciality && (
          <MetaRow style={{ marginTop: 4 }}>
            <MetaItem>{data.speciality}</MetaItem>
          </MetaRow>
        )}

        {/* Pricing Mode Badges */}
        <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
          {hasPerMinute && (
            <PricingBadge type="per_minute">
              💰 Per Minute
            </PricingBadge>
          )}
          {hasSession && (
            <PricingBadge type="session">
              📋 Session Based
            </PricingBadge>
          )}
          {hasSubscription && !hasPerMinute && !hasSession && (
            <PricingBadge type="plans">
              📦 Subscription Plans
            </PricingBadge>
          )}
        </div>

        <LangRow>
          {languages.map((lang) => (
            <LangChip key={lang}>{lang}</LangChip>
          ))}
        </LangRow>

        {/* Price Display */}
        <PriceRow>
          {hasPerMinute ? (
            <>
              <div>
                <PriceLabel>Call Rate</PriceLabel>
                <PriceTag>₹{callPrice || 0} / min</PriceTag>
              </div>
              <div>
                <PriceLabel>Chat Rate</PriceLabel>
                <PriceTag>₹{chatPrice || 0} / min</PriceTag>
              </div>
            </>
          ) : hasSession ? (
            <div style={{ width: '100%' }}>
              <PriceLabel>Session Rate</PriceLabel>
              <PriceTag>₹{sessionPrice || 0} / {sessionDuration || 30} min session</PriceTag>
            </div>
          ) : hasSubscription ? (
            <div style={{ width: '100%' }}>
              <PriceLabel>Pricing Model</PriceLabel>
              <PriceTag style={{ background: '#8b5cf6', color: 'white' }}>
                <FiZap size={12} /> Subscription Plans Available
              </PriceTag>
            </div>
          ) : (
            <div style={{ width: '100%' }}>
              <PriceLabel>Contact for Pricing</PriceLabel>
              <PriceTag>Contact Expert</PriceTag>
            </div>
          )}
        </PriceRow>

        {/* Subscription hint */}
        {hasSubscription && hasPerMinute && (
          <PricingInfo>
            <FiZap size={12} />
            <span>Subscribe for savings on long-term consultations</span>
          </PricingInfo>
        )}

        <ActionRow>
          <PrimaryBtn
            disabled={isButtonDisabled() || !isLoggedIn}
            onClick={mode === "chat" ? handleStartChatLocal : handleStartCallLocal}
          >
            {mode === "chat" ? <FiMessageSquare size={14} /> : <FiPhoneCall size={14} />}
            {getButtonText()}
          </PrimaryBtn>
          <GhostBtn type="button" onClick={handleViewProfile}>
            View Profile
          </GhostBtn>
        </ActionRow>

        {loadingMeta && (
          <div style={{ marginTop: 6, fontSize: 11, color: "#64748b" }}>
            Loading details…
          </div>
        )}
      </Card>

      {/* Low Balance Popup */}
      {showRecharge && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 16,
              width: "min(90vw, 380px)",
              textAlign: "center",
              boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            }}
          >
            <h3 style={{ margin: 0, marginBottom: 12, color: "#0f172a" }}>
              Insufficient Balance
            </h3>
            <p style={{ margin: 0, marginBottom: 20, color: "#475569" }}>
              Need <strong>₹{requiredAmount.toFixed(2)}</strong> more
              {hasPerMinute && ` for ${MIN_CHAT_MINUTES} minutes`}.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <PrimaryBtn onClick={() => navigate("/user/wallet")}>
                Recharge Now
              </PrimaryBtn>
              <GhostBtn onClick={handleRechargeClose}>Cancel</GhostBtn>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExpertCard;