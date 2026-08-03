import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Heart, MessageCircle } from "lucide-react";
import HorizontalScroller from "./HorizontalScroller";
import "./ExpertTipsSection.css";

const FALLBACK_POST_IMG = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80";
const FALLBACK_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

function TipCard({ post }) {
  const navigate = useNavigate();
  const initialLikes = typeof post.likes === "number" ? post.likes : (typeof post.likes_count === "number" ? post.likes_count : 0);
  const initialComments = typeof post.comments_count === "number" ? post.comments_count : (typeof post.comments === "number" ? post.comments : 0);

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [commentsCount] = useState(initialComments);

  const handleLikeToggle = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (liked) {
      setLiked(false);
      setLikesCount((prev) => Math.max(0, prev - 1));
    } else {
      setLiked(true);
      setLikesCount((prev) => prev + 1);
    }
  };

  const expertRef = post.expert_slug || post.expert_id;
  const postLink = expertRef
    ? `/user/experts/${expertRef}?tab=posts&postId=${post.id}`
    : `/user/call-chat?page=1`;

  const handleCardClick = (e) => {
    // If user clicked inside the interactive buttons, don't navigate
    if (e.target.closest(".tip-stat-pill") || e.target.closest("button")) {
      return;
    }
    navigate(postLink);
  };

  const categoryTag = post.category_name || post.category || "Expert Advice";

  return (
    <div className="tip-card-item" onClick={handleCardClick} role="button" tabIndex={0}>
      {/* 1. COVER IMAGE */}
      <div className="tip-image-wrap">
        <img
          src={post.image_url || FALLBACK_POST_IMG}
          alt={post.title || "Expert Tip"}
          className="tip-img"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = FALLBACK_POST_IMG;
          }}
        />
        <div className="tip-category-badge">{categoryTag}</div>
      </div>

      {/* 2. CARD CONTENT */}
      <div className="tip-content">
        <div className="tip-expert-row">
          <img
            src={post.profile_photo || FALLBACK_AVATAR}
            alt={post.expert_name || "Advisor"}
            className="tip-expert-avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = FALLBACK_AVATAR;
            }}
          />
          <span className="tip-expert-name">{post.expert_name || "G9Expert Advisor"}</span>
        </div>

        <h4 className="tip-card-title">{post.title || post.description || "Top Expert Guidance & Tips"}</h4>

        {/* 3. DYNAMIC REAL-TIME LIKE & COMMENT ROW */}
        <div className="tip-interactions-row">
          <button
            type="button"
            className={`tip-stat-pill tip-like-pill ${liked ? "active-liked" : ""}`}
            onClick={handleLikeToggle}
            title={liked ? "Unlike" : "Like"}
          >
            <Heart
              size={14}
              className="heart-icon-filled"
              color={liked ? "#dc2626" : "#ef4444"}
              fill={liked ? "#dc2626" : "#ef4444"}
            />
            <span>{likesCount}</span>
          </button>

          <div
            className="tip-stat-pill tip-comment-pill"
            onClick={(e) => {
              e.stopPropagation();
              navigate(postLink);
            }}
          >
            <MessageCircle size={14} color="#2563eb" fill="#dbeafe" />
            <span>{commentsCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExpertTipsSection({ posts = [] }) {
  if (!Array.isArray(posts) || posts.length === 0) return null;

  return (
    <section className="homepage-tips-section">
      <div className="tips-header">
        <div className="tips-header-left">
          <div className="tips-icon-badge">
            <Sparkles size={20} />
          </div>
          <div className="tips-header-text">
            <h3 className="tips-title">Expert Tips &amp; Knowledge</h3>
            <span className="tips-subtitle">Free professional advice, articles &amp; guidance</span>
          </div>
        </div>
      </div>

      <HorizontalScroller className="tips-scroller">
        {posts.map((post) => (
          <TipCard key={post.id} post={post} />
        ))}
      </HorizontalScroller>
    </section>
  );
}
