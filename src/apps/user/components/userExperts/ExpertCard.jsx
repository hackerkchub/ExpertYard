// src/apps/user/components/userExperts/ExpertCard.jsx
import React from "react";
import {
  Card,
  CardHeader,
  AvatarWrap,
  AvatarImg,
  StatusDot,
  Badge,
  NameRow,
  Name,
  Role,
  MetaRow,
  MetaItem,
  RatingStar,
  LangRow,
  LangChip,
  PriceRow,
  PriceTag,
  PriceLabel,
  ActionRow,
  PrimaryBtn,
  GhostBtn,
} from "./ExpertCard.styles";

export default function ExpertCard({ data, mode }) {
  const {
    name,
    role,
    img,
    rating,
    reviews,
    experienceYears,
    languages = [],
    callPrice,
    chatPrice,
    online,
    isAI,
  } = data;

  const showCall = mode === "call" && !isAI;
  const showChat = mode === "chat" || isAI;

  const mainPrice = isAI ? chatPrice : mode === "call" ? callPrice : chatPrice;

  return (
    <Card>
      <CardHeader>
        <AvatarWrap $isAI={isAI}>
          <AvatarImg src={img} alt={name} />
          <StatusDot $online={online || isAI} />
        </AvatarWrap>

        <div>
          <NameRow>
            <Name>{name}</Name>
            {isAI && <Badge>AI</Badge>}
          </NameRow>
          <Role>{role}</Role>

          <MetaRow>
            <MetaItem>
              <RatingStar>★</RatingStar> {rating} ({reviews})
            </MetaItem>
            {!isAI && <MetaItem>{experienceYears}+ yrs exp.</MetaItem>}
          </MetaRow>
        </div>
      </CardHeader>

      <LangRow>
        {languages.slice(0, 3).map((lng) => (
          <LangChip key={lng}>{lng}</LangChip>
        ))}
      </LangRow>

      <PriceRow>
        {mainPrice && (
          <div>
            <PriceLabel>
              {isAI ? "AI chat" : mode === "call" ? "Call" : "Chat"} price
            </PriceLabel>
            <PriceTag>₹ {mainPrice}/min</PriceTag>
          </div>
        )}

        {!isAI && showCall && chatPrice && (
          <div>
            <PriceLabel>Chat</PriceLabel>
            <PriceTag>₹ {chatPrice}/min</PriceTag>
          </div>
        )}

        {!isAI && showChat && callPrice && (
          <div>
            <PriceLabel>Call</PriceLabel>
            <PriceTag>₹ {callPrice}/min</PriceTag>
          </div>
        )}
      </PriceRow>

      <ActionRow>
        {showCall && (
          <PrimaryBtn type="button">
            📞 Start Call
          </PrimaryBtn>
        )}

        {showChat && (
          <PrimaryBtn type="button">
            💬 Start Chat
          </PrimaryBtn>
        )}

        {!isAI && (
          <GhostBtn type="button">
            View Profile
          </GhostBtn>
        )}
      </ActionRow>
    </Card>
  );
}
