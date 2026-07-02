import React from "react";
import { Link } from "react-router-dom";

export default function FeaturedService({ service }) {
  if (!service) return null;

  const data = service.data || service;

  return (
    <article className="featured-service">
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
              to={`/user/service-details/${data.slug || data.id}`}
              className="btn-book"
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