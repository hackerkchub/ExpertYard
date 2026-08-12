import React from "react";
import { Link } from "react-router-dom";
import {Medal, CheckCircle, QrCode } from "lucide-react";
import "./ServiceCard.css";

const truncateTitle = (rawTitle) => {
  if (!rawTitle) return "";
  // Strip trailing system timestamps/numbers (e.g. 1784926976623)
  const cleanTitle = String(rawTitle).replace(/\s+\d{10,}$/g, "").trim();
  const words = cleanTitle.split(/\s+/);
  if (words.length <= 4) return cleanTitle;
  return words.slice(0, 4).join(" ");
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
    min_price,
    base_price,
    is_master_service = true,
    category_name,
    provider_name,
    expert_name,
  } = service;

  const validPrices = [min_price, offer_price, price, base_price]
    .map((p) => Number(p))
    .filter((p) => !isNaN(p) && p > 0);

  const displayPrice = validPrices.length > 0 ? Math.min(...validPrices) : 130;
  const shortTitle = truncateTitle(title) || "Pan Card";
  const rawId = master_service_id || (typeof id === "string" ? id.replace("ms-", "") : id) || "36920";
  const numMatches = String(rawId).match(/\d+/g);
  const reqNum = numMatches ? numMatches.join("").slice(-5) : "36920";
  const formattedReq = `REQ / ${reqNum || "36920"}`;
  const detailLink = slug ? `/user/service-details/${slug}` : `/user/service-details/${rawId}`;

  const categoryLabel = category_name || "Community Partner";
  const providerLabel = provider_name || expert_name || "Himanshu Dhote";

  const coverImage = service.cover_image || service.image || service.image_url || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80";

  return (
    <div className="home-service-card service-ticket-card">
      {/* Top Section with Dynamic Service Cover Image */}
      <div className="ticket-dark-header ticket-dynamic-image-header">
        <img
          src={coverImage}
          alt={title}
          className="ticket-service-img"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80";
          }}
        />
        
      </div>

      {/* Bottom White Section */}
      <div className="ticket-white-body">
        <h4 className="ticket-service-title" title={title}>
          {shortTitle}
        </h4>

        <div className="ticket-footer-action">
          <div className="ticket-price-block">
            <span className="ticket-price-label">Starts At</span>
            <span className="ticket-price-value">₹{displayPrice}</span>
          </div>

          <Link to={detailLink} className="ticket-book-button">
            <span>Book</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
