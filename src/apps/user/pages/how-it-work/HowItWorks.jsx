// src/pages/HowItWorks/HowItWorks.jsx
import React from "react";
import {
  HowItWorksContainer,
  HeroSection,
  HeroContent,
  HeroTitle,
  HeroSubtitle,
  StepsContainer,
  StepCard,
  StepNumber,
  StepIcon,
  StepContent,
  StepTitle,
  StepDescription,
  FeaturesSection,
  FeatureGrid,
  FeatureCard,
  FeatureIcon,
  FeatureTitle,
  FeatureDescription,
  CTAButton,
  VideoSection,
  VideoContainer,
  VideoPlaceholder,
  PlayButton,
  SectionTitle,
  SectionSubtitle,
  FAQSection,
  FAQItem,
  FAQQuestion,
  FAQAnswer
} from "./HowItWorks.styles";

// Icons
import {
  FaSearch,
  FaUsers,
  FaComments,
  FaCheckCircle,
  FaShieldAlt,
  FaClock,
  FaMoneyBillWave,
  FaGlobe,
  FaMobileAlt,
  FaVideo,
  FaStar,
  FaLock,
  FaHeadset,
  FaCalendarCheck,
  FaPlay,
  FaArrowRight
} from "react-icons/fa";

const HowItWorks = () => {
  // Main steps
  const steps = [
    {
      number: 1,
      icon: <FaSearch />,
      title: "Browse & Select Expert",
      description: "Search through our curated database of 10,000+ verified experts across 150+ categories. Filter by expertise, ratings, availability, and price.",
      color: "#3B82F6"
    },
    {
      number: 2,
      icon: <FaUsers />,
      title: "Instant Connect",
      description: "Choose your preferred expert and connect instantly via chat, voice, or video call. No waiting periods, immediate access to professionals.",
      color: "#8B5CF6"
    },
    {
      number: 3,
      icon: <FaComments />,
      title: "Secure Consultation",
      description: "Engage in private, secure conversations. All chats are encrypted end-to-end with enterprise-grade security protocols.",
      color: "#10B981"
    },
    {
      number: 4,
      icon: <FaCheckCircle />,
      title: "Get Your Solution",
      description: "Receive actionable advice, solutions, and follow-up support. Download session summaries and access resources.",
      color: "#EF4444"
    }
  ];

  // Key features
  const features = [
    {
      icon: <FaShieldAlt />,
      title: "Verified Experts",
      description: "All experts undergo rigorous background checks, qualification verification, and skill assessments.",
      color: "#3B82F6"
    },
    {
      icon: <FaClock />,
      title: "24/7 Availability",
      description: "Connect with experts anytime, anywhere. Global network ensures round-the-clock availability.",
      color: "#8B5CF6"
    },
    {
      icon: <FaMoneyBillWave />,
      title: "Transparent Pricing",
      description: "Clear pricing with no hidden fees. Pay only for the time you use with satisfaction guarantee.",
      color: "#10B981"
    },
    {
      icon: <FaGlobe />,
      title: "Global Reach",
      description: "Access experts from 150+ countries. Language support and cultural understanding included.",
      color: "#EF4444"
    },
    {
      icon: <FaMobileAlt />,
      title: "Multi-Platform",
      description: "Available on web, iOS, and Android. Seamless experience across all devices.",
      color: "#F59E0B"
    },
    {
      icon: <FaVideo />,
      title: "Flexible Sessions",
      description: "Choose between chat, voice, or video calls. Schedule one-time or recurring sessions.",
      color: "#EC4899"
    }
  ];

  // FAQ
  const faqs = [
    {
      question: "How do I choose the right expert?",
      answer: "Use our smart matching algorithm, filter by expertise ratings, read verified reviews, and check expert availability to find the perfect match for your needs."
    },
    {
      question: "What if I'm not satisfied with the session?",
      answer: "We offer a 100% satisfaction guarantee. If you're not happy with your consultation, we'll provide a full refund or connect you with another expert."
    },
    {
      question: "How are experts verified?",
      answer: "Experts undergo a 5-step verification process including background checks, qualification verification, skill assessments, interview process, and trial consultations."
    },
    {
      question: "Can I schedule sessions in advance?",
      answer: "Yes, you can schedule sessions up to 30 days in advance. Our calendar system allows you to book at your convenience."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use end-to-end encryption, secure payment gateways, and comply with global data protection regulations (GDPR, CCPA)."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, PayPal, bank transfers, and digital wallets. Payments are secure and processed instantly."
    }
  ];

  return (
    <HowItWorksContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <HeroTitle>
            Connect with Experts in <span style={{ color: '#3B82F6' }}>4 Simple Steps</span>
          </HeroTitle>
          <HeroSubtitle>
            ExpertYard makes professional guidance accessible, reliable, and effortless. 
            Get expert advice anytime, anywhere with our seamless platform.
          </HeroSubtitle>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <CTAButton to="/user/call-chat">
              Find Experts Now <FaArrowRight style={{ marginLeft: '0.5rem' }} />
            </CTAButton>
            <CTAButton to="/expert/register" style={{ 
              background: 'transparent', 
              border: '2px solid white',
              '&:hover': {
                background: 'rgba(255,255,255,0.1)'
              }
            }}>
              Become an Expert
            </CTAButton>
          </div>
        </HeroContent>
      </HeroSection>

      {/* Steps Section */}
      <StepsContainer>
        <SectionTitle center>How ExpertYard Works</SectionTitle>
        <SectionSubtitle center>
          Simple, Secure, and Effective - Get Expert Guidance in Minutes
        </SectionSubtitle>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '2rem',
          marginTop: '3rem',
          position: 'relative'
        }}>
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <StepCard>
                <StepNumber style={{ background: step.color }}>
                  {step.number}
                </StepNumber>
                <StepIcon style={{ color: step.color }}>
                  {step.icon}
                </StepIcon>
                <StepContent>
                  <StepTitle>{step.title}</StepTitle>
                  <StepDescription>{step.description}</StepDescription>
                </StepContent>
              </StepCard>
              
              {/* Connecting line between steps (not on mobile) */}
              {index < steps.length - 1 && (
                <div style={{ 
                  position: 'absolute',
                  left: `${(index + 1) * 25}%`,
                  top: '50%',
                  width: '25%',
                  height: '2px',
                  background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
                  transform: 'translateY(-50%)',
                  zIndex: -1,
                  display: 'none',
                  '@media (min-width: 1024px)': {
                    display: 'block'
                  }
                }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </StepsContainer>

      {/* Video Demo Section */}
      <VideoSection>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <SectionTitle center>See ExpertYard in Action</SectionTitle>
          <SectionSubtitle center>
            Watch how easy it is to connect with top experts
          </SectionSubtitle>
          
          <VideoContainer>
            <VideoPlaceholder>
              <PlayButton>
                <FaPlay />
              </PlayButton>
              <div style={{ 
                position: 'absolute', 
                bottom: '2rem', 
                left: '2rem', 
                color: 'white',
                textAlign: 'left'
              }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Live Platform Demo</h3>
                <p style={{ opacity: 0.9 }}>See how to find and connect with experts</p>
              </div>
            </VideoPlaceholder>
          </VideoContainer>
        </div>
      </VideoSection>

      {/* Key Features */}
      <FeaturesSection>
        <SectionTitle center>Why Choose ExpertYard</SectionTitle>
        <SectionSubtitle center>
          Everything you need for successful expert consultations
        </SectionSubtitle>
        
        <FeatureGrid>
          {features.map((feature, index) => (
            <FeatureCard key={index}>
              <FeatureIcon style={{ color: feature.color }}>
                {feature.icon}
              </FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeatureGrid>
      </FeaturesSection>

      {/* FAQ Section */}
      <FAQSection>
        <SectionTitle center>Frequently Asked Questions</SectionTitle>
        <SectionSubtitle center>
          Everything you need to know about using ExpertYard
        </SectionSubtitle>
        
        <div style={{ maxWidth: '800px', margin: '3rem auto 0' }}>
          {faqs.map((faq, index) => (
            <FAQItem key={index}>
              <FAQQuestion>
                <span style={{ color: '#3B82F6', marginRight: '1rem' }}>Q{index + 1}.</span>
                {faq.question}
              </FAQQuestion>
              <FAQAnswer>
                <span style={{ color: '#10B981', marginRight: '1rem', fontWeight: 'bold' }}>A.</span>
                {faq.answer}
              </FAQAnswer>
            </FAQItem>
          ))}
        </div>
      </FAQSection>

      {/* Final CTA */}
      <div style={{ 
        background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
        color: 'white',
        padding: '5rem 2rem',
        textAlign: 'center',
        marginTop: '4rem'
      }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          Ready to Get Expert Advice?
        </h2>
        <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2rem', opacity: 0.9 }}>
          Join thousands of satisfied users who found solutions through ExpertYard
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <CTAButton to="user/auth" style={{ 
            background: 'white', 
            color: '#3B82F6',
            '&:hover': {
              background: '#f8fafc'
            }
          }}>
            Get Started Free
          </CTAButton>
          <CTAButton to="/user/contact" style={{ 
            background: 'transparent', 
            border: '2px solid white',
            '&:hover': {
              background: 'rgba(255,255,255,0.1)'
            }
          }}>
            Schedule Demo
          </CTAButton>
        </div>
      </div>
    </HowItWorksContainer>
  );
};

export default HowItWorks;