import styled from "styled-components";

export const PageWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  overflow-x: hidden;
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: max(16px, env(safe-area-inset-top, 0px)) 16px max(32px, calc(20px + env(safe-area-inset-bottom, 0px)));
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #0f172a;
  box-sizing: border-box;

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  @media (max-width: 768px) {
    padding: max(12px, env(safe-area-inset-top, 0px)) 12px max(24px, calc(16px + env(safe-area-inset-bottom, 0px)));
  }

  @media (max-width: 360px) {
    padding-inline: 8px;
  }
`;

export const FormContainer = styled.div`
  background: #ffffff;
  width: 100%;
  max-width: 1128px;
  min-width: 0;
  border: none;
  box-shadow: none;
  padding: 0;
  margin: 0 auto;
  overflow: visible;
`;

export const FormHeader = styled.div`
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 20px;
  padding-bottom: 16px;
  background: #ffffff;

  h2 {
    color: #000080;
    font-size: clamp(20px, 3vw, 26px);
    line-height: 1.2;
    font-weight: 700;
    margin: 0;
    overflow-wrap: break-word;
  }

  p {
    color: #64748b;
    font-size: 14px;
    line-height: 1.45;
    margin: 6px 0 0;
    overflow-wrap: break-word;
  }
`;

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
  width: 100%;
  background: #ffffff;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  width: 100%;

  label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    line-height: 1.35;
    font-weight: 600;
    color: #334155;
    overflow-wrap: break-word;
  }

  input, textarea, select {
    width: 100%;
    min-width: 0;
    min-height: 48px;
    padding: 12px 14px;
    border: 1px solid #cbd5e1;
    border-radius: 10px;
    font-size: 16px;
    color: #0f172a;
    background: #ffffff;
    font-family: inherit;
    transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: #000080;
      box-shadow: 0 0 0 2px rgba(0, 0, 128, 0.15);
      background: #ffffff;
    }
  }

  textarea {
    resize: vertical;
    line-height: 1.45;
    min-height: 112px;
  }
`;

// Compact Upload Styles
export const CompactUploadBox = styled.div`
  min-width: 0;
  background: #ffffff;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  padding: 14px;
  width: 100%;
  box-sizing: border-box;
`;

export const UploadTrigger = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  color: #000080;
  cursor: pointer;
  font-weight: 700;
  font-size: 14px;
  line-height: 1.4;
  text-align: center;
  min-height: 48px;
  padding: 4px;
  overflow-wrap: break-word;

  &:hover {
    color: #1e3a8a;
  }
`;

export const FileStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  width: 100%;

  .info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;

    .filename {
      font-size: 14px;
      line-height: 1.35;
      font-weight: 700;
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
    border: 1px solid #000080;
    color: #000080;
    padding: 8px 14px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    &:hover { background: #eef2ff; }
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
  font-size: 1.05rem;
  line-height: 1.35;
  color: #000080;
  margin: 0;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-wrap: break-word;

  svg {
    flex: 0 0 auto;
    color: #000080;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  padding-top: 8px;
  min-width: 0;
  width: 100%;
  background: #ffffff;

  @media (max-width: 768px) {
    justify-content: stretch;
  }
`;

export const BuilderSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
  width: 100%;
  padding: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 12px;
    gap: 14px;
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
    width: 18px;
    height: 18px;
    accent-color: #000080;
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
  width: 100%;
`;

export const FileBuilderRow = styled.div`
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) auto;
  gap: 12px;
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
  min-width: 0;
  width: 100%;
  box-sizing: border-box;

  .file-icon {
    width: 42px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: #eef2ff;
    color: #000080;
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
    min-height: 40px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 0 12px;
    font-size: 14px;
    box-sizing: border-box;
    background: #ffffff;
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
    width: 38px;
    height: 38px;
    border: 0;
    border-radius: 10px;
    background: #ffe4e6;
    color: #e11d48;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
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

export const Alert = styled.div`
  padding: 14px 16px;
  border-radius: 12px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  line-height: 1.45;
  font-weight: 650;
  overflow-wrap: break-word;
  width: 100%;
  box-sizing: border-box;
  ${(props) => props.$type === "success" 
    ? `background: #ecfdf5; color: #047857; border: 1px solid #10b981;` 
    : `background: #fff1f2; color: #be123c; border: 1px solid #f43f5e;`}

  svg {
    flex: 0 0 auto;
    margin-top: 2px;
  }
`;

export const EditorWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  background: #ffffff;
  .ql-container {
    min-height: 120px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    font-family: inherit;
    font-size: 15px;
    background: #ffffff;
  }
  .ql-toolbar {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background: #ffffff;
    border-color: #cbd5e1;
  }
  .ql-editor.ql-blank::before {
    font-style: normal;
    color: rgba(0,0,0,0.3);
  }
`;

export const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 0 4px;
  min-width: 0;
  width: 100%;
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
  background: #000080;
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
  color: #000080;
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

export const SubmitButton = styled.button`
  background-color: ${props => props.disabled ? '#cbd5e0' : '#000080'};
  color: white;
  border: none;
  border-radius: 24px;
  padding: 12px 28px;
  font-size: 16px;
  font-weight: 700;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  max-width: 100%;
  min-height: 48px;
  transition: background-color 0.2s, transform 0.2s, box-shadow 0.2s;

  &:hover:not(:disabled) {
    background-color: #1e3a8a;
  }

  .spinning {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
