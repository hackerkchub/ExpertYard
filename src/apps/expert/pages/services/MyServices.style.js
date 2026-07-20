import styled from "styled-components";

export const PageWrapper = styled.div`
  background-color: #f8fafc;
  min-height: 100vh;
  padding: 16px 12px;
  padding-top: max(16px, env(safe-area-inset-top));
  padding-bottom: max(16px, env(safe-area-inset-bottom));
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  
  @media (max-width: 640px) {
    padding: 12px 8px;
  }
`;

export const Container = styled.div`
  max-width: 950px;
  margin: 0 auto;
  width: 100%;
`;

export const StickyHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 40;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 12px 16px;
  margin: -16px -12px 16px -12px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;

  .header-text {
    flex: 1;
    min-width: 200px;
  }

  h1 { 
    font-size: 22px; 
    color: #0f172a; 
    margin: 0; 
    font-weight: 700; 
    letter-spacing: -0.3px;
  }
  p { color: #64748b; font-size: 13px; margin-top: 2px; }
`;

export const ActionGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

  @media (max-width: 500px) {
    width: 100%;
    button { flex: 1; justify-content: center; }
  }
`;

export const AddButton = styled.button`
  background-color: #0a66c2;
  color: white;
  border: none;
  border-radius: 12px;
  min-height: 48px;
  padding: 0 20px;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.2s ease;
  
  &:active {
    transform: scale(0.97);
  }
  &:hover { background-color: #004182; }
`;

export const BookingButton = styled.button`
  background-color: #f1f5f9;
  color: #0a66c2;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  min-height: 48px;
  padding: 0 20px;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.2s ease;
  
  &:active {
    transform: scale(0.97);
  }
  &:hover { background-color: #e2e8f0; }
`;

export const SearchFilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

export const SearchInputWrapper = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
    left: 14px;
    color: #94a3b8;
    font-size: 18px;
    pointer-events: none;
  }

  input {
    width: 100%;
    min-height: 48px;
    padding: 0 14px 0 42px;
    background: #f1f5f9;
    border: 1.5px solid transparent;
    border-radius: 12px;
    font-size: 15px;
    color: #0f172a;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      background: #ffffff;
      border-color: #0a66c2;
      box-shadow: 0 0 0 3px rgba(10, 102, 194, 0.1);
    }

    &::placeholder {
      color: #94a3b8;
    }
  }
`;

export const FilterPills = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

export const FilterPill = styled.button`
  min-height: 38px;
  padding: 0 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  border: 1px solid ${props => props.$active ? '#0a66c2' : '#cbd5e1'};
  background: ${props => props.$active ? '#0a66c2' : '#ffffff'};
  color: ${props => props.$active ? '#ffffff' : '#475569'};
  cursor: pointer;
  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.96);
  }
`;

export const ServiceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ServiceCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  display: flex;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:active {
    transform: scale(0.99);
  }

  @media (max-width: 650px) { 
    flex-direction: column; 
    border-radius: 14px;
  }
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
  .price { font-size: 18px; font-weight: 700; color: #0a66c2; display: inline-flex; align-items: baseline; gap: 6px; }
  .price small { color: #94a3b8; text-decoration: line-through; font-size: 12px; }
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

export const TypeBadge = styled.span`
  font-size: 11px;
  text-transform: capitalize;
  font-weight: 700;
  padding: 2px 10px;
  border-radius: 12px;
  background: #eff6ff;
  color: #0a66c2;
`;

export const FileSummary = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  color: #334155;
  font-size: 13px;
  font-weight: 600;
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

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);

  @media (max-width: 640px) {
    width: 100%;
    max-height: 92vh;
    border-radius: 20px 20px 0 0;
  }
`;

export const DeleteConfirmModal = styled.div`
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;

  h2 {
    margin: 0;
    font-size: 1.15rem;
    font-weight: 700;
    color: #0f172a;
  }

  .close-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s;

    &:hover {
      background: #f1f5f9;
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
    font-weight: 600;
    color: #1e293b;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  input, select {
    min-height: 48px;
    padding: 0 1rem;
    border: 1.5px solid #cbd5e1;
    border-radius: 12px;
    font-size: 0.95rem;
    color: #0f172a;
    background: #ffffff;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: #0a66c2;
      box-shadow: 0 0 0 3px rgba(10, 102, 194, 0.12);
    }
  }

  textarea {
    min-height: 90px;
    padding: 0.75rem 1rem;
    border: 1.5px solid #cbd5e1;
    border-radius: 12px;
    font-size: 0.95rem;
    color: #0f172a;
    background: #ffffff;
    resize: vertical;
    font-family: inherit;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: #0a66c2;
      box-shadow: 0 0 0 3px rgba(10, 102, 194, 0.12);
    }
  }

  small {
    font-size: 0.75rem;
    color: #64748b;
  }
`;

export const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #334155;
  font-size: 0.875rem;

  label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
  }
`;

export const FileManagerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;

  .file-row {
    display: grid;
    grid-template-columns: 22px minmax(0, 1fr) 34px;
    align-items: center;
    gap: 10px;
    padding: 10px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: #f8fafc;
  }

  .file-row > svg {
    color: #0a66c2;
  }

  strong,
  span {
    display: block;
    overflow-wrap: anywhere;
  }

  strong {
    color: #111827;
    font-size: 13px;
  }

  span {
    color: #64748b;
    font-size: 12px;
  }

  button {
    width: 34px;
    height: 34px;
    border: 0;
    border-radius: 8px;
    background: #fee2e2;
    color: #b91c1c;
    cursor: pointer;
  }

  .stacked {
    align-items: start;
  }

  .stacked input:not([type="checkbox"]) {
    width: 100%;
    margin-top: 6px;
  }

  .flags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 6px;
    font-size: 12px;
  }

  .flags label {
    display: inline-flex;
    align-items: center;
    gap: 4px;
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
    min-height: 44px;
    padding: 0 1.25rem;
    border-radius: 12px;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;

    &.cancel {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      color: #475569;

      &:hover {
        background: #e2e8f0;
      }
    }

    &.submit {
      background: #0a66c2;
      border: none;
      color: white;

      &:hover:not(:disabled) {
        background: #004182;
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    &.delete-confirm {
      background: #dc2626;
      border: none;
      color: white;

      &:hover:not(:disabled) {
        background: #b91c1c;
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  }
`;
