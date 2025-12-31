// RegisterPage.styles.js (Premium Updated - All Devices Perfect)
import styled, { keyframes } from "styled-components";

/* --------------------------------------------------
   0. Premium Animations
-------------------------------------------------- */
const progressLiquid = keyframes`
  0% { width: 0; opacity: 0; transform: translateX(-20px); }
  100% { width: 100%; opacity: 1; transform: translateX(0); }
`;

const glassShimmer = keyframes`
  0% { opacity: 0; transform: translateX(-100%) translateY(-100%); }
  50% { opacity: 0.4; }
  100% { opacity: 0; transform: translateX(100%) translateY(100%); }
`;

const floatSubtle = keyframes`
  0%, 100% { transform: translateY(0px) rotateX(0deg); }
  50% { transform: translateY(-4px) rotateX(2deg); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(14,165,233,0.4); }
  50% { box-shadow: 0 0 0 12px rgba(14,165,233,0); }
`;

/* --------------------------------------------------
   1. Background — Ultra Premium Gradient + Subtle Texture
-------------------------------------------------- */
export const RegisterPageWrap = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: ${({ hasNavbar }) => hasNavbar ? '120px 20px 60px' : '80px 20px 60px'};
  
  background: 
    radial-gradient(circle at 20% 15%, rgba(239,246,255,0.9) 0%, transparent 50%),
    radial-gradient(circle at 80% 85%, rgba(219,234,254,0.7) 0%, transparent 50%),
    radial-gradient(circle at 45% 60%, rgba(248,250,252,0.8) 0%, transparent 40%),
    linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%);
  
  position: relative;
  
  /* Subtle organic dots */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(2px 2px at 20px 30px, rgba(59,130,246,0.15), transparent),
      radial-gradient(2px 2px at 40px 70px, rgba(139,92,246,0.1), transparent),
      radial-gradient(1px 1px at 90px 40px, rgba(16,185,129,0.15), transparent),
      radial-gradient(1px 1px at 130px 80px, rgba(236,72,153,0.1), transparent);
    background-repeat: repeat;
    background-size: 200px 100px;
    animation: floatSubtle 20s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
  }
  
  @media (max-width: 480px) {
    padding: ${({ hasNavbar }) => hasNavbar ? '110px 16px 40px' : '70px 16px 40px'};
  }
`;

/* --------------------------------------------------
   2. Frosted Glass Card — Vision Pro Glassmorphism
-------------------------------------------------- */
export const RegisterCard = styled.div`
  width: 100%;
  max-width: 760px;
  border-radius: 28px;
  padding: 48px 52px 44px;
  position: relative;
  overflow: hidden;
  
  background: 
    rgba(255, 255, 255, 0.72),
    rgba(255, 255, 255, 0.52),
    rgba(255, 255, 255, 0.42);
  backdrop-filter: saturate(140%) blur(32px);
  -webkit-backdrop-filter: saturate(140%) blur(32px);
  
  border: 1px solid rgba(255, 255, 255, 0.28);
  box-shadow: 
    0 8px 32px rgba(15, 23, 42, 0.08),
    0 4px 20px rgba(15, 23, 42, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  
  /* Premium shine effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(14, 165, 233, 0.6) 20%, 
      rgba(14, 165, 233, 0.9) 50%, 
      rgba(14, 165, 233, 0.6) 80%, 
      transparent 100%);
    z-index: 2;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 12px;
    right: 20px;
    width: 32px;
    height: 32px;
    background: radial-gradient(circle, rgba(14,165,233,0.3) 0%, transparent 70%);
    border-radius: 50%;
    animation: pulseGlow 3s ease-in-out infinite;
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    padding: 40px 36px 36px;
    margin: 0 8px;
    max-width: calc(100% - 16px);
  }
  
  @media (max-width: 480px) {
    padding: 32px 24px 28px;
    border-radius: 20px;
    margin: 0 4px;
  }
`;

/* --------------------------------------------------
   3. Typography — Perfect Hierarchy
-------------------------------------------------- */
export const StepHeader = styled.div`
  margin-bottom: 32px;
  text-align: center;
`;

export const StepTitle = styled.h2`
  font-size: clamp(24px, 4vw, 32px);
  font-weight: 800;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 0 0 12px 0;
  line-height: 1.2;
`;

export const StepSubtitle = styled.p`
  font-size: clamp(14px, 2.5vw, 16px);
  font-weight: 400;
  color: #64748b;
  margin: 0;
  line-height: 1.6;
`;

/* --------------------------------------------------
   4. Progress Bar — Liquid Premium Motion
-------------------------------------------------- */
export const ProgressWrap = styled.div`
  margin-bottom: 36px;
`;

export const ProgressRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const ProgressLabel = styled.span`
  font-size: 13px;
  color: #64748b;
  font-weight: 600;
`;

export const ProgressSteps = styled.span`
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
`;

export const ProgressBarOuter = styled.div`
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: rgba(226, 232, 240, 0.6);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(12px);
`;

export const ProgressBarInner = styled.div`
  height: 100%;
  border-radius: 999px;
  width: ${({ percent }) => `${percent}%`};
  background: linear-gradient(90deg, #0ea5ff 0%, #38bdf8 50%, #60a5fa 100%);
  box-shadow: 0 0 12px rgba(14, 165, 233, 0.4);
  animation: ${progressLiquid} 0.6s cubic-bezier(0.19, 1, 0.22, 1);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 24px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6));
    border-radius: 999px;
  }
`;

/* --------------------------------------------------
   5. Form Grid — Perfect Responsive
-------------------------------------------------- */
export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-top: 16px;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

export const FullRow = styled.div`
  grid-column: 1 / -1;
`;

/* --------------------------------------------------
   6. Inputs — Neon Glow + Perfect Focus
-------------------------------------------------- */
export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
`;

export const Label = styled.label`
  font-size: 13.5px;
  font-weight: 600;
  color: #374151;
  letter-spacing: -0.01em;
`;

export const Input = styled.input`
  border-radius: 16px;
  border: 1.5px solid rgba(148, 163, 184, 0.4);
  padding: 16px 20px;
  font-size: 16px;
  color: #1e293b;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 56px;
  
  &::placeholder {
    color: #9ca3af;
  }
  
  &:hover {
    border-color: rgba(14, 165, 233, 0.5);
    background: rgba(255, 255, 255, 0.96);
    transform: translateY(-1px);
  }
  
  &:focus {
    border-color: #0ea5ff;
    background: rgba(255, 255, 255, 1);
    box-shadow: 
      0 0 0 4px rgba(14, 165, 233, 0.15),
      0 8px 32px rgba(14, 165, 233, 0.12);
    outline: none;
    transform: translateY(-2px);
  }
  
  @media (max-width: 480px) {
    padding: 14px 16px;
    font-size: 15px;
  }
`;

export const FileInput = styled.input.attrs({ type: "file" })`
  font-size: 14px;
  background: rgba(255, 255, 255, 0.92);
  border: 1.5px solid rgba(148, 163, 184, 0.4);
  border-radius: 16px;
  padding: 16px 20px;
  color: #1e293b;
  cursor: pointer;
  transition: all 0.25s ease;
  min-height: 56px;
  
  &::-webkit-file-upload-button {
    padding: 12px 20px;
    border: none;
    border-radius: 12px;
    background: linear-gradient(135deg, #0ea5ff 0%, #38bdf8 100%);
    color: white;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(14, 165, 233, 0.3);
    transition: all 0.2s ease;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 24px rgba(14, 165, 233, 0.4);
    }
  }
  
  &:hover {
    border-color: rgba(14, 165, 233, 0.5);
  }
`;

export const TextArea = styled.textarea`
  border-radius: 16px;
  border: 1.5px solid rgba(148, 163, 184, 0.4);
  padding: 16px 20px;
  font-size: 16px;
  color: #1e293b;
  background: rgba(255, 255, 255, 0.92);
  min-height: 128px;
  resize: vertical;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  line-height: 1.6;
  
  &::placeholder {
    color: #9ca3af;
  }
  
  &:focus {
    border-color: #0ea5ff;
    background: rgba(255, 255, 255, 1);
    box-shadow: 
      0 0 0 4px rgba(14, 165, 233, 0.15),
      0 8px 32px rgba(14, 165, 233, 0.12);
    outline: none;
  }
`;

/* --------------------------------------------------
   7. Buttons — Floating Glass Buttons
-------------------------------------------------- */
export const ActionsRow = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  
  @media (max-width: 640px) {
    flex-direction: column-reverse;
    gap: 16px;
  }
`;

export const PrimaryButton = styled.button`
  flex: 1;
  padding: 16px 32px;
  border-radius: 999px;
  font-size: 16px;
  font-weight: 700;
  border: none;
  color: #fff;
  cursor: pointer;
  background: linear-gradient(135deg, #0ea5ff 0%, #38bdf8 50%, #60a5fa 100%);
  box-shadow: 
    0 12px 32px rgba(14, 165, 233, 0.4),
    0 4px 12px rgba(15, 23, 42, 0.08);
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255,255,255,0.3), 
      transparent);
    transition: left 0.6s;
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 
      0 20px 48px rgba(14, 165, 233, 0.5),
      0 8px 24px rgba(15, 23, 42, 0.12);
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-2px);
  }
  
  @media (max-width: 480px) {
    padding: 14px 24px;
    font-size: 15px;
  }
`;

export const SecondaryButton = styled.button`
  padding: 14px 24px;
  font-size: 15px;
  font-weight: 600;
  border: 1.5px solid rgba(148, 163, 184, 0.5);
  background: rgba(255, 255, 255, 0.7);
  color: #475569;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 999px;
  backdrop-filter: blur(16px);
  flex: 0 0 auto;
  
  &:hover {
    background: rgba(255, 255, 255, 0.9);
    border-color: rgba(14, 165, 233, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(15, 23, 42, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

/* --------------------------------------------------
   8. Category Cards — Luxury Glass Selection
-------------------------------------------------- */
export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin: 20px 0;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const SelectCard = styled.button`
  border-radius: 24px;
  border: 2px solid ${({ active }) => 
    active ? "rgba(14,165,233,0.4)" : "rgba(148,163,184,0.3)"};
  background: ${({ active }) =>
    active ? "rgba(224,242,254,0.95)" : "rgba(255,255,255,0.88)"};
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: 12px;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
  
  box-shadow: ${({ active }) =>
    active
      ? "0 16px 40px rgba(14,165,233,0.25), inset 0 1px 0 rgba(255,255,255,0.8)"
      : "0 8px 24px rgba(15,23,42,0.08)"};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      transparent, 
      ${props => props.active ? '#0ea5ff' : 'rgba(148,163,184,0.5)'}, 
      transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  ${props => props.active && '::before { opacity: 1; }'}
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 48px rgba(15,23,42,0.12);
    border-color: rgba(14,165,233,0.4);
  }
  
  &:active {
    transform: translateY(-2px);
  }
  
  @media (max-width: 480px) {
    padding: 20px 16px;
  }
`;

export const CardTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.3;
`;

export const CardMeta = styled.div`
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
`;

export const Chip = styled.span`
  font-size: 11.5px;
  padding: 6px 12px;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(14,165,233,0.15), rgba(56,189,248,0.1));
  color: #0369a1;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(14,165,233,0.2);
`;

/* --------------------------------------------------
   9. Price Input — Perfect Alignment
-------------------------------------------------- */
export const PriceInputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  border: 1.5px solid rgba(148, 163, 184, 0.3);
  backdrop-filter: blur(16px);
  
  span {
    color: #52525b;
    font-weight: 600;
    font-size: 18px;
  }
`;

// Add to Register.styles.js (New Premium Components)

/* --------------------------------------------------
   10. Enhanced Form Fields
-------------------------------------------------- */
export const PhoneInputWrap = styled(Field)`
  grid-column: 1 / -1;
`;

export const PasswordStrength = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  
  div {
    height: 4px;
    border-radius: 2px;
    transition: all 0.3s ease;
    background: rgba(148, 163, 184, 0.3);
  }
  
  span {
    font-size: 12px;
    font-weight: 600;
    color: #64748b;
  }
`;

/* --------------------------------------------------
   11. Enhanced Actions
-------------------------------------------------- */
export const ToggleLink = styled.span`
  display: inline-block;
  color: #0ea5ff !important;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  margin-left: 6px;
  padding: 4px 0;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #0ea5ff, #38bdf8);
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
`;

export const Divider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(226, 232, 240, 0.8), 
    transparent
  );
  margin: 32px 0;
`;
// Add to Register.styles.js (New Premium Category Components)

/* --------------------------------------------------
   12. Category Page Premium Components
-------------------------------------------------- */
export const CategorySearch = styled.div`
  position: relative;
  margin-bottom: 32px;
  
  input {
    width: 100%;
    padding: 16px 20px 16px 48px;
    border: 1.5px solid rgba(148, 163, 184, 0.4);
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.92);
    font-size: 15px;
    backdrop-filter: blur(16px);
    transition: all 0.3s ease;
    
    &::placeholder {
      color: #9ca3af;
    }
    
    &:focus {
      border-color: #0ea5ff;
      box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.15);
      outline: none;
    }
  }
  
  &::before {
    content: "🔍";
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 18px;
    color: #94a3b8;
  }
`;

export const CategoryStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  backdrop-filter: blur(16px);
  
  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    
    span:first-child {
      font-size: 24px;
      font-weight: 800;
      color: #1e293b;
    }
    
    span:last-child {
      font-size: 12px;
      color: #64748b;
      font-weight: 500;
    }
  }
`;

export const SelectedCount = styled.span`
  background: linear-gradient(135deg, #10b981, #34d399);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent !important;
`;

export const CategoryEmptyState = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: #64748b;
  
  h3 {
    color: #374151;
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 8px 0;
  }
  
  p {
    margin: 0;
    font-size: 15px;
  }
`;

// Add to Register.styles.js (New Premium Subcategory Components)

/* --------------------------------------------------
   13. Subcategory Page Premium Components
-------------------------------------------------- */
export const SubcategorySearch = styled.div`
  position: relative;
  margin-bottom: 32px;
  
  input {
    width: 100%;
    padding: 16px 20px 16px 48px;
    border: 1.5px solid rgba(148, 163, 184, 0.4);
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.92);
    font-size: 15px;
    backdrop-filter: blur(16px);
    transition: all 0.3s ease;
    
    &::placeholder {
      color: #9ca3af;
    }
    
    &:focus {
      border-color: #10b981;
      box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15);
      outline: none;
    }
  }
  
  &::before {
    content: "🔍";
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 18px;
    color: #94a3b8;
  }
`;

export const SelectionStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  backdrop-filter: blur(16px);
  
  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    
    span:first-child {
      font-size: 24px;
      font-weight: 800;
      color: #1e293b;
    }
    
    span:last-child {
      font-size: 12px;
      color: #64748b;
      font-weight: 500;
    }
  }
`;

export const CategoryPreview = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: linear-gradient(135deg, rgba(224,242,254,0.8), rgba(219,234,254,0.6));
  border: 1.5px solid rgba(14,165,233,0.2);
  border-radius: 20px;
  margin-bottom: 28px;
  backdrop-filter: blur(16px);
  
  h3 {
    margin: 0 0 4px 0;
    font-size: 18px;
    font-weight: 700;
    color: #1e293b;
  }
  
  p {
    margin: 0;
    color: #64748b;
    font-size: 14px;
  }
`;

export const MultiSelectToggle = styled.button`
  padding: 10px 16px;
  border: 1.5px solid rgba(16,185,129,0.3);
  background: rgba(255,255,255,0.9);
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  color: #059669;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  backdrop-filter: blur(12px);
  
  &:hover {
    background: rgba(16,185,129,0.1);
    transform: translateY(-1px);
  }
`;

export const SelectedPreview = styled.div`
  background: linear-gradient(135deg, rgba(220,252,231,0.9), rgba(187,247,208,0.8));
  border: 2px solid rgba(16,185,129,0.4);
  border-radius: 20px;
  padding: 24px;
  margin: 32px 0;
  backdrop-filter: blur(16px);
  
  h4 {
    font-size: 18px;
    font-weight: 700;
    color: #166534;
    margin: 0;
  }
`;

export const SubcategoryEmptyState = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: #64748b;
  
  h3 {
    color: #374151;
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 8px 0;
  }
  
  p {
    margin: 0;
    font-size: 15px;
  }
`;

/* --------------------------------------------------
   14. Profile Page Premium Components
-------------------------------------------------- */
export const ProfilePreview = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background: linear-gradient(135deg, rgba(224,242,254,0.9), rgba(219,234,254,0.8));
  border: 2px solid rgba(14,165,233,0.3);
  border-radius: 24px;
  margin-bottom: 32px;
  backdrop-filter: blur(20px);
  
  h4 { margin: 0 0 4px 0; font-weight: 700; color: #1e293b; }
  p { margin: 0; color: #64748b; font-size: 14px; }
`;

export const FileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
`;

export const FilePreview = styled.div`
  margin-top: 12px;
  img, video {
    width: 80px;
    height: 80px;
    border-radius: 12px;
    object-fit: cover;
    border: 2px solid rgba(14,165,233,0.3);
  }
`;

export const UploadStatus = styled.div`
  margin-top: 8px;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  
  ${({ status }) => {
    if (status === "success") return `
      background: rgba(16,185,129,0.15);
      color: #059669;
    `;
    if (status === "error") return `
      background: rgba(239,68,68,0.15);
      color: #dc2626;
    `;
    return `
      background: rgba(245,158,11,0.15);
      color: #d97706;
    `;
  }}
`;

export const ProgressBarWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
  
  span {
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
    min-width: 60px;
  }
`;

// export const ValidationSummary = styled.div`
//   background: rgba(239,68,68,0.1);
//   border: 1px solid rgba(239,68,68,0.3);
//   border-radius: 12px;
//   padding: 16px;
//   margin-bottom: 24px;
  
//   > div {
//     display: flex;
//     align-items: center;
//     gap: 8px;
//     margin-bottom: 4px;
//     font-size: 13px;
//   }
// `;

export const CharacterCounter = styled.div`
  margin-top: 8px;
  text-align: right;
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
`;

/* --------------------------------------------------
   15. Pricing Page Premium Components
-------------------------------------------------- */
export const PricingPreview = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 32px;
  background: linear-gradient(135deg, rgba(34,197,94,0.08), rgba(16,185,129,0.06));
  border: 2px solid rgba(16,185,129,0.3);
  border-radius: 24px;
  margin-bottom: 32px;
  backdrop-filter: blur(20px);
`;

export const PriceRangeSlider = styled.input`
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: rgba(226,232,240,0.6);
  outline: none;
  appearance: none;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: linear-gradient(135deg, #0ea5ff, #38bdf8);
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(14,165,233,0.4);
  }
`;

export const SmartPricingCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: linear-gradient(135deg, rgba(14,165,233,0.08), rgba(56,189,248,0.06));
  border: 2px solid rgba(14,165,233,0.2);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(16px);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(14,165,233,0.2);
    border-color: rgba(14,165,233,0.4);
  }
`;

export const PricingStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
  
  > div {
    text-align: center;
    padding: 16px;
    background: rgba(255,255,255,0.7);
    border-radius: 16px;
    border: 1px solid rgba(148,163,184,0.3);
  }
`;

export const SelectedPriceTag = styled.div`
  font-size: 20px;
  font-weight: 800;
  background: linear-gradient(135deg, #10b981, #34d399);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 4px;
`;

export const FeatureGrid = styled.div`
  display: grid;
  gap: 24px;
  margin: 32px 0;
`;

export const ValidationSummary = styled.div`
  background: rgba(239,68,68,0.08);
  border: 1px solid rgba(239,68,68,0.3);
  border-radius: 16px;
  padding: 20px;
  margin: 24px 0;
`;

/* --------------------------------------------------
   Pricing Page Simplified Components
-------------------------------------------------- */
export const PricingFieldsGrid = styled.div`
  display: grid;
  gap: 24px;
  margin: 32px 0;
  
  @media (max-width: 768px) {
    gap: 20px;
  }
`;
