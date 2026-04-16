import styled from "styled-components";

export const PageWrapper = styled.div`
  background-color: #f3f2ef;
  min-height: 100vh;
  padding: 20px 10px;
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
`;

export const Container = styled.div`
  max-width: 950px;
  margin: 0 auto;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;

  .header-text {
    flex: 1;
    min-width: 250px;
  }

  h1 { font-size: 24px; color: #1d1d1d; margin: 0; font-weight: 600; }
  p { color: #666; font-size: 14px; margin-top: 4px; }
`;

export const ActionGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media (max-width: 500px) {
    width: 100%;
    flex-direction: column;
    button { width: 100%; justify-content: center; }
  }
`;

export const AddButton = styled.button`
  background-color: #0a66c2;
  color: white;
  border: none;
  border-radius: 24px;
  padding: 10px 20px;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: 0.2s;
  &:hover { background-color: #004182; }
`;

export const BookingButton = styled.button`
  background-color: transparent;
  color: #0a66c2;
  border: 1px solid #0a66c2;
  border-radius: 24px;
  padding: 10px 20px;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: 0.2s;
  &:hover { background-color: rgba(10, 102, 194, 0.1); }
`;

export const ServiceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ServiceCard = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  display: flex;
  overflow: hidden;
  &:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
  @media (max-width: 650px) { flex-direction: column; }
`;

export const ServiceImage = styled.img`
  width: 200px;
  object-fit: cover;
  background: #f0f2f5;
  @media (max-width: 650px) { width: 100%; height: 180px; }
`;

export const ServiceInfo = styled.div`
  padding: 16px;
  flex: 1;
  .top-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
  .price { font-size: 18px; font-weight: 700; color: #0a66c2; }
  h3 { font-size: 18px; color: #1d1d1d; margin: 0 0 8px 0; }
  .description { font-size: 14px; color: #666; line-height: 1.4; margin-bottom: 12px; }
`;

export const DeliverablesPreview = styled.div`
  background: #f8f9fa;
  padding: 10px;
  border-radius: 6px;
  font-size: 13px;
  border-left: 3px solid #0a66c2;
  strong { display: block; margin-bottom: 4px; color: #333; }
  .html-content { color: #555; ul, ol { padding-left: 18px; margin: 0; } }
`;

export const StatusBadge = styled.span`
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 700;
  padding: 2px 10px;
  border-radius: 12px;
  background: ${props => props.$status?.toLowerCase() === 'active' ? '#e7f4ed' : '#f9eaea'};
  color: ${props => props.$status?.toLowerCase() === 'active' ? '#057642' : '#cc1011'};
`;

export const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  border-left: 1px solid #eee;
  background: #fafafa;
  button {
    flex: 1;
    width: 60px;
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    &:hover { background: #f0f2f5; color: #0a66c2; }
    &.delete:hover { color: #d93025; }
  }
  @media (max-width: 650px) { flex-direction: row; border-left: none; border-top: 1px solid #eee; button { padding: 12px; width: 33.3%; } }
`;

export const LoadingBox = styled.div`text-align: center; padding: 40px; color: #666;`;
export const ErrorBox = styled.div`text-align: center; padding: 20px; color: #cc1011; background: #f9eaea; border-radius: 8px;`;
export const EmptyState = styled.div`text-align: center; padding: 60px; background: white; border-radius: 8px; h3 { margin-top: 16px; color: #333; }`;

// Add these to your existing styles

export const ModalOverlay = styled.div`
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from { transform: translateY(50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

export const DeleteConfirmModal = styled.div`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from { transform: translateY(50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;

  h2 {
    margin: 0;
    font-size: 1.25rem;
    color: #1a202c;
  }

  .close-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: all 0.2s;

    &:hover {
      background: #f7fafc;
    }
  }
`;

export const ModalBody = styled.div`
  padding: 1.5rem;

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-weight: 500;
    color: #2d3748;
    font-size: 0.875rem;
  }

  input, textarea, select {
    padding: 0.625rem;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 0.875rem;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: #4299e1;
      box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
    }
  }

  textarea {
    resize: vertical;
    font-family: inherit;
  }

  small {
    font-size: 0.75rem;
    color: #718096;
  }
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const ImagePreview = styled.div`
  position: relative;
  width: 100%;
  max-width: 200px;
  margin-bottom: 0.5rem;

  img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }

  .remove-image {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #e53e3e;
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: #c53030;
    }
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  margin-top: 1rem;
  border-top: 1px solid #e2e8f0;

  button {
    padding: 0.625rem 1.25rem;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    &.cancel {
      background: #f7fafc;
      border: 1px solid #e2e8f0;
      color: #4a5568;

      &:hover {
        background: #edf2f7;
      }
    }

    &.submit {
      background: #4299e1;
      border: none;
      color: white;

      &:hover:not(:disabled) {
        background: #3182ce;
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    &.delete-confirm {
      background: #e53e3e;
      border: none;
      color: white;

      &:hover:not(:disabled) {
        background: #c53030;
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  }
`;