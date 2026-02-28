// src/pages/AboutUs/AboutUs.jsx
import React from "react";
import {
  AboutContainer,
  HeroSection,
  HeroContent,
  HeroTitle,
  HeroSubtitle,
  Section,
  SectionTitle,
  SectionSubtitle,
  SectionContent,
  StatsContainer,
  StatItem,
  StatNumber,
  StatLabel,
  TeamSection,
  TeamMember,
  MemberIcon,
  MemberInfo,
  MemberName,
  MemberRole,
  MemberBio,
  ValueCard,
  ValueIcon,
  ValueTitle,
  ValueDescription,
  CTAButton,
  PartnerLogos,
  PartnerIcon,
 MissionVisionWrapper,
MissionVisionCard,
  GradientText,
  SectionSpacer
} from "./AboutUs.styles";

// Icons
import { 
  FaUsers, 
  FaGlobe, 
  FaAward, 
  FaHandshake,
  FaLightbulb,
  FaShieldAlt,
  FaHeart,
  FaRocket,
  FaStar,
  FaUserTie,
  FaUserGraduate,
  FaUserMd,
  FaUserNinja,
  FaGoogle,
  FaMicrosoft,
  FaApple,
  FaAmazon,
  FaLinkedin,
  FaTwitter
} from "react-icons/fa";

const AboutUs = () => {
  // Statistics data
  const stats = [
    { number: "10,000+", label: "Verified Experts", icon: <FaUsers /> },
    { number: "150+", label: "Countries Served", icon: <FaGlobe /> },
    { number: "500K+", label: "Happy Customers", icon: <FaHeart /> },
    { number: "4.9/5", label: "Average Rating", icon: <FaStar /> }
  ];

  // Team members with icons
  const teamMembers = [
    {
      icon: <FaUserTie />,
      name: "Alex Johnson",
      role: "CEO & Founder",
      bio: "Former Google Product Lead with 15+ years in tech industry",
      color: "#3B82F6"
    },
    {
      icon: <FaUserGraduate />,
      name: "Sarah Williams",
      role: "CTO",
      bio: "AI/ML Specialist from Stanford, built scalable platforms for Fortune 500",
      color: "#8B5CF6"
    },
    {
      icon: <FaUserMd />,
      name: "Michael Chen",
      role: "Head of Partnerships",
      bio: "Ex-McKinsey consultant with global business development expertise",
      color: "#10B981"
    },
    {
      icon: <FaUserNinja />,
      name: "Priya Sharma",
      role: "VP of Operations",
      bio: "Operations expert with decade of experience in service platforms",
      color: "#EF4444"
    }
  ];

  // Company values
  const values = [
    {
      icon: <FaLightbulb />,
      title: "Expertise First",
      description: "We rigorously vet every expert to ensure top-tier quality and professionalism."
    },
    {
      icon: <FaShieldAlt />,
      title: "Trust & Security",
      description: "Your data and privacy are protected with enterprise-grade security measures."
    },
    {
      icon: <FaHandshake />,
      title: "Transparency",
      description: "Clear pricing, honest reviews, and no hidden fees. Always."
    },
    {
      icon: <FaRocket />,
      title: "Innovation",
      description: "Constantly evolving our platform with cutting-edge technology."
    }
  ];

  // Company timeline
  const timeline = [
    { year: "2020", content: "Founded with vision to democratize expert access globally" },
    { year: "2021", content: "Launched MVP with 100 experts across 10 categories" },
    { year: "2022", content: "Expanded to 50+ countries with 5,000+ experts" },
    { year: "2023", content: "Raised Series B funding and launched AI matching algorithm" },
    { year: "2024", content: "Crossed 10,000 experts and 500K customers milestone" }
  ];

  // Partners with icons
  const partners = [
    { icon: <FaGoogle />, name: "Google" },
    { icon: <FaMicrosoft />, name: "Microsoft" },
    { icon: <FaApple />, name: "Apple" },
    { icon: <FaAmazon />, name: "Amazon" },
    { icon: <FaLinkedin />, name: "LinkedIn" },
    { icon: <FaTwitter />, name: "Twitter" }
  ];

  return (
    <AboutContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <HeroTitle>
            Connecting <GradientText>World-Class Experts</GradientText> with Global Seekers
          </HeroTitle>
          <HeroSubtitle>
            ExpertYard is the premier platform that bridges the gap between top-tier professionals 
            and individuals seeking expert guidance across diverse domains. We make expert knowledge accessible to everyone.
          </HeroSubtitle>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <CTAButton to="/user/call-chat">
              Find Your Expert
            </CTAButton>
            <CTAButton to="/user/how-it-works" style={{ background: 'transparent', border: '2px solid #3B82F6', color: '#3B82F6' }}>
              How It Works
            </CTAButton>
          </div>
        </HeroContent>
      </HeroSection>

      <SectionSpacer />

      {/* Stats Section */}
      <Section>
        <SectionTitle center>Our Impact in Numbers</SectionTitle>
        <SectionSubtitle center>
          Trusted by thousands worldwide for expert guidance
        </SectionSubtitle>
        <StatsContainer>
          {stats.map((stat, index) => (
            <StatItem key={index}>
              <div style={{ fontSize: '2.5rem', color: '#3b82f6', marginBottom: '1rem' }}>
                {stat.icon}
              </div>
              <StatNumber>{stat.number}</StatNumber>
              <StatLabel>{stat.label}</StatLabel>
            </StatItem>
          ))}
        </StatsContainer>
      </Section>

      <SectionSpacer />

      {/* Mission & Vision */}
<Section>
  <MissionVisionWrapper>

    <MissionVisionCard>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '2rem', color: '#3B82F6' }}>
          <FaRocket />
        </div>
        <SectionTitle style={{ marginBottom: 0 }}>
          Our Mission
        </SectionTitle>
      </div>
      <SectionContent>
        <p>
          To democratize access to expert knowledge by creating a seamless, transparent,
          and trustworthy platform where anyone can connect with verified professionals
          across any domain, anywhere in the world.
        </p>
      </SectionContent>
    </MissionVisionCard>

    <MissionVisionCard>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '2rem', color: '#8B5CF6' }}>
          <FaLightbulb />
        </div>
        <SectionTitle style={{ marginBottom: 0 }}>
          Our Vision
        </SectionTitle>
      </div>
      <SectionContent>
        <p>
          To become the world's most comprehensive expert network,
          empowering millions to make better decisions through professional guidance.
        </p>
      </SectionContent>
    </MissionVisionCard>

  </MissionVisionWrapper>
</Section>

      <SectionSpacer />

      {/* Values Section */}
      <Section>
        <SectionTitle center>Our Core Values</SectionTitle>
        <SectionSubtitle center>
          The principles that guide everything we do
        </SectionSubtitle>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem',
          marginTop: '2rem'
        }}>
          {values.map((value, index) => (
            <ValueCard key={index}>
              <ValueIcon>
                {value.icon}
              </ValueIcon>
              <ValueTitle>{value.title}</ValueTitle>
              <ValueDescription>{value.description}</ValueDescription>
            </ValueCard>
          ))}
        </div>
      </Section>

      <SectionSpacer />

      {/* Timeline Section */}
      {/* <Section style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)', borderRadius: '20px', padding: '3rem' }}>
        <SectionTitle center>Our Journey</SectionTitle>
        <SectionSubtitle center>
          Milestones in our growth story
        </SectionSubtitle>
        <TimelineContainer>
          {timeline.map((item, index) => (
            <TimelineItem key={index} position={index % 2 === 0 ? 'left' : 'right'}>
              <TimelineYear>{item.year}</TimelineYear>
              <TimelineContent>{item.content}</TimelineContent>
            </TimelineItem>
          ))}
        </TimelineContainer>
      </Section> */}

      <SectionSpacer />

      {/* Team Section */}
      <Section>
        <SectionTitle center>Meet Our Leadership</SectionTitle>
        <SectionSubtitle center>
          The minds behind ExpertYard's success
        </SectionSubtitle>
        <TeamSection>
          {teamMembers.map((member, index) => (
            <TeamMember key={index}>
              <MemberIcon style={{ background: member.color }}>
                {member.icon}
              </MemberIcon>
              <MemberInfo>
                <MemberName>{member.name}</MemberName>
                <MemberRole>{member.role}</MemberRole>
                <MemberBio>{member.bio}</MemberBio>
              </MemberInfo>
            </TeamMember>
          ))}
        </TeamSection>
      </Section>

      <SectionSpacer />

      {/* Partners Section */}
      <Section style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)', borderRadius: '20px', padding: '3rem' }}>
        <SectionTitle center>Trusted By Industry Leaders</SectionTitle>
        <SectionSubtitle center>
          Featured in and partnered with top organizations
        </SectionSubtitle>
        <PartnerLogos>
          {partners.map((partner, index) => (
            <PartnerIcon key={index} title={partner.name}>
              {partner.icon}
            </PartnerIcon>
          ))}
        </PartnerLogos>
      </Section>

      <SectionSpacer />

      {/* CTA Section */}
      <Section style={{ textAlign: 'center' }}>
        <SectionTitle center>Ready to Connect with Experts?</SectionTitle>
        <SectionSubtitle center style={{ maxWidth: '600px', margin: '1.5rem auto' }}>
          Join thousands who have transformed their decisions with expert guidance
        </SectionSubtitle>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
          <CTAButton to="/user/call-chat">
            Find Experts
          </CTAButton>
          <CTAButton to="/expert/register" style={{ 
            background: 'transparent', 
            border: '2px solid #3b82f6',
            color: '#3b82f6',
            '&:hover': {
              background: '#3b82f6',
              color: 'white'
            }
          }}>
            Become an Expert
          </CTAButton>
        </div>
      </Section>

      <SectionSpacer />
    </AboutContainer>
  );
};

export default AboutUs;