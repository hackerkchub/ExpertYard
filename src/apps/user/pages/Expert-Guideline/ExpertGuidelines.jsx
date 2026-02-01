// src/pages/ExpertGuidelines/ExpertGuidelines.jsx
import React, { useState } from "react";
import {
  GuidelinesContainer,
  HeroSection,
  HeroContent,
  HeroTitle,
  HeroSubtitle,
  Section,
  SectionTitle,
  SectionSubtitle,
  ContentContainer,
  GuidelineCard,
  GuidelineIcon,
  GuidelineContent,
  GuidelineTitle,
  GuidelineDescription,
  GuidelineList,
  ListItem,
  Checklist,
  ChecklistItem,
  ChecklistIcon,
  ChecklistContent,
  RequirementsGrid,
  RequirementCard,
  RequirementIcon,
  RequirementTitle,
  RequirementDescription,
  TabContainer,
  TabHeader,
  TabButton,
  TabContent,
  ProcessStep,
  StepNumber,
  StepContent,
  StepTitle,
  StepDescription,
  CTAButton,
  SecondaryButton,
  WarningCard,
  InfoCard,
  FeatureList,
  FeatureItem,
  DownloadSection,
  CodeBlock,
  ResourceLink,
  FAQSection,
  FAQItem,
  FAQQuestion,
  FAQAnswer,
  Divider,
  Badge
} from "./ExpertGuidelines.styles";

// Icons
import {
  FaUserCheck,
  FaCertificate,
  FaShieldAlt,
  FaStar,
  FaHandshake,
  FaMoneyBillWave,
  FaClock,
  FaComments,
  FaChartLine,
  FaTools,
  FaFileContract,
  FaLock,
  FaUserTie,
  FaGraduationCap,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaDownload,
  FaLink,
  FaArrowRight,
  FaCalendarAlt,
  FaVideo,
  FaPhoneAlt,
  FaEnvelope,
  FaBook,
  FaLightbulb,
  FaBalanceScale,
  FaGlobe
} from "react-icons/fa";

const ExpertGuidelines = () => {
  const [activeTab, setActiveTab] = useState("requirements");

  // Main guidelines categories
  const guidelines = [
    {
      icon: <FaUserCheck />,
      title: "Professional Conduct",
      description: "Maintain the highest standards of professionalism in all interactions",
      points: [
        "Respond to client inquiries within 24 hours",
        "Maintain respectful and professional communication",
        "Honor all scheduled appointments and meetings",
        "Dress appropriately for video consultations",
        "Use professional language and avoid slang"
      ]
    },
    {
      icon: <FaCertificate />,
      title: "Expertise Verification",
      description: "Ensure your qualifications and expertise are properly documented",
      points: [
        "Upload verified certificates and degrees",
        "Provide professional references",
        "Share portfolio of previous work",
        "Maintain updated credentials",
        "Undergo periodic skill assessments"
      ]
    },
    {
      icon: <FaShieldAlt />,
      title: "Security & Privacy",
      description: "Protect client information and maintain confidentiality",
      points: [
        "Never share client information with third parties",
        "Use secure communication channels",
        "Follow data protection regulations (GDPR, CCPA)",
        "Report any security concerns immediately",
        "Use two-factor authentication"
      ]
    },
    {
      icon: <FaStar />,
      title: "Service Quality",
      description: "Deliver exceptional value and maintain high satisfaction rates",
      points: [
        "Set clear expectations with clients",
        "Provide actionable and practical advice",
        "Follow up after consultations",
        "Collect and implement feedback",
        "Continuously update your knowledge"
      ]
    }
  ];

  // Expert requirements
  const requirements = [
    {
      icon: <FaGraduationCap />,
      title: "Minimum Qualifications",
      description: "Bachelor's degree or equivalent in relevant field + 3 years professional experience",
      mandatory: true
    },
    {
      icon: <FaUserTie />,
      title: "Professional Experience",
      description: "Minimum 5 years in your area of expertise with verifiable references",
      mandatory: true
    },
    {
      icon: <FaCertificate />,
      title: "Certifications",
      description: "Industry-recognized certifications (preferred but not mandatory for all fields)",
      mandatory: false
    },
    {
      icon: <FaChartLine />,
      title: "Track Record",
      description: "Demonstrable success in your field with client testimonials or portfolio",
      mandatory: true
    }
  ];

  // Application process steps
  const processSteps = [
    {
      number: 1,
      title: "Application Submission",
      description: "Complete the detailed application form with your credentials and experience",
      duration: "10-15 minutes",
      requirements: ["Personal details", "Professional background", "Portfolio links"]
    },
    {
      number: 2,
      title: "Document Verification",
      description: "Our team verifies your credentials, certificates, and professional references",
      duration: "3-5 business days",
      requirements: ["ID verification", "Degree certificates", "Reference checks"]
    },
    {
      number: 3,
      title: "Expert Interview",
      description: "30-minute video interview to assess expertise and communication skills",
      duration: "30 minutes",
      requirements: ["Technical knowledge", "Communication skills", "Problem-solving approach"]
    },
    {
      number: 4,
      title: "Mock Consultation",
      description: "Conduct a sample consultation to demonstrate your approach and methodology",
      duration: "45 minutes",
      requirements: ["Client interaction", "Solution delivery", "Professional demeanor"]
    },
    {
      number: 5,
      title: "Onboarding & Training",
      description: "Complete platform training and agree to terms of service",
      duration: "2-3 hours",
      requirements: ["Platform training", "Guidelines review", "Contract signing"]
    }
  ];

  // Code of conduct
  const codeOfConduct = [
    "Treat all clients with respect and professionalism",
    "Maintain confidentiality of all client information",
    "Provide honest and accurate advice within your expertise",
    "Avoid conflicts of interest and disclose any potential conflicts",
    "Never guarantee specific outcomes or results",
    "Respect intellectual property rights",
    "Report any platform violations or concerns",
    "Maintain appropriate boundaries in all interactions"
  ];

  // Do's and Don'ts
  const dos = [
    "Do set clear expectations before consultations",
    "Do prepare thoroughly for each session",
    "Do follow up with additional resources if promised",
    "Do respect different cultural backgrounds",
    "Do maintain professional boundaries",
    "Do provide actionable, practical advice",
    "Do keep your profile and availability updated",
    "Do collect and implement client feedback"
  ];

  const donts = [
    "Don't provide advice outside your area of expertise",
    "Don't share personal contact information",
    "Don't guarantee specific financial or legal outcomes",
    "Don't discriminate based on any personal characteristics",
    "Don't miss scheduled appointments",
    "Don't engage in unprofessional behavior",
    "Don't violate client confidentiality",
    "Don't solicit clients for outside business"
  ];

  // Compensation structure
  const compensation = [
    {
      type: "Hourly Rate",
      description: "Set your own hourly rate based on expertise and experience",
      range: "$50 - $500+ per hour",
      payout: "Weekly direct deposit"
    },
    {
      type: "Project-Based",
      description: "Fixed price for defined scope of work",
      range: "Based on project complexity",
      payout: "Milestone-based payments"
    },
    {
      type: "Retainer",
      description: "Monthly retainer for ongoing advisory services",
      range: "Custom agreements",
      payout: "Monthly payments"
    }
  ];

  // Resources
  const resources = [
    {
      title: "Expert Onboarding Guide",
      description: "Complete guide to getting started on ExpertYard",
      type: "PDF Guide",
      icon: <FaBook />
    },
    {
      title: "Best Practices Webinar",
      description: "Recorded session on delivering exceptional consultations",
      type: "Video",
      icon: <FaVideo />
    },
    {
      title: "Legal & Compliance Handbook",
      description: "Important legal information and compliance requirements",
      type: "PDF Document",
      icon: <FaBalanceScale />
    },
    {
      title: "Platform Tools Tutorial",
      description: "How to use all ExpertYard features effectively",
      type: "Interactive Tutorial",
      icon: <FaTools />
    }
  ];

  // FAQ
  const faqs = [
    {
      question: "How long does the approval process take?",
      answer: "Typically 7-10 business days from application submission to final approval, depending on document verification speed."
    },
    {
      question: "What percentage does ExpertYard take from my earnings?",
      answer: "We charge a 15% platform fee on all consultations. This covers payment processing, platform maintenance, marketing, and client support."
    },
    {
      question: "Can I work with clients outside the platform?",
      answer: "No, all consultations must be conducted through the ExpertYard platform. This ensures client protection, quality control, and compliance with our terms of service."
    },
    {
      question: "What happens if I receive a negative review?",
      answer: "We encourage constructive feedback. One negative review won't affect your status, but consistent poor ratings may result in account review and potential suspension."
    },
    {
      question: "How do I get paid?",
      answer: "Payments are processed weekly via direct deposit to your bank account. You can track all earnings in your expert dashboard."
    },
    {
      question: "Is there a minimum commitment required?",
      answer: "No minimum hours are required. You can set your own availability and accept consultations based on your schedule."
    }
  ];

  return (
    <GuidelinesContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <HeroTitle>
            Become an <span>ExpertYard</span> Professional
          </HeroTitle>
          <HeroSubtitle>
            Join our elite network of verified experts. Deliver exceptional value, grow your practice, 
            and connect with clients worldwide through our premium platform.
          </HeroSubtitle>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            <CTAButton to="/expert/apply">
              Apply Now <FaArrowRight style={{ marginLeft: '0.5rem' }} />
            </CTAButton>
            <SecondaryButton to="#requirements">
              View Requirements
            </SecondaryButton>
          </div>
        </HeroContent>
      </HeroSection>

      {/* Quick Stats */}
      <Section style={{ background: '#f8fafc', padding: '3rem 2rem' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '2rem',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#4f46e5', marginBottom: '0.5rem' }}>10,000+</div>
            <div style={{ color: '#6b7280', fontWeight: '600' }}>Active Experts</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#4f46e5', marginBottom: '0.5rem' }}>$5M+</div>
            <div style={{ color: '#6b7280', fontWeight: '600' }}>Paid to Experts</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#4f46e5', marginBottom: '0.5rem' }}>4.9/5</div>
            <div style={{ color: '#6b7280', fontWeight: '600' }}>Average Rating</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#4f46e5', marginBottom: '0.5rem' }}>150+</div>
            <div style={{ color: '#6b7280', fontWeight: '600' }}>Countries Served</div>
          </div>
        </div>
      </Section>

      {/* Requirements & Benefits Tabs */}
      <Section id="requirements">
        <TabContainer>
          <TabHeader>
            <TabButton 
              active={activeTab === "requirements"} 
              onClick={() => setActiveTab("requirements")}
            >
              <FaUserCheck style={{ marginRight: '0.5rem' }} />
              Requirements
            </TabButton>
            <TabButton 
              active={activeTab === "benefits"} 
              onClick={() => setActiveTab("benefits")}
            >
              <FaStar style={{ marginRight: '0.5rem' }} />
              Benefits
            </TabButton>
            <TabButton 
              active={activeTab === "process"} 
              onClick={() => setActiveTab("process")}
            >
              <FaChartLine style={{ marginRight: '0.5rem' }} />
              Application Process
            </TabButton>
          </TabHeader>

          <TabContent>
            {activeTab === "requirements" && (
              <>
                <SectionTitle>Expert Requirements</SectionTitle>
                <SectionSubtitle>
                  To maintain our premium quality standards, all experts must meet these criteria
                </SectionSubtitle>
                
                <RequirementsGrid>
                  {requirements.map((req, index) => (
                    <RequirementCard key={index} mandatory={req.mandatory}>
                      <RequirementIcon mandatory={req.mandatory}>
                        {req.icon}
                      </RequirementIcon>
                      <RequirementTitle>{req.title}</RequirementTitle>
                      <RequirementDescription>{req.description}</RequirementDescription>
                      <Badge mandatory={req.mandatory}>
                        {req.mandatory ? "Mandatory" : "Preferred"}
                      </Badge>
                    </RequirementCard>
                  ))}
                </RequirementsGrid>

                <WarningCard>
                  <FaExclamationTriangle style={{ fontSize: '1.5rem', color: '#dc2626' }} />
                  <div>
                    <h3 style={{ color: '#111827', marginBottom: '0.5rem' }}>Important Notice</h3>
                    <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                      Providing false information during the application process will result in immediate 
                      disqualification and permanent ban from the ExpertYard platform.
                    </p>
                  </div>
                </WarningCard>
              </>
            )}

            {activeTab === "benefits" && (
              <>
                <SectionTitle>Expert Benefits</SectionTitle>
                <SectionSubtitle>
                  Why top professionals choose to work with ExpertYard
                </SectionSubtitle>

                <ContentContainer>
                  <div style={{ display: 'grid', gap: '2rem' }}>
                    <FeatureList>
                      <FeatureItem>
                        <FaMoneyBillWave style={{ color: '#10b981', fontSize: '1.5rem' }} />
                        <div>
                          <h3 style={{ color: '#111827', marginBottom: '0.25rem' }}>Competitive Earnings</h3>
                          <p style={{ color: '#6b7280' }}>Set your own rates and earn 85% of consultation fees</p>
                        </div>
                      </FeatureItem>
                      <FeatureItem>
                        <FaGlobe style={{ color: '#3b82f6', fontSize: '1.5rem' }} />
                        <div>
                          <h3 style={{ color: '#111827', marginBottom: '0.25rem' }}>Global Reach</h3>
                          <p style={{ color: '#6b7280' }}>Connect with clients from 150+ countries worldwide</p>
                        </div>
                      </FeatureItem>
                      <FeatureItem>
                        <FaShieldAlt style={{ color: '#8b5cf6', fontSize: '1.5rem' }} />
                        <div>
                          <h3 style={{ color: '#111827', marginBottom: '0.25rem' }}>Secure Platform</h3>
                          <p style={{ color: '#6b7280' }}>Enterprise-grade security and reliable payment processing</p>
                        </div>
                      </FeatureItem>
                      <FeatureItem>
                        <FaChartLine style={{ color: '#f59e0b', fontSize: '1.5rem' }} />
                        <div>
                          <h3 style={{ color: '#111827', marginBottom: '0.25rem' }}>Growth Opportunities</h3>
                          <p style={{ color: '#6b7280' }}>Access to continuous learning and professional development</p>
                        </div>
                      </FeatureItem>
                    </FeatureList>

                    <InfoCard>
                      <FaInfoCircle style={{ fontSize: '1.5rem', color: '#3b82f6' }} />
                      <div>
                        <h3 style={{ color: '#111827', marginBottom: '0.5rem' }}>Additional Perks</h3>
                        <ul style={{ color: '#6b7280', lineHeight: '1.6', paddingLeft: '1.5rem' }}>
                          <li>Flexible scheduling - work on your own terms</li>
                          <li>Professional profile showcasing to premium clients</li>
                          <li>Marketing and promotional support</li>
                          <li>Dedicated expert support team</li>
                          <li>Regular performance bonuses and incentives</li>
                        </ul>
                      </div>
                    </InfoCard>
                  </div>
                </ContentContainer>
              </>
            )}

            {activeTab === "process" && (
              <>
                <SectionTitle>Application Process</SectionTitle>
                <SectionSubtitle>
                  Our 5-step verification process ensures only qualified professionals join our network
                </SectionSubtitle>

                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                  {processSteps.map((step, index) => (
                    <ProcessStep key={index}>
                      <StepNumber>{step.number}</StepNumber>
                      <StepContent>
                        <StepTitle>{step.title}</StepTitle>
                        <StepDescription>{step.description}</StepDescription>
                        <div style={{ 
                          display: 'flex', 
                          gap: '2rem', 
                          marginTop: '1rem',
                          flexWrap: 'wrap' 
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FaClock style={{ color: '#6b7280' }} />
                            <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>{step.duration}</span>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.25rem' }}>
                              Requirements:
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                              {step.requirements.map((req, i) => (
                                <span key={i} style={{
                                  background: '#f3f4f6',
                                  padding: '0.25rem 0.75rem',
                                  borderRadius: '12px',
                                  fontSize: '0.85rem',
                                  color: '#4b5563'
                                }}>
                                  {req}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </StepContent>
                    </ProcessStep>
                  ))}
                </div>
              </>
            )}
          </TabContent>
        </TabContainer>
      </Section>

      <Divider />

      {/* Guidelines & Code of Conduct */}
      <Section>
        <SectionTitle>Expert Guidelines & Code of Conduct</SectionTitle>
        <SectionSubtitle>
          Maintain the highest professional standards and deliver exceptional client experiences
        </SectionSubtitle>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem',
          marginTop: '3rem'
        }}>
          {guidelines.map((guideline, index) => (
            <GuidelineCard key={index}>
              <GuidelineIcon>{guideline.icon}</GuidelineIcon>
              <GuidelineContent>
                <GuidelineTitle>{guideline.title}</GuidelineTitle>
                <GuidelineDescription>{guideline.description}</GuidelineDescription>
                <GuidelineList>
                  {guideline.points.map((point, i) => (
                    <ListItem key={i}>
                      <FaCheckCircle style={{ color: '#10b981', marginRight: '0.75rem', flexShrink: 0 }} />
                      {point}
                    </ListItem>
                  ))}
                </GuidelineList>
              </GuidelineContent>
            </GuidelineCard>
          ))}
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '3rem', 
          marginTop: '4rem'
        }}>
          <div>
            <h3 style={{ color: '#111827', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
              <FaCheckCircle style={{ color: '#10b981', marginRight: '0.5rem' }} />
              Do's
            </h3>
            <Checklist>
              {dos.map((item, index) => (
                <ChecklistItem key={index}>
                  <ChecklistIcon positive>
                    <FaCheckCircle />
                  </ChecklistIcon>
                  <ChecklistContent>{item}</ChecklistContent>
                </ChecklistItem>
              ))}
            </Checklist>
          </div>

          <div>
            <h3 style={{ color: '#111827', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
              <FaTimesCircle style={{ color: '#ef4444', marginRight: '0.5rem' }} />
              Don'ts
            </h3>
            <Checklist>
              {donts.map((item, index) => (
                <ChecklistItem key={index}>
                  <ChecklistIcon negative>
                    <FaTimesCircle />
                  </ChecklistIcon>
                  <ChecklistContent>{item}</ChecklistContent>
                </ChecklistItem>
              ))}
            </Checklist>
          </div>
        </div>

        <div style={{ marginTop: '4rem' }}>
          <h3 style={{ color: '#111827', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
            <FaLock style={{ color: '#4f46e5', marginRight: '0.5rem' }} />
            Code of Conduct
          </h3>
          <div style={{ 
            background: '#f8fafc', 
            padding: '2rem', 
            borderRadius: '16px',
            border: '1px solid #e5e7eb'
          }}>
            <ul style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '1rem',
              listStyle: 'none',
              padding: 0
            }}>
              {codeOfConduct.map((item, index) => (
                <li key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start',
                  marginBottom: '0.75rem'
                }}>
                  <FaHandshake style={{ 
                    color: '#4f46e5', 
                    marginRight: '1rem', 
                    marginTop: '0.25rem',
                    flexShrink: 0 
                  }} />
                  <span style={{ color: '#4b5563', lineHeight: '1.6' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Divider />

      {/* Compensation & Resources */}
      <Section style={{ background: '#f8fafc' }}>
        <SectionTitle>Compensation & Resources</SectionTitle>
        <SectionSubtitle>
          Transparent earning structure and comprehensive support for your success
        </SectionSubtitle>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem',
          marginTop: '3rem'
        }}>
          {compensation.map((item, index) => (
            <div key={index} style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ 
                fontSize: '1.75rem', 
                fontWeight: '700', 
                color: '#111827',
                marginBottom: '0.5rem'
              }}>
                {item.type}
              </div>
              <div style={{ color: '#6b7280', marginBottom: '1rem', lineHeight: '1.6' }}>
                {item.description}
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                paddingTop: '1rem',
                borderTop: '1px solid #f3f4f6'
              }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Rate Range</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#111827' }}>
                    {item.range}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Payout</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#111827' }}>
                    {item.payout}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <DownloadSection>
          <h3 style={{ color: '#111827', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
            <FaDownload style={{ marginRight: '0.5rem' }} />
            Expert Resources
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1.5rem'
          }}>
            {resources.map((resource, index) => (
              <ResourceLink key={index} href="#">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {resource.icon}
                  <div>
                    <div style={{ fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                      {resource.title}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                      {resource.description}
                    </div>
                  </div>
                </div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: '#4f46e5', 
                  fontWeight: '600',
                  background: '#f5f3ff',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px'
                }}>
                  {resource.type}
                </div>
              </ResourceLink>
            ))}
          </div>
        </DownloadSection>
      </Section>

      {/* FAQ Section */}
      <Section>
        <FAQSection>
          <SectionTitle center>Frequently Asked Questions</SectionTitle>
          <SectionSubtitle center>
            Everything you need to know about becoming an ExpertYard professional
          </SectionSubtitle>

          <div style={{ maxWidth: '800px', margin: '3rem auto 0' }}>
            {faqs.map((faq, index) => (
              <FAQItem key={index}>
                <FAQQuestion>
                  <FaInfoCircle style={{ color: '#4f46e5', marginRight: '1rem', flexShrink: 0 }} />
                  {faq.question}
                </FAQQuestion>
                <FAQAnswer>{faq.answer}</FAQAnswer>
              </FAQItem>
            ))}
          </div>
        </FAQSection>
      </Section>

      {/* Final CTA */}
      <Section style={{ 
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        color: 'white',
        borderRadius: '24px',
        padding: '5rem 2rem',
        textAlign: 'center',
        margin: '0 auto 4rem',
        maxWidth: '1000px'
      }}>
        <SectionTitle center style={{ color: 'white' }}>
          Ready to Join Our Elite Network?
        </SectionTitle>
        <SectionSubtitle center style={{ 
          color: 'rgba(255, 255, 255, 0.95)', 
          maxWidth: '600px', 
          margin: '1.5rem auto 2rem'
        }}>
          Start your journey today and connect with clients worldwide while building your professional brand.
        </SectionSubtitle>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <CTAButton to="/expert/apply" style={{ 
            background: 'white', 
            color: '#4f46e5',
            fontWeight: '700',
            '&:hover': {
              background: '#f9fafb'
            }
          }}>
            Apply Now
          </CTAButton>
          <SecondaryButton to="/contact" style={{ 
            border: '2px solid white',
            color: 'white',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.1)'
            }
          }}>
            Contact Support
          </SecondaryButton>
        </div>
        <div style={{ 
          marginTop: '2rem', 
          fontSize: '0.9rem', 
          color: 'rgba(255, 255, 255, 0.8)'
        }}>
          Application review typically takes 7-10 business days
        </div>
      </Section>
    </GuidelinesContainer>
  );
};

export default ExpertGuidelines;