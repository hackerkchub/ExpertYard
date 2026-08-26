import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function FeaturedService({ service }) {
  const navigate = useNavigate();
  if (!service) return null;

  const data = service.data || service;
  const detailLink = `/user/service-details/${data.slug || data.id}`;
  const bookLink = `${detailLink}?action=book`;

  const handleCardClick = (e) => {
    if (e.target.closest(".btn-book") || e.target.closest("button") || e.target.closest("a")) return;
    navigate(detailLink);
  };

  const handleBookClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    navigate(bookLink);
  };

  return (
    <article className="featured-service" onClick={handleCardClick} style={{ cursor: "pointer" }}>
      <div className="featured-service-header">
        <span>🚀 Featured Service</span>
        <span>{data.category_name || "Service"}</span>
      </div>

      <div className="featured-service-body">
        <div className="featured-service-content">
          <h3>{data.title || "Resume Building"}</h3>
          <p>
            {data.description ||
              "Get a professional resume crafted by career experts and boost your job chances."}
          </p>

          <div className="service-meta">
            <span className="service-price">
              Starting From ₹ {Math.round(Number(data.price || 1000))}
            </span>
            <Link
              to={bookLink}
              className="btn-book"
              onClick={handleBookClick}
            >
              Book Service
            </Link>
          </div>
        </div>

        {data.image && (
          <div className="featured-service-image">
            <img src={data.image} alt={data.title} loading="lazy" />
          </div>
        )}
      </div>
    </article>
  );
}