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
  const [activeStepIndex, setActiveStepIndex] = React.useState(0);
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 className="msp-section-title" style={{ margin: 0 }}>
          <FiCheckCircle className="msp-section-title-icon msp-icon-emerald" />
          How It Works — Step-by-Step Fulfillment Process
        </h3>
        {stepsToRender.length > 4 && (
          <span className="msp-process-scroll-hint" style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", background: "#eff6ff", padding: "3px 8px", borderRadius: 999, border: "1px solid #bfdbfe" }}>
            Scroll steps →
          </span>
        )}
      </div>

      {/* DESKTOP HORIZONTAL CONNECTED TIMELINE */}
      <div className="msp-process-timeline-desktop">
        {stepsToRender.map((s, idx) => {
          const IconComp = s.icon;
          const isLast = idx === stepsToRender.length - 1;
          const isActive = idx === activeStepIndex;
          const isDone = idx < activeStepIndex;
          const statusClass = isActive ? "msp-step-active" : isDone ? "msp-step-done" : "";

          return (
            <React.Fragment key={idx}>
              <div
                className={`msp-process-step-item ${statusClass}`}
                onClick={() => setActiveStepIndex(idx)}
                role="button"
                tabIndex={0}
              >
                <div className="msp-step-num-badge">
                  <span>{s.step}</span>
                </div>
                <div className="msp-step-icon-wrapper">
                  <IconComp className="msp-step-icon" />
                </div>
                <h4 className="msp-step-title">{s.title}</h4>
                <p className="msp-step-desc">{s.desc}</p>
              </div>
              {!isLast && <div className={`msp-step-connector ${isDone ? "msp-step-connector-done" : ""}`} />}
            </React.Fragment>
          );
        })}
      </div>

      {/* MOBILE VERTICAL TIMELINE */}
      <div className="msp-process-timeline-mobile">
        {stepsToRender.map((s, idx) => {
          const IconComp = s.icon;
          const isActive = idx === activeStepIndex;
          return (
            <div
              key={idx}
              className={`msp-mobile-step-row ${isActive ? "msp-step-active" : ""}`}
              onClick={() => setActiveStepIndex(idx)}
            >
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
