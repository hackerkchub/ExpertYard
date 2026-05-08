import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FiChevronDown,
  FiCreditCard,
  FiHelpCircle,
  FiMessageCircle,
  FiSearch,
  FiShield,
  FiStar,
  FiUserCheck,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import "./PopularQuestions.css";

const popularQuestions = [
  {
    questionKey: "faq.q1",
    answerKey: "faq.a1",
    icon: FiZap,
  },
  {
    questionKey: "faq.q2",
    answerKey: "faq.a2",
    icon: FiMessageCircle,
  },
  {
    questionKey: "faq.q3",
    answerKey: "faq.a3",
    icon: FiSearch,
  },
  {
    questionKey: "faq.q4",
    answerKey: "faq.a4",
    icon: FiShield,
  },
  {
    questionKey: "faq.q5",
    answerKey: "faq.a5",
    icon: FiCreditCard,
  },
  {
    questionKey: "faq.q6",
    answerKey: "faq.a6",
    icon: FiHelpCircle,
  },
  {
    questionKey: "faq.q7",
    answerKey: "faq.a7",
    icon: FiUserCheck,
  },
  {
    questionKey: "faq.q8",
    answerKey: "faq.a8",
    icon: FiStar,
  },
  {
    questionKey: "faq.q9",
    answerKey: "faq.a9",
    icon: FiCreditCard,
  },
  {
    questionKey: "faq.q10",
    answerKey: "faq.a10",
    icon: FiUsers,
  },
];

const PopularQuestions = ({ onTalkToExpert }) => {
  const { t } = useTranslation();
  const [openQuestion, setOpenQuestion] = useState(0);

  return (
    <section className="home-section-card popular-questions-section">
      <div className="popular-questions-section__header">
        <span className="section-kicker">{t("faq.kicker")}</span>
        <h2>{t("faq.title")}</h2>
        <p>{t("faq.subtitle")}</p>
      </div>

      <div className="popular-questions-grid">
        {popularQuestions.map((item, index) => {
          const Icon = item.icon;
          const isOpen = openQuestion === index;

          return (
            <article
              className={`popular-question-card${isOpen ? " popular-question-card--open" : ""}`}
              key={item.questionKey}
            >
              <button
                type="button"
                className="popular-question-card__button"
                aria-expanded={isOpen}
                onClick={() => setOpenQuestion(isOpen ? -1 : index)}
              >
                <span className="popular-question-card__icon">
                  <Icon aria-hidden="true" />
                </span>
                <span className="popular-question-card__question">{t(item.questionKey)}</span>
                <FiChevronDown className="popular-question-card__chevron" aria-hidden="true" />
              </button>

              <div className="popular-question-card__answer" aria-hidden={!isOpen}>
                <p>{t(item.answerKey)}</p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="popular-questions-cta">
        <p>{t("faq.cta")}</p>
        <button type="button" onClick={onTalkToExpert}>
          <FiMessageCircle aria-hidden="true" />
          {t("common.talkToExpert")}
        </button>
      </div>
    </section>
  );
};

export default PopularQuestions;
