import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, ArrowRight, Clock, Star } from "lucide-react";
import HorizontalScroller from "../HorizontalScroller";
import "./PopularServicesSection.css";

export default function PopularServicesSection({ services = [], loading = false }) {
  const navigate = useNavigate();

  if (loading && (!services || services.length === 0)) {
    return (
      <section className="g9-popular-services-section" aria-label="Loading popular services">
        <div className="popular-services-head">
          <div className="ps-skeleton-title" />
          <div className="ps-skeleton-link" />
        </div>
        <div className="ps-skeleton-cards-row">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="ps-skeleton-card" />
          ))}
        </div>
      </section>
    );
  }

  // Handle empty state gracefully without fake dummy data
  if (!services || services.length === 0) {
    return null;
  }

  // Deduplicate and take top 8 services
  const uniqueServices = Array.from(
    new Map(services.map((s) => [s.slug || s.master_service_id || s.id, s])).values()
  ).slice(0, 8);

  if (!uniqueServices.length) return null;

  return (
    <section className="g9-popular-services-section" aria-label="Popular verified services">
      <div className="popular-services-head">
        <div>
          <h2 className="popular-services-title">Popular Services</h2>
          <p className="popular-services-subtitle">
            Book professional services with guaranteed delivery &amp; verified execution
          </p>
        </div>
        <Link to="/user/all-services" className="popular-services-view-all">
          <span>View All</span>
          <ArrowRight size={15} />
        </Link>
      </div>

      <HorizontalScroller className="popular-services-scroller">
        {uniqueServices.map((svc) => {
          const serviceSlug = svc.slug || svc.id;
          const serviceUrl = serviceSlug
            ? `/user/service/${serviceSlug}`
            : "/user/all-services";
          const priceValue = svc.offer_price ?? svc.price ?? 999;
          const deliveryDays = svc.delivery_time_days || 1;

          return (
            <div
              key={svc.id || svc.slug}
              className="popular-service-card"
              onClick={() => navigate(serviceUrl)}
              role="button"
              tabIndex={0}
              aria-label={`Service: ${svc.title}`}
            >
              <div className="service-card-media-wrap">
                {svc.cover_image ? (
                  <img
                    src={svc.cover_image}
                    alt={svc.title}
                    className="service-card-media"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling && (e.target.nextSibling.style.display = "flex");
                    }}
                  />
                ) : null}
                <div
                  className="service-card-media-fallback"
                  style={{ display: svc.cover_image ? "none" : "flex" }}
                >
                  <Briefcase size={28} color="#000080" />
                </div>

                <div className="service-delivery-tag">
                  <Clock size={11} />
                  <span>{deliveryDays} {deliveryDays === 1 ? "day" : "days"}</span>
                </div>
              </div>

              <div className="service-card-content">
                <span className="service-card-category">
                  {svc.category_name || "Verified Service"}
                </span>

                <h3 className="service-card-title" title={svc.title}>
                  {svc.title}
                </h3>

                <div className="service-card-bottom-row">
                  <div className="service-price-block">
                    <small>Starting at</small>
                    <strong>₹ {Math.round(Number(priceValue))}</strong>
                  </div>

                  <Link
                    to={serviceUrl}
                    className="service-book-btn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </HorizontalScroller>
    </section>
  );
}
