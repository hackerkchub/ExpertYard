import React from "react";
import { FiCheckCircle, FiCreditCard, FiSearch, FiZap } from "react-icons/fi";
import "./HowItWorks.css";

const steps = [
  {
    title: "Search Your Need",
    description: "Choose a category or search for the service/expert you need.",
    icon: FiSearch,
  },
  {
    title: "Connect Instantly",
    description: "Start secure chat or call with verified professionals.",
    icon: FiZap,
  },
  {
    title: "Get Real Solution",
    description: "Receive expert guidance or book online services with confidence.",
    icon: FiCheckCircle,
  },
  {
    title: "Pay Securely",
    description: "Use wallet-based payment and pay only for the time or service you use.",
    icon: FiCreditCard,
  },
];

const HowItWorks = () => (
  <section className="home-section-card how-it-works-section">
    <div className="how-it-works-section__header">
      <span className="section-kicker">Simple Process</span>
      <h2>How It Works</h2>
      <p>Get expert guidance and online services in just a few simple steps.</p>
    </div>

    <div className="how-it-works-grid">
      {steps.map((step, index) => {
        const Icon = step.icon;

        return (
          <article className="how-it-works-card" key={step.title}>
            <div className="how-it-works-card__top">
              <span className="how-it-works-card__icon">
                <Icon aria-hidden="true" />
              </span>
              <span className="how-it-works-card__number">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </article>
        );
      })}
    </div>
  </section>
);

export default HowItWorks;
