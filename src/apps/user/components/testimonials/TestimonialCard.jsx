import React from "react";
import { FiCheckCircle, FiStar } from "react-icons/fi";

const TestimonialCard = ({ testimonial }) => (
  <article className="premium-testimonial-card">
    <div className="premium-testimonial-card__top">
      <div className="premium-testimonial-card__avatar" aria-hidden="true">
        {testimonial.avatar}
      </div>
      <div className="premium-testimonial-card__identity">
        <strong>{testimonial.name}</strong>
        <span>{testimonial.profession}</span>
      </div>
    </div>

    <div className="premium-testimonial-card__stars" aria-label="5 out of 5 star rating">
      {Array.from({ length: 5 }).map((_, index) => (
        <FiStar key={index} aria-hidden="true" />
      ))}
    </div>

    <p>{testimonial.review}</p>

    <span className="premium-testimonial-card__badge">
      <FiCheckCircle aria-hidden="true" />
      Verified User
    </span>
  </article>
);

export default TestimonialCard;
