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
  ProgressBar,
  MobileNavToggle,
  MobileNavOverlay,
  MobileSidebar,
  SidebarTitle,
  NavList,
  NavItem,
  NavLink,
  DesktopSidebar,
  LayoutWrapper
} from './T&C.styles';

const TermsAndConditions = () => {
  const [activeSection, setActiveSection] = useState('introduction');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRefs = useRef({});
  const mobileNavRef = useRef(null);

  const sections = [
    { id: 'introduction', title: '1. Introduction' },
    { id: 'eligibility', title: '2. Eligibility' },
    { id: 'account', title: '3. Account Security' },
    { id: 'services', title: '4. Nature of Services' },
    { id: 'fees', title: '5. Fees & Payments' },
    { id: 'conduct', title: '6. Expert Conduct' },
    { id: 'content', title: '7. Content & IP' },
    { id: 'termination', title: '8. Termination' },
    { id: 'liability', title: '9. Liability' },
    { id: 'law', title: '10. Governing Law' }
  ];

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile nav when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (mobileNavRef.current && !mobileNavRef.current.contains(event.target)) {
        setMobileNavOpen(false);
      }
    }
    
    if (mobileNavOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [mobileNavOpen]);

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
  }, [sections]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = isMobile ? 80 : 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      setMobileNavOpen(false);
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
      
      {/* Mobile Navigation Toggle */}
      <MobileNavToggle 
        onClick={() => setMobileNavOpen(!mobileNavOpen)}
        isOpen={mobileNavOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </MobileNavToggle>

      {/* Mobile Navigation Overlay */}
      <MobileNavOverlay show={mobileNavOpen} onClick={() => setMobileNavOpen(false)} />

      {/* Mobile Sidebar */}
      <MobileSidebar ref={mobileNavRef} show={mobileNavOpen}>
        <SidebarTitle>Quick Navigation</SidebarTitle>
        <NavList>
          {sections.map((section) => (
            <NavItem key={section.id}>
              <NavLink
                href={`#${section.id}`}
                active={activeSection === section.id}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(section.id);
                }}
              >
                {section.title}
              </NavLink>
            </NavItem>
          ))}
        </NavList>
      </MobileSidebar>

      <LayoutWrapper>
        {/* Desktop Sidebar */}
        <DesktopSidebar>
          <SidebarTitle>Quick Navigation</SidebarTitle>
          <NavList>
            {sections.map((section) => (
              <NavItem key={section.id}>
                <NavLink
                  href={`#${section.id}`}
                  active={activeSection === section.id}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(section.id);
                  }}
                >
                  {section.title}
                </NavLink>
              </NavItem>
            ))}
          </NavList>
        </DesktopSidebar>

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
      </LayoutWrapper>

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