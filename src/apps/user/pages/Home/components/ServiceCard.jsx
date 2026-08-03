import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Award, ShieldCheck } from "lucide-react";
import "./ServiceCard.css";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80";

const truncateTitle = (rawTitle) => {
  if (!rawTitle) return "";
  // Strip trailing system timestamps/numbers (e.g. 1784926976623)
  const cleanTitle = String(rawTitle).replace(/\s+\d{10,}$/g, "").trim();
  const words = cleanTitle.split(/\s+/);
  if (words.length <= 3) return cleanTitle;
  return words.slice(0, 3).join(" ");
};

export default function ServiceCard({ service }) {
  if (!service) return null;

  const {
    id,
    master_service_id,
    title,
    slug,
    price,
    offer_price,
    cover_image,
    is_master_service = true,
  } = service;

  const displayPrice = offer_price || price || 499;
  const shortTitle = truncateTitle(title);
  const rawId = master_service_id || (typeof id === "string" ? id.replace("ms-", "") : id);
  const detailLink = slug ? `/user/service-details/${slug}` : `/user/service-details/${rawId}`;

  return (
    <div className="home-service-card">
      {/* 1. FIXED IMAGE WRAPPER */}
      <div className="service-card-image-wrap">
        <img
          src={cover_image || FALLBACK_IMAGE}
          alt={title}
          className="service-card-img"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = FALLBACK_IMAGE;
          }}
        />
        <div className="service-master-badge">
          {is_master_service ? (
            <>
              <Award size={12} color="#2563eb" />
              <span>Master Service</span>
            </>
          ) : (
            <>
              <ShieldCheck size={12} color="#059669" />
              <span>Verified Service</span>
            </>
          )}
        </div>
      </div>

      {/* 2. COMPACT CONTENT WRAPPER */}
      <div className="service-card-content">
        <h2 className="service-card-title" title={title}>
          {shortTitle}
        </h2>

        <div className="service-card-divider" />

        <div className="service-card-footer">
          <div className="service-price-block">
            <span className="price-label">Starts at</span>
            <span className="price-amount">₹{displayPrice}</span>
          </div>

          <Link to={detailLink} className="service-book-btn">
            <span>Book</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
