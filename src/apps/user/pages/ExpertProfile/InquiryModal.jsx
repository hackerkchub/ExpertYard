import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FiX, FiMail, FiPhone, FiUser, FiInfo, FiSend } from "react-icons/fi";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import { APP_CONFIG } from "../../../../config/appConfig";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(40px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${fadeIn} 0.2s ease-out;
  padding: 16px;

  @media (max-width: 768px) {
    align-items: flex-end;
    padding: 0;
    min-height: 100dvh;
    z-index: 30000;
  }
`;

const ModalContent = styled.div`
  background: #ffffff;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: ${slideUp} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 90vh;

  @media (max-width: 768px) {
    height: min(92dvh, 760px);
    max-height: 92dvh;
    border-radius: 24px 24px 0 0;
    width: 100%;
  }
`;

const Header = styled.div`
  padding: 18px 24px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
  flex: 0 0 auto;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  transition: all 0.2s;

  &:hover {
    background: #e2e8f0;
    color: #0f172a;
  }
`;

const ScrollArea = styled.div`
  padding: 24px;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 768px) {
    padding: 20px 16px;
    overscroll-behavior: contain;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const IconLeft = styled.div`
  position: absolute;
  left: 14px;
  color: #94a3b8;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px 12px 42px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.2s;
  color: #0f172a;

  &:focus {
    border-color: #000080;
    box-shadow: 0 0 0 3px rgba(0, 0, 128, 0.1);
  }

  &:disabled {
    background: #f1f5f9;
    color: #64748b;
    cursor: not-allowed;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 0.95rem;
  outline: none;
  min-height: 100px;
  resize: vertical;
  transition: all 0.2s;
  color: #0f172a;

  &:focus {
    border-color: #000080;
    box-shadow: 0 0 0 3px rgba(0, 0, 128, 0.1);
  }
`;

const PillGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Pill = styled.button`
  type: button;
  padding: 8px 16px;
  border-radius: 30px;
  border: 1px solid ${props => (props.$selected ? "#000080" : "#cbd5e1")};
  background: ${props => (props.$selected ? "rgba(0, 0, 128, 0.05)" : "#ffffff")};
  color: ${props => (props.$selected ? "#000080" : "#475569")};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #000080;
    color: #000080;
  }
`;

const ConsentRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 4px;
`;

const Checkbox = styled.input`
  margin-top: 3px;
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const ConsentText = styled.span`
  font-size: 0.825rem;
  color: #475569;
  line-height: 1.4;
`;

const Footer = styled.div`
  padding: 16px 24px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f8fafc;
  flex: 0 0 auto;

  @media (max-width: 768px) {
    padding: 14px 16px calc(14px + env(safe-area-inset-bottom, 0px));
    position: sticky;
    bottom: 0;
    z-index: 2;
    box-shadow: 0 -12px 24px rgba(15, 23, 42, 0.08);
  }
`;

const FooterActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;

  @media (max-width: 768px) {
    width: 100%;

    button {
      flex: 1;
      justify-content: center;
    }
  }
`;

const Button = styled.button`
  padding: 11px 22px;
  border-radius: 30px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
`;

const CancelBtn = styled(Button)`
  background: #f1f5f9;
  color: #475569;

  &:hover {
    background: #e2e8f0;
  }
`;

const SubmitBtn = styled(Button)`
  background: #000080;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background: #000066;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMsg = styled.div`
  background: #fef2f2;
  border: 1px solid #fca5a5;
  color: #b91c1c;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.875rem;
  margin-bottom: 16px;
`;

const FooterErrorMsg = styled(ErrorMsg)`
  margin: 0;
  text-align: left;
`;

const SuccessOverlay = styled.div`
  padding: 40px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const SuccessIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 9999px;
  background: #d1fae5;
  color: #059669;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: 800;
`;

const SuccessTitle = styled.h4`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
`;

const SuccessText = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: #475569;
  line-height: 1.5;
`;

const LoginPromptContainer = styled.div`
  padding: 30px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
`;

const LoginTitle = styled.h4`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #0f172a;
`;

const LoginText = styled.p`
  margin: 0;
  font-size: 0.925rem;
  color: #475569;
  line-height: 1.5;
`;

export default function InquiryModal({ isOpen, onClose, expert }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    message: "",
    contactMethod: "Chat",
    contactTime: "Anytime",
    consent: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTextChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePillChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogin = () => {
    navigate("/user/auth", { state: { from: location, open_inquiry: true } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) return;

    setError("");
    setLoading(true);

    // Validation checks
    if (!formData.name.trim() || !formData.email.trim() || !formData.mobile.trim()) {
      setError("Please fill in your contact information");
      setLoading(false);
      return;
    }

    if (formData.subject.trim().length < 5 || formData.subject.trim().length > 150) {
      setError("Subject must be between 5 and 150 characters");
      setLoading(false);
      return;
    }

    if (formData.message.trim().length < 20 || formData.message.trim().length > 2000) {
      setError("Message must be between 20 and 2000 characters");
      setLoading(false);
      return;
    }

    if (!formData.consent) {
      setError("You must agree to share your details with the expert");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/inquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          expert_id: expert.id,
          subject: formData.subject,
          message: formData.message,
          preferred_contact_method: formData.contactMethod,
          preferred_contact_time: formData.contactTime,
          user_name: formData.name,
          user_email: formData.email,
          user_mobile: formData.mobile,
        }),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || "Failed to submit inquiry");
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message || "Unable to send your inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <Header>
          <Title>Send Inquiry</Title>
          <CloseButton onClick={onClose} aria-label="Close modal">
            <FiX size={20} />
          </CloseButton>
        </Header>

        <ScrollArea>
          {error && <ErrorMsg>{error}</ErrorMsg>}

          {!isLoggedIn ? (
            <LoginPromptContainer>
              <FiInfo size={44} color="#000080" />
              <LoginTitle>Login Required</LoginTitle>
              <LoginText>
                Please log in or create an account to send an inquiry to this expert.
              </LoginText>
              <div style={{ display: "flex", gap: "12px", width: "100%", marginTop: "10px" }}>
                <CancelBtn onClick={onClose} style={{ flex: 1 }}>Cancel</CancelBtn>
                <SubmitBtn onClick={handleLogin} style={{ flex: 1, justifyContent: "center" }}>Login</SubmitBtn>
              </div>
            </LoginPromptContainer>
          ) : success ? (
            <SuccessOverlay>
              <SuccessIcon>✓</SuccessIcon>
              <SuccessTitle>Inquiry sent successfully</SuccessTitle>
              <SuccessText>
                The expert has received your inquiry and will respond through G9Expert.
              </SuccessText>
              <SubmitBtn onClick={() => {
                onClose();
                navigate("/user/my-inquiries");
              }} style={{ marginTop: "14px" }}>
                View My Inquiries
              </SubmitBtn>
            </SuccessOverlay>
          ) : (
            <Form id="inquiry-form" onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Expert</Label>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px", background: "#f8fafc", borderRadius: "10px" }}>
                  {expert.profile_photo ? (
                    <img src={expert.profile_photo} alt={expert.name} style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#e2e8f0", display: "flex", alignItems: "center", justify: "center", fontWeight: "bold" }}>
                      {expert.name ? expert.name[0] : "E"}
                    </div>
                  )}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#0f172a" }}>{expert.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{expert.category_name || "Expert"}</div>
                  </div>
                </div>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="inquiry-name">Full Name</Label>
                <InputWrapper>
                  <IconLeft><FiUser size={16} /></IconLeft>
                  <Input
                    id="inquiry-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleTextChange}
                    required
                    placeholder="Your Name"
                  />
                </InputWrapper>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="inquiry-email">Email Address</Label>
                <InputWrapper>
                  <IconLeft><FiMail size={16} /></IconLeft>
                  <Input
                    id="inquiry-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleTextChange}
                    required
                    placeholder="name@example.com"
                  />
                </InputWrapper>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="inquiry-mobile">Mobile Number</Label>
                <InputWrapper>
                  <IconLeft><FiPhone size={16} /></IconLeft>
                  <Input
                    id="inquiry-mobile"
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleTextChange}
                    required
                    placeholder="Mobile Number"
                  />
                </InputWrapper>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="inquiry-subject">Subject</Label>
                <Input
                  id="inquiry-subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleTextChange}
                  style={{ paddingLeft: "14px" }}
                  required
                  placeholder="Example: Need guidance for a property dispute"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="inquiry-message">Describe your requirement</Label>
                <Textarea
                  id="inquiry-message"
                  name="message"
                  value={formData.message}
                  onChange={handleTextChange}
                  required
                  placeholder="Explain your requirement so the expert can understand how to help you."
                />
              </FormGroup>

              <FormGroup>
                <Label>Preferred Contact Method</Label>
                <PillGroup>
                  {["Chat", "Phone Call", "Video Call", "Email"].map(method => (
                    <Pill
                      key={method}
                      type="button"
                      $selected={formData.contactMethod === method}
                      onClick={() => handlePillChange("contactMethod", method)}
                    >
                      {method}
                    </Pill>
                  ))}
                </PillGroup>
              </FormGroup>

              <FormGroup>
                <Label>Preferred Contact Time</Label>
                <PillGroup>
                  {["Morning", "Afternoon", "Evening", "Anytime"].map(time => (
                    <Pill
                      key={time}
                      type="button"
                      $selected={formData.contactTime === time}
                      onClick={() => handlePillChange("contactTime", time)}
                    >
                      {time}
                    </Pill>
                  ))}
                </PillGroup>
              </FormGroup>

              <ConsentRow>
                <Checkbox
                  id="inquiry-consent"
                  type="checkbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleTextChange}
                  required
                />
                <ConsentText as="label" htmlFor="inquiry-consent">
                  I agree to share these details with the selected expert for responding to my inquiry.
                </ConsentText>
              </ConsentRow>
            </Form>
          )}
        </ScrollArea>

        {isLoggedIn && !success && (
          <Footer>
            {error && <FooterErrorMsg role="alert">{error}</FooterErrorMsg>}
            <FooterActions>
              <CancelBtn type="button" onClick={onClose}>Cancel</CancelBtn>
              <SubmitBtn type="submit" form="inquiry-form" disabled={loading}>
                <FiSend size={14} />
                {loading ? "Sending..." : "Send Inquiry"}
              </SubmitBtn>
            </FooterActions>
          </Footer>
        )}
      </ModalContent>
    </Overlay>
  );
}
