// src/apps/user/components/userExperts/ExpertCard.jsx - PREMIUM UPGRADED VERSION
import React, { useCallback, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiPhoneCall, FiMessageSquare, FiMapPin, FiZap, FiClock, 
  FiUsers, FiStar, FiAward, FiTrendingUp, FiShield, 
  FiCheckCircle, FiMoreHorizontal, FiHeart, FiShare2
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "../../../../shared/context/UserAuthContext";
import { useWallet } from "../../../../shared/context/WalletContext";

import {
  Card,
  CardInner,
  CardHeader,
  AvatarSection,
  AvatarWrap,
  AvatarImg,
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
  PricingSection,
  PricingBadges,
  PricingBadge,
  PriceRow,
  PriceLabel,
  PriceTag,
  PriceValue,
  ActionRow,
  PrimaryBtn,
  GhostBtn,
  PricingInfo,
  QuickActions,
  ActionIcon,
  HoverGlow,
  ShineEffect,
  GradientBorder,
  CategoryTags,
  CategoryChip
} from "./ExpertCard.styles";

const DEFAULT_AVATAR = "https://i.pravatar.cc/150?img=12";
const MIN_CHAT_MINUTES = 5;

const ExpertCard = ({ data, mode, maxPrice, onStartChat, onStartCall }) => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const userId = user?.id;
  const { balance } = useWallet();
  const [isHovered, setIsHovered] = useState(false);
  const [showRecharge, setShowRecharge] = useState(false);
  const [requiredAmount, setRequiredAmount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const expertId = data.id;
  const expertSlug = data.slug || data.id;

  // DIRECT DATA FROM API
  const callPrice = data.call_per_minute || 0;
  const chatPrice = data.chat_per_minute || 0;
  const sessionPrice = data.session_price || 0;
  const sessionDuration = data.session_duration || 30;

  const avgRating = Number(data.avg_rating) || 0;
  const totalReviews = data.total_reviews || 0;
  const followersCount = data.total_followers || 0;

  const totalExperience = data.total_experience || 0;
  const totalTime = data.total_time || 0;
  const chatTime = data.chat_time || 0;
  const callTime = data.call_time || 0;

  const hasSubscription = data.has_subscription || false;
  const categoryName = data.category_name || "";
  const subcategoryName = data.subcategory_name || "";
  const location = data.location || "";
  const isPremium = data.is_premium || false;
  const responseTime = data.avg_response_time || "< 1 min";
  const consultationCount = data.total_consultations || 0;

  // PRICING LOGIC
  const hasPerMinute = callPrice > 0 || chatPrice > 0;
  const hasSession = sessionPrice > 0;

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

  // Get lowest price for display
  const lowestPrice = useMemo(() => {
    if (hasPerMinute) {
      if (mode === "call") return callPrice;
      if (mode === "chat") return chatPrice;
    }
    if (hasSession) return sessionPrice;
    return 0;
  }, [hasPerMinute, hasSession, mode, callPrice, chatPrice, sessionPrice]);

  const handleStartChatLocal = useCallback(() => {
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
  }, [isLoggedIn, navigate, expertId, expertSlug, hasPerMinute, hasSession, hasSubscription, 
      chatPrice, sessionPrice, balance, userId, user, onStartChat]);

  const handleStartCallLocal = useCallback(() => {
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
  }, [isLoggedIn, navigate, expertId, expertSlug, hasPerMinute, hasSession, hasSubscription,
      callPrice, sessionPrice, balance, onStartCall]);

  const handleViewProfile = useCallback(() => {
    navigate(`/user/experts/${expertSlug}`);
  }, [expertSlug, navigate]);

  const handleRechargeClose = useCallback(() => {
    setShowRecharge(false);
    setRequiredAmount(0);
  }, []);

  const getButtonText = () => {
    if (mode === "chat") {
      if (hasPerMinute) return `Start Chat • ₹${chatPrice}/min`;
      if (hasSession) return `Book Session • ₹${sessionPrice}`;
      if (hasSubscription) return "View Membership Plans";
      return "Contact Expert";
    } else {
      if (hasPerMinute) return `Start Call • ₹${callPrice}/min`;
      if (hasSession) return `Book Session • ₹${sessionPrice}`;
      if (hasSubscription) return "View Membership Plans";
      return "Contact Expert";
    }
  };

  const isButtonDisabled = () => {
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
      >
        <Card>
          <ShineEffect isHovered={isHovered} />
          <GradientBorder isHovered={isHovered} />
          
          <CardInner>
            <CardHeader>
              <AvatarSection>
                <AvatarWrap $isAI={false} isHovered={isHovered}>
                  <AvatarImg src={data.profile_photo || DEFAULT_AVATAR} alt={data.name} />
                  <StatusDot $online={data.isOnline === true} />
                </AvatarWrap>
                
                {/* <QuickActions>
                  <ActionIcon onClick={() => setIsLiked(!isLiked)} isActive={isLiked}>
                    <FiHeart size={14} />
                  </ActionIcon>
                  <ActionIcon>
                    <FiShare2 size={14} />
                  </ActionIcon>
                </QuickActions> */}
              </AvatarSection>

              <ExpertInfo>
                <NameRow>
                  <Name>{data.name}</Name>
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
                  <Role>
                    {categoryName}
                    {subcategoryName && (
                      <>
                        <span style={{ margin: '0 4px' }}>•</span>
                        {subcategoryName}
                      </>
                    )}
                  </Role>
                )}

                <MetaRow>
                  {location && (
                    <MetaItem>
                      <FiMapPin size={12} />
                      {location}
                    </MetaItem>
                  )}
                  <MetaItem>
                    <RatingStar>★</RatingStar>
                    {avgRating ? avgRating.toFixed(1) : "New"} 
                    <span style={{ color: '#94a3b8' }}>({totalReviews})</span>
                  </MetaItem>
                  <MetaItem>
                    <FiUsers size={12} />
                    {followersCount.toLocaleString()} followers
                  </MetaItem>
                </MetaRow>

                <CategoryTags>
                  {/* {responseTime && (
                    <CategoryChip>
                      <FiClock size={10} /> Response: {responseTime}
                    </CategoryChip>
                  )} */}
                  {consultationCount > 0 && (
                    <CategoryChip>
                      <FiTrendingUp size={10} /> {consultationCount}+ consultations
                    </CategoryChip>
                  )}
                </CategoryTags>
              </ExpertInfo>
            </CardHeader>

            {/* Stats Grid */}
            <StatsGrid>
              {totalExperience > 0 && (
                <StatCard>
                  <FiClock size={16} />
                  <div>
                    <strong>{totalExperience}+</strong>
                    <span>Years Exp</span>
                  </div>
                </StatCard>
              )}
              {totalTime > 0 && (
                <StatCard>
                  <FiZap size={16} />
                  <div>
                    <strong>{totalTime}</strong>
                    <span>Total Min</span>
                  </div>
                </StatCard>
              )}
              {chatTime > 0 && (
                <StatCard>
                  <FiMessageSquare size={16} />
                  <div>
                    <strong>{chatTime}</strong>
                    <span>Chat Min</span>
                  </div>
                </StatCard>
              )}
              {callTime > 0 && (
                <StatCard>
                  <FiPhoneCall size={16} />
                  <div>
                    <strong>{callTime}</strong>
                    <span>Call Min</span>
                  </div>
                </StatCard>
              )}
            </StatsGrid>

            {/* Pricing Badges */}
            <PricingBadges>
              {hasPerMinute && (
                <PricingBadge type="per_minute">
                  <FiZap size={12} /> Flexible Pricing
                </PricingBadge>
              )}
              {hasSession && (
                <PricingBadge type="session">
                  <FiClock size={12} /> Session Based
                </PricingBadge>
              )}
              {hasSubscription && !hasPerMinute && !hasSession && (
                <PricingBadge type="plans">
                  <FiShield size={12} /> Subscription Plans
                </PricingBadge>
              )}
            </PricingBadges>

            {/* Price Display */}
            <PricingSection>
              {hasPerMinute ? (
                <PriceRow>
                  {callPrice > 0 && (
                    <div>
                      <PriceLabel>
                        <FiPhoneCall size={12} /> Call
                      </PriceLabel>
                      <PriceTag>
                        <PriceValue>₹{callPrice}</PriceValue>
                        <span>/min</span>
                      </PriceTag>
                    </div>
                  )}
                  {chatPrice > 0 && (
                    <div>
                      <PriceLabel>
                        <FiMessageSquare size={12} /> Chat
                      </PriceLabel>
                      <PriceTag>
                        <PriceValue>₹{chatPrice}</PriceValue>
                        <span>/min</span>
                      </PriceTag>
                    </div>
                  )}
                </PriceRow>
              ) : hasSession ? (
                <PriceRow $fullWidth>
                  <div>
                    <PriceLabel>
                      <FiClock size={12} /> Session Package
                    </PriceLabel>
                    <PriceTag>
                      <PriceValue>₹{sessionPrice}</PriceValue>
                      <span>/{sessionDuration}min session</span>
                    </PriceTag>
                  </div>
                </PriceRow>
              ) : hasSubscription ? (
                <PriceRow $fullWidth>
                  <div>
                    <PriceLabel>Membership Plans Available</PriceLabel>
                    <PriceTag $premium>
                      <FiZap size={14} /> Starting from ₹499/month
                    </PriceTag>
                  </div>
                </PriceRow>
              ) : (
                <PriceRow $fullWidth>
                  <div>
                    <PriceLabel>Custom Pricing</PriceLabel>
                    <PriceTag>Contact for quote</PriceTag>
                  </div>
                </PriceRow>
              )}
            </PricingSection>

            {/* Subscription Hint */}
            {hasSubscription && hasPerMinute && (
              <PricingInfo>
                <FiZap size={14} />
                <span>✨ Subscribe & save  on consultations!</span>
              </PricingInfo>
            )}

            {/* Action Buttons */}
            <ActionRow>
              <PrimaryBtn
                disabled={isButtonDisabled() }
                onClick={mode === "chat" ? handleStartChatLocal : handleStartCallLocal}
                whileTap={{ scale: 0.97 }}
              >
                {mode === "chat" ? <FiMessageSquare size={16} /> : <FiPhoneCall size={16} />}
                {getButtonText()}
              </PrimaryBtn>
              <GhostBtn onClick={handleViewProfile} whileTap={{ scale: 0.97 }}>
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

export default ExpertCard;