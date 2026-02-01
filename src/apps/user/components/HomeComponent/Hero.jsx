import React, { useState } from 'react';

export default function Hero() {
  const [activeCategory, setActiveCategory] = useState('Career');

  const categories = ['Career', 'Health', 'Finance', 'Legal', 'Relationship'];

  return (
    <section className="hero">
      <div className="hero-left">
        <h1>
          <span className="gradient-text">Connect Instantly</span> with Top Verified Experts
        </h1>
        <p className="hero-subtitle">
          Get personalized advice from certified professionals across 12+ categories. 
          Real solutions, real conversations, real results.
        </p>
        
        <div className="hero-categories">
          <p className="categories-label">Popular Categories:</p>
          <div className="category-tags">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-tag ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="hero-buttons">
          <button className="btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M20 12H4M4 12L10 6M4 12L10 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Start Free Chat
          </button>
          <button className="btn-outline">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22 16.92C21.88 18.32 21.24 19.56 20.24 20.48C19.24 21.4 17.94 22 16.5 22C15.06 22 13.76 21.4 12.76 20.48C11.76 19.56 11.12 18.32 11 16.92" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Talk to Expert
          </button>
        </div>

        <div className="hero-stats">
          <div className="stat">
            <div className="stat-number">10,000+</div>
            <div className="stat-label">Happy Users</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <div className="stat-number">500+</div>
            <div className="stat-label">Verified Experts</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <div className="stat-number">4.9</div>
            <div className="stat-label">Avg. Rating</div>
          </div>
        </div>

        <div className="hero-trust">
          <div className="trust-item">
            <span className="trust-icon">✔</span>
            <span>24/7 Available</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">🔒</span>
            <span>Secure & Private</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">💳</span>
            <span>Flexible Payments</span>
          </div>
        </div>
      </div>

      <div className="hero-right">
        <div className="chat-mock">
          <div className="chat-header">
            <div className="chat-avatar">👩‍⚕️</div>
            <div className="chat-info">
              <div className="chat-name">Dr. Sarah Chen</div>
              <div className="chat-status">
                <span className="status-dot"></span>
                Online now
              </div>
            </div>
            <div className="chat-price">$2.99/min</div>
          </div>
          
          <div className="chat-body">
            <div className="message-date">Today 10:30 AM</div>
            
            <div className="bubble left">
              <div className="bubble-avatar">👤</div>
              <div className="bubble-content">
                <div className="bubble-text">Hi Sarah! I need advice on my career transition.</div>
                <div className="bubble-time">10:30 AM</div>
              </div>
            </div>
            
            <div className="bubble right">
              <div className="bubble-content">
                <div className="bubble-text">Hello! 👋 I'd love to help. What industry are you looking to move into?</div>
                <div className="bubble-time">10:31 AM</div>
              </div>
              <div className="bubble-avatar">👩‍⚕️</div>
            </div>
            
            <div className="bubble left">
              <div className="bubble-avatar">👤</div>
              <div className="bubble-content">
                <div className="bubble-text">I'm interested in tech, but I have a marketing background.</div>
                <div className="bubble-time">10:32 AM</div>
              </div>
            </div>
            
            <div className="typing-indicator">
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className="typing-text">Dr. Sarah is typing...</span>
            </div>
          </div>
          
          <div className="chat-input">
            <input type="text" placeholder="Type your message..." />
            <button className="send-btn">➤</button>
          </div>
        </div>
        
        <div className="floating-experts">
          <div className="expert-1">
            <div className="expert-avatar">👨‍💼</div>
            <div className="expert-info">
              <div>Michael</div>
              <div className="expert-role">Career Coach</div>
            </div>
          </div>
          <div className="expert-2">
            <div className="expert-avatar">👩‍⚖️</div>
            <div className="expert-info">
              <div>Emma</div>
              <div className="expert-role">Legal Expert</div>
            </div>
          </div>
          <div className="expert-3">
            <div className="expert-avatar">👨‍⚕️</div>
            <div className="expert-info">
              <div>Dr. James</div>
              <div className="expert-role">Health Advisor</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}