import React from "react";
import {
  RegisterPageWrap,
  RegisterCard,
  StepHeader,
  StepTitle,
  StepSubtitle,
  ProgressWrap,
  ProgressRow,
  ProgressLabel,
  ProgressSteps,
  ProgressBarOuter,
  ProgressBarInner,
} from "../styles/Register.styles";

export default function RegisterLayout({ title, subtitle, step, tabs, children }) {
  const totalSteps = 5;
  const percent = step ? (step / totalSteps) * 100 : 0;

  return (
    <RegisterPageWrap>
      <RegisterCard>

        {/* Tabs */}
        {tabs && (
          <div style={{
            display:"flex",
            gap:20,
            marginBottom:16,
          }}>
            {tabs.map(t=>(
              <div
                key={t.label}
                onClick={t.onClick}
                style={{
                  fontWeight:t.active?600:500,
                  fontSize:15,
                  color:t.active?"#0ea5ff":"#6b7280",
                  cursor:"pointer",
                  borderBottom:t.active?"2px solid #0ea5ff":"2px solid transparent",
                  paddingBottom:6,
                  transition:".2s",
                }}
              >
                {t.label}
              </div>
            ))}
          </div>
        )}

        {/* Step Progress Indicator */}
        {step && step >= 1 && step <= 5 && (
          <ProgressWrap>
            <ProgressRow>
              <ProgressLabel>
                {step === 1 && "Account Info"}
                {step === 2 && "Expertise Category"}
                {step === 3 && "Specialization"}
                {step === 4 && "Profile Details"}
                {step === 5 && "Pricing Rates"}
              </ProgressLabel>
              <ProgressSteps>Step {step} of {totalSteps}</ProgressSteps>
            </ProgressRow>
            <ProgressBarOuter>
              <ProgressBarInner percent={percent} />
            </ProgressBarOuter>
          </ProgressWrap>
        )}

        <StepHeader>
          <StepTitle>{title}</StepTitle>
          <StepSubtitle>{subtitle}</StepSubtitle>
        </StepHeader>

        {children}
      </RegisterCard>
    </RegisterPageWrap>
  );
}
