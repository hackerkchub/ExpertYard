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

/* Header */
export const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 28px;
  animation: ${fadeIn} 0.6s ease-out;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

export const HeaderLeft = styled.div`
  h1 {
    font-size: 28px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 8px 0;
    display: flex;
    align-items: center;
    gap: 12px;

    @media (max-width: 768px) {
      font-size: 24px;
    }

    svg {
      color: #0ea5ff;
      background: rgba(14, 165, 255, 0.1);
      padding: 8px;
      border-radius: 12px;
      width: 44px;
      height: 44px;
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

export const FilterButton = styled.button`
  padding: 12px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 14px;
  background: white;
  color: #64748b;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

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

export const RefreshButton = styled.button`
  padding: 12px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 14px;
  background: white;
  color: #64748b;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    border-color: #10b981;
    color: #10b981;
    transform: translateY(-2px) rotate(180deg);
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
  padding: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.6s ease-out;

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
  background: ${props => props.$color || 'linear-gradient(135deg, #0ea5ff, #3b82f6)'};
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
  margin-bottom: 8px;
`;

export const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

export const StatTrend = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: ${props => props.$positive ? '#10b981' : '#64748b'};
`;

/* Filters */
export const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
  padding: 20px;
  background: white;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

export const SearchInput = styled.div`
  position: relative;
  flex: 2;
  min-width: 300px;

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
    border-radius: 14px;
    font-size: 14px;
    color: #1e293b;
    background: white;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: #0ea5ff;
      box-shadow: 0 0 0 4px rgba(14, 165, 255, 0.1);
    }
  }
`;

export const Select = styled.select`
  padding: 14px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 14px;
  font-size: 14px;
  color: #1e293b;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: #0ea5ff;
    box-shadow: 0 0 0 4px rgba(14, 165, 255, 0.1);
  }
`;

export const DateInput = styled.input`
  padding: 14px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 14px;
  font-size: 14px;
  color: #1e293b;
  background: white;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #0ea5ff;
    box-shadow: 0 0 0 4px rgba(14, 165, 255, 0.1);
  }
`;

/* Table */
export const TableContainer = styled.div`
  background: white;
  border-radius: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  animation: ${fadeIn} 0.6s ease-out;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1200px;
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
`;

export const TableCell = styled.td`
  padding: 20px;
  font-size: 14px;
  color: #1e293b;
  vertical-align: middle;
`;

/* Status Badges */
export const StatusBadge = styled.span`
  display: inline-block;
  padding: 6px 14px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${props => {
    switch(props.$status) {
      case 'pending':
        return css`
          background: #fef3c7;
          color: #92400e;
        `;
      case 'approved':
        return css`
          background: #d1fae5;
          color: #065f46;
        `;
      case 'rejected':
        return css`
          background: #fee2e2;
          color: #991b1b;
        `;
      default:
        return css`
          background: #f1f5f9;
          color: #475569;
        `;
    }
  }}
`;

/* Action Buttons */
export const ActionButton = styled.button`
  padding: 8px 14px;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 0 4px;

  ${props => {
    switch(props.$variant) {
      case 'approve':
        return css`
          background: #10b981;
          color: white;
          &:hover {
            background: #059669;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          }
        `;
      case 'reject':
        return css`
          background: #ef4444;
          color: white;
          &:hover {
            background: #dc2626;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
          }
        `;
      case 'view':
        return css`
          background: #f1f5f9;
          color: #64748b;
          &:hover {
            background: #e2e8f0;
            color: #1e293b;
          }
        `;
      default:
        return css`
          background: #f1f5f9;
          color: #64748b;
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

/* Expert Info */
export const ExpertInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ExpertAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #0ea5ff, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 16px;
`;

export const ExpertDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ExpertName = styled.div`
  font-weight: 600;
  color: #1e293b;
  font-size: 15px;
`;

export const ExpertEmail = styled.div`
  font-size: 12px;
  color: #64748b;
`;

export const ExpertPhone = styled.div`
  font-size: 12px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 4px;
`;

/* Amount Display */
export const Amount = styled.span`
  font-weight: 700;
  color: #1e293b;
  font-size: 16px;
`;

/* Modal */
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
  padding: 20px;
  animation: ${fadeIn} 0.3s ease;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 24px;
  padding: 32px;
  width: 100%;
  max-width: 550px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
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

  h2 {
    font-size: 24px;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
    background: linear-gradient(135deg, #0ea5ff, #3b82f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

export const ModalClose = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: none;
  background: #f1f5f9;
  color: #64748b;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #fee2e2;
    color: #ef4444;
    transform: rotate(90deg);
  }
`;

/* Forms */
export const FormGroup = styled.div`
  margin-bottom: 20px;
`;

export const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #e2e8f0;
  border-radius: 14px;
  font-size: 15px;
  color: #1e293b;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #0ea5ff;
    box-shadow: 0 0 0 4px rgba(14, 165, 255, 0.1);
  }

  &:disabled {
    background: #f8fafc;
    cursor: not-allowed;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #e2e8f0;
  border-radius: 14px;
  font-size: 15px;
  color: #1e293b;
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #0ea5ff;
    box-shadow: 0 0 0 4px rgba(14, 165, 255, 0.1);
  }
`;

export const SelectModal = styled.select`
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #e2e8f0;
  border-radius: 14px;
  font-size: 15px;
  color: #1e293b;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #0ea5ff;
    box-shadow: 0 0 0 4px rgba(14, 165, 255, 0.1);
  }
`;

export const FileInput = styled.div`
  border: 2px dashed #e2e8f0;
  border-radius: 14px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8fafc;

  &:hover {
    border-color: #0ea5ff;
    background: rgba(14, 165, 255, 0.05);
  }

  input {
    display: none;
  }

  svg {
    width: 40px;
    height: 40px;
    color: #94a3b8;
    margin-bottom: 12px;
  }

  p {
    color: #64748b;
    font-size: 14px;
    margin: 0;
  }

  small {
    color: #94a3b8;
    font-size: 12px;
    display: block;
    margin-top: 8px;
  }
`;

export const FilePreview = styled.div`
  margin-top: 16px;
  padding: 16px;
  background: #f1f5f9;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;

  img {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    object-fit: cover;
  }

  div {
    flex: 1;
    p {
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 4px 0;
    }
    span {
      font-size: 12px;
      color: #64748b;
    }
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

export const PrimaryButton = styled.button`
  flex: 1;
  padding: 14px;
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
    box-shadow: 0 8px 20px rgba(14, 165, 255, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled.button`
  flex: 1;
  padding: 14px;
  background: ${props => props.$danger ? '#ef4444' : '#f1f5f9'};
  border: none;
  border-radius: 14px;
  color: ${props => props.$danger ? 'white' : '#64748b'};
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
    box-shadow: ${props => props.$danger ? 
      '0 8px 20px rgba(239, 68, 68, 0.3)' : 
      '0 8px 20px rgba(0, 0, 0, 0.1)'};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

/* Detail Modal */
export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
`;

export const DetailItem = styled.div`
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
`;

export const DetailLabel = styled.div`
  font-size: 12px;
  color: #64748b;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const DetailValue = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
`;

export const ReceiptButton = styled.button`
  width: 100%;
  padding: 16px;
  background: #f8fafc;
  border: 2px dashed #0ea5ff;
  border-radius: 14px;
  color: #0ea5ff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;

  &:hover {
    background: #0ea5ff;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(14, 165, 255, 0.2);
  }
`;

/* Loading Spinner */
export const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;

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
  }
`;

/* Empty State */
export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;

  svg {
    width: 64px;
    height: 64px;
    color: #94a3b8;
    margin-bottom: 20px;
  }

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 8px 0;
  }

  p {
    color: #64748b;
    font-size: 14px;
    margin: 0;
  }
`;