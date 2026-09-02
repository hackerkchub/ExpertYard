import React from "react";
import { Link } from "react-router-dom";
import { FiShield, FiClock, FiCheckCircle, FiZap, FiChevronDown, FiChevronUp, FiFolder, FiMessageSquare } from "react-icons/fi";

const DEFAULT_SERVICE_IMAGE = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80";

export default function ServiceHero({
  service,
  displayMinPrice,
  isDescExpanded,
  setIsDescExpanded,
  isAlreadyBooked,
  onBookClick,
  onViewExpertsClick,
  onSendInquiry,
  getServiceImageUrl
}) {
  const imageUrl = getServiceImageUrl
    ? getServiceImageUrl(service.image_url || service.thumbnail_url || service.banner_url || service.icon_url)
    : DEFAULT_SERVICE_IMAGE;

  return (
    <header className="msp-hero-card">
      {/* LEFT COLUMN: DETAILS & ACTIONS */}
      <div className="msp-hero-content">
        {/* CATEGORY & SLA BADGES */}
        <div className="msp-hero-badges">
          {service.category_name && (
            <span className="msp-badge msp-badge-blue">
              🏷️ {service.category_name}
            </span>
          )}
          {service.subcategory_name && (
            <span className="msp-badge msp-badge-emerald">
              ❖ {service.subcategory_name}
            </span>
          )}
          <span className="msp-badge msp-badge-amber">
            ⚡ {service.delivery_time_days || 1} Day SLA
          </span>
          <span className="msp-badge msp-badge-green">
            ✓ Verified Service
          </span>
        </div>

        {/* TITLE */}
        <h1 className="msp-hero-title">{service.title}</h1>

        {/* SHORT DESCRIPTION WITH EXPAND TOGGLE */}
        {service.short_description && (
          <div className="msp-hero-desc-wrapper">
            <div
              className={`msp-hero-desc-text ${!isDescExpanded ? "msp-desc-clamped" : ""}`}
              dangerouslySetInnerHTML={{ __html: service.short_description }}
            />
            {service.short_description.length > 180 && (
              <button
                type="button"
                className="msp-read-more-btn"
                onClick={() => setIsDescExpanded(!isDescExpanded)}
              >
                {isDescExpanded ? (
                  <>Show Less <FiChevronUp /></>
                ) : (
                  <>Read Details <FiChevronDown /></>
                )}
              </button>
            )}
          </div>
        )}

        {/* COMPACT TRUST INDICATORS */}
        <div className="msp-trust-indicators">
          <div className="msp-trust-item">
            <FiClock className="msp-trust-icon msp-icon-amber" />
            <span>Guaranteed {service.delivery_time_days || 1}-Day SLA</span>
          </div>
          <div className="msp-trust-item">
            <FiShield className="msp-trust-icon msp-icon-blue" />
            <span>100% Verified Experts</span>
          </div>
          <div className="msp-trust-item">
            <FiFolder className="msp-trust-icon msp-icon-emerald" />
            <span>Dedicated Workspace</span>
          </div>
        </div>

        {/* PRICE DISPLAY */}
        <div className="msp-hero-price-box">
          <div>
            <div className="msp-price-label">Starting Service Fee</div>
            <div className="msp-price-amount">
              ₹{displayMinPrice.toLocaleString("en-IN")}
            </div>
            <div className="msp-price-gst">
              Includes full workspace tools & delivery
            </div>
          </div>
          <div className="msp-value-tag">Best Value Guaranteed</div>
        </div>

        {/* HERO CTA BUTTONS */}
        <div className="msp-hero-actions">
          {isAlreadyBooked ? (
            <button
              type="button"
              className="msp-btn-primary msp-btn-already-booked"
              onClick={(e) => e.preventDefault()}
            >
              <FiCheckCircle size={18} /> Service Already Booked
            </button>
          ) : (
            <button
              type="button"
              className="msp-btn-primary"
              onClick={onBookClick}
            >
              <FiZap /> Book Service Now
            </button>
          )}

          <button
            type="button"
            className="msp-btn-secondary"
            onClick={onViewExpertsClick}
          >
            View Verified Experts
          </button>

          <button
            type="button"
            className="msp-btn-secondary"
            onClick={onSendInquiry}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <FiMessageSquare size={16} /> Send Inquiry
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: DECORATIVE SERVICE ILLUSTRATION CARD */}
      <div className="msp-hero-visual-card">
        <div className="msp-visual-container">
          <img
            src={imageUrl}
            alt={service.title}
            className="msp-hero-visual-img"
            onError={(e) => {
              e.target.src = DEFAULT_SERVICE_IMAGE;
            }}
          />
          {/* DECORATIVE OVERLAY BADGE */}
          <div className="msp-visual-badge">
            <FiShield className="msp-visual-shield" />
            <span>Official Service Guarantee</span>
          </div>
        </div>

        {/* DECORATIVE FEATURES STRIP */}
        <div className="msp-visual-features">
          <div className="msp-vfeat">
            <FiCheckCircle className="msp-vfeat-icon" /> Fast Processing
          </div>
          <div className="msp-vfeat">
            <FiCheckCircle className="msp-vfeat-icon" /> Expert Assisted
          </div>
          <div className="msp-vfeat">
            <FiCheckCircle className="msp-vfeat-icon" /> Safe & Secure
          </div>
        </div>
      </div>
    </header>
  );
}
