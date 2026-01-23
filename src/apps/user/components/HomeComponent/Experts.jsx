import React, { useRef } from 'react';

const experts = [
  { name: "Dr. Sarah Chen", role: "Financial Advisor" },
  { name: "Michael Roberts", role: "Career Coach" },
  { name: "Lisa Patel", role: "Wellness Expert" },
  { name: "David Kim", role: "Legal Consultant" },
  { name: "Emma Wilson", role: "Health Specialist" },
  { name: "James Taylor", role: "Tech Expert" },
];

export default function Experts() {
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="section-expert">
      <div className="section-header">
        <h2>Popular Experts</h2>
        <div className="scroll-controls">
          <button className="scroll-btn left-btn" onClick={scrollLeft} aria-label="Scroll left">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="scroll-btn right-btn" onClick={scrollRight} aria-label="Scroll right">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="expert-container">
        <div className="expert-row" ref={scrollContainerRef}>
          {experts.map((ex, index) => (
            <div className="expert-card" key={`${ex.name}-${index}`}>
              <div className="avatar">👤</div>
              <h4>{ex.name}</h4>
              <p>{ex.role}</p>
              <div className="rating">★★★★★</div>
              <p className="price">$2.99 / min</p>
              <button className="btn-primary small">Chat Now</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}