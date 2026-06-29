import styled from "styled-components";

export const PageWrapper = styled.div`
  background-color: #f3f2ef;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 20px 10px;
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  @media (min-width: 768px) { padding: 40px 20px; }
`;

export const FormContainer = styled.div`
  background: white;
  width: 100%;
  max-width: 920px;
  border-radius: 8px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 24px;
`;

export const FormHeader = styled.div`
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 24px;
  padding-bottom: 16px;
  h2 { color: rgba(0, 0, 0, 0.9); font-size: 22px; font-weight: 600; margin: 0; }
  p { color: rgba(0, 0, 0, 0.6); font-size: 14px; margin-top: 4px; }
`;

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  @media (min-width: 600px) { grid-template-columns: 1fr 1fr; gap: 20px; }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  label { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: rgba(0, 0, 0, 0.7); }
  input, textarea, select {
    padding: 10px 12px;
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    font-size: 14px;
    width: 100%;
    background: #fff;
    font-family: inherit;
    &:focus { outline: none; border-color: #0a66c2; box-shadow: 0 0 0 1px #0a66c2; }
  }

  textarea {
    resize: vertical;
    line-height: 1.5;
  }
`;

// New Compact Upload Styles
export const CompactUploadBox = styled.div`
  background: #f8f9fa;
  border: 1px dashed #0a66c2;
  border-radius: 6px;
  padding: 12px;
`;

export const UploadTrigger = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #0a66c2;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  &:hover { text-decoration: underline; }
`;

export const FileStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    .filename { font-size: 14px; font-weight: 600; color: #333; word-break: break-all; }
    .status { font-size: 12px; color: #057642; font-weight: 500; }
  }
  button {
    background: none;
    border: 1px solid #0a66c2;
    color: #0a66c2;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    &:hover { background: #f0f7ff; }
  }
`;

export const SectionTitle = styled.h3`
  font-size: 18px;
  color: #333;
  margin: 10px 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const BuilderSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 18px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;

  @media (max-width: 640px) {
    padding: 14px;
  }
`;

export const CheckboxLine = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #334155;
  font-size: 14px;
  font-weight: 600;

  input {
    width: 16px;
    height: 16px;
  }
`;

export const FileBuilderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const FileBuilderRow = styled.div`
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) auto;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f8fafc;

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
    min-height: 36px;
    border: 1px solid #d1d5db;
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
  padding: 12px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  ${(props) => props.$type === "success" 
    ? `background: #e7f4ed; color: #057642; border: 1px solid #057642;` 
    : `background: #f9eaea; color: #cc1011; border: 1px solid #cc1011;`}
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
  padding: 8px 0;
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
  font-weight: 500;

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
  border-radius: 24px;
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 160px;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #004182;
  }

  .spinning {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
