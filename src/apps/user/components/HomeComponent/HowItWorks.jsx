import React from "react";

const steps = [
  {
    title: "Choose a category or expert",
    desc: "Browse verified profiles across legal, health, career, relationship, parenting, and other real-life needs.",
  },
  {
    title: "Start chat or call",
    desc: "Pick the expert that fits your need, review trust signals, and begin a private online consultation.",
  },
  {
    title: "Get guidance quickly",
    desc: "Receive practical advice for day-to-day decisions without a long signup flow or unnecessary steps.",
  },
];

export default function HowItWorks() {
  return (
    <section className="section-howitworks">
      <div className="header-container">
        <h2>How it works</h2>
        <p className="subtitle">
          A simple three-step flow to help users find trusted guidance quickly
        </p>
      </div>

      <div className="steps-wrapper">
        <div className="steps-grid">
          {steps.map((step, index) => (
            <div className="step-card" key={step.title}>
              <div className="step-number-box">
                <span className="step-num">{index + 1}</span>
              </div>
              <div className="step-content">
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
