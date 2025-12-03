import styled from "styled-components";

/* PAGE SHELL */

export const PageWrap = styled.div`
  min-height: calc(100vh - 76px);
  width: 100%;
  background: radial-gradient(circle at 0% 0%, #1a2142, #050817 70%);
  display: flex;
  justify-content: center;
  padding: 32px 16px;
  box-sizing: border-box;
`;

export const Shell = styled.div`
  width: 100%;
  max-width: 1180px;
  display: flex;
  border-radius: 22px;
  overflow: hidden;
  background: rgba(15, 23, 42, 0.92);
  border: 1px solid rgba(148, 163, 184, 0.4);
  box-shadow: 0 28px 60px rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(26px);
  color: #e5f2ff;
  font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;

  @media (max-width: 860px) {
    flex-direction: column;
  }
`;

/* LEFT SIDE STEPS */

export const LeftSteps = styled.div`
  width: 260px;
  background: radial-gradient(circle at top, #020617, #020617);
  border-right: 1px solid rgba(148, 163, 184, 0.35);
  padding: 22px 18px;
  box-sizing: border-box;

  @media (max-width: 860px) {
    display: flex;
    width: 100%;
    border-right: none;
    border-bottom: 1px solid rgba(148, 163, 184, 0.35);
    overflow-x: auto;
  }
`;

export const StepItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 10px;
  margin-bottom: 8px;
  border-radius: 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition: 0.2s;

  &.active {
    background: linear-gradient(135deg, rgba(56, 189, 248, 0.12), transparent);
    border: 1px solid rgba(56, 189, 248, 0.6);
  }

  &.done {
    opacity: 0.85;
  }

  &:hover {
    background: rgba(15, 23, 42, 0.8);
  }

  @media (max-width: 860px) {
    min-width: 180px;
  }
`;

export const StepIndex = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
`;

export const StepLabel = styled.div`
  font-size: 14px;
  color: #e5f2ff;
`;

/* RIGHT PANEL */

export const RightPane = styled.div`
  flex: 1;
  padding: 22px 26px 20px;
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 18px 16px 18px;
  }
`;

export const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
`;

export const Title = styled.h1`
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 0.03em;
`;

export const TagLine = styled.p`
  font-size: 13px;
  opacity: 0.7;
`;

export const Section = styled.div`
  margin-top: 6px;
`;

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const LabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const Label = styled.span`
  font-size: 13px;
  opacity: 0.9;
`;

export const RequiredDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #fb7185;
`;

/* INPUTS */

export const TextInput = styled(({ icon, ...rest }) => (
  <div className="input-shell">
    {icon && <span className="icon">{icon}</span>}
    <input {...rest} />
  </div>
))`
  &.input-shell {
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.6);
  background: rgba(15, 23, 42, 0.85);
  color: #e5f2ff;
  font-size: 13px;
  resize: vertical;
  outline: none;

  &:focus {
    border-color: #38bdf8;
    box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.4);
  }

  &::placeholder {
    color: rgba(148, 163, 184, 0.7);
  }
`;

export const InlineRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

  &.pwd-row {
    justify-content: space-between;
  }
`;

export const SmallButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(56, 189, 248, 0.7);
  background: rgba(15, 23, 42, 0.7);
  color: #e0faff;
  font-size: 12px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: rgba(56, 189, 248, 0.15);
  }
`;

/* PROFILE */

export const ProfileRow = styled.div`
  grid-column: span 2;
  display: flex;
  align-items: center;
  gap: 14px;

  @media (max-width: 860px) {
    grid-column: span 1;
  }
`;

export const ProfileAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 999px;
  border: 2px solid rgba(56, 189, 248, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle, #0f172a, #020617);
  color: #93c5fd;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const UploadHint = styled.div`
  font-size: 11px;
  opacity: 0.7;
  margin-top: 3px;
`;

/* CHIPS */

export const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-height: 140px;
  overflow-y: auto;
`;

export const Chip = styled.button`
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.6);
  padding: 6px 10px;
  font-size: 11px;
  background: rgba(15, 23, 42, 0.8);
  color: #e5f2ff;
  cursor: pointer;
  transition: 0.15s;

  &.active {
    border-color: #38bdf8;
    background: rgba(56, 189, 248, 0.15);
    box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.4);
  }
`;

/* ERROR */

export const ErrorText = styled.div`
  font-size: 11px;
  color: #fb7185;
  display: flex;
  align-items: center;
  gap: 4px;
`;

/* ACTIONS */

export const StepActions = styled.div`
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

export const PrimaryBtn = styled.button`
  padding: 11px 20px;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, #22d3ee, #1d4ed8);
  color: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 12px 28px rgba(37, 99, 235, 0.45);
  transition: 0.18s;

  &:hover {
    transform: translateY(-1px);
  }
`;

export const SecondaryBtn = styled.button`
  padding: 11px 18px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.7);
  background: rgba(15, 23, 42, 0.9);
  color: #e5f2ff;
  cursor: pointer;
  font-size: 13px;
`;

/* SELECT STYLE */

export const RateRow = styled.div`
  display: flex;
  gap: 8px;
`;

export const PreviewBlock = styled.div`
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.45);
  background: radial-gradient(circle at top left, #020617, #020617);
  padding: 16px 16px 12px;
  font-size: 13px;
`;

export const PreviewTitle = styled.h3`
  font-size: 15px;
  margin-bottom: 10px;
`;

export const PreviewRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  gap: 14px;

  span {
    opacity: 0.7;
  }

  &.bio {
    align-items: flex-start;

    p {
      text-align: right;
      margin: 0;
    }
  }
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px dashed rgba(148, 163, 184, 0.5);
  margin: 10px 0;
`;

/* Native select override inside this file */
export const Select = styled.select``;

/* ------------ Generic overlay + modal styles (OTP & Billing) ---------- */
/* NOTE: we use global classNames from JSX (overlay, modal, etc.) */

export const GlobalOverlayStyles = styled.div``;

// we have to inject css globally using template literal in index.css,
//    but since you asked for page code only, make sure to add:

