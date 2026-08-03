// ManageReels.styles.js - Updated with fixes
import styled from "styled-components";

export const PageContainer = styled.div`
  padding: 24px;
  padding-bottom: 120px; /* Increased bottom padding for mobile menu */
  max-width: 1200px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #1f2937;
  background: #f8fafc;
  min-height: 100vh;

  @media (max-width: 640px) {
    padding: 16px;
    padding-bottom: 140px; /* Extra padding for mobile bottom menu */
  }
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: #000080;
  margin: 0;
  letter-spacing: -0.5px;

  @media (max-width: 640px) {
    font-size: 24px;
  }
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;

  @media (max-width: 640px) {
    font-size: 13px;
  }
`;

export const UploadButton = styled.button`
  background: linear-gradient(135deg, #ffd23f, #f4c542);
  border: none;
  color: #000080;
  padding: 14px 28px;
  border-radius: 14px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 16px rgba(244, 197, 66, 0.35);
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 28px rgba(244, 197, 66, 0.5);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 640px) {
    justify-content: center;
    padding: 12px 20px;
    font-size: 14px;
  }

  @media (max-width: 600px) {
    width: 100%;
    padding: 14px;
  }
`;

export const ReelsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 28px;
  margin-bottom: 20px;

  @media (min-width: 1025px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  @media (max-width: 540px) {
    grid-template-columns: 1fr;
  }
`;

export const ReelCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.08);
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-6px) scale(1.008);
    box-shadow: 0 30px 60px rgba(15, 23, 42, 0.12);
    border-color: #d1d5db;
  }

  @media (max-width: 768px) {
    border-radius: 16px;
  }
`;

export const VideoPreviewWrapper = styled.div`
  width: 100%;
  aspect-ratio: 9/16;
  max-height: 380px;
  background: #0a0a0a;
  position: relative;
  overflow: hidden;
  cursor: pointer;
`;

export const CardVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: ${props => props.playing ? 'block' : 'none'};
  background: #000;
`;

export const CardThumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
  display: ${props => props.playing ? 'none' : 'block'};
  background: #0a0a0a;

  ${ReelCard}:hover & {
    transform: scale(1.02);
  }
`;

export const ThumbnailOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(0, 0, 0, 0.3) 100%);
  pointer-events: none;
  display: ${props => props.playing ? 'none' : 'block'};
`;

export const PlayIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 52px;
  height: 52px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000080;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  z-index: 2;
  display: ${props => props.playing ? 'none' : 'flex'};

  ${ReelCard}:hover & {
    transform: translate(-50%, -50%) scale(1.05);
  }

  svg {
    width: 24px;
    height: 24px;
    margin-left: 3px;
  }
`;

export const StatusBadge = styled.span`
  position: absolute;
  top: 14px;
  right: 14px;
  padding: 6px 16px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: #ffffff;
  letter-spacing: 0.3px;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 2;

  ${props => {
    switch (props.status) {
      case 1: return `
        background: linear-gradient(135deg, #10b981, #059669);
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
      `;
      case 0: return `
        background: linear-gradient(135deg, #f59e0b, #d97706);
        box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
      `;
      case 2: return `
        background: linear-gradient(135deg, #ef4444, #dc2626);
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
      `;
      case 3: return `
        background: linear-gradient(135deg, #1f2937, #111827);
        box-shadow: 0 4px 12px rgba(31, 41, 55, 0.4);
      `;
      default: return `
        background: linear-gradient(135deg, #6b7280, #4b5563);
        box-shadow: 0 4px 12px rgba(107, 114, 128, 0.4);
      `;
    }
  }}

  @media (max-width: 640px) {
    font-size: 10px;
    padding: 5px 12px;
    top: 10px;
    right: 10px;
  }
`;

export const StatusDot = styled.span`
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  margin-right: 6px;
  animation: ${props => props.pulsing ? 'pulse 2s infinite' : 'none'};

  ${props => {
    switch (props.status) {
      case 1: return 'background: #10b981;';
      case 0: return 'background: #f59e0b;';
      case 2: return 'background: #ef4444;';
      case 3: return 'background: #6b7280;';
      default: return 'background: #9ca3af;';
    }
  }}

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
`;

export const ReelContent = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;

  @media (max-width: 640px) {
    padding: 16px;
  }
`;

export const ReelTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 6px;
  line-height: 1.4;

  @media (max-width: 640px) {
    font-size: 16px;
  }
`;

export const ReelCaption = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 14px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid #f3f4f6;

  @media (max-width: 640px) {
    gap: 8px;
  }
`;

export const MetaTag = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  background: #f3f4f6;
  padding: 4px 12px;
  border-radius: 100px;

  strong {
    color: #374151;
    font-weight: 600;
  }

  @media (max-width: 640px) {
    font-size: 11px;
    padding: 3px 10px;
  }
`;

export const RejectedReasonBox = styled.div`
  background: #fef2f2;
  border: 1px solid #fee2e2;
  color: #991b1b;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 13px;
  margin-bottom: 14px;
  line-height: 1.5;

  strong {
    font-weight: 700;
    display: block;
    margin-bottom: 4px;
    color: #dc2626;
  }

  @media (max-width: 640px) {
    font-size: 12px;
    padding: 10px 14px;
  }
`;

export const AnalyticsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
  background: #f9fafb;
  border: 1px solid #f3f4f6;
  border-radius: 14px;
  padding: 10px;
  margin-top: auto;

  @media (max-width: 640px) {
    padding: 8px;
    gap: 4px;
  }
`;

export const AnalyticItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 4px 2px;
  border-radius: 8px;
  transition: background 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.02);
  }

  svg {
    width: 16px;
    height: 16px;
    color: #6b7280;
  }

  span.count {
    font-weight: 700;
    color: #111827;
    font-size: 13px;
  }

  span.label {
    font-size: 9px;
    color: #9ca3af;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.3px;
  }

  @media (max-width: 640px) {
    svg {
      width: 14px;
      height: 14px;
    }
    span.count {
      font-size: 11px;
    }
    span.label {
      font-size: 8px;
    }
  }
`;

export const ActionsRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 14px;

  @media (max-width: 640px) {
    gap: 8px;
  }
`;

export const ActionButton = styled.button`
  flex: 1;
  padding: 11px 16px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.25s ease;

  ${props => {
    if (props.variant === "primary") {
      return `
        background: #000080;
        border: 1px solid #000080;
        color: #ffffff;
        box-shadow: 0 2px 8px rgba(0, 0, 128, 0.2);

        &:hover {
          background: #05044f;
          box-shadow: 0 4px 16px rgba(0, 0, 128, 0.35);
          transform: translateY(-1px);
        }
      `;
    } else if (props.variant === "danger") {
      return `
        background: #fef2f2;
        border: 1px solid #fee2e2;
        color: #dc2626;

        &:hover {
          background: #fee2e2;
          border-color: #fca5a5;
          transform: translateY(-1px);
        }
      `;
    } else {
      return `
        background: #f3f4f6;
        border: 1px solid #e5e7eb;
        color: #4b5563;

        &:hover {
          background: #e5e7eb;
          transform: translateY(-1px);
        }
      `;
    }
  }}

  svg {
    width: 16px;
    height: 16px;
  }

  @media (max-width: 640px) {
    font-size: 12px;
    padding: 10px 12px;
  }
`;

export const SubmitButtonFull = styled(ActionButton)`
  margin-top: 8px;
  width: 100%;
  background: linear-gradient(135deg, #10b981, #059669);
  border: 1px solid #10b981;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);

  &:hover {
    background: linear-gradient(135deg, #059669, #047857);
    box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
    transform: translateY(-2px);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

// ===== EMPTY STATE =====
export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 40px;
  background: #ffffff;
  border-radius: 24px;
  border: 2px dashed #e5e7eb;

  .icon {
    font-size: 64px;
    margin-bottom: 16px;
    display: block;
  }

  h3 {
    font-size: 22px;
    font-weight: 700;
    color: #111827;
    margin: 0 0 8px;
  }

  p {
    font-size: 15px;
    color: #6b7280;
    margin: 0 0 24px;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }

  @media (max-width: 640px) {
    padding: 40px 20px;

    .icon {
      font-size: 48px;
    }

    h3 {
      font-size: 18px;
    }

    p {
      font-size: 14px;
    }
  }
`;

// ===== MODAL - FIXED Z-INDEX =====
export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999; /* Highest z-index to appear above everything */
  animation: fadeIn 0.25s ease;
  padding: 20px;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (max-width: 640px) {
    padding: 12px;
    align-items: flex-end; /* Align to bottom on mobile */
  }
`;

export const ModalContainer = styled.div`
  background: #ffffff;
  border-radius: 24px;
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
  }

  @media (max-width: 640px) {
    width: 100%;
    max-height: 85vh;
    border-radius: 20px 20px 0 0;
    animation: slideUpMobile 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    @keyframes slideUpMobile {
      from {
        opacity: 0;
        transform: translateY(50px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }
`;

export const ModalHeader = styled.div`
  padding: 24px 28px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: #ffffff;
  z-index: 10;
  border-radius: 24px 24px 0 0;
  flex-shrink: 0;

  h2 {
    font-size: 22px;
    font-weight: 700;
    color: #000080;
    margin: 0;
  }

  @media (max-width: 640px) {
    padding: 18px 20px;
    border-radius: 20px 20px 0 0;

    h2 {
      font-size: 18px;
    }
  }
`;

export const CloseButton = styled.button`
  background: #f3f4f6;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  transition: all 0.2s ease;

  &:hover {
    background: #e5e7eb;
    color: #111827;
    transform: rotate(90deg);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const Form = styled.form`
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  overflow-y: auto;

  @media (max-width: 640px) {
    padding: 20px;
    gap: 14px;
  }
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

    .required {
      color: #ef4444;
      margin-left: 2px;
    }
  }
`;

export const Input = styled.input`
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 14px;
  color: #111827;
  height: 48px;
  transition: all 0.25s ease;
  background: #ffffff;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #ffd23f;
    box-shadow: 0 0 0 4px rgba(255, 210, 63, 0.15);
  }

  &::placeholder {
    color: #9ca3af;
  }

  @media (max-width: 640px) {
    height: 44px;
    padding: 10px 14px;
    font-size: 13px;
  }
`;

export const Textarea = styled.textarea`
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 14px;
  color: #111827;
  min-height: 80px;
  resize: vertical;
  transition: all 0.25s ease;
  font-family: inherit;
  background: #ffffff;

  &:focus {
    outline: none;
    border-color: #ffd23f;
    box-shadow: 0 0 0 4px rgba(255, 210, 63, 0.15);
  }

  &::placeholder {
    color: #9ca3af;
  }

  @media (max-width: 640px) {
    font-size: 13px;
    padding: 10px 14px;
    min-height: 70px;
  }
`;

export const Select = styled.select`
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 14px;
  color: #111827;
  height: 48px;
  background: #ffffff;
  transition: all 0.25s ease;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;

  &:focus {
    outline: none;
    border-color: #ffd23f;
    box-shadow: 0 0 0 4px rgba(255, 210, 63, 0.15);
  }

  @media (max-width: 640px) {
    height: 44px;
    padding: 10px 14px;
    font-size: 13px;
  }
`;

export const FileUploadArea = styled.div`
  border: 2px dashed #d1d5db;
  border-radius: 14px;
  padding: 32px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafbfc;
  position: relative;

  &:hover {
    border-color: #ffd23f;
    background: #fffbeb;
  }

  .icon {
    font-size: 36px;
    margin-bottom: 8px;
    display: block;
  }

  .upload-text {
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    margin: 0;
  }

  .upload-hint {
    font-size: 12px;
    color: #9ca3af;
    margin: 4px 0 0;
  }

  input[type="file"] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }
`;

export const FilePreview = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: #f3f4f6;
  border-radius: 10px;
  margin-top: 8px;

  .file-icon {
    font-size: 20px;
  }

  .file-name {
    font-size: 13px;
    font-weight: 500;
    color: #374151;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .file-size {
    font-size: 11px;
    color: #9ca3af;
  }

  .remove-file {
    background: none;
    border: none;
    color: #ef4444;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: background 0.2s;

    &:hover {
      background: #fef2f2;
    }
  }
`;

export const SubmitButton = styled.button`
  background: linear-gradient(135deg, #ffd23f, #f4c542);
  border: none;
  color: #000080;
  padding: 16px;
  border-radius: 14px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  margin-top: 6px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(244, 197, 66, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(244, 197, 66, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 640px) {
    padding: 14px;
    font-size: 15px;
  }
`;

export const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 40px;
`;

export const InlineSpinner = styled.div`
  width: 36px;
  height: 36px;
  border: 3px solid rgba(0, 0, 80, 0.1);
  border-left-color: #ffd23f;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const CancelButton = styled.button`
  background: #f3f4f6;
  border: 2px solid #e5e7eb;
  color: #4b5563;
  padding: 14px;
  border-radius: 14px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background: #e5e7eb;
    border-color: #d1d5db;
  }

  @media (max-width: 640px) {
    padding: 12px;
    font-size: 14px;
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 6px;
  flex-shrink: 0;

  ${CancelButton} {
    flex: 0.4;
  }

  ${SubmitButton} {
    flex: 0.6;
  }

  @media (max-width: 640px) {
    flex-direction: column;

    ${CancelButton}, ${SubmitButton} {
      flex: 1;
    }
  }
`;