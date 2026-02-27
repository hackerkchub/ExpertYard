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

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(14, 165, 255, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(14, 165, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(14, 165, 255, 0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

/* Main Container */
export const PremiumContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(145deg, #f9fafb 0%, #f3f4f6 100%);
  padding: 24px;
  position: relative;
  overflow-x: hidden;

  @media (min-width: 640px) {
    padding: 28px;
  }

  @media (min-width: 1024px) {
    padding: 32px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 200px;
    background: linear-gradient(135deg, #0ea5ff 0%, #3b82f6 100%);
    opacity: 0.05;
    pointer-events: none;
  }
`;

export const SettingsContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  animation: ${fadeIn} 0.6s ease-out;
`;

/* Header */
export const Header = styled.div`
  margin-bottom: 28px;

  @media (min-width: 640px) {
    margin-bottom: 32px;
  }
`;

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;

  @media (min-width: 640px) {
    font-size: 32px;
  }

  svg {
    color: #0ea5ff;
    background: linear-gradient(135deg, #0ea5ff 0%, #3b82f6 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

export const Subtitle = styled.p`
  font-size: 15px;
  color: #64748b;
  margin: 0;
  line-height: 1.6;

  @media (min-width: 640px) {
    font-size: 16px;
  }
`;

/* Settings Grid */
export const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

/* Sidebar Navigation */
export const SettingsSidebar = styled.div`
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border-right: 1px solid #e2e8f0;
  padding: 24px 16px;

  @media (max-width: 768px) {
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
    padding: 20px;
  }
`;

export const SidebarTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #64748b;
  margin: 0 0 20px 16px;

  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
`;

export const NavItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: none;
  background: ${props => props.$active ? 
    'linear-gradient(135deg, rgba(14, 165, 255, 0.1), rgba(59, 130, 246, 0.1))' : 
    'transparent'};
  border-radius: 14px;
  color: ${props => props.$active ? '#0ea5ff' : '#64748b'};
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 4px;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 12px 16px;
  }

  &:hover {
    background: ${props => props.$active ? 
      'linear-gradient(135deg, rgba(14, 165, 255, 0.15), rgba(59, 130, 246, 0.15))' : 
      'rgba(255, 255, 255, 0.8)'};
    color: #0ea5ff;
    transform: translateX(4px);
  }

  ${props => props.$active && css`
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 60%;
      background: linear-gradient(180deg, #0ea5ff, #3b82f6);
      border-radius: 0 4px 4px 0;
      box-shadow: 0 0 15px rgba(14, 165, 255, 0.5);
    }
  `}

  svg {
    font-size: 20px;
    color: ${props => props.$active ? '#0ea5ff' : '#94a3b8'};
    transition: all 0.3s ease;
  }

  &:hover svg {
    color: #0ea5ff;
    transform: scale(1.1);
  }
`;

/* Main Content Area */
export const SettingsContent = styled.div`
  padding: 32px;
  background: #ffffff;
  min-height: 600px;

  @media (max-width: 768px) {
    padding: 24px;
  }

  @media (max-width: 480px) {
    padding: 20px;
  }
`;

/* Section Styles */
export const Section = styled.div`
  animation: ${fadeIn} 0.5s ease;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f1f5f9;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 640px) {
    font-size: 20px;
  }

  svg {
    color: #0ea5ff;
  }
`;

export const SectionDescription = styled.p`
  font-size: 14px;
  color: #64748b;
  margin: 4px 0 0 0;
`;

/* Form Styles */
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    color: #64748b;
  }
`;

export const Input = styled.input`
  padding: 14px 18px;
  border: 2px solid #e2e8f0;
  border-radius: 14px;
  font-size: 15px;
  color: #1e293b;
  background: #ffffff;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #0ea5ff;
    box-shadow: 0 0 0 4px rgba(14, 165, 255, 0.1);
  }

  &:hover {
    border-color: #94a3b8;
  }

  &::placeholder {
    color: #94a3b8;
  }

  &:disabled {
    background: #f8fafc;
    cursor: not-allowed;
  }
`;

export const Select = styled.select`
  padding: 14px 18px;
  border: 2px solid #e2e8f0;
  border-radius: 14px;
  font-size: 15px;
  color: #1e293b;
  background: #ffffff;
  transition: all 0.3s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #0ea5ff;
    box-shadow: 0 0 0 4px rgba(14, 165, 255, 0.1);
  }

  &:hover {
    border-color: #94a3b8;
  }
`;

export const TextArea = styled.textarea`
  padding: 14px 18px;
  border: 2px solid #e2e8f0;
  border-radius: 14px;
  font-size: 15px;
  color: #1e293b;
  background: #ffffff;
  transition: all 0.3s ease;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #0ea5ff;
    box-shadow: 0 0 0 4px rgba(14, 165, 255, 0.1);
  }

  &:hover {
    border-color: #94a3b8;
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

/* Toggle Switch */
export const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 52px;
  height: 28px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #cbd5e1;
    transition: 0.3s;
    border-radius: 34px;
  }

  span:before {
    position: absolute;
    content: "";
    height: 22px;
    width: 22px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  input:checked + span {
    background: linear-gradient(135deg, #0ea5ff, #3b82f6);
  }

  input:checked + span:before {
    transform: translateX(24px);
  }
`;

/* Card Styles */
export const Card = styled.div`
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 20px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #0ea5ff;
    box-shadow: 0 8px 30px rgba(14, 165, 255, 0.1);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

export const CardDescription = styled.p`
  font-size: 14px;
  color: #64748b;
  margin: 0;
`;

/* Button Styles */
export const Button = styled.button`
  padding: ${props => props.$small ? '10px 20px' : '14px 28px'};
  background: ${props => props.$primary ? 
    'linear-gradient(135deg, #0ea5ff, #3b82f6)' : 
    props.$danger ?
    'linear-gradient(135deg, #ef4444, #dc2626)' :
    'linear-gradient(135deg, #ffffff, #f8fafc)'};
  color: ${props => props.$primary || props.$danger ? '#ffffff' : '#1e293b'};
  border: ${props => props.$primary || props.$danger ? 'none' : '2px solid #e2e8f0'};
  border-radius: 14px;
  font-size: ${props => props.$small ? '14px' : '15px'};
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: ${props => props.disabled ? 0.6 : 1};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${props => props.$primary ? 
      '0 8px 25px rgba(14, 165, 255, 0.4)' : 
      props.$danger ?
      '0 8px 25px rgba(239, 68, 68, 0.4)' :
      '0 8px 25px rgba(0, 0, 0, 0.1)'};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

/* Avatar Upload */
export const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0ea5ff, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 48px;
  font-weight: 700;
  background-image: ${props => props.src ? `url(${props.src})` : 'none'};
  background-size: cover;
  background-position: center;
  border: 4px solid white;
  box-shadow: 0 10px 30px rgba(14, 165, 255, 0.3);
  position: relative;
  cursor: pointer;
  overflow: hidden;

  &:hover::after {
    content: '📷';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    color: white;
  }
`;

/* Notification Item */
export const NotificationItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #e2e8f0;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

export const NotificationInfo = styled.div`
  flex: 1;
`;

export const NotificationTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
`;

export const NotificationDescription = styled.div`
  font-size: 14px;
  color: #64748b;
`;

/* Pricing Card */
export const PricingCard = styled.div`
  background: linear-gradient(135deg, 
    ${props => props.$popular ? '#0ea5ff' : '#ffffff'}, 
    ${props => props.$popular ? '#3b82f6' : '#f8fafc'});
  border: 2px solid ${props => props.$popular ? '#0ea5ff' : '#e2e8f0'};
  border-radius: 24px;
  padding: 32px 24px;
  color: ${props => props.$popular ? '#ffffff' : '#1e293b'};
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(14, 165, 255, 0.2);
  }
`;

export const PopularBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  color: white;
  padding: 6px 16px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
`;

/* Security Section */
export const SecurityItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #f8fafc;
  border-radius: 16px;
  margin-bottom: 12px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

export const SecurityInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 480px) {
    width: 100%;
  }
`;

export const SecurityIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: ${props => 
    props.$success ? 'linear-gradient(135deg, #10b981, #34d399)' :
    props.$warning ? 'linear-gradient(135deg, #f59e0b, #fbbf24)' :
    'linear-gradient(135deg, #0ea5ff, #3b82f6)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
`;

/* Modal */
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: ${fadeIn} 0.3s ease;
`;

export const ModalContent = styled.div`
  background: #ffffff;
  border-radius: 24px;
  padding: 32px;
  max-width: 400px;
  width: 100%;
  animation: ${slideIn} 0.4s ease;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`;

export const ModalTitle = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
`;

export const ModalText = styled.p`
  font-size: 15px;
  color: #64748b;
  margin: 0 0 24px 0;
  line-height: 1.6;
`;

/* Success Message */
export const SuccessMessage = styled.div`
  position: fixed;
  top: 24px;
  right: 24px;
  background: linear-gradient(135deg, #10b981, #34d399);
  color: white;
  padding: 16px 24px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
  display: flex;
  align-items: center;
  gap: 12px;
  animation: ${slideIn} 0.3s ease;
  z-index: 1100;

  svg {
    font-size: 24px;
  }
`;

/* Loading Spinner */
export const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #0ea5ff;
  border-radius: 50%;
  animation: ${rotate} 1s linear infinite;
  margin: 40px auto;
`;