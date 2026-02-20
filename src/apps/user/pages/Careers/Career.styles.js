import styled from 'styled-components';

export const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
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
  padding: 120px 20px 80px;
  text-align: center;
  color: white;
  width: 100%;
box-sizing: border-box;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
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

export const StatsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 60px;
  margin-top: 60px;
  animation: fadeInUp 1.2s ease;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 30px;
  }
`;

export const StatItem = styled.div`
  text-align: center;
`;

export const StatNumber = styled.div`
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 5px;
  background: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const StatLabel = styled.div`
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.8;
`;

export const MainContent = styled.main`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 20px;
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 40px;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 25px;              
    padding: 40px 15px;
  }
`;

export const LeftColumn = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  padding: 40px;
  width: 100%;
  box-sizing: border-box;
  @media (max-width: 768px) {
  padding: 20px;
}
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

export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
   width: 100%;              
  box-sizing: border-box;
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

export const SectionTitle = styled.h2`
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

export const JobGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 50px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const JobCard = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid rgba(102, 126, 234, 0.1);
  cursor: pointer;
   width: 100%;
   max-width: 100%;
  box-sizing: border-box;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(102, 126, 234, 0.2);
    border-color: #667eea;
  }
`;

export const JobTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 10px;
`;

export const JobLocation = styled.div`
  display: inline-block;
  padding: 5px 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 15px;
`;

export const JobDescription = styled.p`
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 20px;
`;

export const ApplyButton = styled.button`
  background: transparent;
  border: 2px solid #667eea;
  color: #667eea;
  padding: 8px 20px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #667eea;
    color: white;
  }
`;

export const FormContainer = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
   width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const FormTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 25px;
  text-align: center;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  width: 100%;
  box-sizing: border-box;
  padding: 15px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  padding: 15px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  min-height: 120px;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

export const FileInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  border: 2px dashed #e2e8f0;
  border-radius: 12px;
  cursor: pointer;

  &::-webkit-file-upload-button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    margin-right: 15px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }
  }
`;

export const SubmitButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const InfoCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid rgba(102, 126, 234, 0.1);
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  @media (max-width: 480px) {
  padding: 20px;
}

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(102, 126, 234, 0.15);
  }
`;

export const InfoCardTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: '✨';
    font-size: 24px;
  }
`;

export const InfoCardText = styled.p`
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 15px;
`;

export const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #4a5568;

  &::before {
    content: '📧';
    font-size: 18px;
  }

  &:nth-child(2)::before {
    content: '📞';
  }
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
  padding: 40px;
  max-width: 450px;
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
  font-size: 60px;
  margin-bottom: 20px;
  animation: bounce 1s ease;

  @keyframes bounce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }
`;

export const PopupTitle = styled.h3`
  font-size: 28px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 15px;
`;

export const PopupMessage = styled.p`
  color: #4a5568;
  line-height: 1.8;
  margin-bottom: 25px;
  font-size: 16px;
`;

export const CloseButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
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