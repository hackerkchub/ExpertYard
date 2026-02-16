import React, { useState, useEffect } from 'react';
import {
  PageContainer,
  HeroSection,
  HeroContent,
  HeroTitle,
  HeroSubtitle,
  SearchContainer,
  SearchInput,
  SearchIcon,
  MainContainer,
  Sidebar,
  SidebarTitle,
  CategoryList,
  CategoryItem,
  ContentArea,
  CategoryTitle,
  FAQCard,
  QuestionWrapper,
  Question,
  ToggleIcon,
  Answer,
  ContactSection,
  ContactTitle,
  ContactText,
  ContactButtons,
  ContactButton,
  NoResults,
  NoResultsIcon,
  NoResultsText,
  PopularTopics,
  PopularTitle,
  TopicTags,
  TopicTag,
  ProgressBar,
  ScrollToTop
} from './Faq.styles';

const faqData = {
  "Getting Started": [
    {
      question: "What is ExpertYard?",
      answer:
        "ExpertYard is a premium platform that connects customers with verified service professionals for home and personal services. We ensure all professionals undergo thorough background checks and skill verification to provide you with the best service experience.",
    },
    {
      question: "How do I book a service?",
      answer:
        "Booking a service is simple! Just follow these steps: 1) Browse through our service categories, 2) Select the service you need, 3) Choose your preferred time slot, 4) Review and confirm your booking. You'll receive an instant confirmation via email and SMS.",
    },
    {
      question: "How do I create an account?",
      answer:
        "Creating an account is free and takes less than 2 minutes. Click on the 'Sign Up' button, enter your basic details (name, email, phone number), set a password, and verify your email. You can also sign up using your Google or Facebook account for faster access.",
    },
  ],
  "Payments & Pricing": [
    {
      question: "What payment methods are accepted?",
      answer:
        "We accept multiple payment methods including: UPI (Google Pay, PhonePe, Paytm), all major credit/debit cards (Visa, MasterCard, RuPay, American Express), net banking (all major banks), and digital wallets. All payments are processed securely through encrypted payment gateways.",
    },
    {
      question: "Is there any cancellation fee?",
      answer:
        "Cancellation fees depend on when you cancel: Free cancellation up to 24 hours before service, 25% fee for cancellation within 24 hours, and 50% fee for cancellation within 2 hours. No-shows without cancellation will be charged 100% of the service fee.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "Yes, we offer refunds in case of service issues. If you're not satisfied with the service, you can raise a dispute within 48 hours. Our team will review the case and process a refund if valid. Refunds are credited within 5-7 business days to the original payment method.",
    },
  ],
  "Bookings": [
    {
      question: "Can I reschedule my booking?",
      answer:
        "Yes, you can reschedule your booking up to 2 hours before the scheduled start time. Simply go to 'My Bookings' section in your account, select the booking you want to reschedule, and choose a new time slot. Rescheduling is free if done at least 24 hours in advance.",
    },
    {
      question: "How do I track my service provider?",
      answer:
        "Once your booking is confirmed, you can track your service provider in real-time through our app. You'll receive updates when the professional starts their journey, arrives at your location, and starts the service. You can also chat with them directly through the app.",
    },
    {
      question: "What if the professional doesn't show up?",
      answer:
        "If a professional doesn't show up within 30 minutes of the scheduled time, please contact our 24/7 support team immediately. We'll send another professional or provide a full refund. We guarantee a response within 15 minutes for such cases.",
    },
  ],
  "Safety & Trust": [
    {
      question: "Are professionals verified?",
      answer:
        "Yes, absolutely! All professionals on our platform undergo a rigorous 5-step verification process including: government ID verification, address verification, professional qualification checks, background screening, and in-person interviews. We also regularly monitor service quality through customer feedback.",
    },
    {
      question: "How do you ensure safety during the service?",
      answer:
        "We have multiple safety measures in place: All professionals are trained in safety protocols, we provide real-time tracking for every service, and we have emergency support available 24/7. Additionally, all services are insured for your peace of mind.",
    },
    {
      question: "What is your privacy policy?",
      answer:
        "We take your privacy seriously. Your personal information is encrypted and never shared with third parties without your consent. Professionals only see necessary details like your name and address. You can read our complete privacy policy for more details.",
    },
  ],
  "Support": [
    {
      question: "How do I contact customer support?",
      answer:
        "Our customer support team is available 24/7 through multiple channels: Live chat on our website/app (average response time: 2 minutes), Email at support@expertyard.com (response within 4 hours), or Phone at +1 (888) 123-4567 (toll-free). We're always here to help!",
    },
    {
      question: "What if I have a complaint about a service?",
      answer:
        "If you have a complaint, please raise it through our 'Report an Issue' feature within 48 hours of service completion. Our dedicated support team will investigate and get back to you within 24 hours with a resolution. We take all complaints very seriously.",
    },
  ],
};

const HelpCenter = () => {
  const categories = Object.keys(faqData);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
      setShowScrollTop(winScroll > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Filter FAQs based on search query
  const getFilteredFAQs = () => {
    if (!searchQuery.trim()) return faqData[activeCategory];

    const query = searchQuery.toLowerCase();
    const allFAQs = Object.values(faqData).flat();
    
    return allFAQs.filter(
      item => 
        item.question.toLowerCase().includes(query) || 
        item.answer.toLowerCase().includes(query)
    );
  };

  const handleTopicClick = (topic) => {
    setSearchQuery(topic);
  };

  const filteredFAQs = getFilteredFAQs();
  const popularTopics = ['Booking', 'Payment', 'Refund', 'Safety', 'Verification', 'Support'];

  return (
    <PageContainer>
      <ProgressBar style={{ transform: `scaleX(${scrollProgress / 100})` }} />

      <HeroSection>
        <HeroContent>
          <HeroTitle>How Can We Help You?</HeroTitle>
          <HeroSubtitle>
            Search our help center for answers to common questions or browse by category below.
          </HeroSubtitle>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchIcon>🔍</SearchIcon>
          </SearchContainer>
        </HeroContent>
      </HeroSection>

      <MainContainer>
        <Sidebar>
          <SidebarTitle>Help Center</SidebarTitle>
          <CategoryList>
            {categories.map((cat) => (
              <CategoryItem
                key={cat}
                active={cat === activeCategory && !searchQuery}
                onClick={() => {
                  setActiveCategory(cat);
                  setSearchQuery('');
                  setOpenIndex(null);
                }}
              >
                {cat}
              </CategoryItem>
            ))}
          </CategoryList>

          <PopularTopics>
            <PopularTitle>Popular Topics</PopularTitle>
            <TopicTags>
              {popularTopics.map((topic, index) => (
                <TopicTag key={index} onClick={() => handleTopicClick(topic)}>
                  {topic}
                </TopicTag>
              ))}
            </TopicTags>
          </PopularTopics>
        </Sidebar>

        <ContentArea>
          {searchQuery ? (
            <>
              <CategoryTitle>Search Results for "{searchQuery}"</CategoryTitle>
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map((item, index) => (
                  <FAQCard key={index}>
                    <QuestionWrapper
                      open={openIndex === index}
                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    >
                      <Question>{item.question}</Question>
                      <ToggleIcon open={openIndex === index}>
                        {openIndex === index ? '−' : '+'}
                      </ToggleIcon>
                    </QuestionWrapper>
                    {openIndex === index && (
                      <Answer>{item.answer}</Answer>
                    )}
                  </FAQCard>
                ))
              ) : (
                <NoResults>
                  <NoResultsIcon>🔍</NoResultsIcon>
                  <NoResultsText>No results found for "{searchQuery}"</NoResultsText>
                  <ContactText>Try different keywords or contact our support team</ContactText>
                </NoResults>
              )}
            </>
          ) : (
            <>
              <CategoryTitle>{activeCategory}</CategoryTitle>
              {faqData[activeCategory].map((item, index) => (
                <FAQCard key={index}>
                  <QuestionWrapper
                    open={openIndex === index}
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  >
                    <Question>{item.question}</Question>
                    <ToggleIcon open={openIndex === index}>
                      {openIndex === index ? '−' : '+'}
                    </ToggleIcon>
                  </QuestionWrapper>
                  {openIndex === index && (
                    <Answer>{item.answer}</Answer>
                  )}
                </FAQCard>
              ))}
            </>
          )}

          <ContactSection>
            <ContactTitle>Still Need Help?</ContactTitle>
            <ContactText>
              Can't find what you're looking for? Our support team is available 24/7 to assist you.
            </ContactText>
            <ContactButtons>
              <ContactButton className="chat">
                💬 Contact Us 
              </ContactButton>
              {/* <ContactButton className="email">
                ✉️ Email Support
              </ContactButton> */}
            </ContactButtons>
          </ContactSection>
        </ContentArea>
      </MainContainer>

      <ScrollToTop
        visible={showScrollTop}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        ↑
      </ScrollToTop>
    </PageContainer>
  );
};

export default HelpCenter;