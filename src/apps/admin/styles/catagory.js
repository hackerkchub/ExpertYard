import styled, { keyframes, css } from "styled-components";

/* Animations */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(14, 165, 255, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(14, 165, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(14, 165, 255, 0); }
`;

/* Main Container */
export const PageContainer = styled.div`
  padding: 24px;
  min-height: 100vh;
  background: linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%);

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

export const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

/* Header Styles */
export const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 28px;
  animation: ${fadeIn} 0.6s ease-out;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

export const HeaderLeft = styled.div`
  h3 {
    font-size: 24px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 8px 0;
    display: flex;
    align-items: center;
    gap: 12px;

    @media (max-width: 768px) {
      font-size: 22px;
    }

    @media (max-width: 480px) {
      font-size: 20px;
    }

    svg {
      color: #0ea5ff;
      background: rgba(14, 165, 255, 0.1);
      padding: 8px;
      border-radius: 12px;
      width: 40px;
      height: 40px;

      @media (max-width: 480px) {
        width: 36px;
        height: 36px;
      }
    }
  }

  p {
    color: #64748b;
    font-size: 15px;
    margin: 0;

    @media (max-width: 480px) {
      font-size: 14px;
    }
  }
`;

export const HeaderRight = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

export const SearchInput = styled.div`
  position: relative;
  flex: 1;
  min-width: 300px;

  @media (max-width: 768px) {
    width: 100%;
  }

  svg {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    width: 18px;
    height: 18px;
  }

  input {
    width: 100%;
    padding: 14px 16px 14px 48px;
    border: 2px solid #e2e8f0;
    border-radius: 16px;
    font-size: 14px;
    color: #1e293b;
    background: white;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: #0ea5ff;
      box-shadow: 0 0 0 4px rgba(14, 165, 255, 0.1);
    }

    &::placeholder {
      color: #94a3b8;
    }

    &:disabled {
      background: #f8fafc;
      cursor: not-allowed;
    }
  }
`;

export const FilterButton = styled.button`
  padding: 14px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  background: white;
  color: #64748b;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;

  &:hover {
    border-color: #0ea5ff;
    color: #0ea5ff;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(14, 165, 255, 0.1);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const AddButton = styled.button`
  padding: 14px 24px;
  background: linear-gradient(135deg, #0ea5ff, #3b82f6);
  border: none;
  border-radius: 16px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  box-shadow: 0 8px 20px rgba(14, 165, 255, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(14, 165, 255, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

/* Stats Cards */
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 28px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(14, 165, 255, 0.1);
    border-color: #0ea5ff;
  }
`;

export const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: linear-gradient(135deg, #0ea5ff, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;

  svg {
    width: 24px;
    height: 24px;
    color: white;
  }
`;

export const StatLabel = styled.div`
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
`;

export const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

export const StatTrend = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: ${props => props.$positive ? '#10b981' : '#ef4444'};
`;

/* Table Styles */
export const TableContainer = styled.div`
  background: white;
  border-radius: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 768px) {
    border-radius: 20px;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
`;

export const TableHead = styled.thead`
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;

  th {
    padding: 18px 20px;
    text-align: left;
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
  }
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid #e2e8f0;
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const TableCell = styled.td`
  padding: 20px;
  font-size: 14px;
  color: #1e293b;
  vertical-align: middle;

  @media (max-width: 768px) {
    padding: 16px;
    font-size: 13px;
  }
`;

export const ActionsCell = styled.td`
  padding: 20px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

/* Action Buttons */
export const EditButton = styled.button`
  padding: 8px 16px;
  background: transparent;
  border: 1px solid #0ea5ff;
  border-radius: 10px;
  color: #0ea5ff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: #0ea5ff;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(14, 165, 255, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const DeleteButton = styled.button`
  padding: 8px 16px;
  background: transparent;
  border: 1px solid #ef4444;
  border-radius: 10px;
  color: #ef4444;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: #ef4444;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const SaveButton = styled.button`
  padding: 8px 16px;
  background: #10b981;
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover:not(:disabled) {
    background: #059669;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const CancelButton = styled.button`
  padding: 8px 16px;
  background: #6b7280;
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover:not(:disabled) {
    background: #4b5563;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

/* Subcategory Styles */
export const SubcategoryToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: ${props => props.$expanded ? '#0ea5ff' : '#64748b'};
  font-weight: ${props => props.$expanded ? '500' : '400'};
  transition: all 0.2s ease;
  padding: 6px 0;

  &:hover {
    color: #0ea5ff;
  }

  svg {
    width: 14px;
    height: 14px;
    transition: transform 0.3s ease;
  }
`;

export const SubcategoryList = styled.div`
  max-height: 200px;
  overflow-y: auto;
  margin-top: 12px;
  padding: 12px;
  background: rgba(14, 165, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(14, 165, 255, 0.1);
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
  }

  &::-webkit-scrollbar-thumb {
    background: #94a3b8;
    border-radius: 4px;
  }
`;

export const SubcategoryItem = styled.div`
  padding: 8px 12px;
  background: rgba(14, 165, 255, 0.1);
  border-radius: 8px;
  margin-bottom: 6px;
  font-size: 13px;
  color: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:last-child {
    margin-bottom: 0;
  }

  span {
    color: #94a3b8;
    font-size: 11px;
  }
`;

/* Image Upload Styles */
export const ImageContainer = styled.div`
  position: relative;
  width: ${props => props.$size || 40}px;
  height: ${props => props.$size || 40}px;
  cursor: ${props => props.$editable ? 'pointer' : 'default'};
  border-radius: 8px;
  overflow: hidden;
  border: ${props => props.$editable ? '2px solid #10b981' : '1px solid #e2e8f0'};
  transition: all 0.3s ease;

  &:hover {
    ${props => props.$editable && css`
      border-color: #0ea5ff;
      transform: scale(1.05);
      box-shadow: 0 8px 20px rgba(14, 165, 255, 0.2);
    `}
  }
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: ${props => props.$loading ? 'none' : 'block'};
`;

export const ImageFallback = styled.div`
  width: 100%;
  height: 100%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;

  svg {
    width: ${props => props.$size === 100 ? 48 : 24}px;
    height: ${props => props.$size === 100 ? 48 : 24}px;
  }
`;

export const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${ImageContainer}:hover & {
    opacity: 1;
  }

  svg {
    color: white;
    width: 20px;
    height: 20px;
  }
`;

export const ImageBadge = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  width: 20px;
  height: 20px;
  background: #10b981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 10px;
  border: 2px solid white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

/* Modal Styles */
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
  animation: ${fadeIn} 0.3s ease;
`;

export const ModalContent = styled.div`
  background: linear-gradient(145deg, #1e293b, #0f172a);
  border-radius: 24px;
  padding: 32px;
  width: 100%;
  max-width: 500px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  animation: ${slideIn} 0.4s ease;

  @media (max-width: 480px) {
    padding: 24px;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;

  h3 {
    font-size: 22px;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0;
    background: linear-gradient(135deg, #0ea5ff, #3b82f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;

    @media (max-width: 480px) {
      font-size: 20px;
    }
  }
`;

export const ModalClose = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  color: #94a3b8;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
    transform: rotate(90deg);
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 24px;
`;

export const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #94a3b8;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 14px 18px;
  background: #0f172a;
  border: 2px solid #334155;
  border-radius: 14px;
  font-size: 15px;
  color: #f1f5f9;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #0ea5ff;
    box-shadow: 0 0 0 4px rgba(14, 165, 255, 0.1);
  }

  &::placeholder {
    color: #475569;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const FileInput = styled.input`
  width: 100%;
  padding: 10px;
  background: #0f172a;
  border: 2px dashed #334155;
  border-radius: 14px;
  color: #94a3b8;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #0ea5ff;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

export const PrimaryButton = styled.button`
  padding: 14px 28px;
  background: linear-gradient(135deg, #0ea5ff, #3b82f6);
  border: none;
  border-radius: 14px;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(14, 165, 255, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

export const SecondaryButton = styled.button`
  padding: 14px 28px;
  background: #334155;
  border: none;
  border-radius: 14px;
  color: #94a3b8;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background: #475569;
    color: #f1f5f9;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

/* Loading Spinner */
export const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #0ea5ff;

  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #e2e8f0;
    border-top-color: #0ea5ff;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
    margin-bottom: 20px;
  }

  p {
    color: #64748b;
    font-size: 16px;
    font-weight: 500;
  }
`;

/* Empty State */
export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #64748b;

  svg {
    width: 64px;
    height: 64px;
    margin-bottom: 20px;
    opacity: 0.5;
  }

  h4 {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 8px 0;
  }

  p {
    font-size: 14px;
    margin: 0;
  }
`;

// Add this to your catagory.js styles file
export const SelectFilter = styled.select`
  width: 100%;
  padding: 14px 18px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  font-size: 14px;
  color: #1e293b;
  transition: all 0.3s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #0ea5ff;
    box-shadow: 0 0 0 4px rgba(14, 165, 255, 0.1);
  }

  &:disabled {
    background: #f8fafc;
    cursor: not-allowed;
    opacity: 0.6;
  }

  option {
    padding: 10px;
  }
`;