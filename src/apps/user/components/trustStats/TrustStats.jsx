import React from "react";
import {
  FiClock,
  FiGrid,
  FiHeadphones,
  FiShield,
  FiUserCheck,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import "./TrustStats.css";

const stats = [
  {
    value: "20,000+",
    label: "Users",
    icon: FiUsers,
  },
  {
    value: "5,000+",
    label: "Verified Experts",
    icon: FiUserCheck,
  },
  {
    value: "24/7",
    label: "Instant Support",
    icon: FiHeadphones,
  },
  {
    value: "50+",
    label: "Categories",
    icon: FiGrid,
  },
  {
    value: "Secure",
    label: "Payments",
    icon: FiShield,
  },
  {
    value: "Real-Time",
    label: "Consultation",
    icon: FiClock,
    accentIcon: FiZap,
  },
];

const TrustStats = () => (
  <section className="trust-stats-section">
    <div className="trust-stats-section__header">
      <span className="trust-stats-section__eyebrow">Live Trust Signals</span>
      <h2>Trusted by Thousands of Users</h2>
      <p>Connect instantly with verified experts and trusted online services across multiple categories.</p>
    </div>

    <div className="trust-stats-grid">
      {stats.map((item, index) => {
        const Icon = item.icon;
        const AccentIcon = item.accentIcon;

        return (
          <article className="trust-stat-card" key={item.label} style={{ "--stat-delay": `${index * 70}ms` }}>
            <span className="trust-stat-card__icon">
              <Icon aria-hidden="true" />
              {AccentIcon && <AccentIcon className="trust-stat-card__accent" aria-hidden="true" />}
            </span>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        );
      })}
    </div>
  </section>
);

export default TrustStats;
