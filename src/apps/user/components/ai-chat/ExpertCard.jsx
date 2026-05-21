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
  OnlineStatus,
  CardButtons,
  ViewProfileButton,
} from './chat.styles';

const formatRating = (expert) => {
  const rating = Number(expert.avg_rating ?? expert.rating);
  return Number.isFinite(rating) && rating > 0 ? rating.toFixed(1) : 'New';
};

const formatPrice = (expert) => {
  const price = expert.chat_per_minute ?? expert.call_per_minute ?? expert.price_per_minute;
  return price ? `Rs ${price}/min` : 'Price on profile';
};

const ExpertCard = ({ expert, onViewProfile }) => {
  const isOnline = Boolean(expert.is_online ?? expert.online ?? expert.status === 'online');

  return (
    <ExpertCardContainer>
      <ExpertCardInner>
        <ExpertAvatar
          src={expert.profile_photo || expert.photo || expert.avatar || '/default-avatar.png'}
          alt={expert.name || 'Expert'}
        />

        <ExpertInfo>
          <ExpertName>{expert.name || expert.full_name || 'Verified Expert'}</ExpertName>

          <ExpertExpertise>
            {expert.subcategory_name || expert.category_name || expert.specialization || 'Expert consultation'}
          </ExpertExpertise>

          <ExpertMeta>
            <ExpertRating>Rating {formatRating(expert)}</ExpertRating>
            <ExpertPrice>{formatPrice(expert)}</ExpertPrice>
          </ExpertMeta>

          {isOnline && <OnlineStatus>Online now</OnlineStatus>}
        </ExpertInfo>
      </ExpertCardInner>

      <CardButtons>
        <ViewProfileButton type="button" onClick={onViewProfile}>
          View Profile
        </ViewProfileButton>
      </CardButtons>
    </ExpertCardContainer>
  );
};

export default ExpertCard;
