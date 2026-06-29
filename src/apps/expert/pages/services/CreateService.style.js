import styled from "styled-components";

export const PageWrapper = styled.div`
  width: 100%;
  min-height: 100%;
  overflow-x: hidden;
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.08), transparent 28%),
    linear-gradient(180deg, #f8fafc 0%, #eef3f8 100%);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 32px 20px 64px;
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  @media (min-width: 1440px) {
    padding-top: 40px;
  }

  @media (max-width: 1024px) {
    padding: 28px 18px 56px;
  }

  @media (max-width: 768px) {
    padding: 22px 14px 44px;
  }

  @media (max-width: 430px) {
    padding: 16px 10px 36px;
  }

  @media (max-width: 360px) {
    padding-inline: 8px;
  }
`;

export const FormContainer = styled.div`
  background: white;
  width: min(100%, 980px);
  min-width: 0;
  border: 1px solid #d8e0eb;
  border-radius: 12px;
  box-shadow: 0 16px 38px rgba(15, 23, 42, 0.08);
  padding: clamp(18px, 2.4vw, 30px);
  overflow: hidden;

  @media (min-width: 1440px) {
    width: min(100%, 1040px);
  }

  @media (max-width: 430px) {
    border-radius: 10px;
    padding: 14px;
  }
`;

export const FormHeader = styled.div`
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 24px;
  padding-bottom: 18px;

  h2 {
    color: #0f172a;
    font-size: clamp(22px, 3vw, 30px);
    line-height: 1.15;
    font-weight: 800;
    margin: 0;
    overflow-wrap: break-word;
  }

  p {
    color: #64748b;
    font-size: 14px;
    line-height: 1.45;
    margin: 8px 0 0;
    overflow-wrap: break-word;
  }
`;

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 0;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;

  label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    line-height: 1.35;
    font-weight: 750;
    color: #334155;
    overflow-wrap: break-word;
  }

  input, textarea, select {
    width: 100%;
    min-width: 0;
    min-height: 44px;
    padding: 11px 13px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 14px;
    color: #0f172a;
    background: #fff;
    font-family: inherit;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;

    &:focus {
      outline: none;
      border-color: #0a66c2;
      box-shadow: 0 0 0 3px rgba(10, 102, 194, 0.14);
      background: #ffffff;
    }
  }

  textarea {
    resize: vertical;
    line-height: 1.5;
    min-height: 112px;
  }
`;

// New Compact Upload Styles
export const CompactUploadBox = styled.div`
  min-width: 0;
  background: #f8fafc;
  border: 1px dashed #93c5fd;
  border-radius: 10px;
  padding: 14px;
`;

export const UploadTrigger = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  color: #0a66c2;
  cursor: pointer;
  font-weight: 750;
  font-size: 14px;
  line-height: 1.4;
  text-align: center;
  min-height: 48px;
  padding: 4px;
  overflow-wrap: break-word;

  &:hover {
    color: #004182;
  }
`;

export const FileStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;

  .info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;

    .filename {
      font-size: 14px;
      line-height: 1.35;
      font-weight: 750;
      color: #0f172a;
      overflow-wrap: anywhere;
    }

    .status {
      font-size: 12px;
      color: #057642;
      font-weight: 650;
    }
  }

  button {
    flex: 0 0 auto;
    background: #ffffff;
    border: 1px solid #0a66c2;
    color: #0a66c2;
    padding: 8px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 750;
    cursor: pointer;
    &:hover { background: #f0f7ff; }
  }

  @media (max-width: 430px) {
    align-items: flex-start;
    flex-wrap: wrap;

    button {
      width: 100%;
    }
  }
`;

export const SectionTitle = styled.h3`
  font-size: 17px;
  line-height: 1.35;
  color: #0f172a;
  margin: 0;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-wrap: break-word;

  svg {
    flex: 0 0 auto;
    color: #0a66c2;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  padding-top: 4px;
  min-width: 0;

  @media (max-width: 768px) {
    justify-content: stretch;
  }
`;

export const BuilderSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
  padding: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.04);

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 390px) {
    padding: 14px 12px;
  }
`;

export const CheckboxLine = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #334155;
  font-size: 14px;
  line-height: 1.4;
  font-weight: 700;
  min-width: 0;

  input {
    flex: 0 0 auto;
    width: 16px;
    height: 16px;
  }

  label {
    min-width: 0;
    overflow-wrap: break-word;
  }
`;

export const FileBuilderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
`;

export const FileBuilderRow = styled.div`
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) auto;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #f8fafc;
  min-width: 0;

  .file-icon {
    width: 42px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: #eff6ff;
    color: #0a66c2;
  }

  .file-fields {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  strong,
  span {
    overflow-wrap: anywhere;
  }

  strong {
    color: #111827;
    font-size: 14px;
  }

  span {
    color: #64748b;
    font-size: 12px;
  }

  input[type="text"],
  .file-fields > input {
    width: 100%;
    min-width: 0;
    min-height: 36px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    padding: 0 10px;
    font-size: 13px;
  }

  .file-flags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    color: #334155;
    font-size: 12px;
    line-height: 1.35;
  }

  .file-flags label {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-weight: 600;
  }

  .remove {
    width: 34px;
    height: 34px;
    border: 0;
    border-radius: 8px;
    background: #fee2e2;
    color: #b91c1c;
    cursor: pointer;
  }

  @media (max-width: 560px) {
    grid-template-columns: 34px minmax(0, 1fr);

    .file-icon {
      width: 34px;
      height: 34px;
    }

    .remove {
      grid-column: 2;
      width: 100%;
    }
  }

  @media (max-width: 390px) {
    grid-template-columns: 1fr;

    .file-icon,
    .remove {
      width: 100%;
    }

    .remove {
      grid-column: 1;
    }
  }
`;

// export const SubmitButton = styled.button`
//   background-color: #0a66c2;
//   color: white;
//   border: none;
//   border-radius: 24px;
//   padding: 12px 32px;
//   font-size: 16px;
//   font-weight: 600;
//   cursor: pointer;
//   &:hover { background-color: #004182; }
//   &:disabled { background-color: #cbd5e0; cursor: not-allowed; }
// `;

export const Alert = styled.div`
  padding: 12px 14px;
  border-radius: 10px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  line-height: 1.45;
  font-weight: 650;
  overflow-wrap: break-word;
  ${(props) => props.$type === "success" 
    ? `background: #e7f4ed; color: #057642; border: 1px solid #057642;` 
    : `background: #f9eaea; color: #cc1011; border: 1px solid #cc1011;`}

  svg {
    flex: 0 0 auto;
    margin-top: 2px;
  }
`;

export const EditorWrapper = styled.div`
  .ql-container {
    min-height: 120px;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    font-family: inherit;
    font-size: 14px;
  }
  .ql-toolbar {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    background: #f8f9fa;
  }
  .ql-editor.ql-blank::before {
    font-style: normal;
    color: rgba(0,0,0,0.3);
  }
`;

// Add these new styles to your existing CreateService.style.js

export const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 0 4px;
  min-width: 0;
`;

export const ProgressBarWrapper = styled.div`
  width: 100%;
  height: 6px;
  background-color: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
`;

export const ProgressBar = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #0a66c2, #0057a3);
  border-radius: 4px;
  transition: width 0.3s ease;
  width: ${props => props.$progress || 0}%;
  animation: ${props => props.$progress === 100 ? 'pulse 0.5s ease 3' : 'none'};

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
`;

export const LoaderText = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #0a66c2;
  font-weight: 650;
  overflow-wrap: break-word;

  .spinning {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Update SubmitButton to handle loading state
export const SubmitButton = styled.button`
  background-color: ${props => props.disabled ? '#cbd5e0' : '#0a66c2'};
  color: white;
  border: none;
  border-radius: 999px;
  padding: 12px 28px;
  font-size: 16px;
  font-weight: 800;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: auto;
  max-width: 100%;
  min-height: 46px;
  min-width: 160px;
  transition: background-color 0.2s, transform 0.2s, box-shadow 0.2s;

  &:hover:not(:disabled) {
    background-color: #004182;
    transform: translateY(-1px);
    box-shadow: 0 10px 18px rgba(10, 102, 194, 0.18);
  }

  .spinning {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;
