import styled from 'styled-components';

export const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  position: relative;
  overflow-x: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ff6b6b 0%, #4ecdc4 100%);
    z-index: 10;
  }
`;

export const HeroSection = styled.section`
  position: relative;
  padding: 100px 20px 80px;
  text-align: center;
  color: white;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    animation: rotate 20s linear infinite;
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

export const HeroContent = styled.div`
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  z-index: 1;
`;

export const HeroTitle = styled.h1`
  font-size: 56px;
  font-weight: 800;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 10px 30px rgba(0,0,0,0.2);
  animation: fadeInUp 0.8s ease;

  @media (max-width: 768px) {
    font-size: 40px;
  }
`;

export const HeroSubtitle = styled.p`
  font-size: 18px;
  line-height: 1.8;
  opacity: 0.95;
  margin-bottom: 40px;
  animation: fadeInUp 1s ease;
`;

export const SearchContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  animation: fadeInUp 1.2s ease;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 20px 30px;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
    transform: translateY(-2px);
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

export const SearchIcon = styled.span`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #667eea;
  font-size: 20px;
  cursor: pointer;
`;

export const MainContainer = styled.div`
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 20px;
  gap: 40px;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

export const Sidebar = styled.aside`
  width: 320px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  padding: 30px 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  height: fit-content;
  position: sticky;
  top: 40px;
  animation: slideInLeft 0.8s ease;

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

export const SidebarTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: '📚';
    font-size: 24px;
  }
`;

export const CategoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const CategoryItem = styled.li`
  padding: 15px 20px;
  margin-bottom: 10px;
  border-radius: 15px;
  cursor: pointer;
  font-size: 16px;
  font-weight: ${props => props.active ? '600' : '400'};
  color: ${props => props.active ? '#667eea' : '#4a5568'};
  background: ${props => props.active ? 'rgba(102, 126, 234, 0.1)' : 'transparent'};
  border: 1px solid ${props => props.active ? '#667eea' : 'transparent'};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;

  &:hover {
    background: rgba(102, 126, 234, 0.05);
    transform: translateX(5px);
    border-color: #667eea;
  }

  &::before {
    content: '→';
    opacity: ${props => props.active ? '1' : '0.5'};
  }
`;

export const ContentArea = styled.div`
  flex: 1;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  animation: slideInRight 0.8s ease;

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

export const CategoryTitle = styled.h3`
  font-size: 32px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 30px;
  position: relative;
  padding-bottom: 15px;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
  }
`;

export const FAQCard = styled.div`
  background: white;
  border-radius: 20px;
  margin-bottom: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
  overflow: hidden;

  &:hover {
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.1);
    transform: translateY(-2px);
  }
`;

export const QuestionWrapper = styled.div`
  padding: 25px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background: ${props => props.open ? 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)' : 'white'};
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  }
`;

export const Question = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 15px;

  &::before {
    content: '❓';
    font-size: 20px;
    opacity: 0.7;
  }
`;

export const ToggleIcon = styled.span`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.open ? '#667eea' : '#e2e8f0'};
  color: ${props => props.open ? 'white' : '#4a5568'};
  border-radius: 50%;
  font-size: 20px;
  font-weight: 600;
  transition: all 0.3s ease;
`;

export const Answer = styled.div`
  padding: 0 30px 25px 30px;
  color: #4a5568;
  line-height: 1.8;
  font-size: 16px;
  animation: slideDown 0.3s ease;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const ContactSection = styled.div`
  margin-top: 50px;
  padding: 30px;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border-radius: 20px;
  text-align: center;
`;

export const ContactTitle = styled.h4`
  font-size: 20px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 15px;
`;

export const ContactText = styled.p`
  color: #4a5568;
  margin-bottom: 20px;
  line-height: 1.6;
`;

export const ContactButtons = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
`;

export const ContactButton = styled.button`
  padding: 12px 30px;
  border: none;
  border-radius: 30px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &.chat {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
    }
  }

  &.email {
    background: white;
    color: #667eea;
    border: 2px solid #667eea;

    &:hover {
      background: #667eea;
      color: white;
      transform: translateY(-2px);
    }
  }
`;

export const NoResults = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #4a5568;
`;

export const NoResultsIcon = styled.div`
  font-size: 60px;
  margin-bottom: 20px;
  opacity: 0.5;
`;

export const NoResultsText = styled.p`
  font-size: 18px;
  margin-bottom: 20px;
`;

export const PopularTopics = styled.div`
  margin-top: 40px;
`;

export const PopularTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 15px;
`;

export const TopicTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const TopicTag = styled.span`
  padding: 8px 20px;
  background: #edf2f7;
  border-radius: 30px;
  font-size: 14px;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #667eea;
    color: white;
    transform: translateY(-2px);
  }
`;

export const ProgressBar = styled.div`
  position: fixed;
  top: 4px;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #ff6b6b 0%, #4ecdc4 100%);
  transform-origin: 0%;
  z-index: 1001;
`;

export const ScrollToTop = styled.button`
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  opacity: ${props => props.visible ? '1' : '0'};
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
  z-index: 1000;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
  }
`;