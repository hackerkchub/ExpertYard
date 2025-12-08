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

        <StepHeader>
          <StepTitle>{title}</StepTitle>
          <StepSubtitle>{subtitle}</StepSubtitle>
        </StepHeader>

        {children}
      </RegisterCard>
    </RegisterPageWrap>
  );
}
