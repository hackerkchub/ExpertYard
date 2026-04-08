// src/apps/expert/styles/Register.styles.js
import styled, { keyframes } from "styled-components";

const progressLiquid = keyframes`
  0% { width: 0; opacity: 0; }
  100% { width: 100%; opacity: 1; }
`;

export const RegisterPageWrap = styled.div`
  /* Fix: Use dvh for mobile browsers to account for address bars */
  min-height: 100vh;
  min-height: 100dvh; 
  width: 100%;
  display: flex;
  justify-content: center;
  /* Changed from flex-start to center for better mobile alignment */
  align-items: center; 
  background-color: #f4f2ee;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  box-sizing: border-box;
  overflow-y: auto; /* Allows scrolling if content is taller than screen */

  @media (max-width: 480px) {
    padding: ${({ hasNavbar }) => (hasNavbar ? "70px 12px 20px" : "20px 12px")};
    align-items: flex-start; /* Stack from top on very small screens to avoid cutting off header */
  }
`;

export const RegisterCard = styled.div`
  width: 100%;
  max-width: 760px;
  border-radius: 12px;
  padding: 44px 48px;
  position: relative;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  margin: auto 0; /* Keeps it centered vertically */

  @media (max-width: 768px) {
    padding: 32px 24px;
    max-width: 100%;
  }

  @media (max-width: 480px) {
    padding: 24px 16px;
    border-radius: 8px;
    border: none; /* Cleaner look on mobile */
    box-shadow: none;
    background: #ffffff;
  }
`;

export const StepHeader = styled.div`
  margin-bottom: 24px;
  text-align: center;
`;

export const StepTitle = styled.h2`
  font-size: clamp(22px, 5vw, 28px);
  font-weight: 600;
  color: rgba(0, 0, 0, 0.9);
  margin: 0 0 8px 0;
  line-height: 1.2;
`;

export const StepSubtitle = styled.p`
  font-size: clamp(13px, 3vw, 15px);
  font-weight: 400;
  color: rgba(0, 0, 0, 0.6);
  margin: 0;
`;

/* --- PROGRESS BAR EXPORTS --- */
export const ProgressWrap = styled.div`
  margin-bottom: 24px;
`;

export const ProgressRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const ProgressLabel = styled.span`
  font-size: 13px;
  color: rgba(0, 0, 0, 0.8);
  font-weight: 600;
`;

export const ProgressSteps = styled.span`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 500;
`;

export const ProgressBarOuter = styled.div`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e0e0e0;
  overflow: hidden;
`;

export const ProgressBarInner = styled.div`
  height: 100%;
  border-radius: 3px;
  width: ${({ percent }) => `${percent}%`};
  background-color: #0a66c2;
  transition: width 0.4s ease-in-out;
  animation: ${progressLiquid} 0.6s ease;
`;

/* --- FORM LAYOUT --- */
export const FormGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 8px;
  width: 100%;

  @media (min-width: 641px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const FullRow = styled.div`
  @media (min-width: 641px) {
    grid-column: span 2;
  }
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.8);
`;

export const Input = styled.input`
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.6);
  padding: 10px 14px;
  font-size: 16px; /* 16px prevents iOS zoom on focus */
  background: #ffffff;
  transition: all 0.2s;
  min-height: 44px;
  box-sizing: border-box;
  width: 100%;

  &:focus {
    border-color: #0a66c2;
    box-shadow: 0 0 0 1px #0a66c2;
    outline: none;
  }
`;

export const ActionsRow = styled.div`
  margin-top: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  @media (max-width: 640px) {
    flex-direction: column-reverse;
    align-items: stretch;
  }
`;

export const PrimaryButton = styled.button`
  flex: 1;
  padding: 12px 24px;
  min-height: 48px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  color: #fff;
  cursor: pointer;
  background-color: #0a66c2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.2s;

  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};

  &:hover {
    background-color: #004182;
  }
`;

export const SecondaryButton = styled.button`
  padding: 10px 24px;
  min-height: 44px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid #0a66c2;
  background: #ffffff;
  color: #0a66c2;
  cursor: pointer;
  border-radius: 22px;
  transition: all 0.2s ease;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: rgba(10, 102, 194, 0.06);
  }

  &:disabled {
    border-color: rgba(0, 0, 0, 0.2);
    color: rgba(0, 0, 0, 0.3);
  }
`;

export const PasswordStrength = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  div { height: 4px; border-radius: 2px; background: #e0e0e0; flex: 1; }
  span { font-size: 12px; font-weight: 600; }
`;

// export const Divider = styled.div`
//   height: 1px;
//   background: #e0e0e0;
//   margin: 24px 0;
// `;

export const ToggleLink = styled.span`
  color: #0a66c2 !important;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  &:hover { text-decoration: underline; }
`;

export const PhoneInputWrap = styled(Field)`
  @media (min-width: 641px) { grid-column: span 2; }
`;

export const FileInput = styled.input.attrs({ type: "file" })`
  font-size: 14px;
  border: 1px solid rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  padding: 8px 12px;
  width: 100%;
  box-sizing: border-box;

  &::-webkit-file-upload-button {
    padding: 6px 12px;
    border-radius: 14px;
    background-color: #0a66c2;
    color: white;
    border: none;
    font-weight: 600;
    cursor: pointer;
  }
`;

export const TextArea = styled.textarea`
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.6);
  padding: 12px;
  font-size: 16px;
  min-height: 100px;
  width: 100%;
  box-sizing: border-box;
  resize: vertical;
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin: 16px 0;
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

export const SelectCard = styled.button`
  border-radius: 12px;
  border: 1px solid ${({ active }) => (active ? "#0a66c2" : "#e0e0e0")};
  background: ${({ active }) => (active ? "rgba(10, 102, 194, 0.04)" : "#ffffff")};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
  width: 100%;
  text-align: left;
`;


// export const Divider = styled.div`
//   height: 1px;
//   background: #e0e0e0;
//   margin: 32px 0;
// `;

export const CardTitle = styled.div` font-weight: 600; color: #000; `;
export const CardMeta = styled.div` font-size: 13px; color: #666; `;
export const Chip = styled.span`
  font-size: 12px; padding: 4px 12px; border-radius: 14px;
  background-color: #e7f3ff; color: #0a66c2; font-weight: 600;
`;

export const PriceInputRow = styled.div`
  display: flex; align-items: center; gap: 10px; padding: 10px 14px;
  border: 1px solid rgba(0,0,0,0.6); border-radius: 4px;
`;


export const CategorySearch = styled.div`
  position: relative; margin-bottom: 24px;
  input { width: 100%; padding: 12px 12px 12px 40px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
  &::before { content: "🔍"; position: absolute; left: 12px; top: 50%; transform: translateY(-50%); }
`;

export const CategoryStats = styled.div`
  display: flex; justify-content: space-between; padding: 12px;
  background: #f4f2ee; border-radius: 8px; margin-bottom: 20px;
`;

export const SelectedCount = styled.span` color: #0a66c2; font-weight: 700; `;

export const CategoryEmptyState = styled.div` padding: 40px 0; text-align: center; `;
export const SubcategorySearch = styled(CategorySearch)``;
export const SelectionStats = styled(CategoryStats)``;
export const CategoryPreview = styled.div`
  padding: 16px; background: rgba(10, 102, 194, 0.04); border-radius: 8px; margin-bottom: 20px;
`;

export const MultiSelectToggle = styled.button`
  padding: 6px 14px; border: 1px solid #0a66c2; background: #fff; border-radius: 20px; color: #0a66c2; cursor: pointer;
`;

export const SelectedPreview = styled.div`
  background: #f9f9f9; padding: 16px; border-radius: 8px; margin-bottom: 20px;
`;

export const SubcategoryEmptyState = styled(CategoryEmptyState)``;
export const ProfilePreview = styled(CategoryPreview)``;
export const FileGrid = styled.div` display: grid; grid-template-columns: 1fr; gap: 12px; `;

export const ProgressBarWrap = styled.div` display: flex; align-items: center; gap: 10px; margin-bottom: 20px; `;

export const CharacterCounter = styled.div` text-align: right; font-size: 11px; color: #666; `;

export const PricingPreview = styled.div`
  padding: 20px; background: rgba(10, 102, 194, 0.04); border-radius: 8px; margin-bottom: 24px;
`;

export const PriceRangeSlider = styled.input` width: 100%; margin: 15px 0; `;

export const SmartPricingCard = styled.div`
  display: flex; align-items: center; gap: 12px; padding: 16px;
  border: 1px solid #e0e0e0; border-radius: 8px; cursor: pointer;
`;

export const PricingStats = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 24px;
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

export const SelectedPriceTag = styled.div` font-size: 20px; font-weight: 700; color: #0a66c2; `;

export const FeatureGrid = styled.div` display: grid; gap: 12px; margin: 24px 0; `;

export const ValidationSummary = styled.div`
  background: #fff5f5; border: 1px solid #feb2b2; padding: 16px; border-radius: 8px; margin-bottom: 20px;
`;

export const PricingFieldsGrid = styled.div` display: flex; flex-direction: column; gap: 16px; margin: 24px 0; `;

export const FilePreview = styled.div`
  display: flex; align-items: center; gap: 10px; padding: 10px; background: #f8f8f8; border-radius: 4px;
`;

export const FileInfo = styled.div` flex: 1; display: flex; flex-direction: column; `;
export const FileName = styled.span` font-size: 14px; font-weight: 600; `;
export const FileSize = styled.span` font-size: 12px; color: #666; `;

export const RemoveFileButton = styled.button`
  background: none; border: none; color: #cc0000; cursor: pointer; font-size: 18px;
`;

export const ProgressBar = styled.div` width: 100%; height: 4px; background: #eee; border-radius: 2px; `;
export const ProgressFill = styled.div`
  height: 100%; background: #0a66c2; width: ${({ percent }) => `${percent}%`}; transition: width 0.3s;
`;

export const UploadStatus = styled.div`
  padding: 10px; background: #e7f3ff; border-radius: 4px; color: #0a66c2; font-size: 13px;
`;

export const SuccessCard = styled.div`
<<<<<<< HEAD
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.15);
`;

// Add these to your existing Register.styles.js file

export const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
`;

export const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-size: 14px;
  color: #1e293b;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.2s;
  
  &:hover {
    background: #f8fafc;
  }
`;

export const RadioInput = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #0ea5ff;
`;

export const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-size: 14px;
  color: #1e293b;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.2s;
  
  &:hover {
    background: #f8fafc;
  }
`;

export const CheckboxInput = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #0ea5ff;
`;

export const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #e2e8f0;
`;

export const SectionCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
`;

export const Divider = styled.hr`
  margin: 20px 0;
  border: none;
  border-top: 1px solid #e2e8f0;
`;

export const PlanCard = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
  
  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    transform: translateY(-2px);
  }
`;

export const PlanHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const PlanName = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

export const PlanPrice = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #0ea5ff;
  margin: 8px 0;
`;

export const PlanDetails = styled.div`
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
  margin: 8px 0;
`;

export const AddPlanButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #f8fafc;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  color: #0ea5ff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 12px;
  
  &:hover {
    background: #f1f5f9;
    border-color: #0ea5ff;
  }
`;

export const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.2s;
  
  &:hover {
    background: #fee2e2;
  }
`;

export const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
`;


export const EditButton = styled.button`
  background: none;
  border: none;
  color: #0ea5ff;
  font-size: 16px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.2s;
  
  &:hover {
    background: #e0f2fe;
  }

  background: #ecfdf5; border: 1px solid #10b981; padding: 20px; border-radius: 12px; text-align: center;

`;