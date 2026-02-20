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

export const MainContent = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 20px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 40px;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    padding: 40px 15px;
    gap: 25px;
  }
`;

export const FormContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  padding: 50px;
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
      @media (max-width: 768px) {
            padding: 25px;
           border-radius: 20px;
       }
  }
`;

export const FormTitle = styled.h2`
  font-size: 36px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 10px;
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

export const FormSubtitle = styled.p`
  color: #718096;
  font-size: 16px;
  margin-bottom: 40px;
  line-height: 1.6;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 5px;

  &::before {
    content: '•';
    color: #667eea;
    font-size: 20px;
  }
`;

export const Input = styled.input`
  padding: 16px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 15px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: white;
  width: 100%;
box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

export const TextArea = styled.textarea`
  padding: 16px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 15px;
  font-size: 16px;
  min-height: 150px;
  resize: vertical;
  transition: all 0.3s ease;
  background: white;
  width: 100%;
box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

export const SubmitButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 18px 30px;
  border-radius: 15px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  min-width: 0;
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

export const InfoCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  padding: 30px;
  width: 100%;
box-sizing: border-box;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid rgba(102, 126, 234, 0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 25px 50px rgba(102, 126, 234, 0.2);
  }
`;

export const CardIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: white;
  font-size: 24px;
`;

export const CardTitle = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 15px;
`;

export const CardContent = styled.div`
  color: #4a5568;
  line-height: 1.8;
`;

export const ContactDetail = styled.p`
  margin: 8px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #4a5568;

  &:hover {
    color: #667eea;
  }
`;

export const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
`;

export const SocialLink = styled.a`
  width: 45px;
  height: 45px;
  background: #f7fafc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  font-size: 20px;
  transition: all 0.3s ease;
  text-decoration: none;

  &:hover {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    transform: translateY(-3px);
  }
`;

export const MapContainer = styled.div`
  border-radius: 25px;
  overflow: hidden;
  height: 250px;
  margin-top: 20px;
  border: 1px solid rgba(102, 126, 234, 0.1);
`;

export const MapImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export const Popup = styled.div`
  background: white;
  border-radius: 30px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  text-align: center;
  animation: slideUp 0.5s ease;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);

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

export const PopupIcon = styled.div`
  font-size: 70px;
  margin-bottom: 20px;
  animation: bounce 1s ease;

  @keyframes bounce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }
`;

export const PopupTitle = styled.h3`
  font-size: 32px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 15px;
`;

export const PopupMessage = styled.p`
  color: #4a5568;
  line-height: 1.8;
  margin-bottom: 30px;
  font-size: 16px;
`;

export const CloseButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
  }
`;

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255,255,255,.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export const FloatingLabel = styled.span`
  position: absolute;
  top: -10px;
  left: 15px;
  background: white;
  padding: 0 5px;
  font-size: 12px;
  color: #667eea;
  font-weight: 600;
`;

export const InputWrapper = styled.div`
  position: relative;
`;