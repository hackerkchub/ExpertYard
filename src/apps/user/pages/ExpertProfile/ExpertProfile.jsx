import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiPhoneCall,
  FiMessageSquare,
  FiStar,
  FiUserPlus,
  FiUserCheck,
  FiX,
  FiBell,
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
} from "react-icons/fi";

import {
  PageWrap,
  FollowButton,
  VerifiedBadge,
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
  getExpertFeedApi,   // 🔥 add this
  likePostApi, 
  unlikePostApi,
  getCommentsApi,
  addCommentApi,
} from "../../../../shared/api/expertapi/post.api";
import { usePublicExpert as useExpert } from "../../context/PublicExpertContext";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import { useWallet } from "../../../../shared/context/WalletContext";
import { socket } from "../../../../shared/api/socket";
import { 
  getPlansApi, 
  buySubscriptionApi, 
  getMySubscriptionApi 
} from "../../../../shared/api/userApi/subscription.api";

const DEFAULT_AVATAR = "https://i.pravatar.cc/300?img=12";
const MIN_CHAT_MINUTES = 5;

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
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const userId = user?.id;
  const { balance, fetchWallet} = useWallet();
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

 const numericExpertId = expertData?.expertId || null;

  // All states
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
  const [chatRequestId, setChatRequestId] = useState(null);
  const [showWaitingPopup, setShowWaitingPopup] = useState(false);
  const [waitingText, setWaitingText] = useState("Waiting for expert to accept...");
  const [isExpertOnline, setIsExpertOnline] = useState(false);
  const [showChatCancelled, setShowChatCancelled] = useState(false);
  const [chatRejectedMessage, setChatRejectedMessage] = useState("");
  const [calling, setCalling] = useState(false);
  const [requestingChat, setRequestingChat] = useState(false);
  const requestIdRef = useRef(null);
  const successTimeoutRef = useRef(null);

  // Tab states
  const [activeTab, setActiveTab] = useState("about");
  const [experienceData, setExperienceData] = useState(null);
  const [experienceList, setExperienceList] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loadingExperience, setLoadingExperience] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
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

  if (Array.isArray(expertPrice.pricing_modes)) {
    return expertPrice.pricing_modes;
  }

  if (typeof expertPrice.pricing_modes === 'string') {
    try {
      return JSON.parse(expertPrice.pricing_modes);
    } catch {
      return expertPrice.pricing_modes
        .split(",")
        .map(mode => mode.trim());
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

    if (plans && plans.length > 0) {
      prices.hasSubscription = true;
    }

    return prices;
  }, [pricingModes, expertPrice, plans]);

  const hasActiveSubscription = useMemo(() => {
    if (!activeSubscription) return false;
    return activeSubscription.status === 'active' && new Date(activeSubscription.end_date) > new Date();
  }, [activeSubscription]);
  
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
      navigate("/user/auth", { state: { from: `/experts/${slug}` } });
      return;
    }

    if (hasActiveSubscription) {
      alert("You already have an active subscription for this expert.");
      return;
    }

    const userBalance = Number(balance || 0);
    if (userBalance < plan.price) {
      setRequiredAmount(plan.price - userBalance);
      setShowRecharge(true);
      return;
    }

    setPurchasingPlan(plan.id);
    try {
      const response = await buySubscriptionApi(plan.id);
      if (response.data.success) {
        setShowSubscribeSuccess(true);
        await fetchActiveSubscription();
        await fetchWallet();
        setShowPlansModal(false);
        
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
  }, [isLoggedIn, navigate, balance, hasActiveSubscription, fetchActiveSubscription, fetchWallet]);

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

      // ✅ liked map from backend
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

  const toggleLike = async (post) => {
  if (!isLoggedIn || !userId) return;

  const postId = getPostId(post);
  const isLiked = liked[postId];

  // ✅ Optimistic update
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

    // ✅ Sync with backend (IMPORTANT)
    setPosts(prev =>
      prev.map(p => {
        const pId = getPostId(p);
        if (pId === postId) {
          return {
            ...p,
            likes: res.data.likes // 🔥 exact backend value
          };
        }
        return p;
      })
    );

  } catch (err) {
    console.error("Like error:", err);

    // ❌ rollback
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

    // ✅ NEW COMMENT OBJECT (IMPORTANT)
    const newComment = {
      id: res.data.data?.id || Date.now(),
      comment: text,
      user_id: userId,
      created_at: new Date().toISOString()
    };

    // ✅ Update posts count
    setPosts(prev =>
      prev.map(p => {
        const pId = getPostId(p);
        if (pId === postId) {
          return { ...p, comments_count: (p.comments_count || 0) + 1 };
        }
        return p;
      })
    );

    // ✅ Instant UI update
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

  // Expert status listener
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
  // 🔹 Profile load
useEffect(() => {
  if (slug) {
    fetchProfile(slug);
  }
}, [slug, fetchProfile]);

// 🔹 Price load AFTER expertId mile
useEffect(() => {
  if (numericExpertId) {
    fetchPrice(numericExpertId);
  }
}, [numericExpertId, fetchPrice]);

  useEffect(() => {
    if (numericExpertId) fetchExperience();
  }, [numericExpertId, fetchExperience]);

  useEffect(() => {
    if (activeTab === "posts") fetchPosts();
  }, [activeTab, fetchPosts]);

  useEffect(() => {
    if (numericExpertId && isLoggedIn) {
      fetchPlans();
      fetchActiveSubscription();
    }
  }, [numericExpertId, isLoggedIn, fetchPlans, fetchActiveSubscription]);
  
  useEffect(() => {
    loadFollowersAndReviews();
  }, [loadFollowersAndReviews]);

  useEffect(() => {
    setChatRequestId(null);
    requestIdRef.current = null;
    setRequestingChat(false);
    setShowWaitingPopup(false);
  }, [numericExpertId]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
    };
  }, []);

  // Socket events for chat
  useEffect(() => {
    const handleRequestPending = ({ request_id }) => {
      setRequestingChat(false);
      setChatRequestId(request_id);
      requestIdRef.current = request_id;
      setShowWaitingPopup(true);
      setWaitingText("Waiting for expert to accept...");
    };

    const handleChatAccepted = ({ room_id }) => {
      if (!room_id) return;
      setRequestingChat(false);
      setShowWaitingPopup(false);
      setChatRequestId(null);
      requestIdRef.current = null;
      navigate(`/user/chat/${room_id}`, {
        replace: true,
        state: { fromRequest: true }
      });
    };

    const handleChatRejected = ({ request_id, reason }) => {
      if (reason === "offline") {
        setRequestingChat(false);
        setChatRejectedMessage("Expert is currently offline");
        return;
      }
      if (request_id !== requestIdRef.current) return;
      setRequestingChat(false);
      setShowWaitingPopup(false);
      setChatRequestId(null);
      requestIdRef.current = null;
      if (reason === "busy") {
        setChatRejectedMessage("Expert is busy on another chat");
      } else {
        setChatRejectedMessage("Expert rejected your request");
      }
    };

    const handleChatCancelled = ({ request_id, reason }) => {
      if (request_id !== requestIdRef.current) return;
      setRequestingChat(false);
      setShowWaitingPopup(false);
      setChatRequestId(null);
      requestIdRef.current = null;
      if (reason === "timeout") {
        setChatRejectedMessage("Expert did not respond");
        return;
      }
      if (reason === "user_cancelled") setShowChatCancelled(true);
    };

    socket.on("request_pending", handleRequestPending);
    socket.on("chat_accepted", handleChatAccepted);
    socket.on("chat_rejected", handleChatRejected);
    socket.on("chat_cancelled", handleChatCancelled);

    return () => {
      socket.off("request_pending", handleRequestPending);
      socket.off("chat_accepted", handleChatAccepted);
      socket.off("chat_rejected", handleChatRejected);
      socket.off("chat_cancelled", handleChatCancelled);
    };
  }, [navigate]);

  // Handle start call/chat with selected pricing mode
  const handleStart = useCallback((type) => {
    if (!isLoggedIn) {
      navigate("/user/auth", { state: { from: `/experts/${slug}` } });
      return;
    }

    // If has active subscription, use subscription mode
    if (hasActiveSubscription) {
      if (type === "chat" && numericExpertId) {
        socket.emit("request_chat", {
          user_id: userId,
          expert_id: numericExpertId,
          user_name: user?.name || user?.first_name || "User",
          pricing_mode: "subscription"
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
      // Handle session booking - similar to per minute but with one-time payment
      const sessionPrice = currentPricingInfo.price;
      const userBalance = Number(balance || 0);

      if (userBalance >= sessionPrice) {
        if (requestingChat) return;
        setRequestingChat(true);
        setWaitingText("Waiting for expert to accept session...");

        if (type === "chat" && numericExpertId) {
          // Send chat request with session mode
          socket.emit("request_chat", {
            user_id: userId,
            expert_id: numericExpertId,
            user_name: user?.name || user?.first_name || "User",
            pricing_mode: "session"
          });
        } else if (type === "call" && numericExpertId) {
          // For session call, redirect to call page with session mode
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
        if (requestingChat) return;
        setRequestingChat(true);
        setWaitingText("Waiting for expert to accept...");

        if (type === "chat" && numericExpertId) {
          socket.emit("request_chat", {
            user_id: userId,
            expert_id: numericExpertId,
            user_name: user?.name || user?.first_name || "User",
            pricing_mode: "per_minute"
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
  }, [isLoggedIn, navigate, displayPrices, balance, userId, numericExpertId, requestingChat, hasActiveSubscription, currentPricingInfo, profile]);

  const handleFollowAction = useCallback(async () => {
    if (!isLoggedIn || !userId || !numericExpertId) {
      navigate("/user/auth", { state: { from: `/experts/${slug}` } });
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
  
  const handleCancelRequest = useCallback(() => {
    if (!chatRequestId) return;
    socket.emit("cancel_chat_request", { request_id: chatRequestId });
    setRequestingChat(false);
    setShowWaitingPopup(false);
    setChatRequestId(null);
    requestIdRef.current = null;
  }, [chatRequestId]);

  const handleRechargeClose = useCallback(() => {
    setShowRecharge(false);
    setRequiredAmount(0);
  }, []);

  const handleUnfollowClose = useCallback(() => setShowUnfollowModal(false), []);
  const handleChatRejectedClose = useCallback(() => {
    setChatRejectedMessage("");
    setRequestingChat(false);
  }, []);
  const handleChatCancelledClose = useCallback(() => setShowChatCancelled(false), []);

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
    return <div style={{ padding: 30, textAlign: "center" }}>Loading expert…</div>;
  }

  if (!expertData?.profile) {
    return <div style={{ padding: 30, textAlign: "center" }}>Expert not found.</div>;
  }

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      
      <PageWrap>
        <ProfileCard>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <div style={{ flex: '0 0 200px' }}>
              {profile.profile_photo ? (
                <LeftImage src={profile.profile_photo} alt="Profile" />
              ) : (
                <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
              )}
              <div>
                {!following ? (
                  <FollowButton onClick={handleFollowAction}><FiUserPlus /> Follow</FollowButton>
                ) : (
                  <FollowButton $active onClick={handleFollowAction}><FiUserCheck /> Following</FollowButton>
                )}
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <div>
                  <Name>{profile.name} <VerifiedBadge><FiUserCheck size={14} /> Verified</VerifiedBadge></Name>
                  <Role>{profile.position || "Expert"}</Role>
                  <Status $online={isExpertOnline}>{isExpertOnline ? "🟢 Available Now" : "🔴 Offline"}</Status>
                </div>
                
                <QuickStats>
                  <StatItem><FiStar color="#facc15" /><span>{formattedAvgRating} Rating</span></StatItem>
                  <StatItem><FiThumbsUp color="#10b981" /><span>{followersCount} Followers</span></StatItem>
                  <StatItem><FiClock color="#6366f1" /><span>{totalExperienceText || experienceData?.total_text || `${profile.experience || "5"} Years`}</span></StatItem>
                </QuickStats>
              </div>

              <TagList>
                <Tag><FiBookOpen /> Education: {profile.education || "Masters Degree"}</Tag>
                <Tag><FiTarget /> Category: {profile.category_name || "Business"}</Tag>
              </TagList>

              {/* NEW: Pricing Mode Selection Tabs */}
              {availablePricingModes.length > 0 && !hasActiveSubscription && (
                <div style={{ marginBottom: 20 }}>
                  <PricingModeTabs>
                    {availablePricingModes.map((mode) => (
                      <PricingModeTab
                        key={mode.id}
                        $active={selectedPricingMode === mode.id}
                        onClick={() => setSelectedPricingMode(mode.id)}
                      >
                        {mode.icon}
                        {mode.label}
                      </PricingModeTab>
                    ))}
                  </PricingModeTabs>
                  <PricingInfo>
                    {selectedPricingMode === "per_minute" && (
                      <span>💬 Chat: ₹{displayPrices.chatPrice}/min | 📞 Call: ₹{displayPrices.callPrice}/min</span>
                    )}
                    {selectedPricingMode === "session" && (
                      <span>🎯 Session: ₹{displayPrices.sessionPrice} for {displayPrices.sessionDuration} minutes</span>
                    )}
                    {selectedPricingMode === "subscription" && (
                      <span>📦 Get unlimited access with subscription plans</span>
                    )}
                  </PricingInfo>
                </div>
              )}

              {/* Active Subscription Display */}
              {hasActiveSubscription && activeSubscription && (
                <ActiveSubscriptionCard>
                  <SubscriptionInfo>
                    <FiCheckCircle color="#10b981" size={20} />
                    <div>
                      <strong>Active Subscription</strong>
                      <small>Valid until {formatDate(activeSubscription.end_date)}</small>
                    </div>
                  </SubscriptionInfo>
                  
                  <SubscriptionRemaining>
                    {activeSubscription.remaining_total_minutes !== null && (
                      <>
                        <UsageText>{Math.floor(activeSubscription.remaining_total_minutes)} minutes remaining</UsageText>
                        <ProgressBar><div style={{ width: `${getRemainingPercentage()}%`, height: "100%", background: "#10b981", borderRadius: 4, transition: "width 0.3s ease" }} /></ProgressBar>
                      </>
                    )}
                  </SubscriptionRemaining>
                </ActiveSubscriptionCard>
              )}

              {/* Action Buttons based on selected pricing mode */}
              <CallToAction>
                <div>
                  {hasActiveSubscription ? (
                    <>
                      <PriceTag style={{ background: "#10b981", color: "white" }}><FiUnlock /> Active Subscription</PriceTag>
                      <ActionButton $primary onClick={() => handleStart("call")}><FiPhoneCall /> Call (Free)</ActionButton>
                    </>
                  ) : selectedPricingMode === "per_minute" && displayPrices.hasPerMinute ? (
                    <>
                      <PriceTag>₹{displayPrices.callPrice}/min</PriceTag>
                      <ActionButton $primary onClick={() => handleStart("call")}><FiPhoneCall /> Start Call</ActionButton>
                    </>
                  ) : selectedPricingMode === "session" && displayPrices.hasSession ? (
                    <>
                      <PriceTag>₹{displayPrices.sessionPrice}</PriceTag>
                      <ActionButton $primary onClick={() => handleStart("call")}><FiPhoneCall /> Book Session Call</ActionButton>
                    </>
                  ) : selectedPricingMode === "subscription" && displayPrices.hasSubscription ? (
                    <>
                      <PriceTag style={{ background: "#8b5cf6", color: "white" }}><FiZap /> Subscribe</PriceTag>
                      <ActionButton $primary onClick={() => setShowPlansModal(true)}><FiZap /> View Plans</ActionButton>
                    </>
                  ) : null}
                </div>
                <div>
                  {hasActiveSubscription ? (
                    <>
                      <PriceTag style={{ background: "#10b981", color: "white" }}><FiUnlock /> Active Subscription</PriceTag>
                      <ActionButton onClick={() => handleStart("chat")}><FiMessageSquare /> Chat (Free)</ActionButton>
                    </>
                  ) : selectedPricingMode === "per_minute" && displayPrices.hasPerMinute ? (
                    <>
                      <PriceTag>₹{displayPrices.chatPrice}/min</PriceTag>
                      <ActionButton onClick={() => handleStart("chat")}><FiMessageSquare /> Start Chat</ActionButton>
                    </>
                  ) : selectedPricingMode === "session" && displayPrices.hasSession ? (
                    <>
                      <PriceTag>₹{displayPrices.sessionPrice}</PriceTag>
                      <ActionButton onClick={() => handleStart("chat")}><FiMessageSquare /> Book Session Chat</ActionButton>
                    </>
                  ) : selectedPricingMode === "subscription" && displayPrices.hasSubscription ? (
                    <>
                      <PriceTag style={{ background: "#8b5cf6", color: "white" }}><FiZap /> Subscribe</PriceTag>
                      <ActionButton onClick={() => setShowPlansModal(true)}><FiZap /> Subscribe Now</ActionButton>
                    </>
                  ) : null}
                </div>
              </CallToAction>

              {/* Subscription CTA Button - Only show if expert has plans and user has no active subscription */}
              {isLoggedIn && !hasActiveSubscription && plans.length > 0 && selectedPricingMode !== "subscription" && (
                <div style={{ marginTop: 16, textAlign: "center" }}>
                  <button onClick={() => setShowPlansModal(true)} style={{
                    padding: "10px 24px", background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
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

        {/* Tabs Section */}
        <Section>
          <TabContainer>
            <TabButton $active={activeTab === "about"} onClick={() => setActiveTab("about")}><FiFileText /> About</TabButton>
            <TabButton $active={activeTab === "experience"} onClick={() => setActiveTab("experience")}><FiBriefcase /> Experience</TabButton>
            <TabButton $active={activeTab === "posts"} onClick={() => setActiveTab("posts")}><FiImage /> Posts</TabButton>
          </TabContainer>

          {activeTab === "about" && (
            <TabContent>
              <InfoGrid>
                <InfoItem><InfoLabel>Professional Summary</InfoLabel><InfoValue>{profile.description || "Experienced professional with proven track record in the field."}</InfoValue></InfoItem>
                <InfoItem>
                  <InfoLabel>Price Details</InfoLabel>
                  <InfoValue>
                    {displayPrices.hasPerMinute && <div><strong>Call:</strong> ₹{displayPrices.callPrice}/min | <strong>Chat:</strong> ₹{displayPrices.chatPrice}/min</div>}
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
                    // ✅ FIX: Consistent postId extraction
                    const postId = getPostId(post);
                    const isLiked = liked[postId];
                    
                    return (
                      <PostCard key={postId}>
                        {post.image_url && <PostImage src={post.image_url} alt={post.title} />}
                        <PostHeader><PostTitle>{post.title}</PostTitle></PostHeader>
                        {post.description && <PostDescription>{post.description}</PostDescription>}
                        
                        <PostActions>
                          {/* LIKE BUTTON */}
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

                          {/* COMMENT BUTTON */}
                          <PostActionBtn
                            onClick={() => toggleSection("comments", postId)}
                          >
                            <FiMessageCircle />
                            {post.comments_count}
                          </PostActionBtn>
                        </PostActions>

                        {/* COMMENTS SECTION */}
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
        </Section>

        {/* Review Section */}
        <ReviewSection>
          <ReviewHeader><div><SectionTitle>Rating & Reviews</SectionTitle></div></ReviewHeader>

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
                  <LoginPrompt><p>Please login to leave a review</p><LoginButton onClick={() => navigate('/user/auth')}><FiUserCheck />Login to Review</LoginButton></LoginPrompt>
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

        {/* Subscription Plans Modal */}
        {showPlansModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, overflowY: "auto", padding: 10 }}>
            <div style={{ background: "#fff", padding: 28, borderRadius: 24, width: "min(90vw, 800px)", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 25px 50px rgba(0,0,0,0.25)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "20px 0 24px" }}>
                <h2 style={{ margin: 0, color: "#0f172a" }}>Subscription Plans</h2>
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
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
            <div style={{ background: "#fff", padding: 28, borderRadius: 16, width: "min(90vw, 380px)", textAlign: "center" }}>
              <h3 style={{ margin: 0, marginBottom: 12, color: "#0f172a" }}>Low Balance</h3>
              <p style={{ margin: 0, marginBottom: 20, color: "#475569" }}>Need <strong>₹{requiredAmount.toFixed(2)}</strong> more.</p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <ActionButton $primary onClick={() => navigate("/user/wallet")}>Recharge Now</ActionButton>
                <ActionButton onClick={handleRechargeClose}>Cancel</ActionButton>
              </div>
            </div>
          </div>
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

        {/* Chat Request Popups */}
        {showWaitingPopup && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}>
            <div style={{ background: "#fff", padding: 28, borderRadius: 18, width: "min(90vw, 420px)", textAlign: "center" }}>
              <h3 style={{ margin: 0, color: "#0f172a" }}>Request Sent</h3>
              <p style={{ marginTop: 12, color: "#475569" }}>{waitingText}</p>
              <div style={{ marginTop: 18 }}><Spinner /></div>
              <button onClick={handleCancelRequest} style={{ marginTop: 22, padding: "10px 18px", borderRadius: 999, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#334155", fontWeight: 500, cursor: "pointer" }}>Cancel Request</button>
            </div>
          </div>
        )}

        {chatRejectedMessage && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}>
            <div style={{ background: "#fff", padding: 24, borderRadius: 16, width: "min(90vw, 400px)", textAlign: "center" }}>
              <FiX size={24} color="#ef4444" style={{ marginBottom: 12 }} />
              <h3 style={{ margin: 0, marginBottom: 8, color: "#dc2626" }}>Request Declined</h3>
              <p style={{ margin: 0, marginBottom: 20, color: "#475569" }}>{chatRejectedMessage}</p>
              <ActionButton onClick={handleChatRejectedClose} $primary>OK</ActionButton>
            </div>
          </div>
        )}

        {showChatCancelled && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}>
            <div style={{ background: "#fff", padding: 24, borderRadius: 16, width: "min(90vw, 400px)", textAlign: "center" }}>
              <FiX size={24} color="#6b7280" style={{ marginBottom: 12 }} />
              <h3 style={{ margin: 0, marginBottom: 8, color: "#475569" }}>Request Cancelled</h3>
              <p style={{ margin: 0, marginBottom: 20, color: "#475569" }}>Your chat request has been cancelled.</p>
              <ActionButton onClick={handleChatCancelledClose} $primary>OK</ActionButton>
            </div>
          </div>
        )}
      </PageWrap>
    </>
  );
};

export default ExpertProfilePage;
