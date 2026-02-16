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
  MapContainer,
  MapImage,
  PopupOverlay,
  Popup,
  PopupIcon,
  PopupTitle,
  PopupMessage,
  CloseButton,
  LoadingSpinner
} from './ContactUs.styles';
// import { FiFacebookF, FiTwitter ,FiInstagram, FiLinkedin, FiYoutube } from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube, FaInstagram } from "react-icons/fa";

const ContactUs = () => {
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

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (formData.phone && !/^[\d\s-+()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
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
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Form submitted:', formData);
    setIsSubmitting(false);
    setShowPopup(true);

    // Reset form
    setFormData({ 
      name: '', 
      email: '', 
      phone: '', 
      subject: '',
      message: '' 
    });
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const contactInfo = {
    phone: '+1 (888) 123-4567',
    email: 'contact@expertyard.com',
    address: '123 Innovation Drive, Silicon Valley, CA 94025',
    hours: 'Monday - Friday: 9:00 AM - 6:00 PM PST',
    support: '24/7 Support Available'
  };

  return (
    <PageContainer>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Get in Touch With Us</HeroTitle>
          <HeroSubtitle>
            Have questions? We'd love to hear from you. Our team is here to help 
            and typically responds within 24 hours.
          </HeroSubtitle>
        </HeroContent>
      </HeroSection>

      <MainContent>
        <FormContainer>
          <FormTitle>Send us a Message</FormTitle>
          <FormSubtitle>
            Fill out the form below and we'll get back to you as soon as possible.
          </FormSubtitle>
          
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Full Name *</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span style={{ color: '#e53e3e', fontSize: '14px', marginTop: '5px' }}>{errors.name}</span>}
            </FormGroup>

            <FormGroup>
              <Label>Email Address *</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span style={{ color: '#e53e3e', fontSize: '14px', marginTop: '5px' }}>{errors.email}</span>}
            </FormGroup>

            <FormGroup>
              <Label>Phone Number</Label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (123) 456-7890"
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <span style={{ color: '#e53e3e', fontSize: '14px', marginTop: '5px' }}>{errors.phone}</span>}
            </FormGroup>

            <FormGroup>
              <Label>Subject</Label>
              <Input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What's this regarding?"
              />
            </FormGroup>

            <FormGroup>
              <Label>Message *</Label>
              <TextArea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us how we can help you..."
                className={errors.message ? 'error' : ''}
              />
              {errors.message && <span style={{ color: '#e53e3e', fontSize: '14px', marginTop: '5px' }}>{errors.message}</span>}
            </FormGroup>

            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoadingSpinner /> Sending Message...
                </>
              ) : (
                'Send Message'
              )}
            </SubmitButton>
          </Form>
        </FormContainer>

        <InfoContainer>
          <InfoCard>
            <CardIcon>📞</CardIcon>
            <CardTitle>Call Us</CardTitle>
            <CardContent>
              <ContactDetail>{contactInfo.phone}</ContactDetail>
              <ContactDetail>{contactInfo.hours}</ContactDetail>
              <ContactDetail style={{ color: '#667eea', fontWeight: '500' }}>
                {contactInfo.support}
              </ContactDetail>
            </CardContent>
          </InfoCard>

          <InfoCard>
            <CardIcon>✉️</CardIcon>
            <CardTitle>Email Us</CardTitle>
            <CardContent>
              <ContactDetail>{contactInfo.email}</ContactDetail>
              <ContactDetail>careers@expertyard.com</ContactDetail>
              <ContactDetail>support@expertyard.com</ContactDetail>
            </CardContent>
          </InfoCard>

          <InfoCard>
            <CardIcon>📍</CardIcon>
            <CardTitle>Visit Us</CardTitle>
            <CardContent>
              <ContactDetail>{contactInfo.address}</ContactDetail>
              <ContactDetail>Office Hours: {contactInfo.hours}</ContactDetail>
            </CardContent>
            
            <MapContainer>
              <MapImage 
                src="https://via.placeholder.com/400x250?text=Office+Location+Map" 
                alt="Office Location"
              />
            </MapContainer>
          </InfoCard>

          <InfoCard>
            <CardTitle>Connect With Us</CardTitle>
            <CardContent>
              Follow us on social media for updates and news.
            </CardContent>
            <SocialLinks>
              <SocialLink href="#" target="_blank"><FaFacebookF /></SocialLink>
              <SocialLink href="#" target="_blank"><FaTwitter /></SocialLink>
              <SocialLink href="#" target="_blank"><FaInstagram /></SocialLink>
                <SocialLink href="#" target="_blank"><FaLinkedinIn /></SocialLink>
              <SocialLink href="#" target="_blank"><FaYoutube /></SocialLink>
            </SocialLinks>
          </InfoCard>
        </InfoContainer>
      </MainContent>

      {showPopup && (
        <PopupOverlay onClick={closePopup}>
          <Popup onClick={e => e.stopPropagation()}>
            <PopupIcon>✓</PopupIcon>
            <PopupTitle>Message Sent!</PopupTitle>
            <PopupMessage>
              Thank you for reaching out to us! Our team has received your message 
              and will get back to you within 24-48 hours. We appreciate your 
              interest in ExpertYard.
            </PopupMessage>
            <CloseButton onClick={closePopup}>Got it, thanks!</CloseButton>
          </Popup>
        </PopupOverlay>
      )}
    </PageContainer>
  );
};

export default ContactUs;