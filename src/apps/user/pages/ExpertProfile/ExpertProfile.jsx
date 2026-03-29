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
  getPostsApi, 
  likePostApi, 
  unlikePostApi,
  getCommentsApi,
  addCommentApi,
} from "../../../../shared/api/expertapi/post.api";
import { usePublicExpert as useExpert } from "../../context/PublicExpertContext";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import { useWallet } from "../../../../shared/context/WalletContext";
import { socket } from "../../../../shared/api/socket";

const DEFAULT_AVATAR = "https://i.pravatar.cc/300?img=12";
const MIN_CHAT_MINUTES = 5;

// EXACT formatRelativeTime from MyOffer.jsx
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
  // Context hooks
  const { expertId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const userId = user?.id;
  const { balance } = useWallet();
  const {
    expertData,
    expertPrice,
    fetchProfile,
    fetchPrice,
    profileLoading,
    priceLoading,
  } = useExpert();

  // Memoized values
  const numericExpertId = useMemo(() => expertId ? Number(expertId) : null, [expertId]);

  // All states - EXACT pattern from MyOffer
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

  // Tab states
  const [activeTab, setActiveTab] = useState("about");
  const [experienceData, setExperienceData] = useState(null);
  const [experienceList, setExperienceList] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loadingExperience, setLoadingExperience] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [totalExperienceText, setTotalExperienceText] = useState("");
  
  // EXACT post interaction states from MyOffer
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
  const formattedAvgRating = useMemo(() => avgRating.toFixed(1), [avgRating]);
  const recentReviews = useMemo(() => reviews.slice(0, 3), [reviews]);

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

  // Fetch posts - EXACT pattern from MyOffer
  const fetchPosts = useCallback(async () => {
    if (!numericExpertId) return;
    setLoadingPosts(true);
    try {
      const response = await getPostsApi(numericExpertId);
      if (response.data?.success) {
        const postsData = response.data.data || [];
        setPosts(postsData);
        
        // EXACT like pattern from MyOffer
        const likedMap = {};
        postsData.forEach(post => {
          likedMap[post.id] = !!post.is_liked;
        });
        setLiked(likedMap);
        
        // Fetch review stats
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
  }, [numericExpertId]);

  // EXACT toggleLike from MyOffer
  const toggleLike = async (post) => {
    if (!isLoggedIn || !userId) {
      navigate("/user/auth", { state: { from: `/experts/${expertId}` } });
      return;
    }
    
    const isLiked = liked[post.id];
    setLiked((p) => ({ ...p, [post.id]: !isLiked }));

    try {
      if (isLiked) {
        await unlikePostApi({
          post_id: post.id,
          user_id: userId
        });
      } else {
        await likePostApi({
          post_id: post.id,
          user_id: userId
        });
      }
    } catch (err) {
      console.error("Like toggle error:", err);
      setLiked((p) => ({ ...p, [post.id]: isLiked }));
    }
  };

  // EXACT toggleSection from MyOffer
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

  // EXACT submitComment from MyOffer
  const submitComment = async (post) => {
    const text = commentText[post.id]?.trim();
    if (!text) return;

    try {
      const res = await addCommentApi({
        post_id: post.id,
        expert_id: numericExpertId,
        comment: text
      });

      setPosts(prev =>
        prev.map(p =>
          p.id === post.id
            ? { ...p, comments_count: p.comments_count + 1 }
            : p
        )
      );
      setComments((p) => ({
        ...p,
        [post.id]: [...(p[post.id] || []), res.data.data]
      }));
      setCommentText((p) => ({ ...p, [post.id]: "" }));
    } catch (err) {
      console.error("Add comment error:", err);
    }
  };

  // Followers & reviews loader
  const loadFollowersAndReviews = useCallback(() => {
    if (!expertId) return;

    getExpertFollowersApi(expertId)
      .then((res) => {
        const followers = res.data.followers || [];
        setFollowersCount(res.data.total_followers || followers.length);
        setFollowing(followers.some((f) => Number(f.id) === Number(userId)));
      })
      .catch((err) => console.error("Followers fetch failed", err));

    setLoadingReviews(true);
    getReviewsByExpertApi(expertId)
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
  }, [expertId, userId]);

  // Expert status listener
  useEffect(() => {
    if (!socket.connected) socket.connect();
    const handleExpertOnline = ({ expert_id }) => {
      if (Number(expert_id) === numericExpertId) {
        setIsExpertOnline(true);
      }
    };

    const handleExpertOffline = ({ expert_id }) => {
      if (Number(expert_id) === numericExpertId) {
        setIsExpertOnline(false);
      }
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
    setIsExpertOnline(false);
  }, [numericExpertId]);

  useEffect(() => {
    if (!numericExpertId) return;

    socket.emit("check_expert_online", {
      expertId: numericExpertId,
    });

    socket.on("expert_status", ({ expertId, online }) => {
      if (Number(expertId) === numericExpertId) {
        setIsExpertOnline(online);
      }
    });

    return () => socket.off("expert_status");
  }, [numericExpertId]);

  // Profile data fetch
  useEffect(() => {
    if (expertId) {
      fetchProfile(expertId);
      fetchPrice(expertId);
    }
  }, [expertId, fetchProfile, fetchPrice]);

  // Fetch experience data on component mount
  useEffect(() => {
    if (numericExpertId) {
      fetchExperience();
    }
  }, [numericExpertId, fetchExperience]);

  // Fetch posts when tab changes
  useEffect(() => {
    if (activeTab === "posts") {
      fetchPosts();
    }
  }, [activeTab, fetchPosts]);

  
  useEffect(() => {
    loadFollowersAndReviews();
  }, [loadFollowersAndReviews]);

  useEffect(() => {
    setChatRequestId(null);
    requestIdRef.current = null;
    setRequestingChat(false);
    setShowWaitingPopup(false);
  }, [numericExpertId]);

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

      if (reason === "user_cancelled") {
        setShowChatCancelled(true);
      }
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

  // Handlers
  const handleStart = useCallback((type) => {
    if (!isLoggedIn) {
      navigate("/user/auth", { state: { from: `/experts/${expertId}` } });
      return;
    }

    const perMinute = type === "chat"
      ? Number(expertPrice?.chat_per_minute || 0)
      : Number(expertPrice?.call_per_minute || 0);
    
    const minRequired = perMinute * MIN_CHAT_MINUTES;
    const userBalance = Number(balance || 0);

    if (userBalance >= minRequired) {
      if (requestingChat) return;
      setRequestingChat(true);
      setWaitingText("Waiting for expert to accept...");

      if (type === "chat" && numericExpertId) {
        socket.emit("request_chat", {
          user_id: userId,
          expert_id: numericExpertId,
          user_name: user?.name || user?.first_name || "User"
        });
      } else if (type === "call" && numericExpertId) {
        navigate(`/user/voice-call/${numericExpertId}`, {
          state: { fromProfile: true },
        });
      }
    } else {
      setRequiredAmount(Math.max(0, minRequired - userBalance));
      setShowRecharge(true);
    }
  }, [isLoggedIn, navigate, expertId, expertPrice, balance, userId, numericExpertId, requestingChat]);

  const handleFollowAction = useCallback(async () => {
    if (!isLoggedIn || !userId || !numericExpertId) {
      navigate("/user/auth", { state: { from: `/experts/${expertId}` } });
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
  }, [isLoggedIn, userId, numericExpertId, expertId, following, navigate]);

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
      await deleteReviewApi(expertId);
      setUserRating(0);
      setUserReviewText("");
      await loadFollowersAndReviews();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed. Please try again.");
    }
  }, [expertId, loadFollowersAndReviews]);

  const handleStarClick = useCallback((rating) => setUserRating(rating), []);
  
  const handleCancelRequest = useCallback(() => {
    if (!chatRequestId) return;

    socket.emit("cancel_chat_request", {
      request_id: chatRequestId,
    });

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
  const handleChatCancelledClose = useCallback(() => {
    setShowChatCancelled(false);
  }, []);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Early returns
  if (profileLoading || priceLoading) {
    return <div style={{ padding: 30, textAlign: "center" }}>Loading expert…</div>;
  }

  if (!expertData?.profile) {
    return <div style={{ padding: 30, textAlign: "center" }}>Expert not found.</div>;
  }

  const profile = expertData.profile;
  const price = expertPrice || {};

  const getInitials = (name = "") => {
    const words = name.trim().split(" ");
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return (words[0].charAt(0) + (words[1]?.charAt(0) || "")).toUpperCase();
  };

  const Spinner = () => (
    <div
      style={{
        width: 28,
        height: 28,
        border: "3px solid #e2e8f0",
        borderTopColor: "#0ea5e9",
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
      
      <PageWrap>
        {/* Main Profile Card */}
        <ProfileCard>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <div style={{ flex: '0 0 200px' }}>
              {profile.profile_photo ? (
                <LeftImage src={profile.profile_photo} alt="Profile" />
              ) : (
                <AvatarFallback>
                  {getInitials(profile.name)}
                </AvatarFallback>
              )}
              <div>
                {!following ? (
                  <FollowButton onClick={handleFollowAction}>
                    <FiUserPlus /> Follow
                  </FollowButton>
                ) : (
                  <FollowButton $active onClick={handleFollowAction}>
                    <FiUserCheck /> Following
                  </FollowButton>
                )}
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <div>
                  <Name>
                    {profile.name}{" "}
                    <VerifiedBadge>
                      <FiUserCheck size={14} /> Verified
                    </VerifiedBadge>
                  </Name>
                  <Role>{profile.position || "Expert"}</Role>
                  <Status $online={isExpertOnline}>
                    {isExpertOnline ? "🟢 Available Now" : "🔴 Offline"}
                  </Status>
                </div>
                
                {/* Quick Stats */}
                <QuickStats>
                  <StatItem>
                    <FiStar color="#facc15" />
                    <span>{formattedAvgRating} Rating</span>
                  </StatItem>
                  <StatItem>
                    <FiThumbsUp color="#10b981" />
                    <span>{followersCount} Followers</span>
                  </StatItem>
                  <StatItem>
                    <FiClock color="#6366f1" />
                    <span>
                      {totalExperienceText || experienceData?.total_text || `${profile.experience || "5"} Years`}
                    </span>
                  </StatItem>
                </QuickStats>
              </div>

              {/* Tags */}
              <TagList>
                <Tag><FiBookOpen /> Education: {profile.education || "Masters Degree"}</Tag>
                <Tag><FiTarget /> Category: {profile.category_name || "Business"}</Tag>
              </TagList>

              {/* Action Buttons */}
              <CallToAction>
                <div>
                  <PriceTag>₹{price.call_per_minute || 99} / min</PriceTag>
                  <ActionButton $primary onClick={() => handleStart("call")}>
                    <FiPhoneCall /> Start Call
                  </ActionButton>
                </div>
                <div>
                  <PriceTag>₹{price.chat_per_minute || 49} / min</PriceTag>
                  <ActionButton onClick={() => handleStart("chat")}>
                    <FiMessageSquare /> Start Chat
                  </ActionButton>
                </div>
              </CallToAction>
            </div>
          </div>
        </ProfileCard>

        {/* Tabs Section */}
        <Section>
          <TabContainer>
            <TabButton $active={activeTab === "about"} onClick={() => setActiveTab("about")}>
              <FiFileText /> About
            </TabButton>
            <TabButton $active={activeTab === "experience"} onClick={() => setActiveTab("experience")}>
              <FiBriefcase /> Experience
            </TabButton>
            <TabButton $active={activeTab === "posts"} onClick={() => setActiveTab("posts")}>
              <FiImage /> Posts
            </TabButton>
          </TabContainer>

          {/* About Tab Content */}
          {activeTab === "about" && (
            <TabContent>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>Professional Summary</InfoLabel>
                  <InfoValue>{profile.description || "Experienced professional with proven track record in the field. Committed to providing valuable insights and practical solutions."}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Price Details</InfoLabel>
                  <InfoValue>
                    <div><strong>Call:</strong> ₹{price.call_per_minute || 99}/min</div>
                    <div><strong>Chat:</strong> ₹{price.chat_per_minute || 49}/min</div>
                    {price.reason_for_price && <div><strong>Reason:</strong> {price.reason_for_price}</div>}
                  </InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Strengths</InfoLabel>
                  <InfoValue>{price.strength || "Expertise in field, Strong communication, Problem-solving"}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Customer Handling</InfoLabel>
                  <InfoValue>{price.handle_customer || "Professional approach, Quick response, Client satisfaction"}</InfoValue>
                </InfoItem>
              </InfoGrid>
            </TabContent>
          )}

          {/* Experience Tab Content */}
          {activeTab === "experience" && (
            <TabContent>
              {loadingExperience ? (
                <LoadingReviews><Spinner /><p>Loading experience...</p></LoadingReviews>
              ) : experienceList.length === 0 ? (
                <NoReviews>
                  <FiBriefcase size={48} color="#d1d5db" />
                  <h4>No experience records</h4>
                  <p>This expert hasn't added their experience yet.</p>
                </NoReviews>
              ) : (
                experienceList.map((exp) => (
                  <ExperienceCard key={exp.id}>
                    <ExperienceHeader>
                      <ExperienceTitle>{exp.title}</ExperienceTitle>
                      <ExperienceCompany>{exp.company}</ExperienceCompany>
                    </ExperienceHeader>
                    <ExperienceDate>
                      {formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : "Present"}
                    </ExperienceDate>
                    {exp.certificate && (
                      <ExperienceCertificate 
                        href={exp.certificate} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <FiAward /> View Certificate
                      </ExperienceCertificate>
                    )}
                  </ExperienceCard>
                ))
              )}
            </TabContent>
          )}

          {/* Posts Tab Content - EXACT pattern from MyOffer.jsx */}
          {activeTab === "posts" && (
            <TabContent>
              {loadingPosts ? (
                <LoadingReviews><Spinner /><p>Loading posts...</p></LoadingReviews>
              ) : posts.length === 0 ? (
                <NoReviews>
                  <FiImage size={48} color="#d1d5db" />
                  <h4>No posts yet</h4>
                  <p>This expert hasn't shared any posts.</p>
                </NoReviews>
              ) : (
                <PostGrid>
                  {posts.map((post) => {
                    const isLiked = liked[post.id];
                    return (
                      <PostCard key={post.id}>
                        {post.image_url && (
                          <PostImage src={post.image_url} alt={post.title} />
                        )}
                        <PostHeader>
                          <PostTitle>{post.title}</PostTitle>
                        </PostHeader>
                        {post.description && (
                          <PostDescription>{post.description}</PostDescription>
                        )}
                        
                        {/* Post Stats - EXACT from MyOffer */}
                        <PostStats>
                          <PostStat>
                            <FiHeart 
                              fill={isLiked ? "#ef4444" : "none"} 
                              stroke={isLiked ? "#ef4444" : "#374151"}
                              style={{ strokeWidth: isLiked ? 0 : 2 }}
                            />
                            {post.likes + (isLiked ? 1 : 0)}
                          </PostStat>
                          <PostStat>
                            <FiMessageCircle />
                            {post.comments_count}
                          </PostStat>
                        </PostStats>
                        
                        {/* Post Actions - EXACT from MyOffer */}
                        <PostActions>
                          <PostActionBtn 
                            $liked={!!liked[post.id]}
                            onClick={() => toggleLike(post)}
                          >
                            <FiHeart 
                              fill={liked[post.id] ? "#ef4444" : "none"} 
                              stroke={liked[post.id] ? "#ef4444" : "#374151"}
                              style={{ strokeWidth: liked[post.id] ? 0 : 2 }}
                            />
                            {liked[post.id] ? "Liked" : "Like"}
                          </PostActionBtn>
                          <PostActionBtn onClick={() => toggleSection("comments", post.id)}>
                            <FiMessageCircle /> Comment
                          </PostActionBtn>
                        </PostActions>

                        {/* Comments Section - EXACT from MyOffer */}
                        {activeSection === `comments-${post.id}` && (
                          <div style={{ marginTop: 16, borderTop: "1px solid #e5e7eb", paddingTop: 12 }}>
                            {(comments[post.id] || []).map((c) => (
                              <div key={c.id} style={{ marginBottom: 12, padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}>
                                <div style={{ fontSize: 14, color: "#1f2937" }}>
                                  {c.comment}
                                  {c.user_id === userId && (
                                    <span style={{ color: "#9ca3af", fontSize: 11, marginLeft: 8 }}>You</span>
                                  )}
                                </div>
                                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>
                                  {c.user_name || "User"} • {formatRelativeTime(c.created_at)}
                                </div>
                              </div>
                            ))}
                            <div style={{ display: "flex", gap: 8, alignItems: "flex-end", marginTop: 8 }}>
                              <InlineInput
                                placeholder="Write a comment…"
                                value={commentText[post.id] || ""}
                                onChange={(e) => setCommentText(p => ({ ...p, [post.id]: e.target.value }))}
                                onKeyDown={(e) => e.key === "Enter" && submitComment(post)}
                              />
                              <SendBtn onClick={() => submitComment(post)}><FiSend /></SendBtn>
                            </div>
                          </div>
                        )}
                      </PostCard>
                    );
                  })}
                </PostGrid>
              )}
            </TabContent>
          )}
        </Section>

        {/* Review Section - EXACT pattern from MyOffer's review display */}
        <ReviewSection>
          <ReviewHeader>
            <div>
              <SectionTitle>Rating & Reviews</SectionTitle>
            </div>
          </ReviewHeader>

          {/* Add/Edit Review Form */}
          <ReviewForm>
            <ReviewFormTitle>
              <FiStar color="#f59e0b" />
              {hasUserReview ? 'Update Your Review' : 'Add Your Review'}
            </ReviewFormTitle>
            
            <form onSubmit={handleSubmitReview}>
              <RatingInput>
                <RatingLabel>Your Rating:</RatingLabel>
                <StarRating>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      $filled={star <= userRating}
                      onClick={() => handleStarClick(star)}
                      type="button"
                      disabled={submittingReview}
                      title={`${star} star${star > 1 ? 's' : ''}`}
                    >
                      <FiStar />
                    </Star>
                  ))}
                </StarRating>
              </RatingInput>

              <TextAreaContainer>
                <ReviewTextarea
                  placeholder="share your experience"
                  value={userReviewText}
                  onChange={(e) => setUserReviewText(e.target.value)}
                  disabled={submittingReview}
                  maxLength={500}
                  rows={4}
                />
              </TextAreaContainer>

              <FormActions>
                {isLoggedIn ? (
                  <>
                    <SubmitButton 
                      type="submit" 
                      disabled={!userRating || submittingReview}
                      $disabled={!userRating}
                    >
                      {submittingReview ? (
                        <>
                          <div style={{ 
                            width: '16px', 
                            height: '16px', 
                            border: '2px solid rgba(255,255,255,0.3)', 
                            borderTopColor: 'white',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                            marginRight: '8px'
                          }} />
                          {hasUserReview ? 'Updating...' : 'Adding...'}
                        </>
                      ) : (
                        <>
                          <FiStar />
                          {hasUserReview ? 'Update Review' : 'Submit Review'}
                        </>
                      )}
                    </SubmitButton>
                    
                    {hasUserReview && (
                      <DeleteButton 
                        type="button" 
                        onClick={handleDeleteReview}
                        disabled={submittingReview}
                      >
                        <FiX />
                        Delete Review
                      </DeleteButton>
                    )}
                  </>
                ) : (
                  <LoginPrompt>
                    <p>Please login to leave a review</p>
                    <LoginButton onClick={() => navigate('/user/auth')}>
                      <FiUserCheck />
                      Login to Review
                    </LoginButton>
                  </LoginPrompt>
                )}
              </FormActions>
            </form>
          </ReviewForm>

          {/* All Reviews List */}
          <RecentReviewsTitle>
            <FiMessageSquare />
            All Reviews ({reviews.length})
          </RecentReviewsTitle>

          <ReviewList>
            {loadingReviews ? (
              <LoadingReviews>
                <Spinner />
                <p>Loading reviews...</p>
              </LoadingReviews>
            ) : reviews.length === 0 ? (
              <NoReviews>
                <FiStar size={48} color="#d1d5db" />
                <h4>No reviews yet</h4>
                <p>Be the first to review this expert!</p>
              </NoReviews>
            ) : (
              reviews.map((r) => (
                <ReviewItem key={r.id}>
                  <ReviewUser>
                    <UserAvatar>
                      {r.first_name?.charAt(0) || r.last_name?.charAt(0) || 'U'}
                    </UserAvatar>
                    <UserInfo>
                      <UserName>
                        {`${r.first_name || ""} ${r.last_name || ""}`.trim() || "Anonymous User"}
                      </UserName>
                      <ReviewMeta>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {[...Array(5)].map((_, i) => (
                            <FiStar 
                              key={i} 
                              size={14} 
                              color={i < (r.rating_number || 0) ? "#facc15" : "#d1d5db"} 
                            />
                          ))}
                          <span style={{ marginLeft: '6px', fontWeight: '600' }}>
                            {r.rating_number}/5
                          </span>
                        </div>
                        <ReviewDate>
                          {r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Recently'}
                        </ReviewDate>
                      </ReviewMeta>
                    </UserInfo>
                  </ReviewUser>
                  <ReviewText>
                    {r.review_text || "The expert provided excellent service and valuable insights."}
                  </ReviewText>
                </ReviewItem>
              ))
            )}
          </ReviewList>
        </ReviewSection>

        {/* Modals */}
        {showRecharge && (
          <div style={{ 
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", 
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 
          }}>
            <div style={{ 
              background: "#fff", padding: 28, borderRadius: 16, 
              width: "min(90vw, 380px)", textAlign: "center", 
              boxShadow: "0 20px 40px rgba(0,0,0,0.15)" 
            }}>
              <h3 style={{ margin: 0, marginBottom: 12, color: "#0f172a" }}>Low Balance</h3>
              <p style={{ margin: 0, marginBottom: 20, color: "#475569" }}>
                Need <strong>₹{requiredAmount.toFixed(2)}</strong> more.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <ActionButton $primary onClick={() => navigate("/user/wallet")}>
                  Recharge Now
                </ActionButton>
                <ActionButton onClick={handleRechargeClose}>Cancel</ActionButton>
              </div>
            </div>
          </div>
        )}

        {showUnfollowModal && (
          <div style={{ 
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", 
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 
          }}>
            <div style={{ 
              background: "#fff", padding: 24, borderRadius: 16, 
              width: "min(90vw, 420px)", boxShadow: "0 25px 50px rgba(0,0,0,0.15)" 
            }}>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                <FiX size={20} style={{ cursor: "pointer" }} onClick={handleUnfollowClose} />
              </div>
              <h3 style={{ margin: 0, marginBottom: 12, color: "#0f172a" }}>
                Unfollow {profile.name}?
              </h3>
              <p style={{ margin: 0, marginBottom: 24, color: "#475569" }}>
                You won't get their updates anymore.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button
                  onClick={handleUnfollowClose}
                  style={{
                    padding: "10px 20px", borderRadius: 8, border: "1px solid #e2e8f0",
                    background: "#fff", color: "#475569", fontWeight: 500, cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUnfollowConfirm}
                  style={{
                    padding: "10px 20px", borderRadius: 8, background: "#ef4444",
                    color: "#fff", border: "none", fontWeight: 500, cursor: "pointer",
                  }}
                >
                  Unfollow
                </button>
              </div>
            </div>
          </div>
        )}

        {showWaitingPopup && (
          <div style={{ 
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", 
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 
          }}>
            <div style={{ 
              background: "#fff", padding: 28, borderRadius: 18, 
              width: "min(90vw, 420px)", textAlign: "center", 
              boxShadow: "0 25px 60px rgba(0,0,0,0.2)" 
            }}>
              <h3 style={{ margin: 0, color: "#0f172a" }}>Request Sent</h3>
              <p style={{ marginTop: 12, color: "#475569" }}>{waitingText}</p>
              <div style={{ marginTop: 18 }}>
                <Spinner />
              </div>
              <button
                onClick={handleCancelRequest}
                style={{
                  marginTop: 22, padding: "10px 18px", borderRadius: 999,
                  border: "1px solid #e2e8f0", background: "#f8fafc",
                  color: "#334155", fontWeight: 500, cursor: "pointer",
                }}
              >
                Cancel Request
              </button>
            </div>
          </div>
        )}

        {chatRejectedMessage && (
          <div style={{ 
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", 
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 
          }}>
            <div style={{ 
              background: "#fff", padding: 24, borderRadius: 16, 
              width: "min(90vw, 400px)", textAlign: "center", 
              boxShadow: "0 25px 50px rgba(0,0,0,0.15)" 
            }}>
              <FiX size={24} color="#ef4444" style={{ marginBottom: 12 }} />
              <h3 style={{ margin: 0, marginBottom: 8, color: "#dc2626" }}>Request Declined</h3>
              <p style={{ margin: 0, marginBottom: 20, color: "#475569" }}>
                {chatRejectedMessage}
              </p>
              <ActionButton onClick={handleChatRejectedClose} $primary>
                OK
              </ActionButton>
            </div>
          </div>
        )}

        {showChatCancelled && (
          <div style={{ 
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", 
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 
          }}>
            <div style={{ 
              background: "#fff", padding: 24, borderRadius: 16, 
              width: "min(90vw, 400px)", textAlign: "center", 
              boxShadow: "0 25px 50px rgba(0,0,0,0.15)" 
            }}>
              <FiX size={24} color="#6b7280" style={{ marginBottom: 12 }} />
              <h3 style={{ margin: 0, marginBottom: 8, color: "#475569" }}>Request Cancelled</h3>
              <p style={{ margin: 0, marginBottom: 20, color: "#475569" }}>
                Your chat request has been cancelled.
              </p>
              <ActionButton onClick={handleChatCancelledClose} $primary>
                OK
              </ActionButton>
            </div>
          </div>
        )}
      </PageWrap>
    </>
  );
};

export default ExpertProfilePage;