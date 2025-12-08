import styled, { keyframes } from "styled-components";

/* --------------------------------------------------
   0. Small Effects
-------------------------------------------------- */

/* Liquid slide animation for progress */
const progressSlide = keyframes`
  0% { width: 0; opacity: 0; }
  100% { width: 100%; opacity: 1; }
`;

/* Soft background floating animation */
const softFloat = keyframes`
  0%,100% { transform: translateY(0px) }
  50% { transform: translateY(-2px) }
`;

/* Soft shine on card edges */
const softShine = keyframes`
  0%   { opacity: 0; transform: translateX(-50%) }
  35%  { opacity: 0.3; transform: translateX(20%) }
  100% { opacity: 0; transform: translateX(200%) }
`;

/* --------------------------------------------------
   1. Background — Light Tech Gradient + Organic Texture
-------------------------------------------------- */
export const RegisterPageWrap = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 96px 16px 40px;

  background:
    radial-gradient(circle at 22% 18%, rgba(227,244,255,0.85), rgba(247,249,252,1) 55%, rgba(238,242,255,1)),
    url("data:image/svg+xml,%3Csvg opacity='0.025' xmlns='http://www.w3.org/2000/svg' width='180' height='90' viewBox='0 0 180 90'%3E%3Crect width='100' height='100' fill='%23000'/%3E%3C/svg%3E");
  background-size: cover;
`;

/* --------------------------------------------------
   2. Frosted Card — Vision Pro style Glass
-------------------------------------------------- */
export const RegisterCard = styled.div`
  width: 100%;
  max-width: 720px;
  border-radius: 22px;
  padding: 38px 40px 34px;
  position: relative;
  overflow: hidden;

  background: linear-gradient(
    120deg,
    rgba(255,255,255,0.55),
    rgba(255,255,255,0.78),
    rgba(255,255,255,0.65)
  );
  backdrop-filter: saturate(180%) blur(24px);

  border: 1px solid rgba(255,255,255,0.42);
  box-shadow:
    0 2px 10px rgba(15,23,42,0.05),
    0 28px 70px -18px rgba(15,23,42,0.10);

  @media (max-width: 640px) {
    padding: 28px 22px 26px;
  }

  /* top light line */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 12%;
    left: 12%;
    height: 1.5px;
    background: linear-gradient(90deg, transparent, rgba(14,165,233,0.35), transparent);
  }

  /* diagonal shine sweep */
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: -60%;
    width: 60%;
    height: 100%;
    background: linear-gradient(
      120deg,
      transparent,
      rgba(255,255,255,0.35),
      transparent
    );
    animation: ${softShine} 4s infinite;
    pointer-events: none;
  }
`;

/* --------------------------------------------------
   3. Header Text
-------------------------------------------------- */
export const StepHeader = styled.div`
  margin-bottom: 26px;
`;

export const StepTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #0f172a;
  margin: 0 0 10px;
`;

export const StepSubtitle = styled.p`
  font-size: 15px;
  font-weight: 400;
  color: #6b7280;
  margin: 0;
`;

/* --------------------------------------------------
   4. Progress Bar — Premium Motion
-------------------------------------------------- */
export const ProgressWrap = styled.div`
  margin-bottom: 28px;
`;

export const ProgressRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const ProgressLabel = styled.span`
  font-size: 13px;
  color: #5e6a7b;
  font-weight: 500;
`;

export const ProgressSteps = styled.span`
  font-size: 12px;
  color: #9ca3af;
`;

export const ProgressBarOuter = styled.div`
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: rgba(180,192,210,0.25);
  overflow: hidden;
`;

export const ProgressBarInner = styled.div`
  height: 100%;
  border-radius: 999px;
  width: ${({ percent }) => `${percent}%`};
  background: linear-gradient(90deg, #0ea5ff 0%, #38bdf8 85%);
  animation: ${progressSlide} 0.4s cubic-bezier(.19,1,.22,1);
`;

/* --------------------------------------------------
   5. Form Layout
-------------------------------------------------- */
export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2,minmax(0,1fr));
  gap: 20px 26px;
  margin-top: 12px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;
export const FullRow = styled.div`
  grid-column: 1 / -1;
`;

/* --------------------------------------------------
   6. Form Inputs — Neon Border + Soft Glow
-------------------------------------------------- */
export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #111827;
`;

export const Input = styled.input`
  border-radius: 14px;
  border: 1px solid rgba(148,163,184,0.45);
  padding: 12px 14px;
  font-size: 15px;
  color: #111827;
  background: rgba(255,255,255,0.85);
  transition: .22s ease;

  &:hover {
    border-color: rgba(14,165,233,0.5);
  }

  &:focus {
    border-color: #0ea5ff;
    background: #ffffff;
    box-shadow:
      0 0 0 2px rgba(14,165,233,0.28),
      0 0 18px rgba(14,165,233,0.15);
    outline: none;
  }
`;

export const FileInput = styled.input.attrs({ type: "file" })`
  font-size: 13px;
  background: rgba(255,255,255,0.85);
  border: 1px solid rgba(148,163,184,0.45);
  border-radius: 12px;
  padding: 10px;
  color: #111827;
  cursor: pointer;
  transition: .18s ease;

  &::-webkit-file-upload-button {
    padding: 8px 14px;
    border: none;
    border-radius: 8px;
    background: linear-gradient(90deg,#0ea5ff,#38bdf8);
    color: white;
    font-weight: 600;
    cursor: pointer;
  }

  &:hover {
    border-color: rgba(14,165,233,0.6);
  }
`;


export const TextArea = styled.textarea`
  border-radius: 14px;
  border: 1px solid rgba(148,163,184,0.45);
  padding: 12px 14px;
  font-size: 15px;
  color: #111827;
  background: rgba(255,255,255,0.85);
  min-height: 110px;
  resize: vertical;
  transition: .22s ease;

  &:focus {
    border-color: #0ea5ff;
    background: #ffffff;
    box-shadow:
      0 0 0 2px rgba(14,165,233,0.28),
      0 0 18px rgba(14,165,233,0.15);
    outline: none;
  }
`;

/* --------------------------------------------------
   7. Buttons — Floating CTA
-------------------------------------------------- */
export const ActionsRow = styled.div`
  margin-top: 32px;
  display: flex;
  justify-content: space-between;
  gap: 18px;

  @media (max-width: 640px) {
    flex-direction: column-reverse;
  }
`;

export const PrimaryButton = styled.button`
  padding: 11px 26px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 600;
  border: none;
  color: #fff;
  cursor: pointer;
  background: linear-gradient(90deg,#0ea5ff,#38bdf8);
  opacity: ${({ disabled }) => (disabled ? 0.42 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
  transition: .25s cubic-bezier(.19,1,.22,1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    transform: translateY(-3px);
    box-shadow:
      0 18px 36px rgba(56,189,248,0.3),
      0 4px 10px rgba(15,23,42,0.08);
  }

  &:active {
    transform: translateY(-1px);
  }
`;

export const SecondaryButton = styled.button`
  padding: 11px 20px;
  font-size: 14px;
  border-radius: 999px;
  font-weight: 500;
  border: 1px solid rgba(148,163,184,0.65);
  background: rgba(255,255,255,0.45);
  color: #4b5563;
  cursor: pointer;
  transition: .18s ease;

  &:hover {
    background: rgba(148,163,184,0.12);
    border-color: rgba(148,163,184,0.8);
  }
`;

/* --------------------------------------------------
   8. Category Cards — Luxury Selection
-------------------------------------------------- */
export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3,minmax(0,1fr));
  gap: 20px;

  @media(max-width:768px){
    grid-template-columns: repeat(2,minmax(0,1fr));
  }
  @media(max-width:480px){
    grid-template-columns:1fr;
  }
`;

export const SelectCard = styled.button`
  border-radius: 18px;
  border: 1px solid ${({ active }) => 
    active ? "rgba(14,165,233,0.75)" : "rgba(148,163,184,0.38)"};
  background: ${({ active }) =>
    active ? "rgba(224,242,254,0.9)" : "rgba(255,255,255,0.88)"};
  padding: 18px;
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: 8px;
  cursor: pointer;
  transition: .28s cubic-bezier(.19,1,.22,1);
  backdrop-filter: blur(12px);
  box-shadow: ${({ active }) =>
    active
      ? "0 14px 32px rgba(56,189,248,0.28)"
      : "0 6px 16px rgba(15,23,42,0.06)"};

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 18px 40px rgba(15,23,42,0.08);
  }
`;

export const CardTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
`;
export const CardMeta = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

export const Chip = styled.span`
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(14,165,233,0.1);
  color: #0369a1;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
`;

/* --------------------------------------------------
   9. Price Inline Input
-------------------------------------------------- */
export const PriceInputRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 15px;

  span {
    color: #525f6f;
  }
`;
