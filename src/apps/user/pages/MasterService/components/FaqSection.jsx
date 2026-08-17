import React from "react";
import { FiChevronDown, FiChevronUp, FiHelpCircle } from "react-icons/fi";

export default function FaqSection({ defaultFaqs, openFaqIndex, setOpenFaqIndex }) {
  return (
    <section className="msp-section-card msp-faq-card">
      <h3 className="msp-section-title">
        <FiHelpCircle className="msp-section-title-icon msp-icon-blue" />
        Frequently Asked Questions
      </h3>

      <div className="msp-faq-list">
        {defaultFaqs.map((faq, idx) => {
          const isOpen = openFaqIndex === idx;
          return (
            <div
              key={idx}
              className={`msp-faq-item ${isOpen ? "msp-faq-item-open" : ""}`}
            >
              <button
                type="button"
                className="msp-faq-trigger"
                onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                aria-expanded={isOpen}
              >
                <span className="msp-faq-question">{faq.q}</span>
                <span className="msp-faq-chevron font-bold">
                  {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                </span>
              </button>

              {isOpen && (
                <div className="msp-faq-answer">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
