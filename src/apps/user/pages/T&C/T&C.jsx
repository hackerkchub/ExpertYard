import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  MainContent,
  ContentWrapper,
  Title,
  UpdatedDate,
  Section,
  SectionTitle,
  Paragraph,
  ScrollToTop,
  ProgressBar
} from './T&C.styles';

const TermsAndConditions = () => {
  const [activeSection, setActiveSection] = useState('introduction');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRefs = useRef({});

  const sections = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'eligibility', title: 'Eligibility' },
    { id: 'account', title: 'Account Security' },
    { id: 'services', title: 'Nature of Services' },
    { id: 'fees', title: 'Fees & Payments' },
    { id: 'conduct', title: 'Expert Conduct' },
    { id: 'content', title: 'Content & IP' },
    { id: 'termination', title: 'Termination' },
    { id: 'liability', title: 'Liability' },
    { id: 'law', title: 'Governing Law' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Update scroll progress
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);

      // Show/hide scroll to top button
      setShowScrollTop(winScroll > 300);

      // Update active section
      const scrollPosition = window.scrollY + 150;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Container>
      <ProgressBar style={{ transform: `scaleX(${scrollProgress / 100})` }} />
      
      <MainContent>
        <ContentWrapper>
          <Title>ExpertYard – Terms and Conditions</Title>
          <UpdatedDate>Last updated: 2nd Feb 2026</UpdatedDate>

          <Section id="introduction" ref={el => sectionRefs.current.introduction = el}>
            <SectionTitle>1. Introduction</SectionTitle>
            <Paragraph>
              These Terms and Conditions ("Terms") govern your access to and use of
              the ExpertYard platform, including our website, mobile applications,
              and any related services. ExpertYard is a technology platform that
              connects users with independent experts, consultants, and service
              providers.
            </Paragraph>
            <Paragraph>
              By registering on or using ExpertYard as a service provider
              ("Expert", "Provider", "You"), you agree to be bound by these Terms.
              If you do not agree with these Terms, you must not access or use the
              platform.
            </Paragraph>
            <Paragraph>
              ExpertYard does not itself provide professional services. All
              services are delivered by independent experts who use the platform
              to connect with users.
            </Paragraph>
          </Section>

          <Section id="eligibility">
            <SectionTitle>2. Eligibility</SectionTitle>
            <Paragraph>
              To register as an Expert on ExpertYard, you must be at least 18 years
              of age and legally capable of entering into binding contracts.
            </Paragraph>
            <Paragraph>
              You represent and warrant that all information submitted during
              registration is accurate, complete, and up to date.
            </Paragraph>
            <Paragraph>
              ExpertYard reserves the right to suspend or terminate accounts that
              provide false, misleading, or incomplete information.
            </Paragraph>
          </Section>

          <Section id="account">
            <SectionTitle>3. Account Registration and Security</SectionTitle>
            <Paragraph>
              You are responsible for maintaining the confidentiality of your
              account credentials and for all activities conducted through your
              account.
            </Paragraph>
            <Paragraph>
              You agree to notify ExpertYard immediately of any unauthorized use
              or suspected security breach.
            </Paragraph>
            <Paragraph>
              ExpertYard shall not be liable for any loss or damage arising from
              your failure to protect your login credentials.
            </Paragraph>
          </Section>

          <Section id="services">
            <SectionTitle>4. Nature of Services</SectionTitle>
            <Paragraph>
              Experts listed on ExpertYard are independent contractors and not
              employees, agents, or partners of ExpertYard.
            </Paragraph>
            <Paragraph>
              You are solely responsible for the services you offer, including
              their quality, accuracy, legality, and compliance with applicable
              laws.
            </Paragraph>
            <Paragraph>
              ExpertYard does not guarantee the number of bookings, earnings, or
              success for any Expert.
            </Paragraph>
          </Section>

          <Section id="fees">
            <SectionTitle>5. Fees and Payments</SectionTitle>
            <Paragraph>
              ExpertYard may charge a platform service fee or commission on
              transactions completed through the platform.
            </Paragraph>
            <Paragraph>
              Payment payouts to Experts will be processed according to the payout
              schedule and policies defined by ExpertYard.
            </Paragraph>
            <Paragraph>
              Experts are responsible for all applicable taxes arising from their
              earnings.
            </Paragraph>
          </Section>

          <Section id="conduct">
            <SectionTitle>6. Expert Conduct and Responsibilities</SectionTitle>
            <Paragraph>
              Experts must conduct themselves professionally and respectfully
              while interacting with users.
            </Paragraph>
            <Paragraph>
              Any form of harassment, abuse, discrimination, or unethical
              behavior is strictly prohibited.
            </Paragraph>
            <Paragraph>
              ExpertYard reserves the right to suspend or permanently remove any
              Expert who violates platform policies.
            </Paragraph>
          </Section>

          <Section id="content">
            <SectionTitle>7. Content and Intellectual Property</SectionTitle>
            <Paragraph>
              Experts retain ownership of the content they create but grant
              ExpertYard a non-exclusive license to use such content for platform
              operations and marketing.
            </Paragraph>
            <Paragraph>
              You must not upload content that infringes on intellectual property
              rights or violates applicable laws.
            </Paragraph>
          </Section>

          <Section id="termination">
            <SectionTitle>8. Suspension and Termination</SectionTitle>
            <Paragraph>
              ExpertYard may suspend or terminate your account at any time for
              violations of these Terms.
            </Paragraph>
            <Paragraph>
              Upon termination, you must cease all use of the platform.
            </Paragraph>
            <Paragraph>
              Termination does not affect accrued rights or obligations.
            </Paragraph>
          </Section>

          <Section id="liability">
            <SectionTitle>9. Limitation of Liability</SectionTitle>
            <Paragraph>
              ExpertYard shall not be liable for indirect, incidental, or
              consequential damages.
            </Paragraph>
            <Paragraph>
              The platform is provided on an "as is" basis without warranties of
              any kind.
            </Paragraph>
          </Section>

          <Section id="law">
            <SectionTitle>10. Governing Law and Jurisdiction</SectionTitle>
            <Paragraph>
              These Terms shall be governed by and construed in accordance with
              the laws of India.
            </Paragraph>
            <Paragraph>
              Courts located in India shall have exclusive jurisdiction over
              disputes arising under these Terms.
            </Paragraph>
          </Section>
        </ContentWrapper>
      </MainContent>



      <ScrollToTop
        visible={showScrollTop}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        ↑
      </ScrollToTop>
    </Container>
  );
};

export default TermsAndConditions;