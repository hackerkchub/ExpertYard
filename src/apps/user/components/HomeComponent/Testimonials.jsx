import React from "react";

const reviews = [
  {
    name: "Aarav",
    role: "Career consultation",
    quote:
      "I found a verified expert quickly, understood the pricing up front, and got useful guidance in one session.",
  },
  {
    name: "Neha",
    role: "Legal support",
    quote:
      "The profile details and user ratings helped me choose with confidence. The process felt private and professional.",
  },
  {
    name: "Rahul",
    role: "Finance advice",
    quote:
      "Fast response time, clean experience, and no unnecessary steps before connecting to the right person.",
  },
];

export default function Testimonials() {
  return (
    <section className="section-whatusersay">
      <div className="section-header">
        <div className="section-heading-block">
          <span className="section-kicker">Real user ratings</span>
          <h2>What users say after connecting on ExpertYard</h2>
          <p>
            Static testimonials keep the section fast while still reinforcing trust, clarity,
            and service quality.
          </p>
        </div>
      </div>

      <div className="testimonial-grid">
        {reviews.map((review) => (
          <div className="testimonial-card" key={review.name}>
            <div className="testimonial-rating">4.9/5 user-rated</div>
            <p>{review.quote}</p>
            <div className="testimonial-meta">
              <strong>{review.name}</strong>
              <span>{review.role}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
