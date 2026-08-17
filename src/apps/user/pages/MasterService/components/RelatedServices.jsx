import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const DEFAULT_SERVICE_IMAGE = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80";

export default function RelatedServices({ relatedServices, getServiceImageUrl }) {
  const navigate = useNavigate();
  if (!Array.isArray(relatedServices) || relatedServices.length === 0) return null;

  return (
    <section className="msp-section-card msp-related-card">
      <div className="msp-section-header-bar">
        <h3 className="msp-section-title">
          🔗 Similar Master Services You Might Need
        </h3>
      </div>

      <div className="msp-related-grid">
        {relatedServices.map((rel) => {
          const imgUrl = getServiceImageUrl
            ? getServiceImageUrl(rel.image_url || rel.thumbnail_url)
            : DEFAULT_SERVICE_IMAGE;

          return (
            <div
              key={rel.id}
              className="msp-related-item-card"
              onClick={() => navigate(`/user/service/${rel.slug || rel.id}`)}
              role="button"
              tabIndex={0}
            >
              <div className="msp-related-img-box">
                <img
                  src={imgUrl}
                  alt={rel.title}
                  className="msp-related-img"
                  onError={(e) => {
                    e.target.src = DEFAULT_SERVICE_IMAGE;
                  }}
                />
              </div>

              <div className="msp-related-info">
                <h4 className="msp-related-title">{rel.title}</h4>
                <div className="msp-related-bottom">
                  <span className="msp-related-price">
                    ₹{Number(rel.base_price || 999).toLocaleString("en-IN")}
                  </span>
                  <span className="msp-related-arrow">
                    View <FiArrowRight />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
