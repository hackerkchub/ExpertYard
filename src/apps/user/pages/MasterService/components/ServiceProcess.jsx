import React from "react";
import { FiCheckCircle, FiUploadCloud, FiUserCheck, FiMessageSquare, FiAward } from "react-icons/fi";

const DEFAULT_STEPS = [
  {
    step: 1,
    title: "Book & Upload",
    desc: "Confirm your order & upload required documents securely.",
    icon: FiUploadCloud
  },
  {
    step: 2,
    title: "Expert Assigned",
    desc: "A verified expert reviews your files and initiates preparation.",
    icon: FiUserCheck
  },
  {
    step: 3,
    title: "Workspace Collaboration",
    desc: "Communicate directly, track updates & share inputs in real-time.",
    icon: FiMessageSquare
  },
  {
    step: 4,
    title: "Final Delivery",
    desc: "Receive your completed service deliverable with SLA guarantee.",
    icon: FiAward
  }
];

export default function ServiceProcess({ workflowSteps }) {
  const hasCustomSteps = Array.isArray(workflowSteps) && workflowSteps.length > 0;

  const stepsToRender = hasCustomSteps
    ? workflowSteps.map((step, idx) => ({
        step: step.step_order || idx + 1,
        title: step.step_label || `Step ${idx + 1}`,
        desc: step.step_description || "Execution phase of the service process.",
        icon: [FiUploadCloud, FiUserCheck, FiMessageSquare, FiAward][idx % 4] || FiCheckCircle
      }))
    : DEFAULT_STEPS;

  return (
    <div className="msp-section-card msp-process-card">
      <h3 className="msp-section-title">
        <FiCheckCircle className="msp-section-title-icon msp-icon-emerald" />
        How It Works — Step-by-Step Fulfillment Process
      </h3>

      {/* DESKTOP HORIZONTAL CONNECTED TIMELINE */}
      <div className="msp-process-timeline-desktop">
        {stepsToRender.map((s, idx) => {
          const IconComp = s.icon;
          const isLast = idx === stepsToRender.length - 1;
          return (
            <React.Fragment key={idx}>
              <div className="msp-process-step-item">
                <div className="msp-step-num-badge">
                  <span>{s.step}</span>
                </div>
                <div className="msp-step-icon-wrapper">
                  <IconComp className="msp-step-icon" />
                </div>
                <h4 className="msp-step-title">{s.title}</h4>
                <p className="msp-step-desc">{s.desc}</p>
              </div>
              {!isLast && <div className="msp-step-connector" />}
            </React.Fragment>
          );
        })}
      </div>

      {/* MOBILE VERTICAL TIMELINE */}
      <div className="msp-process-timeline-mobile">
        {stepsToRender.map((s, idx) => {
          const IconComp = s.icon;
          return (
            <div key={idx} className="msp-mobile-step-row">
              <div className="msp-mobile-step-left">
                <div className="msp-mobile-step-badge">{s.step}</div>
                {idx < stepsToRender.length - 1 && <div className="msp-mobile-step-line" />}
              </div>
              <div className="msp-mobile-step-content">
                <div className="msp-mobile-step-header">
                  <IconComp className="msp-mobile-step-icon" />
                  <h4 className="msp-mobile-step-title">{s.title}</h4>
                </div>
                <p className="msp-mobile-step-desc">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
