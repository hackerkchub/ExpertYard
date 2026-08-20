import React from "react";
import { Link } from "react-router-dom";
import { Star, MessageCircle, PhoneCall, CheckCircle2 } from "lucide-react";
import "./ExpertCard.css";

const FALLBACK_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80";

export default function ExpertCard({ expert }) {
  if (!expert) return null;

  const {
    id,
    name,
    slug,
    position,
    profile_photo,
    avg_rating,
    total_reviews,
    chat_per_minute,
    call_per_minute,
    is_online,
  } = expert;

  const ratingVal = Number(avg_rating || 4.9).toFixed(1);
  const reviewsCount = total_reviews || 28;
  const expertProfileLink = slug ? `/user/experts/${slug}` : `/user/experts/${id}`;

  return (
    <div className="home-expert-card">
      <div className="expert-card-top">
        <div className="expert-avatar-wrap">
          <img
            src={profile_photo || FALLBACK_AVATAR}
            alt={name}
            className="expert-card-avatar"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = FALLBACK_AVATAR;
            }}
          />
          <span className={`expert-status-dot ${is_online ? "online" : "offline"}`} title={is_online ? "Online Now" : "Offline"} />
        </div>

            <div className="expert-card-info">
          <Link to={expertProfileLink} className="expert-card-name-row">
            <span className="expert-card-name">{name || "Verified Expert"}</span>
            <CheckCircle2 size={14} className="verified-icon" />
          </Link>

          <p className="expert-card-position">{position || "Consultant & Advisor"}</p>

          <div className="expert-card-rating">
            <Star size={12} className="star-icon" fill="#FBBF24" color="#FBBF24" />
            <span className="rating-num">{ratingVal}</span>
            <span className="rating-count">({reviewsCount})</span>
          </div>
        </div>
      </div>

      <div className="expert-card-actions">
        <Link to={`/user/chat?expertId=${id}`} className="expert-action-btn chat-btn" title="Start Chat">
          <MessageCircle size={14} />
          <span>{chat_per_minute ? `₹${chat_per_minute}/m` : "Chat"}</span>
        </Link>

        <Link to={`/user/experts/${slug || id}?tab=call`} className="expert-action-btn call-btn" title="Start Audio Call">
          <PhoneCall size={14} />
          <span>{call_per_minute ? `₹${call_per_minute}/m` : "Call"}</span>
        </Link>
      </div>
    </div>
  );
}

