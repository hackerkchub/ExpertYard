import React, { useEffect, useRef } from "react";
import { testimonials } from "./testimonialsData";
import TestimonialCard from "./TestimonialCard";
import "./TestimonialsSection.css";

const TestimonialsSection = ({ onViewAll }) => {
  const rowRef = useRef(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const row = rowRef.current;

    if (!row || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      if (pausedRef.current || !row.scrollWidth) return;

      const resetPoint = row.scrollWidth / 2;
      if (row.scrollLeft >= resetPoint) {
        row.scrollLeft = 0;
        return;
      }

      row.scrollLeft += 1;
    }, 28);

    return () => window.clearInterval(interval);
  }, []);

  const displayTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="home-section-card premium-testimonials-section">
      <div className="section-topline premium-testimonials-section__header">
        <div>
          <span className="section-kicker">Testimonials</span>
          <h2>What Users Say</h2>
          <p>Thousands of users trust G9 Experts for instant professional guidance.</p>
        </div>
        <button type="button" className="section-link" onClick={onViewAll}>
          View All
        </button>
      </div>

      <div className="premium-testimonials-section__glow" aria-hidden="true" />
      <div
        className="premium-testimonials-row"
        ref={rowRef}
        onMouseEnter={() => {
          pausedRef.current = true;
        }}
        onMouseLeave={() => {
          pausedRef.current = false;
        }}
        onTouchStart={() => {
          pausedRef.current = true;
        }}
        onTouchEnd={() => {
          pausedRef.current = false;
        }}
      >
        {displayTestimonials.map((testimonial, index) => (
          <TestimonialCard
            key={`${testimonial.name}-${index}`}
            testimonial={testimonial}
          />
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
