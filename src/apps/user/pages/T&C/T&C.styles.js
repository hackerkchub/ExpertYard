import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  position: relative;
  width: 100%;

  background: linear-gradient(
    to bottom,
    #6a5acd 0%,      
    #5f7cff 35%,     
    #5f7cff 100%
  );

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    z-index: 2;
  }
`;

export const LayoutWrapper = styled.div`
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  padding: 120px 40px 40px 40px;
  gap: 40px;
  position: relative;
  width: 100%;

  @media (max-width: 1024px) {
    padding: 100px 30px 30px 30px;
    gap: 30px;
  }

  @media (max-width: 768px) {
    padding: 80px 20px 30px 20px;
  }

  @media (max-width: 480px) {
    padding: 70px 15px 20px 15px;
  }
`;

export const MainContent = styled.main`
  flex: 3;
  max-width: 900px;
  width: 100%;

  @media (max-width: 768px) {
    flex: 1;
    max-width: 100%;
  }
`;

export const ContentWrapper = styled.div`
  background: white;
  backdrop-filter: blur(10px);
  border-radius: 28px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15), 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 48px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  @media (max-width: 1024px) {
    padding: 40px;
  }

  @media (max-width: 768px) {
    padding: 30px;
    border-radius: 20px;
  }

  @media (max-width: 480px) {
    padding: 20px;
    border-radius: 16px;
  }
`;

export const Title = styled.h1`
  font-size: 42px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
  letter-spacing: -0.5px;

  @media (max-width: 1024px) {
    font-size: 36px;
  }

  @media (max-width: 768px) {
    font-size: 32px;
  }

  @media (max-width: 480px) {
    font-size: 28px;
  }
`;

export const UpdatedDate = styled.p`
  color: #666;
  font-size: 14px;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '🕒';
    font-size: 16px;
  }

  @media (max-width: 768px) {
    font-size: 13px;
    margin-bottom: 24px;
    padding-bottom: 12px;
  }
`;

export const Section = styled.section`
  margin-bottom: 48px;
  scroll-margin-top: 100px;

  @media (max-width: 768px) {
    margin-bottom: 36px;
    scroll-margin-top: 80px;
  }

  @media (max-width: 480px) {
    margin-bottom: 30px;
    scroll-margin-top: 70px;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;

  &::before {
    content: '';
    width: 4px;
    height: 28px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 22px;
    margin-bottom: 16px;

    &::before {
      height: 24px;
    }
  }

  @media (max-width: 480px) {
    font-size: 20px;
    margin-bottom: 14px;
  }
`;

export const Paragraph = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: #4a5568;
  margin-bottom: 16px;
  padding-left: 20px;
  border-left: 2px solid #e2e8f0;
  transition: border-color 0.3s ease;

  &:hover {
    border-left-color: #667eea;
  }

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    font-size: 15px;
    line-height: 1.7;
    padding-left: 16px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    line-height: 1.6;
    padding-left: 12px;
    margin-bottom: 12px;
  }
`;

/* Desktop Sidebar */
export const DesktopSidebar = styled.aside`
  flex: 1;
  position: sticky;
  top: 120px;
  height: fit-content;
  max-width: 300px;
  padding: 32px 24px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);

  @media (max-width: 1024px) {
    max-width: 260px;
    padding: 24px 20px;
    top: 100px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

/* Mobile Navigation Toggle */
export const MobileNavToggle = styled.button`
  display: none;
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1100;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px;

  span {
    display: block;
    width: 24px;
    height: 2px;
    background: ${props => props.isOpen ? '#667eea' : '#2d3748'};
    transition: all 0.3s ease;

    &:first-child {
      transform: ${props => props.isOpen ? 'rotate(45deg) translate(6px, 6px)' : 'none'};
    }

    &:nth-child(2) {
      opacity: ${props => props.isOpen ? '0' : '1'};
    }

    &:last-child {
      transform: ${props => props.isOpen ? 'rotate(-45deg) translate(6px, -6px)' : 'none'};
    }
  }

  @media (max-width: 768px) {
    display: flex;
  }

  @media (max-width: 480px) {
    width: 42px;
    height: 42px;
    top: 15px;
    right: 15px;
  }
`;

/* Mobile Navigation Overlay */
export const MobileNavOverlay = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1050;
  opacity: ${props => props.show ? '1' : '0'};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    display: block;
  }
`;

/* Mobile Sidebar */
export const MobileSidebar = styled.aside`
  display: none;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 280px;
  background: white;
  z-index: 1150;
  padding: 80px 20px 30px;
  box-shadow: -5px 0 30px rgba(0, 0, 0, 0.15);
  transform: ${props => props.show ? 'translateX(0)' : 'translateX(100%)'};
  transition: transform 0.3s ease;
  overflow-y: auto;

  @media (max-width: 768px) {
    display: block;
  }

  @media (max-width: 480px) {
    width: 240px;
    padding: 70px 15px 20px;
  }

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 4px;
  }
`;

export const SidebarTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  }

  @media (max-width: 480px) {
    font-size: 18px;
    margin-bottom: 20px;
    padding-bottom: 10px;
  }
`;

export const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const NavItem = styled.li`
  margin-bottom: 12px;

  @media (max-width: 480px) {
    margin-bottom: 8px;
  }
`;

export const NavLink = styled.a`
  text-decoration: none;
  color: ${props => props.active ? '#667eea' : '#4a5568'};
  font-size: 15px;
  font-weight: ${props => props.active ? '600' : '400'};
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 10px;
  transition: all 0.3s ease;
  background: ${props => props.active ? 'rgba(102, 126, 234, 0.1)' : 'transparent'};
  cursor: pointer;

  &:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.05);
    transform: translateX(5px);
  }

  &::before {
    content: '→';
    opacity: ${props => props.active ? '1' : '0'};
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 8px 12px;
  }
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

  @media (max-width: 768px) {
    bottom: 30px;
    right: 30px;
    width: 45px;
    height: 45px;
    font-size: 18px;
  }

  @media (max-width: 480px) {
    bottom: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
`;

export const ProgressBar = styled.div`
  position: fixed;
  top: 4px;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transform-origin: 0%;
  z-index: 1001;
`;