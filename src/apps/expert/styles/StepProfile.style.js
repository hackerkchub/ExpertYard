// src/apps/expert/styles/Register.styles.js
import styled from "styled-components";

// मुख्य कंटेनर (पूरी चौड़ाई लेगा बिना ओवरफ्लो)
export const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px; /* यूज़र फ्रेंडली चौड़ाई */
  margin: 0 auto;
  background: #ffffff;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

// दस्तावेज़ों की लिस्ट (एक के नीचे एक)
export const DocumentsListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  width: 100%;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 6px;
`;

export const Input = styled.input`
  padding: 12px 14px;
  border-radius: 10px;
  border: 1.5px solid #e2e8f0;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
  background: ${(props) => (props.disabled ? "#f8fafc" : "#fff")};

  &:focus {
    outline: none;
    border-color: #0ea5ff;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
  }
`;

export const TextArea = styled.textarea`
  padding: 12px 14px;
  border-radius: 10px;
  border: 1.5px solid #e2e8f0;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #0ea5ff;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
  }
`;

// 📐 चौड़ाई में ओवरफ्लो रोकने के लिए सीधा हॉरिजॉन्टल अपलोडर
export const UploadWidget = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1.5px dashed #cbd5e1;
  border-radius: 12px;
  padding: 14px;
  background: #f8fafc;
  cursor: pointer;
  position: relative;
  width: 100%;
  box-sizing: border-box;

  &:hover {
    background: #f1f5f9;
    border-color: #0ea5ff;
  }
`;

export const UploadWidgetIcon = styled.div`
  width: 40px;
  height: 40px;
  background: #e0f2fe;
  color: #0ea5ff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const FileInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
`;

export const FilePreview = styled.div`
  display: flex;
  align-items: center;
  padding: 14px;
  background: #f0fdf4;
  border: 1.5px solid #bbf7d0;
  border-radius: 12px;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
`;

export const FileInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const FileName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const FileSize = styled.span`
  font-size: 12px;
  color: #10b981;
`;

export const RemoveFileButton = styled.button`
  background: #fee2e2;
  color: #ef4444;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    background: #fecaca;
  }
`;

export const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #ef4444;
  font-size: 13px;
  font-weight: 500;
  margin-top: 4px;
`;

export const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    
    button {
      width: 100%;
    }
  }
`;

export const PrimaryButton = styled.button`
  background: #0ea5ff;
  color: #fff;
  border: none;
  padding: 13px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled.button`
  background: #fff;
  color: #64748b;
  border: 1px solid #e2e8f0;
  padding: 13px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    order: 2;
  }
`;