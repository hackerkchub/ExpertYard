// src/apps/user/pages/MyOffer.jsx - Complete updated with comments + ratings logic
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiHeart,
  FiMessageCircle,
  FiStar,
  FiSend
} from "react-icons/fi";

import {
  PageWrap,
  Container,
  Section,
  Title,
  SubTitle,
  FollowingRow,
  FollowAvatar,
  Grid,
  Card,
  CardHeader,
  Avatar,
  NameWrap,
  Name,
  Role,
  Time,
  CardBody,
  PostTitle,
  PostDesc,
  Thumb,
  CardFooter,
  Actions,
  ActionBtn,
  InlineBox,
  InlineInput,
  InlineComment,
  StarsRow,
  StarBtn,
  SendBtn
} from "./MyOffer.styles";

/* ================== APIs ================== */
import {
  getFollowingFeedApi,
  likePostApi,
  unlikePostApi,
  getCommentsApi,
  addCommentApi
} from "../../../../shared/api/expertapi/post.api";

import {
  getFollowingExpertsApi
} from "../../../../shared/api/expertapi/follower.api";

import {
  getReviewsByExpertApi,
  addOrUpdateReviewApi
} from "../../../../shared/api/expertapi/reviews.api";

/* ================== AUTH ================== */
import { useAuth } from "../../../../shared/context/UserAuthContext";

/* ================== HELPERS ================== */
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

const formatDateTime = (date) =>
  new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });

export default function MyOffer() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id;

  /* ================== STATE ================== */
  const [followingExperts, setFollowingExperts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [liked, setLiked] = useState({});
  const [activeSection, setActiveSection] = useState(null);
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [userRating, setUserRating] = useState({});
  const [reviewText, setReviewText] = useState({});
  const [expertReviewStats, setExpertReviewStats] = useState({});
  const [userReview, setUserReview] = useState({}); // ✅ User's own review per expert
  const [loading, setLoading] = useState(true);

  /* ================== FETCH DATA ================== */
  useEffect(() => {
    if (!userId) return;

    const loadData = async () => {
      try {
        setLoading(true);

        // 1️⃣ Following experts (avatars)
        const followingRes = await getFollowingExpertsApi(userId);
        const experts = followingRes.data.experts || [];
        setFollowingExperts(experts);

        // 2️⃣ Following feed (posts)
        const feedRes = await getFollowingFeedApi(userId);
        const feedPosts = feedRes.data.data || [];
        setPosts(feedPosts);

        // 3️⃣ Preload likes, ratings, user's review
        const likedMap = {};
        const reviewStats = {};
        const userReviews = {};

        for (const p of feedPosts) {
          likedMap[p.post_id] = !!p.is_liked;

          const expertId = p.expert?.expert_id;
          if (expertId) {
            try {
              // Get all reviews for this expert
              const r = await getReviewsByExpertApi(expertId);
              const data = r.data.data || {};
              
              reviewStats[expertId] = {
                avg: Number(data.avg_rating || 0),
                total: data.total_reviews || (data.reviews || []).length || 0
              };

              // ✅ Find user's own review
              const userReviewData = data.reviews?.find(rev => 
                rev.user_id === userId
              );
              if (userReviewData) {
                userReviews[expertId] = {
                  rating: userReviewData.rating_number,
                  text: userReviewData.review_text
                };
              }
            } catch {
              reviewStats[expertId] = { avg: 0, total: 0 };
            }
          }
        }

        setLiked(likedMap);
        setExpertReviewStats(reviewStats);
        setUserReview(userReviews);
      } catch (err) {
        console.error("MyOffer load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  /* ================== HANDLERS ================== */
  const handleExpertClick = (expertId) => {
    navigate(`/user/experts/${expertId}`);
  };

  const toggleSection = async (section, postId, expertId) => {
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

  /* ---------- LIKE ---------- */
  const toggleLike = async (post) => {
    const isLiked = liked[post.post_id];
    setLiked((p) => ({ ...p, [post.post_id]: !isLiked }));

    try {
      if (isLiked) {
        await unlikePostApi({
          post_id: post.post_id,
          user_id: userId
        });
      } else {
        await likePostApi({
          post_id: post.post_id,
          user_id: userId
        });
      }
    } catch (err) {
      console.error("Like toggle error:", err);
      setLiked((p) => ({ ...p, [post.post_id]: isLiked }));
    }
  };

  /* ---------- COMMENT (Multiple allowed) ---------- */
  const submitComment = async (post) => {
    const text = commentText[post.post_id]?.trim();
    if (!text) return;

    try {
      const res = await addCommentApi({
        post_id: post.post_id,
        expert_id: post.expert.expert_id,
        comment: text
      });

      // ✅ Add user's comment to top (including own comment)
     setPosts(prev =>
  prev.map(p =>
    p.post_id === post.post_id
      ? { ...p, comments_count: p.comments_count + 1 }
      : p
  )
);
      setComments((p) => ({
        ...p,
        [post.post_id]: [...(p[post.post_id] || []), res.data.data]
      }));
      setCommentText((p) => ({ ...p, [post.post_id]: "" }));
    } catch (err) {
      console.error("Add comment error:", err);
    }
  };

  /* ---------- RATING + REVIEW (Single per user) ---------- */
  const submitRatingAndReview = async (post) => {
    const rating = userRating[post.post_id];
    const text = reviewText[post.post_id]?.trim() || "";

    if (!rating) return;

    try {
      await addOrUpdateReviewApi({
        user_id: userId,
        expert_id: post.expert.expert_id,
        rating_number: rating,
        review_text: text
      });

      // Refresh stats + user's review
      const r = await getReviewsByExpertApi(post.expert.expert_id);
      const data = r.data.data || {};
      
      const expertId = post.expert.expert_id;
      setExpertReviewStats((prev) => ({
        ...prev,
        [expertId]: {
          avg: Number(data.avg_rating || 0),
          total: data.total_reviews || (data.reviews || []).length || 0
        }
      }));

      // ✅ Update user's own review
      const userReviewData = data.reviews?.find(rev => rev.user_id === userId);
      if (userReviewData) {
        setUserReview((prev) => ({
          ...prev,
          [expertId]: {
            rating: userReviewData.rating_number,
            text: userReviewData.review_text
          }
        }));
      }

      // Clear form
      setReviewText((prev) => ({ ...prev, [post.post_id]: "" }));
      setUserRating((prev) => ({ ...prev, [post.post_id]: undefined }));
    } catch (err) {
      console.error("Submit rating/review error:", err);
    }
  };

  /* ================== UI ================== */
  if (loading) {
    return (
      <PageWrap>
        <Container>Loading offers...</Container>
      </PageWrap>
    );
  }

  return (
    <PageWrap>
      <Container>
        {/* FOLLOWING AVATARS */}
        <Section>
          <Title>Following Feed</Title>
          <SubTitle>Latest updates from your experts</SubTitle>

          <FollowingRow>
            {followingExperts.map((e) => (
              <FollowAvatar
                key={e.expert_id}
                onClick={() => handleExpertClick(e.expert_id)}
                style={{ cursor: "pointer" }}
              >
                <img src={e.profile_photo} alt={e.expert_name} />
                <span>{e.expert_name}</span>
              </FollowAvatar>
            ))}
          </FollowingRow>
        </Section>

        {/* POSTS */}
        <Section>
          <Grid>
            {posts.map((post) => {
              const expertId = post.expert?.expert_id;
              const stats = expertReviewStats[expertId] || { avg: 0, total: 0 };
              const userOwnReview = userReview[expertId];
              const isLiked = liked[post.post_id];

              return (
                <Card key={post.post_id}>
                  <CardHeader>
                    <div
                      style={{
                        display: "flex",
                        gap: "14px",
                        cursor: "pointer"
                      }}
                      onClick={() => handleExpertClick(expertId)}
                    >
                      <Avatar src={post.expert.profile_photo} />
                      <NameWrap>
                        <Name>{post.expert.name}</Name>
                        <Role>{post.expert.position}</Role>
                      </NameWrap>
                    </div>
                    <Time>{formatRelativeTime(post.created_at)}</Time>
                  </CardHeader>

                  <CardBody>
                    <PostTitle>{post.title}</PostTitle>
                    <PostDesc>{post.description}</PostDesc>
                    <Thumb src={post.image_url} />
                  </CardBody>

                
<CardFooter>
  <Actions>
    {/* ✅ PERFECT LIKE BUTTON */}
    <ActionBtn 
      $liked={!!liked[post.post_id]}
      onClick={() => toggleLike(post)}
    >
      <FiHeart
        fill={liked[post.post_id] ? "#ef4444" : "none"}
        stroke={liked[post.post_id] ? "#ef4444" : "#374151"}
        style={{ 
          strokeWidth: liked[post.post_id] ? 0 : 2,
          transition: 'all 0.2s ease'
        }}
      />
      {post.likes + (liked[post.post_id] ? 1 : 0)}
    </ActionBtn>

    {/* Comments */}
    <ActionBtn onClick={() => toggleSection("comments", post.post_id, expertId)}>
      <FiMessageCircle />
      {post.comments_count}
    </ActionBtn>

    {/* Rating */}
    <ActionBtn onClick={() => toggleSection("rating", post.post_id, expertId)}>
      <FiStar />
      {stats.avg ? stats.avg.toFixed(1) : "0.0"} ({stats.total})
    </ActionBtn>
  </Actions>

  <Time style={{ fontSize: "11px" }}>
    Posted on {formatDateTime(post.created_at)}
  </Time>
</CardFooter>


                  {/* COMMENTS - Multiple allowed ✅ */}
                  {activeSection === `comments-${post.post_id}` && (
                    <InlineBox>
                     {(comments[post.post_id] || [])
  .filter(c => c && typeof c.comment === "string")
  .map((c) => (
    <InlineComment key={c.id}>
      {c.comment}
      {c.user_id === userId && (
        <span
          style={{
            color: "#9ca3af",
            fontSize: 11,
            marginLeft: 8
          }}
        >
          You
        </span>
      )}
    </InlineComment>
))}

                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          alignItems: "flex-end"
                        }}
                      >
                        <InlineInput
                          placeholder="Write a comment…"
                          value={commentText[post.post_id] || ""}
                          onChange={(e) =>
                            setCommentText((p) => ({
                              ...p,
                              [post.post_id]: e.target.value
                            }))
                          }
                          onKeyDown={(e) => e.key === "Enter" && submitComment(post)}
                        />
                        <SendBtn onClick={() => submitComment(post)}>
                          <FiSend />
                        </SendBtn>
                      </div>
                    </InlineBox>
                  )}

                  {/* RATING + REVIEW - Single per user ✅ */}
                  {activeSection === `rating-${post.post_id}` && (
                    <InlineBox>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 8,
                          fontSize: 13,
                          color: "#4b5563"
                        }}
                      >
                        <span>
                          Average: {stats.avg ? stats.avg.toFixed(1) : "0.0"} / 5
                        </span>
                        <span>Total reviews: {stats.total}</span>
                      </div>

                      {/* ✅ Show user's existing review if any */}
                      {userOwnReview && (
                        <div
                          style={{
                            padding: "8px 12px",
                            background: "#e0f2fe",
                            borderRadius: 8,
                            marginBottom: 12,
                            fontSize: 12
                          }}
                        >
                          <div style={{ fontWeight: 500, marginBottom: 4 }}>
                            Your review: {userOwnReview.rating}/5
                          </div>
                          {userOwnReview.text && (
                            <div style={{ color: "#1e40af" }}>
                              "{userOwnReview.text}"
                            </div>
                          )}
                        </div>
                      )}

                      <StarsRow>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <StarBtn
                            key={s}
                            active={userRating[post.post_id] >= s || 
                                   (userOwnReview?.rating >= s)}
                            onClick={() =>
                              setUserRating((p) => ({
                                ...p,
                                [post.post_id]: s
                              }))
                            }
                          >
                            <FiStar />
                          </StarBtn>
                        ))}
                      </StarsRow>

                      <InlineInput
                        placeholder="Write a review…"
                        value={reviewText[post.post_id] || ""}
                        onChange={(e) =>
                          setReviewText((p) => ({
                            ...p,
                            [post.post_id]: e.target.value
                          }))
                        }
                      />

                      <SendBtn
                        style={{ marginTop: 8, width: "100%" }}
                        disabled={!userRating[post.post_id]}
                        onClick={() => submitRatingAndReview(post)}
                      >
                        {userOwnReview ? "Update Review" : "Submit Review"}
                      </SendBtn>
                    </InlineBox>
                  )}
                </Card>
              );
            })}
          </Grid>
        </Section>
      </Container>
    </PageWrap>
  );
}
