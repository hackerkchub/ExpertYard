// components/ai-chat/ExpertRecommendationCards.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ExpertCard from './ExpertCard';
import {
  ExpertsContainer,
  ExpertsTitle,
} from './chat.styles';

const ExpertRecommendationCards = ({ experts }) => {
  const navigate = useNavigate();

  if (!experts?.length) return null;

  return (
    <ExpertsContainer>
      <ExpertsTitle>✨ Recommended Experts</ExpertsTitle>

      {experts.map((expert) => (
        <ExpertCard
          key={expert.id}
          expert={expert}
          onViewProfile={() =>
            navigate(`/user/experts/${expert.slug}`)
          }
        />
      ))}
    </ExpertsContainer>
  );
};

export default ExpertRecommendationCards;