import React from "react";

const reviews = [
  {
    name: "Priya S.",
    role: "Career guidance",
    quote:
      "I needed help with a job switch and resume direction. The expert was easy to find, the conversation felt professional, and the advice was directly useful.",
  },
  {
    name: "Rohit M.",
    role: "Legal advice",
    quote:
      "I had questions before signing a document and wanted clear legal guidance online. The profile details and ratings helped me choose someone I could trust.",
  },
  {
    name: "Ananya K.",
    role: "Parenting advice",
    quote:
      "I was looking for parenting advice and did not want to spend time guessing who to talk to. The platform felt private, fast, and straightforward.",
  },
];

export default function Testimonials() {
  return (
    <section className="section-whatusersay">
      <div className="section-header">
        <div className="section-heading-block">
          <span className="section-kicker">Real user ratings</span>
          <h2>What users say after getting expert advice online</h2>
          <p>
            Lightweight testimonials reinforce trust without sliders, autoplay, or extra client
            complexity.
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
