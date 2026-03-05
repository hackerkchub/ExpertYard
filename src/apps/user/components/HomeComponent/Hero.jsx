import React, { useState } from 'react';

export default function Hero() {
  const [activeCategory, setActiveCategory] = useState('Career');
  const categories = ['Career', 'Health', 'Finance', 'Legal', 'Relationship'];

  return (
    <section className="hero-section">
      <div className="container hero-container">
        {/* Left Side: Content */}
        <div className="hero-content">
          <div className="badge">✨ Trusted by 10k+ Global Users</div>
          <h1>
            Connect <span className="blue-text">Instantly</span> <br />
            with Verified Experts
          </h1>
          <p className="hero-desc">
            Get personalized advice from certified professionals across 12+ categories. 
            Real solutions, real conversations, real results.
          </p>

          <div className="hero-actions">
            <button className="btn-solid">Start Free Chat</button>
            <button className="btn-outline-blue">Talk to Expert</button>
          </div>

          <div className="popular-tags">
            <span>Popular:</span>
            {categories.map((cat) => (
              <button 
                key={cat} 
                className={`tag ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="hero-trust-badges">
            <div className="t-item"><span>✔</span> 24/7 Support</div>
            <div className="t-item"><span>🔒</span> Private & Secure</div>
          </div>
        </div>

        {/* Right Side: Visual Mockup */}
        <div className="hero-visual">
          <div className="main-card">
            <div className="card-head">
              <div className="user-profile">
                <div className="u-avatar">JS</div>
                <div>
                  <strong>Dr. Sarah Chen</strong>
                  <p><span className="dot"></span> Online</p>
                </div>
              </div>
              <div className="price-tag">$2.99/min</div>
            </div>
            
            <div className="card-chat-body">
              <div className="msg m-left">Hi! I need career advice.</div>
              <div className="msg m-right">Sure! How can I help?</div>
              <div className="msg m-left">I'm moving to tech industry.</div>
              <div className="typing">Dr. Sarah is typing...</div>
            </div>
          </div>

          {/* Floating Expert Tags (Desktop Only) */}
          <div className="floating-badge fb-1">👨‍💼 Michael (Coach)</div>
          <div className="floating-badge fb-2">👩‍⚖️ Emma (Legal)</div>
        </div>
      </div>
    </section>
  );
}