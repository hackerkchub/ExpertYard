import React from "react";
import { useTranslation } from "react-i18next";
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
    valueKey: "trustStats.stats.happyUsersValue",
    labelKey: "trustStats.stats.happyUsersLabel",
    icon: FiUsers,
  },
  {
    valueKey: "trustStats.stats.verifiedValue",
    labelKey: "trustStats.stats.verifiedLabel",
    icon: FiUserCheck,
  },
  {
    valueKey: "trustStats.stats.secureValue",
    labelKey: "trustStats.stats.secureLabel",
    icon: FiHeadphones,
  },
  {
    valueKey: "trustStats.stats.categoriesValue",
    labelKey: "trustStats.stats.categoriesLabel",
    icon: FiGrid,
  },
  {
    valueKey: "trustStats.stats.responseValue",
    labelKey: "trustStats.stats.responseLabel",
    icon: FiShield,
  },
  {
    valueKey: "trustStats.stats.servicesValue",
    labelKey: "trustStats.stats.servicesLabel",
    icon: FiClock,
    accentIcon: FiZap,
  },
];

const statItems = [...stats, ...stats];

const TrustStats = () => {
  const { t } = useTranslation();

  return (
    <section className="trust-stats-section">
      <div className="trust-stats-section__header">
        <span className="trust-stats-section__eyebrow">{t("trustStats.kicker")}</span>
        <h2>{t("trustStats.title")}</h2>
        <p>{t("trustStats.subtitle")}</p>
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
                key={`${item.labelKey}-${index}`}
                style={{ "--stat-delay": `${(index % stats.length) * 70}ms` }}
                aria-hidden={isClone ? "true" : undefined}
              >
                <span className="trust-stat-card__icon">
                  <Icon aria-hidden="true" />
                  {AccentIcon && <AccentIcon className="trust-stat-card__accent" aria-hidden="true" />}
                </span>
                <strong>{t(item.valueKey)}</strong>
                <span>{t(item.labelKey)}</span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustStats;
