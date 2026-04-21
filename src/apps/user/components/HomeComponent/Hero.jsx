import React from "react";
import { Link } from "react-router-dom";

const categories = ["Legal Advice", "Doctor Guidance", "Career Help", "Parenting", "Finance"];

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="container hero-container">
        <div className="hero-content">
          <div className="badge">Trusted by users looking for verified expert advice online</div>
          <h1>
            Talk to <span className="blue-text">verified experts</span> for practical everyday
            guidance
          </h1>
          <p className="hero-desc">
            ExpertYard helps people get online consultation across legal advice, doctor guidance,
            diet and fitness consultation, relationship support, career guidance, parenting
            advice, astrology, and financial guidance. Clear profiles, private conversations, and
            secure payments make it easier to choose help with confidence.
          </p>

          <div className="hero-actions">
            <Link className="btn-solid" to="/user/categories">
              Talk to a Verified Expert
            </Link>
            <Link className="btn-outline-blue" to="/user/experts">
              Find the Right Expert
            </Link>
          </div>

          <div className="popular-tags" aria-label="Popular consultation categories">
            <span>Popular searches:</span>
            {categories.map((category) => (
              <Link key={category} className="tag active" to="/user/categories">
                {category}
              </Link>
            ))}
          </div>

          <div className="hero-trust-badges" aria-label="Trust signals">
            <div className="t-item">Verified expert profiles</div>
            <div className="t-item">Private conversations</div>
            <div className="t-item">Secure payments</div>
            <div className="t-item">Fast chat and call connect</div>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="main-card">
            <div className="card-head">
              <div className="user-profile">
                <div className="u-avatar">SC</div>
                <div>
                  <strong>Dr. Sarah Chen</strong>
                  <p>
                    <span className="dot"></span> Verified and online
                  </p>
                </div>
              </div>
              <div className="price-tag">Private session</div>
            </div>

            <div className="card-chat-body">
              <div className="msg m-left">I need legal guidance before signing this document.</div>
              <div className="msg m-right">You can connect with a verified expert and ask your questions now.</div>
              <div className="msg m-left">Good. I want a quick and private consultation.</div>
              <div className="typing">Average rating across consultations: 4.9/5</div>
            </div>
          </div>

          <div className="floating-badge fb-1">Secure payments</div>
          <div className="floating-badge fb-2">Verified profiles</div>
        </div>
      </div>
    </section>
  );
}
