import React from "react";
import { Link } from "react-router-dom";
import { Star, BadgeCheck, Phone, MessageCircle } from "lucide-react";
import { normalizeVideoCallPrice } from "../../../../../shared/utils/normalizeExpertPrice";

// ============================================
// FEATURED EXPERT CARD COMPONENT
// ============================================

const FeaturedExpertCard = React.memo(({ expert }) => {
  const videoCallPrice = normalizeVideoCallPrice(expert);
  const chatPrice = expert.chat_price || expert.chat_rate || expert.chat_per_minute || expert.chatPricePerMinute || 0;
  const callPrice = expert.call_price || expert.call_rate || expert.call_per_minute || expert.callPricePerMinute || 0;

  return (
    <div className="featured-card home-card">
      <div className="featured-top">
        <div className="featured-avatar">
          <img
            src={expert.profile_photo || "/images/default-user.png"}
            alt={expert.name}
          />
        </div>

        <div className="featured-content">
          <h3>{expert.name}</h3>
          <p>{expert.position}</p>

          <div className="featured-rating">
            <Star size={15} fill="#FFD54A" stroke="#FFD54A" />
            <span>{expert.rating || "4.8"}</span>
          </div>
        </div>
      </div>

      <div className="featured-price">
        <div>
          <small>Chat</small>
          <strong>₹{expert.chat_price || expert.chat_rate || 0}/min</strong>
        </div>

        <div>
          <small>Call</small>
          <strong>₹{expert.call_price || expert.call_rate || 0}/min</strong>
        </div>

        {videoCallPrice > 0 && (
          <div>
            <small>Video</small>
            <strong>₹{videoCallPrice}/min</strong>
          </div>
        )}
      </div>

      <div className="featured-status">
        <span>
          <BadgeCheck size={15} />
          Verified
        </span>

        <span>{expert.is_online ? "🟢 Online" : "⚪ Offline"}</span>
      </div>

      <div className="featured-buttons">
        <Link to={`/user/chat/${expert.id}`} className="featured-chat-btn" aria-label="Start chat consultation" title="Start chat consultation">
          <MessageCircle size={18} />
          {chatPrice > 0 ? `\u20B9${chatPrice}/min` : "--"}
        </Link>

        <Link to={`/user/call/${expert.id}`} className="featured-call-btn" aria-label="Start voice call" title="Start voice call">
          <Phone size={18} />
          {callPrice > 0 ? `\u20B9${callPrice}/min` : "--"}
        </Link>
      </div>
    </div>
  );
});

// ============================================
// FEATURED EXPERT SKELETON
// ============================================

const FeaturedExpertSkeleton = React.memo(() => {
  return (
    <section className="home-section">
      <div className="home-section-header">
        <h2>Featured Expert</h2>
      </div>

      <div className="featured-card home-card">
        <div className="featured-top">
          <div className="featured-avatar skeleton" />

          <div className="featured-skeleton-content">
            <span className="skeleton" />
            <span className="skeleton" />
            <span className="skeleton" />
          </div>
        </div>
      </div>
    </section>
  );
});

// ============================================
// MAIN FEATURED EXPERT COMPONENT
// ============================================

const FeaturedExpert = ({ expert, loading }) => {
  if (loading) {
    return <FeaturedExpertSkeleton />;
  }

  if (!expert) {
    return null;
  }

  return (
    <section className="home-section">
      <div className="home-section-header">
        <h2>Featured Expert</h2>
      </div>

      <FeaturedExpertCard expert={expert} />
    </section>
  );
};

export default React.memo(FeaturedExpert);
