import React from "react";
import {
  FiClock,
  FiCreditCard,
  FiLayers,
  FiMessageCircle,
  FiShield,
  FiUserCheck,
} from "react-icons/fi";
import "./WhyChoose.css";

const features = [
  {
    title: "Verified Professionals",
    description: "Connect with trusted and verified experts across multiple categories.",
    icon: FiUserCheck,
  },
  {
    title: "Instant Chat & Call",
    description: "Get real-time guidance through secure chat and voice consultation.",
    icon: FiMessageCircle,
  },
  {
    title: "Secure Wallet System",
    description: "Simple and transparent wallet-based payments for every consultation.",
    icon: FiCreditCard,
  },
  {
    title: "Multiple Services",
    description: "Access online services, consultation, and expert solutions from one platform.",
    icon: FiLayers,
  },
  {
    title: "Fast Response",
    description: "Receive quick support and instant expert availability.",
    icon: FiClock,
  },
  {
    title: "Trusted Experience",
    description: "Designed for users looking for reliable professional guidance online.",
    icon: FiShield,
  },
];

const WhyChoose = () => (
  <section className="home-section-card why-choose-section">
    <div className="why-choose-section__header">
      <span className="section-kicker">Why G9Experts</span>
      <h2>Why Choose G9Experts?</h2>
      <p>Professional guidance, online services, and trusted expert support — all in one platform.</p>
    </div>

    <div className="why-choose-grid">
      {features.map((item) => {
        const Icon = item.icon;

        return (
          <article className="why-choose-card" key={item.title}>
            <span className="why-choose-card__icon">
              <Icon aria-hidden="true" />
            </span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        );
      })}
    </div>
  </section>
);

export default WhyChoose;
