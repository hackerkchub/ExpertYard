import React, { useState } from "react";
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
    question: "Can I talk to a verified expert instantly?",
    answer: "Yes. You can choose chat or call and connect with available verified experts in just a few taps.",
    icon: FiZap,
  },
  {
    question: "How does per-minute chat or call consultation work?",
    answer: "Your wallet is charged based on the expert's per-minute rate while the consultation is active.",
    icon: FiMessageCircle,
  },
  {
    question: "Can I choose an expert by category?",
    answer: "Yes. Browse categories like legal, health, career, astrology, finance, business, and more.",
    icon: FiSearch,
  },
  {
    question: "Is my chat with the expert private and secure?",
    answer: "Consultations are designed for private one-to-one guidance between you and the selected expert.",
    icon: FiShield,
  },
  {
    question: "How do I recharge my wallet before consultation?",
    answer: "Open your wallet, add balance, and start a chat or call once your balance is ready.",
    icon: FiCreditCard,
  },
  {
    question: "Can I get career, legal, health, astrology, or business advice?",
    answer: "Yes. G9 Experts supports multiple professional categories for instant guidance.",
    icon: FiHelpCircle,
  },
  {
    question: "How are experts verified on G9 Experts?",
    answer: "Expert profiles include trust signals, category details, and review information to help users decide.",
    icon: FiUserCheck,
  },
  {
    question: "Can I see expert ratings and reviews before connecting?",
    answer: "Yes. Ratings, reviews, and profile details help you compare experts before starting.",
    icon: FiStar,
  },
  {
    question: "What happens if my wallet balance is low?",
    answer: "You can recharge your wallet before or during the consultation flow to continue smoothly.",
    icon: FiCreditCard,
  },
  {
    question: "Can I follow an expert for future consultation?",
    answer: "Yes. Following an expert makes it easier to find them again for future guidance.",
    icon: FiUsers,
  },
];

const PopularQuestions = ({ onTalkToExpert }) => {
  const [openQuestion, setOpenQuestion] = useState(0);

  return (
    <section className="home-section-card popular-questions-section">
      <div className="popular-questions-section__header">
        <span className="section-kicker">Popular Questions</span>
        <h2>Popular Questions</h2>
        <p>Everything you need to know before connecting with verified experts.</p>
      </div>

      <div className="popular-questions-grid">
        {popularQuestions.map((item, index) => {
          const Icon = item.icon;
          const isOpen = openQuestion === index;

          return (
            <article
              className={`popular-question-card${isOpen ? " popular-question-card--open" : ""}`}
              key={item.question}
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
                <span className="popular-question-card__question">{item.question}</span>
                <FiChevronDown className="popular-question-card__chevron" aria-hidden="true" />
              </button>

              <div className="popular-question-card__answer" aria-hidden={!isOpen}>
                <p>{item.answer}</p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="popular-questions-cta">
        <p>Still have questions? Start chatting with an expert now.</p>
        <button type="button" onClick={onTalkToExpert}>
          <FiMessageCircle aria-hidden="true" />
          Talk to Expert
        </button>
      </div>
    </section>
  );
};

export default PopularQuestions;
