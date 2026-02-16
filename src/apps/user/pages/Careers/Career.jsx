import React, { useState, useEffect } from 'react';
import {
  PageContainer,
  HeroSection,
  HeroContent,
  HeroTitle,
  HeroSubtitle,
  StatsContainer,
  StatItem,
  StatNumber,
  StatLabel,
  MainContent,
  LeftColumn,
  RightColumn,
  SectionTitle,
  JobGrid,
  JobCard,
  JobTitle,
  JobLocation,
  JobDescription,
  ApplyButton,
  FormContainer,
  FormTitle,
  Form,
  FormGroup,
  Label,
  Input,
  TextArea,
  FileInput,
  SubmitButton,
  InfoCard,
  InfoCardTitle,
  InfoCardText,
  ContactInfo,
  ContactItem,
  PopupOverlay,
  Popup,
  PopupIcon,
  PopupTitle,
  PopupMessage,
  CloseButton,
  LoadingSpinner
} from './Career.styles';

const Career = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resume: null,
    message: '',
    position: ''
  });
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // Sample job openings with more details
  const jobOpenings = [
    { 
      id: 1,
      title: 'Senior Software Engineer', 
      location: 'Remote', 
      type: 'Full-time',
      description: 'Lead development of innovative solutions using cutting-edge technologies.',
      requirements: ['5+ years experience', 'React/Node.js', 'System design']
    },
    { 
      id: 2,
      title: 'UI/UX Designer', 
      location: 'On-site', 
      type: 'Full-time',
      description: 'Create beautiful and intuitive user experiences for our global clients.',
      requirements: ['3+ years experience', 'Figma', 'User research']
    },
    { 
      id: 3,
      title: 'Product Manager', 
      location: 'Hybrid', 
      type: 'Full-time',
      description: 'Drive product strategy and execution for our flagship platform.',
      requirements: ['4+ years experience', 'Agile', 'Data-driven']
    },
    { 
      id: 4,
      title: 'DevOps Engineer', 
      location: 'Remote', 
      type: 'Full-time',
      description: 'Build and maintain our cloud infrastructure and deployment pipelines.',
      requirements: ['AWS/Azure', 'Kubernetes', 'CI/CD']
    }
  ];

  const stats = [
    { number: '50+', label: 'Team Members' },
    { number: '15+', label: 'Countries' },
    { number: '98%', label: 'Employee Satisfaction' },
    { number: '5', label: 'Offices Worldwide' }
  ];

  const handleChange = (e) => {
    if (e.target.name === 'resume') {
      setFormData({ ...formData, resume: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    setFormData({ ...formData, position: job.title });
    // Smooth scroll to form
    document.getElementById('application-form').scrollIntoView({ 
      behavior: 'smooth',
      block: 'center'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Application submitted:', formData);
    setIsSubmitting(false);
    setShowPopup(true);

    // Reset form
    setFormData({ 
      name: '', 
      email: '', 
      phone: '', 
      resume: null, 
      message: '',
      position: '' 
    });
    setSelectedJob(null);

    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <PageContainer>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Build Your Future With ExpertYard</HeroTitle>
          <HeroSubtitle>
            Join a team of passionate innovators dedicated to transforming 
            the future of professional services. We're looking for talented 
            individuals who want to make a difference.
          </HeroSubtitle>
          <StatsContainer>
            {stats.map((stat, index) => (
              <StatItem key={index}>
                <StatNumber>{stat.number}</StatNumber>
                <StatLabel>{stat.label}</StatLabel>
              </StatItem>
            ))}
          </StatsContainer>
        </HeroContent>
      </HeroSection>

      <MainContent>
        <LeftColumn>
          <SectionTitle>Current Openings</SectionTitle>
          <JobGrid>
            {jobOpenings.map((job) => (
              <JobCard 
                key={job.id} 
                onClick={() => handleJobSelect(job)}
                style={selectedJob?.id === job.id ? { 
                  borderColor: '#667eea',
                  boxShadow: '0 20px 40px rgba(102, 126, 234, 0.2)'
                } : {}}
              >
                <JobTitle>{job.title}</JobTitle>
                <JobLocation>{job.location} • {job.type}</JobLocation>
                <JobDescription>{job.description}</JobDescription>
                <ApplyButton onClick={(e) => {
                  e.stopPropagation();
                  handleJobSelect(job);
                }}>
                  Apply Now
                </ApplyButton>
              </JobCard>
            ))}
          </JobGrid>

          <FormContainer id="application-form">
            <FormTitle>
              {selectedJob ? `Apply for ${selectedJob.title}` : 'Submit Your Application'}
            </FormTitle>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Full Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Email Address</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Phone Number</Label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (123) 456-7890"
                />
              </FormGroup>

              <FormGroup>
                <Label>Position Applied For</Label>
                <Input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="Select a position above or enter manually"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Resume/CV</Label>
                <FileInput
                  type="file"
                  name="resume"
                  onChange={handleChange}
                  accept=".pdf,.doc,.docx"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Cover Letter / Additional Message</Label>
                <TextArea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us why you'd be a great fit..."
                />
              </FormGroup>

              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <LoadingSpinner /> Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </SubmitButton>
            </Form>
          </FormContainer>
        </LeftColumn>

        <RightColumn>
          <InfoCard>
            <InfoCardTitle>Why Join ExpertYard?</InfoCardTitle>
            <InfoCardText>
              • Work on innovative projects with global impact<br/>
              • Collaborative and inclusive culture<br/>
              • Professional development opportunities<br/>
              • Flexible work arrangements<br/>
              • Regular team events and hackathons
            </InfoCardText>
          </InfoCard>

          <InfoCard>
            <InfoCardTitle>Benefits & Perks</InfoCardTitle>
            <InfoCardText>
              • Competitive salary and equity options<br/>
              • Comprehensive health insurance<br/>
              • 401(k) with company match<br/>
              • Unlimited PTO policy<br/>
              • Home office stipend<br/>
              • Learning & development budget
            </InfoCardText>
          </InfoCard>

          <InfoCard>
            <InfoCardTitle>Contact HR</InfoCardTitle>
            <ContactInfo>
              <ContactItem>hr@expertyard.com</ContactItem>
              <ContactItem>+1 (888) 123-4567</ContactItem>
            </ContactInfo>
            <InfoCardText style={{ marginTop: '15px', fontSize: '14px' }}>
              Response time: Within 24-48 hours
            </InfoCardText>
          </InfoCard>

          <InfoCard>
            <InfoCardTitle>Our Locations</InfoCardTitle>
            <InfoCardText>
              🏢 San Francisco, CA<br/>
              🏢 New York, NY<br/>
              🏢 London, UK<br/>
              🏢 Singapore<br/>
              🏢 Sydney, Australia
            </InfoCardText>
          </InfoCard>
        </RightColumn>
      </MainContent>

      {showPopup && (
        <PopupOverlay onClick={closePopup}>
          <Popup onClick={e => e.stopPropagation()}>
            <PopupIcon>🎉</PopupIcon>
            <PopupTitle>Application Submitted!</PopupTitle>
            <PopupMessage>
              Thank you for your interest in joining ExpertYard! 
              Our HR team will review your application and get back to you 
              within 2-3 working days.
            </PopupMessage>
            <CloseButton onClick={closePopup}>Got it, thanks!</CloseButton>
          </Popup>
        </PopupOverlay>
      )}
    </PageContainer>
  );
};

export default Career;