// src/apps/user/components/userExperts/ExpertCard.jsx - WITH VIDEO CALL SUPPORT FIXED
import React, { useCallback, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  FiPhoneCall, FiMessageSquare, FiMapPin, FiZap, FiClock, FiVideo,
  FiUsers, FiStar, FiAward, FiTrendingUp, FiShield, 
  FiCheckCircle, FiHeart, FiShare2
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "../../../../shared/context/UserAuthContext";
import { useWallet } from "../../../../shared/context/WalletContext";
import { buildTrackingPayload, trackLeadEvent } from "../../../../shared/utils/leadTracking";
import { normalizeVideoCallPrice } from "../../../../shared/utils/normalizeExpertPrice";

import {
  Card,
  CardInner,
  CardHeader,
  AvatarSection,
  AvatarWrap,
  AvatarImg,
  AvatarInitials,
  StatusDot,
  ExpertInfo,
  NameRow,
  Name,
  VerifiedBadge,
  PremiumBadge,
  Role,
  MetaRow,
  MetaItem,
  RatingStar,
  StatsGrid,
  StatCard,
  PricingBadges,
  PricingBadge,
  ActionRow,
  PrimaryBtn,
  GhostBtn,
  PricingInfo,
  ShineEffect,
  GradientBorder
} from "./ExpertCard.styles";

const DEFAULT_AVATAR = "https://i.pravatar.cc/150?img=12";
const MIN_CHAT_MINUTES = 5;
const isEnabledFlag = (value) =>
  value === true ||
  value === 1 ||
  value === "1" ||
  String(value || "").toLowerCase() === "true";

const ExpertCard = ({ data, mode, onStartChat, onStartCall, onStartVideoCall, variant }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isLoggedIn, user } = useAuth();
  const userId = user?.id;
  const { balance } = useWallet();
  const [isHovered, setIsHovered] = useState(false);
  const [showRecharge, setShowRecharge] = useState(false);
  const [requiredAmount, setRequiredAmount] = useState(0);

  const expertId = data.id;
  const expertSlug = data.slug || data.id;

  // DIRECT DATA FROM API
  const callPrice = data.call_per_minute || 0;
  const chatPrice = data.chat_per_minute || 0;
  const videoCallPrice = normalizeVideoCallPrice(data) || data.video_call_per_minute || data.videoCallPerMinute || data.video_call_price_per_minute || 0;
  const sessionPrice = data.session_price || 0;
  const sessionDuration = data.session_duration || 30;

  const avgRating = Number(data.avg_rating) || 0;
  const totalReviews = data.total_reviews || 0;
  const followersCount = data.total_followers || 0;

  const totalExperience = data.total_experience || 0;
  const totalTime = data.total_time || 0;
  const chatTime = data.chat_time || 0;
  const callTime = data.call_time || 0;

  const hasSubscription = Boolean(
    data.has_subscription ||
    data.hasSubscription ||
    data.is_subscribed ||
    (data.subscription_status && data.subscription_status !== "free") ||
    (data.access_level && data.access_level !== "free_limited")
  );
  const routerLocation = useLocation();

  // Get initials from name
  const getInitials = useCallback((name = "") => {
    if (!name) return "?";
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + (words[1]?.charAt(0) || "")).toUpperCase();
  }, []);

  const slugify = (text) => {
    if (!text) return "";
    return text.toString().toLowerCase().trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  };

  const { categoryName, subcategoryName } = useMemo(() => {
    const params = new URLSearchParams(routerLocation.search);
    const catParam = params.get("category") || params.get("categoryId");
    const subParam = params.get("sub_category") || params.get("subCategory") || params.get("subcategory") || params.get("subCategoryId");
    
    let matchedCategory = null;
    let matchedSubcategory = null;
    
    const pathname = routerLocation.pathname.toLowerCase();
    const expertise = Array.isArray(data.expertise) ? data.expertise : [];
    
    for (const group of expertise) {
      const catId = String(group.category_id);
      const catSlug = slugify(group.category_name);
      
      const isCatMatch = catParam === catId || (catSlug && pathname.includes(catSlug));
      if (isCatMatch) {
        matchedCategory = group;
      }
      
      for (const sub of (group.subcategories || [])) {
        const subId = String(sub.subcategory_id);
        const subSlug = slugify(sub.subcategory_name);
        
        const isSubMatch = subParam === subId || (subSlug && pathname.includes(subSlug));
        if (isSubMatch) {
          matchedSubcategory = sub;
          matchedCategory = group;
        }
      }
    }
    
    if (!matchedCategory && data.category_id) {
      const catId = String(data.category_id);
      const catSlug = slugify(data.category_name);
      if (catParam === catId || (catSlug && pathname.includes(catSlug))) {
        matchedCategory = {
          category_id: data.category_id,
          category_name: data.category_name,
          subcategories: [{ subcategory_id: data.subcategory_id, subcategory_name: data.subcategory_name }]
        };
      }
    }
    if (!matchedSubcategory && data.subcategory_id) {
      const subId = String(data.subcategory_id);
      const subSlug = slugify(data.subcategory_name);
      if (subParam === subId || (subSlug && pathname.includes(subSlug))) {
        matchedSubcategory = {
          subcategory_id: data.subcategory_id,
          subcategory_name: data.subcategory_name
        };
        matchedCategory = {
          category_id: data.category_id,
          category_name: data.category_name,
          subcategories: [matchedSubcategory]
        };
      }
    }
    
    if (matchedCategory) {
      const catName = matchedCategory.category_name;
      const subNames = matchedSubcategory 
        ? [matchedSubcategory.subcategory_name]
        : (matchedCategory.subcategories || []).map(s => s.subcategory_name || s.name).filter(Boolean);
      
      return {
        categoryName: catName,
        subcategoryName: subNames.join(", "),
      };
    } else {
      return {
        categoryName: data.category_name || "",
        subcategoryName: data.subcategory_name || "",
      };
    }
  }, [data, routerLocation.search, routerLocation.pathname]);
  
  const location = data.location || "";
  const isPremium = data.is_premium || false;
  const isCallChatCard = variant === "callChat";
  
  const chatAllowedByAdmin = isEnabledFlag(data.effective_access?.show_chat_button ?? data.effective_access?.can_chat ?? data.show_chat_button ?? data.showChatButton ?? data.can_chat ?? data.canChat);
  const callAllowedByAdmin = isEnabledFlag(data.effective_access?.show_call_button ?? data.effective_access?.can_call ?? data.show_call_button ?? data.showCallButton ?? data.can_call ?? data.canCall);
  const videoAllowedByAdmin = isEnabledFlag(data.effective_access?.show_video_button ?? data.effective_access?.can_video_call ?? data.show_video_button ?? data.showVideoButton ?? data.can_video_call ?? data.canVideoCall);
  
  const canUseMode = Boolean(expertId);
  const isVideoTab = mode === "video";
  const isCallTab = mode === "call";
  const isChatTab = mode === "chat";

  const trackUserAttempt = useCallback((type) => {
    if (!expertId) return;
    trackLeadEvent(
      type === "chat" ? "chat-attempt" : type === "video" ? "video-call-attempt" : "call-attempt",
      buildTrackingPayload({
        user,
        sourcePage: "expert_card",
        actionLabel: type === "chat" ? "Chat Now" : type === "video" ? "Video Call Now" : "Call Now",
        extra: {
          expert_id: Number(expertId),
          category_id: data.category_id || data.categoryId || null,
          subcategory_id: data.subcategory_id || data.subcategoryId || null,
          contact_consent: true,
          can_show_contact_to_expert: true,
        },
      })
    );
  }, [data.category_id, data.categoryId, data.subcategory_id, data.subcategoryId, expertId, user]);

  // PRICING LOGIC
  const hasPerMinute = callPrice > 0 || chatPrice > 0 || videoCallPrice > 0;
  const hasSession = sessionPrice > 0;
  const hasSubscriptionOffer = Boolean(hasSubscription && hasPerMinute);
  const hasPricingBadge = Boolean(hasPerMinute || hasSession || hasSubscription);

  const handleStartChatLocal = useCallback(() => {
    if (!expertId) return;
    if (!chatAllowedByAdmin) {
      alert("Chat is currently unavailable for this expert.");
      return;
    }
    trackUserAttempt("chat");

    if (!isLoggedIn) {
      navigate("/user/auth", { state: { from: `/user/experts/${expertSlug}` } });
      return;
    }

    if (hasPerMinute && chatPrice > 0) {
      const minRequired = chatPrice * MIN_CHAT_MINUTES;
      const userBalance = Number(balance || 0);

      if (userBalance >= minRequired) {
        if (onStartChat) {
          onStartChat(expertId);
        } else {
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
    } else if (hasSession && sessionPrice > 0) {
      const userBalance = Number(balance || 0);
      if (userBalance >= sessionPrice) {
        navigate(`/user/experts/${expertSlug}`, { 
          state: { scrollToBooking: true, bookingType: "session" }
        });
      } else {
        setRequiredAmount(Math.max(0, sessionPrice - userBalance));
        setShowRecharge(true);
      }
    } else if (hasSubscription) {
      navigate(`/user/experts/${expertSlug}`, { 
        state: { scrollToPlans: true }
      });
    } else {
      navigate(`/user/experts/${expertSlug}`);
    }
  }, [expertId, trackUserAttempt, isLoggedIn, navigate, expertSlug, hasPerMinute, hasSession, hasSubscription, 
      chatPrice, sessionPrice, balance, userId, user, onStartChat, chatAllowedByAdmin]);

  const handleStartCallLocal = useCallback(() => {
    if (!expertId) return;
    if (!callAllowedByAdmin) {
      alert("Call is currently unavailable for this expert.");
      return;
    }
    trackUserAttempt("call");

    if (!isLoggedIn) {
      navigate("/user/auth", { state: { from: `/user/experts/${expertSlug}` } });
      return;
    }

    if (onStartCall) {
      onStartCall(expertId);
      return;
    }

    if (hasPerMinute && callPrice > 0) {
      const minRequired = callPrice * MIN_CHAT_MINUTES;
      const userBalance = Number(balance || 0);

      if (userBalance >= minRequired) {
        navigate(`/user/voice-call/${expertSlug}`, {
          state: { fromCard: true, callType: "voice" },
        });
      } else {
        setRequiredAmount(Math.max(0, minRequired - userBalance));
        setShowRecharge(true);
      }
    } else if (hasSession && sessionPrice > 0) {
      const userBalance = Number(balance || 0);
      if (userBalance >= sessionPrice) {
        navigate(`/user/experts/${expertSlug}`, { 
          state: { scrollToBooking: true, bookingType: "call_session" }
        });
      } else {
        setRequiredAmount(Math.max(0, sessionPrice - userBalance));
        setShowRecharge(true);
      }
    } else if (hasSubscription) {
      navigate(`/user/experts/${expertSlug}`, { 
        state: { scrollToPlans: true }
      });
    } else {
      navigate(`/user/experts/${expertSlug}`);
    }
  }, [expertId, trackUserAttempt, isLoggedIn, navigate, expertSlug, hasPerMinute, hasSession, hasSubscription,
      callPrice, sessionPrice, balance, onStartCall, callAllowedByAdmin]);

  const handleStartVideoCallLocal = useCallback(() => {
    if (!expertId) return;
    if (!videoAllowedByAdmin) {
      alert("Video call is currently unavailable for this expert.");
      return;
    }
    
    if (videoCallPrice <= 0) {
      alert("Video call pricing not configured for this expert.");
      return;
    }
    
    trackUserAttempt("video");

    if (!isLoggedIn) {
      navigate("/user/auth", { state: { from: `/user/experts/${expertSlug}` } });
      return;
    }

    if (onStartVideoCall) {
      onStartVideoCall(expertId);
      return;
    }

    if (hasPerMinute && videoCallPrice > 0) {
      const minRequired = videoCallPrice * MIN_CHAT_MINUTES;
      const userBalance = Number(balance || 0);

      if (userBalance >= minRequired) {
        navigate(`/user/video-call/${expertSlug}`, {
          state: { fromCard: true, callType: "video" },
        });
      } else {
        setRequiredAmount(Math.max(0, minRequired - userBalance));
        setShowRecharge(true);
      }
    } else if (hasSession && sessionPrice > 0) {
      const userBalance = Number(balance || 0);
      if (userBalance >= sessionPrice) {
        navigate(`/user/experts/${expertSlug}`, { 
          state: { scrollToBooking: true, bookingType: "video_session" }
        });
      } else {
        setRequiredAmount(Math.max(0, sessionPrice - userBalance));
        setShowRecharge(true);
      }
    } else if (hasSubscription) {
      navigate(`/user/experts/${expertSlug}`, { 
        state: { scrollToPlans: true }
      });
    } else {
      navigate(`/user/experts/${expertSlug}`);
    }
  }, [expertId, trackUserAttempt, isLoggedIn, navigate, expertSlug, hasPerMinute, hasSession, hasSubscription,
      videoCallPrice, sessionPrice, balance, onStartVideoCall, videoAllowedByAdmin]);

  const handleViewProfile = useCallback(() => {
    navigate(`/user/experts/${expertSlug}`);
  }, [expertSlug, navigate]);

  const handleRechargeClose = useCallback(() => {
    setShowRecharge(false);
    setRequiredAmount(0);
  }, []);

  const getButtonText = () => {
    if (isVideoTab) {
      if (hasPerMinute && videoCallPrice > 0) return `₹${videoCallPrice}/min`;
      if (hasSession) return `₹${sessionPrice}`;
      if (hasSubscription) return "Free";
      return "--";
    } else if (isChatTab) {
      if (hasPerMinute && chatPrice > 0) return `₹${chatPrice}/min`;
      if (hasSession) return `₹${sessionPrice}`;
      if (hasSubscription) return "Free";
      return "--";
    } else {
      if (hasPerMinute && callPrice > 0) return `₹${callPrice}/min`;
      if (hasSession) return `₹${sessionPrice}`;
      if (hasSubscription) return "Free";
      return "--";
    }
  };

  const getButtonIcon = () => {
    if (isVideoTab) return <FiVideo size={16} />;
    if (isChatTab) return <FiMessageSquare size={16} />;
    return <FiPhoneCall size={16} />;
  };

  const getButtonHandler = () => {
    if (isVideoTab) return handleStartVideoCallLocal;
    if (isChatTab) return handleStartChatLocal;
    return handleStartCallLocal;
  };

  const getButtonTitle = () => {
    if (isVideoTab) return "Start video consultation";
    if (isChatTab) return "Start chat consultation";
    return "Start voice call";
  };

  const isButtonDisabled = () => {
    if (!canUseMode) return true;
    if (isChatTab && !chatAllowedByAdmin) return true;
    if (isVideoTab && !videoAllowedByAdmin) return true;
    if (isCallTab && !callAllowedByAdmin) return true;
    return false;
  };

  // Get the appropriate price for the current mode
  const getModePrice = () => {
    if (isVideoTab) return videoCallPrice;
    if (isChatTab) return chatPrice;
    return callPrice;
  };

  const currentPrice = getModePrice();
  const initials = getInitials(data.name);

  // Check if there's a valid profile photo
  const hasValidPhoto = data.profile_photo && 
    !data.profile_photo.includes("default") && 
    !data.profile_photo.includes("placeholder") &&
    data.profile_photo.length > 10;

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { y: -8, transition: { duration: 0.3 } }
  };

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        style={isCallChatCard ? { width: "100%", height: "100%" } : undefined}
      >
        <Card $callChat={isCallChatCard}>
          <ShineEffect isHovered={isHovered} />
          <GradientBorder isHovered={isHovered} />
          
          <CardInner $callChat={isCallChatCard}>
            <CardHeader $callChat={isCallChatCard}>
              <AvatarSection>
                <AvatarWrap $isAI={false} $callChat={isCallChatCard} isHovered={isHovered}>
                  {hasValidPhoto ? (
                    <AvatarImg src={data.profile_photo} alt={data.name} />
                  ) : (
                    <AvatarInitials>{initials}</AvatarInitials>
                  )}
                  <StatusDot $online={data.isOnline === true} />
                </AvatarWrap>
              </AvatarSection>

              <ExpertInfo>
                <NameRow $callChat={isCallChatCard}>
                  <Name $callChat={isCallChatCard}>{data.name}</Name>
                  {data.is_verified && (
                    <VerifiedBadge>
                      <FiCheckCircle size={14} />
                    </VerifiedBadge>
                  )}
                  {isPremium && (
                    <PremiumBadge>
                      <FiAward size={12} />
                      Premium
                    </PremiumBadge>
                  )}
                </NameRow>
                
                {(categoryName || subcategoryName) && (
                  <Role $callChat={isCallChatCard}>
                    {categoryName}
                    {subcategoryName && (
                      <>
                        <span style={{ margin: '0 4px' }}>•</span>
                        {subcategoryName}
                      </>
                    )}
                  </Role>
                )}

                <MetaRow $callChat={isCallChatCard}>
                  {location && (
                    <MetaItem $callChat={isCallChatCard}>
                      <FiMapPin size={12} />
                      {location}
                      {data.distance_km !== null && data.distance_km !== undefined && (
                        <span style={{ color: '#0ea5e9', marginLeft: '4px', fontWeight: '600' }}>
                          ({Number(data.distance_km).toFixed(1)} km)
                        </span>
                      )}
                    </MetaItem>
                  )}
                  <MetaItem $callChat={isCallChatCard}>
                    <RatingStar>★</RatingStar>
                    {avgRating ? avgRating.toFixed(1) : "New"} 
                    <span style={{ color: '#94a3b8' }}>({totalReviews})</span>
                  </MetaItem>
                  <MetaItem $callChat={isCallChatCard}>
                    <FiUsers size={12} />
                    {followersCount.toLocaleString()} followers
                  </MetaItem>
                </MetaRow>
              </ExpertInfo>
            </CardHeader>

            {/* Stats Grid */}
            <StatsGrid $callChat={isCallChatCard}>
              {totalExperience > 0 && (
                <StatCard $callChat={isCallChatCard}>
                  <FiClock size={16} />
                  <div>
                    <strong>{totalExperience}+</strong>
                    <span>Years Exp</span>
                  </div>
                </StatCard>
              )}
              {totalTime > 0 && (
                <StatCard $callChat={isCallChatCard}>
                  <FiZap size={16} />
                  <div>
                    <strong>{totalTime}</strong>
                    <span>Total Min</span>
                  </div>
                </StatCard>
              )}
              {chatTime > 0 && (
                <StatCard $callChat={isCallChatCard}>
                  <FiMessageSquare size={16} />
                  <div>
                    <strong>{chatTime}</strong>
                    <span>Chat Min</span>
                  </div>
                </StatCard>
              )}
              {callTime > 0 && (
                <StatCard $callChat={isCallChatCard}>
                  <FiPhoneCall size={16} />
                  <div>
                    <strong>{callTime}</strong>
                    <span>Call Min</span>
                  </div>
                </StatCard>
              )}
            </StatsGrid>

            {/* Pricing Badges */}
            {hasPricingBadge && (
              <PricingBadges $callChat={isCallChatCard}>
                {hasPerMinute && (
                  <PricingBadge type="per_minute">
                    <FiZap size={12} /> {isVideoTab ? "Video / min" : "Flexible"}
                  </PricingBadge>
                )}
                {hasSession && (
                  <PricingBadge type="session">
                    <FiClock size={12} /> Session Based
                  </PricingBadge>
                )}
                {hasSubscription && !hasPerMinute && !hasSession && (
                  <PricingBadge type="plans">
                    <FiShield size={12} /> Subscription
                  </PricingBadge>
                )}
              </PricingBadges>
            )}

            {/* Subscription Hint */}
            {hasSubscriptionOffer && (
              <PricingInfo $callChat={isCallChatCard}>
                <FiZap size={14} />
                <span>✨ Subscribe & save on consultations!</span>
              </PricingInfo>
            )}

            {/* Action Buttons - Only show mode-specific button */}
            <ActionRow $callChat={isCallChatCard}>
              {/* Primary Action Button - Only for current mode */}
              <PrimaryBtn
                $callChat={isCallChatCard}
                disabled={isButtonDisabled()}
                onClick={getButtonHandler()}
                whileTap={{ scale: 0.97 }}
                title={getButtonTitle()}
                aria-label={getButtonTitle()}
                $isVideo={isVideoTab}
              >
                {getButtonIcon()}
                {getButtonText()}
              </PrimaryBtn>
              
              <GhostBtn $callChat={isCallChatCard} onClick={handleViewProfile} whileTap={{ scale: 0.97 }}>
                Profile
              </GhostBtn>
            </ActionRow>
          </CardInner>
        </Card>
      </motion.div>

      {/* Low Balance Popup */}
      <AnimatePresence>
        {showRecharge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 999,
              backdropFilter: "blur(4px)"
            }}
            onClick={handleRechargeClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: "#fff",
                padding: 28,
                borderRadius: 24,
                width: "min(90vw, 400px)",
                textAlign: "center",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ marginBottom: 20 }}>
                <div style={{
                  width: 60,
                  height: 60,
                  background: "#fef3c7",
                  borderRadius: 60,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px"
                }}>
                  <FiZap size={28} color="#d97706" />
                </div>
                <h3 style={{ margin: 0, marginBottom: 8, fontSize: 22, color: "#0f172a" }}>
                  Insufficient Balance
                </h3>
                <p style={{ margin: 0, color: "#475569", fontSize: 14 }}>
                  You need <strong style={{ color: "#d97706" }}>₹{requiredAmount.toFixed(2)}</strong> more
                  {hasPerMinute && ` for ${MIN_CHAT_MINUTES} minutes of consultation`}
                </p>
              </div>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <PrimaryBtn onClick={() => navigate("/user/wallet")}>
                  Add Funds
                </PrimaryBtn>
                <GhostBtn onClick={handleRechargeClose}>
                  Cancel
                </GhostBtn>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const areExpertCardPropsEqual = (prev, next) => {
  const prevData = prev.data || {};
  const nextData = next.data || {};

  return (
    prev.mode === next.mode &&
    prev.variant === next.variant &&
    prev.onStartChat === next.onStartChat &&
    prev.onStartCall === next.onStartCall &&
    prev.onStartVideoCall === next.onStartVideoCall &&
    prevData.id === nextData.id &&
    prevData.name === nextData.name &&
    prevData.profile_photo === nextData.profile_photo &&
    prevData.isOnline === nextData.isOnline &&
    prevData.call_per_minute === nextData.call_per_minute &&
    prevData.chat_per_minute === nextData.chat_per_minute &&
    normalizeVideoCallPrice(prevData) === normalizeVideoCallPrice(nextData) &&
    prevData.show_chat_button === nextData.show_chat_button &&
    prevData.show_call_button === nextData.show_call_button &&
    prevData.show_video_button === nextData.show_video_button &&
    prevData.can_chat === nextData.can_chat &&
    prevData.can_call === nextData.can_call &&
    prevData.can_video_call === nextData.can_video_call &&
    prevData.session_price === nextData.session_price &&
    prevData.avg_rating === nextData.avg_rating &&
    prevData.total_reviews === nextData.total_reviews &&
    prevData.distance_km === nextData.distance_km &&
    prevData.category_name === nextData.category_name &&
    prevData.subcategory_name === nextData.subcategory_name
  );
};

export default React.memo(ExpertCard, areExpertCardPropsEqual);