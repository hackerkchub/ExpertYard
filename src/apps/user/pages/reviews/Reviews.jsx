// src/pages/Reviews/Reviews.jsx
import React, { useState } from "react";
import {
  ReviewsContainer,
  HeroSection,
  HeroContent,
  HeroTitle,
  HeroSubtitle,
  Section,
  SectionTitle,
  SectionSubtitle,
  StatsContainer,
  StatItem,
  StatNumber,
  StatLabel,
  ReviewGrid,
  ReviewCard,
  ReviewerInfo,
  ReviewerAvatar,
  ReviewerDetails,
  ReviewerName,
  ReviewerCategory,
  RatingStars,
  StarIcon,
  ReviewContent,
  ReviewText,
  ReviewDate,
  FilterContainer,
  FilterButton,
  SearchInput,
  SearchContainer,
  Pagination,
  PageButton,
  CTAButton,
  PlatformMetrics,
  MetricCard,
  VerifiedBadge,
  FeaturedReview,
  TrustBadges,
  TrustBadge,
  EmptyState,
  SecondaryButton,
  ReviewStats,
  ReviewMeta,
  ActionButtons,
  Divider
} from "./Reviews.styles";

// Icons
import {
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaUserCircle,
  FaFilter,
  FaSearch,
  FaQuoteLeft,
  FaCheckCircle,
  FaThumbsUp,
  FaAward,
  FaShieldAlt,
  FaArrowLeft,
  FaArrowRight,
  FaGoogle,
  FaFacebook,
  FaStar as FaStarIcon,
  FaLinkedin
} from "react-icons/fa";

// Sample reviews data
const reviewsData = [
  {
    id: 1,
    name: "Sarah Johnson",
    category: "Business Strategy",
    rating: 5,
    date: "2024-01-15",
    review: "ExpertYard connected me with a marketing strategist who transformed our digital presence. The insights were game-changing!",
    avatarColor: "#4f46e5",
    verified: true,
    // featured: true
  },
  {
    id: 2,
    name: "Michael Chen",
    category: "Legal Consultation",
    rating: 5,
    date: "2024-01-12",
    review: "As a startup founder, I needed legal guidance quickly. Found the perfect lawyer who helped us navigate complex contracts.",
    avatarColor: "#7c3aed",
    verified: true
  },
  {
    id: 3,
    name: "Priya Sharma",
    category: "Career Coaching",
    rating: 4,
    date: "2024-01-10",
    review: "My career coach provided actionable advice that helped me land a promotion within 3 months. Worth every penny!",
    avatarColor: "#10b981",
    verified: true
  },
  {
    id: 4,
    name: "David Wilson",
    category: "Financial Planning",
    rating: 5,
    date: "2024-01-08",
    review: "The financial expert helped me create a solid investment plan. My portfolio has grown by 25% in 6 months.",
    avatarColor: "#f59e0b",
    verified: true,
    // featured: true
  },
  {
    id: 5,
    name: "Lisa Rodriguez",
    category: "Health & Wellness",
    rating: 4,
    date: "2024-01-05",
    review: "Found a nutritionist who understood my specific needs. The personalized plan has improved my energy levels significantly.",
    avatarColor: "#ef4444",
    verified: true
  },
  {
    id: 6,
    name: "Robert Kim",
    category: "Tech Consulting",
    rating: 5,
    date: "2024-01-02",
    review: "Helped us choose the right tech stack for our SaaS product. Saved us months of research and potential mistakes.",
    avatarColor: "#3b82f6",
    verified: true
  },
  {
    id: 7,
    name: "Emma Williams",
    category: "Real Estate",
    rating: 5,
    date: "2023-12-28",
    review: "The real estate expert guided us through our first home purchase. Negotiated a great deal and saved us thousands.",
    avatarColor: "#8b5cf6",
    verified: true
  },
  {
    id: 8,
    name: "James Taylor",
    category: "Marketing",
    rating: 4,
    date: "2023-12-25",
    review: "Our marketing strategy consultant provided fresh perspectives that increased our conversions by 40% in 2 months.",
    avatarColor: "#f97316",
    verified: true
  }
];

// Categories
const categories = [
  "All Categories",
  "Business Strategy",
  "Legal Consultation",
  "Career Coaching",
  "Financial Planning",
  "Health & Wellness",
  "Tech Consulting",
  "Real Estate",
  "Marketing"
];

// Stats
const stats = [
  { number: "4.9/5", label: "Average Rating", icon: <FaStar /> },
  { number: "10,000+", label: "Expert Reviews", icon: <FaThumbsUp /> },
  { number: "98%", label: "Satisfaction Rate", icon: <FaAward /> },
  { number: "150+", label: "Expert Categories", icon: <FaCheckCircle /> }
];

// Platform metrics
const platformMetrics = [
  { platform: "Google", rating: "4.8", reviews: "2,500+" },
  { platform: "Facebook", rating: "4.9", reviews: "1,800+" },
  { platform: "Trustpilot", rating: "4.7", reviews: "3,200+" },
  { platform: "LinkedIn", rating: "4.9", reviews: "950+" }
];

// Trust badges
const trustBadges = [
  { icon: <FaShieldAlt />, text: "Verified Reviews" },
  { icon: <FaCheckCircle />, text: "Authentic Users" },
  { icon: <FaAward />, text: "Expert Vetting" },
  { icon: <FaStar />, text: "Quality Guaranteed" }
];

const Reviews = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 6;

  // Filter reviews
  const filteredReviews = reviewsData.filter(review => {
    const matchesCategory = selectedCategory === "All Categories" || review.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      review.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.review.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate pagination
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  // Render stars
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={`full-${i}`}><FaStar /></StarIcon>);
    }
    
    if (hasHalfStar) {
      stars.push(<StarIcon key="half"><FaStarHalfAlt /></StarIcon>);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarIcon key={`empty-${i}`} className="empty"><FaRegStar /></StarIcon>);
    }
    
    return stars;
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <ReviewsContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <HeroTitle>
            Real Reviews from <span>Real Users</span>
          </HeroTitle>
          <HeroSubtitle>
            Discover what thousands of satisfied customers have to say about their ExpertYard experience.
          </HeroSubtitle>
          
          {/* Stats */}
          <StatsContainer>
            {stats.map((stat, index) => (
              <StatItem key={index}>
                <div style={{ fontSize: '2.5rem', color: 'white', marginBottom: '1rem' }}>
                  {stat.icon}
                </div>
                <StatNumber>{stat.number}</StatNumber>
                <StatLabel>{stat.label}</StatLabel>
              </StatItem>
            ))}
          </StatsContainer>
        </HeroContent>
      </HeroSection>

      {/* Trust Badges */}
      <Section style={{ padding: '3rem 2rem' }}>
        <TrustBadges>
          {trustBadges.map((badge, index) => (
            <TrustBadge key={index}>
              <div>
                {badge.icon}
              </div>
              <span>{badge.text}</span>
            </TrustBadge>
          ))}
        </TrustBadges>
      </Section>

      {/* Platform Ratings */}
      <Section style={{ background: '#f9fafb' }}>
        <SectionTitle center>Trusted Across Platforms</SectionTitle>
        <SectionSubtitle center>
          Our commitment to excellence is recognized everywhere
        </SectionSubtitle>
        
        <PlatformMetrics>
          {platformMetrics.map((metric, index) => (
            <MetricCard key={index}>
              <div style={{ fontSize: '2rem', color: '#4f46e5', marginBottom: '0.5rem' }}>
                {metric.platform === "Google" && <FaGoogle />}
                {metric.platform === "Facebook" && <FaFacebook />}
                {metric.platform === "Trustpilot" && <FaStarIcon />}
                {metric.platform === "LinkedIn" && <FaLinkedin />}
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', marginBottom: '0.25rem' }}>
                {metric.rating}
                <span style={{ fontSize: '1rem', color: '#6b7280' }}>/5</span>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>{metric.reviews} reviews</div>
            </MetricCard>
          ))}
        </PlatformMetrics>
      </Section>

      <Divider />

      {/* Reviews Section */}
      <Section>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem', 
          flexWrap: 'wrap', 
          gap: '1.5rem' 
        }}>
          <div>
            <SectionTitle>Customer Reviews</SectionTitle>
            <ReviewStats>
              <strong>{filteredReviews.length}</strong> reviews from verified users
              <span>•</span>
              <span>Average rating: <strong>4.9/5</strong></span>
            </ReviewStats>
          </div>
          
          <ActionButtons>
            <SearchContainer>
              <FaSearch style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '1rem', 
                transform: 'translateY(-50%)',
                color: '#9ca3af' 
              }} />
              <SearchInput
                type="text"
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchContainer>
          </ActionButtons>
        </div>

        {/* Category Filters */}
        <FilterContainer>
          {categories.map((category) => (
            <FilterButton
              key={category}
              active={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </FilterButton>
          ))}
        </FilterContainer>

        {/* Featured Review */}
        {selectedCategory === "All Categories" && (
          <FeaturedReview>
            <FaQuoteLeft style={{ fontSize: '2.5rem', color: '#4f46e5', marginBottom: '1.5rem', opacity: 0.7 }} />
            <ReviewText style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
              "ExpertYard completely transformed how we approach business strategy. The quality of experts is unmatched, 
              and the platform makes it so easy to find exactly what you need. We've saved countless hours and made better 
              decisions thanks to the guidance we received."
            </ReviewText>
            <ReviewMeta>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  marginRight: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '1.2rem'
                }}>
                  AT
                </div>
                <div>
                  <ReviewerName style={{ fontSize: '1.1rem', color: '#111827' }}>Alex Thompson</ReviewerName>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
                    <RatingStars>
                      {renderStars(5)}
                    </RatingStars>
                    <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>CEO, TechCorp Inc.</span>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
                {formatDate('2024-01-20')}
              </div>
            </ReviewMeta>
          </FeaturedReview>
        )}

        {/* Reviews Grid */}
        {filteredReviews.length > 0 ? (
          <>
            <ReviewGrid>
              {currentReviews.map((review) => (
                <ReviewCard key={review.id} featured={review.featured}>
                  {review.featured && (
                    <div style={{
                      position: 'absolute',
                      top: '20px',
                      right: '20px',
                      background: '#10b981',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      zIndex: '1',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                    }}>
                     
                    </div>
                  )}
                  
                  <ReviewerInfo>
                    <ReviewerAvatar style={{ background: review.avatarColor }}>
                      {review.name.charAt(0)}
                    </ReviewerAvatar>
                    <ReviewerDetails>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ReviewerName>{review.name}</ReviewerName>
                        {review.verified && (
                          <VerifiedBadge title="Verified User">
                            <FaCheckCircle />
                          </VerifiedBadge>
                        )}
                      </div>
                      <ReviewerCategory>{review.category}</ReviewerCategory>
                    </ReviewerDetails>
                  </ReviewerInfo>

                  <RatingStars>
                    {renderStars(review.rating)}
                    <span style={{ color: '#6b7280', marginLeft: '0.5rem', fontSize: '0.9rem' }}>
                      {review.rating}/5
                    </span>
                  </RatingStars>

                  <ReviewContent>
                    <ReviewText>{review.review}</ReviewText>
                  </ReviewContent>

                  <ReviewDate>{formatDate(review.date)}</ReviewDate>
                </ReviewCard>
              ))}
            </ReviewGrid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination>
                <PageButton
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <FaArrowLeft />
                </PageButton>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <PageButton
                      key={pageNum}
                      active={currentPage === pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </PageButton>
                  );
                })}
                
                <PageButton
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  <FaArrowRight />
                </PageButton>
              </Pagination>
            )}
          </>
        ) : (
          <EmptyState>
            <FaSearch style={{ fontSize: '3.5rem', color: '#d1d5db', marginBottom: '1.5rem' }} />
            <h3 style={{ color: '#111827', marginBottom: '0.75rem', fontSize: '1.5rem' }}>No reviews found</h3>
            <p style={{ color: '#6b7280', textAlign: 'center', maxWidth: '400px' }}>
              No reviews match your search criteria. Try adjusting your filters.
            </p>
          </EmptyState>
        )}
      </Section>

      {/* CTA Section */}
      <Section style={{ 
        padding: '4rem 2rem',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          color: 'white',
          borderRadius: '20px',
          padding: '4rem 3rem',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(79, 70, 229, 0.3)'
        }}>
          <SectionTitle center style={{ color: 'white', fontSize: '2.2rem' }}>
            Share Your Experience
          </SectionTitle>
          <SectionSubtitle center style={{ 
            color: 'rgba(255, 255, 255, 0.95)', 
            maxWidth: '600px', 
            margin: '1.5rem auto',
            fontSize: '1.1rem'
          }}>
            Your feedback helps others make informed decisions and helps us improve our services.
          </SectionSubtitle>
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'center', 
            marginTop: '2rem', 
            flexWrap: 'wrap' 
          }}>
            <CTAButton to="/user/contact-us" style={{ 
              background: 'white', 
              color: '#4f46e5',
              fontWeight: '600',
              '&:hover': {
                background: '#f9fafb'
              }
            }}>
              Contact Us
            </CTAButton>
            <SecondaryButton to="/user/call-chat" style={{ 
              border: '2px solid white',
              color: 'white',
              fontWeight: '600',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)'
              }
            }}>
              Find an Expert
            </SecondaryButton>
          </div>
        </div>
      </Section>
    </ReviewsContainer>
  );
};

export default Reviews;