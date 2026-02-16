import React, { useState, useEffect } from 'react';
import {
  PageContainer,
  HeroSection,
  HeroContent,
  HeroTitle,
  HeroSubtitle,
  LastUpdated,
  MainContainer,
  ContentWrapper,
  Section,
  SectionTitle,
  Paragraph,
  HighlightText,
  ImportantNote,
  ImportantNoteTitle,
  ImportantNoteText,
  DataList,
  DataListItem,
  Sidebar,
  SidebarTitle,
  NavList,
  NavItem,
  NavLink,
  ProgressBar,
  ScrollToTop,
  FooterNote,
  ContactLink,
  CookieConsent,
  CookieTitle,
  CookieText,
  CookieButtons,
  CookieButton
} from './PrivacyPolicy.styles';

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('background');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showCookieConsent, setShowCookieConsent] = useState(false);

  const sections = [
    { id: 'background', title: 'Background & Key Info' },
    { id: 'data-collect', title: 'Data We Collect' },
    { id: 'data-usage', title: 'Use of Data' },
    { id: 'cookies', title: 'Cookies' },
    { id: 'rights', title: 'Your Rights' }
  ];

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookieAccepted = localStorage.getItem('cookieConsent');
    if (!cookieAccepted) {
      setShowCookieConsent(true);
    }

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

  const handleCookieAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowCookieConsent(false);
  };

  const handleCookieDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowCookieConsent(false);
  };

  return (
    <PageContainer>
      <ProgressBar style={{ transform: `scaleX(${scrollProgress / 100})` }} />

      <HeroSection>
        <HeroContent>
          <HeroTitle>Privacy Policy</HeroTitle>
          <HeroSubtitle>
            Your privacy is important to us. Learn how we collect, use, and protect your personal information.
          </HeroSubtitle>
          <LastUpdated>Last updated: February 1, 2026</LastUpdated>
        </HeroContent>
      </HeroSection>

      <MainContainer>
        <ContentWrapper>
          <Section id="background">
            <SectionTitle>Background and Key Information</SectionTitle>
            <Paragraph>
              Welcome to our Privacy Policy. This policy explains how we collect,
              use, store and protect your personal information when you use our
              platform.
            </Paragraph>
            <Paragraph>
              <HighlightText>ExpertYard</HighlightText> (“we”, “us”, “our”) is committed to protecting the privacy and 
              personal data of every user who accesses or uses our platform. This Privacy Policy explains in detail 
              how ExpertYard collects, uses, stores, processes, and safeguards personal information when you interact 
              with our website, mobile applications, or related services.
            </Paragraph>
            <Paragraph>
              ExpertYard is designed as a digital platform that connects users with skilled professionals, consultants, 
              mentors, and service providers across various domains. In order to deliver reliable, secure, and personalized 
              services, we need to collect certain information from users. This Privacy Policy governs how that information 
              is handled.
            </Paragraph>
            <ImportantNote>
              <ImportantNoteTitle>Important Note</ImportantNoteTitle>
              <ImportantNoteText>
                By accessing or using ExpertYard, you agree to the collection and use of information in accordance with 
                this Privacy Policy. If you do not agree with the terms described here, you are advised not to use the platform.
              </ImportantNoteText>
            </ImportantNote>
            <Paragraph>
              This Privacy Policy should be read together with our <ContactLink href="/terms">Terms and Conditions</ContactLink>, 
              as both documents govern your use of ExpertYard. Any capitalized terms not defined in this Privacy Policy shall 
              have the meaning assigned to them in the Terms and Conditions.
            </Paragraph>
            <Paragraph>
              ExpertYard reserves the right to update or modify this Privacy Policy at any time to reflect changes in legal 
              requirements, technology, business practices, or user needs. Any changes will be effective immediately upon 
              posting on this page. Users are encouraged to review this page periodically.
            </Paragraph>
          </Section>

          <Section id="data-collect">
            <SectionTitle>Personal Data That We Collect</SectionTitle>
            <Paragraph>
              ExpertYard may collect different types of personal and non-personal data depending on how you interact with 
              the platform. The information we collect is necessary to provide services, ensure platform security, and 
              improve user experience.
            </Paragraph>
            
            <DataList>
              <DataListItem>Full name and contact information (email, phone number)</DataListItem>
              <DataListItem>Profile information and professional details</DataListItem>
              <DataListItem>Educational background and certifications</DataListItem>
              <DataListItem>Payment and billing information</DataListItem>
              <DataListItem>Communication data and support requests</DataListItem>
              <DataListItem>Technical data (IP address, device type, browser info)</DataListItem>
            </DataList>

            <Paragraph>
              If you are a service provider or expert on ExpertYard, we may collect additional information such as identity 
              verification details, certifications, experience history, bank account details for payouts, and tax-related 
              information where required by law.
            </Paragraph>
            <Paragraph>
              We may also collect communication data, including messages, chats, emails, or support requests exchanged 
              through the platform. This helps us resolve disputes, provide customer support, and improve our services.
            </Paragraph>
            <Paragraph>
              Technical data such as IP address, device type, browser type, operating system, referral URLs, and usage 
              patterns may be automatically collected when you access ExpertYard. This data helps us monitor performance 
              and prevent fraud.
            </Paragraph>
            <Paragraph>
              Payment-related data is collected through secure third-party payment gateways. ExpertYard does not store 
              sensitive card details but may retain transaction references and billing information for record-keeping 
              and compliance purposes.
            </Paragraph>
          </Section>

          <Section id="data-usage">
            <SectionTitle>How Do We Use Your Personal Data?</SectionTitle>
            <Paragraph>
              ExpertYard uses personal data strictly for legitimate business purposes and in compliance with applicable 
              laws. The primary purpose of data usage is to provide, operate, and improve our services.
            </Paragraph>
            <Paragraph>
              We use your personal information to:
            </Paragraph>
            <DataList>
              <DataListItem>Create and manage user accounts</DataListItem>
              <DataListItem>Verify identities and prevent fraud</DataListItem>
              <DataListItem>Enable communication between users and experts</DataListItem>
              <DataListItem>Facilitate bookings and consultations</DataListItem>
              <DataListItem>Personalize your experience on the platform</DataListItem>
              <DataListItem>Provide customer support and resolve disputes</DataListItem>
            </DataList>
            <Paragraph>
              Your data helps us personalize your experience on ExpertYard by recommending relevant experts, services, 
              or content based on your preferences and usage behavior.
            </Paragraph>
            <Paragraph>
              ExpertYard may use aggregated and anonymized data for analytics, research, and business intelligence purposes. 
              This helps us understand user behavior and improve platform features without identifying individual users.
            </Paragraph>
            <Paragraph>
              We may use your contact details to send important service-related communications such as account updates, 
              booking confirmations, security alerts, and policy changes. Marketing communications will only be sent 
              where legally permitted or with your consent.
            </Paragraph>
          </Section>

          <Section id="cookies">
            <SectionTitle>Cookies</SectionTitle>
            <Paragraph>
              ExpertYard uses cookies and similar tracking technologies to enhance user experience and ensure smooth 
              platform functionality. Cookies are small data files stored on your device that help us recognize repeat 
              users and remember preferences.
            </Paragraph>
            <Paragraph>
              Cookies allow us to:
            </Paragraph>
            <DataList>
              <DataListItem>Keep users logged in securely</DataListItem>
              <DataListItem>Save language and display preferences</DataListItem>
              <DataListItem>Optimize page loading performance</DataListItem>
              <DataListItem>Analyze user behavior and improve features</DataListItem>
              <DataListItem>Prevent fraudulent activities</DataListItem>
            </DataList>
            <Paragraph>
              Some cookies may be placed by third-party service providers such as analytics or performance monitoring 
              tools. These third parties operate under their own privacy policies.
            </Paragraph>
            <Paragraph>
              Users can control or disable cookies through browser settings. However, disabling cookies may limit certain 
              features or functionalities of ExpertYard.
            </Paragraph>
            <ImportantNote>
              <ImportantNoteTitle>Cookie Consent</ImportantNoteTitle>
              <ImportantNoteText>
                By continuing to use ExpertYard without changing your cookie settings, you consent to our use of cookies 
                as described in this Privacy Policy.
              </ImportantNoteText>
            </ImportantNote>
          </Section>

          <Section id="rights">
            <SectionTitle>Your Rights</SectionTitle>
            <Paragraph>
              ExpertYard respects your rights regarding personal data and provides users with reasonable access and 
              control over their information.
            </Paragraph>
            <DataList>
              <DataListItem>Right to access your personal data</DataListItem>
              <DataListItem>Right to correct inaccurate information</DataListItem>
              <DataListItem>Right to request data deletion</DataListItem>
              <DataListItem>Right to withdraw consent</DataListItem>
              <DataListItem>Right to data portability</DataListItem>
              <DataListItem>Right to lodge a complaint</DataListItem>
            </DataList>
            <Paragraph>
              You have the right to access the personal data we hold about you and request a copy of the information.
            </Paragraph>
            <Paragraph>
              You may request corrections or updates to inaccurate or incomplete personal data at any time through your 
              account settings or by contacting support.
            </Paragraph>
            <Paragraph>
              Users have the right to request deletion of their personal data, subject to legal, contractual, or operational 
              obligations that require data retention.
            </Paragraph>
            <Paragraph>
              You may withdraw consent for certain data processing activities where consent is the legal basis, without 
              affecting the lawfulness of prior processing.
            </Paragraph>
            <Paragraph>
              If you believe your privacy rights have been violated, you may contact our support team at{' '}
              <ContactLink href="mailto:privacy@expertyard.com">privacy@expertyard.com</ContactLink>, and we will address 
              your concerns in a timely manner.
            </Paragraph>
          </Section>

          <FooterNote>
            <p>For any privacy-related questions or concerns, please contact our Data Protection Officer at:</p>
            <p>
              <ContactLink href="mailto:dpo@expertyard.com">dpo@expertyard.com</ContactLink> | 
              <ContactLink href="tel:+18881234567"> +1 (888) 123-4567</ContactLink>
            </p>
            <p style={{ marginTop: '10px', fontSize: '12px', color: '#718096' }}>
              © 2026 ExpertYard. All rights reserved.
            </p>
          </FooterNote>
        </ContentWrapper>

        <Sidebar>
          <SidebarTitle>Privacy Policy</SidebarTitle>
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
        </Sidebar>
      </MainContainer>

      <ScrollToTop
        visible={showScrollTop}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        ↑
      </ScrollToTop>

      {showCookieConsent && (
        <CookieConsent>
          <CookieTitle>Cookie Consent</CookieTitle>
          <CookieText>
            We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
            By clicking "Accept All", you consent to our use of cookies.
          </CookieText>
          <CookieButtons>
            <CookieButton className="accept" onClick={handleCookieAccept}>
              Accept All
            </CookieButton>
            <CookieButton className="decline" onClick={handleCookieDecline}>
              Necessary Only
            </CookieButton>
          </CookieButtons>
        </CookieConsent>
      )}
    </PageContainer>
  );
};

export default PrivacyPolicy;