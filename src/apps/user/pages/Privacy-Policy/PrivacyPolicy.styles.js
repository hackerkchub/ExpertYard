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
  padding: 100px 20px 60px;
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
  max-width: 900px;
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
  margin-bottom: 20px;
  animation: fadeInUp 1s ease;
`;

export const LastUpdated = styled.div`
  display: inline-block;
  padding: 8px 20px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  font-size: 14px;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: fadeInUp 1.2s ease;
`;

export const MainContainer = styled.div`
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 20px;
  gap: 40px;
   width: 100%;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

export const ContentWrapper = styled.div`
  flex: 3;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  padding: 50px;
   width: 100%;
max-width: 900px;
margin: 0 auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
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

export const Section = styled.section`
  margin-bottom: 50px;
  scroll-margin-top: 100px;
  position: relative;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 25px;
  position: relative;
  padding-bottom: 15px;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
  }

  &::before {
    content: counter(section-counter);
    counter-increment: section-counter;
    position: absolute;
    left: -50px;
    top: 0;
    font-size: 16px;
    font-weight: 600;
    color: #667eea;
    background: white;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
  }
`;

export const Paragraph = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: #4a5568;
  margin-bottom: 20px;
  padding-left: 20px;
  border-left: 3px solid #e2e8f0;
  transition: all 0.3s ease;

  &:hover {
    border-left-color: #667eea;
    transform: translateX(5px);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const HighlightText = styled.span`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 600;
`;

export const ImportantNote = styled.div`
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 15px;
  padding: 25px;
  margin: 30px 0;
  border-left: 5px solid #f59e0b;
  position: relative;
  overflow: hidden;

  &::before {
    content: '⚠️';
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 24px;
    opacity: 0.2;
  }
`;

export const ImportantNoteTitle = styled.h4`
  font-size: 18px;
  font-weight: 700;
  color: #92400e;
  margin-bottom: 10px;
`;

export const ImportantNoteText = styled.p`
  color: #78350f;
  line-height: 1.7;
  margin: 0;
`;

export const DataList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 20px 0;
`;

export const DataListItem = styled.li`
  padding: 12px 20px;
  margin-bottom: 10px;
  background: #f7fafc;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #4a5568;
  transition: all 0.3s ease;

  &:hover {
    background: #edf2f7;
    transform: translateX(5px);
  }

  &::before {
    content: '✓';
    color: #667eea;
    font-weight: bold;
  }
`;

export const Sidebar = styled.aside`
  flex: 1;
  position: sticky;
  top: 40px;
  height: fit-content;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px 20px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
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

export const SidebarTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: '📋';
    font-size: 20px;
  }
`;

export const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const NavItem = styled.li`
  margin-bottom: 10px;
`;

export const NavLink = styled.a`
  text-decoration: none;
  color: ${props => props.active ? '#667eea' : '#4a5568'};
  font-size: 15px;
  font-weight: ${props => props.active ? '600' : '400'};
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: ${props => props.active ? 'rgba(102, 126, 234, 0.1)' : 'transparent'};
  border: 1px solid ${props => props.active ? '#667eea' : 'transparent'};

  &:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.05);
    transform: translateX(5px);
    border-color: #667eea;
  }

  &::before {
    content: '→';
    opacity: ${props => props.active ? '1' : '0.5'};
    transition: opacity 0.3s ease;
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

export const FooterNote = styled.div`
  margin-top: 40px;
  padding: 20px;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border-radius: 15px;
  text-align: center;
  color: #4a5568;
  font-size: 14px;
  border: 1px solid #e2e8f0;
`;

export const ContactLink = styled.a`
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    color: #764ba2;
    text-decoration: underline;
  }
`;

export const CookieConsent = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  max-width: 400px;
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: slideUp 0.5s ease;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const CookieTitle = styled.h4`
  font-size: 16px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: '🍪';
    font-size: 20px;
  }
`;

export const CookieText = styled.p`
  font-size: 14px;
  color: #4a5568;
  margin-bottom: 15px;
  line-height: 1.6;
`;

export const CookieButtons = styled.div`
  display: flex;
  gap: 10px;
`;

export const CookieButton = styled.button`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &.accept {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }
  }

  &.decline {
    background: #e2e8f0;
    color: #4a5568;

    &:hover {
      background: #cbd5e0;
    }
  }
`;