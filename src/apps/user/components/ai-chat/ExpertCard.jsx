// components/ai-chat/ExpertCard.jsx
import React from 'react';
import {
  ExpertCardContainer,
  ExpertCardInner,
  ExpertAvatar,
  ExpertInfo,
  ExpertName,
  ExpertExpertise,
  ExpertMeta,
  ExpertRating,
  ExpertPrice,
  CardButtons,
  ViewProfileButton,
} from './chat.styles';

const ExpertCard = ({ expert, onViewProfile }) => {
  return (
    <ExpertCardContainer>
      <ExpertCardInner>
        <ExpertAvatar
          src={expert.profile_photo || '/default-avatar.png'}
          alt={expert.name}
        />

        <ExpertInfo>
          <ExpertName>{expert.name}</ExpertName>

          <ExpertExpertise>
            {expert.subcategory_name || expert.category_name || 'Astrologer'}
          </ExpertExpertise>

          <ExpertMeta>
            <ExpertRating>
              ⭐ {expert.avg_rating > 0 ? expert.avg_rating.toFixed(1) : 'New'}
            </ExpertRating>

            <span>•</span>

            <ExpertPrice>
              ₹{expert.call_per_minute}/min
            </ExpertPrice>
          </ExpertMeta>
        </ExpertInfo>
      </ExpertCardInner>

      <CardButtons>
        <ViewProfileButton onClick={onViewProfile}>
          View Profile
        </ViewProfileButton>
      </CardButtons>
    </ExpertCardContainer>
  );
};

export default ExpertCard;