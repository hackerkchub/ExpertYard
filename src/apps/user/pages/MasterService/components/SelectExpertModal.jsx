import React from "react";
import { FiStar, FiX } from "react-icons/fi";

export default function SelectExpertModal({
  service,
  processedExperts,
  onClose,
  onSelectExpert
}) {
  return (
    <div className="msp-modal-overlay" onClick={onClose}>
      <div
        className="msp-modal-box msp-select-expert-modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="msp-modal-drag-handle" />

        <div className="msp-modal-header">
          <div>
            <h3 className="msp-modal-title">Please Select an Expert for Booking</h3>
            <div className="msp-modal-subtitle">
              Choose your preferred verified expert for {service?.title}
            </div>
          </div>
          <button type="button" className="msp-modal-close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="msp-select-expert-list">
          {processedExperts.map((exp) => {
            const effectivePrice = Number(exp.offer_price || exp.custom_price || service?.base_price || 0);
            const hasOffer = exp.offer_price && Number(exp.offer_price) < Number(exp.custom_price || service?.base_price);
            const expSla = exp.delivery_time_days || service?.delivery_time_days || 1;

            return (
              <div key={exp.id || exp.expert_id} className="msp-select-expert-card">
                <div className="msp-select-exp-info">
                  <img
                    src={exp.profile_photo || exp.profile_image || "https://via.placeholder.com/50"}
                    alt={exp.expert_name || exp.name}
                    className="msp-select-exp-avatar"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/50?text=Expert";
                    }}
                  />
                  <div>
                    <div className="msp-select-exp-name-row">
                      <strong className="msp-select-exp-name">{exp.expert_name || exp.name}</strong>
                      <span className="msp-select-exp-rating">
                        <FiStar className="msp-star-icon" /> {exp.avg_rating || "4.9"}
                      </span>
                    </div>
                    <div className="msp-select-exp-meta">
                      {exp.position || "Verified Expert"} • SLA: {expSla} Day(s)
                    </div>
                  </div>
                </div>

                <div className="msp-select-exp-action-row">
                  <div className="msp-select-exp-price">
                    <div className="msp-select-exp-amount font-mono">
                      ₹{effectivePrice.toLocaleString("en-IN")}
                    </div>
                    {hasOffer && (
                      <div className="msp-select-exp-old">
                        ₹{Number(exp.custom_price || service?.base_price).toLocaleString("en-IN")}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    className="msp-btn-primary msp-select-btn"
                    onClick={() => {
                      onClose();
                      onSelectExpert(exp);
                    }}
                  >
                    Select & Book
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
