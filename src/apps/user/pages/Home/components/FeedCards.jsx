import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  BadgeCheck,
  Bookmark,
  Heart,
  MessageCircle,
  PhoneCall,
  Send,
  Star,
  Share2,
} from "lucide-react";
import { useAuth } from "../../../../../shared/context/UserAuthContext";
import { 
  likePostApi, 
  unlikePostApi,
  getCommentsApi,
  addCommentApi 
} from "../../../../../shared/api/expertapi/post.api";
import { hotToast } from "../../../../../shared/utils/lazyNotifications";
import {
  CommentsBox,
  CommentsList,
  CommentItem,
  CommentText,
  CommentMeta,
  InlineInput,
  SendBtn,
} from "../../ExpertProfile/ExpertProfile.styles";
import { normalizeVideoCallPrice } from "../../../../../shared/utils/normalizeExpertPrice";

const money = (value) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? `Rs ${Math.round(numeric)}` : "View price";
};

const expertPath = (data) => `/user/experts/${data.expert_slug || data.slug || data.expert_id || data.id}`;
const servicePath = (data) => `/user/service-details/${data.slug || data.service_id || data.id}`;
const chatPath = (data) => `/user/call-chat?page=1&mode=chat&expert_id=${data.expert_id || data.id}`;
const callPath = (data) => `/user/call-chat?page=1&mode=call&expert_id=${data.expert_id || data.id}`;

function Avatar({ src, name }) {
  if (src) {
    return <img src={src} alt={name} loading="lazy" decoding="async" />;
  }

  return <span>{String(name || "GE").slice(0, 2).toUpperCase()}</span>;
}

function FeedHeader({ data, eyebrow }) {
  const name = data.expert_name || data.name || "G9Expert Expert";

  const handleShare = async () => {
    const title = data.title || data.name || data.expert_name || "G9Expert";
    const text = data.description || `Check out G9Expert!`;
    
    let path = "";
    if (data.service_id) {
      path = servicePath(data);
    } else if (data.price && !data.minutes_limit) {
      path = servicePath(data);
    } else {
      path = expertPath(data);
    }
    
    const url = `${window.location.origin}${path}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        hotToast("success", "Link copied to clipboard!");
      } catch (err) {
        console.error("Clipboard copy failed:", err);
        hotToast("error", "Failed to copy link");
      }
    }
  };

  return (
    <div className="feed-card-head">
      <Link className="feed-avatar" to={expertPath(data)}>
        <Avatar src={data.profile_photo} name={name} />
      </Link>
      <div className="feed-author">
        <Link to={expertPath(data)}>
          {name}
          <BadgeCheck size={16} />
        </Link>
        <span>{eyebrow || data.position || data.category_name || "Verified Expert"}</span>
      </div>
      <button type="button" className="feed-save" aria-label="Share" onClick={handleShare}>
        <Share2 size={19} />
      </button>
    </div>
  );
}

function RatingLine({ data }) {
  return (
    <div className="feed-rating">
      <Star size={15} fill="currentColor" />
      <strong>{Number(data.avg_rating || 0).toFixed(1)}</strong>
      <span>{Number(data.total_reviews || 0)} reviews</span>
      {data.city ? <span>{data.city}</span> : null}
    </div>
  );
}

function FeedCtas({ data }) {
  const chatPrice = data.chat_per_minute || data.chatPricePerMinute || data.chat_price || data.chat_rate || 0;
  const callPrice = data.call_per_minute || data.callPricePerMinute || data.call_price || data.call_rate || 0;

  return (
    <div className="feed-ctas">
      <Link to={chatPath(data)} aria-label="Start chat consultation" title="Start chat consultation">
        <MessageCircle size={18} />
        {chatPrice > 0 ? `\u20B9${chatPrice}/min` : "--"}
      </Link>
      <Link to={callPath(data)} aria-label="Start voice call" title="Start voice call">
        <PhoneCall size={18} />
        {callPrice > 0 ? `\u20B9${callPrice}/min` : "--"}
      </Link>
    </div>
  );
}

export const ExpertProfileFeedCard = React.memo(function ExpertProfileFeedCard({ item }) {
  const data = item.data || {};
  const promoted = item.type === "promoted_expert";
  const videoCallPrice = normalizeVideoCallPrice(data);

  if (promoted) {
    return (
      <article className="feed-card profile-detail-card" style={{ borderLeft: "4px solid #f59e0b", overflow: "hidden", background: "#fcfcff" }}>
        <div style={{
          background: "#fef3c7",
          color: "#92400e",
          fontSize: "10px",
          fontWeight: 900,
          textTransform: "uppercase",
          padding: "4px 16px",
          letterSpacing: "0.8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <span>Profile Detail</span>
          {data.category_name && <span style={{ opacity: 0.8, fontSize: "9px" }}>{data.category_name}</span>}
        </div>
        <FeedHeader data={data} eyebrow="Featured Consultant" />
        <Link className="expert-card-body" to={expertPath(data)} style={{ display: "block", textDecoration: "none", color: "inherit" }}>
          <div>
            <h3 style={{ color: "#000080", fontSize: "19px" }}>{data.name || data.expert_name}</h3>
            
            <div style={{ margin: "10px 0", background: "#f1f5f9", padding: "10px 12px", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
              <span style={{ fontSize: "11px", fontWeight: 800, color: "#475569", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                Expert Profile Summary
              </span>
              <p style={{ margin: 0, fontSize: "13px", color: "#334155", lineHeight: "1.45" }}>
                {data.description || "Top rated consultant specializing in career guidance, mentorship and professional solutions on G9Expert."}
              </p>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "8px 0" }}>
              {data.position && (
                <span style={{ fontSize: "10px", background: "#e0f2fe", color: "#0369a1", padding: "2px 8px", borderRadius: "999px", fontWeight: 800 }}>
                  {data.position}
                </span>
              )}
              {data.city && (
                <span style={{ fontSize: "10px", background: "#f1f5f9", color: "#475569", padding: "2px 8px", borderRadius: "999px", fontWeight: 800 }}>
                  📍 {data.city}
                </span>
              )}
            </div>
            <RatingLine data={data} />
          </div>
          <div className="expert-price-grid" style={{ marginTop: "12px" }}>
            <span><small>Chat</small>{money(data.chat_per_minute)}/min</span>
            <span><small>Call</small>{money(data.call_per_minute)}/min</span>
            {videoCallPrice > 0 && <span><small>Video</small>{money(videoCallPrice)}/min</span>}
          </div>
        </Link>
        <FeedCtas data={data} />
      </article>
    );
  }

  return (
    <article className="feed-card expert-profile-card" style={{ borderLeft: "4px solid #3b82f6", overflow: "hidden" }}>
      <div style={{
        background: "#dbeafe",
        color: "#1e40af",
        fontSize: "10px",
        fontWeight: 900,
        textTransform: "uppercase",
        padding: "4px 16px",
        letterSpacing: "0.8px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <span>Expert Profile</span>
        {data.category_name && <span style={{ opacity: 0.8, fontSize: "9px" }}>{data.category_name}</span>}
      </div>
      <FeedHeader data={data} eyebrow={data.category_name || "Expert Profile"} />
      <Link className="expert-card-body" to={expertPath(data)}>
        <div>
          <h3>{data.name || data.expert_name}</h3>
          <p>{data.position || "Available for instant chat/call consultation."}</p>
          <RatingLine data={data} />
        </div>
        <div className="expert-price-grid">
          <span><small>Chat</small>{money(data.chat_per_minute)}/min</span>
          <span><small>Call</small>{money(data.call_per_minute)}/min</span>
          {videoCallPrice > 0 && <span><small>Video</small>{money(videoCallPrice)}/min</span>}
        </div>
      </Link>
      <FeedCtas data={data} />
    </article>
  );
});

export const ServicePostFeedCard = React.memo(function ServicePostFeedCard({ item }) {
  const data = item.data || {};

  return (
    <article className="feed-card service-feed-card" style={{ borderLeft: "4px solid #22c55e", overflow: "hidden" }}>
      <div style={{
        background: "#dcfce7",
        color: "#166534",
        fontSize: "10px",
        fontWeight: 900,
        textTransform: "uppercase",
        padding: "4px 16px",
        letterSpacing: "0.8px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <span>Service</span>
        {data.category_name && <span style={{ opacity: 0.8, fontSize: "9px" }}>{data.category_name}</span>}
      </div>
      <FeedHeader data={data} eyebrow={data.category_name || "Service"} />
      <Link to={servicePath(data)} className="feed-title-link">
        <h3 style={{ fontSize: "18px", color: "#166534", margin: "4px 0" }}>{data.title}</h3>
        <p style={{ fontSize: "13.5px", color: "#475569", marginTop: "6px" }}>{data.description}</p>
      </Link>
      {data.image ? (
        <Link to={servicePath(data)} className="feed-media">
          <img src={data.image} alt={data.title} loading="lazy" decoding="async" />
        </Link>
      ) : null}
      <div className="service-meta-row" style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
        <strong>{money(data.price)}</strong>
        <Link to={servicePath(data)} style={{
          background: "#166534",
          color: "#ffffff",
          padding: "6px 14px",
          borderRadius: "8px",
          fontSize: "13px",
          fontWeight: 700,
          textDecoration: "none"
        }}>
          Book service
        </Link>
      </div>
      <FeedCtas data={data} />
    </article>
  );
});

export const ExpertOfferFeedCard = React.memo(function ExpertOfferFeedCard({ item }) {
  const data = item.data || {};

  return (
    <article className="feed-card offer-feed-card" style={{ borderLeft: "4px solid #22c55e", overflow: "hidden" }}>
      <div style={{
        background: "#dcfce7",
        color: "#166534",
        fontSize: "10px",
        fontWeight: 900,
        textTransform: "uppercase",
        padding: "4px 16px",
        letterSpacing: "0.8px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <span>Service Offer</span>
        {data.category_name && <span style={{ opacity: 0.8, fontSize: "9px" }}>{data.category_name}</span>}
      </div>
      <FeedHeader data={data} eyebrow="Expert offer" />
      <div className="offer-panel" style={{ margin: "12px 16px 16px", borderRadius: "14px" }}>
        <span style={{ fontSize: "11px", fontWeight: 800 }}>Subscription offer</span>
        <h3 style={{ fontSize: "18px", margin: "6px 0" }}>{data.name || "Expert consultation plan"}</h3>
        <p>
          {data.minutes_limit ? `${data.minutes_limit} minutes` : "Flexible expert access"}
          {data.calls_limit ? ` • ${data.calls_limit} calls` : ""}
        </p>
        <strong>{money(data.price)}</strong>
      </div>
      <FeedCtas data={data} />
    </article>
  );
});

export const ExpertTipFeedCard = React.memo(function ExpertTipFeedCard({ item }) {
  const data = item.data || {};
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [liked, setLiked] = React.useState(!!data.is_liked);
  const [likesCount, setLikesCount] = React.useState(Number(data.likes_count || data.likes || 0));
  const [showComments, setShowComments] = React.useState(false);
  const [commentsList, setCommentsList] = React.useState([]);
  const [loadingComments, setLoadingComments] = React.useState(false);
  const [commentInput, setCommentInput] = React.useState("");
  const [commentsCount, setCommentsCount] = React.useState(Number(data.comments_count || 0));
  const [likeLock, setLikeLock] = React.useState(false);

  const handleLike = async () => {
    if (!isLoggedIn) {
      navigate("/user/auth", { state: { from: location.pathname } });
      return;
    }
    if (likeLock) return;
    setLikeLock(true);

    const isLikedNow = liked;
    setLiked(!isLikedNow);
    setLikesCount(prev => prev + (isLikedNow ? -1 : 1));

    try {
      if (isLikedNow) {
        await unlikePostApi({ post_id: data.post_id || data.id, user_id: user.id });
      } else {
        await likePostApi({ post_id: data.post_id || data.id, user_id: user.id });
      }
    } catch (err) {
      console.error("Like toggle failed", err);
      setLiked(isLikedNow);
      setLikesCount(prev => prev + (isLikedNow ? 1 : -1));
    } finally {
      setLikeLock(false);
    }
  };

  const toggleComments = async () => {
    const nextShow = !showComments;
    setShowComments(nextShow);
    if (nextShow && commentsList.length === 0) {
      setLoadingComments(true);
      try {
        const res = await getCommentsApi(data.post_id || data.id);
        setCommentsList(res.data?.data || res.data || []);
      } catch (err) {
        console.error("Fetch comments failed", err);
      } finally {
        setLoadingComments(false);
      }
    }
  };

  const handleAddComment = async (e) => {
    if (e && e.key && e.key !== "Enter") return;
    if (!isLoggedIn) {
      navigate("/user/auth", { state: { from: location.pathname } });
      return;
    }
    const commentText = commentInput.trim();
    if (!commentText) return;

    try {
      const res = await addCommentApi({
        post_id: data.post_id || data.id,
        expert_id: data.expert_id,
        comment: commentText,
      });

      const newComment = {
        id: res.data?.data?.id || Date.now(),
        comment: commentText,
        user_id: user.id,
        first_name: user.first_name || "You",
        last_name: user.last_name || "",
        created_at: new Date().toISOString(),
      };

      setCommentsList(prev => [...prev, newComment]);
      setCommentsCount(prev => prev + 1);
      setCommentInput("");
    } catch (err) {
      console.error("Add comment failed", err);
    }
  };

  const handleShare = async () => {
    const title = data.title || "G9Expert Post";
    const text = data.description || "Check out this expert tip on G9Expert!";
    const path = expertPath(data);
    const url = `${window.location.origin}${path}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        hotToast("success", "Link copied to clipboard!");
      } catch (err) {
        console.error("Clipboard copy failed:", err);
        hotToast("error", "Failed to copy link");
      }
    }
  };

  return (
    <article className="feed-card tip-feed-card" style={{ borderLeft: "4px solid #8b5cf6", overflow: "hidden" }}>
      <div style={{
        background: "#f3e8ff",
        color: "#6b21a8",
        fontSize: "10px",
        fontWeight: 900,
        textTransform: "uppercase",
        padding: "4px 16px",
        letterSpacing: "0.8px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <span>Post</span>
        {data.category_name && <span style={{ opacity: 0.8, fontSize: "9px" }}>{data.category_name}</span>}
      </div>
      <FeedHeader data={data} eyebrow={data.category_name || "Expert tip"} />
      <div className="feed-title-link">
        <h3>{data.title}</h3>
        <p>{data.description}</p>
      </div>
      {data.image_url ? (
        <div className="feed-media">
          <img src={data.image_url} alt={data.title} loading="lazy" decoding="async" />
        </div>
      ) : null}
      <div className="feed-social-row">
        <button
          type="button"
          onClick={handleLike}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: liked ? "#ef4444" : "#4b5563",
            fontWeight: 800,
            cursor: "pointer",
            font: "inherit",
          }}
        >
          <Heart
            size={18}
            fill={liked ? "#ef4444" : "none"}
            stroke={liked ? "#ef4444" : "currentColor"}
          />
          {likesCount}
        </button>

        <button
          type="button"
          onClick={toggleComments}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "#4b5563",
            fontWeight: 800,
            cursor: "pointer",
            font: "inherit",
            marginLeft: 16,
          }}
        >
          <MessageCircle size={18} />
          {commentsCount}
        </button>

        <button
          type="button"
          onClick={handleShare}
          aria-label="Share"
          style={{
            background: "none",
            border: "none",
            padding: 0,
            display: "inline-flex",
            alignItems: "center",
            cursor: "pointer",
            marginLeft: "auto",
          }}
        >
          <Send size={18} />
        </button>
      </div>

      {showComments && (
        <CommentsBox>
          {loadingComments ? (
            <div style={{ fontSize: 13, color: "#666", padding: "8px 0" }}>Loading comments...</div>
          ) : (
            <CommentsList>
              {commentsList.length === 0 ? (
                <div style={{ fontSize: 12, color: "#888", padding: "8px 0" }}>No comments yet. Be the first to comment!</div>
              ) : (
                commentsList.map((c) => (
                  <CommentItem key={c.id}>
                    <CommentText>
                      <strong>
                        {c.first_name || "User"} {c.last_name || ""}
                      </strong>
                      {" "}{c.comment}
                      {String(c.user_id) === String(user?.id) && (
                        <span style={{ fontSize: 10, color: "#2563eb", marginLeft: 8, fontWeight: "bold" }}>
                          You
                        </span>
                      )}
                    </CommentText>
                    <CommentMeta>
                      {new Date(c.created_at).toLocaleDateString()}
                    </CommentMeta>
                  </CommentItem>
                ))
              )}
            </CommentsList>
          )}

          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <InlineInput
              type="text"
              placeholder="Write a comment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyDown={handleAddComment}
            />
            <SendBtn onClick={() => handleAddComment(null)}>
              <Send size={16} />
            </SendBtn>
          </div>
        </CommentsBox>
      )}

      <FeedCtas data={data} />
    </article>
  );
});
