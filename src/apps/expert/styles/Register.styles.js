// src/apps/expert/styles/Register.styles.js
import styled, { keyframes } from "styled-components";

const progressLiquid = keyframes`
  0% { width: 0; opacity: 0; }
  100% { width: 100%; opacity: 1; }
`;

export const RegisterPageWrap = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: ${({ hasNavbar }) => (hasNavbar ? "120px 20px 60px" : "80px 20px 60px")};
  background-color: #f4f2ee;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;

  @media (max-width: 480px) {
    padding: ${({ hasNavbar }) => (hasNavbar ? "100px 12px 40px" : "40px 12px 40px")};
  }
`;

export const RegisterCard = styled.div`
  width: 100%;
  max-width: 760px;
  border-radius: 12px;
  padding: 44px 48px;
  position: relative;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 36px 24px;
    margin: 0 8px;
    max-width: calc(100% - 16px);
  }

  @media (max-width: 480px) {
    padding: 24px 16px;
    border-radius: 10px;
    margin: 0;
  }
`;

export const StepHeader = styled.div`
  margin-bottom: 32px;
  text-align: center;
`;

export const StepTitle = styled.h2`
  font-size: clamp(24px, 4vw, 30px);
  font-weight: 600;
  color: rgba(0, 0, 0, 0.9);
  margin: 0 0 12px 0;
`;

export const StepSubtitle = styled.p`
  font-size: clamp(14px, 2.5vw, 15px);
  font-weight: 400;
  color: rgba(0, 0, 0, 0.6);
  margin: 0;
`;

/* ✅ ADDED MISSING EXPORTS FOR REGISTER LAYOUT PROGRESS BAR */
export const ProgressWrap = styled.div`
  margin-bottom: 32px;
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
  background-color: #0a66c2; /* LinkedIn Blue */
  animation: ${progressLiquid} 0.6s ease;
`;
/* -------------------------------------------------------- */

export const FormGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 16px;
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
  gap: 8px;
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
  padding: 12px 16px;
  font-size: 16px;
  background: #ffffff;
  transition: border-color 0.2s;
  min-height: 48px;
  box-sizing: border-box;
  width: 100%;

  &:focus {
    border-color: #0a66c2;
    box-shadow: 0 0 0 1px #0a66c2;
    outline: none;
  }
`;

export const ActionsRow = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;

  @media (max-width: 640px) {
    flex-direction: column-reverse;
    gap: 12px;
    align-items: stretch;
  }
`;

export const PrimaryButton = styled.button`
  flex: 1;
  padding: 14px 24px;
  height: 48px;
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

  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};

  &:hover {
    background-color: #004182;
  }
`;

export const SecondaryButton = styled.button`
  padding: 12px 24px;
  height: 44px;
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
  box-sizing: border-box;

  &:hover:not(:disabled) {
    background: rgba(10, 102, 194, 0.06);
  }

  &:disabled {
    border-color: rgba(0, 0, 0, 0.2);
    color: rgba(0, 0, 0, 0.3);
    cursor: not-allowed;
  }
`;

export const PasswordStrength = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;

  div {
    height: 4px;
    border-radius: 2px;
    background: #e0e0e0;
    flex: 1;
  }

  span {
    font-size: 12px;
    font-weight: 600;
  }
`;

export const Divider = styled.div`
  height: 1px;
  background: #e0e0e0;
  margin: 32px 0;
`;

export const ToggleLink = styled.span`
  display: inline-block;
  color: #0a66c2 !important;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  margin-left: 4px;

  &:hover {
    text-decoration: underline;
  }
`;

export const PhoneInputWrap = styled(Field)`
  width: 100%;
  @media (min-width: 641px) {
    grid-column: span 2;
  }
`;

export const FileInput = styled.input.attrs({ type: "file" })`
  font-size: 14px;
  border: 1px solid rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  padding: 12px 16px;
  color: rgba(0, 0, 0, 0.9);
  cursor: pointer;
  background: #ffffff;
  min-height: 48px;
  width: 100%;
  box-sizing: border-box;

  &::-webkit-file-upload-button {
    padding: 8px 16px;
    border: none;
    border-radius: 18px;
    background-color: #0a66c2;
    color: white;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;

    &:hover {
      background-color: #004182;
    }
  }
`;

export const TextArea = styled.textarea`
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.6);
  padding: 12px 16px;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.9);
  background: #ffffff;
  min-height: 120px;
  resize: vertical;
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    border-color: #0a66c2;
    box-shadow: 0 0 0 1px #0a66c2;
    outline: none;
  }
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin: 20px 0;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const SelectCard = styled.button`
  border-radius: 12px;
  border: 1px solid ${({ active }) => (active ? "#0a66c2" : "#e0e0e0")};
  background: ${({ active }) => (active ? "rgba(10, 102, 194, 0.04)" : "#ffffff")};
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  width: 100%;

  &:hover {
    border-color: #0a66c2;
    background: rgba(10, 102, 194, 0.02);
  }
`;

export const CardTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.9);
`;

export const CardMeta = styled.div`
  font-size: 13px;
  color: rgba(0, 0, 0, 0.6);
  line-height: 1.5;
`;

export const Chip = styled.span`
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 14px;
  background-color: #e7f3ff;
  color: #0a66c2;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
`;

export const PriceInputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  padding: 12px 16px;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.6);
  width: 100%;
  box-sizing: border-box;

  span {
    color: rgba(0, 0, 0, 0.8);
    font-weight: 600;
    font-size: 18px;
  }
`;

export const CategorySearch = styled.div`
  position: relative;
  margin-bottom: 32px;
  width: 100%;

  input {
    width: 100%;
    padding: 12px 16px 12px 42px;
    border: 1px solid rgba(0, 0, 0, 0.6);
    border-radius: 4px;
    background: #ffffff;
    font-size: 15px;
    box-sizing: border-box;

    &:focus {
      border-color: #0a66c2;
      box-shadow: 0 0 0 1px #0a66c2;
      outline: none;
    }
  }

  &::before {
    content: "🔍";
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
  }
`;

export const CategoryStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px;
  background: #f4f2ee;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  flex-wrap: wrap;
  gap: 12px;

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;

    span:first-child {
      font-size: 22px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.9);
    }

    span:last-child {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.6);
    }
  }
`;

export const SelectedCount = styled.span`
  color: #0a66c2 !important;
`;

export const CategoryEmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 20px;
  text-align: center;
  width: 100%;

  h3 {
    color: rgba(0, 0, 0, 0.9);
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 8px 0;
  }

  p {
    margin: 0;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
  }
`;

export const SubcategorySearch = styled(CategorySearch)``;

export const SelectionStats = styled(CategoryStats)``;

export const CategoryPreview = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: rgba(10, 102, 194, 0.04);
  border: 1px solid rgba(10, 102, 194, 0.2);
  border-radius: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;

  h3 {
    margin: 0 0 4px 0;
    font-size: 16px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.9);
  }

  p {
    margin: 0;
    color: rgba(0, 0, 0, 0.6);
    font-size: 13px;
  }
`;

export const MultiSelectToggle = styled.button`
  padding: 8px 16px;
  border: 1px solid #0a66c2;
  background: #ffffff;
  border-radius: 18px;
  font-size: 13px;
  font-weight: 600;
  color: #0a66c2;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: rgba(10, 102, 194, 0.06);
  }
`;

export const SelectedPreview = styled.div`
  background: rgba(10, 102, 194, 0.02);
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 24px;
  margin: 32px 0;

  h4 {
    font-size: 16px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.9);
    margin: 0;
  }
`;

export const SubcategoryEmptyState = styled(CategoryEmptyState)``;

export const ProfilePreview = styled(CategoryPreview)``;

export const FileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
  width: 100%;
`;

export const ProgressBarWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  width: 100%;

  span {
    font-size: 13px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.6);
    min-width: 50px;
  }
`;

export const CharacterCounter = styled.div`
  margin-top: 4px;
  text-align: right;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 500;
  width: 100%;
`;

export const PricingPreview = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background: rgba(10, 102, 194, 0.04);
  border: 1px solid rgba(10, 102, 194, 0.2);
  border-radius: 12px;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
`;

export const PriceRangeSlider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e0e0e0;
  outline: none;
  appearance: none;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #0a66c2;
    cursor: pointer;
  }
`;

export const SmartPricingCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;

  &:hover {
    border-color: #0a66c2;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

export const PricingStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
  width: 100%;

  > div {
    text-align: center;
    padding: 16px;
    background: #f4f2ee;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
  }
`;

export const SelectedPriceTag = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #0a66c2;
  margin-bottom: 4px;
`;

export const FeatureGrid = styled.div`
  display: grid;
  gap: 20px;
  margin: 32px 0;
  width: 100%;
`;

export const ValidationSummary = styled.div`
  background: rgba(211, 47, 47, 0.04);
  border: 1px solid rgba(211, 47, 47, 0.2);
  border-radius: 8px;
  padding: 16px;
  margin: 24px 0;
  width: 100%;
  box-sizing: border-box;
`;

export const PricingFieldsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 32px 0;
  width: 100%;
`;

export const FilePreview = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-top: 8px;
  width: 100%;
  box-sizing: border-box;
`;

export const FileInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const FileName = styled.span`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.9);
  font-weight: 600;
`;

export const FileSize = styled.span`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
`;

export const RemoveFileButton = styled.button`
  background: none;
  border: none;
  color: #d32f2f;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;

  &:hover {
    background: rgba(211, 47, 47, 0.06);
  }
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  margin-top: 8px;
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  height: 100%;
  background: #0a66c2;
  transition: width 0.3s ease;
  width: ${({ percent }) => `${percent}%`};
`;

export const UploadStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #e7f3ff;
  border-radius: 4px;
  color: #0a66c2;
  font-size: 14px;
  font-weight: 500;
  width: 100%;
  box-sizing: border-box;
`;

export const SuccessCard = styled.div`
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.15);
  width: 100%;
  box-sizing: border-box;
`;