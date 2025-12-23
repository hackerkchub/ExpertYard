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
  ActionButtons,
  ActionButton,
  PriceTag,
  ReviewBox,
  ReviewItem,
  ReviewUser,
  ReviewText,
  RatingRow,
  StarRating,
  Star,
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

// ✅ ALL HOOKS FIRST (TOP LEVEL ONLY)
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

  // Memoized values (TOP LEVEL)
  const numericExpertId = useMemo(() => expertId ? Number(expertId) : null, [expertId]);

  // All states (TOP LEVEL)
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
  const [chatRoomId, setChatRoomId] = useState(null);
  const [showWaitingPopup, setShowWaitingPopup] = useState(false);
  const [waitingText, setWaitingText] = useState("Waiting for expert to accept...");

  // Memoized computed values (TOP LEVEL, AFTER STATES)
  const hasUserReview = useMemo(() => 
    Boolean(userId && reviews.some((r) => Number(r.user_id) === Number(userId))),
  [userId, reviews]
  );
  const formattedAvgRating = useMemo(() => avgRating.toFixed(1), [avgRating]);
  const recentReviews = useMemo(() => reviews.slice(0, 5), [reviews]);
useEffect(() => {
  if (userId) {
    socket.emit("user_online", { user_id: userId });
  }
}, [userId]);

  // Effects (TOP LEVEL)
  useEffect(() => {
    if (expertId) {
      fetchProfile(expertId);
      fetchPrice(expertId);
    }
  }, [expertId, fetchProfile, fetchPrice]);

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

  // Socket effect (TOP LEVEL)
  useEffect(() => {
    const handleRequestPending = ({ request_id }) => {
      setChatRequestId(request_id);
      setShowWaitingPopup(true);
      setWaitingText("Waiting for expert to accept...");
    };

    const handleChatAccepted = ({ user_id, room_id }) => {
      if (Number(user_id) !== Number(userId)) return;
      setShowWaitingPopup(false);
      navigate(`/user/chat/${room_id}`);
    };

    const handleChatRejected = ({ user_id, message }) => {
      if (Number(user_id) !== Number(userId)) return;
      setShowWaitingPopup(false);
      alert(message || "Expert rejected your request");
    };

    socket.on("request_pending", handleRequestPending);
    socket.on("chat_accepted", handleChatAccepted);
    socket.on("chat_rejected", handleChatRejected);

    return () => {
      socket.off("request_pending", handleRequestPending);
      socket.off("chat_accepted", handleChatAccepted);
      socket.off("chat_rejected", handleChatRejected);
    };
  }, [navigate, userId]);

  // Callbacks (TOP LEVEL, AFTER ALL EFFECTS)
  const handleStart = useCallback((type) => {
    if (!isLoggedIn) {
      navigate("/user/auth", { state: { from: `/experts/${expertId}` } });
      return;
    }

    const perMinute = type === "chat"
      ? Number(expertPrice?.chat_per_minute || 0)
      : Number(expertPrice?.call_per_minute || 0);
    
    const minRequired = perMinute * 5;
    const userBalance = Number(balance || 0);

    if (userBalance >= minRequired) {
      if (type === "chat" && numericExpertId) {
        socket.emit("request_chat", { user_id: userId, expert_id: numericExpertId });
      } else {
        alert("Call feature coming soon 🚧");
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
  const handleCancelRequest = useCallback(() => {
    if (chatRequestId && userId) {
      socket.emit("cancel_chat_request", { request_id: chatRequestId, user_id: userId });
    }
    setShowWaitingPopup(false);
    setChatRequestId(null);
  }, [chatRequestId, userId]);
  const handleRechargeClose = useCallback(() => {
    setShowRecharge(false);
    setRequiredAmount(0);
  }, []);
  const handleUnfollowClose = useCallback(() => setShowUnfollowModal(false), []);

  // ✅ EARLY RETURNS (AFTER ALL HOOKS)
  if (profileLoading || priceLoading) {
    return <div style={{ padding: 30, textAlign: "center" }}>Loading expert…</div>;
  }

  if (!expertData?.profile) {
    return <div style={{ padding: 30, textAlign: "center" }}>Expert not found.</div>;
  }

  const profile = expertData.profile;
  const price = expertPrice || {};

  // Spinner component (pure component, no hooks)
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

        <TopSection>
          <LeftColumn>
            <LeftImage src={profile.profile_photo || DEFAULT_AVATAR} alt="Profile" />
            <MiniRating>
              <FiStar color="#facc15" />
              {formattedAvgRating} ({totalReviews})
            </MiniRating>
            <div style={{ marginTop: 8, fontSize: 13, color: "#64748b" }}>
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
          </LeftColumn>

          <RightInfo>
            <Name>
              {profile.name}{" "}
              <VerifiedBadge>
                <FiUserCheck size={14} /> Verified
              </VerifiedBadge>
            </Name>
            <Role>{profile.position || "Expert"}</Role>
            <Status $online>🟢 Available Now</Status>

            <ActionButtons>
              <div>
                <PriceTag>₹{price.call_per_minute || 0} / min</PriceTag>
                <ActionButton $primary onClick={() => handleStart("call")}>
                  <FiPhoneCall /> Start Call
                </ActionButton>
              </div>
              <div>
                <PriceTag>₹{price.chat_per_minute || 0} / min</PriceTag>
                <ActionButton onClick={() => handleStart("chat")}>
                  <FiMessageSquare /> Start Chat
                </ActionButton>
              </div>
            </ActionButtons>
          </RightInfo>
        </TopSection>

        <Section>
          <SectionTitle>About</SectionTitle>
          <SectionBody>{profile.description || "—"}</SectionBody>
        </Section>

        <Section>
          <SectionTitle>Education</SectionTitle>
          <ListItem>{profile.education || "—"}</ListItem>
        </Section>

        <Section>
          <SectionTitle>Expertise</SectionTitle>
          <TwoColumn>
            <div>
              <strong>Category:</strong>
              <ListItem>{profile.category_name || "—"}</ListItem>
            </div>
            <div>
              <strong>Subcategory:</strong>
              <ListItem>{profile.subcategory_name || "—"}</ListItem>
            </div>
          </TwoColumn>
        </Section>

        <Section>
          <SectionTitle>Rating & Reviews</SectionTitle>
          <RatingRow>
            <FiStar color="#facc15" />
            <strong>{formattedAvgRating}</strong> / 5 ({totalReviews})
          </RatingRow>

          <form onSubmit={handleSubmitReview} style={{ marginTop: 12 }}>
            <div style={{ marginBottom: 12, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <span style={{ fontSize: 13, color: "#64748b", whiteSpace: "nowrap" }}>Your rating:</span>
              <StarRating>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    $filled={star <= userRating}
                    onClick={() => handleStarClick(star)}
                    type="button"
                    disabled={submittingReview}
                  >
                    <FiStar />
                  </Star>
                ))}
              </StarRating>
              <span style={{ fontSize: 13, color: "#64748b" }}>{userRating}/5</span>
            </div>

            <textarea
              placeholder="Share your experience (optional)…"
              value={userReviewText}
              onChange={(e) => setUserReviewText(e.target.value)}
              disabled={submittingReview}
              maxLength={500}
              style={{
                width: "100%",
                minHeight: 70,
                padding: 12,
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                fontSize: 14,
                resize: "vertical",
                fontFamily: "inherit",
                background: submittingReview ? "#f8fafc" : "white",
              }}
            />

            <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                type="submit"
                disabled={!userRating || submittingReview || !isLoggedIn}
                style={{
                  padding: "8px 16px",
                  borderRadius: 999,
                  border: "none",
                  background: userRating && !submittingReview && isLoggedIn ? "#10b981" : "#cbd5e1",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: userRating && !submittingReview && isLoggedIn ? "pointer" : "not-allowed",
                }}
              >
                {submittingReview ? "Adding..." : "Add Review"}
              </button>
              {hasUserReview && (
                <button
                  type="button"
                  onClick={handleDeleteReview}
                  disabled={submittingReview}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 999,
                    border: "1px solid #e2e8f0",
                    background: "#f8fafc",
                    color: "#475569",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: submittingReview ? "not-allowed" : "pointer",
                  }}
                >
                  Delete My Review
                </button>
              )}
            </div>
          </form>

          <ReviewBox style={{ marginTop: 20 }}>
            {loadingReviews ? (
              <div style={{ padding: 20, textAlign: "center", color: "#64748b" }}>
                Loading reviews…
              </div>
            ) : reviews.length === 0 ? (
              <div style={{ padding: 20, textAlign: "center", fontSize: 14, color: "#64748b" }}>
                No reviews yet. Be the first!
              </div>
            ) : (
              recentReviews.map((r) => (
                <ReviewItem key={r.id}>
                  <ReviewUser>
                    {`${r.first_name || ""} ${r.last_name || ""}`.trim() || "User"}{" "}
                    • ⭐ {r.rating_number}
                  </ReviewUser>
                  <ReviewText>{r.review_text}</ReviewText>
                </ReviewItem>
              ))
            )}
          </ReviewBox>
        </Section>

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
      </PageWrap>
    </>
  );
};

export default ExpertProfilePage;
