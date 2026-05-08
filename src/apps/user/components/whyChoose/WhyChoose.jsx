import React from "react";
import { useTranslation } from "react-i18next";
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
    titleKey: "whyChoose.verifiedTitle",
    descriptionKey: "whyChoose.verifiedDesc",
    icon: FiUserCheck,
  },
  {
    titleKey: "whyChoose.chatTitle",
    descriptionKey: "whyChoose.chatDesc",
    icon: FiMessageCircle,
  },
  {
    titleKey: "whyChoose.walletTitle",
    descriptionKey: "whyChoose.walletDesc",
    icon: FiCreditCard,
  },
  {
    titleKey: "whyChoose.servicesTitle",
    descriptionKey: "whyChoose.servicesDesc",
    icon: FiLayers,
  },
  {
    titleKey: "whyChoose.responseTitle",
    descriptionKey: "whyChoose.responseDesc",
    icon: FiClock,
  },
  {
    titleKey: "whyChoose.trustedTitle",
    descriptionKey: "whyChoose.trustedDesc",
    icon: FiShield,
  },
];

const WhyChoose = () => {
  const { t } = useTranslation();

  return (
    <section className="home-section-card why-choose-section">
      <div className="why-choose-section__header">
        <span className="section-kicker">{t("whyChoose.kicker")}</span>
        <h2>{t("whyChoose.title")}</h2>
        <p>{t("whyChoose.subtitle")}</p>
      </div>

      <div className="why-choose-grid">
        {features.map((item) => {
          const Icon = item.icon;

          return (
            <article className="why-choose-card" key={item.titleKey}>
              <span className="why-choose-card__icon">
                <Icon aria-hidden="true" />
              </span>
              <h3>{t(item.titleKey)}</h3>
              <p>{t(item.descriptionKey)}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default WhyChoose;
