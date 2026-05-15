import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { testimonials } from "./testimonialsData";
import TestimonialCard from "./TestimonialCard";
import "./TestimonialsSection.css";

const TestimonialsSection = ({ onViewAll }) => {
  const { t } = useTranslation();
  const rowRef = useRef(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const row = rowRef.current;

    if (!row) {
      return undefined;
    }

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    let interval;

    const stopAutoScroll = () => {
      if (interval) {
        window.clearInterval(interval);
        interval = undefined;
      }
    };

    const startAutoScroll = () => {
      stopAutoScroll();

      if (reducedMotionQuery.matches || mobileQuery.matches) {
        return;
      }

      interval = window.setInterval(() => {
        if (pausedRef.current || !row.scrollWidth) return;

        const resetPoint = row.scrollWidth / 2;
        if (row.scrollLeft >= resetPoint) {
          row.scrollLeft = 0;
          return;
        }

        row.scrollLeft += 1;
      }, 28);
    };

    const addQueryListener = (query) => {
      if (query.addEventListener) {
        query.addEventListener("change", startAutoScroll);
      } else {
        query.addListener(startAutoScroll);
      }
    };

    const removeQueryListener = (query) => {
      if (query.removeEventListener) {
        query.removeEventListener("change", startAutoScroll);
      } else {
        query.removeListener(startAutoScroll);
      }
    };

    startAutoScroll();
    addQueryListener(reducedMotionQuery);
    addQueryListener(mobileQuery);

    return () => {
      stopAutoScroll();
      removeQueryListener(reducedMotionQuery);
      removeQueryListener(mobileQuery);
    };
  }, []);

  const displayTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="home-section-card premium-testimonials-section">
      <div className="section-topline premium-testimonials-section__header">
        <div>
          <span className="section-kicker">{t("testimonials.kicker")}</span>
          <h2>{t("testimonials.title")}</h2>
        </div>
        <button type="button" className="section-link" onClick={onViewAll}>
          {t("common.viewAll")}
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
            key={`${testimonial.key}-${index}`}
            testimonial={testimonial}
            isDuplicate={index >= testimonials.length}
          />
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
