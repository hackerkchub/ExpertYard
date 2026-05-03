import React from "react";
import { Link } from "react-router-dom";
import heroExpertImage from "../../../../assets/hero.webp";

export default function Hero() {
  const headingWords = [
    { text: "Talk" },
    { text: "to" },
    { text: "verified", accent: true },
    { text: "experts", accent: true },
    { text: "for" },
    { text: "practical" },
    { text: "everyday" },
    { text: "guidance" },
  ];

  const popularSearches = [
    { label: "Legal Advice", icon: "\u2696\uFE0F" },
    { label: "Doctor Guidance", icon: "\uD83E\uDE7A" },
    { label: "Career Help", icon: "\uD83D\uDCBC" },
    { label: "Parenting", icon: "\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67" },
    { label: "Finance", icon: "\uD83D\uDCB3" },
  ];

  const featureCards = [
    {
      title: "Chat with Expert",
      icon: "\uD83D\uDCAC",
      tone: "chat",
      url: "/user/call-chat?page=1&mode=chat",
    },
    {
      title: "Talk to Expert",
      icon: "\u260E\uFE0F",
      tone: "talk",
      url: "/user/call-chat?page=1&mode=call",
    },
    {
      title: "Expert Services",
      icon: "\u2728",
      tone: "services",
      url: "/user/all-services",
    },
  ];

  return (
    <section className="hero-home">
      <div className="container hero-home__shell">
        <div className="hero-home__banner">
          <div
            className="hero-home__media hero-home__media-animate"
            aria-label="Expert illustration"
          >
            <img
              src={heroExpertImage}
              alt="Expert support illustration"
              className="hero-home__image"
            />
          </div>

          <div className="hero-home__content">
            <div className="hero-home__badge hero-home__content-step-1">
              <span className="hero-home__badge-icon" aria-hidden="true">
                {"\u2713"}
              </span>
              Trusted by users looking for verified expert advice online
            </div>

            <h1 className="hero-home__title hero-title hero-home__content-step-2">
              {headingWords.map((word, index) => (
                <React.Fragment key={word.text}>
                  <span
                    className={word.accent ? "hero-home__title-accent" : undefined}
                    style={{ "--i": index + 1 }}
                  >
                    {word.text}
                  </span>
                  {index < headingWords.length - 1 ? " " : null}
                </React.Fragment>
              ))}
            </h1>

            <p className="hero-home__description hero-home__content-step-3">
              Connect with professionals across legal, career, parenting, health,
              finance, and relationship topics through private conversations and
              clear consultation flows.
            </p>

            <div className="hero-home__actions hero-home__content-step-4">
              <Link className="hero-home__cta" to="/user/categories">
                <span className="hero-home__cta-icon" aria-hidden="true">
                  {"\uD83D\uDCAC"}
                </span>
                Talk to a Verified Expert
              </Link>
            </div>

            <div
              className="hero-home__tags hero-home__content-step-5"
              aria-label="Popular search"
            >
              <span className="hero-home__tags-label">Popular searches:</span>
              {popularSearches.map((item) => (
                <Link key={item.label} className="hero-home__tag" to="/user/categories">
                  <span aria-hidden="true">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-home__features" aria-label="Expert services">
          {featureCards.map((item, index) => (
            <Link
              key={item.title}
              to={item.url}
              className={`hero-home__feature hero-home__feature-${index + 1}`}
            >
              <span
                className={`hero-home__feature-icon hero-home__feature-icon--${item.tone}`}
                aria-hidden="true"
              >
                {item.icon}
              </span>
              <span className="hero-home__feature-label">{item.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}