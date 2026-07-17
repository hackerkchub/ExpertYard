import styled from "styled-components";

export const PageContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #1f2937;
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #000080;
  margin: 0;
`;

export const UploadButton = styled.button`
  background: linear-gradient(135deg, #ffd23f, #f4c542);
  border: none;
  color: #000080;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 14px rgba(244, 197, 66, 0.4);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(244, 197, 66, 0.6);
  }
`;

export const ReelsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;

  @media (min-width: 1025px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const ReelCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

export const VideoPreviewWrapper = styled.div`
  width: 100%;
  aspect-ratio: 9/16;
  max-height: 320px;
  background: #000000;
  position: relative;
  overflow: hidden;
`;

export const CardVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const CardThumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const StatusBadge = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: #ffffff;
  box-shadow: 0 4px 10px rgba(0,0,0,0.25);
  background: ${props => {
    switch (props.status) {
      case 1: return "#10b981"; // Approved (Green)
      case 0: return "#3b82f6"; // Pending (Blue)
      case 2: return "#ef4444"; // Rejected (Red)
      case 3: return "#18181b"; // Blocked (Black/Gray)
      default: return "#f59e0b"; // Draft (Yellow)
    }
  }};
`;

export const ReelContent = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const ReelTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px;
  line-height: 1.4;
`;

export const ReelCaption = styled.p`
  font-size: 13px;
  color: #4b5563;
  margin: 0 0 14px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const RejectedReasonBox = styled.div`
  background: #fef2f2;
  border: 1px solid #fee2e2;
  color: #991b1b;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  margin-bottom: 12px;
  line-height: 1.4;

  strong {
    font-weight: 700;
  }
`;

export const AnalyticsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 4px;
  background: #f9fafb;
  border: 1px solid #f3f4f6;
  border-radius: 12px;
  padding: 8px;
  margin-top: auto;
  text-align: center;
`;

export const AnalyticItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: #6b7280;

  svg {
    width: 14px;
    height: 14px;
    color: #4b5563;
  }

  span.count {
    font-weight: 700;
    color: #111827;
    font-size: 11px;
  }
`;

export const ActionsRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 14px;
`;

export const ActionButton = styled.button`
  flex: 1;
  background: ${props => props.variant === "primary" ? "#000080" : props.variant === "danger" ? "#fef2f2" : "#f3f4f6"};
  border: 1px solid ${props => props.variant === "primary" ? "transparent" : props.variant === "danger" ? "#fee2e2" : "#e5e7eb"};
  color: ${props => props.variant === "primary" ? "#ffffff" : props.variant === "danger" ? "#dc2626" : "#4b5563"};
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: background-color 0.2s;

  &:hover {
    background: ${props => props.variant === "primary" ? "#05044f" : props.variant === "danger" ? "#fecdd3" : "#e5e7eb"};
  }
`;

// Modal Components
export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContainer = styled.div`
  background: #ffffff;
  border-radius: 20px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
    max-height: 100vh;
    border-radius: 0;
    max-width: 100%;
  }
`;

export const ModalHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-size: 20px;
    font-weight: 700;
    color: #000080;
    margin: 0;
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #4b5563;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

export const ModalBodyWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    overflow-y: auto;
  }
`;

export const PreviewColumn = styled.div`
  width: 280px;
  background: #f8fafc;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  gap: 16px;

  @media (max-width: 768px) {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
    padding: 16px;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
`;

export const FormColumn = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;

  @media (max-width: 768px) {
    overflow-y: visible;
    padding: 16px;
    padding-bottom: 120px;
  }
`;

export const MediaPreviewContainer = styled.div`
  width: 100%;
  aspect-ratio: 9/16;
  max-width: 220px;
  border-radius: 16px;
  overflow: hidden;
  background: #0f172a;
  position: relative;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;

  video, img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    max-width: 140px;
  }
`;

export const PlaceholderPreview = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 13px;
  text-align: center;
  padding: 16px;
  background: #1e293b;
  aspect-ratio: 9/16;

  span {
    margin-top: 12px;
    font-weight: 500;
  }
`;

export const FormFieldsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const UploadBox = styled.div`
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  padding: 18px;
  text-align: center;
  cursor: pointer;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease-in-out;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    border-color: #ffd23f;
    background: #fffdf5;
    color: #000080;
  }

  svg {
    transition: transform 0.2s;
  }

  &:hover svg {
    transform: translateY(-2px);
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 13px;
    font-weight: 600;
    color: #374151;
  }
`;

export const Input = styled.input`
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 14px;
  color: #111827;

  &:focus {
    outline: none;
    border-color: #ffd23f;
  }
`;

export const Textarea = styled.textarea`
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 14px;
  color: #111827;
  min-height: 80px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #ffd23f;
  }
`;

export const Select = styled.select`
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 14px;
  color: #111827;
  background: #ffffff;

  &:focus {
    outline: none;
    border-color: #ffd23f;
  }
`;

export const SubmitButton = styled.button`
  background: linear-gradient(135deg, #ffd23f, #f4c542);
  border: none;
  color: #000080;
  padding: 14px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  margin-top: 10px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;
export const InlineSpinner = styled.div`
  width: 30px;
  height: 30px;
  border: 3px solid rgba(0,0,80,0.1);
  border-left-color: #ffd23f;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
