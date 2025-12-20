import React, { useEffect, useState, useCallback } from "react";
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

const DEFAULT_AVATAR = "https://i.pravatar.cc/300?img=12";

const ExpertProfilePage = () => {
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

  // Load expert profile + price
  useEffect(() => {
    if (expertId) {
      fetchProfile(expertId);
      fetchPrice(expertId);
    }
  }, [expertId, fetchProfile, fetchPrice]);

  // Load followers + reviews from server (new reviews API shape)
  const loadFollowersAndReviews = useCallback(() => {
    if (!expertId) return;

    // Followers
    getExpertFollowersApi(expertId)
      .then((res) => {
        const followers = res.data.followers || [];
        setFollowersCount(res.data.total_followers || followers.length);

        const isFollowing = followers.some(
          (f) => Number(f.id) === Number(userId)
        );
        setFollowing(isFollowing);
      })
      .catch((err) => {
        console.error("Followers fetch failed", err);
      });

    // Reviews (new shape)
    setLoadingReviews(true);
    getReviewsByExpertApi(expertId)
      .then((res) => {
        // { success, data: { reviews: [...], total_reviews, avg_rating } }
        const data = res.data.data || {};
        const list = data.reviews || [];

        setReviews(list);
        setTotalReviews(data.total_reviews || list.length || 0);
        setAvgRating(Number(data.avg_rating || 0));

        // User ka existing review detect karna sirf stars set karne ke liye (text box empty rakhenge)
        if (userId) {
          const mine = list.find((r) => r.user_id == userId);
          if (mine) {
            setUserRating(mine.rating_number || 0);
            // userReviewText intentionally clear so that box blank रहे
            setUserReviewText("");
          } else {
            setUserRating(0);
            setUserReviewText("");
          }
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

  if (profileLoading || priceLoading) {
    return <div style={{ padding: 30, textAlign: "center" }}>Loading expert…</div>;
  }

  if (!expertData?.profile) {
    return <div style={{ padding: 30, textAlign: "center" }}>Expert not found.</div>;
  }

  const profile = expertData.profile;
  const price = expertPrice || {};

  const handleStart = (type) => {
    if (!isLoggedIn) {
      navigate("/user/auth", { state: { from: `/experts/${expertId}` } });
      return;
    }

    const perMinute =
      type === "chat"
        ? Number(price.chat_per_minute || 0)
        : Number(price.call_per_minute || 0);
    const minRequired = perMinute * 5;
    const userBalance = Number(balance || 0);

    if (userBalance >= minRequired) {
      if (type === "chat") navigate("/user/chat");
      else alert("Call feature coming soon 🚧");
    } else {
      setRequiredAmount(minRequired - userBalance);
      setShowRecharge(true);
    }
  };

  // FOLLOW ACTION
  const handleFollowAction = async () => {
    if (!isLoggedIn || !userId || !expertId) {
      navigate("/user/auth", { state: { from: `/experts/${expertId}` } });
      return;
    }

    try {
      if (!following) {
        const payload = { user_id: userId, expert_id: expertId };
        await followExpertApi(payload);
        setFollowing(true);
        setFollowersCount((c) => c + 1);
      } else {
        setShowUnfollowModal(true);
      }
    } catch (err) {
      console.error("❌ Follow error:", err.response?.data);
    }
  };

  // UNFOLLOW ACTION
  const handleUnfollowConfirm = async () => {
    try {
      const payload = { user_id: userId, expert_id: expertId };
      await unfollowExpertApi(payload);
      setFollowing(false);
      setFollowersCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error("❌ Unfollow error:", err.response?.data);
    } finally {
      setShowUnfollowModal(false);
    }
  };

  // REVIEW ACTION
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isLoggedIn || !userId || !userRating) {
      alert("Please login and select rating");
      return;
    }

    setSubmittingReview(true);
    try {
      const payload = {
        user_id: userId,
        expert_id: expertId,
        rating_number: userRating,
        review_text: userReviewText.trim(),
      };

      await addOrUpdateReviewApi(payload);
      // Reload list from server (and clear text)
      await loadFollowersAndReviews();
      setUserReviewText("");
    } catch (err) {
      console.error("❌ Review error:", err.response?.data);
      alert("Review failed");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!window.confirm("Delete your review?")) return;
    try {
      await deleteReviewApi(expertId);
      setUserRating(0);
      setUserReviewText("");
      await loadFollowersAndReviews();
    } catch (err) {
      console.error("❌ Delete failed:", err);
    }
  };

  const handleStarClick = (rating) => setUserRating(rating);

  return (
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
            {avgRating.toFixed(1)} ({totalReviews})
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
          <strong>{avgRating.toFixed(1)}</strong> / 5 ({totalReviews})
        </RatingRow>

        <form onSubmit={handleSubmitReview} style={{ marginTop: 12 }}>
          <div
            style={{
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <span
              style={{
                fontSize: 13,
                color: "#64748b",
                whiteSpace: "nowrap",
              }}
            >
              Your rating:
            </span>
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
            <span style={{ fontSize: 13, color: "#64748b" }}>
              {userRating || 0}/5
            </span>
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

          <div
            style={{
              marginTop: 12,
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <button
              type="submit"
              disabled={!userRating || submittingReview || !isLoggedIn}
              style={{
                padding: "8px 16px",
                borderRadius: 999,
                border: "none",
                background:
                  userRating && !submittingReview && isLoggedIn
                    ? "#10b981"
                    : "#cbd5e1",
                color: "#fff",
                fontSize: 13,
                fontWeight: 500,
                cursor:
                  userRating && !submittingReview && isLoggedIn
                    ? "pointer"
                    : "not-allowed",
              }}
            >
              {submittingReview ? "Adding..." : "Add Review"}
            </button>

            {userId && reviews.some((r) => r.user_id == userId) && (
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
            <div
              style={{
                padding: 20,
                textAlign: "center",
                color: "#64748b",
              }}
            >
              Loading reviews…
            </div>
          ) : reviews.length === 0 ? (
            <div
              style={{
                padding: 20,
                textAlign: "center",
                fontSize: 14,
                color: "#64748b",
              }}
            >
              No reviews yet. Be the first!
            </div>
          ) : (
            reviews.slice(0, 5).map((r) => (
              <ReviewItem key={r.id}>
                <ReviewUser>
                  {`${r.first_name || ""} ${r.last_name || ""}`.trim() ||
                    "User"}{" "}
                  • ⭐ {r.rating_number}
                </ReviewUser>
                <ReviewText>{r.review_text}</ReviewText>
              </ReviewItem>
            ))
          )}
        </ReviewBox>
      </Section>

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
              padding: 28,
              borderRadius: 16,
              width: "min(90vw, 380px)",
              textAlign: "center",
              boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            }}
          >
            <h3
              style={{
                margin: 0,
                marginBottom: 12,
                color: "#0f172a",
              }}
            >
              Low Balance
            </h3>
            <p
              style={{
                margin: 0,
                marginBottom: 20,
                color: "#475569",
              }}
            >
              Need <strong>₹{requiredAmount.toFixed(2)}</strong> more.
            </p>
            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "center",
              }}
            >
              <ActionButton
                $primary
                onClick={() => navigate("/user/wallet")}
              >
                Recharge Now
              </ActionButton>
              <ActionButton onClick={() => setShowRecharge(false)}>
                Cancel
              </ActionButton>
            </div>
          </div>
        </div>
      )}

      {showUnfollowModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 16,
              width: "min(90vw, 420px)",
              boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: 16,
              }}
            >
              <FiX
                size={20}
                style={{ cursor: "pointer" }}
                onClick={() => setShowUnfollowModal(false)}
              />
            </div>
            <h3
              style={{
                margin: 0,
                marginBottom: 12,
                color: "#0f172a",
              }}
            >
              Unfollow {profile.name}?
            </h3>
            <p
              style={{
                margin: 0,
                marginBottom: 24,
                color: "#475569",
              }}
            >
              You won't get their updates anymore.
            </p>
            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowUnfollowModal(false)}
                style={{
                  padding: "10px 20px",
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  color: "#475569",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUnfollowConfirm}
                style={{
                  padding: "10px 20px",
                  borderRadius: 8,
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Unfollow
              </button>
            </div>
          </div>
        </div>
      )}
    </PageWrap>
  );
};

export default ExpertProfilePage;
