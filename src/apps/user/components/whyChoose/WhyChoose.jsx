import React from "react";
import { useTranslation } from "react-i18next";
import {
  FiBriefcase,
  FiCalendar,
  FiClock,
  FiCreditCard,
  FiLayers,
  FiMessageCircle,
  FiUserCheck,
} from "react-icons/fi";
import "./WhyChoose.css";

const features = [
  {
    titleKey: "whyChoose.benefits.verifiedTitle",
    title: "Verified Experts",
    description:
      "Connect with trusted professionals reviewed for reliable guidance.",
    icon: FiUserCheck,
  },
  {
    titleKey: "whyChoose.benefits.chatTitle",
    title: "Instant Chat & Call",
    description:
      "Start secure conversations with available experts in just a few taps.",
    icon: FiMessageCircle,
  },
  {
    titleKey: "whyChoose.benefits.paymentsTitle",
    title: "Secure Payments",
    description:
      "Use transparent wallet payments for consultations and online services.",
    icon: FiCreditCard,
  },
  {
    titleKey: "whyChoose.benefits.servicesTitle",
    title: "Trusted Online Services",
    description:
      "Book professional services and expert solutions from one platform.",
    icon: FiLayers,
  },
  {
    titleKey: "whyChoose.benefits.categoriesTitle",
    title: "20+ Categories",
    description:
      "Explore help across career, legal, health, business, astrology, and more.",
    icon: FiLayers,
  },
  {
    titleKey: "whyChoose.benefits.responseTitle",
    title: "Fast Support",
    description:
      "Get quick responses when you need practical guidance without delays.",
    icon: FiClock,
  },
  {
    titleKey: "whyChoose.benefits.bookingTitle",
    title: "Easy Booking",
    description:
      "Choose the right expert or service and book with a simple flow.",
    icon: FiCalendar,
  },
  {
    titleKey: "whyChoose.benefits.guidanceTitle",
    title: "Professional Guidance",
    description:
      "Make confident decisions with support from experienced professionals.",
    icon: FiBriefcase,
  },
];

const featureItems = [...features, ...features];

const WhyChoose = () => {
  const { t } = useTranslation();

  return (
    <section className="home-section-card why-choose-section">
      <div className="why-choose-section__header">
        <span className="section-kicker">{t("whyChoose.kicker")}</span>
        <h2>{t("whyChoose.title")}</h2>
        <p>{t("whyChoose.subtitle")}</p>
      </div>

      <div className="why-choose-scroll">
        <div className="why-choose-grid">
          {featureItems.map((item, index) => {
            const Icon = item.icon;
            const isClone = index >= features.length;

            return (
              <article
                className={`why-choose-card${isClone ? " why-choose-card--clone" : ""}`}
                key={`${item.titleKey}-${index}`}
                style={{ "--why-delay": `${(index % features.length) * 65}ms` }}
                aria-hidden={isClone ? "true" : undefined}
              >
                <span className="why-choose-card__icon">
                  <Icon aria-hidden="true" />
                </span>
                <h3>{t(item.titleKey, item.title)}</h3>
                <p>{t(`${item.titleKey}Desc`, item.description)}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
