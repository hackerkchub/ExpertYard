import React from "react";
import { FiStar, FiClock, FiCheckCircle } from "react-icons/fi";

export default function ExpertCard({ expert, serviceBasePrice, onBookExpert }) {
  const effectivePrice = Number(expert.offer_price || expert.custom_price || serviceBasePrice || 0);
  const hasOffer = expert.offer_price && Number(expert.offer_price) < Number(expert.custom_price || serviceBasePrice);
  const expSla = expert.delivery_time_days || 1;

  return (
    <div className="msp-expert-card">
      <div className="msp-exp-card-header">
        <div className="msp-exp-avatar-wrapper">
          <img
            src={expert.profile_photo || expert.profile_image || "https://via.placeholder.com/60"}
            alt={expert.expert_name || expert.name}
            className="msp-exp-avatar"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/60?text=Expert";
            }}
          />
          <span className="msp-exp-verified-badge" title="Verified Expert">✓</span>
        </div>

        <div className="msp-exp-meta">
          <h4 className="msp-exp-name">{expert.expert_name || expert.name}</h4>
          <div className="msp-exp-role">
            {expert.position || "Verified Legal & Licensing Expert"}
          </div>
          <div className="msp-exp-rating">
            <FiStar className="msp-star-icon" />
            <strong>{expert.avg_rating || "4.9"}</strong>
            <span className="msp-rating-count">({expert.total_reviews || 12} reviews)</span>
          </div>
        </div>
      </div>

      {expert.custom_bio && (
        <p className="msp-exp-bio">
          "{expert.custom_bio}"
        </p>
      )}

      <div className="msp-exp-card-footer">
        <div className="msp-exp-price-col">
          <div className="msp-exp-price-label">Service Fee</div>
          <div className="msp-exp-price-val font-mono">
            ₹{effectivePrice.toLocaleString("en-IN")}
            {hasOffer && (
              <span className="msp-exp-old-price">
                ₹{Number(expert.custom_price || serviceBasePrice).toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>

        <div className="msp-exp-sla-col">
          <div className="msp-exp-sla-label">Turnaround</div>
          <div className="msp-exp-sla-val">
            <FiClock style={{ fontSize: 12 }} /> {expSla} Day(s)
          </div>
        </div>

        <button
          type="button"
          className="msp-exp-book-btn"
          onClick={() => onBookExpert(expert)}
        >
          Book
        </button>
      </div>
    </div>
  );
}
