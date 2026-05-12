import React from "react";
import { useTranslation } from "react-i18next";
import { FiCheckCircle, FiStar } from "react-icons/fi";

const TestimonialCard = ({ testimonial }) => {
  const { t } = useTranslation();
  const itemKey = `testimonials.items.${testimonial.key}`;

  return (
    <article className="premium-testimonial-card">
      <div className="premium-testimonial-card__top">
        <div className="premium-testimonial-card__avatar" aria-hidden="true">
          {testimonial.avatar}
        </div>
        <div className="premium-testimonial-card__identity">
          <strong>{t(`${itemKey}.name`)}</strong>
          <span>{t(`${itemKey}.profession`)}</span>
        </div>
      </div>

      <div className="premium-testimonial-card__stars" aria-label={t("testimonials.ratingAria")}>
        {Array.from({ length: 5 }).map((_, index) => (
          <FiStar key={index} aria-hidden="true" />
        ))}
      </div>

      <p>{t(`${itemKey}.review`)}</p>

      <span className="premium-testimonial-card__badge">
        <FiCheckCircle aria-hidden="true" />
        {t("testimonials.verifiedUser")}
      </span>
    </article>
  );
};

export default TestimonialCard;
