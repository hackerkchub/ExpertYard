import styled, { keyframes, css } from "styled-components";

/* Animations */
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(64, 224, 208, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(64, 224, 208, 0); }
  100% { box-shadow: 0 0 0 0 rgba(64, 224, 208, 0); }
`;

const glow = keyframes`
  0% { filter: drop-shadow(0 0 2px rgba(64, 224, 208, 0.3)); }
  50% { filter: drop-shadow(0 0 8px rgba(64, 224, 208, 0.5)); }
  100% { filter: drop-shadow(0 0 2px rgba(64, 224, 208, 0.3)); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

/* Main Container */
export const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(145deg, #0f1a24 0%, #071016 100%);
  padding: 12px;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;

  @media (min-width: 480px) {
    padding: 16px;
  }

  @media (min-width: 768px) {
    padding: 24px;
  }

  @media (min-width: 1024px) {
    padding: 32px;
  }

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: radial-gradient(circle at 20% 30%, rgba(64, 224, 208, 0.03) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(244, 210, 122, 0.03) 0%, transparent 50%);
    pointer-events: none;
  }
`;

export const CalendarContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  animation: ${fadeIn} 0.6s ease-out;
`;

/* Header Section */
export const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;

  @media (min-width: 480px) {
    gap: 18px;
    margin-bottom: 28px;
  }

  @media (min-width: 640px) {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    margin-bottom: 32px;
  }

  @media (min-width: 1024px) {
    margin-bottom: 40px;
  }
`;

export const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  @media (min-width: 480px) {
    gap: 14px;
  }

  @media (min-width: 768px) {
    gap: 16px;
  }
`;

export const CalendarIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #40e0d0, #2aa88a);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #0f1a24;
  box-shadow: 0 4px 12px rgba(64, 224, 208, 0.3);
  animation: ${glow} 2s infinite;

  @media (min-width: 480px) {
    width: 44px;
    height: 44px;
    font-size: 22px;
    border-radius: 14px;
  }

  @media (min-width: 768px) {
    width: 48px;
    height: 48px;
    font-size: 24px;
    border-radius: 16px;
  }
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin: 0;
  background: linear-gradient(90deg, #fff, #e0e0e0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (min-width: 480px) {
    font-size: 26px;
  }

  @media (min-width: 768px) {
    font-size: 32px;
  }

  @media (min-width: 1024px) {
    font-size: 36px;
  }
`;

export const DateDisplay = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  white-space: nowrap;

  @media (min-width: 480px) {
    font-size: 15px;
    padding: 6px 14px;
    gap: 8px;
  }

  @media (min-width: 768px) {
    font-size: 16px;
    padding: 8px 16px;
  }

  span {
    color: #40e0d0;
    font-weight: 600;
  }
`;

/* Navigation Controls */
export const NavControls = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;

  @media (min-width: 480px) {
    gap: 10px;
  }

  @media (min-width: 640px) {
    gap: 12px;
  }
`;

export const NavButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);

  @media (min-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 20px;
    border-radius: 12px;
  }

  @media (min-width: 768px) {
    width: 44px;
    height: 44px;
    border-radius: 14px;
  }

  &:hover {
    background: rgba(64, 224, 208, 0.2);
    border-color: #40e0d0;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(64, 224, 208, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    pointer-events: none;
  }
`;

export const MonthYearDisplay = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  min-width: 140px;
  text-align: center;
  background: linear-gradient(90deg, #40e0d0, #f4d27a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  padding: 0 4px;

  @media (min-width: 480px) {
    font-size: 18px;
    min-width: 160px;
  }

  @media (min-width: 768px) {
    font-size: 22px;
    min-width: 180px;
  }

  @media (min-width: 1024px) {
    font-size: 24px;
  }
`;

export const TodayButton = styled.button`
  padding: 8px 16px;
  border-radius: 30px;
  background: linear-gradient(135deg, #40e0d0, #2aa88a);
  border: none;
  color: #0f1a24;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 12px rgba(64, 224, 208, 0.3);
  white-space: nowrap;

  @media (min-width: 480px) {
    padding: 8px 18px;
    font-size: 14px;
    gap: 8px;
  }

  @media (min-width: 768px) {
    padding: 10px 20px;
    font-size: 14px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(64, 224, 208, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

/* Calendar Grid */
export const CalendarGrid = styled.div`
  background: rgba(18, 30, 40, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.8);
  margin-bottom: 24px;
  animation: ${slideIn} 0.6s ease-out;

  @media (min-width: 480px) {
    padding: 20px;
    border-radius: 28px;
    margin-bottom: 28px;
  }

  @media (min-width: 768px) {
    padding: 24px;
    border-radius: 32px;
    margin-bottom: 32px;
  }

  @media (min-width: 1024px) {
    padding: 32px;
  }
`;

export const WeekDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 12px;

  @media (min-width: 480px) {
    gap: 6px;
    margin-bottom: 14px;
  }

  @media (min-width: 768px) {
    gap: 8px;
    margin-bottom: 16px;
  }
`;

export const WeekDay = styled.div`
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 8px 0;

  @media (min-width: 480px) {
    font-size: 13px;
    padding: 10px 0;
  }

  @media (min-width: 768px) {
    font-size: 14px;
    padding: 12px 0;
  }
`;

export const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;

  @media (min-width: 480px) {
    gap: 6px;
  }

  @media (min-width: 768px) {
    gap: 8px;
  }
`;

export const DayCell = styled.div`
  aspect-ratio: 1;
  background: ${({ $isToday, $isSelected, $hasTasks }) => {
    if ($isSelected) return 'linear-gradient(135deg, #40e0d0, #2aa88a)';
    if ($isToday) return 'rgba(64, 224, 208, 0.15)';
    if ($hasTasks) return 'rgba(244, 210, 122, 0.1)';
    return 'rgba(255, 255, 255, 0.03)';
  }};
  border: 1px solid ${({ $isSelected, $isToday }) => {
    if ($isSelected) return '#40e0d0';
    if ($isToday) return 'rgba(64, 224, 208, 0.5)';
    return 'rgba(255, 255, 255, 0.05)';
  }};
  border-radius: 10px;
  padding: 4px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  @media (min-width: 480px) {
    border-radius: 12px;
    padding: 6px;
    border-width: 1.5px;
  }

  @media (min-width: 768px) {
    border-radius: 14px;
    padding: 8px;
    border-width: 2px;
  }

  @media (min-width: 1024px) {
    border-radius: 16px;
  }

  &:hover {
    transform: translateY(-2px);
    border-color: #40e0d0;
    box-shadow: 0 8px 20px rgba(64, 224, 208, 0.2);
    background: ${({ $isSelected }) => 
      $isSelected ? 'linear-gradient(135deg, #40e0d0, #2aa88a)' : 'rgba(64, 224, 208, 0.1)'};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }
`;

export const DayNumber = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${({ $isSelected }) => $isSelected ? '#0f1a24' : '#fff'};
  margin-bottom: 2px;

  @media (min-width: 480px) {
    font-size: 14px;
    margin-bottom: 3px;
  }

  @media (min-width: 768px) {
    font-size: 16px;
    margin-bottom: 4px;
  }
`;

export const TaskIndicator = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  margin-top: auto;

  @media (min-width: 480px) {
    gap: 3px;
  }

  @media (min-width: 768px) {
    gap: 4px;
  }
`;

export const TaskDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $priority }) => {
    switch($priority) {
      case 'high': return '#ff4d4d';
      case 'medium': return '#ffb020';
      case 'low': return '#40e0d0';
      default: return '#40e0d0';
    }
  }};
  box-shadow: 0 0 8px ${({ $priority }) => {
    switch($priority) {
      case 'high': return 'rgba(255, 77, 77, 0.5)';
      case 'medium': return 'rgba(255, 176, 32, 0.5)';
      case 'low': return 'rgba(64, 224, 208, 0.5)';
      default: return 'rgba(64, 224, 208, 0.5)';
    }
  }};

  @media (min-width: 480px) {
    width: 7px;
    height: 7px;
  }

  @media (min-width: 768px) {
    width: 8px;
    height: 8px;
  }
`;

export const TaskCount = styled.div`
  font-size: 9px;
  color: ${({ $isSelected }) => $isSelected ? '#0f1a24' : 'rgba(255, 255, 255, 0.6)'};
  margin-left: auto;

  @media (min-width: 480px) {
    font-size: 10px;
  }

  @media (min-width: 768px) {
    font-size: 11px;
  }
`;

/* Tasks Section */
export const TasksSection = styled.div`
  background: rgba(18, 30, 40, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.8);
  animation: ${fadeIn} 0.6s ease-out 0.2s both;

  @media (min-width: 480px) {
    padding: 24px;
    border-radius: 28px;
  }

  @media (min-width: 768px) {
    padding: 28px;
    border-radius: 32px;
  }

  @media (min-width: 1024px) {
    padding: 32px;
  }
`;

export const TasksHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    margin-bottom: 24px;
  }

  @media (min-width: 768px) {
    margin-bottom: 28px;
  }

  @media (min-width: 1024px) {
    margin-bottom: 32px;
  }
`;

export const SelectedDateTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;

  @media (min-width: 480px) {
    font-size: 19px;
    gap: 10px;
  }

  @media (min-width: 768px) {
    font-size: 20px;
    gap: 12px;
  }

  span {
    color: #40e0d0;
    background: rgba(64, 224, 208, 0.1);
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;

    @media (min-width: 480px) {
      padding: 5px 11px;
      font-size: 13px;
    }

    @media (min-width: 768px) {
      padding: 6px 12px;
      font-size: 14px;
    }
  }
`;

export const AddTaskButton = styled.button`
  padding: 12px 20px;
  border-radius: 30px;
  background: linear-gradient(135deg, #40e0d0, #2aa88a);
  border: none;
  color: #0f1a24;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 8px 20px rgba(64, 224, 208, 0.3);
  width: 100%;

  @media (min-width: 480px) {
    width: auto;
    padding: 12px 24px;
    font-size: 14px;
  }

  @media (min-width: 768px) {
    padding: 14px 28px;
    font-size: 15px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(64, 224, 208, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

/* Tasks List */
export const TasksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 350px;
  overflow-y: auto;
  padding-right: 6px;

  @media (min-width: 480px) {
    gap: 11px;
    max-height: 380px;
    padding-right: 8px;
  }

  @media (min-width: 768px) {
    gap: 12px;
    max-height: 400px;
    padding-right: 8px;
  }

  &::-webkit-scrollbar {
    width: 4px;

    @media (min-width: 768px) {
      width: 6px;
    }
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(64, 224, 208, 0.3);
    border-radius: 10px;
    
    &:hover {
      background: rgba(64, 224, 208, 0.5);
    }
  }
`;

export const TaskItem = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  animation: ${slideIn} 0.3s ease-out;
  position: relative;
  overflow: hidden;

  @media (min-width: 480px) {
    padding: 15px 18px;
    gap: 14px;
    border-radius: 18px;
  }

  @media (min-width: 768px) {
    padding: 16px 20px;
    gap: 16px;
    border-radius: 20px;
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 3px;
    background: ${({ $priority }) => {
      switch($priority) {
        case 'high': return '#ff4d4d';
        case 'medium': return '#ffb020';
        case 'low': return '#40e0d0';
        default: return '#40e0d0';
      }
    }};
    box-shadow: 0 0 12px ${({ $priority }) => {
      switch($priority) {
        case 'high': return 'rgba(255, 77, 77, 0.5)';
        case 'medium': return 'rgba(255, 176, 32, 0.5)';
        case 'low': return 'rgba(64, 224, 208, 0.5)';
        default: return 'rgba(64, 224, 208, 0.5)';
      }
    }};

    @media (min-width: 768px) {
      width: 4px;
    }
  }

  &:hover {
    background: rgba(64, 224, 208, 0.05);
    border-color: rgba(64, 224, 208, 0.2);
    transform: translateX(4px);
  }
`;

export const TaskCheckbox = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 2px solid ${({ $completed }) => $completed ? '#40e0d0' : 'rgba(255, 255, 255, 0.2)'};
  background: ${({ $completed }) => $completed ? '#40e0d0' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0f1a24;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  @media (min-width: 480px) {
    width: 22px;
    height: 22px;
    font-size: 13px;
    border-radius: 7px;
  }

  @media (min-width: 768px) {
    width: 24px;
    height: 24px;
    font-size: 14px;
    border-radius: 8px;
  }

  &:hover {
    border-color: #40e0d0;
    transform: scale(1.1);
  }
`;

export const TaskContent = styled.div`
  flex: 1;
  min-width: 0; /* Prevents flex item from overflowing */
`;

export const TaskTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ $completed }) => $completed ? 'rgba(255, 255, 255, 0.4)' : '#fff'};
  text-decoration: ${({ $completed }) => $completed ? 'line-through' : 'none'};
  margin-bottom: 4px;
  word-break: break-word;

  @media (min-width: 480px) {
    font-size: 15px;
    margin-bottom: 5px;
  }

  @media (min-width: 768px) {
    font-size: 16px;
    margin-bottom: 6px;
  }
`;

export const TaskMeta = styled.div`
  display: flex;
  gap: 12px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  flex-wrap: wrap;

  @media (min-width: 480px) {
    gap: 14px;
    font-size: 12px;
  }

  @media (min-width: 768px) {
    gap: 16px;
    font-size: 12px;
  }
`;

export const TaskTime = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
`;

export const TaskPriority = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ $priority }) => {
    switch($priority) {
      case 'high': return '#ff4d4d';
      case 'medium': return '#ffb020';
      case 'low': return '#40e0d0';
      default: return '#40e0d0';
    }
  }};
  white-space: nowrap;
`;

export const TaskActions = styled.div`
  display: flex;
  gap: 6px;
  opacity: 0.7;
  transition: opacity 0.2s ease;

  @media (min-width: 480px) {
    gap: 7px;
  }

  @media (min-width: 768px) {
    gap: 8px;
    opacity: 0;
  }

  ${TaskItem}:hover & {
    @media (min-width: 768px) {
      opacity: 1;
    }
  }
`;

export const TaskActionBtn = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  color: ${({ $delete }) => $delete ? '#ff4d4d' : '#40e0d0'};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;

  @media (min-width: 480px) {
    width: 32px;
    height: 32px;
    font-size: 15px;
    border-radius: 9px;
  }

  @media (min-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 16px;
    border-radius: 10px;
  }

  &:hover {
    background: ${({ $delete }) => $delete ? 'rgba(255, 77, 77, 0.2)' : 'rgba(64, 224, 208, 0.2)'};
    transform: scale(1.1);
  }
`;

/* Empty State */
export const EmptyState = styled.div`
  text-align: center;
  padding: 40px 16px;
  color: rgba(255, 255, 255, 0.3);
  font-size: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  @media (min-width: 480px) {
    padding: 50px 20px;
    font-size: 16px;
    gap: 14px;
  }

  @media (min-width: 768px) {
    padding: 60px 20px;
    gap: 16px;
  }

  span {
    font-size: 40px;
    margin-bottom: 6px;
    opacity: 0.5;

    @media (min-width: 480px) {
      font-size: 44px;
    }

    @media (min-width: 768px) {
      font-size: 48px;
    }
  }

  small {
    font-size: 13px;
    opacity: 0.5;

    @media (min-width: 480px) {
      font-size: 14px;
    }
  }
`;

/* Modal */
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
  padding: 12px;

  @media (min-width: 480px) {
    padding: 16px;
  }

  @media (min-width: 768px) {
    padding: 20px;
  }
`;

export const Modal = styled.div`
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  background: linear-gradient(145deg, #1a2a35, #0f1a24);
  border-radius: 24px;
  padding: 24px;
  border: 1px solid rgba(64, 224, 208, 0.2);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.8);
  animation: ${slideIn} 0.4s ease-out;

  @media (min-width: 480px) {
    padding: 28px;
    border-radius: 28px;
  }

  @media (min-width: 768px) {
    padding: 32px;
    border-radius: 32px;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  @media (min-width: 480px) {
    margin-bottom: 22px;
  }

  @media (min-width: 768px) {
    margin-bottom: 24px;
  }
`;

export const ModalTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin: 0;
  background: linear-gradient(90deg, #40e0d0, #f4d27a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (min-width: 480px) {
    font-size: 22px;
  }

  @media (min-width: 768px) {
    font-size: 24px;
  }
`;

export const ModalClose = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  @media (min-width: 480px) {
    width: 38px;
    height: 38px;
    font-size: 19px;
    border-radius: 11px;
  }

  @media (min-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 20px;
    border-radius: 12px;
  }

  &:hover {
    background: rgba(255, 77, 77, 0.2);
    color: #ff4d4d;
    transform: rotate(90deg);
  }
`;

export const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 480px) {
    gap: 18px;
  }

  @media (min-width: 768px) {
    gap: 20px;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  @media (min-width: 480px) {
    gap: 7px;
  }

  @media (min-width: 768px) {
    gap: 8px;
  }
`;

export const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (min-width: 480px) {
    font-size: 13px;
  }

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

export const Input = styled.input`
  padding: 12px 16px;
  border-radius: 14px;
  border: 2px solid rgba(255, 255, 255, 0.05);
  background: rgba(0, 0, 0, 0.2);
  color: #fff;
  font-size: 15px;
  transition: all 0.2s ease;

  @media (min-width: 480px) {
    padding: 13px 17px;
    font-size: 15px;
    border-radius: 15px;
  }

  @media (min-width: 768px) {
    padding: 14px 18px;
    font-size: 16px;
    border-radius: 16px;
  }

  &:focus {
    outline: none;
    border-color: #40e0d0;
    box-shadow: 0 0 0 4px rgba(64, 224, 208, 0.1);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.2);
  }
`;

export const TextArea = styled.textarea`
  padding: 12px 16px;
  border-radius: 14px;
  border: 2px solid rgba(255, 255, 255, 0.05);
  background: rgba(0, 0, 0, 0.2);
  color: #fff;
  font-size: 15px;
  min-height: 80px;
  resize: vertical;
  transition: all 0.2s ease;

  @media (min-width: 480px) {
    padding: 13px 17px;
    font-size: 15px;
    border-radius: 15px;
    min-height: 90px;
  }

  @media (min-width: 768px) {
    padding: 14px 18px;
    font-size: 16px;
    border-radius: 16px;
    min-height: 100px;
  }

  &:focus {
    outline: none;
    border-color: #40e0d0;
    box-shadow: 0 0 0 4px rgba(64, 224, 208, 0.1);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.2);
  }
`;

export const Select = styled.select`
  padding: 12px 16px;
  border-radius: 14px;
  border: 2px solid rgba(255, 255, 255, 0.05);
  background: rgba(0, 0, 0, 0.2);
  color: #fff;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s ease;

  @media (min-width: 480px) {
    padding: 13px 17px;
    font-size: 15px;
    border-radius: 15px;
  }

  @media (min-width: 768px) {
    padding: 14px 18px;
    font-size: 16px;
    border-radius: 16px;
  }

  &:focus {
    outline: none;
    border-color: #40e0d0;
    box-shadow: 0 0 0 4px rgba(64, 224, 208, 0.1);
  }

  option {
    background: #1a2a35;
  }
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
  flex-direction: column;

  @media (min-width: 480px) {
    flex-direction: row;
    gap: 12px;
    margin-top: 22px;
  }

  @media (min-width: 768px) {
    gap: 12px;
    margin-top: 24px;
  }
`;

export const ModalButton = styled.button`
  flex: 1;
  padding: 12px;
  border-radius: 14px;
  border: none;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${({ $primary }) => 
    $primary 
      ? 'linear-gradient(135deg, #40e0d0, #2aa88a)' 
      : 'rgba(255, 255, 255, 0.05)'};
  color: ${({ $primary }) => $primary ? '#0f1a24' : '#fff'};

  @media (min-width: 480px) {
    padding: 13px;
    font-size: 15px;
    border-radius: 15px;
  }

  @media (min-width: 768px) {
    padding: 14px;
    font-size: 16px;
    border-radius: 16px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ $primary }) => 
      $primary 
        ? '0 8px 20px rgba(64, 224, 208, 0.4)' 
        : '0 8px 20px rgba(255, 255, 255, 0.1)'};
  }

  &:active {
    transform: translateY(0);
  }
`;

/* Loading Spinner */
export const Spinner = styled.div`
  width: 36px;
  height: 36px;
  border: 3px solid rgba(64, 224, 208, 0.1);
  border-top-color: #40e0d0;
  border-radius: 50%;
  animation: ${rotate} 1s linear infinite;
  margin: 30px auto;

  @media (min-width: 480px) {
    width: 38px;
    height: 38px;
    margin: 35px auto;
  }

  @media (min-width: 768px) {
    width: 40px;
    height: 40px;
    margin: 40px auto;
  }
`;