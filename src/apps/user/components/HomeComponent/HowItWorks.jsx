import React from "react";

const steps = [
  {
    title: "Find Your Expert",
    desc: "Browse through our verified experts by category or rating."
  },
  {
    title: "Instant Connection",
    desc: "Start a real-time chat session within seconds, no waiting."
  },
  {
    title: "Get Expert Advice",
    desc: "Discuss your queries securely with professional guidance."
  },
  {
    title: "Solve & Grow",
    desc: "Receive actionable solutions and complete your consultation."
  },
];

export default function HowItWorks() {
  return (
    <section className="section-howitworks">
      <div className="header-container">
        <h2>How it works</h2>
        <p className="subtitle">Simple steps to get professional solutions instantly</p>
      </div>
      
      <div className="steps-wrapper">
        <div className="steps-grid">
          {steps.map((step, i) => (
            <div className="step-card" key={i}>
              <div className="step-number-box">
                <span className="step-num">{i + 1}</span>
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