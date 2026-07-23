import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HomeBanner = React.memo(function HomeBanner({
  banner,
  loading,
}) {
  if (loading) {
    return (
      <section className="home-banner home-banner-skeleton">
        <div className="banner-skeleton-content">
          <span />
          <span />
          {/* <span /> */}
        </div>

        <div className="banner-skeleton-image" />
      </section>
    );
  }

  if (!banner) {
    return (
      <section className="home-banner home-banner-empty">
        <div className="home-banner-content">
          <small>G9Expert</small>

          <h2>
            Find Trusted
            <br />
            Experts
          </h2>

          <p>
            Chat, Call and Book verified professionals instantly.
          </p>

          <Link
            className="home-banner-btn"
            to="/user/call-chat?page=1"
          >
            Explore Experts
          </Link>
        </div>
      </section>
    );
  }

  const image =
    window.innerWidth < 768
      ? banner.mobile_image || banner.image
      : banner.image;

  return (
    <section className="home-banner">

      <div className="home-banner-content">

        <small>
          G9Expert
        </small>

        <h2>
          {banner.title}
        </h2>

        <p>
          {banner.subtitle}
        </p>

        {banner.button_link && (

          <Link
            to={banner.button_link}
            className="home-banner-btn"
          >
            {banner.button_text || "Explore"}

            <ArrowRight size={18} />

          </Link>

        )}

      </div>

      {image && (

        <div className="home-banner-image">

          <img
            src={image}
            alt={banner.title}
            loading="eager"
          />

        </div>

      )}

    </section>
  );
});

export default HomeBanner;