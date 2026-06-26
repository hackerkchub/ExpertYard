import React from "react";
import { Link } from "react-router-dom";
import {
  BadgeCheck,
  Bookmark,
  Heart,
  MessageCircle,
  PhoneCall,
  Send,
  Star,
} from "lucide-react";

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
      <button type="button" className="feed-save" aria-label="Save">
        <Bookmark size={19} />
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
  return (
    <div className="feed-ctas">
      <Link to={chatPath(data)}>
        <MessageCircle size={18} />
        Chat
      </Link>
      <Link to={callPath(data)}>
        <PhoneCall size={18} />
        Call
      </Link>
    </div>
  );
}

export const ExpertProfileFeedCard = React.memo(function ExpertProfileFeedCard({ item }) {
  const data = item.data || {};
  const promoted = item.type === "promoted_expert";

  return (
    <article className={`feed-card expert-profile-card${promoted ? " promoted" : ""}`}>
      <FeedHeader data={data} eyebrow={promoted ? "Promoted expert" : data.category_name} />
      <Link className="expert-card-body" to={expertPath(data)}>
        <div>
          <h3>{data.name || data.expert_name}</h3>
          <p>{data.description || data.position || "Available for chat and call consultation on G9Expert."}</p>
          <RatingLine data={data} />
        </div>
        <div className="expert-price-grid">
          <span><small>Chat</small>{money(data.chat_per_minute)}/min</span>
          <span><small>Call</small>{money(data.call_per_minute)}/min</span>
        </div>
      </Link>
      <FeedCtas data={data} />
    </article>
  );
});

export const ServicePostFeedCard = React.memo(function ServicePostFeedCard({ item }) {
  const data = item.data || {};

  return (
    <article className="feed-card service-feed-card">
      <FeedHeader data={data} eyebrow={data.category_name || "Service"} />
      <Link to={servicePath(data)} className="feed-title-link">
        <h3>{data.title}</h3>
        <p>{data.description}</p>
      </Link>
      {data.image ? (
        <Link to={servicePath(data)} className="feed-media">
          <img src={data.image} alt={data.title} loading="lazy" decoding="async" />
        </Link>
      ) : null}
      <div className="service-meta-row">
        <strong>{money(data.price)}</strong>
        <Link to={servicePath(data)}>Book service</Link>
      </div>
      <FeedCtas data={data} />
    </article>
  );
});

export const ExpertOfferFeedCard = React.memo(function ExpertOfferFeedCard({ item }) {
  const data = item.data || {};

  return (
    <article className="feed-card offer-feed-card">
      <FeedHeader data={data} eyebrow="Expert offer" />
      <div className="offer-panel">
        <span>Subscription offer</span>
        <h3>{data.name || "Expert consultation plan"}</h3>
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

  return (
    <article className="feed-card tip-feed-card">
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
        <span><Heart size={18} /> {data.likes || 0}</span>
        <span><MessageCircle size={18} /> {data.comments_count || 0}</span>
        <button type="button" aria-label="Share"><Send size={18} /></button>
      </div>
      <FeedCtas data={data} />
    </article>
  );
});
