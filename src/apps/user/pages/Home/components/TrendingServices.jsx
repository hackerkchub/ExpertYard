import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

// ============================================
// TRENDING SERVICE CARD COMPONENT
// ============================================

const TrendingServiceCard = React.memo(({ service }) => {
  return (
    <Link
      to={`/user/service/${service.id}`}
      className="trending-card home-card"
    >
      <div className="trending-image">
        <img
    src={service.cover_image}
    alt={service.title}
    loading="lazy"
  />
      </div>

      <div className="trending-content">
       <h3>
    {service.title}
  </h3>
         <p>
    {service.category_name || "Professional Service"}
  </p>

        <div className="trending-footer">
          <span className="trending-rating">
            <Star size={15} fill="#FFD54A" stroke="#FFD54A" />
             {(Number(service.avg_rating) || 0).toFixed(1)}
          </span>
           <span style={{ marginLeft: "auto" , fontWeight: "bold" }}>

      ₹{Math.round(service.offer_price || service.price)}

    </span>
          <ArrowRight size={18} />
        </div>
      </div>
    </Link>
  );
});

// ============================================
// TRENDING SERVICES SKELETON
// ============================================

const TrendingServicesSkeleton = React.memo(() => {
  return (
    <section className="home-section">
      <div className="home-section-header">
        <h2>Trending Services</h2>
      </div>

      <div className="trending-services-grid">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="trending-card home-card">
            <div className="trending-image skeleton" />
            <div className="trending-content">
              <span className="skeleton trending-line" />
              <span className="skeleton trending-line short" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});

// ============================================
// MAIN TRENDING SERVICES COMPONENT
// ============================================

const TrendingServices = ({ services = [], loading }) => {
  if (loading) {
    return <TrendingServicesSkeleton />;
  }

  if (!services.length) {
    return null;
  }

  return (
    <section className="home-section">
      <div className="home-section-header">
        <h2>Trending Services</h2>
      </div>

      <div className="trending-services-grid">
        {services.map((service) => (
          <TrendingServiceCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  );
};

export default React.memo(TrendingServices);