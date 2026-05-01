// src/apps/admin/pages/ExpertDetail.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaBriefcase,
  FaFileAlt,
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaRupeeSign,
  FaClock,
  FaCertificate,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaIdCard,
  FaCheckCircle,
  FaTimesCircle,
  FaImage,
  FaTrash,
  FaEye,
  FaDollarSign,
  FaChartLine
} from "react-icons/fa";

import {
  getFullExpertApi,
  deleteExperienceApi,
  deletePostApi,
  deleteReviewApi
} from "../../../shared/api/admin/expert.api";

import {
  PageContainer,
  ContentWrapper,
  DetailHeader,
  HeaderLeft,
  BackButton,
  ExpertTitle,
  HeaderRight,
  ActionButton,
  StatsGrid,
  StatCard,
  StatIcon,
  StatLabel,
  StatValue,
  StatTrend,
  InfoCard,
  InfoGrid,
  InfoItem,
  DetailSection,
  Card,
  CardHeader,
  CardTitle,
  CardMeta,
  CardContent,
  RatingStars,
  DeleteButton,
  ViewButton,
  ButtonGroup,
  LoadingSpinner,
  EmptyState,
  PriceTag,
  PlanBadge
} from "../styles/expertDetail.styles";

export default function ExpertDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getFullExpertApi(id);
      console.log("API Response:", res.data);
      setData(res.data.data);
    } catch (err) {
      console.error("Error fetching expert details:", err);
      alert("Failed to load expert details");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExperience = async (expId) => {
    if (!window.confirm("Delete this experience?")) return;
    try {
      await deleteExperienceApi(expId);
      fetchData();
      alert("Experience deleted successfully");
    } catch (err) {
      console.error("Delete experience error:", err);
      alert("Failed to delete experience");
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await deletePostApi(postId);
      fetchData();
      alert("Post deleted successfully");
    } catch (err) {
      console.error("Delete post error:", err);
      alert("Failed to delete post");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await deleteReviewApi(reviewId);
      fetchData();
      alert("Review deleted successfully");
    } catch (err) {
      console.error("Delete review error:", err);
      alert("Failed to delete review");
    }
  };

  const truncateText = (text, maxLength = 200) => {
    if (!text || typeof text !== 'string') return 'No content available';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half-star" />);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} />);
    }
    return <RatingStars>{stars}</RatingStars>;
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner>
          <div className="spinner"></div>
          <p>Loading expert details...</p>
        </LoadingSpinner>
      </PageContainer>
    );
  }

  if (!data) {
    return (
      <PageContainer>
        <EmptyState>
          <FaFileAlt size={48} />
          <h4>Expert not found</h4>
          <p>The expert you're looking for doesn't exist or has been removed</p>
          <BackButton onClick={() => navigate("/admin/expert-management")}>
            <FaArrowLeft /> Back to Experts
          </BackButton>
        </EmptyState>
      </PageContainer>
    );
  }

  const expert = data.expert || {};
  const profile = data.profile || {};
  const experiences = data.experience || [];
  const posts = data.posts || [];
  const reviews = data.reviews || [];
  const plans = data.plans || [];
  const prices = data.prices || {};

  const stats = {
    totalExperience: experiences.length,
    totalPosts: posts.length,
    totalReviews: reviews.length,
    avgRating: reviews.length > 0 
      ? (reviews.reduce((acc, r) => acc + (r.rating_number || 0), 0) / reviews.length).toFixed(1)
      : 0
  };

  return (
    <PageContainer>
      <ContentWrapper>
        {/* Header */}
        <DetailHeader>
          <HeaderLeft>
            <BackButton onClick={() => navigate("/admin/expert-management")}>
              <FaArrowLeft /> Back to Experts
            </BackButton>
            <ExpertTitle>{expert.name || 'Unknown Expert'}</ExpertTitle>
          </HeaderLeft>
          <HeaderRight>
            {/* <ActionButton onClick={() => navigate(`/admin/expert-approval/${id}`)}>
              <FaCheckCircle /> Approve/Edit
            </ActionButton> */}
          </HeaderRight>
        </DetailHeader>

        {/* Stats Cards */}
        <StatsGrid>
          <StatCard>
            <StatIcon><FaBriefcase /></StatIcon>
            <StatLabel>Experience</StatLabel>
            <StatValue>{stats.totalExperience}</StatValue>
            <StatTrend>Years of expertise</StatTrend>
          </StatCard>

          <StatCard>
            <StatIcon><FaFileAlt /></StatIcon>
            <StatLabel>Posts</StatLabel>
            <StatValue>{stats.totalPosts}</StatValue>
            <StatTrend>Articles published</StatTrend>
          </StatCard>

          <StatCard>
            <StatIcon><FaStar /></StatIcon>
            <StatLabel>Reviews</StatLabel>
            <StatValue>{stats.totalReviews}</StatValue>
            <StatTrend $positive>{stats.avgRating} ⭐ average</StatTrend>
          </StatCard>

          <StatCard>
            <StatIcon><FaChartLine /></StatIcon>
            <StatLabel>Status</StatLabel>
            <StatValue>{expert.status === 1 ? 'Active' : 'Inactive'}</StatValue>
            <StatTrend $positive={expert.status === 1}>
              {expert.status === 1 ? 'Available' : 'Not available'}
            </StatTrend>
          </StatCard>
        </StatsGrid>

        {/* Basic Information */}
        <InfoCard>
          <h3><FaIdCard /> Basic Information</h3>
          <InfoGrid>
            <InfoItem>
              <strong>Full Name</strong>
              <span>{expert.name || 'N/A'}</span>
            </InfoItem>
            <InfoItem>
              <strong><FaEnvelope /> Email</strong>
              <span>{expert.email || 'N/A'}</span>
            </InfoItem>
            <InfoItem>
              <strong><FaPhone /> Phone</strong>
              <span>{expert.phone || profile.phone || 'N/A'}</span>
            </InfoItem>
            <InfoItem>
              <strong><FaMapMarkerAlt /> Location</strong>
              <span>{profile.location || 'N/A'}</span>
            </InfoItem>
            <InfoItem>
              <strong><FaCalendarAlt /> Joined</strong>
              <span>{formatDate(expert.created_at)}</span>
            </InfoItem>
            <InfoItem>
              <strong><FaChartLine /> Subscription</strong>
              <span>
                <PlanBadge $plan={expert.current_plan}>
                  {expert.current_plan || 'No plan'}
                </PlanBadge>
              </span>
            </InfoItem>
            <InfoItem>
              <strong>Category ID</strong>
              <span>{expert.category_id || 'N/A'}</span>
            </InfoItem>
            <InfoItem>
              <strong>Subcategory ID</strong>
              <span>{expert.subcategory_id || 'N/A'}</span>
            </InfoItem>
          </InfoGrid>
        </InfoCard>

        {/* Profile Details */}
        {profile && Object.keys(profile).length > 0 && (
          <InfoCard>
            <h3><FaCertificate /> Professional Profile</h3>
            <InfoGrid>
              <InfoItem>
                <strong>Position</strong>
                <span>{profile.position || 'N/A'}</span>
              </InfoItem>
              <InfoItem>
                <strong><FaGraduationCap /> Education</strong>
                <span>{profile.education || 'N/A'}</span>
              </InfoItem>
              <InfoItem>
                <strong>Description</strong>
                <span>{profile.description || 'N/A'}</span>
              </InfoItem>
              {profile.profile_photo && (
                <InfoItem>
                  <strong>Profile Photo</strong>
                  <div>
                    <img 
                      src={`https://softmaxs.com/${profile.profile_photo}`} 
                      alt="Profile" 
                      style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                </InfoItem>
              )}
            </InfoGrid>
          </InfoCard>
        )}

        {/* Pricing Information */}
        {(prices.call_per_minute || prices.chat_per_minute || prices.session_price) && (
          <InfoCard>
            <h3><FaRupeeSign /> Pricing & Plans</h3>
            <InfoGrid>
              {prices.call_per_minute && (
                <InfoItem>
                  <strong>Call per minute</strong>
                  <PriceTag><FaRupeeSign /> {prices.call_per_minute}</PriceTag>
                </InfoItem>
              )}
              {prices.chat_per_minute && (
                <InfoItem>
                  <strong>Chat per minute</strong>
                  <PriceTag><FaRupeeSign /> {prices.chat_per_minute}</PriceTag>
                </InfoItem>
              )}
              {prices.session_price && (
                <InfoItem>
                  <strong>Session Price</strong>
                  <PriceTag><FaRupeeSign /> {prices.session_price}</PriceTag>
                </InfoItem>
              )}
              {prices.session_duration && (
                <InfoItem>
                  <strong>Session Duration</strong>
                  <span>{prices.session_duration} minutes</span>
                </InfoItem>
              )}
              {prices.pricing_modes && (
                <InfoItem>
                  <strong>Pricing Modes</strong>
                  <span>{prices.pricing_modes.join(', ')}</span>
                </InfoItem>
              )}
            </InfoGrid>
          </InfoCard>
        )}

        {/* Subscription Plans */}
        {plans.length > 0 && (
          <DetailSection>
            <h3>
              <FaDollarSign /> Subscription Plans
              <span className="badge">{plans.length} plans</span>
            </h3>
            <InfoGrid>
              {plans.map((plan) => (
                <Card key={plan.id}>
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <PriceTag><FaRupeeSign /> {plan.price}</PriceTag>
                  </CardHeader>
                  <CardMeta>
                    <span><FaClock /> {plan.duration_type}</span>
                    {plan.is_active === 1 && <span><FaCheckCircle style={{ color: '#10b981' }} /> Active</span>}
                  </CardMeta>
                  {plan.call_enabled === 1 && <span>📞 Calls enabled</span>}
                  {plan.chat_enabled === 1 && <span>💬 Chat enabled</span>}
                </Card>
              ))}
            </InfoGrid>
          </DetailSection>
        )}

        {/* Work Experience */}
        <DetailSection>
          <h3>
            <FaBriefcase /> Work Experience
            <span className="badge">{experiences.length} records</span>
          </h3>
          {experiences.length > 0 ? (
            experiences.map((exp) => (
              <Card key={exp.id}>
                <CardHeader>
                  <CardTitle>{exp.title}</CardTitle>
                  <ButtonGroup>
                    <DeleteButton onClick={() => handleDeleteExperience(exp.id)}>
                      <FaTrash /> Delete
                    </DeleteButton>
                  </ButtonGroup>
                </CardHeader>
                <CardMeta>
                  <span>{exp.company}</span>
                  <span>{formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : 'Present'}</span>
                </CardMeta>
                {exp.certificate && (
                  <CardMeta>
                    <span><FaCertificate /> Certificate available</span>
                  </CardMeta>
                )}
              </Card>
            ))
          ) : (
            <EmptyState>
              <FaBriefcase size={48} />
              <h4>No experience records</h4>
              <p>This expert hasn't added any work experience yet</p>
            </EmptyState>
          )}
        </DetailSection>

        {/* Posts / Articles */}
        <DetailSection>
          <h3>
            <FaFileAlt /> Posts & Articles
            <span className="badge">{posts.length} posts</span>
          </h3>
          {posts.length > 0 ? (
            posts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <ButtonGroup>
                    {/* <ViewButton onClick={() => navigate(`/admin/posts/${post.id}`)}>
                      <FaEye /> View
                    </ViewButton> */}
                    <DeleteButton onClick={() => handleDeletePost(post.id)}>
                      <FaTrash /> Delete
                    </DeleteButton>
                  </ButtonGroup>
                </CardHeader>
                <CardMeta>
                  <span><FaCalendarAlt /> {formatDate(post.created_at)}</span>
                  {post.likes !== undefined && <span>❤️ {post.likes} likes</span>}
                  {post.comments_count !== undefined && <span>💬 {post.comments_count} comments</span>}
                </CardMeta>
                {post.image_url && (
                  <img 
                    src={`https://softmaxs.com/${post.image_url}`} 
                    alt={post.title}
                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '12px', marginTop: '12px' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}
                <CardContent>{truncateText(post.description || post.content)}</CardContent>
              </Card>
            ))
          ) : (
            <EmptyState>
              <FaFileAlt size={48} />
              <h4>No posts yet</h4>
              <p>This expert hasn't published any posts</p>
            </EmptyState>
          )}
        </DetailSection>

        {/* Reviews & Ratings */}
        <DetailSection>
          <h3>
            <FaStar /> Reviews & Ratings
            <span className="badge">{reviews.length} reviews</span>
          </h3>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <Card key={review.id}>
                <CardHeader>
                  <div>
                    {renderRatingStars(review.rating_number || 0)}
                    <CardTitle style={{ marginTop: '8px' }}>
                      {review.first_name} {review.last_name}
                    </CardTitle>
                  </div>
                  <DeleteButton onClick={() => handleDeleteReview(review.id)}>
                    <FaTrash /> Delete Review
                  </DeleteButton>
                </CardHeader>
                <CardMeta>
                  <span><FaCalendarAlt /> {formatDate(review.created_at)}</span>
                </CardMeta>
                <CardContent>{review.review_text || 'No review text provided'}</CardContent>
              </Card>
            ))
          ) : (
            <EmptyState>
              <FaStar size={48} />
              <h4>No reviews yet</h4>
              <p>This expert hasn't received any reviews</p>
            </EmptyState>
          )}
        </DetailSection>
      </ContentWrapper>
    </PageContainer>
  );
}