import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FiArrowLeft,
  FiPhoneCall,
  FiMessageSquare,
  FiStar,
  FiUserPlus,
  FiUserCheck,
  FiX,
  FiBell,
  FiCheck,
  FiCheckCircle,
  FiBookOpen,
  FiTarget,
  FiThumbsUp,
  FiClock,
  FiBriefcase,
  FiAward,
  FiTrendingUp,
  FiFileText,
  FiImage,
  FiHeart,
  FiMessageCircle,
  FiSend,
  FiLock,
  FiUnlock,
  FiCalendar,
  FiClock as FiTimeIcon,
  FiZap,
  FiInfo,
  FiVideo,
  FiPlay,
  FiArrowRight,
} from "react-icons/fi";

import { APP_CONFIG } from "../../../../config/appConfig";
import InquiryModal from "./InquiryModal";

import {
  PageWrap,
  FollowButton,
  VerifiedCheckIcon,
  ReviewForm,
  ReviewFormTitle,
  RatingInput,
  RatingLabel,
  TextAreaContainer,
  ReviewTextarea,
  FormActions,
  SubmitButton,
  DeleteButton,
  LoginPrompt,
  LoginButton,
  RecentReviewsTitle,
  LoadingReviews,
  NoReviews,
  UserAvatar,
  UserInfo,
  UserName,
  ReviewMeta,
  ReviewDate,
  ViewAllButton,
  LeftImage,
  Name,
  Role,
  Status,
  Section,
  SectionTitle,
  SectionBody,
  ActionButton,
  PriceTag,
  ReviewItem,
  ReviewUser,
  ReviewText,
  StarRating,
  Star,
  ProfileCard,
  StatItem,
  CallToAction,
  ReviewSection,
  ReviewHeader,
  ReviewList,
  QuickStats,
  TagList,
  Tag,
  AboutSubsection,
  AboutSubtitle,
  QualificationsList,
  QualificationItem,
  AvatarFallback,
  TabContainer,
  TabButton,
  TabContent,
  ExperienceCard,
  ExperienceHeader,
  ExperienceTitle,
  ExperienceCompany,
  ExperienceDate,
  ExperienceCertificate,
  PostGrid,
  PostCard,
  PostHeader,
  PostTitle,
  PostDescription,
  PostImage,
  PostStats,
  PostStat,
  PostActions,
  PostActionBtn,
  InfoGrid,
  InfoItem,
  InfoLabel,
  InfoValue,
  CommentsBox,
  CommentsList,
  CommentItem,
  CommentText,
  CommentMeta,
  InlineInput,
  SendBtn,
  RatingBox,
  StarsRow,
  StarBtn,
  UserReviewBox,
  SubscriptionCard,
  SubscriptionBadge,
  PlansContainer,
  PlanCard,
  PlanHeader,
  PlanName,
  PlanPrice,
  PlanDuration,
  PlanFeatures,
  PlanFeature,
  SubscribeButton,
  ActiveSubscriptionCard,
  SubscriptionInfo,
  SubscriptionRemaining,
  ProgressBar,
  UsageText,
  PricingModeTabs,
  PricingModeTab,
  PricingInfo,
  ReelsGrid,
  ReelGridCard,
  ReelThumbnail,
  ReelVideoPreview,
  ReelOverlay,
  ReelPlayIcon,
  ReelMetaInfo,
  ReelCaption,
} from "./ExpertProfile.styles";

import {
  followExpertApi,
  unfollowExpertApi,
  getExpertFollowersApi,
} from "../../../../shared/api/expertapi/follower.api";

import {
  addOrUpdateReviewApi,
  getReviewsByExpertApi,
  deleteReviewApi,
} from "../../../../shared/api/expertapi/reviews.api";

import { getExpertExperienceApi } from "../../../../shared/api/expertapi/experience.api";
import { 
  getExpertFeedApi,
  likePostApi, 
  unlikePostApi,
  getCommentsApi,
  addCommentApi,
} from "../../../../shared/api/expertapi/post.api";
import { getPublicReelsByExpertIdApi } from "../../../../shared/api/reels.api";
import { usePublicExpert as useExpert } from "../../context/PublicExpertContext";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import { useWallet } from "../../../../shared/context/WalletContext";
import AddBalancePopup from "../../components/AddBalancePopup/AddBalancePopup";
import useNetworkReconnect from "../../../../shared/hooks/useNetworkReconnect";
import { socket } from "../../../../shared/api/socket";
import { 
  getPlansApi, 
  buySubscriptionApi, 
  getMySubscriptionApi 
} from "../../../../shared/api/userApi/subscription.api";
import useChatRequest from "../../../../shared/hooks/useChatRequest";
import { buildTrackingPayload, trackLeadEvent } from "../../../../shared/utils/leadTracking";
import VideoCallButton from "../../../../shared/components/VideoCallButton";
import { normalizeVideoCallPrice } from "../../../../shared/utils/normalizeExpertPrice";

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

const resolveMediaUrl = (url) => {
  if (!url) return "";
  const cleanUrl = String(url).trim().replace(/\\/g, "/");
  if (/^(https?:)?\/\//i.test(cleanUrl) || cleanUrl.startsWith("data:") || cleanUrl.startsWith("blob:")) {
    return cleanUrl;
  }
  const apiBase = APP_CONFIG?.API_BASE_URL || "http://localhost:5000/api";
  const apiOrigin = apiBase.replace(/\/api\/?$/, "");
  
  if (cleanUrl.startsWith("/api/uploads/")) {
    return `${apiOrigin}${cleanUrl.replace(/^\/api/, "")}`;
  }
  if (cleanUrl.startsWith("api/uploads/")) {
    return `${apiOrigin}/${cleanUrl.replace(/^api\//, "")}`;
  }
  if (cleanUrl.startsWith("/uploads/")) {
    return `${apiOrigin}${cleanUrl}`;
  }
  if (cleanUrl.startsWith("uploads/")) {
    return `${apiOrigin}/${cleanUrl}`;
  }
  if (cleanUrl.startsWith("/")) {
    return `${apiOrigin}${cleanUrl}`;
  }
  return `${apiOrigin}/uploads/${cleanUrl}`;
};

const DEFAULT_AVATAR = "https://i.pravatar.cc/300?img=12";
const MIN_CHAT_MINUTES = 5;
const isEnabledFlag = (value) =>
  value === true ||
  value === 1 ||
  value === "1" ||
  String(value || "").toLowerCase() === "true";

const firstDefined = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

const resolveProfilePageButtonVisibility = (expertData, feature) => {
  // Fix: We intentionally ignore `effective_access` here because visibility on the 
  // profile page should depend ONLY on the Admin Expert Access Settings, 
  // not on whether the expert has purchased a plan/subscription.
  const rawValue =
    feature === "chat"
      ? firstDefined(
          expertData?.show_chat_button_on_profile_page,
          expertData?.showChatButtonOnProfilePage,
          expertData?.profile?.show_chat_button_on_profile_page,
          expertData?.profile?.showChatButtonOnProfilePage,
          expertData?.show_chat_button,
          expertData?.showChatButton
        )
      : feature === "video"
      ? firstDefined(
          expertData?.show_video_button_on_profile_page,
          expertData?.showVideoButtonOnProfilePage,
          expertData?.profile?.show_video_button_on_profile_page,
          expertData?.profile?.showVideoButtonOnProfilePage,
          expertData?.show_video_call_button,
          expertData?.showVideoCallButton,
          expertData?.show_video_button,
          expertData?.showVideoButton,
          expertData?.allow_video_call,
          expertData?.allowVideoCall,
          expertData?.video_call_enabled,
          expertData?.videoCallEnabled,
          expertData?.can_video_call,
          expertData?.canVideoCall,
          expertData?.profile?.show_video_button,
          expertData?.profile?.showVideoButton,
          expertData?.profile?.can_video_call,
          expertData?.profile?.canVideoCall
        )
      : firstDefined(
          expertData?.show_call_button_on_profile_page,
          expertData?.showCallButtonOnProfilePage,
          expertData?.profile?.show_call_button_on_profile_page,
          expertData?.profile?.showCallButtonOnProfilePage,
          expertData?.show_call_button,
          expertData?.showCallButton
        );

  const result = rawValue === undefined ? true : isEnabledFlag(rawValue);
  console.log(`🔍 [PROFILE VISIBILITY LOG] Feature: ${feature}, rawValue: ${rawValue}, evaluatedResult: ${result}`);
  return result;
};

// Helper function to get post ID consistently
const getPostId = (post) => post?.id || post?.post_id;

const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();

  const diffMs = now - date;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const years = Math.floor(days / 365);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (weeks < 52) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  return `${years} year${years > 1 ? "s" : ""} ago`;
};

const ExpertProfilePage = () => {
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const routerLocation = useLocation();

  useEffect(() => {
    if (routerLocation.search.includes("open_inquiry=true")) {
      setIsInquiryModalOpen(true);
    }
  }, [routerLocation.search]);
  const { slug } = useParams();
  const navigate = useNavigate();

  const { t } = useTranslation();
  const { isLoggedIn, user } = useAuth();
  const userId = user?.id;
  const { balance, fetchWallet, addMoney, createOrder } = useWallet();
  const {
    expertData,
    expertPrice,
    fetchProfile,
    fetchPrice,
    profileLoading,
    priceLoading,
  } = useExpert();

  const profile = expertData?.profile;
  const price = expertPrice || {};
  const expertiseGroups = Array.isArray(profile?.expertise) ? profile.expertise : [];
  const primaryExpertise = profile?.primary_expertise || expertiseGroups
    .flatMap((group) => (group.subcategories || []).map((sub) => ({ group, sub })))
    .find(({ sub }) => sub?.is_primary);
  const displayCategoryName = primaryExpertise?.category_name || primaryExpertise?.group?.category_name || profile?.category_name;
  const displaySubcategoryName = primaryExpertise?.subcategory_name || primaryExpertise?.sub?.subcategory_name || profile?.subcategory_name;
  const numericExpertId = expertData?.expertId || null;

  const parseList = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) {
      return data
        .flatMap(item => {
          if (!item) return [];
          if (typeof item === "string") return item.split(/[,;\n]+/);
          const str = item.name || item.title || item.degree || item.skill_name || "";
          return str.split(/[,;\n]+/);
        })
        .map(s => s.trim())
        .filter(Boolean);
    }
    if (typeof data === "string") {
      return data
        .split(/[,;\n]+/)
        .map(s => s.trim())
        .filter(Boolean);
    }
    return [];
  };

  const qualificationItems = useMemo(() => {
    return Array.from(
      new Set([
        ...parseList(profile?.education),
        ...parseList(profile?.qualifications)
      ])
    );
  }, [profile?.education, profile?.qualifications]);

  const skillItems = useMemo(() => {
    return Array.from(
      new Set(parseList(profile?.skills))
    );
  }, [profile?.skills]);

  const hasExpertiseOrSkills = Boolean(
    displayCategoryName ||
    displaySubcategoryName ||
    profile?.position ||
    skillItems.length > 0
  );
  const showProfileChatButton = useMemo(() => resolveProfilePageButtonVisibility(expertData, "chat"), [expertData]);
  const showProfileCallButton = useMemo(() => resolveProfilePageButtonVisibility(expertData, "call"), [expertData]);
  const showProfileVideoButton = useMemo(() => resolveProfilePageButtonVisibility(expertData, "video"), [expertData]);
  const canShowUserChatButton = Boolean(numericExpertId) && showProfileChatButton;
  const canShowUserCallButton = Boolean(numericExpertId) && showProfileCallButton;
  const canShowUserVideoButton = Boolean(numericExpertId) && showProfileVideoButton;
  const chatDisabledReason = "Expert unavailable";
  const callDisabledReason = "Expert unavailable";
  const videoDisabledReason = "Expert unavailable";

  // REMOVED: chatRequestId, showWaitingPopup, waitingText, showChatCancelled, chatRejectedMessage, requestingChat, requestIdRef

  // Tab states
  const [following, setFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [userReviewText, setUserReviewText] = useState("");
  const [showRecharge, setShowRecharge] = useState(false);
  const [requiredAmount, setRequiredAmount] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isExpertOnline, setIsExpertOnline] = useState(false);
  const [calling, setCalling] = useState(false);
  const successTimeoutRef = useRef(null);
  const profileTrackedRef = useRef(null);

  // Tab states
  const [activeTab, setActiveTab] = useState("about");
  const [experienceData, setExperienceData] = useState(null);
  const [experienceList, setExperienceList] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loadingExperience, setLoadingExperience] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [reels, setReels] = useState([]);
  const [loadingReels, setLoadingReels] = useState(false);
  const [expertServices, setExpertServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [totalExperienceText, setTotalExperienceText] = useState("");
  
  // NEW: Pricing mode selection state
  const [selectedPricingMode, setSelectedPricingMode] = useState("per_minute");
  
  // Subscription states
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [loadingSubscription, setLoadingSubscription] = useState(false);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [purchasingPlan, setPurchasingPlan] = useState(null);
  const [showSubscribeSuccess, setShowSubscribeSuccess] = useState(false);
  const [purchaseError, setPurchaseError] = useState(null);
  
  // Post interaction states
  const [liked, setLiked] = useState({});
  const [activeSection, setActiveSection] = useState(null);
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [expertReviewStats, setExpertReviewStats] = useState({});

  // Use chat request hook
  const {
    startChat,
    ChatPopups,
  } = useChatRequest();

  // Memoized computed values
  const hasUserReview = useMemo(() => 
    Boolean(userId && reviews.some((r) => Number(r.user_id) === Number(userId))),
  [userId, reviews]
  );
  const formattedAvgRating = useMemo(() => {
    const numericRating = Number(avgRating);
    return Number.isFinite(numericRating) ? numericRating.toFixed(1) : "0.0";
  }, [avgRating]);
  const recentReviews = useMemo(() => reviews.slice(0, 3), [reviews]);

  // Get pricing modes from expert price data
  const pricingModes = useMemo(() => {
    if (!expertPrice?.pricing_modes) return [];

    const normalizeMode = (mode) => {
      if (typeof mode === "string") return mode.trim().toLowerCase();
      if (mode && typeof mode === "object") {
        return String(
          mode.id ||
          mode.mode ||
          mode.type ||
          mode.name ||
          mode.pricing_mode ||
          ""
        ).trim().toLowerCase();
      }
      return "";
    };

    if (Array.isArray(expertPrice.pricing_modes)) {
      return expertPrice.pricing_modes
        .map(normalizeMode)
        .filter(Boolean);
    }

    if (typeof expertPrice.pricing_modes === 'string') {
      try {
        const parsedModes = JSON.parse(expertPrice.pricing_modes);
        return Array.isArray(parsedModes)
          ? parsedModes.map(normalizeMode).filter(Boolean)
          : [normalizeMode(parsedModes)].filter(Boolean);
      } catch {
        return expertPrice.pricing_modes
          .split(",")
          .map(normalizeMode)
          .filter(Boolean);
      }
    }

    return [];
  }, [expertPrice]);

  // Get display prices based on pricing modes
  const displayPrices = useMemo(() => {
    const prices = {
      hasPerMinute: false,
      hasSession: false,
      hasSubscription: false,
      callPrice: 0,
      videoCallPrice:
        normalizeVideoCallPrice(expertPrice) ||
        normalizeVideoCallPrice(expertData) ||
        normalizeVideoCallPrice(expertData?.profile) ||
        normalizeVideoCallPrice(profile) ||
        Number(
          expertPrice?.video_call_price ||
          expertPrice?.video_call_per_minute ||
          expertPrice?.videoCallPrice ||
          expertPrice?.videoCallPerMinute ||
          expertData?.video_call_per_minute ||
          expertData?.videoCallPerMinute ||
          profile?.video_call_per_minute ||
          profile?.videoCallPerMinute ||
          expertPrice?.call ||
          50
        ),
      chatPrice: 0,
      sessionPrice: 0,
      sessionDuration: 0
    };

    if (pricingModes.includes('per_minute')) {
      prices.hasPerMinute = true;
      prices.callPrice = Number(expertPrice?.call || 0);
      prices.chatPrice = Number(expertPrice?.chat || 0);
    }

    if (pricingModes.includes('session')) {
      prices.hasSession = true;
      prices.sessionPrice = Number(expertPrice?.session?.price || 0);
      prices.sessionDuration = Number(expertPrice?.session?.duration || 0);
    }

    if (pricingModes.includes('subscription') || (plans && plans.length > 0)) {
      prices.hasSubscription = true;
    }

    return prices;
  }, [pricingModes, expertPrice, expertData, profile, plans]);

  const hasActiveSubscription = useMemo(() => {
    if (!activeSubscription) return false;
    return activeSubscription.status === 'active' && new Date(activeSubscription.end_date) > new Date();
  }, [activeSubscription]);

  const getCompactActionPrice = useCallback((type) => {
    if (hasActiveSubscription) return "Free";
    if (selectedPricingMode === "session" && displayPrices.hasSession) return `\u20B9${displayPrices.sessionPrice}`;
    if (type === "chat") {
      return displayPrices.chatPrice > 0 ? `\u20B9${displayPrices.chatPrice}/min` : "--";
    }
    if (type === "call") {
      return displayPrices.callPrice > 0 ? `\u20B9${displayPrices.callPrice}/min` : "--";
    }
    return displayPrices.videoCallPrice > 0 ? `\u20B9${displayPrices.videoCallPrice}/min` : "--";
  }, [displayPrices, hasActiveSubscription, selectedPricingMode]);

  useEffect(() => {
    if (!numericExpertId || profileTrackedRef.current === numericExpertId) return;
    profileTrackedRef.current = numericExpertId;
    trackLeadEvent(
      "profile-view",
      buildTrackingPayload({
        user,
        sourcePage: "expert_profile",
        actionLabel: "Expert Profile Open",
        extra: {
          expert_id: numericExpertId,
          category_id: profile?.category_id || expertData?.category_id || null,
          subcategory_id: profile?.subcategory_id || expertData?.subcategory_id || null,
          city: user?.city || "",
          area: user?.area || "",
        },
      })
    );
  }, [numericExpertId, profile?.category_id, profile?.subcategory_id, expertData, user]);
  
  // Get current pricing info based on selected mode
  const currentPricingInfo = useMemo(() => {
    if (hasActiveSubscription) {
      return {
        mode: "subscription",
        price: 0,
        callPrice: 0,
        label: "Free (Active Subscription)",
        isFree: true
      };
    }

    switch(selectedPricingMode) {
      case "per_minute":
        return {
          mode: "per_minute",
          price: displayPrices.chatPrice,
          callPrice: displayPrices.callPrice,
          label: `₹${displayPrices.chatPrice}/min`,
          isFree: false
        };
      case "session":
        return {
          mode: "session",
          price: displayPrices.sessionPrice,
          callPrice: displayPrices.sessionPrice,
          duration: displayPrices.sessionDuration,
          label: `₹${displayPrices.sessionPrice} for ${displayPrices.sessionDuration} min`,
          isFree: false
        };
      case "subscription":
        return {
          mode: "subscription",
          price: 0,
          callPrice: 0,
          label: "Subscription Plan",
          isFree: true
        };
      default:
        return {
          mode: "per_minute",
          price: displayPrices.chatPrice,
          callPrice: displayPrices.callPrice,
          label: `₹${displayPrices.chatPrice}/min`,
          isFree: false
        };
    }
  }, [selectedPricingMode, displayPrices, hasActiveSubscription]);

  // Get available pricing modes for tabs
  const availablePricingModes = useMemo(() => {
    const modes = [];
    if (displayPrices.hasPerMinute) modes.push({ id: "per_minute", label: "Per Minute", icon: <FiClock size={14} /> });
    if (displayPrices.hasSession) modes.push({ id: "session", label: "Session", icon: <FiCalendar size={14} /> });
    if (displayPrices.hasSubscription && !hasActiveSubscription) modes.push({ id: "subscription", label: "Subscribe", icon: <FiZap size={14} /> });
    return modes;
  }, [displayPrices, hasActiveSubscription]);

  useEffect(() => {
    if (!availablePricingModes.length) return;
    const selectedModeExists = availablePricingModes.some((mode) => mode.id === selectedPricingMode);
    if (!selectedModeExists) {
      setSelectedPricingMode(availablePricingModes[0].id);
    }
  }, [availablePricingModes, selectedPricingMode]);

  const getRemainingPercentage = useCallback(() => {
    if (!activeSubscription) return 0;
    
    if (activeSubscription.remaining_total_minutes !== null && activeSubscription.plan_minutes_limit) {
      return (activeSubscription.remaining_total_minutes / activeSubscription.plan_minutes_limit) * 100;
    }
    if (activeSubscription.remaining_calls !== null && activeSubscription.plan_calls_limit) {
      return (activeSubscription.remaining_calls / activeSubscription.plan_calls_limit) * 100;
    }
    return 0;
  }, [activeSubscription]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Fetch subscription plans
  const fetchPlans = useCallback(async () => {
    if (!numericExpertId) return;
    setLoadingPlans(true);
    try {
      const response = await getPlansApi(numericExpertId);
      if (response.data.success) {
        setPlans(response.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch plans:", error);
      setPlans([]);
    } finally {
      setLoadingPlans(false);
    }
  }, [numericExpertId]);

  // Fetch user's active subscription for this expert
  const fetchActiveSubscription = useCallback(async () => {
    if (!isLoggedIn || !userId || !numericExpertId) return;
    setLoadingSubscription(true);
    try {
      const response = await getMySubscriptionApi(numericExpertId);
      if (response.data.success) {
        setActiveSubscription(response.data.data);
      } else {
        setActiveSubscription(null);
      }
    } catch (error) {
      console.error("Failed to fetch subscription:", error);
      setActiveSubscription(null);
    } finally {
      setLoadingSubscription(false);
    }
  }, [isLoggedIn, userId, numericExpertId]);

  // Handle buying subscription
  const handleBuySubscription = useCallback(async (plan) => {
    setPurchaseError(null);
    
    if (!isLoggedIn) {
      setShowPlansModal(false);
      navigate("/user/auth", { state: { from: routerLocation } });
      return;
    }

    if (hasActiveSubscription) {
      setShowPlansModal(false);
      alert("You already have an active subscription for this expert.");
      return;
    }

    const userBalance = Number(balance || 0);
    if (userBalance < plan.price) {
      setShowPlansModal(false);
      setRequiredAmount(plan.price - userBalance);
      setShowRecharge(true);
      return;
    }

    setShowPlansModal(false);
    setPurchasingPlan(plan.id);
    try {
      const response = await buySubscriptionApi(plan.id);
      if (response.data.success) {
        setShowSubscribeSuccess(true);
        await fetchActiveSubscription();
        await fetchWallet();
        
        // Auto close success modal after 3 seconds
        if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
        successTimeoutRef.current = setTimeout(() => {
          setShowSubscribeSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Failed to buy subscription:", error);
      const errorMsg = error.response?.data?.message || "Failed to purchase subscription";
      setPurchaseError(errorMsg);
      // Show error for 3 seconds then clear
      setTimeout(() => setPurchaseError(null), 3000);
    } finally {
      setPurchasingPlan(null);
    }
  }, [isLoggedIn, navigate, routerLocation, balance, hasActiveSubscription, fetchActiveSubscription, fetchWallet]);

  // Fetch experience data
  const fetchExperience = useCallback(async () => {
    if (!numericExpertId) return;
    setLoadingExperience(true);
    try {
      const response = await getExpertExperienceApi(numericExpertId);
      if (response.success) {
        setExperienceData(response.total_experience);
        setExperienceList(response.experience || []);
        if (response.total_text) {
          setTotalExperienceText(response.total_text);
        } else if (response.total_experience?.total_text) {
          setTotalExperienceText(response.total_experience.total_text);
        }
      }
    } catch (error) {
      console.error("Failed to fetch experience:", error);
    } finally {
      setLoadingExperience(false);
    }
  }, [numericExpertId]);

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    if (!numericExpertId) return;

    setLoadingPosts(true);

    try {
      const response = await getExpertFeedApi(numericExpertId, userId);

      if (response.data?.success) {
        const postsData = response.data.data || [];
        setPosts(postsData);

        // liked map from backend
        const likedMap = {};
        postsData.forEach(post => {
          const postId = getPostId(post);
          likedMap[postId] = !!post.is_liked;
        });
        setLiked(likedMap);

        // review stats (same)
        try {
          const reviewRes = await getReviewsByExpertApi(numericExpertId);
          const reviewData = reviewRes.data.data || {};
          setExpertReviewStats({
            avg: Number(reviewData.avg_rating || 0),
            total: reviewData.total_reviews || 0
          });
        } catch (error) {
          console.error("Failed to fetch review stats:", error);
        }
      }

    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoadingPosts(false);
    }
  }, [numericExpertId, userId]);

  // Fetch reels
  const fetchReels = useCallback(async () => {
    if (!numericExpertId) return;

    setLoadingReels(true);

    try {
      const response = await getPublicReelsByExpertIdApi(numericExpertId);

      if (response.data?.success) {
        setReels(response.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch reels:", error);
    } finally {
      setLoadingReels(false);
    }
  }, [numericExpertId]);

  // Fetch services offered by expert
  const fetchServices = useCallback(async () => {
    if (!numericExpertId) return;

    setLoadingServices(true);

    try {
      const response = await apiFetch(`/api/expert-activations/expert/${numericExpertId}/services`);
      const data = await response.json();

      if (data?.success) {
        setExpertServices(data.data || []);
      } else {
        setExpertServices([]);
      }
    } catch (error) {
      console.error("Failed to fetch expert services:", error);
      setExpertServices([]);
    } finally {
      setLoadingServices(false);
    }
  }, [numericExpertId]);

  const toggleLike = async (post) => {
    if (!isLoggedIn || !userId) return;

    const postId = getPostId(post);
    const isLiked = liked[postId];

    // Optimistic update
    setLiked(prev => ({
      ...prev,
      [postId]: !isLiked
    }));

    setPosts(prev =>
      prev.map(p => {
        const pId = getPostId(p);
        if (pId === postId) {
          return {
            ...p,
            likes: p.likes + (isLiked ? -1 : 1)
          };
        }
        return p;
      })
    );

    try {
      let res;

      if (isLiked) {
        res = await unlikePostApi({ post_id: postId, user_id: userId });
      } else {
        res = await likePostApi({ post_id: postId, user_id: userId });
      }

      // Sync with backend
      setPosts(prev =>
        prev.map(p => {
          const pId = getPostId(p);
          if (pId === postId) {
            return {
              ...p,
              likes: res.data.likes
            };
          }
          return p;
        })
      );

    } catch (err) {
      console.error("Like error:", err);

      // rollback
      setLiked(prev => ({
        ...prev,
        [postId]: isLiked
      }));

      setPosts(prev =>
        prev.map(p => {
          const pId = getPostId(p);
          if (pId === postId) {
            return {
              ...p,
              likes: p.likes + (isLiked ? 1 : -1)
            };
          }
          return p;
        })
      );
    }
  };

  const toggleSection = async (section, postId) => {
    const key = `${section}-${postId}`;
    if (activeSection === key) {
      setActiveSection(null);
      return;
    }

    setActiveSection(key);

    if (section === "comments" && !comments[postId]) {
      try {
        const res = await getCommentsApi(postId);
        setComments((p) => ({ ...p, [postId]: res.data.data || [] }));
      } catch (e) {
        console.error("Get comments error:", e);
      }
    }
  };

  const submitComment = async (post) => {
    const postId = getPostId(post);
    const text = commentText[postId]?.trim();
    if (!text) return;

    try {
      const res = await addCommentApi({
        post_id: postId,
        expert_id: numericExpertId,
        comment: text
      });

      const newComment = {
        id: res.data.data?.id || Date.now(),
        comment: text,
        user_id: userId,
        created_at: new Date().toISOString()
      };

      // Update posts count
      setPosts(prev =>
        prev.map(p => {
          const pId = getPostId(p);
          if (pId === postId) {
            return { ...p, comments_count: (p.comments_count || 0) + 1 };
          }
          return p;
        })
      );

      // Instant UI update
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment]
      }));

      setCommentText(prev => ({ ...prev, [postId]: "" }));

    } catch (err) {
      console.error("Add comment error:", err);
    }
  };

  // Followers & reviews loader
  const loadFollowersAndReviews = useCallback(() => {
    if (!numericExpertId) return;

    getExpertFollowersApi(numericExpertId)
      .then((res) => {
        const followers = res.data.followers || [];
        setFollowersCount(res.data.total_followers || followers.length);
        setFollowing(followers.some((f) => Number(f.id) === Number(userId)));
      })
      .catch((err) => console.error("Followers fetch failed", err));

    setLoadingReviews(true);
    getReviewsByExpertApi(numericExpertId)
      .then((res) => {
        const data = res.data.data || {};
        const list = data.reviews || [];
        setReviews(list);
        setTotalReviews(data.total_reviews || list.length || 0);
        setAvgRating(Number(data.avg_rating || 0));

        if (userId) {
          const mine = list.find((r) => Number(r.user_id) === Number(userId));
          setUserRating(mine ? mine.rating_number || 0 : 0);
          setUserReviewText(mine?.review_text || "");
        } else {
          setUserRating(0);
          setUserReviewText("");
        }
      })
      .catch((err) => {
        console.error("Reviews fetch failed", err);
        setReviews([]);
        setTotalReviews(0);
        setAvgRating(0);
      })
      .finally(() => setLoadingReviews(false));
  }, [numericExpertId, userId]);

  // Expert status listener (PRESERVED)
  useEffect(() => {
    if (!socket.connected) socket.connect();
    const handleExpertOnline = ({ expert_id }) => {
      if (Number(expert_id) === numericExpertId) setIsExpertOnline(true);
    };
    const handleExpertOffline = ({ expert_id }) => {
      if (Number(expert_id) === numericExpertId) setIsExpertOnline(false);
    };

    socket.on("expert_online", handleExpertOnline);
    socket.on("expert_offline", handleExpertOffline);

    return () => {
      socket.off("expert_online", handleExpertOnline);
      socket.off("expert_offline", handleExpertOffline);
    };
  }, [numericExpertId]);

  useEffect(() => {
    if (expertData?.profile?.is_online !== undefined) {
      setIsExpertOnline(expertData.profile.is_online);
    }
  }, [expertData]);

  useEffect(() => {
    if (!numericExpertId) return;
    socket.emit("check_expert_online", { expertId: numericExpertId });
    socket.on("expert_status", ({ expertId, online }) => {
      if (Number(expertId) === numericExpertId) setIsExpertOnline(online);
    });
    return () => socket.off("expert_status");
  }, [numericExpertId]);

  // Profile data fetch
  useEffect(() => {
    if (slug) {
      fetchProfile(slug);
    }
  }, [slug, fetchProfile]);



  useEffect(() => {
    if (numericExpertId) {
      fetchExperience();
      fetchServices();
    }
  }, [numericExpertId, fetchExperience, fetchServices]);

  useEffect(() => {
    if (activeTab === "posts") fetchPosts();
    if (activeTab === "reels") fetchReels();
    if (activeTab === "services") fetchServices();
  }, [activeTab, fetchPosts, fetchReels, fetchServices]);

  useEffect(() => {
    if (numericExpertId) {
      fetchPlans();
    }

    if (numericExpertId && isLoggedIn) {
      fetchActiveSubscription();
    }
  }, [numericExpertId, isLoggedIn, fetchPlans, fetchActiveSubscription]);
  
  useEffect(() => {
    loadFollowersAndReviews();
  }, [loadFollowersAndReviews]);

  // Network reconnect - REMOVED showWaitingPopup && requestingChat dependency
  useNetworkReconnect(() => {
    if (slug) {
      fetchProfile(slug);
    }

    if (numericExpertId) {
      fetchPrice(numericExpertId);
      fetchExperience();
      loadFollowersAndReviews();

      if (activeTab === "posts") {
        fetchPosts();
      }
      if (activeTab === "reels") {
        fetchReels();
      }

      fetchPlans();

      if (isLoggedIn) {
        fetchActiveSubscription();
      }
    }
  }, {
    enabled: Boolean(slug || numericExpertId),
  });

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if ((!showPlansModal && !showRecharge) || typeof document === "undefined") return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;
      if (showPlansModal) setShowPlansModal(false);
      if (showRecharge) setShowRecharge(false);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showPlansModal, showRecharge]);

  // Handle start call/chat with selected pricing mode
  const handleStart = useCallback((type) => {
    if (!numericExpertId) return;

    if (type === "chat" && !canShowUserChatButton) {
      alert("Chat is currently unavailable for this expert.");
      return;
    }

    if (type === "call" && !canShowUserCallButton) {
      alert("Call is currently unavailable for this expert.");
      return;
    }

    const trackActionableLead = () => {
      trackLeadEvent(
        type === "chat" ? "chat-attempt" : "call-attempt",
        buildTrackingPayload({
          user,
          sourcePage: "expert_profile",
          actionLabel: type === "chat" ? "Chat Now" : "Call Now",
          extra: {
            expert_id: numericExpertId,
            category_id: profile?.category_id || expertData?.category_id || null,
            subcategory_id: profile?.subcategory_id || expertData?.subcategory_id || null,
            city: user?.city || "",
            area: user?.area || "",
            contact_consent: true,
            can_show_contact_to_expert: true,
          },
        })
      );
    };

    trackActionableLead();

    if (!isLoggedIn) {
      navigate("/user/auth", { state: { from: routerLocation } });
      return;
    }

    // If has active subscription, use subscription mode
    if (hasActiveSubscription) {
      if (type === "chat" && numericExpertId) {
        startChat({
          expertId: numericExpertId,
          chatPrice: 0,
          pricingMode: "subscription",
        });
      } else if (type === "call" && numericExpertId) {
        navigate(`/user/voice-call/${numericExpertId}`, {
          state: { 
            fromProfile: true, 
            pricingMode: "subscription",
            expertName: profile?.name,
            expertImage: profile?.profile_photo
          },
        });
      }
      return;
    }

    // Use selected pricing mode
    const pricingMode = currentPricingInfo.mode;
    
    if (pricingMode === "subscription") {
      // Show plans modal if no active subscription
      setShowPlansModal(true);
      return;
    }

    if (pricingMode === "session") {
      // Handle session booking
      const sessionPrice = currentPricingInfo.price;
      const userBalance = Number(balance || 0);

      if (userBalance >= sessionPrice) {
        if (type === "chat" && numericExpertId) {
          startChat({
            expertId: numericExpertId,
            chatPrice: sessionPrice,
            pricingMode: "session",
          });
        } else if (type === "call" && numericExpertId) {
          navigate(`/user/voice-call/${numericExpertId}`, {
            state: { 
              fromProfile: true, 
              pricingMode: "session",
              sessionPrice: sessionPrice,
              sessionDuration: currentPricingInfo.duration,
              expertName: profile?.name,
              expertImage: profile?.profile_photo
            },
          });
        }
      } else {
        setRequiredAmount(Math.max(0, sessionPrice - userBalance));
        setShowRecharge(true);
      }
      return;
    }

    if (pricingMode === "per_minute") {
      const perMinutePrice = type === "chat" ? currentPricingInfo.price : currentPricingInfo.callPrice;
      const minRequired = perMinutePrice * MIN_CHAT_MINUTES;
      const userBalance = Number(balance || 0);

      if (userBalance >= minRequired) {
        if (type === "chat" && numericExpertId) {
          startChat({
            expertId: numericExpertId,
            chatPrice: perMinutePrice,
            pricingMode: "per_minute",
          });
        } else if (type === "call" && numericExpertId) {
          navigate(`/user/voice-call/${numericExpertId}`, {
            state: { 
              fromProfile: true, 
              pricingMode: "per_minute",
              callPrice: perMinutePrice,
              expertName: profile?.name,
              expertImage: profile?.profile_photo
            },
          });
        }
      } else {
        setRequiredAmount(Math.max(0, minRequired - userBalance));
        setShowRecharge(true);
      }
    }
  }, [isLoggedIn, navigate, routerLocation, displayPrices, balance, userId, numericExpertId, canShowUserChatButton, canShowUserCallButton, hasActiveSubscription, currentPricingInfo, profile, expertData, startChat, user]);

  const handleFollowAction = useCallback(async () => {
    if (!isLoggedIn || !userId || !numericExpertId) {
      navigate("/user/auth", { state: { from: routerLocation } });
      return;
    }

    try {
      if (!following) {
        await followExpertApi({ user_id: userId, expert_id: numericExpertId });
        setFollowing(true);
        setFollowersCount((c) => c + 1);
      } else {
        setShowUnfollowModal(true);
      }
    } catch (err) {
      console.error("Follow error:", err);
      alert("Follow failed. Please try again.");
    }
  }, [isLoggedIn, userId, numericExpertId, following, navigate]);

  const handleUnfollowConfirm = useCallback(async () => {
    try {
      await unfollowExpertApi({ user_id: userId, expert_id: numericExpertId });
      setFollowing(false);
      setFollowersCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error("Unfollow error:", err);
      alert("Unfollow failed. Please try again.");
    } finally {
      setShowUnfollowModal(false);
    }
  }, [isLoggedIn, userId, numericExpertId, navigate, routerLocation, following]);

  const handleSubmitReview = useCallback(async (e) => {
    e.preventDefault();
    if (!isLoggedIn || !userId || !userRating) {
      alert("Please login and select a rating");
      return;
    }

    setSubmittingReview(true);
    try {
      await addOrUpdateReviewApi({
        user_id: userId,
        expert_id: numericExpertId,
        rating_number: userRating,
        review_text: userReviewText.trim(),
      });
      await loadFollowersAndReviews();
      setUserReviewText("");
    } catch (err) {
      console.error("Review error:", err);
      alert("Review failed. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  }, [isLoggedIn, userId, userRating, userReviewText, numericExpertId, loadFollowersAndReviews]);

  const handleDeleteReview = useCallback(async () => {
    if (!confirm("Delete your review?")) return;
    try {
      await deleteReviewApi(numericExpertId);
      setUserRating(0);
      setUserReviewText("");
      await loadFollowersAndReviews();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed. Please try again.");
    }
  }, [numericExpertId, loadFollowersAndReviews]);

  const handleStarClick = useCallback((rating) => setUserRating(rating), []);
  
  const handleRechargeClose = useCallback(() => {
    setShowRecharge(false);
    setRequiredAmount(0);
  }, []);

  const handleProfileRechargeConfirm = useCallback(async (paymentData) => {
    const result = await addMoney(paymentData);

    if (result?.success) {
      setShowRecharge(false);
      setRequiredAmount(0);
      await fetchWallet();
    }

    return result;
  }, [addMoney, fetchWallet]);

  const handleUnfollowClose = useCallback(() => setShowUnfollowModal(false), []);

  // Close success modal on click anywhere
  const handleSuccessModalClick = useCallback(() => {
    setShowSubscribeSuccess(false);
    if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
  }, []);

  const getInitials = (name = "") => {
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + (words[1]?.charAt(0) || "")).toUpperCase();
  };

  const Spinner = () => (
    <div style={{
      width: 28, height: 28, border: "3px solid #e2e8f0",
      borderTopColor: "#0ea5e9", borderRadius: "50%",
      animation: "spin 0.8s linear infinite", margin: "0 auto",
    }} />
  );

  if (profileLoading || priceLoading) {
    return <div style={{ padding: 30, textAlign: "center" }}>Loading expert...</div>;
  }

  if (!expertData?.profile) {
    return <div style={{ padding: 30, textAlign: "center" }}>Expert not found.</div>;
  }

  return (
    <>
      <style>{`
        html { scroll-behavior: smooth; }
        @media (max-width: 768px) {
          .mobile-inquiry-action-container {
            display: flex !important;
            margin-top: 16px;
            margin-bottom: 8px;
            padding: 0 4px;
            width: 100%;
          }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      
      <PageWrap className="expert-profile-page">
        <ProfileCard>
          <div className="expert-profile-hero-inner">
            {/* LEFT COLUMN: User Profile & Info Flow */}
            <div className="expert-profile-hero-left">
              <div className="expert-profile-user-row">
                <div className="expert-profile-avatar-box">
                  {profile.profile_photo ? (
                    <LeftImage src={profile.profile_photo} alt="Profile" />
                  ) : (
                    <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
                  )}
                  <div className="expert-profile-follow-wrap">
                    {!following ? (
                      <FollowButton onClick={handleFollowAction}><FiUserPlus /> {t("expertProfile.follow")}</FollowButton>
                    ) : (
                      <FollowButton $active onClick={handleFollowAction}><FiUserCheck /> {t("expertProfile.following")}</FollowButton>
                    )}
                  </div>
                </div>

                <div className="expert-profile-name-group">
                  <Name>
                    {profile.name}
                    <VerifiedCheckIcon title="Verified Expert" aria-label="Verified Expert">
                      <FiCheck />
                    </VerifiedCheckIcon>
                  </Name>
                  <Role>{profile.position || "Expert"}</Role>
                  <Status $online={isExpertOnline}>{isExpertOnline ? "🟢 Available Now" : "🔴 Offline"}</Status>
                </div>
              </div>

              <TagList className="expert-profile-header-tags">
                <Tag className="expert-profile-header-tag expert-profile-desktop-tag" style={{ color: "#ffffff" }}> Education: {profile.education || "Masters Degree"}</Tag>
                <Tag className="expert-profile-header-tag expert-profile-desktop-tag" style={{ color: "#ffffff" }}> Category: {displayCategoryName || "Business"}</Tag>
              </TagList>
            </div>

            {/* RIGHT COLUMN: Metrics, Pricing & Call-To-Action Flow */}
            <div className="expert-profile-hero-right">
              <QuickStats>
                <StatItem><FiStar color="#facc15" /><span>{formattedAvgRating} Rating</span></StatItem>
                <StatItem><FiThumbsUp color="#10b981" /><span>{followersCount} Followers</span></StatItem>
                <StatItem><FiClock color="#6366f1" /><span>{totalExperienceText || experienceData?.total_text || `${profile.experience || "5"} Years`}</span></StatItem>
              </QuickStats>

              {/* Pricing Mode Selection Tabs */}
              {availablePricingModes.length > 0 && !hasActiveSubscription && (
                <div className="expert-profile-pricing-summary">
                  <PricingModeTabs>
                    {availablePricingModes.map((mode) => (
                      <PricingModeTab
                        key={mode.id}
                        $active={selectedPricingMode === mode.id}
                        className={`expert-profile-desktop-mode-tab ${selectedPricingMode === mode.id ? "active-tab" : "inactive-tab"}`}
                        onClick={() => setSelectedPricingMode(mode.id)}
                      >
                        {mode.icon}
                        {mode.label}
                      </PricingModeTab>
                    ))}
                  </PricingModeTabs>
                </div>
              )}

              {/* Active Subscription Banner Card - Displayed when user has an active plan for this expert */}
              {hasActiveSubscription && (
                <ActiveSubscriptionCard>
                  <SubscriptionInfo>
                    <FiCheckCircle size={20} color="#10b981" />
                    <div>
                      <strong>Active Plan: {activeSubscriptionDetails?.planName}</strong>
                      <small>Unlimited Chat & Call access</small>
                    </div>
                  </SubscriptionInfo>
                </ActiveSubscriptionCard>
              )}

              {/* Action Buttons Container */}
              <CallToAction>
                {/* Video Call Button Container */}
                {selectedPricingMode === "per_minute" && (
                <div className="expert-profile-action-item">
                  <PriceTag style={{ background: "#2563eb", color: "#ffffff" }}>Video ₹{displayPrices.videoCallPrice}/min</PriceTag>
                  <VideoCallButton
                    expert={expertData || profile}
                    expertId={numericExpertId || profile.id || profile.expert_id || expertData?.id || expertData?.expert_id}
                    expertName={profile.name}
                    isAvailable={isExpertOnline}
                    videoCallPrice={displayPrices.videoCallPrice}
                    className="expert-profile-video-call-btn"
                    iconOnly={true}
                  />
                </div>
                )}
                {/* Voice Call Button Container */}
                {selectedPricingMode === "per_minute" && (
                <div className="expert-profile-action-item">
                  <PriceTag>
                    {hasActiveSubscription ? "Call Free" : `Call ₹${displayPrices.callPrice}/min`}
                  </PriceTag>
                  {canShowUserCallButton ? (
                    <ActionButton onClick={() => handleStart("call")} aria-label="Voice Call" title="Voice Call">
                      <FiPhoneCall size={20} />
                    </ActionButton>
                  ) : (
                    <ActionButton disabled title={callDisabledReason} aria-label="Voice Call">
                      <FiPhoneCall size={20} />
                    </ActionButton>
                  )}
                </div>
                )}

                {/* Chat Button Container */}
                {(selectedPricingMode === "per_minute" || selectedPricingMode === "session" || selectedPricingMode === "subscription") && (
                <div className="expert-profile-action-item">
                  <PriceTag>
                    {hasActiveSubscription 
                      ? "Chat Free" 
                      : selectedPricingMode === "per_minute"
                      ? `Chat ₹${displayPrices.chatPrice}/min`
                      : selectedPricingMode === "session"
                      ? `Session ₹${displayPrices.sessionPrice}`
                      : "Subscription"
                    }
                  </PriceTag>
                  {canShowUserChatButton && selectedPricingMode === "per_minute" ? (
                    <ActionButton onClick={() => handleStart("chat")} aria-label="Chat Consultation" title="Chat Consultation">
                      <FiMessageSquare size={20} />
                    </ActionButton>
                  ) : canShowUserChatButton && selectedPricingMode === "session" && displayPrices.hasSession ? (
                    <ActionButton onClick={() => handleStart("chat")} aria-label="Chat Consultation" title="Chat Consultation">
                      <FiMessageSquare size={20} />
                    </ActionButton>
                  ) : canShowUserChatButton && selectedPricingMode === "subscription" && displayPrices.hasSubscription ? (
                    <ActionButton className="expert-profile-green-action-btn" onClick={() => setShowPlansModal(true)} aria-label="Subscribe" title="Subscribe">
                      <FiZap size={20} />
                    </ActionButton>
                  ) : canShowUserChatButton ? (
                    <ActionButton onClick={() => handleStart("chat")} aria-label="Chat Consultation" title="Chat Consultation">
                      <FiMessageSquare size={20} />
                    </ActionButton>
                  ) : (
                    <ActionButton disabled title={chatDisabledReason} aria-label="Chat Consultation">
                      <FiMessageSquare size={20} />
                    </ActionButton>
                  )}
                </div>
                )}
                <div className="expert-profile-action-item">
                  <PriceTag style={{ background: "#006845", color: "#ffffff" }}>Free Inquiry</PriceTag>
                  <ActionButton onClick={() => setIsInquiryModalOpen(true)} aria-label="Send Inquiry" title="Send Inquiry">
                    <FiSend size={20} />
                  </ActionButton>
                </div>
              </CallToAction>



              {/* Subscription CTA Button - Only show if expert has subscription pricing and user has no active subscription */}
              {displayPrices.hasSubscription && !hasActiveSubscription && selectedPricingMode !== "subscription" && (
                <div className="expert-profile-subscription-cta" style={{ marginTop: 16, textAlign: "center" }}>
                  <button className="expert-profile-subscription-cta-btn" onClick={() => setShowPlansModal(true)} style={{
                    padding: "10px 24px", background:"#16a34a",
                    color: "white", border: "none", borderRadius: 12, fontWeight: 600, fontSize: 14,
                    cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8,
                  }}>
                    <FiZap /> View Subscription Plans
                  </button>
                </div>
              )}
            </div>
          </div>
        </ProfileCard>

        <div className="expert-profile-content-grid">
          <aside className="expert-profile-sidebar">
            <Section className="consult-card">
              <SectionTitle>{t("expertProfile.consultWithMe")}</SectionTitle>
              <div className="consult-options">
                {showProfileVideoButton && (
                <VideoCallButton
                  expert={expertData || profile}
                  expertId={numericExpertId}
                  sourceContext="expert_profile"
                  sourceRefId={numericExpertId}
                  className="expert-profile-consult-video-btn"
                  compact
                />
                )}
                {showProfileCallButton && (
                <button type="button" className="consult-option consult-call" disabled={!canShowUserCallButton} title={!canShowUserCallButton ? callDisabledReason : "Start voice call"} aria-label="Start voice call" onClick={() => handleStart("call")}>
                  <FiPhoneCall />
                  <strong>
                    {!canShowUserCallButton ? "--" : getCompactActionPrice("call")}
                  </strong>
                </button>
                )}
                {showProfileChatButton && (
                <button type="button" className="consult-option consult-chat" disabled={!canShowUserChatButton} title={!canShowUserChatButton ? chatDisabledReason : "Start chat consultation"} aria-label="Start chat consultation" onClick={() => handleStart("chat")}>
                  <FiMessageSquare />
                  <strong>
                    {!canShowUserChatButton ? "--" : getCompactActionPrice("chat")}
                  </strong>
                </button>
                )}
                
              </div>
            </Section>

            <Section className="about-me-card">
              <SectionTitle>{t("expertProfile.aboutMe")}</SectionTitle>
              <SectionBody>{profile?.description || "Experienced professional with proven track record in the field."}</SectionBody>

              {hasExpertiseOrSkills && (
                <AboutSubsection>
                  <AboutSubtitle><FiTarget /> Expertise & Skills</AboutSubtitle>
                  <TagList>
                    {displayCategoryName && <Tag><FiTarget />{displayCategoryName}</Tag>}
                    {displaySubcategoryName && <Tag><FiAward />{displaySubcategoryName}</Tag>}
                    {profile?.position && <Tag><FiBriefcase />{profile.position}</Tag>}
                    {skillItems.map((skill, idx) => (
                      <Tag key={`skill-${idx}`}>
                        <FiCheckCircle />
                        {skill}
                      </Tag>
                    ))}
                  </TagList>
                </AboutSubsection>
              )}

              {qualificationItems.length > 0 && (
                <AboutSubsection>
                  <AboutSubtitle><FiBookOpen /> Qualifications & Education</AboutSubtitle>
                  <QualificationsList>
                    {qualificationItems.map((qual, idx) => (
                      <QualificationItem key={`qual-${idx}`}>
                        <FiBookOpen size={15} />
                        <span>{qual}</span>
                      </QualificationItem>
                    ))}
                  </QualificationsList>
                </AboutSubsection>
              )}
            </Section>
          </aside>

          <main className="expert-profile-main">

            {/* Tabs Section */}
            <Section className="profile-tabs-card">
              <TabContainer>
                <TabButton $active={activeTab === "about"} onClick={() => setActiveTab("about")}><FiFileText /> {t("expertProfile.about")}</TabButton>
                <TabButton $active={activeTab === "experience"} onClick={() => setActiveTab("experience")}><FiBriefcase /> {t("expertProfile.experience")}</TabButton>
                <TabButton $active={activeTab === "posts"} onClick={() => setActiveTab("posts")}><FiImage /> {t("expertProfile.posts")}</TabButton>
                <TabButton $active={activeTab === "services"} onClick={() => setActiveTab("services")}><FiBriefcase /> Services{expertServices.length > 0 ? ` (${expertServices.length})` : ""}</TabButton>
                <TabButton $active={activeTab === "reels"} onClick={() => setActiveTab("reels")}><FiVideo /> Reels</TabButton>
              </TabContainer>

              {activeTab === "about" && (
                <TabContent>
                  <InfoGrid>
                    <InfoItem><InfoLabel>Professional Summary</InfoLabel><InfoValue>{profile.description || "Experienced professional with proven track record in the field."}</InfoValue></InfoItem>
                    {expertiseGroups.length > 0 && (
                      <InfoItem>
                        <InfoLabel>Expertise Areas</InfoLabel>
                        <InfoValue>
                          {expertiseGroups.map((group) => (
                            <div key={group.category_id} style={{ marginBottom: 8 }}>
                              <strong>{group.category_name}</strong>
                              <div>{(group.subcategories || []).map((sub) => sub.subcategory_name).filter(Boolean).join(", ")}</div>
                            </div>
                          ))}
                        </InfoValue>
                      </InfoItem>
                    )}
                    <InfoItem>
                      <InfoLabel>Price Details</InfoLabel>
                      <InfoValue>
                        {displayPrices.hasPerMinute && <div><strong>Call:</strong> ₹{displayPrices.callPrice}/min | <strong>Chat:</strong> ₹{displayPrices.chatPrice}/min{displayPrices.videoCallPrice > 0 ? <> | <strong>Video Call:</strong> ₹{displayPrices.videoCallPrice}/min</> : null}</div>}
                        {displayPrices.hasSession && <div><strong>Session:</strong> ₹{displayPrices.sessionPrice} for {displayPrices.sessionDuration} min</div>}
                        {displayPrices.hasSubscription && <div><strong>Subscriptions:</strong> Available (click View Plans)</div>}
                        {price.reason_for_price && <div><strong>Reason:</strong> {price.reason_for_price}</div>}
                      </InfoValue>
                    </InfoItem>
                    <InfoItem><InfoLabel>Strengths</InfoLabel><InfoValue>{price.strength || "Expertise in field, Strong communication"}</InfoValue></InfoItem>
                    <InfoItem><InfoLabel>Customer Handling</InfoLabel><InfoValue>{price.handle_customer || "Professional approach, Quick response"}</InfoValue></InfoItem>
                  </InfoGrid>
                </TabContent>
              )}

              {activeTab === "experience" && (
                <TabContent>
                  {loadingExperience ? (
                    <LoadingReviews><Spinner /><p>Loading experience...</p></LoadingReviews>
                  ) : experienceList.length === 0 ? (
                    <NoReviews><FiBriefcase size={48} color="#d1d5db" /><h4>No experience records</h4></NoReviews>
                  ) : (
                    experienceList.map((exp) => (
                      <ExperienceCard key={exp.id}>
                        <ExperienceHeader><ExperienceTitle>{exp.title}</ExperienceTitle><ExperienceCompany>{exp.company}</ExperienceCompany></ExperienceHeader>
                        <ExperienceDate>{formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : "Present"}</ExperienceDate>
                        {exp.certificate && <ExperienceCertificate href={exp.certificate} target="_blank"><FiAward /> View Certificate</ExperienceCertificate>}
                      </ExperienceCard>
                    ))
                  )}
                </TabContent>
              )}

              {activeTab === "posts" && (
                <TabContent>
                  {loadingPosts ? (
                    <LoadingReviews><Spinner /><p>Loading posts...</p></LoadingReviews>
                  ) : posts.length === 0 ? (
                    <NoReviews><FiImage size={48} color="#d1d5db" /><h4>No posts yet</h4></NoReviews>
                  ) : (
                    <PostGrid>
                      {posts.map((post) => {
                        const postId = getPostId(post);
                        const isLiked = liked[postId];
                        
                        return (
                          <PostCard key={postId}>
                            {post.image_url && <PostImage src={post.image_url} alt={post.title} />}
                            <PostHeader><PostTitle>{post.title}</PostTitle></PostHeader>
                            {post.description && <PostDescription>{post.description}</PostDescription>}
                            
                            <PostActions>
                              <PostActionBtn
                                $liked={!!isLiked}
                                onClick={() => toggleLike(post)}
                              >
                                <FiHeart
                                  fill={isLiked ? "#ef4444" : "none"}
                                  stroke={isLiked ? "#ef4444" : "#374151"}
                                  style={{
                                    strokeWidth: isLiked ? 0 : 2,
                                    transition: "all 0.2s ease"
                                  }}
                                />
                                {post.likes}
                              </PostActionBtn>

                              <PostActionBtn
                                onClick={() => toggleSection("comments", postId)}
                              >
                                <FiMessageCircle />
                                {post.comments_count}
                              </PostActionBtn>
                            </PostActions>

                            {activeSection === `comments-${postId}` && (
                              <CommentsBox>
                                <CommentsList>
                                  {(comments[postId] || [])
                                    .filter(c => c && typeof c.comment === "string")
                                    .map((c) => (
                                      <CommentItem key={c.id}>
                                        <CommentText>
                                          {c.comment}
                                          {c.user_id === userId && (
                                            <span style={{ marginLeft: 6, fontSize: 11, color: "#9ca3af" }}>
                                              You
                                            </span>
                                          )}
                                        </CommentText>
                                        <CommentMeta>
                                          {formatRelativeTime(c.created_at)}
                                        </CommentMeta>
                                      </CommentItem>
                                    ))}
                                </CommentsList>

                                <div style={{ display: "flex", gap: 8 }}>
                                  <InlineInput
                                    placeholder="Write a comment…"
                                    value={commentText[postId] || ""}
                                    onChange={(e) =>
                                      setCommentText((p) => ({
                                        ...p,
                                        [postId]: e.target.value
                                      }))
                                    }
                                    onKeyDown={(e) => e.key === "Enter" && submitComment(post)}
                                  />
                                  <SendBtn onClick={() => submitComment(post)}>
                                    <FiSend />
                                  </SendBtn>
                                </div>
                              </CommentsBox>
                            )}
                          </PostCard>
                        );
                      })}
                    </PostGrid>
                  )}
                </TabContent>
              )}

              {activeTab === "services" && (
                <TabContent>
                  {loadingServices ? (
                    <LoadingReviews><Spinner /><p>Loading services...</p></LoadingReviews>
                  ) : expertServices.length === 0 ? (
                    <NoReviews><FiBriefcase size={48} color="#d1d5db" /><h4>No active services listed by this expert yet</h4></NoReviews>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                      {expertServices.map((svc) => {
                        const serviceImg = resolveMediaUrl(svc.image_url || svc.thumbnail_url || svc.icon_url || svc.banner_url);
                        const price = svc.custom_price || svc.offer_price || svc.base_price;
                        const deliveryDays = svc.delivery_time_days || svc.base_delivery_days || 1;
                        const serviceSlugOrId = svc.master_service_slug || svc.master_service_id || svc.id;

                        return (
                          <div
                            key={svc.id || svc.master_service_id}
                            style={{
                              background: "#ffffff",
                              border: "1px solid #e2e8f0",
                              borderRadius: 14,
                              padding: "1.25rem",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              gap: 12,
                              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                              transition: "all 0.2s ease"
                            }}
                          >
                            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                              {serviceImg ? (
                                <img
                                  src={serviceImg}
                                  alt={svc.master_service_title || svc.title}
                                  style={{ width: 54, height: 54, borderRadius: 10, objectFit: "cover", border: "1px solid #cbd5e1", flexShrink: 0 }}
                                  onError={(e) => { e.target.src = "https://placehold.co/100x100?text=Service"; }}
                                />
                              ) : (
                                <div style={{ width: 54, height: 54, borderRadius: 10, background: "#eef2ff", color: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, flexShrink: 0 }}>
                                  🛠️
                                </div>
                              )}
                              <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 4 }}>
                                  {svc.category_name && (
                                    <span style={{ background: "#dbeafe", color: "#1e40af", padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 700 }}>
                                      {svc.category_name}
                                    </span>
                                  )}
                                  {svc.subcategory_name && (
                                    <span style={{ background: "#ecfdf5", color: "#065f46", padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 700 }}>
                                      {svc.subcategory_name}
                                    </span>
                                  )}
                                </div>
                                <h4 style={{ margin: 0, color: "#0f172a", fontSize: "1.05rem", fontWeight: 700, lineHeight: 1.3 }}>
                                  {svc.master_service_title || svc.title || "Master Service"}
                                </h4>
                              </div>
                            </div>

                            {svc.short_description && (
                              <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                {svc.short_description}
                              </p>
                            )}

                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px dashed #e2e8f0", paddingTop: 10 }}>
                              <div>
                                <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Starting Price</div>
                                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#16a34a" }}>
                                  ₹{Number(price || 0).toLocaleString("en-IN")}
                                </div>
                              </div>

                              <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Turnaround (SLA)</div>
                                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1e293b" }}>
                                  {deliveryDays} {deliveryDays === 1 ? "Day" : "Days"}
                                </div>
                              </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 4 }}>
                              <button
                                type="button"
                                onClick={() => navigate(`/user/service/${serviceSlugOrId}`)}
                                style={{
                                  background: "#2563eb",
                                  color: "#ffffff",
                                  border: "none",
                                  borderRadius: 8,
                                  padding: "8px 12px",
                                  fontSize: 12,
                                  fontWeight: 700,
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: 6
                                }}
                              >
                                Connect Expert
                              </button>

                              <button
                                type="button"
                                onClick={() => navigate(`/user/service/${serviceSlugOrId}`)}
                                style={{
                                  background: "#f1f5f9",
                                  color: "#334155",
                                  border: "1px solid #cbd5e1",
                                  borderRadius: 8,
                                  padding: "8px 12px",
                                  fontSize: 12,
                                  fontWeight: 700,
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: 6
                                }}
                              >
                                View Service <FiArrowRight size={14} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </TabContent>
              )}

              {activeTab === "reels" && (
                <TabContent>
                  {loadingReels ? (
                    <LoadingReviews><Spinner /><p>Loading reels...</p></LoadingReviews>
                  ) : reels.length === 0 ? (
                    <NoReviews><FiVideo size={48} color="#d1d5db" /><h4>No reels uploaded yet</h4></NoReviews>
                  ) : (
                    <ReelsGrid>
                      {reels.map((item) => {
                        const reelId = item.reel_id || item.reelId || item.id || item.content_id || item.contentId;
                        const caption = item.caption || item.title || item.description || item.content || item.text || "Untitled Reel";
                        const thumbnail = resolveMediaUrl(item.thumbnail_url || item.thumbnailUrl || item.cover_image || item.coverImage || item.image_url || item.imageUrl || item.video_thumbnail || item.videoThumbnail || item.video_url || item.videoUrl);
                        const likes = item.like_count ?? item.likeCount ?? item.likes_count ?? item.likesCount ?? 0;
                        const comments = item.comment_count ?? item.commentCount ?? item.comments_count ?? item.commentsCount ?? 0;
                        
                        return (
                          <ReelGridCard key={reelId} onClick={() => navigate(`/user/reels/${item.slug || reelId}`)}>
                            {thumbnail ? (
                              <ReelThumbnail src={thumbnail} alt={caption} />
                            ) : (
                              <div style={{ width: "100%", height: "100%", background: "#111" }} />
                            )}
                            <ReelPlayIcon><FiPlay size={20} fill="#fff" /></ReelPlayIcon>
                            <ReelOverlay>
                              <ReelCaption>{caption}</ReelCaption>
                              <ReelMetaInfo>
                                <span><FiHeart fill="#fff" size={12} /> {likes}</span>
                                <span><FiMessageCircle size={12} /> {comments}</span>
                              </ReelMetaInfo>
                            </ReelOverlay>
                          </ReelGridCard>
                        );
                      })}
                    </ReelsGrid>
                  )}
                </TabContent>
              )}
            </Section>

            {/* Review Section */}
            <ReviewSection className="profile-reviews-card">
              <ReviewHeader><div><SectionTitle>{t("expertProfile.ratingReviews")}</SectionTitle></div></ReviewHeader>

              <ReviewForm>
                <ReviewFormTitle><FiStar color="#f59e0b" />{hasUserReview ? 'Update Your Review' : 'Add Your Review'}</ReviewFormTitle>
                <form onSubmit={handleSubmitReview}>
                  <RatingInput><RatingLabel>Your Rating:</RatingLabel><StarRating>{[1, 2, 3, 4, 5].map((star) => (<Star key={star} $filled={star <= userRating} onClick={() => handleStarClick(star)} type="button"><FiStar /></Star>))}</StarRating></RatingInput>
                  <TextAreaContainer><ReviewTextarea placeholder="share your experience" value={userReviewText} onChange={(e) => setUserReviewText(e.target.value)} disabled={submittingReview} maxLength={500} rows={4} /></TextAreaContainer>
                  <FormActions>
                    {isLoggedIn ? (
                      <>
                        <SubmitButton type="submit" disabled={!userRating || submittingReview} $disabled={!userRating}>
                          {submittingReview ? <><Spinner />{hasUserReview ? 'Updating...' : 'Adding...'}</> : <><FiStar />{hasUserReview ? 'Update Review' : 'Submit Review'}</>}
                        </SubmitButton>
                        {hasUserReview && <DeleteButton type="button" onClick={handleDeleteReview}><FiX />Delete Review</DeleteButton>}
                      </>
                    ) : (
                      <LoginPrompt><p>Please login to leave a review</p><LoginButton onClick={() => navigate('/user/auth', { state: { from: routerLocation } })}><FiUserCheck />Login to Review</LoginButton></LoginPrompt>
                    )}
                  </FormActions>
                </form>
              </ReviewForm>

              <RecentReviewsTitle><FiMessageSquare />All Reviews ({reviews.length})</RecentReviewsTitle>
              <ReviewList>
                {loadingReviews ? <LoadingReviews><Spinner /><p>Loading reviews...</p></LoadingReviews> : reviews.length === 0 ? <NoReviews><FiStar size={48} color="#d1d5db" /><h4>No reviews yet</h4><p>Be the first to review this expert!</p></NoReviews> : reviews.map((r) => (
                  <ReviewItem key={r.id}>
                    <ReviewUser><UserAvatar>{r.first_name?.charAt(0) || r.last_name?.charAt(0) || 'U'}</UserAvatar><UserInfo><UserName>{`${r.first_name || ""} ${r.last_name || ""}`.trim() || "Anonymous User"}</UserName><ReviewMeta><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{[...Array(5)].map((_, i) => (<FiStar key={i} size={14} color={i < (r.rating_number || 0) ? "#facc15" : "#d1d5db"} />))}<span style={{ marginLeft: '6px', fontWeight: '600' }}>{r.rating_number}/5</span></div><ReviewDate>{r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Recently'}</ReviewDate></ReviewMeta></UserInfo></ReviewUser>
                    <ReviewText>{r.review_text || "The expert provided excellent service and valuable insights."}</ReviewText>
                  </ReviewItem>
                ))}
              </ReviewList>
            </ReviewSection>

          </main>
        </div>

        {!isInquiryModalOpen && (
        <div className="mobile-profile-actions">
          {showProfileChatButton && (
          <button type="button" className="mobile-message-btn" disabled={!canShowUserChatButton} title={!canShowUserChatButton ? chatDisabledReason : "Start chat consultation"} aria-label="Start chat consultation" onClick={() => handleStart("chat")}>
            <FiMessageSquare />
            <strong>{!canShowUserChatButton ? "--" : getCompactActionPrice("chat")}</strong>
          </button>
          )}
          {showProfileVideoButton && (
          <VideoCallButton
            expert={expertData || profile}
            expertId={numericExpertId}
            sourceContext="expert_profile"
            sourceRefId={numericExpertId}
            className="mobile-video-call-btn"
            compact
          />
          )}
          {showProfileCallButton && (
          <button type="button" className="mobile-call-btn" disabled={!canShowUserCallButton} title={!canShowUserCallButton ? callDisabledReason : "Start voice call"} aria-label="Start voice call" onClick={() => handleStart("call")}>
            <FiPhoneCall />
            <strong>{!canShowUserCallButton ? "--" : getCompactActionPrice("call")}</strong>
          </button>
          )}
        </div>
        )}

        {/* Subscription Plans Modal */}
        {showPlansModal && (
          <div className="subscription-plans-modal" onClick={() => setShowPlansModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, overflowY: "auto", padding: 10 }}>
            <div className="subscription-plans-modal__sheet" role="dialog" aria-modal="true" aria-labelledby="subscription-plans-title" onClick={(e) => e.stopPropagation()} style={{ background: "#fff", padding: 28, borderRadius: 24, width: "min(90vw, 800px)", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 25px 50px rgba(0,0,0,0.25)" }}>
              <div className="subscription-plans-modal__header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "20px 0 24px" }}>
                <h2 id="subscription-plans-title" style={{ margin: 0, color: "#0f172a" }}>Subscription Plans</h2>
                <FiX size={24} style={{ cursor: "pointer", color: "#64748b" }} onClick={() => setShowPlansModal(false)} />
              </div>
              
              {loadingPlans ? (
                <div style={{ textAlign: "center", padding: 40 }}><Spinner /><p style={{ marginTop: 16, color: "#64748b" }}>Loading plans...</p></div>
              ) : plans.length === 0 ? (
                <div style={{ textAlign: "center", padding: 40 }}><p style={{ color: "#64748b" }}>No subscription plans available for this expert.</p></div>
              ) : (
                <PlansContainer>
                  {plans.map((plan) => {
                    const isActivePlan = activeSubscription?.plan_id === plan.id;
                    return (
                      <PlanCard key={plan.id}>
                        <PlanHeader>
                          <PlanName>{plan.name}</PlanName>
                          <PlanPrice>₹{plan.price}</PlanPrice>
                          <PlanDuration>
                            {plan.duration_type === "monthly" && "per month"}
                            {plan.duration_type === "quarterly" && "per 3 months"}
                            {plan.duration_type === "half_yearly" && "per 6 months"}
                            {plan.duration_type === "yearly" && "per year"}
                          </PlanDuration>
                        </PlanHeader>
                        <PlanFeatures>
                          {plan.minutes_limit && <PlanFeature><FiCheckCircle color="#10b981" size={16} />{plan.minutes_limit} minutes included</PlanFeature>}
                          {plan.calls_limit && <PlanFeature><FiCheckCircle color="#10b981" size={16} />{plan.calls_limit} calls included</PlanFeature>}
                          {plan.call_enabled && <PlanFeature><FiCheckCircle color="#10b981" size={16} />Call support</PlanFeature>}
                          {plan.chat_enabled && <PlanFeature><FiCheckCircle color="#10b981" size={16} />Chat support</PlanFeature>}
                        </PlanFeatures>
                        {isActivePlan ? (
                          <SubscribeButton disabled style={{ background: "#10b981", cursor: "default" }}><FiCheckCircle /> Active Plan</SubscribeButton>
                        ) : (
                          <SubscribeButton onClick={() => handleBuySubscription(plan)} disabled={purchasingPlan === plan.id}>
                            {purchasingPlan === plan.id ? <><Spinner /> Processing...</> : <><FiZap /> Subscribe Now</>}
                          </SubscribeButton>
                        )}
                      </PlanCard>
                    );
                  })}
                </PlansContainer>
              )}
            </div>
          </div>
        )}

        {/* Subscription Success Modal */}
        {showSubscribeSuccess && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2001 }} onClick={handleSuccessModalClick}>
            <div style={{ background: "#fff", padding: 32, borderRadius: 20, width: "min(90vw, 400px)", textAlign: "center", boxShadow: "0 25px 50px rgba(0,0,0,0.2)", animation: "slideIn 0.3s ease", cursor: "pointer" }} onClick={(e) => e.stopPropagation()}>
              <FiCheckCircle size={48} color="#10b981" style={{ marginBottom: 16 }} />
              <h3 style={{ margin: 0, marginBottom: 8, color: "#0f172a" }}>Subscription Activated!</h3>
              <p style={{ margin: 0, color: "#475569" }}>You can now enjoy calls and chats with this expert for free.</p>
              <button onClick={handleSuccessModalClick} style={{ marginTop: 20, padding: "8px 24px", background: "#10b981", color: "white", border: "none", borderRadius: 8, cursor: "pointer" }}>Got it</button>
            </div>
          </div>
        )}

        {/* Purchase Error Modal */}
        {purchaseError && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2001 }} onClick={() => setPurchaseError(null)}>
            <div style={{ background: "#fff", padding: 32, borderRadius: 20, width: "min(90vw, 400px)", textAlign: "center" }}>
              <FiX size={48} color="#ef4444" style={{ marginBottom: 16 }} />
              <h3 style={{ margin: 0, marginBottom: 8, color: "#dc2626" }}>Purchase Failed</h3>
              <p style={{ margin: 0, color: "#475569" }}>{purchaseError}</p>
              <button onClick={() => setPurchaseError(null)} style={{ marginTop: 20, padding: "8px 24px", background: "#6366f1", color: "white", border: "none", borderRadius: 8, cursor: "pointer" }}>Close</button>
            </div>
          </div>
        )}

        {/* Recharge Modal */}
        {showRecharge && (
          <AddBalancePopup
            amountPreset={requiredAmount}
            onClose={handleRechargeClose}
            onConfirm={handleProfileRechargeConfirm}
            createOrder={createOrder}
          />
        )}

        {/* Unfollow Modal */}
        {showUnfollowModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
            <div style={{ background: "#fff", padding: 24, borderRadius: 16, width: "min(90vw, 420px)" }}>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}><FiX size={20} style={{ cursor: "pointer" }} onClick={handleUnfollowClose} /></div>
              <h3 style={{ margin: 0, marginBottom: 12, color: "#0f172a" }}>Unfollow {profile.name}?</h3>
              <p style={{ margin: 0, marginBottom: 24, color: "#475569" }}>You won't get their updates anymore.</p>
              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button onClick={handleUnfollowClose} style={{ padding: "10px 20px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", color: "#475569", fontWeight: 500, cursor: "pointer" }}>Cancel</button>
                <button onClick={handleUnfollowConfirm} style={{ padding: "10px 20px", borderRadius: 8, background: "#ef4444", color: "#fff", border: "none", fontWeight: 500, cursor: "pointer" }}>Unfollow</button>
              </div>
            </div>
          </div>
        )}

        {/* Chat Popups from hook */}
        <ChatPopups />
        
        <InquiryModal
          isOpen={isInquiryModalOpen}
          onClose={() => setIsInquiryModalOpen(false)}
          expert={{ ...profile, id: numericExpertId }}
        />
      </PageWrap>
    </>
  );
};

export default ExpertProfilePage;
