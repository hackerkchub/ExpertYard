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
    value: "1000+",
    label: "Happy Users",
    icon: FiUsers,
  },
  {
    value: "Verified",
    label: "Verified Experts",
    icon: FiUserCheck,
  },
  {
    value: "Secure",
    label: "Chat & Call",
    icon: FiHeadphones,
  },
  {
    value: "20+",
    label: "Categories",
    icon: FiGrid,
  },
  {
    value: "Fast",
    label: "Response",
    icon: FiShield,
  },
  {
    value: "Trusted",
    label: "Online Services",
    icon: FiClock,
    accentIcon: FiZap,
  },
];

const statItems = [...stats, ...stats];

const TrustStats = () => (
  <section className="trust-stats-section">
    <div className="trust-stats-section__header">
      <span className="trust-stats-section__eyebrow">Live Trust Signals</span>
      <h2>Trusted by Thousands of Users</h2>
      <p>Connect instantly with verified experts and trusted online services across multiple categories.</p>
    </div>

    <div className="trust-stats-scroll">
      <div className="trust-stats-grid">
        {statItems.map((item, index) => {
          const Icon = item.icon;
          const AccentIcon = item.accentIcon;
          const isClone = index >= stats.length;

          return (
            <article
              className={`trust-stat-card${isClone ? " trust-stat-card--clone" : ""}`}
              key={`${item.label}-${index}`}
              style={{ "--stat-delay": `${(index % stats.length) * 70}ms` }}
              aria-hidden={isClone ? "true" : undefined}
            >
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
    </div>
  </section>
);

export default TrustStats;
