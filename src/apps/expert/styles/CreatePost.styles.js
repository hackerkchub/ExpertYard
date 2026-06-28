import styled, { keyframes } from "styled-components";

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const CreatePostCard = styled.div`
  background: #ffffff;
  border-radius: 24px;
  padding: 32px;
  max-width: 900px;
  margin: 0 auto;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8edf4;
  animation: ${slideIn} 0.4s ease-out;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 16px;
  }

  @media (max-width: 480px) {
    padding: 16px;
  }
`;

export const LoaderOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100;
  border-radius: 24px;

  p {
    margin-top: 16px;
    font-size: 15px;
    font-weight: 500;
    color: #0a1628;
  }

  @media (max-width: 480px) {
    border-radius: 16px;
  }
`;

export const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  background: #dcfce7;
  border: 1px solid #86efac;
  border-radius: 12px;
  color: #166534;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 20px;
  animation: ${fadeIn} 0.3s ease;

  svg {
    flex-shrink: 0;
  }
`;

export const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  background: #fee2e2;
  border: 1px solid #fca5a5;
  border-radius: 12px;
  color: #991b1b;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 20px;
  animation: ${fadeIn} 0.3s ease;

  button {
    margin-left: auto;
    background: none;
    border: none;
    color: #991b1b;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: background 0.2s;

    &:hover {
      background: rgba(153, 27, 27, 0.1);
    }
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

export const HeaderTitle = styled.div`
  h3 {
    font-size: 24px;
    font-weight: 700;
    color: #0a1628;
    margin: 0 0 4px 0;
    letter-spacing: -0.3px;
  }

  span {
    font-size: 14px;
    color: #64748b;
  }

  @media (max-width: 480px) {
    h3 {
      font-size: 20px;
    }
  }
`;

export const HeaderActions = styled.div`
  .back-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 18px;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    color: #475569;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;

    &:hover {
      background: #e2e8f0;
      transform: translateX(-2px);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 14px 18px;
  border-radius: 14px;
  border: 2px solid #e2e8f0;
  font-size: 16px;
  font-weight: 500;
  color: #0a1628;
  transition: all 0.2s;
  font-family: inherit;
  background: #fafbfc;
  margin-bottom: 20px;

  &::placeholder {
    color: #94a3b8;
    font-weight: 400;
  }

  &:focus {
    outline: none;
    border-color: #0a1628;
    background: #ffffff;
    box-shadow: 0 0 0 4px rgba(10, 22, 40, 0.06);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    font-size: 15px;
    padding: 12px 14px;
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: 14px 18px;
  border-radius: 14px;
  border: 2px solid #e2e8f0;
  font-size: 15px;
  font-weight: 400;
  color: #0a1628;
  transition: all 0.2s;
  font-family: inherit;
  resize: vertical;
  background: #fafbfc;
  line-height: 1.6;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    outline: none;
    border-color: #0a1628;
    background: #ffffff;
    box-shadow: 0 0 0 4px rgba(10, 22, 40, 0.06);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    min-height: 150px;
    font-size: 14px;
    padding: 12px 14px;
  }
`;

export const MediaActions = styled.div`
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ImageUploadArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  border: 2px dashed #e2e8f0;
  border-radius: 16px;
  background: #fafbfc;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 180px;

  &:hover {
    border-color: #0a1628;
    background: #f8fafc;
    transform: translateY(-2px);
  }

  .upload-btn {
    display: inline-block;
    padding: 8px 20px;
    background: #0a1628;
    color: white;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    transition: background 0.2s;

    &:hover {
      background: #1a2a4a;
    }
  }

  @media (max-width: 480px) {
    padding: 24px 16px;
    min-height: 140px;

    .upload-btn {
      padding: 6px 16px;
      font-size: 12px;
    }
  }
`;

export const UploadIcon = styled.div`
  color: #64748b;
  margin-bottom: 12px;

  svg {
    stroke-width: 1.5;
  }
`;

export const UploadText = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #0a1628;
  margin-bottom: 4px;
`;

export const UploadSubtext = styled.div`
  font-size: 13px;
  color: #94a3b8;
  margin-bottom: 12px;
`;

export const PreviewNote = styled.div`
  font-size: 13px;
  color: #64748b;
  padding: 8px 12px;
  background: #f1f5f9;
  border-radius: 8px;
  margin-top: 4px;
`;

export const ImagePreview = styled.div`
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 20px;
  border: 2px solid #e2e8f0;
  background: #fafbfc;

  img {
    width: 100%;
    max-height: 400px;
    object-fit: cover;
    display: block;
  }

  @media (max-width: 480px) {
    img {
      max-height: 250px;
    }
  }
`;

export const ImageRemoveBtn = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(220, 38, 38, 0.9);
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    padding: 4px 10px;
    font-size: 12px;
  }
`;

export const ImageActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #475569;
  cursor: pointer;
  padding: 8px 16px;
  background: #f1f5f9;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: #e2e8f0;
  }
`;

export const FooterActions = styled.div`
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e8edf4;

  .btn-group {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .draft-btn {
    background: #f1f5f9;
    color: #475569;
    border: 1px solid #e2e8f0;

    &:hover:not(:disabled) {
      background: #e2e8f0;
      transform: translateY(-2px);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .publish-btn {
    background: #0a1628;
    color: white;

    &:hover:not(:disabled) {
      background: #1a2a4a;
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(10, 22, 40, 0.2);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  @media (max-width: 480px) {
    .btn-group {
      flex-direction: column;
    }

    .btn-group button {
      width: 100%;
      justify-content: center;
    }
  }
`;

export const CharCounter = styled.div`
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 12px;
  color: #94a3b8;
  background: rgba(255, 255, 255, 0.85);
  padding: 2px 10px;
  border-radius: 6px;
  pointer-events: none;
  font-weight: 500;

  @media (max-width: 480px) {
    font-size: 11px;
    padding: 2px 8px;
  }
`;