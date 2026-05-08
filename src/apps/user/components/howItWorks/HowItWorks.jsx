import React from "react";
import { useTranslation } from "react-i18next";
import { FiCheckCircle, FiCreditCard, FiSearch, FiZap } from "react-icons/fi";
import "./HowItWorks.css";

const steps = [
  {
    titleKey: "howItWorks.steps.searchTitle",
    descriptionKey: "howItWorks.steps.searchDesc",
    icon: FiSearch,
  },
  {
    titleKey: "howItWorks.steps.connectTitle",
    descriptionKey: "howItWorks.steps.connectDesc",
    icon: FiZap,
  },
  {
    titleKey: "howItWorks.steps.solutionTitle",
    descriptionKey: "howItWorks.steps.solutionDesc",
    icon: FiCheckCircle,
  },
  {
    titleKey: "howItWorks.steps.payTitle",
    descriptionKey: "howItWorks.steps.payDesc",
    icon: FiCreditCard,
  },
];

const HowItWorks = () => {
  const { t } = useTranslation();

  return (
    <section className="home-section-card how-it-works-section">
      <div className="how-it-works-section__header">
        <span className="section-kicker">{t("howItWorks.kicker")}</span>
        <h2>{t("howItWorks.title")}</h2>
        <p>{t("howItWorks.subtitle")}</p>
      </div>

      <div className="how-it-works-grid">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <article className="how-it-works-card" key={step.titleKey}>
              <div className="how-it-works-card__top">
                <span className="how-it-works-card__icon">
                  <Icon aria-hidden="true" />
                </span>
                <span className="how-it-works-card__number">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3>{t(step.titleKey)}</h3>
              <p>{t(step.descriptionKey)}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default HowItWorks;
