import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Heart, MessageCircle, ArrowRight } from "lucide-react";
import HorizontalScroller from "./HorizontalScroller";
import "./ExpertTipsSection.css";

const FALLBACK_POST_IMG = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80";
const FALLBACK_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

export default function ExpertTipsSection({ posts = [] }) {
  if (!Array.isArray(posts) || posts.length === 0) return null;

  return (
    <section className="homepage-tips-section">
      <div className="tips-header">
        <div className="tips-header-left">
          <div className="tips-icon-badge">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="tips-title">Expert Tips & Knowledge</h3>
            <span className="tips-subtitle">Free professional advice, articles & guidance</span>
          </div>
        </div>
      </div>

      <HorizontalScroller className="tips-scroller">
        {posts.map((post) => (
          <div key={post.id} className="tip-card-item">
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
            </div>

            <div className="tip-content">
              <div className="tip-expert-row">
                <img
                  src={post.profile_photo || FALLBACK_AVATAR}
                  alt={post.expert_name}
                  className="tip-expert-avatar"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = FALLBACK_AVATAR;
                  }}
                />
                <span className="tip-expert-name">{post.expert_name || "G9Expert Advisor"}</span>
              </div>

              <h4 className="tip-card-title">{post.title || post.description || "Top Legal & Medical Tips"}</h4>

              <div className="tip-card-footer">
                <div className="tip-stats">
                  <span className="stat-item">
                    <Heart size={13} className="heart-icon" />
                    <span>{post.likes || 18}</span>
                  </span>
                  <span className="stat-item">
                    <MessageCircle size={13} />
                    <span>{post.comments_count || 4}</span>
                  </span>
                </div>

                <Link to={post.expert_slug ? `/user/experts/${post.expert_slug}` : "/user"} className="tip-read-link">
                  <span>Read</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </HorizontalScroller>
    </section>
  );
}
