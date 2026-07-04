import React, { useState } from 'react';
import {
  PageContainer,
  HeroSection,
  HeroContent,
  HeroTitle,
  HeroSubtitle,
  MainContent,
  FormContainer,
  FormTitle,
  FormSubtitle,
  Form,
  FormGroup,
  Label,
  Input,
  TextArea,
  SubmitButton,
  InfoContainer,
  InfoCard,
  CardIcon,
  CardTitle,
  CardContent,
  ContactDetail,
  SocialLinks,
  SocialLink,
  PopupOverlay,
  Popup,
  PopupIcon,
  PopupTitle,
  PopupMessage,
  CloseButton,
  LoadingSpinner
} from './ContactUs.styles';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";

const ContactUs = () => {
  // Web3Forms API Key
  const WEB3_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Form validation logic - Professional error messages
  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address (e.g., name@domain.com)';
    }
    
    // Phone validation - Indian numbers
    if (formData.phone && formData.phone.trim()) {
      const cleanPhone = (formData.phone || "").replace(/\D/g, '');
      if (cleanPhone.length === 0) {
        newErrors.phone = 'Phone number cannot be empty';
      } else if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
        newErrors.phone = 'Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9';
      }
    }
    
    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before proceeding
    if (!validateForm()) {
      // Scroll to the first error field
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
      }
      return;
    }

    if (!WEB3_KEY) {
      alert("Web3Forms API key is missing. Please check your environment configuration.");
      return;
    }

    setIsSubmitting(true);

    // Simplified payload - only essential fields for testing
    const payload = {
      access_key: WEB3_KEY,
      name: formData.name,
      email: formData.email,
      phone: formData.phone || "",
      subject: formData.subject || "New Contact Enquiry - G9 Experts",
      message: formData.message,
      // Custom fields for additional info
      company: "Softmaxs Solution LLP",
      platform: "G9 Experts"
    };

    try {
      const response = await fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (result.success) {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
        
        setShowPopup(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        setErrors({});
      } else {
        alert(result.message || "Unable to send your enquiry. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again later.");
    }

    setIsSubmitting(false);
  };

  const closePopup = () => setShowPopup(false);

  const contactInfo = {
    phone: "+91 8103007446",
    email: "support@g9expert.com",
    address: `Nandan Bagh Colony,
Kushwaha Nagar,
Indore,
Madhya Pradesh,
India`,
    hours: "Monday - Saturday | 10:00 AM - 7:00 PM (IST)",
    support: "General Support • Expert Registration • Payment Assistance",
    company: "Softmaxs Solution LLP",
    platform: "G9 Expert",
    website: "https://g9expert.com"
  };

  // Social media links with actual URLs
  const socialLinks = {
    instagram: "https://www.instagram.com/g9expert_/",
    linkedin: "https://www.linkedin.com/in/g9-experts-expert-464271408",
    youtube: "https://www.youtube.com/@G9Experts",
    facebook: "#" // No Facebook link available - disabled
  };

  return (
    <PageContainer>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Contact G9 Experts</HeroTitle>
          <HeroSubtitle>
            Need help with your account, payments, expert registration, partnerships, or general enquiries?
            <br />
            Our support team is here to assist you during business hours.
          </HeroSubtitle>
        </HeroContent>
      </HeroSection>

      <MainContent>
        <FormContainer>
          <FormTitle>Contact Our Team</FormTitle>
          <FormSubtitle>
            Have a question or need assistance?
            Fill in the details below and our team will get back to you as soon as possible.
          </FormSubtitle>
          
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Full Name *</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Raj Sharma"
                autoComplete="name"
                className={errors.name ? 'error' : ''}
                style={errors.name ? { borderColor: '#e53e3e' } : {}}
              />
              {errors.name && (
                <span style={{ 
                  color: '#e53e3e', 
                  fontSize: '14px', 
                  marginTop: '5px',
                  display: 'block'
                }}>
                  {errors.name}
                </span>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Email Address *</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                autoComplete="email"
                className={errors.email ? 'error' : ''}
                style={errors.email ? { borderColor: '#e53e3e' } : {}}
              />
              {errors.email && (
                <span style={{ 
                  color: '#e53e3e', 
                  fontSize: '14px', 
                  marginTop: '5px',
                  display: 'block'
                }}>
                  {errors.email}
                </span>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Phone Number</Label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                autoComplete="tel"
                className={errors.phone ? 'error' : ''}
                style={errors.phone ? { borderColor: '#e53e3e' } : {}}
              />
              {errors.phone && (
                <span style={{ 
                  color: '#e53e3e', 
                  fontSize: '14px', 
                  marginTop: '5px',
                  display: 'block'
                }}>
                  {errors.phone}
                </span>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Subject</Label>
              <Input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. Expert Registration, Payment Issue, Partnership"
                autoComplete="off"
              />
            </FormGroup>

            <FormGroup>
              <Label>Message *</Label>
              <TextArea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Please describe your query in detail..."
                className={errors.message ? 'error' : ''}
                style={errors.message ? { borderColor: '#e53e3e' } : {}}
              />
              {errors.message && (
                <span style={{ 
                  color: '#e53e3e', 
                  fontSize: '14px', 
                  marginTop: '5px',
                  display: 'block'
                }}>
                  {errors.message}
                </span>
              )}
            </FormGroup>

            <SubmitButton 
              type="submit" 
              disabled={isSubmitting}
              style={{ 
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner /> Sending...
                </>
              ) : (
                'Send Message'
              )}
            </SubmitButton>

            <div style={{ marginTop: '15px', fontSize: '13px', color: '#666', textAlign: 'center' }}>
              By submitting this form you agree that G9 Experts may contact you 
              regarding your enquiry using the information you have provided.
            </div>
          </Form>
        </FormContainer>

        <InfoContainer>
          <InfoCard>
            <CardIcon>📞</CardIcon>
            <CardTitle>Phone Support</CardTitle>
            <CardContent>
              <ContactDetail>
                <a href="tel:+918103007446" style={{ color: '#000080', textDecoration: 'none' }}>
                  {contactInfo.phone}
                </a>
              </ContactDetail>
              <ContactDetail>Monday - Saturday</ContactDetail>
              <ContactDetail>10:00 AM – 7:00 PM (IST)</ContactDetail>
              <ContactDetail style={{ color: '#000080', fontWeight: '500', marginTop: '10px' }}>
                {contactInfo.support}
              </ContactDetail>
            </CardContent>
          </InfoCard>

          <InfoCard>
            <CardIcon>✉️</CardIcon>
            <CardTitle>Email Support</CardTitle>
            <CardContent>
              <ContactDetail>
                <a href="mailto:support@g9expert.com" style={{ color: '#000080', textDecoration: 'none' }}>
                  {contactInfo.email}
                </a>
              </ContactDetail>
              <ContactDetail>General, Business & Partnership Enquiries</ContactDetail>
            </CardContent>
          </InfoCard>

          <InfoCard>
            <CardIcon>🏢</CardIcon>
            <CardTitle>Company Information</CardTitle>
            <CardContent>
              <ContactDetail style={{ fontWeight: 'bold' }}>
                {contactInfo.company}
              </ContactDetail>
              <ContactDetail>Platform: {contactInfo.platform}</ContactDetail>
              <ContactDetail>
                Website:{' '}
                <a 
                  href={contactInfo.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ color: '#000080', textDecoration: 'none' }}
                >
                  g9expert.com
                </a>
              </ContactDetail>
              <ContactDetail style={{ marginTop: '10px' }}>
                Registered Office:
              </ContactDetail>
              <ContactDetail>Nandan Bagh Colony</ContactDetail>
              <ContactDetail>Kushwaha Nagar</ContactDetail>
              <ContactDetail>Indore, Madhya Pradesh</ContactDetail>
              <ContactDetail>India</ContactDetail>
            </CardContent>
          </InfoCard>

          <InfoCard>
            <CardTitle>Connect With Us</CardTitle>
            <CardContent>
              <p style={{ margin: '0 0 15px 0', color: '#555' }}>
                Follow us on social media for updates and news.
              </p>
            </CardContent>
            <SocialLinks>
              <SocialLink 
                href={socialLinks.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram />
              </SocialLink>
              <SocialLink 
                href={socialLinks.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </SocialLink>
              <SocialLink 
                href={socialLinks.youtube} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <FaYoutube />
              </SocialLink>
              <SocialLink 
                href="#" 
                style={{ cursor: 'default', opacity: 0.4 }}
                aria-label="Facebook (Coming Soon)"
              >
                <FaFacebookF />
              </SocialLink>
            </SocialLinks>
          </InfoCard>
        </InfoContainer>
      </MainContent>

      {showPopup && (
        <PopupOverlay onClick={closePopup}>
          <Popup onClick={e => e.stopPropagation()}>
            <PopupIcon>✓</PopupIcon>
            <PopupTitle>Message Received</PopupTitle>
            <PopupMessage>
              Thank you for contacting G9 Experts.
              <br /><br />
              Your enquiry has been successfully received.
              <br />
              Your enquiry has been successfully recorded.
              <br /><br />
              Our support team will get back to you as soon as possible during business hours.
            </PopupMessage>
            <CloseButton onClick={closePopup}>Got it, thanks!</CloseButton>
          </Popup>
        </PopupOverlay>
      )}
    </PageContainer>
  );
};

export default ContactUs;