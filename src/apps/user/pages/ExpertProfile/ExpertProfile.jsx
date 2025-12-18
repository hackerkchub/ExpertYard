import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiPhoneCall, FiMessageSquare } from "react-icons/fi";

import {
  PageWrap,
  HeaderBar,
  BackButton,
  TopSection,
  LeftImage,
  RightInfo,
  Name,
  Role,
  Status,
  PriceRow,
  PriceItem,
  MetaRow,
  Section,
  SectionTitle,
  SectionBody,
  TwoColumn,
  ListItem,
  TagRow,
  SkillTag,
  ReviewBlock,
  ReviewName,
  ReviewText,
  ActionButtons,
  ActionButton,
} from "./ExpertProfile.styles";

import { useExpert } from "../../../../shared/context/ExpertContext";


const ExpertProfilePage = () => {
  const { expertId } = useParams();
  const navigate = useNavigate();

  const { experts, loading } = useExpert();

  const expert = experts.find((e) => e.id === expertId);

  if (loading) return <div style={{ padding: 30 }}>Loading expert…</div>;
  if (!expert) return <div style={{ padding: 30 }}>Expert not found.</div>;

  return (
    <PageWrap>
      {/* HEADER */}
      <HeaderBar>
        <BackButton onClick={() => navigate(-1)}>
          <FiArrowLeft size={18} />
          Back
        </BackButton>
      </HeaderBar>

      {/* TOP SECTION */}
      <TopSection>
        <LeftImage src={expert.img} />

        <RightInfo>
          <Name>{expert.name}</Name>
          <Role>{expert.role}</Role>

          <Status $online={expert.online}>
            {expert.online ? "🟢 Available Now" : "⚪ Offline"}
          </Status>

          <MetaRow>
            ⭐ {expert.rating} • {expert.experienceYears}+ yrs exp •{" "}
            {expert.reviews} reviews
          </MetaRow>

          <PriceRow>
            <PriceItem>
              <strong>₹{expert.callPrice}</strong>
              <span>Call / min</span>
            </PriceItem>

            <PriceItem>
              <strong>₹{expert.chatPrice}</strong>
              <span>Chat / min</span>
            </PriceItem>
          </PriceRow>

          <ActionButtons>
            <ActionButton $primary>
              <FiPhoneCall size={18} style={{ marginRight: 8 }} />
              Start Call
            </ActionButton>

            <ActionButton>
              <FiMessageSquare size={18} style={{ marginRight: 8 }} />
              Start Chat
            </ActionButton>
          </ActionButtons>
        </RightInfo>
      </TopSection>

      {/* ABOUT */}
      <Section>
        <SectionTitle>About</SectionTitle>
        <SectionBody>{expert.about}</SectionBody>
      </Section>

      {/* EDUCATION */}
      <Section>
        <SectionTitle>Education</SectionTitle>
        {expert.education.map((edu, i) => (
          <ListItem key={i}>{edu}</ListItem>
        ))}
      </Section>

      {/* EXPERTISE */}
      <Section>
        <SectionTitle>Expertise</SectionTitle>

        <TwoColumn>
          <div>
            <strong>Main Expertise:</strong>
            <ListItem>{expert.mainExpertise}</ListItem>
          </div>

          <div>
            <strong>Other Expertise:</strong>
            {expert.otherExpertise.map((ex, i) => (
              <ListItem key={i}>{ex}</ListItem>
            ))}
          </div>
        </TwoColumn>
      </Section>

      {/* LANGUAGES */}
      <Section>
        <SectionTitle>Languages Known</SectionTitle>
        <TagRow>
          {expert.languages.map((lan, i) => (
            <SkillTag key={i}>{lan}</SkillTag>
          ))}
        </TagRow>
      </Section>

      {/* SKILLS */}
      <Section>
        <SectionTitle>Skills</SectionTitle>
        <TagRow>
          {expert.skills.map((skill, i) => (
            <SkillTag key={i}>{skill}</SkillTag>
          ))}
        </TagRow>
      </Section>

      {/* REVIEWS */}
      <Section>
        <SectionTitle>Rating & Reviews</SectionTitle>
        {expert.reviewsList.map((rev, i) => (
          <ReviewBlock key={i}>
            <ReviewName>{rev.name}</ReviewName>
            <ReviewText>{rev.text}</ReviewText>
          </ReviewBlock>
        ))}
      </Section>
    </PageWrap>
  );
};

export default ExpertProfilePage;
