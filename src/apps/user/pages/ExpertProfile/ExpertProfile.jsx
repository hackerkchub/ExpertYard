import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
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
  FiShare2,
  FiCopy,
  FiShield,
} from "react-icons/fi";
import { FaWhatsapp, FaTelegramPlane, FaTwitter } from "react-icons/fa";

import { APP_CONFIG } from "../../../../config/appConfig";
import InquiryModal from "./InquiryModal";
import PostDetailModal from "../../../../shared/components/PostDetailModal/PostDetailModal";

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
  ShareIconButton,
  ShareModalOverlay,
  ShareModalBox,
  ShareOptionItem,
  HeroTopRow,
  AvatarWrap,
  HeroBioSection,
  HeroActionRow,
  SkillChipsBar,
  ConsultModuleCard,
  PerMinuteGrid,
  PricingCard,
  SessionCardBox,
  MobileStickyBottomBar,
  ProfileTabsCard,
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

const API_BASE = APP_CONFIG.API_BASE_URL;

const apiFetch = async (path, options = {}) => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const primaryUrl = cleanPath.startsWith("/api") ? `${API_BASE.replace(/\/api\/?$/, "")}${cleanPath}` : `${API_BASE}${cleanPath}`;
  return await fetch(primaryUrl, options);
};

const resolveMediaUrl = (url) => {
  if (!url) return "";
  const cleanUrl = String(url).trim().replace(/\\/g, "/");
  if (/^(https?:)?\/\//i.test(cleanUrl) || cleanUrl.startsWith("data:") || cleanUrl.startsWith("blob:")) {
    return cleanUrl;
  }
  const apiBase = APP_CONFIG.API_BASE_URL;
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
  return result;
};

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

  const showProfileChatButton = useMemo(() => resolveProfilePageButtonVisibility(expertData, "chat"), [expertData]);
  const showProfileCallButton = useMemo(() => resolveProfilePageButtonVisibility(expertData, "call"), [expertData]);
  const showProfileVideoButton = useMemo(() => resolveProfilePageButtonVisibility(expertData, "video"), [expertData]);

  const canShowUserChatButton = Boolean(numericExpertId) && showProfileChatButton;
  const canShowUserCallButton = Boolean(numericExpertId) && showProfileCallButton;
  const canShowUserVideoButton = Boolean(numericExpertId) && showProfileVideoButton;

  // Tab & state variables
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
  const successTimeoutRef = useRef(null);
  const profileTrackedRef = useRef(null);

  // Tab states
  const [activeTab, setActiveTab] = useState("about");
  const [showFullAboutText, setShowFullAboutText] = useState(false);
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
  
  // Pricing mode selection state
  const [selectedPricingMode, setSelectedPricingMode] = useState("per_minute");
  
  // Selected consultation option state for mobile sticky CTA & desktop sidebar
  const [selectedConsultType, setSelectedConsultType] = useState("video");

  // Subscription states
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [loadingSubscription, setLoadingSubscription] = useState(false);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [purchasingPlan, setPurchasingPlan] = useState(null);
  const [showSubscribeSuccess, setShowSubscribeSuccess] = useState(false);
  const [purchaseError, setPurchaseError] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedPostForModal, setSelectedPostForModal] = useState(null);

  const handleShareProfile = useCallback(async () => {
    const shareTitle = `${profile?.name || "Expert"} on G9Expert`;
    const shareText = `Check out ${profile?.name || "Expert"}'s profile on G9Expert - ${profile?.position || "Professional Expert"}`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Share error:", err);
        } else {
          return;
        }
      }
    }
    setShowShareModal(true);
  }, [profile]);

  // Post interaction states
  const [liked, setLiked] = useState({});
  const [activeSection, setActiveSection] = useState(null);
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});

  // Use chat request hook
  const { startChat, ChatPopups } = useChatRequest();

  // Memoized computed values
  const hasUserReview = useMemo(() => 
    Boolean(userId && reviews.some((r) => Number(r.user_id) === Number(userId))),
  [userId, reviews]
  );

  const totalConsultationsCount = useMemo(() => {
    return Number(
      profile?.total_consultations ??
      profile?.consultation_count ??
      expertData?.total_consultations ??
      expertData?.consultation_count ??
      0
    );
  }, [profile, expertData]);

  const displayExperienceYears = useMemo(() => {
    return (
      profile?.experience_years ??
      profile?.experience ??
      totalExperienceText ??
      "0"
    );
  }, [profile, totalExperienceText]);

  const formattedAvgRating = useMemo(() => {
    const raw = avgRating ?? profile?.avg_rating ?? profile?.rating ?? expertData?.avg_rating ?? 0;
    const numeric = Number(raw);
    return Number.isFinite(numeric) && numeric > 0 ? numeric.toFixed(1) : "0.0";
  }, [avgRating, profile, expertData]);

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
        Number(expertPrice?.call || 10),
      chatPrice: 0,
      sessionPrice: 0,
      sessionDuration: 0
    };

    if (pricingModes.includes('per_minute')) {
      prices.hasPerMinute = true;
      prices.callPrice = Number(expertPrice?.call || 0);
      prices.chatPrice = Number(expertPrice?.chat || 0);
    }

    if (pricingModes.includes('session') && expertPrice?.session) {
      prices.hasSession = true;
      prices.sessionPrice = Number(expertPrice?.session?.price || 0);
      prices.sessionDuration = Number(expertPrice?.session?.duration || 30);
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

  // Get available pricing modes for tabs
  const availablePricingModes = useMemo(() => {
    const modes = [];
    if (displayPrices.hasPerMinute) modes.push({ id: "per_minute", label: "Per Minute", icon: <FiClock size={13} /> });
    if (displayPrices.hasSession) modes.push({ id: "session", label: "Session", icon: <FiCalendar size={13} /> });
    if (displayPrices.hasSubscription && !hasActiveSubscription) modes.push({ id: "subscription", label: "Subscription", icon: <FiZap size={13} /> });
    return modes;
  }, [displayPrices, hasActiveSubscription]);

  useEffect(() => {
    if (!availablePricingModes.length) return;
    const selectedModeExists = availablePricingModes.some((mode) => mode.id === selectedPricingMode);
    if (!selectedModeExists) {
      setSelectedPricingMode(availablePricingModes[0].id);
    }
  }, [availablePricingModes, selectedPricingMode]);

  const hasInitializedConsultTypeRef = useRef(false);

  // Auto set initial default selected consult type ONCE when data becomes available
  useEffect(() => {
    if (hasInitializedConsultTypeRef.current) return;
    if (!displayPrices.hasPerMinute && !displayPrices.hasSession && !displayPrices.hasSubscription) return;

    if (showProfileVideoButton && displayPrices.hasPerMinute) {
      setSelectedConsultType("video");
    } else if (showProfileCallButton && displayPrices.hasPerMinute) {
      setSelectedConsultType("call");
    } else if (showProfileChatButton && displayPrices.hasPerMinute) {
      setSelectedConsultType("chat");
    } else if (displayPrices.hasSession) {
      setSelectedConsultType("session");
    } else if (displayPrices.hasSubscription) {
      setSelectedConsultType("subscription");
    } else {
      setSelectedConsultType("inquiry");
    }
    hasInitializedConsultTypeRef.current = true;
  }, [showProfileVideoButton, showProfileCallButton, showProfileChatButton, displayPrices]);

  // Handle pricing mode tab change with auto-selection of consult option
  const handlePricingModeChange = useCallback((mode) => {
    setSelectedPricingMode(mode);
    if (mode === "per_minute") {
      if (showProfileVideoButton && displayPrices.hasPerMinute) {
        setSelectedConsultType("video");
      } else if (showProfileCallButton && displayPrices.hasPerMinute) {
        setSelectedConsultType("call");
      } else if (showProfileChatButton && displayPrices.hasPerMinute) {
        setSelectedConsultType("chat");
      } else {
        setSelectedConsultType("inquiry");
      }
    } else if (mode === "session") {
      setSelectedConsultType("session");
    } else if (mode === "subscription") {
      setSelectedConsultType("subscription");
    }
  }, [showProfileVideoButton, showProfileCallButton, showProfileChatButton, displayPrices]);

  // Lead tracking
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
        
        if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
        successTimeoutRef.current = setTimeout(() => {
          setShowSubscribeSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Failed to buy subscription:", error);
      const errorMsg = error.response?.data?.message || "Failed to purchase subscription";
      setPurchaseError(errorMsg);
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
        const likedMap = {};
        postsData.forEach(post => {
          const postId = getPostId(post);
          likedMap[postId] = !!post.is_liked;
        });
        setLiked(likedMap);
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

  // Fetch services
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

    setLiked(prev => ({ ...prev, [postId]: !isLiked }));
    setPosts(prev =>
      prev.map(p => {
        if (getPostId(p) === postId) {
          return { ...p, likes: p.likes + (isLiked ? -1 : 1) };
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
      setPosts(prev =>
        prev.map(p => {
          if (getPostId(p) === postId) {
            return { ...p, likes: res.data.likes };
          }
          return p;
        })
      );
    } catch (err) {
      console.error("Like error:", err);
      setLiked(prev => ({ ...prev, [postId]: isLiked }));
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

      setPosts(prev =>
        prev.map(p => {
          if (getPostId(p) === postId) {
            return { ...p, comments_count: (p.comments_count || 0) + 1 };
          }
          return p;
        })
      );

      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment]
      }));

      setCommentText(prev => ({ ...prev, [postId]: "" }));
    } catch (err) {
      console.error("Add comment error:", err);
    }
  };

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

  // Socket online status listener
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

  useNetworkReconnect(() => {
    if (slug) fetchProfile(slug);
    if (numericExpertId) {
      fetchPrice(numericExpertId);
      fetchExperience();
      loadFollowersAndReviews();
      if (activeTab === "posts") fetchPosts();
      if (activeTab === "reels") fetchReels();
      fetchPlans();
      if (isLoggedIn) fetchActiveSubscription();
    }
  }, {
    enabled: Boolean(slug || numericExpertId),
  });

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
    };
  }, []);

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

    const pricingMode = selectedPricingMode;
    
    if (pricingMode === "subscription") {
      setShowPlansModal(true);
      return;
    }

    if (pricingMode === "session") {
      const sessionPrice = displayPrices.sessionPrice;
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
              sessionDuration: displayPrices.sessionDuration,
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
      const perMinutePrice = type === "chat" ? displayPrices.chatPrice : displayPrices.callPrice;
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
  }, [isLoggedIn, navigate, routerLocation, displayPrices, balance, userId, numericExpertId, canShowUserChatButton, canShowUserCallButton, hasActiveSubscription, selectedPricingMode, profile, expertData, startChat, user]);

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
  }, [isLoggedIn, userId, numericExpertId, following, navigate, routerLocation]);

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
  }, [userId, numericExpertId]);

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

  const getInitials = (name = "") => {
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + (words[1]?.charAt(0) || "")).toUpperCase();
  };

  const Spinner = () => (
    <div style={{
      width: 24, height: 24, border: "3px solid #e2e8f0",
      borderTopColor: "#2563eb", borderRadius: "50%",
      animation: "spin 0.8s linear infinite", margin: "0 auto",
    }} />
  );

  // Compute label, price tag, and primary CTA handler for sticky bottom bar & consult cards
  const getConsultDetails = useCallback((type) => {
    if (type === "video") {
      return {
        title: "Video Call",
        label: "Selected: Video Call",
        price: hasActiveSubscription ? "Free" : `₹${displayPrices.videoCallPrice}`,
        priceUnit: hasActiveSubscription ? "" : "/ min",
        desc: "HD Video + Audio Consultation",
        btnText: "Start Video Call",
        icon: <FiVideo size={16} />,
        action: () => {
          if (!isLoggedIn) {
            navigate("/user/auth", { state: { from: routerLocation } });
            return;
          }
          if (numericExpertId) {
            navigate(`/user/video-call/${numericExpertId}`, {
              state: {
                expert: expertData || profile,
                source_context: "expert_profile",
                source_ref_id: numericExpertId,
                price_per_minute: displayPrices.videoCallPrice || 10,
              },
            });
          }
        }
      };
    }
    if (type === "call") {
      return {
        title: "Voice Call",
        label: "Selected: Voice Call",
        price: hasActiveSubscription ? "Free" : `₹${displayPrices.callPrice}`,
        priceUnit: hasActiveSubscription ? "" : "/ min",
        desc: "Direct Phone Audio Consultation",
        btnText: "Start Voice Call",
        icon: <FiPhoneCall size={16} />,
        action: () => handleStart("call")
      };
    }
    if (type === "chat") {
      return {
        title: "Instant Chat",
        label: "Selected: Instant Chat",
        price: hasActiveSubscription ? "Free" : `₹${displayPrices.chatPrice}`,
        priceUnit: hasActiveSubscription ? "" : "/ min",
        desc: "Instant Text & File Sharing",
        btnText: "Start Chat Session",
        icon: <FiMessageSquare size={16} />,
        action: () => handleStart("chat")
      };
    }
    if (type === "session") {
      return {
        title: `${displayPrices.sessionDuration}-Min Dedicated Session`,
        label: `Selected: ${displayPrices.sessionDuration} Mins Session`,
        price: `₹${displayPrices.sessionPrice}`,
        priceUnit: `/ ${displayPrices.sessionDuration} mins`,
        desc: `Guaranteed dedicated ${displayPrices.sessionDuration}-min one-on-one session`,
        btnText: "Book Session",
        icon: <FiCalendar size={16} />,
        action: () => handleStart("call")
      };
    }
    if (type === "subscription") {
      const activePlan = plans && plans.length > 0 ? plans[0] : null;
      const durationLabel = activePlan?.duration_type === "monthly" ? "month" : "period";
      return {
        title: activePlan ? activePlan.name : "Subscription Access",
        label: activePlan ? `Selected: ${activePlan.name}` : "Selected: Subscription",
        price: activePlan ? `₹${activePlan.price}` : "Plans Available",
        priceUnit: activePlan ? `/ ${durationLabel}` : "",
        desc: "Unlimited call & chat access plans",
        btnText: "Subscribe",
        icon: <FiZap size={16} />,
        action: () => setShowPlansModal(true)
      };
    }
    return {
      title: "Free Inquiry",
      label: "Selected: Free Inquiry",
      price: "FREE",
      priceUnit: "",
      desc: "Ask 1 Direct Medical Question",
      btnText: "Send Free Inquiry",
      icon: <FiSend size={16} />,
      action: () => setIsInquiryModalOpen(true)
    };
  }, [displayPrices, hasActiveSubscription, isLoggedIn, navigate, routerLocation, numericExpertId, expertData, profile, handleStart, plans]);

  const activeConsultDetails = useMemo(() => getConsultDetails(selectedConsultType), [getConsultDetails, selectedConsultType]);

  if (profileLoading || priceLoading) {
    return <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}><Spinner /><p style={{ marginTop: 12 }}>Loading expert profile...</p></div>;
  }

  if (!expertData?.profile) {
    return <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Expert not found.</div>;
  }

  return (
    <PageWrap className="expert-profile-page-container">
      {/* 1. STICKY TOP NAVIGATION BAR */}
      <div className="profile-top-header-bar">
        <button type="button" onClick={() => navigate(-1)} className="top-back-btn" aria-label="Go Back">
          ‹
        </button>
        <div className="top-header-title">
          <span className="top-header-name">{profile.name}</span>
          <FiCheckCircle size={15} className="top-verified-icon" title="Verified Expert" />
        </div>
        <button type="button" onClick={handleShareProfile} className="top-share-btn" title="Share Profile" aria-label="Share Profile">
          <FiShare2 size={16} />
        </button>
      </div>

      {/* MAIN LAYOUT GRID (DESKTOP 12-COLUMN: LEFT 8 COLS, RIGHT 4 COLS) */}
      <div className="profile-page-layout-grid">
        
        {/* LEFT COLUMN: HERO CARD, QUALIFICATIONS & CONTENT TABS */}
        <div className="profile-layout-main-col">
          
          {/* 1. EXPERT HERO CARD */}
          <ProfileCard>
            <HeroTopRow>
              <AvatarWrap>
                <div className="avatar-circle">
                  {profile.profile_photo ? (
                    <img src={profile.profile_photo} alt={profile.name} className="avatar-img" />
                  ) : (
                    <span>{getInitials(profile.name)}</span>
                  )}
                </div>
                <div className={`status-badge ${!isExpertOnline ? 'offline' : ''}`}>
                  {isExpertOnline && <div className="pulse-inner" />}
                </div>
              </AvatarWrap>

              <QuickStats>
                <StatItem>
                  <span className="stat-value">{totalConsultationsCount}</span>
                  <span className="stat-label">Consultations</span>
                </StatItem>
                <StatItem>
                  <span className="stat-value">
                    <FiStar color="#f59e0b" size={13} fill="#f59e0b" />
                    {formattedAvgRating}
                  </span>
                  <span className="stat-label">Rating ({totalReviews})</span>
                </StatItem>
                <StatItem>
                  <span className="stat-value">{displayExperienceYears}+ Yrs</span>
                  <span className="stat-label">Experience</span>
                </StatItem>
              </QuickStats>
            </HeroTopRow>

            <HeroBioSection>
              <div className="hero-name-row">
                <h1 className="hero-expert-name">{profile.name}</h1>
                <FiCheckCircle size={16} color="#2563eb" title="Verified Expert" />
                {displayCategoryName && (
                  <span className="category-pill">{displayCategoryName}</span>
                )}
              </div>
              <p className="hero-subtitle">{profile.education || profile.position || "Professional Expert"}</p>
              <div className={`hero-availability ${!isExpertOnline ? 'offline' : ''}`}>
                <span style={{ fontSize: 9 }}>●</span>
                <span>{isExpertOnline ? "Available Today (High Response)" : "Offline"}</span>
              </div>

              {/* Trust Badges Strip */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                <span style={{ background: "#fffbeb", color: "#b45309", border: "1px solid #fef3c7", padding: "3px 8px", borderRadius: 8, fontSize: 11, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
                  ⭐ Top Rated
                </span>
                <span style={{ background: "#eff6ff", color: "#1e40af", border: "1px solid #dbeafe", padding: "3px 8px", borderRadius: 8, fontSize: 11, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
                  🛡️ {displayExperienceYears}+ Years Exp.
                </span>
                <span style={{ background: "#ecfdf5", color: "#065f46", border: "1px solid #d1fae5", padding: "3px 8px", borderRadius: 8, fontSize: 11, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
                  🛡️ {totalConsultationsCount} Consultations
                </span>
              </div>
            </HeroBioSection>

            <HeroActionRow>
              <FollowButton $active={following} onClick={handleFollowAction}>
                {!following ? <><FiUserPlus size={15} /> Follow</> : <><FiUserCheck size={15} /> Following</>}
              </FollowButton>
              <ActionButton onClick={() => setIsInquiryModalOpen(true)}>
                <FiZap size={14} color="#d97706" /> Inquire
              </ActionButton>
              <ActionButton onClick={handleShareProfile} title="Share Profile" aria-label="Share Profile">
                <FiShare2 size={15} /> Share Profile
              </ActionButton>
            </HeroActionRow>

            <SkillChipsBar className="no-scrollbar">
              {displayCategoryName && <span className="skill-chip">{displayCategoryName}</span>}
              {displaySubcategoryName && <span className="skill-chip">{displaySubcategoryName}</span>}
              {profile.position && <span className="skill-chip">{profile.position}</span>}
              {skillItems.map((skill, idx) => (
                <span key={`chip-${idx}`} className="skill-chip">{skill}</span>
              ))}
            </SkillChipsBar>
          </ProfileCard>

          {/* 2. QUALIFICATIONS & SKILLS CARD */}
          {(qualificationItems.length > 0 || skillItems.length > 0) && (
            <ProfileCard style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
              {qualificationItems.length > 0 && (
                <div>
                  <SectionTitle style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <FiBookOpen color="#2563eb" size={15} /> Qualifications
                  </SectionTitle>
                  <QualificationsList>
                    {qualificationItems.map((qual, idx) => (
                      <QualificationItem key={`qual-main-${idx}`}>
                        <span style={{ color: "#94a3b8" }}>•</span>
                        <span>{qual}</span>
                      </QualificationItem>
                    ))}
                  </QualificationsList>
                </div>
              )}

              {skillItems.length > 0 && (
                <div>
                  <SectionTitle style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <FiStar color="#f59e0b" size={15} /> Specialized Skills
                  </SectionTitle>
                  <TagList>
                    {skillItems.map((skill, idx) => (
                      <Tag key={`skill-main-${idx}`}>
                        <FiCheckCircle size={12} color="#059669" />
                        {skill}
                      </Tag>
                    ))}
                  </TagList>
                </div>
              )}
            </ProfileCard>
          )}

          {/* 3. CONSULTATION MODULE (Renders in Left Main Column on Mobile ONLY) */}
          <div className="mobile-only-consult-module" style={{ width: "100%" }}>
            <ConsultModuleCard>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <SectionTitle style={{ margin: 0 }}>Consultation Options</SectionTitle>
                <span style={{ fontSize: 10, color: "#2563eb", fontWeight: 700 }}>Verified Rates ✔</span>
              </div>

              {availablePricingModes.length > 1 && (
                <PricingModeTabs>
                  {availablePricingModes.map((mode) => (
                    <PricingModeTab
                      key={mode.id}
                      $active={selectedPricingMode === mode.id}
                      onClick={() => handlePricingModeChange(mode.id)}
                    >
                      {mode.icon}
                      {mode.label}
                    </PricingModeTab>
                  ))}
                </PricingModeTabs>
              )}

              {selectedPricingMode === "per_minute" && displayPrices.hasPerMinute && (
                <PerMinuteGrid>
                  {showProfileVideoButton && (
                    <PricingCard
                      $active={selectedConsultType === "video"}
                      $borderColor="#2563eb"
                      $bg={selectedConsultType === "video" ? "#eff6ff" : "#f8fafc"}
                      onClick={() => setSelectedConsultType("video")}
                    >
                      <div className="card-header-row">
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <FiVideo color="#2563eb" size={14} /> Video Call
                        </span>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2563eb" }} />
                      </div>
                      <div className="card-price">
                        {hasActiveSubscription ? "Free" : `₹${displayPrices.videoCallPrice}`}
                        {!hasActiveSubscription && <span className="card-subtext"> / min</span>}
                      </div>
                      <span className="card-subtext">HD Video + Audio</span>
                    </PricingCard>
                  )}

                  {showProfileCallButton && (
                    <PricingCard
                      $active={selectedConsultType === "call"}
                      $borderColor="#d97706"
                      $bg={selectedConsultType === "call" ? "#fffbeb" : "#f8fafc"}
                      onClick={() => setSelectedConsultType("call")}
                    >
                      <div className="card-header-row">
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <FiPhoneCall color="#d97706" size={14} /> Voice Call
                        </span>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#d97706" }} />
                      </div>
                      <div className="card-price" style={{ color: "#d97706" }}>
                        {hasActiveSubscription ? "Free" : `₹${displayPrices.callPrice}`}
                        {!hasActiveSubscription && <span className="card-subtext"> / min</span>}
                      </div>
                      <span className="card-subtext">Direct Audio</span>
                    </PricingCard>
                  )}

                  {showProfileChatButton && (
                    <PricingCard
                      $active={selectedConsultType === "chat"}
                      $borderColor="#8b5cf6"
                      $bg={selectedConsultType === "chat" ? "#f5f3ff" : "#f8fafc"}
                      onClick={() => setSelectedConsultType("chat")}
                    >
                      <div className="card-header-row">
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <FiMessageSquare color="#8b5cf6" size={14} /> Instant Chat
                        </span>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#8b5cf6" }} />
                      </div>
                      <div className="card-price" style={{ color: "#7c3aed" }}>
                        {hasActiveSubscription ? "Free" : `₹${displayPrices.chatPrice}`}
                        {!hasActiveSubscription && <span className="card-subtext"> / min</span>}
                      </div>
                      <span className="card-subtext">Text & File Sharing</span>
                    </PricingCard>
                  )}

                  <PricingCard
                    $active={selectedConsultType === "inquiry"}
                    $borderColor="#10b981"
                    $bg={selectedConsultType === "inquiry" ? "#ecfdf5" : "#f8fafc"}
                    onClick={() => setSelectedConsultType("inquiry")}
                  >
                    <div className="card-header-row">
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <FiSend color="#10b981" size={14} /> Free Inquiry
                      </span>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
                    </div>
                    <div className="card-price" style={{ color: "#059669" }}>FREE</div>
                    <span className="card-subtext">Ask 1 Question</span>
                  </PricingCard>
                </PerMinuteGrid>
              )}

              {selectedPricingMode === "session" && displayPrices.hasSession && (
                <SessionCardBox
                  style={{ cursor: "pointer", border: selectedConsultType === "session" ? "2px solid #2563eb" : "1px solid #cbd5e1" }}
                  onClick={() => setSelectedConsultType("session")}
                >
                  <div className="session-header">
                    <span className="session-title">Dedicated Consultation Session</span>
                    <span className="session-badge">{displayPrices.sessionDuration} Mins</span>
                  </div>
                  <div className="session-price-row">
                    <span className="session-price">₹{displayPrices.sessionPrice}</span>
                    <span style={{ fontSize: 11, color: "#64748b" }}>/ fixed session</span>
                  </div>
                  <p className="session-desc">
                    • Guaranteed dedicated {displayPrices.sessionDuration}-minute one-on-one session including report review & advice.
                  </p>
                  <button type="button" className="session-book-btn" onClick={activeConsultDetails.action}>
                    Book Session
                  </button>
                </SessionCardBox>
              )}

              {selectedPricingMode === "subscription" && displayPrices.hasSubscription && (
                <div
                  style={{ background: "#0f172a", color: "#ffffff", borderRadius: 16, padding: 14, display: "flex", flexDirection: "column", gap: 10, cursor: "pointer", border: selectedConsultType === "subscription" ? "2px solid #fbbf24" : "none" }}
                  onClick={() => setSelectedConsultType("subscription")}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#fbbf24" }}>SUBSCRIPTION ACCESS</span>
                    <span style={{ fontSize: 10, color: "#cbd5e1" }}>Available Plans</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 11, color: "#cbd5e1", lineHeight: 1.4 }}>
                    Subscribe for unlimited call & chat access with this expert.
                  </p>
                  <button type="button" onClick={() => setShowPlansModal(true)} style={{ width: "100%", padding: 10, background: "#10b981", color: "#ffffff", border: "none", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                    Subscribe
                  </button>
                </div>
              )}
            </ConsultModuleCard>
          </div>

          {/* 4. EDGE-TO-EDGE CONTENT TABS */}
          <ProfileTabsCard>
            <TabContainer className="no-scrollbar">
              <TabButton $active={activeTab === "about"} onClick={() => setActiveTab("about")}>
                <FiFileText size={13} /> About
              </TabButton>
              <TabButton $active={activeTab === "experience"} onClick={() => setActiveTab("experience")}>
                <FiBriefcase size={13} /> Experience
              </TabButton>
              <TabButton $active={activeTab === "services"} onClick={() => setActiveTab("services")}>
                <FiBriefcase size={13} /> Services{expertServices.length > 0 ? ` (${expertServices.length})` : ""}
              </TabButton>
              <TabButton $active={activeTab === "posts"} onClick={() => setActiveTab("posts")}>
                <FiImage size={13} /> Posts{posts.length > 0 ? ` (${posts.length})` : ""}
              </TabButton>
              <TabButton $active={activeTab === "reels"} onClick={() => setActiveTab("reels")}>
                <FiVideo size={13} /> Reels{reels.length > 0 ? ` (${reels.length})` : ""}
              </TabButton>
              <TabButton $active={activeTab === "reviews"} onClick={() => setActiveTab("reviews")}>
                <FiStar size={13} /> Reviews{reviews.length > 0 ? ` (${reviews.length})` : ""}
              </TabButton>
            </TabContainer>

            {/* TAB 1: ABOUT */}
            {activeTab === "about" && (
              <TabContent>
                <div>
                  <SectionTitle>Professional Overview</SectionTitle>
                  <SectionBody>
                    {showFullAboutText || !(profile.description && profile.description.length > 180)
                      ? (profile.description || "Experienced professional with proven track record in the field.")
                      : `${profile.description.substring(0, 180)}...`}
                  </SectionBody>
                  {profile.description && profile.description.length > 180 && (
                    <button
                      type="button"
                      onClick={() => setShowFullAboutText(!showFullAboutText)}
                      style={{ background: "none", border: "none", color: "#2563eb", fontSize: 11, fontWeight: 700, cursor: "pointer", padding: 0, marginTop: 4 }}
                    >
                      {showFullAboutText ? "Read Less ‹" : "Read More ›"}
                    </button>
                  )}
                </div>

                {/* Core Strengths Grid */}
                {(price.strength || price.handle_customer) && (
                  <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
                    <SectionTitle>Core Strengths & Customer Care</SectionTitle>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8 }}>
                      {price.strength && (
                        <div style={{ background: "#f8fafc", padding: 10, borderRadius: 10, border: "1px solid #e2e8f0" }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", display: "block" }}>Primary Expertise</span>
                          <span style={{ fontSize: 11, color: "#64748b" }}>{price.strength}</span>
                        </div>
                      )}
                      {price.handle_customer && (
                        <div style={{ background: "#f8fafc", padding: 10, borderRadius: 10, border: "1px solid #e2e8f0" }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", display: "block" }}>Customer Handling</span>
                          <span style={{ fontSize: 11, color: "#64748b" }}>{price.handle_customer}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </TabContent>
            )}

            {/* TAB 2: EXPERIENCE */}
            {activeTab === "experience" && (
              <TabContent>
                {loadingExperience ? (
                  <LoadingReviews><Spinner /><p>Loading experience...</p></LoadingReviews>
                ) : experienceList.length === 0 ? (
                  <NoReviews><FiBriefcase size={36} color="#cbd5e1" /><h4>No experience records</h4></NoReviews>
                ) : (
                  experienceList.map((exp) => (
                    <ExperienceCard key={exp.id}>
                      <ExperienceHeader>
                        <ExperienceTitle>{exp.title}</ExperienceTitle>
                        <ExperienceCompany>{exp.company}</ExperienceCompany>
                      </ExperienceHeader>
                      <ExperienceDate>{formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : "Present"}</ExperienceDate>
                      {exp.certificate && (
                        <ExperienceCertificate href={exp.certificate} target="_blank" rel="noopener noreferrer">
                          <FiAward size={12} /> View Certificate
                        </ExperienceCertificate>
                      )}
                    </ExperienceCard>
                  ))
                )}
              </TabContent>
            )}

            {/* TAB 3: SERVICES */}
            {activeTab === "services" && (
              <TabContent>
                {loadingServices ? (
                  <LoadingReviews><Spinner /><p>Loading services...</p></LoadingReviews>
                ) : expertServices.length === 0 ? (
                  <NoReviews><FiBriefcase size={36} color="#cbd5e1" /><h4>No active services listed</h4></NoReviews>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
                    {expertServices.map((svc) => {
                      const serviceImg = resolveMediaUrl(svc.image_url || svc.thumbnail_url || svc.icon_url || svc.banner_url);
                      const svcPrice = svc.custom_price || svc.offer_price || svc.base_price;
                      const deliveryDays = svc.delivery_time_days || svc.base_delivery_days || 1;
                      const serviceSlugOrId = svc.master_service_slug || svc.master_service_id || svc.id;

                      return (
                        <div key={svc.id || svc.master_service_id} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 14, padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                            {serviceImg ? (
                              <img src={serviceImg} alt={svc.title} style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover" }} />
                            ) : (
                              <div style={{ width: 44, height: 44, borderRadius: 8, background: "#dbeafe", color: "#1d4ed8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🛠️</div>
                            )}
                            <div>
                              <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{svc.master_service_title || svc.title}</h4>
                              <span style={{ fontSize: 10, color: "#64748b" }}>{svc.category_name}</span>
                            </div>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px dashed #e2e8f0", paddingTop: 8 }}>
                            <div>
                              <span style={{ fontSize: 10, color: "#64748b", display: "block" }}>Starting Price</span>
                              <span style={{ fontSize: 14, fontWeight: 800, color: "#059669" }}>₹{Number(svcPrice || 0).toLocaleString("en-IN")}</span>
                            </div>
                            <div style={{ textAlign: "right", marginLeft: "auto" }}>
                              <span style={{ fontSize: 10, color: "#64748b", display: "block" }}>SLA Turnaround</span>
                              <span style={{ fontSize: 11, fontWeight: 700, color: "#0f172a" }}>{deliveryDays} {deliveryDays === 1 ? "Day" : "Days"}</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => navigate(`/user/service/${serviceSlugOrId}`)}
                            style={{ background: "#2563eb", color: "#ffffff", border: "none", borderRadius: 8, padding: "7px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", width: "100%" }}
                          >
                            Book Package
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </TabContent>
            )}

            {/* TAB 4: POSTS */}
            {activeTab === "posts" && (
              <TabContent>
                {loadingPosts ? (
                  <LoadingReviews><Spinner /><p>Loading posts...</p></LoadingReviews>
                ) : posts.length === 0 ? (
                  <NoReviews><FiImage size={36} color="#cbd5e1" /><h4>No posts yet</h4></NoReviews>
                ) : (
                  <PostGrid>
                    {posts.map((post) => {
                      const postId = getPostId(post);
                      const isLiked = liked[postId];
                      return (
                        <PostCard key={postId} onClick={() => setSelectedPostForModal(post)} style={{ cursor: "pointer" }}>
                          {post.image_url && <PostImage src={post.image_url} alt={post.title} />}
                          <PostHeader><PostTitle>{post.title}</PostTitle></PostHeader>
                          {post.description && <PostDescription>{post.description}</PostDescription>}
                          
                          <PostActions onClick={(e) => e.stopPropagation()}>
                            <PostActionBtn $liked={!!isLiked} onClick={(e) => { e.stopPropagation(); toggleLike(post); }}>
                              <FiHeart fill={isLiked ? "#ef4444" : "none"} stroke={isLiked ? "#ef4444" : "#64748b"} size={14} />
                              {post.likes}
                            </PostActionBtn>
                            <PostActionBtn onClick={(e) => { e.stopPropagation(); toggleSection("comments", postId); }}>
                              <FiMessageCircle size={14} />
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
                                      <CommentText>{c.comment}</CommentText>
                                      <CommentMeta>{formatRelativeTime(c.created_at)}</CommentMeta>
                                    </CommentItem>
                                  ))}
                              </CommentsList>
                              <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                                <InlineInput
                                  placeholder="Write a comment…"
                                  value={commentText[postId] || ""}
                                  onChange={(e) => setCommentText((p) => ({ ...p, [postId]: e.target.value }))}
                                  onKeyDown={(e) => e.key === "Enter" && submitComment(post)}
                                />
                                <SendBtn onClick={() => submitComment(post)}><FiSend size={12} /></SendBtn>
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

            {/* TAB 5: REELS */}
            {activeTab === "reels" && (
              <TabContent>
                {loadingReels ? (
                  <LoadingReviews><Spinner /><p>Loading reels...</p></LoadingReviews>
                ) : reels.length === 0 ? (
                  <NoReviews><FiVideo size={36} color="#cbd5e1" /><h4>No reels uploaded</h4></NoReviews>
                ) : (
                  <ReelsGrid>
                    {reels.map((item) => {
                      const reelId = item.reel_id || item.reelId || item.id;
                      const caption = item.caption || item.title || "Reel Video";
                      const thumbnail = resolveMediaUrl(item.thumbnail_url || item.thumbnailUrl || item.cover_image || item.coverImage);
                      return (
                        <ReelGridCard key={reelId} onClick={() => navigate(`/user/reels/${item.slug || reelId}`)}>
                          {thumbnail ? <ReelThumbnail src={thumbnail} alt={caption} /> : <div style={{ width: "100%", height: "100%", background: "#0f172a" }} />}
                          <ReelPlayIcon><FiPlay size={16} fill="#fff" /></ReelPlayIcon>
                          <ReelOverlay>
                            <ReelCaption>{caption}</ReelCaption>
                            <ReelMetaInfo>
                              <span><FiHeart fill="#fff" size={10} /> {item.like_count || 0}</span>
                              <span><FiMessageCircle size={10} /> {item.comment_count || 0}</span>
                            </ReelMetaInfo>
                          </ReelOverlay>
                        </ReelGridCard>
                      );
                    })}
                  </ReelsGrid>
                )}
              </TabContent>
            )}

            {/* TAB 6: REVIEWS */}
            {activeTab === "reviews" && (
              <TabContent>
                <ReviewForm>
                  <ReviewFormTitle><FiStar color="#f59e0b" size={14} /> {hasUserReview ? 'Update Your Review' : 'Leave a Review'}</ReviewFormTitle>
                  <form onSubmit={handleSubmitReview}>
                    <RatingInput>
                      <RatingLabel>Rating:</RatingLabel>
                      <StarRating>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} $filled={star <= userRating} onClick={() => handleStarClick(star)} type="button">
                            <FiStar size={16} />
                          </Star>
                        ))}
                      </StarRating>
                    </RatingInput>
                    <TextAreaContainer>
                      <ReviewTextarea placeholder="Share your experience with this expert..." value={userReviewText} onChange={(e) => setUserReviewText(e.target.value)} disabled={submittingReview} maxLength={500} rows={3} />
                    </TextAreaContainer>
                    <FormActions>
                      {isLoggedIn ? (
                        <>
                          <SubmitButton type="submit" disabled={!userRating || submittingReview}>
                            {submittingReview ? "Submitting..." : (hasUserReview ? 'Update Review' : 'Submit Review')}
                          </SubmitButton>
                          {hasUserReview && <DeleteButton type="button" onClick={handleDeleteReview}>Delete</DeleteButton>}
                        </>
                      ) : (
                        <LoginPrompt><p style={{ margin: 0 }}>Please login to leave a review</p></LoginPrompt>
                      )}
                    </FormActions>
                  </form>
                </ReviewForm>

                <RecentReviewsTitle><FiMessageSquare size={14} /> Reviews Feed ({reviews.length})</RecentReviewsTitle>
                <ReviewList>
                  {loadingReviews ? (
                    <LoadingReviews><Spinner /><p>Loading reviews...</p></LoadingReviews>
                  ) : reviews.length === 0 ? (
                    <NoReviews><FiStar size={36} color="#cbd5e1" /><h4>No reviews yet</h4></NoReviews>
                  ) : (
                    reviews.map((r) => (
                      <ReviewItem key={r.id}>
                        <ReviewUser>
                          <UserAvatar>{r.first_name?.charAt(0) || 'U'}</UserAvatar>
                          <UserInfo>
                            <UserName>{`${r.first_name || ""} ${r.last_name || ""}`.trim() || "Anonymous User"}</UserName>
                            <ReviewMeta>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {[...Array(5)].map((_, i) => (
                                  <FiStar key={i} size={11} color={i < (r.rating_number || 0) ? "#f59e0b" : "#cbd5e1"} fill={i < (r.rating_number || 0) ? "#f59e0b" : "none"} />
                                ))}
                              </div>
                              <ReviewDate>{r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Recently'}</ReviewDate>
                            </ReviewMeta>
                          </UserInfo>
                        </ReviewUser>
                        <ReviewText>{r.review_text}</ReviewText>
                      </ReviewItem>
                    ))
                  )}
                </ReviewList>
              </TabContent>
            )}
          </ProfileTabsCard>

        </div>

        {/* RIGHT 4-COLUMN: STICKY CONSULTATION SIDEBAR (DESKTOP ONLY) */}
        <div className="profile-layout-sidebar-col">
          <ConsultModuleCard>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <SectionTitle style={{ margin: 0 }}>Consultation Options</SectionTitle>
              <span style={{ fontSize: 11, color: "#2563eb", fontWeight: 700 }}>Verified Rates ✔</span>
            </div>

            {/* Segmented Pricing Mode Switcher */}
            {availablePricingModes.length > 1 && (
              <PricingModeTabs>
                {availablePricingModes.map((mode) => (
                  <PricingModeTab
                    key={mode.id}
                    $active={selectedPricingMode === mode.id}
                    onClick={() => handlePricingModeChange(mode.id)}
                  >
                    {mode.icon}
                    {mode.label}
                  </PricingModeTab>
                ))}
              </PricingModeTabs>
            )}

            {/* Mode 1: Per Minute 2x2 Grid */}
            {selectedPricingMode === "per_minute" && displayPrices.hasPerMinute && (
              <PerMinuteGrid>
                {showProfileVideoButton && (
                  <PricingCard
                    $active={selectedConsultType === "video"}
                    $borderColor="#2563eb"
                    $bg={selectedConsultType === "video" ? "#eff6ff" : "#f8fafc"}
                    onClick={() => setSelectedConsultType("video")}
                  >
                    <div className="card-header-row">
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <FiVideo color="#2563eb" size={14} /> Video Call
                      </span>
                    </div>
                    <div className="card-price">
                      {hasActiveSubscription ? "Free" : `₹${displayPrices.videoCallPrice}`}
                      {!hasActiveSubscription && <span className="card-subtext"> / min</span>}
                    </div>
                    <span className="card-subtext">HD Video + Audio</span>
                  </PricingCard>
                )}

                {showProfileCallButton && (
                  <PricingCard
                    $active={selectedConsultType === "call"}
                    $borderColor="#d97706"
                    $bg={selectedConsultType === "call" ? "#fffbeb" : "#f8fafc"}
                    onClick={() => setSelectedConsultType("call")}
                  >
                    <div className="card-header-row">
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <FiPhoneCall color="#d97706" size={14} /> Voice Call
                      </span>
                    </div>
                    <div className="card-price" style={{ color: "#d97706" }}>
                      {hasActiveSubscription ? "Free" : `₹${displayPrices.callPrice}`}
                      {!hasActiveSubscription && <span className="card-subtext"> / min</span>}
                    </div>
                    <span className="card-subtext">Direct Audio</span>
                  </PricingCard>
                )}

                {showProfileChatButton && (
                  <PricingCard
                    $active={selectedConsultType === "chat"}
                    $borderColor="#8b5cf6"
                    $bg={selectedConsultType === "chat" ? "#f5f3ff" : "#f8fafc"}
                    onClick={() => setSelectedConsultType("chat")}
                  >
                    <div className="card-header-row">
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <FiMessageSquare color="#8b5cf6" size={14} /> Instant Chat
                      </span>
                    </div>
                    <div className="card-price" style={{ color: "#7c3aed" }}>
                      {hasActiveSubscription ? "Free" : `₹${displayPrices.chatPrice}`}
                      {!hasActiveSubscription && <span className="card-subtext"> / min</span>}
                    </div>
                    <span className="card-subtext">Text & File Sharing</span>
                  </PricingCard>
                )}

                <PricingCard
                  $active={selectedConsultType === "inquiry"}
                  $borderColor="#10b981"
                  $bg={selectedConsultType === "inquiry" ? "#ecfdf5" : "#f8fafc"}
                  onClick={() => setSelectedConsultType("inquiry")}
                >
                  <div className="card-header-row">
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <FiSend color="#10b981" size={14} /> Free Inquiry
                    </span>
                  </div>
                  <div className="card-price" style={{ color: "#059669" }}>FREE</div>
                  <span className="card-subtext">Ask 1 Question</span>
                </PricingCard>
              </PerMinuteGrid>
            )}

            {/* Mode 2: Session Pricing Card */}
            {selectedPricingMode === "session" && displayPrices.hasSession && (
              <SessionCardBox
                style={{ cursor: "pointer", border: selectedConsultType === "session" ? "2px solid #2563eb" : "1px solid #cbd5e1" }}
                onClick={() => setSelectedConsultType("session")}
              >
                <div className="session-header">
                  <span className="session-title">Dedicated Consultation Session</span>
                  <span className="session-badge">{displayPrices.sessionDuration} Mins</span>
                </div>
                <div className="session-price-row">
                  <span className="session-price">₹{displayPrices.sessionPrice}</span>
                  <span style={{ fontSize: 11, color: "#64748b" }}>/ fixed session</span>
                </div>
                <p className="session-desc">
                  • Guaranteed dedicated {displayPrices.sessionDuration}-minute one-on-one session including report review & advice.
                </p>
              </SessionCardBox>
            )}

            {/* Mode 3: Subscription Plan Card */}
            {selectedPricingMode === "subscription" && displayPrices.hasSubscription && (
              <div
                style={{ background: "#0f172a", color: "#ffffff", borderRadius: 14, padding: 14, display: "flex", flexDirection: "column", gap: 8, cursor: "pointer", border: selectedConsultType === "subscription" ? "2px solid #fbbf24" : "none" }}
                onClick={() => setSelectedConsultType("subscription")}
              >
                <span style={{ fontSize: 11, fontWeight: 700, color: "#fbbf24" }}>SUBSCRIPTION ACCESS</span>
                <p style={{ margin: 0, fontSize: 11, color: "#cbd5e1" }}>
                  Unlimited call & chat access for fixed monthly duration.
                </p>
              </div>
            )}

            {/* Confidentiality Banner */}
            <div style={{ background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: 10, padding: 8, display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#475569" }}>
              <FiShield color="#2563eb" size={14} />
              <span>All consultations are private, secure & confidential.</span>
            </div>

            {/* Selected Option Summary Box */}
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: 12, display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>Selected Option</span>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{activeConsultDetails.title}</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>
                  {activeConsultDetails.price} {activeConsultDetails.priceUnit && <span style={{ fontSize: 10, fontWeight: 400, color: "#64748b" }}>{activeConsultDetails.priceUnit}</span>}
                </span>
              </div>
              <span style={{ fontSize: 11, color: "#64748b" }}>{activeConsultDetails.desc}</span>
            </div>

            {/* Main Primary Trigger CTA Button */}
            <button
              type="button"
              onClick={activeConsultDetails.action}
              style={{ width: "100%", padding: 12, background: "#2563eb", color: "#ffffff", border: "none", borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)", transition: "all 0.15s ease" }}
            >
              {activeConsultDetails.btnText}
            </button>
          </ConsultModuleCard>
        </div>

      </div>

      {/* MOBILE STICKY BOTTOM CONSULTATION CTA BAR (PORTAL TO DOCUMENT.BODY) */}
      {typeof document !== "undefined" &&
        createPortal(
          <MobileStickyBottomBar>
            <div className="cta-info-col">
              <span className="cta-label">{activeConsultDetails.label}</span>
              <div className="cta-price">
                {activeConsultDetails.price}
                {activeConsultDetails.priceUnit && (
                  <span> {activeConsultDetails.priceUnit}</span>
                )}
              </div>
            </div>
            <button
              type="button"
              className="cta-btn-primary"
              onClick={activeConsultDetails.action}
            >
              {activeConsultDetails.icon}
              <span>{activeConsultDetails.btnText}</span>
            </button>
          </MobileStickyBottomBar>,
          document.body
        )}

      {/* MODALS & OVERLAYS */}
      {showPlansModal && (
        <div className="subscription-plans-modal" onClick={() => setShowPlansModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 16 }}>
          <div className="subscription-plans-modal__sheet" onClick={(e) => e.stopPropagation()} style={{ background: "#fff", padding: 24, borderRadius: 20, width: "min(92vw, 600px)", maxHeight: "88vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0, color: "#0f172a" }}>Subscription Plans</h3>
              <FiX size={20} style={{ cursor: "pointer", color: "#64748b" }} onClick={() => setShowPlansModal(false)} />
            </div>
            
            {loadingPlans ? (
              <div style={{ textAlign: "center", padding: 30 }}><Spinner /><p style={{ marginTop: 12, color: "#64748b" }}>Loading plans...</p></div>
            ) : plans.length === 0 ? (
              <div style={{ textAlign: "center", padding: 30 }}><p style={{ color: "#64748b" }}>No subscription plans available for this expert.</p></div>
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
                        {plan.minutes_limit && <PlanFeature><FiCheckCircle color="#10b981" size={14} />{plan.minutes_limit} minutes included</PlanFeature>}
                        {plan.calls_limit && <PlanFeature><FiCheckCircle color="#10b981" size={14} />{plan.calls_limit} calls included</PlanFeature>}
                        {plan.call_enabled && <PlanFeature><FiCheckCircle color="#10b981" size={14} />Call support</PlanFeature>}
                        {plan.chat_enabled && <PlanFeature><FiCheckCircle color="#10b981" size={14} />Chat support</PlanFeature>}
                      </PlanFeatures>
                      {isActivePlan ? (
                        <SubscribeButton disabled style={{ background: "#10b981", cursor: "default" }}><FiCheckCircle /> Active Plan</SubscribeButton>
                      ) : (
                        <SubscribeButton onClick={() => handleBuySubscription(plan)} disabled={purchasingPlan === plan.id}>
                          {purchasingPlan === plan.id ? "Processing..." : "Subscribe Now"}
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

      {showSubscribeSuccess && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000 }} onClick={() => setShowSubscribeSuccess(false)}>
          <div style={{ background: "#fff", padding: 24, borderRadius: 16, width: "min(90vw, 360px)", textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
            <FiCheckCircle size={40} color="#10b981" style={{ marginBottom: 12 }} />
            <h3 style={{ margin: "0 0 8px 0", color: "#0f172a" }}>Subscription Activated!</h3>
            <p style={{ margin: 0, fontSize: 12, color: "#475569" }}>You can now enjoy calls and chats with this expert for free.</p>
            <button onClick={() => setShowSubscribeSuccess(false)} style={{ marginTop: 16, padding: "8px 20px", background: "#10b981", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700 }}>Got it</button>
          </div>
        </div>
      )}

      {showRecharge && (
        <AddBalancePopup
          amountPreset={requiredAmount}
          onClose={() => { setShowRecharge(false); setRequiredAmount(0); }}
          onConfirm={async (paymentData) => {
            const result = await addMoney(paymentData);
            if (result?.success) {
              setShowRecharge(false);
              setRequiredAmount(0);
              await fetchWallet();
            }
            return result;
          }}
          createOrder={createOrder}
        />
      )}

      {showUnfollowModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000 }}>
          <div style={{ background: "#fff", padding: 20, borderRadius: 16, width: "min(90vw, 360px)" }}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: 15, color: "#0f172a" }}>Unfollow {profile.name}?</h3>
            <p style={{ margin: "0 0 20px 0", fontSize: 12, color: "#475569" }}>You won't receive their updates anymore.</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowUnfollowModal(false)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", color: "#475569", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleUnfollowConfirm} style={{ padding: "8px 16px", borderRadius: 8, background: "#ef4444", color: "#fff", border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Unfollow</button>
            </div>
          </div>
        </div>
      )}

      <ChatPopups />

      <InquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        expert={{ ...profile, id: numericExpertId }}
      />

      <PostDetailModal
        post={selectedPostForModal}
        isOpen={Boolean(selectedPostForModal)}
        onClose={() => setSelectedPostForModal(null)}
        expertProfile={profile}
      />

      {showShareModal && (
        <ShareModalOverlay onClick={() => setShowShareModal(false)}>
          <ShareModalBox onClick={(e) => e.stopPropagation()}>
            <div className="share-header">
              <h3>Share {profile?.name || "Expert"}'s Profile</h3>
              <button type="button" onClick={() => setShowShareModal(false)}>
                <FiX size={18} />
              </button>
            </div>
            <div className="share-grid">
              <ShareOptionItem
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ${profile?.name || "Expert"}'s profile on G9Expert: ${window.location.href}`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp size={20} color="#25D366" />
                <span>WhatsApp</span>
              </ShareOptionItem>
              <ShareOptionItem
                href={`https://telegram.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Check out ${profile?.name || "Expert"}'s profile on G9Expert`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTelegramPlane size={20} color="#0088cc" />
                <span>Telegram</span>
              </ShareOptionItem>
              <ShareOptionItem
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${profile?.name || "Expert"}'s profile on G9Expert`)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter size={20} color="#1DA1F2" />
                <span>Twitter</span>
              </ShareOptionItem>
              <ShareOptionItem
                as="button"
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(window.location.href);
                    alert("Profile link copied to clipboard!");
                  } catch (err) {
                    console.error(err);
                  }
                  setShowShareModal(false);
                }}
              >
                <FiCopy size={20} />
                <span>Copy Link</span>
              </ShareOptionItem>
            </div>
          </ShareModalBox>
        </ShareModalOverlay>
      )}
    </PageWrap>
  );
};

export default ExpertProfilePage;
