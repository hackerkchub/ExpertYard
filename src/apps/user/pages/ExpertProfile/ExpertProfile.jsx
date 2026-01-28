import React, { useEffect, useState, useCallback, useMemo } from "react";
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
} from "react-icons/fi";

import {
  PageWrap,
  HeaderBar,
  BackButton,
  LeftColumn,
  FollowButton,
  MiniRating,
  VerifiedBadge,
  TopSection,
   ReviewForm,
  ReviewFormTitle,
  RatingInput,
  RatingLabel,
  RatingValue,
  TextAreaContainer,
  ReviewTextarea,
  CharCount,
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
  RightInfo,
  Name,
  Role,
  Status,
  Section,
  SectionTitle,
  SectionBody,
  TwoColumn,
  ListItem,
  ActionButton,
  PriceTag,
  ReviewBox,
  ReviewItem,
  ReviewUser,
  ReviewText,
  RatingRow,
  StarRating,
  Star,
  NotificationBadge,
  // New styled components
  ProfileCard,
  ExpertiseGrid,
  ExpertiseCard,
  StatItem,
  CallToAction,
  ReviewSection,
  ReviewHeader,
  ReviewList,
  QuickStats,
  TagList,
  Tag,
} from "./ExpertProfile.styles";

import {
  followExpertApi,
  unfollowExpertApi,
  getExpertFollowersApi,
} from "../../../../shared/api/expertApi/follower.api";

import {
  addOrUpdateReviewApi,
  getReviewsByExpertApi,
  deleteReviewApi,
} from "../../../../shared/api/expertApi/reviews.api";

import { useExpert } from "../../../../shared/context/ExpertContext";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import { useWallet } from "../../../../shared/context/WalletContext";
import { socket } from "../../../../shared/api/socket";

const DEFAULT_AVATAR = "https://i.pravatar.cc/300?img=12";
// ✅ FIX 4: Replace magic number with constant
const MIN_CHAT_MINUTES = 5;

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

  // All states
  // ✅ FIX 2: Removed chatRoomId dead state
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

  // Memoized computed values
  const hasUserReview = useMemo(() => 
    Boolean(userId && reviews.some((r) => Number(r.user_id) === Number(userId))),
  [userId, reviews]
  );
  const formattedAvgRating = useMemo(() => avgRating.toFixed(1), [avgRating]);
  const recentReviews = useMemo(() => reviews.slice(0, 3), [reviews]);

  // Expert status listener
  useEffect(() => {
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

  // Profile data fetch
  useEffect(() => {
    if (expertId) {
      fetchProfile(expertId);
      fetchPrice(expertId);
    }
  }, [expertId, fetchProfile, fetchPrice]);

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
          setUserReviewText("");
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

  useEffect(() => {
    loadFollowersAndReviews();
  }, [loadFollowersAndReviews]);

  // Socket events
  useEffect(() => {
    const handleRequestPending = ({ request_id }) => {
       setRequestingChat(false);
       setChatRequestId(request_id);
      setShowWaitingPopup(true);
      setWaitingText("Waiting for expert to accept...");
    };

   const handleChatAccepted = ({ room_id }) => {
  if (!room_id) return;
setRequestingChat(false);
  setShowWaitingPopup(false);
  setChatRequestId(null);

  navigate(`/user/chat/${room_id}`, {
    replace: true,
    state: { fromRequest: true }
  });
};


    const handleChatRejected = ({ user_id, message }) => {
      if (Number(user_id) !== Number(userId)) return;
      
  setRequestingChat(false);
  setShowWaitingPopup(false);
      setChatRequestId(null);
      setChatRejectedMessage(message || "Chat request was rejected");
    };

    const handleChatCancelled = ({ user_id, message }) => {
      if (Number(user_id) !== Number(userId)) return;
      setRequestingChat(false);
      setShowWaitingPopup(false);
      setChatRequestId(null);
      setShowChatCancelled(true);
    };

    const handleChatEnded = ({ room_id, reason }) => {
      // Handle chat end notifications
    };

    socket.on("request_pending", handleRequestPending);
    socket.on("chat_accepted", handleChatAccepted);
    socket.on("chat_rejected", handleChatRejected);
    socket.on("chat_cancelled", handleChatCancelled);
    socket.on("chat_ended", handleChatEnded);

    return () => {
      socket.off("request_pending", handleRequestPending);
      socket.off("chat_accepted", handleChatAccepted);
      socket.off("chat_rejected", handleChatRejected);
      socket.off("chat_cancelled", handleChatCancelled);
      socket.off("chat_ended", handleChatEnded);
    };
  }, [navigate, userId]);

  // Callbacks
  const handleStart = useCallback((type) => {
    if (!isLoggedIn) {
      navigate("/user/auth", { state: { from: `/experts/${expertId}` } });
      return;
    }

    const perMinute = type === "chat"
      ? Number(expertPrice?.chat_per_minute || 0)
      : Number(expertPrice?.call_per_minute || 0);
    
    // ✅ FIX 4: Using constant instead of magic number
    const minRequired = perMinute * MIN_CHAT_MINUTES;
    const userBalance = Number(balance || 0);

    if (userBalance >= minRequired) {
        if (requestingChat) return;
 console.log("🔥 Start clicked", type);
  setRequestingChat(true);
      if (type === "chat" && numericExpertId) {
       socket.emit("request_chat", {
  user_id: userId,
  expert_id: numericExpertId,
  user_name: user?.name || user?.first_name || "User"
});

      } else if (type === "call" && numericExpertId) {
  // 1️⃣ Send call request to server
  socket.emit("call:start", {
    expertId: numericExpertId,
  });

  // 2️⃣ Navigate to voice call screen (connecting state)
  navigate(`/user/voice-call/${numericExpertId}`, {
    state: { fromProfile: true },
  });
}


    } else {
      setRequiredAmount(Math.max(0, minRequired - userBalance));
      setShowRecharge(true);
    }
  }, [isLoggedIn, navigate, expertId, expertPrice, balance, userId, numericExpertId]);

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
  
  // ✅ FIX 3: Fixed handleCancelRequest to be server-driven
  const handleCancelRequest = useCallback(() => {
  if (!chatRequestId) return;

  socket.emit("cancel_chat_request", {
    request_id: chatRequestId,
  });

  // ✅ LOCAL UI CLEANUP
  setShowWaitingPopup(false);
  setChatRequestId(null);
}, [chatRequestId]);


  const handleRechargeClose = useCallback(() => {
    setShowRecharge(false);
    setRequiredAmount(0);
  }, []);

  const handleUnfollowClose = useCallback(() => setShowUnfollowModal(false), []);

  const handleChatRejectedClose = useCallback(() => {
    setChatRejectedMessage("");
  }, []);

  const handleChatCancelledClose = useCallback(() => {
    setShowChatCancelled(false);
  }, []);

  // Early returns
  if (profileLoading || priceLoading) {
    return <div style={{ padding: 30, textAlign: "center" }}>Loading expert…</div>;
  }

  if (!expertData?.profile) {
    return <div style={{ padding: 30, textAlign: "center" }}>Expert not found.</div>;
  }

  const profile = expertData.profile;
  const price = expertPrice || {};

  // Spinner component
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
        <HeaderBar>
          <BackButton onClick={() => navigate(-1)}>
            <FiArrowLeft size={18} /> Back
          </BackButton>
        </HeaderBar>

        {/* Main Profile Card */}
        <ProfileCard>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ flex: '0 0 200px' }}>
              <LeftImage src={profile.profile_photo || DEFAULT_AVATAR} alt="Profile" />
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <MiniRating>
                  <FiStar color="#facc15" />
                  {formattedAvgRating} ({totalReviews})
                </MiniRating>
                <div style={{ marginTop: '8px', fontSize: '14px', color: '#64748b' }}>
                  Followers: <strong>{followersCount}</strong>
                </div>
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
                    <span>{profile.experience || "5"} Years Exp</span>
                  </StatItem>
                </QuickStats>
              </div>

              {/* Tags */}
              <TagList>
                <Tag><FiBookOpen /> Education: {profile.education || "Masters Degree"}</Tag>
                <Tag><FiTarget /> Category: {profile.category_name || "Business"}</Tag>
                <Tag><FiCheckCircle /> Status: {isExpertOnline ? "Available" : "Offline"}</Tag>
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

        {/* Expertise Section - Based on Image */}
        <Section>
          <SectionTitle>Aspects of Expertise</SectionTitle>
          <ExpertiseGrid>
            <ExpertiseCard>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '10px', 
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FiStar size={20} color="white" />
                </div>
                <h4 style={{ margin: 0, fontSize: '18px' }}>Reviewer</h4>
              </div>
              <SectionBody style={{ fontSize: '15px', color: '#4b5563' }}>
                Early UK career settings using advanced data methods provide even insights. Highly recommended.
              </SectionBody>
            </ExpertiseCard>

            <ExpertiseCard>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '10px', 
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FiThumbsUp size={20} color="white" />
                </div>
                <h4 style={{ margin: 0, fontSize: '18px' }}>Supports</h4>
              </div>
              <SectionBody style={{ fontSize: '15px', color: '#4b5563' }}>
                Very knowledgeable, provides timely check-ins and future-focused guidance based on best practices.
              </SectionBody>
            </ExpertiseCard>

            <ExpertiseCard $highlight>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '10px', 
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FiMessageSquare size={20} color="white" />
                </div>
                <h4 style={{ margin: 0, fontSize: '18px' }}>Check with Sarah Now</h4>
              </div>
              <SectionBody style={{ fontSize: '15px', color: '#4b5563' }}>
                Helpful technical details and verification of information to ensure accuracy and reliability.
              </SectionBody>
              <div style={{ marginTop: '16px' }}>
                <ActionButton 
                  onClick={() => handleStart("chat")}
                  style={{ width: '100%', background: '#8b5cf6', color: 'white' }}
                >
                  <FiMessageSquare /> Start Conversation
                </ActionButton>
              </div>
            </ExpertiseCard>
          </ExpertiseGrid>
        </Section>

        {/* About Section */}
        <Section>
          <SectionTitle>About</SectionTitle>
          <SectionBody>{profile.description || "Experienced professional with proven track record in the field. Committed to providing valuable insights and practical solutions."}</SectionBody>
        </Section>

        {/* ✅ FIX 1: SINGLE ReviewSection - NO DUPLICATES */}
        <ReviewSection>
          <ReviewHeader>
            <div>
              <SectionTitle>Rating & Reviews</SectionTitle>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <FiStar color="#facc15" />
                <strong style={{ fontSize: '24px' }}>{formattedAvgRating}</strong>
                <span style={{ color: '#64748b' }}>/5 ({totalReviews} reviews)</span>
              </div>
            </div>
          </ReviewHeader>

          {/* Add/Edit Review Form */}
          <ReviewForm>
            <ReviewFormTitle>
              <FiStar color="#f59e0b" />
              {hasUserReview ? 'Update Your Review' : 'Add Your Review'}
            </ReviewFormTitle>
            
            <form onSubmit={handleSubmitReview}>
              {/* Rating Stars */}
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
                <RatingValue>{userRating > 0 ? `${userRating}/5` : 'Select rating'}</RatingValue>
              </RatingInput>

              {/* Review Textarea */}
              <TextAreaContainer>
                <ReviewTextarea
                  placeholder="Share your experience with this expert... (Optional)"
                  value={userReviewText}
                  onChange={(e) => setUserReviewText(e.target.value)}
                  disabled={submittingReview}
                  maxLength={500}
                  rows={4}
                />
                <CharCount>
                  {userReviewText.length}/500 characters
                </CharCount>
              </TextAreaContainer>

              {/* Action Buttons */}
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

          {/* Recent Reviews List */}
          <RecentReviewsTitle>
            <FiMessageSquare />
            Recent Reviews ({recentReviews.length})
          </RecentReviewsTitle>

          <ReviewList>
            {loadingReviews ? (
              <LoadingReviews>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  border: '3px solid #e2e8f0',
                  borderTopColor: '#0ea5e9',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  margin: '0 auto'
                }} />
                <p>Loading reviews...</p>
              </LoadingReviews>
            ) : reviews.length === 0 ? (
              <NoReviews>
                <FiStar size={48} color="#d1d5db" />
                <h4>No reviews yet</h4>
                <p>Be the first to review this expert!</p>
              </NoReviews>
            ) : (
              recentReviews.map((r) => (
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

          {reviews.length > 3 && (
            <ViewAllButton onClick={() => navigate(`/experts/${expertId}/reviews`)}>
              View All Reviews ({totalReviews})
              <FiArrowLeft style={{ transform: 'rotate(180deg)' }} />
            </ViewAllButton>
          )}
        </ReviewSection>

        {/* Modals remain the same */}
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