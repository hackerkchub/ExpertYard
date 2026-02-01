import React, { useRef } from 'react';

const reviews = [
  "Great advice, very helpful!",
  "The best consultation I've had!",
  "Quick and insightful responses!",
  "Very professional and knowledgeable!",
  "Solved my issue in minutes!",
];

export default function Testimonials() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const cardWidth = window.innerWidth <= 640 ? 280 : 360;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -cardWidth : cardWidth,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="section-whatusersay">
      <div className="section-header">
        <h2>What Our Users Say</h2>
        <div className="scroll-buttons">
          <button className="scroll-btn" onClick={() => scroll('left')} aria-label="Scroll left">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="scroll-btn" onClick={() => scroll('right')} aria-label="Scroll right">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="testimonial-row" ref={scrollRef}>
        {reviews.map((text, i) => (
          <div className="testimonial-card" key={i}>
            <div className="avatar">🙂</div>
            <div className="rating">★★★★★</div>
            <p>{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}