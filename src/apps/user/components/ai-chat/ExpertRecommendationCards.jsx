import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useChatStore from '../../stores/chatStore';
import ExpertCard from './ExpertCard';
import {
  ExpertsContainer,
  ExpertsTitle,
  SkeletonCard,
  SkeletonLine,
  SkeletonAvatar,
} from './chat.styles';

const getExpertRouteId = (expert) =>
  expert?.slug || expert?.expert_id || expert?.id || expert?.user_id;

export const ExpertCardsSkeleton = () => (
  <ExpertsContainer aria-label="Loading expert recommendations">
    {[0, 1, 2].map((item) => (
      <SkeletonCard key={item}>
        <SkeletonAvatar />
        <div>
          <SkeletonLine $width="70%" />
          <SkeletonLine $width="88%" />
          <SkeletonLine $width="52%" />
        </div>
      </SkeletonCard>
    ))}
  </ExpertsContainer>
);

const ExpertRecommendationCards = ({ experts }) => {
  const navigate = useNavigate();
  const closeChat = useChatStore((state) => state.closeChat);

  const handleViewProfile = useCallback(
    (expert) => {
      const routeId = getExpertRouteId(expert);
      if (!routeId) return;
      closeChat();
      navigate(`/user/experts/${routeId}`);
    },
    [closeChat, navigate]
  );

  if (!experts?.length) return null;

  return (
    <ExpertsContainer>
      <ExpertsTitle>Recommended Experts</ExpertsTitle>

      {experts.map((expert) => (
        <ExpertCard
          key={getExpertRouteId(expert)}
          expert={expert}
          onViewProfile={() => handleViewProfile(expert)}
        />
      ))}
    </ExpertsContainer>
  );
};

export default ExpertRecommendationCards;
